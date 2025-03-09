<template>
  <button type="button" class="button" :class="{'buttonDisabled':disabled}" @click="$emit('click')" :disabled="disabled">
    <slot />
  </button>
</template>

<script>
export default {
  props: {
    disabled: {
      type:Boolean,
      default:false
    }
  }
}
</script>