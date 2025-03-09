<template>
  <div id="twpv21">
    <b-row no-gutters class="mt-1">
      <b-col xl="12">
        <b-table
          v-if="isMounted"
          bordered
          striped
          responsive
          primary-key="dtcTablex"
          head-variant="dark"
          small
          :items="phraseList"
          :fields="CalcFieldConfig"
          show-empty
          :empty-html="HTML4EmptyContent"
          @row-dblclicked="(e)=>{
            executeDbClick(e)
          }"
          class="px-1"
        >
          <!-- Table BUSY state -->
          <div slot="table-busy" class="text-center text-danger my-2">
            <b-spinner class="align-middle"></b-spinner>&nbsp;
            <strong>載入中, 請稍待 ...</strong>
          </div>
          <!-- 列編輯功能欄位.按鈕 -->
          >
          <template v-slot:cell(OpColumnType1)="row">
            <b-btn
              size="sm"
              variant="success"
              class="no-wrap"
              @click="OnColumnButton1Click(row.item)"
              >{{ Text4OpColButton1 }}</b-btn
            >
          </template>
          <template v-slot:cell(Replacement)="row">
            <div
              :title="row.item.Replacement"
              style="
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
                max-width: 60vw;
                text-align: left;
                cursor: pointer;
              "
              v-b-tooltip.hover
            >
              {{ row.item.Replacement }}
            </div>
          </template>
          <template v-slot:cell(UPDATEDTTM)="row">
            {{ row.item.UPDATEDTTM }}
          </template>
          <template v-slot:cell(OpColumnType2)="row">
            <b-btn
              size="sm"
              v-if="showCopyPasteBtn"
              variant="primary"
              class="no-wrap mr-1"
              @click="OnCopyPaste(row.item)"
              >複製</b-btn
            >
            <b-btn
              size="sm"
              variant="success"
              :disabled="!modifyPublicPhraseRight"
              class="no-wrap mr-1"
              @click="OnColumnButton1Click(row.item)"
              v-if="selectedDtcTab === 2"
              >{{ Text4OpColButton1 }}</b-btn
            >
            <b-btn
              size="sm"
              variant="info"
              :disabled="!modifyPublicPhraseRight"
              class="no-wrap"
              @click="OnColumnButton2Click(row.item)"
              v-if="selectedDtcTab === 2"
              >{{ Text4OpColButton2 }}</b-btn
            >
            <b-btn
              size="sm"
              variant="success"
              :disabled="!modifyPrivatePhraseRight"
              class="no-wrap mr-1"
              @click="OnColumnButton1Click(row.item)"
              v-if="selectedDtcTab === 1"
              >{{ Text4OpColButton1 }}</b-btn
            >
            <b-btn
              size="sm"
              variant="info"
              :disabled="!modifyPrivatePhraseRight"
              class="no-wrap"
              @click="OnColumnButton2Click(row.item)"
              v-if="selectedDtcTab === 1"
              >{{ Text4OpColButton2 }}</b-btn
            >
          </template>
          <!-- 列編輯功能欄位.CheckBox -->
          <template v-slot:cell(CheckBoxColumnType1)="row">
            <b-check
              v-model="row.item.TWPCheckBox1Value"
              @change="OnColumnCheckBox1Change(row.item)"
              >{{ Text4CBColCheckBox1 }}</b-check
            >
          </template>
        </b-table>
      </b-col>
    </b-row>
    <b-row no-gutters class="mb-1" v-if="PagingEnabled">
      <b-col sm="4">
        <div class="float-left my-1 px-1 w-100">
          <b-form-group class="mb-0 ml-4">
            <b-input-group style="gap: 8px">
              <b-form-input
                ref="pSearch"
                id="pSearch"
                v-model="searchCode"
                @keydown.enter="activeSearchFilterCode"
                placeholder="搜尋片語代號"
                size="md"
              ></b-form-input>
              <b-form-input
                @keydown.enter="activeSearchFilterContent"
                v-model="SearchFilter"
                placeholder="搜尋置換內文"
                size="md"
              ></b-form-input>
            </b-input-group>
          </b-form-group>
        </div>
      </b-col>
      <b-col sm="4">
        <b-pagination
          v-model="PagingCurrentPage"
          :total-rows="RowCount"
          :per-page="PagingRowPerPage"
          aria-controls="dataTable1"
          align="center"
        >
          <span slot="first-text">
            <i class="fas fa-fast-backward"></i>
          </span>
          <span slot="prev-text">
            <i class="fas fa-step-backward"></i>
          </span>
          <span slot="next-text">
            <i class="fas fa-step-forward"></i>
          </span>
          <span slot="last-text">
            <i class="fas fa-fast-forward"></i>
          </span>
          <span slot="page" slot-scope="{ page, active }">
            <b v-if="active">{{ page }}</b>
            <i v-else>{{ page }}</i>
          </span>
        </b-pagination>
      </b-col>
      <b-col sm="4">
        <div class="float-right my-1 pr-4">
          <label
            for="pagingPerPageOption"
            class="float-left my-1"
            v-html="GetPageOptionLabel"
          ></label>
          <b-form-select
            id="pagingPerPageOption"
            size="sm"
            plain
            v-if="PagingEnabled"
            v-model="PagingRowPerPage"
            :options="this.$DefaultPerPageOption"
          ></b-form-select>
        </div>
      </b-col>
    </b-row>
  </div>
