<template>
  <q-table
    :class="{ selected: focusOptions.isFocus }"
    ref="tableRef"
    v-bind="QTableProps"
    :rows="rows"
    :columns="filterColumns"
    row-key="Icd10Code"
    :pagination="{ rowsPerPage: -1 }"
    :loading="loading"
    v-touch-pan.prevent.mouse="dragScrollHandler"
    @click.capture="focusOptions.onFocus"
  >
    <template #top>
      <slot name="top">
        <div v-if="slots['title-prepend']" class="mr-2">
          <slot name="title-prepend"></slot>
        </div>
        <div class="text-xl font-bold mr-2">{{ title }}</div>
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
          @click="emit('update:rows', [cloneDeep(icdInitData)])"
        ></q-btn>
        <q-btn
          v-if="!readonly && DclDepartmentNo === '60'"
          class="ml-8"
          color="purple-7"
          label="中醫常用"
          dense
          unelevated
          @click="addTCMIcdSearched"
        ></q-btn>
        <q-space></q-space>
        <q-btn v-if="!readonly" color="add" icon="add" dense unelevated @click="onAddRowClick"> </q-btn>
      </slot>
    </template>

    <template #body-cell-index="{ col, rowIndex }">
      <q-td :props="{ col }">
        {{ rowIndex === 0 ? '主' : `次${rowIndex}` }}
      </q-td>
    </template>
    <template v-if="!readonly" #body-cell-Icd10Code="{ col, row, rowIndex }">
      <q-td :props="{ col }">
        <!-- 在 update:model-value 時更新其他欄位，而非在 click 時更新，避免用鍵盤選擇時不會觸發的情況 -->
        <div class="flex justify-between">
          <q-select
            class="flex items-center"
            v-bind="QSelectProps"
            :ref="(el) => (inputRefs[`Icd10Code-${rowIndex}`] = el)"
            :rules="rules.Icd10Code"
            v-model="row.Icd10Code"
            :options="icd10FilterItems"
            option-label="Icd10Code"
            use-input
            lazy-rules
            @input-value="filterLoading = true"
            @filter="(val, update) => icdFilterHandler(val, update, 'icd10', rowIndex)"
            @clear="Object.assign(row, cloneDeep(icdInitData))"
            @update:model-value="(val) => (!!val ? onIcdSelect(val, row) : null)"
            input-style="width:60px"
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
                :disable="rows.find((item) => item.Icd10Code === scope.opt.Icd10) !== undefined"
              >
                <q-item-section>
                  <q-item-label>
                    <div v-html="scope.opt.filterLabel"></div>
                  </q-item-label>
                  <q-item-label
                    v-if="rows.find((item) => item.Icd10Code === scope.opt.Icd10) !== undefined"
                    class="text-negative"
                  >
                    此 Icd-10 已存在
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
            <template #after v-if="hasLimit !== true || rowIndex !== 0">
              <q-btn
                color="primary"
                icon="search"
                unelevated
                dense
                @click="addIcdSearched(rowIndex)"
                v-if="DclDepartmentNo !== '60'"
              ></q-btn>
              <q-btn
                color="primary"
                icon="search"
                unelevated
                dense
                @click="addTCMIcd10(rowIndex)"
                v-if="DclDepartmentNo === '60'"
              ></q-btn>
            </template>
          </q-select>
        </div>
      </q-td>
    </template>
    <template v-if="!readonly" #body-cell-Icd9Code="{ col, row, rowIndex }">
      <q-td :props="{ col }">
        <!-- 在 update:model-value 時更新其他欄位，而非在 click 時更新，避免用鍵盤選擇時不會觸發的情況 -->
        <q-select
          v-bind="QSelectProps"
          :ref="(el) => (inputRefs[`Icd9Code-${rowIndex}`] = el)"
          :rules="rules.Icd9Code"
          v-model="row.Icd9Code"
          :options="icd9FilterItems"
          option-label="Icd9Code"
          use-input
          lazy-rules
          @input-value="filterLoading = true"
          @filter="(val, update) => icdFilterHandler(val, update, 'icd9', rowIndex)"
          @clear="Object.assign(row, cloneDeep(icdInitData))"
          @update:model-value="(val) => (!!val ? onIcdSelect(val, row) : null)"
          input-style="width:60px"
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
              :disable="rows.find((item) => item.Icd9Code === scope.opt.Icd9) !== undefined"
            >
              <q-item-section>
                <q-item-label>
                  <div v-html="scope.opt.filterLabel"></div>
                </q-item-label>
                <q-item-label
                  v-if="rows.find((item) => item.Icd9Code === scope.opt.Icd9) !== undefined"
                  class="text-negative"
                >
                  此 Icd-9 已存在
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
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
import { ref, reactive, watch, computed, useSlots } from 'vue'
import { QTableProps, QSelectProps } from 'utils/quasar-extends/base-props.js'
import { cloneDeep, debounce } from 'lodash-es'
import { getIcd10Cm, getIcd9Cm, getDiagnosisAllList } from 'api'
import setSearchQuery from 'utils/setSearchQuery.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import PresetActionBtns from './PresetActionBtns.vue'
import IcdPreset from './IcdPreset.vue'
import IcdPresetEditItem from './IcdPresetEditItem.vue'
import IcdSearchedAdd from './IcdSearchedAdd.vue'
import Icd10TCMAdd from './Icd10TCMAdd.vue'
import { useQuasar } from 'quasar'
import { usePresetKeydown } from 'utils/preset-keydown-handler.js'
import { validate } from 'utils/quasar-extends/validate.js'
import { useFilter } from 'utils/quasar-extends/use-filter.js'
import dayjs from 'dayjs'
import { usePresetStore } from 'stores/preset.js'

