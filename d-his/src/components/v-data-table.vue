<template>
  <div :ref="vDataTable" class="v-data-table" :class="{ 'v-data-table--dense': dense, 'select-none': isMultipleSelect }">
    <div class="v-data-table__wrapper">
      <table>
        <slot name="header">
          <thead class="v-data-table-header">
            <tr style="position: relative">
              <th
                v-for="(item, index) in headers"
                :key="index"
                class="text-center"
                :class="[{ 'cursor-pointer': !!item.sortable }]"
                :style="{
                  width: item.width,
                  minWidth: item.minWidth,
                  maxWidth: item.maxWidth,
                  position: stickyHeader ? 'sticky' : 'relative',
                  top: 0,
                  zIndex: 1,
                }"
                @click="!!item.sortable ? sort(typeof item.sortable === 'string' ? item.sortable : item.value) : null"
              >
                <!-- <div class="thcontent" :title="item.text"> -->
                <slot :name="`header-${item.value}`" :item="item" :index="index" :headers="headers">
                  <div>
                    <span>{{ item.text }}</span>
                    <span
                      v-if="!!item.sortable"
                      class="ml-1"
                      :class="{
                        'opacity-20': sortIconHandler(typeof item.sortable === 'string' ? item.sortable : item.value) === 'sort',
                      }"
                    >
                    </span>
                  </div>
                </slot>
                <!-- </div> -->
              </th>
            </tr>
          </thead>
          <transition name="fade">
            <thead v-if="loading === true">
              <tr class="v-data-table__progress">
                <th :colspan="headers.length" class="relative">
                  <div class="absolute w-full overflow-hidden">
                    <q-linear-progress indeterminate></q-linear-progress>
                  </div>
                </th>
              </tr>
            </thead>
          </transition>
        </slot>
        <slot name="body">
          <tbody ref="tbody" :class="{ dragging }">
            <slot name="item" v-for="(rowItem, rowIndex) in items" :key="rowIndex" :index="rowIndex" :item="rowItem">
              <tr
                :ref="(el) => (rowRef[rowIndex] = el)"
                :class="{
                  odd: rowIndex % 2 !== 0,
                  selected: selected !== undefined && selected.length > 0 && selectedCheck(rowItem),
                  'cursor-pointer': selected !== undefined,
                  'cursor-grab': draggable,
                }"
                @mousedown="selected !== undefined ? rowSelect_mousedown($event, rowItem, rowIndex) : null"
                @dragstart="draggable ? dragStart($event, rowIndex) : null"
              >
                <td
                  v-for="(item, key) in filterItem(rowItem)"
                  :key="key"
                  :class="[`item-${key}`]"
                  :style="{
                    'text-align': _.find(headers, { value: key })?.align || 'start',
                  }"
                >
                  <div class="td-content" :class="{ showAll: showAll }" :title="item">
                    <slot :name="`item-${key}`" :item="rowItem" :index="rowIndex" :value="item">{{ item !== undefined ? item : null }}</slot>
                  </div>
                </td>
              </tr>

              <slot name="childs" :item="items[rowIndex]" :index="rowIndex"></slot>
            </slot>
            <tr v-if="items.length <= 0" class="v-data-table__empty-wrapper">
              <td v-if="loading === true" class="text-center" :colspan="headers.length">Loading...</td>
              <td v-else class="text-center" :colspan="headers.length">No Data</td>
            </tr>
            <slot name="expend-row"></slot>
          </tbody>
        </slot>
        <slot name="footer">
          <tfoot class="v-data-table-header" v-if="tableFooter === true">
            <tr>
              <th v-for="(item, index) in headers" :key="index" :class="`text-${item.align || 'center'}`" :style="{ width: item.width, minWidth: item.width }">
                <slot :name="`header-${item.value}`" :item="item" :index="index" :headers="headers">
                  <div :style="{ minWidth: item.minWidth }">
                    {{ item.text }}
                  </div>
                </slot>
              </th>
            </tr>
          </tfoot>
        </slot>
      </table>
    </div>
    <div class="v-data-footer" v-if="hideDefaultFooter === false">
      <div class="flex items-center">
        <Paginator
          v-model:first="pageOptions.firstIndex"
          v-model:rows="pageOptions.perPageCount"
          :totalRecords="pageOptions.totalItemsCount"
          :rowsPerPageOptions="pageOptions.rowsPerPage"
          @page="$emit('pageChange', $event)"
        ></Paginator>

        <div class="flex justify-center">共 {{ pageOptions.totalItemsCount }} 筆</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { computed, ref, onUpdated, toRef } from 'vue'

