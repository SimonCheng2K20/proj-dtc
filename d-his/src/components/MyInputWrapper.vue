<template>
  <my-input-wrapper />
</template>

<script setup>
import { useSlots, h, computed } from 'vue'

const slots = useSlots()

const props = defineProps({
  label: String,
  value: [String, Number],
  labelWidth: [String, Number],
  rangeInput: Boolean,
  requiredMark: Boolean,
  inputBorder: Boolean,
  dataGroup: String,
  rangeCharacter: String,
  subClass: String,
  rangeConnectTextColor: { type: String, default: 'black' },
})

const MyInputWrapper = () => {
  const labelWidth = computed(() => {
    if (typeof props.labelWidth === 'number') return `${props.labelWidth}px`
    else if (typeof props.labelWidth === 'string') {
      if (props.labelWidth.indexOf('px') === -1) return `${props.labelWidth}px`
      else return props.labelWidth
    } else return null
  })

  return h(
    'div',
    {
      class: ['my-input-wrapper', props.subClass],
      'data-group': props.dataGroup,
    },
    h('div', { class: 'wrapper-inner' }, [
      h(
        'div',
        {
          class: [
            'label',
            {
              'required-mark': props.requiredMark,
            },
          ],
          style: `width: ${labelWidth.value}`,
        },
        slots.label ? slots.label() : props.label
      ),
      props.rangeInput
        ? [
            h(
              'div',
              {
                class: 'range-input-0',
              },
              slots['range-input-0'] ? slots['range-input-0']() : props.value
            ),
            h('div', { class: `range-connect text-${props.rangeConnectTextColor}` }, props.rangeCharacter || '至'),
            h(
              'div',
              {
                class: 'range-input-1',
              },
              slots['range-input-1'] ? slots['range-input-1']() : props.value
            ),
          ]
        : h('div', { class: ['input', { border: props.inputBorder }] }, slots.default ? slots.default() : props.value),
    ])
  )
}
</script>

