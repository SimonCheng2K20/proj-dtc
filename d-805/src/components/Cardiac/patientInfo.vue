<template>
  <CardiacFrame title="病患資訊">
    <b-input-group prepend="檢查日期">
      <b-input />
    </b-input-group>
    <b-input-group prepend="儀器類別">
      <b-input />
    </b-input-group>
    <b-input-group prepend="申請單號">
      <b-input />
    </b-input-group>
    <b-input-group prepend="病歷號">
      <b-input />
    </b-input-group>
    <b-input-group prepend="病患來源">
      <b-input />
    </b-input-group>
    <b-input-group prepend="病患性別">
      <b-input />
    </b-input-group>
    <b-input-group prepend="出生日期">
      <b-input />
    </b-input-group>
    <b-input-group prepend="病患年齡">
      <b-input />
    </b-input-group>
    <b-input-group prepend="病床編號">
      <b-input />
    </b-input-group>
  </CardiacFrame>
</template>

<script>
import CardiacFrame from "./frame";
export default {
  data() {
    return {};
  },
  components: {
    CardiacFrame
  }
};
</script>

<style lang="scss">
</style>
