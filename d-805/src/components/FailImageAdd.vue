<template>
  <div
    class="pageContent zhTW fix-light"
    style="min-height:829px; margin-top: 0;"
  >
    <b-card
      no-body
      class="mx-1 border"
      bg-variant="transparent"
    >
      <b-card-header class="bg-primary text-white cardHeader">
        <b-row no-gutters>
          <b-col
            cols="6"
            class="float-left text-left"
          >不良片查詢</b-col>
        </b-row>
      </b-card-header>
      <b-card-text class="text-left py-1">
        <b-container
          fluid
          class="px-1"
        >
          <b-row no-gutters>
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="申請單號">
                <b-input v-model="checkQuery.AccessionNo" />
              </b-input-group>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="病歷號">
                <b-input
                  ref="AccessionNo"
                  v-model="checkQuery.PatientId"
                />
              </b-input-group>
            </b-col>
            <b-col
              sm="3"
              class="px-1"
            >
              <b-input-group prepend="身分證號">
                <b-input v-model="checkQuery.OtherPatientId" />
              </b-input-group>
            </b-col>
            <!-- 這datePicker先暫時這樣處理吧 雖然坑爹的醜 ejs跟bootstrap不太相容這樣...要額外包 -->
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="開單起訖">
                <div
                  id="OpenDataPicker"
                  class="form-control"
                  style="padding: 0px 0px ;"
                >
                  <ejs-daterangepicker v-model="OpenDateRange"></ejs-daterangepicker>
                </div>
              </b-input-group>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="檢查起訖">
                <div
                  id="CheckDataPicker"
                  class="form-control"
                  style="padding: 0px 0px ;"
                >
                  <ejs-daterangepicker v-model="CheckDateRange"></ejs-daterangepicker>
                </div>
              </b-input-group>
            </b-col>
          </b-row>
          <b-row
            no-gutters
            class="mt-1"
          >
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="檢查項目">
                <v-super-select
                  noneFoundText="無此筆資料"
                  placeholder="請選擇"
                  v-model="checkQuery.ProcedureCode"
                  :items="optionsCheckItem"
                  style="z-index:1"
                  class="bg-white"
                />
              </b-input-group>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="病患來源">
                <b-select
                  v-model="checkQuery.PatientSourceTypeCode"
                  :options="optionsPatientSource"
                />
              </b-input-group>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="檢查室">
                <b-select
                  v-model="checkQuery.Location"
                  :options="optionsLocationSource"
                />
              </b-input-group>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="報到狀態">
                <b-select
                  v-model="checkQuery.status"
                  :options="CheckinStatusSource"
                />
              </b-input-group>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="急作">
                <b-form-radio-group
                  name="eId"
                  class="pt-2 pl-2 rounded-right bg-white text-black"
                  style="border:1px solid #ced4da"
                  v-model="checkQuery.EmgFlag"
                >
                  <b-form-radio value="Y">是</b-form-radio>
                  <b-form-radio value="N">否</b-form-radio>
                </b-form-radio-group>
              </b-input-group>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="登打完成">
                <b-form-radio-group
                  name="finish"
                  class="pt-2 pl-2 rounded-right bg-white text-black"
                  style="border:1px solid #ced4da"
                  v-model="checkQuery.finish"
                >
                  <b-form-radio value="Y">是</b-form-radio>
                  <b-form-radio value="N">否</b-form-radio>
                </b-form-radio-group>
              </b-input-group>
            </b-col>
          </b-row>
          <b-row
            no-gutters
            class="mt-1"
          >
            <b-col class="px-1 text-right">
              <b-button
                variant="success"
                @click="clear"
              >
                <font-awesome-icon icon="eraser" />清除條件
              </b-button>&nbsp;
              <b-button
                variant="primary"
                @click="getQueryBtn"
              >
                <font-awesome-icon icon="search" />進行查詢
              </b-button>&nbsp;
            </b-col>
          </b-row>
        </b-container>
      </b-card-text>
    </b-card>

    <b-container
      fluid
      class="mt-1 px-1"
    >
      <b-row no-gutters>
        <b-col>
          <div
            id="block4QueryResult"
            class="mr-1 rounded"
            style="border:1px solid #ced4da; min-height:690px;"
          >
            <!--  -->
            <twp
              ref="twp1"
              v-bind:FieldConfig="tableConfig4QueryResult"
              :DataFetch="getFliterData"
              :isBackEndPagination="true"
              :onRowdbClick="medicineinput"
              v-bind:OpButton1Func="medicineinput"
              OpButton1Text="編輯"
              :EnDBClick="true"
            ></twp>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import twp from "@/components/TWPv5_1";
