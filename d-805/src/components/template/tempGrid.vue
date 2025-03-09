<template>
  <div>
    <h4
      class="text-white"
      v-if="title"
      v-text="title"
    />
    <div
      class="temp-grid"
      :style="{'--gridColumnNumber': columnNumber}"
    >
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      columnNumber: 1
    }
  },
  props: {
    cols: {
      type: Number
    },
    title: {
      type: String,
      default: ''
    }
  },
  created () {
    this.columnNumber = this.cols;
  }
}
</script>

<style>
.temp-grid {
  display: grid;
  grid-gap: 3px;
  grid-row-gap: 3px;
  padding: 0;
  grid-template-columns: repeat(var(--gridColumnNumber), 1fr);
}
</style>
