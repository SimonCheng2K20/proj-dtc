<template>
  <div class="my-input-group" ref="thisElement">
    <slot></slot>
  </div>
</template>

<script setup>
import { ref, onMounted, onUpdated } from 'vue'
import { chunk, zip, forEach, groupBy } from 'lodash-es'

const props = defineProps({
  groupBy: {
    type: Array,
    // 'col', 'row', 'custom
    // ['col', 2]
  },
})

const thisElement = ref()

const getLabelWidth = (items) => {
  const arr = []
  for (let i = 0, length = items.length; i < length; i++) {
    const label = items[i]?.querySelector('.label')
    if (!!label) {
      // 清除 width 再取，避免寬度無限增長
      if (!!label.style.width) label.style.width = null

      // offsetWidth 會自動四捨五入，所以 +1 避免設置寬度小於正確寬度
      arr.push({ label, width: label.offsetWidth + 1 })
    }
  }

  return arr
}

const setWidth = (children) => {
  const allWidth = getLabelWidth(children)
  const maxWidth = Math.max(...allWidth.map((item) => item.width))
  allWidth.forEach((item) => {
    item.label.style.width = maxWidth + 'px'
  })
}

const init = () => {
  const children = thisElement.value.querySelectorAll('.my-input-wrapper')

  if (props.groupBy === undefined) {
    // 全部 label 都一樣
    setWidth(children)
  } else {
    switch (props.groupBy[0]) {
      case 'col': {
        const colCount = props.groupBy[1]
        if (colCount === undefined) {
          setWidth(children)
        } else {
          zip(...chunk(children, colCount)).forEach((groupChildren) => {
            setWidth(groupChildren)
          })
        }
        break
      }
      case 'row': {
        const rowCount = props.groupBy[1]
        if (rowCount === undefined) {
          setWidth(children)
        } else {
          chunk(children, rowCount).forEach((groupChildren) => {
            setWidth(groupChildren)
          })
        }
        break
      }
      case 'custom':
        forEach(
          groupBy(children, (el) => {
            return el.getAttribute('data-group')
          }),
          (groupChildren) => {
            setWidth(groupChildren)
          }
        )
        break
    }
  }
}

onUpdated(init)

onMounted(init)
</script>
