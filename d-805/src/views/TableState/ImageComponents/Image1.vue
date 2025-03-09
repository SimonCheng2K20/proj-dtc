<template>
  <div style="overflow:auto">
    <!-- <h3>{{ this.dateRange }}</h3>
    <h3>modality:{{ this.selectedInspectDevice }}</h3>-->
    <twp
      ref="twp"
      :FieldConfig="ListFields"
      :DataFetch="GetData"
      :isBackEndPagination="false"
      :heightForScroll="'450px'"
    ></twp>
  </div>
</template>
<script>
import twp from "@/components/TWPv5";
import { mapMutations } from "vuex";
import { ExamItemFields } from "@/views/TableState/ImageComponents/ImageStat.js";
export default {
  components: { twp },
  props: {
    dateRange: { type: Array },
    selectedInspectDevice: { type: String },
    selectedCheckRoom: { type: Number }
  },
  data () {
    return {
      ListFields: ExamItemFields
    };
  },
  methods: {
    ...mapMutations(['SHOW_LOADING', 'HIDE_LOADING', 'SET_SIDE_MESSAGE']),
    async GetData () {
      if (this.dateRange[0] == null && this.dateRange[1] == null) { //一進來沒有資料不打api
        return { Items: [] };
      }
      this.SHOW_LOADING();
      let Mnth = new Date().getMonth;
      //月報表如果沒有選到月不打api
      let startMnth = new Date(this.dateRange[0]).getMonth();
      let endMnth = new Date(this.dateRange[1]).getMonth();
      if (startMnth !== endMnth) {
        this.HIDE_LOADING();
        this.SET_SIDE_MESSAGE({ msg: "條件請選擇完整", type: 2 });
        return { Items: [] };
      }
      //預計建立
      let date = "?date=" + this.$moment(this.dateRange[0]).format("YYYY-MM-DD");
      const data = await window.axios.get("/schedule/ReportMonthGraphCheckList" + date);
      this.HIDE_LOADING();
      return data;
    },
    refreshTWP () {
      //refreshTWP
      this.$refs["twp"].OnForceRefresh();
    }
  }
};
</script>
