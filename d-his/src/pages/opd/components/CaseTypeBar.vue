<template>
  <div
    class="grow flex gap-2 items-center font-normal text-sm"
    v-if="opdStore.opdData.RoomBooking.AttendCategory !== '4'"
  >
    <q-option-group
      v-model="opdTypeSelected"
      :options="opdTypeOptions"
      inline
      :disable="route.query.history === 'true'"
      @update:model-value="onOpdTypeSelect"
    ></q-option-group>
    <my-input-wrapper label="疾病名稱" v-if="opdTypeSelected === 'specificDisease'">
      <q-select
        style="min-width: 200px"
        ref="specificDiseaseItemRef"
        v-bind="QSelectProps"
        v-model="opdStore.opdData.OpdTcmSpecificDiseaseProcedure"
        :options="specificDiseaseItems"
        option-label="ProcedureCname"
        option-value="ProcedureCode"
        :rules="[(val, rules) => val || '請選擇特定疾病']"
        :clearable="false"
        @update:model-value="specificDiseaseChange"
        :disable="route.query.history === 'true'"
      >
      </q-select>
    </my-input-wrapper>
    <my-input-wrapper label="案件分類">
      <q-field
        v-bind="QInputProps"
        :model-value="opdStore.opdData.RoomBooking.CaseType"
        :readonly="opdTypeSelected === 'casePayment'"
      >
        <template #control>
          <div class="min-w-[120px]">
            {{ opdStore.opdData.RoomBooking.CaseType }} -
            {{ caseTypeItems.find((item) => item.No === opdStore.opdData.RoomBooking.CaseType)?.Name }}
          </div>
        </template>
        <template #append>
          <q-btn
            size="md"
            color="primary"
            icon="search"
            unelevated
            dense
            @click="onCaseTypeClick"
            :disable="opdTypeSelected === 'casePayment'"
          ></q-btn>
        </template>
      </q-field>
    </my-input-wrapper>
    <div class="flex items-center gap-1 ml-1" v-if="opdTypeSelected === 'casePayment'">
      <my-input-wrapper label="診療項目">
        <q-select
          style="min-width: 200px"
          ref="diagnosisItemRef"
          v-bind="QSelectProps"
          v-model="diagnosisItem"
          :options="diagnosisItems"
          :option-label="(opt) => (opt ? opt?.ProcedureCname : null)"
          :rules="[(val, rules) => val?.ProcedureId || '請選擇診療項目']"
          :clearable="false"
          option-value="ProcedureId"
          @update:model-value="diagnosisItemChange"
          :disable="twdrgData?.Id !== 0"
        >
        </q-select>
      </my-input-wrapper>
      <div v-if="twdrgData?.Id !== 0">
        <q-btn class="bg-pink-6 text-white ml-2" unelevated dense label="支付點數核算" @click="paymentDetail"></q-btn>
        <span class="ml-2 font-bold">已達成65%以上</span>
        <q-checkbox size="sm" v-model="sixtyFivePercent" disable></q-checkbox>
      </div>
      <q-btn
        class="bg-purple-10 text-white"
        unelevated
        dense
        label="診療項目要求表記錄"
        @click="openTreamentCard"
      ></q-btn>
    </div>
    <div class="flex items-center gap-1 ml-1" v-if="opdTypeSelected === 'specificDisease'">
      <q-btn
        class="bg-purple-10 text-white"
        unelevated
        dense
        label="診療項目要求表記錄"
        @click="openSpecificDiseaseCard"
      ></q-btn>
      <div
        class="border border-blue-600 ml-1 p-1"
        v-if="
          opdStore.opdData?.OpdTcmSpecificDiseaseProcedure?.CumulativeCount >= 0 &&
          opdStore.opdData?.OpdTcmSpecificDiseaseProcedure?.CumulativeCount !== null
        "
      >
        累計次數 : {{ opdStore.opdData?.OpdTcmSpecificDiseaseProcedure?.CumulativeCount }}
      </div>
    </div>
  </div>
