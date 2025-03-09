<template>
  <q-page class="p-2">
    <div class="grid gap-2">
      <q-table v-bind="QTableProps" title="手術" :columns="operationColumns" :rows="operationRows"></q-table>
      <q-table v-bind="QTableProps" title="E 檢查治療" :columns="procedureColumns" :rows="procedureRows"></q-table>
      <q-table v-bind="QTableProps" title="M 住院醫囑用藥" :columns="medicineColumns" :rows="medicineRows"></q-table>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { QTableProps } from 'utils/quasar-extends/base-props.js'

const operationColumns = [
  { name: 'Name', label: '手術（OP）名稱', field: 'Name', align: 'left' },
  { name: 'Room', label: '手術室', field: 'Room', align: 'left' },
  { name: 'Date', label: '手術（OP）日期', field: 'Date', align: 'left' },
  { name: 'Time', label: '手術（OP）時間', field: 'Time', align: 'left' },
  { name: 'Remark', label: '備註', field: 'Remark', align: 'left' },
  { name: 'Status', label: '狀態', field: 'Status', align: 'left' },
]

const operationRows = ref([])

const procedureColumns = [
  { name: 'index', label: '序號', field: 'index', align: 'left' },
  { name: 'Code', label: '院內治療處置代碼', field: 'Code', align: 'left' },
  { name: 'Name', label: '治療處置名稱', field: 'Name', align: 'left' },
  { name: 'Amount', label: '數量', field: 'Amount', align: 'left' },
  { name: 'Health', label: '自費健保', field: 'Health', align: 'left' },
  { name: '緊急', label: '緊急', field: '緊急', align: 'left' },
  { name: 'ReserveDate', label: '預約日期時間', field: 'ReserveDate', align: 'left' },
  { name: 'DoDate', label: '執行日期', field: 'DoDate', align: 'left' },
  { name: 'DoTime', label: '執行時間', field: 'DoTime', align: 'left' },
  { name: 'Status', label: '狀態', field: 'Status', align: 'left' },
]

const procedureRows = ref([])

const medicineColumns = [
  { name: 'index', label: '序號', field: 'index', align: 'center' },
  { name: 'MedicineId', label: '藥品代碼', field: 'MedicineId', align: 'center' },
  { name: 'book', label: '藥典', field: 'book', align: 'center' },
  { name: 'Name', label: '藥品名稱', field: (row) => row.EName || row.CName, align: 'center' },
  { name: 'DoseOnce', label: '日劑量', field: 'DoseOnce', align: 'center', classes: 'min-w-[120px]' },
  { name: 'MedicationUnitCode', label: '單位', field: 'MedicationUnitCode', align: 'center' },
  { name: 'FrequencyCode', label: '頻次', field: 'FrequencyCode', align: 'center' },
  { name: 'OneDay', label: '日份', field: 'OneDay', align: 'center' },
  { name: 'MedicationDays', label: '自費天數', field: 'MedicationDays', align: 'center', classes: 'min-w-[120px]' },
  { name: 'MedicationDays2', label: '健保天數', field: 'MedicationDays2', align: 'center', classes: 'min-w-[120px]' },
  { name: 'Formula', label: '調劑', field: 'Formula', align: 'center' },
  { name: 'Mill', label: '磨粉', field: 'Mill', align: 'center' },
  { name: 'StartDate', label: '起日', field: 'StartDate', align: 'center', classes: 'min-w-[160px]' },
  { name: 'EndDate', label: '迄日', field: 'EndDate', align: 'center', classes: 'min-w-[160px]' },
  { name: 'TotalAmount', label: '自費總量', field: 'TotalAmount', align: 'center', classes: 'min-w-[120px]' },
  { name: 'TotalAmount2', label: '健保總量', field: 'TotalAmount2', align: 'center', classes: 'min-w-[120px]' },
  { name: 'ChronicNotes', label: '慢箋', field: 'ChronicNotes', align: 'center', classes: 'min-w-[160px]' },
  { name: 'RouteCode', label: '途徑', field: 'RouteCode', align: 'center' },
  { name: 'Status', label: '狀態', field: 'Status', align: 'left' },
]

const medicineRows = ref([])
</script>
