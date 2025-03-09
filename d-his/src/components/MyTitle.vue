<template>
  <teleport v-if="isLayoutMouted" to="#header-expand" :disabled="noFixed">
    <header>
      <div class="bg-[#e1e8f5] text-default text-lg font-bold px-2 py-1 flex items-center gap-1">
        <slot name="prepend"></slot>
        <slot>
          {{ title }}
        </slot>
        <slot name="expand"></slot>
      </div>
      <div v-if="slots.bottom">
        <slot name="bottom"></slot>
      </div>
    </header>
  </teleport>
</template>

<script setup>
import { inject, useSlots } from 'vue'

const slots = useSlots()

const props = defineProps({
  title: String,
  noFixed: Boolean,
})

const isLayoutMouted = inject('isLayoutMouted')
</script>

