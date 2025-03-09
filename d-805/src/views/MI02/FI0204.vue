<template>
  <div
    class="pageContent zhTW"
    style="min-height:829px;"
  >
    <b-card
      no-body
      class="mx-1"
      bg-variant="transparent"
    >
      <b-card-header class="bg-primary text-white cardHeader ">
        <b-row no-gutters>
          <b-col
            cols="6"
            class="float-left text-left"
          >藥品耗材查詢作業</b-col>
        </b-row>
      </b-card-header>

      <b-card-text class="text-left py-1 border-left border-right border-bottom">
        <b-container
          fluid
          class="px-1"
        >
          <b-row no-gutters>
            <b-col
              cols="8"
              class="px-1"
            >
              <b-input-group
                id="ReportType"
                prepend="產製報表方式"
              >
                <b-form-radio-group
                  class="pt-2 pl-2 rounded-right"
                  style="border:1px solid #ced4da"
                  v-model="ReportType"
                  v-on:change="changeShow"
                >
                  <b-form-radio value="DayMonthReport">產製日月報表明細</b-form-radio>
                  <b-form-radio value="ScheduleLocationDetail">檢查室使用耗材明細</b-form-radio>
                  <b-form-radio value="MedicationNoUsedDetail">藥品耗材使用明細</b-form-radio>
                </b-form-radio-group>
              </b-input-group>
            </b-col>
            <b-col class="px-1 text-right">
              <!-- @click="clear" -->
              <b-button variant="success">
                <font-awesome-icon icon="eraser" />清除條件
              </b-button>&nbsp;
              <!-- @click="getQueryBtn" -->
              <b-button
                variant="primary"
                @click="SearchExcel"
              >
                <font-awesome-icon icon="search" />進行查詢
              </b-button>&nbsp;
            </b-col>
          </b-row>
          <b-row class="m-0 mt-1">
            <b-col
              sm="2"
              class="px-1"
              v-if="ReportType == 'DayMonthReport'"
            >
              <b-input-group prepend="年度">
                <b-select
                  v-model="Year"
                  :options="YearList"
                />
              </b-input-group>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
              v-if="ReportType == 'DayMonthReport'"
            >
              <b-input-group prepend="月份">
                <b-select
                  v-model="Month"
                  :options="MonthList"
                />
              </b-input-group>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
              v-if="ReportType == 'ScheduleLocationDetail'"
            >
              <b-input-group prepend="檢查室">
                <!-- v-model="checkQuery.Location" -->
                <b-select
                  :options="optionsLocationSource"
                  v-model="Location"
                />
              </b-input-group>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
              v-if="ReportType == 'MedicationNoUsedDetail'"
            >
              <b-input-group>
                <b-input-group-text
                  slot="prepend"
                  list="my-list-id"
                  class="field-Must"
                >藥品耗材</b-input-group-text>
                <!-- v-on:submit.prevent="Filter" -->
                <!--  v-on:blur="Filter" -->
                <b-form-input
                  v-on:keyup.enter="Fliter"
                  v-model.lazy="medicineList.selectedItem"
                  list="my-list-id"
                ></b-form-input>
                <!--  :disabled="medicineDisable" -->
                <datalist id="my-list-id">
                  <option
                    v-for="(optionsItem, idx) in medicineList"
                    :key="idx"
                  >{{ optionsItem.No }}--{{ optionsItem.Name }}--{{ optionsItem.SubName }}</option>
                </datalist>
              </b-input-group>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
              v-if="ReportType == 'ScheduleLocationDetail' || ReportType == 'MedicationNoUsedDetail'"
            >
              <b-input-group
                prepend="日期區間"
                style="width:340px"
              >
                <div
                  id="CheckDataPicker"
                  class="form-control"
                  style="padding: 0px 0px ;"
                >
                  <ejs-daterangepicker
                    :strictMode="true"
                    v-model="CheckDateRange"
                  ></ejs-daterangepicker>
                </div>
              </b-input-group>
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
            id="DayMonthReport"
            class="mr-1 rounded"
            style="border:1px solid #ced4da; min-height:690px;"
            v-show="ReportType == 'DayMonthReport'"
          >
            <twp
              ref="twp1"
              v-bind:FieldConfig="DayMonthReport"
              :RowData="DayMonthReportContent"
              :NoPaging="true"
            ></twp>
          </div>
          <div
            id="ScheduleLocationDetail"
            class="mr-1 rounded"
            style="border:1px solid #ced4da; min-height:690px;"
            v-show="ReportType == 'ScheduleLocationDetail'"
          >
            <twp
              ref="twp2"
              v-bind:FieldConfig="ScheduleLocationDetail"
              :RowData="ScheduleLocationDetailContent"
              :NoPaging="true"
            ></twp>
          </div>
          <div
            id="MedicationNoUsedDetail"
            class="mr-1 rounded"
            style="border:1px solid #ced4da; min-height:690px;"
            v-show="ReportType == 'MedicationNoUsedDetail'"
          >
            <twp
              ref="twp3"
              v-bind:FieldConfig="ScheduleLocationDetail"
              :RowData="MedicationNoUsedDetailContent"
              :NoPaging="true"
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
// var moment = require("moment");
import {
  DataManager,
  WebApiAdaptor,
  Predicate,
  Query
} from "@syncfusion/ej2-data";
import * as configs from "@/config";
import { DateRangePickerPlugin } from "@syncfusion/ej2-vue-calendars";
// import Swal from "sweetalert2";

