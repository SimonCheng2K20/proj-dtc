<template>
  <q-table
    :class="{ selected: focusOptions.isFocus }"
    ref="tableRef"
    v-bind="QTableProps"
    :rows="rows"
    :columns="filterColumns"
    row-key="HospitalCode"
    :pagination="{ rowsPerPage: -1 }"
    :loading="loading"
    v-touch-pan.prevent.mouse="dragScrollHandler"
    @click.capture="focusOptions.onFocus"
    wrap-cells
  >
    <template #top>
      <slot name="top">
        <div v-if="slots['title-prepend']" class="mr-2">
          <slot name="title-prepend"></slot>
        </div>
        <div class="text-xl font-bold mr-2">手術耗材</div>
        <preset-action-btns v-if="preset && !readonly" @to-preset="toPreset" @to-preset-add="toPresetAdd">
          <template #btn-expand>
            <slot name="btn-expand"></slot>
          </template>
        </preset-action-btns>
        <q-btn
          v-if="!readonly"
          color="clear"
          label="清除"
          dense
          unelevated
          @click="emit('update:rows', [cloneDeep(rowInitData)])"
        ></q-btn>
        <q-space></q-space>
        <q-btn v-if="!readonly" color="add" icon="add" dense unelevated @click="onAddRowClick"> </q-btn>
      </slot>
    </template>

    <template #body-cell-index="{ col, rowIndex }">
      <q-td :props="{ col }">
        {{ rowIndex + 1 }}
      </q-td>
    </template>

    <template v-if="!readonly" #body-cell-HospitalCode="{ col, row, rowIndex }">
      <q-td :props="{ col }">
        <!-- 在 update:model-value 時更新其他欄位，而非在 click 時更新，避免用鍵盤選擇時不會觸發的情況 -->
        <q-select
          v-bind="QSelectProps"
          :ref="(el) => (inputRefs[`HospitalCode-${rowIndex}`] = el)"
          v-model="row.HospitalCode"
          :options="hospitalCodeFilterItems"
          option-label="filterLabel"
          use-input
          lazy-rules
          @input-value="filterLoading = true"
          @filter="(val, update) => GetMaterial(val, update, 'HospitalCode', rowIndex)"
          @clear="Object.assign(row, cloneDeep(rowInitData))"
          @update:model-value="(val) => (!!val ? onConsumablesSelect(val, row) : null)"
        >
          <template #no-option="{ inputValue }">
            <q-item v-if="!!inputValue">
              <q-item-section class="text-grey">
                <q-spinner v-if="filterLoading" color="primary"></q-spinner>
                <span v-else>找不到符合的資料</span>
              </q-item-section>
            </q-item>
          </template>
          <template #option="scope">
            <q-item
              v-bind="scope.itemProps"
              :disable="rows.find((item) => item.HospitalCode === scope.opt.HospitalCode) !== undefined"
            >
              <q-item-section>
                <q-item-label>
                  <div v-html="scope.opt.filterLabel"></div>
                </q-item-label>
                <q-item-label
                  v-if="rows.find((item) => item.HospitalCode === scope.opt.HospitalCode) !== undefined"
                  class="text-negative"
                >
                  此 院內代碼 已存在
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-td>
    </template>
    <template v-if="!readonly" #body-cell-SpecialCode="{ col, row, rowIndex }">
      <q-td :props="{ col }">
        <!-- 在 update:model-value 時更新其他欄位，而非在 click 時更新，避免用鍵盤選擇時不會觸發的情況 -->
        <div class="flex justify-between">
          <q-select
            v-bind="QSelectProps"
            :ref="(el) => (inputRefs[`SpecialCode-${rowIndex}`] = el)"
            :rules="rules.SpecialCode"
            v-model="row.SpecialCode"
            :options="hospitalCodeFilterItems"
            option-label="SpecialCode"
            use-input
            lazy-rules
            @input-value="filterLoading = true"
            @filter="(val, update) => GetMaterial(val, update, 'SpecialCode')"
            @clear="Object.assign(row, cloneDeep(rowInitData))"
            @update:model-value="(val) => (!!val ? onConsumablesSelect(val, row) : null)"
          >
            <template #no-option="{ inputValue }">
              <q-item v-if="!!inputValue">
                <q-item-section class="text-grey">
                  <q-spinner v-if="filterLoading" color="primary"></q-spinner>
                  <span v-else>找不到符合的資料</span>
                </q-item-section>
              </q-item>
            </template>
            <template #option="scope">
              <q-item
                v-bind="scope.itemProps"
                :disable="rows.find((item) => item.SpecialCode === scope.opt.SpecialCode) !== undefined"
              >
                <q-item-section>
                  <q-item-label>
                    <div v-html="scope.opt.filterLabel"></div>
                  </q-item-label>
                  <q-item-label
                    v-if="rows.find((item) => item.SpecialCode === scope.opt.SpecialCode) !== undefined"
                    class="text-negative"
                  >
                    此 特殊代碼 已存在
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template #after>
              <q-btn color="primary" icon="search" unelevated dense @click="addConsumablesSearched(rowIndex)"></q-btn>
            </template>
          </q-select>
        </div>
      </q-td>
    </template>
    <template v-if="!readonly" #body-cell-Quantity="{ col, row }">
      <q-td :props="{ col }">
        <q-input
          v-bind="QInputProps"
          v-model="row.Quantity"
          :ref="(el) => (inputRefs[`Quantity-${rowIndex}`] = el)"
          :rules="rules.Quantity"
          lazy-rules
          type="number"
          min="0"
        ></q-input>
      </q-td>
    </template>
    <template v-if="!readonly" #body-cell-action="{ col, rowIndex }">
      <q-td :props="{ col }">
        <q-btn color="delete" @click="onDeleteRowClick(rowIndex)" label="刪除" unelevated dense></q-btn>
      </q-td>
    </template>
  </q-table>
