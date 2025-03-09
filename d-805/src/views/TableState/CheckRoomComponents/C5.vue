<template>
  <div style="overflow:auto">
    <!-- <twp ref="twp" :FieldConfig="CIDataList" :DataFetch="GetData" :isBackEndPagination="false"></twp> -->
    <div
      v-if="XrayData.length !== 0"
      style="overflow:auto ;max-height:calc(100vh - 200px)"
    >
      <b-tabs>
        <b-tab title="一般X光">
          <b-table-simple
            striped
            hover
            small
            caption-top
            responsive
            :sticky-header="'500px'"
          >
            <b-thead head-variant="dark">
              <b-tr>
                <b-th colspan="1">一般X光</b-th>
                <b-th
                  v-for="(num, idx) in 12"
                  :key="idx"
                  style="border-right:1px solid #ccc"
                  colspan="2"
                >{{ `${idx + 1}月` }}</b-th>
              </b-tr>
              <!-- <b-tr v-for="(item, idx) in CIDataList" :key="idx"> -->
              <b-tr>
                <b-th
                  style="white-space:nowrap"
                  v-for="(item, idx) in CIDataList"
                  :key="idx"
                >{{ item.label }}</b-th>
              </b-tr>
            </b-thead>
            <b-tbody style="width:100vw">
              <b-tr
                class="bottom"
                v-for="(item, idx) in XrayData"
                :key="idx"
                variant
              >
                <!-- 第一個是合併表格 -->
                <!-- <b-th :rowspan="XrayRowspan" v-show="idx == 0" class="title">一般X光</b-th> -->
                <b-th class="RoomName">{{ item.RoomName }}</b-th>
                <b-th class="count">{{ item.Count1 }}</b-th>
                <b-th class="PresonCount">{{ item.PresonCount1 }}</b-th>
                <b-th class="count">{{ item.Count2 }}</b-th>
                <b-th>{{ item.PresonCount2 }}</b-th>
                <b-th class="count">{{ item.Count3 }}</b-th>
                <b-th>{{ item.PresonCount3 }}</b-th>
                <b-th class="count">{{ item.Count4 }}</b-th>
                <b-th>{{ item.PresonCount4 }}</b-th>
                <b-th class="count">{{ item.Count5 }}</b-th>
                <b-th>{{ item.PresonCount5 }}</b-th>
                <b-th class="count">{{ item.Count6 }}</b-th>
                <b-th>{{ item.PresonCount6 }}</b-th>
                <b-th class="count">{{ item.Count7 }}</b-th>
                <b-th>{{ item.PresonCount7 }}</b-th>
                <b-th class="count">{{ item.Count8 }}</b-th>
                <b-th>{{ item.PresonCount8 }}</b-th>
                <b-th class="count">{{ item.Count9 }}</b-th>
                <b-th>{{ item.PresonCount9 }}</b-th>
                <b-th class="count">{{ item.Count10 }}</b-th>
                <b-th>{{ item.PresonCount10 }}</b-th>
                <b-th class="count">{{ item.Count11 }}</b-th>
                <b-th>{{ item.PresonCount11 }}</b-th>
                <b-th class="count">{{ item.Count12 }}</b-th>
                <b-th>{{ item.PresonCount12 }}</b-th>
              </b-tr>
            </b-tbody>
          </b-table-simple>
        </b-tab>
        <b-tab title="排程檢查">
          <b-table-simple
            striped
            hover
            small
            caption-top
            responsive
            :sticky-header="'500px'"
          >
            <b-thead head-variant="dark">
              <b-tr>
                <b-th colspan="1">排程檢查</b-th>
                <b-th
                  v-for="(num, idx) in 12"
                  :key="idx"
                  style="border-right:1px solid #ccc"
                  colspan="2"
                >{{ `${idx + 1}月` }}</b-th>
              </b-tr>
              <!-- <b-tr v-for="(item, idx) in CIDataList" :key="idx"> -->
              <b-tr>
                <b-th
                  style="white-space:nowrap"
                  v-for="(item, idx) in CIDataList"
                  :key="idx"
                >{{ item.label }}</b-th>
              </b-tr>
            </b-thead>
            <b-tbody style="width:100vw; font-weight: bold;">
              <b-tr
                class="bottom"
                v-for="(item, idx) in ScheduleData"
                :key="idx"
                variant
              >
                <!-- 第一個是合併表格 -->
                <!-- <b-th :rowspan="ScheduleRowspan" v-show="idx == 0" class="title">排程檢查</b-th> -->
                <b-th class="RoomName">{{ item.RoomName }}</b-th>
                <b-th class="count">{{ item.Count1 }}</b-th>
                <b-th class="PresonCount">{{ item.PresonCount1 }}</b-th>
                <b-th class="count">{{ item.Count2 }}</b-th>
                <b-th class="PresonCount">{{ item.PresonCount2 }}</b-th>
                <b-th class="count">{{ item.Count3 }}</b-th>
                <b-th class="PresonCount">{{ item.PresonCount3 }}</b-th>
                <b-th class="count">{{ item.Count4 }}</b-th>
                <b-th class="PresonCount">{{ item.PresonCount4 }}</b-th>
                <b-th class="count">{{ item.Count5 }}</b-th>
                <b-th class="PresonCount">{{ item.PresonCount5 }}</b-th>
                <b-th class="count">{{ item.Count6 }}</b-th>
                <b-th class="PresonCount">{{ item.PresonCount6 }}</b-th>
                <b-th class="count">{{ item.Count7 }}</b-th>
                <b-th class="PresonCount">{{ item.PresonCount7 }}</b-th>
                <b-th class="count">{{ item.Count8 }}</b-th>
                <b-th class="PresonCount">{{ item.PresonCount8 }}</b-th>
                <b-th class="count">{{ item.Count9 }}</b-th>
                <b-th class="PresonCount">{{ item.PresonCount9 }}</b-th>
                <b-th class="count">{{ item.Count10 }}</b-th>
                <b-th class="PresonCount">{{ item.PresonCount10 }}</b-th>
                <b-th class="count">{{ item.Count11 }}</b-th>
                <b-th class="PresonCount">{{ item.PresonCount11 }}</b-th>
                <b-th class="count">{{ item.Count12 }}</b-th>
                <b-th class="PresonCount">{{ item.PresonCount12 }}</b-th>
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
import { dateFormatMixin } from "@/SupportLib_J.js";
import NoDataShow from "@/views/TableState/SearchBar/NoDataShow.vue";