const presetStore = usePresetStore()
const $q = useQuasar()
const slots = useSlots()
const props = defineProps({
  rows: Array,
  columns: Array,
  title: {
    type: String,
    default: 'A 診斷',
  },
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

  procedureId: Number,
  DclDepartmentNo: String,
  specificDisease: Object,
})

const presetHotkeyItems = computed(() => props.presetHotkeyItems || presetStore.presetItems.Diagnosis)
const emit = defineEmits(['update:rows'])

const columns = [
  { name: 'index', field: 'index', align: 'center', headerClasses: 'sticky top-0 z-10 min-w-[44px]' },
  {
    name: 'DiagnosisDate',
    label: '開立日期',
    field: (row) => row.DiagnosisDate?.substring(0, 10) || dayjs().format('YYYY-MM-DD'),
    align: 'center',
    headerClasses: 'sticky top-0 z-10 min-w-[60px] whitespace-nowrap',
    classes: 'whitespace-nowrap',
  },
  {
    name: 'Icd10Code',
    label: 'ICD-10',
    field: 'Icd10Code',
    align: 'left',
    headerClasses: 'sticky top-0 z-10 min-w-[224px]',
  },
  {
    name: 'Icd9Code',
    label: 'ICD-9',
    field: 'Icd9Code',
    align: 'left',
    headerClasses: 'sticky top-0 z-10 min-w-[180px]',
  },
  {
    name: 'Name',
    label: '診斷',
    field: (row) => row.Icd10Cht || row.Icd10Eng || row.Icd9Cht || row.Icd9Eng,
    align: 'left',
    headerClasses: 'sticky top-0 z-10',
  },
  { name: 'action', label: '操作', field: 'action', align: 'center', headerClasses: 'sticky top-0 z-10 min-w-[60px]' },
]

const icdInitData = {
  DiagnosisDate: null,
  Icd10Code: null,
  Icd9Code: null,
  Icd10Cht: null,
  Icd10Eng: null,
  Icd9Cht: null,
  Icd9Eng: null,
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
  emit('update:rows', props.rows.concat(cloneDeep(icdInitData)))
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
    component: IcdPreset,
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
  if (props.onToPresetAdd) {
    props.onToPresetAdd()
    return
  }
  const dialog = $q.dialog({
    component: IcdPresetEditItem,
    componentProps: {
      editType: 'add',
      rows: props.rows,
      columns: props.columns,
    },
  })
}

const inputRefs = reactive({})
const rules = {
  Icd10Code: [(val) => !!val || '請輸入 Icd-10'],
}

