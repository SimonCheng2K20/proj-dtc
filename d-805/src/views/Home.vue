<template>
  <div class="dashboard">
    <grid-layout
      :layout.sync="layout"
      :responsive="true"
      :col-num="12"
      :row-height="30"
      :is-draggable="true"
      :is-resizable="false"
      :is-mirrored="false"
      :vertical-compact="true"
      :margin="[10, 10]"
      :use-css-transforms="true"
    >
      <grid-item
        v-for="(item, idx) in layout"
        :x="item.x"
        :y="item.y"
        :w="item.w"
        :h="item.h"
        :i="item.i"
        :key="item.i"
      >
        <div class="header">
          <div @click="showDlg">{{ item.text }}</div>
          <div
            class="opts"
            :class="item.spec ? 'long-list' : ''"
          >
            <b-pagination
              v-if="idx == 2"
              style="max-width:200px;margin-right:22px;"
              size="sm"
              v-model="currentPage"
              :total-rows="rows"
              :per-page="perPage"
              aria-controls="my-table"
            ></b-pagination>
            <b-form-select
              size="sm"
              style="margin-right:4px;"
              v-if="item.ops2"
              v-model="item.val2"
              :options="item.ops2"
            ></b-form-select>
            <b-form-select
              style="min-width:100px;"
              size="sm"
              v-model="item.val"
              :options="item.ops"
            ></b-form-select>
          </div>
        </div>
        <div class="dtc-chart-item">
          <transition name="fade">
            <Loading v-if="item.text === '陰性報告' && load1"></Loading>
            <Loading v-if="item.text === '影像品質' && load2"></Loading>
            <Loading v-if="item.text === '報告總量' && load3"></Loading>
            <Loading v-if="item.text === '工作總量' && load4"></Loading>
            <Loading v-if="item.text === '儀器使用' && load5"></Loading>
            <Loading v-if="item.text === '完成時間' && load6"></Loading>
            <Loading v-if="item.text === '逾時報告' && load7"></Loading>
            <Loading v-if="item.text === '個別逾時' && load8"></Loading>
          </transition>
          <CstChart
            v-if="idx == 0"
            :time="item.val"
          ></CstChart>
          <ImgDtc
            v-if="idx == 1"
            :time="item.val"
          ></ImgDtc>
          <ReportNotDone
            v-if="idx == 2"
            :time="item.val"
            :page="currentPage"
          ></ReportNotDone>
          <Workload
            v-if="idx == 3"
            :time="item.val"
            :type="item.val2"
          ></Workload>
          <Device
            v-if="idx == 4"
            :time="item.val"
          ></Device>
          <Finish
            v-if="idx == 5"
            :time="item.val"
            :type="item.val2"
          ></Finish>
          <Delay
            v-if="idx == 6"
            :time="item.val"
          ></Delay>
          <Person
            v-if="idx == 7"
            :time="item.val"
            :type="item.val2"
          ></Person>
        </div>
      </grid-item>
    </grid-layout>
    <ModifyReport></ModifyReport>
  </div>
</template>

<script>
import VueGridLayout from "vue-grid-layout";
import CstChart from "@/components/home/Cst";
import Device from "@/components/home/Device";
import ReportNotDone from "@/components/home/ReportNotDone";
import Workload from "@/components/home/Workload";
import ImgDtc from "@/components/home/Img";
import Finish from "@/components/home/Finish";
import Delay from "@/components/home/Delay";
import Person from "@/components/home/Person";
import Loading from "@/components/home/Loading";
import ModifyReport from "./MI03/ModifyReport";
Chart.defaults.global.defaultFontStyle = "bold";
Chart.defaults.global.defaultFontColor = "#343a40";
Chart.defaults.global.defaultFontFamily = "Microsoft JhengHei";
Chart.helpers.merge(Chart.defaults.global.plugins.datalabels, {
  anchor: "end",
  align: "start"
});

const timeOps = [
  { value: 1, text: "過去30天" },
  { value: 2, text: "過去90天" },
  { value: 3, text: "過去180天" },
  { value: 4, text: "過去365天" }
];

const personOps = [
  { value: 1, text: "醫師報告件數" },
  { value: 2, text: "醫師審核件數" },
  { value: 3, text: "放射師" },
  { value: 4, text: "護理師" }
];

const reportOps = [{ value: null, text: "選擇檢查儀器" }];

const layout = [
  { x: 0, y: 0, w: 3, h: 11, text: "陰性報告", i: "1", val: 1, ops: timeOps },
  { x: 3, y: 0, w: 3, h: 11, text: "影像品質", i: "2", val: 1, ops: timeOps },
  { x: 6, y: 0, w: 3, h: 11, text: "報告總量", i: "3", val: 1, ops: timeOps },
  {
    x: 9,
    y: 0,
    w: 3,
    h: 11,
    text: "工作總量",
    i: "4",
    val: 1,
    val2: 1,
    ops: timeOps,
    ops2: personOps
  },
  { x: 0, y: 4, w: 3, h: 11, text: "儀器使用", i: "5", val: 1, ops: timeOps },
  {
    x: 3,
    y: 4,
    w: 3,
    h: 11,
    text: "完成時間",
    i: "6",
    val: 1,
    val2: null,
    ops: timeOps,
    ops2: []
  },
  { x: 6, y: 4, w: 3, h: 11, text: "逾時報告", i: "7", val: 1, ops: timeOps },
  {
    x: 9,
    y: 4,
    w: 3,
    h: 11,
    text: "個別逾時",
    i: "8",
    val: 1,
    val2: null,
    ops: timeOps,
    ops2: []
  }
];

