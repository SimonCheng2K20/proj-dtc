<template>
  <div id="FI0304" class="pageContent pb-1">
    <b-card no-body class="mx-1 border" bg-variant="transparent">
      <b-card-header class="bg-warning text-dark cardHeader">
        <b-row no-gutters>
          <b-col cols="4" class="float-left text-left font-weight-bold"
            >報告待打清單 用戶: [{{ $store.state.Profile4User.staffName }}] {{ $store.state.Profile4User.employeeName }}
          </b-col>
          <b-col v-if="isShowHeaderCounter" cols="4" class="text-center">
            尚未撰打 {{ tabList[0].reportStatus.unEditing }}筆, 撰寫中 {{ tabList[0].reportStatus.editing }}筆
          </b-col>
        </b-row>
      </b-card-header>
      <b-card-text class="text-left p-1" style="margin-bottom: 0;">
        <div class="search-section d-grid grid-col-5" style="grid-gap: 2px">

          <b-input-group prepend="病歷號" id="patientIdPre">
            <b-input v-model="theProcedure.patientId" ref="PatientId" />
            <div class="clearInputValue" v-if="theProcedure.patientId" @click="theProcedure.patientId = null">
              <b-icon icon="x" />
            </div>
          </b-input-group>

          <b-input-group prepend="儀器" id="modalityPre">
            <b-select v-model="selectedInspectDevice" :options="optionsInspectDevice" />
            <div class="clearInputValue" v-if="selectedInspectDevice" @click="selectedInspectDevice = null">
              <b-icon icon="x" />
            </div>
          </b-input-group>

          <b-input-group prepend="檢查時間">
            <div id="CheckDataPickerR1" class="form-control" style="padding: 0;">
              <div class="dateSelectDiv abs">
                <b-select v-model="produredCompletedDateRangeSelect" :options="optionsDateSelect1" @change="(e)=>{optionsDateChangeE(e, 'produredCompletedDateRange')}" style="border: none; border-radius: none; height: 100%;" />
              </div>
              <ejs-daterangepicker
                ref="produredCompletedDateRangeRef"
                @close="(e)=>{dateRangeCloseE(e, 'produredCompletedDateRange')}"
                @change="(e)=>{dateRangeChangeE(e, 'produredCompletedDateRange')}"
                v-model="produredCompletedDateRange"
              >
              </ejs-daterangepicker>
            </div>
          </b-input-group>

          <b-input-group prepend="報告時間">
            <div id="CheckDataPickerR" class="form-control" style="padding: 0;">
              <div class="dateSelectDiv abs">
                <b-select v-model="DateRangeSelect" :options="optionsDateSelect2" @change="(e)=>{optionsDateChangeE(e, 'DateRange')}" style="border: none; border-radius: none; height: 100%;" />
              </div>
              <ejs-daterangepicker
                ref="DateRangeRef"
                @close="(e)=>{dateRangeCloseE(e, 'DateRange')}"
                @change="(e)=>{dateRangeChangeE(e, 'DateRange')}"
                v-model="DateRange"
              >
              </ejs-daterangepicker>
            </div>
          </b-input-group>

          <b-input-group v-if="versionNo === '805'" prepend="申請單號">
            <b-input v-model="theProcedure.OrderNo" ref="inputAccessionNo" />
            <div class="clearInputValue" v-if="theProcedure.OrderNo" @click="theProcedure.OrderNo = null">
              <b-icon icon="x" />
            </div>
          </b-input-group>
          <b-input-group v-else prepend="申請單號">
            <b-input v-model="theProcedure.AccessionNo" ref="inputAccessionNo" />
          </b-input-group>

          <!-- <b-input-group prepend="檢查項目" class="bg-white" v-if="versionNo !== '805'">
            <v-super-select
              v-if="!isClearing"
              ref="vsuperselect"
              placeholder="請選擇"
              v-model="selectedCheckItemObj"
              :items="procedureCodeItems"
              :noneFoundText="'無此筆資料'"
              style="z-index: 99"
              @change="ChangeSelectedCheckItemObj"
            ></v-super-select>
            <div v-else style="padding: 7px 0 0 17px">請選擇</div>
          </b-input-group> -->

          <!-- <b-input-group prepend="報告醫師" v-if="versionNo === '805'">
            <b-select
              v-model="theProcedure.IssuePhysicianId"
              :options="optionsDxreportPhysician"
              @change="ChangeSearchConditions"
              :disabled="disabledOptionsPhysician"
            />
          </b-input-group>

          <b-input-group prepend="報告醫師" v-else>
            <b-select
              v-model="theProcedure.DxreportPhysicianId"
              :options="optionsDxreportPhysician"
              @change="ChangeSearchConditions"
              :disabled="disabledOptionsPhysician"
            />
          </b-input-group> -->

          <!-- <b-input-group prepend="報告狀態">
            <b-select v-model="selectedStatus" :options="optionsStatus" @change="ChangeSelectedStatusSearchConditions" />
          </b-input-group> -->

          <!-- <b-input-group prepend="報告開始">
            <ejs-datepicker
              floatLabelType="Always"
              :placeholder="' '"
              v-model="DateRange[0]"
              :step="60"
              :format="timeFormat"
              :allowEdit="true"
              :showClearButton="true"
              :max="DateRange[1]"
              @cleared="DateRange[1] = null"
            />
          </b-input-group>
          <b-input-group prepend="報告結束">
            <ejs-datepicker
              floatLabelType="Always"
              :placeholder="' '"
              v-model="DateRange[1]"
              :step="60"
              :format="timeFormat"
              :allowEdit="true"
              :showClearButton="true"
              :min="DateRange[0]"
              :enabled="DateRange[0] != null"
            />
          </b-input-group> -->
          <!-- <b-input-group prepend="檢查開始">
            <ejs-datepicker
              floatLabelType="Always"
              :placeholder="' '"
              v-model="produredCompletedDateRange[0]"
              :step="60"
              :format="timeFormat"
              :allowEdit="false"
              :showClearButton="true"
              :max="produredCompletedDateRange[1]"
              @cleared="produredCompletedDateRange[1] = null"
            />
          </b-input-group>
          <b-input-group prepend="檢查結束">
            <ejs-datepicker
              floatLabelType="Always"
              :placeholder="' '"
              v-model="produredCompletedDateRange[1]"
              :step="60"
              :format="timeFormat"
              :allowEdit="false"
              :showClearButton="true"
              :min="produredCompletedDateRange[0]"
              :enabled="produredCompletedDateRange[0] != null"
            />
          </b-input-group> -->
        </div>
      </b-card-text>
      <b-card-text style="margin-bottom: .5rem;">
        <div style="display: flex; justify-content: flex-end; width: 100%; padding: 5px 0;">
          <div v-if="isShowHeaderCounter" class="d-flex align-items-center grid-span-2">
            符合急診1.2倍加成筆數: X光 {{ tabList[0].emgOnTime.cr }} 筆 CT/MR {{ tabList[0].emgOnTime.ctmr }}筆
          </div>
          <div class="text-right" style="grid-column: 4 / span 2; padding: 4px 0;">
            <b-button class="ml-1" variant="primary" @click="SearchConditions"> <font-awesome-icon icon="search" />進行查詢 </b-button>
            <b-button class="ml-1" variant="success" @click="ClearConditions('clear')"> <font-awesome-icon icon="eraser" />清除條件 </b-button>
            <b-button v-if="isNeedPdfDownload" class="ml-1" variant="primary" @click="downloadPDF"> <font-awesome-icon icon="search" />下載pdf </b-button>
            <b-button class="ml-1" variant="secondary" @click="settingTableFields"> <font-awesome-icon icon="table" />設定表格項目</b-button>
          </div>
        </div>
      </b-card-text>
    </b-card>
    <div class="settingWrapper">
      <div class="optionWrap">
        <div class="a-label">
          <font-awesome-icon icon="check" /> 報告狀態
        </div>
        <div class="a-input">
          <b-input-group size="sm" style="font-size: 12px; padding-right: 18px;">
            <b-select v-model="selectedStatus" :options="optionsStatus" @change="ChangeSelectedStatusSearchConditions" />            
          </b-input-group>
        </div>
      </div>
      <div class="optionWrap">
        <div class="a-label">
          <font-awesome-icon icon="images" /> 呼叫PACS
        </div>
        <div class="a-input">
          <b-form-group>
            <b-form-radio-group
              id="isPacAuto"
              v-model="isPacAuto"
              :options="isPacAutoOptions"
              name="isPacAuto"
            >
            </b-form-radio-group>
          </b-form-group>
        </div>
      </div>
      <div class="sw-line"></div>
      <div class="optionWrap">
        <div class="a-label">
          <font-awesome-icon icon="save" /> 自動暫存
        </div>
        <div class="a-input">
          <b-form-group>
            <b-form-radio-group
              id="isSaveAuto"
              v-model="isSaveAuto"
              :options="isSaveAutoOptions"
              name="isSaveAuto"
            >
            </b-form-radio-group>
          </b-form-group>
        </div>
      </div>
      <div class="sw-line"></div>
      <div class="optionWrap">
        <div class="a-label">
          <font-awesome-icon icon="copy" /> 自動臨床註記
        </div>
        <div class="a-input">
          <b-form-group>
            <b-form-radio-group
              id="isObjAuto"
              v-model="isObjAuto"
              :options="isObjAutoOptions"
              name="isObjAuto"
            >
            </b-form-radio-group>
          </b-form-group>
        </div>
      </div>
      <div class="sw-line"></div>
      <div class="optionWrap">
        <div class="a-label">
          <font-awesome-icon icon="language" /> 快速儀器片語
        </div>
        <div class="a-input">
          <b-form-group>
            <b-form-radio-group
              id="isMphrase"
              v-model="isMphrase"
              :options="isMphraseOptions"
              name="isMphrase"
            >
            </b-form-radio-group>
          </b-form-group>
        </div>
      </div>

    </div>
    <b-card no-body id="cardTabs" class="fi0304 m-1" bg-variant="transparent">
      <div class="div-grid grid-col-6">
        <!-- <b-button
          v-for="(tab, index) in tabs.filter(({ id }) => id)"
          :disabled="isFetchData"
          :key="tab.label + '_' + tab.count"
          :variant="index === tabIndex ? tab.theme : 'outline-secondary'"
          :class="{
            'grid-column-span-6': tab.id === 'FI0304_hr' && index === 4,
          }"
          v-text="tabTitle(tab)"
          style="color: var(--themeTextColor)"
          @click.stop="onTabClick(index)"
        /> -->
        <b-button
          v-for="(tab, index) in tabs.filter(({ id }) => id)"
          :disabled="isFetchData"
          :key="tab.label + '_' + tab.count"
          :variant="index === tabIndex ? tab.theme : 'outline-secondary'"
          :class="{
            'grid-column-span-5': tab.id === 'FI0304_hr' && index === 4,
          }"
          v-text="tabTitle(tab)"
          @click.stop="onTabClick(index)"
        />
      </div>
      <twp
        ref="twp3"
        v-if="tabList.length > 0"
        :key="tabs[tabIndex].id"
        :TableId="tabs[tabIndex].id"
        :DataFetch="updateTableSource"
        :initToPage="tabList[tabIndex].page"
        :onPageChange="getTabDataSource"
        :heightForScroll="twpHeight"
        CheckBox1Head
        :FieldConfig="FI0304TableFieldFilter"
        :isNeedSorting="false"
        :CheckBox1Func="itemChecked"
        :CheckBox1Lead="selectedStatus != '71'"
        :CheckIfShowRowCheckBox="CheckIfShowRowCheckBox"
        :MultiSelectFunc1="tabs[tabIndex].id === 'FI0304_hr' ? OpenMultiReport : null"
        :MultiSelectFunc2="AssignReport"
        :MultiSelectFunc3="tabs[tabIndex].id == 'FI0304_pendingAppr' ? BatchApprove : null"
        selectFunc2String="分派其他醫師"
        :selectFunc3String="tabs[tabIndex].id === 'FI0304_hr' ? '' : '批次審核上傳'"
        :enableRowClick="true"
        :OpButton1Func="RowClickFunction"
        :OpButton2Func="OnClickMyFavorite"
        :OpButtonXFunc="OnClickClearReport"
        OpButton2Text="加入追蹤"
        :ifSendBackTheList="true"
        :checkIfDisableOpButton2Func="checkIfDisableOpButton2Func"
        :checkIfDisableOpButtonXFunc="checkIfDisableOpButtonXFunc"
        :sortChangeFunc="sortChanged"
        no-local-sorting
        :enterReport="true"
        :unifiedPerPage="true"
        @unifiedPerPageFun="unifiedPerPageFun"
        :specialColumn="[
          {
            pos: 4,
            label: '報告預覽',
            text: '報告預覽',
            event: tbodyMouseEvent,
            type: 'hoverText',
          },
          {
            pos: 1,
            label: '加成',
            img: require('@/assets/additions.png'),
            event: () => {},
            type: 'image',
          },
        ]"
      />
      <transition name="fade">
        <div
          class="preview-report rounded p-2 position-fixed border"
          :style="`left: ${preReportPosition.x}px; top: ${preReportPosition.y}px;`"
          v-if="this.preReportId"
        >
          <div v-if="this.preReportContents[this.preReportId] === 'loading'" class="d-flex justify-content-center align-items-center">
            <b-spinner type="grow" label="Spinning" />
          </div>
          <div
            v-else
            :class="{
              'd-flex justify-content-center align-items-center': this.preReportContents[this.preReportId] === 'no data',
            }"
            v-text="this.preReportContents[this.preReportId]"
          />
        </div>
      </transition>
    </b-card>

    <b-modal
      id="reNewReportContent304"
      ref="reNewReportContent304"
      centered
      no-fade
      size="600"
      scrollable
      body-class="py-1 themeModal border-right border-bottom border-left"
      :header-bg-variant="'danger'"
      :header-text-variant="'light'"
      hide-footer
      @shown="customFieldEventRevoke('shown')"
      @hide="customFieldEventRevoke"
    >
      <template slot="modal-title">
        <font-awesome-icon icon="eraser" class="mr-2" />
        <span class="zhTW">放棄撰打報告</span>
      </template>
      <div style="margin-top: 12px">
        <div style="margin-bottom: 12px; font-size: 1.5rem; line-height: 1.5; text-align: center;">確認放棄撰打?</div>
      </div>
      <b-row>
        <b-col class="text-right" style="margin-top: 8px; padding: 4px 8px 8px 8px">
          <b-button variant="secondary" class="mr-2" @click="$bvModal.hide('reNewReportContent304')">取消</b-button>
          <b-button variant="primary" class="mr-2"  @click="revokeReport">確定</b-button>
        </b-col>
      </b-row>
    </b-modal>

    <b-modal
      id="WinReportEdit0304"
      ref="Window4ReportEdit"
      centered
      hide-footer
      size="xl"
      no-fade
      header-bg-variant="warning"
      header-text-variant="dark"
      body-class="py-1 px-1 themeModal"
    >
      <template slot="modal-title">
        <font-awesome-icon icon="edit" class="mr-1" />
        <span class="zhTW">登打報告{{ reportEditTitle }}</span>
      </template>

      <reportEdit
        :GetParams="GetParams"
        :physicianId="theProcedure.DxreportPhysicianId"
        @CloseReportEdit="CloseReportEdit"
        @RefreshCheckedItems="RefreshCheckedItems"
      />
    </b-modal>

    <b-modal ref="win4assignReport" hide-footer header-bg-variant="warning" header-text-variant="dark" body-class="py-1 px-1 themeModal">
      <template slot="modal-title">
        <font-awesome-icon icon="user-friends" class="mr-1" />
        <span class="zhTW">分派報告{{ reportAssignTitle }}</span>
      </template>
      <div class="mr-1 rounded">
        <b-row no-gutters>
          <b-col class="p-2">
            <b-input-group>
              <b-input-group-prepend>
                <b-button class="bg-primary" style="border-style: none">選擇分派醫師</b-button>
              </b-input-group-prepend>
              <b-select v-model="selectedAssignDoctor" :options="optionsAssignDoctor" @change="ChangeAssignDoctor" />
            </b-input-group>
          </b-col>
        </b-row>

        <b-row no-gutters>
          <b-col class="p-2 text-right">
            <b-button variant="success" @click="ConfirmAssignReport"> <font-awesome-icon icon="user-check" />確認分派 </b-button>
            <b-button variant="danger" @click="CancelAssignReport" class="ml-4"> <font-awesome-icon icon="times-circle" />取消 </b-button>
          </b-col>
        </b-row>
      </div>
    </b-modal>

    <b-modal
      ref="win4commentMyFravorite"
      hide-footer
      header-bg-variant="primary"
      header-text-variant="light"
      body-class="py-1 px-1 themeModal border-right border-left border-bottom rounded-bottom"
    >
      <template slot="modal-title">
        <font-awesome-icon icon="user-friends" class="mr-1" />
        <span class="zhTW">加入個案追蹤</span>
      </template>
      <div class="mr-1 rounded">
        <b-row no-gutters>
          <b-col class="p-2 text-left">
            <span class="zhTW">備註</span>
          </b-col>
        </b-row>
        <b-row no-gutters>
          <b-textarea
            placeholder="限制1000字內"
            maxlength="1000"
            class="mx-1"
            no-resize
            rows="9"
            v-model="myFavoriteNote"
            style="height: 142px; background-color: var(--themeBgColor); color: var(--themeTextColor)"
          ></b-textarea>
        </b-row>
        <b-row no-gutters style="justify-content: flex-end">
          <div class="px-2" style="color: #666666">
            目前字數:
            {{ myFavoriteNote && myFavoriteNote.length ? myFavoriteNote.length : '0' }}/1000
          </div>
        </b-row>
        <b-row no-gutters>
          <b-col class="p-2 text-right">
            <b-button variant="success" @click="ConfirmAddFavorite"> <font-awesome-icon icon="user-check" />確認加入 </b-button>
            <b-button variant="danger" @click="CancelAddFavorite" class="ml-4"> <font-awesome-icon icon="times-circle" />取消 </b-button>
          </b-col>
        </b-row>
      </div>
    </b-modal>

    <b-modal
      ref="showCustomFields"
      header-bg-variant="warning"
      header-text-variant="black"
      size="xl"
      title="自訂表格內容"
      ok-title="確定"
      @ok="confirmCustom"
      @shown="customFieldEvent('shown')"
      @hide="customFieldEvent"
      centered
    >
      <b-form-group label="勾選表格內容">
        <b-form-checkbox-group
          id="checkbox-custom"
          v-model="selectedTableFields"
          text-field="label"
          value-field="key"
          :options="FI0304TableField"
        ></b-form-checkbox-group>
      </b-form-group>
    </b-modal>
  </div>
