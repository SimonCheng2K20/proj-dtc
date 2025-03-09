<template>
  <q-page>
    <my-title>
      <data-header class="w-full" :items="patientTitle">
        <q-btn
          class="ml-2"
          label="重大傷病"
          :color="patientMajorInjuryList.length > 0 ? 'pink' : 'grey'"
          :icon="patientMajorInjuryList.length > 0 ? 'check' : 'check_box_outline_blank'"
          dense
          unelevated
          :disable="patientMajorInjuryList.length === 0"
          @click="openMajorInjuryDialog"
        ></q-btn>
        <q-btn
          class="ml-2"
          label="慢"
          color="primary"
          dense
          unelevated
          @click="usePreChronicMedications"
          v-if="preChronicMedications.length !== 0"
        ></q-btn>
      </data-header>

      <div class="mt-1 flex items-center gap-1">
        <ActionBtns></ActionBtns>
        <q-btn
          class="header-btn"
          v-for="btn in btns"
          :key="btn.key"
          @click="btnsClickHandler(btn.key)"
          :label="btn.label"
          unelevated
          dense
        ></q-btn>
        <q-btn
          v-if="opdStore.opdData.DclDepartmentNo === '40'"
          class="header-btn"
          label="手術同意書"
          unelevated
          dense
          @click="openTeethConsentDialog"
        ></q-btn>
        <q-btn class="header-btn" label="新預約住院測試" unelevated dense @click="openStayBedScheduleDialog"></q-btn>
      </div>
      <div class="mt-1 flex w-full gap-1">
        <CaseTypeBar ref="CaseTypeBarRef" :key="originCaseType"></CaseTypeBar>
        <div class="flex grow items-center justify-end gap-1 text-sm font-normal">
          <q-btn
            :color="hasTrace ? 'orange-6' : 'blue-6'"
            :label="hasTrace ? '編輯個案追蹤' : '加入個案追蹤'"
            dense
            unelevated
            @click="onEditTrace"
            :loading="initLoading"
          ></q-btn>
          <q-btn color="purple-6" label="完成醫囑" dense unelevated @click="onSaveClick" :loading="saveLoading"></q-btn>
          <q-btn
            color="indigo-14"
            label="暫存"
            dense
            unelevated
            @click="onTempSaveClick"
            v-if="route.query.history !== 'true'"
            :loading="saveLoading"
          ></q-btn>
          <q-btn
            color="lime-6"
            label="回上一頁"
            dense
            unelevated
            @click="route.query.backpath ? router.push(route.query.backpath) : router.go(-2)"
          ></q-btn>
        </div>
      </div>
    </my-title>

    <div class="px-2 pt-1 pb-5">
      <div
        class="grid grid-cols-2 gap-1"
        v-if="
          opdTypeSelected === 'normal' ||
          (opdTypeSelected === 'specificDisease' && opdStore.opdData.OpdTcmSpecificDiseaseProcedure !== null) ||
          (opdTypeSelected === 'casePayment' && procedureId !== null)
        "
      >
        <subjective-content
          ref="subjectiveContentRef"
          v-model="opdStore.opdData.Subjective"
          preset
        ></subjective-content>
        <objective-content
          ref="objectiveContentRef"
          v-model="opdStore.opdData.Objective"
          v-model:bloodPressureHigh="opdStore.opdData.BloodPressureHigh"
          v-model:bloodPressureLow="opdStore.opdData.BloodPressureLow"
          v-model:pulse="opdStore.opdData.Pulse"
          v-model:height="opdStore.opdData.Height"
          v-model:weight="opdStore.opdData.Weight"
          :patientId="opdStore.opdData.PatientId"
          preset
        ></objective-content>
        <ChiSubjective
          v-if="opdStore.opdData.DclDepartmentNo === '60'"
          ref="chiSubjectiveRef"
          class="col-span-2"
          :fourItems="opdStore.opdData.OpdTcmFourDiagnosisItems"
          :eightItems="opdStore.opdData.OpdTcmEightPrincipleItems"
        ></ChiSubjective>
        <template v-if="opdTypeSelected !== 'casePayment'">
          <icd-table
            class="min-h-[180px]"
            ref="icdTableRef"
            :key="opdStore.opdData.OpdTcmSpecificDiseaseProcedure?.ProcedureId"
            :specificDisease="opdStore.opdData.OpdTcmSpecificDiseaseProcedure"
            v-model:rows="opdStore.opdData.OpdDiagnoses"
            :columns="icdColumns"
            :DclDepartmentNo="opdStore.opdData.DclDepartmentNo"
            preset
            @click="selectedArea = 'OpdDiagnoses'"
          >
            <template #btn-expand>
              <q-btn color="primary" label="科室公用組套" dense unelevated @click="openDiagnosisHotkeyDialog"></q-btn>
            </template>
          </icd-table>
          <PlanContent ref="planContentRef" v-model="opdStore.opdData.OpdPlan"></PlanContent>
          <!-- v-if="opdStore.opdData.RoomBooking.AttendCategory === '4'" -->
          <!-- <ChronicTable
            v-model:rows="opdStore.opdData.OpdChronics"
            :DclDepartmentNo="opdStore.opdData.DclDepartmentNo"
            preset
            @setCaseType="setCaseType"
            v-else
          ></ChronicTable> -->
        </template>
        <div v-if="opdTypeSelected === 'casePayment'" class="col-span-2">
          <TwDRGs
            ref="twDrgsTableRef"
            v-model:twDRGsIcdTable="twdrgData.DiagnosisItems"
            v-model:twDRGsPcsTable="twdrgData.Icd10PcsItems"
            :key="procedureId"
            :procedureId="procedureId"
            :icdColumns="icdColumns"
            :pcsColumns="pcsColumns"
            :loading="loadingCasePayment"
          ></TwDRGs>
        </div>

        <!-- v-show="isShowProcedureTable" -->
        <medicine-table
          ref="medicineTableRef"
          class="col-span-full"
          v-model:rows="opdStore.opdData.OpdMedications"
          :columns="medicineColumns"
          :DclDepartmentNo="opdStore.opdData.DclDepartmentNo"
          preset
        >
          <!-- <template #btn-expand>
            <q-btn
              label="P 治療計畫"
              color="yellow-100"
              text-color="black"
              dense
              unelevated
              @click="openPlanDialog"
              v-if="opdStore.opdData.RoomBooking.AttendCategory !== '4'"
            ></q-btn>
            <q-space></q-space>
          </template> -->
        </medicine-table>
        <procedure-table
          ref="procedureTableRef"
          class="col-span-full"
          v-model:rows="opdStore.opdData.OpdProcedures"
          :columns="procedureColumns"
          :isShowExamination="route.query.history !== 'true'"
          :DclDepartmentNo="opdStore.opdData.DclDepartmentNo"
          @setCaseType="setCaseType"
          preset
        ></procedure-table>
      </div>
    </div>

    <!-- <q-page-sticky class="z-20 opacity-80" position="top-left" :offset="fabPos">
      <q-fab
        padding="4px 12px"
        @click="useProcedureTable"
        color="yellow-9"
        icon="add_card"
        label="E"
        :disable="draggingFab"
        v-touch-pan.prevent.mouse="moveFab"
      />
    </q-page-sticky> -->
  </q-page>
