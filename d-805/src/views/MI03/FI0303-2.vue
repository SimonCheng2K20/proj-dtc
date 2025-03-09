<template>
  <div class="pageContent">
    <b-card no-body class="mx-1">
      <b-card-header class="bg-primary text-white cardHeader">
        <b-row no-gutters>
          <b-col cols="6" class="float-left text-left">癌篩樣版維護作業</b-col>
        </b-row>
      </b-card-header>

      <b-card-text class="text-center">
        <b-row no-gutters>
          <b-col>
            <div class="float-left ml-1 py-1">
              <b-btn ref="btnAppend" variant="danger" size="sm" @click="Edit4Append"><i class="fas fa-plus"></i> 新增資料</b-btn>
            </div>
          </b-col>
        </b-row>
        <!--
				<TWP ref="twp1" v-bind:FieldConfig="TableConfig" v-bind:DataFetch="GetDataContent"></TWP>
				-->
        <TWP ref="twp1" v-bind:FieldConfig="TableConfig" v-bind:DataFetch="GetDataContent" v-bind:OpButton1Func="Edit4Update"></TWP>
      </b-card-text>
    </b-card>

    <b-modal
      id="WinEdit0303"
      ref="Window4Edit"
      centered
      hide-footer
      size="xl"
      body-class="themeModal"
      :header-bg-variant="WinEditConfig.HeadBgV"
      :header-text-variant="WinEditConfig.HeadTxV"
      :body-bg-variant="WinEditConfig.BodyBgV"
      :body-text-variant="WinEditConfig.BodyTxV"
      @show="EditFocusOnShow"
    >
      <template slot="modal-title"><i class="fas fa-edit mr-1"></i><span class="zhTW">癌篩樣版</span></template>
      <div class="d-block text-center zhTW">
        <b-row>
          <b-col class="px-1"
            ><b-input-group prepend="樣版代號"><b-input ref="ItemCode" v-model="RecordCode" :disabled="Flag4EditOP > 1"/></b-input-group
          ></b-col>
        </b-row>
        <b-row>
          <b-col class="px-1 mt-1"
            ><b-input-group prepend="樣版名稱"><b-input ref="ItemName" v-model="RecordName" :disabled="Flag4EditOP > 2"/></b-input-group
          ></b-col>
        </b-row>
        <b-row>
          <b-col class="px-1 mt-1"><RTE ref="ItemContent" :EditContent="RecordContent" :disabled="Flag4EditOP > 2"/></b-col>
        </b-row>
        <b-row>
          <b-col class="text-right px-1 mt-1">
            <b-button variant="success" class="mr-1" @click="CancelEditOP" ref="EditBtnCancel"><font-awesome-icon icon="trash" class="mr-1" />取消變更</b-button>
            <b-button variant="danger" class="mr-1" v-if="Flag4EditOP === 1" @click="RecordAppend"><font-awesome-icon icon="save" class="mr-1" />新增記錄</b-button>
            <b-button variant="danger" class="mr-1" v-if="Flag4EditOP === 2" @click="RecordUpdate"><font-awesome-icon icon="save" class="mr-1" />儲存變更</b-button>
            <!--
						<b-button variant="danger" class='mr-1' v-if='Flag4EditOP === 3' @click='RecordDelete'><font-awesome-icon icon="save" class='mr-1' />刪除記錄</b-button>
						-->
          </b-col>
        </b-row>
      </div>
    </b-modal>
  </div>
</template>

<script>
// 載入組態設定模組
import * as configs from "@/config";
import TWP from "@/components/TWPv2";
import RTE from "@/components/RichTextEditor";
import { DataManager, WebApiAdaptor, Predicate, Query } from "@syncfusion/ej2-data";

