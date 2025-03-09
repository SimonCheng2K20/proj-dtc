<template>
  <q-page class="p-2">
    <my-title title="門診歷史清單">
      <div>門診歷史清單</div>
      <q-space></q-space>
      <q-btn class="header-btn" label="返回" @click="router.push({ name: 'OpdList' })" dense unelevated></q-btn>
    </my-title>
    <my-search-area grid-cols="4" @search-submit="searchSubmit" @search-clear="searchClear">
      <my-input-wrapper label="看診日期" range-input class="col-span-2">
        <template #range-input-0>
          <my-date-input
            v-bind="QInputProps"
            v-model="search.CreateDatetimeStart"
            @keydown.enter="searchSubmit"
            @date-select="searchSubmit"
          >
          </my-date-input>
        </template>
        <template #range-input-1>
          <my-date-input
            v-bind="QInputProps"
            v-model="search.CreateDatetimeEnd"
            @keydown.enter="searchSubmit"
            @date-select="searchSubmit"
          >
          </my-date-input>
        </template>
      </my-input-wrapper>
      <my-input-wrapper label="看診時段">
        <q-select
          v-bind="QSelectProps"
          v-model="search['RoomBooking/TimeSlotNo']"
          :options="timeSlotItems"
          option-label="label"
          option-value="value"
          map-options
          emit-value
          @update:model-value="searchSubmit"
        >
        </q-select>
      </my-input-wrapper>
      <my-input-wrapper label="病歷號碼">
        <q-input v-bind="QInputProps" v-model="search.PatientId" @keydown.enter="searchSubmit"></q-input>
      </my-input-wrapper>
      <my-input-wrapper label="身分證號">
        <q-input v-bind="QInputProps" v-model="search['RoomBooking/Patient/PersonId']" @keydown.enter="searchSubmit">
        </q-input>
      </my-input-wrapper>
      <my-input-wrapper label="病患姓名">
        <q-input v-bind="QInputProps" v-model="search['RoomBooking/Patient/Person/Name']" @keydown.enter="searchSubmit">
        </q-input>
      </my-input-wrapper>
    </my-search-area>
    <q-table
      class="mt-2"
      v-bind="QTableProps"
      :rows="rows"
      :columns="columns"
      row-key="OpdId"
      :pagination="pagination"
      :loading="tableLoading"
    >
      <template v-slot:body-cell-action="{ col, row }">
        <q-td :props="{ col }">
          <q-btn class="mr-1" color="edit" @click="toEdit(row)" label="編輯" unelevated dense></q-btn>
          <!-- <q-btn color="delete" @click="toDelete(row)" label="刪除" unelevated dense></q-btn> -->
        </q-td>
      </template>
      <template v-slot:bottom>
        <my-pagination class="mx-auto p-4" v-model="pagination" @update:model-value="onPageChange"></my-pagination>
      </template>
    </q-table>
  </q-page>
</template>
<script setup>
import { getHistoryList } from 'api'
import { ref, reactive, computed } from 'vue'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { cloneDeep } from 'lodash-es'
import { useQuasar } from 'quasar'
import { QSelectProps, QInputProps, QTableProps } from 'utils/quasar-extends/base-props.js'
import { useRoute, useRouter } from 'vue-router'
import { timeSlotItems } from 'utils/options.js'
import dayjs from 'dayjs'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()

const columns = [
  { name: 'action', label: '操作', field: 'action', align: 'center' },
  { name: 'CreateDatetime', label: '看診日期', field: (row) => row.CreateDatetime?.substring(0, 10), align: 'left' },
  { name: 'TimeSlotName', label: '看診時段', field: 'TimeSlotName', align: 'left' },
  { name: 'DepartmentName', label: '科別', field: 'DepartmentName', align: 'left' },
  { name: 'PatientId', label: '病歷號', field: 'PatientId', align: 'left' },
  { name: 'PersonId', label: '身分證號', field: 'PersonId', align: 'left' },
  { name: 'Name', label: '病患姓名', field: 'Name', align: 'left' },
  { name: 'Gender', label: '性別', field: 'Gender', align: 'left' },
  { name: 'BirthDate', label: '生日', field: (row) => row.Birthday?.substring(0, 10), align: 'left' },
  { name: 'IdentityName', label: '健保身分', field: 'IdentityName', align: 'left' },
  {
    name: 'OpdDiagnoses',
    label: '疾病碼',
    field: (row) => row.OpdDiagnoses.map((d) => d.Icd10Code).toString(),
    align: 'left',
  },
  { name: 'AttendName', label: '狀態', field: 'AttendName', align: 'left' },
]

const tableLoading = ref(false)
const rows = ref([])
const GetHistoryList = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getHistoryList(query)
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
  CreateDatetimeStart: null,
  CreateDatetimeEnd: null,
  'RoomBooking/TimeSlotNo': null,
  PatientId: null,
  'RoomBooking/Patient/PersonId': null,
  'RoomBooking/Patient/Person/Name': null,
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
          case 'RoomBooking/TimeSlotNo':
            return filterArray.concat(setOdataFilter({ key, value, operator: 'eq' }))
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
})

const sortBy = ref([['CreateDatetime', 'desc']])
const orderBy = computed(() => {
  return sortBy.value.map((item) => item.join(' ')).join(',')
})

const searchSubmit = () => {
  pagination.value.page = 1
  GetHistoryList()
  setQueryFromData()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetHistoryList()
  setQueryFromData()
}

const onPageChange = () => {
  GetHistoryList()
  setQueryFromData()
}

const toEdit = (row) => {
  router.push({
    name: 'OpdRecord-Detail',
    params: { opdId: row.OpdId },
    query: { history: true, backpath: route.fullPath },
  })
}

const setQueryFromData = () => {
  router.replace({
    query: {
      ...search,
      page: pagination.value.page,
      rowsPerPage: pagination.value.rowsPerPage,
    },
  })
}

const setDataFromQuery = () => {
  if (route.query.page) pagination.value.page = Number(route.query.page)
  if (route.query.rowsPerPage) pagination.value.rowsPerPage = Number(route.query.rowsPerPage)
  Object.keys(search).forEach((key) => {
    if (route.query[key]) search[key] = route.query[key]
  })
}

const init = async () => {
  setDataFromQuery()

  GetHistoryList()
}
init()
</script>