</template>

<script setup>
import {
  getPatientTraceItem,
  getOpdMajorInjury,
  putOpdRecord,
  postOpd,
  getNextRegId,
  roomBookingChangeStatus,
  postCalcCharge,
  getWriteNhiCardBase64,
  getOpdPreChronicMedications,
  getExportChronicMedicine,
} from 'api'
import { QInputProps, QSelectProps } from 'utils/quasar-extends/base-props.js'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { computed, reactive, ref, watch, onMounted, nextTick, h, defineAsyncComponent, provide } from 'vue'
import { cloneDeep, flattenDeep } from 'lodash-es'
import dataHeader from 'components/DataHeader.vue'
import TraceEditItem from './components/TraceEditItem.vue'
import { useQuasar } from 'quasar'
import setSearchQuery from 'utils/setSearchQuery'
import dayjs from 'dayjs'
import { useCardReaderStore } from 'stores/card-reader.js'
import { useOpdStore } from 'stores/opd.js'
import DataHeader from 'components/DataHeader.vue'
import MedicineTable from 'components/opd/MedicineTable.vue'
import ProcedureTable from 'components/opd/ProcedureTable.vue'
import IcdTable from 'components/opd/IcdTable.vue'
import PlanContent from 'components/opd/PlanContent.vue'
import ChronicTable from 'components/opd/ChronicTable.vue'
import { useAuthStore } from 'stores/auth'
import DiagnosisHotkeyDialog from 'pages/opd/components/DiagnosisHotkeyDialog.vue'
import SubjectiveContent from 'src/components/opd/SubjectiveContent.vue'
import ObjectiveContent from 'components/opd/ObjectiveContent.vue'
import TwDRGs from 'components/tw-drgs/TwDRGs.vue'
import PlanDialog from './components/PlanDialog.vue'
import CertificateDialog from './components/CertificateDialog.vue'
import MajorInjuryDialog from './components/MajorInjuryDialog.vue'
import TeethConsentDialog from './components/TeethConsentDialog.vue'
import ActionBtns from './components/detail-action-btns/ActionBtns.js'
import ConfirmDialog from 'components/ConfirmDialog.vue'
import ChiSubjective from './components/ChiSubjective.vue'
import CaseTypeBar from './components/CaseTypeBar.vue'
import StayBedScheduleDialog from 'components/StayBedScheduleDialog.vue'

