<template>
  <q-page class="p-2">
    <my-title>
      <div>
        {{ erProgramAction === 'edit' ? '病患資料編修' : '病患看診進度查詢' }}
      </div>
      <q-space></q-space>
      <div class="flex gap-2">
        <q-btn class="header-btn" label="回上一頁" unelevated dense @click="router.go(-2)"></q-btn>
      </div>
    </my-title>

    <my-search-area grid-cols="4" @search-submit="searchSubmit" @search-clear="searchClear">
      <my-input-wrapper class="col-span-2" label="掛號日期" range-input v-if="erProgramAction === 'edit'">
        <template #range-input-0>
          <my-date-input
            v-bind="QInputProps"
            v-model="search.IpdPreDateStart"
            @keydown.enter="searchSubmit"
            @date-select="searchSubmit"
          ></my-date-input>
        </template>
        <template #range-input-1>
          <my-date-input
            v-bind="QInputProps"
            v-model="search.IpdPreDateEnd"
            @keydown.enter="searchSubmit"
            @date-select="searchSubmit"
          ></my-date-input>
        </template>
      </my-input-wrapper>
      <my-input-wrapper label="姓名">
        <q-input v-bind="QInputProps" v-model="search.Name" @keydown.enter="searchSubmit"> </q-input>
      </my-input-wrapper>
      <my-input-wrapper label="病歷號" v-if="erProgramAction === 'edit'">
        <q-input v-bind="QInputProps" v-model="search.PatientId" @keydown.enter="searchSubmit"> </q-input>
      </my-input-wrapper>
      <my-input-wrapper label="身分證號">
        <q-input v-bind="QInputProps" v-model="search.PersonId" @keydown.enter="searchSubmit"> </q-input>
      </my-input-wrapper>
      <my-input-wrapper label="急診科別" v-if="erProgramAction === 'edit'">
        <q-select
          v-bind="QSelectProps"
          v-model="search.DepartmentId"
          :options="departmentFilterItems"
          option-label="Name"
          option-value="No"
          map-options
          emit-value
          use-input
          @filter="onDepartmentFilter"
          @input-value="filterLoading = true"
        >
          <template #no-option="{ inputValue }">
            <q-item v-if="!!inputValue">
              <q-item-section class="text-grey">
                <q-spinner v-if="filterLoading" color="primary"></q-spinner>
                <span v-else>找不到符合的資料</span>
              </q-item-section>
            </q-item>
          </template>
          <template #option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label>
                  <div v-html="scope.opt.filterLabel"></div>
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </my-input-wrapper>
      <my-input-wrapper label="醫師姓名" v-if="erProgramAction === 'edit'">
        <q-select
          v-bind="QSelectProps"
          v-model="search.DoctorName"
          :options="doctorFilterItems"
          option-label="Name"
          option-value="Name"
          map-options
          emit-value
          use-input
          @filter="onDoctorFilter"
          @input-value="filterLoading = true"
        >
          <template #no-option="{ inputValue }">
            <q-item v-if="!!inputValue">
              <q-item-section class="text-grey">
                <q-spinner v-if="filterLoading" color="primary"></q-spinner>
                <span v-else>找不到符合的資料</span>
              </q-item-section>
            </q-item>
          </template>
          <template #option="scope">
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label>
                  <div v-html="scope.opt.filterLabel"></div>
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </my-input-wrapper>
      <my-input-wrapper label="路倒病人" v-if="erProgramAction !== 'edit'">
        <q-checkbox v-model="search.Roadside" @update:model-value="searchSubmit"></q-checkbox>
      </my-input-wrapper>
    </my-search-area>

    <q-table
      class="mt-2"
      v-bind="QTableProps"
      :rows="rows"
      :columns="columns"
      row-key="IpdId"
      :pagination="pagination"
      :loading="tableLoading"
    >
      <template #body-cell-action="{ col, row }" v-if="erProgramAction === 'edit'">
        <q-td :props="{ col }">
          <q-btn class="mr-1" color="edit" @click="toEdit(row)" label="編輯" unelevated dense></q-btn>
        </q-td>
      </template>
      <template v-slot:bottom>
        <my-pagination class="mx-auto p-4" v-model="pagination" v-on:update:model-value="GetERHistory"></my-pagination>
      </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { getERHistory, getERDepartment, getErEmployeeList } from 'api'
