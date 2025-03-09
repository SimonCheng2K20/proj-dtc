<template>
  <q-dialog ref="dialogRef" full-width no-backdrop-dismiss>
    <my-dialog-content header="歷史資料" width="1280px" @close="onDialogCancel">
      <div class="flex justify-end mb-2">
        <q-btn label="vital-signs 趨勢圖" color="green" dense unelevated @click="openVitalSignsDialog"></q-btn>
      </div>
      <q-table
        v-bind="QTableProps"
        :rows="rows"
        :columns="columns"
        row-key="Id"
        :pagination="{ rowsPerPage: -1 }"
        :loading="getDataloading"
      ></q-table>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import setSearchQuery from 'utils/setSearchQuery.js'
import { getMeasure } from 'api'
import { QTableProps } from 'utils/quasar-extends/base-props.js'
import { useDialogPluginComponent, useQuasar } from 'quasar'

import VitalSignsDialog from './VitalSignsDialog.vue'
import { cloneDeep } from 'lodash-es'

const $q = useQuasar()
const { dialogRef, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  patientId: String,
})

const columns = [
  { name: 'CreateDatetime', label: '日期', field: (row) => row.CreateDatetime?.substring(0, 10), align: 'left' },
  {
    name: 'BloodPressure',
    label: '血壓',
    field: (row) => `${row.BloodPressureHigh ?? ''} mmHg/${row.BloodPressureLow ?? ''} mmHg`,
    align: 'right',
  },
  { name: 'Pulse', label: '脈搏', field: (row) => `${row.Pulse ?? ''} bpm`, align: 'right' },
  { name: 'Height', label: '身高', field: (row) => `${row.Height ?? ''} cm`, align: 'right' },
  { name: 'Weight', label: '體重', field: (row) => `${row.Weight ?? ''} kg`, align: 'right' },
  { name: 'bmi', label: 'BMI', field: (row) => getBMI({ weight: row.Weight, height: row.Height }), align: 'right' },
  // { name: 'action', label: '操作', field: 'action' ,align:'left'},
]

const getBMI = ({ weight, height }) => {
  const bmi = Math.round((weight / (height / 100) ** 2) * 10) / 10
  return isNaN(bmi) || bmi === Infinity ? null : bmi
}

const getDataloading = ref(false)
const rows = ref([])
const GetMeasure = async () => {
  try {
    getDataloading.value = true
    const query = setSearchQuery({
      $filter: `patientId eq '${props.patientId}'`,
    })
    const res = await getMeasure(query)
    rows.value = res.data.Items
  } catch (err) {
    console.log(err)
  } finally {
    getDataloading.value = false
  }
}

const openVitalSignsDialog = () => {
  //暫時前端先自己加平均血壓
  const addBloodAvgRows = rows.value.map((item) => {
    item.BloodPressureAvg = Number(item.BloodPressureHigh) / 3 + (Number(item.BloodPressureLow) * 2) / 3
    return item
  })
  const dialog = $q.dialog({
    component: VitalSignsDialog,
    componentProps: {
      rows: addBloodAvgRows,
    },
  })
}

const init = () => {
  GetMeasure()
}
init()
</script>

