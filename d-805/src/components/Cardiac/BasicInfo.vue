<template>
  <div class="dtc-binfo-grid bg-dark">
    <b-input-group v-if="showDevice" prepend="Device" style="background:#000;">
      <b-input />
    </b-input-group>
    <b-input-group prepend="檢查日期">
      <b-input />
    </b-input-group>
    <b-input-group prepend="導管號碼">
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
    <b-input-group prepend="執行醫師">
      <b-input />
    </b-input-group>
    <b-input-group prepend="助手醫師">
      <b-input />
    </b-input-group>
    <b-input-group prepend="護理師">
      <b-input />
    </b-input-group>
    <b-input-group prepend="放射師">
      <b-input />
    </b-input-group>
    <b-input-group prepend="Procedure">
      <b-input />
    </b-input-group>
    <template v-if="isPPM">
      <b-input-group prepend="穿刺部位" v-if="!showDevice">
        <b-input />
      </b-input-group>
      <b-input-group prepend="Lidocaine(2%)" append="cc">
        <b-input />
      </b-input-group>
    </template>
    <template v-if="showMoreFields">
      <b-input-group prepend="Fluoro Time" append="min" v-if="!showDevice">
        <b-input />
      </b-input-group>
      <b-input-group prepend="VESSOL Type" v-if="!showDevice">
        <b-form-select v-model="vessol" :options="vessols"></b-form-select>
      </b-input-group>
      <b-input-group prepend="穿刺部位" v-if="!showDevice">
        <b-input />
      </b-input-group>
      <b-input-group prepend="Lidocaine(2%)" append="cc">
        <b-input />
      </b-input-group>
      <b-input-group prepend="麻醉時間">
        <input type="time" v-model="atTime" style="flex:1;min-width:0px" />
      </b-input-group>
      <b-input-group class="long" prepend="Contrast medium">
        <b-form-select v-model="constrast" :options="constrasts" variant="dark"></b-form-select>
      </b-input-group>
      <b-input-group prepend="Right CAG" v-if="!showDevice">
        <b-form-select v-model="right" :options="rights"></b-form-select>
      </b-input-group>
      <b-input-group prepend="Left CAG" v-if="!showDevice">
        <b-form-select v-model="left" :options="lefts"></b-form-select>
      </b-input-group>
    </template>
  </div>
</template>

<script>
const vessols = ["insignificant", "SVD", "DVD", "TVD", "LM+SVD", "LM+DVD", "LM+TVD"];
const constrasts = ["Ominpaque (CC)", "Ultravist(CC)", "Visipaque(CC)"];
const rights = ["JR4", "JR5"];
const lefts = ["JL3", "JL3.5", "JL4", "JL4.5", "JL5", "JL6"];
let atTime;
export default {
  data() {
    return {
      vessols,
      vessole: "",
      constrasts,
      constrast: "",
      rights,
      right: "",
      lefts,
      left: "",
      atTime
    };
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
    background: var(--dark);
    color: white;
  }
  .input-group-append .input-group-text {
    background: var(--dark);
    color: white;
  }
  .input-group input,
  .input-group select {
    background: var(--gray-dark);
    color: var(--light);
  }
  .long .input-group-prepend .input-group-text {
    min-width: 140px;
    max-width: 140;
    background: var(--dark);
  }
}
</style>
