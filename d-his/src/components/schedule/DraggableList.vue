<template>
  <draggable
    class="grid gap-2"
    :list="list"
    :group="{ name: 'people', pull: 'clone', put: false }"
    :item-key="itemKey"
    ghost-class="opacity-50"
    :sort="false"
  >
    <template #item="{ element, index }">
      <q-btn
        class="rounded text-center p-1 cursor-pointer"
        :color="color"
        :text-color="textColor"
        :class="typeof itemClasses === 'function' ? itemClasses({ element, index }) : itemClasses"
        :style="typeof itemStyle === 'function' ? itemStyle({ element, index }) : itemStyle"
        dense
        unelevated
      >
        {{ itemLabel(element) }}
      </q-btn>
    </template>
  </draggable>
</template>

<script setup>
import draggable from 'vuedraggable'

const props = defineProps({
  list: Array,
  label: [String, Function],
  textColor: String,
  color: String,
  itemKey: String,
  itemClasses: [String, Array, Object, Function],
  itemStyle: [String, Array, Object, Function],
})

const emit = defineEmits('test')

const itemLabel = (data) => {
  if (typeof props.label === 'string') return data[props.label]
  else return props.label(data)
}
</script>

