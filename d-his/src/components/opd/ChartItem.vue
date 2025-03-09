<template>
  <div class="relative">
    <div id="chart-container"></div>

    <div class="absolute z-1 grid grid-cols-5 gap-2" :style="{ top: isNoData ? '18px' : '42px' }" v-if="!isNoData">
      <div :style="`color: ${WeightColor}`">體重</div>
      <div :style="`color: ${HrColor}`">脈搏</div>
      <div :style="`color: ${bloodPressureColor}`">血壓</div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import dayjs from 'dayjs'
import 'assets/canvasjs.min.js'
import { colors } from 'quasar'

const props = defineProps({
  anesthesiaBodySymptoms: Array,
})

const WeightArr = computed(() =>
  props.anesthesiaBodySymptoms
    .filter((item) => !!item.Weight && dayjs(item.CreateDatetime).isValid())
    .map((item) => ({
      x: dayjs(item.CreateDatetime).$d,
      y: item.Weight,
    }))
)
const HrArr = computed(() =>
  props.anesthesiaBodySymptoms
    .filter((item) => !!item.Pulse && dayjs(item.CreateDatetime).isValid())
    .map((item) => ({
      x: dayjs(item.CreateDatetime).$d,
      y: item.Pulse,
    }))
)
const bloodPressureArr = computed(() =>
  props.anesthesiaBodySymptoms
    .filter(
      (item) =>
        !!item.BloodPressureLow &&
        !!item.BloodPressureHigh &&
        !!item.BloodPressureAvg &&
        dayjs(item.CreateDatetime).isValid()
    )
    .map((item) => ({
      x: dayjs(item.CreateDatetime).$d,
      y: [
        item.BloodPressureLow,
        item.BloodPressureAvg,
        item.BloodPressureAvg,
        item.BloodPressureHigh,
        item.BloodPressureAvg,
      ], // 0, 3, 4
    }))
)

const isNoData = computed(() => props.anesthesiaBodySymptoms.length === 0)

const bloodPressureColor = colors.getPaletteColor('purple')
const HrColor = colors.getPaletteColor('red')
const WeightColor = colors.getPaletteColor('indigo')

const chart = ref()

const createChart = () => {
  console.log(props.anesthesiaBodySymptoms)
  chart.value = new CanvasJS.Chart('chart-container', {
    // 產生 PDF 時寬度需固定，否則會超出框線
    title: {
      text: '趨勢圖',
    },
    toolTip: {
      shared: true,
      content: (evt) => {
        const date = evt.entries[0].dataPoint.x
        const dataString = evt.entries.map((item) => {
          const { x, y, data } = item.dataPoint
          const { color, name, type } = item.dataSeries
          if (type === 'boxAndWhisker') {
            return `<div style="color:${color}"><div>收縮壓: ${y[3]}</div><div>舒張壓: ${y[0]}</div><div>平均動脈壓: ${y[4]}</div></div>`
          } else {
            return `<div style="color:${color}">${name}: ${y}</div>`
          }
        })

        return `<div class="text-xl">${dayjs(date).format('YYYY-MM-DD')}</div>` + dataString.join('')
      },
    },
    legend: {
      cursor: 'pointer',
      verticalAlign: 'top',
      horizontalAlign: 'right',
    },
    axisX: {
      title: '日期',
      valueFormatString: 'YYYY-MM-DD',
    },
    axisY: [
      {
        // title: '血壓',
        labelFontColor: bloodPressureColor,
        maximum: 210,
        minimum: 0,
        interval: 30,
      },
      {
        // title: '脈搏',
        labelFontColor: HrColor,
        maximum: 180,
        minimum: 40,
      },
      {
        // title: '體重',
        labelFontColor: WeightColor,
        maximum: 100,
        minimum: 30,
      },
    ],
    data: [
      {
        type: 'boxAndWhisker',
        color: bloodPressureColor,
        axisYIndex: 0,
        showInLegend: true,
        legendText: '血壓',
        name: '血壓',
        dataPoints: bloodPressureArr.value,
      },
      {
        type: 'line',
        color: HrColor,
        axisYIndex: 1,
        showInLegend: true,
        legendText: '脈搏',
        name: '脈搏',
        dataPoints: HrArr.value,
      },
      {
        type: 'line',
        color: WeightColor,
        axisYIndex: 2,
        showInLegend: true,
        legendText: '體重',
        name: '體重',
        dataPoints: WeightArr.value,
      },
    ],
  })
  chart.value.render()
}

defineExpose({
  createChart,
})
</script>

