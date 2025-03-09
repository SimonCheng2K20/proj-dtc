<template>
  <div :style="{width:width,height:height}">
    <canvas ref="myChartBox"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  props:['width','height','data','type','options'],
  data() {
    return {
      chartObj:null
    }
  },
  watch: {
    data: {
      handler() {
        this.chartObj.update()
      },
      deep:true
    }
  },
  computed: {
    config() {
      return {
        type: this.type,
        data: this.data,
        options: {
          maintainAspectRatio:false,
          ...this.options
        }
      } 
    }
  },
  mounted() {
    this.chartObj = new Chart(
      this.$refs.myChartBox,
      this.config
    )
  }
}
</script>