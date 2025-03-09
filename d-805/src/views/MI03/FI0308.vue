<!-- 
input:
//取得報告醫師列表 (搜尋住院醫師, 主治醫師)
GetOptionsDxreportPhysician()

//取得檢查項目列表
GetOptionsCheckItem()

//取得儀器類別列表
GetOptionsInspectDevice()

//取得檢查單
//params: 
//index: 病患來源索引值 0:全部exclude健診, 1:急診含急件, 2:門診, 3:住院, 5:健診
//toPage: 分頁碼
//nPerPage: 每頁資料筆數
GetDataContent(index, toPage, nPerPage)


傳出資料: 檢查單資訊
output: examData 

sample data:

-->
<template>
  <div id="FI0304" class="pageContent pb-1">
    <b-card no-body class="mx-1" bg-variant="transparent">
      <b-card-header class="bg-primary text-white cardHeader">
        <b-row no-gutters>
          <b-col cols="6" class="float-left text-left"
            >個案追蹤清單 用戶: [{{ $store.state.Profile4User.staffName }}]
            {{ $store.state.Profile4User.employeeName }}</b-col
          >
        </b-row>
      </b-card-header>
      <b-card-text class="text-left p-1">
        <div class="search-section d-grid grid-col-6" style="grid-gap: 2px;">
          
          <b-input-group prepend="病歷號">
            <b-input v-model="theProcedure.PatientId" />
          </b-input-group>

          <b-input-group prepend="病患姓名">
            <b-input
              v-model="theProcedure.PatientName"
              @compositionstart="nameComposing = true"
              @compositionend="nameComposing = false"
            />
          </b-input-group>

          <b-input-group prepend="儀器">
            <b-select v-model="theProcedure.Modality" :options="optionsInspectDevice" @change="changeModality" />
          </b-input-group>

          <b-input-group prepend="檢查時間">
            <div id="InputDatePicker1" class="form-control" style="padding: 0;">
              <div class="dateSelectDiv abs">
                <b-select v-model="DateRangeSelect" :options="optionsDateSelect1" @change="(e)=>{optionsDateChangeE(e, 'DateRange')}" style="border: none; border-radius: none; height: 100%;" />
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

          <b-input-group prepend="申請單號">
            <b-input v-model="theProcedure.AccessionNo" ref="inputAccessionNo" />
          </b-input-group>

          <b-input-group prepend="備註">
            <b-input
              v-model="theProcedure.PfcComment"
              @compositionstart="nameComposing = true"
              @compositionend="nameComposing = false"
            />
          </b-input-group>

          <!-- <b-input-group prepend="報告版本">
            <b-input v-model="theProcedure.DxrVersion" />
          </b-input-group> -->

        </div>
        <div class="text-right" style="grid-column: 4 / span 2; padding: 4px 0 0 0">
          <b-button class="mr-2" variant="primary" @click="SearchConditions">
            <font-awesome-icon icon="search" />進行查詢
          </b-button>
          <b-button class="mr-2" variant="success" @click="ClearConditions">
            <font-awesome-icon icon="eraser" />清除條件
          </b-button>
          <b-button variant="danger" @click="downloadExcel">
            <font-awesome-icon icon="download" />下載Excel
          </b-button>
        </div>
      </b-card-text>
    </b-card>

    <!--
		<b-card no-body id="cardTabs" class="my-1 mx-1 py-2 px-2 border rounded">
    -->
    <b-card no-body id="cardTabs" class="m-1" bg-variant="transparent">
      <div
        id="block4QueryResult"
        class="mr-1 rounded"
        style="border: 0px solid #ced4da; height: 760px"
        overflow="auto"
      >
        <b-row no-gutters>
          <b-col>
            <!--
								<twp v-if="index == 5" ref="twp3" CheckBox1Head="" v-bind:CheckBox1Func="itemChecked" :CheckBox1Lead="true" v-bind:FieldConfig="tableConfig4QueryResult" v-bind:RowData="tableContent4QueryResult[index]" v-bind:OpButton1Func="RowClickFunction"></twp>
								<twp v-else ref="twp3" v-bind:FieldConfig="tableConfig4QueryResult" v-bind:RowData="tableContent4QueryResult[index]" v-bind:OpButton1Func="RowClickFunction"></twp>
            -->
            <twp
              ref="twp"
              v-if="isMounted"
              TableId="favoriteCaseList"
              heightForScroll="670px"
              :CheckBox1Lead="true"
              :FieldConfig="tableConfig4QueryResult"
              :DataFetch="GetDataContent"
              :enableRowClick="true"
              OpButton1Text="編輯"
              :OpButton1Func="RowClickFunction"
              :OpButton3Func="showConfirmDeleteFavorite"
              OpButton3Text="刪除"
            ></twp>
          </b-col>
        </b-row>
      </div>
      <!--
			<b-tabs v-model="tabIndex" fill content-class="px-1 py-1" title-link-class="bg-primary">
				<b-tab card v-for="(tab, index) in tabs" :disabled="tab.disabled" v-bind:key="tab.label" :title="tabTitle(tab)" :title-link-class="linkClass(index)">
					<b-row no-gutters>
						<b-col>
							<div id="block4QueryResult" class="rounded" style="border:1px solid #ced4da; min-height:610px;">
								<twp v-if="index == 4" ref="twp3" CheckBox1Head="" v-bind:CheckBox1Func="itemChecked" :CheckBox1Lead="true" v-bind:FieldConfig="tableConfig4QueryResult" v-bind:RowData="tableContent4QueryResult[index]" v-bind:OpButton1Func="RowClickFunction"></twp>
								<twp v-else ref="twp3" v-bind:FieldConfig="tableConfig4QueryResult" v-bind:RowData="tableContent4QueryResult[index]" v-bind:OpButton1Func="RowClickFunction"></twp>
							</div>
						</b-col>
					</b-row>
				</b-tab>
			</b-tabs>
      -->
      <!-- <b-tabs v-model="tabIndex" fill title-link-class="bg-primary">
        <b-tab card v-for="(tab, index) in tabs" :disabled="tab.disabled" v-bind:key="tab.label" :title="tabTitle(tab)" :title-link-class="linkClass(tab, index)">
          <div id="block4QueryResult" class="mr-1 rounded" style="border:0px solid #ced4da; height:680px;" overflow="auto">
            <b-row no-gutters>
              <b-col>
                
                <twp
                  v-if="tab.id == 'FI0304_hr'"
                  ref="twpMulti"
                  :TableId="tab.id"
                  heightForScroll="570px"
                  CheckBox1Head
                  :CheckBox1Func="itemChecked"
                  :CheckBox1Lead="true"
                  :FieldConfig="tableConfig4QueryResult"
                  :DataFetch="GetDataContent"
                  :MultiSelectFunc1="OpenMultiReport"
                  :MultiSelectFunc2="AssignReport"
                  selectFunc2String="分派其他醫師"
                  :enableRowClick="true"
                  :OpButton1Func="RowClickFunction"
                  :OpButton2Func="OnClickMyFavorite"
                  OpButton2Text="加入喜愛案件"
                  :ifSendBackTheList="true"
                  :CheckIfShowRowCheckBox="CheckIfShowRowCheckBox"
                ></twp>

                <twp
                  v-else-if="tab.id == 'FI0304_pendingAppr'"
                  ref="twp3"
                  :TableId="tab.id"
                  heightForScroll="570px"
                  CheckBox1Head
                  :CheckBox1Func="itemChecked"
                  :CheckBox1Lead="true"
                  :FieldConfig="tableConfig4QueryResult"
                  :DataFetch="GetDataContent"
                  :MultiSelectFunc2="AssignReport"
                  :MultiSelectFunc3="BatchApprove"
                  selectFunc2String="分派其他醫師"
                  selectFunc3String="批次審核上傳"
                  :enableRowClick="true"
                  :OpButton1Func="RowClickFunction"
                  :OpButton2Func="OnClickMyFavorite"
                  OpButton2Text="加入喜愛案件"
                  :ifSendBackTheList="true"
                ></twp>

                <twp
                  v-else
                  ref="twp3"
                  :TableId="tab.id"
                  heightForScroll="570px"
                  CheckBox1Head
                  :CheckBox1Func="itemChecked"
                  :CheckBox1Lead="true"
                  :FieldConfig="tableConfig4QueryResult"
                  :DataFetch="GetDataContent"
                  :MultiSelectFunc2="AssignReport"
                  selectFunc2String="分派其他醫師"
                  :enableRowClick="true"
                  :OpButton1Func="RowClickFunction"
                  :OpButton2Func="OnClickMyFavorite"
                  OpButton2Text="加入喜愛案件"
                  :ifSendBackTheList="true"
                ></twp>
              </b-col>
            </b-row>
          </div>
        </b-tab>
      </b-tabs>-->
    </b-card>

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
        @CloseReportEdit="CloseReportEdit"
        @RefreshCheckedItems="RefreshCheckedItems"
      />
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
        <span class="zhTW">分派報告{{ reportAssignTitle }}</span>
      </template>
      <div class="mr-1 rounded">
        <b-row no-gutters>
          <b-col class="p-2">
            <b-input-group>
              <b-input-group-prepend>
                <b-button class="bg-primary" style="border-style: none">選擇分派醫師</b-button>
              </b-input-group-prepend>
              <b-select
                v-model="selectedAssignDoctor"
                :options="optionsAssignDoctor"
                @change="ChangeAssignDoctor"
              />
            </b-input-group>

            <!-- <b-input-group prepend='檢查室'>
                <b-select v-model='selectedLabRoom' :options='optionsLabRoom' @change='ReloadDataContent'  style="background-color:orange;"/>
            </b-input-group>-->
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

            <!-- <b-input-group prepend='檢查室'>
                <b-select v-model='selectedLabRoom' :options='optionsLabRoom' @change='ReloadDataContent'  style="background-color:orange;"/>
            </b-input-group>-->
          </b-col>
        </b-row>
      </div>
    </b-modal>

    <b-modal
      ref="win4deleteMyFravorite"
      hide-footer
      header-bg-variant="warning"
      header-text-variant="dark"
      body-class="py-1 px-1 themeModal"
    >
      <template slot="modal-title">
        <font-awesome-icon icon="user-friends" class="mr-1" />
        <span class="zhTW">刪除個案追蹤</span>
      </template>
      <div class="mr-1 rounded">
        <b-row no-gutters>
          <b-col sm="12" class="p-1 text-left">
            <b-input-group v-if="tempDelete" prepend="申請單號">
              <b-input v-model="tempDelete.AccessionNo" readonly />
            </b-input-group>
            <!-- <span v-if="tempDelete" class="zhTW">申請單號: {{ tempDelete.AccessionNo }}</span> -->
          </b-col>
          <b-col sm="12" class="p-1 text-left">
            <b-input-group v-if="tempDelete" prepend="報告版本">
              <b-input v-model="tempDelete.DxrVersion" readonly />
            </b-input-group>
            <!-- <span v-if="tempDelete" class="zhTW">報告版本: {{ tempDelete.DxrVersion }}</span> -->
          </b-col>
          <b-col sm="12" class="p-1 text-left">
            <b-input-group v-if="tempDelete" prepend="病歷號碼">
              <b-input v-model="tempDelete.PatientId" readonly />
            </b-input-group>
            <!-- <span v-if="tempDelete" class="zhTW">病歷號: {{ tempDelete.PatientId }}</span> -->
          </b-col>
          <b-col sm="12" class="p-1 text-left">
            <b-input-group v-if="tempDelete" prepend="病患姓名">
              <b-input v-model="tempDelete.PatientName" readonly />
            </b-input-group>
            <!-- <span v-if="tempDelete" class="zhTW">病患姓名: {{ tempDelete.PatientName }}</span> -->
          </b-col>
        </b-row>

        <b-row no-gutters>
          <b-col class="p-2 text-right">
            <b-button variant="success" @click="ConfirmDeleteFavorite">
              <font-awesome-icon icon="user-check" />確認刪除
            </b-button>
            <b-button variant="danger" @click="CancelDeleteFavorite" class="ml-4">
              <font-awesome-icon icon="times-circle" />取消
            </b-button>

            <!-- <b-input-group prepend='檢查室'>
                <b-select v-model='selectedLabRoom' :options='optionsLabRoom' @change='ReloadDataContent'  style="background-color:orange;"/>
            </b-input-group>-->
          </b-col>
        </b-row>
      </div>
    </b-modal>
  </div>
