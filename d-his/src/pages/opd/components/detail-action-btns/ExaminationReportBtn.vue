<template>
  <q-btn class="header-btn" label="檢驗報告" unelevated dense @click="toExaminationReport"></q-btn>
</template>

<script setup>
import { useQuasar } from 'quasar'
import ExaminationReport from 'pages/newStayHospitalMedicalOrder/ExaminationReport.vue'

const $q = useQuasar()

const props = defineProps({
  opdId: String,
  patientId: String,
})

const toExaminationReport = () => {
  $q.dialog({
    component: ExaminationReport,
    componentProps: {
      wrapperType: 'dialog',
      opdId: props.opdId,
      patientId: props.patientId,
    },
  })
}
</script>

