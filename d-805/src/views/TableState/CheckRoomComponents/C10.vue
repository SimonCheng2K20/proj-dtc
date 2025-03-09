<template>
  <div style="overflow:hidden">
    <!-- <h3>{{ this.dateRange }}</h3>
    <h3>modality:{{ this.selectedInspectDevice }}</h3>
    <h3>checkRoom:{{ this.selectedCheckRoom }}</h3>-->
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
import { CTMRI } from "@/views/TableState/CheckRoomComponents/CheckRoomStat.js";
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
      array: null
    };
  },
  // ?roomId=47&date=2020-1-1
  // ?roomId=47&?date=2020-3-10
  methods: {
    async GetData () {
      this.ObjApp.WaitingShow();
      let data = { Items: [] };
      //一進來沒有資料不打api
      if (this.dateRange[0] == null && this.dateRange[1] == null) {
        this.ObjApp.WaitingHide();
        return data;
      }
      //一進來沒有檢查室return
      if (
        this.selectedCheckRoom == undefined ||
        this.selectedCheckRoom == null
      ) {
        this.ObjApp.WaitingHide();
        return data;
      }

      // let Mnth = new Date().getMonth;
      // console.log(Mnth);
      //預計建立
      let checkRoom = "?roomId=" + this.selectedCheckRoom;
      //
      let d = new Date(this.dateRange[0]);
      let ed = new Date(this.dateRange[1]);
      let start =
        "&startDate=" + `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
      let end =
        "&endDate=" +
        `${ed.getFullYear()}-${ed.getMonth() + 1}-${ed.getDate()}`;
      console.log("twp url : " + checkRoom + start + end);
      // let data = { Items: [] };
      // TODO:要加一個roomID
      await window.axios
        .get("/schedule/RoomDayList" + checkRoom + start + end)
        .then(r => {
          console.log(r);
          data = r;
        })
        .catch(e => {
          console.err(e);
        });
      // console.log(data.Items[0].CheckDateTime);
      // this.
      this.ObjApp.WaitingHide();
      data.Items.forEach(e => {
        let d = new Date(e.CheckDateTime);
        e.CheckDateTime = this.DateToString(d, true);
        //
        e.CreatedTTM = `${new Date(e.CreatedTTM).getFullYear()}-${new Date(
          e.CreatedTTM
        ).getMonth()}-${new Date(e.CreatedTTM).getDate()}`;
      });
      console.log(data);

      console.log("getDataEnd");

      return data;
    },
    refreshTWP () {
      //refreshTWP
      if (
        this.selectedCheckRoom == undefined ||
        this.selectedCheckRoom == null
      ) {
        this.ObjApp.TimingMessage("條件請選擇完整", 2);
        return;
      }
      this.$refs["twp"].OnForceRefresh();
    }
  },
  mounted () { },
  created () {
    // -----------------------------取得 App.vue 參照---------------------------//
    console.log(this.dateRange);

    // alert("created start");
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
    this.CIDataList = CTMRI;
    //預設檢查室
    // this.selectedCheckRoom = 21;
    console.log(this.selectedCheckRoom);
    console.log("created end");
  }
};
</script>
<style lang="scss" scoped>
// td.wrap {
//   width: 300px;
// }
</style>