const props = defineProps({
  showAll: {
    type: Boolean,
    default: false,
  },
  headers: {
    type: Array,
    default: [],
  },
  items: {
    type: Array,
    default: [],
  },
  pageOptions: {
    type: Object,
    default: {},
  },
  hideDefaultFooter: {
    type: Boolean,
    default: false,
  },
  tableFooter: {
    type: Boolean,
    default: false,
  },
  selected: {
    type: Array,
  },
  isMultipleSelect: {
    type: Boolean,
    default: false,
  },
  stickyHeader: {
    type: Boolean,
    default: true,
  },
  dense: {
    type: Boolean,
    default: false,
  },
  draggable: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  /**
   * @param sortBy [[key, 'desc'|'asc'], ...]
   */
  sortBy: Array,
})

const itemsRef = toRef(props, 'items')
const selectedRef = toRef(props, 'selected')

const emit = defineEmits(['pageChange', 'update:selected', 'select', 'update:sortBy', 'sort'])

const vDataTable = ref(null)

const sortIconHandler = (key) => {
  const i = props.sortBy.findIndex((item) => item?.[0] === key)

  if (i === -1) return 'sort'
  switch (props.sortBy[i][1]) {
    case 'desc':
      return 'sort-up'
    case 'asc':
      return 'sort-down'
  }
}

