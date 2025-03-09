<template>
  <section class="body mt-1">
    <header class="p-grid" style="background:var(--success) !important">
      <div>Patient Indications</div>
      <b-form-radio-group v-model="indication" :options="indications"></b-form-radio-group>
      <b-input style="height:29px;margin-top:2px;" />
      <toggle-button
        ref="toggleView"
        @change="showDetails = !showDetails"
        :value="showDetails"
        class="detail-btn mt-1"
        color="#007bff"
        :font-size="14"
        :height="24"
        :width="120"
        :labels="{ checked: '顯示用藥詳情', unchecked: '顯示用藥詳情' }"
      />
    </header>
    <!-- <b-input-group prepend="Drug" style="padding:3px;">
      <textarea spellcheck="false" style="width:calc(100vw - 90px)" rows="6"></textarea>
    </b-input-group> -->
    <div class="drug-grid">
      <b-input-group prepend="Drug">
        <b-textarea class="detail" style="height:40px;"></b-textarea>
      </b-input-group>
      <b-input-group prepend="Bleeding from other site">
        <b-textarea class="detail" style="height:40px;"></b-textarea>
      </b-input-group>
    </div>

    <div class="my-form">
      <b-input-group prepend="Item">
        <b-input />
      </b-input-group>
      <b-input-group prepend="CHF">
        <b-form-radio-group class="px-3 py-2" v v-model="chf" :options="answers"></b-form-radio-group>
      </b-input-group>
      <b-input-group prepend="HTN">
        <b-form-radio-group class="px-3 py-2" v-model="htn" :options="answers"></b-form-radio-group>
      </b-input-group>
      <b-input-group prepend="DM">
        <b-input />
      </b-input-group>
      <b-input-group prepend="Prior stroke">
        <b-input />
      </b-input-group>
      <b-input-group prepend="CAD" hidden>
        <b-input />
      </b-input-group>
      <b-input-group prepend="Peripheral artery disease">
        <b-input />
      </b-input-group>
      <b-input-group prepend="Carotid artery disease">
        <b-input />
      </b-input-group>
      <b-input-group prepend="ICH">
        <b-input />
      </b-input-group>
      <b-input-group prepend="GI bleeding" hidden>
        <b-input />
      </b-input-group>
      <b-input-group prepend="Bleeding from other site">
        <b-input />
      </b-input-group>
      <b-input-group prepend="Step">
        <b-input />
      </b-input-group>
      <b-input-group prepend="Arrive">
        <b-input />
      </b-input-group>
      <b-input-group prepend="Start anesthesia" hidden>
        <b-input />
      </b-input-group>
      <b-input-group prepend="Femoral puncture">
        <b-input />
      </b-input-group>
      <b-input-group prepend="RV imaging">
        <b-input />
      </b-input-group>
      <b-input-group prepend="Trans-septal">
        <b-input />
      </b-input-group>
      <b-input-group prepend="Appendage imaging" hidden>
        <b-input />
      </b-input-group>
      <b-input-group prepend="De-air start">
        <b-input />
      </b-input-group>
      <b-input-group prepend="De-air finish">
        <b-input />
      </b-input-group>
      <b-input-group prepend="Oclude 1st deployed">
        <b-input />
      </b-input-group>
      <b-input-group prepend="Tug">
        <b-input />
      </b-input-group>

      <b-input-group prepend="Wound closure">
        <b-input />
      </b-input-group>
      <b-input-group prepend="Complete release">
        <b-input />
      </b-input-group>
    </div>
    <header class="step-header-grid">
      <div>Step Information</div>
      <b-button size="sm" variant="warning" style="height:30px;margin-top:1px;" @click="$bvModal.show('LAAOdlg')">
        <font-awesome-icon size="sm" icon="edit" /> Open Procedure
      </b-button>
      <b-form-radio-group v-model="step" :options="steps"></b-form-radio-group>
    </header>
    <div class="step-grid" v-show="step !== 'Pressure'">
      <b-input-group prepend="Arrive">
        <b-input />
      </b-input-group>
      <b-input-group prepend="Start anesthesia">
        <b-input />
      </b-input-group>
      <b-input-group prepend="Femoral puncture">
        <b-input />
      </b-input-group>
      <b-input-group prepend="RV imaging">
        <b-input />
      </b-input-group>
      <b-input-group prepend="Trans-sptal">
        <b-input />
      </b-input-group>
      <b-input-group prepend="Appendage imaging">
        <b-input />
      </b-input-group>
      <b-input-group prepend="Pre-implant LA">
        <b-input />
      </b-input-group>

      <b-input-group prepend="De-air start">
        <b-input />
      </b-input-group>
      <b-input-group prepend="De-air finish">
        <b-input />
      </b-input-group>
      <b-input-group prepend="Occlude 1st deployed">
        <b-input />
      </b-input-group>
      <b-input-group prepend="Tug">
        <b-input />
      </b-input-group>
      <b-input-group prepend="Complete releaes">
        <b-input />
      </b-input-group>
      <b-input-group prepend="Wound closure">
        <b-input />
      </b-input-group>
    </div>
    <div class="step-grid" v-show="step == 'Pressure'">
      <b-input-group prepend="Pre-implant LA">
        <b-input />
      </b-input-group>
      <b-input-group prepend="Pre-implant RA">
        <b-input />
      </b-input-group>
      <b-input-group prepend="Post-implant LA">
        <b-input />
      </b-input-group>
      <b-input-group prepend="Post-implant RA">
        <b-input />
      </b-input-group>
    </div>
    <LAAODLG></LAAODLG>
  </section>
