<template>
  <div>
    <my-title>
      <data-header :items="patientData" type="gray"></data-header>
    </my-title>

    <q-tabs
      v-model="tab"
      content-class="gap-2"
      indicator-color="primary"
      active-bg-color="primary"
      active-color="white"
      align="left"
      dense
    >
      <q-route-tab v-for="(tab, index) in tabs" :key="index" v-bind="tab" class="border border-blue-500"></q-route-tab>
    </q-tabs>

    <q-separator></q-separator>

    <router-view></router-view>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useIpdStore } from 'stores/ipd'
import dayjs from 'dayjs'
import DataHeader from 'components/DataHeader.vue'

const ipdStore = useIpdStore()
const route = useRoute()

const tab = ref()
const tabs = computed(() => {
  return [
    { label: '切帳/批價查詢', to: { name: 'NursingStation-Clerk-Accounting-PricingSearch' } },
    // { label: '醫令查詢', to: { name: 'NursingStation-Clerk-Accounting-ProcedureSearch' } },
    // { label: '病房費固定費用查詢', to: { name: 'NursingStation-Clerk-Accounting-BedPriceSearch' } },
  ]
})

const patientData = computed(() => [
  { label: '病患姓名', value: ipdStore.ipdData.Patient.Person.Name },
  { label: '性別', value: ipdStore.ipdData.Gender },
  {
    label: '生日',
    value: dayjs(ipdStore.ipdData.Patient.Person.BirthDate).isValid()
      ? dayjs(ipdStore.ipdData.Patient.Person.BirthDate).format('YYYY-MM-DD')
      : ipdStore.ipdData.Patient.Person.BirthDate,
  },
  { label: '身分證字號', value: ipdStore.ipdData.Patient.PersonId },
  { label: '床號', value: ipdStore.ipdData.BedName },
  {
    label: '入院時間',
    value: dayjs(ipdStore.ipdData.IpdDate).isValid()
      ? dayjs(ipdStore.ipdData.IpdDate).format('YYYY-MM-DD')
      : ipdStore.ipdData.IpdDate,
  },
  { label: '主治醫師', value: ipdStore.ipdData.AttendingDocName },
  { label: '住院醫師', value: ipdStore.ipdData.InpatientDocName },
])

const init = () => {
  if (route.params.ipdId && !ipdStore.ipdData.IpdId) ipdStore.GetIpdRecordItem(route.params.ipdId)
}
init()
</script>

