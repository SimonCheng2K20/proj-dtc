<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss full-width>
    <my-dialog-content :header="title" width="680px" @close="onDialogCancel">
      <div class="flex justify-center">
        <q-img :src="imageUrl" style="width: 420px" />
      </div>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { QTableProps, QInputProps, QSelectProps } from 'utils/quasar-extends/base-props.js'

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()
const props = defineProps({
  imageUrl: String,
  title: String,
})
</script>

<style lang="scss" scoped></style>

