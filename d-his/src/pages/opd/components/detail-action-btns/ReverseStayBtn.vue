<template>
  <q-btn class="header-btn" label="預約住院" unelevated dense @click="onReserveStayHospitalClick"></q-btn>
</template>

<script setup>
import ReserveHospitalStay from '../ReserveHospitalStay.vue'
import ReservedMessage from '../ReservedMessage.vue'
import StayHospitalConsent from '../StayHospitalConsent.vue'
import { useQuasar } from 'quasar'
import { getIsPatientReserve } from 'api'
import { useOpdStore } from 'stores/opd.js'
import { ref } from 'vue'
import setSearchQuery from 'utils/setSearchQuery'

const opdStore = useOpdStore()
const $q = useQuasar()

const onReserveStayHospitalClick = async () => {
  reserveLoading.value = true

  const { data: reserveData } = await GetIsPatientReserve()

  const showReserve = () => {
    const dialog = $q
      .dialog({
        component: ReserveHospitalStay,
        componentProps: {
          hasReservedId: reserveData.IpdId,
        },
      })
      .onOk((IpdId) => {
        showStayHospitalConsent(IpdId)
        dialog.hide()
      })
  }

  if (reserveData) {
    const dialog = $q
      .dialog({
        component: ReservedMessage,
        componentProps: {
          data: { ...reserveData, PersonName: opdStore.opdData.PersonName },
        },
      })
      .onOk(() => {
        showReserve()
        dialog.hide()
      })
  } else {
    showReserve()
  }

  reserveLoading.value = false
}

const reserveLoading = ref(false)
const GetIsPatientReserve = async () => {
  try {
    const query = setSearchQuery({
      Area: opdStore.opdData.DepartmentId,
      PatientId: opdStore.opdData.PatientId,
    })
    const res = await getIsPatientReserve(query)
    return { data: res.data }
  } catch (error) {
    console.log(error)
    return { error }
  }
}

const showStayHospitalConsent = (IpdId) => {
  const dialog = $q.dialog({
    component: StayHospitalConsent,
    componentProps: {
      IpdId: IpdId,
    },
  })
}
</script>

