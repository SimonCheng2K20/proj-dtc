<template>
  <q-btn class="header-btn" label="手術排程" unelevated dense @click="toSurgerySchedule"></q-btn>
</template>

<script setup>
import SurgeryScheduleDialog from '../SurgeryScheduleDialog.vue'
import { useQuasar } from 'quasar'
import { useOpdStore } from 'stores/opd.js'

const opdStore = useOpdStore()
const $q = useQuasar()

const toSurgerySchedule = () => {
  const dialog = $q
    .dialog({
      component: SurgeryScheduleDialog,
      componentProps: {
        opdData: opdStore.opdData,
      },
    })
    .onOk(() => {
      dialog.hide()
    })
}
</script>

