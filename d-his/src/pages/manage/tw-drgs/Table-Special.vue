<template>
  <q-page>
    <my-title title="不適用 DRGs 案件特殊註記" no-fixed></my-title>
    <div class="p-2">
      <my-search-area grid-cols="1" v-on:search-submit="searchSubmit" v-on:search-clear="searchClear">
        <my-input-wrapper label="DRGs案件特殊註記代碼">
          <q-input v-bind="QInputProps" v-model="search.No" @keydown.enter="searchSubmit"></q-input>
        </my-input-wrapper>
      </my-search-area>
      <q-table
        class="mt-2"
        v-bind="QTableProps"
        :rows="rows"
        :columns="columns"
        row-key="Mdc"
        :pagination="pagination"
        :loading="tableLoading"
      >
        <template #bottom>
          <my-pagination class="mx-auto p-4" v-model="pagination" v-on:update:model-value="GetIcd10Special">
          </my-pagination>
        </template>
      </q-table>
    </div>
  </q-page>
</template>
<script setup>
import { getCommonData } from 'api'
import { ref, reactive, computed } from 'vue'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { cloneDeep } from 'lodash-es'
import { useQuasar } from 'quasar'
import { QInputProps, QTableProps } from 'utils/quasar-extends/base-props.js'

const $q = useQuasar()

const columns = [
  { name: 'No', label: 'DRGs案件特殊註記代碼', field: 'No', align: 'center' },
  { name: 'Text', label: '資料說明', field: 'Text', align: 'left' },
]

const tableLoading = ref(false)
const rows = ref([])
const GetIcd10Special = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getCommonData(query)
    rows.value = res.data.Items
    pagination.value.rowsNumber = res.data.Count
  } catch (error) {
    console.log(error)
  } finally {
    tableLoading.value = false
  }
}

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

const initData = {}
initData.search = {
  No: null,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  const str = Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'No':
            return filterArray.concat(setOdataFilter({ key, value, operator: 'contains' }))
          default:
            return filterArray
        }
      } else {
        return filterArray
      }
    }, [])
    .join(' and ')

  return str ? str + `and Category eq 'NotApplyTwDrgNote'` : `Category eq 'NotApplyTwDrgNote'`
})

const sortBy = ref([])
const orderBy = computed(() => {
  return sortBy.value.map((item) => item.join(' ')).join(',')
})

const searchSubmit = () => {
  pagination.value.page = 1
  GetIcd10Special()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetIcd10Special()
}

const init = async () => {
  GetIcd10Special()
}
init()
</script>

