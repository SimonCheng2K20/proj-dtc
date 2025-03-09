<template>
  <q-page>
    <my-title>
      <div>個案追蹤</div>
      <AllergyBtn :patient-id="opdData.PatientId" :is-allergy="opdData.Allergy"></AllergyBtn>
      <ExaminationReportBtn :patient-id="opdData.PatientId" :opd-id="opdData.OpdId"></ExaminationReportBtn>
      <ImageReportBtn :patient-id="opdData.PatientId" :opd-id="opdData.OpdId"></ImageReportBtn>
      <q-space></q-space>
      <q-btn
        class="header-btn"
        dense
        unelevated
        label="返回個案追蹤管理"
        @click="router.push({ name: 'OpdTrace' })"
      ></q-btn>
      <data-header :items="patientTitle" bg-color="#FEF9E9" text-color="black"></data-header>
    </my-title>

    <DiseaseTable
      :disease="diseaseSelected"
      @selectDisease="selectDisease"
      v-if="diseaseSelected === '結核病' || diseaseSelected === '糖尿病'"
    ></DiseaseTable>
    <OpdRecordPage
      :isFromTracePage="true"
      :note="traceData.Notes"
      @selectDisease="selectDisease"
      @autoDiseaseSelect="autoDiseaseSelect"
      v-if="diseaseSelected === '其他'"
    ></OpdRecordPage>
  </q-page>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { getPatientTrace, getOpdRecordItem } from 'api'
import { ref, computed } from 'vue'
import dataHeader from 'components/DataHeader.vue'
import OpdRecordPage from 'pages/opd/OpdRecordPage.vue'
import DiseaseTable from './components/DiseaseTable.vue'
import AllergyBtn from 'pages/opd/components/detail-action-btns/AllergyBtn.vue'
import ExaminationReportBtn from 'pages/opd/components/detail-action-btns/ExaminationReportBtn.vue'
import ImageReportBtn from 'pages/opd/components/detail-action-btns/ImageReportBtn.vue'

const route = useRoute()
const router = useRouter()
const traceData = ref({})

const opdData = ref({
  OpdId: null,
  RegId: null,
  PatientId: null,
  Subjective: null,
  Objective: null,
  OpdPlan: null,
  SignedDocId: null,
  SignedDocName: null,
  Note: null,
  Height: null,
  Weight: null,
  Pulse: null,
  BloodPressureLow: null,
  BloodPressureHigh: null,
  Status: null,
  OpdDiagnoses: [],
  OpdMedications: [],
  OpdProcedures: [],
  Age: null,
  BirthDate: null,
  DepartmentName: null,
  Gender: null,
  Identity: null,
  IdentityDiscount: null,
  PartialAfford: null,
  SeekMedical: null,
  Prevent: null,
  Idetifier: null,
  Laboratory: null,
  PACS: null,
  PersonName: null,
  PrimaryIcd: null,
  RoomName: null,
  SignedDocId: null,
  SignedDocName: null,
  CreateDatetime: null,
  ModifyDatetime: null,
  Status: null,
  EName: null,
  Allergy: null,
  OpdChronics: [],
  OpdTooth: {},
})

const patientTitle = computed(() => {
  return [
    { label: '病歷號', value: opdData.value.PatientId },
    { label: '姓名', value: opdData.value.PersonName },
    { label: '性別', value: opdData.value.Gender },
    { label: '年齡', value: opdData.value.Age },
    { label: '生日', value: opdData.value?.BirthDate?.substring(0, 10) },
    { label: '身分證號', value: opdData.value.Idetifier },
    { label: '身份別', value: opdData.value.IdentityName },
    { label: '過敏', value: opdData.value.Allergy },
  ]
})

const GetPatientTrace = async () => {
  try {
    const res = await getPatientTrace(`?filter=PatientId eq '${route.query.PatientId}'`)
    if (res.status === 200) {
      traceData.value = res.data.Items[0]
      diseaseSelected.value = '其他'
    }
  } catch (err) {
    console.log(err)
  }
}

const diseaseSelected = ref(null)

const selectDisease = (disease) => {
  diseaseSelected.value = disease
}

//個案追蹤 第一次進入頁面 若有結核病 則選中
const firstPageUpdate = ref(false)
const autoDiseaseSelect = (data) => {
  opdData.value = data
  if (!firstPageUpdate.value) {
    firstPageUpdate.value = true
    if (traceData.value.PatientTraceTbs) {
      diseaseSelected.value = '結核病'
    } else {
      diseaseSelected.value = '其他'
    }
  }
}
const init = () => {
  GetPatientTrace()
}
init()
</script>

