<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss full-width>
    <my-dialog-content header="P 治療計畫" width="600px" @close="onDialogOK">
      <plan-content ref="planContentRef" class="h-[300px]" v-model="opdStore.opdData.Plan"></plan-content>
      <template #actions>
        <q-btn unelevated color="primary" label="確定" @click="onDialogOK(opdStore.opdData.Plan)" />
      </template>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { useOpdStore } from 'stores/opd.js'
import { useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'

import PlanContent from 'components/opd/PlanContent.vue'
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()
const opdStore = useOpdStore()
</script>

