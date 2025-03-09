<template>
  <b-modal
    class="fix-light"
    @shown="init"
    id="enterDlg"
    title="手動開單"
    size="xl"
    :header-bg-variant="variants[3]"
    :header-text-variant="variants[7]"
    :footer-bg-variant="headerBgVariant"
  >
    <template slot="modal-title">
      <font-awesome-icon
        icon="cog"
        class="mr-1"
      />
      <span class="zhTW">手動開單</span>
      <div class="ml-3 d-inline-block">
        <b-input-group
          prepend="病歷號"
          class="required2"
          style="min-width:400px;"
        >
          <b-input
            v-model.trim="map.personNum"
            @blur="onPersonNumUpdate"
            :placeholder="defaultNum"
          />
        </b-input-group>
      </div>
    </template>
    <b-container
      fluid
      class="dtc-grid-manually"
    >
      <b-input-group prepend="身分證號">
        <b-input
          v-model.trim="map.personId"
          @blur="getPersonInfo"
        />
      </b-input-group>
      <b-input-group prepend="中文姓名">
        <b-input v-model.trim="map.name" />
      </b-input-group>

      <b-input-group prepend="英文姓名">
        <b-input v-model.trim="map.english" />
      </b-input-group>
      <b-input-group prepend="性別">
        <div
          class="form-control"
          style="padding: 0.1rem;"
        >
          <b-form-radio-group
            v-model="map.sex"
            style="padding-left:3px;padding-top:5px;"
          >
            <b-form-radio value="M">男</b-form-radio>
            <b-form-radio value="F">女</b-form-radio>
          </b-form-radio-group>
        </div>
      </b-input-group>
      <b-input-group prepend="生日">
        <input
          type="date"
          v-model="map.birthday"
          style="flex:1;min-width:0px"
          max="2029-12-31"
        />
      </b-input-group>

      <b-input-group prepend="手機">
        <b-input v-model.trim="map.mobile" />
      </b-input-group>
      <b-input-group prepend="檢查單號">
        <b-input
          v-model.trim="map.inspectNum"
          :placeholder="inspectPlaceHolder"
        />
      </b-input-group>

      <b-input-group
        prepend="病患來源"
        class="required"
        v-if="optionsPatientSource && optionsPatientSource.length"
      >
        <b-input-group
          prepend="病患來源"
          v-if="!optionsPatientSource || !optionsPatientSource.length"
        >
          <b-form-input
            :value="`健診`"
            :disabled="true"
          ></b-form-input>
        </b-input-group>
        <b-select
          v-model="map.source"
          :options="optionsPatientSource"
        />
      </b-input-group>

      <b-input-group prepend="是否急作">
        <div
          class="form-control"
          style="padding: 0.4rem;"
        >
          <b-form-radio-group v-model="map.urgent">
            <b-form-radio value="Y">是</b-form-radio>
            <b-form-radio value="N">否</b-form-radio>
          </b-form-radio-group>
        </div>
      </b-input-group>

      <b-input-group prepend="住院號">
        <b-input v-model.trim="map.givenNum" />
      </b-input-group>

      <b-input-group prepend="病床號">
        <b-input v-model.trim="map.bedNum" />
      </b-input-group>

      <b-input-group
        prepend="開單醫生"
        class="required"
      >
        <!-- <b-select v-model="map.orderPerson" :options="allDrs" /> -->
        <v-super-select
          v-if="showSuperSelect"
          class="bg-white"
          @keydown.enter="super1Keydown"
          noneFoundText="無此筆資料"
          placeholder="請選擇開單醫生"
          searchFields="value,text"
          v-model="map.orderPerson"
          :items="allDrs"
        />
      </b-input-group>
      <b-input-group
        prepend="開單科別"
        class="required"
      >
        <!-- <b-select v-model="map.orderCat" :options="cats" /> -->
        <v-super-select
          v-if="showSuperSelect"
          class="bg-white"
          @keydown.enter="super2Keydown"
          noneFoundText="無此筆資料"
          placeholder="請選擇開單科別"
          searchFields="value,text"
          v-model="map.orderCat"
          :items="cats"
        />
      </b-input-group>

      <template v-if="map.source==='T'">
        <b-input-group
          prepend="轉診醫院"
          class="required"
        >
          <v-super-select
            ref="referralsHospital"
            key="referralsInstitution"
            noneFoundText="無此筆資料"
            placeholder="請選擇轉診醫院"
            searchFields="value,text"
            v-model="map.ReferralsInstitutionName"
            :items="referralsHospital.map(({text})=> ({text, value: text}))"
            class="bg-white"
          />
        </b-input-group>

        <b-input-group prepend="轉診醫師">
          <v-super-select
            :disabled="!map.ReferralsInstitutionName"
            key="referralsDoctors"
            ref="referralsDoctor"
            noneFoundText="無此筆資料"
            placeholder="請選擇轉診醫生"
            searchFields="value,text"
            v-model="map.ReferralsDoctorName"
            :items="referralsDoctorsList"
            class="bg-white"
          />

        </b-input-group>

        <!-- <div v-text="map.ReferralsInstitutionName" />
        <div v-text="referralsHospital" /> -->
      </template>

      <template v-else-if="map.source==='Z'">
        <b-input-group
          prepend="轉檢醫院"
          class="required"
        >
          <v-super-select
            ref="transferHospital"
            key="transferinstitution"
            noneFoundText="無此筆資料"
            placeholder="請選擇轉檢醫院"
            searchFields="value,text"
            v-model="map.TransferInstitutionName"
            :items="transferHospital"
            class="bg-white"
          />
        </b-input-group>
        <b-input-group prepend="轉檢醫師">
          <v-super-select
            key="transferDoctors"
            :disabled="!map.TransferInstitutionName"
            ref="transferDoctor"
            noneFoundText="無此筆資料"
            placeholder="請選擇轉檢醫生"
            searchFields="value,text"
            v-model="map.TransferDoctorName"
            :items="transferDoctorsList"
            class="bg-white"
          />

        </b-input-group>
      </template>

      <b-input-group prepend="主治醫生">
        <!-- <b-select v-model="map.mainDr" :options="mainDrs" /> -->
        <v-super-select
          v-if="showSuperSelect"
          @keydown.enter="super3Keydown"
          noneFoundText="無此筆資料"
          placeholder="請選擇主治醫生"
          searchFields="value,text"
          v-model="map.mainDr"
          :items="allDrs"
          class="bg-white"
        />
      </b-input-group>
      <b-input-group prepend="自費註記">
        <div
          class="form-control"
          style="padding: 0.4rem;"
        >
          <!-- <b-form-radio-group v-model="map.selfPay">
            <b-form-radio value="Y">自費</b-form-radio>
            <b-form-radio value="N">非自費</b-form-radio>
          </b-form-radio-group> -->
          <b-form-radio-group v-model="map.selfPay">
            <b-form-radio value="10">健保</b-form-radio>
            <b-form-radio value="20">自費</b-form-radio>
          </b-form-radio-group>
        </div>
      </b-input-group>
    </b-container>
    <header class="hd1">
      <div>儀器類別</div>
      <b-form-radio-group
        v-model="cat1"
        :options="cat1s"
        :disabled="finalList.length > 0"
      ></b-form-radio-group>
    </header>

    <header
      class="hd2"
      hidden
    >
      <div class="required">檢查室</div>
      <b-form-radio-group
        v-model="cat2"
        :options="cat2s"
      ></b-form-radio-group>
    </header>

    <section class="dtc-full-grid">
      <div
        class="no-data text-danger h2"
        v-if="!part2s.length && !loadingApi"
      >
        {{ part1 }}
        <span style="display:inline-block;margin-left:12px;color:white;">
          暫無資料,
          {{ part1 ? "請選擇左方其它品項自訂分類" : "請選擇左方自訂分類" }}
        </span>
      </div>
      <div
        v-if="loadingApi"
        class="no-data"
      >
        <div>
          資料處理中請稍後。
          <b-spinner
            type="grow"
            label="Spinning"
          ></b-spinner>
          <b-spinner
            type="grow"
            label="Spinning"
          ></b-spinner>
          <b-spinner
            type="grow"
            label="Spinning"
          ></b-spinner>
        </div>
      </div>
      <div
        class="left2"
        style="border:1px solid white;min-height:400px;"
      >
        <header
          class="dtc-row text-white"
          style="border-radius:5px;margin-bottom:12px;line-height:30px;"
        >
          <div class="title pl-1">
            <span class="d-inline-block mr-1">{{ cat1 }}</span>
            自訂分類 (共{{ part1s.length }}筆)
          </div>
          <div class="title"></div>
        </header>
        <div
          v-for="(item, i) in part1s"
          :key="i"
          class="dtc-row pl-2"
        >
          <input
            type="radio"
            name="part1"
            :id="'dtcpart' + i"
            @click="clickRadioBtn(item.Id, item.Name)"
          />
          <label
            :for="'dtcpart' + i"
            style="margin-left:20px;"
          >{{ item.Name }}</label>
        </div>
      </div>
      <div class="right">
        <header class="dtc-row text-white">
          <div class="title">
            {{ part1 }}
            <span style="display:inline-block;margin-left:4px;">檢查項目</span>
            <span v-if="part2s.length">{{ `(共${part2s.length}筆)` }}</span>
          </div>
          <div class="title">檢查描述</div>
        </header>

        <label
          v-for="(item, i) in part2s"
          :key="i"
          class="dtc-row"
          :for="item.No"
        >
          <div>
            <input
              :id="item.No"
              :type="cat1==='CR' ? 'checkbox':'radio'"
              :name="part1Id"
              @change="inspectChange($event, item)"
              :checked="finalList.some(checkItem => checkItem.No == item.No)"
              style="display:inline-block;margin-right:5px;"
            />
            {{ item.No }}
          </div>
          <div>{{ item.Name }}</div>
        </label>
      </div>
    </section>
    <section
      class="final-list"
      style="margin-top:16px;"
    >
      <div class="w1">
        <div
          class="fixed"
          style="color:red"
        >
          *
          <span style="color:red;font-size:22px">檢查項目清單:</span>
        </div>
      </div>
      <div class="w2">
        <div
          class="empty-list"
          v-if="!finalList.length"
        >溫馨提醒--請選擇 1. 自訂分類 2.檢查項目</div>
        <header class="dtc-final-row text-white">
          <div class="title">儀器類別</div>
          <div class="title">自訂分類</div>
          <div class="title">檢查項目</div>
          <div class="title">檢查描述</div>
        </header>
        <div
          v-for="(item, i) in finalList"
          :key="i"
          class="dtc-final-row"
        >
          <div>{{ item.cat1 }}</div>
          <div>{{ item.part1 }}</div>
          <div>{{ item.No }}</div>
          <div>{{ item.Name }}</div>
          <b-button
            @click="removeItem(item, i)"
            variant="danger"
            size="sm"
          >
            <font-awesome-icon
              icon="eraser"
              class="mr-1"
            />刪除 </b-button>
          <div></div>
        </div>
      </div>
    </section>
    <div
      v-if="loading"
      class="loading"
    >
      <div
        class="mt-2"
        style="font-size:24px"
      >
        資料處理中請稍後。
        <b-spinner
          type="grow"
          label="Spinning"
        ></b-spinner>
        <b-spinner
          type="grow"
          label="Spinning"
        ></b-spinner>
        <b-spinner
          type="grow"
          label="Spinning"
        ></b-spinner>
        <b-spinner
          type="grow"
          label="Spinning"
        ></b-spinner>
        <b-spinner
          type="grow"
          label="Spinning"
        ></b-spinner>
        <b-spinner
          type="grow"
          label="Spinning"
        ></b-spinner>
      </div>
    </div>

    <template v-slot:modal-footer>
      <div class="w-100 dtc-footer">
        <p
          class="float-left ml-3"
          style="font-size:24px !important;"
        >
          溫馨提醒 :
          <span style="color:red;font-size:24px;">* {{ 4 + (map.source=='Z' ? 1:map.source=='T' ? 1 : 0) }} 欄位必填(開單醫生/開單科別/檢查項目清單/病患來源{{ map.source=='Z' ? '/轉檢醫院':map.source=='T' ? '/轉診醫院' : '' }} )</span>
          <span style="font-size:12px !important;">{{ debugMsg1 }}</span>
        </p>
        <div
          class="dtc-overwite"
          v-if="forceOverWrite"
        >
          <div>是否覆寫現有病患資訊?</div>
          <b-button
            variant="primary"
            :disabled="loading"
            @click="add"
          >覆寫現有資訊</b-button>
          <div></div>
          <b-button @click="
              forceOverWrite = false;
              open = false;
              errorOnOverWrite = false;
            ">不要覆寫</b-button>
          <p
            class="mt-3"
            v-show="errorOnOverWrite"
          >覆寫失敗!!</p>
        </div>

        <b-button
          size="lg"
          class="float-right"
          @click="$bvModal.hide('enterDlg')"
        >
          <font-awesome-icon icon="undo" />取消開單 </b-button>
        <div class="float-right mx-3">&nbsp;&nbsp;&nbsp;&nbsp;</div>
        <b-button
          :disabled="open"
          @click="add"
          size="lg"
          variant="warning"
          class="float-right"
        >
          <font-awesome-icon icon="edit" />手動開單 </b-button>
        <div
          style="color:red;font-size:32px;"
          class="float-right mr-4"
          variant="danger"
          v-show="errors"
        >*欄位必填</div>
      </div>
    </template>
  </b-modal>
