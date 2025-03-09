<template>
  <!-- style="max-width:700px" -->
  <div class="report1">
    <div v-if="Title.length > 0" class="layout-report1">
      <b-tabs>
        <b-tab class="p-1" v-for="(item, idx) in Title" :key="idx" :title="item">
          <b-table
            ref="twp"
            striped
            small
            hover
            head-variant="dark"
            responsive
            :sticky-header="'500px'"
            :fields="ReportDaysCompleted"
            :items="TableData(idx)"
          ></b-table>
        </b-tab>
      </b-tabs>
    </div>
    <NoDataShow v-else></NoDataShow>
  </div>
</template>
<script>
import twp from "@/components/TWPv5";
import NoDataShow from "@/views/TableState/SearchBar/NoDataShow.vue";
import { ReportDaysCompleted } from "@/views/TableState/ReportComponents/ReportStat.js";
export default {
  components: { twp, NoDataShow },
  props: {
    dateRange: { type: Array },
    selectedInspectDevice: { type: String },
    selectedCheckRoom: { type: Number }
  },
  data() {
    return {
      ReportDaysCompleted: [],
      //天數統計資料
      Data: [],
      //tab 的欄位
      Title: []
    };
  },
  methods: {
    async GetData() {
      this.ObjApp.WaitingShow();
      //預設為當月
      //一進來沒有資料不打api
      let data = { Items: [] };
      if (this.dateRange[0] == null && this.dateRange[1] == null) {
        this.ObjApp.WaitingHide();
        return data;
      }
      //
      let d = new Date(this.dateRange[0]);
      let year = "?year=" + d.getFullYear();
      let mnth = "&month=" + `${d.getMonth() + 1}`;

      console.log("url:" + year + mnth);
      await window.axios
        .get("/reportStatistics/MonthReportFinalDaysCountList" + year + mnth)
        .then(r => {
          console.log(r);
          data = r;
        });
      // 取得title
      let title = Object.keys(data);
      this.Title = title;
      console.log("tabs 的欄位" + data[title[0]]);
      console.log(this.Title);
      //
      //
      this.Data = data;
      // console.log(this.Data);
      this.ObjApp.WaitingHide();
      // return data;
    },
    TableData(x) {
      console.log(x);
      console.log(this.Data[this.Title[x]]);
      return this.Data[this.Title[x]];
    },
    refreshTWP() {
      //refreshTWP
      this.GetData();
      // this.$refs["twp"].OnForceRefresh();
    }
  },
  mounted() {
    // console.log(this.refreshTable());
  },
  created() {
    // -----------------------------取得 App.vue 參照---------------------------//
    let methodName = "created";
    let obj = this.$GetApp(this);
    // console.log(obj);
    if (obj) {
      this.ObjApp = obj[0];
      this.VueNestLevel = obj[1];
      // console.log(
      //   this.$logs(`Vue Nesting Level ${this.VueNestLevel}`, methodName)
      // );
    } else {
      console.log(this.$logs("Fail to get App.vue ref.", methodName));
    }
    //
    this.ReportDaysCompleted = ReportDaysCompleted;
  }
};
</script>
<style lang="scss" scrope>
.layout-report1 {
  // width: 700px;
  // margin-left: auto;
  // margin-right: auto;
  // border: 1px solid #ddd;
  // border-radius: 5px;
}
* {
  // border: 1px solid;
}
.report1 {
  // display: flex;
  // justify-content: center;
  // align-items: center;
}
</style>
