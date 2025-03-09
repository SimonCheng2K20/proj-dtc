<template>
  <div
    id="FI0304"
    class="pageContent pb-1"
  >
    <b-card
      no-body
      class="mx-1"
      bg-variant="transparent"
    >
      <b-card-header class="bg-warning text-dark cardHeader">
        <b-row no-gutters>
          <b-col
            cols="12"
            class="float-left text-left font-weight-bold py-2"
          >匿名評分清單 用戶: [{{ $store.state.Profile4User.staffName }}] {{ $store.state.Profile4User.employeeName }}</b-col>
          <!-- <b-col cols="6" class="float-right text-right">
            <b-dropdown id="dropdown-1" text="背景更換" style="font-size:12px;" dropleft class="m-md-1">
              <b-dropdown-item :active="isWhite" class="bg-clr" @click="bgUpdate('white', $event)">白色</b-dropdown-item>
              <b-dropdown-item :active="isBlack" class="bg-clr" @click="bgUpdate('black', $event)">黑色</b-dropdown-item>
              <b-dropdown-item :active="isGray" class="bg-clr" @click="bgUpdate('#868e96', $event)">灰色</b-dropdown-item>
            </b-dropdown>
          </b-col> -->
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
              <b-input-group prepend="登打狀態">
                <b-select
                  v-model="selectedStatus"
                  :options="optionsStatus"
                />
              </b-input-group>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="申請單號">
                <b-input
                  v-model="theProcedure.AccessionNo"
                  placeholder="請輸入"
                  ref="inputAccessionNo"
                />
              </b-input-group>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="評分記錄">
                <b-select
                  v-model="selectedIsEval"
                  :options="optionsIsEval"
                  @change="ChangeIsEval"
                />
              </b-input-group>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <b-input-group prepend="儀器類別">
                <b-select
                  v-model="selectedInspectDevice"
                  :options="optionsInspectDevice"
                  @change="ChangeSearchConditions"
                />
              </b-input-group>
            </b-col>
            <b-col class="px-1 text-right">
              <b-button
                variant="success"
                @click="ClearConditions"
              >
                <font-awesome-icon icon="eraser" />清除條件 </b-button>
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
                  id="super-select"
                  style="z-index:99"
                  class="bg-white"
                  noneFoundText="無此筆資料"
                  placeholder="請輸入"
                  v-model="selectedCheckItem"
                  :items="optionsCheckItem"
                />
                <!-- <b-select v-model="selectedCheckItem" :options="optionsCheckItem" @change="ChangeSearchConditions" /> -->
              </b-input-group>
            </b-col>
            <b-col sm="4" class="px-1">
              <b-input-group
                prepend="檢查日期"
                style="width:340px"
              >
                <div
                  id="spcialDatePicker"
                  class="form-control"
                  style="padding:0px"
                >
                  <ejs-daterangepicker
                    :minDays="min"
                    v-model="DateRange"
                    placeholder="搜尋範圍"
                  ></ejs-daterangepicker>
                </div>
              </b-input-group>
            </b-col>
            <b-col class="px-1 text-right">
              <b-button
                variant="primary"
                @click="SearchConditions"
              >
                <font-awesome-icon icon="search" />進行查詢 </b-button>
            </b-col>
          </b-row>
        </b-container>
      </b-card-text>
    </b-card>
    <b-card
      no-body
      id="cardTabs"
      class="m-1"
      style="overflow:hidden"
      bg-variant="transparent"
    >
      <twp
        ref="twp"
        :FieldConfig="tableConfig4QueryResult"
        :DataFetch="GetDataContent"
        :OpButton1Func="RowClickFunction"
      ></twp>
    </b-card>
  </div>
</template>

<script>
import Vue from "vue";
import twp from "@/components/TWPv5";
// import reportEdit from "@/components/ReportEdit";
import * as configs from "@/config";
import { DateRangePickerPlugin } from "@syncfusion/ej2-vue-calendars";
//為了拿到token
// import Common from "../../library/Common";
import { DataManager, WebApiAdaptor, Predicate, Query } from "@syncfusion/ej2-data";
import { dateFormatMixin } from "@/SupportLib_J.js";
import VSuperSelect from "v-super-select";
import { mapGetters, mapMutations } from "vuex";
import { getReportContents } from "@/assets/service/dataManager.js";
Vue.use(DateRangePickerPlugin);