const authStore = useAuthStore()
const $q = useQuasar()
const cardReaderStore = useCardReaderStore()
const opdStore = useOpdStore()

const medicineColumns = [
  'index',
  'MedicineId',
  'book',
  'Name',
  'DoseOnce',
  'MedicationUnitCode',
  'FrequencyCode',
  'TimesOneDay',
  'MedicationDays',
  'MedicationDays2',
  'Formula',
  'Mill',
  'TotalAmount',
  'TotalAmount2',
  'ChronicNotes',
  'RouteCode',
  'action',
]

const procedureColumns = [
  'index',
  'ProcedureCode',
  'Name',
  'TreatmentSites',
  'ToothSurface',
  'EmergencyFlag',
  'Amount',
  'SelfPrice',
  'Note',
  'SelfPayFlag',
  'SelfFlag',
  'action',
]

const icdColumns = ['index', 'Icd10Code', 'Icd9Code', 'Name', 'action']
const pcsColumns = ['index', 'PcsCode', 'CName', 'action']

const subjectiveContentRef = ref()
const objectiveContentRef = ref()
const icdTableRef = ref()
const planContentRef = ref()
const twDrgsTableRef = ref()
const procedureTableRef = ref()
const medicineTableRef = ref()
const chiSubjectiveRef = ref()

const route = useRoute()
const router = useRouter()

const btns = reactive([
  { key: 'certificate', label: '開立證明' },
  { key: 'f4', label: '雲端藥歷' },
  { key: 'f12', label: '開立轉診單' },
])

const patientTitle = computed(() => {
  return [
    { label: '目前診號', value: opdStore.opdData.RoomBooking.Seq },
    { label: '病歷號', value: opdStore.opdData.PatientId },
    { label: '姓名', value: opdStore.opdData.PersonName },
    { label: '性別', value: opdStore.opdData.Gender },
    { label: '年齡', value: opdStore.opdData.Age },
    {
      label: '生日',
      value: opdStore.opdData.BirthDate ? dayjs(opdStore.opdData.BirthDate).format('YYYY-MM-DD') : null,
    },
    { label: '身分證號', value: opdStore.opdData.Idetifier },
    { label: '身份別', value: opdStore.opdData.IdentityName },
    { label: '過敏', value: opdStore.opdData.Allergy },
  ]
})

const btnsClickHandler = async (key) => {
  switch (key) {
    case 'certificate':
      openCertificateDilaog()
      break
    case 'f12':
      router.push({ name: 'OpdReferral', params: { opdId: route.params.opdId }, query: { backpath: route.fullPath } })
      break
  }
}

// 透過比對個案追蹤管理表格確定是否有加入過個案追蹤
const hasTrace = computed(() => traceData.value?.CreatedDatetime)
const traceData = ref(null)
const GetPatientTraceItem = async () => {
  try {
    const res = await getPatientTraceItem(opdStore.opdData.PatientId) //根據 "身分證" 做篩選
    if (res.status === 200) {
      traceData.value = res.data
      console.log('get trace', traceData.value)
    }
  } catch (err) {
    console.log(err)
  }
}

