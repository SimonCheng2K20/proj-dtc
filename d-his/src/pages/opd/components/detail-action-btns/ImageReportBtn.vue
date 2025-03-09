<template>
  <q-btn class="header-btn" label="影像報告" unelevated dense @click="toImageReport"></q-btn>
</template>

<script setup>
import ImageReport from 'pages/newStayHospitalMedicalOrder/ImageReport.vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const props = defineProps({
  opdId: String,
  patientId: String,
})

const toImageReport = () => {
  $q.dialog({
    component: ImageReport,
    componentProps: {
      wrapperType: 'dialog',
      opdId: props.opdId,
      patientId: props.patientId,
    },
  })
}
</script>

