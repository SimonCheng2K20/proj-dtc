<template>
  <q-page class="p-2">
    <my-title title="急診病患清單"></my-title>

    <my-search-area gridCols="3" @searchSubmit="searchSubmit" @searchClear="searchClear">
      <my-input-wrapper label="病患姓名">
        <q-input v-bind="QInputProps" v-model="search.PatientId" @keydown.enter="searchSubmit"></q-input>
      </my-input-wrapper>
      <my-input-wrapper label="身分證號">
        <q-input
          v-bind="QInputProps"
          v-model="search['RoomBooking/Patient/PersonId']"
          @keydown.enter="searchSubmit"
        ></q-input>
      </my-input-wrapper>
      <my-input-wrapper label="病歷號碼">
        <q-input
          v-bind="QInputProps"
          v-model="search['RoomBooking/Patient/Person/Name']"
          @keydown.enter="searchSubmit"
        ></q-input>
      </my-input-wrapper>
    </my-search-area>

    <ERPatientTable :rows="rows" :columns="columns">
      <my-pagination class="mx-auto p-4" v-model="pagination" v-on:update:model-value="GetERList"></my-pagination>
    </ERPatientTable>
  </q-page>
</template>

<script setup>
import { getERList } from 'api'
import { reactive, ref, computed } from 'vue'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { QInputProps, QSelectProps, QTableProps } from 'utils/quasar-extends/base-props.js'
import { useQuasar } from 'quasar'
import { cloneDeep } from 'lodash-es'
import dayjs from 'dayjs'

import ERPatientTable from './ERPatientTable.vue'

const $q = useQuasar()

const columns = [
  'seeDoctor',
  'CreateDatetime',
  'CreateDatetime',
  'PatientId',
  'PersonId',
  'Name',
  'Gender',
  'Birthday',
  'Pacs',
  'Laboratory',
  'DepartmentName',
  'InjuredGradeName',
  'ErStatusName',
  'ErTrendName',
  'ErAfterProcessName',
  'startMeeting',
]
const tableLoading = ref(false)
const rows = ref([])
const GetERList = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getERList(query)
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
  PatientId: null,
  'RoomBooking/Patient/PersonId': null,
  'RoomBooking/Patient/Person/Name': null,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  const str = Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'PatientId':
          case 'RoomBooking/Patient/PersonId':
          case 'RoomBooking/Patient/Person/Name':
            return filterArray.concat(setOdataFilter({ key, value, operator: 'contains' }))
          default:
            return filterArray
        }
      } else {
        return filterArray
      }
    }, [])
    .join(' and ')

  const dateFilter = `BookingDate ge ${encodeURIComponent(
    dayjs().format('YYYY-MM-DD')
  )} and BookingDate lt ${encodeURIComponent(
    dayjs().add(1, 'day').format('YYYY-MM-DD')
  )} and (Attend eq '2' or Attend eq '5')`

  return str ? str + ' and ' + dateFilter : dateFilter
})

const sortBy = ref([['InjuredGrade', 'asc']])
const orderBy = computed(() => {
  return sortBy.value.map((item) => item.join(' ')).join(',')
})

const searchSubmit = () => {
  pagination.value.page = 1
  GetAccount()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetAccount()
}
const init = () => {
  GetERList()
}
init()
</script>

