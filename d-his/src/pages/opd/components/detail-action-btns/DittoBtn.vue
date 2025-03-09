<template>
  <q-btn class="header-btn" label="DITTO" unelevated dense @click="onDittoClick"></q-btn>
</template>

<script setup>
import { pick } from 'lodash-es'
import { useOpdStore } from 'stores/opd.js'
import { useQuasar } from 'quasar'
import { getDITTOLastOne, getOpdRecordItem } from 'api'
import setSearchQuery from 'utils/setSearchQuery'

const $q = useQuasar()
const opdStore = useOpdStore()

const onDittoClick = async () => {
  const dittoErrorMessage = (error) => {
    $q.notify({
      type: 'negative',
      message:
        '取得病患歷史資料發生錯誤：' +
        (typeof error.response.data === 'string' ? error.response.data : JSON.stringify(error.response.data)),
      position: 'top',
    })
  }

  const query = setSearchQuery({ patientId: opdStore.opdData.PatientId })
  const { data: opdId, error } = await GetDITTOLastOne(query)
  if (error) {
    dittoErrorMessage(error)
    return
  }

  if (opdId) {
    const { data, error } = await GetOpdRecordItem(opdId, true)
    if (error) {
      dittoErrorMessage(error)
      return
    }

    if (data) {
      opdStore.setOpdData(
        pick(data, ['Subjective', 'Objective', 'OpdPlan', 'OpdDiagnoses', 'OpdMedications', 'OpdProcedures'])
      )
    }
  } else {
    $q.notify({
      type: 'negative',
      message: '此病患無前次病歷紀錄',
      position: 'top',
    })
  }
}

const GetDITTOLastOne = async (query) => {
  try {
    const res = await getDITTOLastOne(query)
    return { data: res.data }
  } catch (error) {
    return { error }
  }
}

const GetOpdRecordItem = async (opdId) => {
  try {
    const res = await getOpdRecordItem(opdId)
    return { data: res.data }
  } catch (error) {
    return { error }
  }
}
</script>

