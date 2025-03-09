<template>
  <q-page>
    <my-title title="主診斷代碼排除組別（附表7.1.4.1）" no-fixed></my-title>
    <div class="p-2">
      <my-search-area grid-cols="3" v-on:search-submit="searchSubmit" v-on:search-clear="searchClear">
        <my-input-wrapper label="主診斷代碼排除組別">
          <q-input v-bind="QInputProps" v-model="search.MainExclude" @keydown.enter="searchSubmit"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="主診斷代碼"
          ><q-input v-bind="QInputProps" v-model="search.Main" @keydown.enter="searchSubmit"></q-input
        ></my-input-wrapper>
        <my-input-wrapper label="主診斷英文名稱">
          <q-input v-bind="QInputProps" v-model="search.MainName" @keydown.enter="searchSubmit"></q-input>
        </my-input-wrapper>
      </my-search-area>
      <q-table
        class="mt-2"
        v-bind="QTableProps"
        :rows="rows"
        :columns="columns"
        row-key="twdrgid"
        :pagination="pagination"
        :loading="tableLoading"
      >
        <template v-slot:bottom>
          <my-pagination
            class="mx-auto p-4"
            v-model="pagination"
            v-on:update:model-value="GetIcd10Pcs7141"
          ></my-pagination>
        </template>
      </q-table>
    </div>
  </q-page>
</template>
<script setup>
import { getIcd10Pcs7141 } from 'api'
import { ref, reactive, computed } from 'vue'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { cloneDeep } from 'lodash-es'
import { useQuasar } from 'quasar'
import { QInputProps, QTableProps } from 'utils/quasar-extends/base-props.js'

const $q = useQuasar()

const columns = [
  { name: 'MainExclude', label: '主診斷代碼排除組別', field: 'MainExclude', align: 'left' },
  { name: 'Main', label: '主診斷代碼', field: 'Main', align: 'left' },
  { name: 'MainName', label: '主診斷英文名稱', field: 'MainName', align: 'left' },
]

const tableLoading = ref(false)
const rows = ref([])
const GetIcd10Pcs7141 = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getIcd10Pcs7141(query)
    if (res.status === 200) {
      rows.value = res.data.Items
      pagination.value.rowsNumber = res.data.Count
    }
  } catch (err) {
    console.log(err)
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
  Main: null,
  MainExclude: null,
  MainName: null,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  return Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'Main':
          case 'MainExclude':
          case 'MainName':
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
  GetIcd10Pcs7141()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetIcd10Pcs7141()
}

const init = async () => {
  GetIcd10Pcs7141()
}
init()
</script>