export default {
  name: "FI0303",
  components: { TWP, RTE },
  data() {
    return {
      PublicPath: process.env.BASE_URL,
      BasePath: this.$route.path,
      ObjApp: null,
      VueNestLevel: 0,
      //
      TableConfig: [],
      //
      Flag4EditOP: 0,
      majorData: null,
      WinEditConfig: {
        HeadBgV: "",
        HeadTxV: "",
        BodyBgV: "",
        BodyTxV: ""
      }
    };
  },
  computed: {
    RecordCode: {
      get() {
        return this.majorData && this.$Exists(this.majorData.CSTId) ? this.majorData.CSTId : "";
      },
      set(v) {
        if (this.$Exists(this.majorData.CSTId)) this.majorData.CSTId = v;
      }
    },
    RecordName: {
      get() {
        return this.majorData && this.$Exists(this.majorData.CSTName) ? this.majorData.CSTName : "";
      },
      set(v) {
        if (this.$Exists(this.majorData.CSTName)) this.majorData.CSTName = v;
      }
    },
    RecordContent: {
      get() {
        return this.majorData && this.$Exists(this.majorData.StructureContent) ? this.majorData.StructureContent : "";
      },
      set(v) {
        if (this.$Exists(this.majorData.StructureContent)) this.majorData.StructureContent = v;
      }
    }
  },
  methods: {
    // GetDataContent() {
    // 	console.log(this.$logs())
    // 	return this.ObjApp.CommonGet(`CST/iTems`)
    // },
    //
    //list選單撈取資料
    async GetDataContent() {
      console.log(this.$logs());
      //
      let itemPack = null;
      //
      let subPath = "../cst/List";
      //
      this.ObjApp.WaitingShow();
      let opStatus = false;
      //
      await new DataManager({
        url: configs.publicPath + subPath,
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      })
        //Query物件 包含search conditions //TODO 這裡帶的都是假變數, 確認真實狀況後變更
        .executeQuery(new Query())
        .then(r => {
          itemPack = r.actual; //資料;
          opStatus = true;
        });

      //
      //
      this.ObjApp.WaitingHide();
      //
      if (opStatus) {
        // this.ObjApp.TimingMessage('資料已完成存檔作業')
      } else {
        this.ObjApp.TimingMessage(opResult + "! 請稍後再試.", 2);
      }

      return itemPack;
    },
    CancelEditOP() {
      this.Flag4EditOP = 0;
      this.$refs["Window4Edit"].hide();
    },
    EditFocusOnShow() {
      console.log(this.$logs());
      let fieldRef = "";
      if (this.Flag4EditOP === 1) {
        fieldRef = "ItemCode";
      } else if (this.Flag4EditOP === 2) {
        fieldRef = "ItemName";
      } else if (this.Flag4EditOP === 3) {
        fieldRef = "EditBtnCancel";
      }
      //
      if (fieldRef) {
        setTimeout(x => {
          this.$nextTick(() => this.$refs[fieldRef].focus());
        }, 500);
      }
    },
    async Edit4Append() {
      let methodName = "Edit4Append";
      console.log(this.$logs(null, methodName));
      this.Flag4EditOP = 1;
      this.majorData = await this.ObjApp.TemplateGet("CST");
      this.$refs["Window4Edit"].show();
    },
    Edit4Update(x) {
      console.log(this.$logs());
      this.Flag4EditOP = 2;
      this.majorData = x;
      this.$refs["Window4Edit"].show();
    },
    Edit4Delete(x) {
      console.log(this.$logs());
      this.Flag4EditOP = 3;
      this.majorData = x;
      this.$refs["Window4Edit"].show();
    },
    ValidContent() {
      console.log(this.$logs());
      //
      if (this.$refs.ItemContent && this.$refs.ItemContent.GetEditorData) {
        this.RecordContent = this.$refs.ItemContent.GetEditorData();
      }
      //
      let error = false;
      if (!this.RecordContent || this.RecordContent.length <= 0) {
        this.ObjApp.TimingMessage("樣版內文尚未給定", 2);
        error = true;
      }
      if (!this.RecordName || this.RecordName.length <= 0) {
        this.ObjApp.TimingMessage("樣版名稱尚未給定", 2);
        error = true;
      }
      if (!this.RecordCode || this.RecordCode.length <= 0) {
        this.ObjApp.TimingMessage("樣版代號尚未給定", 2);
        error = true;
      }
      //TODO: 切 focus
      return !error;
    },
    // async RecordAppend() {
    //   if (this.ValidContent()) {
    //     this.ObjApp.WaitingShow();
    //     let methodName = "CST.POST";
    //     let opStatus = await this.ObjApp.CommonPost("CST", this.majorData);
    //     this.ObjApp.WaitingHide();
    //     if (opStatus) {
    //       this.ObjApp.TimingMessage("資料已完成新增作業");
    //       this.$refs["Window4Edit"].hide();
    //       this.$refs.twp1.OnForceRefresh();
    //     } else {
    //       //TODO:強化訊息內容
    //       this.ObjApp.TimingMessage("存取時發生錯誤! 請稍後再試.", 2);
    //     }
    //     return opStatus;
    //   }
    // },
    async RecordAppend() {
      if (!this.ValidContent()) return;

      // 報告存檔 - 後台存取
      this.ObjApp.WaitingShow();

      let opStatus = false;
      let opResult = "存取時發生錯誤!";
      let subPath = "/cst/Save";
      let _this = this;
      await window.axios
        .post(subPath, _this.majorData)
        .then(e => {
          opStatus = true;
        })
        .catch(function(error) {
          opStatus = false;
          opResult += error;
        });

      this.ObjApp.WaitingHide();
      //
      if (opStatus) {
        this.ObjApp.TimingMessage("資料已完成存檔作業");
        this.$refs["Window4Edit"].hide();
        this.$refs["twp1"].OnForceRefresh();
      } else {
        this.ObjApp.TimingMessage(opResult + "! 請稍後再試.", 2);
      }
      return opStatus;
    },
    // async RecordUpdate() {
    //   if (this.ValidContent()) {
    //     this.ObjApp.WaitingShow();
    //     let methodName = "CST.POST";
    //     let opStatus = await this.ObjApp.CommonPost("CST", this.majorData);
    //     this.ObjApp.WaitingHide();
    //     if (opStatus) {
    //       this.ObjApp.TimingMessage("資料已完成變更作業");
    //       this.$refs["Window4Edit"].hide();
    //       this.$refs.twp1.OnForceRefresh();
    //     } else {
    //       //TODO:強化訊息內容
    //       this.ObjApp.TimingMessage("存取時發生錯誤! 請稍後再試.", 2);
    //     }
    //     return opStatus;
    //   }
    // }
    RecordUpdate() {
      this.RecordAppend();
    }
  },
  created() {
    let methodName = "created";
    console.log(this.$logs(null, methodName));
    //
    // 取得 App.vue 參照
    let obj = this.$GetApp(this);
    if (obj) {
      this.ObjApp = obj[0];
      this.VueNestLevel = obj[1];
    } else {
      console.log(this.$logs("Fail to get App.vue ref.", methodName));
    }
    //
    this.TableConfig = [
      { key: "CSTId", label: "代號", sortable: true, thClass: "no-wrap", tdClass: "no-wrap text-left" },
      { key: "CSTName", label: "名稱", sortable: false, thClass: "no-wrap", tdClass: "no-wrap text-left" },
      { key: "CSTVersion", label: "版次", sortable: false, thClass: "no-wrap", tdClass: "no-wrap text-left" }
    ];
  },
  mounted() {
    console.log(this.$logs());
    //
    if (this.$IsThemeBlack()) {
      this.WinEditConfig.HeadBgV = "dark";
      this.WinEditConfig.HeadTxV = "light";
      this.WinEditConfig.BodyBgV = "dark";
      this.WinEditConfig.BodyTxV = "light";
    } else {
      this.WinEditConfig.HeadBgV = "primary";
      this.WinEditConfig.HeadTxV = "light";
    }
  }
};
</script>
