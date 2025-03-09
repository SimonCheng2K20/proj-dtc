<template>
  <div class="dtc-binfo-grid">
    <b-input-group v-if="showDevice" prepend="Device">
      <b-input />
    </b-input-group>
    <b-input-group prepend="病患姓名">
      <b-input />
    </b-input-group>
    <b-input-group prepend="性別">
      <b-input />
    </b-input-group>
    <b-input-group prepend="檢查日期">
      <b-input />
    </b-input-group>
    <b-input-group prepend="病歷號">
      <b-input />
    </b-input-group>
    <b-input-group prepend="病床編號">
      <b-input />
    </b-input-group>
    <b-input-group prepend="檢查時間">
      <b-input />
    </b-input-group>
    <b-input-group prepend="年齡">
      <b-input />
    </b-input-group>
    <b-input-group prepend="檢查項目">
      <b-input />
    </b-input-group>
    <b-input-group prepend="出生日期">
      <b-input />
    </b-input-group>
    <b-input-group prepend="報告完成日期">
      <b-input />
    </b-input-group>
    <b-input-group prepend="報告完成時間">
      <b-input />
    </b-input-group>
    <b-input-group prepend="開單醫師">
      <b-input />
    </b-input-group>
    <b-input-group prepend="Purpose for Endoscopy" class="long">
      <b-select />
    </b-input-group>
    <b-input-group prepend="Endoscopy">
      <b-select />
    </b-input-group>
  </div>
</template>

<script>
let atTime;
export default {
  data() {
    return {};
  },
  props: ["showMoreFields", "showDevice", "isPPM"],
  components: {}
};
</script>

<style lang="scss">
.dtc-binfo-grid {
  padding: 3px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 3px !important;
  .input-group-prepend .input-group-text {
    min-width: 120px;
    max-width: 120px;
  }

  .long .input-group-prepend .input-group-text {
    min-width: 184px;
    max-width: 184px;
  }
}
</style>
