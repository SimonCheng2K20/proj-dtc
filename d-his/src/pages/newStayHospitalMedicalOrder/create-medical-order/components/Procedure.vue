<template>
  <div>
    <procedure-table
      ref="procedureTableRef"
      title="E 手術檢查治療"
      v-model:rows="proceduresRows"
      :columns="proceduresColumns"
      preset
    ></procedure-table>

    <div class="h-16 border border-soild border-[#a6bee3] bg-[#EEF8FF] flex justify-end items-center border-t-0">
      <q-btn class="mr-5 h-6 leading-6" color="pink-10" unelevated dense size="16px" @click="PutIpdProcedures"
        >完成醫囑</q-btn
      >
    </div>

    <div class="mt-10 px-3 flex">
      <p class="bg-[#1976d2] text-white text-xl font-medium px-2 rounded">檢查處置紀錄</p>
    </div>
    <div class="mb-5 mt-3">
      <procedure-table
        title="E 手術檢查治療"
        v-model:rows="proceduresRowsReadOnly"
        :columns="proceduresColumnsReadOnly"
        preset
        readonly
      ></procedure-table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useQuasar } from 'quasar'
import { getIpdProceduresItem, putIpdProcedures } from 'api'
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash-es'

import ProcedureTable from 'components/opd/ProcedureTable.vue'

const route = useRoute()
const $q = useQuasar()

const proceduresColumns = [
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
  'SelfFlag',
  'action',
]
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
  'SelfFlag',
  'BookingStartTime',
  'BookingEndTime',
]
const proceduresRows = ref([])
const proceduresRowsReadOnly = ref([])
const procedureTableRef = ref()

const loadingIpdProcedures = ref(false)
const GetIpdProceduresItem = async () => {
  loadingIpdProcedures.value = true
  try {
    const res = await getIpdProceduresItem(route.params.Id)
    if (res.status === 200) {
      proceduresRows.value = cloneDeep(res.data.IpdProcedures)
      proceduresRowsReadOnly.value = cloneDeep(res.data.IpdProcedures)
    }
  } catch (error) {
    console.log(error)
  } finally {
    loadingIpdProcedures.value = false
  }
}

const PutIpdProcedures = async () => {
  procedureTableRef.value.validate()
  if (!procedureTableRef.value.validate().result) {
    procedureTableRef.value.validate().errorInputRef.focus()
    return false
  }
  loadingIpdProcedures.value = true
  const setProceduresRows = proceduresRows.value.map((item) => {
    const setItem = { ...item }
    if (!item.ProcedureDate) {
      setItem.ProcedureDate = dayjs().format('YYYY-MM-DD')
    }
    setItem.IpdId = route.params.Id
    delete setItem.Id
    return setItem
  })
  const body = { IpdId: route.params.Id, IpdProcedures: setProceduresRows }
  try {
    const res = await putIpdProcedures(body)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '更新E檢查治療成功',
        position: 'top',
      })
      GetIpdProceduresItem()
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

