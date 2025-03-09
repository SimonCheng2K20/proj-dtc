<!-- (Fn Call excel URL) OnChangeSelectedReportType() 改變報表判定要輸出的excel call => exportExcel() -->
<!-- display 判斷是否要show出 (年度[必show],季度,月度[必show],醫師,設備,檢查室) -->
<!-- emit => (時間區間,醫師,設備,檢查室) -->
<template>
  <div>
    <b-container fluid class="px-1">
      <b-row no-gutters class="mb-2">
        <b-col sm="3" class="px-1">
          <b-input-group prepend="報表類型">
            <b-select v-model="selectedType" :options="optionSelected" @change="OnChangeSelectedReportType" />
          </b-input-group>
        </b-col>
      </b-row>

      <b-row no-gutters class="mb-2" v-if="!useSpecificSearch">
        <b-col sm="2" class="px-1" v-show="display.showYear">
          <b-input-group prepend="年度">
            <b-select
              v-model="selectedYear"
              :options="optionsSelectedYear"
              :disabled="PickerDateRange !== null"
              @change="YearChange"
            />
          </b-input-group>
        </b-col>

        <b-col v-show="display.showQ" sm="2" class="px-1">
          <b-input-group prepend="季度">
            <b-select
              v-model="selectedSeason"
              :disabled="selectedYear == null || selectedMonth !== null"
              :options="optionsSelectedSeason"
              @change="SeasonChange"
            />
          </b-input-group>
        </b-col>
        <b-col v-show="display.showMnth" sm="2" class="px-1">
          <b-input-group prepend="月度">
            <b-select
              v-model="selectedMonth"
              :disabled="selectedYear == null || selectedSeason !== null"
              :options="optionsSelectedMonth"
              @change="MonChange"
            />
          </b-input-group>
        </b-col>
        <b-col v-show="display.showDay" sm="2" class="px-1">
          <b-input-group prepend="日度">
            <b-select
              v-model="selectedDay"
              :disabled="selectedYear == null || selectedMonth == null"
              :options="optionsSelectedDay"
            />
          </b-input-group>
        </b-col>
        <b-col v-show="display.showRange" sm="4" class="px-1">
          <div class="d-flex">
            <b-input-group prepend="時間範圍">
              <b-select
                v-model="dateRange"
                :disabled="selectedYear !== null"
                :options="dateRangeOptions"
                @change="ondateRangeChange"
              />
            </b-input-group>
            <b-input-group>
              <div id="OpenDataPicker" class="form-control" style="padding: 0px 0px">
                <ejs-daterangepicker
                  v-model="PickerDateRange"
                  :enabled="selectedYear === null && dateRange === -1"
                  @change="changeRange"
                ></ejs-daterangepicker>
              </div>
            </b-input-group>
          </div>
        </b-col>
      </b-row>

      <b-row no-gutters class="mb-2" v-if="!useSpecificSearch">
        <b-col sm="5" class="px-1" v-show="display.smsStatus">
          <b-input-group prepend="簡訊接收狀況">
            <b-select
              v-model="selectSMSStatus"
              :options="optionsSMSStatus"
              @change="smsStatusChange"
            />
          </b-input-group>
        </b-col>
        <b-col sm="5" class="px-1" v-show="display.returnCode">
          <b-input-group prepend="醫師回傳代碼">
            <b-select
              v-model="selectReturnCode"
              :options="optionsReturnCode"
              @change="returnCodeChange"
            />
          </b-input-group>
        </b-col>
      </b-row>

      <b-row no-gutters class="mb-2" v-if="!useSpecificSearch">
        <b-col v-show="display.physician" sm="4" class="px-1">
          <b-input-group prepend="醫師">
            <b-form-select
              v-model="selectedPhysician"
              :options="getIssueDrs.map(({ text, value }) => ({ text, value: text }))"
            />
          </b-input-group>
        </b-col>
        <b-col v-show="display.modality" sm="3" class="px-1">
          <b-input-group prepend="設備">
            <treeselect
              id="tree-select"
              v-model="selectedInspectDevice"
              :multiple="true"
              :searchable="true"
              :options="optionsInspectDevice"
              @input="changeModality"
            />
          </b-input-group>
        </b-col>
        <b-col v-show="selectedType === 'C11'" sm="3" class="px-1">
          <b-input-group prepend="分類">
            <b-form-select
              v-model="failImage.TYPE"
              :options="[
                { text: '全部', value: '' },
                { text: '重照', value: 1 },
                { text: '不良影像', value: 2 },
              ]"
            />
          </b-input-group>
        </b-col>
        <b-col v-show="selectedType === 'C11'" sm="3" class="px-1">
          <b-input-group prepend="影像種類">
            <b-form-select
              v-model="failImage.IMAGETYPE"
              :options="[
                { text: '全部', value: '' },
                { text: 'X-Ray', value: 2 },
                { text: 'Special', value: 3 },
              ]"
            />
          </b-input-group>
        </b-col>
        <b-col v-show="selectedType === 'C11'" sm="3" class="px-1">
          <b-input-group prepend="發現階段">
            <b-form-select
              v-model="failImage.STEP"
              :options="[
                { text: '全部', value: '' },
                { text: '自已發現', value: 1 },
                { text: 'QA發現', value: 2 },
                { text: '科內醫師', value: 3 },
                { text: '診間WEB', value: 4 },
                { text: '報告已發', value: 5 },
                { text: '醫療糾紛', value: 6 },
              ]"
            />
          </b-input-group>
        </b-col>
        <b-col v-show="display.caculateType" sm="3" class="px-1">
          <b-form-radio-group
            id="caculating-radios"
            class="text-white"
            v-model="caculateType"
            :options="[
              { text: '計算1', value: 1 },
              { text: '計算2', value: 2 },
            ]"
            buttons
            button-variant="primary"
            size="sm"
            name="radios-btn-default"
            @change="changeExcelCurrent"
          ></b-form-radio-group>
        </b-col>
        <b-col v-show="display.medicationNo" sm="4" class="px-1">
          <b-input-group prepend="耗材代碼">
            <b-input v-model.trim="medicationNoCode" />
          </b-input-group>
        </b-col>
        <b-col v-show="display.priceNo" sm="2" class="px-1">
          <b-input-group prepend="批價代碼">
            <b-input v-model.trim="priceNo" @change="changePriceNo" />
          </b-input-group>
        </b-col>
        <b-col v-show="display.patientSource" sm="3" class="px-1">
          <b-input-group prepend="病患來源">
            <treeselect
              @close="changePatientSrc"
              id="patient-select"
              v-model="patientSource"
              :multiple="true"
              :searchable="true"
              :options="
                patientSourceList.map(({ text, value }) => ({
                  id: value,
                  label: text,
                  isNew: true,
                }))
              "
            />
          </b-input-group>
        </b-col>
        <b-col v-show="display.checkMultipleRoom" sm="3" class="px-1">
          <b-input-group prepend="檢查室">
            <treeselect
              id="selectCheckRoom"
              class="flex-1"
              v-model="selectedMultipleCheckRoom"
              :multiple="true"
              :searchable="true"
              :options="
                getLocationIdOptions.map(({ value, text }) => ({
                  id: value,
                  label: text,
                }))
              "
              @close="changeMultipleCheckRoom"
            />
          </b-input-group>
        </b-col>
        <b-col v-show="display.checkRoom" sm="2" class="px-1">
          <b-input-group prepend="檢查室">
            <b-select
              v-model="selectedCheckRoom"
              :options="[{ text: '請選擇以下檢查室', value: '' }, ...getLocationIdOptions]"
              @change="changeCheckRoom"
            />
          </b-input-group>
        </b-col>
        <b-col v-show="display.errLv" sm="2" class="px-1" v-if="!this.showErrLv_805 == 'false'">
          <b-input-group prepend="風險等級">
            <b-select
              v-model="errLevel"
              :options="[
                { text: '請選擇以下風險等級', value: '' },
                ...['普通通報', '緊急危險通報', '異常值通報'].map((v, i) => ({
                  text: v,
                  value: i,
                })),
              ]"
              @change="changeErrorLevel"
            />
          </b-input-group>
        </b-col>
      </b-row>

      <b-row no-gutters class="mb-2" v-if="useSpecificSearch">
        <b-col v-show="display.showRange" sm="4" class="px-1">
          <div class="d-flex">
            <b-input-group prepend="時間範圍">
              <b-select
                v-model="dateRange"
                :disabled="selectedYear !== null"
                :options="dateRangeOptions"
                @change="ondateRangeChange"
              />
            </b-input-group>
            <b-input-group>
              <div id="OpenDataPicker" class="form-control" style="padding: 0px 0px">
                <ejs-daterangepicker
                  v-model="PickerDateRange"
                  :enabled="selectedYear === null && dateRange === -1"
                  @change="changeRange"
                ></ejs-daterangepicker>
              </div>
            </b-input-group>
          </div>
        </b-col>

        <b-col v-show="display.modality" sm="3" class="px-1">
          <b-input-group prepend="儀器類別">
            <treeselect
              id="tree-select"
              v-model="selectedInspectDevice"
              :multiple="true"
              :searchable="true"
              :options="optionsInspectDevice"
              @input="OnchangeModality"
            />
          </b-input-group>
        </b-col>

        <b-col v-show="display.physician" sm="3" class="px-1">
          <b-input-group prepend="報告醫師">
            <div id="DoctorPicker" class="form-control" style="padding: 0px 0px; color: #ccc">
              <ejs-autocomplete
                id="inputIssuePhysician"
                ref="inputIssuePhysician"
                v-model="selectedIssuePhysician"
                :dataSource="IssuePhysicianSource"
                :placeholder="'搜尋姓名'"
                @change="OnChangeIssuePhysician"
              ></ejs-autocomplete>
            </div>
            <!-- <ejs-autocomplete :dataSource='searchingDoctors' :placeholder="'輸入姓名'" ></ejs-autocomplete> -->
          </b-input-group>
        </b-col>

        <!-- report9 (s) -->
        <b-col v-show="display.showRangeCreateTime" sm="4" class="px-1">
          <div class="d-flex">
            <b-input-group prepend="時間範圍">
              <b-select
                v-model="dateRange"
                :disabled="selectedYear !== null"
                :options="dateRangeOptions"
                @change="ondateRangeChange"
              />
            </b-input-group>
            <b-input-group>
              <div id="OpenDataPicker" class="form-control" style="padding: 0px 0px">
                <ejs-daterangepicker
                  v-model="PickerDateRange"
                  :enabled="selectedYear === null && dateRange === -1"
                  @change="changeRange"
                ></ejs-daterangepicker>
              </div>
            </b-input-group>
          </div>
        </b-col>

        <b-col v-show="display.showPatientId" sm="2" class="px-1">
          <b-input-group prepend="檢查單號">
            <b-input v-model="searchAccessionNo" />
          </b-input-group>
        </b-col>

        <b-col v-show="display.showPatientId" sm="2" class="px-1">
          <b-input-group prepend="病歷號碼">
            <b-input v-model="searchPatientId" />
          </b-input-group>
        </b-col>

        <b-col v-show="display.showPatientSourceTypeCode" sm="2" class="px-1">
          <b-input-group prepend="診別">
            <b-select v-model="searchPatientSourceTypeCode" :options="optionsPatientSource" />
          </b-input-group>
        </b-col>

        <b-col v-show="display.showSelectedRadiographer" sm="2" class="px-1">
          <b-input-group prepend="放射師">
            <b-select v-model="searchSelectedRadiographer" :options="optionsRadiographer" />
          </b-input-group>
        </b-col>
      </b-row>
      <!-- report9 (e) -->

      <b-row no-gutters class="mb-1 pt-1">
        <b-col class="px-1 text-right noPrint">
          <b-button
            class="ml-1"
            variant="primary"
            @click="SearchConditions('search')"
            :disabled="
              (!selectedPhysician && selectedType === 'report4') || (selectedType === 'C1' && !this.isChosenTime)
            "
          >
            <font-awesome-icon icon="search" />進行查詢
          </b-button>
          <b-button class="ml-1" variant="success" @click="ClearConditions">
            <font-awesome-icon icon="eraser" />清除條件
          </b-button>
          <!-- <div v-text="selectedType" /> -->
          <!-- <div
            v-if="selectedType === 'C2'"
            v-text="'dataRange: ' + JSON.stringify(excelUrlData.urls)"
          /> -->
          <b-button
            class="ml-1"
            variant="warning"
            v-if="selectedType === 'report6'"
            :disabled="isLoading"
            @click.stop="printWork"
          >
            <font-awesome-icon icon="print" />報表列印
          </b-button>
          <b-button
            class="ml-1"
            variant="danger"
            @click="exportExcel"
            :disabled="
              ((selectedType === 'C1_1' ||
                selectedType === 'C2' ||
                selectedType === 'image2' ||
                selectedType === 'image3' ||
                (selectedType === 'report6' && report6IsPending)) &&
                (!excelUrlData ||
                  !excelUrlData.currentCondition ||
                  !excelUrlData.urls.hasOwnProperty(excelUrlData.currentCondition) ||
                  !excelUrlData.urls[excelUrlData.currentCondition])) ||
              (!selectedPhysician && selectedType === 'report4')
            "
          >
            <font-awesome-icon icon="download" />下載Excel
          </b-button>
          <b-button class="ml-1" variant="primary" @click="exportLiteExcel" v-if="selectedType === 'C10'">
            <font-awesome-icon icon="file-excel" />下載簡易excel
          </b-button>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>
