<template>
  <div>
    <b-card-text class="text-center">
      <b-row no-gutters>
        <b-col>
          <div class="float-left ml-1 py-1">
            <b-btn
              :disabled="disableBtn && selectedItem === 2"
              style="margin-left: 19px; margin-bottom: 12px"
              ref="btnAppend"
              variant="danger"
              size="sm"
              @click="Edit4Append"
              v-if="$store.state.Profile4User.functions.includes('FI0302', 'CommonReportPhrase')"
            >
              <i class="fas fa-plus"></i> 新增資料
            </b-btn>
          </div>
        </b-col>
      </b-row>

      <b-nav pills style="margin-left: 19px">
        <b-nav-item
          :active="selectedItem === 1"
          @click="updateTab(1, $event)"
          id="privatePhraseTab"
          ref="privatePhraseTab"
        >個人片語維護</b-nav-item>
        <b-nav-item
          :active="selectedItem === 2"
          @click="updateTab(2, $event)"
          id="publicPhraseTab"
          ref="publicPhraseTab"
        >公用片語維護</b-nav-item>
      </b-nav>
      <TWP
        v-if="isMounted"
        ref="twp1"
        v-bind:FieldConfig="TableConfig"
        v-bind:DataFetch="GetDataContent"
        v-bind:OpButton1Func="Edit4Update"
        v-bind:OpButton2Func="Edit4Delete"
        OpButton2Text="刪除"
        v-bind:selectedDtcTab="selectedItem"
      />
    </b-card-text>

    <b-modal
      id="WinEdit0302"
      ref="Window4Edit"
      centered
      hide-footer
      size="xl"
      @show="EditFocusOnShow"
      @hide="ModalHide"
    >
      <template slot="modal-title">
        <i class="fas fa-edit mr-1"></i>
        <span class="zhTW">片語異動</span>
      </template>
      <div class="d-block text-center lang-zh-Hant-TW">
        <b-row>
          <b-col class="px-1">
            <b-input-group prepend="片語代號">
              <b-input
                ref="RCode"
                v-model="RecordCode"
                :disabled="Flag4EditOP > 1"
              />
            </b-input-group>
          </b-col>
        </b-row>
        <b-row>
          <!-- v-if="reportPhrase.Modality" -->
          <b-col class="px-1">
            <b-input-group prepend="儀器名稱" class="mt-1">
              <b-form-select
                v-model="reportPhrase.Modality"
                :options="options"
                :disabled="Flag4EditOP > 1"
              ></b-form-select>
            </b-input-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col class="px-1 mt-1">
            <b-input-group prepend="置換內文">
              <b-textarea
                ref="RReplacement"
                no-resize
                rows="15"
                v-model="RecordReplacement"
                :disabled="Flag4EditOP > 2"
              />
            </b-input-group>
          </b-col>
        </b-row>
        <b-row>
          <b-col class="text-right px-1 mt-1">
            <b-button
              variant="success"
              class="mr-1"
              @click="CancelEditOP"
              ref="EditBtnCancel"
            >
              <font-awesome-icon icon="trash" class="mr-1" />取消變更
            </b-button>
            <b-button
              variant="danger"
              class="mr-1"
              v-if="Flag4EditOP === 1"
              @click="RecordAppend"
            >
              <font-awesome-icon icon="save" class="mr-1" />新增記錄
            </b-button>
            <b-button
              variant="danger"
              class="mr-1"
              v-if="Flag4EditOP === 2"
              @click="RecordUpdate"
            >
              <font-awesome-icon icon="save" class="mr-1" />儲存變更
            </b-button>
            <b-button
              variant="danger"
              class="mr-1"
              v-if="Flag4EditOP === 3"
              @click="RecordDelete"
            >
              <font-awesome-icon icon="save" class="mr-1" />刪除記錄
            </b-button>
          </b-col>
        </b-row>
      </div>
    </b-modal>
  </div>
</template>

<script>
import TWP from "@/components/ReportPhraseCmp";
import BusFactory from "@/assets/js/busFactory.js";
import { mapMutations } from "vuex";

