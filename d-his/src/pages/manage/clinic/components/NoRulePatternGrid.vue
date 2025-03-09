<template>
  <div class="grid gap-2">
    <div class="text-xl font-bold">給號原則</div>

    <div class="flex justify-end">
      <div class="flex flex-col items-end">
        <div class="text-sm font-bold"><span class="text-red">*</span>預約：R</div>
        <div class="text-sm font-bold">現場：O</div>
        <div class="text-sm font-bold">已掛號：A</div>
      </div>
    </div>

    <div class="-mt-5 grid grid-cols-[repeat(22,1fr)]">
      <div class="col-span-5"></div>
      <div class="px-[1px] text-center">5</div>
      <div class="col-span-4"></div>
      <div class="px-[1px] text-center">10</div>
      <div class="col-span-4"></div>
      <div class="px-[1px] text-center">15</div>
      <div class="col-span-5"></div>
      <div class="row-end-11 row-start-2 grid">
        <div v-for="num in numberHeader" :key="num" class="py-[1px]">{{ num + 1 }}</div>
      </div>
      <div
        class="col-[span_20_/_span_20] row-[span_10_/_span_10] grid grid-cols-[repeat(20,1fr)] gap-[1px] bg-black p-[1px]"
      >
        <div
          v-for="(item, index) in noRulePattern"
          :key="index"
          class="text-center"
          :class="{ 'bg-[#E0FAE9]': index % 2 === 1, 'bg-white': index % 2 === 0 }"
        >
          {{ item }}
        </div>
      </div>
      <div class="row-end-11 grid">
        <div v-for="num in numberHeader" :key="num" class="py-[1px]">{{ num + 20 }}</div>
      </div>
    </div>

    <div class="grid gap-2" v-if="!readonly">
      <div class="flex items-center">
        <div class="text-xl font-bold">設定給號原則</div>
        <q-space></q-space>
        <q-btn label="套用給號 PATTERN" color="primary" dense unelevated @click="toUsePattern"></q-btn>
      </div>
      <div class="flex items-end gap-2">
        <div class="grid gap-2">
          <my-input-wrapper label="給號原則">
            <q-select
              v-bind="QSelectProps"
              v-model="setPatternItem.type"
              :options="patternTypeDropdown"
              optionLabel="label"
              optionValue="value"
              emit-value
              map-options
            ></q-select>
          </my-input-wrapper>
          <div class="flex items-center gap-2">
            <div>從　</div>
            <q-input v-bind="QInputProps" v-model="setPatternItem.start" type="number" :min="1" :max="200"></q-input>
            <div>到　</div>
            <q-input v-bind="QInputProps" v-model="setPatternItem.end" type="number" :min="1" :max="200"></q-input>
          </div>
          <div class="flex items-center gap-2">
            <div>每隔</div>
            <q-input v-bind="QInputProps" v-model="setPatternItem.interval" type="number" :min="1" :max="200"></q-input>
            <div>號跳</div>
            <q-input v-bind="QInputProps" v-model="setPatternItem.ignore" type="number" :min="1" :max="200"></q-input>
            <div>號</div>
          </div>
        </div>
        <q-btn label="執行" color="primary" dense unelevated @click="setPatternHandler" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, toRef } from 'vue'
import { range, isNaN } from 'lodash'
import NoRulePatternDialog from './NoRulePatternDialog.vue'
import { useQuasar } from 'quasar'
import { QInputProps, QSelectProps } from 'utils/quasar-extends/base-props.js'

const $q = useQuasar()

const props = defineProps({
  noRulePattern: Array,

  readonly: Boolean,
})

const noRulePatternRef = toRef(props, 'noRulePattern')

const emit = defineEmits(['update:noRulePattern'])

const numberHeader = computed(() => range(1, 11).map((i) => i * 20))

const patternTypeDropdown = [
  { value: 'R', label: '預約' },
  { value: 'O', label: '現場' },
]

const toUsePattern = () => {
  $q.dialog({
    component: NoRulePatternDialog,
  }).onOk((rulePattern) => {
    emit('update:noRulePattern', rulePattern)
  })
}

const setPatternItem = reactive({ type: 'R', start: 1, end: 200, interval: 0, ignore: 0 })

const setPatternHandler = () => {
  setPatternItem.start = Number(setPatternItem.start)
  setPatternItem.end = Number(setPatternItem.end)
  setPatternItem.interval = Number(setPatternItem.interval)
  setPatternItem.ignore = Number(setPatternItem.ignore)

  if (
    setPatternItem.start < 1 ||
    setPatternItem.start > 200 ||
    setPatternItem.end < 1 ||
    setPatternItem.end > 200 ||
    setPatternItem.interval < 0 ||
    setPatternItem.interval > 200 ||
    setPatternItem.ignore < 0 ||
    setPatternItem.ignore > 200
  ) {
    $q.notify({ type: 'warning', message: '給號輸入欄位有誤', position: 'top' })
    return
  }

  for (let i = 0; i <= setPatternItem.end - setPatternItem.start; i++) {
    let remainder = i % (setPatternItem.interval + setPatternItem.ignore)
    if (isNaN(remainder)) {
      remainder = 0
    }
    if (remainder <= setPatternItem.interval) {
      if (
        noRulePatternRef.value[setPatternItem.start - 1 + i] !== 'A' &&
        noRulePatternRef.value[setPatternItem.start - 1 + i] !== 'X'
      ) {
        noRulePatternRef.value[setPatternItem.start - 1 + i] = setPatternItem.type
      }
    }
    if (remainder >= setPatternItem.interval && remainder < setPatternItem.interval + setPatternItem.ignore) {
      if (
        noRulePatternRef.value[setPatternItem.start - 1 + i] !== 'A' &&
        noRulePatternRef.value[setPatternItem.start - 1 + i] !== 'X'
      ) {
        noRulePatternRef.value[setPatternItem.start - 1 + i] = setPatternItem.type === 'R' ? 'O' : 'R'
      }
    }
  }
}
</script>

