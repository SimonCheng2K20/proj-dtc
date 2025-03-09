<template>
  <!-- 為了要改變背景放mounted-css -->
  <div
    id="FI0306-1"
    class="pageContent pb-1 mounted"
  >
    <b-card
      no-body
      class="mx-1"
      bg-variant="transparent"
    >
      <b-card-header class="bg-warning text-dark cardHeader btn-right">
        <toggle-button
          @change="showDetails = !showDetails"
          :value="showDetails"
          class="detail-btn"
          color="#dc3545"
          :font-size="14"
          :height="24"
          :width="100"
          :labels="{ checked: '關閉詳情', unchecked: '顯示詳情' }"
        />
        <b-row no-gutters>
          <b-col
            cols="6"
            class="float-left text-left font-weight-bold"
          >匿名評分作業</b-col>
          <!-- <b-col
            cols="6"
            class="float-right text-right"
          >
            <b-dropdown
              id="dropdown-1"
              text="背景更換"
              dropleft
              style="font-size:12px;"
            >
              <b-dropdown-item
                :active="isWhite"
                class="bg-clr"
                @click="bgUpdate('white', $event)"
              >白色</b-dropdown-item>
              <b-dropdown-item
                :active="isBlack"
                class="bg-clr"
                @click="bgUpdate('black', $event)"
              >黑色</b-dropdown-item>
              <b-dropdown-item
                :active="isGray"
                class="bg-clr"
                @click="bgUpdate('#868e96', $event)"
              >灰色</b-dropdown-item>
            </b-dropdown>
            <!--
							當要用 free regular icon 時:
							1. fontawesome.js 內得加載 @fortawesome/free-regular-svg-icons
							2. 得用 :icon 並加註 'far'
						<font-awesome-icon :icon="['far', 'circle']" class='mr-2 text-black cursor-pointer' @click='ThemeSwitch'/>
            -->
          <!--
						<font-awesome-icon icon="keyboard" class='mr-1'/>
            -->
          </b-col> -->
        </b-row>
      </b-card-header>
      <b-card-text class="text-left py-1 m-0">
        <b-container
          fluid
          class="px-0"
        >
          <b-row
            no-gutters
            class="first-row"
          >
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="優先順序">
                <template v-slot="append">
                  <b-radio-group
                    tag="EmgFlag"
                    name="CaseEmergency"
                    v-model="casePriorityCode"
                    :options="OptionsCasePriority"
                    buttons
                    button-variant="outline-danger"
                  ></b-radio-group>
                </template>
              </b-input-group>
            </b-col>
            <toggle-button
              :value="false"
              class="positive-btn"
              color="#dc3545"
              :font-size="16"
              :height="26"
              :width="72"
              :labels="{ checked: '陽性', unchecked: '陰性' }"
              :disabled="true"
            />

            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="檢查日期">
                <b-input
                  tag="ScheduleTime"
                  v-model="theProcedure.StudyDate"
                  readonly
                />
              </b-input-group>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="儀器類別">
                <b-input
                  tag="Modality"
                  v-model="theProcedure.Modality"
                  readonly
                />
              </b-input-group>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="申請單號">
                <b-input
                  tag="AccessionNo"
                  v-model="theProcedure.AccessionNo"
                  readonly
                />
              </b-input-group>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="病歷號">
                <b-input
                  tag="PatientId"
                  v-model="theProcedure.PatientId"
                  readonly
                />
              </b-input-group>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="病患來源">
                <b-input
                  tag="PatientSourceTypeCode"
                  v-model="theProcedure.PatientSourceType"
                  readonly
                />
              </b-input-group>
            </b-col>
          </b-row>
          <!-- 了解一下FI0301tag是為了什麼 先刪tag -->
          <b-row
            no-gutters
            class="mt-1"
          >
            <b-col
              sm="4"
              class="px-1"
            >
              <b-input-group prepend="病患姓名">
                <b-input
                  v-model="theProcedure.PatientName"
                  readonly
                />
              </b-input-group>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="病患性別">
                <b-input
                  v-model="theProcedure.PatientSex"
                  readonly
                />
              </b-input-group>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="出生日期">
                <b-input
                  v-model="theProcedure.PatientBirthday"
                  readonly
                />
              </b-input-group>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="病患年齡">
                <b-input
                  v-model="theProcedure.PatientAge"
                  readonly
                />
              </b-input-group>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="病床編號">
                <b-input
                  v-model="theProcedure.BedNo"
                  readonly
                />
              </b-input-group>
            </b-col>
          </b-row>
          <b-row
            no-gutters
            class="mt-1"
          >
            <b-col
              sm="4"
              class="px-1"
            >
              <b-input-group prepend="開單醫師">
                <b-input
                  v-model="theProcedure.RequestingPhysicianName"
                  readonly
                />
              </b-input-group>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group>
                <b-input-group-prepend>
                  <b-button variant="primary">影像品質</b-button>
                </b-input-group-prepend>
                <b-input
                  v-model="NameOfImageQuality"
                  readonly
                />
              </b-input-group>
            </b-col>
            <!-- <b-col sm='4' class='px-1'>
            <b-input-group prepend='審核醫師'>-->
            <!-- /Employee/SelectNoList -->
            <!-- <b-form-select :disabled="theReport.DxrStatus == 71" placeholder="" tag="ApprovalPhysicianName" :style="getDropDownStyle()" v-model="ApprovalPhysicianName" :options="approvalList"></b-form-select>
							</b-input-group>
            </b-col>-->
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="報告狀態">
                <b-input
                  v-model="statusName"
                  readonly
                />
              </b-input-group>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="目前版本">
                <b-input
                  v-model="evaluation.DxRVersion"
                  readonly
                />
              </b-input-group>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="評分記錄">
                <b-input
                  v-model="evaluatiedInfo.checkEvaluatied"
                  readonly
                  :style="evaluatiedInfo"
                />
              </b-input-group>
            </b-col>
          </b-row>

          <b-row
            no-gutters
            class="mt-1"
            v-show="showDetails"
          >
            <b-col
              sm="2"
              class="px-1"
            >
              <b-card
                no-body
                bg-variant="transparent"
                class="border"
              >
                <b-card-header class="bg-success text-white font-weight-bold cardHeader">
                  <b-row no-gutters>
                    <b-col
                      cols="6"
                      class="float-left text-left"
                    >檢查項目</b-col>
                  </b-row>
                </b-card-header>
                <b-card-text class="p-0">
                  <b-container
                    fluid
                    class="p-0"
                  >
                    <b-row no-gutters>
                      <b-textarea
                        no-resize
                        tag="ProcedureName"
                        rows="4"
                        class="border-0 rounded-0"
                        v-model="labProcedures"
                        readonly
                      ></b-textarea>
                    </b-row>
                  </b-container>
                </b-card-text>
              </b-card>
            </b-col>
            <b-col
              sm="4"
              class="px-1"
            >
              <b-card
                no-body
                class="border"
                bg-variant="transparent"
              >
                <b-card-header class="bg-danger text-white font-weight-bold cardHeader">
                  <b-row no-gutters>
                    <b-col
                      cols="6"
                      class="float-left text-left"
                    >客訴</b-col>
                  </b-row>
                </b-card-header>
                <b-card-text class="p-0">
                  <b-container
                    fluid
                    class="p-0"
                  >
                    <b-row no-gutters>
                      <b-textarea
                        tag="Objective"
                        no-resize
                        rows="4"
                        class="border-0 rounded-0"
                        v-model="theProcedure.Objective"
                        readonly
                      ></b-textarea>
                    </b-row>
                  </b-container>
                </b-card-text>
              </b-card>
            </b-col>
            <b-col
              sm="3"
              class="px-1"
            >
              <b-card
                no-body
                class="border"
                bg-variant="transparent"
              >
                <b-card-header class="bg-info text-white font-weight-bold cardHeader">
                  <b-row no-gutters>
                    <b-col
                      cols="6"
                      class="float-left text-left"
                    >主訴</b-col>
                  </b-row>
                </b-card-header>
                <b-card-text class="p-0">
                  <b-container
                    fluid
                    class="p-0"
                  >
                    <b-row
                      ref="blkSubjective"
                      no-gutters
                    >
                      <b-textarea
                        tag="Subjective "
                        no-resize
                        rows="4"
                        class="border-0 rounded-0"
                        v-model="theProcedure.Subjective"
                        readonly
                      ></b-textarea>
                    </b-row>
                  </b-container>
                </b-card-text>
              </b-card>
            </b-col>
            <b-col
              sm="3"
              class="px-1"
            >
              <b-card
                no-body
                class="border"
                bg-variant="transparent"
              >
                <b-card-header class="bg-warning font-weight-bold cardHeader">
                  <b-row no-gutters>
                    <b-col
                      cols="6"
                      class="float-left text-left text-black"
                    >檢查註記</b-col>
                  </b-row>
                </b-card-header>
                <b-card-text class="p-0">
                  <b-container
                    fluid
                    class="p-0"
                  >
                    <b-row no-gutters>
                      <b-textarea
                        no-resize
                        rows="4"
                        tag="RadiographerNote"
                        class="border-0 rounded-0"
                        v-model="theProcedure.RadiographerNote"
                        readonly
                      ></b-textarea>
                    </b-row>
                  </b-container>
                </b-card-text>
              </b-card>
            </b-col>
          </b-row>
          <b-row
            no-gutters
            class="mt-1 mx-0"
          >
            <!-- remove report-tab -->
            <b-col
              v-if="!showcst"
              sm="9"
              class="dtc-vue-tab title_center sb4RHis"
              style="border:1px solid #ccc;border-radius:5px ;overflow:auto"
            >
              <!-- 這報告不要跑 -->
              <b-tabs
                class="mx-1"
                style="height:calc(100vh - 300px)"
                active-nav-item-class="text-uppercase text-light bg-danger"
              >
                <b-tab
                  v-for="(item, idx) in cstTab"
                  :key="idx"
                  :title="item.CSTName"
                  @click="ShowData(idx)"
                >
                  <!-- <img class="img-border" style=" width:100%" :src="item.StructureImage" /> -->
                  <!-- <b-form id="WinCST0306-1DxRSC"> -->
                  <b-form :id="item.TagId">
                    <b-row>
                      <b-col
                        class="img-border"
                        v-html="item.StructureContent"
                      ></b-col>
                    </b-row>
                  </b-form>
                </b-tab>
              </b-tabs>
            </b-col>
            <b-col
              v-if="showcst"
              cols="2"
              class="px-1 sb4RHis"
            >
              <b-card
                no-body
                class="h-100 border"
                bg-variant="transparent"
              >
                <b-card-header class="bg-primary font-weight-bold cardHeader">
                  <b-row no-gutters>
                    <b-col
                      cols="6"
                      class="float-left text-left text-white"
                    >科內審查記錄</b-col>
                  </b-row>
                </b-card-header>
                <b-card-text class="p-0">
                  <b-row no-gutters>
                    <div
                      ref="blkHistoryList"
                      class="pl-1"
                    >
                      <div class="dtc-his-grid">
                        <div
                          v-if="historyList.length"
                          class="title"
                        >評分日期</div>
                      </div>
                      <div
                        class="dtc-his-grid"
                        v-for="(item, i) in historyList"
                        :key="i"
                        @click="viewHistoryReport(item, $event)"
                      >
                        <div
                          class="title"
                          :title="item.ProcedureName"
                          v-text="DateToString(new Date(item.EvaluateTime), true)"
                        ></div>
                      </div>
                    </div>
                  </b-row>
                </b-card-text>
              </b-card>
            </b-col>
            <b-col
              v-if="showcst"
              id="blkReportInput"
              sm="7"
              class="px-1"
            >
              <b-textarea
                id="DxRMain"
                no-resize
                class="border-primary"
                readonly
                ref="reportPlainText"
                v-model="DxReportContent"
                @input="findReportPhraseStr"
                placeholder="請於此處輸入報告內容"
                style="height:100%"
              />
              <b-textarea
                id="DxRExtra"
                no-resize
                rows="4"
                class="border-warning mt-1"
                hidden
                ref="reportExtra"
                v-model="DxReportExtraNote"
                placeholder="請於此處輸入報告額外註記"
              />
            </b-col>
            <b-col
              sm="3"
              class="px-1"
            >
              <b-card
                no-body
                class="h-100 border"
                bg-variant="transparent"
              >
                <b-card-header class="bg-dark font-weight-bold cardHeader">
                  <b-row no-gutters>
                    <b-col class="float-left text-left text-white">報告審查</b-col>
                  </b-row>
                </b-card-header>
                <b-card-text
                  class="px-1 pb-1 sb4RHis"
                  style="width: 100%; height: 100%;"
                >
                  <!-- <div style="width: 100%; height: calc(100vh - 370px); overflow: auto;"> -->
                  <b-form-group class="mb-1">
                    <b-row class="m-0">
                      <b-col
                        cols="12"
                        class="pl-0 button-align"
                      >
                        <!-- FI0306返回button -->
                        <b-button
                          variant="primary"
                          class="mx-1 mt-1"
                          @click="ReturnBack"
                          v-if="!isFromFI0307"
                          replace
                        >返回</b-button>

                        <!-- FI0307返回button -->
                        <b-button
                          variant="primary"
                          class="mx-1 mt-1"
                          @click="ReturnToFI0307"
                          v-else
                          replace
                        >返回</b-button>

                        <b-button
                          variant="primary"
                          class="mx-1 mt-1"
                          @click="callPacs"
                        >PACS</b-button>
                        <b-button
                          :disabled="!evaluatiedInfoIsEval"
                          variant="danger"
                          class="mx-1 mt-1"
                          v-if="!isFromFI0307"
                          @click="clearSelect"
                        >清除</b-button>
                        <b-button
                          :disabled="!evaluatiedInfoIsEval"
                          v-if="!isFromFI0307"
                          variant="success "
                          class="mx-1 mt-1"
                          @click="showEvaluationModal"
                        >儲存</b-button>
                        <!--@change="showcst = !showcst"-->
                        <toggle-button
                          class="mx-1 mt-2"
                          ref="toggleView"
                          :disabled="cstreport"
                          @change="SwitchCST"
                          :color="{ checked: '#28A745', unchecked: '#DC3545', disabled: '#CCCCCC' }"
                          :font-size="14"
                          :height="28"
                          :width="100"
                          :labels="{ checked: '書寫報告', unchecked: '癌篩報告' }"
                        />
                      </b-col>
                      <b-col
                        cols="12"
                        class="px-1"
                      >
                        <b-form-radio-group
                          :disabled="!evaluatiedInfoIsEval"
                          size="lg"
                          v-model="evaluationSelected"
                          :options="evaluationCheckBox"
                          class="mb-1 radioOptions"
                          value-field="No"
                          text-field="Name"
                        ></b-form-radio-group>
                        <!-- <div class="mt-3">
                          Selected:
                          <strong>{{ evaluationSelected }}</strong>
                        </div>-->
                      </b-col>
                    </b-row>
                  </b-form-group>
                  <b-textarea
                    v-if="evaluatiedInfoIsEval"
                    autofocus
                    style="height:calc(100% - 145px)"
                    no-resize
                    v-model="evaluation.DxRAEComment"
                    placeholder="科內審查意見"
                  ></b-textarea>
                  <b-textarea
                    v-else
                    readonly
                    no-resize
                    style="height:calc(100% - 145px)"
                    v-model="evaluation.DxRAEComment"
                    placeholder="科內審查意見"
                  ></b-textarea>
                  <!-- </div> -->
                </b-card-text>
              </b-card>
            </b-col>
          </b-row>
        </b-container>
      </b-card-text>
    </b-card>
    <b-modal
      ref="evaluationSaveAlert"
      header-bg-variant="danger"
      hide-footer
      title="儲存提醒"
    >
      <p
        class="my-4"
      >請確認科內審查意見內容，儲存後無法更改資料!</p>
      <b-col class="text-right px-1 mt-1">
        <b-button
          class="mr-1"
          md="3"
          offset-md="3"
          variant="danger"
          @click="saveEvaluate"
        >確認</b-button>
        <b-button
          md="3"
          offset-md="3"
          @click="hideEvaluationModal"
        >取消</b-button>
      </b-col>
    </b-modal>

    <b-modal
      ref="showEva"
      header-bg-variant="warning "
      header-text-variant="dark"
      hide-footer
      title="科內審查"
      size="lg"
    >
      <b-form-radio-group
        class="p-1 mb-1"
        disabled
        size="lg"
        v-model="showEvaModalCheckBox"
        :options="evaluationCheckBox"
        value-field="No"
        text-field="Name"
      ></b-form-radio-group>
      <b-textarea
        style="height:calc(100vh - 320px); background-color: transparent; color: inherit;"
        no-resize
        rows="2"
        v-model="showEvaModalComment"
        readonly
        placeholder="請選擇科內審查記錄"
      ></b-textarea>
    </b-modal>
  </div>