</template>

<script setup>
import { ref, reactive, watch, computed, useSlots, toRef } from 'vue'
import { QTableProps, QSelectProps, QInputProps } from 'utils/quasar-extends/base-props.js'
import { cloneDeep } from 'lodash-es'
import { getSpecialMedicalMaterial } from 'api'
import setSearchQuery from 'utils/setSearchQuery.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import { useQuasar } from 'quasar'
import { usePresetKeydown } from 'utils/preset-keydown-handler.js'
import { validate } from 'utils/quasar-extends/validate.js'
import { usePresetStore } from 'stores/preset.js'
import dayjs from 'dayjs'

import PresetActionBtns from './PresetActionBtns.vue'
import ConsumablesPreset from './ConsumablesPreset.vue'
import ConsumablesPresetEditItem from './ConsumablesPresetEditItem.vue'
import ConsumablesSearchedAdd from './ConsumablesSearchedAdd.vue'

const $q = useQuasar()
const presetStore = usePresetStore()
const slots = useSlots()
const props = defineProps({
  rows: Array,
  columns: Array,
  preset: Boolean,
  loading: Boolean,
  readonly: Boolean,

  onToPreset: Function,
  onToPresetAdd: Function,

  useHotkey: {
    type: Boolean,
    default: true,
  },
  presetHotkeyItems: Array,
})

const presetHotkeyItems = computed(() => props.presetHotkeyItems || presetStore.presetItems.Consumable)
const emit = defineEmits(['update:rows', 'preset-keydown'])

const columns = [
  { name: 'index', label: '序號', field: 'index', align: 'center', headerClasses: 'sticky top-0 z-10 w-[56px]' },
  {
    name: 'HospitalCode',
    label: '院內代碼',
    field: 'HospitalCode',
    align: 'left',
    headerClasses: 'sticky top-0 z-10 w-[200px]',
  },
  {
    name: 'SpecialCode',
    label: '特殊代碼',
    field: 'SpecialCode',
    align: 'left',
    headerClasses: 'sticky top-0 z-10 w-[200px]',
  },
  { name: 'Cname', label: '中文名稱', field: 'Cname', align: 'center', headerClasses: 'sticky top-0 z-10 ' },
  {
    name: 'Category',
    label: '功能類別',
    field: 'Category',
    align: 'center',
    headerClasses: 'sticky top-0 z-10 w-[100px]',
  },
  { name: 'Quantity', label: '數量', field: 'Quantity', align: 'center', headerClasses: 'sticky top-0 z-10 w-[120px]' },
  { name: 'Unit', label: '單位', field: 'Unit', align: 'center', headerClasses: 'sticky top-0 z-10 w-[60px]' },
  { name: 'PayPoint', label: '單價', field: 'PayPoint', align: 'center', headerClasses: 'sticky top-0 z-10 w-[60px]' },
  {
    name: 'TotalAmount',
    label: '總價',
    field: 'TotalAmount',
    align: 'center',
    headerClasses: 'sticky top-0 z-10 w-[60px]',
  },
  { name: 'date', label: '手術日期', field: 'date', align: 'center', headerClasses: 'sticky top-0 z-10 w-[160px]' },
  { name: 'action', label: '操作', field: 'action', align: 'center', headerClasses: 'sticky top-0 z-10 w-[68px]' },
]

const rowInitData = {
  HospitalCode: null,
  SpecialCode: null,
  Cname: null,
  Category: null,
  Quantity: null,
  Unit: null,
  PayPoint: null,
  TotalAmount: null,
  date: null,
}

const filterColumns = computed(() => {
  if (props.columns) {
    return columns.filter((item) => props.columns.includes(item.name))
  } else {
    return columns
  }
})

const tableRef = ref()
const tableMiddleRef = ref()
const unwatch = watch(tableRef, (val) => {
  tableMiddleRef.value = val.$el.querySelector('.q-table__middle')
  unwatch()
})

