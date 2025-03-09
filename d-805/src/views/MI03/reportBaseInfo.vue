<template>
  <div
    class="search-section d-grid grid-col-5"
    style="grid-gap: 2px;"
  >
    <div class="d-flex align-items-center">
      <b-input-group
        style="width: unset;"
        prepend="優先順序"
      >
        <template v-slot="append">
          <b-radio-group
            tag="EmgFlag"
            name="CaseEmergency"
            v-model="emgStatus"
            :options="emgOptions"
            buttons
            button-variant="outline-danger"
            style="pointer-events: none"
          ></b-radio-group>
        </template>
      </b-input-group>

      <toggle-button
        v-show="isCtMri"
        v-model="report.IsPositive"
        class="positive-btn mx-auto"
        color="#dc3545"
        :sync="true"
        :font-size="16"
        :height="26"
        :width="72"
        :labels="{ checked: '陽性', unchecked: '陰性' }"
      />
    </div>

    <b-input-group prepend="檢查日期">
      <b-input
        tag="ScheduleTime"
        v-model="procedure.StudyDate"
        readonly
      />
    </b-input-group>

    <b-input-group prepend="儀器類別">
      <b-input
        tag="Modality"
        v-model="procedure.Modality"
        readonly
      />
    </b-input-group>

    <b-input-group prepend="申請單號">
      <b-input
        tag="AccessionNo"
        v-model="procedure.AccessionNo"
        readonly
      />
    </b-input-group>

    <b-input-group prepend="病歷號">
      <b-input
        tag="PatientId"
        v-model="procedure.PatientId"
        readonly
      />
    </b-input-group>

    <b-input-group prepend="病患來源">
      <b-input
        tag="PatientSourceTypeCode"
        v-model="procedure.PatientSourceType"
        readonly
      />
    </b-input-group>

    <b-input-group prepend="病患姓名">
      <b-input
        v-model="procedure.PatientName"
        readonly
      />
    </b-input-group>

    <b-input-group prepend="病患性別">
      <b-input
        v-model="procedure.PatientSex"
        readonly
      />
    </b-input-group>

    <b-input-group prepend="出生日期">
      <b-input
        v-model="procedure.PatientBirthday"
        readonly
      />
    </b-input-group>

    <b-input-group prepend="病患年齡">
      <b-input
        v-model="procedure.PatientAge"
        readonly
      />
    </b-input-group>

    <b-input-group prepend="病床編號">
      <b-input
        v-model="procedure.BedNo"
        readonly
      />
    </b-input-group>

    <b-input-group prepend="開單醫師">
      <b-input
        v-model="procedure.RequestingPhysicianName"
        readonly
      />
    </b-input-group>

    <b-input-group class="bg-white">
      <b-input-group-prepend>
        <b-button
          variant="primary"
          @click="$emit('ShowIQControlEdit')"
        >影像品質</b-button>
      </b-input-group-prepend>
      <b-input
        v-model="NameOfImageQuality"
        readonly
      />
    </b-input-group>

    <b-input-group prepend="審核醫師">
      <b-form-select
        :disabled="report.DxrStatus == 71 || canApproveReport"
        placeholder
        v-model="report.IssuePhysicianId"
        :options="approvalList"
        @change="updateTempId"
      ></b-form-select>
    </b-input-group>
    <b-input-group prepend="報告狀態">
      <b-input
        v-model="procedure.StatusName"
        readonly
      />
    </b-input-group>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  data () {
    return {
      emgOptions: [
        { text: "急件", value: "Y" },
        { text: "一般", value: "N" },
      ],
      emgStatus: "N",
    };
  },
  created () {
    if (this.getIssueDrs.length === 0) this.action_getIssueDoctors();
  },
  mounted () {
    this.emgStatus = this.procedure.EmgFlag ? this.procedure.EmgFlag : this.emgOptions[1].value;
  },
  props: {
    report: {
      type: Object,
      default: () => { },
    },
    procedure: {
      type: Object,
      default: () => { },
    },
    optionsImageQuality: {
      type: Array,
      default: () => [],
    },
    tempPhysicianId: {
      // 方便自動選擇
      type: String,
      default: null,
    },
  },
  methods: {
    ...mapActions(["action_getIssueDoctors"]),
    updateTempId () {
      this.$emit("updateSpecificVariable", { value: this.report.IssuePhysicianId, key: "tempPhysicianId" });
    },
  },
  computed: {
    ...mapGetters(["getIssueDrs", "getUserId"]),

    approvalList () {
      return [{ value: null, text: "請選擇..." }, ...this.getIssueDrs];
    },
    isCtMri () {
      return this.procedure.Modality && ["CT", "MR"].some((k) => this.procedure.Modality.includes(k));
    },
    NameOfImageQuality () {
      return this.report && this.report.ImageQualityCode && this.optionsImageQuality && this.optionsImageQuality.length > 0
        ? this.optionsImageQuality.find(({ value }) => value == this.report.ImageQualityCode)["text"] || ""
        : "";
    },
    canApproveReport () {
      return this.approvalList.findIndex(({ value }) => this.getUserId === value) >= 0;
    },
  },
  watch: {
    "procedure.AccessionNo" () {
      this.emgStatus = this.procedure.EmgFlag ? this.procedure.EmgFlag : this.emgOptions[1].value;
    },
  },
};
</script>
