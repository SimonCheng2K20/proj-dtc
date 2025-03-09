<template>
  <q-dialog ref="dialogRef" full-width no-backdrop-dismiss>
    <my-dialog-content header="結帳" width="1280px" @close="onDialogCancel" :loading="getDataLoading">
      <data-header class="text-default" :items="patientData"> </data-header>

      <div class="flex no-wrap gap-2 mt-2">
        <div class="w-3/5">
          <q-table
            v-bind="QTableProps"
            :rows="editItem.OpdChargeDetails"
            :columns="chargeColumns"
            row-key="No"
            :pagination="{ rowsPerPage: -1 }"
          ></q-table>
        </div>

        <my-input-group class="w-2/5 grid gap-1">
          <div class="grid grid-cols-[1fr_8px_1fr]">
            <div class="grid gap-1">
              <my-input-wrapper label="自費總價">
                <q-input v-bind="QInputProps" :model-value="editItem.TotalSelfFee" readonly></q-input>
              </my-input-wrapper>
              <my-input-wrapper label="健保總價">
                <q-input v-bind="QInputProps" :model-value="editItem.TotalNhiFee" readonly></q-input>
              </my-input-wrapper>
            </div>
            <div class="relative w-[8px]">
              <div class="absolute top-[23px] left-[4px] border-l border-t border-black w-[4px] h-[46px]"></div>
              <div class="absolute top-[69px] border-t border-black w-[8px]"></div>
            </div>
            <div class="grid gap-1">
              <my-input-wrapper label="部分擔額">
                <q-input v-bind="QInputProps" :model-value="editItem.SelfFee" readonly></q-input>
              </my-input-wrapper>
              <my-input-wrapper label="健保申請">
                <q-input v-bind="QInputProps" :model-value="editItem.NhiFee" readonly></q-input>
              </my-input-wrapper>
            </div>
          </div>
          <q-separator></q-separator>
          <div class="grid grid-cols-2 gap-1">
            <my-input-wrapper label="全部總價">
              <q-input v-bind="QInputProps" :model-value="editItem.TotalFee" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="折扣金額">
              <q-input v-bind="QInputProps" :model-value="editItem.Discount" readonly></q-input>
            </my-input-wrapper>

            <my-input-wrapper label="應繳金額">
              <q-input v-bind="QInputProps" :model-value="editItem.PayableFee" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="記帳金額">
              <q-input v-bind="QInputProps" :model-value="editItem.BilledAmount" readonly></q-input>
            </my-input-wrapper>
          </div>

          <q-separator></q-separator>

          <div class="grid grid-cols-2 gap-1">
            <my-input-wrapper label="現金金額">
              <q-input
                v-bind="QInputProps"
                v-model="editItem.Cash"
                type="number"
                min="0"
                :max="editItem.PayableFee"
              ></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="應繳押金">
              <q-input v-bind="QInputProps" :model-value="editItem.Deposit" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="刷卡金額">
              <q-input
                v-bind="QInputProps"
                v-model="editItem.CreditCard"
                type="number"
                min="0"
                :max="editItem.PayableFee"
              ></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="預繳押金">
              <q-input
                v-bind="QInputProps"
                v-model="editItem.PrepaidDeposit"
                type="number"
                min="0"
                :max="editItem.PayableFee"
              ></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="已繳金額">
              <q-input v-bind="QInputProps" :model-value="editItem.TotalPay" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="本次欠款">
              <q-input v-bind="QInputProps" :model-value="editItem.ThisArrears" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="健保卡號">
              <q-input v-bind="QInputProps" :model-value="editItem.NhiCardNo" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="本次還款">
              <q-input v-bind="QInputProps" :model-value="editItem.ThisRepayment" readonly></q-input>
            </my-input-wrapper>
          </div>

          <q-separator></q-separator>

          <div class="grid gap-1">
            <my-input-wrapper label="尚欠金額">
              <q-input v-bind="QInputProps" :model-value="editItem.Arrears" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="累計欠款金額" class="col-span-full">
              <q-input v-bind="QInputProps" :model-value="null" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="應付總額">
              <q-input v-bind="QInputProps" :model-value="editItem.TotalAmount" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="備註">
              <q-input v-bind="QInputProps" :model-value="editItem.Remark"></q-input>
            </my-input-wrapper>
          </div>
        </my-input-group>
      </div>

      <q-table
        class="mt-2"
        v-bind="QTableProps"
        :rows="editItem.listHistoryPaid"
        :columns="paidColumns"
        :pagination="{ rowsPerPage: -1 }"
      ></q-table>

      <template #actions>
        <q-btn unelevated color="grey" label="取消結帳" @click="onDialogCancel"></q-btn>
        <q-btn
          unelevated
          color="primary"
          label="繳費存檔"
          :loading="editLoading"
          :disable="getDataLoading"
          @click="onSaveClick"
        ></q-btn>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { getCalcCharge, putChargePay, getExportReceipt } from 'api'