</template>

<script>
import Vue from 'vue';
import twp from '@/components/TWPv5';
import reportEdit from '@/components/ReportEdit';
import * as configs from '@/config';
import { DateRangePickerPlugin } from '@syncfusion/ej2-vue-calendars';
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex';
import { DataManager, WebApiAdaptor, Predicate, Query } from '@syncfusion/ej2-data';
import { dateFormatMixin } from '@/SupportLib_J.js';
import _ from 'lodash'
import moment from "moment";

import FormHelper from '@/library/FormHelper';
import {
  getFavoriateExcel,
} from '@/assets/service/dataManager'


Vue.use(DateRangePickerPlugin)

Date.prototype.toJSON = function(){
  return moment(this).format('YYYY-MM-DD HH:mm:ss')
}

export default {
  name: 'FI0304',
  components: { twp, reportEdit },
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
      selectedCheckItem: null,
      selectedInspectDevice: null,
      optionsCheckItem: [],
      optionsInspectDeviceTemp: [],
      optionsInspectDevice: [],
      theProcedure: {
        AccessionNo: '', //申請單號(大單號)
        RequestingPhysicianName: '開單醫師',
        DxreportPhysicianId: this.$store.state.Profile4User.id,
        PatientId: '',
        PatientName: '',
        PfcComment: '',
      },
      tableConfig4QueryResult: (() => {
        switch (process.env.VUE_APP_VERSION_NO) {
          case '805':
            return [
              // {
              //   key: 'PatientSourceTypeName',
              //   label: '來源',
              //   sortable: true,
              //   thClass: 'no-wrap',
              //   tdClass: 'no-wrap',
              // },
              {
                key: 'PatientSourceTypeCode',
                label: '來源',
                sortable: true,
                thClass: 'no-wrap',
                tdClass: 'no-wrap',
              },
              {
                key: 'PatientId',
                label: '病歷號',
                sortable: false,
                thClass: 'no-wrap',
                tdClass: 'no-wrap font-weight-bold',
              },
              {
                key: 'PatientName',
                label: '病患姓名',
                sortable: false,
                thClass: 'text-nowrap',
                tdClass: 'no-wrap',
              },
              {
                key: 'Modality',
                label: '儀器',
                sortable: true,
                thClass: 'no-wrap',
                tdClass: 'no-wrap',
              },
              {
                key: 'ProcedureCompleted',
                label: '檢查日期',
                sortable: true,
                thClass: 'text-nowrap',
                tdClass: 'no-wrap',
              },
              {
                key: 'PfcComment',
                label: '備註',
                sortable: false,
                thClass: 'text-nowrap',
                tdClass: 'no-wrap text-left MX-W-350',
              },
              {
                key: 'SubscribeDate',
                label: '加入日期',
                sortable: false,
                thClass: 'text-nowrap',
                tdClass: 'no-wrap',
              },
              {
                key: 'OrderNo',
                label: '申請單號',
                sortable: false,
                thClass: 'no-wrap',
                tdClass: 'no-wrap font-weight-bold',
              },
              // {
              //   key: 'DxrVersion',
              //   label: '報告版本',
              //   sortable: true,
              //   thClass: 'text-nowrap',
              //   tdClass: 'no-wrap font-weight-bold',
              // },
              {
                key: 'OpColumnType1',
                label: '操作',
                sortable: false,
                thClass: 'text-nowrap',
                tdClass: 'no-wrap font-weight-bold',
              },
            ];
          default:
            return [
              {
                key: 'AccessionNo',
                label: '申請單號',
                sortable: true,
                thClass: 'no-wrap',
                tdClass: 'no-wrap',
              },
              {
                key: 'PatientId',
                label: '病例編號',
                sortable: true,
                thClass: 'no-wrap',
                tdClass: 'no-wrap',
              },
              {
                key: 'PatientName',
                label: '病患姓名',
                sortable: true,
                thClass: 'text-nowrap',
                tdClass: 'no-wrap font-weight-bold',
              },
              {
                key: 'DxrVersion',
                label: '報告版本',
                sortable: true,
                thClass: 'text-nowrap',
                tdClass: 'no-wrap font-weight-bold',
              },
              {
                key: 'PfcComment',
                label: '備註',
                sortable: true,
                thClass: 'text-nowrap',
                tdClass: 'no-wrap font-weight-bold',
              },
              {
                key: 'SubscribeDate',
                label: '加入日期',
                sortable: true,
                thClass: 'text-nowrap',
                tdClass: 'no-wrap font-weight-bold',
              },
            ];
        }
      })(),
      casePriorityCode: 'Y',
      selectedPatientSource: 0,
      optionsPatientSource: [],
      tabIndex: 0,

      // 佈景主題
      themePacks: {
        themeBlack: false,
        //emeBlackName: 'themeBlack',
        themeBlackName: configs.ThemeId4Black,
      },
      min: 1,
      DateRange: [null, null],
      //
      reportEditTitle: '',
      reportAssignTitle: '',
      //
      isWhite: false,
      isBlack: true,
      isGray: false,
      //
      selectedStatus: '51',
      //
      ObjApp: null,
      //
      selectedAssignDoctor: null,
      reportsOnAssign: [],
      //
      tempDelete: null,
      //
      nameComposing: false,
      reportPhrase: '',
      isMounted: true,
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
    };
  },
  computed: {
    ...mapGetters(['getThemeColors']),
    optionsStatus() {
      if (this.userInfo.roleId != '21') {
        if (this.userInfo.userId != this.theProcedure.DxreportPhysicianId) {
          return [
            { value: '51', text: '自動分派' },
            { value: '61', text: '退件重寫' },
            { value: '63', text: '報告撰寫' },
          ];
        } else {
          return [
            { value: '51', text: '自動分派' },
            { value: '61', text: '退件重寫' },
            { value: '63', text: '報告撰寫' },
            { value: '71', text: '正式報告' },
          ];
        }
      } else if (this.userInfo.userId != this.theProcedure.DxreportPhysicianId) {
        return [
          { value: '51', text: '自動分派' },
          { value: '61', text: '退件重寫' },
          { value: '63', text: '報告撰寫' },
          { value: '65', text: '等待審核' },
        ];
      } else {
        return [
          { value: '51', text: '自動分派' },
          { value: '61', text: '退件重寫' },
          { value: '63', text: '報告撰寫' },
          { value: '65', text: '等待審核' },
          { value: '71', text: '正式報告' },
        ];
      }
    },
    tabs() {
      if (this.userInfo.roleId == '21') {
        return [
          { label: '全部', id: 'FI0304_all', count: 0, disabled: false },
          { label: '急診/件', id: 'FI0304_emy', count: 0, disabled: false },
          { label: '門診', id: 'FI0304_door', count: 0, disabled: false },
          { label: '住院', id: 'FI0304_live', count: 0, disabled: false },
          {
            label: '待審核',
            id: 'FI0304_pendingAppr',
            count: 0,
            disabled: false,
          },
          { label: '', id: '', count: 0, disabled: true },
          { label: '健診', id: 'FI0304_hr', count: 0, disabled: false },
        ];
      } else {
        return [
          { label: '全部', id: 'FI0304_all', count: 0, disabled: false },
          { label: '急診/件', id: 'FI0304_emy', count: 0, disabled: false },
          { label: '門診', id: 'FI0304_door', count: 0, disabled: false },
          { label: '住院', id: 'FI0304_live', count: 0, disabled: false },
          { label: '', id: '', count: 0, disabled: true },
          { label: '健診', id: 'FI0304_hr', count: 0, disabled: false },
        ];
      }
    },
    optionsAssignDoctor() {
      let arr = this.optionsDxreportPhysician.filter(
        (i) => i.value != this.theProcedure.DxreportPhysicianId
      );
      arr.unshift({ value: null, text: '請選擇' });
      return arr;
    },
    OptionsCasePriority() {
      // 案件優先度
      return [
        { text: '急件', value: 'Y' },
        { text: '一般', value: 'N' },
      ];
    },
  },
  methods: {
    ...mapMutations([
      'SHOW_LOADING',
      'HIDE_LOADING',
      'SET_MODALITIES',
    ]),
    changeModality(e){
      console.log(`changeModality: `, e)
      this.theProcedure.Modality = e
    },
    async downloadExcel(){

      try{
          console.log(`downloadExcel ~`)

          let params = []
          let employeeNo = this.theProcedure.DxreportPhysicianId;

          params.push(`EmployeeNo=${employeeNo}`)

          if(!this.DateRange[0] && !this.DateRange[1]){
            this.ObjApp.TimingMessage('請選取檢查時間範圍', 2)
            return
          }else{

            this.SHOW_LOADING();

            if(this.DateRange[0]){
              params.push(`startDate=${this.DateRange[0].toJSON()}`)
            }

            if(this.DateRange[1]){
              params.push(`endDate=${this.DateRange[1].toJSON()}`)
            }

            if(this.theProcedure.Modality){
              params.push(`$filter=substringof('${this.theProcedure.Modality}',Modality)`)
            }

          }

          if(params && params.length){
            params = params.join('&')
          }
          
          await getFavoriateExcel(params).then((r) => {
              FormHelper.downloadFile(r.Url);
          });

      }catch(err){
        console.log(`error: `, err)
      }finally{
        this.HIDE_LOADING();
      }

    },
    setDateRange(type, dateType) {
      let resetDate = [null, null]

      switch(type){
        case 'custom':
          switch(dateType){
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
    resetSelectDateRage(type){
      switch(type){
        case 'DateRange':
          this.optionsDateSelect1[this.optionsDateSelect1.length - 1].text = '自訂範圍'
          break
      }
    },
    optionsDateChangeE(evt, type){
      switch(type){
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
        case 'DateRange':
          if(this.DateRange){
            this.$nextTick(()=>{
              this.optionsDateSelect1[this.optionsDateSelect1.length - 1].text = evt.text
            })
          }
          break;
      }
    },
    dateRangeCloseE(evt, type){
      switch(type){
        case 'DateRange':
          if(this.DateRange && this.DateRange[0] && this.DateRange[1]){
            this.$nextTick(()=>{
              this.DateRangeSelect = 'custom'
            })
          }
          break;
      }
    },
    //時間比較
    diff_mins(dt2, dt1) {
      var diff = (dt2.getTime() - dt1.getTime()) / 1000;
      diff /= 60;
      return Math.abs(Math.round(diff));
    },
    //批次審核上傳
    async BatchApprove(items) {
      let status = 71;
      // 啟動 報告存檔 作業
      console.log(this.$logs('save report:' + status));

      //
      // 報告存檔 - 後台存取
      this.ObjApp.WaitingShow();
      //
      //開始儲存
      let _this = this;
      let opStatus = false;
      let opResult = '存取時發生錯誤!';

      let subPath = '/report/Approval?employeeNo=' + this.userInfo.userId;
      let dataBody = [];
      items.forEach((i) => dataBody.push(i.AccessionNo));
      await window.axios
        .post(subPath, dataBody)
        .then((e) => {
          opStatus = true;
          _this.$refs['twp3'].forEach((t) => {
            if (t.TableId && t.TableId == 'FI0304_pendingAppr') {
              t.OnForceRefresh();
              t.OnCancelAllSelects();
            }
          });
        })
        .catch(function (error) {
          opStatus = false;
          opResult += error;
        });

      this.ObjApp.WaitingHide();
      //
      if (opStatus) {
        this.ObjApp.TimingMessage('資料已完成批次審核上傳');
      } else {
        this.ObjApp.TimingMessage(opResult + '! 請稍後再試.', 2);
      }
      return opStatus;
    },

    //
    //確認分派報告
    async ConfirmAssignReport() {
      if (this.selectedAssignDoctor == null) {
        this.ObjApp.TimingMessage('請選擇分派醫師', 2);
        return;
      }
      // 報告存檔 - 後台存取
      this.ObjApp.WaitingShow();

      let opStatus = false;
      let opResult = '存取時發生錯誤!';
      //console.log(this.theReport)
      let accessionNos = [];
      this.reportsOnAssign.forEach((obj) => {
        accessionNos.push(obj.AccessionNo);
      });
      let dataBody = {
        ReportPhysicianId: this.selectedAssignDoctor,
        AccessionNos: accessionNos,
      };
      let subPath = '/exam/AssignReport';
      let _this = this;
      await window.axios
        .put(subPath, dataBody)
        .then((e) => {
          opStatus = true;

          _this.$refs['twp3'].forEach((t) => {
            if (t.TableId && t.TableId == _this.tabs[_this.tabIndex].id) {
              t.OnForceRefresh();
              t.OnCancelAllSelects();
            }
          });
        })
        .catch(function (error) {
          opStatus = false;
          opResult += error;
        });

      this.ObjApp.WaitingHide();
      //
      if (opStatus) {
        this.ObjApp.TimingMessage('已完成分派作業');
      } else {
        this.ObjApp.TimingMessage(opResult + '! 請稍後再試.', 2);
      }

      this.SearchConditions();
      this.$refs.win4assignReport.hide();
      return opStatus;
    },
    //
    //取消分派
    CancelAssignReport() {
      this.$refs.win4assignReport.hide();
    },
    //
    //變更分派醫師
    ChangeAssignDoctor() {},
    //
    //變更搜尋登打狀態 立刻刷新list
    ChangeStatus() {
      this.SearchConditions();
    },
    //
    //變更報告醫師
    ChangeSearchConditions() {
      //
      //如果Search的報告醫師不是自己 且 搜尋登打狀態設定為 正式報告, 則調回 '自動分派' 以避免搜尋到非本人可編輯之正式報告
      if (this.theProcedure.DxreportPhysicianId != this.userInfo.userId) {
        if (this.selectedStatus == '71') {
          this.selectedStatus = '51';
        }
      }
      //
      this.SearchConditions();
    },
    //
    //初始頁面UI 暫存參數
    InitUiParams() {
      if (window.favoriteList_tabIndex) {
        this.tabIndex = window.favoriteList_tabIndex;
      }

      if (window.favoriteList_AccessionNo) {
        this.theProcedure.AccessionNo = window.favoriteList_AccessionNo;
      }

      if (window.favoriteList_selectedCheckItem) {
        this.selectedCheckItem = window.favoriteList_selectedCheckItem;
      }

      if (window.favoriteList_selectedInspectDevice) {
        this.selectedInspectDevice = window.favoriteList_selectedInspectDevice;
      }

      if (window.favoriteList_selectedStatus) {
        this.selectedStatus = window.favoriteList_selectedStatus;
      }

      if (window.favoriteList_DateRange) {
        this.DateRange = window.favoriteList_DateRange;
      }
    },
    //
    StoreUiParams() {
      // window.reportList_tabIndex = this.tabIndex;
    },
    //
    StoreSearchConditions() {
      window.favoriteList_ReportPhysician = this.theProcedure.DxreportPhysicianId;
      window.favoriteList_AccessionNo = this.theProcedure.AccessionNo;
      window.favoriteList_AccessionNo = this.theProcedure.PfcComment;
      window.favoriteList_selectedCheckItem = this.selectedCheckItem;
      window.favoriteList_selectedInspectDevice = this.selectedInspectDevice;
      window.favoriteList_selectedStatus = this.selectedStatus;
      window.favoriteList_DateRange = this.DateRange;
    },
    //keypressed偵測
    HKWatch(event) {
      if (event.code === 'Enter' || event.code === 'NumpadEnter') {
        // //粗體Method自定義
        if (!this.nameComposing) this.SearchConditions();
      }
    },
    //
    //
    SetFocusOnInputAccessionNo() {
      //console.log(this.$logs('setFocus'))
      setTimeout(() => {
        //console.log(this.$logs('setFocus.inner'))
        this.$nextTick(() => this.$refs.inputAccessionNo.focus());
      }, 1000);
    },
    GetRawData() {
      console.log(this.$logs());
      let methodName = 'get fake_report_list.json';
      console.log(this.$logs('Call', methodName));
      return this.$http
        .get('fake_report_list.json')
        .then((r) => {
          console.log(this.$logs('Done', methodName));
          return r.data;
        })
        .catch((e) => {
          this.$stdErr(err, methodName);
        });
    },

    //
    //取得醫師列表
    async GetOptionsDxreportPhysician() {
      console.log(this.$logs());

      //
      let itemPack = null;
      let convertedCollections = [
        // { value: null, text: '請選擇' },
      ];
      //
      let subPath = '../Employee/SelectNoList?staffType=21,25,28&getAll=false';
      //
      this.ObjApp.WaitingShow();
      let opStatus = false;
      //
      //不同類型醫師或打字員代碼的query
      // let query = new Query()
      // let predicateState = new Predicate("StaffType", "equal", "25")//住院醫師
      // predicateState = predicateState.or("StaffType", "equal", "28")//打字員
      // predicateState = predicateState.or("StaffType", "equal", "21")//主治
      // query = query.where(predicateState)
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
        });

      itemPack.Items.forEach((i) => {
        let collection = { value: i.No, text: i.Name };
        convertedCollections.push(collection);
      });
      this.optionsDxreportPhysician = convertedCollections;
    },
    //
    //取得儀器類別列表
    async GetOptionsInspectDevice() {
      // // console.log(this.$logs());
      // let itemPack = null;
      // let convertedCollections = [{ value: null, text: '請選擇' }];
      // //
      // let subPath = '../device/SelectNoList';
      // //
      // this.ObjApp.WaitingShow();
      // // let opStatus = false;
      // //
      // await new DataManager({
      //   url: configs.publicPath + subPath,
      //   adaptor: new WebApiAdaptor(),
      //   crossDomain: true,
      // })
      //   .executeQuery(new Query())
      //   .then((r) => {
      //     itemPack = r.actual; //資料;
      //     opStatus = true;
      //   });

      // itemPack.Items.forEach((i) => {
      //   let collection = { value: i.No, text: i.Name };
      //   convertedCollections.push(collection);
      // });
      // this.optionsInspectDevice = convertedCollections;

      let subPath = '../exam/GetModalityNoList'
      const { actual } = await new DataManager({
        url: configs.publicPath + subPath,
        adaptor: new WebApiAdaptor(),
        crossDomain: true,
      }).executeQuery(new Query())
      
      this.optionsInspectDeviceTemp = actual.map((v) => ({ text: v.No, value: v.No }))
      this.optionsInspectDevice = [{ value: null, text: '' }].concat(this.optionsInspectDeviceTemp)
      
      // for legacy use
      let tempModality = actual.map((v) => (v.No))
      this.SET_MODALITIES(tempModality)
    },
    //
    //取得檢查項目列表
    async GetOptionsCheckItem() {
      console.log(this.$logs());

      //
      let itemPack = null;
      let convertedCollections = [{ value: null, text: '請選擇' }];
      //
      let subPath = '../checkItem/SelectNoList';
      //
      this.ObjApp.WaitingShow();
      let opStatus = false;
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
        });

      itemPack.Items.forEach((i) => {
        let collection = { value: i.No, text: i.Name };
        convertedCollections.push(collection);
      });
      this.optionsCheckItem = convertedCollections;
    },
    //
    //
    async GetAllExamList(index) {
      console.log(this.$logs());
      //
      let itemPack = null;
      //
      //判別日期查詢 (日期查詢無法寫在query物件裡, 只好從url帶參數)
      let subPath = '../exam/List';
      if (this.DateRange[0] != null || this.DateRange[1] != null) {
        let dateCondition = '';
        if (this.DateRange[0] != null)
          dateCondition += 'procedureCompletedStart=' + this.DateRange[0].toJSON() + '&';

        if (this.DateRange[1] != null)
          dateCondition += 'procedureCompletedEnd=' + this.DateRange[1].toJSON();

        subPath += '?' + dateCondition;
      }
      //
      //判斷檢單狀態
      let statusConditions = 'status=';
      if (this.selectedStatus != null) statusConditions += this.selectedStatus;
      else {
        let allStatus = '';
        this.optionsStatus.filter((i) => {
          if (i.value != null) allStatus += i.value + ',';
        });
        allStatus = allStatus.replace(/,\s*$/, '');
        statusConditions += allStatus;
      }

      //等待審核 tab
      if (index == 'FI0304_pendingAppr') {
        statusConditions = 'status=65';
      }

      if (subPath.includes('?')) {
        subPath += '&' + statusConditions;
      } else {
        subPath += '?' + statusConditions;
      }

      //急診/件 搜尋判斷
      if (index == 'FI0304_emy') {
        if (subPath.includes('?')) {
          subPath += '&isEmg=true';
        } else {
          subPath += '?isEmg=true';
        }
      }

      subPath += '&employeeNo=' + this.theProcedure.DxreportPhysicianId;

      console.log('search dateRange:' + this.DateRange[0] + '~' + this.DateRange[1]);
      //
      let opResult = '';
      let opStatus = false;
      window.dtcUrl = configs.publicPath + subPath;
      window.dtcQuery = this.getDataQuery(index);
    },
    //
    //
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
        let refDataTime = [...datetime]
        let tempTime = null

        if (!refDataTime[0] && refDataTime[1]) {
          refDataTime[0] = new Date(this.$moment(refDataTime[1]).add(-1, 'days').format('YYYY/MM/DD 00:00:00'))
          refDataTime[1] = new Date(this.$moment(refDataTime[1]).format('YYYY/MM/DD 23:59:59'))
        } else if (!refDataTime[1] && refDataTime[0]) {
          refDataTime[0] = new Date(this.$moment(refDataTime[0]).format('YYYY/MM/DD 00:00:00'))
          refDataTime[1] = new Date(this.$moment(refDataTime[0]).add(1, 'days').format('YYYY/MM/DD 23:59:59'))
        }

        if (refDataTime[0] == refDataTime[1]) {
          refDataTime[0] = new Date(this.$moment(refDataTime[0]).format('YYYY/MM/DD 00:00:00'))
          refDataTime[1] = new Date(this.$moment(refDataTime[0]).add(1, 'days').format('YYYY/MM/DD 23:59:59'))
        }

        tempTime = refDataTime.reduce((ac, dt, idx) => {
          if(idx === 0){
            dt = new Date(this.$moment(dt).format('YYYY/MM/DD 00:00:00'))
          }else{
            dt = new Date(this.$moment(dt).format('YYYY/MM/DD 23:59:59'))
          }
          return ac.concat(`${idx === 0 ? 'start' : 'end'}${key}=${dt.toJSON()}`)
        }, [])

        return tempTime
      }
    },
    patientSourceTypeCodeDisplay (data) {
        switch (data) {
          case 'O':
            return '門診'
          case 'I':
            return '住院'
          case 'E':
            return '急診'
          case 'H':
            return '健檢'
          default:
            return '門診'
        }
    },
    async GetDataContent(index, toPage, nPerPage) {
      console.log(this.$logs());
      //
      let itemPack = null;
      //
      //判別日期查詢 (日期查詢無法寫在query物件裡, 只好從url帶參數)
      let subPath = '../favoriteCases/GetEmployeeNo';

      let employeeNo = this.theProcedure.DxreportPhysicianId;

      if (subPath.includes('?')) {
        subPath += '&EmployeeNo=' + employeeNo;
      } else {
        subPath += '?EmployeeNo=' + employeeNo;
      }
      
      if(this.DateRange && this.DateRange[0] && this.DateRange[1]){
        console.log(`GetDataContent > DateRange: `, this.DateRange)

        let param = [
          { range: this.DateRange, key: 'Date' },
        ].reduce((ac, { range, key }) => {
          return ac.concat(this.convertDateRange(range, key))
        }, [])

        if(param && param.length){
          param = param.join('&')
          subPath += `&${param}`
        }
      }

      //
      this.ObjApp.WaitingShow();
      let opResult = '';
      let opStatus = false;
      let _this = this;
      //
      await new DataManager({
        url: configs.publicPath + subPath,
        adaptor: new WebApiAdaptor(),
        crossDomain: true,
      })
        .executeQuery(this.getDataQuery().sortBy('ProcedureCompleted').page(toPage, nPerPage))
        .then((r) => {
          itemPack = r.actual; //資料;
          opStatus = true;
        });

      this.ObjApp.WaitingHide();
      //
      if (opStatus) {
        // this.ObjApp.TimingMessage('資料已完成存檔作業')
      } else {
        this.ObjApp.TimingMessage(opResult + '! 請稍後再試.', 2);
      }

      itemPack.Items.filter((i) => {
        //時間 to string
        if(i.SubscribeDate){
          i.SubscribeDate = this.DateToString(i.SubscribeDate, true);
        }
        
        if(i.ProcedureCompleted){
          i.ProcedureCompleted = this.DateToString(i.ProcedureCompleted, true)
        }

        if(i.PatientSourceTypeCode){
          i.PatientSourceTypeCode = this.patientSourceTypeCodeDisplay(i.PatientSourceTypeCode)
        }
      });

      // this.$forceUpdate();

      return itemPack;
    },
    //門診-2 急診-1 住院-3 健診-6  (全部-0)  //急件
    getDataQuery: function () {
      let query = new Query();

      console.log(query.queries);

      //TODO - remove the codes below when api is rephrased for settled data schema
      let tp = this.theProcedure;

      if (tp.AccessionNo != null && tp.AccessionNo != '')
        query = query.where('AccessionNo', 'contains', tp.AccessionNo.trim(), true);

      if (tp.PatientId != null && tp.PatientId != '')
        query = query.where('PatientId', 'contains', tp.PatientId.trim(), true);

      if (tp.DxrVersion != null && tp.DxrVersion != '')
        query = query.where('DxrVersion', 'contains', tp.DxrVersion);

      if (tp.PatientName != null && tp.PatientName != '')
        query = query.where('PatientName', 'contains', tp.PatientName);

      if (tp.PfcComment != null && tp.PfcComment != '')
        query = query.where('PfcComment', 'contains', tp.PfcComment);

      if (tp.Modality != null && tp.Modality != '')
        query = query.where('Modality', 'contains', tp.Modality);

      // if(this.DateRange && this.DateRange[0] && this.DateRange[1]){
      //   let dr = this.DateRange
      //   if(dr[0] != null && dr[0] != ''){
      //     query = query.where('SubscribeDate', 'greaterthan', dr[0]);
      //   }
      //   if(dr[1] != null && dr[1] != ''){
      //     query = query.where('SubscribeDate', 'lessthan', dr[1]);
      //   }
      // }

      console.log(`query: `, query)

      // query = query.where("DxreportPhysicianId", "contains", this.theProcedure.DxreportPhysicianId)

      return query;
    },
    SearchConditions() {
      this.$refs.twp.OnForceRefresh();
      this.StoreSearchConditions();
    },
    ClearConditions() {
      this.selectedCheckItem = null;
      this.selectedInspectDevice = null;
      this.theProcedure.AccessionNo = '';
      this.theProcedure.PatientId = '';
      this.theProcedure.PatientName = '';
      this.theProcedure.DxrVersion = '';
      this.theProcedure.PfcComment = '';
      this.theProcedure.Modality = null;
      this.DateRange = [null, null];
      this.DateRangeSelect = '';
      this.resetSelectDateRage('DateRange')

      this.SearchConditions();
    },
    //
    //判斷權限是否允許進入此報告狀態登打
    CheckIfReportStatusMeetRoleType(status) {
      if (
        status == '56' || //尚未分派
        status == '71' || //核准送出
        status == '73' || //失敗重傳
        status == '75' || //改版重傳
        status == '77' || //等待同步
        status == '79' //同步成功
      ) {
        return false;
      }

      //住院醫師
      if (this.userInfo.roleId == '25') {
        if (status == '65') {
          //等待審核
          return false;
        }
      }
      //主治醫師
      else if (this.userInfo.roleId == '21') {
        console.log(`roleId = 21`)
      }
      return true;
    },
    showConfirmDeleteFavorite(x) {
      this.$refs.win4deleteMyFravorite.show();
      this.$refs.win4deleteMyFravorite.id = x.Id;
      this.tempDelete = x;
    },
    CancelDeleteFavorite() {
      this.$refs.win4deleteMyFravorite.hide();
    },
    //
    //刪除個案
    async ConfirmDeleteFavorite() {
      let passedId = this.tempDelete.Id;

      // 啟動 報告存檔 作業
      console.log(this.$logs('delete my favorite'));

      //
      // 報告存檔 - 後台存取
      this.ObjApp.WaitingShow();
      //
      //開始儲存
      let _this = this;
      let opStatus = false;
      let opResult = '存取時發生錯誤!';

      let subPath = '/api/FavoriteCases/' + passedId;

      await window.axios
        .delete(subPath)
        .then((e) => {
          opStatus = true;
          _this.$refs.win4deleteMyFravorite.hide();
          _this.$refs.twp.OnForceRefresh();
        })
        .catch(function (error) {
          opStatus = false;
          opResult += error;

          _this.$refs.win4deleteMyFravorite.hide();
        });

      this.ObjApp.WaitingHide();
      //
      if (opStatus) {
        this.ObjApp.TimingMessage('資料已完成作業');
      } else {
        this.ObjApp.TimingMessage(opResult, 2);
      }
      return opStatus;
    },

    RowClickFunction(x, SrcParamId) {
      let data = {
        sourceIndex: SrcParamId,
        dataList: x,
      };
      //alert(JSON.stringify(x));
      // this.GetAllExamList(SrcParamId); // keep this line do not remove and the order of this call should be kept too
      this.DirectToF0309(x);
      // let dataList =
      // this.DirectToF0301(dataList)
    },
    OnClickMyFavorite(x) {},
    DirectToF0309(x) {
      // console.log(`Row Function Button Clicked. (${x.length})`);
      //this.$router.replace(this.BasePath + "/" + x.guid);
      window.favoriteData = x;
      let params = {
        AccessionNo: this.theProcedure.AccessionNo,
        PatientId: this.theProcedure.PatientId,
        DxrVersion: this.theProcedure.DxrVersion,
        PatientName: this.theProcedure.PatientName,
        ToPage: this.$refs.twp.toPage,
      };
      this.$router.replace({ name: 'FI0309', params: params });
      //{ path: '/MI03/FI0301', name: 'FI0301', component: () => import('./views/MI03/FI0301.vue') },
    },
    itemChecked(x) {},

    linkClass(tab, idx) {
      if (tab.disabled) return null;

      if (this.tabIndex === idx) {
        if (tab.id == 'FI0304_emy') return ['bg-danger', 'text-white', 'font-weight-bold'];
        else if (tab.id == 'FI0304_pendingAppr')
          return ['bg-warning', 'text-black', 'font-weight-bold'];
        else return ['bg-primary', 'text-white', 'font-weight-bold'];
      } else {
        if (tab.id == 'FI0304_emy') {
          if (this.themePacks.themeBlack)
            return ['bg-dark', 'text-danger', 'font-weight-bold', 'border-secondary'];
          else return ['bg-light', 'text-danger', 'font-weight-bold', 'border-secondary'];
        } else if (tab.id == 'FI0304_pendingAppr') {
          if (this.themePacks.themeBlack)
            return ['bg-dark', 'text-warning', 'font-weight-bold', 'border-secondary'];
          else return ['bg-light', 'text-warning', 'font-weight-bold', 'border-secondary'];
        } else {
          if (this.themePacks.themeBlack)
            return ['bg-dark', 'text-info', 'font-weight-bold', 'border-secondary'];
          else return ['bg-light', 'text-info', 'font-weight-bold', 'border-secondary'];
        }
      }
    },
    ThemeSwitch(color) {
      // Theme:Black 切換
      //
      // this.themePacks.themeBlack = !this.themePacks.themeBlack
      this.themePacks.themeBlack = color !== 'white';
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

      //連動改變table component的背景主題
      this.SwtchTableTheme();

      console.log(this.$logs(this.$IsThemeBlack() ? 'Black' : 'White'));
    },
    SwtchTableTheme() {
      this.$refs.twp.UsingThemeBlack = this.$IsThemeBlack();
      this.$refs.twp.OnForceRefresh();
    },
    // ThemeSwitch() {
    // 	// Theme:Black 切換
    // 	//
    // 	this.themePacks.themeBlack = !this.themePacks.themeBlack
    // 	//
    // 	let activate = this.themePacks.themeBlack
    // 	let className = this.themePacks.themeBlackName
    // 	const el = document.body
    // 	//
    // 	if (activate) {
    // 		el.classList.add(className)
    // 	} else {
    // 		el.classList.remove(className)
    // 	}

    // 	this.$refs['twp3'].forEach(element => element.switchThemeBlack(this.themePacks.themeBlack))
    // 	this.$refs['twpMulti'].forEach(element => element.switchThemeBlack(this.themePacks.themeBlack))

    // 	console.log(this.$logs(this.$IsThemeBlack() ? 'Black' : 'White'))
    // },
    tabTitle(tab) {
      if (!tab.disabled) return tab.label + ' (' + tab.count + ')';
      else return null;
    },
    OpenMultiReport(items) {
      this.$refs['Window4ReportEdit'].show();
    },
    AssignReport(items) {
      console.log(this.$logs('Doctor assign report:'));
      this.reportAssignTitle = ' : ' + items.length + '筆報告';
      this.reportsOnAssign = items;
      this.$refs.win4assignReport.show();
    },
    CheckIfShowRowCheckBox(item) {
      if (item.Status == '51') return true;
      else return false;
    },
    GetParams() {
      if (this.$refs.twpMulti === undefined) return null;

      this.reportEditTitle = ' : ' + this.$refs.twpMulti[0].checkedItems.length + ' 筆報告';
      let params = {
        accessionNos: this.$refs.twpMulti[0].checkedItems,
        dxreportPhysicianId: this.userInfo.userId,
        userId: this.userInfo.userId,
        staffType: this.userInfo.roleId,
      };
      return params; //this.$refs.twpMulti[0].checkedItems
    },
    RefreshCheckedItems(items) {
      this.$refs['twpMulti'].find((t) => t.OnForceRefresh());
      items.forEach((i) => {
        this.$refs['twpMulti'].find((t) => {
          t.RemoveItemFromChecked(i);
        });
      });
    },
    CloseReportEdit() {
      this.$refs['Window4ReportEdit'].hide();
    },

    setDefaultBackgroundColor() {
      // 引入 Theme:Black, 日後再調成是從 個人設定 中轉入
      let cls = localStorage['theme-modal-bg-color'];
      this.isWhite = cls == 'white' || !cls;
      this.isBlack = cls == 'black';
      this.isGray = !this.isWhite && !this.isBlack && cls == '#868e96';
      !cls ? (cls = 'white') : '';
      this.ThemeSwitch(cls);
      if (!this.isWhite) {
        document.documentElement.style.setProperty('--theme-modal-bg-color', cls);
      }

      document.addEventListener('fullscreenchange', () => {
        // document.fullscreenElement will point to the element that
        // is in fullscreen mode if there is one. If there isn't one,
        // the value of the property is null.
        document.querySelector('#blkReportInput').scrollTop = 0;
        if (document.fullscreenElement) {
          this.fullScreen = true;
        } else {
          this.fullScreen = false;
          document.querySelector('.close').click();
        }
      });
    },
  },
  created() {
    //
    //初始UI參數
    // this.InitUiParams();
    //
    let methodName = 'created';
    //
    //
    window.addEventListener('keydown', this.HKWatch); //粗體Method自定義
    // 取得 App.vue 參照
    let obj = this.$GetApp(this);

    if (obj) {
      this.ObjApp = obj[0];
      this.VueNestLevel = obj[1];
      console.log(this.$logs(`Vue Nesting Level ${this.VueNestLevel}`, methodName));
    } else {
      console.log(this.$logs('Fail to get App.vue ref.', methodName));
    }

    // this.optionsCheckItem = checkItem.Options()
    // this.optionsPatientSource = patientSource.Options()
    this.theProcedure.RequestingPhysicianName = this.userInfo.userName;
    // this.GetOptionsCheckItem();
    this.GetOptionsInspectDevice();
    // this.GetOptionsDxreportPhysician();
  },
  mounted() {
    //
    if (this.$route.params.AccessionNo)
      this.theProcedure.AccessionNo = this.$route.params.AccessionNo;
    if (this.$route.params.PatientId) this.theProcedure.PatientId = this.$route.params.PatientId;
    if (this.$route.params.DxrVersion) this.theProcedure.DxrVersion = this.$route.params.DxrVersion;
    if (this.$route.params.PatientName)
      this.theProcedure.PatientName = this.$route.params.PatientName;
    if (this.$route.params.ToPage) this.$refs.twp.toPage = this.$route.params.ToPage;

    // 引入 Theme:Black, 日後再調成是從 個人設定 中轉入
    // this.ThemeSwitch()
    // this.setDefaultBackgroundColor();

    //set focus 在申請單號
    this.SetFocusOnInputAccessionNo();
  },
  beforeDestroy: function () {
    console.log(this.$logs('Before destroy'));
    this.StoreUiParams();
  },
  destroyed() {
    console.log(`${this.$logs()}`);
    // 解除 Theme:Black
    const el = document.body;
    el.classList.remove(this.themePacks.themeBlackName);
    //
    // 解除監聽器:攔截 KeyPress
    window.removeEventListener('keydown', this.HKWatch);
  },
  watch: {
    selectedPatientSource(newName, oldName) {},
    DateRange: {
      handler(val) {
        console.log(`w > DateRange: `, val)
        
        if(val === null){
          this.DateRange = [null, null]
        }
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
  }
};
</script>

<style scoped>
/* -- 這行必須放在這裡, 才有作用 --*/
.themeBlack .input-group-text {
  background-color: rgba(0, 0, 0, 0.7);
  color: rgba(255, 255, 255, 0.7);
}

.themeBlack .form-control {
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
  height: 344px;
  white-space: nowrap;
  overflow: auto;
}

.themeBlack select {
  color: #fff;
  background-color: rgba(0, 0, 0, 0.7);
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
.PfcComment {
  width: 500px;
}
</style>

<style lang="scss" scoped>

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

<style lang="scss">
  #InputDatePicker1{
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