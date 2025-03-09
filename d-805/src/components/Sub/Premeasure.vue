<template>
  <section class="body mt-1">
    <header class="dtc-header">
      <div>Measurements</div>
      <b-form-group style="margin-left:1rem;margin-top:3px;">
        <b-form-radio-group inline v-model="type">
          <b-form-radio value="blood">血液分析</b-form-radio>
          <b-form-radio value="heat">心電圖</b-form-radio>
          <b-form-radio value="scan">Thallium scan data</b-form-radio>
          <b-form-radio value="treadmill">Treadmill test data</b-form-radio>
        </b-form-radio-group>
      </b-form-group>
    </header>
    <div v-show="type == 'blood'" class="blood d-grid rounded mt-2" style="padding:0.5rem;">
      <div v-for="(item, idx) in items" :key="idx"><span v-text="item.text" />: <span v-text="item.value" /></div>
    </div>
    <div v-show="type == 'heat'" class="dtc-img pt-2">
      <img src="//unsplash.it/1024/400?image=1" />
      <img src="//unsplash.it/1024/400?image=222" />
    </div>
    <div v-show="type == 'scan'" style="padding:0.5rem;">
      <textarea style="width:100%;height:400px;border-radias:3px;" spellcheck="false">mild moderate servere</textarea>
    </div>
    <div v-show="type == 'treadmill'" style="padding:0.5rem;">
      <textarea style="width:100%;height:400px;border-radias:3px;" spellcheck="false">positive negative</textarea>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      type: 'blood',
      items: [
        { text: 'Hb', value: 'value1' },
        { text: 'Hct', value: 'value2' },
        { text: 'PLT', value: 'value3' },
        { text: 'BUN', value: 'value4' },
        { text: 'Cr', value: 'value5' },
        { text: 'PT/aPTT', value: 'value6' },
        { text: 'CHOL', value: 'value7' },
        { text: 'TG', value: 'value8' },
        { text: 'LDL', value: 'value9' },
        { text: 'HDL', value: 'value10' }
      ]
    }
  },
  components: {}
}
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
  --font-family-sans-serif: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
    'Segoe UI Symbol', 'Noto Color Emoji';
  --font-family-monospace: SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
}
</style>

<style lang="scss" scoped>
.body {
  header {
    background: var(--indigo);
    color: var(--light);
    height: 32px;
    line-height: 32px;
    padding-left: 1rem;
  }
  .dtc-doc1-grid-table {
    display: grid;
    grid-template-columns: 320px 320px 1fr;
    grid-gap: 12px;
    > div {
      margin-top: 8px;
      border: 1px solid white;
      min-height: 400px;
      width: auto;
      border-radius: 4px;
    }
  }
}
.dtc-doc1-grid {
  display: grid;
  padding-right: 10px;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 1rem;
  text-align: center;
  .label {
    padding-top: 4px;
  }
}

.my-form {
  display: grid;
  padding: 10px;
  grid-template-columns: repeat(3, 1fr);
  grid-column-gap: 4px;
  .input-group-text {
    min-width: 110px;
    max-width: 110px;
  }
  > div {
    height: 24px;
  }
}

.dtc-header {
  display: flex;
  grid-template-columns: max-content max-content;
}
.dtc-img {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: 2rem;
}
.blood {
  background-color: #fff;
  display: grid;
  grid-gap: 3px;
  grid-row-gap: 12px;
  padding: 3px;
  grid-template-columns: repeat(5, 1fr);
}
</style>
