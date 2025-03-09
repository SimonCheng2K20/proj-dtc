<template>
  <div id="print_parts">
    <reportPage
      v-for="({patient, history, info}, index) in reports"
      :key="'report' + index"
      :patient="patient"
      :history="history"
      :reportInfo="info"
    />
  </div>
</template>

<script>
import reportPage from "./reportPage";
export default {
  data () {
    return {

    };
  },
  components: {
    reportPage,
  },
  props: {
    reports: {
      type: Array,
      default: new Array(),
    },
  },
  created () {
    // console.log({ 'REPORTS': this.reports });
  }
};
</script>

<style lang="scss">
@import "@/styles/print.scss";
</style>

