<template>
  <q-btn class="header-btn" label="病歷紀錄" unelevated dense @click="toOpdRecord"></q-btn>
</template>

<script setup>
import { useOpdStore } from 'stores/opd.js'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()
const opdStore = useOpdStore()

const toOpdRecord = () => {
  router.push({
    name: 'OpdRecord-Ditto',
    query: { PatientId: opdStore.opdData.PatientId, type: 'opd', backpath: route.fullPath },
  })
}
</script>

