<template>
  <div class="pageContent fix-light" style="min-height: 820px">
    <b-card no-body class="mx-1 border" bg-variant="transparent">
      <b-card-header class="bg-primary text-white cardHeader">
        <b-row no-gutters>
          <b-col cols="6" class="float-left text-left">
            檢查室報到．查詢作業．檢查室︰
            <span class="font-weight-bold">{{ labRoomId }}</span>
          </b-col>
        </b-row>
      </b-card-header>
      <b-card-text class="text-left">
        <div class="d-grid grid-col-6 p-1" style="grid-gap: 3px">
          <b-input-group>
            <b-input-group-prepend>
              <b-button class="bg-warning text-black" style="border-color: grey"
                >檢查室</b-button
              >
            </b-input-group-prepend>
            <b-select
              v-model="selectedLabRoom"
              :options="optionsLabRoom"
              @change="ReloadDataContent"
              style="
                background-color: #ffcc80;
                border-color: grey;
                height: 100%;
              "
            />
          </b-input-group>

          <b-input-group prepend="申請單號" v-if="selectedLabRoom">
            <b-input
              v-model="accessionNo"
              ref="inputAccessionNo"
              id="inputAccessionNo"
            />
          </b-input-group>

          <b-input-group v-if="selectedLabRoom" prepend="病歷號">
            <b-input v-model="hospitalNo" />
          </b-input-group>

          <b-input-group v-if="selectedLabRoom" prepend="身分證號">
            <b-input v-model="personId" />
          </b-input-group>

          <div v-if="selectedLabRoom" class="grid-span-2">
            <b-input-group prepend="檢查起訖">
              <div
                id="spcialDatePicker"
                class="form-control"
                style="padding: 0px"
              >
                <ejs-daterangepicker
                  :min="minDate"
                  :max="maxDate"
                  :minDays="min"
                  :strictMode="true"
                  v-model="DateRange"
                  placeholder="搜尋範圍"
                  @change="SearchConditions"
                ></ejs-daterangepicker>
              </div>
              <b-button
                class="bg-light text-black ml-1"
                style="border-color: grey"
                @click="setDefaultDate"
                >今天</b-button
              >
            </b-input-group>
          </div>

          <b-input-group>
            <multiselect
              class="check-item"
              v-model="selectedCheckItem"
              :options="optionsCheckItem"
              :multiple="true"
              :close-on-select="false"
              :clear-on-select="false"
              :preserve-search="true"
              placeholder="檢查項目"
              label="text"
              track-by="text"
              :preselect-first="true"
              @change="SearchConditions"
            >
            </multiselect>
          </b-input-group>

          <b-input-group v-if="selectedLabRoom" prepend="病患來源">
            <b-select
              v-model="selectedPatientSource"
              :options="optionsPatientSource"
              @change="ChangeConditions"
            />
          </b-input-group>

          <b-input-group prepend="報到狀態">
            <b-select
              v-model="selectedProgress"
              :options="optionsOpProgress"
              @change="ChangeConditions"
            />
          </b-input-group>

          <b-input-group prepend="急作">
            <b-form-radio-group
              name="QryEmergency"
              v-model="emergencySelected"
              class="pt-2 pl-2 rounded-right bg-white text-black"
              style="border: 1px solid #ced4da"
            >
              <b-form-radio value="Y">是</b-form-radio>
              <b-form-radio value="N">否</b-form-radio>
            </b-form-radio-group>
          </b-input-group>

          <div
            style="grid-column: 6 / span 1"
            class="d-flex justify-content-end align-items-center"
          >
            <b-button
              v-if="selectedLabRoom"
              variant="success"
              @click="ClearConditions()"
              class="mr-1"
            >
              <font-awesome-icon icon="eraser" />清除條件
            </b-button>
            <b-button variant="primary" class="mr-1" @click="SearchConditions">
              <font-awesome-icon icon="search" />進行查詢
            </b-button>

            <b-icon-calendar
              @click="getDailyCalendar"
              class="calendar cursor-pointer"
              style="width: 36px; height: 36px"
            />
          </div>
        </div>

        <div
          class="d-grid grid-col-6 p-1"
          style="grid-gap: 3px"
          v-show="selectedLabRoom && selectedLabRoom !== 'all'"
        >
          <div style="width: 200px">
            <toggle-button
              v-model="assignMode"
              ref="assignModeToggle"
              class="positive-btn mt-1 ml-1"
              color="#dc3545"
              :font-size="16"
              :height="26"
              :width="200"
              style="float: left"
              :labels="{ checked: '設定放射師模式', unchecked: '正常作業模式' }"
            />
          </div>

          <b-input-group
            prepend="執行放射師"
            class="bg-white"
            v-if="assignMode"
            v-show="!hideMode"
          >
            <v-super-select
              placeholder="請選擇"
              ref="radioGrapher1"
              @closed="ChangeRadiographer"
              @keydown="
                (e) =>
                  confirmKeyDown(
                    e,
                    selectedRadiographer,
                    optionsRadiographer,
                    'radioGrapher1'
                  )
              "
              autocomplete="true"
              v-model="selectedRadiographer"
              :items="radiographer"
              noneFoundText="無此筆資料"
            />
          </b-input-group>

          <b-input-group
            v-if="assignMode && Modality.toLowerCase() != 'cr'"
            v-show="!hideMode"
            prepend="放射師"
            class="bg-white"
          >
            <!-- <b-select
              @change="ChangeRadiographer2"
              v-model="selectedRadiographer2"
              :options="optionsRadiographer2"
            /> -->
            <v-super-select
              placeholder="請選擇"
              ref="radioGrapher2"
              @closed="ChangeRadiographer2"
              @keydown="
                (e) =>
                  confirmKeyDown(
                    e,
                    selectedRadiographer2,
                    optionsRadiographer2,
                    'radioGrapher2'
                  )
              "
              v-model="selectedRadiographer2"
              :items="radiographer"
              noneFoundText="無此筆資料"
            />
          </b-input-group>
          <b-input-group
            v-if="
              assignMode &&
              (Modality.toLowerCase() == 'cr' ||
                Modality.toLowerCase() == 'all')
            "
            v-show="!hideMode"
            prepend="QC放射師"
            class="bg-white"
          >
            <!-- <b-select
              @change="ChangeRadiographerQC"
              v-model="selectedRadiographerQC"
              :options="optionsRadiographerQC"
            /> -->
            <v-super-select
              placeholder="請選擇"
              ref="radioGrapherQC"
              @keydown="
                (e) =>
                  confirmKeyDown(
                    e,
                    selectedRadiographerQC,
                    optionsRadiographerQC,
                    'radioGrapherQC'
                  )
              "
              @closed="ChangeRadiographerQC"
              v-model="selectedRadiographerQC"
              :items="radiographer"
              noneFoundText="無此筆資料"
            />
          </b-input-group>

          <b-input-group
            v-if="assignMode && Modality.toLowerCase() != 'cr'"
            v-show="!hideMode"
            prepend="護理師"
            class="bg-white"
          >
            <!-- <b-select
              @change="ChangeNurse"
              v-model="selectedNurse"
              :options="optionsNurse"
            /> -->
            <v-super-select
              placeholder="請選擇"
              ref="nurse"
              @keydown="
                (e) => confirmKeyDown(e, selectedNurse, optionsNurse, 'nurse')
              "
              @closed="ChangeNurse"
              v-model="selectedNurse"
              :items="nurses"
              noneFoundText="無此筆資料"
            />
          </b-input-group>
        </div>
      </b-card-text>
    </b-card>

    <b-container fluid class="mt-1 mx-0 pl-1 pr-0">
      <!-- <b-row no-gutters>
          <b-col>
            <toggle-button
              v-model="assignMode"
              class="positive-btn"
              style="float:left;"
              color="#dc3545"
              font-size="16"
              height="26"
              width="150"
              :labels="{checked: '設定放射師模式', unchecked: '正常作業模式'}"
            />
          </b-col>
        </b-row>-->
      <b-row no-gutters>
        <b-col>
          <div
            id="block4QueryResult"
            class="mr-1 rounded"
            style="border: 1px solid #ced4da; height: 690px"
          >
            <twp
              ref="twp1"
              heightForScroll="580px"
              v-bind:FieldConfig="tableConfig4QueryResult"
              :DataFetch="GetDataContent"
              :OpButton1Func="RowClickFunction"
              CheckBox1Head
              :CheckBox1Func="itemChecked"
              :CheckBox1Lead="true"
              :MultiSelectFunc1="OpenMultiReport"
              :selectFunc1String="multiSelectFuncName"
              :MultiSelectFunc2="popupDxPhysician"
              selectFunc2String="設定分派醫師"
              :OpButton2Func="OnClickChangeLabRoom"
              OpButton2Text="變更檢查室"
              :OpButton3Func="OnBackState"
              :checkIfDisableOpButton2Func="checkIfDisableOpButton2Func"
              OpButton3Text="取消登錄"
              :enableRowClick="true"
              :CheckIfShowRowCheckBox="CheckIfIdMatchMuitiSelect"
              :CheckIfShowHeaderCheckBox="CheckIfShowHeaderCheckBox"
              :OnHeaderCheckBoxChange="OnHeaderCheckBoxChange"
              v-on:allUnSelected="ResetFirstCheckItem"
            ></twp>
          </div>
        </b-col>
      </b-row>
    </b-container>

    <transition name="fade">
      <daily
        v-if="showWorkingCalendar"
        ref="daily"
        @closeCalendar="showWorkingCalendar = false"
        @checkinService="CheckinService"
        @checkoutService="CheckoutService"
        @changeRoomService="changeRoomService"
        @changeTimeService="changeTimeService"
        :roomTabs="roomTabs"
        :pRoom="selectedLabRoom"
      />
    </transition>

    <b-modal title="編輯放射師" v-model="applyNoModal" @ok="handleApplyNoModal">
      <div class="applyNoModal fix-light">
        <b-input-group
          prepend="執行放射師"
          class="mb-2 w-100"
          v-show="assignMode"
        >
          <v-super-select
            placeholder="請選擇"
            ref="radioGrapher11"
            @closed="ChangeRadiographer"
            @keydown.enter="
              pickerUp({
                ref: 'radioGrapher11',
                selected: selectedRadiographer,
                options: optionsRadiographer,
              })
            "
            autocomplete="true"
            v-model="selectedRadiographer"
            :items="radiographer"
            noneFoundText="無此筆資料"
          />
        </b-input-group>

        <!-- <b-input-group
          prepend="放射師2"
          class="mb-2 w-100"
          v-show="assignMode && Modality.toLowerCase() != 'cr'"
        >
          <v-super-select
            placeholder="請選擇"
            ref="radioGrapher21"
            @keydown.enter="pickerUp({ ref:'radioGrapher21', selected: selectedRadiographer2, options: optionsRadiographer2})"
            @closed="ChangeRadiographer2"
            v-model="selectedRadiographer2"
            :items="optionsRadiographer2"
            noneFoundText="無此筆資料"
          />
        </b-input-group> -->

        <b-input-group
          prepend="QC放射師"
          class="w-100"
          v-show="
            assignMode &&
            (Modality.toLowerCase() == 'cr' || Modality.toLowerCase() == 'all')
          "
        >
          <v-super-select
            placeholder="請選擇"
            ref="radioGrapherQC1"
            @keydown.enter="
              pickerUp({
                ref: 'radioGrapherQC1',
                selected: selectedRadiographerQC,
                options: optionsRadiographerQC,
                callback: () => {
                  handleApplyNoModal();
                  applyNoModal = false;
                },
              })
            "
            @closed="ChangeRadiographerQC"
            v-model="selectedRadiographerQC"
            :items="radiographer"
            noneFoundText="無此筆資料"
          />
        </b-input-group>
      </div>
    </b-modal>

    <b-modal
      ref="changeRoomModal"
      hide-footer
      header-bg-variant="warning"
      header-text-variant="dark"
      body-class="py-1 px-1"
    >
      <template slot="modal-title">
        <font-awesome-icon icon="syringe" class="mr-1" />
        <span class="zhTW">變更檢查室</span>
      </template>
      <div class="mr-1 rounded">
        <b-row no-gutters>
          <b-col class="p-2">
            <b-input-group>
              <b-input-group-prepend>
                <b-button class="bg-primary" style="border-style: none"
                  >選擇檢查室</b-button
                >
              </b-input-group-prepend>
              <b-select
                v-model="selectedChangeRoom"
                :options="changeOptionsLabRoom"
              />
            </b-input-group>

            <!-- <b-input-group prepend='檢查室'>
                <b-select v-model='selectedLabRoom' :options='optionsLabRoom' @change='ReloadDataContent'  style="background-color:orange;"/>
            </b-input-group>-->
          </b-col>
        </b-row>

        <b-row no-gutters>
          <b-col class="p-2 text-right">
            <b-button variant="success" @click="ConfirmChangeRoom">
              <font-awesome-icon icon="check" />確認
            </b-button>
            <b-button variant="danger" @click="CancelChangeRoom" class="ml-4">
              <font-awesome-icon icon="times-circle" />取消
            </b-button>

            <!-- <b-input-group prepend='檢查室'>
                <b-select v-model='selectedLabRoom' :options='optionsLabRoom' @change='ReloadDataContent'  style="background-color:orange;"/>
            </b-input-group>-->
          </b-col>
        </b-row>
      </div>
    </b-modal>

    <b-modal
      ref="dialogBackState"
      centered
      hide-footer
      title="取消登錄"
      header-text-variant="black"
      header-bg-variant="warning"
      title-class="lang-zh-Hant-TW font-weight-bold"
      body-class="lang-zh-Hant-TW"
    >
      <div class="d-block text-left">
        <p class="lang-zh-Hant-TW">將退回未排檢狀態，是否確認?</p>
      </div>
      <b-btn class="mt-3" variant="success" block @click="Click4StateBack()"
        >確認</b-btn
      >
      <b-btn
        class="mt-2"
        variant="secondary"
        block
        @click="CloseDialogStateBack"
        >取消</b-btn
      >
    </b-modal>

    <b-modal
      ref="win4assignReport"
      hide-footer
      header-bg-variant="warning"
      header-text-variant="dark"
      body-class="py-1 px-1 themeModal"
    >
      <template slot="modal-title">
        <font-awesome-icon icon="user-friends" class="mr-1" />
        <span class="zhTW">分派報告</span>
      </template>
      <div class="mr-1 rounded">
        <b-row no-gutters>
          <b-col class="p-2">
            <b-input-group>
              <b-input-group-prepend>
                <b-button class="bg-primary" style="border-style: none"
                  >選擇分派醫師</b-button
                >
              </b-input-group-prepend>
              <b-select v-model="selectedAssignDoctor" :options="getDxDrs" />
            </b-input-group>
          </b-col>
        </b-row>
        <b-row no-gutters>
          <b-col class="p-2 text-right">
            <b-button variant="success" @click="ConfirmAssignReport">
              <font-awesome-icon icon="user-check" />確認分派
            </b-button>
            <b-button variant="danger" @click="CancelAssignReport" class="ml-4">
              <font-awesome-icon icon="times-circle" />取消
            </b-button>
          </b-col>
        </b-row>
        <div class="hint p-2">
          *選擇報告如是正式報告或撰寫中報告, 則無法更換分派醫師
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
//             :CheckBox1Func="itemChecked"
import Vue from "vue";
import { mapGetters, mapMutations, mapState } from "vuex";
import twp from "@/components/TWPv5";
import * as configs from "@/config";
import { DateRangePickerPlugin } from "@syncfusion/ej2-vue-calendars";