</template>

<script>
import Vue from "vue";
import { mapGetters, mapMutations } from "vuex";
import Swal from "sweetalert2";
import { DatePickerPlugin } from "@syncfusion/ej2-vue-calendars";
import VSuperSelect from "v-super-select";
import moment from "moment";
import { getEmployeeDataByType, getReferralsHospitalList, getTransferDetectHospitalList, getTransferDoctorList, postTransferDoctorList } from "@/assets/service/dataManager.js";
Vue.use(DatePickerPlugin);
//https://cythilya.github.io/2017/03/12/uuid/
function _uuid () {
  var d = Date.now();
  d += performance.now(); //use high-precision timer
  return "xxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}
const parts = new Array(20).fill({});
let defaultDevice = "";
export default {
  data () {
    return {
      ObjApp: "",
      showSuperSelect: true,
      errorOnOverWrite: false,
      forceOverWrite: false,
      debugMsg1: "",
      inspectPlaceHolder: "",
      loadingApi: false,
      defaultNum: "DTC" + moment().format("YYYYMMDDHHmmss"),
      errors: false,
      cats: [],
      mainDrs: [],
      allDrs: [],
      optionsPatientSource2: [],
      partsFields: [
        { key: "code", label: "部位代號" },
        { key: "name", label: "部位名稱" },
      ],
      part1s: [],
      part2s: [],
      part1: "",
      part1Id: '',
      finalList: [],
      rooms: [],
      cat1s: [],
      cat2s: [],
      parts,
      results: [],
      loading: false,
      extraList: [],
      open: false,
      cat1: "",
      cat2: "",

      map: {
        personNum: "", //病歷號
        personId: "", //身分證號
        name: "",
        english: "",
        sex: "M",
        birthday: "",
        mobile: "",
        inspectNum: "", //檢查單號
        source: "O", //病患來源
        urgent: "N",
        givenNum: "", //住院號
        bedNum: "", //病床號
        orderPerson: "", //開單醫生
        orderCat: "", //開單科別
        mainDr: "", //主治醫生
        selfPay: "10",
        ReferralsInstitutionName: '', // 轉診醫院
        ReferralsDoctorName: '',      // 轉診醫師
        TransferInstitutionName: '',   // 轉檢醫院
        TransferDoctorName: ''       // 轉檢醫師
      },
      variants: ["primary", "secondary", "success", "warning", "danger", "info", "light", "dark"],
      headerBgVariant: "black",
      headerTextVariant: "light",
      cloneMap: "",
      referralsHospital: null,
      transferHospital: null
    };
  },
  props: ["optionsCheckItem", "optionsPatientSource", "optionsLocationSource", "CheckinStatusSource"],
  computed: {
    ...mapGetters(["getThemeColors", "getListDrs", "getIssueDrs"]),
    transferDoctorsList () {
      return !this.map.TransferInstitutionName || !this.transferHospital.find(({ text }) => text === this.map.TransferInstitutionName) || !this.transferHospital.find(({ text }) => text === this.map.TransferInstitutionName)['doctors']
        ? []
        : this.transferHospital.find(({ text }) => text === this.map.TransferInstitutionName)['doctors'].map(v => ({ text: v, value: v }));
    },
    referralsDoctorsList () {
      return !this.map.ReferralsInstitutionName || !this.referralsHospital.find(({ text }) => text === this.map.ReferralsInstitutionName) || !this.referralsHospital.find(({ text }) => text === this.map.ReferralsInstitutionName)['doctors']
        ? []
        : this.referralsHospital.find(({ text }) => text === this.map.ReferralsInstitutionName)['doctors'].map(v => ({ text: v, value: v }));
    }
  },
  components: { VSuperSelect },
  created () {
    this.headerBgVariant = this.getThemeColors.key === "white" || this.getThemeColors.key === "lightGray" ? "light" : "black";
    this.headerTextVariant = this.getThemeColors.key === "white" || this.getThemeColors.key === "lightGray" ? "black" : "light";
    Promise.all([   // 取得轉診及轉檢的醫院資料
      getReferralsHospitalList(),
      getTransferDetectHospitalList()
    ]).then(([referHospital, detectHospital]) => {
      this.transferHospital = detectHospital.Items.map(({ No, Name }) => ({ text: Name, value: No }));
      this.referralsHospital = referHospital.Items.map(({ No, Name }) => ({ text: Name, value: No, doctors: null }));
    });

  },
  methods: {
    ...mapMutations(["SET_LIST_DR", "SET_ISSUE_DR"]),
    showAlert1 () {
      if (!window.dtcDebug) return;
      //this.debugMsg1 = "";
    },
    super1Keydown () {
      this.map.orderPerson = "";
      const el = document.querySelector('[placeholder="請選擇開單醫生"]');
      let v = "" + el.value;
      if (!v) {
        this.map.orderPerson = "";
        el.value = "";
        return;
      }
      v = v.toUpperCase().trim();
      const ret = this.allDrs.find((s) => {
        if (s.value == v || s.text == v) return s;
      });
      this.map.orderPerson = el.value = "";
      this.map = Object.assign({}, this.map);
      if (ret) {
        this.map.orderPerson = ret.value;
        this.map = Object.assign({}, this.map);
        el.value = ret.text;
      }
    },
    super2Keydown () {
      const el = document.querySelector('[placeholder="請選擇開單科別"]');
      let v = "" + el.value;
      if (!v) {
        this.map.orderCat = "";
        el.value = "";
        return;
      }
      v = v.toUpperCase().trim();
      const ret = this.cats.find((s) => {
        if (s.value == v || s.text == v) return s;
      });
      this.map.orderCat = el.value = "";
      this.map = Object.assign({}, this.map);
      if (ret) {
        this.map.orderCat = ret.value;
        this.map = Object.assign({}, this.map);
        el.value = ret.text;
      }
    },
    super3Keydown () {
      const el = document.querySelector('[placeholder="請選擇主治醫生"]');
      let v = "" + el.value;
      if (!v) {
        this.map.mainDr = "";
        el.value = "";
        return;
      }
      v = v.toUpperCase().trim();
      const ret = this.mainDrs.find((s) => {
        if (s.value == v || s.text == v) return s;
      });
      this.map.mainDr = el.value = "";
      this.map = Object.assign({}, this.map);
      if (ret) {
        this.map.mainDr = ret.value;
        this.map = Object.assign({}, this.map);
        el.value = ret.text;
      }
    },
    async clickRadioBtn (id, name) {
      this.part1 = name;
      this.part1Id = id;
      this.part2s = [];
      this.loadingApi = true;
      try {
        const { Items } = await window.axios.get("/modalityCategory/ProcedureList?modalityCategoryId=" + id);
        this.loadingApi = false;
        Items.sort((a, b) => (a.No > b.No ? 1 : a.No < b.No ? -1 : 0));
        this.part2s = Items;
      } catch (e) {
        alert(e);
      } finally {
        this.loadingApi = false;
      }
    },
    async getPersonInfo () {
      if (this.map.personId.length < 10) return;
      try {
        const { No, NaturalPerson: np } = await window.axios.get("/patient/GetByRESIDENTUID?uid=" + this.map.personId);

        if (No) this.map.personNum = No;
        this.map.name = np.Name;
        this.map.english = np.NAMEINFOREIGN;
        this.map.birthday = np.Birthday ? moment(np.Birthday).format("YYYY-MM-DD") : "";
        this.map.sex = np.Sex;
        this.map.mobile = np.PhoneNo4Mobile;
        //this.map.inspectNum = No;
        if (window.dtcDebug) {
          this.debugMsg1 = "GetByRESIDENTUID : 檢查單號" + this.map.inspectNum + ":" + JSON.stringify(np);
        }
      } catch (e) {
        console.log("");
      }
    },
    removeItem (item, i) {
      var arr = [...this.finalList];
      arr.splice(i, 1);
      this.finalList = arr;
      const el = document.querySelector("#" + item.No);
      if (el) {
        el.checked = false;
      }
    },
    partChange (evt, idx) {
      const add = evt.target.checked;
      if (add) {
        [...document.querySelectorAll(".my-part")].forEach((s) => {
          s.checked = false;
        });
      }
      evt.target.checked = add;
    },
    inspectChange (evt, item) {
      const added = evt.target.checked;
      const { No, Name } = item;
      let obj = { No, Name, cat1: this.cat1, part1: this.part1 };
      if (!added) {
        let arr = [];
        this.finalList.forEach((s) => {
          if (s.No !== No) arr.push(s);
        });
        this.finalList = arr;
      } else if (added) {
        if (this.finalList.find((s) => s.No == No)) return;
        // this.finalList = [...this.finalList, obj];

        if (this.cat1 != "CR" && this.finalList.some(({ cat1 }) => cat1 === this.cat1)) {
          this.finalList = this.finalList.filter(item => item.cat1 !== this.cat1);
        }
        this.finalList.push(obj);
      }
    },
    uuid () {
      return _uuid();
    },
    init () {
      this.open = false;
      this.forceOverWrite = false;
      this.errorOnOverWrite = false;
      this.debugMsg1 = "";
      const el = document.querySelector("#enterDlg___BV_modal_content_");
      el.requestFullscreen();
      this.extraList = [];
      if (!this.cloneMap) {
        const s = JSON.stringify(this.map);
        this.cloneMap = JSON.parse(s);
        return;
      }
      this.finalList = [];
      this.part1 = "";
      this.part2s = [];
      this.defaultNum = "DTC" + moment().format("YYYYMMDDHHmmss");
      this.map = Object.assign({}, this.cloneMap, {
        personNum: "",
        cat1: defaultDevice,
      });
      const q = ".super-select-input input[type=text]";
      [...document.querySelectorAll(q)].forEach((s) => (s.value = ""));
      //this.set(this.map, "inspectId", _uuid());
      setTimeout(async () => {
        const v = await window.axios.get("/Exam/GetManualOrderNo");
        this.inspectPlaceHolder = v;
      });

      setTimeout(() => (this.showSuperSelect = false), 10);
      setTimeout(() => (this.showSuperSelect = true), 50);
    },

    async onPersonNumUpdate () {
      try {
        const { NaturalPerson: np } = await window.axios.get(`/patient/Get?no=${this.map.personNum}`);
        if (window.dtcDebug) {
          this.debugMsg1 = "/patient/Get: " + JSON.stringify(np);
        }
        this.map.personId = np.RESIDENTUID;
        this.map.name = np.Name;
        this.map.sex = np.Sex;
        this.map.birthday = np.Birthday ? moment(np.Birthday).format("YYYY-MM-DD") : "";
        this.map.english = np.NAMEINFOREIGN;
        this.map.mobile = np.PhoneNo4Mobile;
      } catch (e) {
        //alert();
      }
    },
    async getPart1List (type) {
      const { Items } = await window.axios.get("/modalityCategory/SelectList?modality=" + type);
      Items.sort((a, b) => (a.Name > b.Name ? 1 : a.Name < b.Name ? -1 : 0));
      this.part1s = Items;
    },

    addItem () {
      const arr = new Array(3).fill({ inspectItem: "" });
      this.extraList = [...this.extraList, ...arr];
    },
    async add () {
      this.loading = true;
      this.open = true;
      // (!this.map.orderPerson || !this.map.orderCat)
      const flag = (this.map.source !== 'T' && this.map.source !== 'Z')
        ? false
        : !(this.map.source === 'T' ? ["ReferralsInstitutionName"] : ["TransferInstitutionName"]).every(k => {
          return !!this.map[k];
        });
      // const flag = !(this.map.source === 'T' ? ["ReferralsInstitutionName", "TransferDoctorName"] : ["TransferInstitutionName"]).every(k => {
      //   return !!this.map[k];
      // });

      if (flag || !this.map.orderPerson || !this.map.orderCat || !this.finalList.length || !this.map.source) {
        this.errors = true;
        this.loading = false;
        setTimeout(() => (this.errors = false), 3000);
        this.open = false;
        return;
      }
      let map = {};
      map.PatientId = this.map.personNum ? this.map.personNum : this.defaultNum; //病歷號
      window.dtcMMPatientId = map.PatientId;
      map.RESIDENTUID = this.map.personId; //身分證號
      map.PatientName = this.map.name ? this.map.name : this.map.personNum ? this.map.personNum : this.defaultNum;
      map.PatientNameInForeign = this.map.english;
      map.PatientSex = this.map.sex;
      map.PatientBirthday = this.map.birthday ? new Date(this.map.birthday).toISOString() : "";
      map.PhoneNo4Mobile = this.map.mobile;
      map.OrderNo = this.map.inspectNum || this.inspectPlaceHolder; //檢查單號
      map.PatientSourceTypeCode = this.map.source; //病患來源
      map.EmgFlag = this.map.urgent;
      map.EncounterNo = this.map.givenNum; //住院號
      map.BedNo = this.map.bedNum; //病床號
      map.RequestingPhysicianId = this.map.orderPerson && this.map.orderPerson.value ? this.map.orderPerson.value : this.map.orderPerson; //開單醫生
      map.RequestingServiceId = this.map.orderCat && this.map.orderCat.value ? this.map.orderCat.value : this.map.orderCat; //開單科別
      map.ReferringPhysicianId = this.map.mainDr && this.map.mainDr.value ? this.map.mainDr.value : this.map.mainDr; //主治醫生
      // map.SelfPay = this.map.selfPay == "Y" ? true : false;

      map.ChargeTypeId = this.map.selfPay;


      const nums = this.finalList.map((s) => s.No).join(",");
      map.ProcedureCode = nums; //[...items].join(",");
      map.ForceOverWrite = this.forceOverWrite;
      if (this.map.source === 'T' || this.map.source === 'Z') {  // 轉診 or 轉檢
        (this.map.source === 'T' ? ["ReferralsInstitutionName", "ReferralsDoctorName"] : ["TransferInstitutionName", "TransferDoctorName"]).forEach(k => {
          if (k === 'TransferDoctorName') {
            map[k] = this.map[k] || this.$refs.transferDoctor.$el.querySelector('input').value;
          } else if (k === 'ReferralsDoctorName') {
            map[k] = this.map[k] || this.$refs.referralsDoctor.$el.querySelector('input').value;
          } else {
            map[k] = this.map[k];
          }
        })
      }

      const addNewDoctor = (list, name, hospital) => {
        if (!list.some(({ text }) => name === text)) {
          postTransferDoctorList( // 新增醫師
            hospital, name
          );
        }
      }

      if (this.map.source === 'T' || this.map.source === 'Z') {
        const { source, TransferDoctorName, ReferralsDoctorName, ReferralsInstitutionName, TransferInstitutionName } = this.map;
        addNewDoctor(
          source === 'Z'
            ? this.transferDoctorsList
            : this.referralsDoctorsList,
          source === 'Z'
            ? TransferDoctorName || this.$refs.transferDoctor.$el.querySelector('input').value
            : ReferralsDoctorName || this.$refs.referralsDoctor.$el.querySelector('input').value,
          source === 'Z'
            ? TransferInstitutionName || this.$refs.transferHospital.$el.querySelector('input').value
            : ReferralsInstitutionName || this.$refs.referralsHospital.$el.querySelector('input').value
        )
      }

      if (window.dtcDebug) {
        const s = JSON.stringify(map, 0, 2);
        this.debugMsg1 = s;
      }

      try {
        await window.axios.post("/exam/Create", map);
        this.$root.$emit("show-dtc-print-dlg", map);
        this.$bvModal.hide("enterDlg");
        this.ObjApp.TimingMessage("手動開單成功");
        // Swal.fire("手動開單成功!", "", "success");
        this.open = false;
        this.loading = false;
      } catch (e) {
        if (this.forceOverWrite) {
          this.errorOnOverWrite = true;
        }
        this.forceOverWrite = true;
        this.loading = false;
      }
    },
    updateHospitalInfo (val, hospitals) {
      return new Promise((resolve, reject) => {
        const tempHospital = [...hospitals];
        const pickupIdx = tempHospital.findIndex(({ text }) => text === val);
        //  && !tempHospital[pickupIdx]['doctors']

        const orgType = this.map.source === 'Z' ? 'TMDI' : 'RMDI';

        if (pickupIdx >= 0) {
          getTransferDoctorList(val, orgType).then(res => {
            tempHospital[pickupIdx].doctors = res;
            resolve([...tempHospital]);
          }).catch(() => {
            reject(tempHospital);
          });
        } else {
          reject(tempHospital);
        }
      });
    }
  },

  beforeMount () {
    let obj = this.$GetApp(this);
    this.ObjApp = obj[0];
    document.addEventListener("fullscreenchange", () => {
      if (document.fullscreenElement) {
        console.log(`entered full-screen mode.`);
      } else {
        this.$bvModal.hide("enterDlg");
      }
    });
    setTimeout(async () => {
      const v = await window.axios.get("/Exam/GetManualOrderNo");
      this.inspectPlaceHolder = v;
    });
  },
  async mounted () {
    // this.optionsPatientSource2 = mySource.Items.map((s) => ({
    //   value: s.No,
    //   text: s.Name,
    // }));
    const types = await window.axios("/exam/GetModalityNoList");
    const { Items } = await window.axios.get("/Room/SelectNoList/");
    const arr = [];
    const cat1s = new Set();
    types.forEach((s) => {
      if(!['EKG', 'BMD', 'ES'].includes(s.No)) cat1s.add(s.No);
    });
    Items.forEach((s) => {
      arr.push({ value: s.No, text: s.Name, type: s.Modality });
    });
    const myset = new Set(["CR", ...cat1s]);
    this.cat1s = [...myset];
    this.cat1 = this.cat1s[0];
    defaultDevice = this.cat1s[0];
    this.rooms = arr;
    if (this.getListDrs.length === 0) {
      const { result } = await getEmployeeDataByType("20,21,23,25,27,29");
      this.SET_LIST_DR(result);
    }
    this.allDrs = this.getListDrs;


    // this.allDrs = result.map((s) => ({
    //   value: "" + s.No,
    //   text: s.Name,
    // }));

    if (this.getIssueDrs.length === 0) {
      const emp21 = await getEmployeeDataByType("21");
      this.SET_ISSUE_DR(emp21.result);
    }
    this.mainDrs = this.getIssueDrs;

    // this.mainDrs = emp21.result.map((s) => ({
    //   value: s.No,
    //   text: s.Name,
    // }));
    const { Items: cats } = await window.axios.get("/institution/SelectNoList");
    this.cats = cats.map((s) => ({
      value: s.No,
      text: s.Name,
    }));
  },
  watch: {
    "map.TransferInstitutionName" (val) {
      if (!val) return;
      this.updateHospitalInfo(val, this.transferHospital).then(res => {
        this.transferHospital = res;
      }).catch(e => {
        this.transferHospital = e;
      }).finally(() => {
        if (this.map.TransferDoctorName) {
          try {
            this.$refs.transferDoctor.clearSelection();
          } catch (err) {
            // console.log(err);
          }
        }
      });
    },
    "map.ReferralsInstitutionName" (val) {
      if (!val) return;
      // if (this.$refs.transferDoctor.items.length > 0) this.$refs.transferDoctor.clearSelection();
      this.updateHospitalInfo(val, this.referralsHospital).then(res => {
        this.referralsHospital = res;
      }).catch(e => {
        this.referralsHospital = e;
      }).finally(() => {
        if (this.map.ReferralsDoctorName) {
          try {
            this.$refs.referralsDoctor.clearSelection();
          } catch (err) {
            // console.log(err);
          }
        }
      });
    },
    cat1 (val) {
      this.part2s = [];
      this.part1s = [];
      this.part1 = "";
      this.part2 = "";
      if (!val) return;
      this.getPart1List(val);
      // const arr = this.rooms.filter(s => s.type === val);
      // this.cat2s = arr;
    },
    "map.orderPerson" (val) {
      if (!val) return;
      this.map.mainDr = this.map.orderPerson;
      setTimeout(() => {
        const el = document.querySelector('[placeholder="請選擇開單醫生"]');
        const el2 = document.querySelector('[placeholder="請選擇主治醫生"]');
        el2.value = el.value;
      }, 500);
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .modal-body {
  overflow-y: auto;
}
.dtc-footer {
  position: relative;
  z-index: 1;
}
.dtc-overwite {
  position: absolute;
  z-index: 99;
  left: 0px;
  top: 0px;
  bottom: 0px;
  right: 0px;
  display: grid;
  place-items: center;
  grid-template-columns: max-content max-content 1rem max-content max-content;
  grid-gap: 1rem;
  width: 100%;
  height: 60px;
  font-size: 24px;
  padding-left: 12px;
  margin-top: -10px;
  background: var(--danger);
}
</style>

<style>
.dtc-grid-manually .super-select-container {
  --boxHeight: 38px !important;
  --itemHeight: 38px !important;
  --boxWidth: 100% !important;
  flex: 1;
  border-radius: 5px;
}
</style>

<style lang="scss" scoped>
.two {
  display: grid;
  grid-template-columns: max-content 1fr;
  grid-column-gap: 2px;
}
.dtc-grid-manually {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 0.6rem;
  .input-group-prepend .input-group-text {
    min-width: 90px;
    max-width: 90px;
  }
}

.required::after {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 12px;
  height: 12px;
  content: "*";
  z-index: 444;
  display: inline-block;
}
.fixed::after {
  top: -2px;
  left: -12px;
  font-size: 24px;
}
.add-item {
  position: relative;
  .plus {
    position: absolute;
    top: 0px;
    left: 0px;
    margin-left: -20px;
    margin-top: 8px;
    cursor: pointer;
  }
}

.hd1,
.hd2 {
  position: relative;
  background: var(--success);
  color: white;
  border-radius: 5px;
  height: 34px;
  font-size: 1rem;
  //line-height: 34px;
  margin: 17px;
  padding-left: 10px;
  padding-top: 6px;
  display: grid;
  grid-template-columns: max-content 1fr;
  grid-gap: 12px;
}

.hd2 {
  background: var(--info);
}

.dtc-full-grid {
  position: relative;
  margin: 10px;
  display: grid;
  grid-template-columns: 250px 2fr;
  grid-gap: 1rem;
  .no-data {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 560px;
    height: 40px;
    transform: translate(-50%, -50%);
    color: white;
    font-size: 20px;
    display: block;
    margin-left: 100px;
    content: "";
  }
  .left,
  .right {
    border: 1px solid white;
    //min-height: 500px;
    max-height: 420px;
    position: relative;
    display: grid;
    padding: 3;
    grid-template-columns: 1fr;
    overflow-y: auto;
    .dtc-row {
      border-bottom: 1px solid white;
      display: grid;
      grid-template-columns: 1fr 4fr;
      grid-gap: 2px;
      padding: 4px;
      cursor: pointer;
      > div {
        z-index: 1;
      }
    }
  }
  .right {
    align-self: start;
    > label:last-child {
      border-bottom: none;
    }
  }
  header {
    position: sticky;
    height: 30px;
    top: 0;
    left: 0;
    z-index: 666;
    background: var(--primary);
  }
}
.final-list {
  display: grid;
  position: relative;
  grid-template-columns: max-content 1fr;
  grid-gap: 1rem;
  padding-right: 18px;
  min-height: 200px;
  height: 200px;
  overflow: auto;
  max-height: 200px;
  .w2 {
    border: 1px solid white;
    border-radius: 5px;
    position: relative;
  }
  .dtc-final-row {
    display: grid;
    padding: 4px;
    grid-template-columns: 120px 1fr 1fr 2fr 120px 1rem;
    grid-gap: 0.4rem;
  }
  header {
    position: sticky;
    top: 0;
    left: 0;
    z-index: 666;
    background: var(--primary);
  }
  .w1 {
    position: relative;
    .fixed {
      position: sticky;
      top: 0;
      left: 0;
      z-index: 666;
    }
  }
}
.empty-list {
  position: absolute;
  left: 50%;
  top: 50%;
  color: white;
  font-size: 20px;
  transform: translate(-50%, -50%);
  content: "";
  display: block;
  width: 500px;
  height: 30px;
}

.required .input-group-text {
  font-weight: bold;
  background: var(--danger);
  border: 1px solid red;
}
</style>
