<template>
  <section class="body mt-2">
    <header>Intervention Result</header>
    <div class="my-form">
      <b-input-group prepend="Site">
        <b-input />
      </b-input-group>
      <b-input-group prepend="Pre-intervention Stenosis">
        <b-form-select v-model="preData" :options="nums"></b-form-select>
      </b-input-group>
      <b-input-group prepend="Post-intervention Stenosis">
        <b-form-select v-model="postData" :options="nums"></b-form-select>
      </b-input-group>
      <b-input-group prepend="Guiding">
        <b-input />
      </b-input-group>
      <b-input-group prepend="Wire">
        <b-input />
      </b-input-group>
      <b-input-group prepend="Balloon">
        <b-input />
      </b-input-group>
      <b-input-group prepend="Ballon Bar">
        <b-input />
      </b-input-group>
      <b-input-group prepend="Stent">
        <b-input />
      </b-input-group>
      <b-input-group prepend="Success">
        <b-input />
      </b-input-group>
      <b-input-group prepend="Lesion">
        <b-input />
      </b-input-group>
      <b-input-group v-if="showOther" prepend="Other Device">
        <b-input />
      </b-input-group>
      <b-input-group v-if="showDrug" prepend="Drug">
        <b-input />
      </b-input-group>
    </div>
  </section>
</template>

<script>
const nums = ["<50%", "55%-100%"];
let preData, postData;
export default {
  data() {
    return { nums, preData, postData };
  },
  props: ["showOther", "showDrug"],
  components: {}
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
  padding: 10px;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 4px;
  height: 150px;
  .input-group-text {
    min-width: 210px;
    max-width: 210px;
  }
  > div {
    height: 24px;
  }
}
</style>
