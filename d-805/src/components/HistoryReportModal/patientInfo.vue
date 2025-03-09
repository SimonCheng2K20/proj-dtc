<template>
  <main class="dtc-info">
    <b-input-group prepend="撰寫人員:">
      <b-input v-model="item.DxreportPhysicianName" readonly placeholder="暫無記錄" />
    </b-input-group>
    <b-input-group prepend="正式報告醫師">
      <b-input v-model="item.IssuePhysicianName" placeholder="暫無記錄" readonly />
    </b-input-group>
    <b-input-group prepend="報告版次">
      <b-input v-model="item.DxrVersion" placeholder="暫無記錄" readonly />
    </b-input-group>
    <b-input-group prepend="審核人員">
      <b-input v-model="item.ApprovalPhysicianName" placeholder="暫無記錄" readonly />
    </b-input-group>
  </main>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    item: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.dtc-info {
  display: grid;
  padding: 2px;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 2px;
  align-self: start;
  > div {
    max-height: 38px;
  }
}
</style>
