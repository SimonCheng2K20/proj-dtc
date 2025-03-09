<template>
  <div>
    <my-search-area grid-cols="3" @searchSubmit="searchSubmit" @searchClear="searchClear">
      <my-input-wrapper label="護理站">
        <NurseStationSelection
          v-model="search['HospitalBed/NursingStation']"
          @update:model-value="searchSubmit"
        ></NurseStationSelection>
      </my-input-wrapper>
      <my-input-wrapper label="科別">
        <DepartmentSelection v-model="search.DepartmentId" @update:model-value="searchSubmit"></DepartmentSelection>
      </my-input-wrapper>
      <my-input-wrapper label="主治(住院)醫師">
        <DoctorSelection v-model="search.AttendingDocName" @update:model-value="searchSubmit"></DoctorSelection>
      </my-input-wrapper>
      <my-input-wrapper label="病歷號">
        <q-input v-bind="QInputProps" v-model="search.PatientId" @keyup.enter="searchSubmit"></q-input>
      </my-input-wrapper>
      <my-input-wrapper label="患者姓名">
        <q-input v-bind="QInputProps" v-model="search['Patient/Person/Name']" @keyup.enter="searchSubmit"></q-input>
      </my-input-wrapper>
    </my-search-area>

    <q-table
      class="mt-2"
      v-bind="QTableProps"
      :rows="ipdStore.ipdList"
      :columns="columns"
      :pagination="ipdStore.pagination"
      :loading="ipdStore.ipdListLoading"
    >
      <template #body-cell-action="{ col, row }">
        <q-td :props="{ col }">
          <q-btn
            label="入院作業"
            dense
            unelevated
            style="background: #0e1bd8; color: #ffffff"
            @click="toHospital(row)"
          ></q-btn>
          <q-btn
            class="ml-2"
            label="帳務作業"
            dense
            unelevated
            style="background: #cb0081; color: #ffffff"
            @click="toAccount(row)"
          ></q-btn>
        </q-td>
      </template>
      <template #body-cell-Name="{ col, row }">
        <q-td :props="{ col }">
          {{ row?.Patient?.Person?.Name }}
        </q-td>
      </template>
      <template v-slot:bottom>
        <my-pagination
          class="mx-auto p-4"
          v-model="ipdStore.pagination"
          v-on:update:model-value="GetIpdRecordList"
        ></my-pagination>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { onBeforeRouteLeave, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { QTableProps, QInputProps } from 'utils/quasar-extends/base-props.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { cloneDeep } from 'lodash-es'
import dayjs from 'dayjs'
import NurseStationSelection from 'components/type-selection/NurseStationSelection.vue'
import DepartmentSelection from 'components/type-selection/DepartmentSelection.vue'
import DoctorSelection from 'components/type-selection/DoctorSelection.vue'
import { useIpdStore } from 'src/stores/ipd'

const router = useRouter()
const $q = useQuasar()
const ipdStore = useIpdStore()

const columns = [
  { name: 'action', label: '操作', field: 'action', align: 'center' },
  { name: 'BedName', label: '床號', field: 'BedName', align: 'center' },
  { name: 'Name', label: '患者姓名', field: 'Name', align: 'center' },
  {
    name: 'BirthDate',
    label: '生日',
    field: (row) => dayjs(row?.Patient?.Person?.BirthDate).format('YYYY-MM-DD'),
    align: 'center',
  },
  { name: 'PatientId', label: '病歷號', field: 'PatientId', align: 'center' },
  { name: 'IdentityName', label: '身分', field: 'IdentityName', align: 'center' },
  { name: 'AttendingDocName', label: '主治醫生', field: 'AttendingDocName', align: 'center' },
  { name: 'InhospitalDoctor', label: '住院醫生', field: 'InhospitalDoctor', align: 'center' },
  { name: 'DepartmentName', label: '科別', field: 'DepartmentName', align: 'center' },
  {
    name: 'IpdDate',
    label: '入院日期',
    field: (row) => dayjs(row?.IpdDate).format('YYYY-MM-DD'),
    align: 'center',
  },
  { name: 'Ipd10', label: '診斷', field: 'Ipd10', align: 'center' },
  { name: 'StatusName', label: '床住狀態', field: 'StatusName', align: 'center' },
]

const GetIpdRecordList = () => {
  ipdStore.GetIpdRecordList({
    $filter: filter.value,
    $orderBy: orderBy.value,
  })
}

const initData = {
  search: {
    'HospitalBed/NursingStation': null,
    DepartmentId: null,
    PatientId: null,
    'Patient/Person/Name': null,
    AttendingDocName: null,
    Status: '2',
  },
}

const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  return Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'PatientId':
          case 'DepartmentId':
          case 'AttendingDocId':
          case 'Status':
            return filterArray.concat(setOdataFilter({ key, value, operator: 'eq' }))
          case 'HospitalBed/NursingStation':
          case 'Patient/Person/Name':
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

const sortBy = ref([['ModifyDatetime desc']])
const orderBy = computed(() => {
  return sortBy.value.map((item) => item.join(' ')).join(',')
})

const searchSubmit = () => {
  ipdStore.pagination.page = 1
  GetIpdRecordList()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  ipdStore.pagination.page = 1
  GetIpdRecordList()
}

const toHospital = (row) => {
  ipdStore.setIpdData(row)
  router.push({ name: 'NursingStation-Clerk-InHospital-InHospitalData', params: { ipdId: row.IpdId } })
}

const toAccount = (row) => {
  ipdStore.setIpdData(row)
  router.push({ name: 'NursingStation-Clerk-Accounting-PricingSearch', params: { ipdId: row.IpdId } })
}

onBeforeRouteLeave((to, from, next) => {
  if (!to.matched.find(({ name }) => name === from.name)) ipdStore.$reset()

  next()
})

const init = async () => {
  GetIpdRecordList()
}
init()
</script>

