<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss>
    <my-dialog-content header="支付點數核算" width="600px" class="font-bold text-xl text-[#003161]" @close="onDialogCancel">
      <div class="mb-2">
        1. 本手術醫令已完成基本診療項目：<span class="text-[#E90075]">{{ nhiPointData.CompletedPercent }}</span> %
      </div>
      <div class="mb-2">
        2. 本次支付點數全額：<span class="text-[#E90075]">{{ nhiPointData.AllNhiPoint }}</span> 點
      </div>
      <div class="mb-2">
        3. 目前已完成支付點數全額：<span class="text-[#E90075]">{{ nhiPointData.CompletedNhiPoint }}</span> 點
      </div>
      <template #actions>
        <q-btn unelevated color="grey" label="關閉" @click="onDialogCancel" />
      </template>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()
const props = defineProps({
  nhiPointData: Object,
})
</script>