const configCollection = [
  //{ key: 'dId', label: '項次', sortable: false, thClass: "no-wrap", tdClass: "no-wrap" },
  {
    key: "EmgFlag",
    label: "急作",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap"
  },
  {
    key: "IsEval",
    label: "評分記錄",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap"
  },
  {
    key: "DxreportPhysicianName",
    label: "報告醫師",
    sortable: true,
    thClass: "text-nowrap",
    tdClass: "no-wrap font-weight-bold"
  },
  {
    key: "IssuePhysicianName",
    label: "審核醫師",
    sortable: true,
    thClass: "text-nowrap",
    tdClass: "no-wrap font-weight-bold"
  },
  {
    key: "AccessionNo",
    label: "申請單號",
    sortable: true,
    thClass: "text-nowrap",
    tdClass: "no-wrap font-weight-bold"
  },
  {
    key: "ProcedureName",
    label: "檢查項目",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap text-left"
  },
  {
    key: "Modality",
    label: "儀器類別",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap text-left"
  },
  {
    key: "PatientSourceTypeName",
    label: "病患來源",
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
  },
  {
    key: "PatientSex",
    label: "性別",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap"
  },
  {
    key: "PatientBirthday",
    label: "生日",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap"
  },
  {
    key: "PatientAge",
    label: "年齡",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap"
  },
  {
    key: "ProcedureCompleted",
    label: "檢查日期",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap"
  },
  {
    key: "StudyTime",
    label: "影像到位日期",
    sortable: true,
    thClass: "no-wrap",
    tdClass: "no-wrap"
  }
];

