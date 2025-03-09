<template>
  <b-modal
    :header-bg-variant="variants[0]"
    :header-text-variant="variants[1]"
    :body-bg-variant="headerBgVariant"
    :body-text-variant="headerTextVariant"
    :footer-bg-variant="headerBgVariant"
    :footer-text-variant="headerTextVariant"
    ref="mainModel"
    id="dtc-edit-personal-data"
    title="編輯病患資訊"
    size="xl"
    @shown="init"
  >
    <section class="dtc-form">
      <b-input-group prepend="姓名">
        <b-input
          v-model="form.PatientName"
          :readonly="true"
        />
      </b-input-group>
      <b-input-group prepend="病歷號">
        <b-input
          v-model="form.PatientId"
          :readonly="true"
        />
      </b-input-group>
      <b-input-group prepend="申請單號">
        <b-input
          v-model="form.AccessionNo"
          :readonly="true"
        />
      </b-input-group>
      <b-input-group prepend="病患來源">
        <b-select
          :options="dtcOptionsPatientSource"
          v-model="form.PatientSourceTypeCode"
        />
      </b-input-group>
      <b-input-group prepend="開單醫師">
        <v-super-select
          v-if="show"
          style="z-index:9999999;max-height:38px;width:100%;"
          class="bg-white"
          @keydown.enter="super1Keydown"
          noneFoundText="無此筆資料"
          placeholder="請選擇開單醫師"
          searchFields="value,text"
          v-model="form.RequestingPhysicianId"
          :items="allDrs"
        />
      </b-input-group>
      <b-input-group prepend="開單科別">
        <v-super-select
          v-if="show"
          style="z-index:9999999;max-height:38px;width:100%;"
          class="bg-white"
          @keydown.enter="super2Keydown"
          noneFoundText="無此筆資料"
          placeholder="請選擇開單科別"
          searchFields="value,text"
          v-model="form.RequestingServiceId"
          :items="cats"
        />
      </b-input-group>
      <b-input-group prepend="報到日期時間">
        <datePicker
          v-model="counterRegister"
          :config="options"
          :disabled="!counterRegister"
        ></datePicker>
      </b-input-group>

      <b-input-group prepend="檢查室">
        <b-select
          :options="dtcOptionsLocationSource"
          v-model="form.ScheduleLocation"
          :disabled="!counterRegister"
        />
      </b-input-group>

      <b-input-group prepend="手機號碼">
        <b-input v-model="form.PhoneNo4Mobile" />
      </b-input-group>

      <b-input-group prepend="轉診醫院">
        <b-form-select
          v-model="form.ReferralsInstitutionName"
          :options="referralsHospital"
          :disabled="!!form.TransferInstitutionName"
        />

      </b-input-group>

      <b-input-group prepend="轉診醫師">
        <b-form-input
          :disabled="!form.ReferralsInstitutionName || !!form.TransferInstitutionName"
          v-model="form.ReferralsDoctorName"
          list="referralsDoctorsList"
        />

        <datalist id="referralsDoctorsList">
          <option
            v-for="({text}) in referralsDoctorsList"
            :key="text"
            v-text="text"
          />
        </datalist>

        <!-- <v-super-select
          :disabled="!form.ReferralsInstitutionName || !!form.TransferInstitutionName"
          key="referralsDoctors"
          ref="referralsDoctor"
          noneFoundText="無此筆資料"
          placeholder="請選擇轉診醫生"
          searchFields="value,text"
          v-model="form.ReferralsDoctorName"
          :items="referralsDoctorsList"
          class="bg-white"
        /> -->

      </b-input-group>

      <!-- <div>
        <div v-text="referralsDoctorsList" />
        <div v-text="form.ReferralsDoctorName" />
      </div> -->

      <b-input-group
        prepend="轉檢醫院"
        class="required"
      >
        <b-form-select
          v-model="form.TransferInstitutionName"
          :options="transferHospital"
          :disabled="!!form.ReferralsInstitutionName"
        />
      </b-input-group>
      <b-input-group prepend="轉檢醫師">
        <b-form-input
          :disabled="!form.TransferInstitutionName||!!form.ReferralsInstitutionName"
          v-model="form.TransferDoctorName"
          list="transferDoctorsList"
        />

        <datalist id="transferDoctorsList">
          <option
            v-for="({text}) in transferDoctorsList"
            :key="text"
            v-text="text"
          />
        </datalist>

        <!-- <v-super-select
          key="transferDoctors"
          :disabled="!form.TransferInstitutionName||!!form.ReferralsInstitutionName"
          ref="transferDoctor"
          noneFoundText="無此筆資料"
          placeholder="請選擇轉檢醫生"
          searchFields="value,text"
          v-model="form.TransferDoctorName"
          :items="transferDoctorsList"
          class="bg-white"
        /> -->

      </b-input-group>

      <!-- <div v-text="referralsHospital" /> -->

      <!-- <b-input-group prepend="手機號碼">
        <b-input v-model="form.PhoneNo4Mobile" />
      </b-input-group> -->

    </section>

    <template v-slot:modal-footer>
      <footer>
        <div @click="showId">&nbsp;&nbsp;&nbsp;{{dtcDebug}}</div>
        <b-button
          :disabled="loadingApi"
          @click="add"
          variant="primary"
        >
          <b-spinner
            type="grow"
            v-if="loadingApi"
            label="Spinning"
          ></b-spinner>
          <font-awesome-icon
            v-if="!loadingApi"
            class="mr-1"
            icon="edit"
          />
          {{loadingApi ? '處理' : '完成編輯'}}
        </b-button>
        <b-button @click="$bvModal.hide('dtc-edit-personal-data')">
          <font-awesome-icon
            class="mr-1"
            icon="undo"
          />取消編輯
        </b-button>
      </footer>
    </template>
  </b-modal>
