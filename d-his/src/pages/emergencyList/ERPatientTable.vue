<template>
  <q-table
    class="mt-2"
    v-bind="QTableProps"
    :rows="rows"
    :columns="filterColumns"
    :pagination="pagination"
    row-key="OpdId"
    :loading="tableLoading"
  >
    <template v-slot:body-cell-seeDoctor="{ col, row }">
      <q-td :props="{ col }">
        <q-btn color="edit" @click="toOpdDetail(row.RegId)" label="看診" unelevated dense></q-btn>
      </q-td>
    </template>
    <template v-slot:body-cell-editRecord="{ col, row }">
      <q-td :props="{ col }">
        <q-btn color="edit" @click="PostOpd(row.RegId)" label="編輯" unelevated dense></q-btn>
      </q-td>
    </template>
    <template #body-cell-ErStatus="{ col, row }">
      <q-td :props="{ col }">
        <q-select
          v-bind="QSelectProps"
          v-model="row.ErStatus"
          :options="statusItems"
          optionLabel="Name"
          optionValue="No"
          emit-value
          map-options
          @update:model-value="PutRoomBooking(row)"
        ></q-select>
      </q-td>
    </template>
    <template #body-cell-ErTrend="{ col, row }">
      <q-td :props="{ col }">
        <q-select
          v-bind="QSelectProps"
          v-model="row.ErTrend"
          :options="patientERStatusItems"
          optionLabel="Name"
          optionValue="No"
          emit-value
          map-options
          @update:model-value="PutRoomBooking(row)"
        ></q-select>
      </q-td>
    </template>
    <template #body-cell-ErAfterProcess="{ col, row }">
      <q-td :props="{ col }">
        <q-select
          v-bind="QSelectProps"
          v-model="row.ErAfterProcess"
          :options="afterERTreatmentItems"
          optionLabel="Name"
          optionValue="No"
          emit-value
          map-options
          @update:model-value="PutRoomBooking(row)"
        ></q-select>
      </q-td>
    </template>
    <template #body-cell-startMeeting="{ col }">
      <q-td :props="{ col }">
        <q-btn label="啟動會診" color="primary" unelevated dense></q-btn>
      </q-td>
    </template>
    <template v-slot:bottom>
      <slot></slot>
    </template>
  </q-table>
</template>
<script setup>
import { getERHistory, getERStatus, getPatientERStatus, getAfterERTreatment, putRoomBooking, postOpd } from 'api'
import { reactive, ref, computed } from 'vue'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { QInputProps, QSelectProps, QTableProps } from 'utils/quasar-extends/base-props.js'
import { useQuasar } from 'quasar'
import { cloneDeep } from 'lodash-es'
import dayjs from 'dayjs'
import { useRouter } from 'vue-router'

const $q = useQuasar()
const router = useRouter()
const props = defineProps({
  rows: Array,
  columns: Array,
})

const columns = reactive([
  { name: 'seeDoctor', label: '操作', field: 'action', align: 'center' },
  { name: 'editRecord', label: '操作', field: 'action', align: 'center' },
  { name: 'CreateDatetime', label: '看診日期', field: (row) => row.CreateDatetime?.substring(0, 10), align: 'center' },
  {
    name: 'CreateDatetime',
    label: '到院時間',
    field: (row) => dayjs(row.CreateDatetime).format('HH:mm:ss'),
    align: 'center',
  },
  { name: 'PatientId', label: '病歷號碼', field: 'PatientId', align: 'center' },
  { name: 'PersonId', label: '身分證號', field: (row) => row?.Patient?.PersonId || row?.PersonId, align: 'center' },
  { name: 'Name', label: '姓名', field: 'Name', align: 'center' },
  { name: 'Gender', label: '性別', field: 'Gender', align: 'center' },
  {
    name: 'Birthday',
    label: '生日',
    field: (row) => row.Birthday?.substring(0, 10),
    align: 'center',
  },
  { name: 'Pacs', label: '影像到位', field: 'Pacs', align: 'left' },
  { name: 'Laboratory', label: '檢驗到位', field: 'Laboratory', align: 'left' },
  { name: '急診科別', label: '急診科別', field: 'DepartmentName', align: 'center' },
  { name: 'InjuredGradeName', label: '檢傷分類', field: 'InjuredGradeName', align: 'center' },
  { name: 'ErStatus', label: '看診狀態', field: 'ErStatus', align: 'center' },
  { name: 'ErTrend', label: '病人動向', field: 'ErTrend', align: 'center' },
  { name: 'ErAfterProcess', label: '後續處理', field: 'ErAfterProcess', align: 'center' },
  { name: 'ErStatusName', label: '看診狀態', field: 'ErStatusName', align: 'center' },
  { name: 'ErTrendName', label: '病人動向', field: 'ErTrendName', align: 'center' },
  { name: 'ErAfterProcessName', label: '後續處理', field: 'ErAfterProcessName', align: 'center' },
  { name: 'startMeeting', label: '啟動會診', field: 'startMeeting', align: 'center' },
])
const filterColumns = computed(() => {
  if (props.columns) {
    return columns.filter((item) => props.columns.includes(item.name))
  } else {
    return columns
  }
})

const tableLoading = ref(false)

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

const statusItems = ref([])
const GetERStatus = async () => {
  try {
    const res = await getERStatus()
    statusItems.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const patientERStatusItems = ref([])
const GetPatientERStatus = async () => {
  try {
    const res = await getPatientERStatus()
    patientERStatusItems.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const afterERTreatmentItems = ref([])
const GetAfterERTreatment = async () => {
  try {
    const res = await getAfterERTreatment()
    afterERTreatmentItems.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const toOpdDetail = async (regId) => {
  const res = await postOpd(regId)
  if (res.status === 200) {
    router.push({ name: 'OpdRecord-Detail', params: { opdId: res.data }, query: { isEmergency: true, history: false } })
  }
}

const PostOpd = async (regId) => {
  try {
    const res = await postOpd(regId)
    if (res.status === 200) {
      router.push({
        name: 'OpdRecord-Detail',
        params: { opdId: res.data },
        query: { isEmergency: true, history: true },
      })
    }
  } catch (err) {
    console.log(err)
  }
}

const PutRoomBooking = async (row) => {
  try {
    const res = await putRoomBooking(row)
    $q.notify({
      type: 'positive',
      message: '修改成功',
      position: 'top',
    })
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '修改失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
      position: 'top',
    })
  }
}

const init = () => {
  GetERStatus()
  GetPatientERStatus()
  GetAfterERTreatment()
}
init()
</script>

