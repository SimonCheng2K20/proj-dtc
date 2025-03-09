<template>
  <div ref="switchRef" class="my-switch relative min-w-[60px] h-[24px] rounded-[12px] cursor-pointer select-none"
    :data-width="switchWidth" :class="[modelValue ? 'bg-blue-500' : 'bg-gray-500']"
    @click="emit('update:modelValue', !modelValue)">
    <div v-if="text !== undefined" class="relative mx-[28px] text-white">{{ text }}</div>
    <div class="w-[16px] h-[16px] bg-white rounded-full absolute top-[4px] left-[4px] transition-transform"
      :style="{ transform: `translateX(${modelValue ? switchWidth - 24 : 0}px)` }"></div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
const props = defineProps({
  modelValue: Boolean,
  text: String,
})

const emit = defineEmits(['update:modelValue'])

const switchRef = ref()
const switchWidth = ref(0)
onMounted(() => {
  switchWidth.value = switchRef.value.offsetWidth
})
</script>