//twp欄位
import { EveryCRStat } from "@/views/TableState/CheckRoomComponents/CheckRoomStat.js";
export default {
  mixins: [dateFormatMixin],
  components: { twp, NoDataShow },
  props: {
    dateRange: { type: Array },
    selectedInspectDevice: { type: String },
    selectedCheckRoom: { type: Number }
  },
  data () {
    return {
      CIDataList: [],
      InspectDevice: "",
      XrayData: [],
      XrayRowspan: null,
      ScheduleData: [],
      ScheduleRowspan: null
    };
  },
  methods: {
    async GetData () {
      this.ObjApp.WaitingShow();
      console.log("getDataStart");
      //一進來沒有資料不打api
      let data = null;
      if (this.dateRange[0] == null && this.dateRange[1] == null) {
        this.ObjApp.WaitingHide();
        return;
      }

      //預計建立
      console.log(this.selectedInspectDevice);
      let year = "?year=" + new Date(this.dateRange[0]).getFullYear();
      console.log("twp url : " + year);
      await window.axios

        .get("/reportStatistics/RoomYearCount" + year)
        .then(r => {
          console.log(r);
          data = r;
        })
        .catch(e => {
          console.err(e);
        });
      // alert("123");

      //Xray 統計資料
      let xaryArr = [];
      xaryArr = data.CrItems;
      //
      let xray = [data.CrTotal, data.CrDayAverage, data.CrErTotal, data.CrErDayAverage, data.CrNonErTotal, data.CrNonErDayAverage];
      console.log(xray);
      Array.prototype.push.apply(xaryArr, xray);
      //
      this.XrayRowspan = xaryArr.length;
      this.XrayData = xaryArr;

      //Schedule 統計資料
      let scheduleArr = [];
      scheduleArr = data.ScheduleItems;
      let sumScheduleItems = [data.ScheduleTotal, data.ScheduleDayAverage];
      Array.prototype.push.apply(scheduleArr, sumScheduleItems);
      //
      this.ScheduleRowspan = scheduleArr.length;
      this.ScheduleData = scheduleArr;
      console.log(this.ScheduleData);

      console.log("getDataEnd");
      this.ObjApp.WaitingHide();
    },
    refreshTWP () {
      //refreshTWP
      this.GetData();
      // this.$refs["twp"].OnForceRefresh();
    }
  },
  mounted () { },
  created () {
    // -----------------------------取得 App.vue 參照---------------------------//

    let methodName = "created";
    let obj = this.$GetApp(this);
    if (obj) {
      this.ObjApp = obj[0];
      this.VueNestLevel = obj[1];
      console.log(this.$logs(`Vue Nesting Level ${this.VueNestLevel}`, methodName));
    } else {
      console.log(this.$logs("Fail to get App.vue ref.", methodName));
    }
    //資料塞入欄位
    console.log("---------------------------------------------------");

    this.CIDataList = EveryCRStat();
    console.log(this.CIDataList);
  }
};
</script>
<style lang="scss" scoped>
.title {
  // color: red;
  min-width: 100px;
  border-right: 1px solid #dee2e6;
}
.RoomName {
  min-width: 150px;
}
.count {
  border-left: 1px solid #dee2e6;
}
.PresonCount {
  border-right: 1px solid #dee2e6;
}
.bottom {
  border-bottom: 1px solid #dee2e6;
}
</style>