import { Dialog, AppBar } from "muse-ui";
import VSuperSelect from "v-super-select";
var moment = require("moment");
import {
  DataManager,
  WebApiAdaptor,
  Predicate,
  Query
} from "@syncfusion/ej2-data";
import { dateFormatMixin } from "@/SupportLib_J.js";
import * as configs from "@/config";
import { DateRangePickerPlugin } from "@syncfusion/ej2-vue-calendars";
import Swal from "sweetalert2";
import bookingView from "@/components/Booking/Index";

// 載入模組:KeyPressIdentifier
import KeyPressIdentifier from "@/assets/KeyPressIdentifier";

//for booking (must import and css have some trobule...)
// import "muse-ui/dist/muse-ui.css";

Vue.use(AppBar);
Vue.use(Dialog);
Vue.use(DateRangePickerPlugin);

export default {
  name: "home",
  components: { twp, bookingView, VSuperSelect },
  mixins: [dateFormatMixin],
  data () {
    return {
      //for booking
      selectCheckItems: [],
      dialogOpened: false,
      viewDate: new Date(),
      patientInfo: {
        orderNo: "",
        name: "",
        id: "",
        gender: "",
        hrNum: "",
        birthDay: null
      },
      checkItemNos: "",
      tableConfig4QueryResult: [
        {
          key: "EmgFlagName",
          label: "類別",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "IsMedicationActionName",
          label: "登打狀態",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "MedicationEmployeeName",
          label: "藥品耗材登打人",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },

        {
          key: "StatusName",
          label: "報到狀態",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "PatientSourceTypeName",
          label: "病患來源",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "AccessionNo",
          label: "申請單號",
          sortable: false,
          thClass: "text-nowrap",
          tdClass: "no-wrap font-weight-bold"
        },

        {
          key: "PatientId",
          label: "病歷號",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "OtherPatientId",
          label: "身分證字號",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "ProcedureName",
          label: "檢查項目",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap text-left"
        },
        {
          key: "ProcedureCode",
          label: "檢查碼",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap text-left"
        },
        {
          key: "PatientName",
          label: "姓名",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "PatientSex",
          label: "性別",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "OrderDate",
          label: "開單日期",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "ScheduleTime",
          label: "檢查日期",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        }
      ],
      MedicationContent: [],
      //檢查項目選單
      optionsCheckItem: [],
      //病患來源選單
      optionsPatientSource: [],
      //檢查室選單
      optionsLocationSource: [],
      //報到狀態選單
      CheckinStatusSource: [],
      TotalStatusSource: [],
      ObjApp: null,
      firstCheckedItem: null,
      //報到人數
      checkinCount: 0,
      UncheckinCount: 1,
      //User點擊按鈕紀錄(用以判斷API的條件)
      BtnNo: 0,
      //for query
      checkQuery: {
        //申請單號
        AccessionNo: "",
        //病歷號
        PatientId: "",
        //身分證字號
        OtherPatientId: "",
        //開單日期From
        StartDT: "",
        //開單日期To
        EndDT: "",
        //檢查項目
        ProcedureCode: null,
        //病患來源
        PatientSourceTypeCode: null,
        //急作
        eId: null,
        //報到狀態
        status: null,
        EmgFlag: null,
        //檢查醫令
        ENCOUNTER_NO: "",
        //檢查室
        Location: null,
        PatientStatus: null,
        finish: null
      },
      //開單起訖日
      OpenDateRange: ["", ""],
      //檢查起訖日
      CheckDateRange: ["", ""],
      //按鈕顯示
      checkinBtn: false,
      CancelBtn: false,
      changeBtn: false,
      //選擇檢查室
      choice_room: [],
      //Modal上的檢查室資料
      room_list: [],
      //病患檢查項目
      PatientcheckItem_List: [],
      //病患今日檢查項目類型:0.無檢查1.今日有檢查3.有檢查不再今日
      checkTypeList: "A",
      //HostoryModel
      HistoryModel: {
        //預計檢查時間
        ScheduleTime: "",
        //櫃台報到時間
        CounterRegister: "",
        //開始檢查時間
        ProcedureStart: "",
        //檢查完畢時間
        ProcedureCompleted: "",
        //取消檢查時間及原因
        CancelDescription: "",
        //取消檢查時間
        CancelTime: ""
      }
    };
  },
  computed: {
    ...mapGetters(["getThemeColors"]),
  },
  methods: {
    //取得計價方式
    async GetPriceTypeList () {
      let convertedCollections = [];
      //打API並塞入所有藥品
      let subPath = "../generalData/SelectNoList?groupNo=PriceType";
      await new DataManager({
        url: configs.publicPath + subPath,
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      })
        .executeQuery(new Query())
        .then(r => {
          let data = r.result; //資料;

          data.forEach(i => {
            let collection = {
              value: i.No,
              text: i.Name
            };
            convertedCollections.push(collection);
          });

          window.medicineList_optionsType = convertedCollections;
        });
    },
    //新增藥品數量
    addCount (x) {
      x.Quantity = x.Quantity + 1;
    },
    //減少藥品數量
    cutCount (x) {
      if (x.Quantity <= 0) {
        return;
      }
      x.Quantity = x.Quantity - 1;
    },
    //呼叫新增藥品
    AddMedication () {
      //新增一組欄位登打後 按下儲存寫入
      this.$refs["medicineMaintain"].show();
    },
    //編輯藥品
    EditMedication (x) {
      //鎖定某些欄位後打開
      this.$refs["medicineMaintain"].show();
    },
    //藥品登打
    medicineinput (x) {
      this.$router.replace({
        name: "FI0203-1",
        params: {
          patientData: x,
          backObj: this.backObj
        }
      });
    },
    HKWatch (event) {
      if (event.key === "Enter") {
        this.getQueryBtn();
      }
    },
    clear () {
      //清除輸入的條件
      this.ObjApp.WaitingShow();
      //申請單號
      (this.checkQuery.AccessionNo = ""),
        // 檢查室
        (this.checkQuery.Location = null),
        //病歷號
        (this.checkQuery.PatientId = ""),
        //身分證字號
        (this.checkQuery.OtherPatientId = ""),
        //開單起訖
        (this.OpenDateRange = ["", ""]),
        //檢查起訖
        (this.CheckDateRange = ["", ""]),
        //檢查項目
        (this.checkQuery.ProcedureCode = null),
        //病患來源
        (this.checkQuery.PatientSourceTypeCode = null),
        //急作
        (this.checkQuery.EmgFlag = null),
        //是否報到
        (this.checkQuery.status = null);
      this.checkQuery.finish = null;
      this.BtnNo = 0;
      this.$refs["twp1"].OnForceRefresh();
      setTimeout(() => {
        const q = ".super-select-input input[type=text]";
        document.querySelector(q).value = "";
      }, 300);
      this.ObjApp.WaitingHide();
    },

    //按鈕查詢-多功能Method 由按鈕決定今天要帶入甚麼參數給TWP3查詢
    QueryMethod () {
      //預設一進來時 帶入左方畫面資料的條件:已報到及未報到
      if (this.BtnNo === 0) {
        return new Query();
      }
      //按下查詢按鈕(進行查詢)):1
      else if (this.BtnNo === 1) {
        return this.getQuery();
      }
    },

    getQuery: function () {
      let query = new Query();
      //判斷申請單號
      if (this.checkQuery.AccessionNo != "")
        query = query.where(
          "AccessionNo",
          "contains",
          this.checkQuery.AccessionNo.trim(),
          true
        );
      //判斷病例編號
      if (this.checkQuery.PatientId != "")
        query = query.where("PatientId", "contains", this.checkQuery.PatientId);
      //判斷身分證字號
      if (
        this.checkQuery.OtherPatientId != "" ||
        this.checkQuery.OtherPatientId != "Error:沒有插卡！"
      )
        query = query.where(
          "OtherPatientId",
          "contains",
          this.checkQuery.OtherPatientId.trim(),
          true
        );

      //判斷檢查項目
      // console.log(this.checkQuery.ProcedureCode);
      if (this.checkQuery.ProcedureCode) {
        if (this.checkQuery.ProcedureCode != "") {
          query = query.where(
            "ProcedureCode",
            "equal",
            this.checkQuery.ProcedureCode.value
          );
        }
      }
      //判斷病患來源
      if (this.checkQuery.PatientSourceTypeCode) {
        if (this.checkQuery.PatientSourceTypeCode != "") {
          query = query.where(
            "PatientSourceTypeCode",
            "equal",
            this.checkQuery.PatientSourceTypeCode
          );
        }
      }
      //判斷檢查室
      if (this.checkQuery.Location) {
        // console.log(this.checkQuery.Location);
        if (this.checkQuery.Location != "") {
          query = query.where(
            "ScheduleLocation",
            "equal",
            this.checkQuery.Location
          );
        }
      }
      //是否急作

      if (this.$Exists(this.checkQuery.EmgFlag)) {
        if (this.checkQuery.EmgFlag != null) {
          query = query.where("EmgFlag", "equal", this.checkQuery.EmgFlag);
        }
      }
      //報到狀態

      // if (this.$Exists(this.checkQuery.status)) {
        
      //   if (this.checkQuery.status != null) {
      //     query = query.where("Status", "equal", this.checkQuery.status);
      //   }
      // }
      return query;
    },

    async getQueryBtn () {
      //將按鈕狀態改為有條件查詢(輸入的資料查詢)
      this.ObjApp.WaitingShow();
      this.BtnNo = 1;
      this.$refs["twp1"].OnCancelAllSelects();
      this.$refs["twp1"].OnForceRefresh();
      this.ObjApp.WaitingHide();
    },

    //給API CALL的
    //pageIndex,pageSize
    //報到作業
    async getFliterData (test, pageIndex, perpage) {
      this.ObjApp.WaitingShow();
      if (!pageIndex) {
        pageIndex = 0;
        perpage = 10;
      }

      //串DataManager 打API出去 回傳資料再塞回畫面
      //開單時間的URL
      let openurl = "";

      if (this.OpenDateRange != null) {
        if (this.OpenDateRange[0] != "" && this.OpenDateRange.length == 2) {
          openurl =
            "&orderDateStart=" +
            this.OpenDateRange[0].toJSON() +
            "&orderDateEnd=" +
            this.OpenDateRange[1].toJSON();
        }
      }
      //檢查時間的URL
      let schedulgurl = "";
      if (this.CheckDateRange != null) {
        if (this.CheckDateRange[0] != "" && this.CheckDateRange.length == 2) {
          schedulgurl =
            "&scheduleTimeStart=" +
            this.CheckDateRange[0].toJSON() +
            "&scheduleTimeEnd=" +
            this.CheckDateRange[1].toJSON();
        }
      }
      //若按下今日排程 走此條件
      let Todayurl = "";
      if (this.BtnNo === 2) {
        Todayurl =
          "&scheduleTimeStart=" +
          new Date().toJSON() +
          "&scheduleTimeEnd=" +
          new Date().toJSON();
      }
      //登打是否完成
      let finish = "";
      if (this.checkQuery.finish == "Y") {
        finish = "&isMedicationAction=true";
      } else if (this.checkQuery.finish == "N") {
        finish = "&isMedicationAction=false";
      }
      let data = null;
      const status = this.checkQuery.status || '56,31,36,61,63,65,71,51,91,21';
      await new DataManager({
        //status 11 未排檢、12已排檢、21已報到
        url:
          configs.publicPath +
          "../exam/List" +
          "?status=" +
          status +
          //串開單
          openurl +
          schedulgurl +
          Todayurl +
          finish,
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      })
        //this.QueryMethod()
        .executeQuery(
          this.QueryMethod()
            .sortBy("ScheduleTime")
            .page(pageIndex, perpage)
        )
        .then(r => {
          data = r.actual;
          //資料流進來後 篩選資料 ，如為當天之病人排檢的病人(當天掛號當天檢查)，要有顏色提示
          data.Items.forEach(x => {
            //轉換資料顯示

            if (x.EmgFlag === "Y") x.EmgFlagName = "急作";
            else x.EmgFlagName = "一般";
            //先轉成YYYY/MM/DD格式

            x.ScheduleTime = x.ScheduleTime
              ? moment(x.ScheduleTime).format("YYYY/MM/DD")
              : "";
            x.OrderDate = x.OrderDate
              ? moment(x.OrderDate).format("YYYY/MM/DD")
              : "";
            //如為當天之病人排檢的病人(當天掛號當天檢查)，要有顏色提示。
            if (
              x.ScheduleTime === moment(new Date()).format("YYYY/MM/DD") &&
              (x.Status == "11" || x.Status == "12")
            ) {
              x._rowVariant = "danger";
            }
            if (x.IsMedicationAction) {
              // x._rowVariant = "info";
              x.IsMedicationActionName = "已完成";
            } else {
              x.IsMedicationActionName = "未完成";
            }
          });
        });

      //取回的資料
      this.ObjApp.WaitingHide();
      return data;
    },

    //取得檢查室相關資料
    getRoomAPI () {
      let i = 0;
      this.choice_room.forEach(async x => {
        let ProcedureCode = x.ProcedureCode;
        let itemPack = null;
        let convertedCollections = [{ value: null, text: "請選擇" }];
        //
        let subPath = "../checkItem/NonScheduleRoom" + "?no=" + ProcedureCode;
        //
        await new DataManager({
          url: configs.publicPath + subPath,
          adaptor: new WebApiAdaptor(),
          crossDomain: true
        })
          .executeQuery(new Query())
          .then(r => {
            itemPack = r.actual; //資料;
          });

        itemPack.Items.forEach(i => {
          let collection = { value: i.No, text: i.Name };
          convertedCollections.push(collection);
        });
        x.rommselect = "";
        x.roomList = convertedCollections;
        this.$set(this.choice_room, i, x);
        ++i;
      });
      console.log(this.choice_room);
    },
    //取得檢查項目列表
    async GetOptionsCheckItem () { },
    //取得病患來源列表
    async GetOptionsPatientSource () {
      console.log(this.$logs());
      //
      let itemPack = null;
      let convertedCollections = [{ value: null, text: "請選擇" }];
      //
      let subPath = "../GeneralData/SelectNoList?groupNo=PatientSource";
      //
      await new DataManager({
        url: configs.publicPath + subPath,
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      })
        .executeQuery(new Query())
        .then(r => {
          itemPack = r.actual; //資料;
        });

      itemPack.Items.forEach(i => {
        let collection = { value: i.No, text: i.Name };
        convertedCollections.push(collection);
      });
      this.optionsPatientSource = convertedCollections;
    },
    //檢查室清單
    async GetLocationSource () {
      console.log(this.$logs());
      //
      let itemPack = null;
      let convertedCollections = [{ value: null, text: "請選擇" }];
      //
      let subPath = "../Room/SelectNoList";
      //
      await new DataManager({
        url: configs.publicPath + subPath,
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      })
        .executeQuery(new Query())
        .then(r => {
          itemPack = r.actual; //資料;
        });

      itemPack.Items.forEach(i => {
        let collection = { value: i.No, text: i.Name };
        convertedCollections.push(collection);
      });
      this.optionsLocationSource = convertedCollections;
    },
    //取得報到狀態的清單
    async GetStatusSource () {
      console.log(this.$logs());
      //
      let itemPack = null;
      let convertedCollections = [{ value: null, text: "請選擇" }];
      //
      let subPath = "../GeneralData/SelectNoList" + "?groupNo=ExamState";
      //
      await new DataManager({
        url: configs.publicPath + subPath,
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      })
        .executeQuery(new Query())
        .then(r => {
          itemPack = r.actual; //資料;
        });

      itemPack.Items.forEach(i => {
        let collection = { value: i.No, text: i.Name };
        convertedCollections.push(collection);
      });

      let _tempList = [];
      convertedCollections.forEach(x => {
        _tempList.push(x);
      });

      this.CheckinStatusSource = this.$DeepCopy(_tempList);
      //綜合查詢的Source
      this.TotalStatusSource = this.$DeepCopy(convertedCollections);
    },
    initWebSocket () {
      let _this = this;
      if (this.checkQuery.OtherPatientId != "") return;
      let connection;
      connection = new WebSocket("ws://localhost:10008/Read");
      connection.onopen = function () {
        connection.send("checkNhiCard");
      };
      connection.onerror = function (e) {
        _this.checkQuery.OtherPatientId = "";
      };
      connection.onmessage = function (e) {
        if (e.data.indexOf("Error:") < 0) {
          let pic = e.data.substr(32, 10);
          //因websocket屬於Jquery寫法，導致裡面無法使用VUE的data 故先建立THIS的變數 再去更改即可解決
          _this.checkQuery.OtherPatientId = pic;
          _this.getQueryBtn();
        } else {
          _this.checkQuery.OtherPatientId = "";
          if (
            _this.checkQuery.OtherPatientId !== e.data &&
            e.data === "Error:此晶片卡非健保卡！"
          )
            _this.checkQuery.OtherPatientId = e.data;
        }
      };
    }
  },
  beforeRouteLeave (to, from, next) {
    let obj = {
      OpenDateRange: this.OpenDateRange,
      //檢查起訖日
      CheckDateRange: this.CheckDateRange,
      checkQuery: this.checkQuery
    };
    obj = JSON.stringify(obj);
    sessionStorage["FI0203"] = obj;

    next();
  },
  beforeRouteEnter (to, from, next) {
    const str = sessionStorage["FI0203"];
    const obj = str ? JSON.parse(str) : null;
    next(vm => {
      if (!obj) {
        let today = new Date();
        vm.CheckDateRange = [
          new Date(today.setHours(0, 0, 0, 0)),
          new Date(today.setHours(23, 59, 59, 999))
        ];
        setTimeout(() => vm.getQueryBtn(), 400);
        return;
      }
      vm.OpenDateRange = [...obj.OpenDateRange];
      vm.CheckDateRange = [...obj.CheckDateRange];
      vm.checkQuery = Object.assign({}, obj.checkQuery);
      setTimeout(() => vm.getQueryBtn(), 400);
    });
  },
  created () {
    if (localStorage["dtcOptionsCheckItem"]) {
      this.optionsCheckItem = JSON.parse(localStorage["dtcOptionsCheckItem"]);
    }
    //取得打API時 需 Hold住畫面的Mehtod
    let methodName = "created";
    console.log(this.$logs(null, methodName));

    // 取得 App.vue 參照
    let obj = this.$GetApp(this);
    if (obj) {
      this.ObjApp = obj[0];
      this.VueNestLevel = obj[1];
    } else {
      console.log(this.$logs("Fail to get App.vue ref.", methodName));
    }
    // 宣告監聽器:攔截 KeyPress
    window.addEventListener("keydown", this.HKWatch);
    //
    //檢查項目下拉選單
    this.GetOptionsCheckItem(); //checkItem.Options()
    //病患來源下拉選單
    this.GetOptionsPatientSource();
    //檢查室下拉選單
    this.GetLocationSource();
    //報到狀態下拉選單
    this.GetStatusSource();
    //取得計價方式 (給FI0203-1用)
    this.GetPriceTypeList();
    //病患狀態下拉選單
    //focus到病歷號上
    setTimeout(x => {
      this.$nextTick(() => this.$refs["AccessionNo"].focus());
    }, 500);
    // 畫面自動呼叫讀卡機程式 抓取讀卡機資料TO-DO
    // setInterval(() => {
    //   this.initWebSocket();
    // }, 5000);
    // let _this = this;
    // window.axios
    //   .get(configs.publicPath + "../checkItem/SelectList")
    //   .then(e => {
    //     _this.checkItems = e.data.Items;
    //     _this.selectCheckItems.push(_this.checkItems[0].Id);
    //   });
  },
  destroyed () {
    console.log(`${this.$logs()}`);
    // 解除監聽器:攔截 KeyPress
    window.removeEventListener("keydown", this.HKWatch);
    // this.websock.close(); //离开路由之后断开websocket连接
  },
  mounted () {
    console.log(this.$logs());
  }
};
</script>

<style scoped>
.cardHeader {
  padding: 2px 1.25rem;
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
</style
>-

<style>
.fix-light .super-select-container {
  --boxHeight: 38px !important;
  --itemHeight: 38px !important;
  --boxWidth: 100% !important;
  flex: 1;
  border-radius: 5px;
}
</style>