</template>

<script>
import { getReferralsHospitalList, getTransferDetectHospitalList, getTransferDoctorList, postTransferDoctorList } from "@/assets/service/dataManager.js";
import Swal from "sweetalert2";
// import moment from "moment";
import VSuperSelect from "v-super-select";
// Import this component
import datePicker from "vue-bootstrap-datetimepicker";
// Import date picker css
import "pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css";
/// Using font-awesome 5 icons
$.extend(true, $.fn.datetimepicker.defaults, {
  icons: {
    time: "far fa-clock",
    date: "far fa-calendar",
    up: "fas fa-arrow-up",
    down: "fas fa-arrow-down",
    previous: "fas fa-chevron-left",
    next: "fas fa-chevron-right",
    today: "fas fa-calendar-check",
    clear: "far fa-trash-alt",
    close: "far fa-times-circle"
  }
});

export default {
  data () {
    return {
      dtcDebug: "",
      loadingApi: false,
      ObjApp: "",
      counterRegister: null,
      options: {
        format: "YYYY/MM/DD hh:mm A",
        useCurrent: false,
        showClear: false,
        showClose: true
      },
      cats: [],
      allDrs: [],
      form: {},
      dtcOptionsLocationSource: [],
      dtcOptionsPatientSource: [],
      show: false,
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
      transferHospital: [],
      referralsHospital: []
    };
  },
  computed: {
    transferDoctorsList () {
      return !this.form.TransferInstitutionName || !this.transferHospital.find(({ text }) => text === this.form.TransferInstitutionName) || !this.transferHospital.find(({ text }) => text === this.form.TransferInstitutionName)['doctors']
        ? []
        : this.transferHospital.find(({ text }) => text === this.form.TransferInstitutionName)['doctors'].map(v => ({ text: v, value: v }));
    },
    referralsDoctorsList () {
      return !this.form.ReferralsInstitutionName || !this.referralsHospital.find(({ text }) => text === this.form.ReferralsInstitutionName) || !this.referralsHospital.find(({ text }) => text === this.form.ReferralsInstitutionName)['doctors']
        ? []
        : this.referralsHospital.find(({ text }) => text === this.form.ReferralsInstitutionName)['doctors'].map(v => ({ text: v, value: v }));
    }
  },
  props: [
    "optionsCheckItem",
    "optionsPatientSource",
    "optionsLocationSource",
    "CheckinStatusSource"
  ],
  components: { VSuperSelect, datePicker },
  methods: {
    super1Keydown () {
      const el = document.querySelector('[placeholder="請選擇開單醫師"]');
      let v = "" + el.value;
      if (!v) {
        this.form.RequestingPhysicianId = "";
        el.value = "";
        return;
      }
      v = v.toUpperCase().trim();
      const ret = this.allDrs.find(s => {
        if (s.value == v || s.text == v) return s;
      });
      this.form.RequestingPhysicianId = el.value = "";
      this.form = Object.assign({}, this.form);
      if (ret) {
        this.form.RequestingPhysicianId = ret.value;
        this.form = Object.assign({}, this.form);
        el.value = ret.text;
      }
    },
    async add () {
      // 防呆
      if (!this.form.CounterRegister && (this.counterRegister || this.ScheduleLocation)) {
        Swal.fire("未報到不得更換日期或檢查室", "", "error");
        this.counterRegister = null;
        return;
      }
      this.loadingApi = true;

      // new Date(this.counterRegister).toISOString()

      this.counterRegister
        ? (this.form.CounterRegister = this.$moment(this.counterRegister).format('YYYY-MM-DDTHH:mm:ss'))
        : (this.form.CounterRegister = null);
      const {
        AccessionNo,
        PatientSourceTypeCode,
        RequestingPhysicianId,
        RequestingServiceId,
        CounterRegister,
        ScheduleLocation,
        PhoneNo4Mobile,
        ReferralsInstitutionName, // 轉診醫院
        TransferInstitutionName,   // 轉檢醫院
      } = this.form;

      let {
        ReferralsDoctorName,      // 轉診醫師
        TransferDoctorName       // 轉檢醫師
      } = this.form;

      const addNewDoctor = (list, name, hospital) => {
        if (!list.some(({ text }) => name === text)) {
          postTransferDoctorList( // 新增醫師
            hospital, name
          );
        }
      }

      [ReferralsDoctorName, TransferDoctorName].forEach((value, idx) => {
        // const convertValue = (value && typeof value === 'object') ? value.text : value;
        if (value) {
          addNewDoctor(
            idx === 0 ? this.referralsDoctorsList : this.transferDoctorsList,
            value,
            idx === 0 ? ReferralsInstitutionName : TransferInstitutionName
          )
        }
      });

      const params = {
        AccessionNo,
        PatientSourceTypeCode,
        RequestingPhysicianId,
        RequestingServiceId,
        CounterRegister,
        ScheduleLocation,
        ReferralsInstitutionName, // 轉診醫院
        ReferralsDoctorName,      // 轉診醫師
        TransferInstitutionName,   // 轉檢醫院
        TransferDoctorName       // 轉檢醫師
      };

      Object.keys(params).forEach(k => {
        if (params[k] === null) delete params[k];
      });

      const str = JSON.stringify(params, 0, 2);

      if (window.dtcDebug) {
        // alert(str);
      }
      try {
        //send out AJAX to save  PUT /exam/AssignRoom
        await window.axios.put("/exam/Change", JSON.parse(str));

        await window.axios.put("/exam/AssignRoom", { AccessionNos: [AccessionNo], RoomNo: ScheduleLocation });

        await window.axios.put("/patient/Change", { No: this.form.PatientId, PhoneNo4Mobile })

        this.$root.$emit("dtc-edit-med-done", AccessionNo);
        this.ObjApp.TimingMessage("資料已完成存檔作業");
        this.loadingApi = false;
      } catch (e) {
        Swal.fire("儲存失敗!", "", "error");
        this.loadingApi = false;
      }

      this.$bvModal.hide("dtc-edit-personal-data");
    },
    super2Keydown () {
      const el = document.querySelector('[placeholder="請選擇開單科別"]');
      let v = "" + el.value;
      if (!v) {
        this.form.RequestingServiceId = "";
        el.value = "";
        return;
      }
      v = v.toUpperCase().trim();
      const ret = this.cats.find(s => {
        if (s.value == v || s.text == v) return s;
      });
      this.form.RequestingServiceId = el.value = "";
      this.form = Object.assign({}, this.form);
      if (ret) {
        this.form.RequestingServiceId = ret.value;
        this.form = Object.assign({}, this.form);
        el.value = ret.text;
      }
    },
    async init () {
      this.form = Object.assign({}, window.dtcPersonItem);

      let {
        PatientSourceTypeCode,
        RequestingPhysicianId,
        RequestingServiceId,
        CounterRegister,
        ScheduleLocation
      } = this.form;
      RequestingPhysicianId && RequestingPhysicianId.value
        ? (RequestingPhysicianId = RequestingPhysicianId.value)
        : "";
      RequestingServiceId && RequestingServiceId.value
        ? (RequestingServiceId = RequestingServiceId.value)
        : "";
      let str = JSON.stringify(
        {
          PatientSourceTypeCode,
          RequestingPhysicianId,
          RequestingServiceId,
          CounterRegister,
          ScheduleLocation
        },
        0,
        2
      );

      if (window.dtcDebug) {
        this.dtcDebug = str;
      }

      this.counterRegister = this.form.CounterRegister
        ? new Date(this.form.CounterRegister)
        : null;
      this.dtcOptionsLocationSource = this.optionsLocationSource.slice(1, 100);
      this.dtcOptionsPatientSource = this.optionsPatientSource.slice(1, 100);

      setTimeout(() => (this.show = true), 10);
      setTimeout(() => (this.show = false), 20);
      setTimeout(() => (this.show = true), 30);
      //
    },
    showId () {
      alert("開單醫師 id " + this.form.RequestingPhysicianId); // it might be empty
      const str = this.form.CounterRegister
        ? this.form.CounterRegister.toISOString()
        : "date value can be found from server";
      alert("CounterRegister : " + str);
    },
    updateHospitalInfo (val, hospitals) {
      return new Promise((resolve, reject) => {
        const tempHospital = [...hospitals];
        const pickupIdx = tempHospital.findIndex(({ text }) => text === val);
        //  && !tempHospital[pickupIdx]['doctors']
        if (pickupIdx >= 0) {
          getTransferDoctorList(val).then(res => {
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

  async beforeMount () {
    // 取得 App.vue 參照
    let obj = this.$GetApp(this);
    this.ObjApp = obj[0];
    const { Items: cats } = await window.axios.get("/institution/SelectNoList");
    this.cats = cats.map(s => ({
      value: "" + s.No,
      text: s.Name
    }));
    const { Items: items } = await window.axios.get(
      "/Employee/SelectNoList?staffType=20,21,23,25,27,29"
    );

    this.allDrs = items.map(s => ({
      value: "" + s.No,
      text: s.Name
    }));
    this.init();


    Promise.all([   // 取得轉診及轉檢的醫院資料
      getReferralsHospitalList(),
      getTransferDetectHospitalList()
    ]).then(([referHospital, detectHospital]) => {
      this.transferHospital = [{ text: '請選擇轉檢醫院', value: null }].concat(detectHospital.Items.map(({ No, Name }) => ({ text: Name, value: No })));
      this.referralsHospital = [{ text: '請選擇轉診醫院', value: null }].concat(referHospital.Items.map(({ No, Name }) => ({ text: Name, value: No, doctors: null })));
    });

  },
  watch: {
    "form.TransferInstitutionName" (val) {

      if (!val) {
        if (this.form.TransferDoctorName) {
          this.form.TransferDoctorName = null;
        }
        return;
      }
      this.updateHospitalInfo(val, this.transferHospital).then(res => {
        this.transferHospital = res;
        if (this.form.TransferDoctorName && !this.transferDoctorsList.some(({ text }) => text === this.form.TransferDoctorName)) {
          this.form.TransferDoctorName = null;
        }

      }).catch(e => {
        this.transferHospital = e;
      });
    },
    "form.ReferralsInstitutionName" (val) {
      if (!val) {
        if (this.form.ReferralsDoctorName) {
          this.form.ReferralsDoctorName = null;
        }
        return;
      }
      this.updateHospitalInfo(val, this.referralsHospital).then(res => {
        this.referralsHospital = res;
        if (this.form.ReferralsDoctorName && !this.referralsDoctorsList.some(({ text }) => text === this.form.ReferralsDoctorName)) {
          this.form.ReferralsDoctorName = null;
        }
      }).catch(e => {
        this.referralsHospital = e;
      });
    },
    "$refs.mainModel.isShow" (val) {
      if (!val) {
        this.form.TransferDoctorName = null;
        this.form.ReferralsDoctorName = null;
      }
    }
  }
};
</script>
<style>
.dtc-form .super-select-container {
  --boxHeight: 38px !important;
  --itemHeight: 38px !important;
  --boxWidth: 100% !important;
  flex: 1;
  border-radius: 5px;
}
</style>
<style lang="scss" scoped>
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
  grid-template-columns: 1fr max-content max-content;
  grid-gap: 1rem;
}
</style>
