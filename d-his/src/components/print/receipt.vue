<template>
  <div class="print">
    <div class="flex justify-center gap-4">
      <div>{{ organization.Name }}</div>
      <div>醫療費用收據</div>
    </div>
    <div>
      <table class="w-full">
        <thead>
          <tr>
            <th v-for="(item, index) in headers" :key="index">
              <div>{{ item.c }}</div>
              <div>{{ item.e }}</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{{ patientInfo.RoomBooking.Patient.PatientId }}</td>
            <td>{{ patientInfo.RoomBooking.Patient.Person.Name }}</td>
            <td>{{ patientInfo.RoomBooking.DepartmentName }}</td>
            <td>門診收據</td>
            <td>{{ authStore.userData.Name }}</td>
            <td>{{ dayjs().format('YYYY-MM-DD') }}</td>
            <td>{{ patientInfo.OpdId }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div>門診序號：00005192</div>
    <div class="flex flex-col flex-wrap my-2">
      <div class="grid grid-cols-4 w-1/2">
        <div>費用項目名稱</div>
        <div>醫療金額</div>
        <div>健保金額</div>
        <div>自付金額</div>
      </div>
      <div v-for="(item, index) in payInfo.OpdCharegDetails" :key="index" class="grid grid-cols-4 w-1/2">
        <div>{{ item.FeeName }}</div>
        <div>{{ item.Fee }}</div>
        <div>{{ item.NhiFee }}</div>
        <div>{{ item.SelfFee }}</div>
      </div>
      <div class="border border-black border-dashed w-1/2"></div>
      <div class="grid grid-cols-4 w-1/2">
        <div>合計</div>
        <div>{{ payInfo.TotalAmount }}</div>
        <div>{{ payInfo.TotalNhiFee }}</div>
        <div>{{ payInfo.TotalSelfFee }}</div>
      </div>
    </div>
    <div class="flex justify-between items-center">
      <div class="flex">
        <div>
          <div class="text-end">醫療金額 -</div>
          <div class="text-end">{{ payInfo.TotalAmount }} -</div>
        </div>
        <div>
          <div class="text-end">健保申請 =</div>
          <div class="text-end">{{ payInfo.TotalNhiFee }} =</div>
        </div>
        <div>
          <div>自付金額</div>
          <div>{{ payInfo.TotalSelfFee }}</div>
        </div>
      </div>
      <div class="border border-[#123456] py-2 px-4">${{ payInfo.TotalAmount }}</div>
    </div>
    <div>
      <table class="w-full">
        <tbody>
          <tr>
            <th>統一編號</th>
            <td colspan="3">缺</td>
            <th rowspan="3" style="writing-mode: vertical-rl">備註</th>
            <td rowspan="3">
              (1)本收據印花稅總繳<br />
              (2)本收據經塗改或未加蓋本院收據章者無效<br />
              {{ payInfo.Remark }}
            </td>
          </tr>
          <tr>
            <th>名稱</th>
            <td colspan="3">{{ organization.Name }}</td>
          </tr>
          <tr>
            <th>詳細地址</th>
            <td>{{ organization.Address }}</td>
            <th>負責人</th>
            <td>缺</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useAuthStore } from 'stores/auth.js'
import _ from 'lodash'
import dayjs from 'dayjs'

const authStore = useAuthStore()

const props = defineProps({
  organization: Object,
  payInfo: Object,
  patientInfo: Object,
})

const headers = [
  { c: '病歷號碼', e: 'Patient Id' },
  { c: '患者名稱', e: 'Name' },
  { c: '科別', e: 'Department' },
  { c: '單據類別', e: 'Category Of Receipt' },
  { c: '經辦者', e: 'Cashier' },
  { c: '發行日期', e: 'Day Of Output' },
  { c: '電腦序號', e: 'Serial No' },
]

const printData = reactive({
  title: '淡水馬偕紀念醫院',
  data: {
    patientId: '19870321',
    name: '顏先生',
    department: '內科',
    receiptType: '門診收據',
    cashier: '229-KS12',
    date: '2022-03-11',
    receiptId: 'C-8683492',
  },
  price: [
    { name: '掛號費', price: 130, healthPrice: 0, selfPrice: 130 },
    { name: '診察費', price: 335, healthPrice: 335, selfPrice: 0 },
    { name: '檢查費', price: 0, healthPrice: 0, selfPrice: 0 },
    { name: '代收基本部分負擔', price: 0, healthPrice: -170, selfPrice: 170 },
  ],
})

const total = computed(() => {
  const totalPrice = {
    price: 0,
    healthPrice: 0,
    selfPrice: 0,
  }

  _.forEach(printData.price, (item) => {
    totalPrice.price += item.price
    totalPrice.healthPrice += item.healthPrice
    totalPrice.selfPrice += item.selfPrice
  })

  return totalPrice
})
</script>

<style lang="scss" scoped>
table {
  td,
  th {
    border: 1px solid #123456;
  }
}

@page {
  size: landscape;
}
</style>

