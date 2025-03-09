<template>
  <div>
    <twp
      ref="twp"
      :FieldConfig="PhysExamReportListFields"
      :DataFetch="GetData"
      :heightForScroll="'450px'"
    />
  </div>
</template>
<script>
import twp from "@/components/TWPv5";
import { PhysExamReportListFields } from "@/views/TableState/ImageComponents/ImageStat.js";
import { reportGraphPhysicianListList, reportGraphPhysicianListUrl } from "@/assets/service/dataManager.js";
import { mapMutations } from "vuex";
export default {
  components: { twp },
  props: {
    dateRange: { type: Array },
  },
  data () {
    return {
      PhysExamReportListFields,
    };
  },
  methods: {
    ...mapMutations(["SHOW_LOADING", "HIDE_LOADING"]),
    async GetData () {


      if (this.dateRange[0] == null && this.dateRange[1] == null) return { Items: [] }; //一進來沒有資料不打api
      await this.waitingTime();
      const { PagingRowPerPage, PagingCurrentPage } = this.$refs.twp;
      this.SHOW_LOADING();
      const params = this.dateRange.map( //預計建立
        (datetime, idx) => `${idx === 0 ? "Start" : "End"}Dt=${this.$moment(datetime).format('YYYY-MM-DD')}`
      );

      params.push(`top=${PagingRowPerPage}`);
      params.push(`indexPage=${PagingCurrentPage}`);


      if (!this.excelUrlData.urls.hasOwnProperty(this.excelUrlData.currentCondition)) {
        this.$store.commit("wsAddExcelUrl", { url: '', condition: this.excelUrlData.currentCondition });
        this.generateExcelUrl(this.excelUrlData.currentCondition);
      }
      try {
        const data = await reportGraphPhysicianListList(params.join('&'));
        this.HIDE_LOADING();
        return data;
      } catch (err) {
        console.log(err);
        this.HIDE_LOADING();
      }
    },
    waitingTime () {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 100);
      });
    },
    refreshTWP () {
      this.$refs["twp"].OnForceRefresh();
    },
    async generateExcelUrl (condition) {
      const params = this.dateRange.map( //預計建立
        (datetime, idx) => `${idx === 0 ? "Start" : "End"}Dt=${this.$moment(datetime).format('YYYY-MM-DD')}`
      ).concat(['top=10', 'indexPage=0']);
      try {
        const { Url } = await reportGraphPhysicianListUrl(params.join('&')); //&top=10&indexPage=0
        this.$store.commit("wsAddExcelUrl", { url: Url, condition });
      } catch (err) {
        console.log(err);
      }
    },
  },
  computed: {
    excelUrlData () {
      return this.$store.state.excelUrl;
    }
  }
};
</script>
