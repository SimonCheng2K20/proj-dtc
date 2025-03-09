<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss full-width>
    <my-dialog-content :header="editHeader" width="1280px" @close="onDialogCancel">
      <DataHeader :items="header"></DataHeader>

      <q-table class="mt-2" v-bind="QTableProps" :rows="data.OpdMedicationDetails" :columns="columns"></q-table>

      <template #actions>
        <q-btn unelevated color="grey" label="取消" @click="onDialogCancel"></q-btn>
        <q-btn v-if="editType === 'receive'" unelevated color="secondary" label="完成領藥" @click="onReceiveClick"></q-btn>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { getReceiveMedicine, putReceiveMedicine } from 'api'
import { QInputProps, QTableProps } from 'utils/quasar-extends/base-props.js'
import { cloneDeep } from 'lodash-es'
import DataHeader from 'components/DataHeader.vue'

const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  editType: String,
  id: [String, Number],
})

const editHeader = computed(() => {
  switch (props.editType) {
    case 'view':
    case 'receive':
      return `檢閱用藥單`
    default:
      return null
  }
})

const columns = [
  { name: 'Sn', label: '序號', field: 'Sn', align: 'right' },
  { name: 'MedicineId', label: '藥品代碼', field: 'MedicineId', align: 'left' },
  { name: 'MedicationName', label: '藥品名稱', field: 'MedicationName', align: 'left' },
  { name: 'Unit', label: '單位', field: 'Unit', align: 'left' },
  { name: 'Route', label: '途徑', field: 'Route', align: 'left' },
  { name: 'FrequencyCode', label: '用法', field: 'FrequencyCode', align: 'left' },
  { name: 'TimeDays', label: '用量 x 天', field: 'TimeDays', align: 'right' },
  { name: 'TotalAmount', label: '總量', field: 'TotalAmount', align: 'right' },
  { name: 'Mill', label: '磨粉', field: 'Mill', align: 'center' },
  { name: 'Warning', label: '警語', field: 'Warning', align: 'left' },
  { name: 'AdverseReaction', label: '副作用', field: 'AdverseReaction', align: 'left' },
]

const data = reactive({
  ReceiptNo: null,
  SelfFee: null,
  TotalSelfFee: null,
  TotalNhiFee: null,
  TotalFee: null,
  PatientId: null,
  PatientName: null,
  RegId: null,
  PrintTime: null,
  InstitutionName: null,
  DepartmentName: null,
  CreateUser: null,
  CnNumber: null,
  Code: null,
  Name: null,
  Address: null,
  AttendCategory: null,
  SerialNo: null,
  ReceiveDrugNo: null,
  PersonId: null,
  ChtBirthday: null,
  Age: null,
  Gender: null,
  Identity: null,
  Weight: null,
  Temperature: null,
  MedicationDays: null,
  Diagnose: null,
  RegistFee: null,
  DocName: null,
  OpdDate: null,
  SourceFrom: null,
  OpdCharegDetails: [],
  OpdMedicationDetails: [],
})
const GetReceiveMedicine = async () => {
  try {
    const res = await getReceiveMedicine(props.id)
    Object.assign(data, res.data)
  } catch (error) {
    console.log(error)
  }
}

const header = computed(() => [
  { label: '姓名', value: data.PatientName },
  { label: '出生年月日', value: data.ChtBirthday },
  { label: '年齡', value: data.Age },
  { label: '性別', value: data.Gender },
  { label: '身分', value: data.Identity },
  { value: data.Weight + 'kg/' + data.Temperature + '°C' },
  { label: '病歷號碼', value: data.PatientId },
  { label: '日份', value: data.MedicationDays },
  { label: '身分證號', value: data.PersonId },
  { label: '就診日', value: data.OpdDate },
  { label: '科別', value: data.DepartmentName },
  { label: '醫師', value: data.DocName },
  { label: '診間', value: data.RoomName },
  { label: 'Dx', value: data.Diagnose },
])

const onReceiveClick = async () => {
  PutReceiveMedicine()
}

const PutReceiveMedicine = async () => {
  try {
    const res = await putReceiveMedicine({
      OpdId: props.id,
    })
    $q.notify({
      type: 'positive',
      message: '領藥成功',
      position: 'top',
    })
    onDialogOK()
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '領藥失敗：' + (typeof error.data === 'string' ? error.data : JSON.stringify(error.data)),
      position: 'top',
    })
  }
}

const init = () => {
  if (props.id) GetReceiveMedicine()
}
init()
</script>

