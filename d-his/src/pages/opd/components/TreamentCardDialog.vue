<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss full-width>
    <my-dialog-content header="診療項目要求表記錄" @close="onDialogOK">
      <TreamentCard :pieceProcedureSteps="pieceProcedureSteps" :autoSave="autoSave" @done="done"></TreamentCard>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'

import TreamentCard from 'pages/newStayHospitalMedicalOrder/create-medical-order/case-payment/components/TreamentCard.vue'
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  pieceProcedureSteps: Array,
  autoSave: Boolean,
})
const emit = defineEmits(['done'])
const done = (procedureCode) => {
  emit('done', procedureCode)
}
</script>

