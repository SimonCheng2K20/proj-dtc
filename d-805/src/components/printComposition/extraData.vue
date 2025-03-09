<template>
  <div>
    <h2 class="p-2 m-0">Clinical Summary:</h2>
    <div class="p-1 text-left" v-html="summy" />
    <h2 class="p-2 m-0">Imaging Findings:</h2>
    <div class="p-1 text-left" v-html="reportContent" />
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    summyStr: {
      type: String,
      default: "",
    },
    reportContentStr: {
      type: String,
      default: "",
    },
  },
  methods: {
    replaceSlashN2Keep(str) {
      return str.replace(/\n/g, "<br class='keep' />");
    },
  },
  computed: {
    summy() {
      return this.replaceSlashN2Keep(this.summyStr);
    },
    reportContent() {
      return this.replaceSlashN2Keep(this.reportContentStr.replace(/<\S/g, ([one, two]) => `${one} ${two}` ));
    },
  },
};
</script>
