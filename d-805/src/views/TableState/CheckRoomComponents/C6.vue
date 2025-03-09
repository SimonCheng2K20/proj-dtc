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
import { WorkLoading } from "@/views/TableState/CheckRoomComponents/CheckRoomStat.js";
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
      InspectDevice: "",
      //data array
      Data: []
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

      console.log(this.selectedInspectDevice);

      // console.log(Mnth);
      //預計建立
      console.log(this.selectedInspectDevice);
      // if (dateRange[0])
      console.log(new Date(this.dateRange[0]));
      let d = new Date(this.dateRange[0]);
      let ed = new Date(this.dateRange[1]);

      let start =
        "?startDate=" + `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      let end =
        "&endDate=" +
        `${ed.getFullYear()}-${ed.getMonth() + 1}-${ed.getDate()}`;
      // let deviceid = "&modality=" + this.selectedInspectDevice;
      console.log("twp url : " + start + end);
      await window.axios
        .get("/employee/RadiologistWorkload" + start + end)
        .then(r => {
          console.log(r);

          data = r;
        })
        .catch(e => {
          console.err(e);
        });
      console.log("getDataEnd");
      this.ObjApp.WaitingHide();

      // this.Data = data.Items;
      data.Items.forEach(e => {
        let d = new Date(e.ScheduleCompleteTime);
        e.ScheduleCompleteTime = `${d.getFullYear()}-${d.getMonth() +
          1}-${d.getDate()}(${d.getHours()}:${d.getMinutes()})`;
      });
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
    this.GetData();

    //資料塞入欄位
    console.log("created end");

    this.CIDataList = WorkLoading;
  }
};
</script>
