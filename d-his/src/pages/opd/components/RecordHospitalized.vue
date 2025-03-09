<template>
  <div class="relative cus-boxOutline p-5 px-10">
    <div class="flex">
      <q-tabs dense indicator-color="transparent" active-bg-color="primary" active-color="white" v-model="recordType">
        <q-tab name="HospitalizedExamine" class="cus-boxOutline mr-1">入院檢查</q-tab>
        <q-tab name="ProgressTable" class="cus-boxOutline mr-1">病程記錄</q-tab>
        <q-tab name="MedicineTable" class="cus-boxOutline mr-1">M住院醫囑用藥</q-tab>
        <q-tab name="ProcedureTable" class="cus-boxOutline mr-1">E檢查治療</q-tab>
        <q-tab name="NurseRecord" class="cus-boxOutline">護理紀錄</q-tab>
      </q-tabs>
    </div>
    <div class="grid grid-cols-1">
      <!-- 入院檢查 -->
      <HospitalizedExamine
        :selectedItem="selectedItem"
        v-if="recordType === 'HospitalizedExamine'"
      ></HospitalizedExamine>

      <!-- 病程紀錄 -->
      <ProgressTable
        :rows="progressNoteData"
        :columns="progressNoteColumns"
        :loading="loadingProgressNote"
        readonly
        v-if="recordType === 'ProgressTable'"
      ></ProgressTable>

      <!-- M住院醫囑用藥 -->
      <MedicineTable
        readonly
        :rows="medicineRows"
        :columns="medicineColumns"
        :loading="loadingMedicine"
        v-if="recordType === 'MedicineTable'"
      ></MedicineTable>

      <!-- E檢查治療 -->
      <ProcedureTable
        :rows="proceduresRows"
        :columns="proceduresColumns"
        :loading="loadingIpdProcedures"
        preset
        readonly
        v-if="recordType === 'ProcedureTable'"
      ></ProcedureTable>

      <!-- 護理站紀錄 -->
      <div v-if="recordType === 'NurseRecord'">
        <div class="box" v-if="recordData.length === 0">
          <p class="record-bar">
            <span>紀錄日期:無資料</span>
            <span>護理師:無資料</span>
            <span>狀態:無資料</span>
          </p>
          <div class="textSaved">無資料</div>
        </div>
        <div v-for="(v, i) in recordData" class="box" :key="i">
          <p class="record-bar">
            <span>紀錄日期: {{ v.NoteDate?.substring(0, 10) }} {{ v.NoteDate?.substring(11, 16) }}</span>
            <span>護理師: {{ v.NursingStaffName }}</span>
            <span :class="v.PatientStatus > 0 ? 'text-red' : ''">病患狀態: {{ v.PatientStatusName }}</span>
          </p>
          <div class="textSaved">
            {{ v.Note }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { QInputProps, QTableProps } from 'utils/quasar-extends/base-props.js'
import { getIpdExecuteMedicationsItem, getIpdProgressNote, getIpdProceduresItem, getIpdNursingNote } from 'api'
import { cloneDeep } from 'lodash-es'
import setSearchQuery from 'utils/setSearchQuery.js'

// components
import HospitalizedExamine from './HospitalizedExamine.vue'
import ProgressTable from 'components/opd/ProgressTable.vue'
import MedicineTable from 'components/opd/MedicineTable.vue'
import ProcedureTable from 'components/opd/ProcedureTable.vue'
import { useRoute } from 'vue-router'

const recordType = ref('HospitalizedExamine')
const props = defineProps({
  selectedItem: Object,
})
// 病程紀錄
const progressNoteData = ref([])

const progressNoteColumns = ['action', 'ProgressNoteDate', 'PomrDescription', 'AttendingDocName', 'WritingDocName']

const loadingProgressNote = ref(false)
const GetIpdProgressNote = async () => {
  loadingProgressNote.value = true
  const query = setSearchQuery({ $filter: `IpdId eq '${props.selectedItem?.IpdId}'` })
  try {
    const res = await getIpdProgressNote(query)
    if (res.status === 200) {
      progressNoteData.value = cloneDeep(res.data.Items)
    }
  } catch (error) {
    console.log(error)
  } finally {
    loadingProgressNote.value = false
  }
}
// 用藥
const medicineRows = ref([])
const medicineColumns = [
  'MedicineId',
  'Name',
  'DoseOnce',
  'UnitName',
  'FrequencyCode',
  'OneDayInHospital',
  'MedicationDays',
  'MedicationDays2',
  'Formula',
  'Mill',
  'StartDate',
  'EndDate',
  'TotalAmount2',
  'TotalAmount',
  'ChronicNotes',
  'RouteCode',
]

const loadingMedicine = ref(false)

const GetIpdExecuteMedicationsItem = async () => {
  loadingMedicine.value = true
  try {
    const res = await getIpdExecuteMedicationsItem(props.selectedItem?.IpdId)
    if (res.status === 200) {
      medicineRows.value = cloneDeep(res.data.IpdMedications)
    }
  } catch (error) {
    console.log(error)
  } finally {
    loadingMedicine.value = false
  }
}

//檢查
const proceduresColumns = [
  'index',
  'ProcedureDate',
  'ProcedureCode',
  'Name',
  'TreatmentSites',
  'EmergencyFlag',
  'Amount',
  'Price',
  'Note',
  'SelfFlag',
]

const proceduresRows = ref([])

const loadingIpdProcedures = ref(false)
const GetIpdProceduresItem = async () => {
  loadingIpdProcedures.value = true
  try {
    const res = await getIpdProceduresItem(props.selectedItem?.IpdId)
    if (res.status === 200) {
      proceduresRows.value = cloneDeep(res.data.IpdProcedures)
    }
  } catch (error) {
    console.log(error)
  } finally {
    loadingIpdProcedures.value = false
  }
}

// 護理紀錄
const leftInfoLoading = ref(false)

const recordData = ref([])

// 獲取病人資訊 護理紀錄
const GetIpdNursingNote = async () => {
  const query = setSearchQuery({ $filter: `IpdId eq '${props.selectedItem?.IpdId}'` })
  leftInfoLoading.value = true
  try {
    const res = await getIpdNursingNote(query)
    if (res.status === 200) {
      recordData.value = res.data.Items
    }
  } catch (error) {
    console.log(error)
  } finally {
    leftInfoLoading.value = false
  }
}

const resetData = () => {
  progressNoteData.value = []
  medicineRows.value = []
  proceduresRows.value = []
  recordData.value = []
}

watch(props.selectedItem, (newVal, oldVal) => {
  if (!!newVal) getIpdData()
  else resetData()
})

const getIpdData = () => {
  GetIpdProgressNote()
  GetIpdExecuteMedicationsItem()
  GetIpdProceduresItem()
  GetIpdNursingNote()
}

const init = () => {}
init()
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: flex-start;
  align-items: flex-start;

  margin-bottom: 10px;
  padding: 0;
  width: 100%;
  border: #becce2 1px solid;
}
.record-bar {
  display: grid;
  grid-template-columns: 250px 150px 1fr;
  font-size: 18px;
  font-weight: 700;
  line-height: 30px;
  padding: 0 4px;
  width: 100%;
  border-bottom: #a4bde3 1px solid;
  background: #eeeeee;
}
.textSaved {
  width: 100%;
  height: 63px;
  line-height: 20px;
  font-size: 16px;

  margin: 0;
  padding: 5px;
  text-align: left;
  background: #ffffff;
  overflow: hidden;
}
</style>

