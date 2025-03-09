<template>
  <div class="intr-title" :class="isLeft ? 'left': 'right'">
    <div class="main" v-text="main" />
    <div class="sub mt-1" v-text="sub" />
  </div>
</template>

<script>
export default {
  props: {
    main: {
      type: String,
      required: true
    },
    sub: {
      type: String,
      required: true
    },
    isLeft: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style lang="scss" scoped>
.intr-title {
  display: table;
  &.left {
    border-left: 4px solid #3d63cb;
    padding-left: 3px;
    padding-bottom: 2px;
    margin-left: 0;
  }
  &.right {
    border-right: 4px solid #3d63cb;
    padding-right: 3px;
    padding-bottom: 2px;
    margin-right: 0;
    margin-left: auto;
  }
  .main, .sub {
    font-weight: bold;
    line-height: 1;
  }
  .main {
    color: #3d63cb;
    font-size: 1.3rem;
  }
  .sub {
    color: #000;
    font-size: 0.8rem;
    font-weight: bold;
  }
}
</style>
