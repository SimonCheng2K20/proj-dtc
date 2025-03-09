<template>
  <div class="catch">
    <section>
      <div>Pre-Catch Diagnosis</div>
      <textarea spellcheck="false"></textarea>
    </section>
    <section>
      <div>Post-Catch Diagnosis</div>
      <textarea spellcheck="false"></textarea>
    </section>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
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
  --font-family-sans-serif: -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  --font-family-monospace: SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
}
</style>

<style lang="scss" scoped>
.catch {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 6px;
  section {
    display: flex;
    border-radius: 5px;
    padding-left: 3px;
    font-size: 16px;
    flex-direction: column;
    > div:first-child {
      height: 24px;
      padding-left: 0.3rem;
      background: var(--primary);
    }
    textarea {
      flex: 1;
      min-height: 200px;
    }
  }
}
</style>
