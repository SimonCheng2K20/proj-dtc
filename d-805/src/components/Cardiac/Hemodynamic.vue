<template>
  <section class="body mt-1">
    <div class="dtc-binfo-grid">
      <b-input-group class="long" prepend="Pre-cath Diagnosis" style="grid-column: 1 / -1">
        <b-input></b-input>
      </b-input-group>
      <b-input-group class="long" prepend="Post-cath Diagnosis" style="grid-column: 1 / -1">
        <b-input></b-input>
      </b-input-group>
      <b-input-group prepend="Fluoro Time" append="min" v-if="!showDevice">
        <b-input />
      </b-input-group>
      <b-input-group prepend="VESSOL Type" v-if="!showDevice">
        <b-form-select v-model="vessol" :options="vessols"></b-form-select>
      </b-input-group>
      <b-input-group class="long" prepend="Contrast medium" append="cc" style="grid-column: 3 / span 2">
        <b-form-select v-model="constrast" :options="constrasts" variant="dark"></b-form-select>
        <b-input></b-input>
      </b-input-group>
    </div>
    <header class="dtc-header-boss-added">
      <div>Diagnosis Cathether</div>
      <!-- <b-input-group prepend="Right CAG" v-if="!showDevice">
        <b-form-select v-model="right" :options="rights"></b-form-select>
      </b-input-group>
      <b-input-group prepend="Left CAG" v-if="!showDevice">
        <b-form-select v-model="left" :options="lefts"></b-form-select>
      </b-input-group> -->
    </header>
    <b-textarea :spellcheck="false" class="big-input" placeholder="please enter here...."></b-textarea>
    <header class="dtc-header">
      <div>Procedure</div>
      <b-input class="" style="max-height:30px;"></b-input>
      <b-form-group style="margin-left:1rem;margin-top:-3px;">
        <b-form-radio-group inline v-model="type" style="margin-top:5px">
          <b-form-radio value="hem">Hemodynamic</b-form-radio>
          <b-form-radio value="pic">Intervention Result</b-form-radio>
          <b-form-radio value="word">Comment</b-form-radio>
        </b-form-radio-group>
      </b-form-group>
    </header>
    <div v-show="type == 'word'" style="padding:0.5rem;">
      <textarea placeholder="please enter here..." style="width:100%;height:400px;border-radias:3px;" spellcheck="false"></textarea>
    </div>
    <div v-show="type == 'drug'" style="padding:0.5rem;">
      <textarea style="width:100%;height:400px;border-radias:3px;" spellcheck="false"></textarea>
    </div>
    <div v-show="type == 'pic'" class="mt-2 mb-2 dtc-heart-grid">
      <DtcHeartImg width="600" height="483" :url="img" :points="heartPath" @dtc-img-click="handleImgClick" />
      <!-- <nav class="dtc-toolbar-js" hidden>
        <DtcHeartImg width="600" height="483" :url="img" :points="heartPath" @dtc-img-click="handleImgClick" />
        <section class="d-inline-flex dtc-tools" hidden>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </section>
      </nav> -->
      <main style="padding:5px;">
        <Intervention></Intervention>
      </main>
    </div>
    <div class="dtc-doc1-grid-table" v-show="type == 'hem'">
      <div class="dtc-doc1-grid pt-2" id="dtc-hy">
        <div>Site</div>
        <div>Pressure</div>
        <div>O2 Sat%</div>
        <div>PCWP</div>
        <b-input></b-input>
        <b-input></b-input>
        <div class="label">MPA</div>
        <b-input></b-input>
        <b-input></b-input>
        <div class="label">RV</div>
        <b-input></b-input>
        <b-input></b-input>
        <div class="label">RA</div>
        <b-input></b-input>
        <b-input></b-input>
        <div class="label">SVC</div>
        <b-input></b-input>
        <b-input></b-input>
      </div>
      <div class="dtc-doc1-grid pt-2" id="dtc-hy2">
        <div>Site</div>
        <div>Pressure</div>
        <div>O2 Sat%</div>
        <div class="label">LV</div>
        <b-input></b-input>
        <b-input></b-input>
        <div class="label">AO</div>
        <b-input></b-input>
        <b-input></b-input>
        <div class="label">FA</div>
        <b-input></b-input>
        <b-input></b-input>
        <div class="label">IVC</div>
        <b-input></b-input>
        <b-input></b-input>
      </div>
      <div class="my-form">
        <b-input-group prepend="C.O.">
          <b-input />
        </b-input-group>
        <b-input-group prepend="MVA">
          <b-input />
        </b-input-group>
        <b-input-group prepend="QP/QS">
          <b-input />
        </b-input-group>
        <b-input-group prepend="LVEF(%)">
          <b-input />
        </b-input-group>
        <b-input-group prepend="MS">
          <b-form-select v-mode="ms" :options="range"></b-form-select>
        </b-input-group>
        <b-input-group prepend="MR">
          <b-form-select v-mode="mr" :options="range"></b-form-select>
        </b-input-group>
        <b-input-group prepend="AS">
          <b-form-select v-mode="as" :options="range"></b-form-select>
        </b-input-group>
        <b-input-group prepend="AR">
          <b-form-select v-mode="ar" :options="range"></b-form-select>
        </b-input-group>
        <b-input-group prepend="CAG">
          <b-form-select v-mode="cga" :options="nums"></b-form-select>
        </b-input-group>
        <b-input-group prepend="LM">
          <b-form-select v-mode="lm" :options="nums"></b-form-select>
        </b-input-group>
        <b-input-group prepend="LAD">
          <b-form-select v-mode="lad" :options="nums"></b-form-select>
        </b-input-group>
        <b-input-group prepend="LCX">
          <b-form-select v-mode="lcx" :options="nums"></b-form-select>
        </b-input-group>
        <b-input-group prepend="RCA">
          <b-form-select v-mode="rca" :options="nums"></b-form-select>
        </b-input-group>
        <b-input-group prepend="Other">
          <b-form-select v-mode="other" :options="nums"></b-form-select>
        </b-input-group>
        <b-input-group prepend="ER Time">
          <input type="time" v-model="erTime" style="flex:1;min-width:0px" />
        </b-input-group>
        <b-input-group prepend="Arrive At">
          <input type="time" v-model="atTime" style="flex:1;min-width:0px" />
        </b-input-group>
        <b-input-group prepend="Start At">
          <input type="time" v-model="startTime" style="flex:1;min-width:0px" />
        </b-input-group>
        <b-input-group prepend="Wire At">
          <input type="time" v-model="wireTime" style="flex:1;min-width:0px" />
        </b-input-group>
        <b-input-group prepend="End Time">
          <input type="time" v-model="endTime" style="flex:1;min-width:0px" />
        </b-input-group>
        <b-input-group prepend="Syntax Score">
          <b-input />
        </b-input-group>
      </div>
    </div>
  </section>