// 加入個案追蹤 dialog
const onEditTrace = () => {
  const dialog = $q
    .dialog({
      component: TraceEditItem,
      componentProps: {
        traceData: traceData.value,
        hasTrace: hasTrace.value ? true : false,
      },
    })
    .onOk(() => {
      GetPatientTraceItem()
      dialog.hide()
    })
}

// 開立證明
const openCertificateDilaog = () => {
  const dialog = $q
    .dialog({
      component: CertificateDialog,
    })
    .onOk(() => {
      dialog.hide()
    })
}
// 重大傷病
const openMajorInjuryDialog = () => {
  const dialog = $q
    .dialog({
      component: MajorInjuryDialog,
      componentProps: {
        patientMajorInjuryList: patientMajorInjuryList.value,
      },
    })
    .onOk(() => {
      dialog.hide()
    })
}
// 牙醫手術同意書
const openTeethConsentDialog = () => {
  const dialog = $q
    .dialog({
      component: TeethConsentDialog,
    })
    .onOk(() => {
      dialog.hide()
    })
}
// 牙醫手術同意書
const openStayBedScheduleDialog = () => {
  const dialog = $q
    .dialog({
      component: StayBedScheduleDialog,
    })
    .onOk(() => {
      dialog.hide()
    })
}

const opdDataValidate = () => {
  const validateResult = flattenDeep([
    subjectiveContentRef.value.validate(),
    objectiveContentRef.value.validate(),
    procedureTableRef.value.validate(),
    medicineTableRef.value.validate(),
  ])

  if (opdTypeSelected.value === 'normal') {
    validateResult.push(icdTableRef.value.validate())
  }
  if (opdTypeSelected.value === 'casePayment') {
    validateResult.push(twDrgsTableRef.value.validate()[0])
    validateResult.push(twDrgsTableRef.value.validate()[1])
  }

  for (const item of validateResult) {
    if (!item.result) {
      item.errorInputRef.focus()
      return false
    }
  }

  return true
}
const resetOpdDataValidate = () => {
  subjectiveContentRef.value.resetValidation()
  objectiveContentRef.value.resetValidation()
}

const setCloneOpdData = ({ status }) => {
  const cloneOpdData = cloneDeep(opdStore.opdData)
  cloneOpdData.OpdMedications = cloneOpdData.OpdMedications.filter(({ MedicineId }) => MedicineId)
  cloneOpdData.OpdProcedures = cloneOpdData.OpdProcedures.filter(({ ProcedureCode }) => ProcedureCode)

  const needOpdIdItems = ['OpdDiagnoses', 'OpdMedications', 'OpdProcedures', 'OpdChronics']
  for (const key of needOpdIdItems) {
    cloneOpdData[key] = cloneOpdData[key].map((item) => ({
      ...item,
      OpdId: cloneOpdData.OpdId,
    }))
  }

  if (opdStore.opdData.DclDepartmentNo === '60') {
    const chiData = chiSubjectiveRef.value.getData()
    cloneOpdData.OpdTcmFourDiagnosisItems = chiData[4]
    cloneOpdData.OpdTcmEightPrincipleItems = chiData[8]
  }

  cloneOpdData.Status = status
  cloneOpdData.TempFlag = status === '5'

  return cloneOpdData
}

const saveLoading = ref(false)
const onTempSaveClick = async (showNotify = true) => {
  saveLoading.value = true
  const status = '5'

  if (!opdDataValidate()) {
    saveLoading.value = false
    return
  }

  const cloneOpdData = setCloneOpdData({ status })
  if (opdTypeSelected.value === 'casePayment') {
    cloneOpdData.OpdPieceProcedure = twdrgData.value
    const copyOpdDiagnoses = cloneOpdData.OpdPieceProcedure.DiagnosisItems.map((item) => {
      item.OpdId = cloneOpdData.OpdId
      return item
    })
    cloneOpdData.OpdDiagnoses = copyOpdDiagnoses
  } else {
    cloneOpdData.OpdPieceProcedure = null
  }

  if (opdTypeSelected.value === 'specificDisease') {
    cloneOpdData.OpdTcmSpecificDiseaseProcedure.PatientTcmSpecificDisease.DiagnosisItems = cloneOpdData.OpdDiagnoses
  }

  const { error: putOpdRecordError } = await PutOpdRecord(cloneOpdData)
  const { error: roomBookingChangeStatusError } = await RoomBookingChangeStatus({ status })

  if (showNotify && !putOpdRecordError && !roomBookingChangeStatusError) {
    $q.notify({
      type: 'positive',
      message: '暫存醫囑成功',
      position: 'top',
    })
  }

  saveLoading.value = false
}

