<template>
  <q-page :style-fn="styleFn">
    <my-title :title="pageTitle">
      <template v-if="route.params.Id" #expand>
        <q-space></q-space>
        <div class="flex gap-2">
          <q-btn class="header-btn" label="選取病人" dense unelevated @click="goStayHospitalMedicalOrder"></q-btn>
          <q-btn class="header-btn" label="開立醫囑" dense unelevated @click="goCreateMedicalOrder"></q-btn>
          <q-btn class="header-btn" label="歷史病歷" dense unelevated @click="goStayHospitalHistory"></q-btn>
          <q-btn class="header-btn" label="檢驗報告" dense unelevated @click="goExaminationReport"></q-btn>
          <q-btn class="header-btn" label="影像報告" dense unelevated @click="goImageReport"></q-btn>
          <q-btn class="header-btn" label="會診作業" dense unelevated></q-btn>
          <q-btn class="header-btn" label="手術管理" dense unelevated></q-btn>
          <q-btn class="header-btn" label="出院摘要" dense unelevated @click="goHospitalizedRecord"></q-btn>
          <q-btn class="header-btn" label="出院作業" dense unelevated @click="goOutHospital"></q-btn>
          <q-btn class="header-btn" label="開立證明" dense unelevated @click="createCertificate"></q-btn>
        </div>
      </template>
      <template #bottom>
        <data-header class="text-default" :items="patientData" v-if="route.params.Id"> </data-header>
      </template>
    </my-title>

    <div v-if="route.params.Id" class="absolute top-0 left-0 right-0 bg-white">
      <router-view></router-view>
    </div>

    <div class="relative p-2" v-else>
      <my-search-area grid-cols="3" @searchSubmit="searchSubmit" @searchClear="searchClear">
        <my-input-wrapper label="護理站">
          <q-select
            v-bind="QSelectProps"
            v-model="search['HospitalBed/NursingStation']"
            :options="nursingStationFilterItems"
            option-label="Name"
            option-value="No"
            map-options
            emit-value
            use-input
            @filter="onNursingStationFilter"
            @input-value="filterLoading = true"
            @update:model-value="searchSubmit"
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
        <my-input-wrapper label="科別">
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
            @update:model-value="searchSubmit"
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
        <my-input-wrapper label="主治醫師">
          <q-select
            v-bind="QSelectProps"
            v-model="search.AttendingDocName"
            :options="doctorFilterItems"
            option-label="Name"
            option-value="Name"
            emit-value
            use-input
            @filter="onDoctorFilter"
            @input-value="filterLoading = true"
            @update:model-value="searchSubmit"
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
        <my-input-wrapper label="住院醫師">
          <q-select
            v-bind="QSelectProps"
            v-model="search.InpatientDocId"
            :options="ipdDoctorFilterItems"
            option-label="Name"
            option-value="AccountNo"
            map-options
            emit-value
            use-input
            @filter="onIpdDoctorFilter"
            @input-value="filterLoading = true"
            @update:model-value="searchSubmit"
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
        <my-input-wrapper label="病歷號">
          <q-input v-bind="QInputProps" v-model="search.PatientId" @keydown.enter="searchSubmit"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="病患姓名">
          <q-input v-bind="QInputProps" v-model="search['Patient/Person/Name']" @keydown.enter="searchSubmit"></q-input>
        </my-input-wrapper>
      </my-search-area>

      <q-table
        class="mt-2"
        v-bind="QTableProps"
        :rows="rows"
        :columns="columns"
        row-key="No"
        :pagination="pagination"
        :loading="tableLoading"
      >
        <template #body-cell-consumables="{ row }">
          <q-td>
            <div class="flex justify-center">
              <q-btn color="pink-4" unelevated size="md" label="輸入耗材" @click="InputSM(row)"></q-btn>
            </div>
          </q-td>
        </template>
        <template #body-cell-action="{ col, row }">
          <q-td :props="{ col }">
            <q-btn color="edit" label="選取" unelevated dense @click="onSelectClick(row)"></q-btn>
          </q-td>
        </template>
      </q-table>

      <div class="flex justify-center pt-4">
        <my-pagination v-model="pagination" @update:model-value="GetIpdRecordList"></my-pagination>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, provide } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { cloneDeep } from 'lodash-es'
import dayjs from 'dayjs'
import { useIpdStore } from 'stores/ipd'

// components
import dataHeader from 'components/DataHeader.vue'
import ConsumablesTableDialog from './components/ConsumablesTableDialog.vue'

import {
  getIpdRecordList,
  getIpdRecordItem,
  getNursingStation,
  getDepartmentDropdown,
  getDoctor,
  getIpdEmployeeList,
} from 'api'

// utils
import { QSelectProps, QInputProps, QTableProps } from 'utils/quasar-extends/base-props.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import setOdataFilter from 'utils/setOdataFilter'
import setSearchQuery from 'utils/setSearchQuery'
import { useFilter } from 'utils/quasar-extends/use-filter.js'

