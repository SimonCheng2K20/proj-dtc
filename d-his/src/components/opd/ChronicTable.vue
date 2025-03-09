<template>
  <q-table
    :class="{ selected: focusOptions.isFocus }"
    ref="tableRef"
    class="font-bold"
    v-bind="QTableProps"
    :rows="rows"
    :columns="filterColumns"
    row-key="Code"
    :pagination="{ rowsPerPage: -1 }"
    v-touch-pan.prevent.mouse="dragScrollHandler"
    @click.capture="focusOptions.onFocus"
  >
    <template #top>
      <div class="w-full flex items-center">
        <span class="text-xl mr-2">特定治療項目</span>
        <preset-action-btns v-if="preset && !readonly" @to-preset="toPreset" @to-preset-add="toPresetAdd">
        </preset-action-btns>
        <q-btn
          label="清除"
          color="clear"
          dense
          unelevated
          v-if="!readonly"
          @click="emit('update:rows', [cloneDeep(initRow)])"
        ></q-btn>
        <q-space></q-space>
        <q-btn class="mr-2" color="primary" label="試辦計畫" dense unelevated @click="openTestProjectDialog"> </q-btn>
        <q-btn color="add" icon="add" dense unelevated @click="addRow" :disable="rows.length > 3" v-if="!readonly">
        </q-btn>
      </div>
    </template>
    <template #body-cell-index="{ col, rowIndex }">
      <q-td :props="{ col }"> {{ rowIndex === 0 ? '治療項目代號1' : '治療項目代號' + (rowIndex + 1) }}</q-td>
    </template>
    <template #body-cell-Code="{ col, row, rowIndex }">
      <q-td :props="{ col }">
        <q-select
          class="flex items-center"
          v-bind="QSelectProps"
          v-model="row.Code"
          :ref="(el) => (inputRefs[`Code-${rowIndex}`] = el)"
          :rules="rules.Code"
          :options="chronicFilterItems"
          option-label="filterLabel"
          use-input
          @input-value="filterLoading = true"
          @filter="(val, update) => chronicFilterHandler(val, update, rowIndex)"
          @update:model-value="(val) => (!!val ? onChronicItemSelect(val, row) : null)"
          input-style="width:60px"
        >
          <template #no-option="{ inputValue }">
            <q-item v-if="!!inputValue">
              <q-item-section class="text-grey">
                <q-spinner v-if="filterLoading" color="primary"></q-spinner>
                <span v-else> 找不到符合的資料 </span>
              </q-item-section>
            </q-item>
          </template>
          <template #option="scope">
            <q-item v-bind="scope.itemProps" :disable="rows.find((item) => item.Code === scope.opt.Code) !== undefined">
              <q-item-section>
                <q-item-label>
                  <div v-html="scope.opt.filterLabel"></div>
                </q-item-label>
                <q-item-label
                  v-if="rows.find((item) => item.Code === scope.opt.Code) !== undefined"
                  class="text-negative"
                >
                  此 特定診療 已存在
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
          <template #after>
            <q-btn color="primary" icon="search" unelevated dense @click="addChronicSearched(rowIndex)"></q-btn>
          </template>
        </q-select>
      </q-td>
    </template>
    <template #body-cell-action="{ col, rowIndex }" v-if="!readonly">
      <q-td :props="{ col }">
        <q-btn color="delete" label="刪除" unelevated dense @click="onDeleteRowClick(rowIndex)"></q-btn>
      </q-td>
    </template>
  </q-table>
</template>

<script setup>
import { ref, reactive, computed, watch, nextTick } from 'vue'
import { getSpecialCureChronicItem, getSpecialTherapy } from 'api'
import { useQuasar } from 'quasar'
import { cloneDeep, includes } from 'lodash-es'
import { QSelectProps, QTableProps } from 'utils/quasar-extends/base-props.js'
import { usePresetKeydown } from 'utils/preset-keydown-handler.js'
import { useFilter } from 'utils/quasar-extends/use-filter.js'
import { useRequired } from 'utils/rules.js'
import { usePresetStore } from 'stores/preset.js'
import setSearchQuery from 'utils/setSearchQuery.js'
import { validate } from 'utils/quasar-extends/validate.js'

import PresetActionBtns from './PresetActionBtns.vue'
import ChronicSearchAdd from './ChronicSearchAdd.vue'
import ChronicPreset from './ChronicPreset.vue'
import ChronicPresetEditItem from './ChronicPresetEditItem.vue'
import TestProjectDialog from './TestProjectDialog.vue'

const $q = useQuasar()
const presetStore = usePresetStore()
const emit = defineEmits(['update:rows', 'setCaseType'])

const props = defineProps({
  rows: Array,
  columns: Array,
  readonly: Boolean,
  procedureId: Number,
  loading: Boolean,

  preset: Boolean,
  presetHotkeyItems: Array,
  DclDepartmentNo: String,
})
//組套相關
const focusOptions = reactive({
  isFocus: false,
  onFocus: null,
})
const presetHotkeyItems = computed(() => props.presetHotkeyItems || presetStore.presetItems.Chronic)

const presetKeydownCallback = (item) => {
  emit('update:rows', item.SpecialCureItemPresetItems)
}

const toPreset = () => {
  if (props.onToPreset) {
    props.onToPreset()
    return
  }
  const dialog = $q.dialog({
    component: ChronicPreset,
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
    component: ChronicPresetEditItem,
    componentProps: {
      editType: 'add',
      rows: props.rows,
      columns: props.columns,
    },
  })
}

