<template>
  <sectoin>
    <div class="dtc-car1-grid">
      <b-input-group prepend="病患姓名">
        <b-input readonly />
      </b-input-group>
      <b-input-group prepend="性別年齡">
        <b-input readonly />
      </b-input-group>
      <b-input-group prepend="病歷編號">
        <b-input tag="ScheduleTime" readonly />
      </b-input-group>
      <b-input-group prepend="入院日期">
        <b-input tag="ScheduleTime" readonly />
      </b-input-group>
      <b-input-group prepend="病床編號">
        <b-input tag="ScheduleTime" readonly />
      </b-input-group>
      <b-input-group prepend="評估序號">
        <b-input tag="ScheduleTime" readonly />
      </b-input-group>
      <b-input-group prepend="評估日期">
        <b-input tag="ScheduleTime" readonly />
      </b-input-group>
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
  background: var(--yellow);
  color: black;
  height: 30px;
  border-radius: 5px;
  line-height: 30px;
  padding-left: 12px;
}

.first {
  display: flex;
}

.dtc-car1-grid {
  padding: 3px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 8px !important;
}
.dtc-car2-grid {
  padding: 3px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 8px !important;
}
.dtc-car3-grid {
  padding: 3px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 8px !important;
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