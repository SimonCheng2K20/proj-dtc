<template>
  <q-th :props="{ col }" class="cursor-pointer" @click="onSortClick">
    {{ col.label }}
    <span class="relative">
      <q-icon
        name="arrow_upward"
        class="transition-opacity transition-transform"
        :style="{ transform: `rotate(${rotateDeg})`, opacity: sortByItemIndex === -1 ? 0.2 : 1 }"
      ></q-icon>
      <div class="absolute text-xs top-[-2px] right-[-4px] transition-opacity" :style="{ opacity: sortByItemIndex === -1 || sortBy.length <= 1 ? 0 : 1 }">
        {{ sortByItemIndex === -1 ? null : sortByItemIndex + 1 }}
      </div>
    </span>
  </q-th>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  col: Object,
  sortBy: Array,
})

const emit = defineEmits(['update:sortBy'])

const sortByItemIndex = computed(() => props.sortBy.findIndex(([key]) => key === props.col.name))

const onSortClick = () => {
  if (sortByItemIndex.value === -1) {
    emit('update:sortBy', props.sortBy.concat([[props.col.name, 'asc']]))
  } else {
    const item = props.sortBy[sortByItemIndex.value]
    switch (item[1]) {
      case 'asc': {
        // 小到大，箭頭朝上
        item[1] = 'desc'
        const value = props.sortBy.slice(0, sortByItemIndex.value).concat([item], props.sortBy.slice(sortByItemIndex.value + 1))
        emit('update:sortBy', value)
        break
      }
      case 'desc': {
        // 大到小，箭頭朝下
        const value = props.sortBy.slice(0, sortByItemIndex.value).concat(props.sortBy.slice(sortByItemIndex.value + 1))
        emit('update:sortBy', value)
        break
      }
    }
  }
}

const rotateDeg = computed(() => {
  const item = props.sortBy[sortByItemIndex.value]
  if (item?.[1] === 'desc') return '180deg'
  else return '0deg'
})
</script>

