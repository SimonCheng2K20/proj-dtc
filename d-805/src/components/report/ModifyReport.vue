<template>
  <b-modal
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
    no-gutters
  >
    <section class="s1">
      <header>反映人員</header>
      <b-input-group>
        <b-input-group-prepend is-text>
          <b-form-radio
            v-model="s1Value"
            value="01"
          >臨床醫師反映</b-form-radio>
        </b-input-group-prepend>
        <v-super-select
          v-if="s1Value == '01'"
          :noneFoundText="無此筆資料"
          placeholder="請選擇臨床醫師"
          searchFields="value,text"
          :items="allDrs"
          v-model="doc1"
          style="z-index:9999999;color:white;"
        />
        <b-input
          v-if="s1Value != '01'"
          :readonly="true"
        ></b-input>
      </b-input-group>
      <b-input-group>
        <b-input-group-prepend is-text>
          <b-form-radio
            v-model="s1Value"
            value="02"
          >科內醫師反映</b-form-radio>
        </b-input-group-prepend>
        <v-super-select
          style="z-index:9999999;color:white;"
          v-if="s1Value == '02'"
          :noneFoundText="無此筆資料"
          placeholder="請選擇科內醫師"
          searchFields="value,text"
          :items="allDrs"
          v-model="doc2"
        />
        <b-input
          v-if="s1Value != '02'"
          :readonly="true"
        ></b-input>
      </b-input-group>
      <b-input-group class="ml-4 mt-2">
        <b-form-radio
          v-model="s1Value"
          value="03"
        >自行發現</b-form-radio>
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
      <div style="margin-top:12px;margin-bottom:12px; display:grid; grid-template-columns: 70px 800px;">
        <b-form-radio
          style="margin-top:4px;"
          v-model="sec2"
          value="90"
        >其他</b-form-radio>
        <b-input v-model="sec2Input"></b-input>
      </div>
    </section>

    <section class="s2 mt-2">
      <header style="background:var(--orange) !important;">報告修改原因</header>
      <b-form-radio-group
        v-model="sec3"
        :options="sec3s"
        value-field="No"
        text-field="Name"
      ></b-form-radio-group>
      <div style="margin-top:12px;margin-bottom:12px; display:grid; grid-template-columns: 70px 800px;">
        <b-form-radio
          style="margin-top:4px;"
          v-model="sec3"
          value="90"
        >其他</b-form-radio>
        <b-input v-model="sec3Input"></b-input>
      </div>
    </section>

    <section
      class="s2 mt-2"
      v-if="sec3==='05'"
    >
      <header style="background:var(--orange) !important;">發現階段</header>
      <b-form-radio-group
        v-model="step"
        :options="stepOptions"
      />
    </section>

    <section
      class="s2 mt-2"
      v-if="sec3==='05'"
    >
      <header style="background:var(--orange) !important;">原因</header>
      <b-form-radio-group
        v-model="reason"
        :options="reasonOptions"
      />
    </section>

    <section
      class="s2 mt-2"
      id="reasonDetail"
      v-if="(sec3==='05') && reason===6"
    >
      <header style="background:var(--orange) !important;">其他原因分類</header>
      <b-form-radio-group
        v-model="other"
        :options="otherOptions"
      />
    </section>

    <section class="s2 mt-2 mb-2">
      <header style="background:var(--danger) !important;">重要修改內容</header>
      <b-form-radio-group
        v-model="sec4"
        :options="sec4s"
        value-field="No"
        text-field="Name"
      ></b-form-radio-group>
      <div style="margin-top:12px;margin-bottom:12px; display:grid; grid-template-columns: 70px 800px;">
        <b-form-radio
          style="margin-top:4px;"
          v-model="sec4"
          value="90"
        >其他</b-form-radio>
        <b-input v-model="sec4Input"></b-input>
        <div>{{sec4}}</div>
      </div>
    </section>

    <template v-slot:modal-footer>
      <footer>
        <b-checkbox
          class="mt-2"
          v-model="notify"
        >是否通知開單醫師?</b-checkbox>
        <b-button
          @click="add"
          variant="primary"
        >
          <font-awesome-icon
            class="mr-1"
            icon="edit"
          />修改報告
        </b-button>
        <b-button @click="$bvModal.hide('dtcModifyReport')">
          <font-awesome-icon
            class="mr-1"
            icon="undo"
          />取消修改
        </b-button>
      </footer>
    </template>
  </b-modal>
</template>

