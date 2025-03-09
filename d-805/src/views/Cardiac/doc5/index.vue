<template>
  <div class="cvs">
    <header class="dtc-header">
      <div>心導管: 周邊血管檢查治療報告</div>
      <b-button size="sm" variant="primary" style="max-height:30px;margin-top:1px"> <font-awesome-icon size="sm" icon="edit" />儲存變更 </b-button>
    </header>
    <BasicInfo />

    <vue-tabs active-tab-color="#e74c3c" active-text-color="white" style="margin-top:1rem;border:1px solid white;border-radius:5px;">
      <v-tab
        v-for="(item, i) in ['洗腎廔管', '上下肢血管', '頸動脈']"
        class="title_center"
        :key="item"
        :title="item"
        style="padding:10px;position:relative;color:white"
        @click="cstTabName = item"
      >
        <div slot="title">{{ item }}</div>
        <Sterntube v-show="i == 0"></Sterntube>
        <Vein v-show="i == 1"></Vein>
        <Neck v-show="i == 2"></Neck>
      </v-tab>
    </vue-tabs>
  </div>
</template>

<script>
import BasicInfo from "@/components/Cardiac/BasicInfo.vue";
//import TulpInfo from "@/components/Cardiac/tulpInfo.vue";
import Vein from "@/components/Cardiac/Vein.vue";
import Neck from "@/components/Cardiac/Neck.vue";
import Sterntube from "@/components/Cardiac/Sterntube.vue";
//Intervention
//Hemodynamic
export default {
  data() {
    return {};
  },
  components: { BasicInfo, Sterntube, Neck, Vein }
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
  grid-template-columns: 240px max-content;
}
</style>