const dragScrollHandler = (evt) => {
  tableMiddleRef.value.scrollLeft -= evt.delta.x
}

const onAddRowClick = () => {
  emit('update:rows', props.rows.concat(cloneDeep(rowInitData)))
}

const onDeleteRowClick = (rowIndex) => {
  emit('update:rows', props.rows.slice(0, rowIndex).concat(props.rows.slice(rowIndex + 1)))
}

const toPreset = () => {
  if (props.onToPreset) {
    props.onToPreset()
    return
  }
  const dialog = $q.dialog({
    component: ConsumablesPreset,
    componentProps: {
      columns: props.columns,
      onPaste(pasteRows) {
        emit('update:rows', pasteRows)
        dialog.hide()
      },
    },
  })
}

const toPresetAdd = () => {
  console.log(props.rows)
  if (props.onToPresetAdd) {
    props.onToPresetAdd()
    return
  }
  const dialog = $q.dialog({
    component: ConsumablesPresetEditItem,
    componentProps: {
      editType: 'add',
      tableData: props.rows,
      columns: props.columns,
    },
  })
}

const inputRefs = reactive({})

const reg = /^[1-9][0-9]*$/

const rules = {
  SpecialCode: [(val) => !!val || '請輸入 特殊代碼'],
  Quantity: [(val) => reg.test(val) || '需整數'],
}

const filterLoading = ref(false)
const hospitalCodeFilterCount = ref(0) // 確定 API 返回的是最後一次的資料，避免第一次 GET 較第二次慢而帶入第一次資料的狀況
const hospitalCodeFilterItems = ref([])
const GetMaterial = async (val, update, key, rowIndex) => {
  filterLoading.value = true
  const selfFilterCount = hospitalCodeFilterCount.value
  try {
    const query = setSearchQuery({
      $top: 25,
      $filter: `contains(${key},'${val}') `,
    })
    const res = await getSpecialMedicalMaterial(query)
    if (res.status === 200 || res.status === 204) {
      if (selfFilterCount === hospitalCodeFilterCount.value) {
        setTimeout(() => {
          update(
            () => {
              hospitalCodeFilterItems.value = cloneDeep(res.data.Items)
              hospitalCodeFilterItems.value.forEach((item) => {
                item.filterLabel = `${item.HospitalCode} - ${item.SpecialCode} - ${item.Cname}`
                item.filterLabel = highlightText(val, item.filterLabel)
              })
            },
            (ref) => {
              ref.moveOptionSelection(1, true)
            }
          )
        }, 0)
      }
    }
  } catch (err) {
    console.log(err)
  } finally {
    filterLoading.value = false
    if (selfFilterCount === hospitalCodeFilterCount.value) hospitalCodeFilterCount.value = 0
  }
}

const highlightText = (val, text) => {
  const regex = new RegExp(`(${val})`, 'g')
  return text.replace(regex, '<span class="bg-amber-300">$1</span>')
}

const onConsumablesSelect = (opt, row) => {
  row.HospitalCode = opt.HospitalCode
  row.SpecialCode = opt.SpecialCode
  row.PayPoint = opt.PayPoint
  row.Quantity = 1
  row.Unit = opt.Unit
  row.Cname = opt.Cname
  row.Category = opt.CategoryName
  row.date = dayjs(new Date()).format('YYYY-MM-DD')
  const rounded = Math.round((row.Quantity * row.PayPoint + Number.EPSILON) * 100) / 100 //取到小數點後兩位
  row.TotalAmount = rounded
}

const presetItems = ref([])

const presetKeydownCallback = (item) => {
  emit('preset-keydown', item.OperationMaterialPresetItems)
  emit('update:rows', item.OperationMaterialPresetItems)
}

const focusOptions = reactive({
  isFocus: false,
  onFocus: null,
})

defineExpose({
  onAddRowClick,
  validate: () => validate(inputRefs),
})

const addConsumablesSearched = (rowIndex) => {
  const dialog = $q
    .dialog({
      component: ConsumablesSearchedAdd,
    })
    .onOk((addConsumablesSearched) => {
      const newTable = cloneDeep(props.rows)
      newTable[rowIndex] = addConsumablesSearched
      if (props.rows.find((item) => item.HospitalCode === addConsumablesSearched.HospitalCode) !== undefined) {
        $q.notify({
          type: 'negative',
          message: '此手術耗材代碼已存在!',
          position: 'top',
        })
        dialog.show()
      } else {
        emit('update:rows', newTable)
      }
    })
}

const init = async () => {
  if (props.readonly) return
  if (props.useHotkey) {
    if (!presetHotkeyItems.value) presetStore.getPreset('Consumable')

    const { isFocus, onFocus } = usePresetKeydown({
      presetItems: props.presetHotkeyItems ? presetHotkeyItemsRef : presetItems,
      target: tableRef,
      callback: presetKeydownCallback,
    })

    Object.assign(focusOptions, { isFocus, onFocus })
  }
}
init()
</script>
