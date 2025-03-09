<template>
  <div class="flex gap-2 mr-2">
    <q-btn color="primary" label="組套" dense unelevated @click="emit('to-preset')"></q-btn>
    <q-btn color="primary" label="設為組套" dense @click="emit('to-preset-add')" unelevated></q-btn>
    <slot name="btn-expand"></slot>
  </div>
</template>

<script setup>
const emit = defineEmits(['to-preset', 'to-preset-add'])
</script>

