<template>
  <div class="no-wrap bg-grey-3 flex items-start gap-2 rounded p-4">
    <my-input-group ref="searchWrapper" class="grid gap-2" :style="searchWrapperStyle">
      <slot></slot>
    </my-input-group>

    <div class="flex shrink-0 gap-2">
      <q-btn unelevated color="search" icon="search" label="進行查詢" @click="emit('searchSubmit')"></q-btn>
      <q-btn unelevated color="clear" icon="refresh" label="清除查詢" @click="emit('searchClear')"></q-btn>
      <slot name="btn-expand"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed, toRef } from 'vue'

const props = defineProps({
  gridCols: {
    type: [Number, String],
    default: 1,
  },
  groupBy: Array,
})

const emit = defineEmits(['searchSubmit', 'searchClear'])

const colCount = toRef(props, 'gridCols')

const searchWrapperStyle = computed(() => {
  return `grid-template-columns: repeat(${colCount.value}, minmax(0, 1fr)); width: ${Number(props.gridCols) * 25}%;`
})
</script>

