<template>
  <temp-grid :cols="4">
    <div
      v-for="info in baseData"
      :key="info.key"
      class="d-flex"
    >
      <div
        style="min-width: 70px;"
        v-text="info.text"
      />
      <span class="mr-2">:</span>
      <div
        class="flex-1"
        v-text="info.value"
      />
    </div>
  </temp-grid>
</template>

<script>
import tempGrid from "@/components/template/tempGrid";
export default {
  data () {
    return {
      baseData: [
        { key: "priorityCode", text: "優先順序", value: '' },
        { key: "StudyDate", text: "檢查日期", value: '' },
        { key: "Modality", text: "儀器類別", value: '' },
        { key: "AccessionNo", text: "申請單號", value: '' },
        { key: "PatientId", text: "病歷號", value: '' },
        { key: "PatientSourceType", text: "病患來源", value: '' },
        { key: "PatientName", text: "病患姓名", value: '' },
        { key: "PatientSex", text: "病患性別", value: '' },
        { key: "PatientBirthday", text: "病患生日", value: '' },
        { key: "PatientAge", text: "病患年齡", value: '' },
        { key: "BedNo", text: "病床編號", value: '' },
        { key: "RequestingPhysicianName", text: "開單醫師", value: '' },
        { key: "StatusName", text: "報告狀態", value: '' },
      ],
    };
  },
  components: {
    tempGrid,
  },
  props: {
    patient: {
      type: Object,
      default: null,
    },
  },
  created () {
    this.baseData.forEach((item) => {
      if (this.patient[item.key]) item.value = this.patient[item.key];
    });
  },
  methods: {},
};
</script>

<style lang="scss" scoped></style>