<script>
import { season, year, Mnth } from '@/views/TableState/DateSelect.js'
//報告類型清單
import { ReportList } from '@/views/TableState/ReportComponents/ReportStat.js'
import { optionsSelectedImageType } from '@/views/TableState/CheckRoomComponents/CheckRoomStat.js'
import { ImageList } from '@/views/TableState/ImageComponents/ImageStat.js'
import {
  reportGraphPhysicianListUrl,
  getOptionsPatientSource,
  getRoomSelectIdList,
  getFailImagesExcel,
  getHrrMessageExcel,
  getReportDoctorReportCountExcel,
  getReportAgeingExcel,
  roomScheduleDaysReport,
  getRadiographerCodeName,
  getFailImageReasonReport,
} from '@/assets/service/dataManager.js'
import DateHelper from '@/library/DateHelper'
import FormHelper from '@/library/FormHelper'

import Vue from 'vue'

import { AutoCompletePlugin } from '@syncfusion/ej2-vue-dropdowns'
Vue.use(AutoCompletePlugin)
//ejs 選擇時間範圍
import { DateRangePickerPlugin } from '@syncfusion/ej2-vue-calendars'
Vue.use(DateRangePickerPlugin)
//super select
import VSuperSelect from 'v-super-select'
import * as configs from '@/config'
import { DataManager, WebApiAdaptor, Query } from '@syncfusion/ej2-data'
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'
// import the component
import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  components: { Treeselect, VSuperSelect },
  props: {
    //傳dateRange & InspectDevice() 給parent
    searchBarDateRange: { type: Function },
    //選擇table後refresh TWP
    selectTbStat: { type: String },
    //判斷出不同種類統計表單
    kindState: { type: String },
    roomNoList: { type: Array },
  },
  data() {
    return {
      //報表種類，為了打excel URL
      tableType: '',
      //報表選擇
      optionSelected: [],
      selectSMSStatus: null,
      // 1.已傳送至醫院端(傳送成功) 2.未傳送至醫師端(傳送失敗) 0.RIS已送出至中華電信簡訊系統(傳送中)
      optionsSMSStatus: [
        {text: '', value: null},
        {text: '0. RIS已送出至中華電信簡訊系統(傳送中)', value: 0},
        {text: '1. 已傳送至醫院端(傳送成功)', value: 1},
        {text: '2. 未傳送至醫師端(傳送失敗)', value: 2}
      ],
      selectReturnCode: null,
      // 1.已收到簡訊，並查閱PACS系統報告  2.已收到簡訊，並連繫病人處理中
      optionsReturnCode: [
        {text: '', value: null},
        {text: '0. RIS已送出至中華電信簡訊系統(傳送中)', value: 0},
        {text: '1. 已收到簡訊，並查閱PACS系統報告', value: 1},
        {text: '2. 已收到簡訊，並連繫病人處理中', value: 2},
      ],
      selectedType: null,
      //年度
      optionsSelectedYear: [],
      selectedYear: null,
      //季度
      optionsSelectedSeason: [],
      selectedSeason: null,
      //月度
      optionsSelectedMonth: Mnth,
      selectedMonth: null,
      selectedDay: null,
      //醫生
      optionsSelectedPhysician: [],
      selectedPhysician: '',

      dateRange: 1,
      dateRangeOptions: [
        { text: '一個月', value: 1 },
        { text: '三個月', value: 3 },
        { text: '半年', value: 6 },
        { text: '一年', value: 12 },
        { text: '自選', value: -1 },
      ],
      //Picker時間區間
      PickerDateRange: [this.$moment().subtract(1, 'months').format(), this.$moment().format()],
      //設備
      optionsInspectDevice: [],
      selectedInspectDevice: [],
      patientSource: [],
      medicationNoCode: '',
      //檢查室
      optionsCheckRoom: [],
      selectedCheckRoom: null,
      selectedMultipleCheckRoom: null,

      errLevel: '',

      //時間區間
      DateRange: [null, null],
      //取到onchange時的資料 (年度不選時預設為今年)
      YearData: null,
      StarMthData: null,
      EndMthData: null,
      caculateType: 1,
      priceNo: '',
      //show condition input
      display: {
        //季度
        showQ: true,
        //日度
        showDay: false,
        //月度
        showMnth: true,
        //年度
        showYear: true,
        //ejs-component(自由選擇時間)
        showRange: true,
        //醫生
        physician: false,
        //設備
        modality: false,
        //檢查室
        checkRoom: false,
        checkMultipleRoom: false,
        //耗材代碼
        medicationNo: false,
        //病患來源
        patientSource: false,
        //計算方式
        caculateType: false,
        //批價代碼
        priceNo: false,
        //
        errLv: false,
        //report9
        showRangeCreateTime: false,
        showPatientId: false,
        showAccessionNo: false,
        showPatientSourceTypeCode: false,
        showSelectedRadiographer: false,
        smsStatus: false,
        returnCode: false
      },
      failImage: {
        TYPE: '',
        IMAGETYPE: '',
        STEP: '',
      },
      report6IsPending: false,
      showErrLv_805: process.env.VUE_APP_SHOW_ERRLV,
      searchingDoctors: ['A123', 'B456', 'C789', 'D123'],
      IssuePhysicianSource: [],
      selectedIssuePhysician: null,
      realSelectedIssuePhysician: null,
      searchRangeTemp: {},
      searchPatientId: null,
      searchAccessionNo: null,
      searchPatientSourceTypeCode: null,
      searchSelectedRadiographer: null,
      optionsPatientSource: [],
      optionsRadiographer: [],
      isSearchTemp: false,
    }
  },

  computed: {
    ...mapState(['patientSourceList']),
    ...mapGetters(['getIssueDrs', 'getLocationIdOptions', 'getLocationNoOptions']),
    optionsSelectedDay() {
      return !this.selectedYear || !this.selectedMonth
        ? [{ text: '請選擇', value: null }]
        : [
            { text: '請選擇', value: null },
            ...new Array(new Date(this.selectedYear, this.selectedMonth, 0).getDate())
              .fill(0)
              .map((v, i) => ({ text: i + 1, value: i + 1 })),
          ]
    },
    excelUrlData() {
      return this.$store.state.excelUrl
    },
    isChosenTime() {
      return !!this.selectedMonth || !!this.PickerDateRange || !!this.selectedSeason
    },
    useSpecificSearch() {
      const optionsArr = ['report7', 'report8', 'report9']
      return optionsArr.includes(this.selectedType)
    },
    searchRange: {
      get() {
        return this.searchRangeTemp
      },
      set(val) {
        this.searchRangeTemp = val
      },
    },
    isSearch: {
      get() {
        return this.isSearchTemp
      },
      set(val) {
        this.isSearchTemp = val
      },
    },
  },
  methods: {
    ...mapMutations([
      'SET_PATIENT_SOURCE_LIST',
      'SET_LOCATION_LIST',
      'SHOW_LOADING',
      'HIDE_LOADING',
      'SET_SIDE_MESSAGE',
    ]),
    ...mapActions(['action_getIssueDoctors']),

    ondateRangeChange(val) {
      if (val !== -1) this.PickerDateRange = [this.$moment().subtract(val, 'months').format(), this.$moment().format()]
      else this.PickerDateRange = null
    },
    OnChangeIssuePhysician(e) {
      this.realSelectedIssuePhysician = null

      if (e.itemData && e.itemData.value) {
        this.realSelectedIssuePhysician = e.itemData.value
      }

      this.$emit('selectIssuePhysicianNo', this.realSelectedIssuePhysician)
    },
    async GetOptionsIssuePhysicianSource() {
      let itemPack = null
      let convertedCollections = [{ value: null, text: '請選擇' }]
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
      console.log(`this.IssuePhysicianSource: `, this.IssuePhysicianSource)
    },
    changeExcelCurrent() {
      const time = this.DateRange.reduce((acc, cur) => acc.concat(this.$moment(cur).format('YYYY/MM/DD')), []).join(
        ' - '
      )
      this.$store.commit(
        'wsSetExcelCurrent',
        time + '_m_' + this.caculateType + '_' + this.selectedInspectDevice.join(',')
      )
    },
    printWork() {
      window.print()
    },
    changePatientSrc() {
      if (this.selectedType === 'C2') {
        this.$store.commit('wsSetExcelCurrent', this.prepareC2Condition())
      }
    },
    prepareC2Condition() {
      const _time = this.DateRange.every((v) => v)
        ? this.DateRange.map((v) => this.$moment(v).format('YYYY/MM/DD')).join(' - ')
        : ''
      const _checkRoom = this.selectedMultipleCheckRoom ? this.selectedMultipleCheckRoom.join(',') : ''
      const _priceNo = this.priceNo
      const _patientSrc = this.patientSource.join(',')
      return [_time, _checkRoom, _priceNo, _patientSrc].filter((v) => v).join('_')
    },
    changePriceNo(value) {
      if (this.selectedType === 'C2') {
        this.$store.commit('wsSetExcelCurrent', this.prepareC2Condition())
      }
    },
    changeRange({ text }) {
      this.setDateRange()
      if (this.selectedType === 'image2' || this.selectedType === 'image3') {
        const checkRoom = this.selectedType === 'C2' ? this.selectedCheckRoom.join(',') : ''
        this.$store.commit('wsSetExcelCurrent', text ? text : '')
      } else if (this.selectedType === 'C2') {
        this.$store.commit('wsSetExcelCurrent', this.prepareC2Condition())
      }
      if (this.selectedType === 'C1')
        this.$store.commit('wsSetExcelCurrent', (text ? text : '') + '_m_' + this.selectedInspectDevice.join(','))
    },
    changeCheckRoom() {},
    changeErrorLevel() {},
    changeMultipleCheckRoom() {
      if (this.selectedType === 'C2') {
        this.$store.commit('wsSetExcelCurrent', this.prepareC2Condition())
      }
    },
    changeModality() {
      this.setDateRange()
      if (!this.DateRange.every((time) => time)) return
      const time = this.DateRange.reduce((acc, cur) => acc.concat(this.$moment(cur).format('YYYY/MM/DD')), []).join(
        ' - '
      )
      if (this.selectedType === 'C1')
        this.$store.commit('wsSetExcelCurrent', time + '_m_' + this.selectedInspectDevice.join(','))
    },
    OnchangeModality() {
      console.log(`OnchangeModality ~`)
      console.log(`selectedInspectDevice: `, this.selectedInspectDevice)

      this.$emit(`statChangeModality`, this.selectedInspectDevice)
    },
    //改變報表類型
    OnChangeSelectedReportType(x) {
      this.tableType = x
      // console.log(this.tableType);
      //每報表所用的搜尋條件不同，改變表單時清除條件
      this.Clear()
      //把要show 的search condition設定為原始值
      this.display = {
        showQ: true,
        showDay: false,
        showMnth: true,
        showRange: true,
        physician: false,
        modality: false,
        checkRoom: false,
      }
      this.ShowDate()
      this.$emit('selectTbStat', x)
      this.SearchConditions()
      // this.$nextTick(() => {
      // });
    },
    //是否有要show condition searchBar
    ShowDate() {
      // console.log(this.tableType);
      this.display.showYear = true

      if (this.tableType == 'C10' || this.tableType == 'C9') {
        //只能show 出檢查室
        this.display.checkRoom = true
      } else if (this.tableType == 'C1') {
        //show出設備search condition
        this.display.modality = true
        this.display.caculateType = true
      } else if (this.tableType === 'C7') {
        this.display.medicationNo = true
        this.display.patientSource = true
      } else if (
        this.tableType == 'report1' ||
        this.tableType == 'report2' ||
        this.tableType == 'image1' ||
        this.tableType == 'image2' ||
        this.tableType == 'image5' ||
        this.tableType == 'C2' ||
        this.tableType == 'C3' ||
        this.tableType == 'C4' ||
        this.tableType == 'C8'
      ) {
        //只能選擇月度
        this.display.showQ = false
        this.display.showRange = false
      } else if (this.tableType == 'C5' || this.tableType == 'report3') {
        //只能選擇年度
        this.display.showQ = false
        this.display.showMnth = false
        this.display.showRange = false
      } else if (this.tableType == 'report4') {
        //只能選擇年和醫生
        this.display.showQ = false
        this.display.showRange = false
        this.display.showMnth = false
        this.display.physician = true
      } else if (this.tableType == 'image4') {
        this.display.showQ = this.display.showRange = false
        // this.display.showDay = true;
      } else if (this.tableType == 'report5') {
        this.display.errLv = true
        this.display.smsStatus = true
        this.display.returnCode = true
      }

      if (this.tableType == 'C8') {
        this.display.checkRoom = true
        this.display.showRange = true
      }

      if (this.tableType == 'C2') {
        ;['patientSource', 'checkMultipleRoom', 'priceNo', 'showRange'].forEach((key) => (this.display[key] = true))
      }

      if (this.tableType == 'C11') {
        // Object.keys(this.display).forEach(k => {
        //   this.display[k] = k === 'modality'
        //     ? true
        //     : false;
        // });
        // this.display.modality = true;
      }

      if (this.tableType == 'report6') {
        this.display.showQ = false
        this.display.showMnth = false
        this.display.showRange = false
        this.display.showYear = false
      }

      if (this.tableType == 'report7') {
        this.display.showRange = true
        this.display.modality = true
        this.display.physician = true
      }

      if (this.tableType == 'report8') {
        this.display.showRange = true
        this.display.modality = true
        this.display.physician = true
      }

      if (this.tableType == 'report9') {
        this.GetOptionsPatientSource()
        this.GetOptionsRadiographer()

        this.display.showRange = false

        this.display.showRangeCreateTime = true
        this.display.showPatientId = true
        this.display.showAccessionNo = true
        this.display.showPatientSourceTypeCode = true
        this.display.showSelectedRadiographer = true
      }
    },
    givingTimeout() {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve()
        }, 1000)
      })
    },
    //年度onChange
    YearChange(x) {
      // console.log(`你選了${x}年`);
      this.YearData = x
    },
    smsStatusChange(x){
      this.selectSMSStatus = x
    },
    returnCodeChange(x){
      this.selectReturnCode = x
    },
    //季度onChange
    SeasonChange(x) {
      // console.log(`你選了${x}季`);
      //讓月度變成 "請選擇"
      this.setDateRange()
      this.selectedMonth = null
      //第一季為1 ~ 3 第二季為4 ~ 6 第三季為7 ~ 9 第四季為10 ~ 12
      if (x == 's1') {
        this.StarMthData = 1
        this.EndMthData = 3
      } else if (x == 's2') {
        this.StarMthData = 4
        this.EndMthData = 6
      } else if (x == 's3') {
        this.StarMthData = 7
        this.EndMthData = 9
      } else if (x == 's4') {
        this.StarMthData = 10
        this.EndMthData = 12
      } else if (x == null) {
        this.StarMthData = 1
        this.EndMthData = 12
      }

      if (this.selectedType === 'image3') {
        const momentOne = this.$moment(`${this.selectedYear}-${this.StarMthData}`)
        const momentTwo = this.$moment(`${this.selectedYear}-${this.EndMthData}`)
        this.$store.commit(
          'wsSetExcelCurrent',
          `${momentOne.startOf('month').format('YYYY-MM-DD')}-${momentTwo.endOf('month').format('YYYY-MM-DD')}`
        )
      } else if (this.selectedType === 'C1') {
        const time = this.DateRange.reduce((acc, cur) => acc.concat(this.$moment(cur).format('YYYY/MM/DD')), []).join(
          ' - '
        )
        this.$store.commit('wsSetExcelCurrent', time + '_m_' + this.selectedInspectDevice.join(','))
      }
    },
    //月度onChange
    async MonChange(x) {
      // console.log(`你選了${x}月`);
      //讓季度變成 "請選擇"
      this.EndMthData = this.StarMthData = x
      this.setDateRange()
      this.selectedSeason = null
      if (this.selectedType === 'C1' || this.selectedType === 'C2' || this.selectedType === 'image2')
        this.$store.commit(
          'wsSetExcelCurrent',
          this.selectedMonth ? `${this.selectedYear}-${this.selectedMonth}-01` : ''
        )
      if (this.selectedType === 'image3') {
        const momentObj = this.$moment(`${this.selectedYear}-${x}`)
        this.$store.commit(
          'wsSetExcelCurrent',
          `${momentObj.startOf('month').format('YYYY-MM-DD')}-${momentObj.endOf('month').format('YYYY-MM-DD')}`
        )
      } else if (this.selectedType === 'C1') {
        this.changeExcelCurrent()
      }
    },
    //某些報表為月報表，只需要月度
    //判斷是否要show出 季度 & 自由選擇時間 欄位
    async GetPatientSource() {
      if (this.patientSourceList.length === 0) {
        const {
          actual: { Items },
        } = await getOptionsPatientSource()
        this.SET_PATIENT_SOURCE_LIST(Items.map(({ No, Name }) => ({ text: Name, value: No })))
      }
    },
    //GET 醫師列表
    async GetOptsPhysicianSource() {
      // console.log(this.$logs());
      if (this.getIssueDrs.length === 0) this.action_getIssueDoctors()
    },
    //GET 檢查室類別列表
    GetOptionsCheckRoom() {
      // console.log(this.$logs());

      if (this.getLocationIdOptions.length === 0) {
        getRoomSelectIdList().then(({ Items }) => {
          this.SET_LOCATION_LIST({ key: 'id', items: Items })
        })
      }
    },
    //GET 儀器類別列表
    async GetOptionsInspectDevice() {
      // console.log(this.$logs());
      //
      let itemPack = null
      let convertedCollections = []
      //
      let subPath = '/exam/GetModalityList'
      // let subPath = "/device/SelectNoList";
      //
      this.SHOW_LOADING()
      // let opStatus = false;
      //
      //改成用axios
      await window.axios.get(subPath).then((res) => {
        itemPack = res
        // console.log(itemPack);
      })
      itemPack.forEach((e) => {
        convertedCollections.push({ id: e, label: e, isNew: true })
      })

      this.optionsInspectDevice = convertedCollections
      // console.log("GET-儀器類別--列表");
      // console.log(this.optionsInspectDevice);
      this.HIDE_LOADING()
    },
    //---------------------------------------search Bar changeFn----------------------------------------------//
    setDateRange() {
      //年度 未設定 return
      if (this.PickerDateRange == null && this.selectedYear == null) return
      let searchStartDate = '',
        searchEndDate = '' // , timeObj = ""
      if (this.selectedYear !== null) {
        // 只選月的時候給今年
        if (this.YearData == null) {
          this.YearData = new Date().getFullYear()
        }
        // 只選年的時候給全年 (1月~ 12月)
        // console.log(this.StarMthData);
        if (this.StarMthData == null && this.EndMthData == null) {
          this.StarMthData = '1'
          this.EndMthData = '12'
        }
        searchStartDate = this.$moment(`${this.YearData}-${this.StarMthData}`).startOf('month').format('YYYY-MM-DD')
        searchEndDate = this.$moment(`${this.YearData}-${this.EndMthData}`).endOf('month').format('YYYY-MM-DD')
      } else {
        console.log(this.PickerDateRange)

        searchStartDate = this.$moment(this.PickerDateRange[0]).format('YYYY-MM-DD')
        searchEndDate = this.$moment(this.PickerDateRange[1]).format('YYYY-MM-DD')
      }

      console.log({ searchStartDate, searchEndDate })

      this.DateRange = [searchStartDate, searchEndDate]
      // console.log(this.DateRange);
      // console.log("這是你選的日期區間", this.DateRange);
    },
    setSpecificData() {
      console.log(`setSpecificData~`)

      const arrKey = [
        'searchPatientId',
        'searchAccessionNo',
        'searchPatientSourceTypeCode',
        'searchSelectedRadiographer',
      ]

      arrKey.forEach((key) => {
        if (this[`${key}`]) {
          this.searchRange[`${key}`] = this[`${key}`]
        }
      })
    },
    Clear() {
      //年度 季度 月度 清除
      this.selectedYear = null
      this.selectedSeason = null
      this.selectedMonth = null
      
      //醫師 (super-select components 需要抓到value清除)
      this.selectedPhysician = ''
      this.selectedIssuePhysician = null
      this.realSelectedIssuePhysician = null

      //sms
      this.selectSMSStatus = null
      this.selectReturnCode = null

      setTimeout(() => {
        const q = '.super-select-input input[type=text]'
        if (document.querySelector(q)) document.querySelector(q).value = ''
      }, 300)

      //設備
      this.selectedInspectDevice = []
      // 病患來源
      this.patientSource = []
      //檢查室
      this.selectedCheckRoom = null
      //時間範圍
      this.dateRange = 1
      this.PickerDateRange = [this.$moment().subtract(1, 'months').format(), this.$moment().format()]
      this.DateRange = [null, null]

      this.searchPatientId = null
      this.searchAccessionNo = null
      this.searchPatientSourceTypeCode = null
      this.searchSelectedRadiographer = null

      this.searchRange = {}
      this.StarMthData = null
      this.EndMthData = null
    },
    ClearConditions() {
      this.Clear()
      this.SearchConditions()
    },
    // ---------------------------Call excel URL-------------------------//
    async image1() {
      this.SHOW_LOADING()
      this.setDateRange()
      let schedulgurl = '?date=' + this.DateRange[0]
      // console.log("erport excel : " + schedulgurl);
      await window.axios.get('/schedule/ReportMonthGraphCheck' + schedulgurl).then((r) => {
        // console.log(r);
        FormHelper.downloadFile(r.Url)
      })
      this.HIDE_LOADING()
    },
    image2() {
      if (this.excelUrlData.urls[this.excelUrlData.currentCondition])
        FormHelper.downloadFile(this.excelUrlData.urls[this.excelUrlData.currentCondition])
    },
    image3() {
      if (this.excelUrlData.urls[this.excelUrlData.currentCondition])
        FormHelper.downloadFile(this.excelUrlData.urls[this.excelUrlData.currentCondition])
    },
    image4() {
      this.SHOW_LOADING()
      this.setDateRange()
      let schedulgurl = '?date=' + this.DateRange[0]
      window.axios.get('/schedule/ReportMonthAvg' + schedulgurl).then((r) => {
        FormHelper.downloadFile(r.Url)
      })
      this.HIDE_LOADING()
    },
    image5() {
      this.SHOW_LOADING()
      //GET
      this.setDateRange()
      let schedulgurl = '?date=' + this.DateRange[0]
      window.axios.get('/schedule/ReportGraphChangeRecord' + schedulgurl).then((r) => {
        FormHelper.downloadFile(r.Url)
      })
      this.HIDE_LOADING()
    },
    image6() {
      this.SHOW_LOADING()
      this.setDateRange()
      let schedulgurl = '?startDate=' + this.DateRange[0] + '&endDate=' + this.DateRange[1]
      window.axios.get('/reportStatistics/GetImageDxReportMrReport' + schedulgurl).then((r) => {
        FormHelper.downloadFile(r.Url)
        this.HIDE_LOADING()
      })
    },
    image7() {
      this.SHOW_LOADING()
      this.setDateRange()
      const params = this.DateRange.map((datetime, idx) => `${idx === 0 ? 'start' : 'end'}Date=${datetime}`)
      window.axios.get('/schedule/ReportGraphChangeRecord?' + params.join('&')).then((r) => {
        FormHelper.downloadFile(r.Url)
        this.HIDE_LOADING()
      })
    },
    async C1() {
      if (this.excelUrlData.urls[this.excelUrlData.currentCondition]) {
        FormHelper.downloadFile(this.excelUrlData.urls[this.excelUrlData.currentCondition])
      } else {
        this.$emit('gExcel', this.excelUrlData.urls[this.excelUrlData.currentCondition])
      }
      // this.SHOW_LOADING();

      // this.setDateRange();
      // let schedulgurl = "?startDate=" + this.DateRange[0] + "&endDate=" + this.DateRange[1];
      // let deviceid = (this.selectedInspectDevice) ? "&modality=" + this.selectedInspectDevice : '';
      // // console.log("erport excel : " + schedulgurl + deviceid);
      // await window.axios.get("/reportStatistics/CheckInReport" + schedulgurl + deviceid).then((r) => {
      //   // console.log(r);
      //   FormHelper.downloadFile(r.Url);
      // });
      // this.HIDE_LOADING();
    },
    C2() {
      if (this.excelUrlData.urls[this.excelUrlData.currentCondition])
        FormHelper.downloadFile(this.excelUrlData.urls[this.excelUrlData.currentCondition])
      // this.SHOW_LOADING();
      // this.setDateRange();
      // reportMonthFinishCheckUrl(`date = ${ this.DateRange[0] }& top=10 & indexPage=0`).then(({ Url }) => {
      //   FormHelper.downloadFile(Url);
      // });
      // this.HIDE_LOADING();
    },
    async C3() {
      this.SHOW_LOADING()

      this.setDateRange()
      let schedulgurl = '?date=' + this.DateRange[0]
      try {
        await window.axios.get('/schedule/ReportServiceItemSum' + schedulgurl).then((r) => {
          // console.log(r);
          FormHelper.downloadFile(r.Url)
          this.HIDE_LOADING()
        })
      } catch (err) {
        this.SET_SIDE_MESSAGE({ msg: '發生錯誤', type: 2 })
        this.HIDE_LOADING()
      }
    },
    async C4() {
      this.SHOW_LOADING()

      this.setDateRange()
      let year = '?year=' + `${new Date(this.DateRange[0]).getFullYear()}`
      let mnth = '&month=' + `${new Date(this.DateRange[0]).getMonth() + 1}`
      // console.log("erport excel : " + year + mnth);
      await window.axios.get('/reportStatistics/ModalitySourceTypeCountReport' + year + mnth).then((r) => {
        // console.log(r);
        FormHelper.downloadFile(r.Url)
      })
      this.HIDE_LOADING()
    },
    async C5() {
      this.SHOW_LOADING()
      this.setDateRange()
      let year = '?year=' + `${new Date(this.DateRange[0]).getFullYear()} `
      // console.log("erport excel : " + year);
      await window.axios.get('/reportStatistics/RoomYearCountReport' + year).then((r) => {
        // console.log(r);
        FormHelper.downloadFile(r.Url)
      })
      this.HIDE_LOADING()
    },
    async C6() {
      this.SHOW_LOADING()

      this.setDateRange()
      let d = new Date(this.DateRange[0])
      let ed = new Date(this.DateRange[1])
      let start = '?startDate=' + `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
      let end = '&endDate=' + `${ed.getFullYear()}-${ed.getMonth() + 1}-${ed.getDate()}`
      // console.log("erport excel : " + start + end);
      await window.axios.get('/employee/RadiologistWorkloadReport' + start + end).then((r) => {
        // console.log(r);
        FormHelper.downloadFile(r.Url)
      })
      this.HIDE_LOADING()
    },
    async C7() {
      this.setDateRange()
      if (this.DateRange[0] == null && this.DateRange[1] == null) {
        this.SET_SIDE_MESSAGE({ msg: '條件請選擇完整', type: 2 })
        return
      }
      this.SHOW_LOADING()
      const params = this.DateRange.reduce((acc, cur, idx) => {
        if (idx <= 1) {
          const key = (idx === 0 ? 'start' : 'end') + 'Date'
          acc.push(`${key}=${this.$moment(cur).format('YYYY-MM-DD')}`)
        }
        return acc
      }, [])

      if (this.selectedInspectDevice.length > 0) params.push(`modalities=${this.selectedInspectDevice.join()}`) // modality
      if (this.medicationNoCode) params.push(`medicationNo=${this.medicationNoCode}`)
      params.push('top=10')
      params.push('indexPage=0')
      window.axios
        .get(`/examMedication/MedicationNoUsedDetailXls?${params.join('&')}`)
        .then((r) => {
          FormHelper.downloadFile(r.Url)
        })
        .finally(() => {
          this.HIDE_LOADING()
        })
    },
    async C8() {
      this.SHOW_LOADING()
      this.setDateRange()

      const params = this.DateRange.reduce((acc, cur, idx) => {
        if (idx <= 1) {
          const key = (idx === 0 ? 'start' : 'end') + 'Date'
          acc.push(`${key}=${this.$moment(cur).format('YYYY-MM-DD')} `)
        }
        return acc
      }, [])

      if (this.selectedCheckRoom) {
        const roomName = this.getLocationIdOptions.find(({ value }) => this.selectedCheckRoom == value)['text'] || ''
        const roomNo = this.getLocationNoOptions.find(({ text }) => text === roomName)['value'].trim()
        if (roomNo) params.push(`scheduleLocaion=${roomNo}`)
      }
      params.push('$orderby=MedicationNo')
      try {
        await window.axios.get('/examMedication/DayMonthReportXls?' + params.join('&')).then((r) => {
          FormHelper.downloadFile(r.Url)
        })
      } catch (err) {
        this.SET_SIDE_MESSAGE({ msg: '發生錯誤，請稍後再試', type: 2 })
      } finally {
        this.HIDE_LOADING()
      }
    },
    async C9() {
      this.setDateRange()
      const params = this.DateRange.map(
        (datetime, idx) =>
          `${idx === 0 ? 'start' : 'end'}Date=${new Date(datetime).getFullYear()}-${
            new Date(datetime).getMonth() + 1
          }-${new Date(datetime).getDate()}`
      )
      const roomName = this.selectedCheckRoom
        ? this.getLocationIdOptions.find(({ value }) => this.selectedCheckRoom == value)['text'] || ''
        : ''
      if (roomName) {
        const roomNo = this.getLocationNoOptions.find(({ text }) => text === roomName)['value'].trim()
        if (roomNo) params.push(`scheduleLocaion=${roomNo}`)
      }
      params.push('top=10')
      params.push('indexPage=0')
      this.SHOW_LOADING()
      // params.push("$orderby=MedicationNo");
      await window.axios.get(`/examMedication/ScheduleLocationDetailXls?${params.join('&')}`).then((r) => {
        FormHelper.downloadFile(r.Url)
      })
      this.HIDE_LOADING()
    },

    async C10(isLite = false) {
      this.SHOW_LOADING()
      this.setDateRange()

      console.log(`C10~`)

      const params = this.DateRange.map(
        (datetime, idx) =>
          `${idx === 0 ? 'start' : 'end'}Date=${new Date(datetime).getFullYear()}-${
            new Date(datetime).getMonth() + 1
          }-${new Date(datetime).getDate()}`
      ).concat(['roomId=' + this.selectedCheckRoom])

      if (isLite) params.push('lite=true')

      // const params = ["roomId=" + this.selectedCheckRoom, "date=" + this.DateRange[0]];
      await window.axios.get(`/schedule/RoomDayReport?${params.join('&')}`).then((r) => {
        FormHelper.downloadFile(r.Url)
      })
      this.HIDE_LOADING()
    },
    async C11() {
      const params = this.DateRange.reduce(
        (acc, cur, idx) => {
          if (idx <= 1) {
            const key = (idx === 0 ? 'start' : 'end') + 'Dt'
            acc.push(`${key}=${this.$moment(cur).format('YYYY-MM-DD')}`)
          }
          return acc
        },
        ['top=0', 'indexPage=0']
      )
      Object.keys(this.failImage).forEach((k) => {
        if (this.failImage[k]) {
          params.push(`${k}=${this.failImage[k]}`)
        }
      })

      await getFailImagesExcel(params.join('&')).then((r) => {
        FormHelper.downloadFile(r.Url)
      })
    },

    async report1() {
      this.SHOW_LOADING()
      this.setDateRange()
      let year = '?year=' + `${new Date(this.DateRange[0]).getFullYear()} `
      let mnth = '&month=' + `${new Date(this.DateRange[0]).getMonth() + 1} `
      // console.log("erport excel : " + year + mnth);
      await window.axios.get('/reportStatistics/MonthReportFinalDaysCountReport' + year + mnth).then((r) => {
        // console.log(r);
        FormHelper.downloadFile(r.Url)
      })
      this.HIDE_LOADING()
    },

    async report2() {
      this.SHOW_LOADING()
      this.setDateRange()
      let year = '?year=' + `${new Date(this.DateRange[0]).getFullYear()} `
      let mnth = '&month=' + `${new Date(this.DateRange[0]).getMonth() + 1} `
      await window.axios.get('/reportStatistics/GetCompleteMonthReport' + year + mnth).then((r) => {
        FormHelper.downloadFile(r.Url)
      })
      this.HIDE_LOADING()
    },
    async report3() {
      this.SHOW_LOADING()
      this.setDateRange()
      let year = '?year=' + `${new Date(this.DateRange[0]).getFullYear()} `
      let physician = '&no=' + this.selectedPhysician
      // console.log("erport excel : " + year + physician);
      await window.axios.get('/reportStatistics/GetCompleteYearReport' + year + physician).then((r) => {
        // console.log(r);
        FormHelper.downloadFile(r.Url)
      })
      this.HIDE_LOADING()
    },
    async report4() {
      this.SHOW_LOADING()
      this.setDateRange()
      const params = [
        `year = ${this.DateRange[0].substr(0, 4)} `,
        `APPROVAL_PHYSICIAN_NAME = ${this.selectedPhysician} `,
      ]
      await window.axios.get(`/reportStatistics/GetModifyAnalysisReport?${params.join('&')}`).then((r) => {
        // console.log(r);
        FormHelper.downloadFile(r.Url)
      })
      this.HIDE_LOADING()
    },
    async report5() {
      this.SHOW_LOADING()
      this.setDateRange()

      const params = this.DateRange.reduce((acc, cur, idx) => {
        if (idx <= 1) {
          const key = (idx === 0 ? 'start' : 'end') + 'Date'
          acc.push(`${key}=${this.$moment(cur).format('YYYY-MM-DD')} `)
        }
        return acc
      }, [])

      const filter = []
      
      if (this.errLevel) params.push(`hrrLevel=${this.errLevel}`)

      if (this.selectSMSStatus !== null) {
          filter.push(`SmsStatus eq ${this.selectSMSStatus}`)
        }

      if (this.selectReturnCode !== null) {
        filter.push(`ReturnCode eq ${this.selectReturnCode}`)
      }

      if(filter && filter.length){
        params.push(`$filter=${filter.join(' and ')}`)
      }

      await getHrrMessageExcel(params.join('&')).then((r) => {
        FormHelper.downloadFile(r.Url)
      })
      this.HIDE_LOADING()
    },
    async report6() {
      this.SHOW_LOADING()
      this.report6IsPending = true
      roomScheduleDaysReport().then(({ Url }) => {
        FormHelper.downloadFile(Url)
        this.report6IsPending = false
      })

      this.HIDE_LOADING()
    },
    async report7() {
      if (this.DateRange[0] == null && this.DateRange[1] == null) {
        this.SET_SIDE_MESSAGE({ msg: `請選擇'報告日期'`, type: 2 })
        return
      }

      try {
        this.SHOW_LOADING()
        this.setDateRange()

        let filters = '$filter='
        let filterSub = []

        let params = this.DateRange.reduce((acc, cur, idx) => {
          if (idx <= 1) {
            const key = idx === 0 ? 'gt' : 'lt'
            if(idx === 0){
              acc.push(`IssueTime ${key} DateTime'${this.$moment(cur).format('YYYY-MM-DDT00:00:00')}'`)
            }else if(idx === 1){
              acc.push(`IssueTime ${key} DateTime'${this.$moment(cur).format('YYYY-MM-DDT23:59:59')}'`)
            }
          }
          return acc
        }, [])

        if (this.selectedInspectDevice && this.selectedInspectDevice.length) {
          let tempArr = null

          this.selectedInspectDevice.forEach((v) => {
            filterSub.push(`substringof('${v}',Modality)`)
          })

          if (filterSub && filterSub.length) {
            tempArr = `(${filterSub.join(' or ')})`
            params.push(tempArr)
          }
        }

        if (this.realSelectedIssuePhysician) {
          params.push(`substringof('${this.realSelectedIssuePhysician}',IssuePhysicianId)`)
        }

        params = params.join(' and ')

        filters = filters + params

        // await getReportDoctorReportCountExcel(filters + '&$orderby=IssueTime').then((r) => {
        //   console.log(`getReportDoctorReportCountExcel~`)
        //   FormHelper.downloadFile(r.Url)
        // })

        await getReportDoctorReportCountExcel(filters).then((r) => {
          console.log(`getReportDoctorReportCountExcel~`)
          FormHelper.downloadFile(r.Url)
        })

      } catch (err) {
        console.log(`error: `, err)
      } finally {
        this.HIDE_LOADING()
      }
    },
    async report8() {
      if (this.DateRange[0] == null && this.DateRange[1] == null) {
        this.SET_SIDE_MESSAGE({ msg: `請選擇'報告日期'`, type: 2 })
        return
      }

      try {
        this.SHOW_LOADING()
        this.setDateRange()

        let filters = '$filter='
        let filterSub = []

        let params = this.DateRange.reduce((acc, cur, idx) => {
          if (idx <= 1) {
            const key = idx === 0 ? 'gt' : 'lt'
            if(idx === 0){
              acc.push(`IssueTime ${key} DateTime'${this.$moment(cur).format('YYYY-MM-DDT00:00:00')}'`)
            }else if(idx === 1){
              acc.push(`IssueTime ${key} DateTime'${this.$moment(cur).format('YYYY-MM-DDT23:59:59')}'`)
            }
          }
          return acc
        }, [])

        if (this.selectedInspectDevice && this.selectedInspectDevice.length) {
          let tempArr = null

          this.selectedInspectDevice.forEach((v) => {
            filterSub.push(`substringof('${v}',Modality)`)
          })

          if (filterSub && filterSub.length) {
            tempArr = `(${filterSub.join(' or ')})`
            params.push(tempArr)
          }
        }

        if (this.realSelectedIssuePhysician) {
          params.push(`substringof('${this.realSelectedIssuePhysician}',IssuePhysicianId)`)
        }

        params = params.join(' and ')

        filters = filters + params

        await getReportAgeingExcel(filters + '&$orderby=IssueTime').then((r) => {
          FormHelper.downloadFile(r.Url)
        })

      } catch (err) {
        console.log(`error: `, err)
      } finally {
        this.HIDE_LOADING()
      }
    },
    async report9() {
      this.searchRange = {}
      this.setSpecificData()

      if (this.DateRange[0] == null && this.DateRange[1] == null) {
        this.SET_SIDE_MESSAGE({ msg: `請選擇'紀錄時間'`, type: 2 })
        return
      }

      try {
        this.SHOW_LOADING()
        this.setDateRange()

        let filters = '?$filter='

        let params = this.DateRange.reduce((acc, cur, idx) => {
          if (idx <= 1) {
            const key = idx === 0 ? 'gt' : 'lt'
            if(idx === 0){
              acc.push(`CreateTime ${key} DateTime'${this.$moment(cur).format('YYYY-MM-DDT00:00:00')}'`)
            }else if(idx === 1){
              acc.push(`CreateTime ${key} DateTime'${this.$moment(cur).format('YYYY-MM-DDT23:59:59')}'`)
            }
          }
          return acc
        }, [])

        if (this.searchRange) {
          Object.keys(this.searchRange).forEach((v) => {
            if (v === 'searchPatientId' && this.searchRange[v]) {
              params.push(`substringof('${this.searchRange[v]}',PatientId)`)
            }
            if (v === 'searchAccessionNo' && this.searchRange[v]) {
              params.push(`AccessionNo eq '${this.searchRange[v]}'`)
            }
            if (v === 'searchPatientSourceTypeCode' && this.searchRange[v]) {
              params.push(`substringof('${this.searchRange[v]}',PatientSourceTypeCode)`)
            }
            if (v === 'searchSelectedRadiographer' && this.searchRange[v]) {
              params.push(`substringof('${this.searchRange[v]}',EmployeeNo)`)
            }
          })
        }

        params = params.join(' and ')

        filters = filters + params

        await getFailImageReasonReport(filters + '&$orderby=CreateTime desc').then((r) => {
          FormHelper.downloadFile(r.Url)
        })
      } catch (err) {
        console.log(`error: `, err)
      } finally {
        this.HIDE_LOADING()
      }
    },
    //判斷excel為那一個報表，run export excel api
    exportLiteExcel() {
      if (this.tableType == 'C10' && this.selectedCheckRoom) {
        this.C10(true)
      } else if (this.tableType == 'C10' && !this.selectedCheckRoom) {
        this.SET_SIDE_MESSAGE({ msg: '條件請選擇完整', type: 2 })
      }
    },
    //判斷excel為那一個報表，run export excel api
    async exportExcel() {
      await this.$emit('gExcel')
      if (this.kindState == 'RptStat') {
        if (
          ['report1', 'report2', 'report3', 'report4', 'report5', 'report6', 'report7', 'report8', 'report9'].includes(
            this.tableType
          )
        ) {
          this[this.tableType]()
        }
      } else if (this.kindState == 'CRStat') {

        if (this.tableType == 'C1') {
          this.C1()
          return
        } else if (this.tableType == 'C2') {
          this.C2()
          return
        } else if (this.tableType == 'C3') {
          this.C3()
          return
        } else if (this.tableType == 'C4') {
          this.C4()
          return
        } else if (this.tableType == 'C5') {
          this.C5()
          return
        } else if (this.tableType == 'C6') {
          this.C6()
          return
        } else if (this.tableType == 'C7') {
          this.C7()
          return
        } else if (this.tableType == 'C8') {
          this.C8()
          return
        } else if (this.tableType == 'C9') {
          this.C9()
          return
        } else if (this.tableType == 'C10' && this.selectedCheckRoom) {
          this.C10()
          return
        } else if (this.tableType == 'C11') {
          this.C11()
          return
        }

        this.SET_SIDE_MESSAGE({ msg: '條件請選擇完整', type: 2 })
      } else if (this.kindState == 'ImgStat') {
        this[this.tableType]()
      }
    },
    // --------------------------------------------------------------------------------//
    //搜尋功能，把資料傳上父層
    SearchConditions(type = null) {
      const CheckRoom = this.getLocationIdOptions
        .map(({ text, value }) => ({ text, id: value }))
        .find(({ id }) => id == this.selectedCheckRoom) || {
        id: null,
        text: '',
      }

      const CheckRooms =
        this.display.checkMultipleRoom && this.selectedMultipleCheckRoom
          ? this.getLocationIdOptions
              .map(({ text, value }) => ({ text, id: value }))
              .filter(({ id }) => this.selectedMultipleCheckRoom.some((value) => value == id)) || {
              id: null,
              text: '',
            }
          : []

      this.setDateRange()

      this.searchRange = {}
      this.setSpecificData()

      //傳上(時間區間 + 設備 + 醫師 + 檢查室) 去父層
      let DeviceStrUrl = this.selectedInspectDevice.join()

      if (type === 'search') {
        this.isSearch = true
      } else {
        this.isSearch = false
      }

      this.$emit(
        'searchBarDateRange',
        this.DateRange,
        DeviceStrUrl,
        this.selectedPhysician,
        CheckRoom,
        this.selectedDay,
        this.medicationNoCode,
        this.patientSource,
        this.caculateType,
        this.priceNo,
        this.failImage,
        CheckRooms,
        this.errLevel,
        this.searchRange,
        this.isSearch,
        this.selectSMSStatus,
        this.selectReturnCode
      )
    },
    //Enter後run this.SearchConditions()
    HKWatch(event) {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        if (event.target.id === 'inputIssuePhysician') {
          return
        }

        if (
          this.selectedYear != null ||
          this.selectedSeason != null ||
          this.selectedMonth != null ||
          this.selectedInspectDevice != []
        ) {
          this.SearchConditions()
        } else {
          return
        }
        // //粗體Method自定義
      }
    },
    async GetOptionsPatientSource() {
      let itemPack = null
      let convertedCollections = [{ value: null, text: '請選擇' }]
      let subPath = '../GeneralData/SelectNoList?groupNo=PatientSource'

      await new DataManager({
        url: configs.publicPath + subPath,
        adaptor: new WebApiAdaptor(),
        crossDomain: true,
      })
        .executeQuery(new Query())
        .then((r) => {
          itemPack = r.actual
        })

      itemPack.Items.forEach((i) => {
        let collection = { value: i.No, text: i.Name }
        let excludeArr = ['T', 'U', 'Z']
        if (!excludeArr.includes(i.No)) {
          convertedCollections.push(collection)
        }
      })
      this.optionsPatientSource = convertedCollections
    },
    async GetOptionsRadiographer() {
      try {
        const { Items } = await getRadiographerCodeName()
        if (Items && Items.length) {
          Items.sort((a, b) => {
            return Number(a.CodeName) - Number(b.CodeName)
          })

          this.optionsRadiographer = Items.map(({ CodeName, EmployeeId, EmployeeName }) => ({
            text: `${CodeName}-${EmployeeName}`,
            value: EmployeeId,
          }))

          this.optionsRadiographer.unshift({ text: '請選擇', value: null })
        }
      } catch (err) {
        console.log(`error: `, err)
      }
    },
  },
  async created() {
    window.addEventListener('keydown', this.HKWatch)
    //
    //判斷報表
    console.log(`this.kindState: `, this.kindState)
    //報表的List
    if (this.showErrLv_805 === 'false') {
      this.optionSelected = [
        {
          text: '請選擇',
          value: null,
        },
        {
          text: '異常通報紀錄',
          value: 'report5',
        },
        {
          text: '報告量統計',
          value: 'report7',
        },
        {
          text: '急診報告時效統計',
          value: 'report8',
        },
        {
          text: '不良片查詢',
          value: 'report9',
        },
      ]
    } else {
      if (this.kindState == 'RptStat') {
        this.optionSelected = ReportList
      } else if (this.kindState == 'CRStat') {
        // console.log(optionsSelectedImageType);
        this.optionSelected = optionsSelectedImageType
      } else if (this.kindState == 'ImgStat') {
        this.optionSelected = ImageList
      }
      //取得檢查室
      this.GetOptionsCheckRoom()
    }

    //放入年度 季度 月度 options
    this.optionsSelectedYear = year
    this.optionsSelectedSeason = season

    console.log(`created ~`)

    //取得設備
    await this.GetOptionsInspectDevice()

    // 取得病患來源
    await this.GetPatientSource()

    //取得醫生
    await this.GetOptsPhysicianSource()

    //Get Doctors
    console.log(`ready to get doctors ~`)
    this.GetOptionsIssuePhysicianSource()
  },
  destroyed() {
    window.removeEventListener('keydown', this.HKWatch)
  },
  watch: {
    tableType: {
      handler(val) {
        console.log(`w: tableType: `, val)
      },
      immediate: true,
      deep: true,
    },
    selectedIssuePhysician: {
      handler(val) {
        console.log(`w: selectedIssuePhysician: `, val)
      },
      immediate: true,
      deep: true,
    },
  },
}
</script>
<style lang="scss" scoped>
//tree select layout
.input-group {
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
}
//tree select 顏色 border改變
/deep/ #tree-select {
  width: calc(100% - 32px);
  height: 100%;
  border: 1px solid #ddd;
  border-radius: 0px 5px 5px 0px;
  .vue-treeselect__control {
    border: 0px solid;
    .vue-treeselect__multi-value-item.vue-treeselect__multi-value-item-new {
      background-color: #459fff;
      color: white;
      text-shadow: 0 0 black;
      .vue-treeselect__value-remove {
        color: white;
        & :hover {
          color: red;
        }
      }
    }
  }
}
</style>
<style>
/* datepicker */
#CreateTimeDataPicker .e-input-group {
  padding-top: 3px !important;
  border-style: none !important;
  background-color: transparent !important;
  height: 36px !important;
}
#CreateTimeDataPicker .e-input-group-icon {
  margin-top: -3px !important;
  border-right-width: 0 !important;
}
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
#DoctorPicker .e-input-group {
  padding-top: 3px !important;
  border-style: none !important;
  background-color: transparent !important;
  height: 36px !important;
}
#DoctorPicker .e-input-group-icon {
  margin-top: -3px !important;
  border-right-width: 0 !important;
}
</style>
<style lang="scss" scoped>
.super-select-container {
  --boxHeight: 38px !important;
  --itemHeight: 38px !important;
  --boxWidth: 100% !important;
  flex: 1;
}

/deep/ .vue-treeselect__menu-container {
  color: #333;
}
</style>