import {
  DataManager,
  WebApiAdaptor,
  Predicate,
  Query,
} from "@syncfusion/ej2-data";

import { dateFormatMixin } from "@/SupportLib_J.js";
// import { hubConnection } from 'signalr-no-jquery'
import daily from "@/components/Daily";
import dailyMethods from "@/components/Daily/dailyMethods.js";
import socketService from "@/mixins/socketConnectionService.js";
import {
  getEmployeeDataByType,
  getEmployeeCodeName,
  saveEmployeeData,
  examAssignReport,
} from "@/assets/service/dataManager.js";
import VSuperSelect from "v-super-select";

//狀態常數
const CHECKED_IN = "21";
const CHECK_INPROCESS = "31";
const EXAM_FINISHED = "36,51,56,61,63,65,71,73,75,77,79";

Vue.use(DateRangePickerPlugin);

const queryResult = require("@/assets/DataSource/DR0101001");
const todayList = require("@/assets/DataSource/DR0101002");
const checkItem = require("@/assets/DataSource/DR0407001");
const patientSource = require("@/assets/DataSource/DR0431001");
const labRoomList = require("@/assets/DataSource/DR0404001");
const opProgress = require("@/assets/DataSource/DR04X1001");

const configCollection = [
  //{ key: 'dId', label: '項次', sortable: false, thClass: "no-wrap", tdClass: "no-wrap" },
  {
    key: "Seq",
    label: "序號",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap",
  },
  {
    key: "PatientName",
    label: "姓名",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap",
  },
  {
    key: "PatientSex",
    label: "性別",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap",
  },
  {
    key: "ProcedureNameStr",
    label: "檢查項目",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap text-left",
  },
  {
    key: "PatientId",
    label: "病歷號",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap",
  },
  {
    key: "EmgFlag",
    label: "急作",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap",
  },
  {
    key: "StatusName",
    label: "狀態",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap",
  },
  {
    key: "PatientSourceTypeName",
    label: "病患來源",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap",
  },
  {
    key: "OrderDate",
    label: "開單日期",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap",
  },
  {
    key: "AccessionNo",
    label: "申請單號",
    sortable: true,
    thClass: "text-nowrap",
    tdClass: "no-wrap font-weight-bold",
  },

  {
    key: "ScheduleTime",
    label: "預定檢查日期",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap",
  },

  {
    key: "PerformRadiographer1Name",
    label: "執行放射師",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap",
  },
  {
    key: "PerformRadiographer2Name",
    label: "放射師",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap",
  },
  {
    key: "QcRadiographerName",
    label: "QC放射師",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap",
  },
  {
    key: "PerformNurseName",
    label: "護理師",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap",
  },
];

