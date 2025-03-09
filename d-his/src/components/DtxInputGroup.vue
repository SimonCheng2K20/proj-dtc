<template>
  <my-input-wrapper />
</template>

<script setup>
import { useSlots, h, computed } from 'vue'

const slots = useSlots()

const props = defineProps({
  title: String,
  required: Boolean,
  text: [String, Number],

  labelWidth: [String, Number],
  noBorder: Boolean,
  rangeInput: Boolean,

  dataGroup: String,
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
      class: ['old-my-input-wrapper', { dense: props.dense }],
    },
    [
      h(
        'div',
        {
          class: 'label',
          style: `width: ${labelWidth.value}`,
          'data-group': props.dataGroup,
        },
        [
          props.required ? h('span', { class: 'required' }, '*') : null,
          h('span', { style: { 'white-space': 'pre-line' } }, slots.label ? slots.label() : props.title),
        ]
      ),
      props.rangeInput
        ? [
            h(
              'div',
              {
                class: 'range-input-0',
              },
              slots['range-input-0'] ? slots['range-input-0']() : props.text
            ),
            h('div', { class: 'range-connect' }, '至'),
            h(
              'div',
              {
                class: 'range-input-1',
              },
              slots['range-input-1'] ? slots['range-input-1']() : props.text
            ),
          ]
        : h(
            'div',
            {
              class: 'input',
              style: props.noBorder ? 'border: none;' : '',
            },
            slots.default ? slots.default() : props.text
          ),
    ]
  )
}
</script>
