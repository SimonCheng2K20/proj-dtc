<template>
  <temp-grid :cols="4">
    <div
      v-for="info in baseData"
      :key="info.key"
      class="d-flex border p-2"
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
        { key: "AccessionNo", text: "申請單號", value: '' },
        { key: "PatientId", text: "病歷號", value: '' },
        { key: "PatientSourceTypeName", text: "病患來源", value: '' },
        { key: "PatientName", text: "病患姓名", value: '' },
        { key: "PatientSex", text: "病患性別", value: '' },
        { key: "PatientAge", text: "病患年齡", value: '' },
        { key: "RequestingServiceName", text: "部門", value: '' },
      ],
    }
  },
  props: {
    info: {
      type: Object,
      default: null,
    },
  },
  created () {
    this.baseData.forEach((item) => {
      if (this.info[item.key]) item.value = this.info[item.key];
    });
  },
  components: {
    tempGrid
  }
}
</script>

<style lang="scss">
</style>
