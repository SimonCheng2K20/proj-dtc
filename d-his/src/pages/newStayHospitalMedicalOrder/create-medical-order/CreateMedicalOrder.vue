<template>
  <q-page>
    <div>
      <q-tabs v-model="mainTab" content-class="gap-2" indicator-color="primary" active-bg-color="primary" active-color="white" align="left" dense>
        <q-route-tab class="border border-blue-500" label="過敏反應" :to="{ name: 'StayHospitalMedicalOrder-CreateMedicalOrder-AllergyReact' }"></q-route-tab>
        <q-route-tab
          class="border border-blue-500"
          label="開立醫囑"
          :to="{ name: 'StayHospitalMedicalOrder-CreateMedicalOrder-CreateMedicalOrder' }"
        ></q-route-tab>
        <q-route-tab class="border border-blue-500" label="論病例計酬" :to="{ name: 'StayHospitalMedicalOrder-CreateMedicalOrder-CasePayment' }"></q-route-tab>
        <q-route-tab class="border border-blue-500" label="Tw-DRGs" :to="{ name: 'StayHospitalMedicalOrder-CreateMedicalOrder-TwDRGs' }" no-caps></q-route-tab>
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
  if (val === 'StayHospitalMedicalOrder-CreateMedicalOrder-CreateMedicalOrder') {
    router.replace({ name: 'StayHospitalMedicalOrder-CreateMedicalOrder-CreateMedicalOrder-MedicalCourseRecord' })
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

