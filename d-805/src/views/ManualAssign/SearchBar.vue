<template>
  <div class="control-section accordion-control-section">
    <b-card
      no-body
      class="mx-1"
      bg-variant="transparent"
    >
      <b-card-header class="bg-primary text-white cardHeader">
        <b-row no-gutters>
          <b-col cols="6">手動分派報告．查詢作業</b-col>
        </b-row>
      </b-card-header>
      <b-card-text class="text-left py-1" id="searchBar">
        <b-container
          fluid
          class="px-1"
        >
          <b-row no-gutters>
            <b-col
              sm="2"
              class="px-1"
            >
              <ejs-textbox
                v-model="AccessionNo"
                floatLabelType="Always"
                placeholder="申請單號"
                :showClearButton="true"
                @keyup.enter="onFilter"
              />
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <ejs-textbox
                v-model="PatientName"
                floatLabelType="Always"
                placeholder="病患姓名"
                :showClearButton="true"
                @keyup.enter="onFilter"
              />
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <ejs-textbox
                v-model="OtherPatientId"
                floatLabelType="Always"
                placeholder="身分證字號"
                :showClearButton="true"
                @keyup.enter="onFilter"
              />
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <ejs-textbox
                v-model="PatientId"
                floatLabelType="Always"
                placeholder="病歷號"
                :showClearButton="true"
                @keyup.enter="onFilter"
              />
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <ejs-textbox
                v-model="ProcedureCode"
                floatLabelType="Always"
                placeholder="檢查項目院內代碼"
                :showClearButton="true"
                @keyup.enter="onFilter"
              />
            </b-col>
            <b-col
              sm="1"
              class="px-1"
              style="display: table; height: 60px;"
            >
              <div style="display: table-cell; vertical-align: middle">
               <ejs-checkbox v-model="IncludeRelease" :checked="IncludeRelease" label='包含正式報告'></ejs-checkbox>
               </div>
            </b-col>
          </b-row>
          <b-row no-gutters>
            <b-col
              sm="2"
              class="px-1"
            >
              <ejs-datetimepicker
                floatLabelType="Always"
                placeholder="影像到位時間(開始)"
                v-model="StartTime"
                :step="60"
                :max="EndTime"
                :format="timeFormat"
                :allowEdit="false"
                :showClearButton="true"
              ></ejs-datetimepicker>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <ejs-datetimepicker
                floatLabelType="Always"
                placeholder="影像到位時間(結束)"
                v-model="EndTime"
                :step="60"
                :min="StartTime"
                :format="timeFormat"
                :allowEdit="false"
                :showClearButton="true"
              ></ejs-datetimepicker>
            </b-col>
            <b-col sm="2" class="px-1">
              <ejs-dropdownlist
                v-model="PatientSourceTypeCode"
                floatLabelType="Always"
                :dataSource="patientSourceTypeCodeList"
                :fields="{ text: 'Name', value: 'No' }"
                placeholder="病患來源"
                :showClearButton="true"
              ></ejs-dropdownlist>
            </b-col>
            <b-col sm="2" class="px-1">
              <ejs-dropdownlist
                v-model="Modality"
                floatLabelType="Always"
                :dataSource="modalityList"
                :fields="{ text: 'Name', value: 'No' }"
                placeholder="儀器類別"
                :showClearButton="true"
              ></ejs-dropdownlist>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <ejs-dropdownlist
                v-model="DxreportPhysicianId"
                :dataSource="employeeNos"
                :fields="{ text: 'Name', value: 'No' }"
                floatLabelType="Always"
                :showClearButton="true"
                placeholder="分派醫師"
              ></ejs-dropdownlist>
            </b-col>
            <b-col
              class="px-2 text-right"
              style="height: 60px;"
            >
              <div style="display: table-cell; vertical-align: middle">
                <b-button
                  variant="success"
                  @click="onClear"
                >
                  <font-awesome-icon icon="eraser" />清除
                </b-button>&nbsp;
                <b-button
                  variant="primary"
                  @click="onFilter"
                >
                  <font-awesome-icon icon="search" />查詢
                </b-button>
              </div>
            </b-col>
          </b-row>
        </b-container>
      </b-card-text>
      <b-card-header class="bg-primary text-white cardHeader">
        <b-row no-gutters>
          <b-col cols="12">手動分派醫師</b-col>
        </b-row>
      </b-card-header>
      <b-card-body style="padding:0px; padding: 12px 4px;">
        <div class="grid-row">
          <ejs-dropdownlist
            v-model="approvalId"
            :dataSource="employeeNos"
            :fields="{ text: 'Name', value: 'No' }"
            floatLabelType="Always"
            :showClearButton="true"
          ></ejs-dropdownlist>
          <b-button
            variant="info"
            :disabled="!approvalId || !totalRows"
            @click="dispatchJobs"
          >
            <font-awesome-icon
              icon="share-square"
              class="mr-1"
            />分派醫師
          </b-button>
        </div>
      </b-card-body>
    </b-card>
  </div>
