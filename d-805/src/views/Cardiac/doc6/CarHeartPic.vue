<template>
  <sectoin>
    <header>心導管檢查術前評估 - 心電圖</header>
    <div class="dtc-car2-grid">
      <section>
        <div>Thallium Scan</div>
        <b-input v-model="where" class="text-danger font-weight-bold text-uppercase" readonly></b-input>
      </section>
      <section>
        <div>Treadmill Test</div>
        <b-input v-model="result" readonly></b-input>
      </section>
    </div>
    <div class="heart-img">
      <img :src="img" class="my-img" />
    </div>
  </sectoin>
</template>

<script>
export default {
  data() {
    return {
      where: "Server",
      result: "NEGATIVE",
      img: require("./beat.jpg")
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

.dtc-car2-grid {
  padding: 3px;
  display: grid;
  grid-template-columns: 300px 300px;
  grid-gap: 8px;
  > section {
    border-radius: 5px;
    height: 38px;
    text-align: center;
    line-height: 38px;
    border: 1px solid white;
    display: grid;
    color: white;
    grid-template-columns: 120px 1fr;
    input {
      border-top: 0px;
      border-right: 0px;
      background: black;
    }
  }
}
.heart-img {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  margin: 1rem auto;
  img {
    display: inline-block;
    object-fit: cover;
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