<template>
  <div>
    <section class="body dtc-grid">
      <b-input-group prepend="Diagnosis">
        <b-input />
      </b-input-group>
      <b-input-group prepend="Procedure">
        <b-input />
      </b-input-group>
      <b-input-group prepend="穿刺部位">
        <b-input />
      </b-input-group>
      <b-input-group prepend="Lidocaine(2%)" append="cc">
        <b-input />
      </b-input-group>
      <b-input-group prepend="麻醉時間">
        <input type="time" style="flex:1;min-width:0px" />
      </b-input-group>
      <b-input-group prepend="Dormicum" append="mg">
        <b-input />
      </b-input-group>
      <b-input-group prepend="Alfentanil" append="mg">
        <b-input />
      </b-input-group>
      <b-input-group class="long" prepend="Contrast medium" append="cc" style="grid-column: 3 / -1">
        <b-form-select v-model="constrast" :options="constrasts" variant="dark"></b-form-select>
        <b-input></b-input>
      </b-input-group>
    </section>
    <Intervention :showOther="true"></Intervention>
  </div>
</template>

<script>
import Intervention from "@/components/Cardiac/Intervention.vue";
export default {
  data() {
    return {};
  },
  components: { Intervention }
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
.dtc-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 13px;
  .input-group-prepend .input-group-text {
    min-width: 140px;
    max-width: 140px;
  }
  margin-bottom: 16px;
}
</style>
