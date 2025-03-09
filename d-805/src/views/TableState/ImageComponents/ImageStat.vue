<template>
  <div
    id="image-stat"
    class="pageContent pb-1"
  >
    <b-card
      no-body
      class="mx-1"
      bg-variant="transparent"
    >
      <b-card-header class="bg-warning text-dark cardHeader">
        <b-row no-gutters>
          <b-col
            cols="2"
            class="float-left text-left font-weight-bold grid-style"
          >
            <p style="margin:0px;">影像相關各類統計表</p>
          </b-col>
          <b-col
            v-show="show.DateRange"
            cols="3"
            class="float-left text-left font-weight-bold grid-style"
          >
            <p style="margin:0px;">時間區間: {{ DateRange[0] }} ~ {{ DateRange[1] }}</p>
          </b-col>
          <b-col
            v-show="show.Physician"
            cols="1"
            class="float-left text-left font-weight-bold grid-style"
          >
            <p style="margin:0px;">醫生: {{ selectedPhPhysician }}</p>
          </b-col>
          <b-col
            v-show="show.Device"
            cols="2"
            class="float-left text-left font-weight-bold grid-style"
          >
            <p style="margin:0px;">設備: {{ selectedInspectDevice }}</p>
          </b-col>
          <b-col
            v-show="show.CheckRoom"
            cols="2"
            class="float-left text-left font-weight-bold grid-style"
          >
            <p style="margin:0px;">檢查室: {{ headerCheckRoom }}</p>
          </b-col>
        </b-row>
      </b-card-header>
      <b-card-text class="text-left py-1">
        <BasicSearchBar
          @searchBarDateRange="passDateRange"
          @selectTbStat="changeTb"
          :kindState="this.$route.query.id"
        ></BasicSearchBar>
      </b-card-text>
    </b-card>
    <b-card
      no-body
      id="cardTabs"
      class="m-1"
    >
      <component
        style="height:calc(100vh - 200px);overflow:auto"
        ref="call"
        :is="imgComponents"
        :dateRange="DateRange"
        :selectedInspectDevice="selectedInspectDevice"
        :selectedDay="SelectedDay"
      ></component>
    </b-card>
  </div>
</template>

<script>
//轉換時間function
// import DateHelper from "@/library/DateHelper";
//searchBar
import BasicSearchBar from "@/views/TableState/SearchBar/BasicSearchBar.vue";

import Vue from "vue";
import { mapGetters, mapMutations } from "vuex";
//import total report components
import Image1 from "@/views/TableState/ImageComponents/Image1";
import Image2 from "@/views/TableState/ImageComponents/Image2";
import Image3 from "@/views/TableState/ImageComponents/Image3";
import Image4 from "@/views/TableState/ImageComponents/Image4";
import Image5 from "@/views/TableState/ImageComponents/Image5";
import Image6 from "@/views/TableState/ImageComponents/Image6";
import Image7 from "@/views/TableState/ImageComponents/Image7";

import { DateRangePickerPlugin } from "@syncfusion/ej2-vue-calendars";
// import { DataManager, WebApiAdaptor, Predicate, Query } from "@syncfusion/ej2-data";
import { dateFormatMixin } from "@/SupportLib_J.js";

Vue.use(DateRangePickerPlugin);

export default {
  name: "FI0304",
  components: {
    BasicSearchBar,
    Image1,
    Image2,
    Image3,
    Image4,
    Image5,
    Image6,
    Image7
  },
  mixins: [dateFormatMixin],
  data () {
    return {
      //Components 預設值
      imgComponents: "",
      //設備
      selectedInspectDevice: "",
      //檢查室 (selectedCheckRoom for api , headerCheckRoom for user)
      selectedCheckRoom: null,
      headerCheckRoom: "",
      //醫生
      selectedPhPhysician: null,
      //時間區間
      DateRange: [null, null],
      SelectedDay: null,
      show: {
        DateRange: true,
        Physician: false,
        Device: false,
        CheckRoom: false
      }
    };
  },
  computed: {
    ...mapGetters(["getThemeColors"])
  },

  methods: {
    ...mapMutations(['SHOW_LOADING', 'HIDE_LOADING', "SET_SIDE_MESSAGE"]),
    passDateRange (range, modality, Physician, CheckRoom, selectedDay) {  // , medicationNoCode
      //
      this.DateRange = range;
      this.selectedInspectDevice = modality;
      this.selectedCheckRoom = CheckRoom.id;
      this.headerCheckRoom = CheckRoom.text;
      this.SelectedDay = selectedDay;
      //
      if (this.imgComponents == "" || this.imgComponents == null) {
        this.SET_SIDE_MESSAGE({ msg: "請先選擇表單", type: 2 });
        return;
      }
      this.$nextTick(() => {
        this.$refs["call"].refreshTWP();
      });
    },
    changeTb (tbStat) {
      this.imgComponents = tbStat;
      // this.$refs["call"].refreshTWP();
    }
  },
  watch: {
    selectedPatientSource (newName, oldName) { },
    $route (to, from) {
      console.log(from);
    }
  },
  mounted () {
    this.HIDE_LOADING();
  },
  created () {

    this.$store.registerModule("excelUrl", {
      state: {
        urls: {},
        currentCondition: "",
      },
      mutations: {
        wsAddExcelUrl (state, { url, condition }) {
          state.urls = { ...state.urls, [condition]: url };
        },
        wsSetExcelCurrent (state, condition) {
          state.currentCondition = condition;
        },
        wsClearExcelUrl (state) {
          state.urls = {};
          state.currentCondition = "";
        },
      },
    });
  },
  beforeDestroy () {
    this.$store.unregisterModule("excelUrl");
  }
};
</script>
<style lang="scss" scoped>
* {
  // border: 1px solid;
}
</style>