const icdFilter = (searchString, searchKeys) => {
  return searchKeys
    .reduce((filterArray, key) => {
      if (isValidSearchValue(searchString)) {
        switch (key) {
          case 'Icd10':
          case 'Icd9':
            return filterArray.concat(setOdataFilter({ key, value: searchString, operator: 'startswith' }))
          case 'Icd10Eng':
          case 'Icd10Cht':
          case 'Icd9Eng':
          case 'Icd9Cht':
            return filterArray.concat(setOdataFilter({ key, value: searchString, operator: 'contains' }))
          default:
            return filterArray
        }
      } else {
        return filterArray
      }
    }, [])
    .join(' or ')
}

const filterLoading = ref(false)
const icd10FilterCount = ref(0) // 確定 API 返回的是最後一次的資料，避免第一次 GET 較第二次慢而帶入第一次資料的狀況
const icd10Items = ref([])
const icd10FilterKeys = ['Icd10', 'Icd10Eng', 'Icd10Cht']
const GetIcd10Cm = async (searchString, isIcd10ItemsLess50) => {
  // 取得 Icd 時優先搜尋 Icd10 ，若 items 不滿 50 才接著搜尋藥品名稱
  if (!isIcd10ItemsLess50) icd10FilterCount.value++
  const selfFilterCount = icd10FilterCount.value
  const searchKeys = isIcd10ItemsLess50 ? icd10FilterKeys.slice(1) : icd10FilterKeys.slice(0, 1)
  try {
    const query = setSearchQuery({
      $top: 50,
      $filter: icdFilter(searchString, searchKeys),
    })
    const res = await getIcd10Cm(query)
    if (selfFilterCount === icd10FilterCount.value) {
      const resultItems = res.data.Items
      if (isIcd10ItemsLess50) {
        icd10Items.value = icd10Items.value.concat(resultItems)
      } else {
        icd10Items.value = resultItems
      }
    }
  } catch (error) {
    console.log(error)
  } finally {
    if (selfFilterCount === icd10FilterCount.value) icd10FilterCount.value = 0
  }
}

const icd9FilterCount = ref(0) // 確定 API 返回的是最後一次的資料，避免第一次 GET 較第二次慢而帶入第一次資料的狀況
const icd9Items = ref([])
const icd9FilterKeys = ['Icd9', 'Icd9Eng', 'Icd9Cht']
const GetIcd9Cm = async (searchString, isIcd9ItemsLess50) => {
  if (!isIcd9ItemsLess50) icd9FilterCount.value++
  const selfFilterCount = icd9FilterCount.value
  const searchKeys = isIcd9ItemsLess50 ? icd9FilterKeys.slice(1) : icd9FilterKeys.slice(0, 1)
  try {
    const query = setSearchQuery({
      $top: 50,
      $filter: icdFilter(searchString, searchKeys),
    })
    const res = await getIcd9Cm(query)
    if (selfFilterCount === icd9FilterCount.value) {
      const resultItems = res.data.Items
      if (isIcd9ItemsLess50) {
        icd9Items.value = icd9Items.value.concat(resultItems)
      } else {
        icd9Items.value = resultItems
      }
    }
  } catch (error) {
    console.log(error)
  } finally {
    if (selfFilterCount === icd9FilterCount.value) icd9FilterCount.value = 0
  }
}

const hasLimit = ref(false)
const GetDiagnosisAllList = async () => {
  try {
    const query = setSearchQuery({ procedureId: props.procedureId })
    const res = await getDiagnosisAllList(query)
    if (res.status === 200) {
      if (res.data.length !== 0) {
        icd10Items.value = res.data
        hasLimit.value = true
      } else {
        hasLimit.value = false
      }
    }
  } catch (error) {
    console.log(error)
  }
}

const { filterItems: icd10FilterItems, filterHandler: icd10FilterHandler } = useFilter(
  { items: icd10Items, filterKeys: icd10FilterKeys },
  () => {
    filterLoading.value = false
  }
)

const { filterItems: icd9FilterItems, filterHandler: icd9FilterHandler } = useFilter(
  { items: icd9Items, filterKeys: icd9FilterKeys },
  () => {
    filterLoading.value = false
  }
)

