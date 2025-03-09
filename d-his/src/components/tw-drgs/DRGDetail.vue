<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss full-width>
    <my-dialog-content header="DRG編審結果" @close="onDialogCancel" :loading="loadingCalculateDRG">
      <div class="flex">
        <div class="bg-[#DEECFF] w-[40%] p-3">
          <div class="grid grid-cols-[30px_repeat(4,1fr)] grid-rows-6 bg-white text-[#0A2548] font-bold left-table">
            <div class="row-span-6 item" style="writing-mode: vertical-lr">落點區</div>
            <div class="item">核實申報區</div>
            <div class="col-span-2 item">Tw-DRGs支付定額區</div>
            <div class="item text-center">Marginal Cost 80%</div>
            <div class="item">A</div>
            <div class="item">B1</div>
            <div class="item">B2</div>
            <div class="item">C</div>
            <div class="row-span-4 col-span-4 grid grid-cols-4 text-center stepper">
              <div class="relative top-[10px]">
                <hr class="border-solid border-yellow bg-yellow h-[6px]" />
                <div class="circle bg-yellow"></div>
                <div class="float-div bg-yellow text-sm" style="--arrow-color: yellow">
                  下限<br />
                  {{ DRGDetail.LowerLimit }}
                </div>
              </div>
              <div class="relative top-[10px]">
                <hr class="border-solid border-blue-300 bg-blue-300 h-[6px]" />
                <div class="circle bg-blue"></div>
                <div class="float-div bg-blue w-[160px] text-sm" style="--arrow-color: #2196f3">
                  Tw-DRGs支付定額區<br />
                  {{ DRGDetail.DrgPaymentPoint }}
                </div>
              </div>
              <div class="relative top-[10px]">
                <hr class="border-solid border-blue bg-blue h-[6px]" />
                <div class="circle bg-[#FC5BCE]"></div>
                <div class="float-div bg-[#FC5BCE] text-sm" style="--arrow-color: #fc5bce">
                  上限<br />
                  {{ DRGDetail.UpperLimit }}
                </div>
              </div>
              <div class="relative top-[10px]">
                <hr class="border-solid border-[#FC5BCE] bg-[#FC5BCE] h-[6px] w-[90%]" />
                <div class="arrow"></div>
              </div>
            </div>
            <div class="py-2 item" style="writing-mode: vertical-lr">費用區</div>
            <div class="col-span-4 item bg-[#0309AF]">
              <div class="m-2 p-2 w-full bg-white">Tw-DRGs差額:100</div>
            </div>
          </div>
        </div>
        <div class="w-[60%] grid grid-cols-12 gap-1 p-3 pt-2">
          <my-input-group class="col-span-12 grid-cols-12 grid gap-1">
            <my-input-wrapper label="MDC" class="col-span-3">
              <q-input v-bind="QInputProps" v-model="DRGDetail.MDC" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="MDC中文" class="col-span-9">
              <q-input v-bind="QInputProps" v-model="DRGDetail.MdcCname" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="DRG" class="col-span-3">
              <q-input v-bind="QInputProps" v-model="DRGDetail.DRG" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="DRG中文" class="col-span-9">
              <q-input v-bind="QInputProps" v-model="DRGDetail.DrgCname" readonly></q-input>
            </my-input-wrapper>
          </my-input-group>
          <my-input-group class="col-span-8 flex flex-col gap-1 need-text-right" :groupWidth="400">
            <my-input-wrapper label="權重" class="col-span-8">
              <q-input v-bind="QInputProps" v-model="DRGDetail.Rw" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="標準給付額SPR" class="col-span-8">
              <q-input v-bind="QInputProps" v-model="DRGDetail.SPR" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="基本診療加成率" class="col-span-8">
              <q-input v-bind="QInputProps" v-model="DRGDetail.BaseRate" readonly></q-input>
            </my-input-wrapper>
            <div class="grid grid-cols-8 col-span-8 row-span-2 relative">
              <div
                class="absolute w-[140px] h-full bg-[#deecff] border border-r-1 border-[#1e40af] flex justify-center items-center font-bold"
              >
                兒童加成率
              </div>
              <div class="col-span-8 mb-1">
                <my-input-wrapper label="非MDC15內科系加成率">
                  <q-input v-bind="QInputProps" v-model="DRGDetail.ChildRateNonMDC15Internal" readonly></q-input>
                </my-input-wrapper>
              </div>
              <div class="col-span-8 mb-1">
                <my-input-wrapper label="非MDC15外科系加成率">
                  <q-input v-bind="QInputProps" v-model="DRGDetail.ChildRateNonMDC15Surgical" readonly></q-input>
                </my-input-wrapper>
              </div>
              <div class="col-span-8">
                <my-input-wrapper label="MDC15加成率">
                  <q-input v-bind="QInputProps" v-model="DRGDetail.ChildRateMDC15" readonly></q-input>
                </my-input-wrapper>
              </div>
            </div>
            <my-input-wrapper label="山地離島地區醫院加成率">
              <q-input v-bind="QInputProps" v-model="DRGDetail.MountIslandRate" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="CMI加成率">
              <q-input v-bind="QInputProps" v-model="DRGDetail.CMIRate" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="DRG支付點數">
              <q-input v-bind="QInputProps" v-model="DRGDetail.DrgPaymentPoint" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="核定點數">
              <q-input v-bind="QInputProps" v-model="DRGDetail.ApprovedPoint" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="損益">
              <q-input v-bind="QInputProps" v-model="DRGDetail.ProfitLoss" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="試算損益">
              <q-input v-bind="QInputProps" v-model="DRGDetail.TrialProfitLoss" readonly></q-input>
            </my-input-wrapper>
          </my-input-group>
          <my-input-group class="col-span-4 flex flex-col gap-1 need-text-right">
            <my-input-wrapper label="實施日">
              <my-date-input v-bind="QInputProps" v-model="DRGDetail.ImplementationDate" readonly></my-date-input>
            </my-input-wrapper>
            <my-input-wrapper label="上限臨界點">
              <q-input v-bind="QInputProps" v-model="DRGDetail.UpperLimit" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="下限臨界點">
              <q-input v-bind="QInputProps" v-model="DRGDetail.LowerLimit" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="平均天數">
              <q-input v-bind="QInputProps" v-model="DRGDetail.AverageInpatientDays" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="住院天數">
              <q-input v-bind="QInputProps" v-model="DRGDetail.ActualInpatientDays" readonly></q-input>
            </my-input-wrapper>
            <q-space></q-space>
            <my-input-wrapper label="支付型態">
              <q-input v-bind="QInputProps" v-model="DRGDetail.DrgPaymentType" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="註記">
              <q-input v-bind="QInputProps" v-model="DRGDetail.Remark" readonly></q-input>
            </my-input-wrapper>
            <q-space></q-space>
          </my-input-group>
        </div>
      </div>
      <template #actions>
        <q-btn label="關閉" color="grey" @click="onDialogCancel"></q-btn>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch, watchEffect } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { postCalculateDRG, getIpdCharge } from 'api'
