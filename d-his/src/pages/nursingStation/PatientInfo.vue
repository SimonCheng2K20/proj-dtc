<template>
  <div>
    <my-title>
      <data-header :items="patientData" type="gray"></data-header>
    </my-title>
    <div class="flex justify-between">
      <q-tabs
        v-model="tab"
        content-class="gap-2"
        indicator-color="primary"
        active-bg-color="primary"
        active-color="white"
        align="left"
        dense
      >
        <q-route-tab
          v-for="(tab, index) in tabs"
          :key="index"
          v-bind="tab"
          class="border border-blue-500"
        ></q-route-tab>
      </q-tabs>
      <q-btn
        class="header-btn"
        label="回上頁"
        unelevated
        dense
        @click="router.push({ name: 'NursingStation-Task' })"
      ></q-btn>
    </div>

    <q-separator></q-separator>

    <router-view></router-view>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useIpdStore } from 'stores/ipd'
import dayjs from 'dayjs'
import DataHeader from 'components/DataHeader.vue'

const ipdStore = useIpdStore()
const route = useRoute()
const router = useRouter()

const tab = ref()
const tabs = computed(() => {
  return [
    { label: '用藥紀錄', to: { name: 'NursingStation-Task-MedicationRecord' } },
    { label: '檢查處置紀錄', to: { name: 'NursingStation-Task-ProcedureRecord' } },
    {
      label: '歷史病歷',
      to: { name: 'NursingStation-Task-IpdRecord', query: { type: 'ipd', PatientId: ipdStore.ipdData.PatientId } },
    },
    {
      label: '檢驗報告',
      to: {
        name: 'NursingStation-Task-ExaminationReport',
        query: { type: 'ipd', PatientId: ipdStore.ipdData.PatientId },
      },
    },
    {
      label: '影像報告',
      to: { name: 'NursingStation-Task-ImageReport', query: { type: 'ipd', PatientId: ipdStore.ipdData.PatientId } },
    },
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

