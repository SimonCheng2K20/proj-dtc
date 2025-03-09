<template>
  <div>
    <div class="mb-2" style="margin-top:1rem;">
      診斷報告內文
      <b-button v-if="item.ReportContent" @click="copyPasteText(item.ReportContent)" variant="info">
        <font-awesome-icon icon="copy" class="mr-1" />複製診斷報告內文
      </b-button>
    </div>
    <div v-if="copyOk" style="color:red;">資料已複製並貼上</div>
    <div v-if="!item.ReportContent" class="mb-5">暫無記錄</div>
    <b-textarea v-if="item.ReportContent" v-model="item.ReportContent" class="mb-5 copying-area"></b-textarea>
  </div>
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
  methods: {
    copyPasteText(text) {},
  },
};
</script>

<style lang="scss" scoped>
.copying-area {
  width: 50vw;
  min-height: 30vw;
}
</style>
