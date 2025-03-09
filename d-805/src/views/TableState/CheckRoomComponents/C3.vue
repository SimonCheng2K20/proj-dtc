<template>
  <div style="overflow:auto">
    <twp
      ref="twp"
      :FieldConfig="CIDataList"
      :DataFetch="GetData"
      :isBackEndPagination="false"
      :heightForScroll="scrollHeight"
    ></twp>
  </div>
</template>

<script>
import twp from "@/components/TWPv5";
import { dateFormatMixin } from "@/SupportLib_J.js";

//twp欄位
import { CheckItemstat } from "@/views/TableState/CheckRoomComponents/CheckRoomStat.js";
export default {
  mixins: [dateFormatMixin],
  components: { twp },
  props: {
    dateRange: { type: Array },
    selectedInspectDevice: { type: String },
    selectedCheckRoom: { type: Number },
    scrollHeight: { type: String }
  },
  data () {
    return {
      CIDataList: [],
      InspectDevice: ""
    };
  },
  methods: {
    async GetData () {
      this.ObjApp.WaitingShow();
      console.log("getDataStart");
      //一進來沒有資料不打api
      let data = { Items: [] };
      if (this.dateRange[0] == null && this.dateRange[1] == null) {
        this.ObjApp.WaitingHide();
        return data;
      }

      //預計建立
      console.log(this.selectedInspectDevice);
      let date = "?date=" + this.dateRange[0];
      console.log("twp url : " + date);
      await window.axios
        .get("/schedule/ReportServiceItemSumList" + date)
        .then(r => {
          console.log(r.Items);
          data = r;
        })
        .catch(e => {
          console.err(e);
        });
      // alert("123");
      console.log("getDataEnd");
      this.ObjApp.WaitingHide();
      return data;
    },
    refreshTWP () {
      //refreshTWP
      this.$refs["twp"].OnForceRefresh();
    }
  },
  mounted () { },
  created () {
    // -----------------------------取得 App.vue 參照---------------------------//

    console.log("created start");
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
    //資料塞入欄位
    console.log("created end");

    this.CIDataList = CheckItemstat;
  }
};
</script>
