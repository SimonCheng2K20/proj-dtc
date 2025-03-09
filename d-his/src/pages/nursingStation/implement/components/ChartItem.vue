<template>
  <div class="relative">
    <div id="chart-container"></div>

    <div class="absolute z-1 grid grid-cols-5 gap-2" :style="{ top: isNoData ? '18px' : '42px' }" v-if="!isNoData">
      <div :style="`color: ${RrColor}`">呼吸</div>
      <div :style="`color: ${HrColor}`">脈搏</div>
      <div :style="`color: ${bloodPressureColor}`">血壓</div>
      <div :style="`color: ${bodyTemperatureColor}`">體溫</div>
      <div :style="`color: ${PainColor}`">疼痛</div>
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

const RrArr = computed(() =>
  props.anesthesiaBodySymptoms
    .filter((item) => !!item.Rr && dayjs(item.VitalSignDatetime).isValid())
    .map((item) => ({
      x: dayjs(item.VitalSignDatetime).$d,
      y: item.Rr,
    }))
)
const HrArr = computed(() =>
  props.anesthesiaBodySymptoms
    .filter((item) => !!item.Hr && dayjs(item.VitalSignDatetime).isValid())
    .map((item) => ({
      x: dayjs(item.VitalSignDatetime).$d,
      y: item.Hr,
    }))
)
const bloodPressureArr = computed(() =>
  props.anesthesiaBodySymptoms
    .filter(
      (item) =>
        !!item.BloodPressureLow &&
        !!item.BloodPressureHigh &&
        !!item.BloodPressureAvg &&
        dayjs(item.VitalSignDatetime).isValid()
    )
    .map((item) => ({
      x: dayjs(item.VitalSignDatetime).$d,
      y: [
        item.BloodPressureLow,
        item.BloodPressureAvg,
        item.BloodPressureAvg,
        item.BloodPressureHigh,
        item.BloodPressureAvg,
      ], // 0, 3, 4
    }))
)
const PainArr = computed(() =>
  props.anesthesiaBodySymptoms
    .filter((item) => !!item.Pain && dayjs(item.VitalSignDatetime).isValid())
    .map((item) => ({
      x: dayjs(item.VitalSignDatetime).$d,
      y: item.Pain,
    }))
)
const bodyTemperatureArr = computed(() =>
  props.anesthesiaBodySymptoms
    .filter((item) => !!item.BodyTemperature && dayjs(item.VitalSignDatetime).isValid())
    .map((item) => ({
      x: dayjs(item.VitalSignDatetime).$d,
      y: item.BodyTemperature,
    }))
)

const isNoData = computed(() => props.anesthesiaBodySymptoms.length === 0)

const PainColor = colors.getPaletteColor('blue')
const bodyTemperatureColor = colors.getPaletteColor('green')
const bloodPressureColor = colors.getPaletteColor('purple')
const HrColor = colors.getPaletteColor('red')
const RrColor = colors.getPaletteColor('indigo')

const chart = ref()

const createChart = () => {
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

        return `<div class="text-xl">${dayjs(date).format('HH:mm')}</div>` + dataString.join('')
      },
    },
    legend: {
      cursor: 'pointer',
      verticalAlign: 'top',
      horizontalAlign: 'right',
    },
    axisX: {
      title: '時間',
      valueFormatString: 'HH:mm',
    },
    axisY: [
      {
        // title: '疼痛',
        labelFontColor: PainColor,
        maximum: 10,
        minimum: 0,
      },
      {
        // title: '體溫',
        labelFontColor: bodyTemperatureColor,
        maximum: 42,
        minimum: 35,
      },
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
        // title: '呼吸',
        labelFontColor: RrColor,
        maximum: 70,
        minimum: 0,
      },
    ],
    data: [
      {
        type: 'line',
        color: PainColor,
        axisYIndex: 0,
        showInLegend: true,
        legendText: '疼痛',
        name: '疼痛',
        dataPoints: PainArr.value,
      },
      {
        type: 'line',
        color: bodyTemperatureColor,
        axisYIndex: 1,
        showInLegend: true,
        legendText: '體溫',
        name: '體溫',
        dataPoints: bodyTemperatureArr.value,
      },
      {
        type: 'boxAndWhisker',
        color: bloodPressureColor,
        axisYIndex: 2,
        showInLegend: true,
        legendText: '血壓',
        name: '血壓',
        dataPoints: bloodPressureArr.value,
      },
      {
        type: 'line',
        color: HrColor,
        axisYIndex: 3,
        showInLegend: true,
        legendText: '脈搏',
        name: '脈搏',
        dataPoints: HrArr.value,
      },
      {
        type: 'line',
        color: RrColor,
        axisYIndex: 4,
        showInLegend: true,
        legendText: '呼吸',
        name: '呼吸',
        dataPoints: RrArr.value,
      },
    ],
  })
  chart.value.render()
}

defineExpose({
  createChart,
})
</script>

