<template>
  <div class="pageContent zhTW fix-light">
    <b-card no-body class="mx-1 border" bg-variant="transparent">
      <b-card-header class="bg-primary text-white cardHeader">
        <b-row no-gutters>
          <b-col cols="6" class="float-left text-left">報告搜尋作業</b-col>
        </b-row>
      </b-card-header>
      <b-card-text class="text-left py-1">
        <div class="d-grid grid-col-6 px-1" style="grid-gap: 2px;">
          <b-form-group
            id="fieldset-horizontal"
            label="包含名單"
            label-for="input-horizontal"
            class="m-0 d-flex align-items-center form-list bg-primary text-white input-title grid-span-2"
          >
            <el-select style="height:40px; width: 100%; border: none;" v-model="Whitevalue" multiple filterable allow-create default-first-option placeholder="包含內容">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </b-form-group>

          <b-input-group prepend="包含條件">
            <b-form-radio-group
              class="rounded-right bg-white d-flex align-items-center justify-content-center pl-2 border flex-1 text-black"
              v-model="ViewData.WhitelistAction"
              :options="[
                { text: '全含', value: 'AND' },
                { text: '任一', value: 'OR' },
              ]"
              size="sm"
            />
          </b-input-group>

          <b-form-group
            id="fieldset-horizontal"
            label="排除名單"
            label-for="input-horizontal"
            class="m-0 d-flex align-items-center form-list bg-primary text-white input-title grid-span-2"
          >
            <el-select style="height:40px; width: 100%; border: none;" v-model="Blackvalue" multiple filterable allow-create default-first-option placeholder="排除內容">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </b-form-group>

          <b-input-group prepend="排除條件">
            <b-form-radio-group
              class="rounded-right bg-white d-flex align-items-center justify-content-center pl-2 border flex-1 text-black"
              v-model="ViewData.BlacklistAction"
              :options="[
                { text: '全含', value: 'AND' },
                { text: '任一', value: 'OR' },
              ]"
              size="sm"
            ></b-form-radio-group>
          </b-input-group>

          <b-input-group prepend="申請單號">
            <b-input ref="AccessionNo1" v-model="ViewData.AccessionNo" @keydown.enter="twpRefresh" />
          </b-input-group>

          <b-input-group prepend="病歷號">
            <b-input v-model="ViewData.PatientId" @keydown.enter="twpRefresh" />
          </b-input-group>

          <b-input-group prepend="病患姓名">
            <b-input v-model="ViewData.PatientName" @keydown.enter="twpRefresh" />
          </b-input-group>

          <div class="d-flex">
            <b-input-group class="flex-1" prepend="病患年齡">
              <b-input min="0" v-model="ViewData.PatientAge" type="number" @keydown.enter="twpRefresh" />
              <b-input v-if="ViewData.PatientAgeAction === '~'" :min="parseInt(ViewData.PatientAge) + 1" v-model="ViewData.PatientAgeMax" type="number" />
            </b-input-group>

            <b-form-select :style="`width: ${ViewData.PatientAgeAction === '~' ? 70 : 120}px;`" v-model="ViewData.PatientAgeAction" :options="patientAgeActions" />
          </div>

          <b-input-group prepend="病患來源">
            <b-select v-model="ViewData.PatientSourceTypeCode" :options="PatientSource" />
          </b-input-group>

          <b-input-group prepend="撰寫人員">
            <b-form-input
              v-model="ViewData.DxreportPhysician"
              list="DxreportPhysicianSource"
              @change="OnChangeDxreportPhysician"
              @keydown.enter="twpRefresh"
            ></b-form-input>
            <!--  :disabled="medicineDisable" -->
            <datalist id="DxreportPhysicianSource">
              <option class="dxreport-data-idx" v-for="(Item, idx) in DxreportPhysicianSource" v-bind:key="Item.value" :value="Item.value">{{ Item.text }}</option>
            </datalist>
          </b-input-group>

          <b-input-group prepend="審核醫師">
            <b-form-input v-model="ViewData.IssuePhysician" list="IssuePhysicianSource" @change="OnChangeIssuePhysician" @keydown.enter="twpRefresh"></b-form-input>
            <!--  :disabled="medicineDisable" -->
            <datalist id="IssuePhysicianSource">
              <option v-for="(Item, idx) in IssuePhysicianSource" v-bind:key="Item.value" :value="Item.value">{{ Item.text }}</option>
            </datalist>
          </b-input-group>

          <b-input-group prepend="開單科別">
            <b-form-input
              v-model="ViewData.RequestingService"
              list="RequestingServiceSource"
              @change="OnChangeRequestingService"
              @keydown.enter="twpRefresh"
            ></b-form-input>
            <!--  :disabled="medicineDisable" -->
            <datalist id="RequestingServiceSource">
              <option v-for="(Item, idx) in RequestingServiceSource" v-bind:key="Item.value" :value="Item.value">{{ Item.text }}</option>
            </datalist>
            <!-- <b-select v-model="ViewData.RequestingServiceId" :options="RequestingServiceSource" /> -->
          </b-input-group>

          <b-input-group prepend="檢查項目" class="bg-white">
            <v-super-select
              noneFoundText="無此筆資料"
              placeholder="請選擇"
              v-model="ViewData.ProcedureCodeShow"
              :items="checkItemSource"
              @change="OnChangeProcedure"
              @keydown.enter="twpRefresh"
              style="z-index:1"
            />
          </b-input-group>

          <b-input-group prepend="檢查日期" style="width:340px">
            <div id="CheckDataPicker" class="form-control" style="padding: 0px 0px ;">
              <ejs-daterangepicker @enter="twpRefresh" v-model="CheckDateRange"></ejs-daterangepicker>
            </div>
          </b-input-group>

          <b-input-group prepend="病患性別">
            <b-form-radio-group
              class="pl-2 rounded-right bg-white text-black d-flex align-items-center justify-content-center flex-1"
              style="border:1px solid #ced4da; height: 38px;"
              v-model="ViewData.PatientSex"
            >
              <b-form-radio value="M">男</b-form-radio>
              <b-form-radio value="F">女</b-form-radio>
            </b-form-radio-group>
          </b-input-group>

          <b-input-group prepend="報告日期" style="width:340px">
            <div id="CheckDataPicker" class="form-control" style="padding: 0px 0px ;">
              <ejs-daterangepicker v-model="ReportDateRange"></ejs-daterangepicker>
            </div>
          </b-input-group>

          <div class="d-flex rounded bg-white border grid-span-3" style="overflow: hidden;">
            <div style="padding: 0 12px; border-radius: 5px 0 0 5px;" class="bg-primary text-white d-flex justify-content-center align-items-center input-title">
              儀器類別
            </div>

            <div class="d-flex flex-1">
              <div class="bg-primary text-white m-1 px-2 rounded d-flex align-items-center" v-for="dvalue in ViewData.Modalities" :key="dvalue">
                {{ dvalue }}
                <font-awesome-icon
                  class="text-white cursor-pointer ml-1"
                  icon="times-circle"
                  @click.stop="ViewData.Modalities = ViewData.Modalities.filter((value) => value != dvalue)"
                />
              </div>
              <b-form-input
                list="my-list-id"
                v-model="singelDeviceValue"
                class="ml-1"
                style="border-top-left-radius: 0px; border-bottom-left-radius: 0px; border: 0; flex: 1 0 80px;"
                @keydown.enter="definedModality"
                @keydown.delete="deleteModality"
                @change="chosenModality"
              />
              <datalist id="my-list-id">
                <option v-for="mkey in modalityKey" :key="mkey" v-text="mkey" />
              </datalist>
            </div>
          </div>

          <div class="grid-span-3 d-flex justify-content-end">
            <b-row no-gutters>
              <b-button variant="primary" @click="twpRefresh"> <font-awesome-icon icon="search" />進行查詢 </b-button>
              <b-button class="ml-1" variant="success" @click="clear"> <font-awesome-icon icon="eraser" />清除條件 </b-button>
              <!-- <b-button class="ml-1" variant="success" @click="print"> -->
              <b-button class="ml-1" variant="warning" @click="print"> <font-awesome-icon icon="print" />報告列印 </b-button>

              <b-button class="ml-1" variant="danger" @click="downloadExcel"> <font-awesome-icon icon="download" />下載Excel</b-button>

              <b-col class="pl-1">
                <b-input-group prepend="列印格式">
                  <b-form-radio-group
                    class="rounded-right bg-white d-flex align-items-center justify-content-center pl-2"
                    style="border:1px solid #ced4da; height: 40px;"
                    v-model="ViewData.printType"
                  >
                    <b-form-radio value="0">A4</b-form-radio>
                    <b-form-radio value="1">B6</b-form-radio>
                    <b-form-radio v-if="isLocal" value="2">B5</b-form-radio>
                  </b-form-radio-group>
                </b-input-group>
              </b-col>
            </b-row>
          </div>
        </div>
      </b-card-text>
    </b-card>
    <b-container fluid class="mt-1 mx-0 pl-1 pr-0 tableContainer">
      <b-row no-gutters>
        <b-col>
          <div id="block4QueryResult" class="mr-1 rounded" style="border:1px solid #ced4da;">
            <!-- v-bind:OpButton1Func="RowClickFunction" -->
            <!-- :OpButton4Func="ShowReportDetail" -->
            <twp
              ref="twp1"
              :FieldConfig="tableConfig4QueryResult"
              :DataFetch="startSearchReport"
              :isBackEndPagination="true"
              :OnHeaderCheckBoxChange="OnHeaderCheckBoxChange"
              :mountedSearch="false"
              :SearchCondition="ViewData"
              v-on:allUnSelected="ResetFirstCheckItem"
              :specialColumn="[
                { pos: 0, label: '報表', text: '列印', event: handlePrintCheckbox, type: 'checkbox' },
                { pos: 1, label: '報告審查', text: '審查', event: handlePrintCheckbox, type: 'button' },
                { pos: 4, label: '報告預覽', text: '報告預覽', event: tbodyMouseEvent, type: 'hoverText' },
              ]"
              @contentDiffEvent="reportDiffEvent"
            />
            <!-- { pos: 2, label: '版本', text: '比對', event: handleCheckVersion, type: 'button2' }, -->
            <!-- { pos: 2, label: '版本', text: '比對', event: handleCheckVersion, type: 'button3' }, -->
            <transition name="fade">
              <div ref="flowReport" class="preview-report rounded p-2 position-fixed border" :style="reportStyling" v-if="this.preReportId">
                <div v-if="this.preReportContents[this.preReportId] === 'loading'" class="d-flex justify-content-center align-items-center">
                  <b-spinner label="Spinning" />
                </div>
                <div
                  v-else
                  :class="{ 'd-flex justify-content-center align-items-center': this.preReportContents[this.preReportId] === 'no data' }"
                  v-text="this.preReportContents[this.preReportId]"
                />
              </div>
            </transition>
          </div>
        </b-col>
      </b-row>
    </b-container>
    <!-- thomas edit -->
    <b-modal ref="showAlert" header-bg-variant="danger" header-text-variant="light" hide-footer title="貼心提醒">
      <p v-text="remindWords" />
    </b-modal>

    <b-modal id="WinDiff0307" v-model="diffInfo.dialog" centered hide-footer no-fade header-bg-variant="warning" header-text-variant="dark" body-class="py-1" size="xl">
      <template slot="modal-title">
        <font-awesome-icon icon="code-branch" class="mr-1" />
        <span class="zhTW">版本差異</span>
      </template>
      <!-- <b-btn
        class="mx-auto my-3 d-table"
        v-if="!diffInfo.showFullScreen"
        @click.stop="confirmDialog"
      >show</b-btn> 
      <template>

        
      </template>-->
      <div class="d-block zhTW">
        <contentDiff
          :newVersion="diffInfo.current.version"
          :oldVersion="diffInfo.old.version"
          :oldString="diffInfo.old.content"
          :newString="diffInfo.current.content"
          :context="10"
        />
      </div>
    </b-modal>

    <image-report-print :item="printStuff" v-if="!!printStuff" v-on:closePrint="printStuff = null" />
    <div v-print="{ origin: this, inBody: isPrint, printType: ViewData.printType, afterPrint: finishPrinting, isDemo: true }">
      <div v-if="reportGroupList.length > 0">
        <template v-for="{ reports, type, createTime } in reportGroupList">
          <printSubReport v-if="type === 'sub'" :reports="reports" :key="createTime" />
          <printComposition v-if="type === 'nor'" :reports="reports" :key="createTime" @startPrint="startPrintWork" />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { modalityKey } from "@/assets/js/common.js";