const onSaveClick = async () => {
  saveLoading.value = true
  const status = '6'

  if (!opdDataValidate()) {
    saveLoading.value = false
    return
  }

  const cloneOpdData = setCloneOpdData({ status })
  if (opdTypeSelected.value === 'casePayment') {
    cloneOpdData.OpdPieceProcedure = twdrgData.value
    const copyOpdDiagnoses = cloneOpdData.OpdPieceProcedure.DiagnosisItems.map((item) => {
      item.OpdId = cloneOpdData.OpdId
      return item
    })
    cloneOpdData.OpdDiagnoses = copyOpdDiagnoses
    cloneOpdData.OpdIcd10PcsItems = cloneOpdData.OpdPieceProcedure.Icd10PcsItems
  } else {
    cloneOpdData.OpdPieceProcedure = null
  }

  if (opdTypeSelected.value === 'specificDisease') {
    cloneOpdData.OpdTcmSpecificDiseaseProcedure.PatientTcmSpecificDisease.DiagnosisItems = cloneOpdData.OpdDiagnoses
  }

  const { error: putOpdRecordError } = await PutOpdRecord(cloneOpdData)
  const tasks = [RoomBookingChangeStatus({ status }), PostCalcCharge(cloneOpdData.OpdId)]
  const [{ error: roomBookingChangeStatusError }, { error: postCalcChargeError }] = await Promise.all(tasks)
  //如果有慢箋 執行慢箋單列印
  if (cloneOpdData.OpdMedications.some((i) => i.ChronicNotes === true)) {
    GetExportChronicMedicine(cloneOpdData.OpdId)
  }

  if (!roomBookingChangeStatusError && !putOpdRecordError && !postCalcChargeError) {
    $q.notify({
      type: 'positive',
      message: '完成醫囑成功',
      position: 'top',
    })

    // 寫入健保卡
    if (cloneOpdData.IdentityName !== '健保欠卡') {
      const { data: base64Data } = await GetWriteNhiCardBase64()
      const { data: cardData, error: writeHeathyCardError } = await cardReaderStore.writeHeathyCard(base64Data)
      if (writeHeathyCardError) {
        $q.notify({
          type: 'negative',
          message: '寫入健保卡失敗：' + writeHeathyCardError + '將遺失就醫序號',
          position: 'top',
          timeout: 4500,
        })
      } else {
        $q.notify({
          type: 'positive',
          message: '寫入健保卡資料成功',
          position: 'top',
          timeout: 4500,
        })
      }
      console.log('cardData', cardData)
      if (cardData) {
        Object.assign(cloneOpdData, cardData)
        console.log('cloneOpdData', cloneOpdData)
        const res = await PutOpdRecord(cloneOpdData)
        if (res.status === 204) {
          $q.notify({
            type: 'positive',
            message: '健保卡資料 成功寫入病患紀錄',
            position: 'top',
            timeout: 4500,
          })
        } else {
          $q.notify({
            type: 'positive',
            message: '健保卡資料 沒有寫入病患紀錄 將遺失就醫序號',
            position: 'top',
            timeout: 4500,
          })
        }
      }
    }

    if (route.query.history !== 'true') {
      toNextPatient()
    } else if (opdStore.opdData.RoomBooking.AttendCategory === '4') {
      router.push({ name: 'emergencyListIndex' })
    } else {
      router.push({ name: 'OpdList', params: { status: 2 } })
    }
  }

  saveLoading.value = false
}

