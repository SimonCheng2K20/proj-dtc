<template>
  <div class="template-wrapper">
    <div class="subject">
      <span v-if="data.WorkDate > 0" style='color: #333;'>{{data.WorkDate}}</span>
      {{data.EmployeeName}}
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      data: {}
    };
  }
};
</script>
