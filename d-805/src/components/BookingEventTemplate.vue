<template>
  <div class="template-wrapper">
    <div class="subject">
      <span v-if="!data.IsBlock && data.Type == 0 ">已佔用</span>
      <span v-else>{{data.CheckItemName}}</span>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      data: {}
    };
  },
  mounted() {
    console.log("booking event" + this.data);
  }
};
</script>
