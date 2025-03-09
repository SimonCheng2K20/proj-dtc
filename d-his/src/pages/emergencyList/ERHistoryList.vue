<template>
  <q-page>
    <my-title title="急診歷史病患清單"></my-title>
    <div class="p-2">
      <my-search-area grid-cols="4" v-on:search-submit="searchSubmit" v-on:search-clear="searchClear">
        <my-input-wrapper label="看診日期" range-input>
          <template #range-input-0>
            <my-date-input
              v-bind="QInputProps"
              v-model="search.CreateDatetimeStart"
              @keydown.enter="searchSubmit"
              @date-select="searchSubmit"
            ></my-date-input>
          </template>
          <template #range-input-1>
            <my-date-input
              v-bind="QInputProps"
              v-model="search.CreateDatetimeEnd"
              @keydown.enter="searchSubmit"
              @date-select="searchSubmit"
            ></my-date-input>
          </template>
        </my-input-wrapper>
        <my-input-wrapper label="病歷號碼"
          ><q-input v-bind="QInputProps" v-model="search.PatientId" @keydown.enter="searchSubmit"></q-input
        ></my-input-wrapper>
        <my-input-wrapper label="身分證號"
          ><q-input
            v-bind="QInputProps"
            v-model="search['RoomBooking/Patient/PersonId']"
            @keydown.enter="searchSubmit"
          ></q-input
        ></my-input-wrapper>
        <my-input-wrapper label="病患姓名"
          ><q-input
            v-bind="QInputProps"
            v-model="search['RoomBooking/Patient/Person/Name']"
            @keydown.enter="searchSubmit"
          ></q-input
        ></my-input-wrapper>
        <my-input-wrapper label="病人動向">
          <q-select
            v-bind="QSelectProps"
            v-model="search['RoomBooking/ErTrend']"
            :options="optionErTrend"
            option-label="Name"
            option-value="No"
            map-options
            emit-value
            @update:model-value="searchSubmit"
          >
          </q-select>
        </my-input-wrapper>
        <my-input-wrapper label="後續處理">
          <q-select
            v-bind="QSelectProps"
            v-model="search['RoomBooking/ErAfterProcess']"
            :options="optionErAfterProcess"
            option-label="Name"
            option-value="No"
            map-options
            emit-value
            @update:model-value="searchSubmit"
          >
          </q-select>
        </my-input-wrapper>
      </my-search-area>

      <ERPatientTable :rows="rows" :columns="columns">
        <my-pagination class="mx-auto p-4" v-model="pagination" v-on:update:model-value="GetERHistory"></my-pagination>
      </ERPatientTable>
    </div>
  </q-page>
</template>
<script setup>
import { getERHistory, getPatientERStatus, getAfterERTreatment } from 'api'
import { ref, reactive, computed } from 'vue'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { cloneDeep } from 'lodash-es'
import { useQuasar } from 'quasar'
import { QInputProps, QSelectProps, QTableProps } from 'utils/quasar-extends/base-props.js'
import { genderCodeItems } from 'utils/options.js'
import dayjs from 'dayjs'

import ERPatientTable from './ERPatientTable.vue'

const $q = useQuasar()

const columns = [
  'editRecord',
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
  'ErStatus',
  'ErTrend',
  'ErAfterProcess',
  'startMeeting',
]

const tableLoading = ref(false)
const rows = ref([])
const GetERHistory = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getERHistory(query)
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
  CreateDatetimeStart: null,
  CreateDatetimeEnd: null,
  PatientId: null,
  'RoomBooking/Patient/PersonId': null,
  'RoomBooking/Patient/Person/Name': null,
  'RoomBooking/ErTrend': null,
  'RoomBooking/ErAfterProcess': null,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  return Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'CreateDatetimeStart':
            return filterArray.concat(
              setOdataFilter({
                key: 'CreateDatetime',
                value: encodeURIComponent(dayjs(value).format()),
                operator: 'ge',
              })
            )
          case 'CreateDatetimeEnd':
            return filterArray.concat(
              setOdataFilter({
                key: 'CreateDatetime',
                value: encodeURIComponent(dayjs(value).add(1, 'day').format()),
                operator: 'lt',
              })
            )
          case 'RoomBooking/ErTrend':
          case 'RoomBooking/ErAfterProcess':
            return filterArray.concat(setOdataFilter({ key, value, operator: 'eq' }))
          case 'PatientId':
          case 'RoomBooking/Patient/PersonId':
          case 'RoomBooking/Patient/Person/Name':
            return filterArray.concat(setOdataFilter({ key, value, operator: 'contains' }))
        }
      } else {
        return filterArray
      }
    }, [])
    .join(' and ')
})

const sortBy = ref([['CreateDatetime', 'desc']])
const orderBy = computed(() => {
  return sortBy.value.map((item) => item.join(' ')).join(',')
})

const searchSubmit = () => {
  pagination.value.page = 1
  GetERHistory()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetERHistory()
}
const optionErTrend = ref([])
const GetErTrend = async () => {
  try {
    const res = await getPatientERStatus()
    optionErTrend.value = res.data
  } catch (err) {
    console.log(`err > GetErTrend: `, err)
  }
}

const optionErAfterProcess = ref([])
const GetErAfterProcess = async () => {
  try {
    const res = await getAfterERTreatment()
    optionErAfterProcess.value = res.data
  } catch (err) {
    console.log(`err > GetErAfterProcess: `, err)
  }
}

const init = () => {
  GetERHistory()
  GetErTrend()
  GetErAfterProcess()
}
init()
</script>

