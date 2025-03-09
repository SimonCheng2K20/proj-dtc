<template>
  <b-modal
    @shown="init"
    id="CRTdlg"
    title="CRT-P/CRT-D Intervention Procedure"
    size="xl"
    :header-bg-variant="variants[3]"
    :header-text-variant="variants[7]"
    :body-bg-variant="headerBgVariant"
    :body-text-variant="headerTextVariant"
    :footer-bg-variant="headerBgVariant"
    :footer-text-variant="headerTextVariant"
  >
    <b-container fluid class="dtc-grid">
      <h4>{{steps[0]}}</h4>
      <h4>{{steps[1]}}</h4>
      <h4>
        Skin Preparation: skin sterilization over
        <input v-model="enter1" class="dtc-input" />
        anterior chest wall (from upperborder of neck and ear to lower border of lowest rib and from axillary region tosternum) with beta iodine solution and followed by alcohol solution.
      </h4>
      <h4>
        Surgical Site:
        <input v-model="enter2" class="dtc-input" /> subclinical region.
      </h4>
      <h4>{{steps[4]}}</h4>
    </b-container>

    <b-container fluid class="dtc-grid pl-5">
      <h4 class="sub-step">
        Cut skin and approach the subcutaneous tissue by surgical knife and straight
        mosquito hemostasis clamp.
      </h4>
      <h4
        class="sub-step"
      >Dissect subcutaneous tissue and left/right subclavian vein is punctured by syringe.</h4>
      <h4 class="sub-step">
        Subclavian vein puncture procedure was done and
        insert the pacing lead through the vessel into the heart, by using sheath introducer.
      </h4>
      <h4 class="sub-step">
        Under flouro put the ventricular lead into the RV apex/RV septum
        , and followed by atrial lead into RA appendage/RA septum.
      </h4>
      <h4
        class="sub-step"
      >Coronary Sinus is engaged by amplaz/ J curve catheter, LV sheath is inserted into it. Inject dye to show the structure of coronary vein, LV lead then place into the posterior/ posterior lateral/ great cardiac Vein.</h4>
      <h4 class="sub-step deep-step">
        Check pacing, sensing, impedance, and 10-voltage stimulation parameters by
        using PSA:
        <h5>A: sense mV, threshold V, impedance ohm;</h5>
        <h5>RV: sense mV, threshold V, impedance ohm</h5>
        <h5>LV: sense mV, threshold V, impedance ohm, vector: ___ to ___</h5>
      </h4>
      <h4 class="sub-step">Fix the pacing leads.</h4>
      <h4
        class="sub-step"
      >Manual subcutaneous dissection with fingers/by electrical surgical unit to make generator pocket.</h4>
      <h4
        class="sub-step"
      >Lock the generator to pacing lead and insert generator into subcutaneous pocket.</h4>
      <h4 class="sub-step">Suture and close the wound by 7" needle holder, forceps, and scissor.</h4>
      <h4 class="sub-step">Operation time: from______ to _______</h4>
    </b-container>

    <template v-slot:modal-footer>
      <div class="float-right mx-3">&nbsp;&nbsp;&nbsp;&nbsp;</div>
      <b-button :disabled="open" @click="add" size="lg" variant="warning" class="float-right">
        <font-awesome-icon icon="edit" />儲存
      </b-button>
      <b-button size="lg" class="float-right" @click="$bvModal.hide('CRTdlg')">
        <font-awesome-icon icon="undo" />取消
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import Vue from "vue";
const steps = [
  "Anesthesia Method: local anesthesia.",
  "Body Position: supine position.",
  `Skin Preparation: skin sterilization over <b-input></b-input>anterior chest wall (from upperborder of neck and ear to lower border of lowest rib and from axillary region tosternum) with beta iodine solution and followed by alcohol solution.`,
  "Surgical Site: <b-input></b-input> subclinical region.",
  "Surgical Procedure:"
];

export default {
  data() {
    return {
      steps,
      enter1: "left/right",
      enter2: "left/right",
      enter3: "left/right",
      enter4: "left/right",
      variants: [
        "primary",
        "secondary",
        "success",
        "warning",
        "danger",
        "info",
        "light",
        "dark"
      ],
      headerBgVariant: "dark",
      headerTextVariant: "light"
    };
  },
  props: [],
  components: {},

  methods: {},
  async mounted() {},
  watch: {}
};
</script>


<style lang="scss" scoped>
.dtc-grid {
  counter-reset: num;
}

h4:before {
  counter-increment: num;
  content: counter(num) ". ";
}

.sub-step:before {
  counter-increment: num;
  content: counter(num, upper-alpha) ". ";
}
.dtc-grid {
  display: grid;
  grid-template-columns: 1fr;
  grid-row-gap: 8px;
}
.required::after {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 12px;
  height: 12px;
  content: "*";
  color: red;
  z-index: 444;
  display: inline-block;
}
.add-item {
  position: relative;
  .plus {
    position: absolute;
    top: 0px;
    left: 0px;
    margin-left: -20px;
    margin-top: 8px;
    cursor: pointer;
  }
}

.dtc-input {
  width: 120px;
  padding-left: 5px;
}
.deep-step {
  > h5 {
    padding-left: 1.3rem;
    font-size: 1.4rem;
  }
  h5:first-child {
    margin-top: 12px;
  }
}
</style>
