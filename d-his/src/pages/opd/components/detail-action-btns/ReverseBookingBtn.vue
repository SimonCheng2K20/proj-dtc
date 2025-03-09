<template>
  <q-btn class="header-btn" label="預約掛號" unelevated dense @click="onReserveBookingClick"></q-btn>
</template>

<script setup>
import ReserveBooking from '../ReserveBooking.vue'
import { useQuasar } from 'quasar'

const $q = useQuasar()

const onReserveBookingClick = () => {
  const dialog = $q.dialog({
    component: ReserveBooking,
  })
}
</script>