</template>

<script>
//import sweetAlert from "sweetalert2";
import * as configs from "@/config";
//import * as SmartTextarea from "smart-textarea/dist/bundle.js"

import { DataManager, WebApiAdaptor } from "@syncfusion/ej2-data";
import { callPaceWebSocket } from "@/assets/service/dataManager";
import { dateFormatMixin } from "@/SupportLib_J.js";

let customizeIdLead = "Id4StructureHTML";

// 取得相關設定(這裡是 KeyCode 字串常數)
const KeyCode4Control = configs.KeyCode4Control;
const KeyCode4Alternate = configs.KeyCode4Alternate;
const KeyCode4Shift = configs.KeyCode4Shift;

// 載入模組:KeyPressIdentifier
import KeyPressIdentifier from "@/assets/KeyPressIdentifier";
// HotKey 預設組態
let defaultHotKeyArr = [
  // F1 to F10
  { hotkey: "F1", default: "F1", method: "HelpShow", title: "功能說明" },
  { hotkey: "F2", default: "F2", method: "call3rdParty", title: "呼叫PAC" },
  {
    hotkey: "F3",
    default: "F3",
    method: "WinMass4Objective",
    title: "醫師客訴"
  },
  {
    hotkey: "F4",
    default: "F4",
    method: "WinMass4Subjective",
    title: "病患主訴"
  },
  {
    hotkey: "F5",
    default: "F5",
    method: "viewUrgentReport",
    title: "緊急通報"
  },
  { hotkey: "F6", default: "F6", method: "WinMass4Phrase", title: "片語維護" },
  {
    hotkey: "F7",
    default: "F7",
    method: "WinMass4Radiographer",
    title: "檢查註記"
  },
  {
    hotkey: "F8",
    default: "F8",
    method: "InstantPhraseCreate",
    title: "快速片語建立"
  },
  {
    hotkey: "F9",
    default: "F9",
    method: "WinIQControlEdit",
    title: "影像品質"
  },
  {
    hotkey: "F10",
    default: "F10",
    method: "versionHistoryOpen",
    title: "報告版次"
  },

  // Alt + key
  {
    hotkey: KeyCode4Alternate + "F1",
    default: KeyCode4Alternate + "F1",
    method: "WinMass4ShiftNote",
    title: "交班記錄"
  },
  {
    hotkey: KeyCode4Alternate + "F2",
    default: KeyCode4Alternate + "F2",
    method: "reportTemplateOpen",
    title: "癌篩報告"
  },
  {
    hotkey: KeyCode4Alternate + "F3",
    default: KeyCode4Alternate + "F3",
    method: "backToPreviousRoute",
    title: "返回清單"
  },
  //{ hotkey: 'KC.F1', default: 'KC.F1', method: 'FocusOnContent', title: '報告內容' },
  //key for saving and sending the report in database Ctrl + key

  {
    hotkey: KeyCode4Control + "F2",
    default: KeyCode4Control + "F2",
    method: "DataSave",
    param: 63,
    title: "暫存報告"
  },
  {
    hotkey: KeyCode4Control + "F3",
    default: KeyCode4Control + "F3",
    method: "DataSave",
    param: 65,
    title: "送交審核"
  },
  {
    hotkey: KeyCode4Control + "F4",
    default: KeyCode4Control + "F4",
    method: "DataSave",
    param: 71,
    title: "正式報告"
  },
  {
    hotkey: KeyCode4Control + "F5",
    default: KeyCode4Control + "F5",
    method: "DataSave",
    param: 61,
    title: "退回重寫"
  },
  // nav next record keys Crl+ key
  {
    hotkey: KeyCode4Control + "F6",
    default: KeyCode4Control + "F6",
    method: "viewNextRecord",
    title: "到下一筆"
  },
  {
    hotkey: KeyCode4Control + "F7",
    default: KeyCode4Control + "F7",
    method: "viewPrevRecord",
    title: "到上一筆"
  }
  //this.viewNextRecord
];

// 動態宣告-外部
var OutterProprty4DynamicDeclare = {
  name4ContentDiff: "versionDiffByDynamic"
};

//	1. 安裝: $ npm i vue-code-diff
//	2. 再加自行撰寫 TextDiff
//	- 這個 plug-in 不是很合用, 但先勉強湊和著用
// import TxtDif from "@/components/TextDiff"

