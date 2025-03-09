<template>
  <div class="my-input-group" ref="thisElement">
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, onMounted, onUpdated, onActivated } from 'vue'
import { chunk, zip, forEach, groupBy } from 'lodash-es'

const props = defineProps({
  groupBy: {
    type: Array,
    // 'col', 'row', 'custom
    // ['col', 2]
  },
  col: [String, Number],
  groupWidth: Number,
})

const thisElement = ref()

const getLabelWidth = (items) => {
  const arr = []
  for (let i = 0, length = items.length; i < length; i++) {
    const label = items[i]?.querySelector('.label')

    if (!!label) {
      // 清除 width 再取，避免寬度無限增長
      label.style.width = null

      // offsetWidth 會自動四捨五入，所以 +1 避免設置寬度小於正確寬度
      arr.push({ label, width: label.offsetWidth + 1 })
    }
  }

  return arr
}

const setWidth = (children) => {
  const allWidth = getLabelWidth(children)
  const maxWidth = props.groupWidth ? props.groupWidth : Math.max(...allWidth.map((item) => item.width))
  allWidth.forEach((item) => {
    item.label.style.width = maxWidth + 'px'
  })
}

const init = () => {
  const oldChildren = Array.from(thisElement.value.querySelectorAll('.old-my-input-wrapper'))
  const children = Array.from(thisElement.value.querySelectorAll('.my-input-wrapper')).concat(oldChildren)

  if (props.groupBy?.[0] === 'col' || !!props.col) {
    const colCount = props.groupBy[1] || props.col
    if (colCount === undefined) {
      setWidth(children)
    } else {
      zip(...chunk(children, colCount)).forEach((groupChildren) => {
        setWidth(groupChildren)
      })
    }
  } else {
    forEach(
      groupBy(children, (el) => {
        return el.getAttribute('data-group')
      }),
      (groupChildren) => {
        setWidth(groupChildren)
      }
    )
  }
}

onActivated(() => {
  init()
})

onUpdated(() => {
  init()
})

onMounted(() => {
  init()
})
</script>

