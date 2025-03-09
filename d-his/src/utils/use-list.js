import { reactive, onUnmounted, computed } from 'vue'
import {
  getEmployeeSelectNoList,
  getDepartmentDropdown,
  getNHIChapDropdown,
  getRelationNhiSectDropdown,
  getRelationNhiItemDropdown,
} from 'api'
import { Subject } from 'rxjs'
import { isArray } from 'lodash-es'

const getListApi = {
  employee: getEmployeeSelectNoList,
  department: getDepartmentDropdown,
  nhiChap: getNHIChapDropdown,
  nhiSect: getRelationNhiSectDropdown,
  nhiItem: getRelationNhiItemDropdown,
}

const allList = reactive({})
const using = reactive({})
const fetchSubjects = {}

// listKeys = ['key', ['key', 'query']]
export const useList = (listKeys, callback) => {
  const getKeyAndQuery = (listKeyMayHaveQuery) => {
    const [key, query = ''] = isArray(listKeyMayHaveQuery) ? listKeyMayHaveQuery : [listKeyMayHaveQuery]
    return {
      key,
      query,
      fullKey: key + query,
    }
  }

  const list = listKeys.reduce((obj, listKeyMayHaveQuery) => {
    const { fullKey } = getKeyAndQuery(listKeyMayHaveQuery)
    obj[fullKey] = computed(() => allList[fullKey] || [])
    return obj
  }, {})

  const checkIsComplete = () => {
    return (
      listKeys.filter((listKeyMayHaveQuery) => {
        const { fullKey } = getKeyAndQuery(listKeyMayHaveQuery)
        return allList[fullKey] === undefined
      }).length === 0
    )
  }

  let isComplete = false
  listKeys.forEach((listKeyMayHaveQuery) => {
    const { key, query, fullKey } = getKeyAndQuery(listKeyMayHaveQuery)
    if (!fetchSubjects[fullKey]) {
      fetchSubjects[fullKey] = new Subject()

      fetchSubjects[fullKey].pipe().subscribe({
        next: async (promise) => {
          await Promise.resolve(promise).then(({ data }) => {
            allList[fullKey] = isArray(data) ? data : data.Items && isArray(data.Items) ? data.Items : []
          })
          if (!isComplete && checkIsComplete()) {
            isComplete = true
            if (typeof callback === 'function') {
              callback()
            }
          }
        },
      })
    }

    if (using[fullKey]) using[fullKey]++
    else using[fullKey] = 1

    if (!allList[fullKey]) {
      fetchSubjects[fullKey].next(getListApi[key](query))
    }
  })

  onUnmounted(() => {
    listKeys.forEach((listKeyMayHaveQuery) => {
      const { fullKey } = getKeyAndQuery(listKeyMayHaveQuery)
      using[fullKey]--

      if (using[fullKey] === 0) {
        allList[fullKey] = undefined
        using[fullKey] = undefined
        fetchSubjects[fullKey].unsubscribe()
        fetchSubjects[fullKey] = undefined
      }
    })
  })

  return list
}

useList.regetList = (listKeys) => {
  listKeys.forEach((listKeyMayHaveQuery) => {
    const { key, query, fullKey } = getKeyAndQuery(listKeyMayHaveQuery)
    if (using[fullKey] && allList[fullKey] && fetchSubjects[fullKey]) {
      fetchSubjects[fullKey].next(getListApi[key](query))
    }
  })
}