// 載入模組:片語維護
// import RxP from "@/components/CI0302ReportPhrase"
import html2canvas from "html2canvas";
export default {
  name: "FI0306-1",
  // components: { TxtDif, RxP },
  mixins: [dateFormatMixin],
  data () {
    return {
      smsMsg: "",
      whySaveText: "",
      isDataChange: false,
      showDetails: true,
      phraseRecords: [],
      statusName: "",
      otherInput: "",
      hideNextPrevBtn: false,
      nextViewArr: [],
      cstReportHtml: "",
      urgentPriorityCode: "u2",
      urgentOpt: "1",
      urgOptions: [
        { id: "tesion", value: 1, text: "Tension Pneumothorax" },
        { id: "pne", value: 2, text: "Pneumoperitoneum" },
        {
          id: "active",
          value: 3,
          text: "Active bleeding in thorax and abdomen"
        },
        { id: "tb", value: 4, text: "TB with cavitation" },
        {
          id: "last",
          value: 5,
          text: "Aortic aneurysm(diameter >= 5CM) or Aortic dissection"
        },
        { id: "others", value: 6, text: "Others" }
      ],
      urg2Options: [
        { id: "tb2", value: 1, text: "TB" },
        { id: "pne2", value: 2, text: "Pneumothorax" },
        {
          id: "active2",
          value: 3,
          text: "Aortic aneurysm (diameter >= 4~<5cm)"
        },
        { id: "others2", value: 6, text: "Others" }
      ],
      dxrVersion: "",
      currentNum: 1,
      initArray: [],
      totalArrayLen: "",
      viewHistoryItem: "",
      imgQualityList: [],
      ApprovalPhysicianName: null,
      approvalList: [],
      historyList: [],
      options: [
        { value: null, text: "Please select an option" },
        { value: "a", text: "This is First option" }
      ],
      leftMost: true,
      rightMost: false,
      myFullScreenItem: "",
      reportList: [],
      fullScreen: false,
      gray: "#868e96",
      showImgReport: false,
      reportImg: "",
      isWhite: true,
      isBlack: false,
      isGray: false,
      PublicPath: process.env.BASE_URL,
      BasePath: this.$route.path,
      ObjApp: null,
      VueNestLevel: 0,
      //
      UserId: "Pollux",
      // 功能啟動時之先決條件的處理狀況
      prerequisiteCompleted: false,
      prerequisiteFailure: false,
      // 動態宣告-內部
      innerProprty4DynamicDeclare: OutterProprty4DynamicDeclare,
      // 是否容許 HotKey 攔截器作用?
      allowHotKeyFunctional: true,
      // 佈景主題
      themePacks: {
        themeBlack: false,
        //emeBlackName: 'themeBlack',
        themeBlackName: configs.ThemeId4Black
      },
      // 內文差異比對
      oldStr: "Older String",
      newStr: "Newer String",
      // 大對話框呈現內文
      winMassTitle: "",
      winMassContent: "",
      winMassHeadBgV: "",
      winMassHeadTxV: "",
      winMassBodyBgV: "",
      winMassComponent: false,
      //
      winConfigure: {
        HeadBgV: "",
        HeadTxV: "",
        BodyBgV: "",
        BodyTxV: "",
        Title: "組態設定",
        Content: ""
      },
      winIQControl: {
        HeadBgV: "",
        HeadTxV: "",
        BodyBgV: "",
        BodyTxV: "",
        Title: "影像品質",
        Content: ""
      },
      winConfig4HotkeyDetect: {
        HeadBgV: "",
        HeadTxV: "",
        BodyBgV: "",
        BodyTxV: "",
        Title: "Hotkey 設定",
        Content: ""
      },
      winConfig4StructureReport: {
        HeadBgV: "",
        HeadTxV: "",
        BodyBgV: "",
        BodyTxV: "",
        Title: "編輯癌篩報告",
        Content: ""
      },
      winConfig4ReportTemple: {
        HeadBgV: "",
        HeadTxV: "",
        BodyBgV: "",
        BodyTxV: "",
        Title: "癌篩報告",
        Content: ""
      },
      winConfig4VersionHistory: {
        HeadBgV: "",
        HeadTxV: "",
        BodyBgV: "",
        BodyTxV: "",
        Title: "版本歷史",
        Content: ""
      },
      HotkeyList: [],
      HotkeyTempSet: [],
      HotkeyCurrentItemName: "",
      HotkeyPressed: "",
      HotkeyPressRemark: "",
      HotkeyPressMessage: "",
      UnderHotkeyDetect: false,
      // 片語相關資料
      reportPhrase: {
        GUID: -1,
        PhraseCode: "",
        Replacement: "",
        OPPrgId: ""
      },
      theMacroList: [],
      // 檢查相關資料
      casePriorityCode: "Y",
      continuousReportCode: "Y",
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
        DxrVersion: ""
      },
      labProcedures: "檢查項目一\n檢查項目二\n檢查項目三\n檢查項目四",
      // 報告相關資料
      theReport: null,
      origReportContent: "",
      origCstHtmlData: "",
      reportHistory: [],
      //
      optionsImageQuality: [],
      //
      instantContent: "",
      //evalution data
      evaluation: {
        PatientId: "",
        OrderNo: "",
        AccessionNo: "",
        DxRVersion: "",
        DxRAEItemId: "",
        DxRAEComment: ""
      },
      evaluatiedInfo: {
        //尚未評分 評分完成
        checkEvaluatied: "",
        //改變背景為綠色
        backgroundColor: "",
        color: ""
      },
      //evaluatiedInfoIsEval值為false，checkbox & textarea 為readonly
      showEvaModalCheckBox: "",
      showEvaModalComment: "",
      evaluatiedInfoIsEval: true,
      evaluationCheckBox: [],
      evaluationSelected: "07",
      showcst: true,
      cstTab: [],
      cstTabName: "",
      //確認題否有癌篩報告
      cstreport: true,
      isFromFI0307: false,
      //報告搜尋作業的DATA
      FI0307Data: null,
      FI0307Count: 0,
      FI0307TempCheckItems: null,
      FI0307TempQuery: null,
      FI0307TempCurrentPage: 1,
      tabIndex: 0,
      prevRoute: ''
    };
  },
  computed: {
    loginId () {
      return this.$store.state.Profile4User.id;
    },
    canApproveReport () {
      const v = this.approvalList.find(s => this.loginId === s.value);
      return v ? true : false;
    },
    theSamePerson () {
      const v = this.ApprovalPhysicianName === this.loginId;
      return v;
    },
    numObj () {
      return {
        visibility:
          this.currentNum <= 1 || this.hideNextPrevBtn ? "hidden" : "visible",
        cursor: "pointer"
      };
    },
    numObj2 () {
      return {
        visibility:
          this.currentNum >= this.totalArrayLen || this.hideNextPrevBtn
            ? "hidden"
            : "visible",
        cursor: "pointer"
      };
    },
    urgentPlaceholder () {
      let v = "";
      if (this.urgentPriorityCode == "u2") {
        v = this.urgOptions.find(s => s.value == this.urgentOpt);
      } else {
        v = this.urg2Options.find(s => s.value == this.urgentOpt);
      }
      if (!v) return "";
      return `病患姓名: ${this.theProcedure.PatientName} 病歷號: ${
        this.theProcedure.PatientId
        }  緊急危險(${v.text}), 請速閱放射報告,並聯絡病患. ${
        this.urgentOpt == 6 ? this.otherInput : ""
        } `;
    },
    isCtMri () {
      return (
        this.theProcedure.Modality.includes("CT") ||
        this.theProcedure.Modality.includes("MR")
      );
    },
    MacroItemList () {
      // 片語簡易清單
      console.log(this.$logs());
      return this.theMacroList;
    },
    urgentLevels () {
      return [
        { text: "異常值通報", value: "u1" },
        { text: "緊急危險通報", value: "u2" }
      ];
    },
    OptionsCasePriority () {
      return this.casePriorityCode == "Y"
        ? [{ text: "急件", value: "Y" }]
        : [{ text: "一般", value: "N" }];
    },
    OptionsContinuousReport () {
      // 連續(登打)報告之啟用與否?
      return [
        { text: "啟用", value: "Y" },
        { text: "取消", value: "N" }
      ];
    },
    NameOfImageQuality () {
      let value = "";
      // alert(this.theReport.ImageQualityCode);
      if (this.theReport && this.theReport.ImageQualityCode) {
        //alert(this.theReport.ImageQualityCode)
        if (this.optionsImageQuality && this.optionsImageQuality.length > 0) {
          this.optionsImageQuality.some(e => {
            if (e.value === this.theReport.ImageQualityCode) {
              value = e.text;
              return true;
            }
          });
        }
      }
      return value;
    },
    ShiftNoteNotice () {
      return (
        this.theProcedure.ShiftNote && this.theProcedure.ShiftNote.length > 0
      );
    },
    DxReportVersion: {
      get () {
        return this.dxrVersion ? this.dxrVersion : "編輯中...";
      },
      set (v) {
        this.dxrVersion = v;
      }
    },
    DxReportContent: {
      get () {
        return this.theReport && this.$Exists(this.theReport.ReportContent)
          ? this.theReport.ReportContent
          : "";
      },
      set (v) {
        if (this.theReport && this.$Exists(this.theReport.ReportContent))
          this.theReport.ReportContent = v;
      }
    },
    DxReportExtraNote: {
      get () {
        return this.theReport && this.$Exists(this.theReport.ExtraNote)
          ? this.theReport.ExtraNote
          : "";
      },
      set (v) {
        if (this.theReport && this.$Exists(this.theReport.ExtraNote))
          this.theReport.ExtraNote = v;
      }
    },
    DxReportIQCode: {
      get () {
        return this.theReport && this.$Exists(this.theReport.ImageQualityCode)
          ? this.theReport.ImageQualityCode
          : "";
      },
      set (v) {
        if (this.theReport && this.$Exists(this.theReport.ImageQualityCode))
          this.theReport.ImageQualityCode = v;
      }
    },
    DxReportIQNote: {
      get () {
        return this.theReport && this.$Exists(this.theReport.ImageQualityNote)
          ? this.theReport.ImageQualityNote
          : "";
      },
      set (v) {
        if (this.theReport && this.$Exists(this.theReport.ImageQualityNote))
          this.theReport.ImageQualityNote = v;
      }
    },
    DxRStructureData: {
      get () {
        return this.theReport && this.$Exists(this.theReport.StructureData)
          ? this.theReport.StructureData
          : "";
      },
      set (v) {
        if (this.theReport && this.$Exists(this.theReport.StructureData))
          this.theReport.StructureData = v;
      }
    },
    DxRStructureImage: {
      get () {
        return this.theReport && this.$Exists(this.theReport.StructureImage)
          ? this.theReport.StructureImage
          : "";
      },
      set (v) {
        if (this.theReport && this.$Exists(this.theReport.StructureImage))
          this.theReport.StructureImage = v;
      }
    }
  },
  methods: {
    ReturnBack () {
      // this.$router.go(-1);
      const { name } = this.prevRoute;
      this.$router.push({ name })
    },
    async callPacs () {
      let ok = true;
      // this.openPopupWindow();
      try {
        //確認一下str == "show"
        // str == "show" ? "" : this.ObjApp.TimingMessage('已呼叫PACS');
        this.ObjApp.TimingMessage("已呼叫PACS");
        const url = await window.axios(
          `/api/PacsUri/` + this.theProcedure.AccessionNo
        );
        callPaceWebSocket(url);
        // window.packUrl = url;
        // this.windowObj.location.href = url;
      } catch (err) {
        ok = false;
      } finally {
        setTimeout(() => this.windowObj.close(), 1000);
        if (ok) {
          //this.ObjApp.TimingMessage('已呼叫PACS @ ' + url);
        } else if (process.env.NODE_ENV === "production") {
          this.ObjApp.TimingMessage("呼叫PACS發生錯誤", 2);
        }
      }
    },
    openPopupWindow () {
      const height = 5;
      const width = 5;
      const t = innerHeight - height;
      const l = innerWidth - width;
      this.windowObj = window.open(
        "DTC:PACK",
        "PACS",
        `height=10,width=10,left=${l},top=${t},resizable=no,scrollbars=no,toolbar=no,menubar=no,location=no,directories=no, status=no`
      );
    },
    // save evaluation
    async saveEvaluate () {
      let DxRAEItemId = this.evaluationSelected;
      console.log(this.$logs(DxRAEItemId));
      let evaluateData = {
        PatientId: this.theProcedure.PatientId,
        OrderNo: this.theProcedure.OrderNo,
        AccessionNo: this.theProcedure.AccessionNo,
        DxRVersion: "",
        DxRAEItemId: DxRAEItemId,
        DxRAEComment: this.evaluation.DxRAEComment,
        DxAEPhysicianId: ""
      };
      console.log(this.evaluation);
      evaluateData.DxRVersion = this.evaluation.DxRVersion;

      console.log(this.$logs("預計要推進去的資料"));
      console.log(this.$logs(evaluateData));
      console.log(evaluateData);

      this.hideEvaluationModal();
      await window.axios
        .post("/reportEvaluate/Save", evaluateData)
        .then(r => {
          this.ObjApp.TimingMessage("匿名評分已更完成");
        })
        .catch(e => {
          this.ObjApp.TimingMessage("資料儲存失敗", 2);
        });
      this.$router.replace({ path: "/MI03/FI0306" });
    },
    showEvaluationModal () {
      // console.log(this.evaluationSelected.length);
      if (!this.evaluatiedInfoIsEval) {
        this.ObjApp.TimingMessage("資料已被儲存不可重新覆寫", 2);
        return;
      }
      this.$refs["evaluationSaveAlert"].show();
    },
    hideEvaluationModal () {
      this.$refs["evaluationSaveAlert"].hide();
    },
    clearSelect () {
      if (this.evaluatiedInfoIsEval) {
        this.evaluationSelected = "";
        this.evaluation.DxRAEComment = "";
      } else {
        //評分完成不能有清除動作
        return;
      }
    },
    //

    async clickSaveSMS () {
      // TODO: Send SMS
      if (!this.whySaveText) {
        this.ObjApp.TimingMessage("尚未輸入儲存報告原因, 不得存檔.", 2);
        return;
      }
      //this.smsMsg
      // TODO new data field for saving why resave now
      this.DataSave(71);
      this.$bvModal.hide("add-note-b4-save");
    },
    addNoteB4Save (n) {
      //addNoteB4Save
      let IsThemeBlack = this.$IsThemeBlack();
      this.winConfig4VersionHistory.HeadBgV = IsThemeBlack ? "info" : "primary";
      this.winConfig4VersionHistory.HeadTxV = IsThemeBlack ? "light" : "light";
      this.$refs["addNoteB4Save"].show();
    },
    get999Status () {
      const ok1 =
        this.theReport.DxreportPhysicianId === this.loginId &&
        this.theReport.DxrStatus == 71;
      const ok2 = this.theReport.IssuePhysicianId === this.loginId;
      if (ok1 || ok2) return true;
      else return false;
    },
    //beforemount 先註解掉，有bug
    async getAllRows () {
      if (!window.dtcUrl) {
        return;
      }
      let itemPack = "";
      await new DataManager({
        url: window.dtcUrl,
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      })
        .executeQuery(window.dtcQuery)
        .then(r => {
          itemPack = r.actual; //資料;
        });

      itemPack.Items.filter(i => {
        i.ProcedureCompleted = this.DateToString(i.ProcedureCompleted, true);
        i.StudyTime =
          i.StudyTime == null ? "無影像" : this.DateToString(i.StudyTime, true);
      });

      itemPack.Items.sort((a, b) => {
        return (
          b.ProcedureCompleted - a.ProcedureCompleted || a.Status - b.Status
        );
      });

      this.totalArrayLen = itemPack.Items.length;
      this.dxrVersion = `1/` + this.totalArrayLen;

      for (let i = 0; i < window.dtcEvaluationDataList.length; ++i) {
        let idx =
          itemPack.Items.length &&
          itemPack.Items.findIndex(
            s => s.AccessionNo === window.dtcEvaluationDataList[i].AccessionNo
          );
        if (!itemPack.Items.length) break;
        if (idx > -1) {
          itemPack.Items.splice(idx, 1);
        }
      }
      if (itemPack.Items.length) {
        this.nextViewArr = [...itemPack.Items];
      }
    },
    getStatus (n) {
      n = Number(n);
      let s = "";
      if (n == 61) {
        s = "退回重寫";
      } else if (n == 63) {
        s = "暫存檔案";
      } else if (n == 65) {
        s = "等待審核";
      } else if (n == 71) {
        s = "正式報告";
      }
      return s;
    },
    getDropDownStyle () {
      let str = "";
      if (this.isWhite) {
        str = "backgrond:white;color:black;";
      } else if (this.isBlack) {
        str = "background:black;color:white;";
      } else {
        str = `background:${this.gray};color:white;`;
      }
      return str;
    },
    // thomas
    // clickLeftArrow () {
    // 	const el = document.querySelector('.dtc-toolbar');
    // 	let v = el.scrollLeft - 530;
    // 	v + el.offsetWidth >= el.scrollWidth ? v = el.scrollWidth - el.offsetWidth: '';
    // 	el.scrollLeft = v;
    // },
    // clickRightArrow () {
    // 	const el = document.querySelector('.dtc-toolbar');
    // 	let v = el.scrollLeft + 530;
    // 	v < 0 ? v = 0: '';
    // 	el.scrollLeft = v;
    // },
    resetFullScreenForm () {
      document.querySelector("#WinCST0301DxRSC").reset();
      this.DxRStructureData = "";
    },
    async editHtmlReport (item) {
      this.$refs["reportTemplate"].hide();
      if (item) {
        const html = (await window.axios.get("/cst/Get?cstId=" + item.CSTId))
          .StructureContent;
        this.cstReportHtml = html; // it contains html only; the data is saved in differnt place
      }
      setTimeout(() => {
        this.enterFullScreen("#WinCST0301___BV_modal_content_");
      }, 0);
      this.WinCSTOpen();
    },
    exitFullScreen (_id) {
      const id = _id ? _id : "#blkReportInput";
      this.showImgReport = false;
      const el = document.querySelector(id);
      el.exitFullscreen();
    },
    enterFullScreen (_id) {
      const id = _id ? _id : "#blkReportInput";
      const el = document.querySelector(id);
      el.requestFullscreen();
      this.showImgReport = true;
    },
    getFontColor () {
      if (!this.isGray) return "";
      return "color:blue;";
    },
    bgUpdate (cls) {
      console.log(cls);
      this.isWhite = this.isBlack = this.isGray = false;
      if (cls == "white") {
        this.isWhite = true;
      } else if (cls == "black") {
        this.isBlack = true;
      } else {
        this.isGray = true;
      }
      localStorage["theme-modal-bg-color"] = cls;
      this.ThemeSwitch(cls);
      if (!this.isWhite) {
        document.documentElement.style.setProperty(
          "--theme-modal-bg-color",
          cls
        );
      }
    },
    async GetVersions () {
      //	以 AccessionNo 取得 各版次之診斷報告 資訊
      // this.reportHistory = await window.axios.get(`/Report/GetVersionList?accessionNo=${this.theProcedure.AccessionNo}`);
    },

    FocusOnContent () {
      // 設定(報告內容編輯區塊)為焦點所在 ; disable run time error
      setTimeout(() => {
        this.$nextTick(() => this.$refs["reportPlainText"].focus());
      }, 500);
    },

    getReportPhraseStr (v) {
      if (!this.phraseRecords.length) return "";
      const ret = this.phraseRecords.find(s => s.PhraseCode === v);
      return ret ? ret.Replacement : "";
    },

    findReportPhraseStr () {
      const taskObject = this.$refs["reportPlainText"];
      if (!taskObject.value) return;
      const value = taskObject.value.trim();
      const arr = Array.from(value);
      let words = [];
      let end = taskObject.selectionEnd;
      for (let i = end - 1; -1 < end; --i) {
        if (/^\w+$/.test(value[i])) {
          words = [arr[i], ...words];
        } else {
          break;
        }
        --end;
      }
      const key = words.join("");
      //alert(key)
      const replacement = this.getReportPhraseStr(key);
      if (!replacement) return;
      const len = value.length - words.length;
      const orig =
        1 > len
          ? ""
          : arr.slice(0, taskObject.selectionEnd - key.length).join("");
      // alert(orig)
      let rightStr =
        1 > len
          ? ""
          : arr.slice(taskObject.selectionEnd, value.length).join("");
      // alert(rightStr)
      if (rightStr === key) {
        rightStr = "";
      }
      this.theReport.ReportContent = orig
        ? `${orig} ${replacement + rightStr} `
        : replacement + " " + rightStr;
      this.theReport.ReportContent = this.theReport.ReportContent.trim();
      taskObject.selectionEnd = this.theReport.ReportContent.length + 1;
    },
    viewHistoryReport (item, evt) {
      console.log(JSON.stringify(item, 0, 2));
      //把資料放到evaluation.DxRAEComment
      // this.evaluation.DxRAEComment = item.DxRAEComment;
      // this.evaluationSelected = item.DxRAEItemId.split(",");

      this.showEvaModalComment = item.DxRAEComment;
      this.showEvaModalCheckBox = item.DxRAEItemId;
      this.$refs["showEva"].show();
      // console.log(item.DxRAEItemId.split(","));

      this.viewHistoryItem = item;
      this.HotkeyTempSet = this.$DeepCopy(this.HotkeyList);
      let IsThemeBlack = this.$IsThemeBlack();
      this.winConfig4VersionHistory.HeadBgV = IsThemeBlack
        ? "success"
        : "primary";
      this.winConfig4VersionHistory.HeadTxV = IsThemeBlack ? "light" : "light";
      // this.$refs["viewHistory"].show();
      // setTimeout(() => {
      //   const el = document.querySelector("#view-history___BV_modal_content_");
      //   el.requestFullscreen();
      // }, 200);
      // console.log(JSON.stringify(this.theReport, 0, 2));
    },
    viewUrgentReport (item) {
      let IsThemeBlack = this.$IsThemeBlack();
      this.winConfig4VersionHistory.HeadBgV = IsThemeBlack
        ? "danger"
        : "primary";
      this.winConfig4VersionHistory.HeadTxV = IsThemeBlack ? "light" : "light";
      // this.$refs["urgentReport"].show();
    },
    InstantPhraseCreate () {
      this.instantContent = "";
      let taskObject = this.$refs["reportPlainText"];
      if (taskObject) {
        let posB = taskObject.selectionStart;
        let posE = taskObject.selectionEnd;
        if (posE > posB) {
          this.instantContent = taskObject.value.substring(posB, posE);
          console.log(this.$logs(this.instantContent));
          if (this.instantContent && this.instantContent.length > 0) {
            this.WinMass4Phrase();
          }
        }
      }
    },
    DoThis (methodName, ...args) {
      // 動態呼叫處理
      this.$refs["versionHistory"].hide();
      console.log(this.$logv());
      // const arr = args[0].split('/')
      window.dtcDiff = args[0];
      //alert(JSON.stringify(args));
      this[methodName](args);
    },
    //thomas edit
    // [OutterProprty4DynamicDeclare.name4ContentDiff]: async function(x) {
    // 叫用:報告內容差異比對

    //
    // Pollux, 請參閱[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer]
    //		> 尤其是 (Computed property names) 這個章節
    //	>	注意:
    //	1. Computed property names 在這裡不能使用 data/data() 區段內的 property 來宣告, 因為在此時 data/data() 區段還是 null !
    //		> 因此必須用外部的 property 來宣告 method
    //	2. 但是, 在 template 區段中又不能用外部的 property 來宣告/繫結
    //		> 所以, 可以在 data/data() 或 computed 區段設立 property 並將外部 property 之值 assign 過去,
    //		> 就可以在 template 區段中使用了
    //
    // 	console.log(this.$logs(null, OutterProprty4DynamicDeclare.name4ContentDiff))
    // 	// 如果傳入參數為 array, 則轉換型別為 string
    // 	if(typeof x !== 'string') {
    // 		x = x[0]
    //   }
    //   const map = await window.axios.get(`/Report/Get?accessionNo=${this.theProcedure.AccessionNo}&version=${x}`);//this.GetVersionContent(x)
    //   this.oldStr = map.ReportContent;
    // 	this.newStr = this.theReport.ReportContent
    // 	//
    // 	this.$refs['Window4Diff'].show()

    // 	setTimeout (  () => {
    // 		const el = document.querySelector('#WinDiff0301___BV_modal_content_');
    // 		el.requestFullscreen();
    // 	}, 200);
    // },
    ThemeSwitch (color) {
      // Theme:Black 切換
      //
      this.themePacks.themeBlack = color !== "white";
      //
      let activate = this.themePacks.themeBlack;
      let className = this.themePacks.themeBlackName;
      const el = document.body;
      //
      if (activate) {
        el.classList.add(className);
      } else {
        el.classList.remove(className);
      }
      console.log(this.$logs(this.$IsThemeBlack() ? "Black" : "White"));
    },
    WinMass4Objective () {
      console.log(this.$logs());
      this.winMassComponent = false;
      //
      this.winMassHeadBgV = "danger";
      this.winMassHeadTxV = "white";
      //this.winMassBodyBgV = 'dark'
      //
      this.winMassTitle = "醫師客訴";
      this.winMassContent = this.theProcedure.Objective;
      this.$refs["Window4Mass"].show();
    },
    WinMass4Subjective () {
      console.log(this.$logs());
      this.winMassComponent = false;
      //
      this.winMassHeadBgV = "info";
      this.winMassHeadTxV = "white";
      //this.winMassBodyBgV = 'dark'
      this.winMassTitle = "病患主訴";
      this.winMassContent = this.theProcedure.Subjective;
      this.$refs["Window4Mass"].show();
    },
    WinMass4Phrase () {
      console.log(this.$logs());
      //WinMass0301___BV_modal_content_"
      this.winMassComponent = true;
      //
      this.winMassHeadBgV = "primary";
      this.winMassHeadTxV = "white";
      //this.winMassBodyBgV = 'dark'
      this.winMassTitle = "片語維護";
      this.$refs["Window4Mass"].show();
    },
    WinMass4Radiographer () {
      console.log(this.$logs());
      this.winMassComponent = false;
      //
      this.winMassHeadBgV = "warning";
      this.winMassHeadTxV = "dark";
      //this.winMassBodyBgV = 'dark'
      this.winMassTitle = "檢查註記";
      this.winMassContent = this.theProcedure.RadiographerNote;
      this.$refs["Window4Mass"].show();
    },
    WinMass4ShiftNote () {
      console.log(this.$logs());
      if (this.ShiftNoteNotice) {
        this.winMassComponent = false;
        //
        this.winMassHeadBgV = "info";
        this.winMassHeadTxV = "white";
        //is.winMassBodyBgV = 'dark'
        this.winMassTitle = "交班記錄";
        this.winMassContent = this.theProcedure.ShiftNote;
        this.$refs["Window4Mass"].show();
      }
    },
    checkReportContent (num, auto) {
      let ok = true;
      this.theReport.ReportContent = this.theReport.ReportContent
        ? this.theReport.ReportContent.trim()
        : "";
      if (this.showImgReport) return ok;
      if (!this.theReport.ReportContent) {
        auto ? "" : this.ObjApp.TimingMessage("尚未輸入報告內容, 不得存檔.", 2);
        ok = false;
      } else if (
        this.origReportContent === this.theReport.ReportContent &&
        num === 63
      ) {
        auto ? "" : this.ObjApp.TimingMessage("報告內容並無異動, 無需存檔.", 2);
        ok = false;
      } else if (!this.ApprovalPhysicianName && num !== 63) {
        this.ObjApp.TimingMessage("尚未選擇審核醫師,不得存檔.", 2);
        ok = false;
      }
      return ok;
    },

    checkCstReportData (num, auto) {
      let ok = true;
      const data = this.DxRStructureData
        ? JSON.stringify(this.DxRStructureData)
        : "";
      if (!this.showImgReport) return ok;
      if (!data) {
        auto ? "" : this.ObjApp.TimingMessage("尚未輸入報告內容, 不得存檔.", 2);
        ok = false;
      } else if (data === this.origCstHtmlData && num === 63) {
        auto ? "" : this.ObjApp.TimingMessage("報告內容並無異動, 無需存檔.", 2);
        ok = false;
      } else if (!this.ApprovalPhysicianName && num !== 63) {
        this.ObjApp.TimingMessage("尚未選擇審核醫師,不得存檔.", 2);
        ok = false;
      }
      return ok;
    },

    DataSave (num, autoSave) {
      const ok = this.checkReportContent(num, autoSave);
      if (!ok && !this.showImgReport) return;
      const cstOk = this.checkCstReportData(num, autoSave);
      if (!cstOk && this.showImgReport) return;
      const HTML = 21;
      this.showImgReport
        ? (this.theReport.DxrType = HTML)
        : (this.theReport.DxrType = 11); // for 21 is html , 11 is text

      this.theReport.ApprovalPhysicianId = this.ApprovalPhysicianName; // name is id hemere
      const ret = this.approvalList.find(s => {
        return s.value === this.theReport.ApprovalPhysicianId;
      });
      this.theReport.ApprovalPhysicianName = ret && ret.text ? ret.text : ""; // get real name

      this.theReport.DxrStatus = num;

      if (this.theReport.DxrType === HTML) {
        this.DxRStructureImage = this.reportImg; // base 64
        this.DxReportContent = this.cstReportHtml;
      } else {
        this.DxRStructureData = "";
        this.DxRStructureImage = "";
      }
      if (!this.theReport.DxreportPhysicianId) {
        this.theReport.DxreportPhysicianId = this.loginId;
      }

      //this.theReport.DxreportPhysicianId = this.theReport.DxreportPhysicianId = 'dummy';
      this.save(autoSave);
      //this.FocusOnContent()
    },

    async save (auto) {
      let opStatus = true;
      this.theReport.IssuePhysicianId = this.theReport.ApprovalPhysicianId;
      try {
        auto ? "" : this.ObjApp.WaitingShow();
        await window.axios.post(
          `/report/Save?accessionNos=${this.theProcedure.AccessionNo}`,
          this.theReport
        );
      } catch (err) {
        opStatus = false;
      } finally {
        if (auto) return;
        this.ObjApp.WaitingHide();
        if (opStatus) {
          this.ObjApp.TimingMessage("資料已完成存檔作業");
          this.continuousReportCode == "N" ? "" : this.viewNextRecord(true);
        } else {
          this.ObjApp.TimingMessage("存取時發生錯誤!" + "! 請稍後再試.", 2);
        }
      }
      return opStatus;
    },

    HelpShow () {
      // 按鈕:功能說明
      /*
			// 20191023.0850 Pollux, 只是框架和測試...
			console.log(this.$logv())
			let content = "<h4>Hotkey</h4><hr class='mb-1'><b-row>HTML 測試: 中文 + <kbd>Samples</kbd> + English</b-row>"
			this.ObjApp.HelpShow({
				Content: content
			})
			*/
      // 20191029 Pollux, 這功能的說明會太複雜了, 用 local 的先, 日後再思考怎麼改?
      this.WinHelpSelf();
    },
    backToPreviousRoute () {
      this.$router.push("/MI03/FI0306");
    },
    WinHelpSelf () {
      console.log(this.$logs());
      //
      let IsThemeBlack = this.$IsThemeBlack();
      this.winConfig4HotkeyDetect.Title = "功能說明";
      this.winConfig4HotkeyDetect.HeadBgV = IsThemeBlack
        ? "success"
        : "primary";
      this.winConfig4HotkeyDetect.HeadTxV = IsThemeBlack ? "light" : "light";
      //
      this.$refs["WinHelp"].show();
    },
    HKWatch (event) {
      // 熱鍵 vs. 功能 分派器
      //console.log(this.$logs())
      //
      // 取得 自訂按鍵辨識字串
      let keyCombine = KeyPressIdentifier(event);
      if (!keyCombine) {
        return;
      }
      //
      // HotKey 機制之開啟或閉鎖機制
      if (!this.allowHotKeyFunctional) {
        console.log(this.$logs("OFF"));
        return;
      }
      //
      //this.HotkeyPressed = keyCombine
      let runMethod = null;
      let param = "";
      this.HotkeyList.some(e => {
        if (e.hotkey === keyCombine) {
          runMethod = e.method;
          param = e.param;
          return true;
        }
      });
      //
      if (runMethod) {
        console.log(this.$logs(runMethod));
        event.preventDefault();
        this[runMethod](param);
      }
    },
    // BMWatch(bvEvent, modalId) {
    //   // b-Modal Watcher
    //   console.log(this.$logs(`${modalId}.${bvEvent.type}`));
    //   //
    //   //let cstRoot = $(`#WinCST0301DxRSC`)
    //   //WinCST
    //   if (
    //     modalId === "WinCST0301" &&
    //     bvEvent.type === "shown" &&
    //     this.DxRStructureData
    //   ) {
    //     console.log("WinCST.shown");
    //     //console.log($(`#WinCST0301DxRSC`))
    //     //console.log($(`#WinCST0301DxRSC [name="input_date"]`))
    //     //TODO:若有值, 填回對應項目之值
    //     //let cstRoot = $(`#WinCST0301DxRSC`)
    //     //console.log(cstRoot)
    //     let valueSet = JSON.parse(this.DxRStructureData);
    //     if (valueSet && valueSet.length > 0) {
    //       valueSet.forEach(e => {
    //         console.log(e.name + " > [" + e.value + "]");
    //         let item = $(`#WinCST0301DxRSC [name="${e.name}"]`);
    //         if (item && item.length > 0) {
    //           let detail = item[0];
    //           if (
    //             ",INPUT,TEXTAREA,SELECT,".indexOf(`,${detail.tagName},`) >= 0
    //           ) {
    //             if (detail.type === "radio" || detail.type === "checkbox") {
    //               $.each(item, (index, content) => {
    //                 if (content.value === e.value) {
    //                   content.checked = true;
    //                   return false;
    //                 }
    //               });
    //             } else {
    //               item.val(e.value);
    //             }
    //             //
    //           }
    //         }
    //       });
    //     }
    //     //
    //   }
    //   //
    //   if (modalId === "WinConfig") {
    //     if (",shown,".indexOf(`,${bvEvent.type},`) >= 0) {
    //       this.allowHotKeyFunctional = false;
    //     } else if (",hidden,".indexOf(`,${bvEvent.type},`) >= 0) {
    //       this.allowHotKeyFunctional = true;
    //     }
    //     return;
    //   } else if (modalId === "WinHotkeyDetect0301") {
    //     if (",shown,".indexOf(`,${bvEvent.type},`) >= 0) {
    //       this.UnderHotkeyDetect = true;
    //       window.removeEventListener("keydown", this.HKWatch);
    //       window.addEventListener("keydown", this.KeyPressInterceptor);
    //     } else if (",hidden,".indexOf(`,${bvEvent.type},`) >= 0) {
    //       window.removeEventListener("keydown", this.KeyPressInterceptor);
    //       window.addEventListener("keydown", this.HKWatch);
    //       this.UnderHotkeyDetect = false;
    //     }
    //     return;
    //   } else if (modalId === "WinWait") {
    //     // 只是遮罩, 無須處理
    //     return;
    //   }
    //   //
    //   this.allowHotKeyFunctional =
    //     ",show,shown,".indexOf(`,${bvEvent.type},`) < 0;
    // },
    KeyCode2Text (code) {
      // 轉換 自訂按鍵辨識字串 為 html tag 值, 以利在畫面上突顯呈現
      let value = "";
      if (code.indexOf(KeyCode4Control) >= 0) {
        value += "<kbd>Ctrl</kbd> + ";
        code = code.replace(KeyCode4Control, "");
      }
      if (code.indexOf(KeyCode4Alternate) >= 0) {
        value += "<kbd>Alt</kbd> + ";
        code = code.replace(KeyCode4Alternate, "");
      }
      if (code.indexOf(KeyCode4Shift) >= 0) {
        value += "<kbd>Shift</kbd> + ";
        code = code.replace(KeyCode4Shift, "");
      }
      if (code && code.length > 0) {
        value += `<kbd>${code === " " ? "Space" : code}</kbd>`;
      }
      //
      if (!value || value.length <= 0) {
        return "(尚未設定)";
      }
      return value;
    },
    Item4Config (e) {
      // 開啟 熱鍵取值 視窗
      console.log(this.$logs(e));
      //
      this.HotkeyCurrentItemName = e;
      //
      let IsThemeBlack = this.$IsThemeBlack();
      let textVariant = IsThemeBlack ? "warning" : "primary";
      let currentValue = "";
      let defaultValue = "";
      this.HotkeyTempSet.some(el => {
        if (el.title === e) {
          currentValue = this.KeyCode2Text(el.hotkey);
          defaultValue = this.KeyCode2Text(el.default);
        }
      });
      this.HotkeyPressRemark = `<span class="text-${textVariant}">目前設定值為 ${currentValue} 預設值為 ${defaultValue}</span>`;
      //
      this.HotkeyPressed = "";
      this.HotkeyPressMessage = "等待 您的輸入w...";
      //
      this.winConfig4HotkeyDetect.Title = "Hotkey 設定︰" + e;
      this.winConfig4HotkeyDetect.HeadBgV = IsThemeBlack ? "info" : "primary";
      this.winConfig4HotkeyDetect.HeadTxV = IsThemeBlack ? "light" : "light";
      //
      this.$refs["WinHotkeyDetect"].show();
    },
    WinConfigOpen () {
      // 開啟 組態設定 視窗
      console.log(this.$logs());
      //
      this.HotkeyTempSet = this.$DeepCopy(this.HotkeyList);
      //
      let IsThemeBlack = this.$IsThemeBlack();
      //this.winConfigure.Title = '組態設定'
      this.winConfigure.HeadBgV = IsThemeBlack ? "success" : "primary";
      this.winConfigure.HeadTxV = IsThemeBlack ? "light" : "light";
      //
      this.$refs["WinConfig"].show();
    },
    reportTemplateOpen () {
      if (!this.isCtMri) return;
      this.HotkeyTempSet = this.$DeepCopy(this.HotkeyList);
      let IsThemeBlack = this.$IsThemeBlack();
      this.winConfig4ReportTemple.Title = "癌篩報告";
      this.winConfig4ReportTemple.HeadBgV = IsThemeBlack
        ? "success"
        : "primary";
      this.winConfig4ReportTemple.HeadTxV = IsThemeBlack ? "light" : "light";
      //
      this.$refs["reportTemplate"].show();
    },
    versionHistoryOpen () {
      if (!this.reportHistory.length) {
        this.ObjApp.TimingMessage("無報告版次", 2);
        return;
      }
      this.HotkeyTempSet = this.$DeepCopy(this.HotkeyList);
      let IsThemeBlack = this.$IsThemeBlack();
      this.winConfig4VersionHistory.Title = "版本歷史";
      this.winConfig4VersionHistory.HeadBgV = IsThemeBlack
        ? "success"
        : "primary";
      this.winConfig4VersionHistory.HeadTxV = IsThemeBlack ? "light" : "light";
      this.$refs["versionHistory"].show();
    },
    // WinIQControlEdit() {
    // 	// 開啟 影像品質 資訊編輯視窗
    // 	console.log(this.$logs())
    // 	//
    // 	let IsThemeBlack = this.$IsThemeBlack()
    // 	//this.winIQControl.Title = '影像品質'
    // 	this.winIQControl.HeadBgV = IsThemeBlack ? 'success' : 'primary'
    // 	this.winIQControl.HeadTxV = IsThemeBlack ? 'light' : 'light'
    // 	//
    // 	this.$refs['WinIQControl'].show()
    // },
    WinCSTOpen () {
      // 開啟 癌篩樣版 資訊編輯視窗
      console.log(this.$logs());
      if (this.fullScreen) {
        return;
      }
      this.showImgReport = true;
      //
      let IsThemeBlack = this.$IsThemeBlack();
      //this.winConfig4StructureReport.Title = '影像品質'
      this.winConfig4StructureReport.HeadBgV = IsThemeBlack
        ? "success"
        : "primary";
      this.winConfig4StructureReport.HeadTxV = IsThemeBlack ? "light" : "light";
      //
      this.$refs["WinCST"].show();
      //
      //TODO:若有值, 填回對應項目之值
      let cstRoot = $(`#WinCST0301DxRSC`);
      console.log(cstRoot);
      if (!this.DxRStructureData) return;
      let valueSet = JSON.parse(this.DxRStructureData);
      if (valueSet && valueSet.length > 0) {
        valueSet.forEach(e => {
          console.log(e.name + " > [" + e.value + "]");
        });
      }
      //
    },
    saveFullScreenForm () {
      let valueSet = $(`#WinCST0301DxRSC`).serializeArray();
      let valueString = valueSet ? JSON.stringify(valueSet) : "";
      //
      console.log(valueString);
      this.DxRStructureData = valueString;
    },
    WinCSTHide (bvModalEvt) {
      console.log(this.$logs());
      // 嘗試取值, 需要時可用 deepcopy
      this.saveFullScreenForm();
      const color = this.isWhite ? "white" : this.isBlack ? "black" : this.gray;
      const img = document.querySelector(".img-border");
      const ops = {
        backgroundColor: color
      };

      html2canvas(document.querySelector("#my-report-img"), ops).then(
        canvas => {
          this.reportImg = canvas.toDataURL();
          document.querySelector("#blkReportInput").scrollTop = 0;
          img.style.border =
            "1px solid " + (color != "white" ? "white" : "blue");
        }
      );
    },
    KeyPressInterceptor (e, debugMode = false) {
      // 熱鍵取值框 的 按鍵攔截處理
      //	- 基本邏輯跟 KeyPressIdentifier.js 差不多, 但細部處理不同, 所以得重寫一份
      //
      if (debugMode) console.log(this.$logs());
      if (debugMode)
        console.log(
          `> key(${e.key}), keyCode(${e.keyCode}), code(${e.code}) @ location(${e.location})`
        );
      //
      // 停止預設功能
      //	- 20191028 Pollux, 在這裡得先強迫不執行按鍵的預設行為, 才不會干擾到取值作業
      //	- !! 還是有按鍵是無法攔截或停止預設行為的, 通常是作業系統的操作鍵, 如: Alt-F4, Alt-Tab, ...
      //	- event 是預設傳入的參數
      event.preventDefault();
      //
      // 發生了新的按鍵事件, 先重置畫面上的相關資訊
      this.HotkeyPressed = "";
      this.HotkeyPressMessage = "等待 您的輸入...";
      //
      let code = e.key;
      //
      // 排除三大複合鍵
      if (",Alt,Control,Shift,".indexOf("," + code + ",") >= 0) {
        return null;
      }
      //
      if (
        ",CapsLock,Escape,Meta,NumLock,Process,Tab,Home,End,PageUp,PageDown,ArrowUp,ArrowDown,ArrowLeft,ArrowRight,Insert,Delete,Enter,ScrollLock,Pause,ContextMenu,".indexOf(
          "," + code + ","
        ) >= 0
      ) {
        // 特定功能鍵直接不處理
        this.HotkeyPressed = "";
        this.HotkeyPressMessage = `您按下的是<span class='align-text-bottom mx-1'><kbd>${code}</kbd></span>, <span>不得設為 hotkey !</span>`;
        this.ObjApp.TimingMessage(
          `按鍵[${code}]為特定功能鍵, 不得設為 hotkey !`,
          2
        );
        return null;
      }
      //
      // 用這個變數來組出最終的比對標的
      let keyCombine = "";
      let interpret = "";
      // 複合性功能鍵判斷, 依序為: 1.Contral, 2.Alt, 3.Shift
      if (e.ctrlKey) {
        keyCombine += KeyCode4Control;
        interpret += "<kbd>Ctrl</kbd> + ";
      }
      if (e.altKey) {
        keyCombine += KeyCode4Alternate;
        interpret += "<kbd>Alt</kbd> + ";
      }
      if (e.shiftKey) {
        if (
          !(
            RegExp(/[`!@#$%^&*()_+}{|":?/><]/).test(code) ||
            (code.length === 1 && RegExp(/[A-Z]/).test(code))
          )
        ) {
          keyCombine += KeyCode4Shift;
          interpret += "<kbd>Shift</kbd> + ";
        } else {
          if (debugMode) console.log(this.$logs("Shift 被排除了!"));
        }
      }
      //
      code = code.toUpperCase();
      keyCombine += code;
      interpret += this.KeyCode2Text(code);
      //
      if (
        keyCombine.length === 1 &&
        //gExp(/[`!@#$%^&*()_+}{|":;'?/><\[\],.\-=]/).test(keyCombine) ||
        (RegExp(/[`!@#$%^&*()_+}{|":;'?/><[\],.\-=]/).test(keyCombine) ||
          RegExp(/[0-9]/).test(keyCombine) ||
          RegExp(/[A-Z]/).test(keyCombine) ||
          keyCombine === " ")
      ) {
        this.HotkeyPressMessage = `您按下的是<span class='align-text-bottom mx-1'>${interpret}</span>, <span>不得設為 hotkey !</span>`;
        return;
      }
      //
      this.HotkeyPressed = keyCombine;
      this.HotkeyPressMessage = `您按下的是<span class='align-text-bottom mx-1'>${interpret}</span>`;
      if (debugMode)
        console.log(this.$logs(`this.HotkeyPressed=[${this.HotkeyPressed}]`));
    },
    //
    // 熱鍵取值框 事件處理
    //	- 請小心注意 事件 的執行順序...
    //
    ModalOk (bvModalEvt) {
      console.log(this.$logs());
    },
    ModalCancel (bvModalEvt) {
      console.log(this.$logs());
    },
    ModalClose (bvModalEvt) {
      this.UnderHotkeyDetect = false;
      //console.log(this.$logs(`UnderHotkeyDetect: ${this.UnderHotkeyDetect}`))
    },
    ModalHide (bvModalEvt) {
      //console.log(this.$logs(`UnderHotkeyDetect: ${this.UnderHotkeyDetect}`))
      if (this.UnderHotkeyDetect) {
        bvModalEvt.preventDefault();
      }
    },
    setDefaultBackgroundColor () {
      // 引入 Theme:Black, 日後再調成是從 個人設定 中轉入
      let cls = localStorage["theme-modal-bg-color"];
      this.isWhite = cls == "white" || !cls;
      this.isBlack = cls == "black";
      this.isGray = !this.isWhite && !this.isBlack && cls;
      !cls ? (cls = "white") : "";
      this.ThemeSwitch(cls);
      if (!this.isWhite) {
        document.documentElement.style.setProperty(
          "--theme-modal-bg-color",
          cls
        );
      }

      document.addEventListener("fullscreenchange", () => {
        // document.fullscreenElement will point to the element that
        // is in fullscreen mode if there is one. If there isn't one,
        // the value of the property is null.
        document.querySelector("#blkReportInput").scrollTop = 0;
        if (document.fullscreenElement) {
          this.fullScreen = true;
        } else {
          this.fullScreen = false;
          document.querySelector(".close").click();
        }
      });
    },
    //
    EndOfKPInterceptor () {
      // 熱鍵設定完成後, 存入暫時組態集
      console.log(this.$logs(this.HotkeyCurrentItemName));
      //
      let newHotkey = this.HotkeyPressed;
      // 如新熱鍵不為空值, 先清掉重複的
      if (newHotkey && newHotkey.length > 0) {
        this.HotkeyTempSet.forEach(e => {
          if (e.hotkey === newHotkey) {
            e.hotkey = "";
          }
        });
      }
      // 找到對應項目, 設入新熱鍵值
      this.HotkeyTempSet.some(e => {
        if (e.title === this.HotkeyCurrentItemName) {
          e.hotkey = this.HotkeyPressed;
          console.log(
            this.$logs(`${this.HotkeyCurrentItemName} > ${e.hotkey}`)
          );
          return true;
        }
      });
      // 關閉熱鍵取值框
      this.UnderHotkeyDetect = false;
      this.$refs["WinHotkeyDetect"].hide();
    },
    HotkeyConfigReset () {
      console.log(this.$logs());
      //
      this.HotkeyTempSet = this.$DeepCopy(this.HotkeyList);
      this.ObjApp.TimingMessage("組態設定已回復原值");
    },
    HotkeyConfigDefault () {
      console.log(this.$logs());
      //
      this.HotkeyTempSet.forEach(e => {
        e.hotkey = e.default;
      });
      this.ObjApp.TimingMessage("組態設定已重置為預設值");
    },
    async HotkeyConfigSave () {
      this.HotkeyList = this.$DeepCopy(this.HotkeyTempSet);
      let param = {
        AccId: this.UserId,
        Setting: JSON.stringify(this.HotkeyList)
      };
      try {
        this.ObjApp.WaitingShow();
        let obj = {
          EmployeeNo: this.loginId,
          PersonalSetting: JSON.stringify(param)
        };
        await window.axios.put(
          `/employee/SavePersonalSetting?employeeNo=${this.loginId}`,
          obj
        );
        let okMessage = `組態設定已完成`;
        this.ObjApp.TimingMessage(okMessage);
      } catch (e) {
        this.ObjApp.TimingMessage("組態設定 FAIL");
      } finally {
        this.ObjApp.WaitingHide();
      }
    },

    getDataFromStore () {
      // alert("900000")
      // if(!window.dtcEvaluationDataList || !window.dtcEvaluationDataList.length || this.currentNum < 1 ) {
      //   this.$router.replace({ name: "FI0306" });
      //   return;
      // }
      // alert("getDataFromStore Fn")
      // console.log(this.initArray)

      // if(!this.initArray.length) {
      //   alert("coming ")
      //   console.log(window.dtcEvaluationDataList)
      //   this.initArray = [...window.dtcEvaluationDataList];
      //   console.log(this.initArray)
      // }else if(this.nextViewArr && this.nextViewArr.length) {
      //   this.initArray = [...this.initArray, ...this.nextViewArr];
      //   this.nextViewArr= [];
      // }
      //console.log(JSON.stringify(d,0, 2));
      // const d = Object.assign({},this.initArray[this.currentNum - 1]);
      // console.log('getDataFromStore ' + JSON.stringify(d,0, 2));

      //接FI0306的table 的資料
      const d = window.dtcEvaluationDataList;
      console.log(d);
      console.log(d.DxrVersion);
      console.log(this.theReport);
      // thomas
      this.theProcedure.OrderNo = d.OrderNo;
      this.isFromFI0307 = d.isFromFI0307;
      //isFromFI0307 從FI0307進來，所以設定evaluatiedInfoIsEval為false
      if (this.isFromFI0307) {
        console.log(this.$logs("from FI0307"));
        this.evaluatiedInfoIsEval = false;
        //此時會將前一頁搜尋結果一併帶入作暫存 當回去時 順手打回去避免重新查詢造成太久
        this.FI0307Data = this.$route.params.FI0307TempData;
        this.FI0307Count = this.$route.params.FI0307TempCount;
        this.FI0307TempQuery = this.$route.params.FI0307TempQuery;
        this.FI0307TempCurrentPage = this.$route.params.FI0307TempCurrentPage;
      }

      this.theProcedure.AccessionNo = d.AccessionNo;
      this.theProcedure.StudyDate = d.ProcedureCompleted;
      this.theProcedure.Modality = d.Modality;
      this.theProcedure.PatientId = d.PatientId;
      this.theProcedure.PatientSourceType =
        d.PatientSourceTypeCode + "-" + d.PatientSourceTypeName;
      this.theProcedure.PatientName = d.PatientName;
      this.theProcedure.PatientSex = d.PatientSex;
      this.theProcedure.BedNo = d.BedNo ? d.BedNo : "暫無記錄";
      this.theProcedure.RequestingPhysicianName = d.RequestingPhysicianName;
      this.casePriorityCode = d.EmgFlag;
      this.labProcedures = d.ProcedureName;
      this.theProcedure.Subjective = d.Subjective;
      this.theProcedure.Objective = d.Objective;
      this.theProcedure.RadiographerNote = d.RadiographerNote;
      this.theProcedure.ShiftNote = d.shiftNote;
      this.theProcedure.StatusName = d.StatusName;
      this.statusName = d.StatusName;
      this.theProcedure.PatientAge = d.PatientAge;
      this.theProcedure.DeviceName = d.DeviceName;
      this.theProcedure.PatientBirthday = this.DateToString(
        new Date(d.PatientBirthday)
      );
      this.theProcedure.DxrVersion = d.DxrVersion;
    },

    normalizeReportData () {
      // hold the data for comparing in saving
      this.origReportContent = this.theReport.ReportContent;
      // hold the html data, wihout HTML only data part
      this.origCstHtmlData = this.DxRStructureData
        ? JSON.stringify(this.DxRStructureData)
        : "";

      // check CST img ; if has, display img now
      this.reportImg = this.DxRStructureImage;
      if (this.reportImg) {
        this.showImgReport = true;
        this.cstReportHtml = "" + this.DxReportContent;
        this.DxReportContent = "";
      }

      if (!this.theReport.OrderNo) {
        this.theReport.OrderNo = this.theReport.AccessionNo.split("_")[0];
      }

      if (!this.theReport.DxrStatus) {
        this.theReport.DxrStatus = 63;
      }

      if (!this.theReport.DxrVersion) {
        this.theReport.DxrVersion = "1";
      }

      this.theReport.PatientId = this.theProcedure.PatientId
        ? this.theProcedure.PatientId
        : "" + new Date().getTime();

      if (!this.DxReportIQCode) {
        this.DxReportIQCode = "30";
      }

      this.ApprovalPhysicianName = this.theReport.ApprovalPhysicianId;
      if (!this.ApprovalPhysicianName && this.canApproveReport) {
        const v = this.reportList.find(s => s.id === this.loginId);
        this.ApprovalPhysicianName = v.id;
      }
    },

    async viewRecordByCurrentNumber () {
      this.cstReportHtml = this.reportImg = this.showImgReport = "";
      this.getDataFromStore();
      this.dxrVersion = `${this.currentNum}/${this.totalArrayLen}`;
      this.ObjApp.WaitingShow();
      this.theReport = await window.axios.get(
        "/Report/Get?accessionNo=" + this.theProcedure.AccessionNo
      );
      this.normalizeReportData();
      this.ObjApp.WaitingHide();
    },

    async call3rdParty () {
      this.ObjApp.TimingMessage("已呼叫PACS");
      try {
        await fetch(
          `http://192.168.1.100/pkg_pacs/external_interface.aspx?LID=image&LPW=image&PID=03935747&AN=9130C83849`
        );
      } finally {
        console.log("");
      }
    },
    async viewNextRecord (redirect) {
      ++this.currentNum;
      if (this.currentNum > this.totalArrayLen) {
        --this.currentNum;
        if (redirect) this.$router.replace({ name: "FI0306" });
        return;
      }
      this.viewRecordByCurrentNumber();
    },
    async viewPrevRecord () {
      --this.currentNum;
      if (this.currentNum < 1) {
        ++this.currentNum;
        return;
      }
      this.viewRecordByCurrentNumber();
    },
    initCmp () {
      // 取得 App.vue 參照
      let obj = this.$GetApp(this);
      this.ObjApp = obj[0];
      this.VueNestLevel = obj[1];

      // 宣告監聽器:攔截 KeyPress
      window.addEventListener("keydown", this.HKWatch);
    },
    async getHotKeySetting () {
      try {
        this.HotkeyList = [];
        const map = await window.axios.get(
          `/employee/GetPersonalSetting?employeeNo=${this.loginId}`
        );
        const jsonObj = JSON.parse(map);
        // might throw error below since the it might has no seeting at all .
        const a = JSON.parse(jsonObj.Setting);
        this.HotkeyList = [...a];
      } catch (e) {
        //alert('get personal setting fail ajax');
      } finally {
        if (!this.HotkeyList.length) this.HotkeyList = [...defaultHotKeyArr];
      }
    },
    async saveFile () {
      if (
        !this.isDataChange ||
        this.get999Status() ||
        this.theReport.DxrStatus == 71
      )
        return;
      this.isDataChange = false;
      await this.DataSave(63, true);
    },
    ReturnToFI0307 () {
      //基本上應該要有資料啦....沒資料的情況...再說囉～
      // this.$route.params.FI0307TempData = this.FI0307Data;
      this.$router.replace({
        name: "FI0307",
        params: {
          FI0307TempData: this.FI0307Data,
          FI0307TempCount: this.FI0307Count,
          FI0307TempCheckItems: this.FI0307TempCheckItems,
          FI0307TempQuery: this.FI0307TempQuery,
          FI0307TempCurrentPage: this.FI0307TempCurrentPage
        }
      });
    },
    //選擇tab時塞入資料
    ShowData (idx) {
      console.log("你選擇第" + idx + "頁籤");
      this.$nextTick(() => {
        let x1 = this.cstTab[idx].StructureData;
        let valueSet = JSON.parse(x1);
        console.log("showdata 得到valueset");
        console.log(valueSet);
        //
        if (valueSet && valueSet.length > 0) {
          valueSet.forEach(e => {
            console.log("name:" + e.name + " value:" + e.value);
            let item = $(`#${customizeIdLead}${idx + 1} [name="${e.name}"]`);
            //
            // console.log(item[0]);
            if (item[0].type === "radio" || item[0].type === "checkbox") {
              $.each(item, (index, content) => {
                if (content.value === e.value) {
                  content.checked = true;
                  return false;
                }
              });
            } else {
              item.val(e.value);
            }
          });
        }
      });
    },
    //switch cst report
    SwitchCST () {
      console.log(this.$logs("start"));
      //
      this.showcst = !this.showcst;
      //
      if (!this.showcst) {
        this.ShowData(0);
      }
      //
      console.log(this.$logs("end"));
    },
    async DataGethering1 () {
      let MethodName = "DataGethering1";
      console.log(this.$logs("start", MethodName));
      //
      // 抓報告資料
      //this.reportHistory = await window.axios.get(`/Report/GetVersionList?accessionNo=${this.theProcedure.AccessionNo}`);
      this.getDataFromStore(true);

      let url = this.theProcedure.AccessionNo;
      if (this.theProcedure.DxrVersion) {
        url += "&version=" + this.theProcedure.DxrVersion;
      }
      if(this.theProcedure.PatientId) {
        url += "&patientId=" + this.theProcedure.PatientId;
      }
      this.theReport = await window.axios.get("/Report/Get?accessionNo=" + url);
      //指定目前版本
      console.log(this.theReport);
      this.evaluation.DxRVersion = this.theReport.DxrVersion;
      //
      //let customizeIdLead = 'Id4StructureHTML'
      let cstdata = [];
      if (
        this.theReport.StructureContent1 &&
        this.theReport.StructureContent1.length > 0
      ) {
        for (let i = 1; i < 7; i++) {
          let ct1 = this.theReport[`StructureContent${i}`];
          if (ct1 && ct1.length > 0) {
            // 變更輸入 tags 為 disabled
            let inputHtml = ct1.replace(
              /<input /g,
              "<input disabled='disabled' "
            );
            let textAreaHtml = inputHtml.replace(
              /<textarea /g,
              "<textarea disabled "
            );
            let html = textAreaHtml.replace(/<select /g, "<select disabled ");
            // 暫存
            cstdata.push({
              CSTName: this.theReport["CSTName" + i] || "Unknown",
              StructureImage: this.theReport["StructureImage" + i],
              StructureData: this.theReport["StructureData" + i],
              StructureContent: html,
              TagId: `${customizeIdLead}${i}`
            });
          }
        }
      }
      //
      this.cstreport = "";
      if (cstdata.length > 0) {
        // 有癌篩報告
        this.cstreport = false;
        this.cstTab = cstdata;
      }
      //
      // console.log(this.$logs("end", MethodName));
    },
    async GetEvaCheckBox () {
      //得到EvaluationCheckboxList
      await window.axios
        .get("/generalData/SelectNoList?groupNo=DxReportAnonymousEvaluation")
        .then(r => {
          // console.log("get_evaluation_list");
          // console.log(r.Items);
          this.evaluationCheckBox = r.Items;
        })
        .catch(e => {
          // console.log(e);
          // console.log("沒有得到evaluation_checkbox_list");
        });
    },
    async GetEvaInfo () {
      await window.axios
        .get(
          "/reportEvaluate/GetEvaluates?accessionNo=" +
          this.theProcedure.AccessionNo
        )
        .then(r => {
          console.log("得到匿名評分日期");
          console.log(this.theProcedure.AccessionNo);
          console.log(this.reportHistory);
          console.log(r);
          this.historyList = r.Items;
          //判斷是否已評分過
          console.log(this.theProcedure.AccessionNo);
          console.log("FI0306-1 iseval");
          console.log(r.IsEval);
          this.evaluatiedInfoIsEval != r.IsEval;
          if (r.IsEval) {
            this.evaluatiedInfo.checkEvaluatied = "評分完成";
            this.evaluatiedInfo.backgroundColor = "#28a745";
            this.evaluatiedInfo.color = "white";
            this.evaluatiedInfoIsEval = false;
          } else {
            this.evaluatiedInfo.checkEvaluatied = "尚未評分";
          }
        })
        .catch(e => {
          console.log(e);
        });
    },
    async GestImgData () {
      let imgs = await window.axios.get(
        "/GeneralData/SelectNoList?groupNo=ImageQuality"
      );
      let arr = [];
      imgs = imgs.Items;
      imgs.forEach(s => {
        arr.push({ value: s.No, text: s.Name });
        //normalize array to dislay
        this.optionsImageQuality = arr;
      });
    }
  },

  /*beforeMount() {
    //
    console.log(this.$logs("start", "beforeMount"));
    //
    
    
    //this.ObjApp.WaitingShow();
    //this.DataGethering1();
    //
    console.log(this.$logs("end", "beforeMount"));
    //
  },*/

  async mounted () {
    let MethodName = "mounted";
    console.log(this.$logs("Start", MethodName));
    //
    await this.DataGethering1();
    await this.GetEvaCheckBox();
    //評分完成 information
    await this.GetEvaInfo();
    await this.GestImgData();
    let t1 = $(`#${customizeIdLead}1`);
    console.log(this.$logs("ValueOf:", MethodName));
    console.log(t1);
    //
    const el = document.querySelector(".mounted");
    el.onscroll = () => {
      this.leftMost = !el.scrollLeft ? true : false;
      this.rightMost =
        el.scrollLeft + el.offsetWidth == el.scrollWidth ? true : false;
      //console.log(el.scrollLeft + el.offsetWidth);
    };
    //
    // 設定 b-modal listeners
    // this.$root.$on("bv::modal::show", this.BMWatch);
    // this.$root.$on("bv::modal::shown", this.BMWatch);
    // this.$root.$on("bv::modal::hide", this.BMWatch);
    // this.$root.$on("bv::modal::hidden", this.BMWatch);
    //
    // Chrome vs. FireFox 版面差異調整
    //	- 這兩個 browser 在 textarea 和 input 上有些高度上的差異, 但無法 normalize ...
    //
    // if(this.$refs.blkPhraseList) {
    // 	let blkSubjectiveHeight = this.$refs.blkSubjective.clientHeight
    // 	let blkPhraseListHeight = this.$refs.blkPhraseList.clientHeight
    // 	if(blkSubjectiveHeight && blkPhraseListHeight && blkPhraseListHeight < blkSubjectiveHeight) {
    // 		this.$refs.blkPhraseList.style.height = blkSubjectiveHeight + 'px'
    // 		//console.log(this.$logs(`blkPhraseList: ${blkPhraseListHeight} > ${this.$refs.blkPhraseList.clientHeight} (height)`))
    // 	}
    // }
    // if(this.$refs.blkHistoryList) {
    // 	let blkReportInputHeight = this.$refs.blkReportInput.clientHeight
    // 	let blkHistoryListHeight = this.$refs.blkHistoryList.clientHeight
    // 	if(blkReportInputHeight && blkHistoryListHeight) {
    // 		let blkDiff = blkReportInputHeight - 27//31, 這個數字得人工計算後微調
    // 		if(blkHistoryListHeight < blkDiff) {
    // 			this.$refs.blkHistoryList.style.height = blkDiff + 'px'
    // 			//console.log(this.$logs(`blkHistoryList: ${blkHistoryListHeight} > ${this.$refs.blkHistoryList.clientHeight} (height)`))
    // 		}
    // 	}
    // }
    // 先留下解析度資訊, 日後或許有用...
    console.log(
      this.$logs(
        `BView:${document.body.clientWidth}x${document.body.clientHeight}`
      )
    );
    console.log(this.$logs(`WView:${window.innerWidth}x${window.innerHeight}`));

    // this.setDefaultBackgroundColor();

    //
    //
    this.ObjApp.WaitingHide();
    console.log(this.$logs("end", MethodName));
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.prevRoute = from
    })
  },
  beforeRouteLeave (to, from, next) {
    if (to.name !== 'FI0307') {
      this.$store.unregisterModule("reportDataSrc");
    }
    next();
  },
  async created () {
    console.log('ROUTER', this.$route, this.$router);
    this.initCmp();
    this.getHotKeySetting();
    setInterval(() => this.saveFile(), 10 * 1000);
  },
  destroyed () {
    console.log(`${this.$logs()}`);
    // 解除監聽器:攔截 KeyPress
    window.removeEventListener("keydown", this.HKWatch);
    window.removeEventListener("keydown", this.KeyPressInterceptor);
    // 解除 Theme:Black
    const el = document.body;
    el.classList.remove(this.themePacks.themeBlackName);
    // 解除 b-modal listeners
    // this.$root.$off("bv::modal::show", this.BMWatch);
    // this.$root.$off("bv::modal::shown", this.BMWatch);
    // this.$root.$off("bv::modal::hide", this.BMWatch);
    // this.$root.$off("bv::modal::hidden", this.BMWatch);
    //
  },
  watch: {
    urgentOpt (v) {
      if (v != 6) {
        this.otherInput = "";
      }
    },
    showDetails (v) {
      const els = [...document.querySelectorAll(".sb4RHis")];
      if (!v) {
        els.forEach(el => {
          el.classList.add("sb4Hide");
        });
      } else {
        els.forEach(el => {
          el.classList.remove("sb4Hide");
        });
      }
    },
    "theReport.ReportContent" () {
      if (this.theReport.ReportContent) {
        this.isDataChange = true;
      }
    },
    "theReport.StructureData" () {
      if (this.theReport.StructureData) this.isDataChange = true;
    }
  }
};
</script>

<style lang="scss">
.text-black {
  color: black !important;
}
#app .themeBlack a {
  color: white !important;
}
#WinCST0301___BV_modal_header_ {
  .close {
    display: none;
  }
}

#WinCST0301___BV_modal_content_,
#WinMass0301___BV_modal_content_ {
  width: 100vw;
  height: 100vh;
}

