<template>
  <div
    class="text-start ml-5 font-bold text-2xl"
    :class="isAlert ? 'alert text-red-500' : 'normal'"
  >
    {{ text }}:{{ formattedVal || 0 }}
  </div>
</template>
<script>
import { computed } from "vue";
export default {
  props: {
    text: String,
    val: {
      type: Number,
      default: 0,
    },
    isAlert: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    var formatter = new Intl.NumberFormat();
    const formattedVal = computed(() => formatter.format(props.val));

    return { formattedVal };
  },
};
</script>
<style lang="scss" scoped>
#app {
  &.light {
    .alert {
    }
  }
  &.dark {
    .normal {
      color: #fff;
    }
  }
}
</style>