</template>
<script>
import Vue from 'vue'
import twp from '@/components/TWPv5'
import reportEdit from '@/components/ReportEdit'
import * as configs from '@/config'
import { DateRangePickerPlugin } from '@syncfusion/ej2-vue-calendars'
import VSuperSelect from 'v-super-select'
import { mapGetters, mapMutations, mapActions } from 'vuex'
import { DataManager, WebApiAdaptor, Query } from '@syncfusion/ej2-data'
import { dateFormatMixin } from '@/SupportLib_J.js'
import { useHubStatusChanged } from '@/assets/js/hub.js'
import {
  getExportBarcode,
  getReportContents,
  getOptionsReportDrSource,
  postFavoriteCases,
  examAssignReport,
  getReportByAccessionNo,
  getReportCount,
  getActionReportEdit,
  getCheckItem,
  postRemoveTempReport,
  putSaveScreeningWarning,
  getOptionsRequestingDepartmentSource
} from '@/assets/service/dataManager.js'
import { configCollection, FI0304TableField, tabTags } from './defaultData.js'
import { get, set } from '@/utils/lodash.js'
import _ from 'lodash'
import moment from "moment";

Vue.use(DateRangePickerPlugin)

Date.prototype.toJSON = function(){
  return moment(this).format('YYYY-MM-DD HH:mm:ss')
}

