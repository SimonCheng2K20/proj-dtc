<template>
  <div class="d-flex flex-wrap" v-if="images.length > 0">
    <div :class="'wsize-' + cols" class="p-1" v-for="img in images" :key="img">
      <div class="img-display" :style="{ backgroundImage: `url(${img})` }"></div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    images: {
      type: Array,
      default: () => [],
    },
    cols: {
      type: Number,
      default: 5,
    },
  },
};
</script>

<style lang="scss" scoped>
$widthLgh: 10%;
@for $i from 1 through 10 {
  .wsize-#{$i} {
    width: #{100% / $i};
  }
}

.img-display {
  padding-top: 100%;
  background: transparent no-repeat center center / cover;
}
</style>