export default {
  name: "home",
  components: {
    GridLayout: VueGridLayout.GridLayout,
    GridItem: VueGridLayout.GridItem,
    CstChart,
    Device,
    ReportNotDone,
    Workload,
    ImgDtc,
    Finish,
    Delay,
    Person,
    Loading,
    ModifyReport
  },
  data () {
    return {
      load1: true,
      load2: true,
      load3: true,
      load4: true,
      load5: true,
      load6: true,
      load7: true,
      load8: true,
      layout,
      timeOp4TestResult: 1,
      timeOps,
      currentPage: 1,
      rows: 100,
      perPage: 10
    };
  },
  methods: {
    subscribeMsg () {
      this.$root.$on("陰性報告", s => (this.load1 = s));
      this.$root.$on("影像品質", s => (this.load2 = s));
      this.$root.$on("報告總量", s => (this.load3 = s));
      this.$root.$on("工作總量", s => (this.load4 = s));
      this.$root.$on("儀器使用", s => (this.load5 = s));
      this.$root.$on("完成時間", s => (this.load6 = s));
      this.$root.$on("逾時報告", s => (this.load7 = s));
      this.$root.$on("個別逾時", s => (this.load8 = s));
    },
    showDlg () {
      if (!window.dtcDebug) return;
      this.$bvModal.show("dtcModifyReport");
    }
  },
  async created () {
    this.subscribeMsg();
    let imgs = await window.axios.get("/GeneralData/SelectNoList?groupNo=ImageQuality");
    let arr = [];
    imgs = imgs.Items;
    imgs.forEach(s => {
      arr.push({ value: s.No, text: s.Name });
    });
    let reports = await window.axios.get("/employee/SelectList?staffType=35");
    const persons = [...reports.Items.slice(0, 20).map(s => ({ text: s.Name, value: s.Name }))];

    const map = await window.axios.get("/api/Device");
    arr = [];
    map.Items.forEach(s => {
      arr.push({ value: s.Id, text: s.Name });
    });
    this.layout[4].val2 = arr[0].value;
    this.layout[5].ops2 = [...arr];
    this.layout[5].val2 = arr[0].value;
    this.layout[7].ops2 = [...persons];
    if (persons[0].value) this.layout[7].val2 = persons[0].value || '';
  },
  async mounted () {
    this.$root.$on("dtc-report-db-count", len => {
      this.rows = len;
    });
    const { Items } = await window.axios.get("/checkItem/SelectNoList");
    const arr = [];
    Items.forEach(s => {
      let collection = { value: s.No, text: s.Name };
      arr.push(collection);
    });
    window.dtcOptionsCheckItem = arr;
    localStorage["dtcOptionsCheckItem"] = JSON.stringify(arr);
  },
  async beforeCreate () {
    let map = await window.axios.get("/GeneralData/SelectNoList?groupNo=DxReportModifyExpressUserType");
    localStorage.dtcModList1 = JSON.stringify(map);

    map = await window.axios.get("/GeneralData/SelectNoList?groupNo=DxReportModifyExpress");
    localStorage.dtcModList2 = JSON.stringify(map);

    map = await window.axios.get("/GeneralData/SelectNoList?groupNo=DxReportModifyReason");
    localStorage.dtcModList3 = JSON.stringify(map);

    map = await window.axios.get("/GeneralData/SelectNoList?groupNo=DxReportModifyMajorCause");
    localStorage.dtcModList4 = JSON.stringify(map);
  }
};
</script>

<style lang="scss">
.chartjs-render-monitor {
  height: 330px !important;
}
</style>
<style lang="scss" scoped>
.dashboard {
  background: black !important;
  margin-top: 56px;
  min-height: calc(100vh - 56px);
}
.vue-grid-item {
  background: var(--light); // var(--gray-dark) !important;
  color: var(--dark);
  border-radius: 5px;
  padding: 0.5rem;
  .dtc-chart-item {
    width: 100%;
    max-height: calc(100% - 50px);
    // border: 1px solid white;
  }
  .header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;
    font-size: 1rem;
    > div:first-child {
      margin-top: 4px;
    }
    .opts {
      display: flex;
      justify-content: flex-end;
      width: 230px;
    }
  }
}
.long-list {
  width: 530px !important;
}
.loadingApi {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  background: rgba(#000, 0.7);
  border-radius: 5px;
  display: grid;
  place-items: center;
  color: white;
  z-index: 99999999999999999999;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.6s ease-in-out;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
