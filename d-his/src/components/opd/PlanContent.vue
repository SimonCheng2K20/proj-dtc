<template>
  <q-card ref="cardRef" square flat class="flex flex-col border border-[rgba(33,92,186,0.4)]">
    <q-card-section class="my-card-title flex items-center">
      <div v-if="slots['title-prepend']" class="mr-2">
        <slot name="title-prepend"></slot>
      </div>
      <div class="text-xl font-bold mr-2">{{ title }}</div>
      <q-btn
        v-if="!readonly"
        color="clear"
        label="清除"
        dense
        unelevated
        @click="emit('update:modelValue', null)"
      ></q-btn>
      <q-space></q-space>
      <slot name="btn-expand"></slot>
    </q-card-section>
    <q-input
      v-bind="QInputProps"
      :model-value="modelValue"
      :ref="(el) => (inputRefs.Content = el)"
      :rules="rules.Content"
      @update:model-value="(val) => emit('update:modelValue', val)"
      type="textarea"
      class="grow"
      input-class="h-full"
    ></q-input>
  </q-card>
</template>

<script setup>
import { ref, reactive, useSlots } from 'vue'
import { QInputProps } from 'utils/quasar-extends/base-props.js'
import { useQuasar } from 'quasar'
import { validate } from 'utils/quasar-extends/validate.js'

const $q = useQuasar()
const slots = useSlots()
const props = defineProps({
  modelValue: String,
  title: {
    type: String,
    default: 'P 治療計畫',
  },
  loading: Boolean,

  readonly: Boolean,
})

const emit = defineEmits(['update:modelValue'])

const cardRef = ref()

const inputRefs = reactive({})
const rules = {
  // Content: [(val) => (val !== null && val !== '') || '請輸入治療計畫'],
}

defineExpose({
  validate: () => validate(inputRefs),
})

const init = async () => {
  if (props.readonly) return
}
init()
</script>

