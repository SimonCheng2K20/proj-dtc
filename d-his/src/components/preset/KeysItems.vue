<template>
  <div class="flex items-center gap-1">
    <template v-for="(key, index) in keys" :key="index">
      <div class="bg-grey p-1 rounded">{{ key }}</div>
      <div v-if="index < keys.length - 1">+</div>
    </template>
  </div>
</template>

<script setup>
const props = defineProps({
  keys: Array,
})
</script>