#dropdown-1__BV_toggle_ {
  font-size: 12px !important;
  padding: 2px 8px !important;
  margin-left: 12px;
  margin-right: 12px;
  margin-top: -3px;
}

fieldset {
  border: none;
}
</style>
<style scoped>
/* -- 這行必須放在這裡, 才有作用 --*/
.themeBlack .input-group-text {
  background-color: rgba(0, 0, 0, 0.7);
  color: rgba(255, 255, 255, 0.7);
}

.cardHeader {
  padding: 0 1.25rem; /*2px 1.25rem;*/
  white-space: nowrap;
}

.scrollBox {
  width: 100%;
  height: 132px; /*132px*/
  white-space: nowrap;
  overflow: auto;
}

.sb4RHis {
  width: 100%;
  height: calc(100vh - 370px);
  /* white-space: nowrap; */
  overflow: auto;
}

.sb4Hide {
  height: calc(100vh - 300px) !important;
}

/* -- */
.blink {
  animation: blink-animation 1s ease-in-out infinite;
}

@keyframes blink-animation {
  to {
    opacity: 0;
  }
}
</style>
<style lang="scss" scoped>
.radioOptions {
  /deep/ label.custom-control-label {
    color: inherit !important;
  }
}

#blkReportInput {
  position: relative;
  overflow: auto;
  .sticky {
    position: absolute;
    right: 22px;
    top: 5px;
    width: auto;
    height: auto;
    z-index: 3;
    cursor: pointer;
  }
  .full {
    position: sticky;
    right: 12px;
    top: 25px;
    width: auto;
    height: auto;
    z-index: 3;
  }
  > div {
    z-index: 1;
  }
  img {
    position: absolute;
    display: block;
    z-index: 2;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: auto;
    object-fit: contain;
  }
}
</style>