</template>
<script setup>
import {
  getProcedure,
  getOpdNhiPointInfo,
  getOpdPieceProcedure,
  getOpdPieceProcedureList,
  getCaseTypeList,
  getCommonData,
  getTcmSpecificDiseaseList,
} from 'api'
import { ref, reactive, watch, computed, inject, nextTick } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { QTableProps, QInputProps, QSelectProps } from 'utils/quasar-extends/base-props.js'
import setSearchQuery from 'utils/setSearchQuery'
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router'
import { cloneDeep, flattenDeep } from 'lodash-es'
import { useOpdStore } from 'stores/opd.js'
import { useAuthStore } from 'stores/auth'
import dayjs from 'dayjs'

import TreamentCardDialog from '../components/TreamentCardDialog.vue'
import PaymentDetail from 'pages/newStayHospitalMedicalOrder/create-medical-order/case-payment/components/PaymentDetail.vue'
import SelectCaseType from '../components/SelectCaseType.vue'
import SpecificDiseaseCardDialog from '../components/SpecificDiseaseCardDialog.vue'

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()
const $q = useQuasar()
const opdStore = useOpdStore()
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()

const originCaseType = inject('originCaseType')

// 論病例計酬 & twdrgs 相關資料
const loadingCasePayment = inject('loadingCasePayment')
const opdTypeSelected = inject('opdTypeSelected')
const opdTypeOptions = computed(() => {
  if (diagnosisItems.value.length === 0 && specificDiseaseItems.value.length === 0) {
    return [{ label: '一般門診', value: 'normal' }]
  } else {
    if (opdStore.opdData.DclDepartmentNo === '60') {
      return [
        { label: '一般門診', value: 'normal' },
        { label: '特定疾病', value: 'specificDisease' },
      ]
    } else {
      return [
        { label: '一般門診', value: 'normal' },
        { label: '門診論病例計酬', value: 'casePayment' },
      ]
    }
  }
})

// 獲取診療項目
const diagnosisItemRef = ref(null)

const diagnosisItems = ref([])
const diagnosisItem = ref({})
const procedureId = inject('procedureId')

const GetOpdPieceProcedureList = async () => {
  loadingCasePayment.value = true
  try {
    const query = setSearchQuery({
      opdId: route.params.opdId,
    })
    const res = await getOpdPieceProcedureList(query)
    if (res.status === 200) {
      diagnosisItems.value = cloneDeep(res.data)
      if (twdrgData.value?.ProcedureId) {
        diagnosisItem.value = res.data.find((item) => item.ProcedureId === twdrgData.value?.ProcedureId)
        procedureId.value = diagnosisItem.value?.ProcedureId
      }
    }
  } catch (error) {
    console.log(error)
  } finally {
    loadingCasePayment.value = false
  }
}

// 診療項目要求
const diagnosisItemChange = () => {
  procedureId.value = diagnosisItem.value.ProcedureId
  GetIpdPieceProcedureItem()
  GetProcedure(diagnosisItem.value.NhiCode)
}

const GetIpdPieceProcedureItem = async () => {
  try {
    const query = setSearchQuery({
      procedureId: procedureId.value,
    })
    const res = await getOpdPieceProcedure(query) //0016070
    if (res.status === 200) {
      twdrgData.value = cloneDeep(res.data)
    }
  } catch (err) {
    console.log(err)
  }
}
const openTreamentCard = () => {
  diagnosisItemRef.value.validate()
  if (diagnosisItem.value?.ProcedureId === undefined) {
    return
  }
  const dialog = $q
    .dialog({
      component: TreamentCardDialog,
      componentProps: {
        pieceProcedureSteps: twdrgData.value.PieceProcedureSteps,
        autoSave: true,
        onDone(procedureCode) {
          GetProcedure(procedureCode)
        },
      },
    })
    .onOk(() => {
      dialog.hide()
    })
}

const GetProcedure = async (procedureCode) => {
  try {
    const query = setSearchQuery({
      $top: 50,
      $filter: `(startswith(ProcedureCode,'${procedureCode}'))`,
    })
    const res = await getProcedure(query)
    if (res.status === 200) {
      const resultItems = cloneDeep(res.data.Items)
      onProcedureAdd(resultItems[0])
    }
  } catch (err) {
    console.log(err)
  }
}

const allMedicalPartItems = ref([])
const GetMedicalPart = async () => {
  try {
    const query = setSearchQuery({
      $filter: "Category eq 'MedicalPart'",
    })
    const res = await getCommonData(query)
    allMedicalPartItems.value = res.data.Items
  } catch (err) {
    console.log(err)
  }
}