import { QTableProps, QInputProps, QSelectProps } from 'utils/quasar-extends/base-props.js'
import numberFormat from 'utils/numberFormat'
import dayjs from 'dayjs'

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()
const props = defineProps({
  row: Object,
  birthday: String,
  icd10MainCode: String,
  patientData: Object,
})

const DRGDetail = ref({
  MDC: props.row.MDC,
  MdcCname: props.row.MdcCname,
  DRG: props.row.DRG,
  DrgCname: props.row.DrgCname,
  Drg: 'DRG192',
  Rw: 3.1533,
  ImplementationDate: '2023-01-01',
  SPR: 51654,
  BaseRate: 0.071,
  UpperLimit: 258145,
  LowerLimit: 49974,
  ChildRateMDC15: 0,
  ChildRateNonMDC15Internal: 0,
  ChildRateNonMDC15Surgical: 0.1,
  AverageInpatientDays: 8,
  ActualInpatientDays: 5,
  MountIslandRate: 0,
  CMIRate: 0.01,
  DrgPaymentPoint: 192362,
  DrgPaymentType: '2',
  ApprovedPoint: 20000,
  Remark: '註記',
  ProfitLoss: -172362,
  TrialProfitLoss: -172362,
})

const leftData = ref({
  下限: 10000,
  定額: 20000,
  上限: 30000,
  差額: 100,
})

const numFormat = () => {
  for (const [key, value] of Object.entries(DRGDetail)) {
    if (typeof value === 'number') {
      DRGDetail.value[key] = numberFormat(value)
    }
  }
}
// 獲取住院費用
const stayHospitalCost = ref(0)
const GetIpdCharge = async (id) => {
  try {
    const res = await getIpdCharge(id)
    if (res.status === 200 || res.status === 204) {
      stayHospitalCost.value = res.data.IpdFeeCurrent
    }
  } catch (err) {
    console.log(`error: `, err)
  }
}

const loadingCalculateDRG = ref(false)
const PostCalculateDRG = async () => {
  const StartDate = dayjs(props.patientData.IpdDate)
  const EndDate = dayjs()
  const diffInDays = EndDate.diff(StartDate, 'day')
  loadingCalculateDRG.value = true
  const body = {
    Mdc: props.row.MDC,
    Drg: props.row.DRG,
    BirthDay: props.birthday,
    ActualInpatientDays: diffInDays + 1,
    ActualMedPoint: stayHospitalCost.value,
    PrincipalDiagnosis: props.icd10MainCode,
    CaseNumber: 30,
  }
  try {
    const res = await postCalculateDRG(body)
    if (res.status === 200) {
      console.log('test', res.data)
      Object.assign(DRGDetail.value, res.data)
    }
  } catch (error) {
    console.log(error)
  } finally {
    loadingCalculateDRG.value = false
  }
}

const init = async () => {
  console.log('test', props.patientData)
  await GetIpdCharge(props.patientData.IpdId)
  await PostCalculateDRG()
  numFormat()
}
init()
</script>

<style lang="scss" scoped>
:deep(.wrapper-inner > .label) {
  justify-content: end;
}
.need-text-right :deep(.q-field__native) {
  text-align: end;
}
.left-table {
  .item {
    border: 1px solid #215dbb;
    margin-left: -1px;
    margin-top: -1px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.stepper {
  border: 1px solid #215dbb;
  margin-left: -1px;
  margin-top: -1px;
}
.circle {
  position: absolute;
  transform: translateX(50%);
  right: 0;
  top: -4px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid white;
  z-index: 99;
}
.arrow {
  position: absolute;
  top: -6px;
  right: 0px;
  width: 0px;
  height: 0px;
  border-top: 10px solid transparent;
  border-bottom: 10px solid transparent;
  border-left: 18px solid #fc5bce;
}

.float-div {
  transform: translateX(50%);
  top: 20px;
  right: 0;
  position: absolute;
  padding: 2px 8px;
  &::before {
    content: '';
    position: absolute;
    top: -11px;
    left: 50%;
    transform: translateX(-50%);
    border-width: 6px;
    border-style: solid;
    border-color: transparent transparent var(--arrow-color) transparent;
  }
}
</style>