const sort = (key) => {
  const i = props.sortBy.findIndex((item) => item?.[0] === key)

  const _sortBy = _.cloneDeep(props.sortBy)
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

const filterItem = (item) => {
  const object = {}
  _.forEach(props.headers, (headerItem) => {
    object[headerItem.value] = _.get(item, headerItem.value)
  })
  return object
}

const rowRef = ref([])

const selectedCheck = (rowItem) => {
  return _.findIndex(selectedRef.value, { item: rowItem }) === -1 ? false : true
}

onUpdated(() => {
  _.forEachRight(rowRef.value, (item, index) => {
    if (item === null) {
      rowRef.value.splice(index, 1)
    }
  })
})

const templateSelected = ref([])

const rowSelect_mousedown = (evt, rowItem, rowIndex) => {
  if (props.isMultipleSelect === true) {
    if (window.event.ctrlKey === true) {
      const index = _.findIndex(selectedRef.value, {
        item: rowItem,
        index: rowIndex,
      })
      if (index === -1) {
        selectedRef.value.push({ item: rowItem, index: rowIndex })
      } else {
        selectedRef.value.splice(index, 1)
      }
      fromIndex.value = rowIndex
    } else {
      emit('update:selected', [{ item: rowItem, index: rowIndex }])
      fromIndex.value = rowIndex
    }

    const rowSelect_mouseoutBind = rowSelect_mouseout.bind(null, rowIndex)
    evt.currentTarget.addEventListener('mouseout', rowSelect_mouseoutBind, {
      once: true,
    })

    const rowSelect_mouseenterBind = {}
    _.forEach(itemsRef.value, (item, index) => {
      rowSelect_mouseenterBind[index] = rowSelect_mouseenter.bind(this, index)
    })

    _.forEach(rowRef.value, (item, index) => {
      item.addEventListener('mouseenter', rowSelect_mouseenterBind[index])
    })

    window.addEventListener(
      'mouseup',
      () => {
        _.forEach(rowRef.value, (item, index) => {
          item.removeEventListener('mouseenter', rowSelect_mouseenterBind[index])
          item.removeEventListener('mouseout', rowSelect_mouseoutBind[index])
        })

        fromIndex.value = null
        preIndex.value = null
        toIndex.value = null
        moveType.value = null
      },
      { once: true }
    )
  } else {
    evt.currentTarget.addEventListener(
      'mouseup',
      () => {
        emit('update:selected', [{ item: rowItem, index: rowIndex }])
        emit('select', { item: rowItem, index: rowIndex })
      },
      { once: true }
    )
  }
}

const fromIndex = ref(null)
const preIndex = ref(null)
const toIndex = ref(null)
const moveType = ref(null) // up, down

const rowSelect_mouseenter = (rowIndex, evt) => {
  toIndex.value = rowIndex

  if (fromIndex.value > toIndex.value) {
    moveType.value = 'up'
  } else if (fromIndex.value < toIndex.value) {
    moveType.value = 'down'
  }

  const rowSelect_mouseoutBind = rowSelect_mouseout.bind(null, rowIndex)
  evt.currentTarget.addEventListener('mouseout', rowSelect_mouseoutBind, {
    once: true,
  })

  switch (moveType.value) {
    case 'up':
      if (toIndex.value >= preIndex.value) {
        if (window.event.ctrlKey === true) {
          for (let i = preIndex.value; i < toIndex.value; i++) {
            const index = _.findIndex(templateSelected.value, {
              item: itemsRef.value[i],
              index: i,
            })
            if (index === -1) {
              selectedRef.value.splice(_.findIndex(selectedRef.value, { index: i }), 1)
            } else {
              selectedRef.value.push(templateSelected.value.splice(index, 1)[0])
            }
          }
        } else {
          for (let i = preIndex.value; i < toIndex.value; i++) {
            selectedRef.value.splice(_.findIndex(selectedRef.value, { index: i }), 1)
          }
        }
        if (toIndex.value === fromIndex.value) {
          moveType.value = null
        }
      } else {
        if (preIndex.value > fromIndex.value) {
          // 選取方向由 down 到 up
          if (window.event.ctrlKey === true) {
            for (let i = preIndex.value; i > fromIndex.value; i--) {
              const index = _.findIndex(templateSelected.value, {
                item: itemsRef.value[i],
                index: i,
              })
              if (index === -1) {
                selectedRef.value.splice(_.findIndex(selectedRef.value, { index: i }), 1)
              } else {
                selectedRef.value.push(templateSelected.value.splice(index, 1)[0])
              }
            }
            for (let i = toIndex.value; i < fromIndex.value; i++) {
              selectedRef.value.push({ item: itemsRef.value[i], index: i })
            }
          } else {
            for (let i = preIndex.value; i > fromIndex.value; i--) {
              selectedRef.value.splice(_.findIndex(selectedRef.value, { index: i }), 1)
            }
            for (let i = toIndex.value; i < fromIndex.value; i++) {
              selectedRef.value.push({ item: itemsRef.value[i], index: i })
            }
          }
        } else {
          if (window.event.ctrlKey === true) {
            for (let i = toIndex.value; i < preIndex.value; i++) {
              const index = _.findIndex(selectedRef.value, {
                item: itemsRef.value[i],
                index: i,
              })
              if (index === -1) {
                selectedRef.value.push({ item: itemsRef.value[i], index: i })
              } else {
                templateSelected.value.push(selectedRef.value.splice(index, 1)[0])
              }
            }
          } else {
            for (let i = toIndex.value; i < preIndex.value; i++) {
              selectedRef.value.push({ item: itemsRef.value[i], index: i })
            }
          }
        }
      }
      break
    case 'down':
      if (toIndex.value <= preIndex.value) {
        if (window.event.ctrlKey === true) {
          for (let i = preIndex.value; i > toIndex.value; i--) {
            const index = _.findIndex(templateSelected.value, {
              item: itemsRef.value[i],
              index: i,
            })
            if (index === -1) {
              selectedRef.value.splice(_.findIndex(selectedRef.value, { index: i }), 1)
            } else {
              selectedRef.value.push(templateSelected.value.splice(index, 1)[0])
            }
          }
        } else {
          for (let i = preIndex.value; i > toIndex.value; i--) {
            selectedRef.value.splice(_.findIndex(selectedRef.value, { index: i }), 1)
          }
        }
        if (toIndex.value === fromIndex.value) {
          moveType.value = null
        }
      } else {
        if (preIndex.value < fromIndex.value) {
          // 選取方向由 up 到 down
          if (window.event.ctrlKey === true) {
            for (let i = preIndex.value; i < fromIndex.value; i++) {
              const index = _.findIndex(templateSelected.value, {
                item: itemsRef.value[i],
                index: i,
              })
              if (index === -1) {
                selectedRef.value.splice(_.findIndex(selectedRef.value, { index: i }), 1)
              } else {
                selectedRef.value.push(templateSelected.value.splice(index, 1)[0])
              }
            }
            for (let i = toIndex.value; i > fromIndex.value; i--) {
              selectedRef.value.push({ item: itemsRef.value[i], index: i })
            }
          } else {
            for (let i = preIndex.value; i < fromIndex.value; i++) {
              selectedRef.value.splice(_.findIndex(selectedRef.value, { index: i }), 1)
            }
            for (let i = toIndex.value; i > fromIndex.value; i--) {
              selectedRef.value.push({ item: itemsRef.value[i], index: i })
            }
          }
        } else {
          if (window.event.ctrlKey === true) {
            for (let i = toIndex.value; i > preIndex.value; i--) {
              const index = _.findIndex(selectedRef.value, {
                item: itemsRef.value[i],
                index: i,
              })
              if (index === -1) {
                selectedRef.value.push({ item: itemsRef.value[i], index: i })
              } else {
                templateSelected.value.push(selectedRef.value.splice(index, 1)[0])
              }
            }
          } else {
            for (let i = toIndex.value; i > preIndex.value; i--) {
              selectedRef.value.push({ item: itemsRef.value[i], index: i })
            }
          }
        }
      }
      break
  }
}

const rowSelect_mouseout = (rowIndex) => {
  preIndex.value = rowIndex
}

const tbody = ref()

const dragging = ref(false)

const dragStart = (evt, rowIndex) => {
  dragging.value = true
  fromIndex.value = rowIndex
  evt.dataTransfer.effectAllowed = 'move'

  const dragEnterBind = {}
  _.forEach(itemsRef.value, (item, index) => {
    dragEnterBind[index] = dragEnter.bind(null, index)
  })

  _.forEach(rowRef.value, (item, index) => {
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
      _.forEach(rowRef.value, (item, index) => {
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
</script>

<style>
.progressBar-MyTable {
  height: 3px;
}
</style>