import { ref, reactive, computed } from 'vue'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { cloneDeep } from 'lodash-es'
import { useQuasar } from 'quasar'
import { QTableProps, QInputProps, QSelectProps } from 'utils/quasar-extends/base-props.js'
import dayjs from 'dayjs'
import { useFilter } from 'utils/quasar-extends/use-filter.js'
import { useRouter } from 'vue-router'
import BookingEditItem from './components/BookingEditItem.vue'

const $q = useQuasar()

const router = useRouter()

const props = defineProps({
  erProgramAction: String,
})

const columns = computed(() => {
  let arr = []

  if (props.erProgramAction === 'edit') {
    arr = [
      { name: 'action', label: '操作', align: 'center', field: 'action' },
      {
        name: 'IdentityName',
        label: '就診身分',
        align: 'center',
        field: 'IdentityName',
      },
      {
        name: 'Name',
        label: '病患姓名',
        align: 'center',
        field: 'Name',
      },
      {
        name: 'PatientId',
        label: '病歷號碼',
        align: 'center',
        field: 'PatientId',
      },
      {
        name: 'Gender',
        label: '性別',
        align: 'center',
        field: 'Gender',
      },
      {
        name: 'Birthday',
        label: '生日',
        align: 'center',
        field: (row) => row.Birthday?.substring(0, 10),
      },
      {
        name: 'PersonId',
        label: '身分證號',
        align: 'center',
        field: 'PersonId',
      },
      {
        name: 'CreateDatetime',
        label: '看診日期',
        align: 'center',
        field: (row) => row.CreateDatetime?.substring(0, 10),
      },
      {
        name: 'TimeSlotName',
        label: '看診時段',
        align: 'center',
        field: 'TimeSlotName',
      },
      {
        name: 'seq',
        label: '看診號',
        align: 'center',
        field: 'seq',
      },
      {
        name: 'DepartmentName',
        label: '急診科別',
        align: 'center',
        field: 'DepartmentName',
      },
      {
        name: 'RoomName',
        label: '診間',
        align: 'center',
        field: 'RoomName',
      },
      {
        name: 'DoctorName',
        label: '醫師姓名',
        align: 'center',
        field: 'DoctorName',
      },
      {
        name: 'InjuredGradeName',
        label: '檢傷類別',
        align: 'center',
        field: 'InjuredGradeName',
      },
      {
        name: 'ErStatusName',
        label: '看診狀態',
        align: 'center',
        field: 'ErStatusName',
      },
      {
        name: 'ErTrendName',
        label: '病人動向',
        align: 'center',
        field: 'ErTrendName',
      },
      {
        name: 'ErAfterProcessName',
        label: '後續處理',
        align: 'center',
        field: 'ErAfterProcessName',
      },
    ]
  } else {
    arr = [
      {
        name: 'CreateDatetime',
        label: '看診日期',
        align: 'center',
        field: (row) => row.CreateDatetime?.substring(0, 10),
      },
      {
        name: 'Name',
        label: '病患姓名',
        align: 'center',
        field: 'Name',
      },
      {
        name: 'PersonId',
        label: '身分證號',
        align: 'center',
        field: 'PersonId',
      },
      {
        name: 'PatientId',
        label: '病歷號碼',
        align: 'center',
        field: 'PatientId',
      },
      {
        name: 'Gender',
        label: '性別',
        align: 'center',
        field: 'Gender',
      },
      {
        name: 'Birthday',
        label: '生日',
        align: 'center',
        field: (row) => row.Birthday?.substring(0, 10),
      },
      {
        name: 'DepartmentName',
        label: '急診科別',
        align: 'center',
        field: 'DepartmentName',
      },
      {
        name: 'DoctorName',
        label: '醫師姓名',
        align: 'center',
        field: 'DoctorName',
      },
      {
        name: 'RoomName',
        label: '診間',
        align: 'center',
        field: 'RoomName',
      },
      {
        name: 'InjuredGradeName',
        label: '檢傷類別',
        align: 'center',
        field: 'InjuredGradeName',
      },
      {
        name: 'ErStatusName',
        label: '看診狀態',
        align: 'center',
        field: 'ErStatusName',
      },
      {
        name: 'ErTrendName',
        label: '病人動向',
        align: 'center',
        field: 'ErTrendName',
      },
      {
        name: 'ErAfterProcessName',
        label: '後續處理',
        align: 'center',
        field: 'ErAfterProcessName',
      },
    ]
  }

  return arr
})

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
  IpdPreDateStart: null,
  IpdPreDateEnd: null,
  Name: null,
  PatientId: null,
  PersonId: null,
  DepartmentId: null,
  DoctorName: null,
  Roadside: false,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  const str = Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'IpdPreDateStart':
            return filterArray.concat(
              setOdataFilter({
                key: 'CreateDatetime',
                value: encodeURIComponent(dayjs(value).format()),
                operator: 'ge',
              })
            )
          case 'IpdPreDateEnd':
            return filterArray.concat(
              setOdataFilter({
                key: 'CreateDatetime',
                value: encodeURIComponent(dayjs(value).add(1, 'day').format()),
                operator: 'lt',
              })
            )
          case 'PersonId':
            return filterArray.concat(
              setOdataFilter({
                key: 'RoomBooking/Patient/PersonId',
                value,
                operator: 'contains',
              })
            )
          case 'PatientId':
            return filterArray.concat(
              setOdataFilter({
                key: 'RoomBooking/Patient/PatientId',
                value,
                operator: 'contains',
              })
            )
          case 'Name':
            return filterArray.concat(
              setOdataFilter({
                key: 'RoomBooking/Patient/Person/Name',
                value,
                operator: 'contains',
              })
            )
          case 'DoctorName':
            return filterArray.concat(
              setOdataFilter({
                key: 'RoomBooking/Person/Name',
                value,
                operator: 'eq',
              })
            )
          case 'DepartmentId':
            return filterArray.concat(
              setOdataFilter({
                key: 'RoomBooking/Room/Department/DeclaredDepartmentNo',
                value,
                operator: 'eq',
              })
            )
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