//table相關
const basicColumns = [
  {
    name: 'index',
    label: '項次',
    field: 'index',
    align: 'center',
    headerClasses: ' w-[60px]',
    classes: 'whitespace-nowrap',
  },
  { name: 'Code', label: '代碼', field: 'Code', align: 'center', classes: ' w-[220px]' },
  { name: 'CodeName', label: '名稱', field: (row) => row.CodeName || row.Name, align: 'left', classes: ' w-[320px]' },
  { name: 'action', label: '操作', field: 'action', align: 'center', headerClasses: ' w-[68px]' },
]

//dropdown select 相關
const filterColumns = computed(() => {
  if (props.readonly) {
    basicColumns.filter((i) => i.field !== 'action')
  }
  if (props.columns) {
    return basicColumns.filter((item) => props.columns.includes(item.name))
  } else {
    return basicColumns
  }
})

const filterLoading = ref(false)
const chronicFilterKeys = ['Code', 'Name']
const chronicCodeSelection = ref([])

const inputRefs = reactive({})
const rules = {
  Code: useRequired({ title: '特定治療代碼', type: 'select' }),
}

const { filterItems: chronicFilterItems, filterHandler: chronicCodeFilterHandler } = useFilter(
  { items: chronicCodeSelection, filterKeys: chronicFilterKeys },
  () => {
    filterLoading.value = false
  }
)

const chronicFilterHandler = async (val, update, rowIndex) => {
  filterLoading.value = true
  await GetSpecialCureChronicItem(val, rowIndex)
  chronicCodeFilterHandler(val, update)
}

const GetSpecialCureChronicItem = async (searchString) => {
  const query = setSearchQuery({
    $top: 50,
    $filter: `startswith(Code,'${searchString}')`,
  })
  try {
    const res = await getSpecialCureChronicItem(query)
    if (res.status === 200) {
      chronicCodeSelection.value = res.data.Items
    }
  } catch (err) {
    console.log(err)
  }
}
const initRow = {
  Code: null,
  CodeName: null,
}

const testProjectTable = ref([])
const GetSpecialTherapy = async () => {
  const query = setSearchQuery({
    $top: 50,
    $skip: 133,
  })
  try {
    const res = await getSpecialTherapy(query)
    if (res.status === 200) {
      testProjectTable.value = res.data.Items
    }
  } catch (err) {
    console.log(err)
  }
}

const onChronicItemSelect = (opt, row) => {
  row.Code = opt.Code
  row.CodeName = opt.Name
  row.CategoryName = opt.CategoryName
  row.Category = opt.Category
  effectCaseType()
}
const effectCaseType = () => {
  // 處理案件分類
  let project = {}
  let searchConditions = []
  for (let i = 0; i < props.rows.length; i++) {
    searchConditions.push(`item?.CureItemNo${i + 1}?.split('、').includes(props.rows[${i}].Code)`)
  }
  const searchFunction = new Function('item', 'props', `return ${searchConditions.join(' && ')};`)

  project = testProjectTable.value.find((item) => {
    return searchFunction(item, props)
  })

  if (project !== undefined && project.CaseType.length === 2) {
    emit('setCaseType', 'chronic', project.CaseType)
  } else {
    emit('setCaseType', 'chronic')
  }
}

const tableRef = ref()
const tableMiddleRef = ref()
const unwatch = watch(tableRef, (val) => {
  tableMiddleRef.value = val.$el.querySelector('.q-table__middle')
  unwatch()
})

const dragScrollHandler = (evt) => {
  tableMiddleRef.value.scrollLeft -= evt.delta.x
}

const addRow = () => {
  emit('update:rows', props.rows.concat([cloneDeep(initRow)]))
}
const onDeleteRowClick = (rowIndex) => {
  emit('update:rows', props.rows.slice(0, rowIndex).concat(props.rows.slice(rowIndex + 1)))
}

const addChronicSearched = (rowIndex) => {
  //02YA0Z0
  const dialog = $q
    .dialog({
      component: ChronicSearchAdd,
      componentProps: {
        rowIndex: rowIndex,
        DclDepartmentNo: props.DclDepartmentNo,
      },
    })
    .onOk((addChronicSearched) => {
      const newChronicTable = cloneDeep(props.rows)
      newChronicTable[rowIndex] = addChronicSearched
      if (props.rows.find((item) => item.Code === addChronicSearched.Code) !== undefined) {
        $q.notify({
          type: 'negative',
          message: '此特定治療代碼已存在!',
          position: 'top',
        })
        dialog.show()
      } else {
        emit('update:rows', newChronicTable)
      }
      nextTick(() => {
        effectCaseType()
      })
    })
}
const openTestProjectDialog = () => {
  const dialog = $q.dialog({
    component: TestProjectDialog,
    componentProps: {
      DclDepartmentNo: props.DclDepartmentNo,
    },
  })
}
defineExpose({ validate: () => validate(inputRefs) })

const init = async () => {
  if (!presetHotkeyItems.value) presetStore.getPreset('Chronic')

  const { isFocus, onFocus } = usePresetKeydown({
    presetItems: presetHotkeyItems,
    target: tableRef,
    callback: presetKeydownCallback,
  })

  Object.assign(focusOptions, { isFocus, onFocus })

  GetSpecialCureChronicItem()
  GetSpecialTherapy()
}
init()
</script>

