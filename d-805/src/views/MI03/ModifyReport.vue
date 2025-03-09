<template>
  <b-modal
    ref="dtcModifyReport"  
    id="dtcModifyReport"
    :header-bg-variant="variants[0]"
    :header-text-variant="variants[1]"
    :body-bg-variant="headerBgVariant"
    :body-text-variant="headerTextVariant"
    :footer-bg-variant="headerBgVariant"
    :footer-text-variant="headerTextVariant"
    :title="title"
    :size="size"
    @shown="init"
    @hide="cancelEvent"
    no-gutters
  >
    <div v-if="versionNo === '805'">

      <section class="s1" style="padding-top: 5px; min-height: auto;">
        <b-input-group>
          <b-form-radio v-model="s1Value" value="01">臨床醫師反映</b-form-radio>
        </b-input-group>
        <b-input-group>
          <b-form-radio v-model="s1Value" value="02">科內醫師反映</b-form-radio>
        </b-input-group>
        <b-input-group>
          <b-form-radio v-model="s1Value" value="03">其他</b-form-radio>
        </b-input-group>
      </section>

      <section class="s2 mt-2" style="padding-left: 0;">
        <header>原因</header>
        <div style="position: relative; margin: 0 auto auto auto; padding-bottom: 32px; width: calc(100% - 20px);">
          <b-textarea
            id="problemTextarea"
            ref="problemTextarea"
            placeholder="限制500字內"
            class="col-12"
            style="min-height: 160px; padding: 8px"
            maxlength="500"
            v-model="problemText"
            @focus="checkFocus"
          />
          <div class="position-absolute" style="display: flex; align-items: center; bottom: 4px; right: 12px;">
            <span>目前字數</span>&nbsp; &nbsp;<span>:</span>&nbsp;
            <span>
              {{ problemText && problemText.length ? problemText.length : '0' }}
              / 500
            </span>
          </div>
        </div>

        <!-- <b-form-radio-group
          v-model="sec2"
          :options="sec2s"
          value-field="No"
          text-field="Name"
        ></b-form-radio-group>
        <div
          style="
            margin-top: 12px;
            margin-bottom: 12px;
            display: grid;
            grid-template-columns: 70px 800px;
          "
        >
          <b-form-radio style="margin-top: 4px" v-model="sec2" value="90"
            >其他</b-form-radio
          >
          <b-input v-model="sec2Input"></b-input>
        </div> -->
      </section>
    </div>

    <div v-else>
      <section class="s1">
        <header>反映人員</header>
        <b-input-group>
          <b-input-group-prepend is-text>
            <b-form-radio v-model="s1Value" value="01">臨床醫師反映</b-form-radio>
          </b-input-group-prepend>
          <b-input v-if="s1Value == '01'" v-model="doc1" />
          <!-- <v-super-select
            v-if="s1Value == '01'"
            :noneFoundText="無此筆資料"
            placeholder="請選擇臨床醫師"
            searchFields="value,text"
            :items="allDrs"
            v-model="doc1"
            style="z-index:9999999;color:white;"
          /> -->
          <b-input v-if="s1Value != '01'" :readonly="true"></b-input>
        </b-input-group>
        <b-input-group>
          <b-input-group-prepend is-text>
            <b-form-radio v-model="s1Value" value="02">科內醫師反映</b-form-radio>
          </b-input-group-prepend>
          <v-super-select
            style="z-index: 9999999; color: white"
            v-if="s1Value == '02'"
            :noneFoundText="無此筆資料"
            placeholder="請選擇科內醫師"
            searchFields="value,text"
            :items="allDrs"
            v-model="doc2"
          />
          <b-input v-if="s1Value != '02'" :readonly="true"></b-input>
        </b-input-group>
        <b-input-group class="ml-4 mt-2">
          <b-form-radio v-model="s1Value" value="03">自行發現</b-form-radio>
        </b-input-group>
      </section>
  
      <section class="s2 mt-2">
        <header>反映事項</header>
        <b-form-radio-group
          v-model="sec2"
          :options="sec2s"
          value-field="No"
          text-field="Name"
        ></b-form-radio-group>
        <div
          style="
            margin-top: 12px;
            margin-bottom: 12px;
            display: grid;
            grid-template-columns: 70px 800px;
          "
        >
          <b-form-radio style="margin-top: 4px" v-model="sec2" value="90"
            >其他</b-form-radio
          >
          <b-input v-model="sec2Input"></b-input>
        </div>
      </section>
  
      <section class="s2 mt-2">
        <header style="background: var(--orange) !important">報告修改原因</header>
        <b-form-radio-group
          :key="'s3' + fixTimeStamp"
          v-model="sec3"
          :options="sec3s"
          value-field="No"
          text-field="Name"
        />
        <div
          style="
            margin-top: 12px;
            margin-bottom: 12px;
            display: grid;
            grid-template-columns: 70px 800px;
          "
        >
          <b-form-radio style="margin-top: 4px" v-model="sec3" value="90"
            >其他</b-form-radio
          >
          <b-input v-model="sec3Input"></b-input>
        </div>
      </section>
  
      <section class="s2 mt-2" v-if="sec3 === '05'">
        <header style="background: var(--orange) !important">發現階段</header>
        <b-form-radio-group v-model="step" :options="stepOptions" />
      </section>
  
      <section class="s2 mt-2" v-if="sec3 === '05'">
        <header style="background: var(--orange) !important">原因</header>
        <b-form-radio-group v-model="reason" :options="reasonOptions" />
      </section>
  
      <section
        class="s2 mt-2"
        id="reasonDetail"
        v-if="sec3 === '05' && reason === 6"
      >
        <header style="background: var(--orange) !important">其他原因分類</header>
        <b-form-radio-group v-model="other" :options="otherOptions" />
      </section>
  
      <section class="s2 mt-2 mb-2">
        <header style="background: var(--danger) !important">重要修改內容</header>
        <b-form-radio-group
          v-model="sec4"
          :options="sec4s"
          :key="'s4' + fixTimeStamp"
          value-field="No"
          text-field="Name"
        ></b-form-radio-group>
        <div
          style="
            margin-top: 12px;
            margin-bottom: 12px;
            display: grid;
            grid-template-columns: 70px 800px;
          "
        >
          <b-form-radio style="margin-top: 4px" v-model="sec4" value="90"
            >其他</b-form-radio
          >
          <b-input v-model="sec4Input"></b-input>
        </div>
      </section>

    </div>
    
    <template v-slot:modal-footer>
      <footer>
        <b-checkbox class="mt-2" v-model="notify">是否通知開單醫師?</b-checkbox>
        <b-button @click="add" variant="primary" ref="modReport" id="modReport">
          <font-awesome-icon class="mr-1" icon="edit" />修改報告
        </b-button>
        <b-button @click="$bvModal.hide('dtcModifyReport')">
          <font-awesome-icon class="mr-1" icon="undo" />取消修改
        </b-button>
      </footer>
    </template>
  </b-modal>