</template>

<script>
// 異動歷
// 20191114 Pollux,
//	因 Bootstrap-Vue 版本變更, 其 slot 語法改變, 本功能必須因應調整
// 20191114.1817 Pollux, 測試 CI/CD off

// 載入組態設定模組
import buildQuery from "odata-query";
import BusFactory from "@/assets/js/busFactory.js";
import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
import { dateFormatMixin } from "@/SupportLib_J.js";
// import { getPhraseData } from "@/assets/service/dataManager.js";
import { mapMutations, mapState, mapActions, mapGetters } from "vuex";

export default {
  name: "TWPv2",
  mixins: [dateFormatMixin],
  props: {
    FieldConfig: { type: Array, required: true },
    DataFetch: { type: Function },
    NoPaging: { type: Boolean },
    Operatable: { type: Boolean },
    OpButton1Func: { type: Function },
    OpButton1Text: { type: String },
    OpButton2Func: { type: Function },
    OpButton2Text: { type: String },
    CheckBox1Head: { type: String },
    CheckBox1Text: { type: String },
    CheckBox1Func: { type: Function },
    CheckBox1Lead: { type: Boolean },
    ThemeBlack: { type: Boolean, default: false },
    selectedDtcTab: { type: Number, default: 1 },
  },
  data() {
    return {
      records: [],
      showCopyPasteBtn: false,
      currentPageNum: 1,
      id: this.$store.state.Profile4User.id,
      Wait4AsyncLoad: false,
      PagingEnabled: true,
      PagingRowPerPage: 10,
      PagingCurrentPage: 1,
      TableSortBy: "",
      TableSortDesc: false,
      RowCount: 0,
      SearchFilter: null,
      searchCode: null,
      filterKey: "",
      filterContent: "",
      isFilterByKey: false,
      isFilterByContent: false,
      SlotId4OpColType1: "OpColumnType1",
      SlotId4OpColType2: "OpColumnType2",
      Text4OpColButton1: "",
      Text4OpColButton2: "",
      SlotId4CBColType1: "CheckBoxColumnType1",
      Text4CBColCheckBox1: "",
      UsingThemeBlack: false,
      busFactory: BusFactory(this),
      isMounted: false,
    };
  },
  computed: {
    ...mapState(["DxreportPhysician", "phrase"]),
    ...mapGetters(["getProfileFunctions", "gPrivatePhrase", "gPublicPhrase"]),
    modifyPublicPhraseRight() {
      return this.getProfileFunctions.includes("FI0302") && this.getProfileFunctions.includes("CommonReportPhrase");
    },
    modifyPrivatePhraseRight() {
      return this.getProfileFunctions.includes("FI0302");
    },
    phraseList() {
      const tempPhrase =
        this.selectedDtcTab === 1 ? this.gPrivatePhrase : this.gPublicPhrase;
      if (!this.isMounted || tempPhrase.length === 0) {
        return [];
      } else {
        let _phrase =
          !this.isFilterByKey && !this.isFilterByContent
            ? tempPhrase
            : this.isFilterByKey && !this.isFilterByContent
            ? tempPhrase.filter(({ PhraseCode }) =>
                PhraseCode.toLowerCase().includes(this.filterKey.toLowerCase())
              )
            : !this.isFilterByKey && this.isFilterByContent
            ? tempPhrase.filter(({ Replacement }) =>
                Replacement.includes(this.filterContent)
              )
            : tempPhrase;
        this.RowCount = _phrase.length;
        return _phrase.filter((p, index) => {
          const start = (this.PagingCurrentPage - 1) * this.PagingRowPerPage;
          return index >= start && index < start + this.PagingRowPerPage;
        });
      }
    },
    CalcFieldConfig() {
      let tempOwner = [
        {
          key: "PhraseOwnerNo",
          label: "擁有者",
          sortable: true,
          thClass: "no-wrap",
          tdClass: "no-wrap text-center",
        },
      ];
      let tempOpColumn = [
        {
          key: "OpColumnType2",
          label: "操作",
          thClass: "no-wrap",
          tdClass: "no-wrap",
        },
      ];
      let tempField = [
        {
          key: "PhraseCode",
          label: "片語代號",
          sortable: true,
          thClass: "no-wrap",
          tdClass: "no-wrap text-center",
        },
        {
          key: "Modality",
          label: "儀器名稱",
          sortable: true,
          thClass: "no-wrap",
          tdClass: "no-wrap text-center",
        },
        {
          key: "Replacement",
          label: "置換內文",
          sortable: true,
          thClass: "no-wrap",
          tdClass: "wrap text-left replacement",
        },
        {
          key: "UPDATEDTTM",
          label: "異動日期",
          sortable: true,
          thClass: "no-wrap",
          tdClass: "no-wrap text-center",
        },
      ];
      if (this.selectedDtcTab === 1) {
        return [...tempField, ...tempOwner, ...tempOpColumn];
      } else {
        return [...tempField, ...tempOpColumn];
      }
    },
    disableBtn() {
      const ret = this.$store.state.Profile4User.functions.find(
        (s) => s === "CommonReportPhrase"
      );
      return ret ? false : true;
    },
    GetPageOptionLabel() {
      return (
        "<span class='text-light'>共計 <b>" +
        this.$FormatForceInteger(this.RowCount) +
        "</b> 筆, 每頁顯示&nbsp; </span"
      );
    },
    HTML4EmptyContent() {
      return this.Wait4AsyncLoad
        ? '<b><i class="fas fa-spinner fa-spin"></i>&nbsp;內容載入中, 請稍待 ...</b>'
        : "<b>很抱歉, 目前並無任何內容可供呈現.</b>";
    },
    HTML4EmptyResult() {
      return '<b class="text-light">抱歉, 並無任何吻合條件的內容.</b>';
    },
  },
  methods: {
    ...mapMutations([
      "SHOW_LOADING",
      "HIDE_LOADING",
      "SET_PRIVATE_PHRASE",
      "SET_PUBLIC_PHRASE",
    ]),
    ...mapActions(["action_getPhrase"]),
    executeDbClick(e){
      console.log(`executeDbClick~`, e)
      console.log(this.$route.path)

      if(this.$route.path === '/MI03/FI0301'){
        this.OnCopyPaste(e)
      }
    },
    activeSearchFilterCode() {
      this.isFilterByContent = false;
      this.SearchFilter = "";
      this.filterContent = "";

      this.isFilterByKey = this.searchCode.length > 0;
      this.filterKey = this.searchCode;
      this.currentPageNum = 1;
    },
    activeSearchFilterContent() {
      this.isFilterByKey = false;
      this.searchCode = "";
      this.filterKey = "";

      this.isFilterByContent = this.SearchFilter.length > 0;
      this.filterContent = this.SearchFilter;
      this.currentPageNum = 1;
    },
    Formatter4NTD(x) {
      return this.$FormatForceInteger(x);
    },
    OnCopyPaste(item) {
      // if(item.Replacement){
      //   item.Replacement = '\n' + item.Replacement + '\n'
      // }      
      
      this.$root.$emit("dtc-copy-paste", item && item.Replacement ? item.Replacement : '');

      Swal.fire({
        position: "center",
        icon: "success",
        title: "複製並貼上至報告內容完成!!",
        showConfirmButton: false,
        timer: 600,
      });

      // setTimeout(()=>{
      //   this.$bvModal.hide('WinMass0301')
      // },1000)
    },
    OnColumnButton1Click(x) {
      this.OpButton1Func(x);
      this.action_getPhrase(null);
    },
    OnColumnButton2Click(x) {
      this.OpButton2Func(x);
      this.action_getPhrase(null);
    },
    OnColumnCheckBox1Change(x) {
      this.CheckBox1Func(x);
    },
    async AsyncFetch() {
      if (this.phrase.private.length === 0 || this.phrase.public.length === 0) {
        // this.SHOW_LOADING();
        // const isPersonalPhrase = this.$route.name === 'FI0302';

        this.action_getPhrase(null);

        setTimeout(() => {
          // TO DO ....
          // this.HIDE_LOADING();
          this.isMounted = true;
          this.RowCount =
            this.phrase[
              this.selectedDtcTab === 1 ? "private" : "public"
            ].length;
        });
      } else {
        this.isMounted = true;
        this.RowCount =
          this.phrase[this.selectedDtcTab === 1 ? "private" : "public"].length;
      }
    },
    GetCheckBox1Text() {
      return this.CheckBox1Text ? this.CheckBox1Text : "";
    },
    GetCheckBox1Object() {
      return {
        key: this.SlotId4CBColType1,
        label: this.CheckBox1Head ? this.CheckBox1Head : "",
        thClass: "no-wrap",
      };
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
    }
  },
  created() {
    //showCopyPasteBtn
    location.href.includes("FI0301")
      ? (this.showCopyPasteBtn = true)
      : (this.showCopyPasteBtn = false);

    // const isPersonalPhrase = this.$route.name === 'FI0302';
    this.busFactory.$on("reload-report-phrase", () =>
      this.action_getPhrase(null)
    );
  },
  mounted() {

    this.UsingThemeBlack = this.$IsThemeBlack();
    if (this.Operatable || this.OpButton1Func) {
      this.FieldConfig.push({
        key: this.OpButton2Func
          ? this.SlotId4OpColType2
          : this.SlotId4OpColType1,
        label: "操作",
        thClass: "no-wrap",
        tdClass: "no-wrap",
      });
      this.Text4OpColButton1 = !this.OpButton1Text
        ? "編輯"
        : this.OpButton1Text;
      if (this.OpButton2Func) {
        this.Text4OpColButton2 = !this.OpButton2Text
          ? "管理"
          : this.OpButton2Text;
      }
    }
    //
    if (this.CheckBox1Func && !this.CheckBox1Lead) {
      this.Text4CBColCheckBox1 = this.GetCheckBox1Text();
      this.FieldConfig.push(this.GetCheckBox1Object());
    }

    this.AsyncFetch(this.currentPageNum).catch((e) => {});
    this.isMounted = true;

    console.log(`phrase > mounted & ready`)
    this.reFocus()

  },
  beforeDestroy(){
    if(this.$route.path === '/MI03/FI0301'){
      this.$root.$emit("focusOnReport")
    }
  },
  watch: {
    PagingCurrentPage(v) {
      this.currentPageNum = v;
      this.AsyncFetch().catch((e) => {});
    },
    selectedDtcTab() {
      this.currentPageNum = 1;
      this.SearchFilter = "";
      this.isMounted = false;
      this.AsyncFetch().catch((e) => {});
      this.isMounted = true;
    },
    PagingRowPerPage() {
      this.currentPageNum = 1;
      this.AsyncFetch().catch((e) => {});
    },
    SearchFilter(v) {
      const idx = this.phrase[
        this.selectedDtcTab === 1 ? "private" : "public"
      ].findIndex(({ Replacement }) => Replacement === v);
      if (idx >= 0) {
        this.PagingCurrentPage = Math.floor(idx / this.PagingRowPerPage) + 1;
      }
    },
    TableSortDesc() {
      this.currentPageNum = 1;
      //alert(this.TableSortBy);
      this.AsyncFetch().catch((e) => {});
    },
    searchCode(v) {
      // const idx = this.phrase[this.selectedDtcTab === 1 ? 'private' : 'public'].findIndex(({ PhraseCode }) => PhraseCode === v);
      // if (idx >= 0) {
      //   this.PagingCurrentPage = Math.floor(idx / this.PagingRowPerPage) + 1;
      // }
      // if (v.length === 0 && this.isFilterByKey) this.isFilterByKey = false;
    },
  },
};
</script>

<style scope>
#pagingPerPageOption {
  width: 5.5rem;
}
ul.pagination {
  margin-bottom: 0;
}

.nav-item a {
  color: inherit;
}
</style>

<style>
#WinMass0301 .nav-link {
  cursor: pointer;
}
</style>

<style lang="scss" scope>
.replacement {
  max-width: 300px;
}
</style>
