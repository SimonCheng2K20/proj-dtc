<template>
  <q-page>
    <my-title title="Tw-DRGs4.0虛擬碼" no-fixed></my-title>
    <div class="p-2">
      <my-search-area grid-cols="3" v-on:search-submit="searchSubmit" v-on:search-clear="searchClear">
        <my-input-wrapper label="虛擬碼"><q-input v-bind="QInputProps" v-model="search.PcsvCode" @keydown.enter="searchSubmit"></q-input></my-input-wrapper>
        <my-input-wrapper label="虛擬碼中文"><q-input v-bind="QInputProps" v-model="search.CName" @keydown.enter="searchSubmit"></q-input></my-input-wrapper>
        <my-input-wrapper label="虛擬碼英文"> <q-input v-bind="QInputProps" v-model="search.EName" @keydown.enter="searchSubmit"></q-input></my-input-wrapper>
      </my-search-area>
      <q-table class="mt-2" v-bind="QTableProps" :rows="rows" :columns="columns" row-key="Mdc" :pagination="pagination" :loading="tableLoading">
        <template #body-cell-index="{ col, rowIndex }">
          <q-td :props="{ col }">
            {{ rowIndex + 1 }}
          </q-td>
        </template>
        <template #bottom> <my-pagination class="mx-auto p-4" v-model="pagination" v-on:update:model-value="GetIcd10Pcsv"></my-pagination> </template>
      </q-table>
    </div>
  </q-page>
</template>
<script setup>
import { getIcd10Pcsv } from 'api'
import { ref, reactive, computed } from 'vue'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { cloneDeep } from 'lodash-es'
import { useQuasar } from 'quasar'
import { QInputProps, QTableProps } from 'utils/quasar-extends/base-props.js'

const $q = useQuasar()

const columns = [
  { name: 'index', label: '序號', field: 'index', align: 'center', headerClasses: 'min-w-[60px]' },
  { name: 'PcsvCode', label: '虛擬碼', field: 'PcsvCode', align: 'left', headerClasses: 'min-w-[60px]' },
  { name: 'CName', label: '虛擬碼中文', field: 'CName', align: 'left', headerClasses: 'min-w-[60px]' },
  { name: 'EName', label: '虛擬碼英文', field: 'EName', align: 'left', headerClasses: 'min-w-[60px]' },
  { name: 'ApplySituation', label: '適用情境', field: 'ApplySituation', align: 'left', headerClasses: 'min-w-[60px]' },
]

const tableLoading = ref(false)
const rows = ref([])
const GetIcd10Pcsv = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getIcd10Pcsv(query)
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
  PcsvCode: null,
  CName: null,
  EName: null,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  return Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'PcsvCode':
          case 'CName':
          case 'EName':
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
  GetIcd10Pcsv()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetIcd10Pcsv()
}

const init = async () => {
  GetIcd10Pcsv()
}
init()
</script>