import { QInputProps, QTableProps } from 'utils/quasar-extends/base-props.js'
import dataHeader from 'components/DataHeader.vue'
import PayRecordInfoItem from './PayRecordInfoItem.vue'

const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  id: [String, Number],
  editType: String,
  roomBooking: Object,
})

const chargeColumns = [
  { name: 'No', label: '序', field: 'No' },
  { name: 'FeeName', label: '費用名稱', field: 'FeeName' },
  { name: 'Fee', label: '費用金額', field: 'Fee' },
  { name: 'NhiFee', label: '健保給付', field: 'NhiFee' },
  { name: 'SelfFee', label: '自費金額', field: 'SelfFee' },
]

const paidColumns = [
  { name: '日期', label: '日期', field: '日期' },
  { name: '收據號', label: '收據號', field: '收據號' },
  { name: '收據人', label: '收據人', field: '收據人' },
  { name: '現金', label: '現金', field: '現金' },
  { name: '支票', label: '支票', field: '支票' },
  { name: '信用卡', label: '信用卡', field: '信用卡' },
  { name: '轉欠款', label: '轉欠款', field: '轉欠款' },
  { name: '應繳金額', label: '應繳金額', field: '應繳金額' },
  { name: '部分負擔', label: '部分負擔', field: '部分負擔' },
  { name: '自費金額', label: '自費金額', field: '自費金額' },
]

const patientData = computed(() => [
  { label: '病歷號', value: props.roomBooking.Patient.PatientId },
  { label: '姓名', value: props.roomBooking.Patient.Person.Name },
  { label: '身分證', value: props.roomBooking.Patient.PersonId },
  { label: '出生日期', value: props.roomBooking.Patient.Person.BirthDate?.substring(0, 10) },
  { label: '性別', value: props.roomBooking.Patient.Person.GenderCode },
])

const editItem = reactive({
  OpdId: null,
  ReceiptNo: null,
  NhiCardNo: null,
  ChargeStatus: null,
  ChronicNote: false,
  ChronicPrescriptionNo: null,
  SelfFee: null,
  NhiFee: null,
  Discount: null,
  BilledAmount: null,
  Deposit: null,
  PrepaidDeposit: null,
  ThisArrears: null,
  ThisRepayment: null,
  TotalSelfFee: null,
  TotalNhiFee: null,
  TotalFee: null,
  PayableFee: null,
  Cash: null,
  CreditCard: null,
  CheckPay: null,
  TotalPay: null,
  TotalAmount: null,
  Remark: null,
  Arrears: null,
  OpdChargeDetails: [],
})

const getDataLoading = ref(false)
const GetCalcCharge = async (id) => {
  try {
    getDataLoading.value = true
    const res = await getCalcCharge(id)
    if (res.status === 200) {
      Object.assign(editItem, res.data)
      console.log('test', editItem)
    }
  } catch (err) {
    console.log(err)
  } finally {
    getDataLoading.value = false
  }
}

const inputRefs = reactive({})
const rules = {}

const validate = async () => {
  let errorInputRef = null

  const validationArr = Object.entries(inputRefs).map(([key, inputRef]) => {
    if (!!inputRef) {
      const validatedResult = inputRef.validate()
      if (errorInputRef === null && validatedResult === false) errorInputRef = inputRef
      return validatedResult
    } else {
      return null
    }
  })

  if (validationArr.includes(false) === false) return true
  else {
    errorInputRef.focus()
    return false
  }
}

const onSaveClick = async () => {
  if ((await validate()) === false) return

  PutChargePay(editItem)
}

const editLoading = ref(false)
const PutChargePay = async (editItem) => {
  try {
    const res = await putChargePay({
      OpdId: editItem.OpdId,
      Cash: Number(editItem.Cash),
      CreditCard: Number(editItem.CreditCard),
      CheckPay: Number(editItem.CheckPay),
      PrepaidDeposit: editItem.PrepaidDeposit,
      Remark: editItem.Remark,
    })
    if (res.status === 200) {
      $q.notify({
        type: 'positive',
        message: '繳費成功',
        position: 'top',
      })
      onDialogOK()
    }
  } catch (error) {
    console.log(error)

    $q.notify({
      type: 'negative',
      message:
        error.status === 400 && error.data === '已經繳費'
          ? '此筆費用已繳費'
          : '繳費失敗' + (typeof error.data === 'string' ? error.data : JSON.stringify(error.data)),
      position: 'top',
    })
  }
}

const GetExportReceipt = async () => {
  try {
    const res = await getExportReceipt(props.id)

    if (res.status === 200) {
      const a = document.createElement('a')
      a.setAttribute('href', res.data)
      a.setAttribute('target', '_blank')
      a.click()
    }
  } catch (err) {
    console.log(err)
  }
}

const toPayRecordInfoItem = () => {
  const dialog = $q
    .dialog({
      component: PayRecordInfoItem,
      componentProps: {},
    })
    .onOk(() => {
      dialog.hide()
    })
}

const init = () => {
  if (props.id) GetCalcCharge(props.id)
}
init()
</script>

