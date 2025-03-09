<template>
  <div class="cvs p-2">
    <header class="dtc-header mb-1">
      <div>心導管: LAAO Report</div>
      <b-button size="sm" variant="primary" style="max-height:30px;margin-top:1px"> <font-awesome-icon size="sm" icon="edit" />儲存變更 </b-button>
    </header>
    <BasicInfo showMoreFields="true" showDevice="true" />
    <LAAO></LAAO>
  </div>
</template>

<script>
import LAAO from '@/components/Cardiac/LAAO.vue'
import BasicInfo from '@/components/Cardiac/BasicInfo.vue'
export default {
  data() {
    return {}
  },

  components: { LAAO, BasicInfo }
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
.cvs {
  background: black !important;
  font-size: 16px;
  font-weight: 600;
  margin-top: 56px;
  width: 100vw;
  min-height: calc(100vh - 56px);
  padding: 2px;
}

header {
  background: var(--yellow);
  color: black;
  height: 30px;
  border-radius: 5px;
  line-height: 30px;
  padding-left: 12px;
}

.d2-grid {
  display: grid;
  grid-gap: 0.4rem;
  grid-row-gap: 12px;
  > div {
    padding: 0;
    margin: 0;
    border: 1px solid #fff;
    border-radius: 5px;
    > div {
      margin-top: 0 !important;
    }
  }
  &.no-border {
    > div {
      border: 0;
    }
  }
  &.r21 {
    grid-template-columns: repeat(1, 2fr) repeat(1, 1fr);
  }
  &.r12 {
    grid-template-columns: repeat(1, 1fr) repeat(1, 2fr);
  }
}

/deep/ .form-group legend {
  color: #fff;
}
.dtc-header {
  display: grid;
  height: 32px;
  grid-template-columns: 190px max-content;
}
</style>