<script>
import BusFactory from "@/assets/js/busFactory.js";
import { postFailImageReason } from "@/assets/service/dataManager.js";
import { stepOptions, reasonOptions, otherOptions, columns } from "@/assets/js/wasteOptions.js";
import VSuperSelect from "v-super-select";
import { mapMutations } from "vuex";

export default {
  data () {
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
        "dark"
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
      reason: '',
      other: ''
    };
  },
  components: { VSuperSelect },
  async mounted () {
    this.isMounted = true;
    const { Items: items } = await window.axios.get(
      "/Employee/SelectNoList?staffType=20,21,23,25,27,29"
    );

    this.allDrs = items.map(s => ({
      value: "" + s.No,
      text: s.Name
    }));
  },
  props: {
    size: {
      type: String,
      default: "xl"
    },
    patient: {
      type: Object,
      default: null
    },
  },
  methods: {
    ...mapMutations(['SHOW_LOADING', 'HIDE_LOADING', 'SET_SIDE_MESSAGE']),
    init () {
      this.sent = false;
      this.notify = false;
      this.s1Value = "03";
      this.doc1 = this.doc2 = "";

      const defaultSec2s = this.sec2s.find(({ Name }) => Name === "再判讀");
      const defaultSec3s = this.sec3s.find(({ Name }) => Name === "初步報告");
      const defaultSec4s = this.sec4s.find(({ Name }) => Name === "初步報告");

      this.sec2 = defaultSec2s ? defaultSec2s['No'] : this.sec2s[0].No;
      this.sec3 = defaultSec3s ? defaultSec3s['No'] : this.sec3s[0].No;
      this.sec4 = defaultSec4s ? defaultSec4s['No'] : '00';
      this.sec2Input = this.sec3Input = this.sec4Input = "";
    },
    add () {
      if (this.sent) return;
      this.sent = true;
      const s1 = this.doc1 || this.doc2 || this.s1Value;
      const s1Type = this.s1Value;
      const s2 = this.sec2;
      const s2Input = this.sec2Input;
      const s3 = this.sec3;
      const s3Input = this.sec3Input;
      const s4 = this.sec4;
      const s4Input = this.sec4Input;
      const notify = this.notify;
      const obj = { s1, s1Type, s2, s3, s4, s2Input, s3Input, s4Input, notify };
      if (!s1) {
        this.SET_SIDE_MESSAGE({ msg: '請確實填寫反映人員', type: 2 });
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

      if (this.sec3 === '05') {  // 修改是不良或是重照片

        if (!this.step || !this.reason) return;

        const { AccessionNo, PatientId, Modality, OrderNo } = this.patient;
        const data = {
          OrderNo: OrderNo ? OrderNo : AccessionNo.substr(0, 9),
          PatientId,
          Modality,
          Type: 1,
          Step: this.step,
          ReasonType: this.reason < 6 ? this.reason : this.other,
          Reason: ''
        }

        if (this.reason === 6 && this.other <= 6.3) {
          const _position = this.other * 10 - 61;
          const _instruction = Array.from(document.getElementById('reasonDetail').querySelectorAll('input[type=text]'))[_position].value;
          data.Reason = _instruction;
        }

        this.SHOW_LOADING();
        postFailImageReason(data).then(() => {

        }).catch((err) => {
          this.SET_SIDE_MESSAGE({ msg: err + '請稍候再試', type: 2 });
        }).finally(() => {
          this.HIDE_LOADING();
        });
      }


    }
  },
  computed: {
    showState () {
      return this.isMounted ? this.$refs["cusModal"].isShow : false;
    }
  },
  async beforeMount () {
    //NO, and Name
    this.sec1s = JSON.parse(localStorage.dtcModList1).Items;
    this.s1Value = "03";
    this.sec2s = JSON.parse(localStorage.dtcModList2).Items.filter(
      s => s.No != "90"
    );

    this.sec2 = this.sec2s[0].No;
    this.sec3s = JSON.parse(localStorage.dtcModList3).Items.filter(
      s => s.No != "90"
    );
    // this.sec3s.splice(6, 0, { Name: '重照片', No: '06' });

    this.sec3 = this.sec3s[0].No;
    this.sec4s = JSON.parse(localStorage.dtcModList4).Items.filter(
      s => s.No != "90"
    ).concat({ Name: "無", No: "00" });

    // this.sec4 = this.sec4s[0].No;

    this.sec4 = "00";
  },
  watch: {
    s1Value () {
      this.doc1 = this.doc2 = "";
    }
  }
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

