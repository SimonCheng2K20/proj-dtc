<template>
  <div style="overflow: hidden">
    <twp
      ref="twp"
      :FieldConfig="CIDataList"
      :DataFetch="GetData"
      :isBackEndPagination="true"
      :heightForScroll="scrollHeight"
    />
  </div>
</template>

<script>
import twp from "@/components/TWPv5";
import { dateFormatMixin } from "@/SupportLib_J.js";
import { CRStat } from "@/views/TableState/CheckRoomComponents/CheckRoomStat.js";
import {
  statisticsCheckInReportList,
  statisticsCheckInReportExcel,
} from "@/assets/service/dataManager.js";
import FormHelper from "@/library/FormHelper";
import { mapMutations } from "vuex";
export default {
  mixins: [dateFormatMixin],
  components: { twp },
  props: {
    dateRange: { type: Array },
    selectedInspectDevice: { type: String },
    caculateType: { type: Number },
    scrollHeight: { type: String },
  },
  data() {
    return {
      CIDataList: CRStat,
    };
  },
  created() {},
  methods: {
    ...mapMutations(["SHOW_LOADING", "HIDE_LOADING", "SET_SIDE_MESSAGE"]),
    async GetData(x, y, z) {
      //一進來沒有資料不打api
      if (this.dateRange[0] == null && this.dateRange[1] == null)
        return { Items: [] };
      this.SHOW_LOADING();
      const params = this.dateRange.reduce(
        (acc, cur, idx) =>
          acc.concat(`${idx === 0 ? "start" : "end"}Date=${cur}`),
        []
      );
      if (this.selectedInspectDevice)
        params.push("modality=" + this.selectedInspectDevice);
      // params.push(`$skip=${(y - 1) * z}`);
      // params.push(`$top=${z}`);
      if (
        !this.excelUrlData.urls.hasOwnProperty(
          this.excelUrlData.currentCondition
        )
      ) {
        // this.$store.commit("wsAddExcelUrl", {
        //   url: "",
        //   condition: this.excelUrlData.currentCondition,
        // });
        // this.generateExcelUrl(this.excelUrlData.currentCondition, params);
      }
      params.push(`top=${z}`);
      params.push(`indexPage=${y}`);
      params.push(`countType=${this.caculateType}`);
      try {
        const { Items, Count } = await statisticsCheckInReportList(
          params.join("&")
        );

        Items.forEach((item) => {
          // item['keyReportWaitTime27'] = item[this.caculateType === 1 ? 'CounterRegister' : 'ProcedureCompleted'] && item['IssueTime']
          //   ? this.$moment(item['IssueTime']).diff(this.$moment(item[this.caculateType === 1 ? 'CounterRegister' : 'ProcedureCompleted']), 'hours', true).toFixed(2)
          //   : '-';
          item["ReportWaitTimeHour"] = item["ReportWaitTime"]
            ? (parseFloat(item["ReportWaitTime"]) / 60).toFixed(2)
            : "";
          [
            "OrderDate",
            "CounterRegister",
            "ScheduleTime",
            "ProcedureStart",
            "ProcedureCompleted",
            "ReportInitialTime",
            "IssueTime",
          ].forEach((key) => {
            item[key] = item[key]
              ? this.DateToString(new Date(item[key]), true)
              : "-";
          });
        });
        return { Items, Count };
      } catch (err) {
        this.SET_SIDE_MESSAGE({ msg: "資料錯誤", type: 2 });
        return { Item: [], Count: 0 };
      } finally {
        this.HIDE_LOADING();
      }
    },
    refreshTWP() {
      //refreshTWP
      this.$refs["twp"].OnForceRefresh();
    },
    async generateExcelUrl(condition, params) {
      try {
        const { Url } = await statisticsCheckInReportExcel(
          params.join("&") +
            `&top=10&indexPage=0&countType=${condition.includes("m_2") ? 2 : 1}`
        );
        this.$store.commit("wsAddExcelUrl", { url: Url, condition });
      } catch (err) {
        console.log(err);
      }
    },
    async getExcelUrl(param) {
      const params = this.dateRange.reduce(
        (acc, cur, idx) =>
          acc.concat(`${idx === 0 ? "start" : "end"}Date=${cur}`),
        []
      );

      if (this.selectedInspectDevice)
        params.push("modality=" + this.selectedInspectDevice);
      // params.push(`$skip=${(y - 1) * z}`);
      // params.push(`$top=${z}`);
      if (
        !this.excelUrlData.urls.hasOwnProperty(
          this.excelUrlData.currentCondition
        )
      ) {
        this.$store.commit("wsAddExcelUrl", {
          url: "",
          condition: this.excelUrlData.currentCondition,
        });

        await this.generateExcelUrl(this.excelUrlData.currentCondition, params);
        await FormHelper.downloadFile(
          this.excelUrlData.urls[this.excelUrlData.currentCondition]
        );
      }
    },
  },
  computed: {
    excelUrlData() {
      return this.$store.state.excelUrl;
    },
  },
};
</script>
