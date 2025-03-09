<template>
  <div class="pageContent zhTW fix-light">
    <b-card no-body class="mx-1 border" bg-variant="transparent">
      <b-card-header class="bg-primary text-white cardHeader">
        <b-row no-gutters>
          <b-col cols="6" class="float-left text-left">進階搜尋</b-col>
        </b-row>
      </b-card-header>
      <b-card-text class="text-left py-1">
        <div class="d-grid grid-col-cusMx4Mi2 px-1" style="grid-gap: 2px">
          <b-form-group
            id="fieldset-horizontal"
            label="包含名單"
            label-for="input-horizontal"
            class="m-0 d-flex align-items-center form-list except-form-group bg-primary text-white input-title grid-span-2"
          >
            <el-select
              style="height:40px; width: 100%; border: none;"
              v-model="Whitevalue"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="包含內容"
            >
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
            class="m-0 d-flex align-items-center bg-primary except-form-group form-list text-white input-title grid-span-2 w-100"
          >
            <el-select
              style="height:40px; width: 100%; border: none;"
              v-model="Blackvalue"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="排除內容"
            >
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
            <b-input v-model="ViewData.AccessionNo" @keydown.enter="twpRefresh" />
          </b-input-group>
          <b-input-group prepend="病歷號">
            <b-input id="patientIdRef" ref="patientIdRef" v-model="ViewData.PatientId" @keydown.enter="twpRefresh" />
          </b-input-group>
          <b-input-group prepend="病患姓名">
            <b-input v-model="ViewData.PatientName" @keydown.enter="twpRefresh" />
          </b-input-group>
          <div class="d-flex">
            <b-input-group class="flex-1" prepend="病患年齡">
              <b-input min="0" v-model="ViewData.PatientAge" type="number" @keydown.enter="twpRefresh" />
              <b-input
                v-if="ViewData.PatientAgeAction === '~'"
                :min="parseInt(ViewData.PatientAge) + 1"
                v-model="ViewData.PatientAgeMax"
                type="number"
              />
            </b-input-group>

            <b-form-select
              :style="`width: ${ViewData.PatientAgeAction === '~' ? 70 : 120}px;`"
              v-model="ViewData.PatientAgeAction"
              :options="patientAgeActions"
            />
          </div>
          <b-input-group prepend="病患來源">
            <b-select v-model="ViewData.PatientSourceTypeCode" :options="PatientSource" />
          </b-input-group>

          <b-input-group v-if="versionNo === '805'" prepend="報告醫師">
            <v-super-select
              id="IssuePhysicianId"
              placeholder="請選擇"
              v-model="ViewData.IssuePhysicianId"
              :items="IssuePhysicianSource"
              name="text"
              value="value"
            ></v-super-select>
            <div class="clearInputValue" v-if="ViewData.IssuePhysicianId" @click="closeValue('IssuePhysicianId')">
              <b-icon icon="x" />
            </div>
          </b-input-group>
          <b-input-group v-else prepend="撰寫人員">
            <b-form-input
              v-model="ViewData.DxreportPhysician"
              list="DxreportPhysicianSource"
              @change="OnChangeDxreportPhysician"
              @keydown.enter="twpRefresh"
            ></b-form-input>
            <datalist id="DxreportPhysicianSource">
              <option
                class="dxreport-data-idx"
                v-for="(Item) in DxreportPhysicianSource"
                v-bind:key="Item.value"
                :value="Item.value"
              >
                {{ Item.text }}
              </option>
            </datalist>
          </b-input-group>

          <b-input-group prepend="開單科別">
            <v-super-select
              id="RequestingServiceId"
              placeholder="請選擇"
              v-model="ViewData.RequestingServiceId"
              :items="RequestingServiceSource"
              name="text"
              value="value"
              :showValue="false"
            ></v-super-select>
            <div class="clearInputValue" v-if="ViewData.RequestingServiceId" @click="closeValue('RequestingServiceId')">
              <b-icon icon="x" />
            </div>
          </b-input-group>

          <b-input-group prepend="檢查項目" class="bg-white">
            <v-super-select
              id="ProcedureCode"
              placeholder="請選擇"
              v-model="ViewData.ProcedureCode"
              :items="checkItemSource"
              name="text"
              value="value"
            ></v-super-select>
            <div class="clearInputValue" v-if="ViewData.ProcedureCode" @click="closeValue('ProcedureCode')">
              <b-icon icon="x" />
            </div>
          </b-input-group>

          <!-- <b-input-group prepend="檢查日期">
            <div id="CheckDataPicker" class="form-control" style="padding: 0px 0px">
              <ejs-daterangepicker @enter="twpRefresh" v-model="CheckDateRange"></ejs-daterangepicker>
            </div>
          </b-input-group> -->

          <b-input-group prepend="檢查日期">
            <div id="InputDataPickerA1" class="form-control" style="padding: 0">
              <div class="dateSelectDiv abs">
                <b-select
                  v-model="CheckDateRangeSelect"
                  :options="optionsDateSelect1"
                  @change="
                    (e) => {
                      optionsDateChangeE(e, 'CheckDateRange')
                    }
                  "
                  style="border: none; border-radius: none; height: 100%"
                />
              </div>
              <ejs-daterangepicker
                ref="CheckDateRangeRef"
                @close="
                  (e) => {
                    dateRangeCloseE(e, 'CheckDateRange')
                  }
                "
                @change="
                  (e) => {
                    dateRangeChangeE(e, 'CheckDateRange')
                  }
                "
                @enter="twpRefresh"
                v-model="CheckDateRange"
              >
              </ejs-daterangepicker>
            </div>
          </b-input-group>

          <b-input-group prepend="病患性別">
            <!-- <b-form-radio-group
              class="pl-2 rounded-right bg-white text-black d-flex align-items-center justify-content-center flex-1"
              style="border: 1px solid #ced4da; height: 38px"
              v-model="ViewData.PatientSex"
            >
              <b-form-radio value="M">男</b-form-radio>
              <b-form-radio value="F">女</b-form-radio>
            </b-form-radio-group> -->
            <b-select
              v-model="ViewData.PatientSex"
              :options="sexOptions"
              style="border: 1px solid #ced4da; height: 38px"
            />
          </b-input-group>

          <!-- <b-input-group prepend="報告日期">
            <div id="CheckDataPicker" class="form-control" style="padding: 0px 0px">
              <ejs-daterangepicker v-model="ReportDateRange"></ejs-daterangepicker>
            </div>
          </b-input-group> -->

          <b-input-group prepend="報告日期">
            <div id="InputDataPickerA2" class="form-control" style="padding: 0">
              <div class="dateSelectDiv abs">
                <b-select
                  v-model="ReportDateRangeSelect"
                  :options="optionsDateSelect2"
                  @change="
                    (e) => {
                      optionsDateChangeE(e, 'ReportDateRange')
                    }
                  "
                  style="border: none; border-radius: none; height: 100%"
                />
              </div>
              <ejs-daterangepicker
                ref="ReportDateRangeRef"
                @close="
                  (e) => {
                    dateRangeCloseE(e, 'ReportDateRange')
                  }
                "
                @change="
                  (e) => {
                    dateRangeChangeE(e, 'ReportDateRange')
                  }
                "
                @enter="twpRefresh"
                v-model="ReportDateRange"
              >
              </ejs-daterangepicker>
            </div>
          </b-input-group>

          <div class="d-flex rounded bg-white border" style="overflow: hidden">
            <div
              style="padding: 0 12px; border-radius: 5px 0 0 5px"
              class="bg-primary text-white d-flex justify-content-center align-items-center input-title"
            >
              儀器類別
            </div>
            <div class="d-flex flex-1">
              <div
                class="bg-primary text-white m-1 px-2 rounded d-flex align-items-center"
                v-for="dvalue in ViewData.Modalities"
                :key="dvalue"
              >
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
                style="border-top-left-radius: 0px; border-bottom-left-radius: 0px; border: 0; flex: 1 0 80px"
                @keydown.enter="definedModality"
                @keydown.delete="deleteModality"
                @change="chosenModality"
              />
              <datalist id="my-list-id">
                <option v-for="mkey in modalityKey" :key="mkey" v-text="mkey" />
              </datalist>
            </div>
          </div>
        </div>
        <div class="grid-span-3 d-flex justify-content-end mt-3">
          <b-row no-gutters>
            <b-button
              variant="primary"
              @click="()=>{twpRefresh()}"
            >
              <font-awesome-icon icon="search" />進行查詢
            </b-button>
            <b-button class="ml-1" variant="success" @click="clear">
              <font-awesome-icon icon="eraser" />清除條件
            </b-button>
            <!-- <b-button class="ml-1" variant="success" @click="print"> -->
            <b-button class="ml-1" variant="warning" @click="onPrintClick">
              <font-awesome-icon icon="print" />報告列印
            </b-button>
            <b-button class="ml-1" variant="danger" @click="downloadExcel">
              <font-awesome-icon icon="download" />下載Excel</b-button
            >
            <b-button class="ml-1" variant="secondary" @click="settingTableFields">
              <font-awesome-icon icon="table" />設定表格項目</b-button
            >
            <b-col v-if="versionNo !== '805'" class="pl-1">
              <b-input-group prepend="列印格式">
                <b-form-radio-group
                  class="rounded-right bg-white d-flex align-items-center justify-content-center pl-2"
                  style="border: 1px solid #ced4da; height: 40px"
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
      </b-card-text>
    </b-card>
    <b-container fluid class="mt-1 mx-0 pl-1 pr-0">
      <b-row no-gutters>
        <b-col>
          <div id="block4QueryResult" class="mr-1 rounded" style="border: 1px solid #ced4da">
            <!-- v-bind:OpButton1Func="RowClickFunction" -->
            <!-- :OpButton4Func="ShowReportDetail" -->
            <twp
              ref="twp1"
              :key="'twp-' + tableFields.length"
              :FieldConfig="displayTableField"
              :DataFetch="startSearchReport"
              :heightForScroll="'calc(100vh - 500px)'"
              :isBackEndPagination="true"
              :OnHeaderCheckBoxChange="OnHeaderCheckBoxChange"
              :mountedSearch="false"
              :SearchCondition="ViewData"
              v-on:allUnSelected="ResetFirstCheckItem"
              :specialColumn="specialColumn"
              @contentDiffEvent="reportDiffEvent"
              :EnRowClickEvent="true"
              @ExecRowClickEvent="tbodyClickEvent"
            />
            <!-- { pos: 2, label: '版本', text: '比對', event: handleCheckVersion, type: 'button2' }, -->
            <!-- { pos: 2, label: '版本', text: '比對', event: handleCheckVersion, type: 'button3' }, -->
            <!-- <transition name="fade">
              <div ref="flowReport" class="preview-reportR" :style="reportStyling" v-if="preReportId">
                <div
                  v-if="preReportLoading"
                  class="d-flex justify-content-center align-items-center"
                >
                  <b-spinner label="Spinning" />
                </div>
                <div
                  v-else
                  :class="{
                    'd-flex justify-content-center align-items-center': preReportContents === 'no data',
                  }"
                >
                  {{ preReportContents }}
                </div>
              </div>
            </transition> -->
            <!-- <transition name="fade">
              <div ref="flowReport" class="preview-reportR" :style="reportStyling" v-if="preReportId">
                <div
                  v-if="preReportLoading"
                  class="d-flex justify-content-center align-items-center"
                >
                  <b-spinner label="Spinning" />
                </div>
                <div
                  v-else
                  :class="{
                    'd-flex justify-content-center align-items-center': preReportContents === 'no data',
                  }"
                >
                  {{ preReportContents }}
                </div>
              </div>
            </transition> -->
          </div>
        </b-col>
      </b-row>
    </b-container>

    <div class="RepoContentDiv sticky-div" v-if="preReportContentsActual && preReportContentsActual.length">
      <div class="modal-header bg-primary text-white" style="padding: 10px 20px">
        <h5 class="modal-title">
          <font-awesome-icon icon="save" class="mr-2" />
          <span class="zhTW">報告內文</span>
        </h5>
        <button type="button" aria-label="Close" class="close text-white" @click="clearPre">×</button>
      </div>
      <div class="outer-div">
        <table class="RepoContentTable">
          <thead>
            <tr>
              <!-- th * 4 -->
              <th v-for="(val, idx) in this.reportTableField" :key="idx">
                {{ val.label }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {{ preReportContents[0] && preReportContents[0].PatientName ? preReportContents[0].PatientName : '' }}
              </td>
              <td>
                {{ preReportContents[0] && preReportContents[0].PatientId ? preReportContents[0].PatientId : '' }}
              </td>
              <td>
                {{
                  preReportContents[0] && preReportContents[0].ScheduleTime
                    ? $moment(preReportContents[0].ScheduleTime).format('YYYY/MM/DD')
                    : ''
                }}
              </td>
              <td>
                {{
                  preReportContents[0] && preReportContents[0].IssueTime
                    ? $moment(preReportContents[0].IssueTime).format('YYYY/MM/DD')
                    : ''
                }}
              </td>
            </tr>
            <tr>
              <td class="repo-content" colspan="5">
                <div class="inner-div">
                  <b-textarea
                    id="preReportText"
                    ref="preReportText"
                    class="sb4RHis"
                    :disabled="true"
                    v-model="preReportContents[0].ReportContent"
                    placeholder="尚未填寫報告內容"
                    style="
                      font-family: Monaco !important;
                      flex-grow: 1;
                      height: 100%;
                      border: none;
                      background: #fff !important;
                    "
                    wrap="hard"
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="RepoContentDiv blank sticky-div" v-if="preLoading">
      <div>
        <b-spinner label="Spinning" />
      </div>
    </div>

    <!-- thomas edit -->
    <b-modal ref="showAlert" header-bg-variant="danger" header-text-variant="light" hide-footer title="貼心提醒">
      <p v-text="remindWords" />
    </b-modal>

    <b-modal
      ref="showCustomFields"
      header-bg-variant="warning"
      header-text-variant="black"
      ok-title="確定"
      @ok="confirmCustom"
      size="xl"
      title="自訂表格內容"
      centered
    >
      <b-form-group label="勾選表格內容">
        <b-form-checkbox-group
          id="checkbox-custom"
          v-model="customeTableFields"
          :options="tableConfig4QueryResult.map(({ key, label }) => ({ text: label, value: key }))"
        ></b-form-checkbox-group>
      </b-form-group>
    </b-modal>

    <b-modal
      id="WinDiff0307"
      v-model="diffInfo.dialog"
      centered
      hide-footer
      no-fade
      header-bg-variant="warning"
      header-text-variant="dark"
      body-class="py-1"
      size="xl"
    >
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

    <div
      v-print="{
        origin: this,
        inBody: isPrint,
        printType: ViewData.printType,
        afterPrint: finishPrinting,
      }"
    >
      <div v-if="reportGroupList.length > 0">
        <template v-for="{ reports, type, createTime } in reportGroupList">
          <printSubReport v-if="type === 'sub'" :reports="reports" :key="createTime" />
          <printComposition v-if="type === 'nor'" :reports="reports" :key="createTime" />
        </template>
      </div>
    </div>

    <iframe v-if="this.pdfSrc" ref="printRef" :src="pdfSrc" style="display: none"></iframe>
  </div>