const $q = useQuasar()
const pageSize = reactive({
  offset: null,
  height: null,
})
provide(
  'pageSize',
  computed(() => pageSize)
)

const styleFn = (offset, height) => {
  Object.assign(pageSize, { offset, height })
  return `min-height: ${height - offset}px`
}

const ipdStore = useIpdStore()
const route = useRoute()
const router = useRouter()

const pageTitle = computed(() => {
  const subTitleType = {
    'StayHospitalMedicalOrder-CreateMedicalOrder': '開立醫囑',
    'StayHospitalMedicalOrder-ExaminationReport': '檢驗報告',
    'StayHospitalMedicalOrder-ImageReport': '影像報告',
    'StayHospitalMedicalOrder-OutHospital': '出院作業',
    'StayHospitalMedicalOrder-History': '歷史病歷',
    'StayHospitalMedicalOrder-HospitalizedRecord': '住院病歷',
    'StayHospitalMedicalOrder-CreateCertificate': '開立證明',
  }
  for (const key in subTitleType) {
    if (route.name.includes(key)) {
      return `住院醫囑 - ${subTitleType[key]}`
    }
  }

  return '住院醫囑'
})

const patientData = computed(() => [
  { label: '病患姓名', value: ipdStore.ipdData.Patient.Person.Name },
  { label: '性別', value: ipdStore.ipdData.Gender },
  {
    label: '生日',
    value: dayjs(ipdStore.ipdData.Patient.Person.BirthDate).isValid()
      ? dayjs(ipdStore.ipdData.Patient.Person.BirthDate).format('YYYY-MM-DD')
      : ipdStore.ipdData.Patient.Person.BirthDate,
  },
  { label: '身分證字號', value: ipdStore.ipdData.Patient.PersonId },
  { label: '床號', value: ipdStore.ipdData.HospitalBed.Bed },
  {
    label: '入院時間',
    value: dayjs(ipdStore.ipdData.IpdDate).isValid()
      ? dayjs(ipdStore.ipdData.IpdDate).format('YYYY-MM-DD')
      : ipdStore.ipdData.IpdDate,
  },
  { label: '主治醫師', value: ipdStore.ipdData.AttendingDocName },
  { label: '住院醫師', value: ipdStore.ipdData.InpatientDocName },
])
const columns = reactive([
  {
    name: 'action',
    label: '操作',
    align: 'center',
    field: 'action',
    style: 'width:80px',
  },
  {
    name: 'BedName',
    label: '床號',
    align: 'center',
    field: (row)=>row.HospitalBed.Bed,
    classes: 'whitespace-nowrap',
    style: 'width:50px',
  },
  {
    name: 'Name',
    label: '病患姓名',
    align: 'center',
    field: (row) => row.Patient.Person.Name,
    classes: 'whitespace-nowrap',
    style: 'width:100px',
  },
  { name: 'PatientId', label: '病歷號', align: 'center', field: 'PatientId', style: 'width:100px' },
  {
    name: 'DepartmentName',
    label: '科別',
    align: 'center',
    field: 'DepartmentName',
    classes: 'whitespace-nowrap',
    style: 'width:80px',
  },
  {
    name: 'AttendingDocName',
    label: '主治醫師',
    align: 'center',
    field: 'AttendingDocName',
    style: 'width:100px',
  },
  {
    name: 'InpatientDocName',
    label: '住院醫師',
    align: 'center',
    field: (row) => row.InpatientDocNames.toString(),
    style: 'width:100px',
  },
  {
    name: 'IpdDate',
    label: '入院時間',
    align: 'center',
    field: (row) => (dayjs(row.IpdDate).isValid() ? dayjs(row.IpdDate).format('YYYY-MM-DD') : row.IpdDate),
    style: 'width:120px',
  },
  {
    name: 'Name',
    label: '診斷',
    align: 'center',
    field: (row) => row.IpdDiagnoses.map((item) => item.Icd10Code).toString(),
    style: 'width:320px',
  }, //還未設置
  { name: 'op', label: '手術(OP)名稱', field: 'op', align: 'center', style: 'width:320px' },
  { name: 'consumables', label: '手術耗材', field: 'consumables', align: 'center', headerClasses: 'w-[120px]' },
  {
    name: 'BedTypeName',
    label: '住院天數',
    align: 'center',
    field: (row) => (row.InpatientDays ? row.InpatientDays + ' 天' : null),
    headerClasses: 'whitespace-nowrap',
    style: 'width:50px',
  },
])

const tableLoading = ref(false)
const rows = ref([])
const GetIpdRecordList = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
      attendingDocName: search.AttendingDocName,
    })
    const res = await getIpdRecordList(query)
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
  'HospitalBed/NursingStation': '',
  DepartmentId: '',
  PatientId: '',
  AttendingDocName: '',
  InpatientDocId: '',
  'Patient/Person/Name': '',
  Status: '2',
}

