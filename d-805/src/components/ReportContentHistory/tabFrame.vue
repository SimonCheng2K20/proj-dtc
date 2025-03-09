<template>
  <div>
    <b-tabs
      pills
      v-if="isCstExists"
    >
      <b-tab title="書寫報告">
        <slot name="reportContent" />
      </b-tab>

      <b-tab
        title="癌症報告"
        class="mt-1"
      >
        <slot name="cstContent" />
      </b-tab>

    </b-tabs>

    <slot
      v-else
      name="reportContent"
    />
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  props: {
    cstNames: {
      type: Array,
      default: new Array()
    }
  },
  computed: {
    isCstExists () {
      return this.cstNames.some(v => v);
    }
  }
}
</script>

<style lang="scss"></style>
