<template>
  <q-card ref="cardRef" class="my-dialog-content q-dialog-plugin" :style="{ width: contentWidth }">
    <div class="flex justify-between items-center text-h6 font-bold bg-blue-8 text-white pl-4">
      <div>{{ header }}</div>
      <q-btn round flat icon="close" @click="emit('close')"></q-btn>
    </div>

    <q-linear-progress v-if="loading" color="light-green" class="absolute" indeterminate></q-linear-progress>

    <q-card-section class="scroll h-full" :style="{ 'max-height': maxHeight + 'px', height: contentHeight }">
      <slot></slot>
    </q-card-section>

    <q-card-actions v-if="slots.actions !== undefined" align="right">
      <slot name="actions"></slot>
    </q-card-actions>
  </q-card>
</template>

<script setup>
import { ref, useSlots, computed } from 'vue'

const cardRef = ref()
const slots = useSlots()

const props = defineProps({
  width: [String, Number],
  height: [String, Number],
  header: String,

  loading: Boolean,
})

const emit = defineEmits(['close'])

const contentWidth = computed(() => {
  if (typeof props.width === 'number') return `${props.width}px !important`
  else if (typeof props.width === 'string') {
    if (Number(props.width) >= 0) return `${props.width}px !important`
    else return props.width + ' !important'
  } else return null
})

const contentHeight = computed(() => {
  if (typeof props.height === 'number') return `${props.height}px !important`
  else if (typeof props.height === 'string') {
    if (Number(props.height) >= 0) return `${props.height}px !important`
    else return props.height + ' !important'
  } else return null
})

const maxHeight = ref(Math.floor(document.documentElement.clientHeight - (slots.actions === undefined ? 96 : 154)))
</script>

