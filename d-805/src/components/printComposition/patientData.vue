<template>
  <div class="row py-2">
    <div
      class="col-4 text-left"
      :key="item.key"
      v-for="item in baseData"
      v-text="`${item.text}: ${item.value}`"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { getOptionsPatientSource } from "@/assets/service/dataManager.js";
export default {
  data() {
    return {
      baseData: [
        { key: "PatientName", text: "病患姓名", value: "" },
        { key: "Sex", text: "性  別", value: "" },
        { key: "Age", text: "年  齡", value: "" },
        { key: "Birthday", text: "出生日期", value: "" },
        { key: "Modality", text: "科  別", value: "" },
        { key: "PatientId", text: "病歷號碼", value: "" },
        { key: "RequestingPhysicianName", text: "開單醫生", value: "" },
        { key: "PatientSourceTypeCode", text: "病患來源", value: "" },
        { key: "BedNo", text: "病床號碼", value: "" },
        { key: "OrderDate", text: "開單日期", value: "" },
        { key: "ProcedureCompleted", text: "檢查完成日期", value: "" },
        { key: "ReportCreateTime", text: "報告完成日期", value: "" },
        { key: "OrderNo", text: "檢查單號", value: "" },
        { key: "ProcedureName", text: "檢查項目", value: "" },
        { key: "ReportLastModifyTime", text: "報告修改日期", value: "" },
      ],
    };
  },
  props: {
    patientInfo: {
      type: Object,
    },
  },
  async mounted() {
    await this.fetchPatientSource();

    this.baseData.forEach((item) => {
      if (this.patientInfo[item.key]) {
        if (item.key === "ReportDateTime") {
          this.patientInfo[item.key] =
            this.patientInfo[item.key].substr(0, 8) +
            " " +
            this.patientInfo[item.key].substr(8);
        }
        item.value =
          item.key.includes("Date") ||
          item.key.includes("Time") ||
          item.key === "ProcedureCompleted"
            ? this.$moment(this.patientInfo[item.key]).format(
                "YYYY-MM-DD HH:mm"
              )
            : item.key === "PatientSourceTypeCode"
            ? this.patientSourceList.find(
                ({ value }) => value === this.patientInfo[item.key]
              )["text"]
            : this.patientInfo[item.key];
        if (
          item.key === "ReportLastModifyTime" &&
          this.patientInfo["ReportLastModifyTime"] ==
            this.patientInfo["ReportCreateTime"]
        ) {
          item.value = "";
        }
      }
    });
  },
  computed: {
    ...mapState(["patientSourceList"]),
  },
  methods: {
    ...mapMutations(["SET_PATIENT_SOURCE_LIST"]),
    async fetchPatientSource() {
      if (this.patientSourceList.length === 0) {
        const {
          actual: { Items },
        } = await getOptionsPatientSource();
        this.SET_PATIENT_SOURCE_LIST(
          Items.map(({ No, Name }) => ({ text: Name, value: No }))
        );
      }
    },
  },
};
</script>
