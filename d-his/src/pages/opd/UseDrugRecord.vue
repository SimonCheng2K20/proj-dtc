<template>
  <q-page class="p-2">
    <my-title title="用藥紀錄查詢"></my-title>
    <my-search-area grid-cols="4" v-on:search-submit="searchSubmit" v-on:search-clear="searchClear">
      <my-input-wrapper label="就診日" class="col-span-2" range-input>
        <template #range-input-0>
          <my-date-input v-bind="QInputProps" v-model="search.startDate" @keydown.enter="searchSubmit" @date-select="searchSubmit"> </my-date-input>
        </template>
        <template #range-input-1>
          <my-date-input v-bind="QInputProps" v-model="search.endDate" @keydown.enter="searchSubmit" @date-select="searchSubmit"> </my-date-input>
        </template>
      </my-input-wrapper>
      <my-input-wrapper label="科別"><q-input v-bind="QInputProps" v-model="search.departmentNo" @keydown.enter="searchSubmit"></q-input></my-input-wrapper>
      <my-input-wrapper label="醫師"><q-input v-bind="QInputProps" v-model="search.doctorId" @keydown.enter="searchSubmit"></q-input></my-input-wrapper>
      <my-input-wrapper label="診間"><q-input v-bind="QInputProps" v-model="search.roomNo" @keydown.enter="searchSubmit"></q-input></my-input-wrapper>
      <my-input-wrapper label="病歷號碼"><q-input v-bind="QInputProps" v-model="search.patientId" @keydown.enter="searchSubmit"></q-input></my-input-wrapper>
      <my-input-wrapper label="身分證號"><q-input v-bind="QInputProps" v-model="search.personId" @keydown.enter="searchSubmit"></q-input></my-input-wrapper>
      <my-input-wrapper label="病患姓名"><q-input v-bind="QInputProps" v-model="search.patientName" @keydown.enter="searchSubmit"></q-input></my-input-wrapper>
      <my-input-wrapper label="生日">
        <my-date-input v-bind="QInputProps" v-model="search.birthDate" @keydown.enter="searchSubmit" @date-select="searchSubmit"> </my-date-input>
      </my-input-wrapper>
    </my-search-area>
    <q-table class="mt-2" v-bind="QTableProps" :rows="rows" :columns="columns" row-key="OpdId" :pagination="pagination" :loading="tableLoading">
      <template v-slot:body-cell-action="{ col, row }">
        <q-td :props="{ col }">
          <q-btn color="view" @click="toView(row)" label="檢視" unelevated dense></q-btn>
        </q-td>
      </template>
      <template v-slot:bottom> <my-pagination class="mx-auto p-4" v-model="pagination" v-on:update:model-value="GetDrugRecord"></my-pagination> </template>
    </q-table>
  </q-page>
</template>

<script setup>
import { getDrugRecord } from 'api'
import { ref, reactive, computed } from 'vue'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { cloneDeep } from 'lodash-es'
import { useQuasar } from 'quasar'
import EditItem from './components/UseDrugRecordEditItem.vue'
import { QInputProps, QTableProps } from 'utils/quasar-extends/base-props.js'
import dayjs from 'dayjs'

const qDateProxy = ref()
const $q = useQuasar()

const columns = reactive([
  { name: 'action', label: '操作', field: 'action', align: 'center' },
  { name: 'PersonName', label: '姓名', field: 'PersonName', align: 'left' },
  { name: 'Idetifier', label: '身分證號', field: 'Idetifier', align: 'left' },
  { name: 'BirthDate', label: '生日', field: (row) => (dayjs(row.BirthDate).isValid() ? row.BirthDate.substring(0, 10) : null), align: 'left' },
  { name: 'PatientId', label: '病歷號碼', field: 'PatientId', align: 'left' },
  {
    name: 'CreateDatetime',
    label: '就診日',
    field: (row) => (dayjs(row.CreateDatetime).isValid() ? row.CreateDatetime.substring(0, 10) : null),
    align: 'left',
  },
  { name: 'DepartmentName', label: '科別', field: 'DepartmentName', align: 'left' },
  { name: 'RoomName', label: '診間', field: 'RoomName', align: 'left' },
  {
    name: 'OpdDiagnoses',
    label: '診斷',
    field: (row) => (row.OpdDiagnoses[0] ? `${row.OpdDiagnoses[0].Icd10Code} - ${row.OpdDiagnoses[0].Icd10Cht}` : null),
    align: 'left',
  },
])

const tableLoading = ref(false)
const rows = ref([])
const GetDrugRecord = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      ...search,
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getDrugRecord(query)
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
  startDate: null,
  endDate: null,
  departmentNo: null,
  doctorId: null,
  roomNo: null,
  patientId: null,
  personId: null,
  patientName: null,
  birthDate: null,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  return
})

const sortBy = ref([['CreateDatetime','desc']])
const orderBy = computed(() => {
  return sortBy.value.map((item) => item.join(' ')).join(',')
})

const searchSubmit = () => {
  pagination.value.page = 1
  GetDrugRecord()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetDrugRecord()
}

const toView = (row) => {
  const dialog = $q
    .dialog({
      component: EditItem,
      componentProps: {
        editType: 'edit',
        id: row.OpdId,
      },
    })
    .onOk(() => {
      dialog.hide()
    })
}

const init = async () => {
  GetDrugRecord()
}
init()
</script>

