<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss full-width>
    <my-dialog-content header="Vital-Signs 趨勢圖" height="500px" @close="onDialogCancel">
      <div>
        <ChartItem ref="chartRef" :anesthesiaBodySymptoms="rows" />
      </div>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref, nextTick, onMounted, watch } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import ChartItem from './ChartItem.vue'

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  rows: { Type: Array, default: [] },
})
const chartRef = ref()

const init = () => {
  const unwatch = watch(chartRef, (val) => {
    if (val) {
      console.log('test', chartRef.value)
      chartRef.value.createChart()
      unwatch()
    }
  })
}
init()
</script>

<style lang="scss" scoped></style>