import Vue from "vue";
import twp from "@/components/TWPv5_1";
import { Select } from "element-ui";
import lang from "element-ui/lib/locale/lang/zh-TW";
import locale from "element-ui/lib/locale";
locale.use(lang);
import * as configs from "@/config";
import { DateRangePickerPlugin } from "@syncfusion/ej2-vue-calendars";
import { dateFormatMixin } from "@/SupportLib_J.js";
import { DataManager, WebApiAdaptor, Predicate, Query } from "@syncfusion/ej2-data";
import VSuperSelect from "v-super-select";
import ImageReportPrint from "@/components/ImageReportPrint.vue";
import {
  getOptionsPatientSource,
  getExamReport,
  getPatientReportList,
  getReportWithVersion,
  getOptionsReportDrSource,
  getOptionsRequestingServiceSource,
  reportSearch,
  reportExport,
} from "@/assets/service/dataManager.js";
import printComposition from "@/components/printCompositionDemo";
import printSubReport from "@/components/printSubReport";
import { mapMutations, mapGetters, mapState } from "vuex";
import { fi0307ConfigCollection, ViewData } from "./defaultData.js";
import FormHelper from "@/library/FormHelper";
import contentDiff from "@/components/ContentDiff";
Vue.component(Select.name, Select);
Vue.use(DateRangePickerPlugin);
export default {
  //報告搜尋作業
  name: "FI0307",
  components: { twp, VSuperSelect, ImageReportPrint, printComposition, printSubReport, contentDiff },
  mixins: [dateFormatMixin],
  data() {
    return {
      isPrint: false,
      printStuff: null,
      patientsHistoryList: {},
      theProcedure: {
        OrderNo: "",
        StatusName: "",
        AccessionNo: "123A567BC", //申請單號(大單號)
        StudyDate: "2019/10/14", //檢查日期
        Modality: "CT/MRI", //檢查儀器
        PatientId: "1234567-8", //病歷號
        PatientSourceType: "O-門診", //病患來源
        PatientName: "趙大升",
        PatientSex: "M-男性",
        PatientBirthday: "1943/12/31",
        PatientAge: 76,
        Subjective: "這裡放的是病患主訴",
        Objective: "這裡是醫師客訴",
        //RadiographerNote: '這是放射師的檢查註記',
        RadiographerNote:
          "這是放射師的檢查註記\n這是放射師的檢查註記\n這是放射師的檢查註記\n這是放射師的檢查註記\n這是放射師的檢查註記\n這是放射師的檢查註記\n這是放射師的檢查註記\n這是放射師的檢查註記\n",
        RequestingPhysicianId: "1231",
        RequestingPhysicianName: "開單醫師",
        BedNo: "701221", //床號
        ShiftNote: "這是交班記錄",
      },
      remindWords: "請至少設定一組條件，再進行搜尋",
      firstCheckedItem: null,
      //檢查項目來源
      checkItemSource: window.dtcOptionsCheckItem,
      //病患來源
      PatientSource: [],
      //報告醫生
      DxreportPhysicianSource: [],
      //審核醫生
      IssuePhysicianSource: [],
      //開單科別來源
      RequestingServiceSource: [],
      Whitevalue: [],
      Blackvalue: [],
      Devicevalue: [],
      singelDeviceValue: "",
      modalityKey,
      options: [],
      value: [],
      tableConfig4QueryResult: fi0307ConfigCollection,
      tableContent4QueryResult: null,
      tableContent4QueryCount: 0,
      tableContent4QueryCurrent: 1,
      //檢查起訖日
      CheckDateRange: ["", ""],
      //報告起訖日
      ReportDateRange: ["", ""],
      //for query
      ViewData,
      checkItemList: [],
      reportGroupList: [],
      patientAgeActions: [
        { text: "等於", value: "=" },
        { text: "大於", value: ">" },
        { text: "大於等於", value: ">=" },
        { text: "小於", value: "<" },
        { text: "小於等於", value: "<=" },
        { text: "區間", value: "~" },
      ],
      preReportBase: { x: 0, y: 0 },
      preReportContents: {},
      preReportId: "",
      mouseoverTimeStamp: 0,
      preReportTimer: null,
      diffArray: [],
      diffInfo: {
        dialog: false,
        showFullScreen: false,
        current: {
          version: "",
          content: "",
        },
        old: {
          version: "",
          content: "",
        },
      },
    };
  },
  computed: {
    ...mapState(["patientSourceList", "serviceSourceList"]),
    ...mapGetters(["getReportDrs"]),
    isLocal() {
      return process.env.NODE_ENV !== "production";
    },
    reportStyling() {
      const wdt = 600 + this.preReportBase.x <= document.body.clientWidth ? 600 : document.body.clientWidth - this.preReportBase.x;
      const hgt = document.body.clientHeight - this.preReportBase.y;
      return `left: ${this.preReportBase.x}px; top: ${this.preReportBase.y}px; width: ${wdt}px; max-height: ${hgt}px`;
    },
  },
  methods: {
    ...mapMutations(["setLoadingStatus", "SHOW_LOADING", "HIDE_LOADING", "SET_SIDE_MESSAGE", "SET_PATIENT_SOURCE_LIST", "SET_REPORT_DR", "SET_SERVICE_SOURCE_LIST"]),
    deleteModality(e) {
      if (!e.target.value && this.ViewData.Modalities.length > 0) {
        this.ViewData.Modalities.pop();
      }
    },
    chosenModality() {
      this.definedModality();
    },
    definedModality() {
      if (!this.ViewData.Modalities.some((v) => this.singelDeviceValue === v) && this.modalityKey.includes(this.singelDeviceValue)) {
        this.ViewData.Modalities.push(this.singelDeviceValue);
      } else {
        this.twpRefresh();
      }
      this.singelDeviceValue = "";
    },
    finishPrinting() {
      this.isPrint = false;
      this.reportGroupList = [];
      this.$refs.twp1.Rows.forEach((item) => {
        if (item["PrintCheck"]) item["PrintCheck"] = false;
      });
    },
    handleCheckVersion() {
      alert("CHECK VERSION");
    },
    handlePrintCheckbox(item) {
      // if (item['List'] && item['List'].length > 0) {
      //   item.List.some(it => {
      //     const isMatch = it.DxrVersion.includes(item.DxrVersion);
      //     if (isMatch) it.isChecked = !item.PrintCheck;
      //     return isMatch;
      //   });wws
      // }
    },
    showFlowDialog(e) {
      console.log(e);
    },
    async printService(patient) {
      try {
        const { Items } = await window.axios.get(`/reportStatistics/ImageDxReport?accession_no=${patient.AccessionNo}`);
        if (Items.length > 0) this.printStuff = Items[0];
        // ACCESSION_NO: "P812190073000001"
        // PATIENT_ID: "15417312"
        // PATIENT_NAME: "任瑞安"
        // CHECKITEM: "心理測驗(全套)"
        // ISSUE_DTTM: "2020-01-22T00:00:00"
        // PROCEDURE_COMPLETED: "2020-01-07T00:00:00"
        // INSTITUTION_NAME: "復健科"
        // GDATANAME: "門診"
        // STRUCTURECONTENT1: ""
        // MODIFYNOTE: "閱片太快"
        // DXRAEITEMID: null
        // STRUCTURECONTENT2: ""
      } catch (err) {
        console.log(err);
      }
    },
    //變更檢查項目
    OnChangeProcedure() {
      this.ViewData.ProcedureCode = "";
      let id = this.ViewData.ProcedureCodeShow;
      let _this = this;
      this.checkItemSource.some((i) => {
        if (i.value == id || i.text == id) {
          _this.ViewData.ProcedureCode = i.value;
          _this.ViewData.ProcedureCodeShow = i.text;
          return true;
        }
      });

      //若沒有完整match到 datasource, 用input的值 直接搜尋
      if (this.ViewData.ProcedureCode == "") this.ViewData.ProcedureCode = id;
    },
    //撰寫人員變更
    OnChangeDxreportPhysician() {
      // let options = document.querySelectorAll(".dxreport-data-idx");

      this.ViewData.DxreportPhysicianId = "";
      let id = this.ViewData.DxreportPhysician;
      let _this = this;
      this.DxreportPhysicianSource.some((i) => {
        if (i.value == id || i.text == id) {
          _this.ViewData.DxreportPhysicianId = i.value;
          _this.ViewData.DxreportPhysician = i.text;
          return true;
        }
      });

      //若沒有完整match到 datasource, 用input的值 直接搜尋
      if (this.ViewData.DxreportPhysicianId == "") this.ViewData.DxreportPhysicianId = id;
    },
    //審核醫師變更
    OnChangeIssuePhysician() {
      this.ViewData.IssuePhysicianId = "";
      let id = this.ViewData.IssuePhysician;
      let _this = this;
      this.IssuePhysicianSource.some((i) => {
        if (i.value == id || i.text == id) {
          _this.ViewData.IssuePhysicianId = i.value;
          _this.ViewData.IssuePhysician = i.text;
          return true;
        }
      });

      //若沒有完整match到 datasource, 用input的值 直接搜尋
      if (this.ViewData.IssuePhysicianId == "") this.ViewData.IssuePhysicianId = id;
    },
    //開單科別變更
    OnChangeRequestingService() {
      this.ViewData.RequestingServiceId = "";
      let id = this.ViewData.RequestingService;
      let _this = this;
      this.RequestingServiceSource.some((i) => {
        if (i.value == id || i.text == id) {
          _this.ViewData.RequestingServiceId = i.value;
          _this.ViewData.RequestingService = i.text;
          return true;
        }
      });

      //若沒有完整match到 datasource, 用input的值 直接搜尋
      if (this.ViewData.RequestingServiceId == "") this.ViewData.RequestingServiceId = id;
    },
    beforeSearchProcess() {
      //因為實際搜尋的日期condition在單獨清空檢查日期時 沒有清空此物件, 因此在此先清空, 以免重複搜尋相同condition
      this.ViewData.ScheduleTimeStart = "";
      //檢查訖
      this.ViewData.ScheduleTimeEnd = "";

      ["CheckDateRange", "ReportDateRange"].forEach((range) => {
        if (!this[range]) {
          this[range] = ["", ""];
        }
      });

      let length =
        this.Whitevalue.length +
        this.Blackvalue.length +
        this.ViewData.AccessionNo.length +
        this.ViewData.PatientId.length +
        this.CheckDateRange[0].toString().length +
        this.ReportDateRange[0].toString().length +
        this.ViewData.ProcedureCode.length +
        this.ViewData.PatientSex.length +
        this.ViewData.PatientAge.length +
        (this.ViewData.PatientSourceTypeCode ? this.ViewData.PatientSourceTypeCode.length : 0) +
        this.ViewData.DxreportPhysicianId.length +
        this.ViewData.IssuePhysicianId.length +
        this.ViewData.RequestingServiceId.length +
        this.ViewData.Modalities.length +
        (this.ViewData.PatientName ? this.ViewData.PatientName.length : 0);

      if (length === 0) {
        this.remindWords = "請至少設定一組條件，再進行搜尋";
        this.$refs["showAlert"].show();
        return null;
      } else {
        if (
          this.ViewData.PatientAgeAction === "~" &&
          ([this.ViewData.PatientAge, this.ViewData.PatientAgeMax].some((age) => !age) || this.ViewData.PatientAgeMax <= this.ViewData.PatientAge)
        ) {
          this.remindWords = "病患年齡區間有誤，請修正";
          this.$refs["showAlert"].show();
          return null;
        }

        let White = Object.values(this.Whitevalue).join(",");
        let Black = Object.values(this.Blackvalue).join(",");
        this.ViewData.Whitelist = White == "" ? [] : White.split(",");
        this.ViewData.BlackList = Black == "" ? [] : Black.split(",");

        if (this.ViewData.BlackList.length === 0) delete this.ViewData.BlacklistAction;
        if (this.ViewData.Whitelist.length === 0) delete this.ViewData.WhitelistAction;

        //表示有KEY入時間
        ["CheckDateRange", "ReportDateRange"].forEach((range, idx) => {
          if (this[range] != null) {
            if (this[range][0] != "" && this[range].length == 2) {
              //日期 設為00:00~晚上11:59分
              // this[range][0].setHours(0, 0, 0, 0);
              // this[range][1].setHours(23, 59, 59, 999);

              const keys = idx === 0 ? ["ScheduleTimeStart", "ScheduleTimeEnd"] : ["IssueTime", "IssueEndTime"];

              keys.forEach((key, kIdx) => {
                this.ViewData[key] = this.$moment(this[range][kIdx]).format(`YYYY-MM-DD ${kIdx === 0 ? "00:00:00" : "23:59:59"}`);
              });
            }
          }
        });

        //====API限制: 沒有值的條件不要帶進body, 會造成日期搜尋無效====
        //後來API 修正了, 反正這樣也乾淨
        //此處用另一個object把有值的條件帶入
        let eViewData = {};
        for (var k in this.ViewData) {
          if (this.ViewData[k] && this.ViewData[k].toString().length > 0) {
            eViewData[k] = this.ViewData[k];
          }
        }

        if (!eViewData.hasOwnProperty("PatientAge")) delete eViewData.PatientAgeAction;

        return eViewData;
      }
    },
    downloadExcel() {
      const eViewData = this.beforeSearchProcess();
      if (!eViewData) return;
      this.SHOW_LOADING();
      reportExport(eViewData)
        .then(({ Message, Url }) => {
          console.log(Message);
          FormHelper.downloadFile(Url);
        })
        .catch((err) => {
          this.SET_SIDE_MESSAGE({ msg: "發生錯誤，稍候再試", type: 2 });
        })
        .finally(() => {
          this.HIDE_LOADING();
        });
    },
    twpRefresh() {
      this.$refs.twp1.OnForceRefresh();
    },
    //查詢報告
    async startSearchReport() {
      await new Promise((resolve) =>
        setTimeout(function() {
          resolve(true);
        }, 100)
      );
      const { PagingRowPerPage, PagingCurrentPage } = this.$refs.twp1;
      const pagination = `$top=${PagingRowPerPage}&$skip=${(PagingCurrentPage - 1) * PagingRowPerPage}`;
      const eViewData = this.beforeSearchProcess();
      if (!eViewData) return;
      this.SHOW_LOADING();
      try {
        const { Items, Count } = await reportSearch(pagination, eViewData);
        Items.forEach((item) => {
          item.ScheduleTime = this.$moment(item.ProcedureCompleted).format("YYYY/MM/DD");
          item.DxrVersionForShow =
            item.ReleaseVersion +
            " / " +
            item.DxrVersion.split(".")
              .slice(0, 2)
              .join(".");

          ["CounterRegister", "OrderDate", "NoticeTime"].forEach((key) => {
            item[`${key}ForShow`] = item[key] ? this.$moment(item[key]).format("YYYY/MM/DD") : "";
          });

          item["PrintCheck"] = false;
          item["EmgFlagName"] = item["EmgFlag"] === "Y" ? "急作" : "一般";
        });
        return { Items, Count };
      } catch (err) {
        this.SET_SIDE_MESSAGE({ msg: "存取時發生錯誤! 請稍後再試.", type: 2 });
        return { Items: [], Count: 0 };
      } finally {
        this.HIDE_LOADING();
      }
    },
    //顯示Detail明細
    ShowReportDetail(x) {},
    //清除條件
    clear() {
      //申請單號
      (this.ViewData.AccessionNo = ""),
        //病歷號
        (this.ViewData.PatientId = ""),
        //檢查起
        (this.ViewData.ScheduleTimeStart = ""),
        //檢查訖
        (this.ViewData.ReportTimeEnd = ""),
        //報告起
        (this.ViewData.ReportTimeStart = ""),
        //報告訖
        (this.ViewData.ScheduleTimeEnd = ""),
        //檢查項目
        (this.ViewData.ProcedureCode = ""),
        (this.ViewData.ProcedureCodeShow = ""),
        //性別
        (this.ViewData.PatientSex = ""),
        //姓名
        (this.ViewData.PatientName = ""),
        //年齡
        (this.ViewData.PatientAge = ""),
        //年齡MAX
        (this.ViewData.PatientAgeMax = ""),
        //病患來源
        (this.ViewData.PatientSourceTypeCode = null),
        //報告醫生
        (this.ViewData.DxreportPhysicianId = ""),
        (this.ViewData.DxreportPhysician = ""),
        //審核醫生
        (this.ViewData.IssuePhysicianId = ""),
        (this.ViewData.IssuePhysician = ""),
        (this.ViewData.PatientAgeAction = "="),
        //開單科別
        (this.ViewData.RequestingServiceId = "");
      this.ViewData.RequestingService = "";
      this.CheckDateRange = ["", ""];
      this.ReportDateRange = ["", ""];
      this.ViewData.Modalities = [];

      this.Whitevalue = [];
      this.Blackvalue = [];

      this.ViewData.printType = "0";

      setTimeout(() => {
        const q = ".super-select-input input[type=text]";
        document.querySelector(q).value = "";
        document.querySelector(q).value = "";
      }, 300);
    },
    //單一item的checkbox點擊觸發
    itemChecked(item) {
      if (this.firstCheckedItem == null) this.firstCheckedItem = item;
      if (item) {
        if (item.showCheckBox) {
          if (item.TWPCheckBox1Value) item.TWPCheckBox1Value = false;
          else item.TWPCheckBox1Value = true;
        }
      }
      // setTimeout(x => {
      //   //快速排檢按鈕顯示 ROLE:
      //   // this.QuickcheckinBtn=false;
      //   let data = this.$refs["twp1"].checkedItems;
      //   let checkList = [];
      //   data.forEach(x => {
      //     checkList.push(x.Status);
      //   });
      // }, 500);
    },
    async getReportData(data) {
      //利用AccessionNo反查報告相關內容
      // console.log(this.$refs["twp1"].checkedItems);
      // console.log(data.AccessionNo);
      await new DataManager({
        //status 11 未排檢、12已排檢、21已報到
        url: configs.publicPath + "../exam/List",
        adaptor: new WebApiAdaptor(),
        crossDomain: true,
      })
        //
        .executeQuery(new Query().where("AccessionNo", "contains", data.AccessionNo))
        .then((r) => {
          let dataList = r.actual.Items[0];
          dataList.isFromFI0307 = true;
          dataList.ProcedureCompleted = this.DateToString(dataList.ProcedureCompleted, true);
          dataList.PatientBirthday = this.DateToString(dataList.PatientBirthday, false);
          dataList.StudyTime = dataList.StudyTime == null ? "無影像" : this.DateToString(dataList.StudyTime, true);
          //時間變成user可接受模式
          // dataList.forEach(i => {
          //   i.ProcedureCompleted = this.DateToString(
          //     i.ProcedureCompleted,
          //     true
          //   );
          //   i.PatientBirthday = this.DateToString(i.PatientBirthday, false);
          //   i.StudyTime =
          //     i.StudyTime == null
          //       ? "無影像"
          //       : this.DateToString(i.StudyTime, true);

          //   if (i.EmgFlag === "Y") {
          //     i._rowVariant = "danger";
          //   }
          //   // IssuePhysicianId 審合醫師
          //   // DxreportPhysicianName 報告醫師
          //   this.theProcedure.RequestingPhysicianName =
          //     i.RequestingPhysicianName;
          // });
          // console.log(r);
          //偷塞DxrVersion給
          dataList.DxrVersion = data.DxrVersion;
          // console.log(dataList);
          window.dtcEvaluationDataList = dataList ? dataList : [];
          // console.log(window.dtcEvaluationDataList);
          this.$router.replace({
            name: "FI0306-1",
            params: {
              FI0307TempData: this.tableContent4QueryResult,
              FI0307TempCheckItems: this.$refs["twp1"].checkedItems,
              FI0307TempQuery: this.ViewData,
              FI0307TempCurrentPage: this.$refs["twp1"].PagingCurrentPage,
            },
          });
        });
      // console.log(this.theProcedure);
      // window.dtcEvaluationDataList = x ? x : [];
      // // alert("FI0306");
      // console.log(window.dtcEvaluationDataList);
      // this.$router.replace({ name: "FI0306-1" });
    },
    OnHeaderCheckBoxChange(checked) {
      if (!checked) this.ResetFirstCheckItem();
    },
    ResetFirstCheckItem() {
      this.firstCheckedItem = null;
    },
    //twp list判斷item是否顯示checkbox, 此處判斷item patient id是否和已選的item相同,
    //一單多檢的多選判斷
    CheckIfIdMatchMuitiSelect(item) {
      if (this.firstCheckedItem == null) return true;

      return item.PatientId == this.firstCheckedItem.PatientId;
    },
    //判斷是否顯示header的checkbox, 如果list的content 皆為同patient id,
    //或 已點某筆item 判斷出相同patient id之row, 則顯示
    CheckIfShowHeaderCheckBox() {
      if (this.firstCheckedItem == null) {
        return false;
      } else {
        return true;
      }
    },
    fetchPatientHistory(list) {
      return new Promise(async (resolve, reject) => {
        for (const { PatientId } of list) {
          if (!this.patientsHistoryList[PatientId]) {
            this.patientsHistoryList[PatientId] = await getPatientReportList(PatientId);
          }
        }
        resolve(true);
      });
    },
    async print() {
      // console.log(this.ViewData);
      //判斷是否有勾選至少一筆，此方法有問題，進入報告後再出來會無資料 需另外處理
      //每一個Rows為一筆申請單號

      if (this.$refs["twp1"].Rows.length === 0) {
        this.SET_SIDE_MESSAGE({ msg: "請至少選擇一筆報告", type: 2 });
        return;
      }
      let Reports = this.$refs["twp1"].Rows.reduce((a, { AccessionNo: mNo, DxrVersion: mVer, PrintCheck, List }) => {
        List ? a.concat(List.reduce((la, { isChecked, AccessionNo, DxrVersion }) => (isChecked ? la.concat({ AccessionNo, DxrVersion }) : la), [])) : a;
        if (PrintCheck && !a.some((item) => item.AccessionNo === mNo && item.DxrVersion === mVer)) a.push({ AccessionNo: mNo, DxrVersion: mVer });
        return a;
      }, []);

      if (Reports.length === 0) {
        this.SET_SIDE_MESSAGE({ msg: "請至少選擇一筆報告", type: 2 });
        return;
      }
      // Reports = Reports.flat().map(({ AccessionNo, AccessionNo }) => ({ AccessionNo, DxrVersion }))
      try {
        // this.setLoadingStatus(true);
        this.SHOW_LOADING();
        const res = await getExamReport(Reports, this.ViewData.printType);
        if (res) {
          await this.fetchPatientHistory(res.ReportResults);
          let reportCount = 0;
          this.reportGroupList = res.ReportResults.reduce((acc, cur, aIdx) => {
            // const isSubReport = (cur.StructureContent1.includes('source') && cur.StructureContent1.includes('itemRow'));
            const type = cur.StructureContent1 && cur.StructureContent1.includes("source") && cur.StructureContent1.includes("itemRow") ? "sub" : "nor";
            if (aIdx === 0 || acc[reportCount].type != type) {
              acc.push({ type, reports: [], createTime: new Date().getTime() + Math.floor(Math.random() * 10) });
            }

            if (aIdx > 0 && acc[reportCount].type != type) {
              reportCount += 1;
            }
            acc[reportCount]["reports"].push(type === "sub" ? this.convert2SubReportFormat(cur) : cur);
            return acc;
          }, []);

          if (this.reportGroupList.length > 0) {
            // setTimeout(() => {
            //   this.HIDE_LOADING();
            //   this.isPrint = true;
            // }, 1000);
          } else {
            this.HIDE_LOADING();
            this.SET_SIDE_MESSAGE({ msg: "選取報告無內容", type: 2 });
          }
        } else {
          throw new Error("no data");
        }
      } catch (err) {
        // console.log(err);
        this.HIDE_LOADING();
        this.SET_SIDE_MESSAGE({ msg: "存取時發生錯誤! 請稍後再試.", type: 2 });
      }
    },
    startPrintWork() {
      this.HIDE_LOADING();
      this.isPrint = true;
    },
    convert2SubReportFormat({
      PatientName,
      Modality,
      PatientId,
      Sex,
      CheckDate,
      Birthday,
      Age,
      HospitalBedNo,
      StructureContent1,
      StructureData1,
      Subjective,
      Objective,
    }) {
      return {
        patient: {
          PatientName,
          Modality,
          PatientId,
          PatientSex: Sex,
          StudyDate: CheckDate,
          PatientBirthday: Birthday,
          PatientAge: Age,
          BedNo: HospitalBedNo,
          Subjective,
          Objective,
        },
        history: this.patientsHistoryList[PatientId],
        info: {
          CSTId: "",
          CSTName: "",
          img: "",
          cstHtml: StructureContent1,
          structureData: StructureData1,
          updateCount: 1,
        },
      };
    },
    //取得檢查項目列表
    async GetOptionsCheckItem() {
      // no use
      //this.checkItemSource = window.dtcOptionsCheckItem;
    },
    //取得病患來源列表
    async GetOptionsPatientSource() {
      if (this.patientSourceList.length === 0) {
        const {
          actual: { Items },
        } = await getOptionsPatientSource();
        this.SET_PATIENT_SOURCE_LIST(Items.map(({ No, Name }) => ({ text: Name, value: No })));
      }
      this.PatientSource = [{ value: null, text: "請選擇" }].concat(this.patientSourceList);
    },
    //取得打字員與報告醫師資料
    async GetOptionsDxreportPhysician() {
      if (this.getReportDrs.length === 0) {
        const {
          actual: { Items },
        } = await getOptionsReportDrSource();
        this.SET_REPORT_DR(Items);
      }
      this.DxreportPhysicianSource = [{ value: null, text: "請選擇" }, ...this.getReportDrs];
    },
    //取得主治醫師
    async GetOptionsIssuePhysicianSource() {
      let itemPack = null;
      let convertedCollections = [{ value: null, text: "請選擇" }];
      let subPath = "../Employee/SelectNoList?staffType=21&getAll=false";
      await new DataManager({
        url: configs.publicPath + subPath,
        adaptor: new WebApiAdaptor(),
        crossDomain: true,
      })
        .executeQuery(new Query())
        .then((r) => {
          itemPack = r.actual; //資料;
        });

      itemPack.Items.forEach((i) => {
        let collection = { value: i.No, text: i.Name };
        convertedCollections.push(collection);
      });

      this.IssuePhysicianSource = convertedCollections;
    },
    //取得開單科別
    async GetOptionsRequestingServiceSource() {
      if (this.serviceSourceList.length === 0) {
        const {
          actual: { Items },
        } = await getOptionsRequestingServiceSource();
        this.SET_SERVICE_SOURCE_LIST(Items.map(({ No, Name }) => ({ text: Name, value: No })));
      }
      this.RequestingServiceSource = [{ value: null, text: "請選擇" }].concat(this.serviceSourceList);
    },
    getBackData() {
      //若從FI0306-1回來 此時應該有資料才對...
      if (this.$route.params.FI0307TempData) {
        // console.log(this.$route.params.FI0307TempData);
        this.tableContent4QueryResult = this.$route.params.FI0307TempData;
        this.tableContent4QueryCount = this.$route.params.FI0307TempCount;
        this.tableContent4QueryCurrent = this.$route.params.FI0307TempCurrentPage;
        // this.$refs["twp1"].checkedItems = this.$route.params.FI0307TempCheckItems;
      }

      if (this.$route.params.FI0307TempQuery) {
        // console.log(this.$route.params.FI0307TempQuery);
        this.ViewData = this.$route.params.FI0307TempQuery;
        if (this.ViewData.Whitelist && this.ViewData.Whitelist.length > 0) this.Whitevalue = this.ViewData.Whitelist[0].split(",");
        if (this.ViewData.Blacklist && this.ViewData.Blacklist.length > 0) this.Blackvalue = this.ViewData.Blacklist[0].split(",");

        if (this.ViewData.ScheduleTimeStart) this.CheckDateRange[0] = this.ViewData.ScheduleTimeStart;
        if (this.ViewData.ScheduleTimeEnd) this.CheckDateRange[1] = this.ViewData.ScheduleTimeEnd;

        if (this.ViewData.ReportTimeStart) this.ReportDateRange[0] = this.ViewData.ReportTimeStart;
        if (this.ViewData.ReportTimeEnd) this.ReportDateRange[1] = this.ViewData.ReportTimeEnd;
      } else {
        this.clear();
      }
    },
    tbodyMouseEvent(e) {
      if (e.type === "mouseleave") {
        this.preReportTimer = setTimeout(() => {
          this.preReportId = null;
        }, 500);
      }
      if (e.timeStamp < this.mouseoverTimeStamp + 250 || e.type === "mouseleave") return;
      this.mouseoverTimeStamp = e.timeStamp; // 更新刷新時間

      if (this.preReportTimer) {
        clearTimeout(this.preReportTimer);
        this.preReportTimer = null;
      }

      const targetTr = e.target.closest("tr");
      const [accessionNo, version] = e.target
        .closest("tr")
        .querySelector("td button[btnval]")
        .getAttribute("btnval")
        .split(",");

      // const { AccessionNo, PatientId } = this.tabList[this.tabIndex].items[e.target.closest("tr").rowIndex - 1];
      if (!this.preReportContents.hasOwnProperty(accessionNo)) {
        this.preReportContents[accessionNo] = "loading";
        getReportWithVersion(accessionNo, version).then(({ ReportContent }) => {
          this.preReportId = "";
          this.preReportContents[accessionNo] = ReportContent || "no data";
          this.preReportId = accessionNo;
        });
      }
      this.preReportBase.x = e.clientX + 40;
      this.preReportBase.y = e.clientY + 10;
      this.preReportId = accessionNo;
    },

    confirmDialog() {
      this.diffInfo.showFullScreen = true;
      document.getElementById("WinDiff0307___BV_modal_content_").requestFullscreen();
    },

    async reportDiffEvent({ currentVersion, oldVersion, accessionNo }) {
      this.SHOW_LOADING();

      const findItem = (version) => {
        let _content = "";
        this.diffArray.some((item) => {
          if (item.version === version) {
            _content = item.content;
            return true;
          } else {
            return false;
          }
        });
        return _content;
      };

      try {
        let _currentContent = findItem(currentVersion);
        if (!_currentContent) {
          const { ReportContent: currentContent } = await getReportWithVersion(accessionNo, currentVersion);
          _currentContent = currentContent;
          this.diffArray.push({ version: currentVersion, content: currentContent });
        }

        let _oldContent = findItem(oldVersion);
        if (!_oldContent) {
          const { ReportContent: oldContent } = await getReportWithVersion(accessionNo, oldVersion);
          _oldContent = oldContent;
          this.diffArray.push({ version: oldVersion, content: oldContent });
        }

        this.diffInfo.old = {
          version: oldVersion,
          content: _oldContent,
        };
        this.diffInfo.current = {
          version: currentVersion,
          content: _currentContent,
        };
        this.diffInfo.dialog = true;
      } catch (error) {
        this.SET_SIDE_MESSAGE({ msg: error + "! 請稍候再試", type: 2 });
      } finally {
        this.HIDE_LOADING();
      }

      // console.log({ currentVersion, oldVersion, accessionNo });
    },
  },
  created() {
    if (localStorage["dtcOptionsCheckItem"]) {
      this.checkItemSource = JSON.parse(localStorage["dtcOptionsCheckItem"]);
    }
    //若從FI0306-1回來 此時應該有資料才對...
    this.getBackData();
    //檢查項目下拉選單
    // this.GetOptionsCheckItem();
    //病患來源下拉選單
    this.GetOptionsPatientSource();
    //住院(打字員)醫師列表
    this.GetOptionsDxreportPhysician();
    //審核醫師列表
    this.GetOptionsIssuePhysicianSource();
    //取得開單科別
    this.GetOptionsRequestingServiceSource();
  },
  mounted() {
    //若從FI0306-1回來 此時應該有資料才對...
    // this.getBackData();
    // if (this.$route.params.FI0307TempData) {
    //   console.log(this.$route.params.FI0307TempData);
    //   this.tableContent4QueryResult = this.$route.params.FI0307TempData;
    //   this.$refs["twp1"].checkedItems = this.$route.params.FI0307TempCheckItems;
    // }
    if (this.tableContent4QueryResult) this.$refs.twp1.Rows = this.tableContent4QueryResult;
    if (this.tableContent4QueryCount > 0) this.$refs.twp1.RowCount = this.tableContent4QueryCount;
    if (this.tableContent4QueryCurrent > 1) this.$refs.twp1.PagingCurrentPage = this.tableContent4QueryCurrent;
  },
  beforeDestroyed() {
    // this.$refs["twp1"].$el.querySelector("tbody").removeEventListener("mousemove", this.tbodyMouseEvent);
    // this.$refs["twp1"].$el.querySelector("tbody").removeEventListener("mouseleave", this.tbodyMouseEvent);
  },
  watch: {
    "diffInfo.dialog"(val) {
      if (!val) {
        this.diffInfo.showFullScreen = false;
        this.diffInfo.old.version = "";
        this.diffInfo.current.version = "";
        this.diffInfo.old.content = "";
        this.diffInfo.current.content = "";
      }
    },
  },
};
</script>