<style lang="scss" scoped>
.detail-btn {
  position: absolute !important;
  left: 50%;
  transform: translateX(-50%);
  top: 0px;
  z-index: 2;
}
.vue-js-switch {
  background: transparent !important;
}
</style>

<style lang="scss">
.dropleft .dropdown-menu {
  max-height: 480px;
  overflow: auto;
}

.title-grid {
  display: grid;
  grid-template-columns: 160px 500px;
  grid-gap: 100px;
}

.main-toolbar {
  position: relative;
}

.dtc-arrow {
  position: absolute;
  width: 20px;
  height: 20px;
  color: white;
  font-weight: 800px;
  line-height: 60px;
  transform: translateY(-50%);
  cursor: pointer;
  display: block;
}

.left-arrow {
  left: 535px;
}

.right-arrow {
  left: 1370px;
}

.img-border {
  min-height: calc(100vh - 300px);
  object-position: top left;
}

.dtc-back {
  position: absolute;
  right: 12px;
  top: 0px;
  display: block;
  width: 100px;
  height: 38px;
}
@media (max-width: 1506px) {
  .dtc-back {
    margin-top: -50px;
  }
}
.dtc-his-grid {
  //grid-row-gap: 15px;
  > div {
    margin-bottom: 5px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    padding-right: 6px;
    height: 28px;
    cursor: pointer;
  }
}
.view-history-pop {
  display: flex;
  padding-top: 30px;
  font-size: 24px;
  .block {
    margin-bottom: 20px;
  }
  .left,
  .right {
    flex: 1;
    flex-direction: column;
  }
  .left {
    flex: 0 0 500px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .v-grid {
    display: grid;
    grid-template-columns: repeat(3, max-content max-content);
    grid-gap: 16px;
    margin-bottom: 20px;
  }
}

.urgent-opt {
  margin-top: 16px;
  margin-left: 16px;
  > label {
    display: inline-block;
    margin-left: 13px;
    margin-top: 4px;
    background: transparent !important;
  }
  .input {
    margin-left: 12px;
    width: 600px;
  }
  input[type="radio"] {
    transform: scale(1.5);
  }
}
.sms-input {
  margin-top: 15px;
  margin-bottom: 15px;
  display: inline-block;
  margin-left: 16px;
  width: 680px;
  height: 200px;
}
.urgent-btns {
  display: grid;
  grid-template-columns: max-content 140px max-content max-content;
  grid-gap: 30px;
  margin-left: 16px;
  margin-bottom: 16px;
}
.dtc-version-num {
  display: grid;
  grid-template-columns: 40px 1fr 40px;
  text-align: center;
}
//這個會把scrollbar藏起來 加FI0306-1指定到FI0306-1
#FI0306-1 ::-webkit-scrollbar {
  width: 0px; /* Remove scrollbar space */
  background: transparent; /* Optional: just make scrollbar invisible */
}
.first-row {
  position: relative;
  .positive-btn {
    position: absolute;
    left: 160px;
    top: 5px;
  }
}
.btn-right {
  position: relative;
}

.footer-b4-save {
  margin: 1.5rem;
  display: grid;
  grid-template-columns: 300px 1fr 100px 100px;
  grid-gap: 1rem;
}
</style>
<style lang="scss" scoped>
* {
  // border: 1px solid;
}
</style>
