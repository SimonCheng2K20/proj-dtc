<template>
  <q-card ref="cardRef" square flat class="border border-[rgba(33,92,186,0.4)]" @click.capture="focusOptions.onFocus">
    <q-card-section
      class="my-card-title flex items-center"
      :style="focusOptions.isFocus ? 'background: #ffe082' : null"
    >
      <div v-if="slots['title-prepend']" class="mr-2">
        <slot name="title-prepend"></slot>
      </div>
      <div class="mr-2 text-xl font-bold">{{ title }}</div>
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
      v-bind="QInputProps"
      :model-value="modelValue"
      :ref="(el) => (inputRefs.Content = el)"
      :rules="rules.Content"
      @update:model-value="(val) => emit('update:modelValue', val)"
      type="textarea"
      :class="{ 'pb-0': !inputRefs.Content?.hasError }"
      input-class="h-[72px]"
    ></q-input>

    <div class="no-wrap flex items-center">
      <q-form ref="formRef">
        <my-input-group class="grid grid-cols-3 gap-1 p-2 min-[1870px]:grid-cols-6">
          <my-input-wrapper label="血壓" class="col-span-2" range-input range-character="/">
            <template #range-input-0>
              <q-input
                v-bind="QInputProps"
                :model-value="bloodPressureHigh"
                :ref="(el) => (formInputRef.Integer = el)"
                :rules="BMIRules.Integer"
                min="0"
                @update:model-value="(val) => emit('update:bloodPressureHigh', val)"
                type="number"
              >
                <template #append>
                  <div class="text-xs">mmHg</div>
                </template>
              </q-input>
            </template>
            <template #range-input-1>
              <q-input
                v-bind="QInputProps"
                :model-value="bloodPressureLow"
                :ref="(el) => (formInputRef.Integer = el)"
                :rules="BMIRules.Integer"
                min="0"
                @update:model-value="(val) => emit('update:bloodPressureLow', val)"
                type="number"
              >
                <template #append>
                  <div class="text-xs">mmHg</div>
                </template>
              </q-input>
            </template>
          </my-input-wrapper>
          <my-input-wrapper label="脈搏">
            <q-input
              v-bind="QInputProps"
              :model-value="pulse"
              :ref="(el) => (formInputRef.Integer = el)"
              :rules="BMIRules.Integer"
              min="0"
              @update:model-value="(val) => emit('update:pulse', val)"
              type="number"
            >
              <template #append>
                <div class="text-xs">bpm</div>
              </template>
            </q-input>
          </my-input-wrapper>
          <my-input-wrapper label="身高">
            <q-input
              v-bind="QInputProps"
              :model-value="height"
              :ref="(el) => (formInputRef.Integer = el)"
              :rules="BMIRules.Integer"
              min="0"
              @update:model-value="(val) => emit('update:height', val)"
              type="number"
            >
              <template #append>
                <div class="text-xs">cm</div>
              </template>
            </q-input>
          </my-input-wrapper>
          <my-input-wrapper label="體重">
            <q-input
              v-bind="QInputProps"
              :model-value="weight"
              :ref="(el) => (formInputRef.Integer = el)"
              :rules="BMIRules.Integer"
              @update:model-value="(val) => emit('update:weight', val)"
              min="0"
              type="number"
            >
              <template #append>
                <div class="text-xs">kg</div>
              </template>
            </q-input>
          </my-input-wrapper>
          <my-input-wrapper label="BMI">
            <q-input v-bind="QInputProps" :model-value="getBMI" readonly></q-input>
          </my-input-wrapper>
        </my-input-group>
      </q-form>
      <div class="mr-2 shrink">
        <q-btn label="歷史資料" color="primary" @click="toObjectiveHistory" dense unelevated no-wrap></q-btn>
      </div>
    </div>
  </q-card>
</template>

<script setup>
import { ref, reactive, computed, useSlots } from 'vue'
import { QInputProps } from 'utils/quasar-extends/base-props.js'
import { isNaN } from 'lodash-es'
import PresetActionBtns from './PresetActionBtns.vue'
import ObjectivePreset from './ObjectivePreset.vue'
import ObjectivePresetEditItem from './ObjectivePresetEditItem.vue'
import { useQuasar } from 'quasar'
import { usePresetKeydown } from 'utils/preset-keydown-handler.js'
import { validate } from 'utils/quasar-extends/validate.js'
import { usePresetStore } from 'stores/preset.js'
import ObjectiveHistory from './ObjectiveHistory.vue'

const presetStore = usePresetStore()
const $q = useQuasar()
const slots = useSlots()
const props = defineProps({
  modelValue: String,
  bloodPressureHigh: [Number, String],
  bloodPressureLow: [Number, String],
  pulse: [Number, String],
  height: [Number, String],
  weight: [Number, String],
  patientId: String,
  title: {
    type: String,
    default: 'O 客觀檢查',
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

const cardRef = ref()
const presetHotkeyItems = computed(() => props.presetHotkeyItems || presetStore.presetItems.Objective)
const emit = defineEmits([
  'update:modelValue',
  'update:bloodPressureHigh',
  'update:bloodPressureLow',
  'update:pulse',
  'update:height',
  'update:weight',
])

const inputRefs = reactive({})
const formRef = ref()
const formInputRef = reactive({})

const reg = /^[1-9][0-9]*$/

const rules = {
  Content: [(val) => (val !== null && val !== '') || '請輸入客觀檢查'],
}
const BMIRules = {
  Integer: [(val) => reg.test(val) || '請輸入整數'],
}

const getBMI = computed(() => {
  const bmi = Math.round((props.weight / (props.height / 100) ** 2) * 10) / 10
  return isNaN(bmi) || bmi === Infinity ? null : bmi
})

const toPreset = () => {
  const dialog = $q.dialog({
    component: ObjectivePreset,
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
    component: ObjectivePresetEditItem,
    componentProps: {
      editType: 'add',
      content: props.modelValue,
    },
  })
}

const toObjectiveHistory = () => {
  const dialog = $q.dialog({
    component: ObjectiveHistory,
    componentProps: {
      patientId: props.patientId,
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
  resetValidation: () => {
    inputRefs.Content.resetValidation()
    // formRef.value.resetValidation()
  },
})

const init = async () => {
  if (props.readonly) return
  if (props.useHotkey) {
    if (!presetHotkeyItems.value) presetStore.getPreset('Objective')

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

