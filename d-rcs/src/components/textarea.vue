<template>
  <div class="text-form">
    <span
      class="px-2 py-1 text-lg font-bold"
      v-if="title"
      :class="hasredStar ? 'pl-0' : ''"
      >{{ title }}
    </span>
    <!--  -->
    <textarea
      class="border w-full block m-0"
      :value="modelValue"
      @keydown="keydownEvent"
      :disabled="disabled"
    ></textarea>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: [String, Number],
    },
    title: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    hasredStar: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update"],
  setup(props, context) {
    function keydownEvent(e) {
      setTimeout(() => {
        context.emit("update:modelValue", e.target.value);
      }, 40);
    }

    return { keydownEvent };
  },
};
</script>

<style lang="scss" scoped>
$borderColor: #abb5be;
.text-form {
  background-color: #f1f9e7;
  border-color: $borderColor;
  overflow: hidden;
  @apply p-0 block border rounded-lg overflow-hidden;
  textarea {
    @apply border-l-0 border-r-0 border-b-0 rounded-t p-2;
    min-height: 120px;
    border-color: $borderColor;
  }
}
</style>