export default {
  name: "CI0302",
  components: { TWP },
  props: {
    instantContent: { type: String },
  },
  data() {
    return {
      isMounted: false,
      selectedItem: 1,
      personal: true,
      selected: null,
      // options: [{ value: "", text: "請選擇..." }],
      options: [],
      PublicPath: process.env.BASE_URL,
      BasePath: this.$route.path,
      TableConfig: [
        {
          key: "PhraseCode",
          label: "片語代號",
          sortable: true,
          thClass: "no-wrap",
          tdClass: "no-wrap text-left",
        },
        {
          key: "snapshot",
          label: "置換內文",
          sortable: false,
          thClass: "no-wrap",
          tdClass: "no-wrap text-left",
        },
      ],
      Flag4EditOP: 0,
      reportPhrase: {
        Modality: null,
        PhraseCode: "",
        Replacement: "",
      },
      WinEditConfig: {
        HeadBgV: "",
        HeadTxV: "",
        BodyBgV: "",
        BodyTxV: "",
      },
      rRole: [],
    };
  },
  computed: {
    disableBtn() {
      const ret = this.$store.state.Profile4User.functions.find(
        (s) => s === "CommonReportPhrase"
      );
      return ret ? false : true;
    },
    loginId() {
      return this.$store.state.Profile4User.id;
    },
    RecordCode: {
      get() {
        return this.reportPhrase && this.$Exists(this.reportPhrase.PhraseCode)
          ? this.reportPhrase.PhraseCode
          : "";
      },
      set(v) {
        if (this.$Exists(this.reportPhrase.PhraseCode))
          this.reportPhrase.PhraseCode = v;
      },
    },
    RecordType: {
      get() {
        return this.reportPhrase && this.$Exists(this.reportPhrase.Modality)
          ? this.reportPhrase.Modality
          : "";
      },
      set(v) {
        if (this.$Exists(this.reportPhrase.Modality))
          this.reportPhrase.Modality = v;
      },
    },
    RecordReplacement: {
      get() {
        return this.reportPhrase && this.$Exists(this.reportPhrase.Replacement)
          ? this.reportPhrase.Replacement
          : "";
      },
      set(v) {
        if (this.$Exists(this.reportPhrase.Replacement))
          this.reportPhrase.Replacement = v;
      },
    },
    isEditingModalShow() {
      return this.isMounted ? this.$refs["Window4Edit"].isShow : false;
    },
  },
  methods: {
    ...mapMutations([
      "CLEAR_PHRASE",
      "SHOW_LOADING",
      "HIDE_LOADING",
      "SET_SIDE_MESSAGE",
    ]),
    updateTab(n, evt) {
      // n == 1 ? (this.personal = true) : (this.personal = false);
      this.personal = n === 1;
      this.selectedItem = n;
      //evt.target.querySelector(".nav-link").classList.add("active");
    },
    GetRawData() {
      let methodName = "phrase.GET";
      // console.log(this.$logs());
      // console.log(this.$logs("Call", methodName));
      return this.$http
        .get("test01/phrases")
        .then((r) => {
          // console.log(this.$logs("Done", methodName));
          return r.data;
        })
        .catch((err) => {
          this.$stdErr(err, methodName);
        });
    },
    ParseRawData(raw) {
      return [...raw];
    },
    GetDataContent() {
      // this.GetRawData().then((i) => this.ParseRawData(i)); don't know why
      return [];
    },
    async GetRecordTemplate() {
      let methodName = "Template.GET";
      // console.log(this.$logs("Call", methodName));
      await this.$http
        .get("test01/phrasetemplate")
        .then((r) => {
          // console.log(this.$logs("Done", methodName));
          if (r.data) {
            r.data.forEach((e) => {
              this.reportPhrase = this.$DeepCopy(e);
            });
          }
        })
        .catch((err) => {
          // this.$stdErr(err, methodName);
        });
    },
    CancelEditOP() {
      this.Flag4EditOP = 0;
      this.$refs["Window4Edit"].hide();
    },
    EditFocusOnShow() {
      // console.log(`${this.$logs()}`);
      let fieldRef = "";
      if (this.Flag4EditOP === 1) {
        fieldRef = "RCode";
      } else if (this.Flag4EditOP === 2) {
        fieldRef = "RReplacement";
      } else if (this.Flag4EditOP === 3) {
        fieldRef = "EditBtnCancel";
      }
      //
      if (fieldRef) {
        setTimeout((x) => {
          this.$nextTick(() => this.$refs[fieldRef].focus());
        }, 500);
      }
    },
    async Edit4Append() {
      //let methodName = 'Edit4Append'
      //console.log(this.$logs(null, methodName))

      console.log(`Edit4Append >`);
      // this.reportPhrase

      this.Flag4EditOP = 1;
      // await this.GetRecordTemplate();

      if (this.instantContent && this.instantContent.length > 0) {
        this.RecordReplacement = this.instantContent;
      } else {
        this.RecordCode = null;
        this.reportPhrase.Modality = "";
        this.RecordReplacement = null;
      }

      this.$refs["Window4Edit"].show();
    },
    Edit4Update(x) {
      this.Flag4EditOP = 2;

      console.log(`Edit4Update: `, x);

      this.reportPhrase = { ...x };

      // alert(JSON.stringify(this.reportPhrase));
      this.$refs["Window4Edit"].show();
    },
    Edit4Delete(x) {
      // console.log(this.$logs());
      this.Flag4EditOP = 3;
      this.reportPhrase = x;
      window.delete = x;
      this.$refs["Window4Edit"].show();
    },
    async RecordDelete() {
      this.SHOW_LOADING();
      this.HIDE_LOADING();
      try {
        await window.axios.delete(
          `/reportPhrase/Delete?Modality=${this.RecordType}${
            this.personal ? "&PhraseOwnerNo=" + this.loginId : ""
          }&PhraseCode=${this.RecordCode}`
        );
        this.SET_SIDE_MESSAGE({ msg: "資料已刪除完成" });
        this.$bvModal.hide("WinEdit0302");
        this.updateTableEvent();
      } catch (err) {
        this.SET_SIDE_MESSAGE({ msg: "資料刪除失敗", type: 2 });
      } finally {
        this.HIDE_LOADING();
      }

      // this.$root.$emit("reload-report-phrase");
    },
    ValidContent() {
      let error = false;
      if (!this.RecordReplacement || this.RecordReplacement.length <= 0) {
        this.SET_SIDE_MESSAGE({ msg: "置換內文尚未給定", type: 2 });
        error = true;
      }
      if (!this.RecordCode || this.RecordCode.length <= 0) {
        this.SET_SIDE_MESSAGE({ msg: "片語代號尚未給定", type: 2 });
        error = true;
      }
      //TODO: 切 focus
      return !error;
    },
    async RecordAppend() {
      let obj = {
        IsPublic: !this.personal ? true : false,
        PhraseOwnerNo: !this.personal ? "" : this.loginId,
        Modality: this.RecordType,
        PhraseCode: this.RecordCode,
        Replacement: this.RecordReplacement,
      };

      console.log(this.RecordCode, this.RecordReplacement);

      // if (this.RecordType === "select") {
      //   this.SET_SIDE_MESSAGE({ msg: `請選擇'儀器名稱'`, type: 2 });
      //   return
      // }
      
      if (!this.RecordCode || !this.RecordReplacement) {
        this.SET_SIDE_MESSAGE({ msg: "片語代號 /置換內文  欄位必填", type: 2 });
        return;
      }

      this.SHOW_LOADING();
      try {
        await window.axios.post(`/reportPhrase/Add`, obj);
        this.updateTableEvent();
        this.SET_SIDE_MESSAGE({ msg: "資料已完成存檔作業" });
      } catch (e) {
        this.SET_SIDE_MESSAGE({ msg: "片語代號重複，請修正！", type: 2 });
      } finally {
        this.HIDE_LOADING();
        this.$bvModal.hide("WinEdit0302");
      }

      // this.$root.$emit("reload-report-phrase");
    },
    async RecordUpdate() {
      let obj = {
        IsPublic: !this.personal,
        PhraseOwnerNo: !this.personal ? "" : this.loginId,
        Modality: this.RecordType,
        PhraseCode: this.RecordCode,
        Replacement: this.RecordReplacement,
      };

      if (!this.RecordCode || !this.RecordReplacement) {
        this.SET_SIDE_MESSAGE({ msg: "片語代號 /置換內文  欄位必填", type: 2 });
        return;
      }
      this.SHOW_LOADING();
      try {
        await window.axios.put(`/reportPhrase/Update`, obj);
        this.SET_SIDE_MESSAGE({ msg: "資料已完成更新作業" });
        this.$bvModal.hide("WinEdit0302");
      } catch (err) {
        this.SET_SIDE_MESSAGE({ msg: "資料更新作業失敗", type: 2 });
      } finally {
        this.HIDE_LOADING();
      }
      // this.$root.$emit("reload-report-phrase");
      this.updateTableEvent();
    },
    ModalHide() {
      let methodName = "b-modal.hide";
      // console.log(this.$logs(null, methodName));
      //
      if (this.instantContent && this.instantContent.length > 0) {
        //
        //	在 快速建立片語 時, 部份的操作方式會讓 focus 不知道跑那兒去
        //	致使 報告撰寫 功能攔截不到 ESC 鍵來關閉 片語維護 視窗
        //	解決方式: 編輯視窗關閉時自動 focus 到 新增資料 鈕
        //
        let obj = this.$refs["btnAppend"];
        if (obj) {
          setTimeout((x) => {
            // console.log(this.$logs(`set focus`, methodName));
            this.$nextTick(() => obj.focus());
          }, 500);
        }
      }

      this.reFocus()

      //
    },
    reFocus(){
      let focusOne = document.querySelector('#privatePhraseTab')
      let runCount = 2
      
      let focusInterval = () => {
        runCount -= 1
        try {
          if(focusOne){
            focusOne.focus()
          }
        } catch (error) {
          console.log(`error: `, error)
          clearInterval(focusTimer)
        }
        if (runCount <= 0) clearInterval(focusTimer)
      }

      if(focusOne){
        focusOne.focus()
      }

      let focusTimer = setInterval(focusInterval, 1000)
    },
    updateTableEvent() {
      this.isMounted = false;
      this.CLEAR_PHRASE();
      setTimeout(() => {
        this.isMounted = true;
      }, 200);
    },
    refresh() {
      this.isMounted = false;
      setTimeout(() => {
        this.isMounted = true;
      }, 200);
    },
  },
  async beforeMount() {
    const Items = await window.axios.get(
      // `/generalData/SelectNoList?groupNo=ModalityTag`
      `/exam/GetModalityNoList`
    );

    this.options = [
      { value: "", text: "請選擇..." },
      ...Items.map(({ No, Name }) => ({ value: No, text: No })),
    ];
  },
  async mounted() {
    // console.log(this.$logs());
    // this.reportPhrase = {};
    this.WinEditConfig.HeadBgV = "dark";
    this.WinEditConfig.HeadTxV = "light";
    this.WinEditConfig.BodyBgV = "dark";
    this.WinEditConfig.BodyTxV = "dark";

    if (this.instantContent && this.instantContent.length > 0) {
      this.Edit4Append();
    }
    this.isMounted = true;

    console.log(this.$router.currentRoute.name);

    await window.axios.get('/role/SelectList').then((e) => {
      if (e != null) {
        this.rRole = e.Items
      }
      console.log(`this.rRole: `, this.rRole)
    })

  },
  watch: {
    isEditingModalShow(val) {
      // reportPhrase.Replacement

      if (!val) {
        this.$emit("clearInstantContent");
        this.RecordReplacement = "";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.disable-tab {
  background: #ccc;
  color: white;
  cursor: pointer;
  color: white !important;
  text-decoration: none;
  background: #ccc;
}
.dark {
  background: black;
  height: 95vh;
}

.text-black {
  .nav-link {
    color: black !important;
  }
}
/deep/ .table {
  color: inherit;
}
</style>
