<template>
  <div
    id="FI0304"
    class="pageContent pb-1"
  >
    <b-card
      no-body
      class="mx-1 border"
      bg-variant="transparent"
    >
      <b-card-header class="bg-warning text-dark cardHeader">
        <b-row no-gutters>
          <b-col
            cols="12"
            class="float-left text-left font-weight-bold"
          >報告待打清單 用戶: [{{ $store.state.Profile4User.staffName }}] {{ $store.state.Profile4User.employeeName }}</b-col>
        </b-row>
      </b-card-header>
      <b-card-text class="text-left py-1">
        <div
          class="search-section d-grid grid-col-5"
          style="grid-gap: 2px;"
        >
          <b-input-group prepend="報告醫師">
            <b-select
              v-model="theProcedure.DxreportPhysicianId"
              :options="optionsDxreportPhysician"
              @change="ChangeSearchConditions"
            />
          </b-input-group>

          <!-- 申請單號 AccessionNo -->
          <b-input-group prepend="檢查單號">
            <b-input
              v-model="theProcedure.OrderNo"
              ref="inputAccessionNo"
            />
          </b-input-group>

          <b-input-group
            prepend="檢查項目"
            class="bg-white"
          >
            <!-- @change="ChangeSearchConditions" -->
            <v-super-select
              v-if="!isClearing"
              ref="vsuperselect"
              placeholder="請選擇"
              v-model="selectedCheckItemObj"
              :items="optionsCheckItem"
              :noneFoundText="'無此筆資料'"
              style="z-index:99;"
            ></v-super-select>
            <div
              v-else
              style="padding: 7px 0 0 17px"
            >
              請選擇
            </div>
          </b-input-group>
          <!-- @change="ChangeSearchConditions" -->
          <b-input-group prepend="檢查儀器">
            <b-select
              v-model="selectedInspectDevice"
              :options="optionsInspectDevice"
            />
          </b-input-group>

          <b-input-group prepend="病歷號">
            <b-input
              v-model="theProcedure.patientId"
              ref="PatientId"
            />
          </b-input-group>

          <b-input-group prepend="登打狀態">
            <b-select
              v-model="selectedStatus"
              :options="optionsStatus"
              @change="SearchConditions"
            />
          </b-input-group>

          <b-input-group prepend="報告開始">
            <ejs-datetimepicker
              floatLabelType="Always"
              :placeholder="' '"
              v-model="DateRange[0]"
              :step="60"
              :format="timeFormat"
              :allowEdit="true"
              :showClearButton="true"
            />
          </b-input-group>

          <b-input-group prepend="報告結束">
            <ejs-datetimepicker
              floatLabelType="Always"
              :placeholder="' '"
              v-model="DateRange[1]"
              :step="60"
              :format="timeFormat"
              :allowEdit="true"
              :showClearButton="true"
            />
          </b-input-group>

          <b-input-group prepend="檢查開始">
            <ejs-datetimepicker
              floatLabelType="Always"
              :placeholder="' '"
              v-model="produredCompletedDateRange[0]"
              :step="60"
              :format="timeFormat"
              :allowEdit="true"
              :showClearButton="true"
            />
          </b-input-group>

          <b-input-group prepend="檢查結束">
            <ejs-datetimepicker
              floatLabelType="Always"
              :placeholder="' '"
              v-model="produredCompletedDateRange[1]"
              :step="60"
              :format="timeFormat"
              :allowEdit="true"
              :showClearButton="true"
            />
          </b-input-group>
          <div
            class="text-right"
            style="grid-column: 4 / span 2;"
          >

            <b-button
              variant="success"
              @click="ClearConditions"
            >
              <font-awesome-icon icon="eraser" />清除條件 </b-button>

            <b-button
              class="ml-1"
              variant="primary"
              @click="SearchConditions"
            >
              <font-awesome-icon icon="search" />進行查詢 </b-button>
            <b-button
              class="ml-1"
              variant="primary"
              @click="downloadPDF"
            >
              <font-awesome-icon icon="search" />下載pdf </b-button>

            <b-button
              class="ml-1"
              variant="secondary"
              @click="settingTableFields"
            >
              <font-awesome-icon icon="table" />設定表格項目</b-button>
          </div>
        </div>
      </b-card-text>
    </b-card>

    <b-card
      no-body
      id="cardTabs"
      class="m-1"
      bg-variant="transparent"
    >
      <!-- <div class="div-grid grid-col-6">
        <b-button
          v-for="(tab, index) in tabs.filter(({ id }) => id)"
          :disabled="isFetchData"
          :key="tab.label + '_' + tab.count"
          :variant="index === tabIndex ? tab.theme : 'outline-secondary'"
          :class="{ 'grid-column-span-6': tab.id === 'FI0304_hr' && index === 4 }"
          v-text="tabTitle(tab)"
          @click.stop="tabIndex = index"
        />
      </div> -->
      <twp
        ref="twp3"
        v-if="tabList.length > 0"
        :key="'twp-' + tableFields.length + tabs[tabIndex].id"
        :TableId="tabs[tabIndex].id"
        :DataFetch="updateTableSource"
        :initToPage="tabList[tabIndex].page"
        heightForScroll="570px"
        CheckBox1Head
        :isNeedSorting="false"
        :CheckBox1Func="itemChecked"
        :CheckBox1Lead="true"
        :FieldConfig="displayTableField"
        :MultiSelectFunc1="tabs[tabIndex].id === 'FI0304_hr' ? OpenMultiReport : null"
        :MultiSelectFunc2="AssignReport"
        :MultiSelectFunc3="tabs[tabIndex].id == 'FI0304_pendingAppr' ? BatchApprove : null"
        selectFunc2String="分派其他醫師"
        :selectFunc3String="tabs[tabIndex].id === 'FI0304_hr' ? '' : '批次審核上傳'"
        :enableRowClick="true"
        :OpButton1Func="RowClickFunction"
        :OpButton2Func="OnClickMyFavorite"
        OpButton2Text="加入個案追蹤"
        :ifSendBackTheList="true"
        :checkIfDisableOpButton2Func="checkIfDisableOpButton2Func"
        :sortChangeFunc="sortChanged"
        no-local-sorting
        :specialColumn="[
          { pos: 4, label: '報告預覽', text: '報告預覽', event: tbodyMouseEvent, type: 'hoverText' },
          { pos: 1, label: '加成', img: require('@/assets/additions.png'), event: ()=>{}, type: 'image' }
        ]"
      />
      <transition name="fade">
        <div
          class="preview-report rounded p-2 position-fixed border"
          :style="`left: ${preReportPosition.x}px; top: ${preReportPosition.y}px;`"
          v-if="this.preReportId"
        >
          <div
            v-if="this.preReportContents[this.preReportId]==='loading'"
            class="d-flex justify-content-center align-items-center"
          >
            <b-spinner
              type="grow"
              label="Spinning"
            />
          </div>
          <div
            v-else
            :class="{'d-flex justify-content-center align-items-center': this.preReportContents[this.preReportId]==='no data'}"
            v-text="this.preReportContents[this.preReportId]"
          />
        </div>
      </transition>

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
        <font-awesome-icon
          icon="edit"
          class="mr-1"
        />
        <span class="zhTW">登打報告{{ reportEditTitle }}</span>
      </template>

      <reportEdit
        :GetParams="GetParams"
        :physicianId="theProcedure.DxreportPhysicianId"
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
        <font-awesome-icon
          icon="user-friends"
          class="mr-1"
        />
        <span class="zhTW">分派報告{{ reportAssignTitle }}</span>
      </template>
      <div class="mr-1 rounded">
        <b-row no-gutters>
          <b-col class="p-2">
            <b-input-group>
              <b-input-group-prepend>
                <b-button
                  class="bg-primary"
                  style="border-style: none;"
                >選擇分派醫師</b-button>
              </b-input-group-prepend>
              <b-select
                v-model="selectedAssignDoctor"
                :options="optionsAssignDoctor"
                @change="ChangeAssignDoctor"
              />
            </b-input-group>
          </b-col>
        </b-row>

        <b-row no-gutters>
          <b-col class="p-2 text-right">
            <b-button
              variant="success"
              @click="ConfirmAssignReport"
            >
              <font-awesome-icon icon="user-check" />確認分派 </b-button>
            <b-button
              variant="danger"
              @click="CancelAssignReport"
              class="ml-4"
            >
              <font-awesome-icon icon="times-circle" />取消 </b-button>
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
        <font-awesome-icon
          icon="user-friends"
          class="mr-1"
        />
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
            class="mx-1"
            no-resize
            rows="9"
            v-model="myFavoriteNote"
            style="height:142px; background-color: var(--themeBgColor); color: var(--themeTextColor);"
          ></b-textarea>
        </b-row>
        <b-row no-gutters>
          <b-col class="p-2 text-right">
            <b-button
              variant="success"
              @click="ConfirmAddFavorite"
            >
              <font-awesome-icon icon="user-check" />確認加入 </b-button>
            <b-button
              variant="danger"
              @click="CancelAddFavorite"
              class="ml-4"
            >
              <font-awesome-icon icon="times-circle" />取消 </b-button>
          </b-col>
        </b-row>
      </div>
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
          :options="tableConfig4QueryResult.map(({key, label})=>({text: label, value: key}))"
        ></b-form-checkbox-group>
      </b-form-group>
    </b-modal>

  </div>
