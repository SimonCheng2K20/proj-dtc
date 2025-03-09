<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss full-width>
    <my-dialog-content header="手術同意書" @close="onDialogCancel">
      <teethConsent :data="opdStore.opdData" />
    </my-dialog-content>
  </q-dialog>
</template>
<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import teethConsent from './teethConsent.vue'
import { useOpdStore } from 'stores/opd.js'
import { QTableProps, QInputProps, QSelectProps } from 'utils/quasar-extends/base-props.js'

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()
const $q = useQuasar()
const opdStore = useOpdStore()
</script>

