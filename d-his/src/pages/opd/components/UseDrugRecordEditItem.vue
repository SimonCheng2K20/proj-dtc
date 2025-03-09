<template>
  <q-dialog ref="dialogRef" full-width no-backdrop-dismiss>
    <my-dialog-content header="個人用藥" @close="onDialogCancel" :loading="getDataLoading">
      <my-input-group class="grid grid-cols-4 gap-2">
        <my-input-wrapper label="病歷號碼">
          <q-input v-bind="QInputProps" :model-value="editItem.PatientId" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="姓名">
          <q-input v-bind="QInputProps" :model-value="editItem.PersonName" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="身分證號">
          <q-input v-bind="QInputProps" :model-value="editItem.Idetifier" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="出生年月日">
          <q-input
            v-bind="QInputProps"
            :model-value="
              dayjs(editItem.BirthDate).isValid() ? `${editItem.BirthDate.substring(0, 10)}（${dayjs().diff(dayjs(editItem.BirthDate), 'year')}歲）` : null
            "
            readonly
          ></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="就診日">
          <q-input
            v-bind="QInputProps"
            :model-value="dayjs(editItem.CreateDatetime).isValid() ? editItem.CreateDatetime.substring(0, 10) : null"
            readonly
          ></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="科別">
          <q-input v-bind="QInputProps" :model-value="editItem.DepartmentName" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="醫生">
          <q-input v-bind="QInputProps" :model-value="editItem.SignedDocName" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="診間">
          <q-input v-bind="QInputProps" :model-value="editItem.RoomName" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="繳費狀態">
          <q-input v-bind="QInputProps" :model-value="editItem.Status" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="主診斷" class="col-span-3">
          <q-input
            v-bind="QInputProps"
            :model-value="editItem.OpdDiagnoses[0] ? `${editItem.OpdDiagnoses[0].Icd10Code} - ${editItem.OpdDiagnoses[0].Icd10Cht}` : null"
            readonly
          ></q-input>
        </my-input-wrapper>
      </my-input-group>

      <medicine-table class="mt-2" :rows="editItem.OpdMedications" :columns="medicineColumns" readonly></medicine-table>
    </my-dialog-content>
  </q-dialog>
</template>
<script setup>
import { ref, reactive } from 'vue'
import { useDialogPluginComponent } from 'quasar'
import { getOpdRecordItem } from 'api'
import { QInputProps } from 'utils/quasar-extends/base-props.js'
import MedicineTable from 'components/opd/MedicineTable.vue'
import dayjs from 'dayjs'

const { dialogRef, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  editType: String,
  id: [String, Number],
})

const editItem = reactive({
  PatientId: null,
  PersonName: null,
  Idetifier: null,
  BirthDate: null,
  CreateDatetime: null,
  DepartmentName: null,
  SignedDocName: null,
  RoomName: null,
  Status: null,
  OpdDiagnoses: [],
  OpdMedications: [],
})

const medicineColumns = [
  'index',
  'MedicineId',
  'Name',
  'DoseOnce',
  'MedicationUnitCode',
  'FrequencyCode',
  'OneDay',
  'MedicationDays',
  'MedicationDays2',
  'Formula',
  'Mill',
  'TotalAmount',
  'TotalAmount2',
  'ChronicNotes',
  'RouteCode',
]

const getDataLoading = ref(false)
const GetOpdRecordItem = async () => {
  try {
    getDataLoading.value = true
    const res = await getOpdRecordItem(props.id)
    if (res.status === 200) {
      Object.assign(editItem, res.data)
    }
  } catch (err) {
    console.log(err)
  } finally {
    getDataLoading.value = false
  }
}

const init = () => {
  if (!!props.id) GetOpdRecordItem()
}
init()
</script>