</template>

<script>
import LAAODLG from "@/components/Cardiac/LAAOProcedure.vue";
const indications = ["不能長期服用抗凝血藥", "服用抗凝血藥仍發生中風或全身性栓塞", "其他"];
const answers = ["YES", "NO"];
const steps = ["Timing", "Pressure"];

export default {
  data() {
    return { indications, indication: "", answers, answer: "", showDetails: false, steps, step: "Timing" };
  },
  components: { LAAODLG },
  watch: {
    showDetails(v) {
      if (v) {
        document.querySelector(".drug-grid").classList.add("drug-detail");
        [...document.querySelectorAll(".detail")].forEach(s => s.classList.add("drug-detail"));
      } else {
        document.querySelector(".drug-grid").classList.remove("drug-detail");
        [...document.querySelectorAll(".detail")].forEach(s => s.classList.remove("drug-detail"));
      }
    }
  }
};
</script>
<style>
root {
  --blue: #007bff;
  --indigo: #6610f2;
  --purple: #6f42c1;
  --pink: #e83e8c;
  --red: #dc3545;
  --orange: #fd7e14;
  --yellow: #ffc107;
  --green: #28a745;
  --teal: #20c997;
  --cyan: #17a2b8;
  --white: #fff;
  --gray: #6c757d;
  --gray-dark: #343a40;
  --primary: #007bff;
  --secondary: #6c757d;
  --success: #28a745;
  --info: #17a2b8;
  --warning: #ffc107;
  --danger: #dc3545;
  --light: #f8f9fa;
  --dark: #343a40;
  --breakpoint-xs: 0;
  --breakpoint-sm: 576px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1200px;
  --font-family-sans-serif: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
    "Segoe UI Symbol", "Noto Color Emoji";
  --font-family-monospace: SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
}
</style>

<style lang="scss" scoped>
.body {
  header {
    border-radius: 3px;
    background: var(--info);
    color: var(--light);
    height: 32px;
    line-height: 32px;
    padding-left: 1rem;
    border-radius: 5px;
  }
}

.my-form {
  display: grid;
  padding: 2px;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 2px;
  grid-row-gap: 2px;
  min-height: 300px;
  color: white;
  .input-group-text {
    min-width: 195px;
    max-width: 195px;
  }
  > div {
    height: 24px;
  }
}

.header-grid {
  display: grid;
  grid-template-columns: max-content max-content;
  grid-gap: 1rem;
}
.step-header-grid {
  display: grid;
  grid-template-columns: max-content max-content max-content;
  grid-gap: 1rem;
}
.p-grid {
  display: grid;
  grid-template-columns: max-content max-content 320px max-content;
  grid-gap: 1rem;
}
.drug-grid {
  display: grid;
  padding: 3px;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 2px;
  .input-group-text {
    min-width: 195px;
    max-width: 195px;
  }
}
.drug-detail {
  height: 500px !important;
}
.step-grid {
  display: grid;
  padding-top: 3px;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 3px;
  .input-group-prepend .input-group-text {
    min-width: 178px;
    max-width: 178px;
  }
}
</style>
