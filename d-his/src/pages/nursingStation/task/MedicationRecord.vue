<template>
  <div class="p-2">
    <medicine-table
      v-model:rows="medicineRowsReadOnly"
      :columns="columnsReadOnly"
      :loading="loadingIpdMedications"
      preset
      readonly
    >
    </medicine-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { getIpdExecuteMedicationsItem } from 'api'
import { cloneDeep } from 'lodash'

import MedicineTable from 'components/opd/MedicineTable.vue'

const route = useRoute()

const columnsReadOnly = [
  'MedicationDate',
  'MedicineId',
  'book',
  'Name',
  'DoseOnce',
  'UnitName',
  'FrequencyCode',
  'RouteCode',
  'SelfFlag',
  'Formula',
  'Mill',
  'StartDate',
  'EndDate',
  'TotalAmountStayHospital',
  'StopDate',
  'AttendingDocName',
  'ExecuteStatus',
  'ExecuteStaffName',
]
const medicineRowsReadOnly = ref([])

const loadingIpdMedications = ref(false)

const GetIpdExecuteMedicationsItem = async () => {
  loadingIpdMedications.value = true
  try {
    const res = await getIpdExecuteMedicationsItem(route.params.ipdId)
    if (res.data) medicineRowsReadOnly.value = cloneDeep(res.data.IpdMedications)
  } catch (error) {
    console.log(error)
  } finally {
    loadingIpdMedications.value = false
  }
}

const init = () => {
  GetIpdExecuteMedicationsItem()
}
init()
</script>