</template>

<script>
import '@/assets/styles/element-ui.css'
// import { modalityKey } from '@/assets/js/common.js'
import Vue from 'vue'
import twp from '@/components/TWPv5_1'
import { Select } from 'element-ui'
import lang from 'element-ui/lib/locale/lang/zh-TW'
import locale from 'element-ui/lib/locale'
locale.use(lang)
import * as configs from '@/config'
import { DateRangePickerPlugin } from '@syncfusion/ej2-vue-calendars'
import { AutoCompletePlugin } from '@syncfusion/ej2-vue-dropdowns'
import { dateFormatMixin } from '@/SupportLib_J.js'
import { DataManager, WebApiAdaptor, Query } from '@syncfusion/ej2-data'
import VSuperSelect from 'v-super-select'
import ImageReportPrint from '@/components/ImageReportPrint.vue'
import {
  getOptionsPatientSource,
  getExamReport,
  getPatientReportList,
  getReportWithVersion,
  getOptionsReportDrSource,
  getOptionsRequestingServiceSource,
  getOptionsRequestingDepartmentSource,
  reportSearch,
  reportExport,
  getCheckItem,
} from '@/assets/service/dataManager.js'
import printComposition from '@/components/printComposition'
import printSubReport from '@/components/printSubReport'
import { mapMutations, mapGetters, mapState } from 'vuex'
import { fi0307ConfigCollection, ViewData } from './defaultData.js'
import FormHelper from '@/library/FormHelper'
import contentDiff from '@/components/ContentDiff'
import _ from 'lodash'
import moment from 'moment'

Vue.use(DateRangePickerPlugin)
Vue.use(AutoCompletePlugin)

Date.prototype.toJSON = function () {
  return moment(this).format('YYYY-MM-DD HH:mm:ss')
}

Vue.component(Select.name, Select)

