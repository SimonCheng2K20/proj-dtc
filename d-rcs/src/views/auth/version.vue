<template>
  <div class="font-bold text-white">
    <!-- <div class="flex items-end mb-1">
      <div class="w-20">維護廠商</div>
      <div class="px-2">:</div>
      <img src="/assets/dtc_logo.svg" />
    </div> -->
    <div class="flex mb-1">
      <div class="w-20">報修專線</div>
      <div class="px-2">:</div>
      <div>0800-500019</div>
    </div>
    <div class="flex">
      <div class="w-20">軟體版本號</div>
      <div class="px-2">:</div>
      <div>{{ time }}</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  time: String,
})
</script>
