<template>
  <b-modal
    @shown="init"
    id="MICRAdlg"
    title="MICRA PPM Intervention Procedure"
    size="xl"
    :header-bg-variant="variants[3]"
    :header-text-variant="variants[7]"
    :body-bg-variant="headerBgVariant"
    :body-text-variant="headerTextVariant"
    :footer-bg-variant="headerBgVariant"
    :footer-text-variant="headerTextVariant"
  >
    <b-container fluid class="dtc-grid">
      <h4>The operative field was prepared, cleansed, and draped in the sterile fashion.</h4>
      <h4>After local anesthesia, the skin was incised, and the subcutaneous tissues were dissected.</h4>
      <h4>The (right / left) femoral vein was punctured and the pacing wire was inserted, advanced, and guided through the subclavian vein. The introducer was inserted into the femoral vein after multiple dilation and the tip was positioned in the right mid-atrium.</h4>
      <h4>The delivery catheter was introduced through the introducer and curved into RV. The target position was confirmed by fluoroscopic examination. The device was fixated at RV appendage / septum with ____ deployment(s) and ____ tines engaged.</h4>
      <h4 class="need-sub">
        Studies and maneuvers were undertaken to test adequate electrical properties.
        <h5 style="padding-left:1.5rem;">V: sense mV, threshold V, impedance ohm</h5>
      </h4>
      <h4>The tether was removed while flushing the system. After checking the electrical performance, the catheter was removed from the femoral access.</h4>
      <h4>The femoral wound was closed by figure-of-8 suture and the introducer was removed.</h4>
      <h4>The pacing system was review fluoroscopically.</h4>
    </b-container>

    <template v-slot:modal-footer>
      <div class="float-right mx-3">&nbsp;&nbsp;&nbsp;&nbsp;</div>
      <b-button :disabled="open" @click="add" size="lg" variant="warning" class="float-right">
        <font-awesome-icon icon="edit" />儲存
      </b-button>
      <b-button size="lg" class="float-right" @click="$bvModal.hide('MICRAdlg')">
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