<style>
.fix-light .super-select-container {
  --boxHeight: 38px !important;
  --itemHeight: 38px !important;
  --boxWidth: 100% !important;
  flex: 1;
  border-radius: 5px;
}
#app.noPrint {
  margin-bottom: 50vh;
}
</style>

<style scoped>
.pageContent .tableContainer {
  min-height: calc(100vh - 320px);
}
.cardHeader {
  padding: 2px 1.25rem;
}
#ModalButton {
  width: 766px;
  background-color: #01579b;
}
#Button_color {
  background-color: #01579b;
}
</style>
<style lang="scss">
.form-list {
  width: 100%;
  height: 40px;
  border: 1px solid #d8dde2;
  border-radius: 5px;
  background-color: rgba(255, 255, 255, 0.7);
  label {
    margin: 0 12px !important;
  }
  input {
    height: 40px;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  .bv-no-focus-ring {
    flex: 1 0 0;
  }
}

.darkTheme label {
  color: rgb(73, 80, 87) !important;
}

@media (min-width: 992px) {
  #ModalSize .modal .modal-huge {
    max-width: 100% !important;
    width: 100% !important;
  }
}

#ModalSize .modal-dialog {
  max-width: 95%;
  width: 95%;
}

#ModalSize .modal .modal-huge {
  max-width: 95%;
  width: 95%;
}
</style>
<style>
#OpenDataPicker .e-input-group {
  padding-top: 3px !important;
  border-style: none !important;
  background-color: transparent !important;
  height: 36px !important;
}
#OpenDataPicker .e-input-group-icon {
  margin-top: -3px !important;
  border-right-width: 0 !important;
}
#CheckDataPicker .e-input-group {
  padding-top: 3px !important;
  border-style: none !important;
  background-color: transparent !important;
  height: 36px !important;
}
#CheckDataPicker .e-input-group-icon {
  margin-top: -3px !important;
  border-right-width: 0 !important;
}
</style>
<style lang="scss" scoped>
.grid {
  display: flex;
  grid-template-columns: 1fr 2fr;
  grid-template-rows: 1fr;
}
* {
  // border: 1px solid;
}
/deep/ .form-list {
  input[readonly] {
    background-color: #fff;
  }
}
</style>