const GetWriteNhiCardBase64 = async () => {
  try {
    const res = await getWriteNhiCardBase64(route.params.opdId)
    return { data: res.data.base64 }
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '取得寫卡資料失敗：' + (typeof error.data === 'string' ? error.data : JSON.stringify(error.data)),
      position: 'top',
    })
    return { error }
  }
}

const PutOpdRecord = async (opdData) => {
  try {
    const res = await putOpdRecord(opdData)
    return { data: res.data }
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '完成醫囑失敗：' + (typeof error.data === 'string' ? error.data : JSON.stringify(error.data)),
      position: 'top',
    })
    return { error }
  }
}

const PostCalcCharge = async (opdId) => {
  try {
    const res = await postCalcCharge(opdId)
    return { data: res.data }
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '計算批價失敗：' + (typeof error.data === 'string' ? error.data : JSON.stringify(error.data)),
      position: 'top',
    })
    return { error }
  }
}

const GetExportChronicMedicine = async (opdId) => {
  try {
    const res = await getExportChronicMedicine(opdId)
    if (res.status === 200) {
      window.open(res.data)
    }
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '慢箋單生成失敗：' + (typeof error.data === 'string' ? error.data : JSON.stringify(error.data)),
      position: 'top',
    })
  }
}

const toNextPatient = async () => {
  const { data } = await GetNextRegId()
  if (data) {
    PostOpd(data)
    const unwatch = watch(
      () => route.params.opdId,
      () => {
        init()
        unwatch()
      }
    )
    resetOpdDataValidate()
  } else {
    $q.notify({ type: 'positive', message: '門診結束', position: 'top' })

    if (opdStore.opdData.RoomBooking.AttendCategory === '4') {
      router.push({ name: 'emergencyListIndex' })
    } else {
      router.push({ name: 'OpdList', params: { status: 2 } })
    }
  }
}

const PostOpd = async (regId) => {
  try {
    const res = await postOpd(regId)
    opdStore.reset()
    router.replace({
      name: 'OpdRecord-Detail',
      params: { opdId: res.data },
    })
    return { data: res.data }
  } catch (error) {
    console.log(error)
    return { error }
  }
}

const GetNextRegId = async () => {
  try {
    const res = await getNextRegId()
    return { data: res.request.response }
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '取得下一號病患失敗：' + (typeof error.data === 'string' ? error.data : JSON.stringify(error.data)),
      position: 'top',
    })
    return { error }
  }
}

const RoomBookingChangeStatus = async ({ status }) => {
  try {
    const res = await roomBookingChangeStatus({
      RegId: opdStore.opdData.RegId,
      SetAttend: status,
    })
    opdStore.opdData.Status = status
    return { data: res.data }
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '變更掛號狀態失敗：' + (typeof error.data === 'string' ? error.data : JSON.stringify(error.data)),
      position: 'top',
    })
    return { error }
  }
}

onBeforeRouteLeave((to, from, next) => {
  if (
    to.name !== 'OpdRecord-Detail' &&
    to.name !== 'OpdRecord-Ditto' &&
    to.name !== 'OpdReferral' &&
    to.name !== 'sciSet'
  ) {
    if (opdStore.opdData.Status < 6) {
      //process.env.PROD &&
      const dialog = $q
        .dialog({
          component: ConfirmDialog,
          componentProps: {
            text: '您尚未完成醫囑，確定要離開嗎？',
          },
        })
        .onOk(() => {
          opdStore.reset()
          dialog.hide()
          next()
        })
    } else {
      // 方便測試不阻擋
      opdStore.reset()
      next()
    }
  } else {
    next()
  }
})

const openDiagnosisHotkeyDialog = () => {
  const dialog = $q
    .dialog({
      component: DiagnosisHotkeyDialog,
    })
    .onOk((rows) => {
      opdStore.setOpdData({ OpdDiagnoses: rows })
      dialog.hide()
    })
}

const openPlanDialog = () => {
  const dialog = $q
    .dialog({
      component: PlanDialog,
    })
    .onOk((newOpdPlan) => {
      opdStore.setOpdData({ OpdPlan: newOpdPlan })
      dialog.hide()
    })
}

