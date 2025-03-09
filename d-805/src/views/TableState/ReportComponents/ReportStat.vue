<!-- ReportStat 為父層 component   子層 a.(BasicSearchBar) (component :is) -->
<!-- a.(BasicSearchBar) 上傳搜尋條件 ( 時間區間, 設備, 醫生, 檢查室 )-->

<template>
  <div id="report-stat" class="pageContent pb-1">
    <b-card no-body class="mx-1 noPrint" bg-variant="transparent">
      <b-card-header class="bg-warning text-dark cardHeader">
        <b-row no-gutters>
          <b-col cols="2" class="float-left text-left font-weight-bold grid-style">
            <p style="margin: 0px">報告相關各類統計表</p>
          </b-col>
          <b-col
            v-show="show.DateRange"
            cols="3"
            class="float-left text-left font-weight-bold grid-style"
          >
            <p style="margin: 0px">時間區間: {{ DateRange[0] }} ~ {{ DateRange[1] }}</p>
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
          @selectIssuePhysicianNo="changeIssueCode"
          @statChangeModality="statChangeModality"
          :kindState="$route.query.id"
        ></BasicSearchBar>
      </b-card-text>
    </b-card>
    <b-card
      no-body
      id="cardTabs"
      class="m-1"
      style="background-color: transparent"
      bg-variant="transparent"
    >
      <!-- :is (轉換components) :dateRange(傳時間範圍) :selectedInspectDevice(傳設備代碼) :refreshTable(refreshTWP)-->
      <component
        class="noData-infor"
        style="height: calc(100vh - 200px)"
        ref="call"
        :is="reportComponents"
        :selectedCheckRoom="selectedCheckRoom"
        :selectedInspectDevice="selectedInspectDevice"
        :selectedPhPhysician="selectedPhPhysician"
        :dateRange="DateRange"
        :errLevel="errLevel"
        :reportIssueCode="reportIssueCode"
        :modalityArr="modalityArr"
        :searchRange="searchRange"
        :selectSMSStatus="selectSMSStatus"
        :selectReturnCode="selectReturnCode"
      ></component>
    </b-card>
  </div>
</template>

<script>
//轉換時間function
import DateHelper from '@/library/DateHelper';

//searchBar
import BasicSearchBar from '@/views/TableState/SearchBar/BasicSearchBar.vue';

//import total report components
import report1 from '@/views/TableState/ReportComponents/Report1.vue';
import report2 from '@/views/TableState/ReportComponents/Report2.vue';
import report3 from '@/views/TableState/ReportComponents/Report3.vue';
import report4 from '@/views/TableState/ReportComponents/Report4.vue';
import report5 from '@/views/TableState/ReportComponents/Report5.vue';
import report6 from '@/views/TableState/ReportComponents/Report6.vue';
import report7 from '@/views/TableState/ReportComponents/Report7.vue';
import report8 from '@/views/TableState/ReportComponents/Report8.vue';
import report9 from '@/views/TableState/ReportComponents/Report9.vue';
import { mapGetters, mapMutations } from 'vuex';

export default {
  components: {
    BasicSearchBar,
    //四張報表
    report1,
    report2,
    report3,
    report4,
    report5,
    report6,
    report7,
    report8,
    report9
  },
  data() {
    return {
      //Components 預設值
      reportComponents: '',
      //設備
      selectedInspectDevice: '',
      //檢查室 (selectedCheckRoom for api , headerCheckRoom for user)
      selectedCheckRoom: null,
      headerCheckRoom: '',
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
      errLevel: '',
      report7SettingTemp: {
        selected: false,
        IssueTimeRange: [null, null],
        ModalityType: false,
        IssuePhysician: false
      },
      reportIssueCode: null,
      modalityArr: [],
      searchRange: {},
      selectSMSStatus: null,
      selectReturnCode: null,
    };
  },
  computed: {
    ...mapGetters(['getThemeColors']),
    report7Setting: {
      get(){
        return this.report7SettingTemp
      },
      set(val){
        this.report7SettingTemp = val
      }
    },
  },
  methods: {
    ...mapMutations(['SET_SIDE_MESSAGE']),
    dateRangeCheck(checkName = null){
      if(this.DateRange && this.DateRange.length){
        let chk = null
        this.DateRange.forEach((v)=>{
          if(v === null){
            chk = true
          }
        })
        if(chk){
          this.SET_SIDE_MESSAGE({ msg: `請選擇 ${checkName ? '\'' + checkName + '\'' : '時間範圍'}`, type: 2 })
          return
        }
      }
    },
    passDateRange(range, modality, Physician, CheckRoom, p5, p6, p7, p8, p9, p10, p11, errLv, searchRange, isSearch, selectSMSStatus, selectReturnCode) {
      this.errLevel = errLv;
      this.DateRange = range;
      this.selectedInspectDevice = modality;
      this.selectedPhPhysician = Physician;
      this.selectedCheckRoom = CheckRoom.id;
      this.headerCheckRoom = CheckRoom.text;
      this.searchRange = searchRange

      this.selectSMSStatus = selectSMSStatus
      this.selectReturnCode = selectReturnCode

      if (this.reportComponents == '' || this.reportComponents == null) {
        this.SET_SIDE_MESSAGE({ msg: '請先選擇表單', type: 2 });
        return;
      }

      if(this.reportComponents === 'report5' && isSearch){
        this.dateRangeCheck(`年度`)
      }

      if(this.reportComponents === 'report7' && isSearch){
        this.dateRangeCheck(`報告日期`)
      }

      if(this.reportComponents === 'report8' && isSearch){
        this.dateRangeCheck(`報告日期`)
      }

      if(this.reportComponents === 'report9' && isSearch){
        this.dateRangeCheck(`紀錄時間`)
      }

      this.$nextTick(() => {
        this.$refs['call'].refreshTWP();
      });
    },
    //報表類型改變components
    changeTb(tbStat) {
      console.log(`tbStat: `, tbStat)
      this.reportComponents = tbStat;
    },
    changeIssueCode(x){
      console.log(`changeIssueCode`, x)
      this.reportIssueCode = x
    },
    statChangeModality(x){
      console.log(`statChangeModality`, x)
      this.modalityArr = x
    }
  },
  created() {
    // this.$store.registerModule("excelUrl", {
    //   state: {
    //     urls: {},
    //     currentCondition: "",
    //   },
    //   mutations: {
    //     wsAddExcelUrl (state, { url, condition }) {
    //       state.urls = { ...state.urls, [condition]: url };
    //     },
    //     wsSetExcelCurrent (state, condition) {
    //       state.currentCondition = condition;
    //     },
    //     wsClearExcelUrl (state) {
    //       state.urls = {};
    //       state.currentCondition = "";
    //     },
    //   },
    // });
  },
  destroyed() {},
};
</script>
