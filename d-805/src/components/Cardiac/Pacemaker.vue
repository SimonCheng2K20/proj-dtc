<template>
  <section class="body mt-2">
    <header>
      <div>Permanent Pacemaker</div>
      <b-btn variant="warning" class="px-3" size="sm" style="max-height:30px;margin-top:1px" @click="$bvModal.show(`${type}dlg`)">
        <font-awesome-icon style="display:inline-block;margin-right:5px;" icon="edit" />Open Procedure
      </b-btn>
      <b-form-group>
        <b-form-radio-group inline v-model="type">
          <b-form-radio value="PPM">PPM</b-form-radio>
          <b-form-radio value="CRT">CRT-P/CRT-D</b-form-radio>
          <b-form-radio value="ICD">ICD</b-form-radio>
          <b-form-radio value="MICRA">MICRA PPM</b-form-radio>
        </b-form-radio-group>
      </b-form-group>
    </header>
    <PPM v-show="type === 'PPM'"></PPM>
    <CRT v-show="type === 'CRT'"></CRT>
    <ICD v-show="type === 'ICD'"></ICD>
    <MICRA v-show="type === 'MICRA'"></MICRA>
    <PPMDLG></PPMDLG>
    <CRTDLG></CRTDLG>
    <ICDDLG></ICDDLG>
    <MICRADLG></MICRADLG>
  </section>
</template>

<script>
import PPM from "@/components/Cardiac/PPM.vue";
import CRT from "@/components/Cardiac/CRT.vue";
import ICD from "@/components/Cardiac/ICD.vue";
import MICRA from "@/components/Cardiac/MICRA.vue";
import PPMDLG from "@/components/Cardiac/PPMProcedure.vue";
import CRTDLG from "@/components/Cardiac/CRTProcedure.vue";
import ICDDLG from "@/components/Cardiac/ICDProcedure.vue";
import MICRADLG from "@/components/Cardiac/MICRAProcedure.vue";

export default {
  data() {
    return {
      type: "PPM"
    };
  },
  methods: {
    viewDetail() {}
  },
  components: { PPM, PPMDLG, CRT, CRTDLG, ICD, ICDDLG, MICRA, MICRADLG },
  watch: {
    type(val) {}
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
    background: var(--orange);
    color: var(--light);
    height: 32px;
    line-height: 32px;
    padding-left: 1rem;
    display: grid;
    grid-template-columns: 190px max-content max-content 150px;
    grid-gap: 1rem;
    border-radius: 3px;
  }
}

.my-form {
  display: grid;
  padding: 10px;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 4px;
  height: 200px;
  .input-group-text {
    min-width: 210px;
    max-width: 210px;
  }
  > div {
    height: 24px;
  }
}
</style>
