<template>
  <sectoin>
    <header>心導管檢查術前評估 - 病患過往病史</header>
    <div class="dtc-car12-grid">
      <div class="bg-white text-black font-weight-bolder">HTN</div>
      <div>DM</div>
      <div class="bg-white text-black font-weight-bolder">Dyslipidemia</div>
      <div>CDK</div>
      <div>ESRD</div>
      <div>HF</div>
      <div>Arrhythmia</div>
      <div>GOUT</div>
      <div>Old MI</div>
      <div>Old CVA</div>
      <div class="bg-white font-weight-bolder text-black">PAD</div>
      <div>CAD</div>
    </div>
  </sectoin>
</template>

<script>
export default {
  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
.car {
  background: black !important;
  font-size: 16px;
  font-weight: 600;
  margin-top: 56px;
  width: 100vw;
  min-height: calc(100vh - 56px);
  padding: 2px;
}

header {
  background: var(--primary);
  color: white;
  height: 30px;
  border-radius: 5px;
  line-height: 30px;
  padding-left: 12px;
}

.first {
  display: flex;
}

.dtc-car12-grid {
  padding: 3px;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-gap: 8px;
  > div {
    border-radius: 5px;
    height: 38px;
    text-align: center;
    line-height: 38px;
    border: 1px solid white;
    // color: var(--light);
    color: #6c757d !important;
  }
}

.input-group-prepend .input-group-text {
  min-width: 100px;
  max-width: 100px;
  background: rgba(0, 0, 0, 0.7);
  color: hsla(0, 0%, 100%, 0.7);
}
.input-group-append .input-group-text {
  background: rgba(0, 0, 0, 0.7);
  color: hsla(0, 0%, 100%, 0.7);
}
.input-group input,
.input-group select {
  background: rgba(0, 0, 0, 0.7);
  color: white;
}
</style>