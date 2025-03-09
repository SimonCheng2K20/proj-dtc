<template>
  <q-dialog ref="dialogRef" full-width no-backdrop-dismiss>
    <my-dialog-content header="過敏記錄" width="1280px" @close="onDialogCancel" :loading="getDataLoading">
      <PatientAllergyManage :patientId="patientId"></PatientAllergyManage>
      <PatientFoodAllergyManage class="mt-2" :patientId="patientId"></PatientFoodAllergyManage>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { computed, reactive, ref, watch, onMounted } from 'vue'

import PatientAllergyManage from 'components/allergy/PatientAllergyManage.vue'
import PatientFoodAllergyManage from 'components/allergy/PatientFoodAllergyManage.vue'

import { useDialogPluginComponent, useQuasar } from 'quasar'

const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  patientId: String,
})
const getDataLoading = ref(false)
</script>

