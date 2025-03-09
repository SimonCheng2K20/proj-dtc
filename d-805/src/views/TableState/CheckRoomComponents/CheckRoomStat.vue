<template>
  <div id="FI0304" class="pageContent pb-1">
    <b-card id="searchBarCard" no-body class="mx-1" bg-variant="transparent">
      <b-card-header class="bg-warning text-dark cardHeader">
        <b-row no-gutters>
          <b-col
            cols="2"
            class="float-left text-left font-weight-bold grid-style"
          >
            <p style="margin: 0px">檢查室相關各類統計表</p>
          </b-col>
          <b-col
            v-show="show.DateRange"
            cols="3"
            class="float-left text-left font-weight-bold grid-style"
          >
            <p style="margin: 0px">
              時間區間: {{ DateRange[0] }} ~ {{ DateRange[1] }}
            </p>
          </b-col>
          <b-col
            v-show="show.Physician"
            cols="1"
            class="float-left text-left font-weight-bold grid-style"
          >
            <p style="margin: 0px">醫生: {{ selectedPhPhysician }}</p>
          </b-col>
          <b-col
            v-show="show.Device"
            cols="2"
            class="float-left text-left font-weight-bold grid-style"
          >
            <p style="margin: 0px">設備: {{ selectedInspectDevice }}</p>
          </b-col>
          <b-col
            v-show="show.CheckRoom"
            cols="2"
            class="float-left text-left font-weight-bold grid-style"
          >
            <p style="margin: 0px">檢查室: {{ headerCheckRoom }}</p>
          </b-col>
        </b-row>
      </b-card-header>
      <b-card-text class="text-left py-1">
        <BasicSearchBar
          @searchBarDateRange="passDateRange"
          @selectTbStat="changeTb"
          @gExcel="gExcel"
          :showInfor="show"
          :kindState="this.$route.query.id"
          :roomNoList="roomSelectNoList"
        ></BasicSearchBar>
      </b-card-text>
    </b-card>

    <b-card no-body id="cardTabs" class="m-1" bg-variant="transparent">
      <!-- <div v-text="checkRoomComponents" /> -->
      <component
        style="height: calc(100vh - 200px)"
        ref="call"
        :is="checkRoomComponents"
        :selectedCheckRoom="selectedCheckRoom"
        :selectedCheckRoomKey="selectedCheckRoomKey"
        :selectedInspectDevice="selectedInspectDevice"
        :medicationNo="medicationNo"
        :dateRange="DateRange"
        :day="selectedDay"
        :patientSource="patientSource"
        :caculateType="caculateType"
        :priceNo="priceNo"
        :failImage="failImage"
        :scrollHeight="tableHgt"
      ></component>
    </b-card>
  </div>
</template>

<script>
// import * as configs from "@/config";
import { dateFormatMixin } from "@/SupportLib_J.js";
//
//轉換時間function
// import DateHelper from "@/library/DateHelper";
//searchBar
import BasicSearchBar from "@/views/TableState/SearchBar/BasicSearchBar.vue";
//import total report components
import C1 from "@/views/TableState/CheckRoomComponents/C1.vue";
import C2 from "@/views/TableState/CheckRoomComponents/C2.vue";
import C3 from "@/views/TableState/CheckRoomComponents/C3.vue";
import C4 from "@/views/TableState/CheckRoomComponents/C4.vue";
import C5 from "@/views/TableState/CheckRoomComponents/C5.vue";
import C6 from "@/views/TableState/CheckRoomComponents/C6.vue";
import C7 from "@/views/TableState/CheckRoomComponents/C7.vue";
import C8 from "@/views/TableState/CheckRoomComponents/C8.vue";
import C9 from "@/views/TableState/CheckRoomComponents/C9.vue";
import C10 from "@/views/TableState/CheckRoomComponents/C10.vue";
import C11 from "@/views/TableState/CheckRoomComponents/C11.vue";
import { getRoomSelectNoList } from "@/assets/service/dataManager.js";
import { mapGetters, mapMutations } from "vuex";
// Vue.use(DateRangePickerPlugin);

