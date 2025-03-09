<template>
  <div class="p-2">
    <div class="text-2xl text-center" v-if="diagnosisItem === null && !loadingCasePayment">
      只有婦產科住院有論病例計酬(院所等級為醫學中心的也沒有)
    </div>
    <div v-else>
      <div class="flex items-center">
        <span class="ml-4 border border-blue-500 px-2 font-bold bg-blue-200 h-9 leading-9">科別 </span>
        <span class="mx-2 font-bold">:</span>
        <q-tabs
          content-class="gap-2"
          class="text-white"
          v-model="mainTab"
          active-bg-color="pink-7"
          indicator-color="pink-7"
          dense
        >
          <q-tab class="border border-blue-500" :disable="loadingCasePayment" label="婦產科" name="婦產科" />
        </q-tabs>
        <my-input-wrapper label="診療項目" class="ml-3">
          <q-select
            v-bind="QSelectProps"
            v-model="diagnosisItem"
            :options="diagnosisItems"
            :option-label="(opt) => (opt ? opt.ProcedureCname : null)"
            option-value="ProcedureId"
            @update:model-value="freshCasePaymentData"
            :clearable="false"
            :disable="loadingCasePayment"
          >
          </q-select>
        </my-input-wrapper>
        <div v-if="hasDoctorQrder === true && !loadingCasePayment">
          <q-btn class="bg-pink-6 text-white ml-2" unelevated label="支付點數核算" @click="paymentDetail"></q-btn>
          <span class="ml-2 font-bold">已達成65%以上 </span>
          <q-checkbox v-model="sixtyFivePercent" disable></q-checkbox>
        </div>
      </div>
      <div v-if="loadingCasePayment">Loading...</div>
      <div v-else>
        <div class="p-2 text-[#0A2548] font-bold" v-if="hasDoctorQrder === true">
          案件分類：C1　　主診斷：{{ theIcd10UnderProcedureId }}　 處置碼：{{ thePcsCodeUnderProcedureId }}
          <q-btn
            class="ml-2"
            padding="0 5px"
            color="primary"
            unelevated
            dense
            label="修改醫囑"
            @click="editTwDRGs"
          ></q-btn>
        </div>
        <TwDRGs
          :key="procedureId"
          v-model:twDRGsIcdTable="twDRGsIcdTable"
          v-model:twDRGsPcsTable="twDRGsPcsTable"
          :DclDepartmentNo="'05'"
          :procedureId="procedureId"
          :loading="loadingCasePayment"
          v-if="hasDoctorQrder === false"
        >
          <template #bottom>
            <div class="flex justify-end mt-2">
              <q-btn
                class="bg-pink-10 text-white mx-2"
                @click="saveOrUpdate"
                v-if="hasDoctorQrder === false && readonly !== true"
                >完成醫囑</q-btn
              >
            </div>
          </template>
        </TwDRGs>
        <TreamentCard
          :pieceProcedureSteps="pieceProcedureSteps"
          :loading="loadingCasePayment"
          :readonly="readonly"
          @doneDoctorOrder="freshCasePaymentData"
          v-if="hasDoctorQrder === true"
        ></TreamentCard>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import { QSelectProps } from 'utils/quasar-extends/base-props.js'
import { getIpdPieceProcedureItem, getNhiPointInfo, postIpdPieceProcedure, getIpdPieceProcedureList } from 'api'
import { useAuthStore } from 'stores/auth'
import { useRoute } from 'vue-router'
import { groupBy, uniqBy } from 'lodash-es'
import setSearchQuery from 'utils/setSearchQuery.js'
import dayjs from 'dayjs'

import TwDRGs from 'components/tw-drgs/TwDRGs.vue'
import TwDRGsDialog from './components/TwDRGsDialog.vue'
import TreamentCard from './components/TreamentCard.vue'
import PaymentDetail from './components/PaymentDetail.vue'

const $q = useQuasar()
const route = useRoute()
const authStore = useAuthStore()

const props = defineProps({
  routeIpdId: String,
  readonly: Boolean,
})
const mainTab = ref('婦產科')
const procedureId = computed(() => {
  return diagnosisItem.value?.ProcedureId
})
const diagnosisItems = ref([])
const diagnosisItem = ref(null)