export default {
  name: 'FI0304',
  components: { twp, reportEdit, VSuperSelect },
  mixins: [dateFormatMixin],
  data() {
    return {
      // //用戶資訊
      userInfo: {
        userId: this.$store.state.Profile4User.id,
        userName: this.$store.state.Profile4User.employeeName,
        roleId: this.$store.state.Profile4User.staffType,
        roleName: this.$store.state.Profile4User.staffName,
      },
      optionsDxreportPhysician: [],
      selectedCheckItemObjTemp: null,
      selectedCheckItem: null,
      selectedInspectDevice: null,
      procedureCodeItems: [],
      optionsInspectDeviceTemp: [],
      optionsInspectDevice: [],
      theProcedure: {
        // AccessionNo: "", //申請單號(大單號)
        OrderNo: '', //檢查單號(大單號)
        RequestingPhysicianName: '開單醫師',
        DxreportPhysicianId: this.versionNo !== '805' && this.$store.state.Profile4User.id !== 'admin' ? this.$store.state.Profile4User.id : '',
        IssuePhysicianId: this.versionNo === '805' && this.$store.state.Profile4User.id !== 'admin' ? this.$store.state.Profile4User.id : '',
        patientId: '',
      },
      FI0304TableField,
      tableConfig4QueryResult: FI0304TableField,
      optionsPatientSource: [],
      tabIndex: 0,
      min: 1,
      DateRange: [null, null],
      produredCompletedDateRange: [null, null],
      reportEditTitle: '',
      reportAssignTitle: '',
      selectedStatus: process.env.VUE_APP_FIRST_SELECTEDSTATUS,
      selectedAssignDoctor: null,
      reportsOnAssign: [],
      myFavoriteNote: null,
      searchCondition: null,
      tabs: [],
      sortMethod: {
        key: 'ProcedureCompleted',
        desc: false,
      },
      tabList: [],
      isClearing: false,
      // timeFormat: 'yyyy/MM/dd HH:mm:ss',
      timeFormat: 'yyyy/MM/dd',
      preReportPosition: { x: 0, y: 0 },
      preReportContents: {},
      preReportId: '',
      mouseoverTimeStamp: 0,
      preReportTimer: null,
      favorite: {
        no: '',
        id: '',
        orderNo: ''
      },
      isFetchData: false,
      customeTableFields: [],

      selectedTableFields: FI0304TableField.map((item) => item.key),
      disabledOptionsPhysician: true,
      isPacAutoOptions: [
        { text: '自動', value: 'Y' },
        { text: '手動', value: 'N' }
      ],
      isSaveAutoOptions: [
        { text: '開啟', value: 'Y' },
        { text: '關閉', value: 'N' }
      ],
      isObjAutoOptions: [
        { text: '開啟', value: 'Y' },
        { text: '關閉', value: 'N' }
      ],
      isMphraseOptions: [
        { text: '開啟', value: 'Y' },
        { text: '關閉', value: 'N' }
      ],
      tempRevokeItems: null,
      departmentList: [],
      tabIdTemp: 0,
      inputCheckTemp: false,
      produredCompletedDateRangeSelect: null,
      DateRangeSelect: null,
      optionsDateSelect1: [
        {
          text: '',
          value: ''
        },
        {
          text: '今天',
          value: 'today'
        },
        {
          text: '最近1日內',
          value: 'recent1'
        },
        {
          text: '最近3日內',
          value: 'recent3'
        },
        {
          text: '最近7日內',
          value: 'recent7'
        },
        {
          text: '最近30日內',
          value: 'recent30'
        },
        {
          text: '自訂範圍',
          value: 'custom'
        },
      ],
      optionsDateSelect2: [
        {
          text: '',
          value: ''
        },
        {
          text: '今天',
          value: 'today'
        },
        {
          text: '最近1日內',
          value: 'recent1'
        },
        {
          text: '最近3日內',
          value: 'recent3'
        },
        {
          text: '最近7日內',
          value: 'recent7'
        },
        {
          text: '最近30日內',
          value: 'recent30'
        },
        {
          text: '自訂範圍',
          value: 'custom'
        },
      ],
      produredCompletedDateRangeObjTemp: {
        open: false,
        select: false,
        range: '自訂範圍'
      },
      DateRangeObjTemp: {
        open: false,
        select: false,
        range: '自訂範圍'
      },
      unifiedPageTemp: null,
      searchDataSaveDefault: {
        'theProcedure.patientId': null,
        'selectedInspectDevice': null,
        'theProcedure.OrderNo': null,
      },
      searchDataSaveTemp: {
        'theProcedure.patientId': null,
        'selectedInspectDevice': null,
        'theProcedure.OrderNo': null,
      }
    }
  },
  computed: {
    ...mapGetters(['getProfile4User', 'getThemeColors', 'getReportDrs', 'getModalityOptions']),
    searchDataSave: {
      get(){
        return this.searchDataSaveTemp
      },
      set(val){
        this.searchDataSaveTemp = val
      }
    },
    versionNo() {
      return process.env.VUE_APP_VERSION_NO
    },
    unifiedPage: {
      get(){
        return this.unifiedPageTemp
      },
      set(val){
        this.unifiedPageTemp = val
      }
    },
    employeeNo() {
      switch (process.env.VUE_APP_VERSION_NO) {
        case '805':
          return this.theProcedure.IssuePhysicianId
        default:
          return this.theProcedure.DxreportPhysicianId
      }
    },
    isShowHeaderCounter() {
      switch (process.env.VUE_APP_VERSION_NO) {
        case '805':
          return false
        default:
          return true
      }
    },
    isNeedPdfDownload() {
      switch (process.env.VUE_APP_VERSION_NO) {
        case '805':
          return false
        default:
          return true
      }
    },
    FI0304TableFieldFilter() {
      // return this.FI0304TableField.filter((item) => this.selectedTableFields.includes(item.key))
      return this.FI0304TableField.filter((item) => this.tableFields.includes(item.key))
    },
    twpHeight() {
      // return window.innerHeight - 347 + 'px'
      return 'calc(100vh - 392px)'
    },
    optionsStatus() {
      let arr = []
      switch (process.env.VUE_APP_VERSION_NO) {
        case '805':
          arr = [
            { value: '', text: '待打' },
            // { value: '56', text: '待打' },
            { value: '63', text: '暫存' },
            { value: '71', text: '完成' },
          ]
          break
        default:
          arr = [
            { value: '51', text: '自動分派' },
            { value: '61', text: '退件重寫' },
            { value: '63', text: '報告撰寫' },
          ]

          if (this.userInfo.roleId != '21') {
            if (this.userInfo.userId === this.theProcedure.DxreportPhysicianId || this.userInfo.userId === 'admin') {
              arr = arr.concat([{ value: '71', text: '正式報告' }])
            }
          } else if (this.userInfo.userId != this.theProcedure.DxreportPhysicianId) {
            arr = arr.concat([{ value: '65', text: '等待審核' }])
          } else {
            arr = arr.concat([
              { value: '65', text: '等待審核' },
              { value: '71', text: '正式報告' },
            ])
          }
          break
      } 

      return arr
    },
    optionsAssignDoctor() {
      let arr = this.optionsDxreportPhysician.filter((i) => i.value != this.theProcedure.DxreportPhysicianId)
      arr.unshift({ value: null, text: '請選擇' })
      return arr
    },
    OptionsCasePriority() {
      // 案件優先度
      return [
        { text: '急件', value: 'Y' },
        { text: '一般', value: 'N' },
      ]
    },
    tableFields() {
      return this.getProfile4User.setting && this.getProfile4User.setting.hasOwnProperty('reportListField')
        ? this.getProfile4User.setting.reportListField
        : this.tableConfig4QueryResult.map(({ key }) => key)
    },
    isPacAuto: {
      get(){
        return this.getPacAutoValue()
      },
      set(val){
        this.SET_PACAUTO(val)
      }
    },
    isSaveAuto: {
      get(){
        return this.getSaveAutoValue()
      },
      set(val){
        this.SET_SAVEAUTO(val)
      }
    },
    isObjAuto: {
      get(){
        return this.getObjAutoValue()
      },
      set(val){
        this.SET_OBJAUTO(val)
      }
    },
    isMphrase: {
      get(){
        return this.getMphraseValue()
      },
      set(val){
        this.SET_MPHRASE(val)
      }
    },
    selectedCheckItemObj: {
      get(){
        return this.selectedCheckItemObjTemp
      },
      set(val){
        this.selectedCheckItemObjTemp = val
      }
    },
    isBackFromReport: {
      get(){
        return this.getIsBackFromReport()
      },
      set(val){
        this.SET_ISBACK_REPORT(val)
      }
    },
    isBackFromReportItems: {
      get(){
        return this.getIsBackFromReportItems()
      },
      set(val){
        this.SET_ISBACK_REPORT_ITEMS(val)
      }
    },
    lastStatus: {
      get(){
        return this.getFinalStatus()
      },
      set(val){
        this.SET_FINAL_STATUS(val)
      }
    },
    lastAccessionNo: {
      get(){
        return this.getFinalAccessionNo()
      },
      set(val){
        this.SET_FINAL_ACCESSIONNO(val)
      }
    },
    lastRelease: {
      get(){
        return this.getFinalRelease()
      },
      set(val){
        this.SET_FINAL_RELEASE(val)
      }
    },
    curTabId(){
      return this.tabs[this.tabIndex].id
    },
    curTabIdTemp: {
      get(){
        return this.tabIdTemp
      },
      set(val){
        this.tabIdTemp = val
      }
    },
    inputCheck: {
      get(){
        return this.inputCheckTemp
      },
      set(val){
        this.inputCheckTemp = val
      }
    },
    produredCompletedDateRangeObj: {
      get(){
        return this.produredCompletedDateRangeObjTemp
      },
      set(val){
        this.produredCompletedDateRangeObjTemp = val
      }
    },
    DateRangeObj: {
      get(){
        return this.DateRangeObjTemp
      },
      set(val){
        this.DateRangeObjTemp = val
      }
    }
  },
  methods: {
    ...mapGetters(['getPacAutoValue', 'getSaveAutoValue', 'getObjAutoValue', 'getMphraseValue', 'getIsBackFromReport', 'getIsBackFromReportItems', 'getFinalStatus', 'getFinalAccessionNo', 'getFinalRelease']),
    ...mapActions(['action_updatePrivatePhrase', 'action_savingPersonalSetting']),
    ...mapMutations([
      'SHOW_LOADING',
      'HIDE_LOADING',
      'SET_SIDE_MESSAGE',
      'SET_REPORT_DR',
      'SET_MODALITIES',
      'CLEAR_PHRASE',
      'SET_REPORTLIST_FIELDS',
      'CLEAR_REPORT_STATUS',
      'SET_REPORT_STATUS',
      'SET_PACAUTO',
      'SET_SAVEAUTO',
      'SET_OBJAUTO',
      'SET_ISBACK_REPORT',
      'SET_ISBACK_REPORT_ITEMS',
      'SET_FINAL_STATUS',
      'SET_FINAL_ACCESSIONNO',
      'SET_FINAL_RELEASE',
      'SET_MPHRASE'
    ]),
    unifiedPerPageFun(data){

      localStorage.setItem('all_perPage', data)
      
      this.tabList.forEach((v)=>{
        let storeId = localStorage.getItem(v.id + '_perPage')
        if(storeId){
            localStorage.removeItem(v.id + '_perPage')
        }
        v.per = data
      })

    },
    resetSelectDateRage(type){
      switch(type){
        case 'produredCompletedDateRange':
          this.optionsDateSelect1[this.optionsDateSelect1.length - 1].text = '自訂範圍'
          break
        case 'DateRange':
          this.optionsDateSelect2[this.optionsDateSelect2.length - 1].text = '自訂範圍'
          break
      }
    },
    optionsDateChangeE(evt, type){
      switch(type){
        case 'produredCompletedDateRange':
          this.resetSelectDateRage('produredCompletedDateRange')
          if(evt === 'custom'){
            setTimeout(()=>{
                  this.$refs['produredCompletedDateRangeRef'].show()
            },50)
          }
          break
        case 'DateRange':
          this.resetSelectDateRage('DateRange')
          if(evt === 'custom'){
            setTimeout(()=>{
                  this.$refs['DateRangeRef'].show()
            },50)
          }
          break
      }
    },
    dateRangeChangeE(evt, type){
      switch(type){
        case 'produredCompletedDateRange':   
          if(this.produredCompletedDateRange){
            this.$nextTick(()=>{
              this.optionsDateSelect1[this.optionsDateSelect1.length - 1].text = evt.text
            })
          }
          break;
        case 'DateRange':
          if(this.DateRange){
            this.$nextTick(()=>{
              this.optionsDateSelect2[this.optionsDateSelect2.length - 1].text = evt.text
            })
          }
          break;
      }
    },
    dateRangeCloseE(evt, type){
      switch(type){
        case 'produredCompletedDateRange':   
          if(this.produredCompletedDateRange && this.produredCompletedDateRange[0] && this.produredCompletedDateRange[1]){
            this.$nextTick(()=>{
              this.produredCompletedDateRangeSelect = 'custom'
            })
          }
          break;
        case 'DateRange':
          if(this.DateRange && this.DateRange[0] && this.DateRange[1]){
            this.$nextTick(()=>{
              this.DateRangeSelect = 'custom'
            })
          }
          break;
      }
    },
    onTabClick(index) {
      if (this.tabIndex === index) return
      this.tabIndex = index
      const query = this.$route.query
      if (query.page) query.page = undefined
      this.$router.push({ query: { ...query, tableIndex: this.tabIndex } })

      if (this.tabList[this.tabIndex].page > 1) {
        this.SearchConditions()
      }
    },
    changePages(data) {
      console.log(`changePages: `, data)
    },
    async getCheckItem() {
      try {
        const data = await getCheckItem()
        this.procedureCodeItems = data.Items.map(({ No, Name }) => ({
          value: No,
          text: Name,
        }))
      } catch (error) {
        console.log(error)
      }
    },
    async retCheckItem(Val) {
      try {
        const data = await getCheckItem()
        let tempObj = null
        let idx = null
        if(data){
          data.Items.forEach(({No}, i)=>{
            if(No === Val){
              idx = i
            }
          })
          tempObj = data.Items.filter(({No})=>No === Val)
          tempObj = tempObj.map(({ No, Name }) => ({
            '$groupIndex': undefined,
            '$html': Name,
            '$id': `${No}_0_item`,
            '$index': idx,
            '$isItem': true,
            text: Name,
            value: No
          }))
          tempObj = tempObj[0]

          this.selectedCheckItemObj = _.cloneDeep(tempObj)
        }        
      } catch (error) {
        console.log(error)
      }
    },
    retStatusName(check) {
      switch(check){
        case '56':
          return '待打'
        case '63':
          return '暫存'
        case '71':
          return '完成'
        default:
          return ''
      }
    },
    async getTabDataSource(showloading = true) {

      if (this.versionNo === '805') {
        // if (this.selectedStatus === '56') {
        //   this.theProcedure.IssuePhysicianId = ''
        // }
        // if (this.selectedStatus === '') {
        //   this.theProcedure.IssuePhysicianId = ''
        // }
        if(this.selectedStatus === ''){
          // if (this.userInfo.userId == 'admin') {
          //   this.theProcedure.IssuePhysicianId = ''
          // } else {
          //   this.theProcedure.IssuePhysicianId = this.userInfo.userId
          // }
          this.theProcedure.IssuePhysicianId = ''
          this.disabledOptionsPhysician = true
        }else if (this.selectedStatus === '63') {
          this.disabledOptionsPhysician = false
        } else {
          this.disabledOptionsPhysician = true
        }
      }

      this.isFetchData = true

      this.GetReportCount()

      const tasks = []

      try {
        // if (
        //   ((!!this.DateRange[0] && !!this.DateRange[1]) ||
        //     (!this.DateRange[0] && !this.DateRange[1])) &&
        //   ((!!this.produredCompletedDateRange[0] && !!this.produredCompletedDateRange[1]) ||
        //     (!this.produredCompletedDateRange[0] && !this.produredCompletedDateRange[1]))
        // ) {

        this.tabList[this.tabIndex].page = Number(this.$route.query.page || 1)

        for (let index = 0; index < this.tabList.length; index++) {

          let { id, page, per } = this.tabList[index]

          let storedPer = localStorage.getItem('all_perPage')
          
          if(storedPer){
            per = storedPer
          }

          tasks.push(this.GetDataContent(id, page, per, showloading))
        }
        // } else {
        //   throw '開始或結束日期漏填';
        // }
      } catch (err) {
        this.SET_SIDE_MESSAGE({ msg: err, type: 2 })
      }

      try {
        const allRes = await Promise.all(tasks)
        
        if (allRes) {
            allRes.forEach((res, index) => {
            const { Count, Items } = res

            Items.forEach((item) => {
              item['Additions'] = 'NO'
            })

            this.tabList[index].count = Count
            this.tabList[index].items = Items

            if (index === this.tabIndex && this.$refs['twp3'] !== undefined) {
              // 檢查 this.$refs["twp3"]，避免快速轉跳 fetch 尚未結束，但組件已銷毀 => 找不到 OnForceRefresh
              this.$refs['twp3'].OnForceRefresh()
            }
          })
        }
      } catch (err) {
        console.log(`err: `, err)

      } finally {
        this.isFetchData = false
      }
    },
    tbodyMouseEvent(e) {
      if (e.type === 'mouseleave') {
        this.preReportTimer = setTimeout(() => {
          this.preReportId = null
        }, 500)
      }
      if (e.timeStamp < this.mouseoverTimeStamp + 250 || e.type === 'mouseleave') return
      this.mouseoverTimeStamp = e.timeStamp // 更新刷新時間

      if (this.preReportTimer) {
        clearTimeout(this.preReportTimer)
        this.preReportTimer = null
      }

      const { AccessionNo, PatientId } = this.tabList[this.tabIndex].items[e.target.closest('tr').rowIndex - 1]
      if (!AccessionNo) return
      if (!this.preReportContents.hasOwnProperty(AccessionNo)) {
        this.preReportContents[AccessionNo] = 'loading'
        getReportByAccessionNo(AccessionNo, PatientId).then(({ ReportContent }) => {
          console.log(`ReportContent: `, ReportContent)
          this.preReportId = ''
          this.preReportContents[AccessionNo] = ReportContent || 'no data'
          this.preReportId = AccessionNo
        })
      }
      this.preReportPosition.x = e.clientX + 40
      this.preReportPosition.y = e.clientY + 10
      this.preReportId = AccessionNo
    },
    async updateTableSource(tabId, from, range) {

      console.log(`updateTableSource ~`)

      let { page, per, count, items, id } = this.tabList[this.tabIndex]

      if (id !== tabId) {
        // 不同頁 直接給予該tab的item及數量
        this.$refs['twp3'].PagingCurrentPage = page
        this.$refs['twp3'].PagingRowPerPage = per
        return { Items: items, Count: count }
      } else {
        if (from === page && per === range) {
          return { Items: items, Count: count }
        } else {
          let { Count, Items } = await this.GetDataContent(id, from, range)
          this.tabList[this.tabIndex].page = from
          this.tabList[this.tabIndex].per = range
          this.tabList[this.tabIndex].items = Items
          this.tabList[this.tabIndex].count = Count
          return { Items, Count }
        }
      }
    },
    sortChanged({ id, by, desc }) {
      if (by === 'ProcedureCompletedForShow') {
        this.sortMethod.key = 'ProcedureCompleted'
      } else if (by === 'StatusName') {
        this.sortMethod.key = 'Status'
      } else if (by === 'ProcedureNameList'){
        this.sortMethod.key = 'ProcedureCode'
      } else if (by === 'PatientSourceTypeName'){
        this.sortMethod.key = 'PatientSourceTypeCode'
      } else if (by === 'PatientAge'){
        this.sortMethod.key = 'PatientBirthday'
      } else {
        this.sortMethod.key = by
      }

      this.sortMethod.desc = desc

      this.SearchConditions()
    },
    //判斷是否要disable 加入個案追蹤 的按鈕
    checkIfDisableOpButton2Func(x) {
      if (x.Status != '71') {
        return true
      }
      return x.IsFavoriteCases
    },
    checkIfDisableOpButtonXFunc(x) {
      if (x.Status != '63') {
        return true
      }
      return false
    },
    //確認新增案例追蹤
    async ConfirmAddFavorite() {
      // 啟動 報告存檔 作業
      // 報告存檔 - 後台存取
      this.SHOW_LOADING()
      //開始儲存
      let opStatus = false
      let opResult = '存取時發生錯誤!'
      try {
        await postFavoriteCases({
          EmployeeNo: this.userInfo.userId,
          PatientId: this.favorite.id,
          AccessionNo: this.favorite.no,
          PfcComment: this.myFavoriteNote,
        })
        opStatus = true
        this.$refs['twp3'].OnForceRefresh()
      } catch (error) {
        opStatus = false
        opResult += error
        if (error.response.status == 409) {
          opResult = error.response.data
        }
      } finally {
        // this.SearchConditions()

        this.tabList[this.tabIndex].items.forEach((v)=>{
          if(v.OrderNo === this.favorite.orderNo){
            this.$nextTick(()=>{
              v.Status = '71'
              v.StatusName = this.retStatusName(v.Status)
              v._rowVariant = '$white'
              v.IsFavoriteCases = true
            })
          }
        })

        this.$refs.win4commentMyFravorite.hide()
        this.favorite.no = this.favorite.id = this.favorite.orderNo = ''
        this.HIDE_LOADING()
      }
      if (opStatus) {
        this.SET_SIDE_MESSAGE({ msg: '資料已完成作業' })
      } else {
        this.SET_SIDE_MESSAGE({ msg: opResult, type: 2 })
      }
      return opStatus
    },
    //批次審核上傳
    async BatchApprove(items) {
      let status = 71
      // 啟動 報告存檔 作業
      // console.log(this.$logs("save report:" + status));
      // 報告存檔 - 後台存取
      this.SHOW_LOADING()
      //開始儲存
      let _this = this
      let opStatus = false
      let opResult = '存取時發生錯誤!'
      let subPath = '/report/Approval?employeeNo=' + this.employeeNo
      let dataBody = []
      items.forEach((i) => dataBody.push(i.AccessionNo))
      await window.axios
        .post(subPath, dataBody)
        .then((e) => {
          opStatus = true
          _this.$refs['twp3'].forEach((t) => {
            if (t.TableId && t.TableId == 'FI0304_pendingAppr') {
              t.OnForceRefresh()
              t.OnCancelAllSelects()
            }
          })
        })
        .catch(function (error) {
          opStatus = false
          opResult += error
        })
      this.HIDE_LOADING()
      if (opStatus) {
        this.SET_SIDE_MESSAGE({ msg: '資料已完成批次審核上傳' })
      } else {
        this.SET_SIDE_MESSAGE({ msg: opResult + '! 請稍後再試.', type: 2 })
      }
      return opStatus
    },
    //確認分派報告
    async ConfirmAssignReport() {
      if (this.selectedAssignDoctor == null) {
        this.SET_SIDE_MESSAGE({ msg: opResult + '請選擇分派醫師', type: 2 })
        return
      }
      // 報告存檔 - 後台存取
      this.SHOW_LOADING()

      let opStatus = false
      let opResult = '存取時發生錯誤!'
      //console.log(this.theReport)
      let accessionNos = []
      this.reportsOnAssign.forEach((obj) => {
        accessionNos.push(obj.AccessionNo)
      })
      let dataBody = {
        ReportPhysicianId: this.selectedAssignDoctor,
        AccessionNos: accessionNos,
      }

      try {
        await examAssignReport(dataBody)
        opStatus = true
        this.$refs['twp3'].checkedItems.length = 0
        // this.$refs["twp3"].OnForceRefresh();
      } catch (err) {
        opStatus = false
        opResult += err
      }

      this.HIDE_LOADING()
      if (opStatus) {
        this.SET_SIDE_MESSAGE({ msg: '已完成分派作業' })
      } else {
        this.SET_SIDE_MESSAGE({ msg: opResult + '! 請稍後再試.', type: 2 })
      }
      this.SearchConditions()
      this.$refs.win4assignReport.hide()
      return opStatus
    },
    //取消分派
    CancelAssignReport() {
      this.$refs.win4assignReport.hide()
    },
    //取消加入個案
    CancelAddFavorite() {
      this.$refs.win4commentMyFravorite.hide()
    },
    //變更分派醫師
    ChangeAssignDoctor() {},
    //變更搜尋登打狀態 立刻刷新list
    //變更報告醫師
    ChangeSearchConditions(val) {
      // if (val) this.action_updatePrivatePhrase(val); // 更新片語
      this.CLEAR_PHRASE()
      
      if(this.versionNo !== '805'){
        //如果Search的報告醫師不是自己 且 搜尋登打狀態設定為 正式報告, 則調回 '自動分派' 以避免搜尋到非本人可編輯之正式報告
        if (this.theProcedure.DxreportPhysicianId != this.userInfo.userId) {
          if (this.selectedStatus == '71') {
            this.selectedStatus = '51'
          }
        }
      }
      
      // this.SearchConditions()
    },
    ChangeSelectedCheckItemObj(val){
      console.log(`ChangeSelectedCheckItemObj: `, val)
    },
    ChangeSelectedStatusSearchConditions() {
      if (this.versionNo === '805') {

        // this.clearDateRange()
        this.initDateRange()

        if (this.selectedStatus === '71') {
          this.disabledOptionsPhysician = true

          if (this.userInfo.userId == 'admin') {
            this.theProcedure.IssuePhysicianId = ''
          } else {
            this.theProcedure.IssuePhysicianId = this.userInfo.userId
          }
          
        } else if (this.selectedStatus === '63') {
          this.disabledOptionsPhysician = false
          this.theProcedure.IssuePhysicianId = this.userInfo.userId

        }else if (this.selectedStatus === '') {
          this.disabledOptionsPhysician = true
          this.theProcedure.IssuePhysicianId = ''

        }else {
          this.disabledOptionsPhysician = true
        }
      }

      this.ClearConditions('statusChange')

      this.execSearchValue()

      this.SearchConditions()

      this.execSearchDefault()
    },
    execSearchDefault(){
      this.searchDataSave = _.cloneDeep(this.searchDataSaveDefault)
    },
    execSearchSave(){
      ['patientId', 'OrderNo', ].forEach((v) => {
        this.searchDataSave[`theProcedure.${v}`] = this.theProcedure[v]
      })

      this.searchDataSave['selectedInspectDevice'] = this.selectedInspectDevice
    },
    execSearchValue(){
      ['patientId', 'Ordervo'].forEach((v)=>{
        if(this.searchDataSave[`theProcedure.${v}`]){
          this.theProcedure[v] = this.searchDataSave[`theProcedure.${v}`]
        }
      })

      if(this.searchDataSave['selectedInspectDevice']){
        this.selectedInspectDevice = this.searchDataSave[`selectedInspectDevice`]
      }
    },
    //keypressed偵測
    HKWatch(event) {
      console.log(`HKWatch: `, event)

      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        if (
          this.$refs.win4commentMyFravorite.isShow
          ||
          this.$refs.Window4ReportEdit.isShow
          ||
          this.$refs.showCustomFields.isShow
        ) return
        // //粗體Method自定義
        this.SearchConditions()
        // this.SetFocusOnInputAccessionNo(500)
      }

      if(event.altKey){
        if(event.code === 'KeyP'){
            this.inputFocusFun('PatientId')
        }
      }
    },
    FocusWatch(event) {
      if(event.target && (event.target.nodeName === 'INPUT' || event.target.nodeName === 'SELECT')){
        this.inputCheck = true
      }else{
        this.inputCheck = false
      }
    },
    SetFocusOnInputAccessionNo(delayTime) {
      setTimeout(() => {
        this.$nextTick(() => {
          if (this.$refs['inputAccessionNo']) this.$refs['inputAccessionNo'].focus()
        })
      }, delayTime)
    },
    //取得醫師列表
    GetOptionsDxreportPhysician() {
      return new Promise(async (resolve) => {
        if (this.getReportDrs.length === 0) {
          this.SHOW_LOADING()
          const {
            actual: { Items },
          } = await getOptionsReportDrSource()
          const _specificDoctors = Items.filter((item) => item.InstitutionNo !== '0200')
          this.SET_REPORT_DR(_specificDoctors)
          this.optionsDxreportPhysician = [
            { value: '', text: '全部醫師' },
            ..._specificDoctors.map(({ No, Name }) => ({
              value: No,
              text: Name,
            })),
          ]

          this.HIDE_LOADING()
          resolve(true)
        } else {
          this.optionsDxreportPhysician = [{ value: '', text: '全部醫師' }, ...this.getReportDrs]
          resolve(true)
        }
        if (this.versionNo === '805') {
          this.optionsDxreportPhysician = this.optionsDxreportPhysician.filter((item) => {
            return item.value === '' || item.value === this.userInfo.userId
          })
        }
      })
    },
    //取得儀器類別列表
    async GetOptionsInspectDevice() {
      let subPath = '../exam/GetModalityNoList'
      this.SHOW_LOADING()
      const { actual } = await new DataManager({
        url: configs.publicPath + subPath,
        adaptor: new WebApiAdaptor(),
        crossDomain: true,
      }).executeQuery(new Query())
      this.HIDE_LOADING()
      
      this.optionsInspectDeviceTemp = actual.map((v) => ({ text: v.No, value: v.No }))
      this.optionsInspectDevice = [{ value: null, text: '' }].concat(this.optionsInspectDeviceTemp)
      
      // for legacy use
      let tempModality = actual.map((v) => (v.No))
      this.SET_MODALITIES(tempModality)
  },
    async GetAllExamList(index) {
      //判別日期查詢 (日期查詢無法寫在query物件裡, 只好從url帶參數)
      let subPath = '../exam/List2'

      if (this.DateRange[0] != null || this.DateRange[1] != null) {
        let dateCondition = ''
        if (this.DateRange[0] != null) dateCondition += 'procedureCompletedStart=' + this.DateRange[0].toJSON() + '&'
        if (this.DateRange[1] != null) dateCondition += 'procedureCompletedEnd=' + this.DateRange[1].toJSON()
        subPath += '?' + dateCondition
      }

      //判斷檢單狀態
      let statusConditions = 'status='

      if (this.selectedStatus != null) {
        statusConditions += this.selectedStatus
      } else {
        let allStatus = ''
        this.optionsStatus.filter((i) => {
          if (i.value != null) allStatus += i.value + ','
        })
        allStatus = allStatus.replace(/,\s*$/, '')
        statusConditions += allStatus
      }

      //等待審核 tab
      if (index == 'FI0304_pendingAppr') {
        statusConditions = 'status=65'
      }
      if (subPath.includes('?')) {
        subPath += '&' + statusConditions
      } else {
        subPath += '?' + statusConditions
      }

      //急診/件 搜尋判斷
      // if (index == "FI0304_emy") {
      //   if (subPath.includes("?")) {
      //     subPath += "&isEmg=true";
      //   } else {
      //     subPath += "?isEmg=true";
      //   }
      // }
      subPath += '&employeeNo=' + this.employeeNo

      // console.log(subPath, this.collectSearchCondition());
    },
    convertDateRange(datetime, key) {
      if (
        datetime === null
        ||
        datetime === undefined
        ||
        datetime.every((dt) => !dt)
      ) {
        return []
      } else {
        const refDataTime = [...datetime]
        let tempTime = null
        
        // if (!refDataTime[0] && refDataTime[1]) {
        //   refDataTime[0] = new Date(this.$moment(refDataTime[1]).format('YYYY/MM/DD 00:00:00'))
        // } else if (!refDataTime[1] && refDataTime[0]) {
        //   // refDataTime[1] = new Date(this.$moment(refDataTime[0]).format('YYYY/MM/DD 23:59:59'))
        //   refDataTime[1] = new Date(this.$moment(new Date()).format('YYYY/MM/DD HH:mm:ss'))
        //   datetime[1] = new Date(this.$moment(new Date()).format('YYYY/MM/DD HH:mm:ss'))
        // }
        // if (refDataTime[0] == refDataTime[1]) {
        //   refDataTime[1] = new Date(refDataTime[0].getTime() + 24 * 60 * 60 * 1000)
        // }

        if (!refDataTime[0] && refDataTime[1]) {
          refDataTime[0] = new Date(this.$moment(refDataTime[1]).add(-1, 'days').format('YYYY/MM/DD 00:00:00'))
          refDataTime[1] = new Date(this.$moment(refDataTime[1]).format('YYYY/MM/DD 23:59:59'))
        } else if (!refDataTime[1] && refDataTime[0]) {
          refDataTime[0] = new Date(this.$moment(refDataTime[0]).format('YYYY/MM/DD 00:00:00'))
          refDataTime[1] = new Date(this.$moment(refDataTime[0]).add(1, 'days').format('YYYY/MM/DD 23:59:59'))
          datetime[1] = new Date(this.$moment(refDataTime[0]).add(1, 'days').format('YYYY/MM/DD 23:59:59'))
        }

        if (refDataTime[0] == refDataTime[1]) {
          refDataTime[0] = new Date(this.$moment(refDataTime[0]).format('YYYY/MM/DD 00:00:00'))
          refDataTime[1] = new Date(this.$moment(refDataTime[0]).add(1, 'days').format('YYYY/MM/DD 23:59:59'))
        }

        // console.log(`refDataTime: `, refDataTime)

        tempTime = refDataTime.reduce((ac, dt, idx) => {
          if(idx === 0){
            dt = new Date(this.$moment(dt).format('YYYY/MM/DD 00:00:00'))
          }else{
            dt = new Date(this.$moment(dt).format('YYYY/MM/DD 23:59:59'))
          }
          // console.log(`dt:`, dt)
          return ac.concat(`${key}${idx === 0 ? 'Start' : 'End'}=${dt.toJSON()}`)
        }, [])

        // console.log(`tempTime: `, tempTime)

        return tempTime
      }
    },
    collectSearchCondition(index) {
      //判別日期查詢 (日期查詢無法寫在query物件裡, 只好從url帶參數)

      // console.log(`this.DateRange: `, this.DateRange)
      // console.log(`this.produredCompletedDateRange: `, this.produredCompletedDateRange)

      let param = [
        { range: this.DateRange, key: 'issueTime' },
        { range: this.produredCompletedDateRange, key: 'procedureCompleted' },
      ].reduce((ac, { range, key }) => {
        return ac.concat(this.convertDateRange(range, key))
      }, [])

      // if(this.initLastStatus() && this.initLastStatus() == '71'){
      //   this.selectedStatus = this.initLastStatus()
      // }

      //判斷檢單狀態
      const retStatusParam = (search) => {
        let temp = '56,63'
        if(search === '' || search === undefined){
          temp = '56,63'
        }else if(search === '71'){
          temp = search
        }else if(search === '63'){
          temp = search
        }
        return temp
      }

      // param.push(
      //   'status=' +
      //     (index == 'FI0304_pendingAppr' ? '65' : this.selectedStatus != null ? retStatusParam(this.selectedStatus) : this.optionsStatus.map(({ value }) => value).join(','))
      // )
      
      param.push(
        'status=' +
          (index == 'FI0304_pendingAppr' ? '65' : retStatusParam(this.selectedStatus))
      )

      //EMPLOYEE NO
      if(this.selectedStatus === ''){
        if (this.userInfo.userId !== 'admin') {
          param.push('employeeNo=' + this.userInfo.userId)
        }else{
          param.push('employeeNo=' + this.employeeNo)  
        }
      }else{
        param.push('employeeNo=' + this.employeeNo)
      }

      if (this.theProcedure.OrderNo) {
        param.push('OrderNo=' + this.theProcedure.OrderNo)
      }

      return (param.length > 0 ? '?' : '') + param.join('&')
    },
    async GetReportCount() {
      try {
        const res = await getReportCount(`?status=${this.selectedStatus}`)
        this.tabList[0].emgOnTime.cr = res.result.EmergencyCrCount
        this.tabList[0].emgOnTime.ctmr = res.result.EmergencyCtMriCount
        this.tabList[0].reportStatus.editing = res.result.EdittingCount
        this.tabList[0].reportStatus.unEditing = res.result.UnEditCount
      } catch (err) {
        console.log(err)
      }
    },
    async GetDataContent(index, toPage, nPerPage, showLoading = true) {
      //急診/件 搜尋判斷

      this.searchCondition = this.collectSearchCondition(index)
      
      if (index === this.tabs[this.tabIndex].id && showLoading) this.SHOW_LOADING()
      
      let opResult = ''

      try {
        let { actual } = await getReportContents(
          this.searchCondition,
          this.getDataQuery(index)
            .sortBy(this.sortMethod.key, this.sortMethod.desc ? 'descending' : 'ascending')
            .page(toPage, nPerPage)
        )

        // 該頁則停止讀取
        // 登錄所有的筆數 覺得不太安全
        const currentTab = this.tabs.find(({ id }) => id === index)
        if (currentTab) currentTab.count = actual.Count //總筆數

        actual.Items.forEach((item) => {
          //逾期時間判斷
          item.Due = false

          item['StatusName'] = this.retStatusName(item['Status'])
          
          if (item.Status === '71' || !item.ProcedureCompleted === '63') {
            //正式報告不顯示逾期 或 沒有影像到位日期
            item.DueTimeStr = '-'
            item.DueTimeMins = 0
          } else {
            item.DueTimeMins =
              (new Date().getTime() -
                (new Date(item.ProcedureCompleted).getTime() +
                  (item.PatientSourceCode === 'E' || item.EmgFlag == 'Y' ? 24 : item.PatientSourceCode == 'I' ? 72 : 120) * 60 * 60 * 1000)) /
              1000 /
              60

            item.DueTimeStr = `
              ${item.DueTimeMins <= 0 ? '' : '+'}
              ${this.SinglgeNumTo2Digit(Math.floor(Math.abs(item.DueTimeMins) / 60 / 24))}天
              ${this.SinglgeNumTo2Digit(Math.floor((Math.abs(item.DueTimeMins) / 60) % 24))}小時
              ${this.SinglgeNumTo2Digit(Math.floor(Math.abs(item.DueTimeMins) % 60))}分
            `
            if (item.DueTimeMins > 0) item.Due = true
          }

          ;['IssueTime', 'ScheduleTime', 'ProcedureCompleted'].forEach((k) => {
            item[`${k}ForShow`] = item[k] ? this.$moment(item[k]).format('YYYY-MM-DD') : '-'
          })
          // item.FontColor = item.Due ? '#BE77FF' : 'inherit'
          //時間 to string
          item.ProcedureCompleted = this.DateToString(item.ProcedureCompleted, true)
          item.PatientBirthday = this.DateToString(item.PatientBirthday, false)
          //影像到位時間
          item.StudyTime = item.StudyTime == null ? '無影像' : this.DateToString(item.StudyTime, true)
          
          //若為多檢查項目合併為arr, 此處拆解為string with comma
          item.ProcedureNameStr = item.ProcedureName
          
          if (item.ProcedureName instanceof Array) {
            item.ProcedureNameStr = item.ProcedureName.join(',')
          }

          // if(item.ProcedureNameList){
          //   console.log(`item.ProcedureNameList: `, item.ProcedureNameList)
          // }

          if (item.Status === '56'){
            item._rowVariant = 'secondary'
          }

          if (item.Status === '63'){
            item._rowVariant = 'success'
          }

          if (item.Status === '71'){
            item._rowVariant = 'custom-white'
          }
          
          if(item.RequestingServiceId){
            // console.log(`item.RequestingServiceId: `, item.RequestingServiceId)
            let temp = this.departmentList.filter((v)=>{
              return v.value === item.RequestingServiceId
            })
            // console.log(`temp: `,temp)
            if(temp && temp[0]){
              temp = temp[0]
              // item.RequestingServiceId = `${temp.value}-${temp.text}`
              item.RequestingServiceId = `${temp.text}`
            }else{
              item.RequestingServiceId = ''
            }
          }

          // if (item.EmgFlag === 'Y' || item.PatientSourceTypeCode === 'E') {
          //   item._rowVariant = 'danger'
          // }

        })
        return actual
      } catch (err) {
        this.SET_SIDE_MESSAGE({ msg: opResult + '! 請稍後再試.', type: 2 })
      } finally {
        if (index === this.tabs[this.tabIndex].id && showLoading) this.HIDE_LOADING()
        this.tabRowFocusFun()
      }
      setTimeout(() => {
        this.$nextTick(() => this.$refs['vsuperselect'].blur())
      }, 100)
      this.$forceUpdate()
    },
    //門診-2 急診-1 住院-3 健診-6  (全部-0)  //急件
    getDataQuery: function (src) {

      let query = new Query()
      let tp = this.theProcedure
      let chItem = this.selectedCheckItemObj ? this.selectedCheckItemObj.value : null
      
      // if (tp.IssuePhysicianId) {
      //   // query = query.where('IssuePhysicianId', 'equal', tp.IssuePhysicianId.trim(), true)
      //   query = query.where('IssuePhysicianId', 'equal', tp.IssuePhysicianId.trim(), false)
      // }

      if (tp.OrderNo != null && tp.OrderNo != '') {
        query = query.where('AccessionNo', 'contains', tp.OrderNo.trim(), true)
      }

      if (tp.patientId) query = query.where('PatientId', 'equal', tp.patientId.trim(), true)

      if (chItem != null && chItem != '') {
        query = query.where('ProcedureCode', 'contains', chItem)
      }

      if (this.selectedInspectDevice != null && this.selectedInspectDevice != '') query = query.where('Modality', 'equal', this.selectedInspectDevice)

      //(全部)1:急 2:門診 3:住院

      if (src == 'FI0304_all') {
        // query = query.where("PatientSourceTypeCode", "notEqual", "G");
      } else if (src != 'FI0304_pendingAppr') {
        // src != "FI0304_emy" &&
        let code = src == 'FI0304_emy' ? 'E' : src == 'FI0304_door' ? 'O' : src == 'FI0304_live' ? 'I' : this.versionNo === '805' ? 'H' : 'G'
        query = query.where('PatientSourceTypeCode', 'equal', code)
      }

      return query
    },
    convertQueries({ queries }) {
      let orderby = ''
      let filter = ''
      
      filter = queries.reduce((acc, cur) => {
        if (cur.fn === 'onWhere' && cur.e.operator === 'equal') {
          acc.push(`${cur.e.field} eq '${cur.e.value}'`)
        } else if (cur.fn === 'onWhere' && cur.e.operator === 'contains') {
          acc.push(`substringof('${cur.e.value.toLowerCase()}',tolower(${cur.e.field}))`)
        } else if (cur.fn === 'onSortBy') {

          orderby += `$orderby=${cur.e.fieldName}`
        }
        return acc
      }, [])

      return {
        orderby,
        filters: filter.length > 0 ? `$filter=${filter.join(' and ')}` : '',
      }
    },
    downloadPDF() {
      const dateCondition = this.convertDateRange(this.DateRange, 'issueTime').join('&')
      const dateCondition2 = this.convertDateRange(this.produredCompletedDateRange, 'procedureCompleted').join('&')
      const statusConditions = 'status=' + (this.selectedStatus != null ? this.selectedStatus : this.optionsStatus.map(({ value }) => value).join(','))
      const employeeNo = 'employeeNo=' + this.employeeNo
      // const isEmg = this.tabs[this.tabIndex].id === "FI0304_emy" ? "isEmg=true" : "";
      const tabKey = this.tabs[this.tabIndex].id
      let PatientSourceTypeCode =
        tabKey === 'FI0304_door'
          ? "eq 'O'"
          : tabKey === 'FI0304_live'
          ? "eq 'I'"
          : tabKey === 'FI0304_hr'
          ? `eq ${this.versionNo === '805' ? 'H' : 'G'}`
          : tabKey === 'FI0304_emy'
          ? "eq 'E'"
          : ''
      if (PatientSourceTypeCode) PatientSourceTypeCode = 'PatientSourceTypeCode ' + PatientSourceTypeCode
      const orderNo =
        this.theProcedure.OrderNo != null && this.theProcedure.OrderNo != ''
          ? `substringof('${this.theProcedure.OrderNo.toLowerCase()}', tolower(OrderNo))`
          : ''
      const patientId = this.theProcedure.patientId ? `substringof('${this.theProcedure.patientId.toLowerCase()}', tolower(PatientId))` : ''
      const chItem = this.selectedCheckItemObj && this.selectedCheckItemObj.value ? `substringof('${this.selectedCheckItemObj.value}', ProcedureCode)` : ''
      const selectedDevice = this.selectedInspectDevice ? `Modality eq '${this.selectedInspectDevice}'` : ''
      const filterArr = [orderNo, PatientSourceTypeCode, patientId, chItem, selectedDevice].filter((v) => v)
      const filters = filterArr && filterArr.length > 0 ? `$filter=${filterArr.join(' and ')}` : ''
      const orderBy = '$orderby=' + this.sortMethod.key + (this.sortMethod.desc ? ' desc' : '')
      this.SHOW_LOADING('搜尋過久?建議縮小範圍再下載 ')
      getExportBarcode([dateCondition, dateCondition2, statusConditions, employeeNo, patientId, filters, orderBy].filter((v) => v != '').join('&'))
        .then((res) => {
          window.open(res)
        })
        .catch((err) => {
          console.log(err)
          this.SET_SIDE_MESSAGE({ msg: '下載發生錯誤，請稍候再試', type: 2 })
        })
        .finally(() => {
          this.HIDE_LOADING()
        })
      this.StoreSearchConditions()
    },
    getQuery(isClear = false){
      const keyArr = [
        // 報告醫師
        'theProcedure.IssuePhysicianId',
        // 'theProcedure.DxreportPhysicianId',
        // 申請單號
        'theProcedure.OrderNo',
        // 檢查項目
        'selectedCheckItemObj',
        // 檢查儀器
        'selectedInspectDevice',
        // 病歷號
        'theProcedure.patientId',
        // 登打狀態
        'selectedStatus',
        // 報告開始
        'DateRange[0]',
        // 報告結束
        'DateRange[1]',
        // 檢查開始
        'produredCompletedDateRange[0]',
        // 檢查結束
        'produredCompletedDateRange[1]',
      ]

      // this.$route.query.page = undefined
      const query = { ...this.$route.query }

      keyArr.forEach((key) => {
        const item = get(this, key)

        if (item === '' && key === 'theProcedure.IssuePhysicianId') {
          query[key] = ''
        } else if (query[key] && !item) {
          query[key] = undefined
        } else if (item) {
          if (key.includes('DateRange')) {
            query[key] = this.$moment(item).format('YYYY/MM/DD HH:mm:ss')
          }else if (key.includes('selectedCheckItemObj')) {
            if(item.value){
              query[key] = item.value
            }
          }else {
            query[key] = item
          }
        }
      })

      this.$router.push({ query })

      if(isClear){
        if (this.versionNo === '805') {
          if(this.selectedStatus === ''){
            this.theProcedure.IssuePhysicianId = ''
            this.disabledOptionsPhysician = true
          }else if (this.selectedStatus === '63') {
            this.disabledOptionsPhysician = false
          } else {
            this.disabledOptionsPhysician = true
          }
        }
      }
    },
    async SearchConditions() {
      document.activeElement.blur()
      this.getQuery()
      await this.getTabDataSource()
      this.execSearchSave()
    },
    ClearConditions(type = 'clear') {
      this.selectedCheckItemObj = null
      this.isClearing = true
      
      if (this.$refs.vsuperselect) {
        this.$refs.vsuperselect.clearSelection()
        this.$refs['vsuperselect'].blur()
      }

      setTimeout(() => {
        this.isClearing = false
      }, 500)
      
      this.selectedInspectDevice = this.selectedCheckItem = null
      
      if(type === 'clear'){
        ['produredCompletedDateRange', 'DateRange'].forEach((k) => {
            new Array(2).fill().forEach((v, i) => {
              if (this[k] && this[k][i]) {
                this[k][i] = new Date(this.$moment(new Date()).format('YYYY/MM/DD 00:00:00'))
              }
            })
        })
      }

      setTimeout(() => {
        //update...
        // this.selectedStatus = ''

        if(type === 'clear'){
          this.produredCompletedDateRangeSelect = ''
          this.DateRangeSelect = ''

          this.resetSelectDateRage('produredCompletedDateRange')
          this.resetSelectDateRage('DateRange')

          this.produredCompletedDateRange = [null, null]
          this.DateRange = [null, null]
        }

        this.sortMethod = _.cloneDeep({
          key: 'ProcedureCompleted',
          desc: false,
        })

        // this.SearchConditions()
        this.getQuery(true)
        // this.produredCompletedDateRange[0] = null
        // this.produredCompletedDateRange[1] = null

        //add query clear
        this.$router.replace(this.$route.path)
      }, 100)

      // this.DateRange.forEach(d => d = null);
      // this.selectedStatus = process.env.VUE_APP_FIRST_SELECTEDSTATUS
      
      if (this.versionNo === '805') {
        this.theProcedure.IssuePhysicianId = this.userInfo.userId != 'admin' ? this.userInfo.userId : ''
      } else {
        this.theProcedure.DxreportPhysicianId = this.userInfo.userId != 'admin' ? this.userInfo.userId : ''
      }

      ['OrderNo', 'patientId'].forEach((k) => {
        this.theProcedure[k] = ''
      })

      //this.$store.state.Profile4User.id != "admin" ? this.$store.state.Profile4User.id : "",
      // this.SearchConditions();
    },
    //判斷權限是否允許進入此報告狀態登打
    CheckIfReportStatusMeetRoleType(status) {

     if (
        [
          '56', //尚未分派
          '71', //核准送出
          '73', //失敗重傳
          '75', //改版重傳
          '77', //等待同步
          '79', //同步成功
        ].includes(status) ||
        (this.userInfo.roleId == '25' && status == '65') //住院醫師及等待審核
      ) {
        return false
      }
      //主治醫師
      // else if (this.userInfo.roleId == "21") {
      // }
      return true
    },
    async RowClickFunction(rows, id, row) {

      try {
        if (!this.CheckIfReportStatusMeetRoleType(rows.Status)) {
          this.SET_SIDE_MESSAGE({
            msg: '此檢驗單狀態已不允許再做登打動作。',
            type: 2,
          })
          return
        }

        const data = await getActionReportEdit(row.AccessionNo)

        if (data) {
          this.SET_SIDE_MESSAGE({ msg: data, type: 2 })
          return
        }

        this.GetAllExamList(id) // keep this line do not remove and the order of this call should be kept too
        
        this.RouterToSpecificReport(row)

        this.CLEAR_REPORT_STATUS()
        this.SET_REPORT_STATUS(row)
      } catch (error) {
        return { error }
      }
    },
    OnClickMyFavorite({ Status, AccessionNo, PatientId, OrderNo }) {
      if (Status != '71') return false
      this.favorite.no = AccessionNo
      this.favorite.id = PatientId
      this.favorite.orderNo = OrderNo
      this.$refs.win4commentMyFravorite.show()
      this.myFavoriteNote = ''
    },
    OnClickClearReport(e){
      this.tempRevokeItems = null
      this.$refs['reNewReportContent304'].show()
      this.tempRevokeItems = _.cloneDeep(e)
    },
    async revokeReport(){

      let temp = _.cloneDeep(this.tempRevokeItems)

      try{
        this.SHOW_LOADING()
        await postRemoveTempReport(temp.OrderNo)
      }catch(err){
        console.log(`error` , err)
      }finally{
        this.SearchConditions()

        // this.tabList[this.tabIndex].items.forEach((v)=>{
        //   if(v.OrderNo === temp.OrderNo){
        //     this.$nextTick(()=>{
        //       v.Status = '56'
        //       v.StatusName = this.retStatusName(v.Status)
        //       v._rowVariant = 'secondary'
        //     })
        //   }
        // })

        if(
          (temp.ProcedureCodeList && temp.ProcedureCodeList.includes('E4009C'))
          ||
          (temp.ProcedureCodeList && temp.ProcedureCodeList.includes('E4006C'))
          &&
          temp.Modality === 'CR'
        ){
          await putSaveScreeningWarning({
          AccessionNo: temp.AccessionNo,
          ScreeningWarning: -1
          })
        }

        this.HIDE_LOADING()
        this.$refs['reNewReportContent304'].hide()
      }
    },
    RouterToSpecificReport(row) {
      // window.dtcDataList = [...row];
      // const name = row.PatientSourceCode === "S" ? "SubReport" : "FI0301";

      //reset
      if (this.$store.state && this.$store.state.fi0304TabSource) {
        this.$store.unregisterModule('fi0304TabSource')
      }

      const name = 'FI0301'
      const currentTab = this.tabList[this.tabIndex]
      const rowIdx = currentTab.items.findIndex(({ AccessionNo }) => AccessionNo === row.AccessionNo) + 1

      this.$store.registerModule('fi0304TabSource', {
        state: {
          rows: [...currentTab.items],
          query: this.getDataQuery(this.tabs[this.tabIndex].id).sortBy(this.sortMethod.key, this.sortMethod.desc ? 'descending' : 'ascending'),
          searchCondition: this.searchCondition,
          currentKey: currentTab.id,
          rowIdx,
          tabList: this.tabList,
        },
      })

      console.log(`before leave ~ `, this.$route.fullPath)

      this.isBackFromReport = true

      //(save) real selected data
      const keyBackArr = [
        'theProcedure.IssuePhysicianId',
        'theProcedure.OrderNo',
        'selectedCheckItemObj',
        'selectedInspectDevice',
        'theProcedure.patientId',
        'selectedStatus',
        'DateRange[0]',
        'DateRange[1]',
        'produredCompletedDateRange[0]',
        'produredCompletedDateRange[1]',
        'tableIndex',
        'page',
        'sort'
      ]

      keyBackArr.forEach((key) => {
        
        //default
        if(
          key === 'theProcedure.IssuePhysicianId'
        ){
          this.isBackFromReportItems[key] = this.theProcedure.IssuePhysicianId ? this.theProcedure.IssuePhysicianId : ''
        }else if(
          key === 'theProcedure.OrderNo'
        ){
          this.isBackFromReportItems[key] = this.theProcedure.OrderNo ? this.theProcedure.OrderNo : ''
        }else if(
          key === 'selectedCheckItemObj'
        ){
          this.isBackFromReportItems[key] = this[key] && this[key].value ? this[key].value : null
        }else if(
          key === 'selectedInspectDevice'
        ){
          this.isBackFromReportItems[key] = this.selectedInspectDevice ? this.selectedInspectDevice : ''
        }else if(
          key === 'theProcedure.patientId'
        ){
          this.isBackFromReportItems[key] = this.theProcedure.patientId ? this.theProcedure.patientId : ''
        }else if(
          key === 'selectedStatus'
        ){
          this.isBackFromReportItems[key] = this.selectedStatus ? this.selectedStatus : '56,63'
        }else if(
          key === 'tableIndex'
        ){
          this.isBackFromReportItems[key] = this.tabIndex ? this.tabIndex : 0
        }else if(
          key === 'page'
        ){
          this.isBackFromReportItems[key] = this.tabList[this.tabIndex] && this.tabList[this.tabIndex].page ? this.tabList[this.tabIndex].page : null
        }else if(
          key === 'DateRange[0]'
        ){
          console.log('d1', this.DateRange[0])
          this.isBackFromReportItems[`${key}`] = this.DateRange[0] ? this.DateRange[0] : null
        }else if(
          key === 'DateRange[1]'
        ){
          console.log('d2', this.DateRange[1])
          this.isBackFromReportItems[`${key}`] = this.DateRange[1] ? this.DateRange[1] : null
        }else if(
          key === 'produredCompletedDateRange[0]'
        ){
          console.log('pd1', this.produredCompletedDateRange[0])
          this.isBackFromReportItems[`${key}`] = this.produredCompletedDateRange[0] ? this.produredCompletedDateRange[0] : null
        }else if(
          key === 'produredCompletedDateRange[1]'
        ){
          console.log('pd2', this.produredCompletedDateRange[1])
          this.isBackFromReportItems[`${key}`] = this.produredCompletedDateRange[1] ? this.produredCompletedDateRange[1] : null
        }else if(
          key === 'sort'
        ){
          console.log('sort', this.sortMethod)
          this.isBackFromReportItems[key] = this.sortMethod ? this.sortMethod : null
        }
        
      })

      console.log(`can leave`)

      this.$router.push({ name, query: { backpath: this.$route.fullPath } })
    },
    itemChecked() {},
    tabTitle({ label, count, disabled }) {
      return !disabled ? `${label} (${count})` : null
    },
    OpenMultiReport() {
      this.$refs['Window4ReportEdit'].show()
    },
    AssignReport(items) {
      // console.log(this.$logs("Doctor assign report:"));
      this.reportAssignTitle = ' : ' + items.length + '筆報告'
      this.reportsOnAssign = items
      this.$refs.win4assignReport.show()
    },
    CheckIfShowRowCheckBox(item) {
      return item.Status == '56'
    },
    GetParams() {
      if (!this.$refs['twp3']) {
        return null
      }
      this.reportEditTitle = ' : ' + this.$refs['twp3'].checkedItems.length + ' 筆報告'
      let params = {
        accessionNos: this.$refs['twp3'].checkedItems.map(({ AccessionNo }) => AccessionNo),
        dxreportPhysicianId: this.userInfo.userId,
        userId: this.userInfo.userId,
        staffType: this.userInfo.roleId,
      }
      return params //this.$refs.twpMulti[0].checkedItems
    },
    RefreshCheckedItems(items) {
      this.$refs['twp3'].checkedItems.length = 0
      this.$refs['twp3'].OnForceRefresh()
    },
    CloseReportEdit() {
      this.$refs['Window4ReportEdit'].hide()
    },
    confirmCustom() {
      this.SET_REPORTLIST_FIELDS(this.selectedTableFields)
      setTimeout(() => {
        this.SearchConditions()
      }, 250)
    },  
    settingTableFields() {
      this.selectedTableFields = this.tableFields
      this.$refs.showCustomFields.show()
    },
    customFieldEvent(type = 'hide'){
      if(type === 'shown'){
        window.addEventListener('keydown', this.CustomFieldWatch)
      }else{
        window.removeEventListener('keydown', this.CustomFieldWatch)
      }
    },
    CustomFieldWatch(event){
      let keyActual = event.key
      if(keyActual === 'Enter'){
        this.confirmCustom()
        this.$refs['showCustomFields'].hide()
      }
    },
    customFieldEventRevoke(type = 'hide'){
      if(type === 'shown'){
        window.addEventListener('keydown', this.CustomFieldWatchRevoke)
      }else{
        window.removeEventListener('keydown', this.CustomFieldWatchRevoke)
      }
    },
    CustomFieldWatchRevoke(event){
      let keyActual = event.key
      if(keyActual === 'Enter'){
        this.revokeReport()
        this.$refs['reNewReportContent304'].hide()
      }
    },
    formatDateRange(type, dateType){

      switch(type){
        case '1month':
          this[dateType] = [
            new Date(this.$moment(new Date()).add(-1, 'months').format('YYYY/MM/DD 00:00:00')),
            new Date(this.$moment(new Date()).format('YYYY/MM/DD 23:59:59'))
          ]
          break;
        case '1day':
          this[dateType] = [
            new Date(this.$moment(new Date()).add(-1, 'days').format('YYYY/MM/DD 00:00:00')),
            new Date(this.$moment(new Date()).format('YYYY/MM/DD 23:59:59'))
          ]
          break;
        case 'queryDate':
          switch(dateType){
            case 'produredCompletedDateRange':
              this[dateType] = [
                new Date(this.$moment(this.$route.query['produredCompletedDateRange[0]']).format('YYYY/MM/DD 00:00:00')),
                new Date(this.$moment(this.$route.query['produredCompletedDateRange[1]']).format('YYYY/MM/DD 23:59:59'))
              ]
              break;
            case 'DateRange':
              this[dateType] = [
                new Date(this.$moment(this.$route.query['DateRange[0]']).format('YYYY/MM/DD 00:00:00')),
                new Date(this.$moment(this.$route.query['DateRange[1]']).format('YYYY/MM/DD 23:59:59'))
              ]
              break;
          }
          break;
          case 'copyDate':
            this[dateType] = [
              new Date(this.$moment(this[dateType][0]).format('YYYY/MM/DD 00:00:00')),
              new Date(this.$moment(this[dateType][1]).format('YYYY/MM/DD 23:59:59'))
            ]
          break;
        case 'null':
          this[dateType] = [null, null]
          break;
      }
      
    },
    setSearchCondition(){
      
      // queryDate
      if(this.$route.query['produredCompletedDateRange[0]'] && this.$route.query['produredCompletedDateRange[1]']){
        this.formatDateRange('queryDate', 'produredCompletedDateRange')
      }else if(this.$route.query['DateRange[0]'] && this.$route.query['DateRange[1]']){
        this.formatDateRange('queryDate', 'DateRange')
      }

      // copyDate
      if(this.produredCompletedDateRange && this.produredCompletedDateRange[0] && this.produredCompletedDateRange[1]){
        this.formatDateRange('copyDate', 'produredCompletedDateRange')
      }else if(this.Range && this.Range[0] && this.Range[1]){
        this.formatDateRange('copyDate', 'DateRange')
      }
      
    },
    checkSearchDateRange(){

      if(this.produredCompletedDateRange && this.produredCompletedDateRange[0] && this.produredCompletedDateRange[1]){

        let tempDate0 = this.$moment(this.produredCompletedDateRange[0]).format('YYYY/MM/DD')
        let tempDate1 = this.$moment(this.produredCompletedDateRange[1]).format('YYYY/MM/DD')
 
        this.$nextTick(()=>{
          this.resetSelectDateRage('produredCompletedDateRange')
          this.produredCompletedDateRangeSelect = 'custom'
          this.optionsDateSelect1[this.optionsDateSelect1.length - 1].text = `
            ${tempDate0}
            ~
            ${tempDate1}
          `
        })
      }else{
        this.$nextTick(()=>{
          this.resetSelectDateRage('produredCompletedDateRange')
          this.produredCompletedDateRangeSelect = ''
        })
      }

      if(this.DateRange && this.DateRange[0] && this.DateRange[1]){

        let tempDate0 = this.$moment(this.DateRange[0]).format('YYYY/MM/DD')
        let tempDate1 = this.$moment(this.DateRange[1]).format('YYYY/MM/DD')

        this.$nextTick(()=>{
          this.resetSelectDateRage('DateRange')
          this.DateRangeSelect = 'custom'
          this.optionsDateSelect2[this.optionsDateSelect2.length - 1].text = `
            ${tempDate0}
            ~
            ${tempDate1}
          `
        })
      }else{
        this.resetSelectDateRage('DateRange')
        this.DateRangeSelect = ''
      }

    },
    initDateRangeCreate(){
      if(this.selectedStatus === ''){
        this.formatDateRange('1month', 'produredCompletedDateRange')
      }
    },
    initDateRange() {
      this.setSearchCondition()
      this.checkSearchDateRange()
    },
    clearDateRange() {
      this.produredCompletedDateRange = [null, null]
    },
    setDateRange(type, dateType) {
      let resetDate = [null, null]

      switch(type){
        case 'custom':
          switch(dateType){
            case 'produredCompletedDateRange':
              resetDate = [this.produredCompletedDateRange && this.produredCompletedDateRange[0] ? this.produredCompletedDateRange[0] : null, this.produredCompletedDateRange && this.produredCompletedDateRange[1] ? this.produredCompletedDateRange[1] : null]
              break;
            case 'DateRange':
            resetDate = [this.DateRange && this.DateRange[0] ? this.DateRange[0] : null, this.DateRange && this.DateRange[1] ? this.DateRange[1] : null]
              break;
          }
          break;
        case 'recent30':
          resetDate = [
            new Date(this.$moment(new Date()).add(-1, 'months').format('YYYY/MM/DD 00:00:00')),
            new Date(this.$moment(new Date()).format('YYYY/MM/DD 23:59:59'))
          ]
          break;
        case 'recent7':
          resetDate = [
            new Date(this.$moment(new Date()).add(-7, 'days').format('YYYY/MM/DD 00:00:00')),
            new Date(this.$moment(new Date()).format('YYYY/MM/DD 23:59:59'))
          ]
          break;
        case 'recent3':
          resetDate = [
            new Date(this.$moment(new Date()).add(-3, 'days').format('YYYY/MM/DD 00:00:00')),
            new Date(this.$moment(new Date()).format('YYYY/MM/DD 23:59:59'))
          ]
          break;
        case 'recent1':
          resetDate = [
            new Date(this.$moment(new Date()).add(-1, 'days').format('YYYY/MM/DD 00:00:00')),
            new Date(this.$moment(new Date()).format('YYYY/MM/DD 23:59:59'))
          ]
          break;
        case 'yesterday':
          resetDate = [
            new Date(this.$moment(new Date()).add(-1, 'days').format('YYYY/MM/DD 00:00:00')),
            new Date(this.$moment(new Date()).add(-1, 'days').format('YYYY/MM/DD 23:59:59'))
          ]
          break;
        case 'today':
          resetDate = [
            new Date(this.$moment(new Date()).format('YYYY/MM/DD 00:00:00')),
            new Date(this.$moment(new Date()).format('YYYY/MM/DD 23:59:59'))
          ]
          break;
        case '' || null:
          resetDate = [null, null]
          break;
      }

      return resetDate
    },
    initLastStatus(){

      let tempSelecttedStatus = null

      if(this.lastStatus){
        // console.log(`this.lastStatus: `, this.lastStatus)
        // console.log('record selectedStatus',  tempStatusChk)

        let tempStatusChk = null

        if(this.isBackFromReportItems && this.isBackFromReportItems['selectedStatus']){
          tempStatusChk = this.isBackFromReportItems['selectedStatus']
        }

        if(this.lastStatus == '71' && tempStatusChk == '56,63'){
          tempSelecttedStatus = '71'
        }else if(this.lastStatus == '71' && tempStatusChk == '63'){
          tempSelecttedStatus = '71'
        }
      }

      return tempSelecttedStatus

    },
    async GetOptionsRequestingDepartmentSource() {
      try{
        const {actual: { Items }} = await getOptionsRequestingDepartmentSource()
        if(Items && Items.length){
          this.departmentList = Items.map(({ No, Name }) => ({ text: Name, value: No }))
          // console.log(`departmentList: `, this.departmentList)
        }
      }catch(err){
        console.log(`error: `, err)
      }

    },
    tabRowFocusFun(){
      if(this.$refs['twp3']){
        setTimeout(()=>{
          this.$nextTick(() => {
            setTimeout(()=>{
              let target = document.querySelector(`#${this.curTabId} tbody tr`)
              if(target && !this.inputCheck){
                target.focus()
              } 
            }, 150)
          })
        },500)
      }
    },
    inputFocusFun(input = 'PatientId'){
      if(this.$refs[input]){
        setTimeout(()=>{
          this.$nextTick(() => {
            setTimeout(()=>{
              this.$refs[input].focus()
            }, 100)
          })
        },200)
      }
    },
  },
  async created() {

    const keyArr = [
      // 報告醫師
      'theProcedure.IssuePhysicianId',
      // 'theProcedure.DxreportPhysicianId',
      // 申請單號
      'theProcedure.OrderNo',
      // 檢查項目
      'selectedCheckItemObj',
      // 檢查儀器
      'selectedInspectDevice',
      // 病歷號
      'theProcedure.patientId',
      // 登打狀態
      'selectedStatus',
      // 報告開始
      'DateRange[0]',
      // 報告結束
      'DateRange[1]',
      // 檢查開始
      'produredCompletedDateRange[0]',
      // 檢查結束
      'produredCompletedDateRange[1]',
      // tab
      'tableIndex',
    ]

    await this.GetOptionsRequestingDepartmentSource()

    keyArr.forEach((key) => {
      let data

      if (this.$route.query[key]) {
        switch (key) {
          case 'DateRange[0]':
          case 'DateRange[1]':
          case 'produredCompletedDateRange[0]':
          case 'produredCompletedDateRange[1]':
            data = new Date(this.$route.query[key])
            break
          case 'tableIndex':
            data = Number(this.$route.query[key])
            break
          case 'selectedCheckItemObj':
            data = null
            break
          default:
            data = this.$route.query[key]
            break
        }
      }

      if (data) {
        set(this, key, data)
      }
    })
    
    if(this.$route.query){
      if(this.$route.query['selectedCheckItemObj']){
        await this.retCheckItem(this.$route.query['selectedCheckItemObj'])
        this.$nextTick(() => this.$refs['vsuperselect'].selectModel())
      }
    }

    if(!this.isBackFromReport){
      this.initDateRangeCreate()
      this.initDateRange()
    }else{
      if(this.isBackFromReportItems){
        Object.keys(this.isBackFromReportItems).forEach(async(v)=>{
          if(
            v === 'produredCompletedDateRange[0]'
          ){
            this.produredCompletedDateRange[0] = this.isBackFromReportItems[v]
          }else if(
            v === 'produredCompletedDateRange[1]'
          ){
            this.produredCompletedDateRange[1] = this.isBackFromReportItems[v]
          }else if(
            v === 'DateRange[0]'
          ){
            this.DateRange[0] = this.isBackFromReportItems[v]
          }else if(
            v === 'DateRange[1]'
          ){
            this.DateRange[1] = this.isBackFromReportItems[v]
          }
        })
      }
      this.initDateRange()
    }

    this.isBackFromReport = false

    this.tabs = tabTags(this.userInfo.roleId)
    const isBack = !!this.$store.state.fi0301TabSource

    if (this.$store.state.fi0301TabSource) {
      console.log(`from fi0301TabSource`)

      const { searchCondition, currentKey, tabList } = this.$store.state.fi0301TabSource
      this.tabList = tabList
      this.tabIndex = this.tabList.findIndex(({ id }) => id === currentKey)

      if (searchCondition) {
        const searchObj = searchCondition
          .substr(1)
          .split('&')
          .reduce((acc, cur) => {
            const [key, value] = cur.split('=')
            return { ...acc, [key]: value }
          }, {})
        if (searchObj['counterRegisterStart']) {
          this.DateRange = [new Date(searchObj['counterRegisterStart']), new Date(searchObj['counterRegisterEnd'])]
        }
        if (searchObj['procedureCompletedStart']) {
          this.produredCompletedDateRange = [new Date(searchObj['procedureCompletedStart']), new Date(searchObj['procedureCompletedEnd'])]
        }
        if (this.versionNo === '805') {
          this.theProcedure.IssuePhysicianId = searchObj['employeeNo']
        } else {
          this.theProcedure.DxreportPhysicianId = searchObj['employeeNo']
        }
        this.searchCondition = searchCondition
      }

      this.tabs.forEach((tab, idx) => {
        if (this.tabList[idx] && this.tabList[idx].count) {
          tab.count = this.tabList[idx].count
        }
      })


      if(this.isBackFromReportItems && this.isBackFromReportItems['sort']){
        console.log(`got sort back`, this.isBackFromReportItems['sort'])
        this.sortMethod = _.cloneDeep(this.isBackFromReportItems['sort'])
      }

      this.getTabDataSource(false)
      this.$store.unregisterModule('fi0301TabSource')
    } else {
      console.log(`normal~`)

      this.tabList = this.tabs
        .filter(({ id }) => id)
        .map((tab) => ({
          id: tab.id,
          theme: tab.theme,
          page: 1,
          per: 10,
          count: 0,
          items: [],
          emgOnTime: {
            ct: 0,
            ctmr: 0,
          },
          reportStatus: {
            editing: 0,
            unEditing: 0,
          },
        }))
      this.getTabDataSource()
    }

    //初始UI參數
    // this.InitUiParams();
    window.addEventListener('keydown', this.HKWatch) //粗體Method自定義
    window.addEventListener('focusin', this.FocusWatch)
    
    // 取得 App.vue 參照
    this.theProcedure.RequestingPhysicianName = this.userInfo.userName
    
    this.GetOptionsInspectDevice()

    this.GetOptionsDxreportPhysician().then(() => {
      if (this.$store.hasModule('fi0304SearchCondition')) {
        const _params = this.$store.state.fi0304SearchCondition.param
          .substr(1)
          .split('&')
          .reduce((acc, str) => {
            const [key, value] = str.split('=')
            return { ...acc, [key]: value }
          }, {})
        if (_params['status']) this.selectedStatus = _params['status']
        if (_params.hasOwnProperty('employeeNo')) {
          if (this.versionNo === '805') {
            this.theProcedure.IssuePhysicianId = _params['employeeNo']
          } else {
            this.theProcedure.DxreportPhysicianId = _params['employeeNo']
          }
          // this.optionsDxreportPhysician.find(({text,value})=>value === _params['employeeNo']);
        }

        if (_params['OrderNo']) this.theProcedure.OrderNo = _params['OrderNo']
        if (_params['procedureCompletedStart'] && _params['procedureCompletedEnd'])
          this.DateRange = [_params['procedureCompletedStart'], _params['procedureCompletedEnd']]

        if (isBack) {
          setTimeout(() => {
            console.log(`isBack~`)
            this.SearchConditions()

          }, 500) // to do
        }
      }
    })

    this.getCheckItem()

    //retrive data form store
    // console.log(`created: `, this.isBackFromReportItems)

    if(this.isBackFromReportItems){
      Object.keys(this.isBackFromReportItems).forEach(async(v)=>{
        if(
          v === 'theProcedure.OrderNo'
        ){
          this.theProcedure.OrderNo = this.isBackFromReportItems[v]
        }else if(
          v === 'selectedCheckItemObj'
        ){
          if(this.versionNo !== '805'){
            await this.retCheckItem(this.isBackFromReportItems[v])
          this.$nextTick(() => this.$refs['vsuperselect'].selectModel())
          }
        }else if(
          v === 'selectedInspectDevice'
        ){
          this.selectedInspectDevice = this.isBackFromReportItems[v]
        }else if(
          v === 'theProcedure.patientId'
        ){
          this.theProcedure.patientId = this.isBackFromReportItems[v]
        }else if(
          v === 'produredCompletedDateRange[0]'
        ){
          this.produredCompletedDateRange[0] = this.isBackFromReportItems[v]
        }else if(
          v === 'produredCompletedDateRange[1]'
        ){
          this.produredCompletedDateRange[1] = this.isBackFromReportItems[v]
        }else if(
          v === 'DateRange[0]'
        ){
          this.DateRange[0] = this.isBackFromReportItems[v]
        }else if(
          v === 'DateRange[1]'
        ){
          this.DateRange[1] = this.isBackFromReportItems[v]
        }
      })
    }

    //(clear) real record selected data
    this.isBackFromReportItems = {}
    this.lastStatus = null
    this.lastAccessionNo = null
    this.lastRelease = false

  },
  async mounted() {

    // this.SetFocusOnInputAccessionNo(1000)

    if(this.tabList[this.tabIndex]){
      if (this.tabList[this.tabIndex].items && this.tabList[this.tabIndex].items.length > 0) {
        // 返回作業用
        const { page, per } = this.tabList[this.tabIndex]
        setTimeout(() => {
          this.$refs['twp3'].toPage = this.$refs['twp3'].PagingCurrentPage = page
          this.$refs['twp3'].PagingRowPerPage = per
        }, 200)
        }
    }
    
    useHubStatusChanged(this.getTabDataSource)

  },
  watch: {
    tabIndex: {
      handler(val) {
        const { page, per } = this.tabList[val]        
        if(this.$refs['twp3']){
          this.$refs['twp3'].toPage = page
          this.$refs['twp3'].PagingRowPerPage = per
          this.$refs['twp3'].OnForceRefresh()

          this.tabRowFocusFun()
        }        
      },
      // immediate: true,
      deep: true
    },
    isPacAuto: {
      handler(newVal, oldVal) {
        if (
          oldVal
          &&
          newVal
          &&
          newVal !== oldVal
        ) {
          this.action_savingPersonalSetting()
        }
      },
      immediate: true,
      deep: true,
    },
    isSaveAuto: {
      handler(newVal, oldVal) {
        if (
          oldVal
          &&
          newVal
          &&
          newVal !== oldVal
        ) {
          this.action_savingPersonalSetting()
        }
      },
      immediate: true,
      deep: true,
    },
    isObjAuto: {
      handler(newVal, oldVal) {
        if (
          oldVal
          &&
          newVal
          &&
          newVal !== oldVal
        ) {
          this.action_savingPersonalSetting()
        }
      },
      immediate: true,
      deep: true,
    },
    isMphrase: {
      handler(newVal, oldVal) {
        if (
          oldVal
          &&
          newVal
          &&
          newVal !== oldVal
        ) {
          this.action_savingPersonalSetting()
        }
      },
      immediate: true,
      deep: true,
    },
    produredCompletedDateRange: {
      handler(val) {
        if(val === null){
          this.produredCompletedDateRange = [null, null]
        }
      },
      immediate: true,
      deep: true,
    },
    DateRange: {
      handler(val) {
        if(val === null){
          this.DateRange = [null, null]
        }
      },
      immediate: true,
      deep: true,
    },
    produredCompletedDateRangeSelect: {
      handler(val) {
        this.produredCompletedDateRange = _.cloneDeep(this.setDateRange(val, 'produredCompletedDateRange'))
      },
      immediate: true,
      deep: true,
    },
    DateRangeSelect: {
      handler(val) {
        this.DateRange = _.cloneDeep(this.setDateRange(val, 'DateRange'))
      },
      immediate: true,
      deep: true,
    }
  },
  destroyed() {
    window.removeEventListener('keydown', this.HKWatch) // 解除監聽器:攔截 KeyPress
    window.removeEventListener('focusin', this.FocusWatch)
  },
}
</script>

