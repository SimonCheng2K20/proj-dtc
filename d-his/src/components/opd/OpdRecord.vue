<template>
  <div class="grid gap-2 grid-cols-2 auto-rows-[200px]">
    <q-card flat square bordered>
      <q-card-section class="my-card-title flex items-center gap-2">
        <q-checkbox
          v-if="selectable"
          v-model="checkboxSelected"
          val="Subjective"
          dense
          @update:modelValue="(val) => emit('update:selected', val)"
        ></q-checkbox>
        S 病患主訴
      </q-card-section>
      <q-card-section>{{ opdData.Subjective }}</q-card-section>
    </q-card>
    <q-card flat square bordered>
      <q-card-section class="my-card-title flex items-center gap-2">
        <q-checkbox
          v-if="selectable"
          v-model="checkboxSelected"
          val="Objective"
          dense
          @update:modelValue="(val) => emit('update:selected', val)"
        ></q-checkbox>
        O 病患客觀
      </q-card-section>
      <q-card-section>{{ opdData.Objective }}</q-card-section>
    </q-card>
    <icd-table :columns="icdColumns" :rows="opdData.OpdDiagnoses" readonly>
      <template #title-prepend>
        <q-checkbox
          v-if="selectable"
          v-model="checkboxSelected"
          val="OpdDiagnoses"
          dense
          @update:modelValue="(val) => emit('update:selected', val)"
        ></q-checkbox>
      </template>
    </icd-table>
    <q-card flat square bordered>
      <q-card-section class="my-card-title flex items-center gap-2">
        <q-checkbox
          v-if="selectable"
          v-model="checkboxSelected"
          val="OpdPlan"
          dense
          @update:modelValue="(val) => emit('update:selected', val)"
        ></q-checkbox>
        P 診療計畫
      </q-card-section>
      <q-card-section>{{ opdData.OpdPlan }}</q-card-section>
    </q-card>
    <medicine-table class="col-span-full" :columns="medicineColumns" :rows="opdData.OpdMedications" readonly>
      <template #title-prepend>
        <q-checkbox
          v-if="selectable"
          v-model="checkboxSelected"
          val="OpdMedications"
          dense
          @update:modelValue="(val) => emit('update:selected', val)"
        ></q-checkbox>
      </template>
    </medicine-table>
    <procedure-table class="col-span-full" :columns="procedureColumns" :rows="opdData.OpdProcedures" readonly>
      <template #title-prepend>
        <q-checkbox
          v-if="selectable"
          v-model="checkboxSelected"
          val="OpdProcedures"
          dense
          @update:modelValue="(val) => emit('update:selected', val)"
        ></q-checkbox>
      </template>
    </procedure-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import IcdTable from './IcdTable.vue'
import ProcedureTable from './ProcedureTable.vue'
import MedicineTable from './MedicineTable.vue'

const props = defineProps({
  opdData: Object,
  selectable: Boolean,
  selected: {
    type: Array,
    default: () => [],
  },
})

const emit = defineEmits(['update:selected'])

const checkboxSelected = ref([])

const medicineColumns = [
  'index',
  'MedicineId',
  'book',
  'Name',
  'DoseOnce',
  'MedicationUnitCode',
  'FrequencyCode',
  'OneDay',
  'MedicationDays',
  'MedicationDays2',
  'Formula',
  'Mill',
  'TotalAmount',
  'TotalAmount2',
  'ChronicNotes',
  'RouteCode',
]

const procedureColumns = ['index', 'ProcedureCode', 'Name', 'Amount', 'SelfPayFlag', 'EmergencyFlag']

const icdColumns = ['index', 'Icd10Code', 'Icd9Code', 'Name']
</script>
