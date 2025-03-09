<template>
  <q-dialog ref="dialogRef" full-width no-backdrop-dismiss>
    <my-dialog-content header="醫令明細" width="1280px" @close="onDialogCancel">
      <q-table v-bind="QTableProps" :rows="rows" :columns="columns" :pagination="{ rowsPerPage: -1 }" wrap-cells>
        <template #body-cell-index="{ col, rowIndex }">
          <q-td :props="{ col }">
            {{ rowIndex + 1 }}
          </q-td>
        </template>
        <template #body-cell-Mill="{ col, value }">
          <q-td :props="{ col }">
            <q-icon :name="value ? 'check_box' : 'check_box_outline_blank'" size="md"></q-icon>
          </q-td>
        </template>
        <template #body-cell-ChronicNotes="{ col, value }">
          <q-td :props="{ col }">
            <q-icon :name="value ? 'check_box' : 'check_box_outline_blank'" size="md"></q-icon>
          </q-td>
        </template>
        <template #body-cell-EmergencyFlag="{ col, value }">
          <q-td :props="{ col }">
            <q-icon :name="value ? 'check_box' : 'check_box_outline_blank'" size="md"></q-icon>
          </q-td>
        </template>
      </q-table>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { QTableProps } from 'utils/quasar-extends/base-props.js'

const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  rows: Array,
})

const columns = [
  { name: 'index', label: '序', field: 'index', align: 'left' },
  { name: 'Code', label: '院內碼', field: 'Code', align: 'left' },
  { name: 'Cname', label: '名稱', field: 'Cname', align: 'left' },
  { name: 'Unit', label: '單位', field: 'Unit', align: 'left' },
  { name: 'DoseOnce', label: '日劑量', field: 'DoseOnce', align: 'right' },
  { name: 'Frequency', label: '頻率', field: 'Frequency', align: 'left' },
  { name: '成數', label: '成數', field: '成數', align: 'left' },
  { name: 'Route', label: '途徑', field: 'Route', align: 'left' },
  { name: 'MedicationDays2', label: '健保天數', field: 'MedicationDays2', align: 'right' },
  { name: 'MedicationDays', label: '自費天數', field: 'MedicationDays', align: 'right' },
  { name: 'TotalAmount2', label: '健保總量', field: 'TotalAmount2', align: 'right' },
  { name: 'TotalAmount', label: '自費總量', field: 'TotalAmount', align: 'right' },
  { name: 'TotalBill', label: '金額', field: 'TotalBill', align: 'right' },
  { name: 'PayType', label: '給付類別', field: 'PayType', align: 'left' },
  { name: 'Mill', label: '磨粉', field: 'Mill', align: 'center' },
  { name: 'ChronicNotes', label: '連續處方', field: 'ChronicNotes', align: 'center' },
  { name: 'EmergencyFlag', label: '急作', field: 'EmergencyFlag', align: 'center' },
]
</script>