export default {
  name: "CheckRoomStat",
  components: { BasicSearchBar, C1, C2, C3, C4, C5, C6, C7, C8, C9, C10, C11 },
  mixins: [dateFormatMixin],
  data() {
    return {
      //Components 預設值
      checkRoomComponents: null,
      //設備
      selectedInspectDevice: "",
      //檢查室 (selectedCheckRoom for api , headerCheckRoom for user)
      selectedCheckRoom: null,
      selectedCheckRoomKey: "",
      headerCheckRoom: "",
      medicationNo: "",
      patientSource: [],
      //醫生
      selectedPhPhysician: null,
      //時間區間
      DateRange: [null, null],
      //showIfor
      show: {
        DateRange: true,
        Physician: false,
        Device: false,
        CheckRoom: false,
      },
      roomSelectNoList: [],
      selectedDay: null,
      caculateType: 1,
      priceNo: "",
      failImage: null,
      tableHgt: 0,
    };
  },
  computed: {
    ...mapGetters(["getThemeColors", "getLocationNoOptions"]),
  },
  created() {
    this.tableHgt = window.innerHeight - 270 + "px";
    // console.log(this.$route.query.id);
    // alert("parents");
    // -----------------------------取得 App.vue 參照---------------------------//
    // let methodName = "created";
    //-------------------------------放入資料-----------------------------------//
    //進來畫面預計的時間區間
    // let d = new Date();
    // console.log(d);

    // let endDate = DateHelper.getMonthLast(d, false).getDate();

    // this.DateRange[0] = `${d.getFullYear()}-${d.getMonth() + 1}-01`;
    // console.log(this.DateRange[0]);
    // this.DateRange[1] = `${d.getFullYear()}-${d.getMonth() + 1}-${endDate}`;
    // console.log(this.DateRange[1]);

    //
    // console.log(this.YearData);
    // console.log(new Date());

    if (this.getLocationNoOptions.length === 0) {
      getRoomSelectNoList().then(({ Items }) => {
        this.SET_LOCATION_LIST({ key: "no", items: Items });
      });
    }

    this.$store.registerModule("excelUrl", {
      state: {
        urls: {},
        currentCondition: "",
        isGenerating: false,
      },
      mutations: {
        wsAddExcelUrl(state, { url, condition }) {
          state.urls = { ...state.urls, [condition]: url };
        },
        wsSetGenerateLoading(state, bool) {
          state.isGenerating = bool;
        },
        wsSetExcelCurrent(state, condition) {
          state.currentCondition = condition;
        },
        wsClearExcelUrl(state) {
          state.urls = {};
          state.currentCondition = "";
          this.isGenerating = false;
        },
      },
    });
  },
  methods: {
    //props Data
    //emit Function
    ...mapMutations(["SET_SIDE_MESSAGE", "SET_LOCATION_LIST"]),
    passDateRange(
      range,
      modality,
      Physician,
      CheckRoom,
      selectedDay,
      medicationNo = "",
      patientSource = [],
      caculateType = 1,
      priceNo = "",
      failImage = null,
      CheckRooms
    ) {
      this.DateRange = range;
      this.selectedInspectDevice = modality;

      this.selectedCheckRoom =
        this.checkRoomComponents === "C2"
          ? CheckRooms.map(({ id }) => id).join(",")
          : CheckRoom.id;
      this.headerCheckRoom = CheckRoom.text;
      this.selectedDay = selectedDay;
      this.patientSource = patientSource;
      this.caculateType = caculateType;
      // this.selectedCheckRoomKey = CheckRoom.text ? this.getLocationNoOptions.find(({ text }) => text === CheckRoom.text)["value"] || "" : "";
      this.selectedCheckRoomKey =
        this.checkRoomComponents === "C2" && CheckRooms.length > 0
          ? CheckRooms.map(
              ({ text }) =>
                this.getLocationNoOptions.find((opt) => opt.text === text)[
                  "value"
                ]
            ).join(",")
          : CheckRoom.text
          ? this.getLocationNoOptions.find(
              ({ text }) => text === CheckRoom.text
            )["value"]
          : "";

      CheckRoom.text
        ? this.getLocationNoOptions.find(({ text }) => text === CheckRoom.text)[
            "value"
          ] || ""
        : "";
      this.priceNo = priceNo;
      this.failImage = failImage;
      // alert("parents" + this.DateRange + this.selectedInspectDevice);
      // console.log(this.checkRoomComponents);
      if (this.checkRoomComponents == null) {
        this.SET_SIDE_MESSAGE({ msg: "請先選擇表單", type: 2 });
        return;
      }
      this.medicationNo = medicationNo;
      this.$nextTick(() => {
        this.$refs["call"].refreshTWP();
      });
    },
    gExcel(e) {
      this.$refs["call"].getExcelUrl(e);
    },
    //報表類型改變components
    changeTb(tbStat) {
      // console.log("CheckRoomStat(parents)" + tbStat);
      this.checkRoomComponents = tbStat;
      // this.$refs["call"].refreshTWP();
      let cond = this.checkRoomComponents;
      //控制searchBar的header  是否有show
      if (
        cond == null ||
        cond == "C1" ||
        cond == "C2" ||
        cond == "C3" ||
        cond == "C4" ||
        cond == "C5" ||
        cond == "C6" ||
        cond == "C7" ||
        cond == "C8" ||
        cond == "C9"
      ) {
        this.show.CheckRoom = false;
        this.show.Physician = false;
        (this.show.Device = false), (this.show.CheckRoom = false);
      }
      if (this.checkRoomComponents == "C10") {
        this.show.CheckRoom = true;
      }
    },
  },
  watch: {
    selectedPatientSource(newName, oldName) {},
    $route(to, from) {
      console.log(from);
    },
  },
  beforeDestroy: function () {
    this.StoreUiParams();
    this.$store.unregisterModule("excelUrl");
  },
  destroyed() {
    console.log(`${this.$logs()}`);
    // 解除 Theme:Black
    // const el = document.body;
    // el.classList.remove(this.themePacks.themeBlackName);
    //
    // 解除監聽器:攔截 KeyPress
    window.removeEventListener("keydown", this.HKWatch);
  },
};
</script>