<style scoped>
/* -- 這行必須放在這裡, 才有作用 --*/
.themeBlack .input-group-text {
  background-color: rgba(0, 0, 0, 0.7);
  color: rgba(255, 255, 255, 0.7);
}

.themeBlack .form-control {
  /* background-color: rgba(0, 0, 0, 0.7); */
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
  height: 344px;
  white-space: nowrap;
  overflow: auto;
}

</style>

<style>
/* schedule 取消 button  */
.themeBlack .e-cancel {
  background-color: rgba(205, 92, 92, 1) !important;
  color: rgba(255, 255, 255, 1) !important;
}

/* schedule 確認 button  */
.themeBlack .e-apply {
  background-color: rgba(70, 130, 180, 1) !important;
  color: rgba(255, 255, 255, 1) !important;
}

/*div.darkTheme table{
  color: #000 !important;
}*/

</style>

<style lang="scss">
.super-select-container {
  .super-select-input {
    background-color: transparent !important;
    input {
      background-color: transparent !important;
    }
  }
}

#CheckDataPickerR,
#CheckDataPickerR1{
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

#patientIdPre,
#modalityPre {
  .input-group-prepend{
    min-width: 90px;
    .input-group-text{
      width: 100%;
    }
  }
}

</style>

<style lang="scss" scoped>

#admin-toast__toast_outer {
  position: fixed;
}
.super-select-container {
  --boxHeight: 38px !important;
  --itemHeight: 38px !important;
  --boxWidth: 100% !important;
  flex: 1;
  .super-select-input {
    background-color: transparent !important;
    border-radius: 0px 5px 5px 0px;
    color: rgba(255, 255, 255, 1) !important;
  }
}

.div-grid {
  display: grid;
  grid-gap: 3px;
  grid-row-gap: 3px;
  padding: 0;
}

/deep/ .e-float-input.e-control-wrapper {
  margin-top: 0;
  width: unset;
  flex: 1 0 0;
}

/deep/ .e-float-text.e-label-top {
  display: none;
}
/deep/ table.b-table td span[title] {
  // pointer-events: none;
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

.dateSelectDiv {
  &.abs{
    position: absolute;
    top: 0;
    right: auto;
    bottom: 0;
    left: 0;
    z-index: 999
  }

  padding: 0 4px;
  width: calc(100% - 33px);
  height: 34px;
  //line-height: 26px;
  background: #fff;

  box-sizing: border-box;
}

</style>
