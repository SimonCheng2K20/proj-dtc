<template>
  <div class="flex gap-1">
    <q-btn
      class="btn-sp"
      dense
      unelevated
      label="選取病人"
      @click="$router.push({ name: 'nursingStation-clerk' })"
    ></q-btn>
    <q-btn
      class="btn-sp"
      dense
      unelevated
      label="入院作業"
      @click="$router.push({ name: 'nursingStation-inHospital' })"
    ></q-btn>
    <q-btn
      class="btn-sp"
      dense
      unelevated
      label="帳務作業"
      @click="$router.push({ name: 'nursingStation-accounting' })"
    ></q-btn>
  </div>
</template>