import Multiselect from "vue-multiselect";
export default {
  name: "FI0201",
  components: { twp, Multiselect, daily, VSuperSelect },
  mixins: [dateFormatMixin, dailyMethods, socketService],
  data() {
    return {
      showWorkingCalendar: false,
      //設定
      assignMode: false,
      hideMode: false,
      //
      selectedRadiographer: null,
      selectedRadiographer2: null,
      selectedRadiographerQC: null,
      selectedNurse: null,
      optionsNurse: [],
      optionsRadiographer: [],
      optionsRadiographer2: [],
      optionsRadiographerQC: [],
      //
      BasePath: this.$route.path,
      selectedLabRoom: null,
      state4TodayList: false,
      tableConfig4QueryResult: [],
      tableContent4QueryResult: [],
      tableConfig4TodayList: [],
      tableContent4TodayList: [],
      selectedCheckItem: null,
      selectedCheckRoom: null,

      optionsCheckItem: [],

      selectedPatientSource: null,
      optionsPatientSource: [],
      optionsLabRoom: [],
      selectedProgress: CHECKED_IN,
      optionsOpProgress: [],
      optionsCheckRoom: [],

      checkInstrument: null,
      emergencySelected: null,

      min: 1,
      DateRange: [null, null],
      accessionNo: null,
      hospitalNo: null,

      performRadiographer1Id: null,
      performRadiographer2Id: null,
      performNurseId: null,
      personId: null,

      //第一筆勾選的多選項目
      firstCheckedItem: null,
      canceledFirstCheckedItem: null,

      //
      backObj: {},
      //
      changeOptionsLabRoom: [],
      selectedChangeRoom: null,
      //
      //webSocket objects
      sockConnection: null,
      hubProxy: null,
      bookingProxy: null,
      hubReconnectCount: 0,
      hubReconnectCountLimit: 3,
      useWebSocket: true,
      //
      //要退回未排檢的項目
      itemToBackState: null,
      roomTabs: ["CR", "CT", "MG", "OT", "US", "MR", "RF", "XA"],
      applyNoModal: false,
      tempAccessionNo: "",
      selectedAssignDoctor: "",

      grapherRefs: [
        {
          ref: "radioGrapher1",
          key: "PerformRadiographer1Id",
          data: "selectedRadiographer",
        },
        {
          ref: "radioGrapher2",
          key: "PerformRadiographer2Id",
          data: "selectedRadiographer2",
        },
        {
          ref: "radioGrapherQC",
          key: "QcRadiographerId",
          data: "selectedRadiographerQC",
        },
        { ref: "nurse", key: "PerformNurseId", data: "selectedNurse" },
      ],
      keepSleep: false,
    };
  },
  computed: {
    ...mapGetters(["getThemeColors", "getDxDrs"]),
    ...mapState(["radiographer", "nurses", "radiographerBrief"]),
    multiSelectFuncName() {
      if (this.assignMode) return "設定放射師/護理師";
      return "編輯";
    },
    //
    //
    isCR() {
      //CR 判斷
      let dd = 0;
      if (this.Modality.toLowerCase() == "cr") {
        return true;
      }
      return false;
    },
    //
    //date picker 最小日期範圍
    minDate() {
      let now = new Date();
      now.setMonth(now.getMonth() - 12);
      return now;
    },
    //
    //date picker 最大日期範圍
    maxDate() {
      return new Date();
    },
    col4QueryResult() {
      return this.state4TodayList ? 8 : 12;
    },
    labRoomId() {
      let roomid = "";
      this.optionsLabRoom.some((r) => {
        if (r.value == this.selectedLabRoom) {
          roomid = r.text;
          return true;
        }
      });
      return roomid;
    },
    labRoomModality() {
      let Modality = null;
      this.optionsLabRoom.some((r) => {
        if (r.value == this.selectedLabRoom) {
          Modality = r.Modality;
          return true;
        }
      });
      return Modality;
    },
  },
  methods: {
    ...mapMutations([
      "SHOW_LOADING",
      "HIDE_LOADING",
      "SET_SIDE_MESSAGE",
      "SET_RADIOGRAPHER",
      "SET_NURSES",
      "SET_RADIOGRAPHER_BRIEF",
      "SET_DX_DR",
    ]),
    confirmKeyDown(evt, selected, options, ref) {
      const { keyCode } = evt;
      if (keyCode === 9 && evt.shiftKey) return;
      if (
        keyCode === 13
        // || keyCode === 9
      ) {
        setTimeout(() => {
          this.pickerUp({ ref, selected, options });
        }, 200);
      } else if (keyCode === 8 || keyCode === 46) {
        this.clearData(ref);
      }
    },
    async GetDxPhysician() {
      if (this.getDxDrs.length === 0) {
        const empDx = await getEmployeeDataByType("21,23,25,27,28,29");
        this.SET_DX_DR(empDx.result);
      }
    },
    pickerUp({ ref, selected, options, callback = null }) {
      const { flattenedItems } = this.$refs[ref];
      if (flattenedItems.length > 0) {
        this.$refs[ref].selectItem(flattenedItems[0]);

        setTimeout(() => {
          const nxtSibling = this.$refs[ref].$el.parentNode.nextElementSibling;
          if (nxtSibling) nxtSibling.querySelector("input[type=text]").focus();
          if (callback) callback();
        }, 200);
      }
    },

    handleApplyNoModal() {
      // accessionNo
      this.$refs.twp1.checkedItems.length = 0;
      this.$refs.twp1.Rows[0].TWPCheckBox1Value = true;
      this.$refs.twp1.AppendItemToChecked(this.$refs.twp1.Rows[0]);
      this.OpenMultiReport();

      // setTimeout(()=>{
      //   this.applyNoModal = false;
      // }, 2000);
      // this.accessionNo = '';
      // this.ClearConditions("selectedProgress");
    },
    getDailyCalendar() {
      this.showWorkingCalendar = !this.showWorkingCalendar;
    },
    //初始搜尋日期為今天
    setDefaultDate() {
      let today = new Date();
      this.DateRange = [
        new Date(today.setHours(0, 0, 0, 0)),
        new Date(today.setHours(23, 59, 59, 999)),
      ];
    },
    //
    //紀錄/補登 放射師, 護理師等資訊
    async SaveEmployees(refresh = true) {
      const convertToRealId = (key) =>
        this.radiographerBrief.short[key]
          ? this.radiographerBrief.short[key]
          : key;
      let dataBody = {
        AccessionNos: this.$refs.twp1.checkedItems.map(
          ({ AccessionNo }) => AccessionNo
        ),
      };

      this.grapherRefs.forEach(({ ref, key }) => {
        if (this.$refs[ref] && this.$refs[ref].value) {
          const _value =
            typeof this.$refs[ref].value === "object"
              ? this.$refs[ref].value.value
              : this.$refs[ref].value;
          dataBody[key] = convertToRealId(_value);
        }
      });

      // if (this.selectedRadiographer) dataBody.PerformRadiographer1Id = convertToRealId(this.selectedRadiographer.value || this.selectedRadiographer);

      // if ((this.isCR || this.Modality === "all") && this.selectedRadiographerQC) {
      //   dataBody.QcRadiographerId = convertToRealId(this.selectedRadiographerQC.value || this.selectedRadiographerQC);
      // }

      // if (!this.isCR && this.selectedRadiographer2) {
      //   dataBody.PerformRadiographer2Id = convertToRealId(this.selectedRadiographer2.value || this.selectedRadiographer2);
      // }

      // if (!this.isCR && this.selectedNurse) {
      //   const _nursId = (typeof this.selectedNurse === 'object') ? this.selectedNurse.value : this.selectedNurse
      //   dataBody.PerformNurseId = _nursId;
      // }

      // console.log({
      //   selectedRadiographer: this.selectedRadiographer,
      //   selectedRadiographer2: this.selectedRadiographer2,
      //   selectedRadiographerQC: this.selectedRadiographerQC,
      //   nurse: this.selectedNurse
      // });

      this.SHOW_LOADING();
      try {
        await saveEmployeeData(dataBody);
        this.$refs.twp1.OnForceRefresh();
        if (!refresh) {
          this.keepSleep = true;
        }
        this.SET_SIDE_MESSAGE({ msg: "資料已完成存檔作業" });
        this.$refs["twp1"].OnCancelAllSelects();
      } catch (err) {
        this.SET_SIDE_MESSAGE({
          msg: "存取時發生錯誤!\r\n! 請稍後再試.",
          type: 2,
        });
      } finally {
        this.HIDE_LOADING();
      }
    },
    //取得放射師列表
    async collectEmployeeSource() {
      // alert(this.radiographerBrief.length);
      if (Object.keys(this.radiographerBrief).length === 0) {
        const { result } = await getEmployeeCodeName();
        this.SET_RADIOGRAPHER_BRIEF(
          result.reduce(
            (a, { CodeName, EmployeeId }) => {
              a["long"] = { ...a["long"], [EmployeeId]: CodeName };
              a["short"] = { ...a["short"], [CodeName]: EmployeeId };
              return a;
            },
            { long: {}, short: {} }
          )
        );
      }

      this.GetOptionsRadiographer();
      this.GetOptionsNurse();
    },
    async GetOptionsRadiographer() {
      if (!this.radiographer.length) {
        const items = await this.getEmployeeData(35, true);
        this.SET_RADIOGRAPHER(items);
      }

      // SET_RADIOGRAPHER
      // this.optionsRadiographer = await this.getEmployeeData(35, true);
      //對應變更放射師2列表
      // this.ChangeRadiographer();
    },
    //取得護理師列表
    async GetOptionsNurse() {
      if (this.nurses.length === 0) {
        const _nurses = await this.getEmployeeData(55);
        this.SET_NURSES(_nurses);
      }
    },
    async getEmployeeData(type, brief = false) {
      const {
        actual: { Items },
      } = await getEmployeeDataByType(type);
      return Items.map(({ No, Name }) => ({
        text: Name,
        value:
          brief && this.radiographerBrief.long[No]
            ? this.radiographerBrief.long[No]
            : No,
      }));
    },
    //
    //放射師1變更, 連動變更放射師2列表 (對應移除已選過的放射師項目)
    ChangeRadiographer() {
      //放射師2連帶動作
      // if (this.selectedRadiographer != null) this.optionsRadiographer2 = this.optionsRadiographer.filter(i => i.value != this.selectedRadiographer);
      // else this.optionsRadiographer2 = this.optionsRadiographer;

      // if (this.selectedRadiographer == this.selectedRadiographer2) this.selectedRadiographer2 = null;

      //QC放射師連帶動作
      // if (this.selectedRadiographer != null) this.optionsRadiographerQC = this.optionsRadiographer.filter(i => i.value != this.selectedRadiographer);
      // else this.optionsRadiographerQC = this.optionsRadiographer;

      this.SaveLocalStorage(0);
      // localStorage.selectedRadiographer = this.selectedRadiographer ? this.selectedRadiographer : "";
      // this.dataStore.masterData.PerformRadiographer1Id = this.selectedRadiographer;
    },
    //
    //放射師2變更
    ChangeRadiographer2() {
      this.SaveLocalStorage(1);
      // localStorage.selectedRadiographer2 = this.selectedRadiographer2 ? this.selectedRadiographer2 : "";
      // this.dataStore.masterData.PerformRadiographer2Id = this.selectedRadiographer2;
    },
    //
    //QC放射師變更
    ChangeRadiographerQC() {
      this.SaveLocalStorage(2);
      // localStorage.selectedRadiographer2 = this.selectedRadiographer2 ? this.selectedRadiographer2 : "";
      // this.dataStore.masterData.QcRadiographerId = this.selectedRadiographerQC;
    },
    //
    //護理師變更
    ChangeNurse() {
      this.SaveLocalStorage(3);
      // localStorage.selectedNurse = this.selectedNurse ? this.selectedNurse : "";
      // this.dataStore.masterData.PerformNurseId = this.selectedNurse;
    },
    //
    //儲存檢查室 放射師 護理師
    //type=> 0: 放射師1, 1:放射師2, 2:QC放射師, 3:護理師
    SaveLocalStorage(type) {
      let params = this.GetLocalStorage();
      if (type == 0) {
        params.PerformRadiographer1Id = this.selectedRadiographer
          ? this.selectedRadiographer
          : "";
      } else if (type == 1) {
        params.PerformRadiographer2Id = this.selectedRadiographer2
          ? this.selectedRadiographer2
          : "";
      } else if (type == 2) {
        params.QcRadiographerId = this.selectedRadiographerQC
          ? this.selectedRadiographerQC
          : "";
      } else if (type == 3) {
        params.PerformNurseId = this.selectedNurse ? this.selectedNurse : "";
      }

      localStorage.setItem(
        "FI0202-" + this.selectedLabRoom,
        JSON.stringify(params)
      );
    },
    //
    //取得檢查室 放射師 護理師
    GetLocalStorage() {
      let params = JSON.parse(
        localStorage.getItem("FI0202-" + this.selectedLabRoom)
      );

      if (params) {
        params.PerformRadiographer1Id =
          params.PerformRadiographer1Id && params.PerformRadiographer1Id != ""
            ? params.PerformRadiographer1Id
            : null;
        params.PerformRadiographer2Id =
          params.PerformRadiographer2Id && params.PerformRadiographer2Id != ""
            ? params.PerformRadiographer2Id
            : null;
        params.QcRadiographerId =
          params.QcRadiographerId && params.QcRadiographerId != ""
            ? params.QcRadiographerId
            : null;
        params.PerformNurseId =
          params.PerformNurseId && params.PerformNurseId != ""
            ? params.PerformNurseId
            : null;
      } else {
        params = {
          PerformRadiographer1Id: null,
          PerformRadiographer2Id: null,
          QcRadiographerId: null,
          PerformNurseId: null,
        };
      }
      return params;
    },
    //判斷
    checkIfDisableOpButton2Func() {
      return false;
    },
    //
    //hide dialog
    CloseDialogStateBack() {
      this.$refs.dialogBackState.hide();
    },
    //取消登錄
    Click4StateBack(list = null) {
      // if(!this.CheckIfRadiographerSelected()){
      // 	return
      // }
      let subPath = "/exam/CheckInBack";
      let accessionNos = list ? [...list] : [this.itemToBackState.AccessionNo];
      let _this = this;
      if (this.useWebSocket) {
        this.hubProxy
          .invoke(
            "checkInBack",
            accessionNos,
            false,
            this.$store.state.Profile4User.JWTToke
          )
          .then((e) => {
            if (e.Success) {
              this.SET_SIDE_MESSAGE({ msg: "資料已完成作業" });
              _this.CloseDialogStateBack();
              _this.$refs.twp1.OnForceRefresh();

              if (list && list.length > 0) this.$refs.daily.reFreshData(); // 代表是daily COMPONENT 傳進來的
            } else {
              _this.SET_SIDE_MESSAGE({
                msg: "錯誤1:" + e.Message + "! 請稍後再試.",
                type: 2,
              });
            }
          })
          .fail(function (error) {
            _this.SET_SIDE_MESSAGE({
              msg: "錯誤2:" + error + "! 請稍後再試.",
              type: 2,
            });
          });
      } else {
        let opStatus = false;
        let opResult = "存取時發生錯誤!\r\n";
        window.axios
          .put(subPath, accessionNos)
          .then((e) => {
            opStatus = true;
          })
          .catch(function (error) {
            opStatus = false;
            opResult += error;
          });

        this.HIDE_LOADING();
        //
        if (opStatus) {
          this.SET_SIDE_MESSAGE({ msg: "資料已完成存檔作業" });
        } else {
          this.SET_SIDE_MESSAGE({ msg: opResult + "! 請稍後再試.", type: 2 });
        }
      }
    },
    //
    //double check 取消登錄
    ShowDialogBackState() {
      this.$refs.dialogBackState.show();
    },
    //變更condition直接Search
    ChangeConditions() {
      this.SearchConditions();
    },
    //
    //儲存頁面搜尋參數
    StoreSearchConditions() {
      // window.checkOp_selectedProgress = this.selectedProgress;
      this.backObj.selectedProgress = this.selectedProgress;
      this.backObj.accessionNo = this.accessionNo;
      this.backObj.hospitalNo = this.hospitalNo;
      this.backObj.selectedPatientSource = this.selectedPatientSource;
      this.backObj.selectedCheckItem = this.selectedCheckItem;
      this.backObj.emergencySelected = this.emergencySelected;
      this.backObj.DateRange = this.DateRange;
    },
    givingSelectionValue(item) {
      const itemValue =
        typeof item === "object" && item["value"] ? item.value : item || "";
      return this.radiographerBrief.long &&
        this.radiographerBrief.long.hasOwnProperty(itemValue)
        ? this.radiographerBrief.long[itemValue]
        : itemValue;
    },
    //
    //取回已暫存頁面搜尋參數
    initUiParams() {
      // if (window.checkOp_selectedProgress) {
      //   this.selectedProgress = window.checkOp_selectedProgress;
      // }
      let _this = this;
      let d = this.$route.params.backObj;
      if (d && d.selectedProgress) this.selectedProgress = d.selectedProgress;
      // if (d && d.accessionNo) this.accessionNo = d.accessionNo;
      if (d && d.hospitalNo) this.hospitalNo = d.hospitalNo;
      if (d && d.selectedPatientSource)
        this.selectedPatientSource = d.selectedPatientSource;
      if (d && d.selectedCheckItem)
        this.selectedCheckItem = d.selectedCheckItem;
      if (d) this.emergencySelected = d.emergencySelected;
      if (d && d.DateRange) this.DateRange = d.DateRange;
      // if (d && d.ToPage)
      //   this.$nextTick(() => {
      //     _this.$refs.twp1.toPage = d.ToPage;
      //     _this.$refs.twp1.PagingCurrentPage = d.ToPage;
      //   });

      let params = this.GetLocalStorage();
      // const givingSelectionValue = (item) => {
      //   const itemValue = (typeof item === 'object' && item['value'])
      //     ? item.value
      //     : (item || '');
      //   return this.radiographerBrief.long && this.radiographerBrief.long.hasOwnProperty(itemValue)
      //     ? this.radiographerBrief.long[itemValue]
      //     : itemValue;

      this.hideMode = true;
      //放射師1
      if (params.PerformRadiographer1Id) {
        // alert(givingSelectionValue(params.PerformRadiographer1Id));
        this.selectedRadiographer = this.givingSelectionValue(
          params.PerformRadiographer1Id
        );
        if (this.selectedRadiographer && this.$refs.radioGrapher1)
          this.$refs.radioGrapher1.selectItem(
            this.radiographer.find(
              ({ value }) => value === this.selectedRadiographer
            )
          );
      }

      //放射師2
      if (params.PerformRadiographer2Id) {
        if (
          this.Modality &&
          (this.Modality.toLowerCase().includes("ct") ||
            this.Modality.toLowerCase().includes("mr"))
        ) {
          this.selectedRadiographer2 = this.givingSelectionValue(
            params.PerformRadiographer2Id
          );
          if (this.selectedRadiographer2 && this.$refs.radioGrapher2)
            this.$refs.radioGrapher2.selectItem(
              this.radiographer.find(
                ({ value }) => value === this.selectedRadiographer2
              )
            );
        }
      }

      //放射師QC
      if (params.QcRadiographerId) {
        if (this.Modality && this.Modality.toLowerCase().includes("cr")) {
          this.selectedRadiographerQC = this.givingSelectionValue(
            params.QcRadiographerId
          );
          if (this.selectedRadiographerQC && this.$refs.radioGrapherQC)
            this.$refs.radioGrapherQC.selectItem(
              this.radiographer.find(
                ({ value }) => value === this.selectedRadiographerQC
              )
            );
        }
      }

      if (params.PerformNurseId) {
        //護理師
        this.selectedNurse = this.givingSelectionValue(params.PerformNurseId);

        if (this.selectedNurse && this.$refs.nurse)
          this.$refs.nurse.selectItem(
            this.nurses.find(({ value }) => value === this.selectedNurse)
          );
      }

      setTimeout(() => {
        this.hideMode = false;
      }, 700);
    },
    socketChangeStatus(exam, type) {
      if (type === "hubProxy") {
        exam.some((e) => {
          if (this.selectedLabRoom == e) {
            this.$refs.twp1.OnForceRefresh();
            return true;
          }
        });
      } else if (type === "bookingProxy") {
        this.$refs.daily.reFreshData();
      }
    },
    //
    //讀取讀卡機
    initWebSocket() {
      let _this = this;
      let input_element = document.getElementById("inputAccessionNo");
      let element_isFocused = document.activeElement === input_element;
      if (!element_isFocused) return;

      if (this.accessionNo && this.accessionNo.length > 0) return;
      let connection;
      connection = new WebSocket("ws://localhost:10008/Read");
      connection.onopen = function () {
        connection.send("checkNhiCard");
      };
      connection.onerror = function (e) {
        this.accessionNo = "";
      };
      connection.onmessage = function (e) {
        if (e.data.indexOf("Error:") < 0) {
          let pic = e.data.substr(32, 10);
          _this.accessionNo = pic;
          _this.SearchConditions();
        } else {
          _this.accessionNo = "";
          if (
            _this.accessionNo !== e.data &&
            e.data === "Error:此晶片卡非健保卡！"
          )
            _this.accessionNo = e.data;
        }
      };
    },
    //keypressed偵測
    HKWatch(event) {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        // //粗體Method自定義
        this.SearchConditions();
      }
    },
    //
    //取消firstCheckItem
    ResetFirstCheckItem() {
      this.canceledFirstCheckedItem = this.firstCheckedItem;
      this.firstCheckedItem = null;
    },
    //
    //header checkbox 勾選後 若為取消 將firstCheckedItem設為null
    //
    OnHeaderCheckBoxChange(checked) {
      if (!checked) this.ResetFirstCheckItem();
    },
    //
    //twp list判斷item是否顯示checkbox, 此處判斷item patient id是否和已選的item相同,
    //一單多檢的多選判斷
    CheckIfIdMatchMuitiSelect(item) {
      // if (item.Status === '71') return false;
      if (this.firstCheckedItem == null) {
        // 如果order number相同 (X光類型 一單多檢, 幫其checkbox 取消打勾)
        // if (
        //   this.canceledFirstCheckedItem &&
        //   this.canceledFirstCheckedItem.OrderNo == item.OrderNo
        // ) {
        //   item.TWPCheckBox1Value = false;
        // }
        return true;
      }
      return item.PatientId == this.firstCheckedItem.PatientId;
      // 如果order number相同 (X光類型 一單多檢, 幫其checkbox打勾)
      // if (this.firstCheckedItem.OrderNo == item.OrderNo) {
      //   item.TWPCheckBox1Value = true;
      // }
    },
    //
    //判斷是否顯示header的checkbox, 如果list的content 皆為同patient id,
    //或 已點某筆item 判斷出相同patient id之row, 則顯示
    CheckIfShowHeaderCheckBox(items) {
      //選擇放射師模式下, checkbox功能 正常呈現, 不做其他參數判斷
      if (this.assignMode) return true;
      let _this = this;
      var fail = false;
      if (!items) return false;
      if (this.firstCheckedItem == null) {
        let pid = null;
        fail = items.some((element) => {
          if (pid === null) pid = element.PatientId;

          if (pid !== element.PatientId) return true;
        });
      } else {
        fail = items.some((element) => {
          if (
            element.showCheckBox &&
            element.PatientId !== _this.firstCheckedItem.PatientId
          ) {
            return true;
          }
        });
      }
      if (fail) return false;
      else return true;
    },
    //
    //twp list單筆item 編輯觸發
    OnBackState(x, srcParamId) {
      console.log(`Row Function Button Clicked. (${x.cid})`);
      this.ShowDialogBackState();
      this.itemToBackState = x;
      // let roomName = this.labRoomId;
      // window.examRoomData = {
      //   labRoomId: roomName,
      //   patientData: [x],
      //   backObj: this.backObj
      // };
      // this.$router.replace({
      //   name: "FI0202",
      //   params: {
      //     hubProxy: this.hubProxy
      //   }
      // });
    },
    //
    //twp list單筆item 編輯觸發
    RowClickFunction(x, srcParamId) {
      let roomName = this.labRoomId;
      window.examRoomData = {
        labRoomId: roomName,
        patientData: [x],
        selectedLabRoom: this.selectedLabRoom,
      };
      this.backObj.ToPage = this.$refs.twp1.toPage;

      this.$router.replace({
        name: "FI0202",
        params: {
          hubProxy: this.hubProxy,
          backObj: this.backObj,
        },
      });
    },
    //單一item的checkbox點擊觸發
    itemChecked(item) {
      //設定放射師模式, 不對checkbox進行 orderNo判斷, 也不暫存第一次選擇的item.
      if (this.assignMode) {
        return;
      }
      let _this = this;
      if (item.TWPCheckBox1Value === true) {
        if (this.firstCheckedItem == null) this.firstCheckedItem = item;
        // console.log("============================Fist selected item:" + item.AccessionNo);
        this.$refs.twp1.Rows.forEach((i) => {
          if (i.OrderNo == item.OrderNo) {
            i.TWPCheckBox1Value = item.TWPCheckBox1Value;
            if (i.TWPCheckBox1Value) _this.$refs.twp1.AppendItemToChecked(i);
            else _this.$refs.twp1.RemoveItemFromChecked(i);
          }
        });
      } else {
        this.$refs.twp1.Rows.forEach((i) => {
          if (i.OrderNo == item.OrderNo) {
            i.TWPCheckBox1Value = item.TWPCheckBox1Value;
            if (i.TWPCheckBox1Value) _this.$refs.twp1.AppendItemToChecked(i);
            else _this.$refs.twp1.RemoveItemFromChecked(i);
          }
        });
      }
    },
    async ConfirmAssignReport() {
      if (!this.selectedAssignDoctor) {
        this.SET_SIDE_MESSAGE({ msg: "請選擇分派醫師", type: 2 });
        return;
      }
      // 報告存檔 - 後台存取

      const AccessionNos = this.$refs["twp1"].Rows.filter(
        ({ Status, TWPCheckBox1Value }) =>
          TWPCheckBox1Value && !["63", "71"].some((num) => num == Status)
      ).map(({ AccessionNo }) => AccessionNo);

      if (AccessionNos.length === 0) {
        this.SET_SIDE_MESSAGE({ msg: "所勾選的報告不可都為撰寫報告", type: 2 });
        return;
      }
      this.SHOW_LOADING();
      const data = {
        ReportPhysicianId: this.selectedAssignDoctor,
        AccessionNos,
      };
      try {
        await examAssignReport(data);
        this.SET_SIDE_MESSAGE({ msg: "已完成分派作業" });
        this.CancelAssignReport();
        this.$refs["twp1"].OnCancelAllSelects();
      } catch (err) {
        this.SET_SIDE_MESSAGE({ msg: opResult + "! 請稍後再試.", type: 2 });
      } finally {
        this.HIDE_LOADING();
      }
    },
    CancelAssignReport() {
      this.$refs.win4assignReport.hide();
    },
    popupDxPhysician() {
      this.$refs.win4assignReport.show();
    },
    //
    //多筆item勾選後 點編輯觸發
    OpenMultiReport(items) {
      if (this.$refs.twp1 === undefined) {
        console.log(this.$logs("Fail to refrence twp1"));
        return;
      }

      if (this.assignMode) {
        // ['selectedRadiographer', 'selectedRadiographer2', 'selectedRadiographerQC', 'selectedNurse'].

        if (
          this.isCR &&
          (!this.selectedRadiographer || this.selectedRadiographer == "") &&
          (!this.selectedRadiographerQC || this.selectedRadiographerQC == "")
        ) {
          this.SET_SIDE_MESSAGE({ msg: "請選擇要設定的放射師!", type: 2 });
        } else if (
          !this.isCR &&
          (!this.selectedRadiographer || this.selectedRadiographer == "") &&
          (!this.selectedRadiographer2 || this.selectedRadiographer2 == "") &&
          (!this.selectedNurse || this.selectedNurse == "")
        ) {
          this.SET_SIDE_MESSAGE({
            msg: "請選擇要設定的放射師和護理師!",
            type: 2,
          });
        } else if (
          this.Modality === "all" &&
          (!this.selectedRadiographer || !this.selectedRadiographerQC)
        ) {
          //  || !this.selectedRadiographer2
          this.SET_SIDE_MESSAGE({
            msg: "請選擇要設定的放射師和護理師!",
            type: 2,
          });
        } else {
          this.SaveEmployees(!!items);
        }
      } else {
        let dataList = this.$refs.twp1.checkedItems;
        let roomName = this.labRoomId;
        window.examRoomData = {
          labRoomId: roomName,
          patientData: dataList,
        };

        this.backObj.ToPage = this.$refs.twp1.toPage;
        this.$router.replace({
          name: "FI0202",
          params: {
            hubProxy: this.hubProxy,
            backObj: this.backObj,
          },
          // params: { labRoomId: roomName, patientData: dataList }
        });
        console.log(this.$logs("Passed item count: " + dataList.length));
      }
    },
    //
    //按下變更檢查室鍵
    OnClickChangeLabRoom(item) {
      //初始化可變更檢查室列表
      this.tempAccessionNo = item.AccessionNo;
      this.changeOptionsLabRoom = [{ value: null, text: "請選擇" }];
      this.selectedChangeRoom = null;
      this.ChangeLabRoom(item);
    },
    //
    //變更檢查室
    ChangeLabRoom(item) {
      //取得mergeItemId
      // console.log(this.$logs());
      let _this = this;
      this.SHOW_LOADING();
      // let opStatus = false;
      let itemPack = null;
      // let checkItemArr = [];
      // items.forEach(i => {
      //   checkItemArr.push(i.ProcedureCode);
      // });
      // let checkItems = checkItemArr.join(",");
      let subPath =
        "../checkItem/MargeCheckItem?checkItems=" +
        item.ProcedureCode +
        "&isNo=true";
      new DataManager({
        url: configs.publicPath + subPath,
        adaptor: new WebApiAdaptor(),
        crossDomain: true,
      })
        .executeQuery(new Query())
        .then(async (r) => {
          itemPack = r.actual; //資料;
          let promises = [];
          itemPack.forEach((i) => {
            promises.push(_this.GetLabRoomChangeOptions(i, item));
          });
          await Promise.all(promises);
          // opStatus = true;
          this.HIDE_LOADING();
        })
        .catch((e) => {
          this.SET_SIDE_MESSAGE({
            msg: "變更檢查室失敗! 請稍後再試.",
            type: 2,
          });
          this.HIDE_LOADING();
        });
    },
    //
    //取得可選檢查室列表
    async GetLabRoomChangeOptions(obj, item) {
      //取得mergeItemId
      // console.log(this.$logs());
      let _this = this;
      let opStatus = false;
      let itemPack = null;
      let subPath =
        "../checkItem/RoomNoList?type=" + obj.Type + "&id=" + obj.Id;
      //
      await new DataManager({
        url: configs.publicPath + subPath,
        adaptor: new WebApiAdaptor(),
        crossDomain: true,
      })
        .executeQuery(new Query())
        .then((r) => {
          itemPack = r.actual; //資料;
          opStatus = true;

          itemPack.Items.forEach((i) => {
            if (i.No != this.selectedLabRoom) {
              let collection = { value: i.No, text: i.Name };
              _this.changeOptionsLabRoom.push(collection);
            }
          });

          if (this.changeOptionsLabRoom.length > 1) {
            this.$refs.changeRoomModal.show();
            // this.$refs.changeRoomModal.id = item.AccessionNo;
            // this.tempAccessionNo = item.AccessionNo;
          } else {
            this.SET_SIDE_MESSAGE({
              msg: "目前沒有其他檢查室可以變更",
              type: 2,
            });
          }
        })
        .catch((e) => {
          let msg = e.error;
          this.SET_SIDE_MESSAGE({
            msg: "取得檢查室變更列表失敗! 請稍後再試. <" + msg + ">",
            type: 2,
          });
        });
    },
    //
    //確認變更檢查室
    async ConfirmChangeRoom() {
      if (this.selectedChangeRoom == null) {
        this.SET_SIDE_MESSAGE({ msg: "請選擇檢查室", type: 2 });
        return;
      }
      //取得mergeItemId
      // console.log(this.$logs());
      let _this = this;
      let opStatus = false;
      //
      let itemPack = null;
      //
      this.SHOW_LOADING();

      let subPath = "/exam/AssignRoom";
      // let accessionNo = this.$refs.changeRoomModal.id;
      let dataBody = {
        RoomNo: this.selectedChangeRoom,
        AccessionNos: [this.tempAccessionNo],
      };
      this.tempAccessionNo = "";
      if (this.useWebSocket) {
        try {
          const hubResult = await this.hubProxy.invoke(
            "assignRoom",
            dataBody,
            this.$store.state.Profile4User.JWTToke
          );

          if (hubResult.Success) {
            itemPack = hubResult.Exams; //資料;
            opStatus = true;
            let message = "";
            itemPack.forEach((i) => {
              message += i.AccessionNo + "\r\n";
            });
            this.SET_SIDE_MESSAGE({
              msg: "以下單號已完成檢查室變更:\n" + message,
              type: 1,
            });
            this.HIDE_LOADING();

            this.$refs.changeRoomModal.hide();
            this.$refs.twp1.OnForceRefresh();
          } else {
            this.HIDE_LOADING();
            this.SET_SIDE_MESSAGE({
              msg: "檢查室變更失敗! 請稍後再試. <" + e.Message + ">",
              type: 2,
            });
          }
        } catch (err) {
          this.HIDE_LOADING();
          this.SET_SIDE_MESSAGE({
            msg: "檢查室變更失敗! 請稍後再試. <" + err + ">",
            type: 2,
          });
        }
      } else {
        try {
          itemPack = await window.axios.put(subPath, dataBody);
          opStatus = true;
          let message = "";
          itemPack.forEach((i) => {
            message += i.AccessionNo + "\r\n";
          });
          this.SET_SIDE_MESSAGE({
            msg: "以下單號已完成檢查室變更:\n" + message,
            type: 1,
          });
          this.HIDE_LOADING();
          this.$refs.changeRoomModal.hide();
          this.$refs.twp1.OnForceRefresh();
        } catch (e) {
          let message = e.error;
          this.SET_SIDE_MESSAGE({
            msg: "檢查室變更失敗! 請稍後再試. <" + message,
            type: 2,
          });
          this.HIDE_LOADING();
        }
      }
      this.$refs.changeRoomModal.hide();
      this.$refs.twp1.OnForceRefresh();
    },
    //
    //確認變更檢查室
    CancelChangeRoom() {
      this.tempAccessionNo = "";
      this.$refs.changeRoomModal.hide();
    },
    //
    //條件查詢
    SearchConditions() {
      console.log("----------searchConditions-------------");
      this.StoreSearchConditions();
      this.$refs["twp1"].OnForceRefresh();
    },
    //
    //清除條件查詢
    ClearConditions(except = null) {
      [
        "emergencySelected",
        "accessionNo",
        "hospitalNo",
        "DateRange",
        "personId",
        "selectedCheckItem",
        "selectedPatientSource",
        "selectedProgress",
      ].forEach((k) => {
        if (except === k) {
          console.log(k);
        } else if (k === "DateRange") {
          this[k] = [null, null];
        } else if (k === "selectedProgress") {
          this[k] = CHECKED_IN;
        } else {
          this[k] = null;
        }
      });

      this.clearOptions();
    },
    clearOptions(ref) {
      this.hideMode = true;
      setTimeout(() => {
        this.grapherRefs.forEach(({ ref, key, data }) => {
          // console.log("-------------------" + data);
          if (this.$refs[ref]) {
            try {
              this[data] = null;
              this.$refs[ref].clearSelection();
            } catch (error) {
              console.log(error);
            }
          }
        });
      }, 0);
      setTimeout(() => {
        this.hideMode = false;
      }, 700);
    },
    clearData(refVal) {
      // this.hideMode = true;
      setTimeout(() => {
        this.grapherRefs.forEach(({ ref, key, data }) => {
          if (ref == refVal && this.$refs[ref]) {
            try {
              this[data] = null;
              this.$refs[ref].clearSelection();
              this.$refs[ref].hideDropdown();
            } catch (error) {
              console.log(error);
            }
          }
        });
      }, 0);
      // setTimeout(() => {
      //   this.hideMode = false;
      // }, 700);
    },
    //取得檢查室列表
    async GetOptionsLabRoom() {
      let itemPack = null;
      const subPath = "../Room/SelectNoList";
      this.SHOW_LOADING();
      try {
        const res = await new DataManager({
          url: configs.publicPath + subPath,
          adaptor: new WebApiAdaptor(),
          crossDomain: true,
        }).executeQuery(new Query());
        itemPack = res.actual; //資料;
        itemPack.Items.sort((a, b) => {
          if (a.Name > b.Name) return 1;
          else if (a.Name < b.Name) return -1;
          else return 0;
        });

        this.optionsLabRoom = [
          { value: null, text: "請選擇", Modality: null },
          { value: "all", text: "全部", Modality: "all" },
        ].concat(
          itemPack.Items.map(({ No, Name, Modality }) => ({
            value: No,
            text: Name,
            Modality,
          }))
        );
        this.HIDE_LOADING();
        this.ReloadDataContent();
      } catch (err) {
        this.SET_SIDE_MESSAGE({ msg: err + "! 請稍後再試.", type: 2 });
      }
    },
    //
    //取得檢查項目列表
    async GetOptionsCheckItem() {
      // if (this.selectedLabRoom == null) {
      //   console.log(this.$logs("檢查室尚未選擇, 無法取得檢查項目列表"));
      //   return;
      // }
      // console.log(this.$logs());
      //
      let itemPack = null;
      let convertedCollections = [];
      //
      let subPath = "../Room/CheckItems?no=" + this.selectedLabRoom;
      //
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
      this.optionsCheckItem = convertedCollections;
    },
    //
    //取得病患來源列表
    async GetOptionsPatientSource() {
      // console.log(this.$logs());
      //
      let itemPack = null;
      let convertedCollections = [{ value: null, text: "請選擇" }];
      //
      let subPath = "../GeneralData/SelectNoList?groupNo=PatientSource";
      //
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
      this.optionsPatientSource = convertedCollections;
    },
    getSpecificGrapher(name) {
      const opt = name
        ? this.radiographer.find(({ text }) => name === text)
        : "";

      console.log(this.radiographer, name);
      return opt ? opt.value : "";
    },
    //
    //list選單撈取資料
    async GetDataContent(index, toPage, nPerPage) {
      //無選取檢查室則跳出
      if (
        this.selectedLabRoom == null ||
        this.selectedLabRoom == undefined ||
        this.optionsLabRoom.length == 0
      )
        return { Items: null, Count: 0 };
      let itemPack = null;
      //判別日期查詢 (日期查詢無法寫在query物件裡, 只好從url帶參數)
      let subPath = "../exam/List";
      if (
        this.DateRange &&
        (this.DateRange[0] != null || this.DateRange[1] != null)
      ) {
        let dateCondition = "";
        if (this.DateRange[0] != null)
          dateCondition +=
            "scheduleTimeStart=" + this.DateRange[0].toJSON() + "&";
        if (this.DateRange[1] != null)
          dateCondition += "scheduleTimeEnd=" + this.DateRange[1].toJSON();
        subPath += "?" + dateCondition;
      } else {
        let md = this.DateToString(this.minDate, false);
        let nd = this.DateToString(this.maxDate, false);
        let dateCondition = "";
        dateCondition += "scheduleTimeStart=" + md + "&";
        dateCondition += "scheduleTimeEnd=" + nd;
        subPath += "?" + dateCondition;
      }

      if (this.selectedProgress != null) {
        if (subPath.includes("?")) {
          subPath += "&status=" + this.selectedProgress;
        } else {
          subPath += "?status=" + this.selectedProgress;
        }
      } else {
        if (subPath.includes("?")) {
          subPath +=
            "&status=" +
            CHECKED_IN +
            "," +
            CHECK_INPROCESS +
            "," +
            EXAM_FINISHED;
        } else {
          subPath +=
            "?status=" +
            CHECKED_IN +
            "," +
            CHECK_INPROCESS +
            "," +
            EXAM_FINISHED;
        }
      }

      //檢驗狀態
      // if (this.selectedProgress != null) {
      //   query = query.where("Status", "equal", this.selectedProgress);
      // } else {
      //   let predicateState = new Predicate("Status", "equal", CHECKED_IN);
      //   predicateState = predicateState.or("Status", "equal", CHECK_INPROCESS);
      //   predicateState = predicateState.or("Status", "equal", EXAM_FINISHED);
      //   query = query.where(predicateState);
      // }
      this.SHOW_LOADING();
      let opStatus = false;

      const result = await new DataManager({
        url: configs.publicPath + subPath,
        adaptor: new WebApiAdaptor(),
        crossDomain: true,
      })
        //Query物件 包含search conditions //TODO 這裡帶的都是假變數, 確認真實狀況後變更
        .executeQuery(
          this.getDataQuery().sortBy("ScheduleTime").page(toPage, nPerPage)
        );

      itemPack = result.actual;
      opStatus = true;

      if (itemPack.Items && itemPack.Items.length > 0) {
        itemPack.Items.forEach((i) => {
          i.OrderDate = this.DateToString(i.OrderDate, false);
          i.ScheduleTime = this.DateToString(i.ScheduleTime, true);
          i.ProcedureNameStr = i.ProcedureName;
          if (i.ProcedureName instanceof Array) {
            i.ProcedureNameStr = i.ProcedureName.join(",");
          }
        });

        //Sort 1: 檢查日期 降冪   2: 狀態: 升密
        itemPack.Items.sort((a, b) => {
          return b.ScheduleTime - a.ScheduleTime || a.Status - b.Status;
        });
      }
      this.HIDE_LOADING();

      if (opStatus) {
        // 如果是accessionNo 直接search, search後直接進入檢查室操作頁
        if (
          this.accessionNo &&
          this.accessionNo.length > 0 &&
          itemPack.Items.length > 0
        ) {
          if (this.assignMode) {
            if (this.$refs.twp1.Rows[0]) {
              this.selectedRadiographer2 = "";
              this.selectedNurse = "";
              const { PerformRadiographer1Name, QcRadiographerName } =
                this.$refs.twp1.Rows[0];
              this.selectedRadiographer = this.getSpecificGrapher(
                PerformRadiographer1Name
              );
              this.selectedRadiographerQC =
                this.getSpecificGrapher(QcRadiographerName);
            }
            if (this.keepSleep) {
              this.keepSleep = false;
            } else {
              this.applyNoModal = true;
            }
          } else {
            this.RowClickFunction(itemPack.Items[0], 0);
          }
        }
      } else {
        this.SET_SIDE_MESSAGE({ msg: "無法取得資料! 請稍後再試.", type: 2 });
      }

      return itemPack;
    },
    getDataQuery: function () {
      let query = new Query();
      //startsWith, endsWith, contains, equal, notEqual, greaterThan, greaterThanOrEqual, lessThan, lessThanOrEqual
      // alert(this.selectedLabRoom);

      //檢查室
      if (
        this.selectedLabRoom != null &&
        this.selectedLabRoom != "" &&
        this.selectedLabRoom !== "all"
      )
        query = query.where("ScheduleLocation", "equal", this.selectedLabRoom);

      //申請單號
      if (this.accessionNo != null && this.accessionNo != "")
        query = query.where(
          "AccessionNo",
          "contains",
          this.accessionNo.trim(),
          true
        );

      //病歷號
      if (this.hospitalNo != null && this.hospitalNo != "")
        query = query.where("PatientId", "contains", this.hospitalNo);

      //身分證號
      if (this.personId != null && this.personId != "")
        query = query.where(
          "OtherPatientId",
          "contains",
          this.personId.trim(),
          true
        );

      //病患來源
      if (
        this.selectedPatientSource != null &&
        this.selectedPatientSource != ""
      )
        query = query.where(
          "PatientSourceTypeCode",
          "contains",
          this.selectedPatientSource
        );

      //急作
      if (this.emergencySelected != null)
        query = query.where("EmgFlag", "equal", this.emergencySelected);

      //檢查項目代碼
      if (this.selectedCheckItem != null && this.selectedCheckItem.length > 0) {
        let predicateState = null;
        this.selectedCheckItem.forEach((i) => {
          if (!predicateState)
            predicateState = new Predicate(
              "ProcedureCode",
              "contains",
              i.value
            );
          else
            predicateState = predicateState.or(
              "ProcedureCode",
              "contains",
              i.value
            );
        });
        query = query.where(predicateState);
      }
      //檢驗狀態
      // if (this.selectedProgress != null) {
      //   query = query.where("Status", "equal", this.selectedProgress);
      // } else {
      //   let predicateState = new Predicate("Status", "equal", CHECKED_IN);
      //   predicateState = predicateState.or("Status", "equal", CHECK_INPROCESS);
      //   predicateState = predicateState.or("Status", "equal", EXAM_FINISHED);
      //   query = query.where(predicateState);
      // }

      /*if (dtRange != null && dtRange.length > 0) {
        query = query.where("StaffStatus", "equal", e.StaffStatus);
      }*/
      return query;
    },
    ReloadDataContent() {
      this.selectedCheckItem = null;
      //判斷暫存的檢查室No. 是否存在於 optionsLabRoom,
      //若不存在, 則不進行 資料載入
      if (
        !this.optionsLabRoom.some((i) => {
          return i.value == this.selectedLabRoom;
        })
      )
        return;

      localStorage.selectedLabRoom = this.selectedLabRoom;
      this.GetOptionsCheckItem();
      this.$refs.twp1.OnForceRefresh();
      this.Modality = this.labRoomModality;
      //更新UI參數 (放射師 等資訊)
      // this.clearOptions();
      //若檢查室為X光類型, 預設為assignMode
      if (
        this.Modality &&
        (this.Modality.toLowerCase().includes("cr") ||
          this.Modality.toLowerCase().includes("all"))
      ) {
        this.$refs.assignModeToggle.toggled = true;
        this.assignMode = true;

        //依照Modality 變更table header欄位 (CR不用護理師, 其餘類型不用QC放射師)
        this.tableConfig4QueryResult = configCollection.filter((i) => {
          return i.key != "PerformNurseName";
        });
      } else {
        this.$refs.assignModeToggle.toggled = false;
        this.assignMode = false;
        // setTimeout(() => {
        // }, 250);

        //依照Modality 變更table header欄位 (CR不用護理師, 其餘類型不用QC放射師)
        this.tableConfig4QueryResult = configCollection.filter((i) => {
          return i.key != "QcRadiographerName";
        });
      }
      this.initUiParams();
    },
    SetFocusOnInputAccessionNo() {
      //console.log(this.$logs('setFocus'))
      // setTimeout(() => {
      //   //console.log(this.$logs('setFocus.inner'))
      //   this.$nextTick(() => this.$refs["inputAccessionNo"].focus());
      // }, 1000);
    },
  },
  created() {
    // console.log(this.$logs('on', methodName))
    this.ConnectionHubConnection();
    //帶入暫存搜尋參數

    //初始搜尋日期為今天
    this.setDefaultDate();
    window.addEventListener("keydown", this.HKWatch); //粗體Method自定義
    if (this.selectedLabRoom == null && localStorage.selectedLabRoom)
      this.selectedLabRoom = localStorage.selectedLabRoom;
    // 取得 App.vue 參照
    this.tableConfig4QueryResult = configCollection; //queryResult.PresentConfig()
    //this.tableContent4QueryResult = queryResult.DataSet()
    this.tableConfig4TodayList = todayList.PresentConfig();
    this.tableContent4TodayList = todayList.DataSet();
    this.GetOptionsCheckItem(); //checkItem.Options()
    this.GetOptionsPatientSource();
    //this.optionsPatientSource = patientSource.Options()
    this.GetOptionsLabRoom();
    this.collectEmployeeSource();
    //this.optionsLabRoom = labRoomList.Options()
    this.optionsOpProgress = [
      { value: CHECKED_IN, text: "櫃台報到" },
      { value: CHECK_INPROCESS, text: "檢查中" },
      { value: EXAM_FINISHED, text: "檢查完畢暨其後狀態" },
    ];

    //讀取檢查室作業返回的資料
    // let d = (this.backObj = this.$route.params.backObj);
    // if (d !== undefined) {
    //   this.selectedLabRoom = d.ScheduleLocation;
    //   this.performRadiographer1Id = d.PerformRadiographer1Id;
    //   this.performRadiographer2Id = d.PerformRadiographer2Id;
    //   this.performNurseId = d.PerformNurseId;
    // }
    this.GetDxPhysician();

    //畫面自動呼叫讀卡機程式 抓取讀卡機資料
    setInterval(() => {
      this.initWebSocket();
    }, 5000);
  },
  mounted() {
    //focus到病歷號上
    this.SetFocusOnInputAccessionNo();
    //this.$refs['inputAccessionNo'].focus()
    // this.initUiParams();
  },
  watch: {
    showWorkingCalendar(value) {
      document
        .getElementById("app")
        .classList[value ? "add" : "remove"]("no-scroll");
    },
    // selectedLabRoom () {
    // const isAssignMode = this.assignMode;

    // alert(this.assignMode);
    // setTimeout(() => {
    //   this.assignMode = true;
    // }, 5000);
    // }
  },
  beforeDestroy() {
    this.sockConnection.stop();
  },
  destroyed() {
    // 解除監聽器:攔截 KeyPress
    window.removeEventListener("keydown", this.HKWatch);
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/animation.scss";

.fix-light .super-select-container {
  z-index: 999;
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

.cardHeader {
  padding: 2px 1.25rem;
}

fieldset[disabled] .multiselect {
  pointer-events: none;
}
.multiselect__spinner {
  position: absolute;
  right: 1px;
  top: 1px;
  width: 48px;
  height: 35px;
  background: #fff;
  display: block;
}
.multiselect__spinner:after,
.multiselect__spinner:before {
  position: absolute;
  content: "";
  top: 50%;
  left: 50%;
  margin: -8px 0 0 -8px;
  width: 16px;
  height: 16px;
  border-radius: 100%;
  border: 2px solid transparent;
  border-top-color: #41b883;
  box-shadow: 0 0 0 1px transparent;
}
.multiselect__spinner:before {
  animation: spinning 2.4s cubic-bezier(0.41, 0.26, 0.2, 0.62);
  animation-iteration-count: infinite;
}
.multiselect__spinner:after {
  animation: spinning 2.4s cubic-bezier(0.51, 0.09, 0.21, 0.8);
  animation-iteration-count: infinite;
}
.multiselect__loading-enter-active,
.multiselect__loading-leave-active {
  transition: opacity 0.4s ease-in-out;
  opacity: 1;
}
.multiselect__loading-enter,
.multiselect__loading-leave-active {
  opacity: 0;
}
.multiselect,
.multiselect__input,
.multiselect__single {
  font-family: inherit;
  font-size: 16px;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
}
.multiselect {
  box-sizing: content-box;
  display: block;
  position: relative;
  width: 100%;
  min-height: 40px;
  text-align: left;
  color: #35495e;
}
.multiselect * {
  box-sizing: border-box;
}
.multiselect:focus {
  outline: none;
}
.multiselect--disabled {
  background: #ededed;
  pointer-events: none;
  opacity: 0.6;
}
.multiselect--active {
  z-index: 50;
}
.multiselect--active:not(.multiselect--above) .multiselect__current,
.multiselect--active:not(.multiselect--above) .multiselect__input,
.multiselect--active:not(.multiselect--above) .multiselect__tags {
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
.multiselect--active .multiselect__select {
  transform: rotate(180deg);
}
.multiselect--above.multiselect--active .multiselect__current,
.multiselect--above.multiselect--active .multiselect__input,
.multiselect--above.multiselect--active .multiselect__tags {
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
.multiselect__input,
.multiselect__single {
  position: relative;
  display: inline-block;
  min-height: 20px;
  line-height: 20px;
  border: none;
  border-radius: 5px;
  background: #fff;
  padding: 0 0 0 5px;
  width: 100%;
  transition: border 0.1s ease;
  box-sizing: border-box;
  margin-bottom: 8px;
  vertical-align: top;
}
.multiselect__input:-ms-input-placeholder {
  color: #35495e;
}
.multiselect__input::placeholder {
  color: #35495e;
}
.multiselect__tag ~ .multiselect__input,
.multiselect__tag ~ .multiselect__single {
  width: auto;
}
.multiselect__input:hover,
.multiselect__single:hover {
  border-color: #cfcfcf;
}
.multiselect__input:focus,
.multiselect__single:focus {
  border-color: #a8a8a8;
  outline: none;
}
.multiselect__single {
  padding-left: 5px;
  margin-bottom: 8px;
}
.multiselect__tags-wrap {
  display: inline;
}
/deep/ .multiselect__tags {
  min-height: 38px;
  display: block;
  padding: 4px 40px 0 8px !important;
  border-radius: 5px;
  border: 1px solid #e8e8e8;
  background: #fff;
  font-size: 14px;
}
.multiselect__tag {
  position: relative;
  display: inline-block;
  padding: 4px 26px 4px 10px;
  border-radius: 5px;
  margin-right: 10px;
  color: #fff;
  line-height: 1;
  background: #41b883;
  margin-bottom: 5px;
  white-space: nowrap;
  overflow: hidden;
  max-width: 100%;
  text-overflow: ellipsis;
}
.multiselect__tag-icon {
  cursor: pointer;
  margin-left: 7px;
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  font-weight: 700;
  font-style: normal;
  width: 22px;
  text-align: center;
  line-height: 22px;
  transition: all 0.2s ease;
  border-radius: 5px;
}
.multiselect__tag-icon:after {
  content: "\D7";
  color: #266d4d;
  font-size: 14px;
}
.multiselect__tag-icon:focus,
.multiselect__tag-icon:hover {
  background: #369a6e;
}
.multiselect__tag-icon:focus:after,
.multiselect__tag-icon:hover:after {
  color: #fff;
}
.multiselect__current {
  min-height: 40px;
  overflow: hidden;
  padding: 8px 30px 0 12px;
  white-space: nowrap;
  border-radius: 5px;
  border: 1px solid #e8e8e8;
}
.multiselect__current,
.multiselect__select {
  line-height: 16px;
  box-sizing: border-box;
  display: block;
  margin: 0;
  text-decoration: none;
  cursor: pointer;
}
.multiselect__select {
  position: absolute;
  width: 35px;
  height: 34px;
  right: 1px;
  top: 1px;
  padding: 4px 8px;
  text-align: center;
  transition: transform 0.2s ease;
}
.multiselect__select:before {
  position: relative;
  right: 0;
  top: 65%;
  color: #999;
  margin-top: 4px;
  border-color: #999 transparent transparent;
  border-style: solid;
  border-width: 5px 5px 0;
  content: "";
}
.multiselect__placeholder {
  color: #ccc;
  display: inline-block;
  margin-bottom: 10px;
  padding-top: 2px;
}
.multiselect--active .multiselect__placeholder {
  display: none;
}
.multiselect__content-wrapper {
  position: absolute;
  display: block;
  background: #fff;
  width: 100%;
  max-height: 240px;
  overflow: auto;
  border: 1px solid #e8e8e8;
  border-top: none;
  border-bottom-left-radius: 5px;
  border-bottom-right-radius: 5px;
  z-index: 50;
  -webkit-overflow-scrolling: touch;
}
.multiselect__content {
  list-style: none;
  display: inline-block;
  padding: 0;
  margin: 0;
  min-width: 100%;
  vertical-align: top;
}
.multiselect--above .multiselect__content-wrapper {
  bottom: 100%;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
  border-bottom: none;
  border-top: 1px solid #e8e8e8;
}
.multiselect__content::webkit-scrollbar {
  display: none;
}
.multiselect__element {
  display: block;
}
.multiselect__option {
  display: block;
  padding: 12px;
  min-height: 40px;
  line-height: 16px;
  text-decoration: none;
  text-transform: none;
  vertical-align: middle;
  position: relative;
  cursor: pointer;
  white-space: nowrap;
}
.multiselect__option:after {
  top: 0;
  right: 0;
  position: absolute;
  line-height: 40px;
  padding-right: 12px;
  padding-left: 20px;
  font-size: 13px;
}
.multiselect__option--highlight {
  background: #41b883;
  outline: none;
  color: #fff;
}
.multiselect__option--highlight:after {
  content: attr(data-select);
  background: #41b883;
  color: #fff;
}
.multiselect__option--selected {
  background: #f3f3f3;
  color: #35495e;
  font-weight: 700;
}
.multiselect__option--selected:after {
  content: attr(data-selected);
  color: silver;
}
.multiselect__option--selected.multiselect__option--highlight {
  background: #ff6a6a;
  color: #fff;
}
.multiselect__option--selected.multiselect__option--highlight:after {
  background: #ff6a6a;
  content: attr(data-deselect);
  color: #fff;
}
.multiselect--disabled .multiselect__current,
.multiselect--disabled .multiselect__select {
  background: #ededed;
  color: #a6a6a6;
}
.multiselect__option--disabled {
  background: #ededed !important;
  color: #a6a6a6 !important;
  cursor: text;
  pointer-events: none;
}
.multiselect__option--group {
  background: #ededed;
  color: #35495e;
}
.multiselect__option--group.multiselect__option--highlight {
  background: #35495e;
  color: #fff;
}
.multiselect__option--group.multiselect__option--highlight:after {
  background: #35495e;
}
.multiselect__option--disabled.multiselect__option--highlight {
  background: #dedede;
}
.multiselect__option--group-selected.multiselect__option--highlight {
  background: #ff6a6a;
  color: #fff;
}
.multiselect__option--group-selected.multiselect__option--highlight:after {
  background: #ff6a6a;
  content: attr(data-deselect);
  color: #fff;
}
.multiselect-enter-active,
.multiselect-leave-active {
  transition: all 0.15s ease;
}
.multiselect-enter,
.multiselect-leave-active {
  opacity: 0;
}
.multiselect__strong {
  margin-bottom: 8px;
  line-height: 20px;
  display: inline-block;
  vertical-align: top;
}
[dir="rtl"] .multiselect {
  text-align: right;
}
[dir="rtl"] .multiselect__select {
  right: auto;
  left: 1px;
}
[dir="rtl"] .multiselect__tags {
  padding: 5px 8px 0 40px;
}
[dir="rtl"] .multiselect__content {
  text-align: right;
}
[dir="rtl"] .multiselect__option:after {
  right: auto;
  left: 0;
}
[dir="rtl"] .multiselect__clear {
  right: auto;
  left: 12px;
}
[dir="rtl"] .multiselect__spinner {
  right: auto;
  left: 1px;
}
@keyframes spinning {
  0% {
    transform: rotate(0);
  }
  to {
    transform: rotate(2turn);
  }
}

.applyNoModal {
  /deep/ .input-group-prepend .input-group-text {
    min-width: 100px;
  }
}
</style>
