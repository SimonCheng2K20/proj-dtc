<template>
  <q-card ref="cardRef" square flat class="border border-[rgba(33,92,186,0.4)]" @click.capture="focusOptions.onFocus">
    <q-card-section
      class="my-card-title flex items-center"
      :style="focusOptions.isFocus ? 'background: #ffe082' : null"
    >
      <div v-if="slots['title-prepend']" class="mr-2">
        <slot name="title-prepend"></slot>
      </div>
      <div class="text-xl font-bold mr-2">{{ title }}</div>
      <preset-action-btns
        v-if="preset && !readonly"
        @to-preset="toPreset"
        @to-preset-add="toPresetAdd"
      ></preset-action-btns>
      <q-btn
        v-if="!readonly"
        color="clear"
        label="清除"
        dense
        unelevated
        @click="emit('update:modelValue', null)"
      ></q-btn>
      <q-space></q-space>
    </q-card-section>
    <q-input
      class="h-[calc(100%-52px)]"
      v-bind="QInputProps"
      :model-value="modelValue"
      :ref="(el) => (inputRefs.Content = el)"
      :rules="rules.Content"
      @update:model-value="(val) => emit('update:modelValue', val)"
      type="textarea"
    ></q-input>
  </q-card>
</template>

<script setup>
import { ref, reactive, computed, useSlots, toRef } from 'vue'
import { QInputProps } from 'utils/quasar-extends/base-props.js'
import PresetActionBtns from './PresetActionBtns.vue'
import SubjectPreset from './SubjectivePreset.vue'
import SubjectPresetEditItem from './SubjectivePresetEditItem.vue'
import { useQuasar } from 'quasar'
import { usePresetKeydown } from 'utils/preset-keydown-handler.js'
import { validate } from 'utils/quasar-extends/validate.js'
import { usePresetStore } from 'stores/preset.js'

const presetStore = usePresetStore()
const $q = useQuasar()
const slots = useSlots()
const props = defineProps({
  modelValue: String,
  title: {
    type: String,
    default: 'S 主訴',
  },
  preset: Boolean,
  loading: Boolean,

  readonly: Boolean,

  useHotkey: {
    type: Boolean,
    default: true,
  },
  presetHotkeyItems: Array,
})

const presetHotkeyItems = computed(() => props.presetHotkeyItems || presetStore.presetItems.Subjective)
const emit = defineEmits(['update:modelValue', 'preset-keydown'])

const cardRef = ref()

const inputRefs = reactive({})
const rules = {
  Content: [(val) => (val !== null && val !== '') || '請輸入主訴'],
}

const toPreset = () => {
  const dialog = $q.dialog({
    component: SubjectPreset,
    componentProps: {
      onPaste(content) {
        emit('update:modelValue', content)
        dialog.hide()
      },
    },
  })
}

const toPresetAdd = () => {
  const dialog = $q.dialog({
    component: SubjectPresetEditItem,
    componentProps: {
      editType: 'add',
      content: props.modelValue,
    },
  })
}

const presetKeydownCallback = (item) => {
  emit('update:modelValue', item.Content)
}

const focusOptions = reactive({
  isFocus: false,
  onFocus: null,
})

defineExpose({
  validate: () => validate(inputRefs),
  resetValidation: () => inputRefs.Content.resetValidation(),
})

const init = async () => {
  if (props.readonly) return
  if (props.useHotkey) {
    if (!presetHotkeyItems.value) presetStore.getPreset('Subjective')

    const { isFocus, onFocus } = usePresetKeydown({
      presetItems: presetHotkeyItems,
      target: cardRef,
      callback: presetKeydownCallback,
    })

    Object.assign(focusOptions, { isFocus, onFocus })
  }
}
init()
</script>

