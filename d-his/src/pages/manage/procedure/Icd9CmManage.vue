<template>
  <q-page>
    <my-title title="ICD-9-CM 查詢" no-fixed></my-title>

    <div class="px-2">
      <my-search-area class="mt-2" grid-cols="1" v-on:search-submit="searchSubmit" v-on:search-clear="searchClear">
        <my-input-wrapper label="ICD-9 碼">
          <q-input v-bind="QInputProps" v-model="search.Icd9" @keydown.enter="searchSubmit"></q-input
        ></my-input-wrapper>
      </my-search-area>
      <q-table
        class="mt-2"
        v-bind="QTableProps"
        :rows="rows"
        :columns="columns"
        row-key="Icd9"
        :pagination="pagination"
        :loading="tableLoading"
      >
        <template v-slot:bottom>
          <my-pagination class="mx-auto p-4" v-model="pagination" v-on:update:model-value="GetIcd9Cm"></my-pagination>
        </template>
      </q-table>
    </div>
  </q-page>
</template>
<script setup>
import { getIcd9Cm } from 'api'
import { ref, reactive, computed } from 'vue'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { cloneDeep } from 'lodash-es'
import { useQuasar } from 'quasar'
import { QInputProps, QTableProps } from 'utils/quasar-extends/base-props.js'

const $q = useQuasar()

const columns = [
  { name: 'Icd9', label: 'ICD-9 碼', field: 'Icd9', align: 'left' },
  { name: 'Icd9Cht', label: 'ICD-9 中文名稱', field: 'Icd9Cht', align: 'left' },
  { name: 'Icd9Eng', label: 'ICD-9 英文名稱', field: 'Icd9Eng', align: 'left' },
]

const tableLoading = ref(false)
const rows = ref([])
const GetIcd9Cm = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getIcd9Cm(query)
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
  Icd9: null,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  return Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'Icd9':
            return filterArray.concat(setOdataFilter({ key, value, operator: 'contains' }))
          default:
            return filterArray
        }
      } else {
        return filterArray
      }
    }, [])
    .join(' and ')
})

const sortBy = ref([])
const orderBy = computed(() => {
  return sortBy.value.map((item) => item.join(' ')).join(',')
})

const searchSubmit = () => {
  pagination.value.page = 1
  GetIcd9Cm()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetIcd9Cm()
}

const init = async () => {
  GetIcd9Cm()
}
init()
</script>