export default {
  //報告搜尋作業
  name: 'FI0307',
  components: {
    twp,
    'v-super-select': VSuperSelect,
    ImageReportPrint,
    printComposition,
    printSubReport,
    contentDiff,
  },
  mixins: [dateFormatMixin],
  data() {
    return {
      isPrint: false,
      printStuff: null,
      patientsHistoryList: {},
      theProcedure: {
        OrderNo: '',
        StatusName: '',
        AccessionNo: '123A567BC', //申請單號(大單號)
        StudyDate: '2019/10/14', //檢查日期
        Modality: 'CT/MRI', //檢查儀器
        PatientId: '1234567-8', //病歷號
        PatientSourceType: 'O-門診', //病患來源
        PatientName: '趙大升',
        PatientSex: 'M-男性',
        PatientBirthday: '1943/12/31',
        PatientAge: 76,
        Subjective: '這裡放的是病患主訴',
        Objective: '這裡是醫師客訴',
        //RadiographerNote: '這是放射師的檢查註記',
        RadiographerNote:
          '這是放射師的檢查註記\n這是放射師的檢查註記\n這是放射師的檢查註記\n這是放射師的檢查註記\n這是放射師的檢查註記\n這是放射師的檢查註記\n這是放射師的檢查註記\n這是放射師的檢查註記\n',
        RequestingPhysicianId: '1231',
        RequestingPhysicianName: '開單醫師',
        BedNo: '701221', //床號
        ShiftNote: '這是交班記錄',
      },
      remindWords: '請至少設定一組條件，再進行搜尋',
      firstCheckedItem: null,
      //檢查項目來源
      // checkItemSource: window.dtcOptionsCheckItem,
      checkItemSource: [],
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
      singelDeviceValue: '',
      modalityKeyTemp: null,
      options: [],
      value: [],
      tableConfig4QueryResult: fi0307ConfigCollection,
      tableContent4QueryResult: null,
      tableContent4QueryCount: 0,
      tableContent4QueryCurrent: 1,
      customeTableFields: [],
      //檢查起訖日
      CheckDateRange: [null, null],
      //報告起訖日
      ReportDateRange: [null, null],
      //for query
      ViewData: JSON.parse(JSON.stringify(ViewData)),
      checkItemList: [],
      reportGroupList: [],
      patientAgeActions: [
        { text: '等於', value: '=' },
        { text: '大於', value: '>' },
        { text: '大於等於', value: '>=' },
        { text: '小於', value: '<' },
        { text: '小於等於', value: '<=' },
        { text: '區間', value: '~' },
      ],
      preReportBase: { x: 0, y: 0 },
      // preReportContents: null,
      preReportContents: [],
      preReportId: null,
      mouseoverTimeStamp: 0,
      preReportTimer: null,
      diffArray: [],
      diffInfo: {
        dialog: false,
        showFullScreen: false,
        current: {
          version: '',
          content: '',
        },
        old: {
          version: '',
          content: '',
        },
      },
      reportData: {
        items: [],
        count: 0,
        page: 1,
        per: 10,
        condtion: null,
        get start() {
          return (this.page - 1) * this.per
        },
        get end() {
          return this.page * this.per
        },
      },
      mouseEvtCount: 0,
      preReportLoading: false,
      pdfSrc: null,
      searchSkipTemp: null,
      reportTableField: [
        {
          key: 'PatientName',
          label: '病患姓名',
          thClass: 'no-wrap',
          tdClass: 'no-wrap',
        },
        {
          key: 'PatientId',
          label: '病歷號',
          thClass: 'no-wrap',
          tdClass: 'no-wrap',
        },
        {
          key: 'ScheduleTime',
          label: '檢查日期',
          thClass: 'no-wrap',
          tdClass: 'no-wrap',
        },
        {
          key: 'IssueTime',
          label: '報告日期',
          thClass: 'no-wrap',
          tdClass: 'no-wrap',
        },
      ],
      preloadingTemp: false,
      sexOptions: [
        {
          text: '',
          value: '',
        },
        {
          text: '男',
          value: 'M',
        },
        {
          text: '女',
          value: 'F',
        },
      ],
      CheckDateRangeSelect: null,
      ReportDateRangeSelect: null,
      optionsDateSelect1: [
        {
          text: '',
          value: '',
        },
        {
          text: '今天',
          value: 'today',
        },
        {
          text: '最近1日內',
          value: 'recent1',
        },
        {
          text: '最近3日內',
          value: 'recent3',
        },
        {
          text: '最近7日內',
          value: 'recent7',
        },
        {
          text: '最近30日內',
          value: 'recent30',
        },
        {
          text: '自訂範圍',
          value: 'custom',
        },
      ],
      optionsDateSelect2: [
        {
          text: '',
          value: '',
        },
        {
          text: '今天',
          value: 'today',
        },
        {
          text: '最近1日內',
          value: 'recent1',
        },
        {
          text: '最近3日內',
          value: 'recent3',
        },
        {
          text: '最近7日內',
          value: 'recent7',
        },
        {
          text: '最近30日內',
          value: 'recent30',
        },
        {
          text: '自訂範圍',
          value: 'custom',
        },
      ],
    }
  },
  computed: {
    ...mapState(['patientSourceList', 'serviceSourceList']),
    ...mapGetters(['getReportDrs', 'getProfile4User']),
    modalityKey: {
      get() {
        return this.modalityKeyTemp
      },
      set(val) {
        this.modalityKeyTemp = val
      },
    },
    preLoading: {
      get() {
        return this.preloadingTemp
      },
      set(val) {
        this.preloadingTemp = val
      },
    },
    searchSkip: {
      get() {
        return this.searchSkipTemp
      },
      set(val) {
        this.searchSkipTemp = val
      },
    },
    versionNo() {
      return process.env.VUE_APP_VERSION_NO
    },
    specialColumn() {
      const common = [
        {
          pos: 0,
          label: '報表',
          text: '列印',
          event: this.handlePrintCheckbox,
          type: 'checkbox',
        },
        {
          pos: 1,
          label: '報告審查',
          text: '審查',
          event: this.handlePrintCheckbox,
          type: 'button',
        },
        {
          pos: 4,
          label: '報告預覽',
          text: '報告預覽',
          event: this.tbodyMouseEvent,
          type: 'hoverText',
        },
      ]
      const special = [
        {
          pos: 0,
          label: '報表',
          text: '列印',
          event: this.handlePrintCheckbox,
          type: 'checkbox',
        },
        // {
        //   pos: 4,
        //   label: '報告預覽',
        //   text: '報告預覽',
        //   event: this.tbodyMouseEvent,
        //   type: 'hoverText',
        // },
      ]
      return this.versionNo === '805' ? special : common
    },
    isLocal() {
      return process.env.NODE_ENV !== 'production'
    },
    reportStyling() {
      // const wdt = 600 + this.preReportBase.x <= document.body.clientWidth ? 600 : document.body.clientWidth - this.preReportBase.x
      // const hgt = document.body.clientHeight - this.preReportBase.y
      // const result = `left: ${this.preReportBase.x}px; top: ${this.preReportBase.y}px; width: ${wdt}px; max-height: ${hgt}px`
      const result = `left: ${this.preReportBase.x}px;`
      return result
    },
    tableFields() {
      return this.getProfile4User.setting && this.getProfile4User.setting.hasOwnProperty('searchReportField')
        ? this.getProfile4User.setting.searchReportField
        : this.tableConfig4QueryResult.map(({ key }) => key)
    },
    displayTableField() {
      return this.tableConfig4QueryResult.filter(({ key }) => this.tableFields.some((field) => field === key))
    },
    preReportContentsActual() {
      return this.preReportContents
    },
  },
  methods: {
    ...mapMutations([
      'setLoadingStatus',
      'SHOW_LOADING',
      'HIDE_LOADING',
      'SET_SIDE_MESSAGE',
      'SET_PATIENT_SOURCE_LIST',
      'SET_REPORT_DR',
      'SET_SERVICE_SOURCE_LIST',
      'SET_SEARCHREPORT_FIELDS',
    ]),
    async GetCheckItem() {
      try {
        const data = await getCheckItem()
        if (data) {
          this.checkItemSource = data.Items.map(({ No, Name }) => ({
            value: No,
            text: Name,
          }))
        }
        // this.procedureCodeItems = data.Items.map(({ No, Name }) => ({
        //   value: No,
        //   text: Name,
        // }))
      } catch (error) {
        console.log(error)
      }
    },
    setDateRange(type, dateType) {
      let resetDate = [null, null]

      console.log(`setDateRange > type: `, type)
      console.log(`setDateRange > dateRype: `, dateType)

      switch (type) {
        case 'custom':
          switch (dateType) {
            case 'CheckDateRange':
              resetDate = [
                this.CheckDateRange && this.CheckDateRange[0] ? this.CheckDateRange[0] : null,
                this.CheckDateRange && this.CheckDateRange[1] ? this.CheckDateRange[1] : null,
              ]
              break
            case 'ReportDateRange':
              resetDate = [
                this.ReportDateRange && this.ReportDateRange[0] ? this.ReportDateRange[0] : null,
                this.ReportDateRange && this.ReportDateRange[1] ? this.ReportDateRange[1] : null,
              ]
              break
          }
          break
        case 'recent30':
          resetDate = [
            new Date(this.$moment(new Date()).add(-1, 'months').format('YYYY/MM/DD 00:00:00')),
            new Date(this.$moment(new Date()).format('YYYY/MM/DD 23:59:59')),
          ]
          break
        case 'recent7':
          resetDate = [
            new Date(this.$moment(new Date()).add(-7, 'days').format('YYYY/MM/DD 00:00:00')),
            new Date(this.$moment(new Date()).format('YYYY/MM/DD 23:59:59')),
          ]
          break
        case 'recent3':
          resetDate = [
            new Date(this.$moment(new Date()).add(-3, 'days').format('YYYY/MM/DD 00:00:00')),
            new Date(this.$moment(new Date()).format('YYYY/MM/DD 23:59:59')),
          ]
          break
        case 'recent1':
          resetDate = [
            new Date(this.$moment(new Date()).add(-1, 'days').format('YYYY/MM/DD 00:00:00')),
            new Date(this.$moment(new Date()).format('YYYY/MM/DD 23:59:59')),
          ]
          break
        case 'yesterday':
          resetDate = [
            new Date(this.$moment(new Date()).add(-1, 'days').format('YYYY/MM/DD 00:00:00')),
            new Date(this.$moment(new Date()).add(-1, 'days').format('YYYY/MM/DD 23:59:59')),
          ]
          break
        case 'today':
          resetDate = [
            new Date(this.$moment(new Date()).format('YYYY/MM/DD 00:00:00')),
            new Date(this.$moment(new Date()).format('YYYY/MM/DD 23:59:59')),
          ]
          break
        case '':
          resetDate = [null, null]
          break
      }

      console.log(`setDateRange > resetDate: `, resetDate)

      return resetDate
    },
    resetSelectDateRage(type) {
      switch (type) {
        case 'CheckDateRange':
          this.optionsDateSelect1[this.optionsDateSelect1.length - 1].text = '自訂範圍'
          break
        case 'ReportDateRange':
          this.optionsDateSelect2[this.optionsDateSelect2.length - 1].text = '自訂範圍'
          break
      }
    },
    optionsDateChangeE(evt, type) {
      switch (type) {
        case 'CheckDateRange':
          this.resetSelectDateRage('CheckDateRange')
          if (evt === 'custom') {
            setTimeout(() => {
              this.$refs['CheckDateRangeRef'].show()
            }, 50)
          }
          break
        case 'ReportDateRange':
          this.resetSelectDateRage('ReportDateRange')
          if (evt === 'custom') {
            setTimeout(() => {
              this.$refs['ReportDateRangeRef'].show()
            }, 50)
          }
          break
      }
    },
    dateRangeChangeE(evt, type) {
      switch (type) {
        case 'CheckDateRange':
          if (this.CheckDateRange) {
            this.$nextTick(() => {
              this.optionsDateSelect1[this.optionsDateSelect1.length - 1].text = evt.text
            })
          }
          break
        case 'ReportDateRange':
          if (this.ReportDateRange) {
            this.$nextTick(() => {
              this.optionsDateSelect2[this.optionsDateSelect2.length - 1].text = evt.text
            })
          }
          break
      }
    },
    dateRangeCloseE(evt, type) {
      switch (type) {
        case 'CheckDateRange':
          if (this.CheckDateRange && this.CheckDateRange[0] && this.CheckDateRange[1]) {
            this.$nextTick(() => {
              this.CheckDateRangeSelect = 'custom'
            })
          }
          break
        case 'ReportDateRange':
          if (this.ReportDateRange && this.ReportDateRange[0] && this.ReportDateRange[1]) {
            this.$nextTick(() => {
              this.ReportDateRangeSelect = 'custom'
            })
          }
          break
      }
    },
    rowClickEvent(evt) {
      if (evt && evt.PatientName) {
        console.log(`rowClickEvent > `, evt.PatientName)
      }
    },
    deleteModality(e) {
      if (!e.target.value && this.ViewData.Modalities.length > 0) {
        this.ViewData.Modalities.pop()
      }
    },
    chosenModality() {
      this.definedModality()
    },
    definedModality() {
      if (
        !this.ViewData.Modalities.some((v) => this.singelDeviceValue === v) &&
        this.modalityKey.includes(this.singelDeviceValue)
      ) {
        this.ViewData.Modalities.push(this.singelDeviceValue)
      } else {
        this.twpRefresh()
      }
      this.singelDeviceValue = ''
    },
    finishPrinting() {
      this.isPrint = false
      this.reportGroupList = []
      this.$refs.twp1.Rows.forEach((item) => {
        if (item['PrintCheck']) item['PrintCheck'] = false
      })
    },
    handleCheckVersion() {
      alert('CHECK VERSION')
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
      console.log(e)
    },
    async printService(patient) {
      try {
        const { Items } = await window.axios.get(`/reportStatistics/ImageDxReport?accession_no=${patient.AccessionNo}`)
        if (Items.length > 0) this.printStuff = Items[0]
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
        console.log(err)
      }
    },
    //變更檢查項目
    OnChangeProcedure() {
      this.ViewData.ProcedureCode = ''
      let id = this.ViewData.ProcedureCodeShow
      let _this = this
      this.checkItemSource.some((i) => {
        if (i.value == id || i.text == id) {
          _this.ViewData.ProcedureCode = i.value
          _this.ViewData.ProcedureCodeShow = i.text
          return true
        }
      })

      //若沒有完整match到 datasource, 用input的值 直接搜尋
      if (this.ViewData.ProcedureCode == '') this.ViewData.ProcedureCode = id
    },
    //撰寫人員變更
    OnChangeDxreportPhysician() {
      // let options = document.querySelectorAll(".dxreport-data-idx");

      this.ViewData.DxreportPhysicianId = ''
      let id = this.ViewData.DxreportPhysician
      let _this = this
      this.DxreportPhysicianSource.some((i) => {
        if (i.value == id || i.text == id) {
          _this.ViewData.DxreportPhysicianId = i.value
          _this.ViewData.DxreportPhysician = i.text
          return true
        }
      })

      //若沒有完整match到 datasource, 用input的值 直接搜尋
      if (this.ViewData.DxreportPhysicianId == '') this.ViewData.DxreportPhysicianId = id
    },
    //審核醫師變更
    OnChangeIssuePhysician() {
      this.ViewData.IssuePhysicianId = ''
      let id = this.ViewData.IssuePhysician
      let _this = this
      this.IssuePhysicianSource.some((i) => {
        if (i.value == id || i.text == id) {
          _this.ViewData.IssuePhysicianId = i.value
          _this.ViewData.IssuePhysician = i.text
          return true
        }
      })

      //若沒有完整match到 datasource, 用input的值 直接搜尋
      if (this.ViewData.IssuePhysicianId == '') this.ViewData.IssuePhysicianId = id
    },
    //開單科別變更
    OnChangeRequestingService(e) {
      console.log(`OnChangeRequestingService: `, e)

      this.ViewData.RequestingServiceId = ''
      
      let id = this.ViewData.RequestingService
      let _this = this
      
      this.RequestingServiceSource.some((i) => {
        if (i.value == id || i.text == id) {
          _this.ViewData.RequestingServiceId = i.value
          _this.ViewData.RequestingService = i.text
          return true
        }
      })

      console.log(`OnChangeRequestingService:`, this.RequestingServiceSource)

      //若沒有完整match到 datasource, 用input的值 直接搜尋
      if (this.ViewData.RequestingServiceId == '') this.ViewData.RequestingServiceId = id
    },
    closeValue(type) {
      console.log(`closeValue: `, type)

      let target = null
      let query = '.super-select-input input[type=text]'
      
      let aClear = (type, query)=>{
        setTimeout(() => {
            target = document.getElementById(type)
            let element = target.querySelector(query)
            element.value = ''
        }, 300)
      }

      switch(type){
        case 'IssuePhysicianId':
          this.ViewData.IssuePhysicianId = ''
          aClear(type, query)
          break;
        case 'RequestingServiceId':
          this.ViewData.RequestingServiceId = ''
          aClear(type, query)
          break;
        case 'ProcedureCode':
          this.ViewData.ProcedureCode = ''
          aClear(type, query)
          break;
      }

    },
    beforeSearchProcess() {
      //因為實際搜尋的日期condition在單獨清空檢查日期時 沒有清空此物件, 因此在此先清空, 以免重複搜尋相同condition
      //檢查訖

      this.ViewData.IssueTime = null
      this.ViewData.IssueTimeEnd = null

      this.ViewData.ScheduleTimeStart = null
      this.ViewData.ScheduleTimeEnd = null

      // ;['CheckDateRange', 'ReportDateRange'].forEach((range) => {
      //   if (!this[range]) {
      //     this[range] = [null, null]
      //   }
      // })

      if (this.CheckDateRange[0] === null) {
        this.CheckDateRange[0] = ''
      }
      if (this.CheckDateRange[1] === null) {
        this.CheckDateRange[1] = ''
      }

      if (this.ReportDateRange[0] === null) {
        this.ReportDateRange[0] = ''
      }
      if (this.ReportDateRange[1] === null) {
        this.ReportDateRange[1] = ''
      }
      
      //plus check
      console.log(`beforeSearchProcess: `, this.ViewData)

      let tempIssuePhysicianId = this.ViewData.IssuePhysicianId ? this.ViewData.IssuePhysicianId : this.ViewData.IssuePhysician
      let tempRequestingServiceId = this.ViewData.RequestingServiceId ? this.ViewData.RequestingServiceId : this.ViewData.RequestingService

      if(tempIssuePhysicianId){
        this.ViewData.IssuePhysician = '',
        this.ViewData.IssuePhysicianId = tempIssuePhysicianId
      }

      if(tempRequestingServiceId){
        this.ViewData.RequestingService = '',
        this.ViewData.RequestingServiceId = tempRequestingServiceId
      }

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
        tempIssuePhysicianId.length +
        tempRequestingServiceId.length +
        this.ViewData.Modalities.length +
        (this.ViewData.PatientName ? this.ViewData.PatientName.length : 0)

      if (length === 0) {
        this.remindWords = '請至少設定一組條件，再進行搜尋'
        this.$refs['showAlert'].show()
        return null
      } else {
        if (
          this.ViewData.PatientAgeAction === '~' &&
          ([this.ViewData.PatientAge, this.ViewData.PatientAgeMax].some((age) => !age) ||
            this.ViewData.PatientAgeMax <= this.ViewData.PatientAge)
        ) {
          this.remindWords = '病患年齡區間有誤，請修正'
          this.$refs['showAlert'].show()
          return null
        }

        let White = Object.values(this.Whitevalue).join(',')
        let Black = Object.values(this.Blackvalue).join(',')
        this.ViewData.Whitelist = White == '' ? [] : White.split(',')
        this.ViewData.BlackList = Black == '' ? [] : Black.split(',')

        if (this.ViewData.BlackList.length === 0) delete this.ViewData.BlacklistAction
        if (this.ViewData.Whitelist.length === 0) delete this.ViewData.WhitelistAction

        //表示有KEY入時間
        // ;['CheckDateRange', 'ReportDateRange'].forEach((range, idx) => {
        //   if (this[range] != null && this[range][0] && this[range][1]) {
        //     if (this[range][0] != '' && this[range].length == 2) {
        //       //日期 設為00:00~晚上11:59分
        //       // this[range][0].setHours(0, 0, 0, 0);
        //       // this[range][1].setHours(23, 59, 59, 999);

        //       const keys = idx === 0 ? ['ScheduleTimeStart', 'ScheduleTimeEnd'] : ['IssueTime', 'IssueEndTime']
        //       keys.forEach((key, kIdx) => {
        //         this.ViewData[key] = this.$moment(this[range][kIdx]).format(`YYYY-MM-DD ${kIdx === 0 ? '00:00:00' : '23:59:59'}`)
        //       })
        //     }
        //   }
        // })

        if (this.CheckDateRange && this.CheckDateRange[0] && this.CheckDateRange[1]) {
          this.ViewData['ScheduleTimeStart'] = new Date(this.$moment(this.CheckDateRange[0]).format('YYYY/MM/DD 00:00:00'))
          this.ViewData['ScheduleTimeEnd'] = new Date(this.$moment(this.CheckDateRange[1]).format('YYYY/MM/DD 23:59:59'))
        }

        if (this.ReportDateRange && this.ReportDateRange[0] && this.ReportDateRange[1]) {
          this.ViewData['IssueTime'] = new Date(this.$moment(this.ReportDateRange[0]).format('YYYY/MM/DD 00:00:00'))
          this.ViewData['IssueTimeEnd'] = new Date(this.$moment(this.ReportDateRange[1]).format('YYYY/MM/DD 23:59:59'))
        }

        //====API限制: 沒有值的條件不要帶進body, 會造成日期搜尋無效====
        //後來API 修正了, 反正這樣也乾淨
        //此處用另一個object把有值的條件帶入
        let eViewData = {}
        for (var k in this.ViewData) {
          if (this.ViewData[k] && this.ViewData[k].toString().length > 0) {
            eViewData[k] = this.ViewData[k]
          }
        }

        if (!eViewData.hasOwnProperty('PatientAge')) delete eViewData.PatientAgeAction

        return eViewData
      }
    },
    downloadExcel() {
      const eViewData = this.beforeSearchProcess()
      if (!eViewData) return
      this.SHOW_LOADING()
      reportExport(eViewData)
        .then(({ Message, Url }) => {
          console.log(Message)
          FormHelper.downloadFile(Url)
        })
        .catch((err) => {
          this.SET_SIDE_MESSAGE({ msg: '發生錯誤，稍候再試', type: 2 })
        })
        .finally(() => {
          this.HIDE_LOADING()
        })
    },
    confirmCustom() {
      this.SET_SEARCHREPORT_FIELDS(this.customeTableFields)
      setTimeout(() => {
        this.twpRefresh()
      }, 250)
    },
    settingTableFields() {
      this.customeTableFields = this.tableFields
      this.$refs.showCustomFields.show()
    },
    twpRefresh() {
      this.clearPre()
      this.searchSkip = 'fromSearch'
      this.$refs.twp1.OnForceRefresh()
    },
    //查詢報告
    async startSearchReport(id, from, range) {
      this.clearPre()

      await new Promise((resolve) =>
        setTimeout(function () {
          resolve(true)
        }, 50)
      )

      // console.log(
      //   `startSearchReport > id: `, id
      // )
      // console.log(
      //   `startSearchReport > from: `, from
      // )
      // console.log(
      //   `startSearchReport > range: `, range
      // )

      const { PagingRowPerPage, PagingCurrentPage } = this.$refs.twp1
      const eViewData = this.beforeSearchProcess()

      if (!eViewData) return

      const getItemsFromReportData = () => {
        const _start = ((PagingCurrentPage - 1) * PagingRowPerPage) % this.reportData.per
        const _end = _start + PagingRowPerPage
        return this.reportData.items.slice(_start, _end)
      }

      const isConditionEqual =
        !!this.reportData.condition && JSON.stringify(this.reportData.condition) === JSON.stringify(eViewData)

      // if (
      //   this.reportData.items.length > 0 &&
      //   isConditionEqual &&
      //   (PagingCurrentPage - 1) * PagingRowPerPage >= this.reportData.start &&
      //   PagingCurrentPage * PagingRowPerPage <= this.reportData.end
      // ) {
      //   return { Items: getItemsFromReportData(), Count: this.reportData.count }
      // } else {
      //   this.reportData.page = Math.floor((PagingCurrentPage * PagingRowPerPage) / this.reportData.per)
      //   const pagination = `$top=${this.reportData.per}&$skip=${this.reportData.start}`
      //   if (!isConditionEqual) {
      //     this.reportData.condition = eViewData
      //     this.$refs.twp1.PagingCurrentPage = 1
      //   }
      //   this.SHOW_LOADING()
      //   try {
      //     const { Items, Count } = await reportSearch(pagination, eViewData)
      //     Items.forEach((item) => {
      //       item.ScheduleTime = this.$moment(item.ProcedureCompleted).format('YYYY/MM/DD')
      //       item.DxrVersionForShow = item.ReleaseVersion + ' / ' + item.DxrVersion.split('.').slice(0, 2).join('.')
      //       ;['CounterRegister', 'OrderDate', 'NoticeTime'].forEach((key) => {
      //         item[`${key}ForShow`] = item[key] ? this.$moment(item[key]).format('YYYY/MM/DD') : ''
      //       })

      //       item['PrintCheck'] = false
      //       item['EmgFlagName'] = item['EmgFlag'] === 'Y' ? '急作' : '一般'
      //     })

      //     this.reportData.items = Items
      //     this.reportData.count = Count
      //     return { Items: getItemsFromReportData(), Count }
      //   } catch (err) {
      //     this.SET_SIDE_MESSAGE({ msg: '存取時發生錯誤! 請稍後再試.', type: 2 })
      //     return { Items: [], Count: 0 }
      //   } finally {
      //     this.HIDE_LOADING()
      //   }
      // }

      this.reportData.page = Math.floor((PagingCurrentPage * PagingRowPerPage) / this.reportData.per)

      if (!isConditionEqual) {
        this.reportData.condition = eViewData
        this.$refs.twp1.PagingCurrentPage = 1
      }

      // console.log(`per: `, this.reportData.per)
      // console.log(`page: `, this.reportData.page)
      // console.log(`range: `, range)
      // console.log(`start: `, this.reportData.start)

      const pagination = `$top=${range ? range : this.reportData.per}&$skip=${
        this.searchSkip === 'fromSearch' ? '0' : ((PagingCurrentPage - 1) * PagingRowPerPage)
      }`

      // console.log(`pagination: `, pagination)

      this.$refs.twp1.PagingCurrentPage = this.searchSkip === 'fromSearch' ? 1 : this.$refs.twp1.PagingCurrentPage

      this.SHOW_LOADING()

      try {
        const { Items, Count } = await reportSearch(pagination, eViewData)

        console.log(`eViewData: `, eViewData)

        Items.forEach((item) => {
          // item.ScheduleTime = this.$moment(item.ProcedureCompleted).format('YYYY/MM/DD')
          item.DxrVersionForShow = item.ReleaseVersion + ' / ' + item.DxrVersion.split('.').slice(0, 2).join('.')
          ;['CounterRegister', 'OrderDate', 'NoticeTime'].forEach((key) => {
            item[`${key}ForShow`] = item[key] ? this.$moment(item[key]).format('YYYY/MM/DD') : ''
          })

          item.ScheduleTimeForShow = this.$moment(item.ScheduleTime).format('YYYY-MM-DD')
          item['PrintCheck'] = false
          item['EmgFlagName'] = item['EmgFlag'] === 'Y' ? '急作' : '一般'
        })

        this.reportData.items = Items
        this.reportData.count = Count
        return { Items: getItemsFromReportData(), Count }
      } catch (err) {
        this.SET_SIDE_MESSAGE({ msg: '存取時發生錯誤! 請稍後再試.', type: 2 })
        return { Items: [], Count: 0 }
      } finally {
        this.HIDE_LOADING()
        this.searchSkip = null
      }
    },
    //顯示Detail明細
    ShowReportDetail(x) {},
    clearPre() {
      this.preReportId = null
      this.preReportContents = null
    },
    //清除條件
    clear() {
      this.clearPre()

      //申請單號
      ;(this.ViewData.AccessionNo = ''),
        //病歷號
        (this.ViewData.PatientId = ''),
        //檢查起
        (this.ViewData.ScheduleTimeStart = ''),
        //檢查訖
        (this.ViewData.ReportTimeEnd = ''),
        //報告起
        (this.ViewData.ReportTimeStart = ''),
        //報告訖
        (this.ViewData.ScheduleTimeEnd = ''),
        //檢查項目
        (this.ViewData.ProcedureCode = ''),
        (this.ViewData.ProcedureCodeShow = ''),
        //性別
        (this.ViewData.PatientSex = ''),
        //姓名
        (this.ViewData.PatientName = ''),
        //年齡
        (this.ViewData.PatientAge = ''),
        //年齡MAX
        (this.ViewData.PatientAgeMax = ''),
        //病患來源
        (this.ViewData.PatientSourceTypeCode = null),
        //報告醫生
        (this.ViewData.DxreportPhysicianId = ''),
        (this.ViewData.DxreportPhysician = ''),
        //審核醫生
        (this.ViewData.IssuePhysicianId = ''),
        (this.ViewData.IssuePhysician = ''),
        (this.ViewData.PatientAgeAction = '='),
        //開單科別
        (this.ViewData.RequestingServiceId = ''),
        (this.ViewData.RequestingService = '')

      this.CheckDateRange = ['', '']
      this.ReportDateRange = ['', '']
      this.CheckDateRangeSelect = null
      this.ReportDateRangeSelect = null
      this.resetSelectDateRage('CheckDateRange')
      this.resetSelectDateRage('ReportDateRange')

      this.ViewData.Modalities = []

      this.Whitevalue = []
      this.Blackvalue = []

      this.ViewData.printType = '0'

      // ["CheckDateRange", "ReportDateRange"].forEach(range => {
      //   this[range] = null;
      // });
      ;['ScheduleTimeStart', 'ScheduleTimeEnd', 'IssueTime', 'IssueEndTime'].forEach((k) => {
        delete this.ViewData[k]
      })

      setTimeout(() => {
        const q = '.super-select-input input[type=text]'
        
        let ssl = document.querySelectorAll(q)
        ssl.forEach((v)=>{
          v.value = ''
        })

      }, 300)

      // let arr = ['#IssuePhysicianId', '#RequestingServiceId']
      // arr.forEach((item)=>{
      //   let target = document.querySelector(item)
      //   setTimeout(()=>{
      //     target.value = ''
      //   })
      // })

    },
    //單一item的checkbox點擊觸發
    itemChecked(item) {
      if (this.firstCheckedItem == null) this.firstCheckedItem = item
      if (item) {
        if (item.showCheckBox) {
          if (item.TWPCheckBox1Value) item.TWPCheckBox1Value = false
          else item.TWPCheckBox1Value = true
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
        url: configs.publicPath + '../exam/List',
        adaptor: new WebApiAdaptor(),
        crossDomain: true,
      })
        //
        .executeQuery(new Query().where('AccessionNo', 'contains', data.AccessionNo))
        .then((r) => {
          let dataList = r.actual.Items[0]
          dataList.isFromFI0307 = true
          dataList.ProcedureCompleted = this.DateToString(dataList.ProcedureCompleted, true)
          dataList.PatientBirthday = this.DateToString(dataList.PatientBirthday, false)
          dataList.StudyTime = dataList.StudyTime == null ? '無影像' : this.DateToString(dataList.StudyTime, true)
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
          dataList.DxrVersion = data.DxrVersion
          // console.log(dataList);
          window.dtcEvaluationDataList = dataList ? dataList : []
          // console.log(window.dtcEvaluationDataList);
          this.$router.replace({
            name: 'FI0306-1',
            params: {
              FI0307TempData: this.tableContent4QueryResult,
              FI0307TempCheckItems: this.$refs['twp1'].checkedItems,
              FI0307TempQuery: this.ViewData,
              FI0307TempCurrentPage: this.$refs['twp1'].PagingCurrentPage,
            },
          })
        })
      // console.log(this.theProcedure);
      // window.dtcEvaluationDataList = x ? x : [];
      // // alert("FI0306");
      // console.log(window.dtcEvaluationDataList);
      // this.$router.replace({ name: "FI0306-1" });
    },
    OnHeaderCheckBoxChange(checked) {
      if (!checked) this.ResetFirstCheckItem()
    },
    ResetFirstCheckItem() {
      this.firstCheckedItem = null
    },
    //twp list判斷item是否顯示checkbox, 此處判斷item patient id是否和已選的item相同,
    //一單多檢的多選判斷
    CheckIfIdMatchMuitiSelect(item) {
      if (this.firstCheckedItem == null) return true

      return item.PatientId == this.firstCheckedItem.PatientId
    },
    //判斷是否顯示header的checkbox, 如果list的content 皆為同patient id,
    //或 已點某筆item 判斷出相同patient id之row, 則顯示
    CheckIfShowHeaderCheckBox() {
      if (this.firstCheckedItem == null) {
        return false
      } else {
        return true
      }
    },
    fetchPatientHistory(list) {
      return new Promise(async (resolve, reject) => {
        for (const { PatientId } of list) {
          if (!this.patientsHistoryList[PatientId]) {
            this.patientsHistoryList[PatientId] = await getPatientReportList(PatientId)
          }
        }
        resolve(true)
      })
    },
    async onPrintClick() {
      const printArr = this.$refs['twp1'].Rows.filter((item) => item.PrintCheck)
      if (printArr.length === 0) {
        this.SET_SIDE_MESSAGE({ msg: '請至少選擇一筆報告', type: 2 })
        return
      }

      const data = await window.axios(`/report/GetPDF?orderNo=${printArr.map((item) => item.OrderNo).join(',')}`, {
        responseType: 'blob',
      })
      const file = new Blob([data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(file)
      if (this.pdfSrc) {
        window.URL.revokeObjectURL(this.pdfSrc)
        this.pdfSrc = null
      }
      this.pdfSrc = url
      await this.$nextTick()
      this.$refs.printRef.onload = () => {
        this.$refs.printRef.contentWindow.print()
      }
    },
    async print() {
      // console.log(this.ViewData);
      //判斷是否有勾選至少一筆，此方法有問題，進入報告後再出來會無資料 需另外處理
      //每一個Rows為一筆申請單號

      if (this.$refs['twp1'].Rows.length === 0) {
        this.SET_SIDE_MESSAGE({ msg: '請至少選擇一筆報告', type: 2 })
        return
      }
      let Reports = this.$refs['twp1'].Rows.reduce((a, { AccessionNo: mNo, DxrVersion: mVer, PrintCheck, List }) => {
        List
          ? a.concat(
              List.reduce(
                (la, { isChecked, AccessionNo, DxrVersion }) =>
                  isChecked ? la.concat({ AccessionNo, DxrVersion }) : la,
                []
              )
            )
          : a
        if (PrintCheck && !a.some((item) => item.AccessionNo === mNo && item.DxrVersion === mVer))
          a.push({ AccessionNo: mNo, DxrVersion: mVer })
        return a
      }, [])

      if (Reports.length === 0) {
        this.SET_SIDE_MESSAGE({ msg: '請至少選擇一筆報告', type: 2 })
        return
      }
      // Reports = Reports.flat().map(({ AccessionNo, AccessionNo }) => ({ AccessionNo, DxrVersion }))
      try {
        // this.setLoadingStatus(true);
        this.SHOW_LOADING()
        const res = await getExamReport(Reports, this.ViewData.printType)
        if (res) {
          await this.fetchPatientHistory(res.ReportResults)
          let reportCount = 0
          this.reportGroupList = res.ReportResults.reduce((acc, cur, aIdx) => {
            // const isSubReport = (cur.StructureContent1.includes('source') && cur.StructureContent1.includes('itemRow'));
            const type =
              cur.StructureContent1 &&
              cur.StructureContent1.includes('source') &&
              cur.StructureContent1.includes('itemRow')
                ? 'sub'
                : 'nor'
            if (aIdx === 0 || acc[reportCount].type != type) {
              acc.push({
                type,
                reports: [],
                createTime: new Date().getTime() + Math.floor(Math.random() * 10),
              })
            }

            if (aIdx > 0 && acc[reportCount].type != type) {
              reportCount += 1
            }
            acc[reportCount]['reports'].push(type === 'sub' ? this.convert2SubReportFormat(cur) : cur)
            return acc
          }, [])

          if (this.reportGroupList.length > 0) {
            setTimeout(() => {
              this.HIDE_LOADING()
              this.isPrint = true
            }, 1000)
          } else {
            this.HIDE_LOADING()
            this.SET_SIDE_MESSAGE({ msg: '選取報告無內容', type: 2 })
          }
        } else {
          throw new Error('no data')
        }
      } catch (err) {
        // console.log(err);
        this.HIDE_LOADING()
        this.SET_SIDE_MESSAGE({ msg: '存取時發生錯誤! 請稍後再試.', type: 2 })
      }
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
          CSTId: '',
          CSTName: '',
          img: '',
          cstHtml: StructureContent1,
          structureData: StructureData1,
          updateCount: 1,
        },
      }
    },
    //取得檢查項目列表
    async GetOptionsCheckItem() {
      // no use
      //this.checkItemSource = window.dtcOptionsCheckItem;
    },
    convertSource(type, data) {
      let tempArr = []

      let sortOrder = ['O', 'E', 'I', 'H', 'OTHERS']
      let priorityType = type ? type : null
      let tempIdx = null

      if (priorityType) {
        if (sortOrder.includes(priorityType)) {
          tempIdx = sortOrder.indexOf(priorityType)
          sortOrder.splice(tempIdx, 1)
          sortOrder.unshift(priorityType)
        } else {
          sortOrder.unshift(priorityType)
        }
      }

      let newArr = []
      let updateArr = []
      let cloneArr = _.cloneDeep(data)

      newArr = _.cloneDeep(
        sortOrder.map((v) => {
          return { [v]: [] }
        })
      )

      cloneArr.forEach((v) => {
        newArr.forEach((w, j) => {
          if (v.value && Object.keys(w).includes(v.value)) {
            newArr[j][v.value].push(v)
          }
        })

        if (v.value && !sortOrder.includes(v.value)) {
          newArr[newArr.length - 1]['OTHERS'].push(v)
        } else if (v && !sortOrder.includes(v.value)) {
          newArr[newArr.length - 1]['OTHERS'].push(v)
        }
      })

      newArr.forEach((v, i) => {
        if (v[sortOrder[i]] && v[sortOrder[i]].length) {
          updateArr = updateArr.concat(v[sortOrder[i]])
        }
      })

      tempArr = _.cloneDeep(updateArr)

      return tempArr
    },
    //取得病患來源列表
    async GetOptionsPatientSource() {
      if (this.patientSourceList.length === 0) {
        const {
          actual: { Items },
        } = await getOptionsPatientSource()
        this.SET_PATIENT_SOURCE_LIST(Items.map(({ No, Name }) => ({ text: Name, value: No })))
      }

      let tempArr = this.convertSource(null, this.patientSourceList)

      this.PatientSource = [{ value: null, text: '請選擇' }].concat(tempArr)
    },
    //取得打字員與報告醫師資料
    async GetOptionsDxreportPhysician() {
      if (this.getReportDrs.length === 0) {
        const {
          actual: { Items },
        } = await getOptionsReportDrSource()
        this.SET_REPORT_DR(Items)
      }
      this.DxreportPhysicianSource = [{ value: null, text: '請選擇' }, ...this.getReportDrs]
    },
    //取得主治醫師
    async GetOptionsIssuePhysicianSource() {
      let itemPack = null
      let convertedCollections = []
      let subPath = '../Employee/SelectNoList?staffType=21&getAll=false'
      await new DataManager({
        url: configs.publicPath + subPath,
        adaptor: new WebApiAdaptor(),
        crossDomain: true,
      })
        .executeQuery(new Query())
        .then((r) => {
          itemPack = r.actual //資料;
        })

      itemPack.Items.forEach((i) => {
        let collection = { value: i.No, text: i.Name }
        convertedCollections.push(collection)
      })

      this.IssuePhysicianSource = convertedCollections
    },
    //取得開單科別
    async GetOptionsRequestingServiceSource() {
      try {
        const {
          actual: { Items },
        } = await getOptionsRequestingDepartmentSource()
        if (Items && Items.length) {
          this.RequestingServiceSource = Items.map(({ No, Name }) => ({ text: `${Name}`, value: No }))
          console.log(`GetOptionsRequestingServiceSource: `, this.RequestingServiceSource)
        }
      } catch (err) {
        console.log(`error: `, err)
      }
    },
    getBackData() {
      //若從FI0306-1回來 此時應該有資料才對...
      // if (this.$route.params.FI0307TempData) {
      //   // console.log(this.$route.params.FI0307TempData);
      //   this.tableContent4QueryResult = this.$route.params.FI0307TempData;
      //   this.tableContent4QueryCount = this.$route.params.FI0307TempCount;
      //   this.tableContent4QueryCurrent = this.$route.params.FI0307TempCurrentPage;
      //   // this.$refs["twp1"].checkedItems = this.$route.params.FI0307TempCheckItems;
      // }

      // if (this.$route.params.FI0307TempQuery) {
      //   // console.log(this.$route.params.FI0307TempQuery);
      //   this.ViewData = this.$route.params.FI0307TempQuery;
      //   if (this.ViewData.Whitelist && this.ViewData.Whitelist.length > 0) this.Whitevalue = this.ViewData.Whitelist[0].split(",");
      //   if (this.ViewData.Blacklist && this.ViewData.Blacklist.length > 0) this.Blackvalue = this.ViewData.Blacklist[0].split(",");

      //   if (this.ViewData.ScheduleTimeStart) this.CheckDateRange[0] = this.ViewData.ScheduleTimeStart;
      //   if (this.ViewData.ScheduleTimeEnd) this.CheckDateRange[1] = this.ViewData.ScheduleTimeEnd;

      //   if (this.ViewData.ReportTimeStart) this.ReportDateRange[0] = this.ViewData.ReportTimeStart;
      //   if (this.ViewData.ReportTimeEnd) this.ReportDateRange[1] = this.ViewData.ReportTimeEnd;
      // } else {
      //   this.clear();
      // }

      // if (this.$store.state.reportDataSrc) {
      //   this.reportData.items = this.$store.state.reportDataSrc.items
      //   this.reportData.page = this.$store.state.reportDataSrc.page
      //   this.reportData.per = this.$store.state.reportDataSrc.per
      //   this.reportData.count = this.$store.state.reportDataSrc.count

      //   if (this.$store.state.reportDataSrc.query) {
      //     this.ViewData = this.$store.state.reportDataSrc.query
      //     if (this.ViewData.Whitelist && this.ViewData.Whitelist.length > 0)
      //       this.Whitevalue = this.ViewData.Whitelist[0].split(',')
      //     if (this.ViewData.Blacklist && this.ViewData.Blacklist.length > 0)
      //       this.Blackvalue = this.ViewData.Blacklist[0].split(',')

      //     if (this.ViewData.ScheduleTimeStart) this.CheckDateRange[0] = this.ViewData.ScheduleTimeStart
      //     if (this.ViewData.ScheduleTimeEnd) this.CheckDateRange[1] = this.ViewData.ScheduleTimeEnd

      //     if (this.ViewData.ReportTimeStart) this.ReportDateRange[0] = this.ViewData.ReportTimeStart
      //     if (this.ViewData.ReportTimeEnd) this.ReportDateRange[1] = this.ViewData.ReportTimeEnd
      //     this.reportData.condition = this.beforeSearchProcess()
      //   }
      //   this.$refs.twp1.RowCount = this.$store.state.reportDataSrc.count
      //   this.$refs.twp1.PagingCurrentPage = this.$store.state.reportDataSrc.row.page
      //   this.$refs.twp1.PagingRowPerPage = this.$store.state.reportDataSrc.row.per
      //   const _start =
      //     ((this.$store.state.reportDataSrc.row.page - 1) * this.$store.state.reportDataSrc.row.per) %
      //     this.reportData.per
      //   const _end = _start + this.$store.state.reportDataSrc.row.per
      //   this.$refs.twp1.Rows = this.reportData.items.slice(_start, _end)
      //   this.$store.unregisterModule('reportDataSrc')
      // }
    },
    async getReportWithVersion(AccessionNo, DxrVersion, PatientId) {
      // 用 Count 保證顯示最後 mouseenter 的報告，避免異步順序問題
      this.mouseEvtCount++
      const selfCount = this.mouseEvtCount
      try {
        this.preReportLoading = true
        const data = await getReportWithVersion(AccessionNo, DxrVersion, PatientId)
        if (selfCount === this.mouseEvtCount) {
          return { data }
        }

        return {}
      } catch (error) {
        console.log(error)
        return { error }
      } finally {
        if (selfCount === this.mouseEvtCount) {
          this.preReportLoading = false
          this.mouseEvtCount = 0
        }
      }
    },
    async tbodyMouseEvent(e, row) {
      if (e.type === 'mouseleave') {
        this.preReportId = null
        this.preReportContents = null
        return
      }

      const { AccessionNo, DxrVersion, PatientId } = row

      const reportId = [AccessionNo, DxrVersion, PatientId].join(',')
      if (reportId === this.preReportId) return

      this.preReportBase.x = e.clientX + 40
      this.preReportBase.y = e.clientY + 10
      this.preReportId = reportId

      const { data } = await this.getReportWithVersion(AccessionNo, DxrVersion, PatientId)

      if (data) {
        this.preReportContents = data.ReportContent || 'no data'
        this.preReportContents._showDetails = true
      }
    },
    async tbodyClickEvent(row) {
      this.clearPre()

      try {
        const { AccessionNo, DxrVersion, PatientId } = row
        const reportId = [AccessionNo, DxrVersion, PatientId].join(',')

        this.preLoading = true

        if (reportId === this.preReportId) return

        this.preReportId = reportId

        const { data } = await this.getReportWithVersion(AccessionNo, DxrVersion, PatientId)

        if (data) {
          this.preReportContents = [data] || []
          this.preReportContents[0].ScheduleTime = row.ScheduleTime
        }
      } catch (err) {
        console.log(`error: `, err)
      } finally {
        this.preLoading = false
      }
    },
    confirmDialog() {
      this.diffInfo.showFullScreen = true
      document.getElementById('WinDiff0307___BV_modal_content_').requestFullscreen()
    },
    async reportDiffEvent({ currentVersion, oldVersion, accessionNo, patientId }) {
      this.SHOW_LOADING()

      const findItem = (version) => {
        let _content = ''
        this.diffArray.some((item) => {
          if (item.version === version) {
            _content = item.content
            return true
          } else {
            return false
          }
        })
        return _content
      }

      try {
        let _currentContent = findItem(currentVersion)
        if (!_currentContent) {
          const { ReportContent: currentContent } = await getReportWithVersion(accessionNo, currentVersion, patientId)
          _currentContent = currentContent
          this.diffArray.push({ version: currentVersion, content: currentContent })
        }

        let _oldContent = findItem(oldVersion)
        if (!_oldContent) {
          const { ReportContent: oldContent } = await getReportWithVersion(accessionNo, oldVersion, patientId)
          _oldContent = oldContent
          this.diffArray.push({ version: oldVersion, content: oldContent })
        }

        this.diffInfo.old = {
          version: oldVersion,
          content: _oldContent,
        }
        this.diffInfo.current = {
          version: currentVersion,
          content: _currentContent,
        }
        this.diffInfo.dialog = true
      } catch (error) {
        this.SET_SIDE_MESSAGE({ msg: error + '! 請稍候再試', type: 2 })
      } finally {
        this.HIDE_LOADING()
      }

      // console.log({ currentVersion, oldVersion, accessionNo });
    },
    targetFocus(target = 'patientIdRef') {
      if (this.$refs[target]) {
        setTimeout(() => {
          this.$nextTick(() => {
            this.$refs[target].focus()
          })
        }, 1000)
      }
    },
    KeyWatch(event) {
      if (event && event.key === 'Escape') {
        console.log(`KeyWatch: `, event.key)
        this.clearPre()
      }
    },
    async GetOptionsInspectDevice() {
      let subPath = '../exam/GetModalityNoList'
      this.SHOW_LOADING()
      const { actual } = await new DataManager({
        url: configs.publicPath + subPath,
        adaptor: new WebApiAdaptor(),
        crossDomain: true,
      }).executeQuery(new Query())
      this.HIDE_LOADING()
      
      this.modalityKey = actual.map((v) => (v.No))
  },
  },
  created() {
    if (localStorage['dtcOptionsCheckItem']) {
      this.checkItemSource = JSON.parse(localStorage['dtcOptionsCheckItem'])
    }

    window.addEventListener('keyup', this.KeyWatch)

    //若從FI0306-1回來 此時應該有資料才對...

    //檢查項目下拉選單
    // this.GetOptionsCheckItem();

    //病患來源下拉選單
    this.GetOptionsPatientSource()
    //住院(打字員)醫師列表
    this.GetOptionsDxreportPhysician()
    //審核醫師列表
    this.GetOptionsIssuePhysicianSource()
    //取得開單科別
    this.GetOptionsRequestingServiceSource()

    //Modality
    this.GetOptionsInspectDevice()

    //Update
    this.GetCheckItem()
  },
  async mounted() {
    // this.getBackData()
    this.targetFocus()
  },
  beforeDestroyed() {
    // this.$refs["twp1"].$el.querySelector("tbody").removeEventListener("mousemove", this.tbodyMouseEvent);
    // this.$refs["twp1"].$el.querySelector("tbody").removeEventListener("mouseleave", this.tbodyMouseEvent);
  },
  beforeRouteLeave(to, from, next) {
    if (to.name === 'FI0306-1') {
      const { items, count, page, per } = this.reportData
      const { PagingRowPerPage, PagingCurrentPage } = this.$refs.twp1
      this.$store.registerModule('reportDataSrc', {
        state: {
          items,
          count,
          page,
          per,
          row: { per: PagingRowPerPage, page: PagingCurrentPage },
          query: this.ViewData,
        },
      })
    }

    next()
  },
  destroyed() {
    window.removeEventListener('keyup', this.KeyWatch)
  },
  watch: {
    'diffInfo.dialog'(val) {
      if (!val) {
        this.diffInfo.showFullScreen = false
        this.diffInfo.old.version = ''
        this.diffInfo.current.version = ''
        this.diffInfo.old.content = ''
        this.diffInfo.current.content = ''
      }
    },
    'reportData.per': {
      handler(val) {
        console.log(`val`, val)
      },
      immediate: true,
      deep: true,
    },
    CheckDateRange: {
      handler(val) {
        console.log(`CheckDateRange: `, val)
        if (val === null) {
          this.CheckDateRange = [null, null]
        }
      },
      immediate: true,
      deep: true,
    },
    ReportDateRange: {
      handler(val) {
        console.log(`ReportDateRange: `, val)
        if (val === null) {
          this.ReportDateRange = [null, null]
        }
      },
      immediate: true,
      deep: true,
    },
    CheckDateRangeSelect: {
      handler(val) {
        this.CheckDateRange = _.cloneDeep(this.setDateRange(val, 'CheckDateRange'))
      },
      immediate: true,
      deep: true,
    },
    ReportDateRangeSelect: {
      handler(val) {
        this.ReportDateRange = _.cloneDeep(this.setDateRange(val, 'ReportDateRange'))
      },
      immediate: true,
      deep: true,
    },
  },
}
</script>

