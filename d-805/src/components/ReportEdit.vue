<template>
  <div
    id="FI0301"
    class="pb-1"
  >
    <b-card
      no-body
      class="mx-1"
      bg-variant="transparent"
    >
      <b-container
        fluid
        class="px-0"
      >
        <b-row
          no-gutters
          class="my-1"
        >
          <b-col class="px-1">
            <b-button
              variant="info"
              class="mr-1"
              @click="DataSave(63)"
              :disabled="DxReportContent.length <= 0"
            >
              <font-awesome-icon
                icon="save"
                class="mr-1"
              />報告暫存
            </b-button>
            <!-- 非主治醫師 -->
            <b-button
              variant="primary"
              class="mr-1"
              @click="DataSave(65)"
              :disabled="DxReportContent.length <= 0"
            >
              <font-awesome-icon
                icon="chalkboard-teacher"
                class="mr-1"
              />送交審核
            </b-button>

            <!-- 主治醫師 v-else-->
            <b-button
              variant="primary"
              class="mr-1"
              @click="DataSave(71)"
              :disabled="DxReportContent.length <= 0"
            >
              <font-awesome-icon
                icon="check"
                class="mr-1"
              />正式報告
            </b-button>

            <b-button
              variant="success"
              class="mr-1"
              @click="WinMass4Phrase"
            >
              <font-awesome-icon
                icon="book-medical"
                class="mr-1"
              />片語維護 </b-button>

            <toggle-button
              v-model="theReport.IsPositive"
              color="#dc3545"
              :fontSize="16"
              :height="26"
              :width="72"
              class="mt-2 ml-2"
              :labels="{ checked: '陽性', unchecked: '陰性' }"
            />
          </b-col>
          <b-col class="px-1">
            <b-input-group>
              <b-input-group-prepend>
                <b-button variant="warning">主治醫師</b-button>
              </b-input-group-prepend>
              <b-select
                v-model="selectedIssuePhysician"
                :options="optionsIssuePhysician"
              />
            </b-input-group>
          </b-col>

          <b-col
            id="blkReportInput"
            ref="blkReportInput"
            sm="12"
            class="px-1 mt-1"
          >
            <!-- @input="MacroProcess" -->
            <b-textarea
              id="DxRMain"
              no-resize
              rows="15"
              class="border-primary bg-transparent"
              ref="reportPlainText"
              v-model="DxReportContent"
              @keyup.native.119="MacroProcess"
              placeholder="請於此處輸入報告內容"
            />
            <b-textarea
              id="DxRExtra"
              no-resize
              rows="4"
              class="border-warning mt-1 bg-transparent"
              ref="reportExtra"
              v-model="DxReportExtraNote"
              placeholder="請於此處輸入報告額外註記"
            />
          </b-col>
        </b-row>
      </b-container>
    </b-card>

    <b-modal
      id="WinMass0301"
      ref="Window4Mass"
      centered
      hide-footer
      scrollable
      size="xl"
      no-fade
      :header-bg-variant="winMassHeadBgV"
      :header-text-variant="winMassHeadTxV"
      body-class="py-1 themeModal"
      :body-bg-variant="winMassBodyBgV"
    >
      <template slot="modal-title">
        <font-awesome-icon
          :icon="winMassComponent ? 'book-medical' : 'procedures'"
          class="mr-1"
        />
        <span class="zhTW">{{ winMassTitle }}</span>
      </template>
      <div class="d-block zhTW">
        <b-row>
          <b-col class="px-1">
            <RxP
              v-if="winMassComponent"
              :instantContent="instantContent"
            />
            <b-textarea
              v-else
              no-resize
              rows="32"
              readonly
              v-model="winMassContent"
            />
          </b-col>
        </b-row>
      </div>
    </b-modal>
  </div>
</template>

<script>
// 異動歷程:
// 20191023 Pollux,
//	>	PopToast 移至 App.vue 並改名為 TimingMessage
//	>	HotKeyPreSet 加入 default 屬性
//	>	大幅度整理, 並加入[片語維護]鈕(含:hotkey處理, 但其叫用的 component 先不做修改)
//	>	Chrome vs. FireFox 版面差異調整
//	20191024 Pollux,
//	>	加入 $root event listener for b-modal, 藉以調控 hotkey 處理函數是否要作用?
//		!! 一旦加入了 event listener, 就一定要在頁面結束時清除掉 !!
//	>	加入[檢查註記]相關功能
//	>	加入欄位[開單醫師 - RequestingPhysician*]
//	>	加入欄位[病床編號]
//	>	加入[交班記錄]相關功能 > 按鈕的呈現為複雜處理 -- 有資料時以顯目的方式呈現, 沒資料時就淡化處理
//	20191025 Pollux,
//	>	[交班記錄]鈕加入閃爍功能
//	>	開始重組 hotkey 相關處理, 以利進一步運用
//	20191030 Pollux,
//	>	到凌晨一點左右, 新增和修改了諸多功能, 為了今天中午的 demo
//		但還是處於 雛型 階段, 請見諒 code 或邏輯上還有諸多待修正的地方...
//

