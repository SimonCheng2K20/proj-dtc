<template>
  <div class="flex items-center justify-start flex-wrap">
    <div class="mr-1" v-for="option in options" :key="option.value">
      <Button :class="'p-button-' + (isActive(option.value) ? 'primary': 'secondary')" @click.stop="clickEvent(option.value)">{{ option.text }}</Button>
    </div>
  </div>
</template>

<script>
// import { computed, watch } from 'vue'
export default {
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    options: {
      type: Array,
      default: () => []
    }
  },
  setup (props, { emit }) {
    function clickEvent(value) {
      const _newValues = props.modelValue.includes(value)
        ? props.modelValue.filter(v => v !== value)
        : props.modelValue.concat(value)
      emit('changeEvent')
      emit('update:modelValue', _newValues)
    }
    function isActive (value) {
      return props.modelValue.includes(value)
    }
    return { clickEvent, isActive }
  }
}
</script>

<style lang="scss" scoped>
.selection {
  @apply w-full;
}

</style>
