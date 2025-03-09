<template>
  <q-dialog ref="dialogRef" full-width no-backdrop-dismiss>
    <my-dialog-content header="用藥查詢" @close="onDialogCancel">
      <div class="flex flex-nowrap">
        <div class="border border-[#215dbb]">
          <q-table
            v-bind="QTableProps"
            :columns="columns"
            row-key="OpdId"
            :rows="dittoItems"
            :loading="getListLoading"
            :selected="selected"
            @row-click="onRowClick"
          >
          </q-table>
        </div>
        <div class="grow border border-[#215dbb]">
          <medicine-table :rows="opdData.OpdMedications" :columns="drugColumns" readonly :loading="getItemLoading"></medicine-table>
        </div>
      </div>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { getDITTOAll, getOpdRecordItem } from 'api'
import setSearchQuery from 'utils/setSearchQuery'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { useOpdStore } from 'stores/opd'
import MedicineTable from './MedicineTable.vue'
import { QTableProps } from 'utils/quasar-extends/base-props.js'

const $q = useQuasar()
const { dialogRef, onDialogCancel } = useDialogPluginComponent()
const opdStore = useOpdStore()

const emit = defineEmits(['bookShow'])

const columns = [
  { name: 'CreateDatetime', label: '日期', field: (row) => row.CreateDatetime?.substring(0, 10), align: 'left' },
  { name: 'SignedDocName', label: '醫生', field: 'SignedDocName', align: 'left' },
]
const selected = ref([])

const onRowClick = (evt, row) => {
  selected.value = [row]
  GetOpdRecordItem(row.OpdId)
}

const getListLoading = ref(false)
const dittoItems = ref([])
const GetDITTOAll = async () => {
  try {
    getListLoading.value = true
    const query = setSearchQuery({ $filter: filter.value })
    const res = await getDITTOAll(query)
    if (res.status === 200) {
      dittoItems.value = res.data.Items
    }
  } catch (err) {
    console.log(err)
  } finally {
    getListLoading.value = false
  }
}

const filter = computed(() => {
  return `PatientId eq '${opdStore.opdData.PatientId}'`
})

const drugColumns = [
  'index',
  'MedicineId',
  'book',
  'Name',
  'DoseOnce',
  'FrequencyCode',
  'OneDay',
  'MedicationDays',
  'MedicationDays2',
  'Formula',
  'TotalAmount',
  'TotalAmount2',
  'ChronicNotes',
  'RouteCode',
]

const getItemLoading = ref(false)
const opdData = reactive({})
const GetOpdRecordItem = async (opdId) => {
  try {
    getItemLoading.value = true
    const res = await getOpdRecordItem(opdId)
    if (res.status === 200) {
      Object.assign(opdData, res.data)
    }
    console.log(getItemLoading.value)
  } catch (err) {
    console.log(err)
  } finally {
    getItemLoading.value = false
  }
}

const init = () => {
  GetDITTOAll()
}
init()
</script>

