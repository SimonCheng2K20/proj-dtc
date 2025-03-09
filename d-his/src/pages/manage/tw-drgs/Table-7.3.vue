<template>
  <q-page>
    <my-title title="Tw-DRGs權重表（附表7.3）" no-fixed></my-title>
    <div class="p-2">
      <my-search-area grid-cols="2" v-on:search-submit="searchSubmit" v-on:search-clear="searchClear">
        <my-input-wrapper label="MDC">
          <q-select v-bind="QSelectProps" v-model="search.Mdc" :options="mdcItems" @update:model-value="searchSubmit"></q-select>
        </my-input-wrapper>
        <my-input-wrapper label="DRG"> <q-input v-bind="QInputProps" v-model="search.Drg" @keydown.enter="searchSubmit"></q-input></my-input-wrapper>
      </my-search-area>
      <q-table class="mt-2" v-bind="QTableProps" :rows="rows" :columns="columns" row-key="twdrgid" :pagination="pagination" :loading="tableLoading">
        <template #header-cell-Drg="{ col }">
          <sortable-header :col="col" v-model:sortBy="sortBy" @update:sortBy="GetIcd10Pcs73"></sortable-header>
        </template>
        <template v-slot:bottom> <my-pagination class="mx-auto p-4" v-model="pagination" v-on:update:model-value="GetIcd10Pcs73"></my-pagination> </template>
      </q-table>
    </div>
  </q-page>
</template>
<script setup>
import { getIcd10Pcs73 } from 'api'
import { ref, reactive, computed } from 'vue'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { cloneDeep, range } from 'lodash-es'
import { useQuasar } from 'quasar'
import { QInputProps, QSelectProps, QTableProps } from 'utils/quasar-extends/base-props.js'
import SortableHeader from 'components/SortableHeader.vue'

const $q = useQuasar()

const columns = [
  { name: 'Mdc', label: 'MDC', field: 'Mdc', align: 'left' },
  { name: 'SerialNo', label: '流水號', field: 'SerialNo', align: 'right' },
  { name: 'Drg', label: 'DRG', field: 'Drg', align: 'left' },
  { name: 'Rw', label: '3.4版權重', field: 'Rw', align: 'right' },
  { name: 'Remark1', label: '個案數<20註記', field: 'Remark1', align: 'right' },
  { name: 'Remark2', label: '邏輯註記', field: 'Remark2', align: 'right' },
  { name: 'InpatientDays', label: '幾何平均', field: 'InpatientDays', align: 'right' },
  { name: 'InpatientDays', label: '住院日', field: 'InpatientDays', align: 'right' },
  { name: 'LowerLimit', label: '下限臨界點', field: 'LowerLimit', align: 'right' },
  { name: 'UpperLimit', label: '上限臨界點', field: 'UpperLimit', align: 'right' },
]

const tableLoading = ref(false)
const rows = ref([])
const GetIcd10Pcs73 = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getIcd10Pcs73(query)
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
  Mdc: null,
  Drg: null,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  return Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'Mdc':
          case 'Drg':
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
  GetIcd10Pcs73()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetIcd10Pcs73()
}

const mdcItems = range(1, 19)
  .concat(range(21, 25))
  .map((i) => 'MDC' + i)
  .concat(['UN', 'PRE'])

const init = async () => {
  GetIcd10Pcs73()
}
init()
</script>

