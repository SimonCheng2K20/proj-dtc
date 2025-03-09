<template>
  <div class="text-right leading-10 font-extrabold text-lg mt-5 px-2">
    {{ title }} :
    <span style="display: inline-block" class="ml-1 py-1 px-2 border-2 border-[#FC004D] rounded border-soild text-[#FC004D] tracking-widest text-xl">
      {{ content }}
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  content: String,
  title: String,
})
</script>
