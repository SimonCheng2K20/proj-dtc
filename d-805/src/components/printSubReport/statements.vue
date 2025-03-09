<template>
  <div>
    <div
      v-for="(assey, idx) in asseys"
      :key="idx"
    >
      <div
        class="bg-dark text-white title p-2"
        v-text="assey.title"
      />
      <div
        v-html="assey.content"
        class="p-2"
      />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {};
  },
  components: {},
  props: {
    asseys: {
      type: Array,
      default: () => [],
    },
  },
  created () { },
  methods: {},
};
</script>

<style scoped>
.title {
  font-size: 18px;
}
</style>
