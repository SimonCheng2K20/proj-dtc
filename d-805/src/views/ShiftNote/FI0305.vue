<template>
  <div class="pageContent zhTW fix-light" style="min-height: 829px">
    <b-card no-body class="mx-1" bg-variant="transparent">
      <b-card-header class="bg-primary text-white cardHeader">
        <b-row no-gutters>
          <b-col cols="6" class="float-left text-left">審單及交班記錄登打作業</b-col>
        </b-row>
      </b-card-header>
      <b-card-text class="text-left py-1 pr-0">
        <b-row no-gutters>
          <b-col sm="2" class="px-1">
            <b-input-group prepend="申請單號">
              <b-input v-model="checkQuery.AccessionNo" />
            </b-input-group>
          </b-col>
          <b-col sm="2" class="px-1">
            <b-input-group prepend="病歷號">
              <b-input ref="AccessionNo" v-model="checkQuery.PatientId" />
            </b-input-group>
          </b-col>
          <b-col sm="2" class="px-1">
            <b-input-group prepend="身分證號">
              <b-input v-model="checkQuery.OtherPatientId" />
            </b-input-group>
          </b-col>
          <b-col sm="3" class="px-1">
            <b-input-group prepend="開單起訖" style="width: 100%">
              <div id="OpenDataPicker" class="form-control" style="padding: 0px 0px">
                <ejs-daterangepicker :strictMode="true" v-model="OpenDateRange"></ejs-daterangepicker>
              </div>
            </b-input-group>
          </b-col>
          <b-col sm="3" class="px-1">
            <b-input-group prepend="檢查起訖" style="width: 100%">
              <div id="CheckDataPicker" class="form-control" style="padding: 0px 0px">
                <ejs-daterangepicker :strictMode="true" v-model="CheckDateRange"></ejs-daterangepicker>
              </div>
            </b-input-group>
          </b-col>
        </b-row>
        <b-row no-gutters class="mt-1">
          <b-col sm="2" class="px-1">
            <b-input-group prepend="檢查項目">
              <v-super-select
                noneFoundText="無此筆資料"
                placeholder="請選擇"
                v-model="checkQuery.ProcedureCode"
                :items="optionsCheckItem"
                style="z-index: 1"
                class="bg-white"
              />
            </b-input-group>
          </b-col>
          <b-col sm="2" class="px-1">
            <b-input-group prepend="病患來源">
              <b-select v-model="checkQuery.PatientSourceTypeCode" :options="optionsPatientSource" />
            </b-input-group>
          </b-col>
          <b-col sm="2" class="px-1">
            <b-input-group prepend="檢查室">
              <b-select v-model="checkQuery.Location" :options="optionsLocationSource" />
            </b-input-group>
          </b-col>
          <b-col sm="2" class="px-1">
            <b-input-group prepend="報到狀態">
              <b-select v-model="checkQuery.status" :options="CheckinStatusSource" />
            </b-input-group>
          </b-col>
          <b-col sm="2" class="px-1">
            <b-input-group prepend="急作">
              <b-form-radio-group
                name="eId"
                class="pl-2 bg-white"
                style="border: 1px solid #ced4da; display: flex; align-items: center; justify-content: center; border-radius: 0px 5px 5px 0px"
                v-model="checkQuery.EmgFlag"
              >
                <b-form-radio value="Y">是</b-form-radio>
                <b-form-radio value="N">否</b-form-radio>
              </b-form-radio-group>
            </b-input-group>
          </b-col>
        </b-row>
        <b-row no-gutters class="mt-1 px-1">
          <b-col cols="2" class="pr-2">
            <b-input-group prepend="審單記錄">
              <b-select v-model="IsPreAudit" :options="IsPreAuditOptions" />
            </b-input-group>
          </b-col>
          <b-col class="text-right">
            <b-button class="mr-1" variant="info" @click="TomorrowExam"> <i class="far fa-calendar-alt mr-1"></i> 明日檢查 </b-button>
            <b-button class="mr-1" variant="success" @click="Clear"> <font-awesome-icon icon="eraser" class="mr-1" />清除條件 </b-button>
            <b-button class="mr-0" variant="primary" @click="getQueryBtn"> <font-awesome-icon icon="search" class="mr-1" />進行查詢 </b-button>
          </b-col>
        </b-row>
      </b-card-text>
    </b-card>

    <b-container fluid class="mt-1 px-1">
      <b-row no-gutters>
        <b-col>
          <div id="block4QueryResult" class="mr-1 rounded" style="border: 1px solid #ced4da; min-height: 690px">
            <!-- 交班記錄 -->
            <ShiftNoteEdit :show-box="shiftNoteShoBox" :data="tableExamData" @hiddenBox="hiddenBox" v-on:callLab="callView" />

            <!-- 審查記錄 -->
            <AuditNoteEdit :showBox="AuditNoteShowBox" :data="tableExamData" @hiddenBox="hiddenBox" v-on:callLab="callView"></AuditNoteEdit>
            <twp
              ref="twp1"
              :FieldConfig="tableConfig4QueryResult"
              :DataFetch="getFliterData"
              :isBackEndPagination="true"
              :OpButton1Func="ShifNote"
              :OpButton2Func="AuditNote"
              OpButton1Text="交班記錄"
              OpButton2Text="審單記錄"
            ></twp>
          </div>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import SearchBar from '@/views/ShiftNote/SearchBar.vue'