// 載入模組:KeyPressIdentifier
// import KeyPressIdentifier from "@/assets/KeyPressIdentifier";

//for booking (must import and css have some trobule...)
// import "muse-ui/dist/muse-ui.css";

Vue.use(AppBar);
Vue.use(Dialog);
Vue.use(DateRangePickerPlugin);

export default {
  name: "home",
  components: { twp },
  data () {
    return {
      //日月報表資料
      DayMonthReport: [
        {
          key: "MedicationNo",
          label: "代碼",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "MedicationName",
          label: "藥品名稱",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "SubName",
          label: "子類別",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "sex",
          label: "註記",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "Amount",
          label: "總計",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "Day1",
          label: "1",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "Day2",
          label: "2",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "Day3",
          label: "3",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "Day4",
          label: "4",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "Day5",
          label: "5",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "Day6",
          label: "6",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "Day7",
          label: "7",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "Day8",
          label: "8",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "Day9",
          label: "9",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "Day10",
          label: "10",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "Day11",
          label: "11",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "Day12",
          label: "12",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "Day13",
          label: "13",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "Day14",
          label: "14",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "Day15",
          label: "15",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "Day16",
          label: "16",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "Day17",
          label: "17",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "Day18",
          label: "18",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "Day19",
          label: "19",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "Day20",
          label: "20",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "Day21",
          label: "21",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "Day22",
          label: "22",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "Day23",
          label: "23",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "Day24",
          label: "24",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "Day25",
          label: "25",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "Day26",
          label: "26",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "Day27",
          label: "27",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "Day28",
          label: "28",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "Day29",
          label: "29",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "Day30",
          label: "30",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "Day31",
          label: "31",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        }
      ],
      DayMonthReportContent: null,
      //檢查室使用耗材明細 與藥品使用明細共用同一份報表
      ScheduleLocationDetail: [
        {
          key: "ScheduleCompleteTime",
          label: "檢查時間",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "PatientSourceTypeNmae",
          label: "來源",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "ExamNo",
          label: "Exam No",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "PatientName",
          label: "姓名",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "AccessionNo",
          label: "工作單號",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "ProcedureCode",
          label: "檢查代碼",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "ProcedureName",
          label: "檢查項目",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "PatientId",
          label: "病歷號",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "Sex",
          label: "註記",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "MedicationNo",
          label: "耗材代碼",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "MedicationName",
          label: "名稱",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "SubName",
          label: "子代碼",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "Quantity",
          label: "數量",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },

        {
          key: "ScheduleLocationName",
          label: "檢查室",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        }
      ],
      ScheduleLocationDetailContent: null,
      MedicationNoUsedDetailContent: null,
      //報告樣板
      ReportType: "DayMonthReport",
      //檢查室選單
      optionsLocationSource: [],
      Location: null,
      //年下拉選單
      YearList: [],
      Year: "",
      //月下拉選單
      MonthList: [],
      Month: "",
      //藥品下拉選單
      medicineList: [],
      ObjApp: null,
      optionsCheckItem: [],
      //日期區間
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
    ...mapGetters(["getThemeColors"])
  }
  ,
  methods: {
    //查詢列表顯示
    async SearchExcel () {
      //先判斷要輸出哪一種格式，並打入相對應的API
      if (this.ReportType == "DayMonthReport") {
        let subPath =
          "../examMedication/DayMonthReport" +
          "?Year=" +
          this.Year +
          "&Month=" +
          this.Month;

        await new DataManager({
          url: configs.publicPath + subPath,
          adaptor: new WebApiAdaptor(),
          crossDomain: true
        })
          .executeQuery(new Query())
          .then(r => {
            console.log(r.actual);
            this.DayMonthReportContent = r.actual.Items;
          });
      } else if (this.ReportType == "ScheduleLocationDetail") {
        let subPath =
          "../examMedication/ScheduleLocationDetail" +
          "?startDate=" +
          this.CheckDateRange[0].toJSON() +
          "&endDate=" +
          this.CheckDateRange[1].toJSON() +
          "&ScheduleLocaion=" +
          this.Location;

        await new DataManager({
          url: configs.publicPath + subPath,
          adaptor: new WebApiAdaptor(),
          crossDomain: true
        })
          .executeQuery(new Query())
          .then(r => {
            console.log(r.actual);
            this.ScheduleLocationDetailContent = r.actual.Items;
          });
      } else if (this.ReportType == "MedicationNoUsedDetail") {
        alert(this.Location);
        alert(this.CheckDateRange);

        let subPath =
          "../examMedication/ScheduleLocationDetail" +
          "?startDate=" +
          this.CheckDateRange[0].toJSON() +
          "&endDate=" +
          this.CheckDateRange[1].toJSON() +
          "&ScheduleLocaion=" +
          this.Location;

        await new DataManager({
          url: configs.publicPath + subPath,
          adaptor: new WebApiAdaptor(),
          crossDomain: true
        })
          .executeQuery(new Query())
          .then(r => {
            console.log(r.actual);
            this.MedicationNoUsedDetailContent = r.actual.Items;
          });
      }
    },
    //更改Radio時 同步變動輸入的資料以及Table
    changeShow (x) {
      this.$nextTick(() => {
        this.ReportType = x;

        this.$refs["twp1"].OnForceRefresh();
        this.$refs["twp2"].OnForceRefresh();
        this.$refs["twp3"].OnForceRefresh();
      });
    },
    Fliter () {
      // let tempList = [];
      // let queryStr = this.medicineList.selectedItem;
      // let strlength = queryStr.length;

      // this.TempoptionsItems.forEach(x => {
      //   let str = "";
      //   str = str + x.No + "--" + x.Name + "--" + x.SubName;
      //   if (str.substring(0, strlength) == queryStr) {
      //     tempList.push(x);
      //   }
      // });

      // setTimeout(x => {
      //   this.$nextTick(() => {
      //     this.medicineList.optionsItems = tempList;
      //     if (queryStr == "") {
      //       this.medicineList.optionsItems = this.TempoptionsItems;
      //     }
      //   });
      // }, 500);
      this.$nextTick(() => {
        this.medicineList = this.medicineList.selectedItem
          ? this.TempoptionsItems.filter(
            ({ No, Name, SubName }) =>
              `${No}--${Name}--${SubName}`.indexOf(
                this.medicineList.selectedItem
              ) === 0
          )
          : this.TempoptionsItems;
      });
      //需特別判斷 無輸入資料時

      // console.log(this.medicineList.optionsItems[0]);
      // this.medicineList.optionsItems.forEach(x => {
      //   // if (x.value) {
      //   console.log(x.No);
      //   // }

      //   // if (res.substring(0, strlength) == queryStr) {
      //   //   tempList.push(x);
      //   // }
      //   // console.log(res.substring(0, 4));
      // });
      // console.log(tempList);
      // this.medicineList.optionsItems = tempList;
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
    async GetOptionsCheckItem () {
      console.log(this.$logs());
      //
      let itemPack = null;
      let convertedCollections = [{ value: null, text: "請選擇" }];
      //
      let subPath = "../checkItem/SelectNoList";
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
      this.optionsCheckItem = convertedCollections;
    },
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
    //取得藥品下拉選單
    async GetMedicationList () {
      let convertedCollections = [{ value: null, text: "請選擇" }];
      //打API並塞入所有藥品
      let subPath = "../medication/ExamMedicationList";
      await new DataManager({
        url: configs.publicPath + subPath,
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      })
        .executeQuery(new Query().sortBy("Id"))
        .then(r => {
          let data = r.result; //資料;

          data.forEach(i => {
            let collection = {
              No: i.No,
              Name: i.Name,
              SubName: i.SubName
            };
            convertedCollections.push(collection);
          });
          this.TempoptionsItems = convertedCollections;
          this.medicineList = convertedCollections;
        });
    }
  },
  created () {
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

    //病患來源下拉選單
    this.GetOptionsPatientSource();
    //檢查室下拉選單
    this.GetLocationSource();
    //取得藥品資料
    this.GetMedicationList();
    //病患狀態下拉選單
    //focus到病歷號上
    //新增年度下拉選單
    let year = new Date().getFullYear();
    for (let i = -2; i <= 2; i++) {
      this.YearList.push(year + i);
    }
    //新增月份下拉選單

    for (let i = 1; i <= 12; i++) {
      this.MonthList.push(i);
    }

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
#ReportType .input-group-text {
  width: 226px;
}
</style>