// 載入模組:組態設定
import * as configs from "@/config";

// 取得相關設定(這裡是 KeyCode 字串常數)
const KeyCode4Control = configs.KeyCode4Control;
const KeyCode4Alternate = configs.KeyCode4Alternate;
const KeyCode4Shift = configs.KeyCode4Shift;

// 載入模組:KeyPressIdentifier
import KeyPressIdentifier from "@/assets/KeyPressIdentifier";
import { mapActions, mapState } from "vuex";
// HotKey 預設組態
var HotKeyPreSet = [
  // F1 to F10
  { hotkey: "F1", default: "F1", method: "HelpShow", title: "功能說明" },
  { hotkey: "F2", default: "F2", method: "call3rdParty", title: "呼叫PAC" },
  {
    hotkey: "F3",
    default: "F3",
    method: "WinMass4Objective",
    title: "醫師客訴",
  },
  {
    hotkey: "F4",
    default: "F4",
    method: "WinMass4Subjective",
    title: "病患主訴",
  },
  {
    hotkey: "F5",
    default: "F5",
    method: "viewUrgentReport",
    title: "緊急通報",
  },
  { hotkey: "F6", default: "F6", method: "WinMass4Phrase", title: "片語維護" },
  {
    hotkey: "F7",
    default: "F7",
    method: "WinMass4Radiographer",
    title: "檢查註記",
  },
  {
    hotkey: "F8",
    default: "F8",
    method: "InstantPhraseCreate",
    title: "快速片語建立",
  },
  {
    hotkey: "F9",
    default: "F9",
    method: "WinIQControlEdit",
    title: "影像品質",
  },
  {
    hotkey: "F10",
    default: "F10",
    method: "versionHistoryOpen",
    title: "報告版次",
  },

  // Alt + key
  {
    hotkey: KeyCode4Alternate + "F1",
    default: KeyCode4Alternate + "F1",
    method: "WinMass4ShiftNote",
    title: "交班記錄",
  },
  {
    hotkey: KeyCode4Alternate + "F2",
    default: KeyCode4Alternate + "F2",
    method: "reportTemplateOpen",
    title: "癌篩報告",
  },
  {
    hotkey: KeyCode4Alternate + "F3",
    default: KeyCode4Alternate + "F3",
    method: "backToPreviousRoute",
    title: "返回清單",
  },
  //{ hotkey: 'KC.F1', default: 'KC.F1', method: 'FocusOnContent', title: '報告內容' },
  //key for saving and sending the report in database Ctrl + key

  {
    hotkey: KeyCode4Control + "F2",
    default: KeyCode4Control + "F2",
    method: "DataSave",
    param: 63,
    title: "暫存報告",
  },
  {
    hotkey: KeyCode4Control + "F3",
    default: KeyCode4Control + "F3",
    method: "DataSave",
    param: 65,
    title: "送交審核",
  },
  {
    hotkey: KeyCode4Control + "F4",
    default: KeyCode4Control + "F4",
    method: "DataSave",
    param: 71,
    title: "正式報告",
  },
  {
    hotkey: KeyCode4Control + "F5",
    default: KeyCode4Control + "F5",
    method: "DataSave",
    param: 61,
    title: "退回重寫",
  },
  // nav next record keys Crl+ key
  // { hotkey: KeyCode4Control + 'F6', default: KeyCode4Control + 'F6', method: 'viewNextRecord', title: '到下一筆' },
  // { hotkey: KeyCode4Control + 'F7', default: KeyCode4Control + 'F7', method: 'viewPrevRecord', title: '到上一筆' },
  //this.viewNextRecord
];

// 動態宣告-外部
var OutterProprty4DynamicDeclare = {
  name4ContentDiff: "versionDiffByDynamic",
};

//	1. 安裝: $ npm i vue-code-diff
//	2. 再加自行撰寫 TextDiff
//	- 這個 plug-in 不是很合用, 但先勉強湊和著用
import TxtDif from "@/components/TextDiff";

// 載入模組:片語維護
import RxP from "@/components/CI0302ReportPhrase";
import { DataManager, WebApiAdaptor, Predicate, Query } from "@syncfusion/ej2-data";

