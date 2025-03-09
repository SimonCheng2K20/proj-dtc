<template>
  <div class="car" id="dtc-cardiac">
    <header>
      報告撰寫作業
      <toggle-button
        ref="toggleView"
        @change="showDetails = !showDetails"
        :value="showDetails"
        class="detail-btn"
        color="#dc3545"
        :font-size="14"
        :height="24"
        :width="100"
        :labels="{ checked: '顯示詳情', unchecked: '顯示詳情' }"
      />
      <div></div>
      <b-dropdown id="dropdown-100" text="背景更換" dropleft style="font-size:12px;max-height:26px;">
        <b-dropdown-item class="bg-clr" @click="bgUpdate('white', $event)">白色</b-dropdown-item>
        <b-dropdown-item class="bg-clr" @click="bgUpdate('black', $event)">黑色</b-dropdown-item>
        <b-dropdown-item class="bg-clr" @click="bgUpdate('gray', $event)">灰色</b-dropdown-item>
      </b-dropdown>
    </header>
    <BasicInfo></BasicInfo>
    <BasicInput v-show="showDetails"></BasicInput>
    <BasicButtons></BasicButtons>
    <DrInput></DrInput>
  </div>
</template>

<script>
import BasicInfo from "./BasicInfo";
import BasicInput from "./BasicInput";
import BasicButtons from "./BasicButtons";
import DrInput from "./DrInput";
import hotkeys from "hotkeys-js";

window.dtcHeartPath = [
  { x: 62, y: 14, msg: "L1" },
  { x: 45, y: 115, msg: "L2" },
  { x: 91, y: 183, msg: "L3" },
  { x: 20, y: 245, msg: "L5" },
  { x: 94, y: 267, msg: "L6" },
  { x: 180, y: 316, msg: "L7" },
  { x: 209, y: 418, msg: "L8" },
  { x: 176, y: 253, msg: "L9" },
  { x: 216, y: 283, msg: "L9a" },
  { x: 234, y: 318, msg: "L10" },
  { x: 241, y: 351, msg: "L10a" },
  { x: 31, y: 278, msg: "L11" },
  { x: 72, y: 288, msg: "L12" },
  { x: 78, y: 317, msg: "L12a" },
  { x: 83, y: 347, msg: "L12b" },
  { x: 18, y: 346, msg: "L13" },
  { x: 52, y: 360, msg: "L14" },
  { x: 64, y: 387, msg: "L14a" },
  { x: 86, y: 412, msg: "L14b" },
  { x: 116, y: 435, msg: "L15" },
  { x: 378, y: 15, msg: "R1", selected: true },
  { x: 360, y: 118, msg: "R2", selected: true },
  { x: 408, y: 186, msg: "R3", selected: true },
  { x: 468, y: 203, msg: "R4" },
  { x: 470, y: 138, msg: "R16" },
  { x: 497, y: 205, msg: "R16a" },
  { x: 513, y: 180, msg: "R16b" },
  { x: 529, y: 158, msg: "R16c" },
  { x: 331, y: 245, msg: "R5" },
  { x: 410, y: 268, msg: "R6" },
  { x: 499, y: 316, msg: "R7" },
  { x: 530, y: 419, msg: "R8" },
  { x: 494, y: 254, msg: "R9" },
  { x: 537, y: 283, msg: "R9a" },
  { x: 555, y: 319, msg: "R10" },
  { x: 563, y: 352, msg: "R10a" },
  { x: 345, y: 278, msg: "R11" },
  { x: 388, y: 289, msg: "R12" },
  { x: 393, y: 317, msg: "R12a" },
  { x: 397, y: 349, msg: "R12b" },
  { x: 329, y: 343, msg: "R13" },
  { x: 363, y: 355, msg: "R14" },
  { x: 380, y: 387, msg: "R14a" },
  { x: 400, y: 413, msg: "R14b" }
];
window.segmentalWeightingFactors = [
  { Segment: "1", Name: "RCA proximal", RightFactor: 1, LeftFactor: 0 },
  { Segment: "2", Name: "RCA mid", RightFactor: 1, LeftFactor: 0 },
  { Segment: "3", Name: "RCA distal", RightFactor: 1, LeftFactor: 0 },
  {
    Segment: "4",
    Name: "Posterior descending artery",
    RightFactor: 1,
    LeftFactor: null
  },
  {
    Segment: "16",
    Name: "Posterolateral branch from RCA",
    RightFactor: 0.5,
    LeftFactor: null
  },
  {
    Segment: "16a",
    Name: "Posterolateral branch from RCA",
    RightFactor: 0.5,
    LeftFactor: null
  },
  {
    Segment: "16b",
    Name: "Posterolateral branch from RCA",
    RightFactor: 0.5,
    LeftFactor: null
  },
  {
    Segment: "16c",
    Name: "Posterolateral branch from RCA",
    RightFactor: 0.5,
    LeftFactor: null
  },
  { Segment: "5", Name: "Left Main", RightFactor: 5, LeftFactor: 6 },
  { Segment: "6", Name: "LAD proximal", RightFactor: 3.5, LeftFactor: 3.5 },
  { Segment: "7", Name: "LAD mid", RightFactor: 2.5, LeftFactor: 2.5 },
  { Segment: "8", Name: "LAD apical", RightFactor: 1, LeftFactor: 1 },
  { Segment: "9", Name: "First diagonal", RightFactor: 1, LeftFactor: 1 },
  { Segment: "9a", Name: "First diagonal", RightFactor: 1, LeftFactor: 1 },
  { Segment: "10", Name: "Second diagonal", RightFactor: 0.5, LeftFactor: 0.5 },
  {
    Segment: "10a",
    Name: "Second diagonal",
    RightFactor: 0.5,
    LeftFactor: 0.5
  },
  {
    Segment: "11",
    Name: "Proximal circumflex artery",
    RightFactor: 1.5,
    LeftFactor: 2.5
  },
  {
    Segment: "12",
    Name: "Intermediate/anterolateral artery",
    RightFactor: 1,
    LeftFactor: 1
  },
  { Segment: "12a", Name: "Obtuse marginal", RightFactor: 1, LeftFactor: 1 },
  { Segment: "12b", Name: "Obtuse marginal", RightFactor: 1, LeftFactor: 1 },
  {
    Segment: "13",
    Name: "Distal circumflex artery",
    RightFactor: 0.5,
    LeftFactor: 1.5
  },
  {
    Segment: "14",
    Name: "Left posterolateral",
    RightFactor: 0.5,
    LeftFactor: 1
  },
  {
    Segment: "14a",
    Name: "Left posterolateral",
    RightFactor: 0.5,
    LeftFactor: 1
  },
  {
    Segment: "14b",
    Name: "Left posterolateral",
    RightFactor: 0.5,
    LeftFactor: 1
  },
  {
    Segment: "15",
    Name: "Left Posterior descending",
    RightFactor: null,
    LeftFactor: 1
  }
];

