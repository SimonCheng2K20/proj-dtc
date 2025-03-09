<template>
  <div
    :class="{ shiftnote: true, 'shiftNote-active': showBox }"
    class="p-0 d-flex flex-column"
  >
    <b-card-header class="bg-secondary text-white cardHeader">

      <b-row
        style="display:flex;justify-content:space-between"
        no-gutters
      >
        <b-col cols="6">
          <p style="height:100%;line-height:40px;margin:0px;color:color">交班記錄</p>
        </b-col>
        <div class="btn-group">
          <b-button
            class="mx-1"
            size="sm"
            variant="warning"
            @click="$emit('callLab', data.PatientId)"
          >Call Lab</b-button>

          <b-button
            class="mx-1"
            size="sm"
            variant="success"
            @click="putContent"
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
        placeholder="請輸入..."
        no-resize
        v-model.trim="record.ShiftNote"
      ></b-textarea>
      <div
        class="read-only p-1 h-100 d-flex flex-column"
        style="border:1px solid #888"
      >
        <p class="m-1 text-black">撰寫醫師 : {{ data.ShiftPhysicianName }}</p>
        <p class="m-1 text-black">撰寫時間 : {{ DateToString(data.ShiftNoteTime, true) }}</p>
        <b-textarea
          no-resize
          class="flex-1 text-black"
          style="border:1px solid white;"
          readonly
          v-model="data.ShiftNote"
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
      shiftNoteActive: false,
      record: {
        AccessionNo: "",
        ShiftNote: ""
      },
      disease: ''
    };
  },
  props: { showBox: { type: Boolean }, data: { type: Object } },
  methods: {
    clear () {
      this.record.ShiftNote = "";
    },
    goBack () {
      this.$emit("hiddenBox");
      this.clear();
    },
    async putContent () {
      let note = this.record;
      let status = false;
      //拿到此單號的AccessionNo
      this.record.AccessionNo = this.data.AccessionNo;
      //預計要放入的資料
      // console.log(this.record);
      if (this.record.ShiftNote.length == 0) {
        this.ObjApp.TimingMessage("編輯處不可為空白", 2);
      } else {
        // console.log(note);
        await window.axios
          .put("/exam/SaveShiftNote", note)
          .then(r => {
            // console.log(r);
            status = true;
            this.goBack();
          })
          .catch(e => {
            // console.error(e);
            status = false;
          });
        if (status) {
          // this.$router.replace({ path: "/MI03/FI0305" });
          this.ObjApp.TimingMessage("資料已更新完成");
          this.goBack();
        } else {
          this.ObjApp.TimingMessage("資料已更新失敗", 2);
        }
      }
      this.clear();
    }
  },
  created () {
    //showbox的Bool
    // console.log(this.showBox);
    //傳AccessionNo
    // console.log(this.data);
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
          // this.disease = DISEASE;
          this.disease = DISEASE;
        })
      }
    }
  },
  components: {
    patientInfo
  }
};
</script>
<style lang="scss" scoped>
.shiftnote {
  /* display: var(--boxWidth); */
  position: absolute;
  top: 0px;
  // left: -14000px;
  left: -0px;
  z-index: 99;
  background-color: #ccc;
  width: 80%;
  border-radius: 5px;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.2);
  // height: calc(100vh - 300px);
  // max-height: 80%;
  height: 80%;
  transition: 0.5s;
}
.shiftnote.shiftNote-active {
  left: -100vw;
  transition: 0.5s;
}
.btn-group {
  width: 20%;
  display: flex;
  align-items: center;
}
.read-only {
}
* {
  // border: 1px solid;
}
</style>