export default {
  name: "FI0301",
  components: { TxtDif, RxP },
  props: {
    GetParams: { type: Function, default: null },
    physicianId: { type: String, default: '' }
  },
  data () {
    return {
      //
      PublicPath: process.env.BASE_URL,
      BasePath: this.$route.path,
      ObjApp: null,
      VueNestLevel: 0,
      //
      UserId: "Pollux",
      UserType: "",
      // 功能啟動時之先決條件的處理狀況
      prerequisiteLoading: false,
      prerequisiteCompleted: false,
      prerequisiteFailure: false,
      // 動態宣告-內部
      innerProprty4DynamicDeclare: OutterProprty4DynamicDeclare,
      // 是否容許 HotKey 攔截器作用?
      allowHotKeyFunctional: true,

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
        OPPrgId: "",
      },
      theMacroList: [],
      /*theProcedure: {
				AccessionNo: '123A567BC',//申請單號(大單號)
				StudyDate: '2019/10/14',//檢查日期
				Modality: 'CT/MRI',//檢查儀器
				PatientId: '1234567-8',//病歷號
				PatientSourceType: 'O-門診',//病患來源
				PatientName: '趙大升',
				PatientSex: 'M-男性',
				PatientBirthday: '1943/12/31',
				PatientAge: 76,
				Subjective: '這裡放的是病患主訴',
				Objective: '這裡是醫師客訴',
				//RadiographerNote: '這是放射師的檢查註記',
				RadiographerNote: '這是放射師的檢查註記\n這是放射師的檢查註記\n這是放射師的檢查註記\n這是放射師的檢查註記\n這是放射師的檢查註記\n這是放射師的檢查註記\n這是放射師的檢查註記\n這是放射師的檢查註記\n',
				RequestingPhysicianId: '1231',
				RequestingPhysicianName: '開單醫師',
				BedNo: '701221',//床號
				ShiftNote: '這是交班記錄',
			},*/
      labProcedures: "檢查項目一\n檢查項目二\n檢查項目三\n檢查項目四",
      // 報告相關資料
      theReport: {
        OrderNo: "",
        AccessionNo: "",
        DxrType: "11",
        DxrStatus: "",
        DxrVersion: "",
        ReportContent: "",
        StructureData: "",
        ImageQualityCode: "",
        ImageQualityNote: "",
        ExtraNote: "",
        DxreportPhysicianId: "",
        ApprovalPhysicianId: "",
        IssuePhysicianId: "",
        IssueTime: "",
        ImageQualityName: "",
        DxreportPhysicianName: "",
        ApprovalPhysicianName: "",
        IssuePhysicianName: "",
        IsPositive: false,
      },
      accessionNos: [],
      origReportContent: "",
      reportHistory: [],
      //
      optionsImageQuality: [],
      //
      instantContent: "",
      //
      selectedIssuePhysician: null,
      optionsIssuePhysician: [],
      //
      saveTime: null,
      myTimer: null,
      isSaving: false,
    };
  },
  computed: {
    ...mapState(["phrase"]),
    phraseRecords () {
      return this.phrase.private.length === 0 && this.phrase.public.length === 0 ? [] : [...this.phrase.private, ...this.phrase.public];
    },
    DxReportContent: {
      get () {
        return this.theReport && this.$Exists(this.theReport.ReportContent) ? this.theReport.ReportContent : "";
      },
      set (v) {
        if (this.theReport && this.$Exists(this.theReport.ReportContent)) this.theReport.ReportContent = v;
      },
    },
    DxReportExtraNote: {
      get () {
        return this.theReport && this.$Exists(this.theReport.ExtraNote) ? this.theReport.ExtraNote : "";
      },
      set (v) {
        if (this.theReport && this.$Exists(this.theReport.ExtraNote)) this.theReport.ExtraNote = v;
      },
    },

    DxRStructureContent: {
      get () {
        return this.theReport && this.$Exists(this.theReport.StructureContent) ? this.theReport.StructureContent : "";
      },
      set (v) {
        if (this.theReport && this.$Exists(this.theReport.StructureContent)) this.theReport.StructureContent = v;
      },
    },
    DxRStructureData: {
      get () {
        return this.theReport && this.$Exists(this.theReport.StructureData) ? this.theReport.StructureData : "";
      },
      set (v) {
        if (this.theReport && this.$Exists(this.theReport.StructureData)) this.theReport.StructureData = v;
      },
    },
  },
  methods: {
    ...mapActions(["action_getPhrase"]),
    //timer設定 => for auto save
    SetMyTimer () {
      this.myTimer = setInterval(() => {
        console.log('---------------------------SET MY TIMER--------------------');
        this.MyTimerTick();
      }, 10000);
    },
    MyTimerTick () {
      this.AutoSave();
    },
    StopTimer () {
      if (this.myTimer) {
        clearInterval(this.myTimer);
      }
    },
    //撈取主治醫師列表
    async GetIssuePhysicianList () {
      // console.log(this.$logs("撈取主治醫師列表"));
      //
      let itemPack = null;
      let convertedCollections = [{ value: null, text: "請選擇" }];
      //
      let subPath = "../Employee/SelectNoList?staffType=21&getAll=false";
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
      this.optionsIssuePhysician = convertedCollections;
    },
    async RecordAppend (closeModal) {
      // 報告存檔 - 後台存取

      this.isSaving = true;
      if (closeModal) this.ObjApp.WaitingShow();

      let opStatus = false;
      let opResult = "存取時發生錯誤!";
      let accessionNos = this.accessionNos.join(",");
      accessionNos = accessionNos.replace(/,\s*$/, "");
      let subPath = "/Report/Save?accessionNos=" + accessionNos;
      let _this = this;
      await window.axios
        .post(subPath, _this.theReport)
        .then((e) => {
          opStatus = true;
          this.origReportContent = this.theReport.ReportContent;
          this.saveTime = new Date();

          if (this.theReport.DxrStatus == "71") {
            this.$emit("RefreshCheckedItems");
          }
        })
        .catch(function (error) {
          opStatus = false;
          opResult += error;
        });

      this.isSaving = false;

      this.ObjApp.WaitingHide();
      //
      if (opStatus) {
        this.ObjApp.TimingMessage("資料已完成存檔作業");
      } else {
        this.ObjApp.TimingMessage(opResult + "! 請稍後再試.", 2);
      }
      if (closeModal) this.$emit("CloseReportEdit");
      return opStatus;
    },
    async PostReportMethod (obj) {
      let methodName = "DxReport.POST";
      await this.$http
        .post("test01/dxreport", this.getDummyReport(obj))
        .then((r) => {
          // console.log(`${this.$logs("Done", methodName)}`);
          // console.log(r.data);
          if (r && r.data) {
            let data = this.$DeepCopy(r.data);
            if (data && data.length > 0 && data[0].Result) {
              if (data[0].Result === "OK") {
                //opStatus = true
                this.origReportContent = obj.ReportContent;
                return true;
                //this.GetReport()
                //this.GetVersions()
              } else {
                opResult = data[0].Result;
                // console.log(`${this.$logs(opResult, methodName)}`);
                return false;
              }
            }
          }
        })
        .catch((err) => {
          this.$stdErr(err, methodName);
          return false;
        });
    },
    FocusOnContent () {
      // 設定(報告內容編輯區塊)為焦點所在
      setTimeout((x) => {
        this.$nextTick(() => {
          if (this.$refs["reportPlainText"]) this.$refs["reportPlainText"].focus();
        });
      }, 100);
    },
    GetMacroValue (v) {
      // 比對(片語代碼)並回傳對應之(置換文字)
      let result = "";
      if (v) {
        console.log("MACROSLIST", this.theMacroList);

        this.theMacroList.some((e) => {
          if (e.PhraseCode === v) {
            result = e.Replacement;
            return true;
          }
        });
      }
      return result;
    },
    getReportPhraseStr (v) {
      if (!this.phraseRecords.length) return "";
      const ret = this.phraseRecords.find((s) => {
        return s.PhraseCode.toLowerCase() === v.toLowerCase();
      });
      return ret ? ret.Replacement : "";
    },
    MacroProcess (e) {
      e.preventDefault();
      // 巨集置換(片語置換)
      const taskObject = this.$refs["reportPlainText"];
      if (!taskObject.value) return;
      const value = taskObject.value.trim();
      const arr = Array.from(value);
      let words = [];
      let end = taskObject.selectionEnd;
      for (let i = end - 1; -1 < end; --i) {
        if (/^\w+$/.test(value[i]) || /\`|\~|\!|\@|\#|\$|\%|\^|\&|\*|\(|\)|\-|\_|\+|\=|\{|\}|\[|\]|\||\;|\:|\'|\"|\,|\.|\/|\<|\>|\?/.test(value[i])) {
          words = [arr[i], ...words];
        } else {
          break;
        }
        --end;
      }
      const key = words.join("");
      const replacement = this.getReportPhraseStr(key);
      if (!replacement) return;
      const len = value.length - words.length;
      const orig = 1 > len ? "" : arr.slice(0, taskObject.selectionEnd - key.length).join("");
      // alert(orig)
      let rightStr = 1 > len ? "" : arr.slice(taskObject.selectionEnd, value.length).join("");
      // alert(rightStr)
      if (rightStr === key) {
        rightStr = "";
      }
      this.DxReportContent = orig ? `${orig}${replacement + rightStr} ` : replacement + " " + rightStr;
      this.DxReportContent = this.DxReportContent.trim();
      taskObject.selectionEnd = end + replacement.length + 1;

      // const triggerChar = " ";
      // const leadingChar = " ";
      // let taskObject = this.$refs["reportPlainText"];
      // let cursorPosition = taskObject.selectionStart;
      // if (taskObject.selectionEnd === cursorPosition) {
      //   if (e.substr(cursorPosition - 1, 1) === triggerChar) {
      //     let segment = e.substr(0, cursorPosition - 1);
      //     if (segment && segment.length > 0) {
      //       let macroPoint = segment.lastIndexOf(leadingChar);
      //       if (macroPoint >= 0) {
      //         let replacement = this.GetMacroValue(
      //           segment.substr(macroPoint + 1)
      //         );
      //         if (replacement && replacement.length > 0) {
      //           this.theReport.ReportContent = `${e.substr(
      //             0,
      //             macroPoint
      //           )} ${replacement}${e.substr(cursorPosition)}`;
      //           setTimeout(() => {
      //             taskObject.selectionStart =
      //               macroPoint + replacement.length + 1;
      //             taskObject.selectionEnd = taskObject.selectionStart;
      //           }, 10);
      //         }
      //       }
      //     }
      //   }
      // }
    },
    InstantPhraseCreate () {
      this.instantContent = "";
      let taskObject = this.$refs["reportPlainText"];
      if (taskObject) {
        let posB = taskObject.selectionStart;
        let posE = taskObject.selectionEnd;
        if (posE > posB) {
          this.instantContent = taskObject.value.substring(posB, posE);
          // console.log(this.$logs(this.instantContent));
          if (this.instantContent && this.instantContent.length > 0) {
            this.WinMass4Phrase();
          }
        }
      }
    },
    DoThis (methodName, ...args) {
      // 動態呼叫處理
      // console.log(this.$logv());
      this[methodName](args);
    },
    [OutterProprty4DynamicDeclare.name4ContentDiff]: async function (x) {
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
      // console.log(
      // this.$logs(null, OutterProprty4DynamicDeclare.name4ContentDiff)
      // );
      // 如果傳入參數為 array, 則轉換型別為 string
      if (typeof x !== "string") {
        x = x[0];
      }
      //
      //this.oldStr = await this.GetVersionContent(x)
      this.newStr = this.theReport.ReportContent;
      //
      this.$refs["Window4Diff"].show();
    },

    WinMass4Phrase () {
      this.winMassComponent = true;
      this.winMassHeadBgV = "primary";
      this.winMassHeadTxV = "white";
      //this.winMassBodyBgV = 'dark'
      this.winMassTitle = "片語維護";
      this.$refs["Window4Mass"].show();
    },

    DataSave (status) {
      if (this.isSaving) return;
      // 啟動 報告存檔 作業
      // console.log(this.$logs("save report:" + status));
      //
      this.theReport.ReportContent = this.theReport.ReportContent.trim();
      if (!this.theReport.ReportContent || this.theReport.ReportContent === "") {
        this.ObjApp.TimingMessage("尚未輸入報告內容, 不得存檔.", 2);
      } else if (status == 63 && this.origReportContent === this.theReport.ReportContent) {
        this.ObjApp.TimingMessage("報告內容並無異動, 無需存檔.", 2);
      } else if (status != 63 && this.selectedIssuePhysician == null) {
        this.ObjApp.TimingMessage("尚未指定主治醫師.", 2);
      } else {
        //
        //報告內容屬於文字報告
        this.theReport.DxrType = "11";
        this.theReport.DxrStatus = "" + status;
        //指定審核醫師代碼
        if (status == 65) {
          this.theReport.ApprovalPhysicianId = this.selectedIssuePhysician;
          this.theReport.IssuePhysicianId = this.selectedIssuePhysician;
        }
        //
        //指定正式報告醫師代碼
        if (status == 71) {
          this.theReport.ApprovalPhysicianId = this.selectedIssuePhysician;
          this.theReport.IssuePhysicianId = this.selectedIssuePhysician;
          this.StopTimer();
        }
        if (status == 63) this.RecordAppend();
        else {
          this.RecordAppend(true);
        }
      }
      //
      this.FocusOnContent();
    },

    AutoSave () {
      //compare time :10秒存一次
      if (this.saveTime != null) {
        let current = new Date();
        let secs = (current.getTime() - this.saveTime.getTime()) / 1000;
        if (secs < 10) return;
      }
      let status = 63;
      // 啟動 報告存檔 作業
      // console.log(this.$logs("save report:" + status));
      //
      this.theReport.ReportContent = this.theReport.ReportContent.trim();
      if (!this.theReport.ReportContent || this.theReport.ReportContent === "") {
        // this.ObjApp.TimingMessage('尚未輸入報告內容, 不得存檔.', 2)
      } else if (this.origReportContent === this.theReport.ReportContent) {
        // this.ObjApp.TimingMessage('報告內容並無異動, 無需存檔.', 2)
      } else {
        //
        //報告內容屬於文字報告
        this.theReport.DxrType = "11";
        this.theReport.DxrStatus = "" + status;
        // //指定審核醫師代碼
        // this.theReport.ApprovalPhysicianId = this.selectedIssuePhysician
        // //
        // //指定正式報告醫師代碼
        // if(status == 71){
        //   this.theReport.IssuePhysicianId = this.selectedIssuePhysician
        // }
        this.RecordAppend(false);
      }
      //
      this.FocusOnContent();
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
        // console.log(this.$logs("OFF"));
        return;
      }
      //
      //this.HotkeyPressed = keyCombine
      let runMethod = null;
      let param = "";
      this.HotkeyList.some((e) => {
        if (e.hotkey === keyCombine) {
          runMethod = e.method;
          param = e.param;
          return true;
        }
      });
      //
      if (runMethod) {
        // console.log(this.$logs(runMethod));
        event.preventDefault();
        this[runMethod](param);
      }
    },
    BMWatch (bvEvent, modalId) {
      // b-Modal Watcher
      // console.log(this.$logs(`${modalId}.${bvEvent.type}`));
      //
      //let cstRoot = $(`#WinCST0301DxRSC`)
      //WinCST
      if (modalId === "WinCST0301" && bvEvent.type === "shown") {
        console.log("WinCST.shown");
        //console.log($(`#WinCST0301DxRSC`))
        //console.log($(`#WinCST0301DxRSC [name="input_date"]`))
        //TODO:若有值, 填回對應項目之值
        //let cstRoot = $(`#WinCST0301DxRSC`)
        //console.log(cstRoot)
        let valueSet = JSON.parse(this.DxRStructureData);
        if (valueSet && valueSet.length > 0) {
          valueSet.forEach((e) => {
            // console.log(e.name + " > [" + e.value + "]");
            let item = $(`#WinCST0301DxRSC [name="${e.name}"]`);
            if (item && item.length > 0) {
              let detail = item[0];
              // ',INPUT,TEXTAREA,'.indexOf(`,${detail.tagName},` >= 0)
              //if(detail.tagName === 'INPUT') {
              if (",INPUT,TEXTAREA,".indexOf(`,${detail.tagName},` >= 0)) {
                console.log(`>> should be [${e.value}]`);
                item.val(e.value);
              }
            }
          });
        }
        //
      }
      //
      if (modalId === "WinConfig") {
        if (",shown,".indexOf(`,${bvEvent.type},`) >= 0) {
          this.allowHotKeyFunctional = false;
        } else if (",hidden,".indexOf(`,${bvEvent.type},`) >= 0) {
          this.allowHotKeyFunctional = true;
        }
        return;
      } else if (modalId === "WinHotkeyDetect0301") {
        if (",shown,".indexOf(`,${bvEvent.type},`) >= 0) {
          this.UnderHotkeyDetect = true;
          window.removeEventListener("keydown", this.HKWatch);
          window.addEventListener("keydown", this.KeyPressInterceptor);
        } else if (",hidden,".indexOf(`,${bvEvent.type},`) >= 0) {
          window.removeEventListener("keydown", this.KeyPressInterceptor);
          window.addEventListener("keydown", this.HKWatch);
          this.UnderHotkeyDetect = false;
        }
        return;
      } else if (modalId === "WinWait") {
        // 只是遮罩, 無須處理
        if (",hidden,".indexOf(`,${bvEvent.type},`) >= 0) {
          this.FocusOnContent();
        }
        return;
      }
      //
      this.allowHotKeyFunctional = ",show,shown,".indexOf(`,${bvEvent.type},`) < 0;
    },
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

    KeyPressInterceptor (e, debugMode = false) {
      // 熱鍵取值框 的 按鍵攔截處理
      //	- 基本邏輯跟 KeyPressIdentifier.js 差不多, 但細部處理不同, 所以得重寫一份
      //
      if (debugMode) console.log(this.$logs());
      if (debugMode) console.log(`> key(${e.key}), keyCode(${e.keyCode}), code(${e.code}) @ location(${e.location})`);
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
        this.ObjApp.TimingMessage(`按鍵[${code}]為特定功能鍵, 不得設為 hotkey !`, 2);
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
        if (!(RegExp(/[`!@#$%^&*()_+}{|":?/><]/).test(code) || (code.length === 1 && RegExp(/[A-Z]/).test(code)))) {
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
      const blockKeyPair = ["KC.P", "KC.F", "KC.KS.P", "KC.E", "KC.K", "KC.J", "KC./", "KC.Z", "KC.Y"];
      //
      if (
        keyCombine.length == 1 &&
        //gExp(/[`!@#$%^&*()_+}{|":;'?/><\[\],.\-=]/).test(keyCombine) ||
        (RegExp(/[`!@#$%^&*()_+}{|":;'?/><[\],.\-=]/).test(keyCombine) || RegExp(/[0-9]/).test(keyCombine) || RegExp(/[A-Z]/).test(keyCombine) || keyCombine === " ")
      ) {
        this.HotkeyPressMessage = `您按下的是<span class='align-text-bottom mx-1'>${interpret}</span>, <span>不得設為 hotkey !</span>`;
        return;
      } else if (blockKeyPair.find((s) => s == keyCombine.trim())) {
        this.HotkeyPressMessage = `您按下的是<span class='align-text-bottom mx-1'>${interpret}</span>, <span>不得設為 hotkey !</span>`;
        return;
      }
      //
      this.HotkeyPressed = keyCombine;
      this.HotkeyPressMessage = `您按下的是<span class='align-text-bottom mx-1'>${interpret}</span>`;
      if (debugMode) console.log(this.$logs(`this.HotkeyPressed=[${this.HotkeyPressed}]`));
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
    //
    async HotkeyConfigSave (updateFlag = false) {
      // 後台儲存:熱鍵組態
      this.ObjApp.WaitingShow();
      //
      let methodName = "HotkeyConfigSave";
      console.log(this.$logs(null, methodName));
      //
      this.HotkeyList = this.$DeepCopy(this.HotkeyTempSet);
      //
      let success = false;
      let message = "ERROR";
      let param = {
        AccId: this.UserId,
        Setting: JSON.stringify(this.HotkeyList),
      };
      // await this.$http
      //   .post("test01/PersonalSetting", param)
      //   .then((r) => {
      //     //
      //     if (r && r.data) {
      //       // console.log(r.data);
      //       if (r.data.Success) {
      //         success = r.data.Success;
      //       } else {
      //         message = r.data.Message;
      //       }
      //     }
      //     //
      //     // console.log(this.$logs(success ? "Done" : message, methodName));
      //   })
      //   .catch((err) => {
      //     this.$stdErr(err, methodName);
      //     message = err.message || message;
      //   });
      //
      // if (success) {
      //   let okMessage = `組態設定已完成${updateFlag ? "調整" : "儲存"}`;
      //   this.ObjApp.TimingMessage(okMessage);
      //   this.$refs["WinConfig"].hide();
      // } else {
      //   this.ObjApp.TimingMessage(message, 2);
      // }
      //
      this.ObjApp.WaitingHide();
    },
    getDummyReport (item) {
      let report = {}; //this.$DeepCopy(this.theReport)
      /*theProcedure: {
				AccessionNo: '123A567BC',//申請單號(大單號)
				StudyDate: '2019/10/14',//檢查日期
				Modality: 'CT/MRI',//檢查儀器
				PatientId: '1234567-8',//病歷號
				PatientSourceType: 'O-門診',//病患來源
				PatientName: '趙大升',
				PatientSex: 'M-男性',
				PatientBirthday: '1943/12/31',
				PatientAge: 76,
				Subjective: '這裡放的是病患主訴',
				Objective: '這裡是醫師客訴',
				//RadiographerNote: '這是放射師的檢查註記',
				RadiographerNote: '這是放射師的檢查註記\n這是放射師的檢查註記\n這是放射師的檢查註記\n這是放射師的檢查註記\n這是放射師的檢查註記\n這是放射師的檢查註記\n這是放射師的檢查註記\n這是放射師的檢查註記\n',
				RequestingPhysicianId: '1231',
				RequestingPhysicianName: '開單醫師',
				BedNo: '701221',//床號
				ShiftNote: '這是交班記錄',
			},*/
      report.AccessionNo = item.cId;
      report.ReportContent = this.theReport.ReportContent;
      return report;
    },
  },

  async created () {
    //
    //資料 from parent
    let params = this.GetParams();
    this.UserId = this.theReport.DxreportPhysicianId = params.dxreportPhysicianId;

    this.UserType = params.staffType;

    this.accessionNos = params.accessionNos;
    if (params.staffType == "21") this.selectedIssuePhysician = params.dxreportPhysicianId;
    //
    let methodName = "created";
    // console.log(`${this.$logs(null, methodName)}`);
    //
    // 取得 App.vue 參照
    let obj = this.$GetApp(this);
    if (obj) {
      this.ObjApp = obj[0];
      this.VueNestLevel = obj[1];
      // console.log(
      //   this.$logs(`Vue Nesting Level ${this.VueNestLevel}`, methodName)
      // );
    } else {
      // console.log(this.$logs("Fail to get App.vue ref.", methodName));
    }
    //
    this.ObjApp.WaitingShow();

    // 宣告監聽器:攔截 KeyPress
    window.addEventListener("keydown", this.HKWatch);

    //20191029.0050 讀取個人設定
    //	1. 初次啟用時, 並無任何個人設定可供讀取, 部份資料(如: Setting)會沒有值
    //	2. 已儲存的熱鍵組態, 可能會因為程式改版, 新增或移除了某些項目, 故會需要自動調校
    //		- 新增項目時, 要注意: 如預設值與現有組態項目相同時, 應改為(尚未設定)
    //	3. 如有上述調校, 則應於調校完畢後, 自動儲存調校後的組態值回後台
    let success = false;
    let message = "ERROR";
    let tempHKList = [];
    methodName = "PersonalSetting.GET";
    // console.log(this.$logs("Call", methodName));
    // await this.$http
    //   .get(`test01/PersonalSetting/${this.UserId}`)
    //   .then((r) => {
    //     //
    //     if (r && r.data) {
    //       if (r.data.Success) {
    //         success = r.data.Success;
    //         let ps = this.$DeepCopy(r.data.Data);
    //         if (ps && ps[0] && ps[0].Setting && ps[0].Setting.length > 0) {
    //           //20191030 暫時只有 hotkey 的部份, 直接轉入
    //           tempHKList = JSON.parse(ps[0].Setting);
    //         } else {
    //           // console.log(this.$logs("尚無設定", methodName));
    //         }
    //       } else {
    //         // console.log("> r.data.Message");
    //         message = r.data.Message;
    //       }
    //     }
    //     //
    //     // console.log(this.$logs(success ? "Done" : message, methodName));
    //   })
    //   .catch((err) => {
    //     this.$stdErr(err, methodName);
    //   });
    if (tempHKList && tempHKList.length > 0) {
      this.HotkeyList = this.$DeepCopy(tempHKList);
      if (this.HotkeyList && this.HotkeyList.length < HotKeyPreSet.length) {
        let anyAppend = false;
        HotKeyPreSet.forEach((e) => {
          let itemFound = false;
          this.HotkeyList.some((x) => {
            if (x.title === e.title) {
              itemFound = true;
              return true;
            }
          });
          if (!itemFound) {
            this.HotkeyList.push(this.$DeepCopy(e));
            // console.log(`> ${e.title} added`);
            anyAppend = true;
          }
        });
        if (anyAppend) {
          // !! 這會造成混亂 ?!
          this.HotkeyConfigSave(true);
        }
      }
    } else {
      this.HotkeyList = HotKeyPreSet;
    }

    this.prerequisiteLoading = true;
    //20191005.1559 擷取所有片語
    methodName = "phrase.GET";
    // console.log(this.$logs("Call", methodName));
    // let raw = await this.$http
    //   .get("test01/phrases")
    //   .then((r) => {
    //     // console.log(this.$logs("Done", methodName));
    //     if (r.data) {
    //       this.theMacroList = [];
    //       r.data.forEach((e) => this.theMacroList.push(e));
    //     }
    //     this.prerequisiteLoading = false;
    //     this.prerequisiteCompleted = true;
    //     return r.data;
    //   })
    //   .catch((err) => {
    //     this.$stdErr(err, methodName);
    //     //
    //     this.prerequisiteLoading = false;
    //     this.prerequisiteFailure = true;
    //   });

    // 讀取 影像品質 等級分類 for SELECT/OPTION
    // 20191031.1610 Pollux, 改為:
    //	1. 由 App.vue 先預載常用的 SELECT/OPTION 資料
    //	2. 直接 copy 來用
    // 藉以加速本功能的啟動
    if (this.ObjApp.options.ImageQuality) {
      this.optionsImageQuality = this.$DeepCopy(this.ObjApp.options.ImageQuality);
    } else {
      console.log("> imageQuality?");
    }
    //
    this.ObjApp.WaitingHide();
    //
    //this.GetReport()
    //this.GetVersions()
    this.FocusOnContent();
    //
    this.GetIssuePhysicianList();
  },
  mounted () {
    //
    // console.log(this.$logs());
    //
    // let params = this.GetParams()
    // this.theReport.accessionNos = this.GetParams()
    //
    // 設定 b-modal listeners
    this.$root.$on("bv::modal::show", this.BMWatch);
    this.$root.$on("bv::modal::shown", this.BMWatch);
    this.$root.$on("bv::modal::hide", this.BMWatch);
    this.$root.$on("bv::modal::hidden", this.BMWatch);

    //
    //
    // 先留下解析度資訊, 日後或許有用...
    // console.log(
    //   this.$logs(
    //     `BView:${document.body.clientWidth}x${document.body.clientHeight}`
    //   )
    // );
    // console.log(this.$logs(`WView:${window.innerWidth}x${window.innerHeight}`));

    //
    // 自動 focus 到 (報告內容編輯區塊)
    this.FocusOnContent();

    if (this.phrase.private.length === 0 && this.phrase.public.length === 0) {
      this.action_getPhrase(this.physicianId);
    }
    this.SetMyTimer();
  },
  destroyed () {
    // console.log(`${this.$logs()}`);
    this.StopTimer();
    this.$emit("RefreshCheckedItems", this.accessionNos);
    // 解除監聽器:攔截 KeyPress
    window.removeEventListener("keydown", this.HKWatch);
    window.removeEventListener("keydown", this.KeyPressInterceptor);
    // 解除 Theme:Black
    //const el = document.body
    //el.classList.remove(this.themePacks.themeBlackName)
    // 解除 b-modal listeners
    this.$root.$off("bv::modal::show", this.BMWatch);
    this.$root.$off("bv::modal::shown", this.BMWatch);
    this.$root.$off("bv::modal::hide", this.BMWatch);
    this.$root.$off("bv::modal::hidden", this.BMWatch);
    //
  },
};
</script>

<style scoped>
/* -- 這行必須放在這裡, 才有作用 --*/
.themeBlack .input-group-text {
  background-color: rgba(0, 0, 0, 0.7);
  color: rgba(255, 255, 255, 0.7);
}

.themeBlack select {
  background-color: rgba(0, 0, 0, 0.7);
  color: rgba(255, 255, 255, 1);
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

/* -- */
.blink {
  animation: blink-animation 1s steps(5, start) infinite;
  -webkit-animation: blink-animation 1s steps(5, start) infinite;
}
@keyframes blink-animation {
  to {
    visibility: hidden;
  }
}
@-webkit-keyframes blink-animation {
  to {
    visibility: hidden;
  }
}

.positive-btn {
  position: absolute;
  left: 360px;
  top: 5px;
}

#blkReportInput textarea {
  background-color: inherit;
  color: inherit;
}
</style>