const onProcedureAdd = (opt, rows) => {
  const newProcedure = {}
  newProcedure.ProcedureCode = opt.ProcedureCode
  newProcedure.ProcedureId = opt.ProcedureId
  newProcedure.ProcedureCname = opt.ProcedureCname
  newProcedure.ProcedureEname = opt.ProcedureEname
  newProcedure.Price = opt.AfterNhiPoint
  newProcedure.SelfPrice = opt.AfterNhiPoint
  newProcedure.EmergencyFlag = false
  newProcedure.SelfPayFlag = false
  newProcedure.Amount = 1
  newProcedure.TreatmentSites = []
  if (opt.TreatmentSiteRestricts.length === 0) {
    newProcedure.TreatmentSiteRestricts = allMedicalPartItems.value
  } else {
    newProcedure.TreatmentSiteRestricts = allMedicalPartItems.value.filter((item) => {
      return opt.TreatmentSiteRestricts.includes(item.No)
    })
  }
  if (opdStore.opdData.OpdProcedures[0] !== undefined) {
    opdStore.opdData.OpdProcedures.push(newProcedure)
  } else {
    opdStore.opdData.OpdProcedures[0] = newProcedure
  }
}

//支付點數
const paymentDetail = async () => {
  await GetOpdNhiPointInfo()
  const dialog = $q.dialog({
    component: PaymentDetail,
    componentProps: {
      nhiPointData: nhiPointData.value,
    },
  })
}

const nhiPointData = ref({})
const sixtyFivePercent = ref(false)
const GetOpdNhiPointInfo = async () => {
  try {
    const params = `?Id=${twdrgData.value.Id}`
    const res = await getOpdNhiPointInfo(params) //params
    if ((res.status = 200)) {
      nhiPointData.value = res.data
      if (res.data.CompletedPercent >= 65) {
        sixtyFivePercent.value = true
      } else {
        sixtyFivePercent.value = false
      }
    }
  } catch (err) {
    console.log(err)
  }
}

const caseTypeItems = ref([])
const GetCaseTypeList = async () => {
  try {
    const res = await getCaseTypeList()
    if (res.status === 200) {
      //先前端強行filter
      if (opdStore.opdData.DclDepartmentNo === '40') {
        caseTypeItems.value = res.data.filter((item, index) => {
          return (index > 8 && index <= 15) || index >= 25
        })
      } else if (opdStore.opdData.DclDepartmentNo === '60') {
        caseTypeItems.value = res.data.filter((item, index) => {
          return (index > 15 && index <= 24) || index >= 25
        })
      } else {
        caseTypeItems.value = res.data.filter((item, index) => {
          return index < 9 || index >= 25
        })
      }
    }
  } catch (err) {
    console.log(err)
  }
}

const onOpdTypeSelect = () => {
  if (opdTypeSelected.value === 'casePayment') {
    nextTick(() => {
      diagnosisItemRef.value.validate()
    })
  }
  if (opdTypeSelected.value === 'specificDisease') {
    nextTick(() => {
      specificDiseaseItemRef.value.validate()
    })
  }
  setCaseType('opdType', opdTypeSelected.value)
  opdStore.opdData.OpdTcmSpecificDiseaseProcedure = null
}

