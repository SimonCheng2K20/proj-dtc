<template>
  <teleport v-if="isLayoutMouted" to="#left-aside">
    <slot> </slot>
  </teleport>
</template>

<script setup>
import { inject } from 'vue'
const props = defineProps({
  width: {
    type: [String, Number],
    default: 400,
  },
  border: {
    type: [Boolean, String],
    default: true,
  },
})

const isLayoutMouted = inject('isLayoutMouted')
const leftDrawerWidth = inject('leftDrawerWidth')
const leftDrawerBorder = inject('leftDrawerBorder')

const init = () => {
  leftDrawerWidth.value = Number(props.width)
  leftDrawerBorder.value = Boolean(props.border)
}
init()
</script>