export default {
  data() {
    return {
      showDetails: true
    };
  },
  components: {
    BasicInfo,
    BasicInput,
    BasicButtons,
    DrInput
  },
  methods: {
    bgUpdate(str, evt) {
      if ("white" === str) {
        document.body.classList.remove("dtc-theme-gray-bg");
        document.body.classList.add("dtc-theme-white-bg");
      } else if ("black" === str) {
        document.body.classList.remove("dtc-theme-white-bg");
        document.body.classList.remove("dtc-theme-gray-bg");
      } else if ("gray" === str) {
        document.body.classList.remove("dtc-theme-white-bg");
        document.body.classList.add("dtc-theme-gray-bg");
      }
    }
  },
  mounted() {},
  watch: {
    showDetails(val) {
      this.$root.$emit("car-report-toggle-detail", val);
    }
  }
};
</script>

<style lang="scss" scoped>
#dtc-cardiac {
  background: black !important;
  font-size: 16px;
  font-weight: 600;
  margin-top: 56px;
  width: 100vw;
  min-height: calc(100vh - 56px);
  padding: 2px;
}

.dtc-theme-white-bg #dtc-cardiac {
  filter: invert(90%);
}

.dtc-theme-gray-bg #dtc-cardiac {
  background: var(--secondary) !important;
}

header {
  background: var(--yellow);
  color: black;
  height: 30px;
  border-radius: 5px;
  line-height: 30px;
  padding-left: 12px;
  display: grid;
  padding-right: 12px;
  grid-template-columns: max-content 1fr max-content;
  position: relative;
  .detail-btn {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

.dtc-csv-grid {
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
  // .dtc-theme-white-bg .input-group-prepend .input-group-text{
  //   background: var(--dark);
  // }
  .input-group-append .input-group-text {
    background: var(--dark);
    color: white;
  }
  .input-group input,
  .input-group select {
    background: var(--gray-dark) !important;
    color: var(--light) !important;
  }
  .long .input-group-prepend .input-group-text {
    min-width: 140px;
    max-width: 140;
    background: var(--dark);
  }
}
</style>

<style lang="scss">
#app #dtc-cardiac {
  input[type="radio"] {
    transform: scale(1.5) !important;
  }
  .input-group-prepend .input-group-text {
    background: rgba(0, 0, 0, 0.7);
    color: hsla(0, 0%, 100%, 0.7);
  }
  .input-group-append .input-group-text {
    background: rgba(34, 29, 29, 0.7);
    color: hsla(0, 0%, 100%, 0.7);
  }
  .input-group input,
  input,
  input,
  textarea,
  select,
  textarea:focus .input-group select {
    background: rgba(0, 0, 0, 0.7) !important;
    color: var(--light) !important;
  }
  input:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px #000 inset;
  }
  input:-webkit-autofill:first-line {
    color: var(--light);
  }

  .vue-tabs .tabs__link {
    color: var(--light);
  }
  .vue-tabs .tabs__link:hover {
    background: var(--primary) !important;
  }
}
#dropdown-100__BV_toggle_ {
  font-size: 12px !important;
  padding: 2px 8px !important;
  margin-left: 12px;
  margin-right: 12px;
  margin-top: 3px;
}
</style>
