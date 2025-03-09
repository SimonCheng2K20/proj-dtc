<template>
  <div class="bg-yellow-100 p-2 flex items-center gap-2 w-full">
    <div
      v-for="(item, index) in items"
      :key="index"
      :class="{ 'border-r border-r-sky-600 pr-2': index < items.length - 1 }"
    >
      <span v-if="item.label">{{ item.label }}：</span>
      <span>{{ item.value || '--' }}</span>
    </div>

    <slot></slot>
  </div>
</template>

<script setup>
const props = defineProps({
  items: Array,
})
</script>

