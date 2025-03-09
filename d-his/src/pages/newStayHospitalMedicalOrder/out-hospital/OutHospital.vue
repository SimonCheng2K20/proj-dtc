<template>
  <q-page>
    <div>
      <q-tabs v-model="mainTab" content-class="gap-2" indicator-color="primary" active-bg-color="primary" active-color="white" align="left" dense>
        <q-route-tab class="border border-blue-500" label="出院許可證" :to="{ name: 'StayHospitalMedicalOrder-OutHospital-OutHospitalLicense' }"></q-route-tab>
        <q-route-tab class="border border-blue-500" label="未執行醫囑" :to="{ name: 'StayHospitalMedicalOrder-OutHospital-NotDoMedicalOrder' }"></q-route-tab>
        <q-route-tab class="border border-blue-500" label="出院帶藥" :to="{ name: 'StayHospitalMedicalOrder-OutHospital-Medicine' }"></q-route-tab>
        <q-route-tab
          class="border border-blue-500"
          label="診斷/手術（處置）"
          :to="{ name: 'StayHospitalMedicalOrder-OutHospital-OperationDiagnosis' }"
        ></q-route-tab>
        <q-route-tab class="border border-blue-500" label="回診預約" :to="{ name: 'StayHospitalMedicalOrder-OutHospital-ReturnReserve' }"></q-route-tab>
      </q-tabs>

      <q-separator></q-separator>

      <router-view></router-view>
    </div>
  </q-page>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const checkRoute = (val) => {
  if (val === 'StayHospitalMedicalOrder-OutHospital') {
    router.replace({ name: 'StayHospitalMedicalOrder-OutHospital-OutHospitalLicense' })
  }
}

const mainTab = ref()
watch(
  () => route.name,
  (val) => {
    checkRoute(val)
  }
)

const init = () => {
  checkRoute(route.name)
}
init()
</script>

