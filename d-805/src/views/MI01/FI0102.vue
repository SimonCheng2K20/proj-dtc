<template>
  <div
    class="pageContent zhTW fix-light"
    style="min-height:829px;"
  >
    <b-tabs changed>
      <b-tab
        title="健診報到作業"
        active
      >
        <b-card
          no-body
          class="mx-1"
        >
          <b-card-header class="bg-primary text-white cardHeader">
            <b-row no-gutters>
              <b-col
                cols="6"
                class="float-left text-left"
              >櫃台報到．查詢作業</b-col>
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
                    <b-input
                      ref="AccessionNo1"
                      v-model="checkQuery.AccessionNo"
                    />
                  </b-input-group>
                </b-col>
                <b-col
                  sm="2"
                  class="px-1"
                >
                  <b-input-group prepend="病歷號">
                    <b-input v-model="checkQuery.PatientId" />
                  </b-input-group>
                </b-col>
                <b-col
                  sm="2"
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
                  <b-input-group
                    prepend="開單起訖"
                    style="width:340px"
                  >
                    <div
                      id="OpenDataPicker"
                      class="form-control"
                      style="padding: 0px 0px ;"
                    >
                      <ejs-daterangepicker v-model="OpenDateRange"></ejs-daterangepicker>
                    </div>
                  </b-input-group>
                </b-col>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                <b-col
                  sm="2"
                  class="px-1"
                >
                  <b-input-group
                    prepend="檢查起訖"
                    style="width:340px"
                  >
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
                      @closed="onSuperMenuClose"
                      @opened="onSuperMenuOpen"
                      placeholder="請選擇"
                      v-model="checkQuery.ProcedureCode"
                      :items="optionsCheckItem"
                      noneFoundText="無此筆資料"
                      style="z-index:1"
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
                      class="pt-2 pl-2 rounded-right"
                      style="border:1px solid #ced4da"
                      v-model="checkQuery.EmgFlag"
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
                    variant="warning"
                    @click="$bvModal.show('enterDlg')"
                  >
                    <font-awesome-icon icon="edit" />手動開單
                  </b-button>&nbsp;
                  <b-button
                    v-if="changeBtn"
                    @click="changeCheck"
                  >
                    <font-awesome-icon icon="fighter-jet" />預約/變更時間
                  </b-button>&nbsp;
                  <b-button
                    variant="danger"
                    v-if="checkinBtn"
                    @click="Checkin_confirm"
                  >
                    <font-awesome-icon icon="fighter-jet" />病患報到
                  </b-button>&nbsp;
                  <b-button
                    variant="info"
                    @click="TodayQuery"
                  >
                    <font-awesome-icon icon="fighter-jet" />今日排程
                  </b-button>&nbsp;
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
                  <b-button
                    variant="danger"
                    v-if="CancelBtn"
                    @click="Checkin_cancel"
                  >
                    <font-awesome-icon icon="search" />取消報到
                  </b-button>&nbsp;
                  <!-- v-if="QuickcheckinBtn" -->
                  <!-- <b-button variant="danger" @click="To-DO">
                    <font-awesome-icon icon="fighter-jet" />快速排檢
                  </b-button>&nbsp;-->
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
            <!-- 左方未報到病人 -->
            <b-col sm="9">
              <div
                id="block4QueryResult"
                class="mr-1 rounded"
                style="border:1px solid #ced4da; min-height:690px;"
              >
                <twp
                  ref="twp1"
                  v-bind:FieldConfig="tableConfig4QueryResult"
                  :DataFetch="getFliterData"
                  CheckBox1Head
                  :CheckBox1Lead="true"
                  :CheckBox1Func="itemChecked"
                  :isBackEndPagination="true"
                  :OnHeaderCheckBoxChange="OnHeaderCheckBoxChange"
                  v-on:allUnSelected="ResetFirstCheckItem"
                  :CheckIfShowRowCheckBox="CheckIfIdMatchMuitiSelect"
                  :CheckIfShowHeaderCheckBox="CheckIfShowHeaderCheckBox"
                  :superMenuOpen="superMenuOpen"
                ></twp>
              </div>
            </b-col>
            <!-- 右方今日排檢之病人 -->
            <b-col sm="3">
              <div
                id="block4TodayList"
                class="rounded"
                style="border:1px solid #ced4da; min-height:690px;"
              >
                <b-container class="mt-1">
                  <b-row>
                    <b-col>
                      <b-input-group prepend="已報到人數">
                        <b-input
                          readonly
                          :value="checkinCount"
                        />
                      </b-input-group>
                    </b-col>
                    <b-col>
                      <b-input-group prepend="未報到人數">
                        <b-input
                          readonly
                          :value="UncheckinCount"
                        />
                      </b-input-group>
                    </b-col>
                  </b-row>
                </b-container>
                <twp
                  ref="twp2"
                  NoPaging
                  v-bind:FieldConfig="tableConfig4TodayList"
                  :DataFetch="getFliterData2"
                ></twp>
              </div>
            </b-col>
          </b-row>
        </b-container>
        <b-modal
          id="ModalSize"
          no-close-on-esc
          no-close-on-backdrop
          hide-footer
          ref="bookingModal"
          title="選擇排程時段"
          size="huge"
          @close="UpdateView"
        >
          <bookingView
            :bookingObjs="bookingObjs"
            :bookingDate="viewDate"
            :patientInfo="patientInfo"
          ></bookingView>
        </b-modal>
      </b-tab>

      <!-- 綜合查詢頁籤 -->
      <b-tab title="綜合查詢">
        <b-card
          no-body
          class="mx-1"
        >
          <b-card-header class="bg-primary text-white cardHeader">
            <b-row no-gutters>
              <b-col
                cols="6"
                class="float-left text-left"
              >健診櫃台報到．綜合查詢</b-col>
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
                  sm="2"
                  class="px-1"
                >
                  <b-input-group prepend="身分證號">
                    <b-input v-model="checkQuery.OtherPatientId" />
                  </b-input-group>
                </b-col>

                <b-col
                  sm="2"
                  class="px-1"
                >
                  <b-input-group
                    prepend="開單起訖"
                    style="width:340px"
                  >
                    <div
                      id="OpenDataPicker"
                      class="form-control"
                      style="padding: 0px 0px ;"
                    >
                      <ejs-daterangepicker v-model="OpenDateRange"></ejs-daterangepicker>
                    </div>
                  </b-input-group>
                </b-col>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                <b-col
                  sm="2"
                  class="px-1"
                >
                  <b-input-group
                    prepend="檢查起訖"
                    style="width:340px"
                  >
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
                    <b-select
                      v-model="checkQuery.ProcedureCode"
                      :options="optionsCheckItem"
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
              </b-row>
              <b-row
                no-gutters
                class="mt-1"
              >
                <b-col
                  sm="2"
                  class="px-1"
                >
                  <b-input-group prepend="急作">
                    <b-form-radio-group
                      class="pt-2 pl-2 rounded-right"
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
                  <b-input-group prepend="報到狀態">
                    <b-select
                      v-model="checkQuery.status"
                      :options="TotalStatusSource"
                    />
                  </b-input-group>
                </b-col>

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
                <twp
                  ref="twp3"
                  v-bind:FieldConfig="tableConfig4QueryResult"
                  :DataFetch="getFliterData3"
                  :isBackEndPagination="true"
                  :CheckBox1Func="openHistory"
                  :CheckIfShowRowCheckBox="showcheckBox"
                  :CheckIfShowHeaderCheckBox="showcheckBox"
                ></twp>
              </div>
            </b-col>
          </b-row>
        </b-container>
      </b-tab>

      <!-- 病患歷程資料 TO-DO美觀設計....-->
      <b-Modal
        ref="PatientHistory"
        hide-header
        hide-footer
        size="lg"
      >
        <b-row
          v-for="item in treeData"
          v-bind:key="item.id"
          class="mt-1"
        >
          <b-container>
            <b-button
              id="ModalButton"
              class="text-left"
              v-b-toggle="item.name"
              variant="primary"
            >{{ item.name }}</b-button>
          </b-container>
          <b-container>
            <b-collapse
              visible
              :id="item.name"
              class="mt-2"
              v-for="item1 in item.Detail"
              v-bind:key="item1.id"
            >
              <b-form-input
                :placeholder="item1"
                disabled
              />
            </b-collapse>
          </b-container>
        </b-row>
      </b-Modal>

      <!-- 此病患報到之檢查項目該去哪一檢查室 TO-DO美觀設計....-->
      <b-Modal
        ref="MergeListModal"
        hide-header
        hide-footer
        size="lg"
      >
        <div
          v-for="(item, i) in MergeList"
          v-bind:key="item.id"
          class="mt-2"
        >
          <b-button
            id="ModalButton"
            class="text-left"
            v-b-toggle="item.Name"
            style
          >檢查項目:{{ item.Name }}</b-button>
          <b-collapse
            :id="item.Name"
            visible
          >
            <b-card>預計檢查室: {{ item.temproomName }}</b-card>
            <b-card v-if="item.roomList.length > 2">
              <b-form-select
                v-model="item.temproom"
                :options="item.roomList"
              ></b-form-select>
            </b-card>
          </b-collapse>
        </div>
        <div class="mt-2">
          <b-button
            id="Button_color"
            @click="confirm_room(true)"
          >
            <font-awesome-icon icon="fighter-jet" />確定報到
          </b-button>
          <b-button
            id="Button_color"
            class="ml-3"
            @click="confirm_room(false)"
          >
            <font-awesome-icon icon="eraser" />取消
          </b-button>
        </div>
      </b-Modal>
      <ManuallyEnter
        :optionsCheckItem="optionsCheckItem"
        :optionsPatientSource="optionsPatientSource"
        :CheckinStatusSource="CheckinStatusSource"
        :optionsLocationSource="optionsLocationSource"
      ></ManuallyEnter>
    </b-tabs>
  </div>
