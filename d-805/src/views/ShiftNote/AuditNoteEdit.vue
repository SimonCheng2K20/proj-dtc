<template>
  <div
    :class="{ audit: true, 'audit-active': showBox }"
    class="p-0 d-flex flex-column"
  >
    <b-card-header class="bg-warning text-white cardHeader">
      <b-row
        style="display:flex;justify-content:space-between"
        no-gutters
      >
        <b-col cols="6">
          <p style="height:100%;line-height:40px;margin:0px;color:black">審查記錄</p>
        </b-col>
        <div class="btn-group">
          <toggle-button
            class="detail-btn"
            @change="auditCompleted = !auditCompleted"
            :sync="true"
            :value="auditCompleted"
            :disabled="data.IsPreAudit == '審單完成' ? true : false"
            :color="{ checked: '#28A745', unchecked: '#DC3545', disabled: '#CCCCCC' }"
            :font-size="14"
            :height="24"
            :width="100"
            :labels="{ checked: '審查完成', unchecked: '尚未審查' }"
          />

          <b-button
            class="mx-1"
            size="sm"
            variant="danger"
            @click="$emit('callLab', data.PatientId)"
          >Call Lab</b-button>

          <b-button
            class="mx-1"
            size="sm"
            variant="success"
            @click="putAudit"
          >儲存</b-button>
          <b-button
            class="mx-1"
            size="sm"
            variant="primary"
            @click="clear"
          >清除</b-button>
          <b-button
            class="mx-1"
            size="sm"
            variant="danger"
            @click="goBack"
          >返回</b-button>
        </div>
      </b-row>
    </b-card-header>

    <patientInfo :patient="data" :icdTen="disease" />

    <b-card-text class="text-left py-1 pr-1 textarea-grid grid-col-2 h-100">
      <b-textarea
        class="ml-1"
        style="height:calc(100%);"
        :disabled="ShowTextArea()"
        v-model="record.PreAuditNote"
        placeholder="請輸入..."
        no-resize
      ></b-textarea>
      <div
        class="read-only p-1 h-100 d-flex flex-column"
        style="border:1px solid #888"
      >
        <p class="m-1 text-black">撰寫醫師 : {{ data.PreAuditPhysicianName }}</p>
        <p class="m-1 text-black">撰寫時間 : {{ DateToString(data.PreAuditTime, true) }}</p>
        <b-textarea
          no-resize
          class="flex-1 text-black"
          style="border:1px solid white;"
          readonly
          v-model="data.PreAuditNote"
        ></b-textarea>
      </div>
    </b-card-text>
  </div>
</template>
<script>
import { dateFormatMixin } from "@/SupportLib_J.js";
import patientInfo from './PatientInfo';
import { getReportByAccessionNo } from "@/assets/service/dataManager.js";
export default {
  mixins: [dateFormatMixin],
  data () {
    return {
      //show出shiftNote的判斷
      shiftNoteActive: false,
      //show出auditNote的判斷
      auditCompleted: false,
      record: {
        //AccesionNo由table傳過來
        AccessionNo: "",
        //User打字傳進來
        PreAuditNote: ""
      }
    };
  },
  components: {
    patientInfo
  },
  methods: {
    ShowTextArea () {
      let status = false;
      this.data.IsPreAudit == "審單完成" ? (status = true) : (status = false);
      if (this.auditCompleted || status) {
        return false;
      } else {
        return true;
      }
    },
    goBack () {
      this.clear();
      //把switch value的值設定回來 false
      this.auditCompleted = false;
      this.$emit("hiddenBox");
    },
    clear () {
      this.record.PreAuditNote = "";
    },
    async putAudit () {
      let note = this.record;
      let status = false;
      this.data.IsPreAudit == "審單完成" ? (status = true) : (status = false);
      // console.log("Con  false為尚未審核 -- true為審核完成");
      // console.log("Con  data(auditCompleted)");
      // console.log(status);
      // console.log(this.auditCompleted);
      //拿到此單號的AccessionNo
      this.record.AccessionNo = this.data.AccessionNo;
      //預計要放入的資料
      // console.log("預計要存入的資料");
      // console.log(note);
      if (status || this.auditCompleted) {
        await window.axios
          .put("/exam/SavePreAuditNote", note)
          .then(r => {
            // console.log(r);
            status = true;
          })
          .catch(e => {
            // console.error(e);
            status = false;
          });
        this.clear();
        this.goBack();
        this.ObjApp.TimingMessage("資料已更新完成");
      } else {
        this.ObjApp.TimingMessage("資料已更新失敗", 2);
      }
    }
  },
  props: { showBox: { type: Boolean }, data: { type: Object } },
  created () {
    //showbox的Bool
    // console.log(this.showBox);
    //傳AccessionNo
    // console.log(this.data.IsPreAudit);
    this.data.IsPreAudit == "審單完成" ? (this.data.IsPreAudit = true) : (this.data.IsPreAudit = false);
    // console.log("get -- 你評過了沒有");
    // console.log(this.data.IsPreAudit);

    //TimingMessage 訊息小工具
    let obj = this.$GetApp(this);
    if (obj) {
      this.ObjApp = obj[0];
      this.VueNestLevel = obj[1];
      // console.log(this.$logs(`Vue Nesting Level ${this.VueNestLevel}`));
    } else {
      // console.log(this.$logs("Fail to get App.vue ref."));
    }
  },
  watch: {
    showBox(val) {
      if(!val) {
        const { AccessionNo:no, PatientId:id } = this.data;
        getReportByAccessionNo(no, id).then(({AccessionNo, DISEASE})=>{
          this.disease = DISEASE;
        })
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.audit {
  position: absolute;
  top: 0px;
  // left: -14000px;
  left: -0px;
  z-index: 99;
  background-color: #ccc;
  width: 80%;
  // height: calc(100vh - 20px);
  border-radius: 5px;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.2);
  border: 1px solid #88959d;
  // height: calc(100vh - 300px);
  // max-height: 80%;
  height: 80%;
  transition: 0.5s;
}
.audit.audit-active {
  // display: none;
  // left: -1400px;
  left: -100vw;

  transition: 0.5s;
}
.detail-btn.vue-js-switch {
  margin: 0px;
  float: right !important;
}
.btn-group {
  width: 30%;
  display: flex;
  align-items: center;
}
* {
  // border: 1px solid;
}
</style>
