<template>
  <div class="car">
    <header>心導管檢查術前評估 - 病患基本資訊</header>
    <BaseInfo></BaseInfo>
    <CarHistory></CarHistory>
    <CarBloodReport></CarBloodReport>
    <CarHeartPic></CarHeartPic>
  </div>
</template>

<script>
import BaseInfo from "./BaseInfo";
import CarHistory from "./CarHistory";
import CarBloodReport from "./CarBloodReport";
import CarHeartPic from "./CarHeartPic";
export default {
  data() {
    return {};
  },
  components: { BaseInfo, CarHistory, CarBloodReport, CarHeartPic }
};
</script>

<style lang="scss" scoped>
.car {
  background: black !important;
  font-size: 1rem;
  font-weight: 600;
  margin-top: 56px;
  width: 100vw;
  min-height: calc(100vh - 56px);
}

header {
  background: var(--yellow);
  color: black;
  border-radius: 5px;
  padding-left: 12px;
  line-height: 38px;
  height: 38px;
}

/deep/ .form-group {
  margin-bottom: 0px;
}
</style>
