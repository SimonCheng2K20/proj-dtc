<template>
  <div class="page-inner">
    <h1 class="py-2 mr-0 mt-0 ml-0 mb-0 report-title" v-html="report.ReportName" />
    <patientData :patientInfo="patientInfo" />
    <extraData :summyStr="report.Summary" :reportContentStr="report.ReportContent" />
    <imagingFinding :structures="structures" />
    <!-- <div>
      a medicine, or a set of medicines or drugs, used to improve a particular condition or illness.a medicine, or a set of medicines or drugs, used to improve a particular condition or illness.a medicine, or a set of medicines or drugs, used to improve a particular condition or illness.a medicine, or a set of medicines or drugs, used to improve a particular condition or illness.a medicine, or a set of medicines or drugs, used to improve a particular condition or illness.a medicine, or a set of medicines or drugs, used to improve a particular condition or illness.a medicine, or a set of medicines or drugs, used to improve a particular condition or illness.a medicine, or a set of medicines or drugs, used to improve a particular condition or illness.a medicine, or a set of medicines or drugs, used to improve a particular condition or illness.a medicine, or a set of medicines or drugs, used to improve a particular condition or illness.a medicine, or a set of medicines or drugs, used to improve a particular condition or illness.a medicine, or a set of medicines or drugs, used to improve a particular condition or illness.a medicine, or a set of medicines or drugs, used to improve a particular condition or illness.a medicine, or a set of medicines or drugs, used to improve a particular condition or illness.a medicine, or a set of medicines or drugs, used to improve a particular condition or illness.a medicine, or a set of medicines or drugs, used to improve a particular condition or illness.a medicine, or a set of medicines or drugs, used to improve a particular condition or illness.a medicine, or a set of medicines or drugs, used to improve a particular condition or illness.a medicine, or a set of medicines or drugs, used to improve a particular condition or illness.a medicine, or a set of medicines or drugs, used to improve a particular condition or illness.a medicine, or a set of medicines or drugs, used to improve a particular condition or illness.a medicine, or a set of medicines or drugs, used to improve a particular condition or illness.a medicine, or a set of medicines or drugs, used to improve a particular condition or illness.a medicine, or a set of medicines or drugs, used to improve a particular condition or illness.a medicine, or a set of medicines or drugs, used to improve a particular condition or illness.a medicine, or a set of medicines or drugs, used to improve a particular condition or illness.a medicine, or a set of medicines or drugs, used to improve a particular condition or illness.a medicine, or a set of medicines or drugs, used to improve a particular condition or illness.a medicine, or a set of medicines or drugs, used to improve a particular condition or illness.a medicine, or a set of medicines or drugs, used to improve a particular condition or illness.a medicine, or a set of medicines or drugs, used to improve a particular condition or illness.a medicine, or a set of medicines or drugs, used to improve a particular condition or illness.a medicine, or a set of medicines or drugs, used to improve a particular condition or illness.a medicine, or a set of medicines or drugs, used to improve a particular condition or illness.a medicine, or a set of medicines or drugs, used to improve a particular condition or illness.a medicine, or a set of medicines or drugs, used to improve a particular condition or illness.
    </div> -->
    <div class="page-footer mt-3">
      <div>
        {{ doctorInfo }}
        <br class="keep" />
        {{ report["MdLicenseNo"] }}
        <br class="keep" />
        輸入者: {{ editerInfo }}
      </div>
    </div>
  </div>
</template>

<script>
import patientData from "./patientData";
import extraData from "./extraData";
import imagingFinding from "./imagingFinding";
export default {
  data() {
    return {};
  },
  props: {
    report: {
      type: Object,
      required: true,
    },
  },
  components: {
    patientData,
    extraData,
    imagingFinding,
  },
  computed: {
    patientInfo() {
      const exceptKey = ["StructureContent", "StructureData", "Summary", "ReportContent"];
      return Object.keys(this.report).reduce((acc, cur) => {
        return exceptKey.some((k) => cur.includes(k)) ? acc : { ...acc, [cur]: this.report[cur] };
      }, {});
    },
    structures() {
      const includeKey = ["StructureContent"];
      const structsObj = Object.keys(this.report).reduce((acc, cur) => {
        return !includeKey.some((k) => cur.includes(k)) ? acc : acc.concat(cur);
      }, []);
      return structsObj
        .sort((a, b) => (parseInt(a.slice(-1)) > parseInt(b.slice(-1)) ? 1 : -1))
        .map((str) => {
          const index = parseInt(str.slice(-1));
          return { content: this.report["StructureContent" + index], data: JSON.parse(this.report["StructureData" + index]) };
        });
    },
    editerInfo() {
      return `${this.report.ReportDoctor} ${this.report.ReporterStaffType != "28" ? "醫師" : this.report.ReporterSex === "O" ? "小姐" : "先生"}`;
    },
    doctorInfo() {
      return this.report.IssuePhysicianName != this.report.ReportDoctor ? `${this.report.IssuePhysicianName} 醫師` : "";
    },
    // doctorInfo () {
    //   const p1 = `${this.report.ReportDoctor} ${this.report.ReporterStaffType != "28" ? '醫師' : this.report.ReporterSex === "O" ? "小姐" : "先生"}`;
    //   const p2 = this.report.IssuePhysicianName != this.report.ReportDoctor
    //     ? ` / ${this.report.IssuePhysicianName} 醫師`
    //     : '';
    //   return p1 + p2;
    // }
  },
};
</script>

<style>
.report-title {
  margin-top: 8px;
}
</style>
