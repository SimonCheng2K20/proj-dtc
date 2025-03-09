<template>
  <div class="whole-page p-3">
    <div>
      <h3 class="bg-gray text-white p-2 page-title">
        {{ title }}
      </h3>
      <!-- <h3 class="bg-gray text-white p-2 page-title">陽明交通大學醫院</h3> -->
      <patient-info class="p-2 mb-2" :patient="patient" />
      <statements :asseys="essays" />
      <report
        v-if="reportInfo"
        :key="reportInfo.updateCount"
        :title="reportInfo.CSTName"
        :id="reportInfo.CSTId"
        :cstContent="reportInfo.cstHtml"
        :cstData="reportInfo.structureData"
      />
    </div>
    <div class="footer mt-2 p-2 d-table ml-auto">
      <div>開單醫師: {{ patient.RequestingPhysicianName }}</div>
      <div>列印時間: {{ $moment().format("YYYY-MM-DD hh:mm:ss") }}</div>
    </div>

    <div class="decoration">
      <div class="top" />
      <div class="left" />
      <div class="right" />
      <div class="bottom" />
    </div>
  </div>
</template>

<script>
import patientInfo from "./patientInfo";
import statements from "./statements";
import report from "@/components/report";
export default {
  data() {
    return {
      title: $setting.name,
      essays: [],
    };
  },
  components: {
    patientInfo,
    statements,
    report,
  },
  props: {
    reportInfo: {
      type: Object,
      default: null,
    },
    patient: {
      type: Object,
      default: null,
    },
    history: {
      type: Array,
      default: () => [],
    },
  },
  created() {
    this.essays = [
      {
        title: `歷史診斷報告(共${this.history.length}筆)`,
        content: this.history.reduce(
          (a, { AccessionNo, ProcedureName, IssueTime }, i) =>
            (a += `<div>${AccessionNo}</div><div>${ProcedureName}</div><div>${IssueTime}</div>${
              i === this.history.length - 1 ? "</div>" : ""
            }`),
          "<div class='essay-grid'><div class='essay-head'>申請單號</div><div class='essay-head'>項目</div><div class='essay-head'>完成時間</div>"
        ),
      },
      {
        title: "客觀",
        content:
          this.patient && this.patient.Objective ? this.patient.Objective : "",
      },
      {
        title: "主訴",
        content:
          this.patient && this.patient.Subjective
            ? this.patient.Subjective
            : "",
      },
    ];

    // console.log({ patient: this.patient });
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
/deep/ .essay-grid {
  display: grid;
  grid-gap: 3px;
  grid-row-gap: 3px;
  padding: 0;
  grid-template-columns: repeat(3, 1fr);
  .essay-head {
    text-align: center;
    font-weight: bold;
  }
}

.bg-gray {
  background-color: gray;
}

$borderLength: 3px;

div.decoration {
  > div {
    position: fixed;
    background-color: black;
    z-index: 100;
    &.left,
    &.right {
      width: $borderLength;
      height: 100%;
      top: 0;
    }
    &.left {
      left: 0;
    }
    &.right {
      right: 0;
    }
    &.top,
    &.bottom {
      width: 100%;
      height: $borderLength;
      left: 0;
    }
    &.top {
      top: 0;
    }
    &.bottom {
      bottom: 0;
    }
  }
}

.page-title {
  font-weight: bold;
}
.whole-page {
  width: 100%;
  min-height: 100vh;
  page-break-before: always;
  page-break-after: always;
}

.break-after {
  page-break-after: always;
}

.break-before {
  page-break-before: always;
}
</style>
