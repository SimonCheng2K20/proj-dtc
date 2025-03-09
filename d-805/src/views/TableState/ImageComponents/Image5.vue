<template>
  <div>
    <twp
      ref="twp"
      :FieldConfig="ListFields"
      :isBackEndPagination="false"
      :DataFetch="GetData"
      :heightForScroll="'450px'"
    ></twp>
    <!-- <h3>{{this.dateRange}}</h3>
    <h3>modality:{{this.selectedInspectDevice}}</h3>-->
  </div>
</template>
<script>
import twp from "@/components/TWPv5";
import { ChangeRecordFields } from "@/views/TableState/ImageComponents/ImageStat.js";
export default {
  components: { twp },
  props: {
    dateRange: { type: Array },
    selectedInspectDevice: { type: String },
    selectedCheckRoom: { type: Number }
  },
  data() {
    return {
      ListFields: []
    };
  },
  methods: {
    async GetData() {
      this.ObjApp.WaitingShow();
      //一進來沒有資料不打api
      let data = { Items: [] };
      if (this.dateRange[0] == null && this.dateRange[1] == null) {
        this.ObjApp.WaitingHide();
        return data;
      }
      //預計建立
      let date = "?date=" + this.dateRange[0];
      // "?startDate=" + "2020-1-13" + "&endDate=" + "2020-1-24";
      console.log(date);
      await window.axios
        .get("/schedule/ReportGraphChangeRecordList" + date)
        .then(r => {
          console.log(r);

          data = r;
        });
      this.ObjApp.WaitingHide();
      return data;
    },
    refreshTWP() {
      //refreshTWP
      this.$refs["twp"].OnForceRefresh();
    }
  },
  created() {
    // -----------------------------取得 App.vue 參照---------------------------//
    let methodName = "created";
    let obj = this.$GetApp(this);
    console.log(obj);
    if (obj) {
      this.ObjApp = obj[0];
      this.VueNestLevel = obj[1];
      console.log(
        this.$logs(`Vue Nesting Level ${this.VueNestLevel}`, methodName)
      );
    } else {
      console.log(this.$logs("Fail to get App.vue ref.", methodName));
    }
    //欄位
    this.ListFields = ChangeRecordFields;
    // console.log(this.ListFields);
  }
};
</script>