const onCaseTypeClick = () => {
  $q.dialog({
    component: SelectCaseType,
    componentProps: {
      items: caseTypeItems.value,
    },
  }).onOk((caseTypeNo) => {
    opdStore.opdData.RoomBooking.CaseType = caseTypeNo
  })
}
// 設定案件分類 若opdRecord資料 有影響到案件分類就一定要走進來這個function
const setCaseType = (type, caseTypecode) => {
  switch (type) {
    case 'opdType':
      if (opdTypeSelected.value === 'casePayment') {
        opdStore.opdData.RoomBooking.CaseType = 'C1'
      } else if (opdTypeSelected.value === 'specificDisease') {
        opdStore.opdData.RoomBooking.CaseType = '30'
      } else {
        opdStore.opdData.RoomBooking.CaseType = originCaseType.value
      }
      break
    case 'procedure':
      opdStore.opdData.RoomBooking.CaseType = '13'
      break
    case 'chronic':
      if (caseTypecode !== undefined) {
        opdStore.opdData.RoomBooking.CaseType = caseTypecode
      } else if (opdStore.opdData.DclDepartmentNo === '60') {
        opdStore.opdData.RoomBooking.CaseType = '24'
      } else if (opdStore.opdData.DclDepartmentNo !== '60' && opdStore.opdData.DclDepartmentNo !== '40') {
        opdStore.opdData.RoomBooking.CaseType = '04'
      }
      break
    case 'ChronicNotes':
      if (opdStore.opdData.DclDepartmentNo === '60') {
        opdStore.opdData.RoomBooking.CaseType = '28'
      } else if (opdStore.opdData.DclDepartmentNo !== '60' && opdStore.opdData.DclDepartmentNo !== '40') {
        opdStore.opdData.RoomBooking.CaseType = '08'
      }
      break
    default:
      break
  }
}
defineExpose({ setCaseType })

// 設定門診類別
const twdrgData = inject('twdrgData')
const setOpdType = () => {
  //設定門診類別 和 生成空的 twdrgs表格
  if (opdStore.opdData.OpdPieceProcedure === null) {
    opdTypeSelected.value = 'normal'
    twdrgData.value = { Id: 0, DiagnosisItems: [], Icd10PcsItems: [] }
  } else {
    opdTypeSelected.value = 'casePayment'
    //如果是看診的狀態 twdrg 要撈OpdPieceProcedure
    if (route.name === 'OpdRecord-Detail' && route.query.history !== 'true') {
      twdrgData.value = opdStore.opdData.OpdPieceProcedure
    } else {
      //如果是查看歷史紀錄的狀態 twdrg 要另外撈 OpdDiagnoses OpdIcd10PcsItems 因為 OpdPieceProcedure 是存最新那次的論病例計酬 是用來給新一次看診時沿用的
      opdStore.opdData.OpdPieceProcedure.DiagnosisItems = opdStore.opdData.OpdDiagnoses
      opdStore.opdData.OpdPieceProcedure.Icd10PcsItems = opdStore.opdData.OpdIcd10PcsItems
      twdrgData.value = opdStore.opdData.OpdPieceProcedure
    }
  }
  //設定門診類別 for 中醫
  if (opdStore.opdData.OpdTcmSpecificDiseaseProcedure !== null && opdStore.opdData.DclDepartmentNo === '60') {
    opdTypeSelected.value = 'specificDisease'
  }
}
//中醫相關
const specificDiseaseItemRef = ref()
const specificDiseaseItems = ref([])

const specificDiseaseChange = (val) => {
  opdStore.opdData.OpdTcmSpecificDiseaseProcedure = val
  GetProcedure(val.ProcedureCode)
}

const openSpecificDiseaseCard = () => {
  specificDiseaseItemRef.value.validate()
  if (!opdStore.opdData.OpdTcmSpecificDiseaseProcedure) {
    return
  }
  const dialog = $q
    .dialog({
      component: SpecificDiseaseCardDialog,
      componentProps: {
        SpecificDisease: opdStore.opdData.OpdTcmSpecificDiseaseProcedure,
        readonly: route.query.history === 'true',
        onDone(rowIndex) {
          opdStore.opdData.OpdTcmSpecificDiseaseProcedure.ProcedureRequestFormItems[rowIndex].ExecutionDatetime = dayjs(
            new Date()
          ).format('YYYY-MM-DD')
        },
      },
    })
    .onOk(() => {
      dialog.hide()
    })
}

//取得中醫特定疾病List
const GetTcmSpecificDiseaseList = async () => {
  const query = setSearchQuery({
    opdId: route.params.opdId,
  })
  try {
    const res = await getTcmSpecificDiseaseList(query)
    if (res.status === 200) {
      specificDiseaseItems.value = cloneDeep(res.data)
    }
  } catch (err) {
    console.log(err)
  }
}

const init = () => {
  if (originCaseType.value) {
    setOpdType()
    GetOpdPieceProcedureList()
    GetMedicalPart()
    GetTcmSpecificDiseaseList()
  }
  GetCaseTypeList()
}
init()
</script>