const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  const str = Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'Patient/Person/Name':
          case 'PatientId':
            return filterArray.concat(setOdataFilter({ key, value, operator: 'contains' }))
          case 'HospitalBed/NursingStation':
          case 'InpatientDocId':
          case 'DepartmentId':
          case 'Status':
            return filterArray.concat(setOdataFilter({ key, value, operator: 'eq' }))
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

const sortBy = ref([['ModifyDatetime', 'desc']])

const orderBy = computed(() => {
  return sortBy.value.map((item) => item.join(' ')).join(',')
})

const searchSubmit = () => {
  pagination.value.page = 1
  GetIpdRecordList()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetIpdRecordList()
}

//護理站
const filterLoading = ref(false)
const nursingStationItems = ref([])
const nursingStationFilterKeys = ['StationName']
const GetNursingStation = async () => {
  try {
    const res = await getNursingStation()
    if (res.data) nursingStationItems.value = res.data.Items
  } catch (err) {
    console.log(err)
  }
}

const { filterItems: nursingStationFilterItems, filterHandler: onNursingStationFilter } = useFilter(
  { items: nursingStationItems, filterKeys: nursingStationFilterKeys },
  () => {
    filterLoading.value = false
  }
)

const onNursingStationDropdown = (val, update) =>
  filterHandler(val, update, {
    filterLoading: filterLoading,
    items: nursingStationItems,
    filterItems: nursingStationFliterItems,
    filterKeys: ['StationName'],
  })

// 科別
const departmentItems = ref([])
const departmentFilterKeys = ['No', 'Name']
const GetDepartmentDropdown = async () => {
  try {
    const query = setSearchQuery({ layer: 2 })
    const res = await getDepartmentDropdown(query)
    if (res.data) departmentItems.value = res.data.Items
  } catch (error) {
    console.log(error)
  }
}

const { filterItems: departmentFilterItems, filterHandler: onDepartmentFilter } = useFilter(
  { items: departmentItems, filterKeys: departmentFilterKeys },
  () => {
    filterLoading.value = false
  }
)

// 主治醫師
const doctorItems = ref([])
const doctorFilterKeys = ['Name']
const GetDoctor = async () => {
  try {
    const res = await getDoctor()
    if (res.data) doctorItems.value = res.data.Items
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

// 住院醫師
const ipdDoctorItems = ref([])
const ipdDoctorFilterKeys = ['Name']
const GetIpdDoctor = async () => {
  try {
    const res = await getIpdEmployeeList('?role=1')
    if (res.data) ipdDoctorItems.value = res.data
  } catch (err) {
    console.log(err)
  }
}

const { filterItems: ipdDoctorFilterItems, filterHandler: onIpdDoctorFilter } = useFilter(
  { items: ipdDoctorItems, filterKeys: ipdDoctorFilterKeys },
  () => {
    filterLoading.value = false
  }
)

// 取得單一病人資訊
const GetIpdRecordItem = async (IpdId) => {
  try {
    const res = await getIpdRecordItem(IpdId)
    if (res.status === 200) {
      ipdStore.setIpdData(res.data)
    }
  } catch (err) {
    console.log(err)
  }
}

// 開啟手術耗材
const InputSM = async (row) => {
  const dialog = $q.dialog({
    component: ConsumablesTableDialog,
    componentProps: {
      IpdId: row.IpdId,
    },
  })
}

// 路由
const onSelectClick = (row) => {
  GetIpdRecordItem(row.IpdId)
  router.push({ name: 'StayHospitalMedicalOrder-CreateMedicalOrder', params: { Id: row.IpdId } })
}

const goStayHospitalMedicalOrder = () => {
  router.push({ name: 'StayHospitalMedicalOrder' })
}

const goCreateMedicalOrder = () => {
  router.push({
    name: 'StayHospitalMedicalOrder-CreateMedicalOrder',
    params: { Id: route.params.Id },
  })
}

const goExaminationReport = () => {
  router.push({
    name: 'StayHospitalMedicalOrder-ExaminationReport',
    params: { Id: route.params.Id },
  })
}

const goImageReport = () => {
  router.push({ name: 'StayHospitalMedicalOrder-ImageReport', params: { Id: route.params.Id } })
}

const goOutHospital = () => {
  router.push({ name: 'StayHospitalMedicalOrder-OutHospital', params: { Id: route.params.Id } })
}

const goStayHospitalHistory = () => {
  router.push({
    name: 'StayHospitalMedicalOrder-History',
    params: { Id: route.params.Id },
    query: { type: 'ipd', PatientId: ipdStore.ipdData.PatientId },
  })
}
const goHospitalizedRecord = () => {
  router.push({ name: 'StayHospitalMedicalOrder-HospitalizedRecord' })
}
const createCertificate = () => {
  router.push({ name: 'StayHospitalMedicalOrder-CreateCertificate' })
}

const init = () => {
  if (route.params.Id) {
    GetIpdRecordItem(route.params.Id)
  }

  GetIpdRecordList()
  GetNursingStation()
  GetDepartmentDropdown()
  GetIpdDoctor()
  GetDoctor()
}
init()
</script>

