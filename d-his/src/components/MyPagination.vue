<template>
  <div class="flex items-center gap-2">
    <q-pagination
      v-model="pagination.page"
      :max="Math.ceil((pagination.rowsLength || pagination.rowsNumber) / pagination.rowsPerPage)"
      direction-links
      boundary-links
      icon-first="skip_previous"
      icon-last="skip_next"
      icon-prev="fast_rewind"
      icon-next="fast_forward"
      :max-pages="pagination.maxPages || 10"
      @update:model-value="emit('update:model-value', pagination)"
      :disable="loading"
    ></q-pagination>

    <q-select
      v-model="pagination.rowsPerPage"
      class="shrink-0 w-[100px]"
      label="每頁筆數"
      outlined
      dense
      :options="rowsPerPageOptions || [10, 20, 30]"
      @update:model-value="emit('update:model-value', pagination)"
    ></q-select>

    <div>共 {{ pagination.rowsLength || pagination.rowsNumber }} 筆</div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: Object,
  rowsPerPageOptions: Array,
  loading: Boolean,
})

const pagination = ref({ ...props.modelValue })

watch(
  () => props.modelValue,
  (val) => {
    Object.assign(pagination.value, val)
  },
  {
    deep: true,
  }
)

const emit = defineEmits(['update:model-value'])

/*
為什麼用 pagination.rowsLength？
因為 pagination.rowsNumber 在 rows 超過 rowsPerPage 時不會自動分頁，以 pagination.rowsLength 替代顯示最大筆數及計算最大頁數
*/
</script>

