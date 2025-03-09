<template>
  <!-- style="max-width:700px" -->
  <div class="report1">
    <div v-if="Title.length > 0">
      <b-tabs>
        <b-tab class="p-1" v-for="(item, idx) in Title" :key="idx" :title="item">
          <b-table-simple class="table" striped hover small caption-top responsive :sticky-header="'500px'">
            <b-thead head-variant="dark">
              <b-tr>
                <b-th style="border-left:1px solid #dee2e6" colspan="1">天數/來源</b-th>
                <b-th style="border-left:1px solid #dee2e6" colspan="2">門</b-th>
                <b-th style="border-left:1px solid #dee2e6" colspan="2">急</b-th>
                <b-th style="border-left:1px solid #dee2e6" colspan="2">住</b-th>
                <b-th style="border-left:1px solid #dee2e6" colspan="2">健</b-th>
                <b-th style="border-left:1px solid #dee2e6" colspan="2">轉</b-th>
                <b-th style="border-left:1px solid #dee2e6" colspan="2">診</b-th>
                <b-th style="border-left:1px solid #dee2e6" colspan="2">總計</b-th>
              </b-tr>
              <!-- <b-tr>
                <b-th v-for="(item,idx) in ReportDaysCompleted" :key="idx">{{item.label}}</b-th>
              </b-tr>-->
            </b-thead>
            <b-tbody class="body-group">
              <b-tr v-for="(item, idx) in TableData(idx)" :key="idx">
                <b-th>{{ item.ITEM }}</b-th>
                <b-td>{{ item.OCOUNT }}</b-td>
                <b-td>{{ item.POCOUNT }}</b-td>
                <b-td>{{ item.ECOUNT }}</b-td>
                <b-td>{{ item.PECOUNT }}</b-td>
                <b-td>{{ item.ICOUNT }}</b-td>
                <b-td>{{ item.PICOUNT }}</b-td>
                <b-td>{{ item.GCOUNT }}</b-td>
                <b-td>{{ item.PGCOUNT }}</b-td>
                <b-td>{{ item.TCOUNT }}</b-td>
                <b-td>{{ item.PTCOUNT }}</b-td>
                <b-td>{{ item.UCOUNT }}</b-td>
                <b-td>{{ item.PUCOUNT }}</b-td>
                <b-th>{{ item.TOTAL }}</b-th>
                <b-th>{{ item.PTOTAL }}</b-th>
              </b-tr>
            </b-tbody>
          </b-table-simple>
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
      //為了加一個零
      let mm = `${d.getMonth() + 1}`;
      if (`${d.getMonth() + 1}`.length == 1) {
        mm = "0" + mm.toString();
      }
      let mnth = "&month=" + mm;

      console.log("url:" + year + mnth);
      await window.axios.get("/reportStatistics/GetCompleteMonth" + year + mnth).then(r => {
        console.log(r);
        data = r;
      });
      data.DxReportCompleteMonth.forEach(e => {
        switch (e.ITEM) {
          case 1:
            e.ITEM = "< 1";
            break;
          case 2:
            e.ITEM = "2 ~ 3";
            break;
          case 3:
            e.ITEM = "4 ~ 5";
            break;
          case 4:
            e.ITEM = "6 ~ 7";
            break;
          case 5:
            e.ITEM = "8 ~ 10";
            break;
          case 6:
            e.ITEM = "11 ~ 14";
            break;
          case 7:
            e.ITEM = "> 14";
            break;
          case 8:
            e.ITEM = "總計";
            break;
          case 9:
            e.ITEM = "未完成";
            break;
        }
        e.POCOUNT = e.POCOUNT + "%";
        e.PECOUNT = e.PECOUNT + "%";
        e.PICOUNT = e.PICOUNT + "%";
        e.PGCOUNT = e.PGCOUNT + "%";
        e.PTCOUNT = e.PTCOUNT + "%";
        e.PUCOUNT = e.PUCOUNT + "%";
        e.PTCOUNT = e.PTCOUNT + "%";
        e.PTOTAL = e.PTOTAL + "%";
      });

      // 取得title 把資料轉成group
      const group = data.DxReportCompleteMonth.reduce((accu, item) => {
        accu[item.MODALITY] = accu[item.MODALITY] || [];
        accu[item.MODALITY].push(item);
        return accu;
      }, {});
      console.log(group);
      this.Title = Object.keys(group);
      //
      this.Data = group;
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
.layout {
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
