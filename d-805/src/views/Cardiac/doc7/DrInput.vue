<template>
  <sectoin
    class="dtc-car6-grid"
    :class="changeViewpointHeight ? 'dtc-hide-detail' : ''"
  >
    <div
      :class="changeViewpointHeight ? 'dtc-input-area' : ''"
      v-show="!changeViewpointHeight"
    >
      <header class="dtc-history">
        <span>歷史診斷報告</span>
      </header>
    </div>

    <div :class="changeViewpointHeight ? 'dtc-input-area' : ''">
      <vue-tabs
        active-tab-color="#e74c3c"
        style="color:white;"
        active-text-color="white"
      >
        <v-tab
          v-for="(item, i) in tabs"
          class="title_center"
          :key="item"
          :title="item"
        >
          <div slot="title">{{ item }}</div>
          <Hemodynamic v-if="i === 0"></Hemodynamic>

          <LAAO v-if="i === 1"></LAAO>
          <Pacemaker v-if="i === 2"></Pacemaker>
          <VT v-if="i === 3"></VT>
          <vue-tabs
            v-if="i === 4"
            active-tab-color="#e74c3c"
            active-text-color="white"
            style="margin-top:1rem;border:1px solid white;border-radius:5px;"
          >
            <v-tab
              v-for="(item2, t) in ['洗腎廔管', '上下肢血管', '頸動脈']"
              :key="item2"
              :title="item2"
              style="padding:10px;position:relative;color:white"
              @click="cstTabName = item2"
            >
              <div slot="title">{{ item2 }}</div>
              <Sterntube v-show="t == 0"></Sterntube>
              <Vein v-show="t == 1"></Vein>
              <Neck v-show="t == 2"></Neck>
            </v-tab>
          </vue-tabs>
        </v-tab>
      </vue-tabs>
    </div>
  </sectoin>
</template>

<script>
// '上下肢血管',
import Hemodynamic from "@/components/Cardiac/Hemodynamic.vue";
import Intervention from "@/components/Cardiac/Intervention.vue";
import LAAO from "@/components/Cardiac/LAAO.vue";
import Pacemaker from "@/components/Cardiac/Pacemaker.vue";
import VT from "@/components/Cardiac/VT.vue";
import Vein from "@/components/Cardiac/Vein.vue";
import Neck from "@/components/Cardiac/Neck.vue";
import Sterntube from "@/components/Cardiac/Sterntube.vue";
const tabs = ["心導管紀錄", "LAAO", "Permanent Pacemaker", "心臟電生理紀錄", "周邊血管"];
export default {
  data () {
    return {
      cstTabName: "廔管",
      tabs,
      changeViewpointHeight: false,
      chf: false,
      htn: false,
      dm: false,
      ps: false,
      cad: false,
      pad: false,
      disease: false,
      ich: false,
      gi: false
    };
  },
  components: {
    Hemodynamic,
    Intervention,
    LAAO,
    Pacemaker,
    VT,
    Vein,
    Neck,
    Sterntube
  },
  beforeMount () {
    this.$root.$on("car-report-toggle-detail", val => {
      this.changeViewpointHeight = !val;
    });
  }
};
</script>

<style lang="scss" scoped>
.dtc-car6-grid {
  padding: 3px;
  display: grid;
  grid-template-columns: 282px 1fr;
  grid-gap: 8px !important;
  > div {
    height: calc(100vh - 550px);
    border: 1px solid white;
    overflow-y: auto;
    border-radius: 5px;
    textarea,
    textarea:focus {
      background: black;
      width: 100%;
      height: 100%;
      color: white;
      font-size: 1rem;
    }
  }
  > div:first-child {
    display: flex;
    flex-direction: column;
  }
  header {
    background: var(--primary);
    width: 100%;
    color: var(--light);
    height: 30px;
    border-radius: 5px;
    line-height: 30px;
    padding-left: 12px;
  }
  .dtc-input-area {
    height: calc(100vh - 230px) !important;
  }
}
.dtc-hide-detail {
  grid-template-columns: 1fr !important;
}
.dtc-car-info {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 3px;
  > div {
    border: 1px solid white;
    border-radius: 5px;
    height: 38px;
    display: grid;
    grid-template-columns: 90px 1fr;
    color: var(--light);
    text-align: center;
    span {
      display: inline-block;
      line-height: 38px;
      border-right: 1px solid white;
      max-height: 38px;
      min-width: 120px;
    }
  }
}

/deep/ .nav-tabs-navigation {
  padding: 0px;
  position: sticky;
  color: white;
  top: 0;
  background-color: #000;
  z-index: 200;
}
</style>
