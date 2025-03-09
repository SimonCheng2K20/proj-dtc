<template>
  <div>
    <my-search-area grid-cols="2" @searchSubmit="searchSubmit" @searchClear="searchClear">
      <my-input-wrapper label="護理站">
        <NurseStationSelection
          v-model="search['HospitalBed/NursingStation']"
          @update:model-value="searchSubmit"
        ></NurseStationSelection>
      </my-input-wrapper>
      <my-input-wrapper label="床號">
        <q-input v-bind="QInputProps" v-model="search.BedId" @keydown.enter="searchSubmit"></q-input>
      </my-input-wrapper>
    </my-search-area>

    <q-table
      class="mt-2"
      v-bind="QTableProps"
      :rows="ipdStore.ipdList"
      :columns="columns"
      :pagination="ipdStore.pagination"
      row-key="IpdId"
      :loading="ipdStore.ipdListLoading"
    >
      <template #body-cell-action="{ col, row }">
        <q-td :props="{ col }">
          <q-btn label="病患資訊" color="primary" @click="toPatientInfo(row)" dense unelevated></q-btn>
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
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { QTableProps, QInputProps } from 'utils/quasar-extends/base-props.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import dayjs from 'dayjs'
import NurseStationSelection from 'components/type-selection/NurseStationSelection.vue'
import { cloneDeep } from 'lodash-es'
import { useIpdStore } from 'src/stores/ipd'

const router = useRouter()
const $q = useQuasar()
const ipdStore = useIpdStore()

const columns = [
  { name: 'action', label: '操作', field: 'action', align: 'center', headerClasses: 'w-[160px]' },
  { name: 'BedName', label: '床號', field: 'BedName', align: 'left' },
  { name: 'PatientId', label: '病歷號', field: 'PatientId', align: 'left' },
  { name: 'PatientName', label: '病患姓名', field: (row) => row.Patient.Person.Name, align: 'left' },
  {
    name: 'CreateDatetime',
    label: '入院日',
    field: (row) => dayjs(row.CreateDatetime).format('YYYY-MM-DD'),
    align: 'left',
  },
  { name: 'PatientStatusName', label: '病患狀態', field: 'PatientStatusName', align: 'left' },
  { name: 'Note', label: '註記', field: 'Note', align: 'left', headerClasses: 'w-[400px]' },
]

const GetIpdRecordList = async () => {
  ipdStore.GetIpdRecordList({ $filter: filter.value, $orderBy: orderBy.value })
}

const initData = {}
initData.search = {
  'HospitalBed/NursingStation': null,
  BedId: null,
  Status: '2',
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  return Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'HospitalBed/NursingStation':
            return filterArray.concat(setOdataFilter({ key, value, operator: 'contains' }))
          case 'BedId':
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
})

const sortBy = ref([['ModifyDatetime desc']])
const orderBy = computed(() => {
  return sortBy.value.map((item) => item.join(' ')).join(',')
})

const searchSubmit = () => {
  ipdStore.pagination.page = 1
  GetRole()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  ipdStore.pagination.page = 1
  GetRole()
}

const toPatientInfo = (row) => {
  ipdStore.setIpdData(row)
  router.push({ name: 'NursingStation-Task-MedicationRecord', params: { ipdId: row.IpdId } })
}

const init = () => {
  GetIpdRecordList()
}

init()
</script>