</template>

<script>
import moment from "moment";
import Intervention from "@/components/Cardiac/Intervention.vue";
import DtcHeartImg from "./DtcImgClick";
const nums = ["<50%", "55%-100%"];
const range = [1, 2, 3, 4];
let cag, lm, lda, lcx, rca, other, ms, mr, as, ar;
const defaultTime = moment()
  .add(1, "days")
  .toISOString()
  .split(".")[0];
const vessols = ["insignificant", "SVD", "DVD", "TVD", "LM+SVD", "LM+DVD", "LM+TVD"];
const constrasts = ["Ominpaque", "Ultravist", "Visipaque"];
const rights = ["JR4", "JR5"];
const lefts = ["JL3", "JL3.5", "JL4", "JL4.5", "JL5", "JL6"];
export default {
  data() {
    return {
      img: require("./CardiacSurgerySyntax_2295x1847.jpg"),
      type: "hem",
      nums,
      cag,
      lm,
      lda,
      lcx,
      rca,
      other,
      range,
      ms,
      mr,
      as,
      ar,
      defaultTime,
      erTime: defaultTime,
      atTime: defaultTime,
      startTime: defaultTime,
      wireTime: defaultTime,
      endTime: defaultTime,
      heartPath: window.dtcHeartPath,
      segmentalWeightingFactors: window.segmentalWeightingFactors,
      vessols,
      constrasts,
      rights,
      lefts
    };
  },

  methods: {
    handleImgClick(msg) {
      this.$root.$emit("dtc-click-heart-img", msg);
    }
  },
  components: { DtcHeartImg, Intervention }
};
</script>

<style lang="scss" scoped>
.big-input {
  width: 100%;
  height: 200px;
  margin-bottom: 3px;
}
.body {
  header {
    background: var(--success);
    color: var(--light);
    height: 32px;
    line-height: 32px;
    padding-left: 1rem;
    border-radius: 5px;
  }
  .dtc-doc1-grid-table {
    display: grid;
    grid-template-columns: 320px 320px 1fr;
    grid-gap: 12px;
    > div {
      margin-top: 8px;
      border: 1px solid white;
      min-height: 400px;
      width: auto;
      border-radius: 4px;
    }
  }
}
.dtc-doc1-grid {
  display: grid;
  padding-right: 10px;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1rem;
  text-align: center;
  .label {
    padding-top: 4px;
  }
}

.my-form {
  display: grid;
  padding: 10px;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 4px;
  .input-group-text {
    min-width: 110px;
    max-width: 110px;
  }
  > div {
    height: 24px;
  }
}

.dtc-header {
  display: grid;
  grid-template-columns: max-content 300px max-content;
  grid-gap: 12px;
}
.dtc-img {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 2rem;
}
#dtc-hy2,
#dtc-hy {
  color: hsla(0, 0%, 100%, 0.7);
}
.dtc-heart-grid {
  display: grid;
  grid-template-columns: 600px 1fr;
  grid-gap: 3px;
  padding-left: 3px;
  overflow-x: auto;
  min-height: 483px;
  main {
    border: 1px solid white;
    border-radius: 5px;
    overflow-x: auto;
    min-height: 483px;
  }
}
.dtc-toolbar-js {
  display: flex;
  flex-direction: column;
}
.dtc-tools {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  width: 100%;
  height: 30px;
  > div {
    width: 60px;
    border: 1px solid white;
    height: 30px;
  }
}

.dtc-binfo-grid {
  padding: 3px;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 3px !important;
  margin-bottom: 5px;
}
.dtc-header-boss-added {
  height: 30px !important;
  display: grid;
  margin: 3px 0px;
  padding-top: 1px;
  background: var(--purple) !important;
  grid-template-columns: max-content 400px 400px;
  grid-gap: 30px;
}
.input-group-prepend .input-group-text {
  min-height: 38px;
  max-height: 38px;
}

.long .input-group-prepend .input-group-text {
  min-width: 168px;
  max-width: 168px;
}
</style>