import Vue from 'vue'
import { mapGetters, mapMutations } from 'vuex'
import { Dialog, AppBar } from 'muse-ui'
import VSuperSelect from 'v-super-select'

// import Swal from "sweetalert2";
// import bookingView from "@/components/Booking/Index";

// 載入模組:KeyPressIdentifier
// import KeyPressIdentifier from "@/assets/KeyPressIdentifier";
import { DataManager, WebApiAdaptor, Query } from '@syncfusion/ej2-data'
import * as configs from '@/config'
import { DateRangePickerPlugin } from '@syncfusion/ej2-vue-calendars'
import { tableConfig4QueryResult, IsPreAudit } from '@/views/ShiftNote/TableFields.js'

import twp from '@/components/TWPv5_1'
import ShiftNoteEdit from '@/views/ShiftNote/ShiftNoteEdit.vue'
import AuditNoteEdit from '@/views/ShiftNote/AuditNoteEdit.vue'
import { getReportContents } from '@/assets/service/dataManager.js'

//for booking (must import and css have some trobule...)
// import "muse-ui/dist/muse-ui.css";

Vue.use(AppBar)
Vue.use(Dialog)
Vue.use(DateRangePickerPlugin)
const d = new Date()

export default {
  name: 'home',
  components: { twp, VSuperSelect, ShiftNoteEdit, AuditNoteEdit, SearchBar },
  data() {
    return {
      callLab: 'https://onepage.wanfang.gov.tw/#@',
      //控制shiftNote 編輯版面show
      shiftNoteShoBox: true,
      //控制auditNote 編輯版面show
      AuditNoteShowBox: true,
      //props 此資料到交班記錄&審單記錄
      tableExamData: {},
      //
      preStatus: '11,12',
      preSchedulgurl: [`${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`, `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`],

      shiftNoteActive: false,
      auditActive: false,
      selectCheckItems: [],
      dialogOpened: false,
      patientInfo: {
        orderNo: '',
        name: '',
        id: '',
        gender: '',
        hrNum: '',
        birthDay: null,
      },
      checkItemNos: '',
      tableConfig4QueryResult: [],
      //審單options
      IsPreAuditOptions: [],
      IsPreAudit: null,
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
      //User點擊按鈕紀錄(用以判斷API的條件)
      BtnNo: 0,
      //for query
      checkQuery: {
        //申請單號
        AccessionNo: '',
        //病歷號
        PatientId: '',
        //身分證字號
        OtherPatientId: '',
        //開單日期From
        StartDT: '',
        //開單日期To
        EndDT: '',
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
        ENCOUNTER_NO: '',
        //檢查室
        Location: null,
        PatientStatus: null,
      },
      //開單起訖日
      OpenDateRange: [`${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`, ''],
      //檢查起訖日
      CheckDateRange: ['', ''],
      //選擇檢查室
      choice_room: [],
      //Modal上的檢查室資料
      room_list: [],
      //病患檢查項目
      PatientcheckItem_List: [],
      //病患今日檢查項目類型:0.無檢查1.今日有檢查3.有檢查不再今日
      checkTypeList: 'A',
      //HostoryModel
      HistoryModel: {
        //預計檢查時間
        ScheduleTime: '',
        //櫃台報到時間
        CounterRegister: '',
        //開始檢查時間
        ProcedureStart: '',
        //檢查完畢時間
        ProcedureCompleted: '',
        //取消檢查時間及原因
        CancelDescription: '',
        //取消檢查時間
        CancelTime: '',
      },
    }
  },
  computed: {
    ...mapGetters(['getThemeColors']),
  },
  methods: {
    ...mapMutations(['SET_SIDE_MESSAGE', 'SHOW_LOADING', 'HIDE_LOADING']),
    async callView(patientId) {
      const url = this.callLab + patientId
      let ok = true
      try {
        if (!patientId) throw new Error('NO PATIENT ID')
        this.windowObj = window.open()
        this.SET_SIDE_MESSAGE({ msg: 'CALL LAB 送出 ' })
        this.windowObj.location.href = url
        window.callLabUrl = url
      } catch (e) {
        ok = false
      } finally {
        if (ok === false) this.SET_SIDE_MESSAGE({ msg: 'CALL LAB 通知失敗 @ ' + url, type: 2 })
      }
    },
    //call Fn 不在template
    clearCondition() {
      //清除輸入的條件
      //檢查單號
      this.checkQuery.AccessionNo = ''
      // 審單記錄
      this.IsPreAudit = null

      //病歷編號
      this.checkQuery.PatientId = ''

      //身分證字號
      this.checkQuery.OtherPatientId = ''

      //開單起訖日期From
      this.OpenDateRange = ['', '']

      //檢查起訖日期From
      this.CheckDateRange = ['', '']

      //檢查項目
      this.checkQuery.ProcedureCode = null

      //病患來源
      this.checkQuery.PatientSourceTypeCode = null

      //檢查室
      this.checkQuery.Location = null

      //急作
      this.checkQuery.EmgFlag = null

      //是否報到
      this.checkQuery.status = null

      //
      setTimeout(() => {
        const q = '.super-select-input input[type=text]'
        document.querySelector(q).value = ''
        document.querySelector(q).value = ''
      }, 300)
      //
    },
    //給API CALL的
    //pageIndex,pageSize
    //報到作業
    async getFliterData(indx, pageIndex, perpage) {
      // this.ObjApp.WaitingShow();
      this.SHOW_LOADING()
      if (!pageIndex) {
        pageIndex = 0
        perpage = 10
      }

      //串DataManager 打API出去 回傳資料再塞回畫面
      //開單時間的URL
      let openurl = ''

      if (this.OpenDateRange != null) {
        if (this.OpenDateRange[0] != '' && this.OpenDateRange.length == 2) {
          openurl = '&orderDateStart=' + this.OpenDateRange[0].toJSON() + '&orderDateEnd=' + this.OpenDateRange[1].toJSON()
        }
      }
      //檢查時間的URL   判斷兩個
      let schedulgurl = ''
      if (this.CheckDateRange != null && this.CheckDateRange.length == 2 && this.CheckDateRange[0] == '') {
        //預設時間
        let CRDateRange = this.preSchedulgurl

        if (this.CheckDateRange != null) {
          if (CRDateRange[0] != '' && CRDateRange.length == 2) {
            schedulgurl = '&scheduleTimeStart=' + CRDateRange[0] + '&scheduleTimeEnd=' + CRDateRange[1]
          }
        }
      } else {
        let CRDateRange = this.CheckDateRange
        if (this.CheckDateRange != null) {
          if (CRDateRange[0] != '' && CRDateRange.length == 2) {
            schedulgurl = '&scheduleTimeStart=' + CRDateRange[0].toJSON() + '&scheduleTimeEnd=' + CRDateRange[1].toJSON()
          }
        }
      }
      if (!schedulgurl.includes('scheduleTimeStart')) {
        // 沒找到日期
        this.CheckDateRange = ['Start', 'End'].reduce((acc, cur) => acc.concat(this.$moment()[cur.toLowerCase() + 'Of']('week').format('YYYY-MM-DD')), [])
        schedulgurl = ['Start', 'End']
          .reduce((acc, cur) => acc.concat(`scheduleTime${cur}=${this.$moment()[cur.toLowerCase() + 'Of']('week').format('YYYY-MM-DD')}`), [])
          .join('&')
      }
      //若按下今日排程 走此條件
      let Todayurl = ''
      if (this.BtnNo === 2) {
        Todayurl = '&scheduleTimeStart=' + new Date().toJSON() + '&scheduleTimeEnd=' + new Date().toJSON()
      }
      // thomas edit
      // 醫師交辦紀錄狀態
      let status = this.preStatus
      // console.log("url報報狀態：" + status);
      // console.log("url開單時間區間：" + openurl);
      // console.log("url檢查時間區間：" + schedulgurl);
      // console.log("url今天排程：" + Todayurl);
      try {
        const { actual } = await getReportContents(`?status=${status}${openurl}${schedulgurl}${Todayurl}`, this.QueryMethod().page(pageIndex, perpage))
        actual.Items.forEach((item) => {
          //轉換資料顯示
          item['EmgFlagName'] = item.EmgFlag === 'Y' ? '急作' : '一般'

          //先轉成YYYY/MM/DD格式 -- 沒有檢查時間設定 變成string
          item.ScheduleTime = item.ScheduleTime == null ? '時間未排' : this.$moment(item.ScheduleTime).format('YYYY/MM/DD')

          item.OrderDate = this.$moment(item.OrderDate).format('YYYY/MM/DD')

          //如為當天之病人排檢的病人(當天掛號當天檢查)，要有顏色提示。
          // if (item.ScheduleTime === this.$moment(new Date()).format("YYYY/MM/DD") && (item.Status == "11" || item.Status == "12")) {
          // x._rowVariant = "danger";
          // }
          //show出審單記錄時改成wording
          if (item.IsPreAudit) {
            item._cellVariants = { IsPreAudit: 'success' }
            item.IsPreAudit = '審單完成'
          } else {
            item._cellVariants = { IsPreAudit: 'danger' }
            item.IsPreAudit = '尚未審單'
          }
          //加入交記錄判斷
          if (item.ShiftNote == null) {
            item._cellVariants.isShiftNote = 'danger'
            item.isShiftNote = '無交班記錄'
          } else {
            item.isShiftNote = '已有記錄'
            item._cellVariants.isShiftNote = 'success'
          }
        })
        if (actual.Items.length === 0) this.SET_SIDE_MESSAGE({ msg: '無資料' })
        return actual
      } catch (err) {
        this.SET_SIDE_MESSAGE({ msg: '發生錯誤', type: 2 })
      } finally {
        this.HIDE_LOADING()
      }
    },
    //------------------------------------------------------------------------------------------------------------------
    //新增藥品數量
    addCount(x) {
      x.Quantity = x.Quantity + 1
    },
    //減少藥品數量
    cutCount(x) {
      if (x.Quantity <= 0) {
        return
      }
      x.Quantity = x.Quantity - 1
    },
    //呼叫新增藥品
    AddMedication() {
      //新增一組欄位登打後 按下儲存寫入
      this.$refs['medicineMaintain'].show()
    },
    //編輯藥品
    EditMedication(x) {
      //鎖定某些欄位後打開
      this.$refs['medicineMaintain'].show()
    },

    // shiftNoteShoBoxFn() {
    //   console.log(this.shiftNoteActive);
    //   if (this.shiftNoteActive) {
    //     return false;
    //   } else {
    //     return true;
    //   }
    // },
    getTableData(data) {
      this.tableExamData = data
    },
    //交班記錄 -- 審核記錄 一起關起來
    hiddenBox() {
      this.shiftNoteShoBox = true
      this.AuditNoteShowBox = true
      this.getQueryBtn()
    },
    //交班記錄
    ShifNote(x) {
      //打開textarea
      // console.log(x);
      this.AuditNoteShowBox = true
      this.shiftNoteShoBox = false
      this.getTableData(x)
    },
    //審核記錄
    AuditNote(x) {
      //打開textarea
      this.shiftNoteShoBox = true
      this.AuditNoteShowBox = false
      this.getTableData(x)
    },

    HKWatch(event) {
      if (this.shiftNoteShoBox && this.AuditNoteShowBox) {
        if (event.key === 'Enter' || event.code === 'NumpadEnter') {
          this.getQueryBtn()
        }
      }
    },

    TomorrowExam() {
      //清楚searchBar condition
      this.clearCondition()
      //明天的時間
      let temp_tow = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate() + 1}`
      //設定預設條件 明天檢查
      this.preStatus = ''
      this.preSchedulgurl = [temp_tow, temp_tow]
      //重新跑過api
      this.getFliterData()
      //重新render出table
      this.$refs['twp1'].OnForceRefresh()
    },
    Clear() {
      //告訴user預計條件
      // this.ObjApp.TimingMessage("報告到狀態為( 排定檢查 & 排定檢查)");
      // this.ObjApp.TimingMessage("檢查起訖時間為(今天 -- 明天)");
      //清除searchBar時間
      this.clearCondition()
      //FI0305預計搜尋條件[ consdition: A(11.尚未排檢 12.排定檢查) , B(今天日期,明天日期) ] -- new Date(下列為測試時間)
      //明天的時間
      let temp_tod = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`
      let temp_tow = `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate() + 1}`
      //
      this.preStatus = '11,12'
      this.preSchedulgurl = [temp_tod, temp_tow]
      //關掉編輯區域
      this.shiftNoteShoBox = true
      this.AuditNoteShowBox = true
      //重新跑過api
      this.getFliterData()
      //重新render出table
      this.$refs['twp1'].OnForceRefresh()
    },

    //按鈕查詢-多功能Method 由按鈕決定今天要帶入甚麼參數給TWP3查詢
    QueryMethod() {
      //預設一進來時 帶入左方畫面資料的條件:已報到及未報到
      if (this.BtnNo === 0) {
        return new Query()
      }
      //按下查詢按鈕(進行查詢)):1
      else if (this.BtnNo === 1) {
        return this.getQuery()
      }
    },

    getQuery: function () {
      let query = new Query()
      //判斷檢查單號
      if (this.checkQuery.AccessionNo != '') query = query.where('AccessionNo', 'contains', this.checkQuery.AccessionNo.trim(), true)
      //判斷病例編號
      if (this.checkQuery.PatientId != '') query = query.where('PatientId', 'contains', this.checkQuery.PatientId)
      //判斷身分證字號
      if (this.checkQuery.OtherPatientId != '' || this.checkQuery.OtherPatientId != 'Error:沒有插卡！')
        query = query.where('OtherPatientId', 'contains', this.checkQuery.OtherPatientId.trim(), true)

      //判斷檢查項目
      if (this.checkQuery.ProcedureCode) {
        if (this.checkQuery.ProcedureCode != '') {
          query = query.where('ProcedureCode', 'equal', this.checkQuery.ProcedureCode.value)
        }
      }
      //判斷病患來源
      if (this.checkQuery.PatientSourceTypeCode) {
        if (this.checkQuery.PatientSourceTypeCode != '') {
          query = query.where('PatientSourceTypeCode', 'equal', this.checkQuery.PatientSourceTypeCode)
        }
      }
      //判斷檢查室
      if (this.checkQuery.Location) {
        console.log(this.checkQuery.Location)
        if (this.checkQuery.Location != '') {
          query = query.where('ScheduleLocation', 'equal', this.checkQuery.Location)
        }
      }
      //是否急作
      if (this.$Exists(this.checkQuery.EmgFlag)) {
        if (this.checkQuery.EmgFlag != null) {
          query = query.where('EmgFlag', 'equal', this.checkQuery.EmgFlag)
        }
      }
      //審單記錄
      // console.log(this.IsPreAudit);
      if (this.IsPreAudit != null) {
        query = query.where('IsPreAudit', 'equal', this.IsPreAudit == '審單完成' ? true : false)
      }
      //報到狀態
      // console.log(this.checkQuery.status);
      if (this.$Exists(this.checkQuery.status)) {
        if (this.checkQuery.status != null) {
          query = query.where('Status', 'equal', this.checkQuery.status)
        }
      }
      return query
    },

    async getQueryBtn() {
      //放入設定的報到狀態給api抓資料
      this.preStatus = this.CheckinStatusSource.filter(({ value }) => value)
        .map(({ value }) => value)
        .join(',')
      this.preSchedulgurl = ['', '']
      //將按鈕狀態改為有條件查詢(輸入的資料查詢)
      // this.SHOW_LOADING();
      this.BtnNo = 1
      // console.log(this.$refs["twp1"]);
      this.$refs['twp1'].OnCancelAllSelects()
      this.$refs['twp1'].OnForceRefresh()
      // this.HIDE_LOADING();
    },

    //取得檢查室相關資料
    getRoomAPI() {
      let i = 0
      this.choice_room.forEach(async (x) => {
        let ProcedureCode = x.ProcedureCode
        let itemPack = null
        let convertedCollections = [{ value: null, text: '請選擇' }]
        //
        let subPath = '../checkItem/NonScheduleRoom' + '?no=' + ProcedureCode
        //
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
        x.rommselect = ''
        x.roomList = convertedCollections
        this.$set(this.choice_room, i, x)
        ++i
      })
      console.log(this.choice_room)
    },
    //取得病患來源列表
    async GetOptionsPatientSource() {
      // console.log(this.$logs());
      //
      let itemPack = null
      let convertedCollections = [{ value: null, text: '請選擇' }]
      //
      let subPath = '../GeneralData/SelectNoList?groupNo=PatientSource'
      //
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
      this.optionsPatientSource = convertedCollections
    },
    //檢查室清單
    async GetLocationSource() {
      // console.log(this.$logs());
      //
      let itemPack = null
      let convertedCollections = [{ value: null, text: '請選擇' }]
      //
      let subPath = '../Room/SelectNoList'
      //
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
      this.optionsLocationSource = convertedCollections
    },
    //取得報到狀態的清單
    async GetStatusSource() {
      // console.log(this.$logs());
      //
      let itemPack = null
      let convertedCollections = [{ value: null, text: '請選擇' }]
      //
      let subPath = '../GeneralData/SelectNoList' + '?groupNo=ExamState'
      //
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
      //報到櫃台的Source

      let _tempList = []
      convertedCollections.forEach((x) => {
        // console.log(x);
        if (x.value == '63' || x.value == '71' || x.value == '65' || x.value == '61') {
          // console.log("正式報告 | 報告撰寫 | 等待審核 | 退件重寫  不放入");
        } else {
          _tempList.push(x)
        }
        // console.log(_tempList);
      })

      this.CheckinStatusSource = this.$DeepCopy(_tempList)
      //綜合查詢的Source
      this.TotalStatusSource = this.$DeepCopy(convertedCollections)
    },
    // initWebSocket() {
    //   let _this = this;
    //   if (this.checkQuery.OtherPatientId != "") return;
    //   let connection;
    //   connection = new WebSocket("ws://localhost:10008/Read");
    //   connection.onopen = function() {
    //     connection.send("checkNhiCard");
    //   };
    //   connection.onerror = function(e) {
    //     _this.checkQuery.OtherPatientId = "";
    //   };
    //   connection.onmessage = function(e) {
    //     if (e.data.indexOf("Error:") < 0) {
    //       let pic = e.data.substr(32, 10);
    //       //因websocket屬於Jquery寫法，導致裡面無法使用VUE的data 故先建立THIS的變數 再去更改即可解決
    //       _this.checkQuery.OtherPatientId = pic;
    //       _this.getQueryBtn();
    //     } else {
    //       _this.checkQuery.OtherPatientId = "";
    //       if (
    //         _this.checkQuery.OtherPatientId !== e.data &&
    //         e.data === "Error:此晶片卡非健保卡！"
    //       )
    //         _this.checkQuery.OtherPatientId = e.data;
    //     }
    //   };
    // }
  },
  created() {
    //取得打API時 需 Hold住畫面的Mehtod
    let methodName = 'created'
    // console.log(this.$logs(null, methodName));
    // console.log(this.preSchedulgurl);

    // 取得 App.vue 參照
    let obj = this.$GetApp(this)
    if (obj) {
      // console.log(obj);
      this.ObjApp = obj[0]
      this.VueNestLevel = obj[1]
    } else {
      // console.log(this.$logs("Fail to get App.vue ref.", methodName));
    }

    //得到tableFields
    this.tableConfig4QueryResult = tableConfig4QueryResult
    //審單記錄options
    this.IsPreAuditOptions = IsPreAudit
    //得到檢查項目
    if (localStorage['dtcOptionsCheckItem']) {
      this.optionsCheckItem = JSON.parse(localStorage['dtcOptionsCheckItem'])
    }

    // 宣告監聽器:攔截 KeyPress
    window.addEventListener('keydown', this.HKWatch)
    //
    //病患來源下拉選單
    this.GetOptionsPatientSource()
    //檢查室下拉選單
    this.GetLocationSource()
    //報到狀態下拉選單
    this.GetStatusSource()
    //病患狀態下拉選單
    //focus到病歷號上
    setTimeout(() => {
      this.$nextTick(() => this.$refs['AccessionNo'].focus())
    }, 1000)
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
  destroyed() {
    // console.log(`${this.$logs()}`);
    // 解除監聽器:攔截 KeyPress
    window.removeEventListener('keydown', this.HKWatch)
    // this.websock.close(); //离开路由之后断开websocket连接
  },
  mounted() {
    // console.log(this.$logs());
  },
}
</script>

<style>
.fix-light .super-select-container {
  --boxHeight: 38px !important;
  --itemHeight: 38px !important;
  --boxWidth: 100% !important;
  flex: 1;
  border-radius: 5px;
}
</style>

<style scoped>
.cardHeader {
  padding: 2px 1.25rem;
}
</style>
<style lang="scss" scope>
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

.textarea-grid {
  display: grid;
  // grid-template-columns: repeat(2, 1fr);
  grid-gap: 10px;
  .read-only {
    border-radius: 5px;
  }
}
.super-select-input {
  margin: 0px;
  border-radius: 0px 5px 5px 0px;
}
</style>
