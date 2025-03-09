<template>
  <q-dialog ref="dialogRef" full-width no-backdrop-dismiss>
    <my-dialog-content header="掛號查詢" width="1280px" @close="onDialogCancel">
      <my-search-area grid-cols="4" @search-submit="searchSubmit" @search-clear="searchClear">
        <my-input-wrapper label="掛號日期" range-input class="col-span-2">
          <template #range-input-0>
            <my-date-input
              v-bind="QInputProps"
              v-model="search.StartDate"
              @keydown.enter="searchSubmit"
              @date-select="searchSubmit"
            ></my-date-input>
          </template>
          <template #range-input-1>
            <my-date-input
              v-bind="QInputProps"
              v-model="search.EndDate"
              @keydown.enter="searchSubmit"
              @date-select="searchSubmit"
            ></my-date-input>
          </template>
        </my-input-wrapper>
        <my-input-wrapper label="姓名">
          <q-input v-bind="QInputProps" v-model="search['Patient/Person/Name']" @keydown.enter="searchSubmit"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="病歷號">
          <q-input v-bind="QInputProps" v-model="search.PatientId" @keydown.enter="searchSubmit"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="身分證號">
          <q-input v-bind="QInputProps" v-model="search['Patient/PersonId']" @keydown.enter="searchSubmit"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="看診狀態">
          <q-select
            v-bind="QSelectProps"
            v-model="search.Attend"
            :options="statusDropdown"
            optionLabel="Name"
            optionValue="No"
            emit-value
            map-options
            @update:model-value="searchSubmit"
          ></q-select>
        </my-input-wrapper>
      </my-search-area>

      <q-table
        class="mt-2"
        v-bind="QTableProps"
        :columns="columns"
        :rows="rows"
        row-key="Icd9"
        :pagination="pagination"
        :loading="tableLoading"
      >
        <template v-slot:bottom>
          <my-pagination
            class="mx-auto p-4"
            v-model="pagination"
            v-on:update:model-value="GetRoomBooking"
          ></my-pagination>
        </template>
      </q-table>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { cloneDeep } from 'lodash-es'
import { useQuasar, useDialogPluginComponent } from 'quasar'
import { getRoomBooking, getGetAttendDropdown, getSeekMedicalList } from 'api'
import { QInputProps, QSelectProps, QTableProps } from 'utils/quasar-extends/base-props'

const $q = useQuasar()
const { dialogRef, onDialogCancel } = useDialogPluginComponent()

const columns = [
  {
    name: 'SeekMedical',
    label: '就醫類別',
    field: (row) => seekMedicalItems.value.find(({ No }) => No === row.SeekMedical)?.Text,
    align: 'left',
  },
  { name: 'Name', label: '病患姓名', field: (row) => row.Patient?.Person?.Name, align: 'left' },
  { name: 'PatientId', label: '病歷號碼', field: 'PatientId', align: 'left' },
  { name: 'PersonId', label: '身分證號', field: 'PersonId', align: 'left' },
  { name: 'BookingDate', label: '看診日期', field: (row) => row.BookingDate?.substring(0, 10), align: 'left' },
  { name: 'TimeSlotName', label: '看診時段', field: 'TimeSlotName', align: 'left' },
  { name: 'Seq', label: '看診號', field: 'Seq', align: 'left' },
  { name: 'DepartmentName', label: '科別', field: 'DepartmentName', align: 'left' },
  { name: 'RoomName', label: '診間', field: 'RoomName', align: 'left' },
  { name: 'DoctorName', label: '醫生', field: 'DoctorName', align: 'left' },
  { name: 'AttendName', label: '看診狀態', field: 'AttendName', align: 'left' },
]

const tableLoading = ref(true)
const rows = ref([])
const GetRoomBooking = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getRoomBooking(query)
    if (res.data) {
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
  StartDate: null,
  EndDate: null,
  'Patient/Person/Name': null,
  PatientId: null,
  'Patient/PersonId': null,
  Attend: null,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  return Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'StartDate':
            return filterArray.concat(
              setOdataFilter({ key, value: encodeURIComponent(dayjs(value).format()), operator: 'ge' })
            )
          case 'EndDate':
            return filterArray.concat(
              setOdataFilter({
                key,
                value: encodeURIComponent(dayjs(value).add(1, 'day').format()),
                operator: 'lt',
              })
            )
          case 'Patient/Person/Name':
          case 'PatientId':
          case 'Patient/PersonId':
          case 'Attend':
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
  GetRoomBooking()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetRoomBooking()
}

const statusDropdown = ref([])
const GetGetAttendDropdown = async () => {
  try {
    const res = await getGetAttendDropdown()
    if (res.data) statusDropdown.value = res.data
  } catch (err) {
    console.log(err)
  }
}

const seekMedicalItems = ref([])
const GetSeekMedicalList = async () => {
  try {
    const res = await getSeekMedicalList()
    if (res.data) seekMedicalItems.value = res.data.Items
  } catch (err) {
    console.log(err)
  }
}

const init = () => {
  GetRoomBooking()
  GetGetAttendDropdown()
  GetSeekMedicalList()
}
init()
</script>

