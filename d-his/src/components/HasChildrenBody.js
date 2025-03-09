import { h, defineComponent, markRaw, useSlots } from 'vue'
import { QTd, QTr } from 'quasar'

const createComponent = (raw) => markRaw(defineComponent(raw))
export default createComponent({
  name: 'HasChildrenBody',

  props: {
    childrenShow: Boolean,
  },

  setup(props, { attrs }) {
    const slots = useSlots()

    return () => {
      const cols = attrs.cols.map((col) =>
        slots[`body-cell-${col.name}`]
          ? slots[`body-cell-${col.name}`]({
              col,
              value: col.value,
              key: col.name,
              row: attrs.row,
              rowIndex: attrs.rowIndex,
              pageIndex: attrs.pageIndex,
              cols: attrs.cols,
              colsMap: attrs.colsMap,
              sort: attrs.sort,
              selected: attrs.selected,
              expand: attrs.expand,
              color: attrs.color,
              dark: attrs.dark,
              dense: attrs.dense,
            })
          : h(QTd, { col }, () => col.value)
      )

      return [
        h(QTr, { props: attrs }, () => cols),
        h(QTr, { props: attrs, style: props.childrenShow ? null : 'display: none' }, slots.children ? () => slots.children({ ...attrs }) : null),
      ]
    }
  },
})