export default {
  name: "FI0306",
  components: { twp, VSuperSelect },
  mixins: [dateFormatMixin],
  data () {
    return {
      //用戶資訊
      userInfo: {
        //user ID
        userId: this.$store.state.Profile4User.id,
        //user name
        userName: this.$store.state.Profile4User.employeeName,
        //staff type (ex: 25)
        roleId: this.$store.state.Profile4User.staffType,
        //staff name (ex: 住院醫師)
        roleName: this.$store.state.Profile4User.staffName
      },
      //檢查項目
      optionsCheckItem: [],
      //儀器類別
      optionsInspectDevice: [],
      selectedCheckItem: "",
      selectedInspectDevice: null,
      //isEva類別
      optionsIsEval: [
        { value: null, text: "請選擇" },
        { value: 1, text: "評分完成" },
        { value: 2, text: "尚未評分" }
      ],
      selectedIsEval: null,
      // 檢查程序
      theProcedure: {
        AccessionNo: "", //申請單號(大單號)
        RequestingPhysicianName: "開單醫師",
        DxreportPhysicianId: this.$store.state.Profile4User.id
      },
      //twp 欄位
      tableConfig4QueryResult: [],
      //？？
      selectedPatientSource: 0,
      //？？
      optionsPatientSource: [],
      //FI0304在用的tabindex
      tabIndex: 0,

      // 佈景主題 (configs的ThemeId4Black 為'themeBlack' 20200114)
      themePacks: {
        themeBlack: false,
        themeBlackName: configs.ThemeId4Black
      },
      //ejs minDays綁定的值
      min: 1,
      //ejs DateRange
      DateRange: [null, null],
      //？？
      reportEditTitle: "",
      reportAssignTitle: "",
      //
      isWhite: false,
      isBlack: true,
      isGray: false,
      //狀態 71(正式報告)
      selectedStatus: "71",
      selectedAssignDoctor: null,
      reportsOnAssign: []
    };
  },
  computed: {
    ...mapGetters(['getThemeColors']),
    optionsStatus () {
      return [{ value: "71", text: "正式報告" }];
    },
    OptionsCasePriority () {
      // 案件優先度
      return [
        { text: "急件", value: "Y" },
        { text: "一般", value: "N" }
      ];
    }
  },
  created () {
    //userID
    // console.log(this.$logs("userID " + this.userInfo.userId));
    //初始UI參數
    // this.InitUiParams();
    // console.log(this.selectedCheckItem);
    window.addEventListener("keydown", this.HKWatch); //粗體Method自定義
    // 取得 App.vue 參照
    
    this.DateRange = [
      new Date(this.$moment().startOf('month')), 
      new Date(this.$moment().endOf('month'))
    ];

    // const startOfMonth = moment().startOf('month');
    // const endOfMonth   = moment().endOf('month');


    // this.optionsCheckItem = checkItem.Options()
    this.tableConfig4QueryResult = configCollection; //queryResult.PresentConfig()
    // this.optionsPatientSource = patientSource.Options()
    this.theProcedure.RequestingPhysicianName = this.userInfo.userName;

    //取得檢查項目 -- 在localStorage得到此資料
    // this.GetOptionsCheckItem();
    if (localStorage["dtcOptionsCheckItem"]) {
      this.optionsCheckItem = JSON.parse(localStorage["dtcOptionsCheckItem"]);
    }
    //取得儀器類別列表
    this.GetOptionsInspectDevice();
  },
  methods: {
    ...mapMutations(["SHOW_LOADING", "HIDE_LOADING", "SET_SIDE_MESSAGE"]),
    //初始頁面UI 暫存參數
    // InitUiParams() {
    //   if (window.reportList_tabIndex) {
    //     this.tabIndex = window.reportList_tabIndex;
    //   }
    //   if (window.reportEvaluationList_AccessionNo) {
    //     this.theProcedure.AccessionNo = window.reportEvaluationList_AccessionNo;
    //   }
    //   if (window.reportList_selectedCheckItem) {
    //     this.selectedCheckItem = window.reportList_selectedCheckItem;
    //   }
    //   if (window.reportList_selectedInspectDevice) {
    //     this.selectedInspectDevice = window.reportList_selectedInspectDevice;
    //   }
    //   if (window.reportList_selectedStatus) {
    //     this.selectedStatus = window.reportList_selectedStatus;
    //   }
    //   if (window.reportList_DateRange) {
    //     this.DateRange = window.reportList_DateRange;
    //   }
    // },
    ChangeIsEval (x) {
      console.log(x);
      if (x == 1) {
        this.selectedIsEval = 1;
      } else if (x == 2) {
        this.selectedIsEval = 2;
      } else {
        this.selectedIsEval = null;
      }
      this.SearchConditions();
    },
    //
    //變更報告醫師
    ChangeSearchConditions () {
      //
      //如果Search的報告醫師不是自己 且 搜尋登打狀態設定為 正式報告, 則調回 '自動分派' 以避免搜尋到非本人可編輯之正式報告
      if (this.theProcedure.DxreportPhysicianId != this.userInfo.userId) {
        if (this.selectedStatus == "71") {
          this.selectedStatus = "51";
        }
      }
      this.SearchConditions();
    },
    StoreUiParams () {
      window.reportList_tabIndex = this.tabIndex;
    },
    //keypressed偵測
    HKWatch (event) {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        // //粗體Method自定義
        this.SearchConditions();
      }
    },
    SetFocusOnInputAccessionNo () {
      //console.log(this.$logs('setFocus'))
      setTimeout(() => {
        //console.log(this.$logs('setFocus.inner'))
        this.$nextTick(() => this.$refs["inputAccessionNo"].focus());
      }, 1000);
    },

    //GET 儀器類別列表
    async GetOptionsInspectDevice () {
      // console.log(this.$logs());
      //
      let itemPack = null;
      let convertedCollections = [{ value: null, text: "請選擇" }];
      //
      let subPath = "/exam/GetModalityList";
      // let subPath = "/device/SelectNoList";
      //
      this.SHOW_LOADING();
      // let opStatus = false;
      //
      //改成用axios
      await window.axios.get(subPath).then(res => {
        itemPack = res;
        // console.log(itemPack);
      });
      itemPack.forEach(e => {
        convertedCollections.push({ value: e, text: e });
      });

      this.optionsInspectDevice = convertedCollections;
      // console.log("GET-儀器類別--列表");
      // console.log(this.optionsInspectDevice);
    },
    //

    async GetAllExamList (index) {
      //判別日期查詢 (日期查詢無法寫在query物件裡, 只好從url帶參數)
      let subPath = "/exam/List2";
      if (this.DateRange[0] != null || this.DateRange[1] != null) {
        let dateCondition = "";
        if (this.DateRange[0] != null) dateCondition += "procedureCompletedStart=" + this.DateRange[0].toJSON() + "&";

        if (this.DateRange[1] != null) dateCondition += "procedureCompletedEnd=" + this.DateRange[1].toJSON();

        subPath += "?" + dateCondition;
      }
      //
      //判斷檢單狀態
      // let statusConditions = "status=";
      // if (this.selectedStatus != null) statusConditions += this.selectedStatus;
      // else {
      //   let allStatus = "";
      //   this.optionsStatus.filter(i => {
      //     if (i.value != null) allStatus += i.value + ",";
      //   });
      //   allStatus = allStatus.replace(/,\s*$/, "");
      //   statusConditions += allStatus;
      // }

      //急診/件 搜尋判斷
      if (index == "FI0304_emy") {
        if (subPath.includes("?")) {
          subPath += "&isEmg=true";
        } else {
          subPath += "?isEmg=true";
        }
      }
      subPath += "&employeeNo=" + this.theProcedure.DxreportPhysicianId;
      // let opResult = "";
      // let opStatus = false;
      window.dtcUrl = subPath;
      window.dtcQuery = this.getDataQuery(index);
    },
    async GetDataContent (index, toPage, nPerPage) {
      const dateCondition = this.$convertRange(this.DateRange, "procedureCompleted");
      // 改變isEval的bool
      const isEvalUrl = this.selectedIsEval == 1
        ? "&isEval=true"
        : this.selectedIsEval == 2
          ? "&isEval=false"
          : "";

      this.SHOW_LOADING();

      try {
        const { actual } = await getReportContents(
          "?status=71" + dateCondition + isEvalUrl,
          this.getDataQuery(index)
            .sortBy("ProcedureCompleted")
            .page(toPage, nPerPage)
        )
        actual.Items.forEach((item) => {
          item.ProcedureCompleted = this.DateToString(item.ProcedureCompleted, true);
          item.PatientBirthday = this.DateToString(item.PatientBirthday, false);
          item.StudyTime = item.StudyTime == null ? "無影像" : this.DateToString(item.StudyTime, true);
          if (item.IsEval) {
            item._cellVariants = { IsEval: "success" };
            item.IsEval = "評分完成";
          } else {
            item._cellVariants = { IsEval: "danger" };
            item.IsEval = "尚未評分";
          }
          this.theProcedure.RequestingPhysicianName = item.RequestingPhysicianName;
        });
        //Sort 1: 檢查日期 降冪   2: 狀態: 升密
        actual.Items.sort((a, b) => {
          return b.ProcedureCompleted - a.ProcedureCompleted || a.Status - b.Status;
        });
        //關掉loading的modal視窗

        return actual;
      } catch (err) {
        this.SET_SIDE_MESSAGE({ msg: err.toString(), type: 2 });
      } finally {
        this.HIDE_LOADING();
      }


    },
    //門診-2 急診-1 住院-3 健診-6  (全部-0)  //急件
    getDataQuery: function () {
      let query = new Query();
      //TODO - remove the codes below when api is rephrased for settled data schema
      let selectCheckItemSet = this.selectedCheckItem == "" ? null : this.selectedCheckItem;
      // let tp = this.theProcedure;
      // let insDev = this.selectedInspectDevice;
      let chItem = selectCheckItemSet;
      let chItemT = null;
      if (chItem != null) {
        chItemT = this.optionsCheckItem.filter(c => {
          // console.log(c);
          if (c.value === chItem) return c;
        })[0].text;
      }
      //過濾 撰寫醫師 & 審核醫師
      query = query.where("DxreportPhysicianId", "notEqual", this.userInfo.userId);
      query = query.where("IssuePhysicianId ", "notEqual", this.userInfo.userId);
      //過濾 檢查項目
      if (selectCheckItemSet != null && selectCheckItemSet != "") query = query.where("ProcedureCode", "contains", selectCheckItemSet);
      //過濾 儀器類別
      if (this.selectedInspectDevice != null && this.selectedInspectDevice != "") query = query.where("Modality", "contains", this.selectedInspectDevice);

      return query;
    },
    SearchConditions () {
      this.SHOW_LOADING();

      console.log('--------------searchCondition-----------');
      console.log(this.DateRange);


      this.$refs["twp"].OnForceRefresh();
      this.HIDE_LOADING();
      // this.StoreSearchConditions();
    },
    ClearConditions () {
      //評分記錄
      this.selectedIsEval = null;
      //檢查項目-setTimeout 清除super-select
      this.selectedCheckItem = "";
      setTimeout(() => {
        const q = ".super-select-input input[type=text]";
        document.querySelector(q).value = "";

        document.querySelector(q).value = "";
      }, 300);
      console.log(this.selectedCheckItem);
      //儀器類別
      this.selectedInspectDevice = null;
      this.theProcedure.AccessionNo = "";
      this.DateRange = [null, null];
      // this.selectedStatus = "71";
      this.theProcedure.DxreportPhysicianId = this.userInfo.userId;

      this.SearchConditions();
    },
    //double click的時候
    RowClickFunction (x, SrcParamId) {
      let data = {
        sourceIndex: SrcParamId,
        dataList: x
        //dataList: Array.isArray(x) ? x : [x]
      };
      // console.log(data.dataList);
      //alert(JSON.stringify(x));
      //判斷所選
      this.GetAllExamList(SrcParamId); // keep this line do not remove and the order of this call should be kept too
      this.DirectToF0306_1(data);


      // console.log({ data });

      // let dataList =
      // this.DirectToF0301(dataList)
    },
    DirectToF0306_1 (x) {
      // console.log(`Row Function Button Clicked. (${x.length})`);
      //this.$router.replace(this.BasePath + "/" + x.guid);
      // alert("passData");
      // console.log(x.dataList);
      window.dtcEvaluationDataList = x.dataList ? x.dataList : [];
      // alert("FI0306");
      // console.log(window.dtcEvaluationDataList);

      this.$router.replace({ name: "FI0306-1" });
      //{ path: '/MI03/FI0301', name: 'FI0301', component: () => import('./views/MI03/FI0301.vue') },
    },

    bgUpdate (cls) {
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
        document.documentElement.style.setProperty("--theme-modal-bg-color", cls);
      }
    },
    ThemeSwitch (color) {
      // Theme:Black 切換
      //
      // this.themePacks.themeBlack = !this.themePacks.themeBlack
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

      //連動改變table component的背景主題
      this.SwtchTableTheme();

      console.log(this.$logs(this.$IsThemeBlack() ? "Black" : "White"));
    },
    SwtchTableTheme () {
      this.$refs["twp"].UsingThemeBlack = this.$IsThemeBlack();
    },

    setDefaultBackgroundColor () {
      // 引入 Theme:Black, 日後再調成是從 個人設定 中轉入
      let cls = localStorage["theme-modal-bg-color"];
      this.isWhite = cls == "white" || !cls;
      this.isBlack = cls == "black";
      this.isGray = !this.isWhite && !this.isBlack && cls == "#868e96";
      !cls ? (cls = "white") : "";
      this.ThemeSwitch(cls);
      if (!this.isWhite) {
        document.documentElement.style.setProperty("--theme-modal-bg-color", cls);
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
    }
  },

  mounted () {
    //
    // 引入 Theme:Black, 日後再調成是從 個人設定 中轉入
    // this.ThemeSwitch()
    // this.setDefaultBackgroundColor();

    //set focus 在申請單號
    this.SetFocusOnInputAccessionNo();
  },
  beforeDestroy: function () {
    console.log(this.$logs("Before destroy"));
    this.StoreUiParams();
  },
  destroyed () {
    console.log(`${this.$logs()}`);
    // 解除 Theme:Black
    const el = document.body;
    el.classList.remove(this.themePacks.themeBlackName);
    //
    // 解除監聽器:攔截 KeyPress
    window.removeEventListener("keydown", this.HKWatch);
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
</style>
<style lang="scss" scoped>
.super-select-container {
  --boxHeight: 38px !important;
  --itemHeight: 38px !important;
  --boxWidth: 100% !important;
  flex: 1;
}
/deep/#super-select {
  .super-select-input {
    margin: 0px;
    border-radius: 0px 5px 5px 0px;
  }
}
/deep/ #twpv2 .table td {
  &.table-success,
  &.table-danger {
    color: #000 !important;
  }
}
</style>
