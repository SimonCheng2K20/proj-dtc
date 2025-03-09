<template>
  <q-page>
    <my-title title="論病例計酬 DRG 碼" no-fixed></my-title>
    <div class="p-2">
      <my-search-area grid-cols="3" v-on:search-submit="searchSubmit" v-on:search-clear="searchClear">
        <my-input-wrapper label="科別">
          <q-input v-bind="QInputProps" v-model="search.NhiSect" @keydown.enter="searchSubmit"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="DRG參考碼">
          <q-input v-bind="QInputProps" v-model="search.Drg" @keydown.enter="searchSubmit"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="支付標準編碼">
          <q-input v-bind="QInputProps" v-model="search.NhiCode" @keydown.enter="searchSubmit"></q-input>
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
          <my-pagination class="mx-auto p-4" v-model="pagination" v-on:update:model-value="GetDrgProcedureNhi">
          </my-pagination>
        </template>
      </q-table>
    </div>
  </q-page>
</template>
<script setup>
import { getDrgProcedureNhi } from 'api'
import { ref, reactive, computed } from 'vue'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { cloneDeep } from 'lodash-es'
import { useQuasar } from 'quasar'
import { QInputProps, QTableProps } from 'utils/quasar-extends/base-props.js'
import numberFormat from 'utils/numberFormat'

const $q = useQuasar()

const columns = [
  { name: 'NhiSectName', label: '科別', field: 'NhiSectName', align: 'left' },
  { name: 'ProcedureCname', label: '項目', field: 'ProcedureCname', align: 'left' },
  { name: 'NhiCode', label: '支付標準編碼', field: 'NhiCode', align: 'left' },
  { name: 'AfterNhiPoint', label: '點數', field: (row) => numberFormat(row.AfterNhiPoint), align: 'right' },
  { name: 'UpperLimitPoint', label: '上限金額', field: (row) => numberFormat(row.UpperLimitPoint), align: 'right' },
  { name: 'VerifyRate', label: '核實率', field: (row) => numberFormat(row.VerifyRate), align: 'right' },
  { name: 'BasicRate', label: '基本率', field: (row) => numberFormat(row.BasicRate), align: 'right' },
  { name: 'Drg', label: 'DRG參考碼', field: 'Drg', align: 'left' },
  { name: 'StartDate', label: '起日', field: (row) => row.StartDate.substring(0, 10), align: 'left' },
  { name: 'EndDate', label: '迄日', field: (row) => row.EndDate.substring(0, 10), align: 'left' },
  { name: 'EffectiveDate', label: '實施日期', field: (row) => row.EffectiveDate.substring(0, 10), align: 'left' },
]

const tableLoading = ref(false)
const rows = ref([])
const GetDrgProcedureNhi = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      drg: '1A',
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getDrgProcedureNhi(query)
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
  NhiSect: null,
  Drg: null,
  NhiCode: null,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  return Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'NhiSect':
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
  GetDrgProcedureNhi()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetDrgProcedureNhi()
}

const init = async () => {
  GetDrgProcedureNhi()
}
init()
</script>

