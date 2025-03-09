<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss full-width>
    <my-dialog-content header="預約住院" width="1400px" @close="onDialogCancel">
      <MyCalendarGrid>
        <template v-slot:[date]> Btn at here </template>
      </MyCalendarGrid>
    </my-dialog-content>
  </q-dialog>
</template>
<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { QTableProps, QInputProps, QSelectProps } from 'utils/quasar-extends/base-props.js'
import MyCalendarGrid from 'components/MyCalendarGrid.vue'
import dayjs from 'dayjs'

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()
const $q = useQuasar()
const date = ref(dayjs().format('YYYY-MM-DD'))
</script>
<style lang="scss" scoped></style>

