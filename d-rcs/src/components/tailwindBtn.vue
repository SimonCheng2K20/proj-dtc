<template>
  <button
    class="font-bold uppercase text-base px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none custom-search"
    type="button"
    :style="`background: ${bgbolor};color:${wordbolor}`"
  >
    {{ wording }}
  </button>
</template>

<script>
export default {
  props: {
    bgbolor: {
      type: [String],
      default: "#166bde",
    },
    wordbolor: {
      type: [String],
      default: "#fff",
    },
    wording: {
      type: [String],
      default: "查詢",
    },
  },

  setup(props, { emit }) {
    return {};
  },
};
</script>

<style lang="scss" scoped></style>