</template>
<script>
import Vue from "vue";
import twp from "@/components/TWPv5";
import reportEdit from "@/components/ReportEdit";
import * as configs from "@/config";
import { DateRangePickerPlugin } from "@syncfusion/ej2-vue-calendars";
import VSuperSelect from "v-super-select";
import { mapGetters, mapMutations, mapActions } from "vuex";
import { DataManager, WebApiAdaptor, Query } from "@syncfusion/ej2-data";
import { dateFormatMixin } from "@/SupportLib_J.js";
import { getExportBarcode, getReportContents, getOptionsReportDrSource, postFavoriteCases, examAssignReport, getReportByAccessionNo } from "@/assets/service/dataManager.js";
import { FI0304TableField, tabTags } from "./defaultData.js";

Vue.use(DateRangePickerPlugin);
export default {
  name: "FI0304",
  components: { twp, reportEdit, VSuperSelect },
  mixins: [dateFormatMixin],
  data () {
    return {
      // //用戶資訊
      userInfo: {
        userId: this.$store.state.Profile4User.id,
        userName: this.$store.state.Profile4User.employeeName,
        roleId: this.$store.state.Profile4User.staffType,
        roleName: this.$store.state.Profile4User.staffName,
      },
      optionsDxreportPhysician: [],
      selectedCheckItemObj: null,
      selectedCheckItem: null,
      selectedInspectDevice: null,
      optionsCheckItem: [],
      optionsInspectDevice: [],
      theProcedure: {
        // AccessionNo: "", //申請單號(大單號)
        OrderNo: "", //檢查單號(大單號)
        RequestingPhysicianName: "開單醫師",
        DxreportPhysicianId: this.$store.state.Profile4User.id != "admin" ? this.$store.state.Profile4User.id : "",
        patientId: "",
      },
      tableConfig4QueryResult: FI0304TableField,
      optionsPatientSource: [],
      tabIndex: 0,
      min: 1,
      DateRange: [null, null],
      produredCompletedDateRange: [null, null],
      reportEditTitle: "",
      reportAssignTitle: "",
      selectedStatus: "51",
      selectedAssignDoctor: null,
      reportsOnAssign: [],
      myFavoriteNote: null,
      searchCondition: null,
      tabs: [],
      sortMethod: {
        key: "ProcedureCompleted",
        desc: false,
      },
      tabList: [],
      isClearing: false,
      timeFormat: "yyyy/MM/dd HH:mm:ss",
      preReportPosition: { x: 0, y: 0 },
      preReportContents: {},
      preReportId: '',
      mouseoverTimeStamp: 0,
      preReportTimer: null,
      favorite: {
        no: '',
        id: ''
      },
      isFetchData: false,
      customeTableFields: [],
    };
  },
  computed: {
    ...mapGetters(["getProfile4User", "getThemeColors", "getReportDrs", "getModalityOptions"]),
    optionsStatus () {
      let _base = [
        { value: "51", text: "自動分派" },
        { value: "61", text: "退件重寫" },
        { value: "63", text: "報告撰寫" },
      ];

      if (this.userInfo.roleId != "21") {
        if (this.userInfo.userId === this.theProcedure.DxreportPhysicianId || this.userInfo.userId === "admin") {
          return _base.concat([{ value: "71", text: "正式報告" }]);
        } else {
          return _base;
        }
      } else if (this.userInfo.userId != this.theProcedure.DxreportPhysicianId) {
        return _base.concat([{ value: "65", text: "等待審核" }]);
      } else {
        return _base.concat([
          { value: "65", text: "等待審核" },
          { value: "71", text: "正式報告" },
        ]);
      }
    },
    optionsAssignDoctor () {
      let arr = this.optionsDxreportPhysician.filter((i) => i.value != this.theProcedure.DxreportPhysicianId);
      arr.unshift({ value: null, text: "請選擇" });
      return arr;
    },
    OptionsCasePriority () {
      // 案件優先度
      return [
        { text: "急件", value: "Y" },
        { text: "一般", value: "N" },
      ];
    },
    tableFields () {
      return this.getProfile4User.setting && this.getProfile4User.setting.hasOwnProperty('reportListField')
        ? this.getProfile4User.setting.reportListField
        : this.tableConfig4QueryResult.map(({ key }) => key);
    },
    displayTableField () {
      return this.tableConfig4QueryResult.filter(({ key }) => this.tableFields.some(field => field === key));
    }
  },
  methods: {
    ...mapActions(['action_updatePrivatePhrase']),
    ...mapMutations(["SHOW_LOADING", "HIDE_LOADING", "SET_SIDE_MESSAGE", "SET_REPORT_DR", "SET_MODALITIES", "CLEAR_PHRASE", "SET_REPORTLIST_FIELDS"]),
    async getTabDataSource (showloading = true) {
      this.isFetchData = true;
      for (let index = 0; index < this.tabList.length; index++) {
        const { id, page, per } = this.tabList[index];
        const { Count, Items, EmergencyCrCount, EmergencyCtMriCount } = await this.GetDataContent(id, page, per, showloading);

        Items.forEach(item => {
          item['Additions'] = 'NO';
        });

        this.tabList[index].count = Count;
        this.tabList[index].emgOnTime.cr = EmergencyCrCount;
        this.tabList[index].emgOnTime.ctmr = EmergencyCtMriCount;
        this.tabList[index].items = Items;
        if (index === this.tabIndex) {
          this.$refs["twp3"].OnForceRefresh();
        }
      }
      this.isFetchData = false;
    },
    tbodyMouseEvent (e) {
      if (e.type === 'mouseleave') {
        this.preReportTimer = setTimeout(() => {
          this.preReportId = null;
        }, 500);
      }
      if (e.timeStamp < this.mouseoverTimeStamp + 250 || e.type === 'mouseleave') return;
      this.mouseoverTimeStamp = e.timeStamp;  // 更新刷新時間

      if (this.preReportTimer) {
        clearTimeout(this.preReportTimer);
        this.preReportTimer = null;
      }


      const { AccessionNo, PatientId } = this.tabList[this.tabIndex].items[e.target.closest("tr").rowIndex - 1];
      if (!AccessionNo) return;
      if (!this.preReportContents.hasOwnProperty(AccessionNo)) {
        this.preReportContents[AccessionNo] = 'loading';
        getReportByAccessionNo(AccessionNo, PatientId).then(({ ReportContent }) => {
          this.preReportId = '';
          this.preReportContents[AccessionNo] = ReportContent || 'no data';
          this.preReportId = AccessionNo;
        });
      }
      this.preReportPosition.x = e.clientX + 40;
      this.preReportPosition.y = e.clientY + 10;
      this.preReportId = AccessionNo;
    },
    async updateTableSource (tabId, from, range) {

      const { page, per, count, items, id } = this.tabList[this.tabIndex];
      if (id !== tabId) {
        // 不同頁 直接給予該tab的item及數量
        this.$refs["twp3"].PagingCurrentPage = page;
        this.$refs["twp3"].PagingRowPerPage = per;
        return { Items: items, Count: count };
      } else {
        if (from === page && per === range) {
          return { Items: items, Count: count };
        } else {
          const { Count, Items } = await this.GetDataContent(id, from, range);
          this.tabList[this.tabIndex].page = from;
          this.tabList[this.tabIndex].per = range;
          this.tabList[this.tabIndex].items = Items;
          this.tabList[this.tabIndex].count = Count;
          return { Items, Count };
        }
      }

    },
    sortChanged ({ id, by, desc }) {
      this.sortMethod.key = by;
      this.sortMethod.desc = desc;
      this.SearchConditions();
    },
    //判斷是否要disable 加入個案追蹤 的按鈕
    checkIfDisableOpButton2Func (x) {
      if (x.Status != "71") {
        return true;
      }
      return x.IsFavoriteCases;
    },
    //確認新增案例追蹤
    async ConfirmAddFavorite () {
      // 啟動 報告存檔 作業
      // 報告存檔 - 後台存取
      this.SHOW_LOADING();
      //開始儲存
      let opStatus = false;
      let opResult = "存取時發生錯誤!";
      try {
        await postFavoriteCases({
          EmployeeNo: this.userInfo.userId,
          PatientId: this.favorite.id,
          AccessionNo: this.favorite.no,
          PfcComment: this.myFavoriteNote,
        });
        opStatus = true;
        this.$refs["twp3"].OnForceRefresh();
      } catch (error) {
        opStatus = false;
        opResult += error;
        if (error.response.status == 409) {
          opResult = "此個案報告已列入個案追蹤, 無須再加入.";
        }
      } finally {
        this.$refs.win4commentMyFravorite.hide();
        this.favorite.no = this.favorite.id = '';
        this.HIDE_LOADING();
      }
      if (opStatus) {
        this.SET_SIDE_MESSAGE({ msg: "資料已完成作業" });
      } else {
        this.SET_SIDE_MESSAGE({ msg: opResult, type: 2 });
      }
      return opStatus;
    },
    //批次審核上傳
    async BatchApprove (items) {
      let status = 71;
      // 啟動 報告存檔 作業
      // console.log(this.$logs("save report:" + status));
      // 報告存檔 - 後台存取
      this.SHOW_LOADING();
      //開始儲存
      let _this = this;
      let opStatus = false;
      let opResult = "存取時發生錯誤!";
      let subPath = "/report/Approval?employeeNo=" + this.userInfo.userId;
      let dataBody = [];
      items.forEach((i) => dataBody.push(i.AccessionNo));
      await window.axios
        .post(subPath, dataBody)
        .then((e) => {
          opStatus = true;
          _this.$refs["twp3"].forEach((t) => {
            if (t.TableId && t.TableId == "FI0304_pendingAppr") {
              t.OnForceRefresh();
              t.OnCancelAllSelects();
            }
          });
        })
        .catch(function (error) {
          opStatus = false;
          opResult += error;
        });
      this.HIDE_LOADING();
      if (opStatus) {
        this.SET_SIDE_MESSAGE({ msg: "資料已完成批次審核上傳" });
      } else {
        this.SET_SIDE_MESSAGE({ msg: opResult + "! 請稍後再試.", type: 2 });
      }
      return opStatus;
    },
    //確認分派報告
    async ConfirmAssignReport () {
      if (this.selectedAssignDoctor == null) {
        this.SET_SIDE_MESSAGE({ msg: opResult + "請選擇分派醫師", type: 2 });
        return;
      }
      // 報告存檔 - 後台存取
      this.SHOW_LOADING();

      let opStatus = false;
      let opResult = "存取時發生錯誤!";
      //console.log(this.theReport)
      let accessionNos = [];
      this.reportsOnAssign.forEach((obj) => {
        accessionNos.push(obj.AccessionNo);
      });
      let dataBody = {
        ReportPhysicianId: this.selectedAssignDoctor,
        AccessionNos: accessionNos,
      };

      try {
        await examAssignReport(dataBody);
        opStatus = true;
        this.$refs["twp3"].checkedItems.length = 0;
        // this.$refs["twp3"].OnForceRefresh();
      } catch (err) {
        opStatus = false;
        opResult += err;
      }

      this.HIDE_LOADING();
      if (opStatus) {
        this.SET_SIDE_MESSAGE({ msg: "已完成分派作業" });
      } else {
        this.SET_SIDE_MESSAGE({ msg: opResult + "! 請稍後再試.", type: 2 });
      }
      this.SearchConditions();
      this.$refs.win4assignReport.hide();
      return opStatus;
    },
    //取消分派
    CancelAssignReport () {
      this.$refs.win4assignReport.hide();
    },
    //取消加入個案
    CancelAddFavorite () {
      this.$refs.win4commentMyFravorite.hide();
    },
    //變更分派醫師
    ChangeAssignDoctor () { },
    //變更搜尋登打狀態 立刻刷新list
    //變更報告醫師
    ChangeSearchConditions (val) {
      // if (val) this.action_updatePrivatePhrase(val); // 更新片語
      this.CLEAR_PHRASE();
      //如果Search的報告醫師不是自己 且 搜尋登打狀態設定為 正式報告, 則調回 '自動分派' 以避免搜尋到非本人可編輯之正式報告
      if (this.theProcedure.DxreportPhysicianId != this.userInfo.userId) {
        if (this.selectedStatus == "71") {
          this.selectedStatus = "51";
        }
      }
      this.SearchConditions();
    },
    //keypressed偵測
    HKWatch (event) {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        if (this.$refs.win4commentMyFravorite.isShow || this.$refs.Window4ReportEdit.isShow) return;
        // //粗體Method自定義
        this.SearchConditions();
        this.SetFocusOnInputAccessionNo(500);
      }
    },
    SetFocusOnInputAccessionNo (delayTime) {
      setTimeout(() => {
        this.$nextTick(() => { if (this.$refs["inputAccessionNo"]) this.$refs["inputAccessionNo"].focus(); });
      }, delayTime);
    },
    //取得醫師列表
    GetOptionsDxreportPhysician () {
      return new Promise(async (resolve) => {
        if (this.getReportDrs.length === 0) {
          this.SHOW_LOADING();
          const {
            actual: { Items },
          } = await getOptionsReportDrSource();
          this.SET_REPORT_DR(Items);
          this.optionsDxreportPhysician = [{ value: "", text: "全部醫師" }, ...Items.map(({ No, Name }) => ({ value: No, text: Name }))];
          this.HIDE_LOADING();
          resolve(true);
        } else {
          this.optionsDxreportPhysician = [{ value: "", text: "全部醫師" }, ...this.getReportDrs];
          resolve(true);
        }
      });
    },
    //取得儀器類別列表
    async GetOptionsInspectDevice () {
      if (this.getModalityOptions.length === 0) {
        let subPath = "../exam/GetModalityList";
        this.SHOW_LOADING();
        const { actual } = await new DataManager({
          url: configs.publicPath + subPath,
          adaptor: new WebApiAdaptor(),
          crossDomain: true,
        }).executeQuery(new Query());
        this.HIDE_LOADING();
        this.SET_MODALITIES(actual);
        this.optionsInspectDevice = [{ value: null, text: "請選擇" }].concat(actual.map((v) => ({ text: v, value: v })));
      } else {
        this.optionsInspectDevice = [{ value: null, text: "請選擇" }].concat(this.getModalityOptions);
      }
    },
    async GetAllExamList (index) {
      //判別日期查詢 (日期查詢無法寫在query物件裡, 只好從url帶參數)
      let subPath = "../exam/List2";
      if (this.DateRange[0] != null || this.DateRange[1] != null) {
        let dateCondition = "";
        if (this.DateRange[0] != null) dateCondition += "procedureCompletedStart=" + this.DateRange[0].toJSON() + "&";
        if (this.DateRange[1] != null) dateCondition += "procedureCompletedEnd=" + this.DateRange[1].toJSON();
        subPath += "?" + dateCondition;
      }
      //判斷檢單狀態
      let statusConditions = "status=";
      if (this.selectedStatus != null) statusConditions += this.selectedStatus;
      else {
        let allStatus = "";
        this.optionsStatus.filter((i) => {
          if (i.value != null) allStatus += i.value + ",";
        });
        allStatus = allStatus.replace(/,\s*$/, "");
        statusConditions += allStatus;
      }
      //等待審核 tab
      if (index == "FI0304_pendingAppr") {
        statusConditions = "status=65";
      }
      if (subPath.includes("?")) {
        subPath += "&" + statusConditions;
      } else {
        subPath += "?" + statusConditions;
      }
      //急診/件 搜尋判斷
      // if (index == "FI0304_emy") {
      //   if (subPath.includes("?")) {
      //     subPath += "&isEmg=true";
      //   } else {
      //     subPath += "?isEmg=true";
      //   }
      // }
      subPath += "&employeeNo=" + this.theProcedure.DxreportPhysicianId;

      // console.log(subPath, this.collectSearchCondition());
    },
    convertDateRange (datetime, key) {
      if (datetime.every((dt) => !dt)) {
        return [];
      } else {
        const refDataTime = [...datetime];
        if (!refDataTime[0] && refDataTime[1]) {
          refDataTime[0] = new Date(this.$moment(refDataTime[1]).format("YYYY/MM/DD 00:00:00"));
        } else if (!refDataTime[1] && refDataTime[0]) {
          refDataTime[1] = new Date(this.$moment(refDataTime[0]).format("YYYY/MM/DD 23:59:59"));
        }
        if (refDataTime[0] == refDataTime[1]) {
          refDataTime[1] = new Date(refDataTime[0].getTime() + 24 * 60 * 60 * 1000);
        }
        return refDataTime.reduce((ac, dt, idx) => ac.concat(`${key}${idx === 0 ? "Start" : "End"}=${dt.toJSON()}`), []);
      }
    },
    collectSearchCondition (index) {
      //判別日期查詢 (日期查詢無法寫在query物件裡, 只好從url帶參數)
      let param = [
        { range: this.DateRange, key: "issueTime" },
        { range: this.produredCompletedDateRange, key: "procedureCompleted" },
      ].reduce((ac, { range, key }) => ac.concat(this.convertDateRange(range, key)), []);

      //判斷檢單狀態
      param.push(
        "status=" + (index == "FI0304_pendingAppr" ? "65" : this.selectedStatus != null ? this.selectedStatus : this.optionsStatus.map(({ value }) => value).join(","))
      );
      //EMPLOYEE NO
      param.push("employeeNo=" + (index == "FI0304_pendingAppr" ? this.userInfo.userId : this.theProcedure.DxreportPhysicianId));
      if (this.theProcedure.OrderNo) param.push("OrderNo=" + this.theProcedure.OrderNo);
      return (param.length > 0 ? "?" : "") + param.join("&");
    },
    async GetDataContent (index, toPage, nPerPage, showLoading = true) {
      //急診/件 搜尋判斷
      this.searchCondition = this.collectSearchCondition(index);
      if (index === this.tabs[this.tabIndex].id && showLoading) this.SHOW_LOADING("搜尋中，請稍候 ");
      let opResult = "";
      try {
        let { actual } = await getReportContents(
          this.searchCondition,
          this.getDataQuery(index)
            .sortBy(this.sortMethod.key, this.sortMethod.desc ? "descending" : "ascending")
            .page(toPage, nPerPage)
        );
        // 該頁則停止讀取
        // 登錄所有的筆數 覺得不太安全
        const currentTab = this.tabs.find(({ id }) => id === index);
        if (currentTab) currentTab.count = actual.Count; //總筆數
        actual.Items.forEach((item) => {
          //逾期時間判斷
          item.Due = false;
          if (item.Status === "71" || !item.ProcedureCompleted) {
            //正式報告不顯示逾期 或 沒有影像到位日期
            item.DueTimeStr = "-";
            item.DueTimeMins = 0;
          } else {
            item.DueTimeMins =
              (new Date().getTime() -
                (new Date(item.ProcedureCompleted).getTime() +
                  (item.PatientSourceCode === "E" || item.EmgFlag == "Y" ? 24 : item.PatientSourceCode == "I" ? 72 : 120) * 60 * 60 * 1000)) /
              1000 /
              60;

            item.DueTimeStr = `
              ${item.DueTimeMins <= 0 ? "" : "+"}
              ${this.SinglgeNumTo2Digit(Math.floor(Math.abs(item.DueTimeMins) / 60 / 24))}天
              ${this.SinglgeNumTo2Digit(Math.floor((Math.abs(item.DueTimeMins) / 60) % 24))}小時
              ${this.SinglgeNumTo2Digit(Math.floor(Math.abs(item.DueTimeMins) % 60))}分
            `;
            if (item.DueTimeMins > 0) item.Due = true;
          }
          ["IssueTime", "ScheduleTime"].forEach(k => {
            item[`${k}ForShow`] = item[k] ? this.$moment(item[k]).format("YYYY-MM-DD hh:mm:ss") : '-';
          });
          item.FontColor = item.Due ? "#BE77FF" : "inherit";
          //時間 to string
          item.ProcedureCompleted = this.DateToString(item.ProcedureCompleted, true);
          item.PatientBirthday = this.DateToString(item.PatientBirthday, false);
          //影像到位時間
          item.StudyTime = item.StudyTime == null ? "無影像" : this.DateToString(item.StudyTime, true);
          if (item.EmgFlag === "Y" || item.PatientSourceTypeCode === "E") {
            item._rowVariant = "danger";
          }
          //若為多檢查項目合併為arr, 此處拆解為string with comma
          item.ProcedureNameStr = item.ProcedureName;
          if (item.ProcedureName instanceof Array) {
            item.ProcedureNameStr = item.ProcedureName.join(",");
          }
        });
        return actual;
      } catch (err) {
        this.SET_SIDE_MESSAGE({ msg: opResult + "! 請稍後再試.", type: 2 });
      } finally {
        if (index === this.tabs[this.tabIndex].id && showLoading) this.HIDE_LOADING();
      }
      setTimeout(() => {
        this.$nextTick(() => this.$refs["vsuperselect"].blur());
      }, 100);
      this.$forceUpdate();
    },
    //門診-2 急診-1 住院-3 健診-6  (全部-0)  //急件
    getDataQuery: function (src) {
      let query = new Query();
      let tp = this.theProcedure;
      let chItem = this.selectedCheckItemObj ? this.selectedCheckItemObj.value : null;
      if (tp.OrderNo != null && tp.OrderNo != "") query = query.where("OrderNo", "contains", tp.OrderNo.trim(), true);
      if (tp.patientId) query = query.where("PatientId", "equal", tp.patientId.trim(), true);
      if (chItem != null && chItem != "") query = query.where("ProcedureCode", "contains", chItem);
      if (this.selectedInspectDevice != null && this.selectedInspectDevice != "") query = query.where("Modality", "equal", this.selectedInspectDevice);
      //(全部)1:急 2:門診 3:住院

      if (src == "FI0304_all") {
        // query = query.where("PatientSourceTypeCode", "notEqual", "G");
      } else if (src != "FI0304_pendingAppr") { // src != "FI0304_emy" && 
        let code = src == "FI0304_emy" ? "E" : src == "FI0304_door" ? "O" : src == "FI0304_live" ? "I" : "G";
        query = query.where("PatientSourceTypeCode", "equal", code);
      }
      return query;
    },
    convertQueries ({ queries }) {
      let orderby = "",
        filter = "";
      filter = queries.reduce((acc, cur) => {
        if (cur.fn === "onWhere" && cur.e.operator === "equal") {
          acc.push(`${cur.e.field} eq '${cur.e.value}'`);
        } else if (cur.fn === "onWhere" && cur.e.operator === "contains") {
          acc.push(`substringof('${cur.e.value.toLowerCase()}',tolower(${cur.e.field}))`);
        } else if (cur.fn === "onSortBy") {
          orderby += `$orderby=${cur.e.fieldName}`;
        }
        return acc;
      }, []);
      return { orderby, filters: filter.length > 0 ? `$filter=${filter.join(" and ")}` : "" };
    },
    downloadPDF () {
      const dateCondition = this.convertDateRange(this.DateRange, "issueTime").join("&");
      const dateCondition2 = this.convertDateRange(this.produredCompletedDateRange, "procedureCompleted").join("&");
      const statusConditions = "status=" + (this.selectedStatus != null ? this.selectedStatus : this.optionsStatus.map(({ value }) => value).join(","));
      const employeeNo = this.theProcedure.DxreportPhysicianId ? "employeeNo=" + this.theProcedure.DxreportPhysicianId : "";
      // const isEmg = this.tabs[this.tabIndex].id === "FI0304_emy" ? "isEmg=true" : "";
      const tabKey = this.tabs[this.tabIndex].id;
      let PatientSourceTypeCode = tabKey === "FI0304_door"
        ? "eq 'O'"
        : tabKey === "FI0304_live"
          ? "eq 'I'"
          : tabKey === "FI0304_hr"
            ? "eq 'G'"
            : tabKey === "FI0304_emy"
              ? "eq 'E'"
              : "";
      if (PatientSourceTypeCode) PatientSourceTypeCode = "PatientSourceTypeCode " + PatientSourceTypeCode;
      const orderNo =
        this.theProcedure.OrderNo != null && this.theProcedure.OrderNo != "" ? `substringof('${this.theProcedure.OrderNo.toLowerCase()}', tolower(OrderNo))` : "";
      const patientId = this.theProcedure.patientId ? `substringof('${this.theProcedure.patientId.toLowerCase()}', tolower(PatientId))` : "";
      const chItem = this.selectedCheckItemObj && this.selectedCheckItemObj.value ? `substringof('${this.selectedCheckItemObj.value}', ProcedureCode)` : "";
      const selectedDevice = this.selectedInspectDevice ? `Modality eq '${this.selectedInspectDevice}'` : "";
      const filterArr = [orderNo, PatientSourceTypeCode, patientId, chItem, selectedDevice].filter((v) => v);
      const filters = filterArr && filterArr.length > 0 ? `$filter=${filterArr.join(" and ")}` : "";
      const orderBy = "$orderby=" + this.sortMethod.key + (this.sortMethod.desc ? " desc" : "");
      this.SHOW_LOADING("搜尋過久?建議縮小範圍再下載 ");
      getExportBarcode([dateCondition, dateCondition2, statusConditions, employeeNo, patientId, filters, orderBy].filter((v) => v != "").join("&"))
        .then((res) => {
          window.open(res);
        })
        .catch((e) => {
          this.SET_SIDE_MESSAGE({ msg: "下載發生錯誤，請稍候再試", type: 2 });
        })
        .finally(() => {
          this.HIDE_LOADING();
        });
      this.StoreSearchConditions();
    },
    SearchConditions () {
      this.getTabDataSource();
    },
    ClearConditions () {
      this.selectedCheckItemObj = null;
      this.isClearing = true;
      if (this.$refs.vsuperselect) {
        this.$refs.vsuperselect.clearSelection();
        this.$refs["vsuperselect"].blur();
      }
      setTimeout(() => {
        this.isClearing = false;
      }, 500);
      this.selectedInspectDevice = this.selectedCheckItem = null;
      ["produredCompletedDateRange", "DateRange"].forEach((k) => {
        new Array(2).fill().forEach((v, i) => {
          if (this[k][i]) {
            this[k][i] = new Date(this.$moment(new Date()).format("YYYY/MM/DD 00:00:00"));
          }
        });
      });
      setTimeout(() => {
        this.produredCompletedDateRange = [null, null];
        this.DateRange = [null, null];
      }, 100);
      // this.DateRange.forEach(d => d = null);
      this.selectedStatus = "51";
      this.theProcedure.DxreportPhysicianId = this.userInfo.userId != "admin" ? this.userInfo.userId : "";
      ["OrderNo", "patientId"].forEach(k => {
        this.theProcedure[k] = "";
      });

      //this.$store.state.Profile4User.id != "admin" ? this.$store.state.Profile4User.id : "",
      // this.SearchConditions();
    },
    //判斷權限是否允許進入此報告狀態登打
    CheckIfReportStatusMeetRoleType (status) {
      if (
        [
          "56", //尚未分派
          "71", //核准送出
          "73", //失敗重傳
          "75", //改版重傳
          "77", //等待同步
          "79", //同步成功
        ].includes(status) ||
        (this.userInfo.roleId == "25" && status == "65") //住院醫師及等待審核
      ) {
        return false;
      }
      //主治醫師
      // else if (this.userInfo.roleId == "21") {
      // }
      return true;
    },
    RowClickFunction (rows, SrcParamId, row) {
      if (!this.CheckIfReportStatusMeetRoleType(rows.Status)) {
        this.SET_SIDE_MESSAGE({ msg: "此檢驗單狀態已不允許再做登打動作。", type: 2 });
        return;
      }
      this.GetAllExamList(SrcParamId); // keep this line do not remove and the order of this call should be kept too
      this.RouterToSpecificReport(row);
    },
    OnClickMyFavorite ({ Status, AccessionNo, PatientId }) {
      if (Status != "71") return false;
      this.favorite.no = AccessionNo;
      this.favorite.id = PatientId;
      this.$refs.win4commentMyFravorite.show();
      this.myFavoriteNote = "";
    },
    RouterToSpecificReport (row) {
      // window.dtcDataList = [...row]; R S
      const name = row.PatientSourceCode === "R" ? "SubReport" : "FI0301";
      const currentTab = this.tabList[this.tabIndex];
      const rowIdx = currentTab.items.findIndex(({ AccessionNo }) => AccessionNo === row.AccessionNo) + 1;
      this.$store.registerModule("fi0304TabSource", {
        state: {
          rows: [...currentTab.items],
          query: this.getDataQuery(this.tabs[this.tabIndex].id).sortBy(this.sortMethod.key, this.sortMethod.desc ? "descending" : "ascending"),
          searchCondition: this.searchCondition,
          currentKey: currentTab.id,
          rowIdx,
          tabList: this.tabList,
        },
      });
      this.$router.replace({ name });
    },
    itemChecked (x) { },
    tabTitle ({ label, count, disabled }) {
      return !disabled ? `${label} (${count})` : null;
    },
    OpenMultiReport () {
      this.$refs["Window4ReportEdit"].show();
    },
    AssignReport (items) {
      // console.log(this.$logs("Doctor assign report:"));
      this.reportAssignTitle = " : " + items.length + "筆報告";
      this.reportsOnAssign = items;
      this.$refs.win4assignReport.show();
    },
    CheckIfShowRowCheckBox (item) {
      return item.Status == "51";
    },
    GetParams () {
      if (!this.$refs["twp3"]) {
        return null;
      }
      this.reportEditTitle = " : " + this.$refs["twp3"].checkedItems.length + " 筆報告";
      let params = {
        accessionNos: this.$refs["twp3"].checkedItems.map(({ AccessionNo }) => AccessionNo),
        dxreportPhysicianId: this.userInfo.userId,
        userId: this.userInfo.userId,
        staffType: this.userInfo.roleId,
      };
      return params; //this.$refs.twpMulti[0].checkedItems
    },
    RefreshCheckedItems (items) {
      this.$refs["twp3"].checkedItems.length = 0;
      this.$refs["twp3"].OnForceRefresh();
    },
    CloseReportEdit () {
      this.$refs["Window4ReportEdit"].hide();
    },
    confirmCustom () {
      this.SET_REPORTLIST_FIELDS(this.customeTableFields);
      setTimeout(() => {
        this.getTabDataSource();
      }, 250);
    },
    settingTableFields () {
      this.customeTableFields = this.tableFields;
      this.$refs.showCustomFields.show();
    },
  },
  watch: {
    tabIndex (val) {
      const { page, per } = this.tabList[val];
      this.$refs["twp3"].toPage = page;
      this.$refs["twp3"].PagingRowPerPage = per;
      this.$refs["twp3"].OnForceRefresh();
    }
  },
  mounted () {
    this.SetFocusOnInputAccessionNo(1000);
    if (this.tabList[this.tabIndex].items.length > 0) {
      // 返回作業用
      const { page, per } = this.tabList[this.tabIndex];
      setTimeout(() => {
        this.$refs["twp3"].toPage = this.$refs["twp3"].PagingCurrentPage = page;
        this.$refs["twp3"].PagingRowPerPage = per;
      }, 200);

      // this.$watch(
      //   () => document.getElementById('FI0304').clientWidth,
      //   (oldVal, newVal) => {
      //     console.log(oldVal, ' - ', newVal)
      //     return newVal
      //   }
      // )
      // this.$refs.windowResize.$on('resize', this.resize)

    }
  },
  created () {
    this.tabs = tabTags(this.userInfo.roleId);
    const isBack = !!this.$store.state.fi0301TabSource;
    if (this.$store.state.fi0301TabSource) {
      // theProcedure.DxreportPhysicianId
      const { searchCondition, currentKey, tabList } = this.$store.state.fi0301TabSource;
      
      this.tabList = tabList;
      this.tabIndex = this.tabList.findIndex(({ id }) => id === currentKey);
      if (searchCondition) {
        const searchObj = searchCondition
          .substr(1)
          .split("&")
          .reduce((acc, cur) => {
            const [key, value] = cur.split("=");
            return { ...acc, [key]: value };
          }, {});
        if (searchObj["counterRegisterStart"]) {
          this.DateRange = [new Date(searchObj["counterRegisterStart"]), new Date(searchObj["counterRegisterEnd"])];
        }
        if (searchObj["procedureCompletedStart"]) {
          this.produredCompletedDateRange = [new Date(searchObj["procedureCompletedStart"]), new Date(searchObj["procedureCompletedEnd"])];
        }
        this.theProcedure.DxreportPhysicianId = searchObj["employeeNo"];
        this.searchCondition = searchCondition;
      }
      this.tabs.forEach((tab, idx) => {
        tab.count = this.tabList[idx].count;
      });
      this.getTabDataSource(false);
      this.$store.unregisterModule("fi0301TabSource");
    } else {
      this.tabList = this.tabs
        .filter(({ id }) => id==='FI0304_all')
        .map((tab) => ({
          id: tab.id,
          theme: tab.theme,
          page: 1,
          per: 10,
          count: 0,
          items: [],
          emgOnTime: {
            ct: 0, ctmr: 0
          }
        }));
      this.getTabDataSource();
    }

    if (localStorage["dtcOptionsCheckItem"]) {
      this.optionsCheckItem = JSON.parse(localStorage["dtcOptionsCheckItem"]);
    }
    //初始UI參數
    // this.InitUiParams();
    window.addEventListener("keydown", this.HKWatch); //粗體Method自定義
    // 取得 App.vue 參照
    this.theProcedure.RequestingPhysicianName = this.userInfo.userName;
    this.GetOptionsInspectDevice();
    this.GetOptionsDxreportPhysician().then(() => {
      if (this.$store.hasModule("fi0304SearchCondition")) {
        const _params = this.$store.state.fi0304SearchCondition.param
          .substr(1)
          .split("&")
          .reduce((acc, str) => {
            const [key, value] = str.split("=");
            return { ...acc, [key]: value };
          }, {});
        if (_params["status"]) this.selectedStatus = _params["status"];
        if (_params.hasOwnProperty("employeeNo")) {
          this.theProcedure.DxreportPhysicianId = _params["employeeNo"];
          // this.optionsDxreportPhysician.find(({text,value})=>value === _params['employeeNo']);
        }

        if (_params["OrderNo"]) this.theProcedure.OrderNo = _params["OrderNo"];
        if (_params["procedureCompletedStart"] && _params["procedureCompletedEnd"])
          this.DateRange = [_params["procedureCompletedStart"], _params["procedureCompletedEnd"]];

        if (isBack) {
          setTimeout(() => {
            this.SearchConditions();
          }, 500); // to do
        }
      }
    });
  },
  destroyed () {
    window.removeEventListener("keydown", this.HKWatch); // 解除監聽器:攔截 KeyPress
  },
};
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
.table.b-table > tbody > .table-active {
  color: #fff;
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
</style>
