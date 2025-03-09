<template>
  <div class="p-2">
    <q-tabs
      v-model="mainTab"
      content-class="gap-2"
      indicator-color="primary"
      active-bg-color="primary"
      active-color="white"
      align="left"
      dense
    >
      <q-route-tab
        class="border border-blue-500"
        label="病程記錄"
        :to="{ name: 'StayHospitalMedicalOrder-CreateMedicalOrder-CreateMedicalOrder-MedicalCourseRecord' }"
      ></q-route-tab>
      <q-route-tab
        class="border border-blue-500"
        label="手術診斷"
        :to="{ name: 'StayHospitalMedicalOrder-CreateMedicalOrder-CreateMedicalOrder-Icd' }"
      ></q-route-tab>
      <q-route-tab
        class="border border-blue-500"
        label="M 住院醫囑用藥"
        :to="{ name: 'StayHospitalMedicalOrder-CreateMedicalOrder-CreateMedicalOrder-Medicine' }"
      ></q-route-tab>
      <q-route-tab
        class="border border-blue-500"
        label="E 手術檢查治療"
        :to="{ name: 'StayHospitalMedicalOrder-CreateMedicalOrder-CreateMedicalOrder-Procedure' }"
      ></q-route-tab>
    </q-tabs>

    <router-view></router-view>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const mainTab = ref()
</script>

