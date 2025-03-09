<template>
  <div class="flex items-end gap-2 p-4" v-resize="onResize">
    <my-input-group ref="searchWrapper" class="grid gap-2" :style="searchWrapperStyle" :groupBy="groupBy ? groupBy : ['col', gridCols]">
      <slot></slot>
    </my-input-group>

    <div ref="btnsWrapper" class="flex gap-2 shrink-0">
      <Button class="p-button-search" @click="emit('searchSubmit')">查詢</Button>
      <Button class="p-button-clear" text-color="default" @click="emit('searchClear')">清除</Button>

      <slot name="btn-expand"></slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, toRef } from 'vue'

const props = defineProps({
  gridCols: {
    type: [Number, String],
    default: 1,
  },
  groupBy: Array,
})

const emit = defineEmits(['searchSubmit', 'searchClear'])

const colCount = toRef(props, 'gridCols')

const btnsWrapper = ref()

const searchWrapperWidth = ref(0)

const searchWrapperStyle = computed(() => {
  return `grid-template-columns: repeat(${colCount.value}, minmax(${searchWrapperWidth.value / 4}px, 1fr));`
})

const onResize = (size) => {
  searchWrapperWidth.value = size.width - btnsWrapper.value.offsetWidth - 40 - (props.gridCols - 1) * 8 // padding + gap
}
</script>
