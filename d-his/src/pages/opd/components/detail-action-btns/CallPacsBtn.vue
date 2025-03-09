<template>
  <q-btn class="header-btn" label="Call PACS" unelevated dense @click="toDC600"></q-btn>
</template>

<script setup>
import { useOpdStore } from 'stores/opd.js'
import { getOpdPacsOrderByOpdId } from 'api'
import { reactive, watch } from 'vue'

const opdStore = useOpdStore()

const pacsData = reactive({
  AccessionNo: null,
  OrderDate: null,
})
const GetOpdPacsOrderByOpdId = async () => {
  const { data } = await getOpdPacsOrderByOpdId(opdStore.opdData.OpdId).then((res) => res)
  Object.assign(pacsData, data)
}

const toDC600 = () => {
  const path = `pacs://PatientID=${opdStore.opdData.PatientId},AccessionNo=${pacsData.AccessionNo},StudyDate=${pacsData.OrderDate},AccountID=A001,Password=`
  window.open(path)
}

const init = () => {
  if (opdStore.opdData.OpdId) {
    GetOpdPacsOrderByOpdId()
  } else {
    const unwatch = watch(
      () => opdStore.opdData.OpdId,
      (val) => {
        if (val) {
          GetOpdPacsOrderByOpdId()
          unwatch()
        }
      }
    )
  }
}
init()
</script>

