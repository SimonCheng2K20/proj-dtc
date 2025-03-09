<template>
  <div>
    <section class="body dtc-grid">
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

      <b-input-group prepend="Contrast medium" append="CC">
        <b-input />
      </b-input-group>
      <!-- <b-input-group prepend="Other device">
        <b-input />
      </b-input-group>-->
    </section>
    <div class="body neck-dtc-grid left">
      <b-input-group prepend="CCA">
        <b-input />
      </b-input-group>
      <b-input-group prepend="ICA">
        <b-input />
      </b-input-group>
      <b-input-group prepend="ECA">
        <b-input />
      </b-input-group>
      <b-input-group prepend="VA">
        <b-input />
      </b-input-group>
      <b-input-group prepend="subclavian">
        <b-input />
      </b-input-group>
    </div>
    <div class="body neck-dtc-grid right">
      <b-input-group prepend="CCA">
        <b-input />
      </b-input-group>
      <b-input-group prepend="ICA">
        <b-input />
      </b-input-group>
      <b-input-group prepend="ECA">
        <b-input />
      </b-input-group>
      <b-input-group prepend="VA">
        <b-input />
      </b-input-group>
      <b-input-group prepend="subclavian">
        <b-input />
      </b-input-group>
    </div>
    <Intervention :showOther="true" :showDrug="true"></Intervention>
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
.neck-dtc-grid,
.dtc-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 4px;
  margin-bottom: 20px;
  margin-left: 36px;
  position: relative;
}

.dtc-grid {
  margin-left: 0px;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 4px;
  grid-row-gap: 13px;
  margin-bottom: 30px;
  .input-group-prepend .input-group-text {
    min-width: 150px;
    max-width: 150px;
  }
}

.left::before,
.right::before {
  position: absolute;
  content: "Left";
  z-index: 2;
  color: red;
  top: 10px;
  left: 0;
  display: block;
  margin-left: -43px;
  font-size: 15px;
}
.right::before {
  content: "Right";
}
</style>