<style lang="scss">
.el-select {
  input {
    width: 100% !important;
  }
}
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
.except-form-group > div {
  flex: 1 0 0;
}

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

#InputDataPickerA1,
#InputDataPickerA2 {
  .e-input-group {
    padding-top: 3px !important;
    border-style: none !important;
    background-color: transparent !important;
    height: 36px !important;
  }
  .e-input-group-icon {
    margin-top: -3px !important;
    border-right-width: 0 !important;
  }
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

#Picker1 .e-input-group,
#Picker2 .e-input-group,
#Picker3 .e-input-group {
  padding-top: 3px !important;
  border-style: none !important;
  background-color: transparent !important;
  height: 36px !important;
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

// new added
.d-grid {
  &.grid-col-cusMx4Mi2 {
    grid-template-columns: repeat(6, 1fr);
  }
}

@media screen and (max-width: 1440px) {
  .d-grid {
    &.grid-col-cusMx4Mi2 {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}

@media screen and (max-width: 1024px) {
  .d-grid {
    &.grid-col-cusMx4Mi2 {
      grid-template-columns: repeat(2, 1fr);
    }
  }
}

.RepoContentDiv {
  position: relative;
  margin: auto auto auto auto;
  width: 75%;
  height: 500px;
  background: rgba(255, 255, 255, 1);
  box-shadow: #ccc 1px 1px 3px 1px;

  * {
    box-sizing: border-box;
  }

  &.gap-mt {
    margin-top: 20px;
  }

  &.sticky-div {
    position: sticky;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 9999;
  }

  &.blank {
    background: none;
    box-shadow: none;
    border: none;
  }

  .btns-div {
    margin: 0 auto;
    padding: 15px 0 10px 0;
    width: 100%;
  }

  .outer-div {
    padding: 30px 40px 40px 40px;
  }

  .inner-div {
    margin: 0 auto;
    width: 100%;
    height: 280px;
    overflow-y: auto;
  }
}

.RepoContentTable {
  display: table;
  border-collapse: collapse;

  margin: 0 auto 50px auto;
  width: 100%;

  background: #fff;

  th,
  td {
    padding: 4px;
    border: #ccc 1px solid;

    word-wrap: break-word;
    word-break: break-all;
  }

  th {
    text-align: center;
    font-weight: bold;
    background: rgba(0, 0, 0, 1);
    color: #fff;
  }

  td {
    &.repo-content {
      padding: 8px 2.5% 24px 2.5%;
      text-align: left;
      vertical-align: top;
    }
  }
}

.dateSelectDiv {
  &.abs {
    position: absolute;
    top: 0;
    right: auto;
    bottom: 0;
    left: 0;
    z-index: 999;
  }

  padding: 0 4px;
  width: calc(100% - 33px);
  height: 34px;
  background: #fff;

  box-sizing: border-box;
}


.input-group {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
}

.clearInputValue {
  position: absolute;
  
  top: 0;
  right: 4px;
  bottom: 0;

  margin: auto;

  width: 22px;
  height: 22px;
  line-height: 22px;

  padding: 4px;
  border: #ccc 1px solid;
  background: #ededed;

  font-size: 20px;
  font-weight: bold;

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-content: center;
  justify-content: center;
  align-items: center;
  border-radius: 100%;

  transition: all .1s cubic-bezier(.17,.67,.83,.67) .2s;

  cursor: pointer;

  &:hover,
  &:focus{
    color: #fff;
    background: #666;
    -webkit-transform: scale(0.75);
    transform: scale(0.75);
  }

  &:active{
    color: #fff;
    background: #333;
  }
}

</style>
