<template>
  <div class="p-2" :class="`w-[${width}px]`">
    <slot name="top"></slot>
    <my-input-group class="grid gap-2">
      <slot name="moreWrapper"></slot>
      <my-input-wrapper label="類別">
        <q-option-group
          v-model="search.type"
          :options="typeOptions"
          inline
          @update:model-value="onSearch"
        ></q-option-group>
      </my-input-wrapper>
      <my-input-wrapper label="年份">
        <q-option-group
          v-model="search.year"
          :options="yearOptions"
          inline
          @update:model-value="onSearch"
        ></q-option-group>
      </my-input-wrapper>
      <my-input-wrapper label="登打醫師">
        <q-option-group
          v-model="search.doctor"
          :options="doctorOptions"
          inline
          @update:model-value="onSearch"
        ></q-option-group>
      </my-input-wrapper>
    </my-input-group>

    <q-table
      v-bind="QTableProps"
      class="mt-2"
      title="病史記錄"
      :row-key="'OpdId' || 'IpdId'"
      :rows="rows"
      :columns="columns"
      :pagination="{ rowsPerPage: -1 }"
      :selected="selected"
      :loading="loading"
      @row-click="onRowClick"
    >
    </q-table>
  </div>
</template>

<script setup>
import { QTableProps } from 'utils/quasar-extends/base-props.js'
import { ref, reactive, watchEffect } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const props = defineProps({
  columns: Array,
  rows: Array,
  rowKey: String,
  loading: Boolean,
  width: {
    type: Number,
    default: 400,
  },
})

const emit = defineEmits(['search', 'select'])

const search = reactive({
  type: route.query.type,
  year: 'all',
  doctor: 'all',
})

const typeOptions = [
  { label: '門診', value: 'opd' },
  { label: '急診', value: 'er' },
  { label: '住院', value: 'ipd' },
]

const yearOptions = [
  { label: '半年', value: 'half' },
  { label: '一年', value: 'one' },
  { label: '兩年', value: 'two' },
  { label: '全部', value: 'all' },
]

const doctorOptions = [
  { label: '個人', value: 'person' },
  { label: '全部', value: 'all' },
]

const selected = ref([])

const onRowClick = (evt, row) => {
  selected.value = [row]
  emit('select', selected.value[0])
}

defineExpose({ onRowClick })

const onSearch = () => {
  selected.value = []
  emit('search', search)
}

const init = () => {
  onSearch()
}
init()
</script>