</template>

<script>
import BusFactory from "@/assets/js/busFactory.js";
import { postFailImageReason } from "@/assets/service/dataManager.js";
import {
  stepOptions,
  reasonOptions,
  otherOptions,
  columns,
} from "@/assets/js/wasteOptions.js";
import VSuperSelect from "v-super-select";
import Swal from "sweetalert2";
import { mapMutations, mapGetters } from "vuex";
import KeyPressIdentifier from '@/assets/KeyPressIdentifier'

export default {
  components: { VSuperSelect },
  props: {
    size: {
      type: String,
      default: "xl",
    },
    patient: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      sent: false,
      notify: false,
      sec2Input: "",
      sec3Input: "",
      sec4Input: "",
      sec1s: [],
      sec2s: [],
      sec3s: [],
      sec4s: [],
      sec1: "",
      sec2: "",
      sec3: "",
      sec4: "",
      allDrs: [],
      s1Value: "01",
      doc1: "",
      doc2: "",
      variants: [
        "warning",
        "dark",
        "success",
        "warning",
        "danger",
        "info",
        "light",
        "dark",
      ],
      headerBgVariant: "dark",
      headerTextVariant: "light",
      bodyBgVariant: "light",
      bodyTextVariant: "dark",
      footerBgVariant: "warning",
      footerTextVariant: "dark",
      isMounted: false,
      title: "修改報告原因",
      stepOptions,
      reasonOptions,
      otherOptions,
      step: 5,
      reason: "",
      other: "",
      fixTimeStamp: Date.now(),
      problemText: null,
      focusTimerTemp: null,
      runCountTemp: 2,
    };
  },
  computed: {
    ...mapGetters(["getUserRoleId"]),
    showState() {
      return this.isMounted ? this.$refs["cusModal"].isShow : false;
    },
    versionNo() {
      return process.env.VUE_APP_VERSION_NO
    },
    focusTimer: {
      get(){
        return this.focusTimerTemp
      },
      set(val){
        this.focusTimerTemp = val
      }
    },
    runCount: {
      get(){
        return this.runCountTemp
      },
      set(val){
        this.runCountTemp = val
      }
    }
  },
  methods: {
    ...mapMutations(["SHOW_LOADING", "HIDE_LOADING", "SET_SIDE_MESSAGE"]),
    checkFocus(){
      let actEl = document.activeElement
      if(actEl.type === 'textarea'){
        clearInterval(this.focusTimer)
        this.runCount = 2
        this.$refs['modReport'].blur()
      }
    },
    focusInterval (){
      this.runCount -= 1
      // console.log(`focusInterval: `, this.runCount)

      try {
        this.reFocus('modReport')
      } catch (error) {
        console.log(`error: `, error)
        clearInterval(this.focusTimer)
        this.runCount = 2
      }

      if (this.runCount <= 0) {
        clearInterval(this.focusTimer)
        this.runCount = 2
      }
    },
    reFocus(target = 'dtcModifyReport'){
      if(this.$refs[target]){
        this.$refs[target].focus()
      }
    },
    MRWatch(event){
      let keyActual = event.key
      console.log(`MRWatch: `, keyActual)

      if(keyActual === 'Enter'){
        console.log(`Matchd (ready to do something... ) ~`, keyActual)
      }

    },
    cancelEvent(){
      // window.removeEventListener('keydown', this.MRWatch)
      this.problemText = null
    },
    init() {
      // window.addEventListener('keydown', this.MRWatch)

      this.sent = false;
      this.notify = false;
      this.s1Value = "03";
      this.doc1 = this.doc2 = "";

      const defaultSec2s = this.sec2s.find(({ Name }) => Name === "再判讀");
      const defaultSec3s = this.sec3s.find(({ Name }) => Name === "初步報告");
      const defaultSec4s = this.sec4s.find(({ Name }) => Name === "初步報告");

      // this.sec2 = defaultSec2s ? defaultSec2s["No"] : this.sec2s[0].No;
      this.sec2 = defaultSec2s ? defaultSec2s["No"] : this.sec2s[0] && this.sec2s[0].No ? this.sec2s[0].No : '';

      if (this.getUserRoleId !== "21") {
        this.sec3 = defaultSec3s ? defaultSec3s["No"] : this.sec3s[0].No;
        this.sec4 = defaultSec4s ? defaultSec4s["No"] : "00";
      } else {
        this.sec3 = "";
        this.sec4 = "";
        const _option3 = this.sec3s.find(({ Name }) => Name === "初步報告");
        if (_option3) _option3["disabled"] = true;
        const _option4 = this.sec4s.find(({ Name }) => Name === "初步報告");
        if (_option4) _option4["disabled"] = true;
        this.fixTimeStamp = Date.now();
      }

      this.sec2Input = this.sec3Input = this.sec4Input = "";

      this.reFocus('modReport')
      this.focusTimer = setInterval(this.focusInterval, 1000)
    },
    add() {
      if (this.sent) return;

      const s1 = this.doc1 || this.doc2 || this.s1Value;
      const s1Type = this.s1Value;
      const s2 = this.sec2;
      const s2Input = this.sec2Input;
      const s3 = this.sec3;
      const s3Input = this.sec3Input;
      const s4 = this.sec4;
      const s4Input = this.sec4Input;
      const notify = this.notify;
      const otherInput = this.problemText;

      if(this.versionNo === '805'){
        
        if (!s1) {
          Swal.fire("尚有選項未選擇");
          return;
        }
        this.sent = true;
        const obj = { s1, s1Type, s2, s3, s4, s2Input, s3Input, s4Input, notify, otherInput };
        console.log(`add problem 805 ~`, obj)
        BusFactory.$emit("dtc-modify-report-dlg", obj);
        this.$bvModal.hide("dtcModifyReport");

        this.problemText = null

      }else{

        if (!s1 || !s2 || !s3 || !s4) {
          Swal.fire("尚有選項未選擇");
          return;
        }
        this.sent = true;
        const obj = { s1, s1Type, s2, s3, s4, s2Input, s3Input, s4Input, notify };

        if (!s1) {
          this.SET_SIDE_MESSAGE({ msg: "請確實填寫反映人員", type: 2 });
          return;
        }
        if (window.dtcDebug) {
          const s = JSON.stringify(obj, 0, 2);
          //alert(s);
        }
        // this.$root.$emit("dtc-modify-report-dlg", obj);
        BusFactory.$emit("dtc-modify-report-dlg", obj);
        this.$bvModal.hide("dtcModifyReport");
        // this.ObjApp.TimingMessage("報告撰寫作業資料已完成存檔作業");

        if (this.sec3 === "05") {
          // 修改是不良或是重照片

          if (!this.step || !this.reason) return;

          const { AccessionNo, PatientId, Modality, OrderNo } = this.patient;
          const data = {
            OrderNo: OrderNo ? OrderNo : AccessionNo.substr(0, 9),
            PatientId,
            Modality,
            Type: 1,
            Step: this.step,
            ReasonType: this.reason < 6 ? this.reason : this.other,
            Reason: "",
          };

          if (this.reason === 6 && this.other <= 6.3) {
            const _position = this.other * 10 - 61;
            const _instruction = Array.from(
              document
                .getElementById("reasonDetail")
                .querySelectorAll("input[type=text]")
            )[_position].value;
            data.Reason = _instruction;
          }

          this.SHOW_LOADING();
          postFailImageReason(data)
            .then(() => {})
            .catch((err) => {
              this.SET_SIDE_MESSAGE({ msg: err + "請稍候再試", type: 2 });
            })
            .finally(() => {
              this.HIDE_LOADING();
            });
        }
      }
      
    },
  },
  async beforeMount() {
    //NO, and Name
    if (localStorage.dtcModList1) {
      this.sec1s = JSON.parse(localStorage.dtcModList1).Items;
    } else {
      this.sec1s = [];
    }

    this.s1Value = "03";

    if (localStorage.dtcModList1) {
      this.sec2s = JSON.parse(localStorage.dtcModList2).Items.filter(
        (s) => s.No != "90"
      );
      this.sec2 = this.sec2s[0].No;
    }

    if (localStorage.dtcModList3) {
      this.sec3s = JSON.parse(localStorage.dtcModList3).Items.filter(
        (s) => s.No != "90"
      );
      // this.sec3s.splice(6, 0, { Name: '重照片', No: '06' });
      this.sec3 = this.sec3s[0].No;
    }

    if (localStorage.dtcModList4) {
      this.sec4s = JSON.parse(localStorage.dtcModList4)
        .Items.filter((s) => s.No != "90")
        .concat({ Name: "無", No: "00" });

      // this.sec4 = this.sec4s[0].No;
      this.sec4 = "00";
    }else{
      this.sec4 = "00"
    }
  },
  async mounted() {

    this.isMounted = true;
    // $filter=NonSchedule%20eq%20false
    // const { Items: items } = await window.axios.get("/Employee/SelectNoList?&staffType=20$filter=InstitutionNo eq '5400'");
    const { Items: items } = await window.axios.get(
      "/Employee/SelectNoList?&staffType=20,21,23,25,27,29"
    ); // ,21,23,25,27,29
    this.allDrs = items
      .filter(({ InstitutionNo }) => InstitutionNo === "5400")
      .map((s) => ({
        value: "" + s.No,
        text: s.Name,
      }));
  },
  watch: {
    s1Value() {
      this.doc1 = this.doc2 = "";
    },
  },
};
</script>
<style>
#dtcModifyReport .super-select-container {
  --boxHeight: 38px !important;
  --itemHeight: 38px !important;
  --boxWidth: 100% !important;
  flex: 1;
  border-radius: 5px;
}
</style>

