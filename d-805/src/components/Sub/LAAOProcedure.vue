<template>
  <b-modal
    @shown="init"
    id="LAAOdlg"
    title="LAAO Procedure"
    size="xl"
    :header-bg-variant="variants[3]"
    :header-text-variant="variants[7]"
    :body-bg-variant="headerBgVariant"
    :body-text-variant="headerTextVariant"
    :footer-bg-variant="headerBgVariant"
    :footer-text-variant="headerTextVariant"
  >
    <b-container fluid class="dtc-grid">
      <textarea spellcheck="false">
The procedure was started from general anesthesis. The right femoral area was locally anesthesized by 2% lidocaine. The right femoral vein was then canullated with a long sheath. Under the guidance of TEE, transseptal procedure was performed smoothly. Using the TEE, the size of the LAA was measured and the LAAO size was chosen accordingly. The long sheath was then shifted to the LAAO compatible long sheath. The 20 mm Amplatzer Amulet Occluder was then inserted into the LAA. Under the guidance of TEE, the LAAO was implanted into the LAA at an appropriate place. The TEE revealed only minimal flow into the LAA. The tug test revealed stable LAAO position. Then we released the LAAO from the control cable. The patient tolerated the whole procedures well.  </textarea>
      <h6>Complication</h6>
      <div class="check-grid">
        <b-form-checkbox-group
          style="margin-left:12px;margin-top:5px;"
          v-model="complication"
          :options="complications"
        ></b-form-checkbox-group>
        <b-input></b-input>
      </div>
    </b-container>

    <template v-slot:modal-footer>
      <div class="float-right mx-3">&nbsp;&nbsp;&nbsp;&nbsp;</div>
      <b-button :disabled="open" @click="add" size="lg" variant="warning" class="float-right">
        <font-awesome-icon icon="edit" />儲存
      </b-button>
      <b-button size="lg" class="float-right" @click="$bvModal.hide('LAAOdlg')">
        <font-awesome-icon icon="undo" />取消
      </b-button>
    </template>
  </b-modal>
</template>

<script>
import Vue from "vue";

const complications = ["Nil", "Bleeding", "Fever", "Other"];
export default {
  data() {
    return {
      complications,
      complication: "",
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
  display: flex;
  flex-direction: column;
  textarea {
    margin-bottom: 1rem;
    min-height: 400px;
  }
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

.check-grid {
  display: grid;
  grid-template-columns: 380px 420px;
  grid-gap: 2px;
}
</style>
