import { replace, get } from 'lodash-es'
import { ref, computed, isRef } from 'vue'

export const useFilter = ({ items: itemsMaybeRef, filterKeys: filterKeysMaybeRef }, callback) => {
  const filterString = ref('')
  const filterItems = computed(() => {
    const items = isRef(itemsMaybeRef) ? itemsMaybeRef.value : itemsMaybeRef
    const filterKeys = isRef(filterKeysMaybeRef) ? filterKeysMaybeRef.value : filterKeysMaybeRef
    return items
      .filter((item) => {
        for (const key of filterKeys) {
          if (get(item, key).toLocaleUpperCase().includes(filterString.value.toLocaleUpperCase())) return true
        }

        return false
      })
      .map((item) => {
        const regex = new RegExp(filterString.value, 'gi')

        const filterLabel = filterKeys
          .map((key) => {
            if (!filterString.value) {
              return get(item, key)
            } else {
              return replace(get(item, key), regex, (match) => {
                return '<span class="bg-amber-300">' + match + '</span>'
              })
            }
          })
          .filter((item) => !!item)
          .join(' - ')

        return { ...item, filterLabel }
      })
  })

  const filterHandler = (val, update) => {
    update(
      () => {
        filterString.value = val
        callback()
      },
      (ref) => {
        ref.moveOptionSelection(1, true)
      }
    )
  }

  return { filterItems, filterHandler }
}