const sortBy = ref([])
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

const filterLoading = ref(false)
const departmentItems = ref([])
const departmentFilterKeys = ['No', 'Name']
const GetERDepartment = async () => {
  try {
    const res = await getERDepartment()
    if (res.data) departmentItems.value = res.data
  } catch (err) {
    console.log(err)
  }
}

const { filterItems: departmentFilterItems, filterHandler: onDepartmentFilter } = useFilter(
  { items: departmentItems, filterKeys: departmentFilterKeys },
  () => {
    filterLoading.value = false
  }
)

// 醫生清單
const doctorItems = ref([])
const doctorFilterKeys = ['Name']
const GetERDoctor = async () => {
  try {
    const res = await getErEmployeeList('?role=1')
    if (res.data) doctorItems.value = res.data
  } catch (err) {
    console.log(err)
  }
}

const { filterItems: doctorFilterItems, filterHandler: onDoctorFilter } = useFilter(
  { items: doctorItems, filterKeys: doctorFilterKeys },
  () => {
    filterLoading.value = false
  }
)

// 編輯按鈕
const toEdit = (row) => {
  const dialog = $q
    .dialog({
      component: BookingEditItem,
      componentProps: {
        id: row.RegId,
      },
    })
    .onOk(() => {
      dialog.hide()
      GetERHistory()
    })
}

const init = async () => {
  GetERHistory()
  GetERDepartment()
  GetERDoctor()
}
init()
</script>
