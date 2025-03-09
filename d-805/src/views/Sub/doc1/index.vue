<template>
  <div class="cvs">
    <header class="dtc-header">
      <div>內視鏡膽管胰管檢查</div>
      <b-button size="sm" variant="primary" style="max-height:30px;margin-top:1px">
        <font-awesome-icon size="sm" icon="print" />列印預覽
      </b-button>
      <b-button size="sm" variant="primary" style="max-height:30px;margin-top:1px">
        <font-awesome-icon size="sm" icon="eye" />診斷代碼
      </b-button>
      <b-button size="sm" variant="primary" style="max-height:30px;margin-top:1px">
        <font-awesome-icon size="sm" icon="plus" />認證
      </b-button>
    </header>
    <BasicInfo />
    <section>
      <header class="dtc-header bg-success text-light">
        <div>Pre-medication</div>
      </header>
      <b-textarea style="height:150px;width:100vw;"></b-textarea>
      <header class="dtc-header bg-success text-light">
        <div>Endoscopic Findings</div>
      </header>
      <b-textarea style="height:180px;width:100vw;"></b-textarea>
      <header class="dtc-header bg-success text-light">
        <div>Impression</div>
      </header>
      <b-textarea style="height:150px;width:100vw;"></b-textarea>
    </section>
    <section class="other-grid">
      <b-input-group prepend="Complication">
        <b-select />
      </b-input-group>
      <b-input-group prepend="Advice" class>
        <b-select />
      </b-input-group>
      <b-input-group prepend="Technician">
        <b-select />
      </b-input-group>
      <b-input-group prepend="Reported By">
        <b-select />
      </b-input-group>
      <b-input-group>
        <b-select />
      </b-input-group>
    </section>
  </div>
</template>

<script>
import BasicInfo from "@/components/Sub/BasicInfo.vue";

//Intervention
//Hemodynamic
export default {
  data() {
    return { type: "Basic" };
  },
  components: { BasicInfo }
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
  --font-family-sans-serif: -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  --font-family-monospace: SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
}
</style>

<style lang="scss" scoped>
.cvs {
  background: black !important;
  font-size: 16px;
  font-weight: 600;
  margin-top: 56px;
  width: 100vw;
  min-height: calc(100vh - 56px);
  padding: 2px;
  color: var(--light);
}

header {
  background: var(--yellow);
  color: black;
  height: 30px;
  border-radius: 5px;
  line-height: 30px;
  padding-left: 12px;
}
.body {
  header {
    background: var(--teal);
    color: var(--light);
  }
  .dtc-grid-table {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 12px;
    > div {
      margin-top: 8px;
      border: 1px solid white;
      min-height: 400px;
      width: auto;
    }
  }
}
.dtc-header {
  display: grid;
  height: 32px;
  grid-template-columns: 220px repeat(4, max-content);
  grid-gap: 12px;
}

.other-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 3px;
  margin-top: 12px;
}
</style>