// 獲取重大傷病名單
const patientMajorInjuryList = ref([])
const GetOpdMajorInjury = async () => {
  let data = {
    $filter: `patientId eq '${opdStore.opdData.PatientId}'`,
  }
  await getOpdMajorInjury(data).then((res) => {
    let resData = []
    if (res.data.Items.length) {
      for (let i = 1; i <= 5; i++) {
        if (res.data.Items[0]['MajorInjuryCode' + i]) {
          let obj = {}
          obj['MajorInjuryCode'] = res.data.Items[0]['MajorInjuryCode' + i]
          obj['ValidityPeriodEnd'] = res.data.Items[0]['ValidityPeriodEnd' + i]
          obj['ValidityPeriodStart'] = res.data.Items[0]['ValidityPeriodStart' + i]
          resData.push(obj)
        }
      }
    }
    patientMajorInjuryList.value = resData
  })
}
// CaseType Bar
const CaseTypeBarRef = ref(null)
// 論病例計酬 & twdrgs 相關資料
const loadingCasePayment = ref(false)
provide('loadingCasePayment', loadingCasePayment)
const opdTypeSelected = ref('normal')
provide('opdTypeSelected', opdTypeSelected)
const originCaseType = ref(null)
provide('originCaseType', originCaseType)
const procedureId = ref(null)
provide('procedureId', procedureId)
const twdrgData = ref({})
provide('twdrgData', twdrgData)

//中醫相關
// 設定 案件分類子組件中的案件分類 若opdRecord資料 有影響到案件分類就一定要走進來這個function
const setCaseType = (type, caseTypecode) => {
  CaseTypeBarRef.value.setCaseType(type, caseTypecode)
}
const setTableInit = () => {
  if (opdTypeSelected.value === 'normal') {
    if (opdStore.opdData.OpdDiagnoses.length === 0) icdTableRef.value.onAddRowClick()
  }
  // if (opdStore.opdData.OpdProcedures.length === 0) procedureTableRef.value.onAddRowClick()
  if (opdStore.opdData.OpdMedications.length === 0) medicineTableRef.value.onAddRowClick()
}

const fabPos = ref([5, 350])
const draggingFab = ref(false)
const moveFab = (ev) => {
  draggingFab.value = ev.isFirst !== true && ev.isFinal !== true
  fabPos.value = [fabPos.value[0] + ev.delta.x, fabPos.value[1] + ev.delta.y]
}
const isShowProcedureTable = ref(false)
const useProcedureTable = () => {
  isShowProcedureTable.value = !isShowProcedureTable.value
  if (isShowProcedureTable.value && opdStore.opdData.OpdProcedures.length === 0 && route.query.history !== 'true') {
    procedureTableRef.value.onAddRowClick()
  }
}

const preChronicMedications = ref([])
const GetOpdPreChronicMedications = async () => {
  const query = setSearchQuery({
    id: opdStore.opdData.PatientId,
  })
  try {
    const res = await getOpdPreChronicMedications(query)
    if (res.status === 200) {
      if (res.data.length !== 0) {
        preChronicMedications.value = cloneDeep(res.data)
      }
    }
  } catch (err) {
    console.log(err)
  }
}
const usePreChronicMedications = () => {
  opdStore.opdData.OpdMedications = preChronicMedications.value
}
const isMounted = ref(false)
onMounted(() => {
  isMounted.value = true
})
const initLoading = ref(false)
const init = async () => {
  initLoading.value = true
  isShowProcedureTable.value = false

  if (route.params.opdId && !opdStore.opdData.OpdId) {
    const { error } = await opdStore.GetOpdRecordItem(route.params.opdId)
    if (error) {
      $q.notify({
        type: 'negative',
        message: '取得病患資料發生錯誤：' + (typeof error.data === 'string' ? error.data : JSON.stringify(error.data)),
        position: 'top',
      })
    } else {
      originCaseType.value = opdStore.opdData.RoomBooking.CaseType
      GetPatientTraceItem()
      GetOpdMajorInjury()
      GetOpdPreChronicMedications()

      if (isMounted.value) {
        setTableInit()
      } else {
        const unwatch = watch(isMounted, (val) => {
          if (val) {
            setTableInit()
            unwatch()
          }
        })
      }
    }
  }

  initLoading.value = false
}

init()
</script>

