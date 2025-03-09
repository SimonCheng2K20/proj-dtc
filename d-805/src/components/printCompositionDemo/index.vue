<template>
  <div id="print_parts" class="p-3">
    <div class="break-before" v-for="(cs, idx) in canvasSource" :key="idx">
      <img class="w-100" :src="cs" />
    </div>
    <div id="reports" ref="reports">
      <printPage
        v-for="(report, idx) in reports"
        :key="'report' + idx"
        :report="report"
        class="break-always print-page w-100 noPrint"
        style="page-break-before: always;"
      />
    </div>
    <!-- <div class="border-deco" /> -->
  </div>
</template>

<script>
import html2canvas from "html2canvas";
import printPage from "./printPage";
export default {
  data() {
    return {
      canvasSource: [],
    };
  },
  props: {
    reports: {
      type: Array,
      default: new Array(),
    },
  },
  components: {
    printPage,
  },
  mounted() {
    this.$nextTick(() => {
      let reportNumber = this.reports.length;
      Array.from(this.$refs.reports.querySelectorAll(".page-inner")).forEach((el, idx) => {
        html2canvas(el).then((canvas) => {
          this.canvasSource.push(canvas.toDataURL());
          reportNumber -= 1;
          if (reportNumber === 0) this.$emit("startPrint");
        });
      });
    });
  },
};
</script>

<style lang="scss">
@import "@/styles/print2.scss";

#print_parts {
  color: #000;
  font-size: 18px;
  min-height: 99vh;
  // page-break-inside: avoid;
  // box-shadow: 0 0 5px 20px #000 inset;
  // border: 5px solid #000;
  .content {
    font-size: 21px;
  }
  .inner {
    padding: 10px 10px 10px 10px;
    margin-bottom: 50px;
  }
  h1 {
    background-color: $groundColor;
    color: #000;
    text-align: center;
    font-size: 38px;
  }
  h2 {
    background-color: $groundColor;
    color: #000;
  }
  h3 {
    margin-bottom: 10px;
  }
  .editable {
    display: inline-block;
    border: 1px solid #555;
    padding-left: 15px;
    padding-right: 15px;
    margin: 0 10px;
    &.txtarea {
      width: 98%;
      min-height: 33vh;
      padding: 15px;
    }
  }
  .radio {
    background-color: #ccc;
    border: 1px solid #666;
    border-radius: 50px;
    width: 16px;
    height: 16px;
    display: inline-block;
    position: relative;
    line-height: 100%;
    margin-right: 5px;
    transform: translateY(2px);
    &.checked::after {
      content: "";
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 60%;
      height: 60%;
      border-radius: 50px;
      background-color: #222;
      display: table;
    }
  }
  hr {
    margin: 10px 0 20px;
  }
  table {
    td {
      max-width: 40%;
      span {
        white-space: normal;
      }
    }
  }

  .print-page {
    margin-top: 15px;
    &:nth-child(1) {
      margin-top: 0;
    }
  }
}
#reports {
  width: 924px;
}
</style>
