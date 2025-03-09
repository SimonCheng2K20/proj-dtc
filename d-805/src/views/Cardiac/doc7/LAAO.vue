<template>
  <main class="mb-2">
    <header>LAAO 病人資訊</header>
    <section class="dtc-laao">
      <div>
        <span>CHF</span>
        <div>
          <toggle-button
            class="mt-2"
            :font-size="16"
            v-model="chf"
            :labels="{checked: '是', unchecked: '否'}"
          />
        </div>
      </div>
      <div>
        <span>HTN</span>
        <div>
          <toggle-button
            class="mt-2"
            :font-size="16"
            v-model="htn"
            :labels="{checked: '是', unchecked: '否'}"
          />
        </div>
      </div>
      <div>
        <span>DM</span>
        <div>
          <toggle-button
            class="mt-2"
            :font-size="16"
            v-model="dm"
            :labels="{checked: '是', unchecked: '否'}"
          />
        </div>
      </div>
      <div>
        <span>CAD</span>
        <div>
          <toggle-button
            class="mt-2"
            :font-size="16"
            v-model="cad"
            :labels="{checked: '是', unchecked: '否'}"
          />
        </div>
      </div>
      <div>
        <span>ICH</span>
        <div>
          <toggle-button
            class="mt-2"
            :font-size="16"
            v-model="ich"
            :labels="{checked: '是', unchecked: '否'}"
          />
        </div>
      </div>
      <div>
        <span>Prior stroke</span>
        <div>
          <toggle-button
            class="mt-2"
            :font-size="16"
            v-model="ps"
            :labels="{checked: '是', unchecked: '否'}"
          />
        </div>
      </div>
      <div class="dtc-d1">
        <span>Peripheral artery disease</span>
        <div>
          <toggle-button
            class="mt-2 float-right mr-4"
            :font-size="16"
            v-model="ps"
            :labels="{checked: '是', unchecked: '否'}"
          />
        </div>
      </div>
      <div class="dtc-d2">
        <span>Carotid artery disease</span>
        <div>
          <toggle-button
            class="mt-2 float-right mr-4"
            :font-size="16"
            v-model="ps"
            :labels="{checked: '是', unchecked: '否'}"
          />
        </div>
      </div>
      <div class="dtc-d3">
        <span>GI bleeding</span>
        <div>
          <toggle-button
            class="mt-2 float-right mr-4"
            :font-size="16"
            v-model="ps"
            :labels="{checked: '是', unchecked: '否'}"
          />
        </div>
      </div>
    </section>
    <b-input-group prepend="Bleeding from other site" class="dtc-expend-cols">
      <b-input></b-input>
    </b-input-group>
    <header>步驟資訊</header>
    <section class="left-right">
      <div class="left">
        <div class="title">
          <label>步驟</label>
          <label style="text-align:center">時間</label>
        </div>
        <div v-for="(item,i) in left" :key="i">
          <label>{{item}}</label>
          <b-input></b-input>
        </div>
      </div>
      <div class="right">
        <div class="title">
          <label>步驟</label>
          <label style="text-align:center">壓力</label>
        </div>
        <div v-for="(item,i) in right" :key="i">
          <label>{{item}}</label>
          <b-input></b-input>
        </div>
      </div>
    </section>
    <header>步驟</header>
    <div class="dtc-txt">
      <b-textarea v-model="steps" :spellcheck="false" readonly></b-textarea>
    </div>
    <div class="ml-2 footer">
      <h6>Complication:</h6>
      <div>
        <b-form-checkbox-group
          style="margin-left:12px;margin-top:5px;"
          v-model="complication"
          :options="complications"
        ></b-form-checkbox-group>
      </div>
    </div>
  </main>
</template>

<script>
const left = [
  "Arrive",
  "Start anesthesia",
  "Femoral puncxture",
  "RV imaging",
  "Trans-septal",
  "Appendage imaging",
  "De-air start",
  "De-air finish",
  "Occlude lst deployed",
  "Tug",
  "Complete release",
  "Woind closure"
];
const right = [
  "Pre-implant LA",
  "Pre-implant RA",
  "Post-implant LA",
  "Post-implant LA"
];
const complications = ["Nil", "Bleeding", "Fever", "Other"];
const steps =
  "The procedure was started from general anesthesis. The right femoral area was locally anesthesized by 2% lidocaine. The right femoral vein was then canullated with a long sheath. Under the guidance of TEE, transseptal procedure was performed smoothly. Using the TEE, the size of the LAA was measured and the LAAO size was chosen accordingly. The long sheath was then shifted to the LAAO compatible long sheath. The 20 mm Amplatzer Amulet Occluder was then inserted into the LAA. Under the guidance of TEE, the LAAO was implanted into the LAA at an appropriate place. The TEE revealed only minimal flow into the LAA. The tug test revealed stable LAAO position. Then we released the LAAO from the control cable. The patient tolerated the whole procedures well.";
export default {
  data() {
    return {
      complication: "",
      complications,
      left,
      right,
      steps,
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
  beforeMount() {
    this.$root.$on("car-report-toggle-detail", val => {
      this.changeViewpointHeight = !val;
    });
  }
};
</script>

<style lang="scss" scoped>
.dtc-laao,
.dtc-input {
  display: grid;
  width: 100%;
  grid-template-columns: repeat(6, 1fr);
  grid-gap: 3px;
  span {
    display: inline-block;
    line-height: 38px;
    border-right: 1px solid white;
    max-height: 38px;
    min-width: 90px;
    max-width: 90px;
  }
  > div {
    border: 1px solid white;
    border-radius: 5px;
    height: 38px;
    display: grid;
    grid-template-columns: 100px 1fr;
    color: var(--light);
    text-align: center;
  }
}

.dtc-d1 {
  grid-column: 1 / span 2;
  span {
    min-width: 240px !important;
  }
}
.dtc-d2 {
  grid-column: 3 / span 2;
  span {
    min-width: 240px !important;
  }
}
.dtc-d3 {
  grid-column: 5 / span 2;
  span {
    min-width: 240px !important;
  }
}
.dtc-d4 {
  grid-column: 1 / -1;
  .dtc-grid {
    display: flex;
    line-height: 38px;
  }
}

.dtc-expend-cols {
  label {
    display: inline-block;
    margin: 6px 1rem 0 1rem;
    color: white;
  }
  .input-group-prepend .input-group-text {
    max-width: 240px;
  }
}
header {
  height: 30px;
  line-height: 30px;
  background: var(--success);
  color: var(--light);
  padding-left: 12px;
  border-radius: 5px;
}

.left-right {
  display: grid;
  padding-right: 3px;
  padding-left: 3px;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 10px;

  .left,
  .right {
    > div {
      display: grid;
      margin-bottom: 5px;
      grid-template-columns: 169px 1fr;
      color: white;
      padding-left: 4px;
    }
    .title {
      padding-top: 5px;
      background: var(--primary);
      color: var(--light);
      border-radius: 5px;
      padding-left: 12px;
    }
  }
}

.input-group-prepend .input-group-text {
  min-width: 100px;
  max-width: 100px;
  background: black;
  color: white;
}
.input-group-append .input-group-text {
  background: black;
  color: white;
}
.input-group input,
.input-group select {
  background: black;
  color: white;
}

input,
.footer,
textarea:focus,
input:focus {
  background: black;
  color: white;
}
.dtc-txt {
  height: 180px;
  margin-bottom: 5px;
  textarea,
  textarea:focus {
    height: 100%;
    background: black;
    color: white;
  }
}
.footer {
  margin-bottom: 30px;
}
</style>