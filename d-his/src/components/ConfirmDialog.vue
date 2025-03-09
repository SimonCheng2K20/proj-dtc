<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss position="top">
    <q-card>
      <q-card-section class="row items-center">
        <q-icon name="info" color="primary" text-color="white" size="md" />
        <span class="q-ml-sm">{{ text }}</span>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn label="取消" color="grey" unelevated @click="onDialogCancel" />
        <q-btn label="確定" color="primary" unelevated @click="onDialogOK" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { QTableProps, QInputProps, QSelectProps } from 'utils/quasar-extends/base-props.js'

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()
const $q = useQuasar()
const props = defineProps({
  text: String,
})
</script>