const icdFilterHandler = debounce(async (val, update, key, rowIndex) => {
  filterLoading.value = true
  console.log('hasLimit.value', hasLimit.value)
  if (hasLimit.value !== true || rowIndex !== 0) {
    if (key === 'icd9') {
      await GetIcd9Cm(val)
      // if (icd9Items.value.length < 50) await GetIcd9Cm(val, true)
    } else {
      await GetIcd10Cm(val)
      // if (icd10Items.value.length < 50) await GetIcd10Cm(val, true)
    }
  } else {
    if (props.procedureId) GetDiagnosisAllList()
    if (props.specificDisease?.ProcedureId !== undefined) {
      icd10Items.value = props.specificDisease.DiagnosisRestricts
    }
  }

  if (key === 'icd9') {
    icd9FilterHandler(val, update)
  } else {
    icd10FilterHandler(val, update)
  }
}, 500)

const onIcdSelect = (opt, row) => {
  row.Icd10Code = typeof opt.Icd10 === 'string' ? opt.Icd10 : opt.Icd10[0]
  row.Icd9Code = typeof opt.Icd9 === 'string' ? opt.Icd9 : opt.Icd9[0]
  row.Icd10Cht = opt.Icd10Cht
  row.Icd10Eng = opt.Icd10Eng
  row.Icd9Cht = opt.Icd9Cht
  row.Icd9Eng = opt.Icd9Eng
}

const presetKeydownCallback = (item) => {
  emit('update:rows', item.PresetDiagnosisItems)
}

const focusOptions = reactive({
  isFocus: false,
  onFocus: null,
})

defineExpose({
  onAddRowClick,
  validate: () => validate(inputRefs),
})

const addIcdSearched = (rowIndex) => {
  //02YA0Z0
  const dialog = $q
    .dialog({
      component: IcdSearchedAdd,
      componentProps: {
        DclDepartmentNo: props.DclDepartmentNo,
      },
    })
    .onOk((addIcdSearched) => {
      const newIcdTable = cloneDeep(props.rows)
      newIcdTable[rowIndex] = addIcdSearched
      if (props.rows.find((item) => item.Icd10Code === addIcdSearched.Icd10Code) !== undefined) {
        $q.notify({
          type: 'negative',
          message: '此診斷代碼已存在!',
          position: 'top',
        })
        dialog.show()
      } else {
        emit('update:rows', newIcdTable)
      }
    })
}

const addTCMIcdSearched = () => {
  //02YA0Z0
  const dialog = $q
    .dialog({
      component: IcdSearchedAdd,
      componentProps: {
        DclDepartmentNo: props.DclDepartmentNo,
      },
    })
    .onOk((addIcdSearched) => {
      const newIcdTable = cloneDeep(props.rows).concat(addIcdSearched)
      if (props.rows.find((item) => item.Icd10Code === addIcdSearched.Icd10Code) !== undefined) {
        $q.notify({
          type: 'negative',
          message: '此診斷代碼已存在!',
          position: 'top',
        })
        dialog.show()
      } else {
        emit('update:rows', newIcdTable)
      }
    })
}

const addTCMIcd10 = (rowIndex) => {
  //02YA0Z0
  const dialog = $q
    .dialog({
      component: Icd10TCMAdd,
      componentProps: {
        DclDepartmentNo: props.DclDepartmentNo,
      },
    })
    .onOk((addIcdSearched) => {
      const newIcdTable = cloneDeep(props.rows)
      const newRow = {}
      newRow.Icd10Code = addIcdSearched.Icd10
      newRow.Icd9Code = addIcdSearched.Icd9
      newRow.Icd10Cht = addIcdSearched.Icd10Cht
      newIcdTable[rowIndex] = newRow
      if (props.rows.find((item) => item.Icd10Code === addIcdSearched.Icd10) !== undefined) {
        $q.notify({
          type: 'negative',
          message: '此診斷代碼已存在!',
          position: 'top',
        })
        dialog.show()
      } else {
        emit('update:rows', newIcdTable)
      }
    })
}

const init = async () => {
  if (props.readonly) return
  if (props.useHotkey) {
    if (!presetHotkeyItems.value) presetStore.getPreset('Diagnosis')

    const { isFocus, onFocus } = usePresetKeydown({
      presetItems: presetHotkeyItems,
      target: tableRef,
      callback: presetKeydownCallback,
    })

    Object.assign(focusOptions, { isFocus, onFocus })
  }
  if (props.procedureId) GetDiagnosisAllList()
  if (props.specificDisease?.ProcedureId !== undefined) {
    icd10Items.value = props.specificDisease.DiagnosisRestricts
    hasLimit.value = true
  }
}
init()
</script>