</template>
<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { DropDownListPlugin } from "@syncfusion/ej2-vue-dropdowns";
import { RadioButtonPlugin, CheckBoxPlugin } from "@syncfusion/ej2-vue-buttons";
import { TextBoxPlugin } from "@syncfusion/ej2-vue-inputs";
import { DateTimePickerPlugin } from "@syncfusion/ej2-vue-calendars";
import Swal from "sweetalert2";

Vue.use(CheckBoxPlugin);
Vue.use(TextBoxPlugin);
Vue.use(RadioButtonPlugin);
Vue.use(DropDownListPlugin);
Vue.use(DateTimePickerPlugin);

export default {
  props: ["employeeNos", "gridRef", "totalRows", "modalityList", "patientSourceTypeCodeList"],
  data () {
    return {
      timeFormat: "yyyy/MM/dd HH:mm",
      ObjApp: "",
      approvalId: "",
      // approvalList: [],
      OtherPatientId: "",
      PatientId: "",
      PatientName: "",
      AccessionNo: "",
      ProcedureCode: "",
      IncludeRelease: false,
      StartTime: null,
      EndTime: null,
      DxreportPhysicianId: null,
      PatientSourceTypeCode: null,
      Modality: null
    };
  },
  computed: {
    ...mapGetters(["getThemeColors"])
  },

  methods: {
    onFilter: function () {
      this.$emit("filter", this);
      showSpinner(document.getElementById('searchBar'));
    },
    onClear: function () {
      this.OtherPatientId = "";
      this.PatientId = "";
      this.PatientName = "";
      this.AccessionNo = "";
      this.ProcedureCode = "";
      this.StartTime = null;
      this.EndTime = null;
      this.DxreportPhysicianId = null;
      this.PatientSourceTypeCode = null;
      this.Modality = null;
      this.IncludeRelease = false;

      this.$emit("filterClear", this);
    },
    async dispatchJobs () {
      let _this = this;
      let rows = this.gridRef.getSelectedRecords(); // Get the selected records.
      if (!rows.length) {
        this.ObjApp.TimingMessage("尚未, 不得存檔.", 2);
        return;
      }
      //console.log(JSON.stringify(rows, 0, 2));
      let arr = [];
      let showWarning = false;
      rows.forEach(s => {
        arr.push(s.AccessionNo);
        if(s.Status == "71")
          showWarning = true;
      });
      if(showWarning){
        Swal.fire({
          title: "確認分派？",
          text: "選定的檢查單包含正式報告，這樣將會刪除這些檢查單的所有正式報告！",
          type: "question",
          showCancelButton: true,
          confirmButtonColor: "#d33",
          cancelButtonColor: "#3085d6",
          confirmButtonText: "確定分派，並刪除正式報告！",
          cancelButtonText: "取消"
        }).then(function (e) {
          if (e.value) {
            _this.assignReport(arr);
          }
        });
      }
      else
        this.assignReport(arr);
    },
    async assignReport(arr){
        this.ObjApp.WaitingShow();
        await window.axios
          .put("/exam/AssignReport", {
            ReportPhysicianId: this.approvalId,
            AccessionNos: arr
          })
          .then(() => {
            this.ObjApp.WaitingHide();
            this.gridRef.ej2Instances.refresh();
            Swal.fire({
              type: "success",
              title: "分派醫師成功！",
              timer: 1500
            });
          })
          .catch(function (error) {
            Swal.fire("分派醫師失敗！", error, "error");
          });
    }
  },
  async beforeMount () {
    this.ObjApp = this.$GetApp(this)[0];
  },
  mounted: function() {
    createSpinner({
      target: document.getElementById('searchBar')
    });
  }
};
</script>
<style lang="scss" scoped>
.grid-row {
  display: grid;
  padding: 0px;
  margin: 0px;
  grid-template-columns: 320px 150px 120px 1fr;
  grid-column-gap: 12px;
}
</style>
