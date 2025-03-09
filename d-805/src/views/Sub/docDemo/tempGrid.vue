<template>
  <div
    class="temp-grid"
    :style="{'--gridColumnNumber': columnNumber}"
  >
    <slot />
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
