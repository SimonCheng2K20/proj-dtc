<template>
  <div class="flex flex-col items-center">
    <div class="text-2xl font-bold">{{ Hospital }}醫院</div>
    <div class="text-2xl font-bold mb-6">住院費用預繳通知單</div>
    <div class="grid grid-cols-3 w-full">
      <div>姓名:布萊恩</div>
      <div>身分證字號:A123456789</div>
      <div>出生年月日:1995/02/11</div>
      <div>科別:外科</div>
      <div>醫生:Amy</div>
      <div></div>
      <div>身分:一般</div>
      <div>卡號:0005</div>
      <div>病床號:4652</div>
    </div>
    <hr class="border-t-black w-full my-2" />
    <div class="grid grid-cols-2 w-full">
      <!-- 健保點數，自費區  Start-->
      <div class="grid grid-cols-3 w-full">
        <div v-for="x in HealthLeft" :key="x.id">{{ x.label }}</div>
      </div>
      <div class="grid grid-cols-3 w-full">
        <div v-for="y in HealthRight" :key="y.id">{{ y.label }}</div>
      </div>
      <!-- 健保點數，自費區  End-->
    </div>
    <hr class="border-t-black w-full my-2" />
    <div class="flex justify-start w-full">健保點數:</div>
    <div class="flex justify-start w-full">應繳金額=自費+部分負擔:</div>
    <div class="flex justify-start w-full" v-show="paymentType">已繳金額:</div>
    <br />
    <div class="flex justify-start w-full mb-10">預繳住院費用期間: xxx，煩請三日內至住院中心繳費</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { getOrganization } from 'api'

const props = defineProps({
  folder: {
    type: Array,
    default: [],
  },
  paymentType: {
    type: Boolean,
    default: false,
  },
})

const HealthLeft = ref([
  { label: '', code: '' },
  { label: '健保點數', code: '' },
  { label: '自費', code: '' },
  { label: '診察費', point: '', spend: '', code: '' },
  { label: '12', code: '' },
  { label: '57', code: '' },
  { label: '病床費', point: '', spend: '', code: '' },
  { label: '35', code: '' },
  { label: '885', code: '' },
  { label: '檢查費', point: '', spend: '', code: '' },
  { label: '43', code: '' },
  { label: '576', code: '' },
  { label: '放射線診療費', point: '', spend: '', code: '' },
  { label: '35', code: '' },
  { label: '577', code: '' },
])

const HealthRight = ref([
  { label: '', code: '' },
  { label: '健保點數', code: '' },
  { label: '自費', code: '' },
  { label: '治療處置費', point: '', spend: '', code: '' },
  { label: '45', code: '' },
  { label: '99', code: '' },
  { label: '手術費', point: '', spend: '', code: '' },
  { label: '1333', code: '' },
  { label: '56', code: '' },
  { label: '麻醉費', point: '', spend: '', code: '' },
  { label: '79', code: '' },
  { label: '55', code: '' },
  { label: '藥費', point: '', spend: '', code: '' },
  { label: '547', code: '' },
  { label: '38', code: '' },
  { label: '藥事服務費', point: '', spend: '', code: '' },
  { label: '589', code: '' },
  { label: '55', code: '' },
  { label: '部分負擔', point: '', spend: '', code: '' },
  { label: '244', code: '' },
  { label: '77', code: '' },
])

const Hospital = ref('')
const getOrganiz = () => {
  getOrganization()
    .then((res) => {
      Hospital.value = res.data.Abbr
    })
    .catch((err) => console.log(err))
}

getOrganiz()
</script>

