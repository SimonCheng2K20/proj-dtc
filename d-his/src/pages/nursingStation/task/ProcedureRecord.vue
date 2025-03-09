<template>
  <div class="p-2">
    <procedure-table v-model:rows="proceduresRowsReadOnly" :columns="proceduresColumnsReadOnly" preset readonly></procedure-table>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getIpdProceduresItem } from 'api'
import { cloneDeep } from 'lodash-es'
import dayjs from 'dayjs'

import ProcedureTable from 'components/opd/ProcedureTable.vue'

const route = useRoute()

const proceduresColumnsReadOnly = [
  'index',
  'ProcedureDate',
  'ProcedureCode',
  'Name',
  'TreatmentSites',
  'EmergencyFlag',
  'Amount',
  'Price',
  'Note',
  'SelfPayFlag',
  'BookingStartTime',
  'BookingEndTime',
]

const proceduresRowsReadOnly = ref([])
const loadingIpdProcedures = ref(false)

const GetIpdProceduresItem = async () => {
  loadingIpdProcedures.value = true
  try {
    const res = await getIpdProceduresItem(route.params.ipdId)
    if (res.status === 200) {
      proceduresRowsReadOnly.value = cloneDeep(res.data.IpdProcedures)
    }
  } catch (error) {
    console.log(error)
  } finally {
    loadingIpdProcedures.value = false
  }
}

const init = () => {
  GetIpdProceduresItem()
}
init()
</script>

