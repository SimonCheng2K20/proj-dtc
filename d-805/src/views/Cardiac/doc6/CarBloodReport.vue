<template>
  <sectoin>
    <header>心導管檢查術前評估 - 血液分析</header>
    <div class="dtc-car6-grid">
      <section>
        <div>Hb</div>
        <b-input v-model="hb"></b-input>
        <div>g/dL</div>
      </section>
      <section>
        <div>Hct</div>
        <b-input></b-input>
        <div>%</div>
      </section>
      <section>
        <div>BUN</div>
        <b-input></b-input>
        <div>mg/dL</div>
      </section>
      <section>
        <div>Cr</div>
        <b-input></b-input>
        <div>mg/dL</div>
      </section>
      <section>
        <div>PT/aPTT</div>
        <b-input></b-input>
        <div>10³/μL</div>
      </section>
      <div></div>
      <section>
        <div>CHOL</div>
        <b-input></b-input>
        <div>mg/dL</div>
      </section>
      <section>
        <div>TG</div>
        <b-input></b-input>
        <div>mg/dL</div>
      </section>
      <section>
        <div>LDL</div>
        <b-input></b-input>
        <div>mg/dL</div>
      </section>
      <section>
        <div>HDL</div>
        <b-input></b-input>
        <div>mg/dL</div>
      </section>
    </div>
  </sectoin>
</template>

<script>
export default {
  data() {
    return {
      hb: "4.5"
    };
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
  background: var(--danger);
  color: white;
  height: 30px;
  border-radius: 5px;
  line-height: 30px;
  padding-left: 12px;
}

.first {
  display: flex;
}

.dtc-car6-grid {
  padding: 3px;
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 8px;
  > section {
    border-radius: 5px;
    height: 38px;
    text-align: center;
    line-height: 38px;
    border: 1px solid white;
    // color: #6c757d !important;
    color: var(--light);
    display: grid;
    grid-template-columns: 100px 1fr 70px;
    text-align: center;
    input {
      background: black;
      color: var(--light);
      border-top: 0px;
      //border-bottom: 0px;
      text-align: right;
      font-weight: 800;
    }
    > div:last-child {
      color: #6c757d !important;
    }
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