<template>
  <q-page class="p-2">
    <div class="text-end">
      <q-btn color="primary" label="儲存" unelevated></q-btn>
    </div>
    <div class="grid grid-cols-2 gap-2 mt-2">
      <q-table v-bind="QTableProps" title="診斷碼" :columns="diagnosisColumns" :rows="diagnosisRows"></q-table>
      <q-table v-bind="QTableProps" title="手術（處置）碼" :columns="operationColumns" :rows="operationRows"></q-table>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { QTableProps } from 'utils/quasar-extends/base-props.js'

const diagnosisColumns = [
  { name: 'index', label: '項次', field: 'index', align: 'left' },
  { name: 'Code', label: '診斷碼', field: 'Code', align: 'left' },
  { name: 'Name', label: '診斷名稱', field: 'Name', align: 'left' },
]

const diagnosisRows = ref([])

const operationColumns = [
  { name: 'index', label: '項次', field: 'index', align: 'left' },
  { name: 'Code', label: '手術（OP）代碼', field: 'Code', align: 'left' },
  { name: 'Name', label: '手術（OP）名稱', field: 'Name', align: 'left' },
]

const operationRows = ref([])
</script>
