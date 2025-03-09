<template>
  <div style="overflow:auto">
    <twp
      ref="twp"
      :FieldConfig="CIDataList"
      :DataFetch="GetData"
      :isBackEndPagination="true"
      :heightForScroll="scrollHeight"
    ></twp>
  </div>
</template>

<script>
import twp from "@/components/TWPv5"; // twp欄位
import { dateFormatMixin } from "@/SupportLib_J.js";
import { MnthFinishCheckList } from "@/views/TableState/CheckRoomComponents/CheckRoomStat.js";
import { reportMonthFinishCheckList, reportMonthFinishCheckUrl } from "@/assets/service/dataManager.js";
import { mapMutations } from "vuex";
export default {
  mixins: [dateFormatMixin],
  components: { twp },
  props: {
    dateRange: { type: Array },
    selectedInspectDevice: { type: String },
    selectedCheckRoom: [String, Number],
    selectedCheckRoomKey: { type: String },
    patientSource: { type: Array },
    priceNo: { type: String },
    scrollHeight: { type: String }
  },
  data () {
    return {
      CIDataList: MnthFinishCheckList,
      InspectDevice: "",
    };
  },
  methods: {
    ...mapMutations(["SHOW_LOADING", "HIDE_LOADING"]),
    collectParams (isExcel = false) {
      const params = this.dateRange.map((datetime, idx) => `${idx === 0 ? 'Start' : 'End'}Dt=${datetime}`);
      if (!isExcel) {
        const { PagingRowPerPage, PagingCurrentPage } = this.$refs.twp;
        params.push(`top=${PagingRowPerPage}`);
        params.push(`indexPage=${PagingCurrentPage}`);
      }
      if (this.selectedCheckRoomKey) params.push(`scheduleLocaion=${this.selectedCheckRoomKey}`);
      if (this.patientSource.length > 0) params.push(`patientSource=${this.patientSource.join(',')}`);
      if (this.priceNo) params.push(`PROCEDURE_CODE=${this.priceNo}`);
      return params.join('&') + (isExcel ? '&top=10&indexPage=0' : '');
    },
    async GetData () {
      if (this.dateRange[0] == null && this.dateRange[1] == null) return { Items: [] }; //一進來沒有資料不打api
      this.SHOW_LOADING();
      await this.waitingTime();   // delay the process
      try {
        if (!this.excelUrlData.urls.hasOwnProperty(this.excelUrlData.currentCondition)) {
          this.$store.commit("wsAddExcelUrl", { url: '', condition: this.excelUrlData.currentCondition });
          this.generateExcelUrl(this.excelUrlData.currentCondition);
        }
        const data = await reportMonthFinishCheckList(this.collectParams(false));
        data.Items.forEach((e) => {
          //檢查開始日
          e.CheckStartDate == null ? (e.CheckStartDate = "-") : (e.CheckStartDate = this.DateToString(new Date(e.CheckStartDate)));
          //檢查結束日
          e.CheckendDate == null ? (e.CheckendDate = "-") : (e.CheckendDate = this.DateToString(new Date(e.CheckendDate)));
        });
        this.HIDE_LOADING();

        return data;
      } catch (err) {
        this.HIDE_LOADING();
        return { Items: [] };
      }
    },
    async generateExcelUrl (condition) {
      try {
        const { Url } = await reportMonthFinishCheckUrl(`${this.collectParams(true)}`);
        this.$store.commit("wsAddExcelUrl", { url: Url, condition });
      } catch (err) {
        console.log(err);
      }
    },
    refreshTWP () {
      this.$refs["twp"].OnForceRefresh();
    },
    waitingTime () {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 100);
      });
    },
  },
  computed: {
    excelUrlData () {
      return this.$store.state.excelUrl;
    }
  }
};
</script>
