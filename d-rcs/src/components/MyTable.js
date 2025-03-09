import { defineComponent, markRaw, computed, h, Transition, ref, toRef } from 'vue'
import ProgressBar from 'primevue/ProgressBar'
import Paginator from 'primevue/paginator'
import { useRouter } from 'vue-router'
import { cloneDeep, findIndex, forEach } from 'lodash-es'

export default markRaw(
  defineComponent({
    props: {
      headers: {
        type: Array,
        default: () => [],
      },

      items: {
        type: Array,
        default: () => [],
      },

      pageOptions: Object,

      sortBy: Array,

      selected: Array,
      isMultipleSelect: Boolean,
      draggable: Boolean,

      loading: Boolean,

      hideDefaultFooter: {
        type: Boolean,
        default: false,
      },
      hideDefaultFooter: Boolean,
      stickyHeader: {
        type: Boolean,
        default: true,
      },
      dense: Boolean,

      pageQuery: Boolean,
    },
    emits: ['pageChange', 'update:selected', 'select', 'sort', 'update:sortBy'],
    setup(props, { emit, slots }) {
      const router = useRouter()

      const tableClass = computed(() => [
        'my-table',
        { 'my-table--dense': props.dense },
        { 'select-none': props.isMultipleSelect },
        { 'my-table--loading': props.loading },
      ])

      const sort = (key) => {
        const i = props.sortBy.findIndex((item) => item?.[0] === key)

        const _sortBy = cloneDeep(props.sortBy)
        if (i === -1) _sortBy.push([key, 'desc'])
        else {
          switch (_sortBy[i][1]) {
            case 'desc':
              _sortBy[i][1] = 'asc'
              break
            case 'asc':
              _sortBy.splice(i, 1)
              break
          }
        }
        emit('update:sortBy', _sortBy)
        emit('sort', _sortBy[i])
      }

      const sortIconHandler = (key) => {
        const i = props.sortBy.findIndex((item) => item?.[0] === key)

        if (i === -1) return 'pi pi-sort'
        switch (props.sortBy[i][1]) {
          case 'desc':
            return 'pi pi-caret-up'
          case 'asc':
            return 'pi pi-caret-down'
        }
      }

      const itemsRef = toRef(props, 'items')
      const selectedRef = toRef(props, 'selected')

      const selectedCheck = (rowItem, rowIndex) => {
        return findIndex(selectedRef.value, { item: rowItem, index: rowIndex }) === -1 ? false : true
      }

      const selectedTempRemove = ref([])
      const tbody = ref()

      const checkElement = (el) => {
        if (el.tagName === 'TR') return el
        else return checkElement(el.parentNode)
      }

      const findTrItemAndIndex = (trEl) => {
        const trs = tbody.value.querySelectorAll('tr')
        for (let i = 0, length = trs.length; i < length; i++) {
          if (trEl === trs[i]) {
            return { item: itemsRef.value[i], index: i }
          }
        }
      }

      const moveUpAddSelected = ({ start, limit }) => {
        for (let i = start; i > limit; i--) {
          if (window.event.ctrlKey) {
            const inSelectedIndex = findIndex(selectedRef.value, { item: itemsRef.value[i], index: i })
            if (inSelectedIndex !== -1) {
              selectedTempRemove.value.push(selectedRef.value.splice(inSelectedIndex, 1)[0])
            } else {
              selectedRef.value.push({ item: itemsRef.value[i], index: i })
            }
          } else {
            selectedRef.value.push({ item: itemsRef.value[i], index: i })
          }
        }
      }

      const moveUpRemoveSelected = ({ start, limit }) => {
        for (let i = start; i < limit; i++) {
          const inSelectedIndex = findIndex(selectedRef.value, { item: itemsRef.value[i], index: i })
          if (window.event.ctrlKey) {
            if (inSelectedIndex !== -1) {
              selectedRef.value.splice(inSelectedIndex, 1)
            } else {
              const inSelectedTempRemoveIndex = findIndex(selectedTempRemove.value, { item: itemsRef.value[i], index: i })
              if (inSelectedTempRemoveIndex !== -1) {
                selectedRef.value.push(selectedTempRemove.value.splice(inSelectedTempRemoveIndex, 1)[0])
              }
            }
          } else {
            selectedRef.value.splice(inSelectedIndex, 1)
          }
        }
      }

      const moveDownAddSelected = ({ start, limit }) => {
        for (let i = start; i < limit; i++) {
          if (window.event.ctrlKey) {
            const inSelectedIndex = findIndex(selectedRef.value, { item: itemsRef.value[i], index: i })
            if (inSelectedIndex !== -1) {
              selectedTempRemove.value.push(selectedRef.value.splice(inSelectedIndex, 1)[0])
            } else {
              selectedRef.value.push({ item: itemsRef.value[i], index: i })
            }
          } else {
            selectedRef.value.push({ item: itemsRef.value[i], index: i })
          }
        }
      }

      const moveDownRemoveSelected = ({ start, limit }) => {
        for (let i = start; i > limit; i--) {
          const inSelectedIndex = findIndex(selectedRef.value, { item: itemsRef.value[i], index: i })
          if (window.event.ctrlKey) {
            if (inSelectedIndex !== -1) {
              selectedRef.value.splice(inSelectedIndex, 1)
            } else {
              const inSelectedTempRemoveIndex = findIndex(selectedTempRemove.value, { item: itemsRef.value[i], index: i })
              if (inSelectedTempRemoveIndex !== -1) {
                selectedRef.value.push(selectedTempRemove.value.splice(inSelectedTempRemoveIndex, 1)[0])
              }
            }
          } else {
            selectedRef.value.splice(inSelectedIndex, 1)
          }
        }
      }

      const setMoveType = (currentIndex) => {
        if (currentIndex === fromIndex.value) {
          moveType.value = null
        } else if (currentIndex > fromIndex.value) {
          moveType.value = 'down'
        } else if (currentIndex < fromIndex.value) {
          moveType.value = 'up'
        }
      }

      const tbodyMousemove = (evt) => {
        if (evt.target !== tbody.value) {
          const trEl = checkElement(evt.target)

          const { item, index } = findTrItemAndIndex(trEl)

          if ((index === fromIndex.value && moveType.value === null) || index === preIndex.value) return

          if (moveType.value === null) {
            // 尚未確定方向

            setMoveType(index)
            // 當滑鼠移出 body 再進來 or 移動太快 => 導致跳著選 => 中間的要選進去
            if (moveType.value === 'up') {
              moveUpAddSelected({ start: preIndex.value - 1, limit: index - 1 })
            } else if (moveType.value === 'down') {
              moveDownAddSelected({ start: preIndex.value + 1, limit: index + 1 })
            }

            preIndex.value = index
            toIndex.value = index
          } else {
            if (moveType.value === 'up') {
              if (preIndex.value < index) {
                // 由上往回
                setMoveType(index)

                moveUpRemoveSelected({ start: preIndex.value, limit: index > fromIndex.value ? fromIndex.value : index })
                moveDownAddSelected({ start: fromIndex.value + 1, limit: index + 1 })

                preIndex.value = index
              } else {
                moveUpAddSelected({ start: preIndex.value - 1, limit: index - 1 })
                preIndex.value = index
              }
            } else if (moveType.value === 'down') {
              if (preIndex.value > index) {
                // 由下往回
                setMoveType(index)

                moveDownRemoveSelected({ start: preIndex.value, limit: index < fromIndex.value ? fromIndex.value : index })
                moveUpAddSelected({ start: fromIndex.value - 1, limit: index - 1 })

                preIndex.value = index
              } else {
                moveDownAddSelected({ start: preIndex.value + 1, limit: index + 1 })
                preIndex.value = index
              }
            }
          }
        }
      }

      const tbodyMousedown = (evt) => {
        if (evt.target !== tbody.value) {
          const trEl = checkElement(evt.target)
          const { item, index } = findTrItemAndIndex(trEl)

          if (props.isMultipleSelect === true) {
            if (window.event.ctrlKey === true) {
              const inSelectedIndex = findIndex(selectedRef.value, { item, index })

              if (inSelectedIndex === -1) {
                selectedRef.value.push({ item, index })
              } else {
                selectedRef.value.splice(inSelectedIndex, 1)
              }

              fromIndex.value = index
              preIndex.value = index
            } else {
              emit('update:selected', [{ item, index }])
              fromIndex.value = index
              preIndex.value = index
            }

            tbody.value.addEventListener('mousemove', tbodyMousemove)

            window.addEventListener(
              'mouseup',
              () => {
                tbody.value.removeEventListener('mousemove', tbodyMousemove)

                fromIndex.value = null
                preIndex.value = null
                toIndex.value = null
                moveType.value = null
                selectedTempRemove.value = []
              },
              { once: true }
            )
          } else {
            emit('update:selected', [{ item, index }])
            emit('select', { item, index })
          }
        }
      }

      const fromIndex = ref(null)
      const preIndex = ref(null)
      const toIndex = ref(null)
      const moveType = ref(null) // up, down

      const dragging = ref(false)

      const dragStart = (evt, rowIndex) => {
        dragging.value = true
        fromIndex.value = rowIndex
        evt.dataTransfer.effectAllowed = 'move'

        const dragEnterBind = {}
        forEach(itemsRef.value, (item, index) => {
          dragEnterBind[index] = dragEnter.bind(null, index)
        })

        forEach(rowRef.value, (item, index) => {
          item.addEventListener('dragenter', dragEnterBind[index])
        })

        const dragenter = (evt) => {
          evt.preventDefault()
        }

        const dragover = (evt) => {
          evt.preventDefault()
          evt.dataTransfer.dropEffect = 'move'
        }

        tbody.value.addEventListener('dragenter', dragenter)
        tbody.value.addEventListener('dragover', dragover)

        evt.currentTarget.addEventListener(
          'dragend',
          () => {
            forEach(rowRef.value, (item, index) => {
              item.removeEventListener('dragenter', dragEnterBind[index])
            })

            tbody.value.removeEventListener('dragenter', dragenter)
            tbody.value.removeEventListener('dragover', dragover)

            fromIndex.value = null
            preIndex.value = null
            dragging.value = false
          },
          { once: true }
        )
      }

      const dragEnter = (rowIndex) => {
        if (preIndex.value !== null) {
          itemsRef.value.splice(rowIndex, 0, itemsRef.value.splice(preIndex.value, 1)[0])
        } else {
          itemsRef.value.splice(rowIndex, 0, itemsRef.value.splice(fromIndex.value, 1)[0])
        }

        preIndex.value = rowIndex
      }

      return () => {
        const ths = props.headers.map((item, index) => {
          const child = [h('span', item.text)]
          if (!!item.sortable) {
            child.push(
              h('span', { class: ['ml-1', { 'opacity-20': sortIconHandler(item.key) === 'pi pi-sort' }] }, h('i', { class: sortIconHandler(item.key) }))
            )
          }

          return h(
            'th',
            {
              class: ['text-center', { 'cursor-pointer': !!item.sortable }],
              style: {
                width: item.width,
                minWidth: item.minWidth,
                maxWidth: item.maxWidth,
                position: props.stickyHeader ? 'sticky' : null,
                top: 0,
                zIndex: 1,
              },
              onClick() {
                if (!!item.sortable === false) return
                sort(item.key)
              },
            },
            slots[`header-${item.key}`]
              ? slots[`header-${item.key}`]({
                  item,
                  index,
                  headers: props.headers,
                })
              : h('div', child)
          )
        })

        const header = h('thead', { class: 'my-table-header' }, h('tr', ths))

        const getTdContent = ({ rowItem, rowIndex, headerItem }) => {
          if (typeof headerItem.value === 'string') {
            return rowItem[headerItem.value] !== undefined ? rowItem[headerItem.value] : null
          } else if (typeof headerItem.value === 'function') {
            return headerItem.value(rowItem, rowIndex)
          } else {
            return null
          }
        }

        const getRow = ({ rowItem, rowIndex }) => {
          const tds = props.headers.map((headerItem) => {
            const content = getTdContent({ rowItem, rowIndex, headerItem })
            return h(
              'td',
              {
                class: [`item-${headerItem.key}`],
                style: { 'text-align': headerItem?.align || 'center' },
              },
              h(
                'div',
                { class: 'td-content', title: content },
                slots[`item-${headerItem.key}`]
                  ? slots[`item-${headerItem.key}`]({
                      item: rowItem,
                      index: rowIndex,
                      value: content,
                    })
                  : content
              )
            )
          })

          return [
            h(
              'tr',
              {
                class: {
                  odd: rowIndex % 2 !== 0,
                  selected: props.selected !== undefined && props.selected.length > 0 && selectedCheck(rowItem, rowIndex),
                  'cursor-pointer': props.selected !== undefined,
                  'cursor-grab': props.draggable,
                },
              },
              tds
            ),
            slots.childs ? slots.childs({ item: rowItem, index: rowIndex }) : null,
          ]
        }

        const getRows = () => {
          if (props.items.length === 0)
            return h('tr', h('td', { class: 'text-center', colspan: props.headers.length }, props.loading ? '讀取中，請稍候...' : '沒有資料'))
          else {
            if (props.pageOptions === undefined) return props.items.map((rowItem, rowIndex) => getRow({ rowItem, rowIndex }))
            else {
              if (props.items.length <= props.pageOptions.perPageCount) return props.items.map((rowItem, rowIndex) => getRow({ rowItem, rowIndex }))
              else {
                return props.items
                  .slice(props.pageOptions.firstIndex, props.pageOptions.firstIndex + props.pageOptions.perPageCount)
                  .map((rowItem, rowIndex) => getRow({ rowItem, rowIndex }))
              }
            }
          }
        }

        const rows = getRows()

        const body = h('tbody', { ref: tbody, onMousedown: tbodyMousedown }, [
          slots.rows ? slots.rows() : rows,
          slots['expend-row'] ? slots['expend-row']() : null,
        ])

        const getTable = () => {
          const child = [slots.header ? slots.header() : header, slots.body ? slots.body() : body]

          if (props.loading) {
            child.splice(
              1,
              0,
              h(Transition, { name: 'fade' }, () =>
                h(
                  'thead',
                  h(
                    'tr',
                    { class: 'my-table--progress' },
                    h(
                      'th',
                      { colspan: props.headers.length, class: 'relative' },
                      h(
                        'div',
                        { class: 'absolute w-full overflow-hidden', style: 'z-index:999' },
                        h(ProgressBar, {
                          mode: 'indeterminate',
                          style: {
                            height: '4px',
                            margin: '0 -4px',
                          },
                        })
                      )
                    )
                  )
                )
              )
            )
          }

          return h('table', child)
        }

        const table = getTable()

        const getFooter = () =>
          h(
            'div',
            { class: 'my-footer' },
            h('div', { class: 'flex items-center' }, [
              h(Paginator, {
                first: props.pageOptions.firstIndex,
                rows: props.pageOptions.perPageCount,
                totalRecords: props.pageOptions.totalItemsCount,
                rowsPerPageOptions: props.pageOptions.rowsPerPage,
                onPage(evt) {
                  if (props.pageQuery) {
                    router.push({
                      query: {
                        firstIndex: props.pageOptions.firstIndex,
                        perPageCount: props.pageOptions.perPageCount,
                      },
                    })
                  }
                  emit('pageChange', evt)
                },
                'onUpdate:first'(first) {
                  props.pageOptions.firstIndex = first
                },
                'onUpdate:rows'(perPageCount) {
                  props.pageOptions.perPageCount = perPageCount
                },
              }),
              h('div', { class: 'flex justify-center' }, `共 ${props.pageOptions.totalItemsCount} 筆`),
            ])
          )

        return h('div', { class: tableClass.value }, [h('div', { class: 'my-table--wrapper' }, table), props.hideDefaultFooter ? null : getFooter()])
      }
    },
  })
)
