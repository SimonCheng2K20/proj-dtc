<template>
  <div>
    <img :src="bodyPng" />
    <section class="body dtc-grid" hidden>
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
      <b-input-group class="long" prepend="Contrast medium" append="cc" style="grid-column: 2 / -1">
        <b-form-select v-model="constrast" :options="constrasts" variant="dark"></b-form-select>
        <b-input></b-input>
      </b-input-group>
    </section>
    <header class="dtc-neck-header">
      <div>Procedure</div>
    </header>
    <b-textarea :spellcheck="false" class="big-input" placeholder="please enter here...."></b-textarea>
    <b-input-group prepend="Contrast medium" append="cc" style="max-width:450px;margin:5px 0">
      <b-form-select v-model="constrast" :options="constrasts" variant="dark"></b-form-select>
      <b-input></b-input>
    </b-input-group>
    <header class="dtc-neck-header">
      <div>Diagnosis Cathether</div>
    </header>
    <b-textarea :spellcheck="false" class="big-input" placeholder="please enter here...."></b-textarea>
    <header class="diagnosis">
      Diagnosis
    </header>
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
    <Intervention :showList="true"></Intervention>
  </div>
</template>

<script>
import Intervention from "@/components/Cardiac/Intervention.vue";
const rights = ["JR4", "JR5"];
const lefts = ["JL3", "JL3.5", "JL4", "JL4.5", "JL5", "JL6"];
const constrasts = ["Ominpaque", "Ultravist", "Visipaque"];
export default {
  data() {
    return { bodyPng: require("./bossWords.png"), rights, lefts, constrasts };
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
  margin-bottom: 4px;
  margin-left: 36px;
  position: relative;
}

.dtc-grid {
  margin-left: 0px;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 4px;
  grid-row-gap: 13px;
  margin-bottom: 4px;
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
.diagnosis {
  background: var(--success);
  height: 30px;
  line-height: 30px;
  font-size: 1rem;
  padding-left: 4px;
  border-radius: 5px;
  color: white;
  margin-bottom: 5px;
}
.dtc-neck-header {
  height: 30px !important;
  display: grid;
  margin: 3px 0px;
  padding-top: 1px;
  padding-left: 4px;
  background: var(--purple) !important;
  grid-template-columns: max-content 400px 400px;
  grid-gap: 30px;
  line-height: 30px;
  border-radius: 5px;
}
.big-input {
  width: 100%;
  height: 200px;
  margin-bottom: 3px;
}
</style>