</template>

<script>
import Vue from "vue";
import twp from "@/components/TWPv5_1";
import { Dialog, AppBar } from "muse-ui";
var moment = require("moment");
import {
  DataManager,
  WebApiAdaptor,
  Predicate,
  Query
} from "@syncfusion/ej2-data";
import * as configs from "@/config";
import { DateRangePickerPlugin } from "@syncfusion/ej2-vue-calendars";
import bookingView from "@/components/Booking/Index";
import ManuallyEnter from "./ManuallyEnter";

// 載入模組:KeyPressIdentifier
import KeyPressIdentifier from "@/assets/KeyPressIdentifier";
import VSuperSelect from "v-super-select";

//for booking (must import and css have some trobule...)
// import "muse-ui/dist/muse-ui.css";

Vue.use(AppBar);
Vue.use(Dialog);
Vue.use(DateRangePickerPlugin);

export default {
  name: "home",
  components: { twp, bookingView, ManuallyEnter, VSuperSelect },
  data () {
    return {
      superMenuOpen: false,
      // 是否容許 HotKey 攔截器作用?
      allowHotKeyFunctional: true,
      HotkeyList: [],
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
      bookingObjs: null,

      //左下角Table的header
      tableConfig4QueryResult: [
        {
          key: "EmgFlagName",
          label: "類別",
          sortable: true,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "StatusName",
          label: "報到狀態",
          sortable: true,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "PatientSourceTypeName",
          label: "病患來源",
          sortable: true,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "AccessionNo",
          label: "申請單號",
          sortable: true,
          thClass: "text-nowrap",
          tdClass: "no-wrap font-weight-bold"
        },

        {
          key: "PatientId",
          label: "病歷號",
          sortable: true,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "OtherPatientId",
          label: "身分證字號",
          sortable: true,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "ProcedureName",
          label: "檢查項目",
          sortable: true,
          thClass: "no-wrap",
          tdClass: "no-wrap text-left"
        },
        {
          key: "PatientName",
          label: "姓名",
          sortable: true,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "PatientSex",
          label: "性別",
          sortable: true,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "OrderDate_forShow",
          label: "開單日期",
          sortable: true,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "ScheduleTime_forShow",
          label: "檢查日期",
          sortable: true,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "CounterRegister_forShow",
          label: "報到日期",
          sortable: true,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        }
      ],

      //右下角Table的header
      tableConfig4TodayList: [
        {
          key: "AccessionNo",
          label: "申請單號",
          sortable: true,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "PatientId",
          label: "病歷號",
          sortable: true,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        },
        {
          key: "PatientName",
          label: "姓名",
          sortable: true,
          thClass: "no-wrap",
          tdClass: "no-wrap"
        }
      ],

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

        //報到狀態
        status: null,
        EmgFlag: null,
        //檢查室
        Location: null,
        //報到狀態
        PatientStatus: null
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
      //報到後的檢查項目相關資料
      CheckinListModalList: [],
      MergeList: [],
      //病患今日檢查項目類型:0.無檢查1.今日有檢查3.有檢查不再今日
      checkTypeList: "A",
      //歷程樹
      treeData: [
        //櫃檯報到顯示資料
        {
          Step: "1",
          name: "櫃台報到",
          //甚麼時間報到when,誰幫他報到的who(紀錄櫃台報到的那一個),要去哪裡where
          Detail: {
            //櫃檯報到時間
            CounterRegister: "",
            //櫃檯報到人員
            COUNTER_STAFF_Name: "",
            //預計檢查室
            ScheduleLocationName: "",
            //預計檢查時間
            ScheduleTime: ""
          }
        },
        //檢查室
        {
          name: "檢查室",
          Detail: {
            StartTime: "",
            EndTime: "",
            //放射師1
            PerformRadiographer1Name: "",
            //放射師2
            PerformRadiographer2Name: "",
            //護理師
            PerformNurseName: ""
          }
        },
        //報告分派人員
        {
          name: "報告分派人員",
          Detail: {
            //報告分配給誰登打
            DxreportPhysicianName: ""
          }
        },
        //報告撰寫
        {
          name: "報告撰寫",
          Detail: {
            //報告(撰寫)人員, R:可能是打字員或醫師
            DxreportPhysicianName: "",
            //主治/審核報告的醫師
            IssuePhysicianName: ""
          }
        }
      ]
    };
  },
  computed: {},
  methods: {
    showcheckBox () {
      return false;
    },
    openHistory (x) {
      //顯示病歷歷程
      this.treeData.forEach(s => {
        if (s.name == "櫃台報到") {
          s.Detail.CounterRegister =
            "櫃台到時間 :" +
            moment(x.CounterRegister).format("YYYY/MM/DD HH:mm:ss");
          s.Detail.COUNTER_STAFF_Name = "櫃台報到人員 :" + x.CounterStaffName;
          s.Detail.ScheduleLocationName =
            "預計檢查室:" + x.ScheduleLocationName;
          s.Detail.ScheduleTime =
            "預計檢查時間:" +
            moment(x.ScheduleTime).format("YYYY/MM/DD HH:mm:ss");
        }
        if (s.name == "檢查室") {
          s.Detail.StartTime =
            "檢查開始時間 :" +
            moment(x.ProcedureStart).format("YYYY/MM/DD HH:mm:ss");
          s.Detail.EndTime =
            "檢查結束時間 :" +
            moment(x.ProcedureCompleted).format("YYYY/MM/DD HH:mm:ss");
          s.Detail.PerformRadiographer1Name =
            "放射師1:" + x.PerformRadiographer1Name;

          s.Detail.PerformRadiographer2Name =
            "放射師2:" + x.PerformRadiographer2Name;
          s.Detail.PerformNurseName = "護理師:" + x.PerformNurseName;
        }
        if (s.name == "報告分派人員") {
          s.Detail.DxreportPhysicianName =
            "報告分派人員 :" + x.DxreportPhysicianName;
        }
        if (s.name == "報告撰寫") {
          s.Detail.DxreportPhysicianName =
            "報告(撰寫)人員 :" + x.DxreportPhysicianName;
          s.Detail.IssuePhysicianName =
            "主治/審核報告醫師 :" + x.IssuePhysicianName;
        }
      });
      this.$refs["PatientHistory"].show();
    },
    HKWatch (event) {
      if (event.key === "Enter") {
        this.getQueryBtn();
      }
    },
    clear () {
      //清除輸入的條件
      //申請單號
      (this.checkQuery.AccessionNo = ""),
        //病歷號
        (this.checkQuery.PatientId = ""),
        //身分證字號
        (this.checkQuery.OtherPatientId = ""),
        //開單日期From
        (this.OpenDateRange = ["", ""]),
        //檢查日期
        (this.CheckDateRange = ["", ""]),
        //檢查項目
        (this.checkQuery.ProcedureCode = null),
        //病患來源
        (this.checkQuery.PatientSourceTypeCode = null),
        (this.checkQuery.Location = null),
        //急作
        (this.checkQuery.EmgFlag = null),
        //是否報到
        (this.checkQuery.status = null);
      this.BtnNo = 0;
      this.$refs["twp1"].OnForceRefresh();
      setTimeout(() => {
        const q = ".super-select-input input[type=text]";
        [...document.querySelectorAll(q)].forEach(s => {
          s.value = "";
        });
      }, 300);
    },

    //按鈕查詢-多功能Method 由按鈕決定今天要帶入甚麼參數給TWP3查詢
    QueryMethod () {
      //預設一進來時 帶入左方畫面資料的條件:已報到及未報到
      if (this.BtnNo === 0) {
        return new Query().where("PatientSourceTypeCode", "equal", "G");
      }
      //按下查詢按鈕(進行查詢)):1
      else if (this.BtnNo === 1) {
        return this.getQuery().where("PatientSourceTypeCode", "equal", "G");
      }
      //今日排程按鈕
      else if (this.BtnNo === 2) {
        return this.getQuery().where("PatientSourceTypeCode", "equal", "G");
      }
    },

    getQuery: function () {
      let query = new Query();
      //判斷申請單號
      if (this.checkQuery.AccessionNo != "")
        query = query.where(
          "AccessionNo",
          "contains",
          this.checkQuery.AccessionNo.trim()
          , true
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
      console.log(this.checkQuery.ProcedureCode);
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
        console.log(this.checkQuery.Location);
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
      if (this.$Exists(this.checkQuery.status)) {
        if (this.checkQuery.status != null) {
          query = query.where("Status", "equal", this.checkQuery.status);
        }
      }
      return query;
    },

    async getQueryBtn () {
      //將按鈕狀態改為有條件查詢(輸入的資料查詢)
      this.BtnNo = 1;

      this.$refs["twp1"].OnCancelAllSelects();
      // this.$refs["twp1"].OnForceRefresh();
      this.$refs["twp1"].OnForceRefresh();
      this.$refs["twp2"].OnForceRefresh();
      this.$refs["twp3"].OnForceRefresh();
      await this.ResetFirstCheckItem();
      await this.itemChecked(null);
    },
    //更改檢查
    async changeCheck () {
      //先串現有之檢查項目 並清空
      this.selectCheckItems = [];
      let data = this.$refs["twp1"].checkedItems;
      let OrderNoList = [];
      let result = [];
      console.log(data);
      data.forEach(x => {
        console.log(x);
        var ans = OrderNoList.some(function (item) {
          return item.OrderNo == x.OrderNo; // 當全部 age 大於 10 才能回傳 true
        });
        console.log(OrderNoList);
        if (!ans) {
          OrderNoList.push(x.OrderNo);
        }
      });
      OrderNoList.forEach(x => {
        let ProcedureCodeList = data.filter(function (item) {
          return item.OrderNo === x;
        });
        let tempList = [];
        ProcedureCodeList.forEach(s => {
          tempList.push(s.ProcedureCode);
        });
        let obj = {
          orderNo: x,
          checkItemNos: tempList
        };
        result.push(obj);
      });
      console.log(result);
      this.bookingObjs = result;
      // data.forEach(x => {
      //   //串大單號 同大單號為一陣列 組成小單號
      //   let orderNo = x.OrderNo

      //   result.some(n=>{
      //     if(n.orderNo !== orderNo){

      //     }
      //   })

      //   this.selectCheckItems.push(x.ProcedureCode);
      // });
      // let objs = [];
      // let index = 0;
      // this.data.forEach(element => {
      //   let obj = {
      //     orderNo: element,
      //     checkItemNos: this.selectCheckItems[index]
      //   };
      //   objs.push(obj);
      //   index++;
      // });

      //病患身分證字號, R:或居留證、護照號碼'
      let OTHER_PATIENT_ID = data[0].OtherPatientId;
      let PATIENT_ID = data[0].PatientId;
      let ORDER_NO = data[0].OrderNo;
      let ids = Object.values(this.selectCheckItems);
      this.checkItemNos = ids.join(",");
      console.log(this.checkItemNos);
      //再抓取病患資料 call api
      let patientData = null;
      await new DataManager({
        url: configs.publicPath + "../patient/Get" + "?no=" + PATIENT_ID,
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      })
        .executeQuery(new Query())
        .then(r => {
          patientData = r.actual;
          console.log(patientData);
          //姓名
          this.patientInfo.name = patientData.NaturalPerson.Name;
          this.patientInfo.orderNo = ORDER_NO;
          //身分證字號
          this.patientInfo.id = patientData.No;
          //性別
          this.patientInfo.gender = patientData.NaturalPerson.Sex;
          //病歷號碼
          this.patientInfo.hrNum = PATIENT_ID;
          this.patientInfo.birthDay = new Date(
            patientData.NaturalPerson.Birthday
          );
        });
      // this.dialogOpened = true
      this.$refs["bookingModal"].show();
    },
    onSuperMenuOpen () {
      this.superMenuOpen = true;
    },
    onSuperMenuClose () {
      this.superMenuOpen = false;
    },
    //報到作業
    async getFliterData (test, pageIndex, perpage) {
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

      // 報到狀態
      let status = "11,12,21";
      //第一次進來時 預設只看報到跟未報到
      let Todayurl = "";
      if (this.BtnNo === 0) {
        status = "11,12";
        let today = new Date();
        today = moment(today).format("YYYY/MM/DD");
        Todayurl = "&scheduleTimeStart=" + today + "&scheduleTimeEnd=" + today;
      }
      let data = null;
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
          Todayurl,
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      })
        //this.QueryMethod()
        .executeQuery(
          this.QueryMethod()
            .page(pageIndex, perpage)
            .sortBy("ScheduleTime")
        )
        .then(r => {
          //今天檢查項目數量
          let CheckCount = 0;
          //今日檢查之病人
          let todaycheck = [];

          data = r.actual;

          //資料流進來後 篩選資料 ，如為當天之病人排檢的病人(當天掛號當天檢查)，要有顏色提示
          let i = 0;
          data.Items.forEach(x => {
            //轉換資料顯示

            if (x.EmgFlag === "Y") x.EmgFlagName = "急作";
            else x.EmgFlagName = "一般";
            //先轉成YYYY/MM/DD格式
            x.ScheduleTime_forShow = moment(x.ScheduleTime).format(
              "YYYY/MM/DD HH:mm:ss"
            );
            x.CounterRegister_forShow = moment(x.CounterRegister).format(
              "YYYY/MM/DD HH:mm:ss"
            );
            if (x.ScheduleTime_forShow == "Invalid date") {
              x.ScheduleTime_forShow = "";
            }
            if (x.CounterRegister_forShow == "Invalid date") {
              x.CounterRegister_forShow = "";
            }
            x.OrderDate_forShow = moment(x.OrderDate).format("YYYY/MM/DD");
            //如為當天之病人排檢的病人(當天掛號當天檢查)，要有顏色提示。
            if (
              x.ScheduleTime === moment(new Date()).format("YYYY/MM/DD") &&
              (x.Status == "11" || x.Status == "12")
            ) {
              x._rowVariant = "danger";
              CheckCount++;
              todaycheck.push(x);
            }
            if (x.Status == "21") {
              x._rowVariant = "info";
            }
          });
          //若查詢出資料 無資料 表示該病患無檢查
          if (data.Count <= 0) {
            //
            this.checkTypeList = "A";
          }
          //若查詢出資料 有資料 表示該病患有檢查
          else if (data.Count > 0) {
            //今日有檢查
            if (CheckCount > 0) {
              this.checkTypeList = "B";
              //裡面有今日檢查的檢查項目
              this.PatientcheckItem_List = todaycheck;
            }
            //今日無檢查，但要顯示接下來的檢查時間
            else if (CheckCount <= 0) {
              this.checkTypeList = "C";
              this.PatientcheckItem_List = data.Items;
            }
          }
        });
      //Role:若申請單號 病歷號 身分證其中一個有值 表示此次查詢為針對單一病人查詢
      //     需顯示相關資料
      // if (
      //   (this.checkQuery.AccessionNo != "" ||
      //     this.checkQuery.PatientId != "" ||
      //     this.checkQuery.OtherPatientId != "") &&
      //   //表示此次查詢有值
      //   data.Count > 0
      // ) {
      //   this.$refs["TodayCheckList"].show();
      // }

      //取回的資料
      return data;
    },
    async getFliterData2 () {
      let data = null;
      await new DataManager({
        //status 11 未排檢、12已排檢、21已報到
        url: configs.publicPath + "../exam/GetTodayCheckInList",
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      })
        //this.QueryMethod()
        .executeQuery(new Query().sortBy("ScheduleTime"))
        .then(r => {
          data = r.actual;
          //已報到人數
          let checkinCount = data.CheckInCount;
          let unCheckinCount = data.Total - checkinCount;
          this.checkinCount = checkinCount;
          this.UncheckinCount = unCheckinCount;
        });

      //取回的資料
      return data;
    },
    //for 當日排檢列表
    // async getTodayBookList() {
    //   let data = null;
    //   await new DataManager({
    //     url: configs.publicPath + "../exam/TodayBookingList",
    //     adaptor: new WebApiAdaptor(),
    //     crossDomain: true
    //   })
    //     .executeQuery(new Query())
    //     .then(r => {
    //       data = r.actual;
    //       this.checkinCount = data.Count;
    //     });
    //   //取回的資料
    //   return data;
    // },
    async getFliterData3 (test, pageIndex, perpage) {
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

      //第一次進來時 預設只看報到跟未報到
      let Todayurl = "";
      if (this.BtnNo === 0) {
        let today = new Date();
        today = moment(today).format("YYYY/MM/DD");
        Todayurl = "&scheduleTimeStart=" + today + "&scheduleTimeEnd=" + today;
      }
      let data = null;
      await new DataManager({
        //status 11 未排檢、12已排檢、21已報到
        url:
          configs.publicPath +
          "../exam/List?" +
          //串開單
          openurl +
          schedulgurl +
          Todayurl,
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      })
        //
        .executeQuery(
          this.QueryMethod()
            .page(pageIndex, perpage)
            .sortBy("ScheduleTime")
        )
        .then(r => {
          //今天檢查項目數量
          let CheckCount = 0;
          //今日檢查之病人
          let todaycheck = [];

          data = r.actual;

          //資料流進來後 篩選資料 ，如為當天之病人排檢的病人(當天掛號當天檢查)，要有顏色提示
          let i = 0;
          data.Items.forEach(x => {
            //轉換資料顯示

            if (x.EmgFlag === "Y") x.EmgFlagName = "急作";
            else x.EmgFlagName = "一般";
            //先轉成YYYY/MM/DD格式
            x.ScheduleTime_forShow = moment(x.ScheduleTime).format(
              "YYYY/MM/DD HH:mm:ss"
            );
            x.OrderDate_forShow = moment(x.OrderDate).format("YYYY/MM/DD");
            //如為當天之病人排檢的病人(當天掛號當天檢查)，要有顏色提示。
            if (
              x.ScheduleTime === moment(new Date()).format("YYYY/MM/DD") &&
              (x.Status == "11" || x.Status == "12")
            ) {
              x._rowVariant = "danger";
              CheckCount++;
              todaycheck.push(x);
            }
          });
          //若查詢出資料 無資料 表示該病患無檢查
          if (data.Count <= 0) {
            //
            this.checkTypeList = "A";
          }
          //若查詢出資料 有資料 表示該病患有檢查
          else if (data.Count > 0) {
            //今日有檢查
            if (CheckCount > 0) {
              this.checkTypeList = "B";
              //裡面有今日檢查的檢查項目
              this.PatientcheckItem_List = todaycheck;
            }
            //今日無檢查，但要顯示接下來的檢查時間
            else if (CheckCount <= 0) {
              this.checkTypeList = "C";
              this.PatientcheckItem_List = data.Items;
            }
          }
        });

      return data;
    },
    /*
    今日排程按鈕
    */
    TodayQuery () {
      let times = new Array(2).fill().map(v => new Date());
      times.forEach((k, i) =>
        i === 0 ? k.setHours(0, 0, 0, 0) : k.setHours(23, 59, 59, 999)
      );
      this.OpenDateRange = times;
      this.getQueryBtn(); // 搜尋條件依然有誤 恐怕是套件的時間有問題
      this.BtnNo = 0;
      this.$refs["twp1"].OnForceRefresh();
    },
    UpdateView () {
      this.$refs["twp1"].OnForceRefresh();
    },
    /*
    單擊列表，並勾選--傳入用
    */
    rowClickFunc (x) {
      if (x.TWPCheckBox1Value) x.TWPCheckBox1Value = false;
      else x.TWPCheckBox1Value = true;
    },
    /*
    確定報到
    */
    async Checkin_confirm () {
      try {
        const AccessionNoList = this.$refs["twp1"].Rows.reduce(
          (a, c) => (c.TWPCheckBox1Value ? [...a, c.AccessionNo] : a),
          []
        );
        //先打一次Checkin 並帶入false 不改狀態 純拿預計檢查室
        if (AccessionNoList && AccessionNoList.length == 0)
          throw new Error("no Data");
        this.CheckinListModalList = await window.axios.put(
          "/exam/CheckIn?changeState=false&isCheckUp=true",
          AccessionNoList
        );
        const wholeItems = Object.values(this.CheckinListModalList).flat();
        const url = `${
          configs.publicPath
          }../checkItem/MargeCheckItem?checkItems=${wholeItems
            .map(l => l.ProcedureCode)
            .join(",")}&isNo=true`;
        const result = await new DataManager({
          url,
          adaptor: new WebApiAdaptor(),
          crossDomain: true
        }).executeQuery(new Query());
        if (result) {
          this.MergeList = result.actual;
          this.MergeList.forEach(mi => {
            const Accessions = [];
            let temproom = "",
              temproomName = "";
            wholeItems.forEach(wi => {
              if (mi.MargeCheckItemNos.indexOf(wi.ProcedureCode) >= 0) {
                Accessions.push(wi.AccessionNo);
                temproom = wi.ScheduleLocation;
                temproomName = wi.ScheduleLocationName;
                // console.log('mergelist', wi.AccessionNo, temproom, temproomName);
              }
            });
            mi["Accessions"] = Accessions;
            mi["temproom"] = temproom;
            mi["temproomName"] = temproomName;
          });
          this.getRoomAPI();
          this.$refs["MergeListModal"].show();
        } else {
          throw new Error("no data");
        }
      } catch (err) {
        console.log(err);
        this.ObjApp.TimingMessage("存取時發生錯誤! 請稍後再試.", 2);
      }

      // //checkList內有目前勾選的項目
      // console.log(AccessionNoList);
      // //為未排檢且需排檢之項目 or 已排檢但過期的人
      // let freeCheck = [];
      // for (let i = 0; i < data.length; i++) {
      //   //NonSchedule定義 Ture表示她一定不需要排檢 直接過 不用檢查 False表示可以排檢的項目
      //   if (!data[i].NonSchedule) {
      //     //判斷該項目為 需要排檢+未排檢 or 檢查時間超過今天者 則強制讓她選擇檢查室
      //     if (
      //       data[i].Status === "11" ||
      //       new Date(data[i].ScheduleTime) <= new Date() ||
      //       data[i].ScheduleLocation == null
      //     ) {
      //       freeCheck.push(data[i]);
      //     }
      //   }
      // }
      // if (freeCheck.length > 0) {
      //   success = false;
      //   this.choice_room = this.$DeepCopy(freeCheck);

      //   //迴圈撈取檢查室資料 並塞給 this.room_list Array
      //   this.getRoomAPI();

      //   console.log(this.choice_room);

      //   this.$refs["Choice_Room"].show();

      //   //組合資料給畫面排列組合檢查室相關資料
      // } else success = true;
      //主要給隨到隨檢使用 已排檢或是 未排檢的X光都直接給予True值

      // if (success) {
      //打JSON 因只能單筆打 故用迴圈

      // }
      // // 資料重撈
      // setTimeout(x => {
      //   this.getQueryBtn();
      // }, 500);
    },
    //取得檢查室相關資料
    getRoomAPI () {
      let i = 0;
      this.MergeList.forEach(async x => {
        let itemPack = null;
        let convertedCollections = [{ value: null, text: "請選擇" }];
        //
        let subPath =
          "../checkItem/RoomNoList?type=" +
          x.Type +
          "&id=" +
          x.Id +
          "&isCheckUp=true";
        //
        await new DataManager({
          url: configs.publicPath + subPath,
          adaptor: new WebApiAdaptor(),
          crossDomain: true
        })
          .executeQuery(new Query())
          .then(r => {
            itemPack = r.actual;
            itemPack.Items.forEach(i => {
              let collection = { value: i.No, text: i.Name };
              convertedCollections.push(collection);
            });
            x.roomList = convertedCollections;
            this.$set(this.MergeList, i, x);
            ++i;
          });
      });
    },
    //Action true 確定報到 false 關閉畫面
    async confirm_room (Action) {
      //

      if (Action) {
        //確定報到 寫入檢查室資料
        this.MergeList.forEach(async x => {
          let Accession = x.Accessions;
          await window.axios
            .put(
              "/exam/CheckIn?changeState=true&isCheckUp=false&roomNo=" +
              x.temproom,
              Accession
            )
            .then(async e => {
              this.ObjApp.TimingMessage("報到完成");
              this.ResetFirstCheckItem();
              this.itemChecked(null);
              this.$refs["twp1"].OnCancelAllSelects();
              this.$refs["twp1"].OnForceRefresh();
              this.$refs["twp2"].OnForceRefresh();
            });
        });
      }
      this.$refs["MergeListModal"].hide();
    },
    //取消報到
    async Checkin_cancel () {
      let data = this.$refs["twp1"].checkedItems;
      let CancelCheckinList = [];
      for (let i = 0; i < data.length; i++) {
        CancelCheckinList.push(data[i].AccessionNo);
      }

      await window.axios
        .put("/exam/CheckInBack", CancelCheckinList)
        .then(e => {
          this.ObjApp.TimingMessage("報到取消完成");
          this.$refs["twp1"].OnForceRefresh();
          this.$refs["twp2"].OnForceRefresh();
          this.$refs["twp1"].OnCancelAllSelects();
          this.ResetFirstCheckItem();
          this.itemChecked(null);
        })
        .catch(function (error) {
          this.ObjApp.TimingMessage("存取時發生錯誤! 請稍後再試.", 2);
        });
    },
    //確定檢查室TO-Do
    // async confrim_Room() {
    //   let roomcheck = false;
    //   await this.choice_room.forEach(async x => {
    //     await window.axios

    //       .put(
    //         configs.publicPath + "../exam/CheckIn" + "?roomNo=" + x.rommselect,
    //         [x.AccessionNo]
    //       )
    //       .then(async e => {
    //         Swal.fire({
    //           type: "success",
    //           title: "報到完成",
    //           timer: 1500
    //         });
    //         this.$refs["Choice_Room"].hide();
    //         this.$refs["twp1"].OnForceRefresh();
    //         this.$refs["twp2"].OnForceRefresh();
    //         this.$refs["twp1"].OnCancelAllSelects();
    //         this.ResetFirstCheckItem();
    //         this.itemChecked();
    //       })
    //       .catch(function(error) {
    //         Swal.fire("儲存失敗！", error, "error");
    //       });
    //   });

    //   //將資料寫回
    //   // await window.axios
    //   //   .put(configs.publicPath + "../exam/CheckIn", this.AccessionNoList)
    //   //   .then(e => {
    //   //     Swal.fire({
    //   //       type: "success",
    //   //       title: "報到完成",
    //   //       timer: 1500
    //   //     });
    //   //   })
    //   //   .catch(function(error) {
    //   //     Swal.fire("儲存失敗！", error, "error");
    //   //   });

    //   // console.log(this.choice_room);
    // },
    cancel_room () {
      this.$refs["Choice_Room"].hide();
    },
    //
    //header checkbox 勾選後 若為取消 將firstCheckedItem設為null
    //
    OnHeaderCheckBoxChange (checked) {
      if (!checked) this.ResetFirstCheckItem();
    },
    ResetFirstCheckItem () {
      this.firstCheckedItem = null;
    },
    //
    //twp list判斷item是否顯示checkbox, 此處判斷item patient id是否和已選的item相同,
    //一單多檢的多選判斷
    CheckIfIdMatchMuitiSelect (item) {
      if (this.firstCheckedItem == null) return true;

      return item.PatientId == this.firstCheckedItem.PatientId;
    },
    //
    //判斷是否顯示header的checkbox, 如果list的content 皆為同patient id,
    //或 已點某筆item 判斷出相同patient id之row, 則顯示
    CheckIfShowHeaderCheckBox () {
      //若查詢的條件有不一致的病人 則不予使用此功能
      return this.firstCheckedItem == null ? false : true;
    },
    //
    //單一item的checkbox點擊觸發
    itemChecked (item) {
      if (this.firstCheckedItem == null) this.firstCheckedItem = item;
      // if (item) {
      //   if (item.showCheckBox) {
      //     if (item.TWPCheckBox1Value) item.TWPCheckBox1Value = false;
      //     else item.TWPCheckBox1Value = true;
      //   }
      // }
      let tempAccession = item.AccessionNo.substr(0, 9);
      if (item && item.Modality === "CR") {
        if (item.showCheckBox) {
          item.TWPCheckBox1Value = !item.TWPCheckBox1Value;
        }
        this.$refs["twp1"].Rows.forEach(x => {
          if (x.AccessionNo.indexOf(tempAccession) === 0) {
            x.TWPCheckBox1Value = item.TWPCheckBox1Value;
          }
        });
      }
      setTimeout(x => {
        this.checkinBtn = false;
        this.CancelBtn = false;
        this.changeBtn = false;
        //快速排檢按鈕顯示 ROLE:
        // this.QuickcheckinBtn=false;
        let data = this.$refs["twp1"].checkedItems;
        let checkList = [];
        //11:未排檢(只顯示更改檢查 ) 12:已排檢(只顯示報到跟更改檢查) 21:已報到(只顯示取消檢查)
        data.forEach(x => {
          checkList.push(x.Status);
        });
        if (checkList.includes("11")) {
          this.checkinBtn = true;
          this.CancelBtn = false;
          this.changeBtn = true;
        }
        if (checkList.includes("12")) {
          this.checkinBtn = true;
          this.CancelBtn = false;
          this.changeBtn = true;
        }
        if (checkList.includes("21")) {
          this.checkinBtn = false;
          this.CancelBtn = true;
          this.changeBtn = false;
        }
        //同時點選未排檢與已排檢 只可更改檢查 不可取消或是報到
        if (checkList.includes("11") && checkList.includes("12")) {
          this.checkinBtn = true;
          this.CancelBtn = false;
          this.changeBtn = true;
        }
        //同時點選未排檢與已報到 甚麼都不能做
        if (checkList.includes("11") && checkList.includes("21")) {
          this.checkinBtn = false;
          this.CancelBtn = false;
          this.changeBtn = false;
        }
        //同時點選已排檢與已報到 甚麼都不能做
        if (checkList.includes("12") && checkList.includes("21")) {
          this.checkinBtn = false;
          this.CancelBtn = false;
          this.changeBtn = false;
        }
        if (
          checkList.includes("11") &&
          checkList.includes("12") &&
          checkList.includes("21")
        ) {
          this.checkinBtn = false;
          this.CancelBtn = false;
          this.changeBtn = false;
        }
      }, 500);
    },

    //取得檢查項目列表
    async GetOptionsCheckItem () { },
    //取得病患來源列表
    // async GetOptionsPatientSource() {
    //   console.log(this.$logs());
    //   //
    //   let itemPack = null;
    //   let convertedCollections = [{ value: null, text: "請選擇" }];
    //   //
    //   let subPath = "../GeneralData/SelectNoList?groupNo=PatientSource";
    //   //
    //   await new DataManager({
    //     url: configs.publicPath + subPath,
    //     adaptor: new WebApiAdaptor(),
    //     crossDomain: true
    //   })
    //     .executeQuery(new Query())
    //     .then(r => {
    //       itemPack = r.actual; //資料;
    //     });

    //   itemPack.Items.forEach(i => {
    //     let collection = { value: i.No, text: i.Name };
    //     convertedCollections.push(collection);
    //   });
    //   this.optionsPatientSource = convertedCollections;
    // },
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
      //報到櫃台的Source

      let _tempList = [];
      convertedCollections.forEach(x => {
        if (
          x.value == null ||
          x.value === "11" ||
          x.value === "12" ||
          x.value === "21"
        ) {
          _tempList.push(x);
        }
      });

      this.CheckinStatusSource = this.$DeepCopy(_tempList);
      //綜合查詢的Source
      this.TotalStatusSource = this.$DeepCopy(convertedCollections);
    },
    initWebSocket () {
      let _this = this;
      if (_this.checkQuery.OtherPatientId != "") return;
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
  created () {
    if (localStorage["dtcOptionsCheckItem"]) {
      this.optionsCheckItem = JSON.parse(localStorage["dtcOptionsCheckItem"]);
    }
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
    // //病患來源下拉選單
    // this.GetOptionsPatientSource();
    //檢查室下拉選單
    this.GetLocationSource();
    //報到狀態下拉選單
    this.GetStatusSource();
    //病患狀態下拉選單
    //focus到病歷號上
    setTimeout(x => {
      this.$nextTick(() => this.$refs["AccessionNo1"].focus());
    }, 500);
    // 畫面自動呼叫讀卡機程式 抓取讀卡機資料 To-DO
    setInterval(() => {
      this.initWebSocket();
    }, 5000);
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
#ModalButton {
  width: 766px;
  background-color: #01579b;
}
#Button_color {
  background-color: #01579b;
}
</style>
<style lang="scss">
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
<style>
.fix-light .super-select-container {
  z-index: 9999;
  --boxHeight: 38px !important;
  --itemHeight: 38px !important;
  --boxWidth: 100% !important;
  flex: 1;
  border-radius: 5px;
}

.fix-light .super-select-input,
.fix-light .super-select-container input,
.fix-light .super-select-container {
  background: transparent !important;
}
</style>