//獲取診療項目

const GetIpdPieceProcedureList = async () => {
  loadingCasePayment.value = true
  try {
    const query = setSearchQuery({
      ipdId: route.params.Id || props.routeIpdId,
    })
    const res = await getIpdPieceProcedureList(query)
    if (res.status === 200) {
      diagnosisItems.value = res.data
      if (diagnosisItems.value.length !== 0) {
        diagnosisItem.value = diagnosisItems.value[0]
      }
    }
  } catch (error) {
    console.log(error)
  } finally {
    loadingCasePayment.value = false
  }
}

const hasDoctorQrder = ref(false)
const pieceProcedureItem = ref(null)
const pieceProcedureSteps = ref(null)

const twDRGsIcdTable = ref([])
const twDRGsPcsTable = ref([])

const thePcsCodeUnderProcedureId = ref('')
const theIcd10UnderProcedureId = ref('')

const GetIpdPieceProcedureItem = async () => {
  try {
    const query = setSearchQuery({ ipdId: route.params.Id || props.routeIpdId, procedureId: procedureId.value })
    const res = await getIpdPieceProcedureItem(query) //0016070
    if (res.status === 200) {
      hasDoctorQrder.value = true
      theIcd10UnderProcedureId.value = res.data.DiagnosisItems.map((d) => d.Icd10Code).toString()
      thePcsCodeUnderProcedureId.value = res.data.Icd10PcsItems.map((d) => d.PcsCode).toString()
      pieceProcedureItem.value = res.data
      pieceProcedureSteps.value = res.data.IpdPieceProcedureSteps
      twDRGsIcdTable.value = res.data.DiagnosisItems
      twDRGsPcsTable.value = res.data.Icd10PcsItems
      GetNhiPointInfo()
    } else {
      hasDoctorQrder.value = false
      twDRGsIcdTable.value = []
      twDRGsPcsTable.value = []
    }
  } catch (err) {
    console.log(err)
  }
}

// 完成醫囑
const saveOrUpdate = () => {
  PostIpdPieceProcedure()
}

const PostIpdPieceProcedure = async () => {
  const DiagnosisItems = twDRGsIcdTable.value.map((item) => {
    return { ...item, DiagnosisDate: dayjs() }
  })
  const Icd10PcsItems = twDRGsPcsTable.value.map((item) => {
    return { ...item, Icd10PcsDate: dayjs() }
  })
  const body = {
    DiagnosisItems: DiagnosisItems,
    Icd10PcsItems: Icd10PcsItems,
    IpdId: route.params.Id || props.routeIpdId,
    ProcedureId: procedureId.value,
  }
  try {
    const res = await postIpdPieceProcedure(body) //0016070
    if (res.status === 200) {
      $q.notify({
        type: 'positive',
        message: '新增病例計酬醫囑成功',
        position: 'top',
      })
      freshCasePaymentData()
    }
  } catch (err) {
    console.log(err)
  }
}

const loadingCasePayment = ref(false)
const freshCasePaymentData = async () => {
  loadingCasePayment.value = true
  await GetIpdPieceProcedureItem()
  loadingCasePayment.value = false
}

const editTwDRGs = () => {
  const dialog = $q
    .dialog({
      component: TwDRGsDialog,
      componentProps: {
        procedureId: procedureId.value,
        readonly: props.readonly,
      },
    })
    .onOk(() => {
      freshCasePaymentData()
      dialog.hide()
    })
}

const nhiPointData = ref({})
const sixtyFivePercent = ref(false)
const GetNhiPointInfo = async () => {
  try {
    const params = `?Id=${pieceProcedureItem.value.Id}`
    const res = await getNhiPointInfo(params) //params
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

const paymentDetail = () => {
  const dialog = $q.dialog({
    component: PaymentDetail,
    componentProps: {
      nhiPointData: nhiPointData.value,
    },
  })
}

const init = async () => {
  await GetIpdPieceProcedureList()
  freshCasePaymentData()
}
init()
</script>

