<template>
  <q-page class="p-2">
    <my-title title="稽核紀錄"></my-title>

    <my-search-area grid-cols="4" @searchSubmit="searchSubmit" @searchClear="searchClear">
      <my-input-wrapper class="col-span-2" label="日期" range-input>
        <template #range-input-0>
          <my-date-input
            v-bind="QInputProps"
            v-model="search.CreateTimeStart"
            @keydown.enter="searchSubmit"
            @date-select="searchSubmit"
          ></my-date-input>
        </template>
        <template #range-input-1>
          <my-date-input
            v-bind="QInputProps"
            v-model="search.CreateTimeEnd"
            @keydown.enter="searchSubmit"
            @date-select="searchSubmit"
          ></my-date-input>
        </template>
      </my-input-wrapper>
      <my-input-wrapper label="記錄類型">
        <q-select
          v-bind="QSelectProps"
          v-model="search.Type"
          :options="auditEventTypes"
          optionLabel="Name"
          optionValue="Id"
          emit-value
          map-options
          @update:model-value="searchSubmit"
        ></q-select>
      </my-input-wrapper>
      <my-input-wrapper label="使用者代碼">
        <q-input v-bind="QInputProps" v-model="search.AccountNo" @keydown.enter="searchSubmit"></q-input>
      </my-input-wrapper>
      <my-input-wrapper label="執行動作">
        <q-input v-bind="QInputProps" v-model="search.ProcessStack" @keydown.enter="searchSubmit"></q-input>
      </my-input-wrapper>
      <my-input-wrapper label="資料主代碼">
        <q-input v-bind="QInputProps" v-model="search.DataKey" @keydown.enter="searchSubmit"></q-input>
      </my-input-wrapper>
    </my-search-area>

    <q-table
      class="mt-2"
      v-bind="QTableProps"
      :rows="rows"
      :columns="columns"
      row-key="Id"
      :pagination="pagination"
      :tableLoading="tableLoading"
    >
      <template v-slot:bottom>
        <my-pagination class="mx-auto p-4" v-model="pagination" v-on:update:model-value="GetAuditEvent"></my-pagination>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { getAuditEvent, getAuditEventTypes } from 'api'
import { cloneDeep } from 'lodash-es'
import dayjs from 'dayjs'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { QSelectProps, QInputProps, QTableProps } from 'utils/quasar-extends/base-props.js'

const columns = [
  {
    name: 'CreateTime',
    label: '記錄時間',
    field: (row) => dayjs(row.CreateTime).format('YYYY-MM-DD HH:mm:ss'),
    align: 'left',
  },
  {
    name: 'Type',
    label: '記錄類型',
    field: (row) => auditEventTypes.value.find((item) => row.Type === item.Id)?.Name,
    align: 'left',
  },
  {
    name: 'Account',
    label: '使用者',
    field: (row) => `${row.AccountNo || ''} - ${row.AccountName || ''}`,
    align: 'left',
  },
  { name: 'HostAddress', label: '用戶端IP', field: 'HostAddress', align: 'left' },
  { name: 'ProcessStack', label: '執行動作', field: 'ProcessStack', align: 'left' },
  { name: 'DataKey', label: '資料主代碼', field: 'DataKey', align: 'left' },
]

const tableLoading = ref(false)
const rows = ref([])
const GetAuditEvent = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getAuditEvent(query)
    rows.value = res.data.Items
    pagination.value.rowsNumber = res.data.Count
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
  CreateTimeStart: null,
  CreateTimeEnd: null,
  Type: null,
  AccountNo: null,
  ProcessStack: null,
  DataKey: null,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  const str = Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'CreateTimeStart':
            return filterArray.concat(
              setOdataFilter({
                key: 'CreateTime',
                value: encodeURIComponent(dayjs(value).format()),
                operator: 'ge',
              })
            )
          case 'CreateTimeEnd':
            return filterArray.concat(
              setOdataFilter({
                key: 'CreateTime',
                value: encodeURIComponent(dayjs(value).add(1, 'day').format()),
                operator: 'lt',
              })
            )
          case 'Type':
            return filterArray.concat(setOdataFilter({ key, value, operator: 'eq' }))
          case 'AccountNo':
          case 'ProcessStack':
          case 'DataKey':
            return filterArray.concat(setOdataFilter({ key, value, operator: 'contains' }))
          default:
            return filterArray
        }
      } else {
        return filterArray
      }
    }, [])
    .join(' and ')

  return str
})

const sortBy = ref([['CreateTime', 'desc']])
const orderBy = computed(() => {
  return sortBy.value.map((item) => item.join(' ')).join(',')
})

const searchSubmit = () => {
  pagination.value.page = 1
  GetAuditEvent()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetAuditEvent()
}

const auditEventTypes = ref([])
const GetAuditEventTypes = async () => {
  try {
    const res = await getAuditEventTypes()
    auditEventTypes.value = res.data
  } catch (err) {
    console.log(err)
  }
}

const init = async () => {
  GetAuditEventTypes()
  GetAuditEvent()
}
init()
</script>