<style lang="scss" scoped>
/deep/ .modal-body {
  padding: 4px !important;
}
/deep/ .super-select-input input {
  color: white !important;
}

// /deep/ input[type="radio"] {
//   transform: scale(1.5);
//   margin-top: -4px;
//   display: inline-block;
//   margin-right: 14px;
// }
.dtc-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 5px;
  color: white;
  .input-group-prepend .input-group-text {
    width: 120px;
  }
}
footer {
  display: grid;
  grid-template-columns: 1fr max-content max-content max-content;
  grid-gap: 1rem;
}
.s1 {
  position: relative;
  min-height: 90px;
  border: 1px solid white;
  border-radius: 5px;
  display: grid;
  grid-template-columns: 2fr 2fr 1fr;
  grid-gap: 12px;

  padding: 5px;
  padding-top: 40px;
  > div {
    max-height: 30px;
  }
}

header {
  padding-left: 12px;
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: var(--success) !important;
  color: white;
  height: 30px;
  line-height: 25px;
  font-size: 1rem;
  padding: 4px;
}
.s3 {
  display: grid;
  position: relative;
  min-height: 90px;
  border: 1px solid white;
  border-radius: 5px;
  grid-template-columns: max-content max-content max-content 1fr;
  grid-gap: 4px;
  padding: 5px;
  padding-top: 40px;
  footer {
    width: 100%;
    margin-right: 3px;
    display: grid;
    grid-template-columns: 1fr;
  }
  header {
    background: var(--info) !important;
  }
}

.s2 {
  position: relative;
  min-height: 90px;
  border: 1px solid white;
  border-radius: 5px;
  padding-top: 41px;
  padding-left: 12px;
}

.s3 {
  //background: var(--danger) !important;
  min-height: 200px;
}

label {
  max-height: 22px !important;
}
</style>
