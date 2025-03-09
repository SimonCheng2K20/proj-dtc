<template>
  <section class="body mt-2">
    <header style="background:var(--orange) !important">
      <div>心臟電生理紀錄</div>

      <b-form-group>
        <b-form-radio-group inline v-model="type">
          <b-form-radio value="EPS">EPS</b-form-radio>
          <b-form-radio value="PVST">PVST</b-form-radio>
          <b-form-radio value="AFL">AFL</b-form-radio>
          <b-form-radio value="AF">AF</b-form-radio>
          <b-form-radio value="AT">AT</b-form-radio>
          <b-form-radio value="VT">VPCS/VT</b-form-radio>
        </b-form-radio-group>
      </b-form-group>
    </header>
    <b-input-group prepend="Pre-catch Diagnosis" class="mt-1">
      <b-input />
    </b-input-group>
    <b-input-group prepend="Post-catch Diagnosis" class="mt-1">
      <b-input />
    </b-input-group>
    <b-input-group prepend="Procedure" class="mt-1">
      <b-textarea style="height:130px" />
    </b-input-group>
    <EPS v-show="type === 'EPS'"></EPS>
    <PVST v-show="type === 'PVST'"></PVST>
    <AFL v-show="type === 'AFL'"></AFL>
    <AF v-show="type === 'AF'"></AF>
    <AT v-show="type === 'AT'"></AT>
    <VPCS v-show="type === 'VT'"></VPCS>
  </section>
</template>

<script>
import EPS from "@/components/Cardiac/EPS.vue";
import PVST from "@/components/Cardiac/PVST.vue";
import AFL from "@/components/Cardiac/AFL.vue";
import AF from "@/components/Cardiac/AF.vue";
import AT from "@/components/Cardiac/AT.vue";
import VPCS from "@/components/Cardiac/VPCS.vue";

export default {
  data() {
    return {
      type: "EPS"
    };
  },
  methods: {
    viewDetail() {}
  },
  components: { EPS, PVST, AFL, AF, AT, VPCS },
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
    background: var(--pink);
    color: var(--light);
    height: 32px;
    line-height: 32px;
    padding-left: 1rem;
    display: grid;
    grid-template-columns: 190px max-content max-content 150px;
    grid-gap: 1rem;
    border-radius: 5px;
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
