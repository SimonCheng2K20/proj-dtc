<template>
  <q-table
    :class="{ selected: focusOptions.isFocus }"
    ref="tableRef"
    v-bind="QTableProps"
    :rows="rows"
    :columns="filterColumns"
    row-key="ProcedureCode"
    :pagination="{ rowsPerPage: -1 }"
    :loading="loading"
    v-touch-pan.prevent.mouse="dragScrollHandler"
    @click.capture="focusOptions.onFocus"
    @row-click="onRowSelect"
    :selected="rowSelected"
    wrap-cells
  >
    <template #top>
      <div v-if="slots['title-prepend']" class="mr-2">
        <slot name="title-prepend"></slot>
      </div>
      <div class="text-xl font-bold mr-2">{{ title }}</div>
      <preset-action-btns
        v-if="preset && !readonly"
        @to-preset="toPreset"
        @to-preset-add="toPresetAdd"
      ></preset-action-btns>
      <q-btn
        v-if="!readonly"
        color="clear"
        label="清除"
        dense
        unelevated
        @click="emit('update:rows', [cloneDeep(procedureInitData)])"
      ></q-btn>

      <template v-if="isShowExamination">
        <q-btn
          v-if="!readonly"
          class="ml-2"
          text-color="black"
          color="amber-1"
          label="列印檢驗單"
          dense
          unelevated
        ></q-btn>
        <q-btn
          v-if="!readonly"
          class="ml-2"
          color="green-6"
          label="檢驗排程"
          dense
          unelevated
          @click="toProcedureBooking"
        ></q-btn>
      </template>
      <q-space></q-space>
      <q-btn v-if="!readonly" color="add" icon="add" dense unelevated @click="onAddRowClick"></q-btn>
    </template>

    <template #body-cell-index="{ col, rowIndex }">
      <q-td :props="{ col }">
        {{ rowIndex + 1 }}
      </q-td>
    </template>
    <template v-if="!readonly" #body-cell-ProcedureCode="{ col, row, rowIndex }">
      <q-td :props="{ col }">
        <!-- 在 update:model-value 時更新其他欄位，而非在 click 時更新，避免用鍵盤選擇時不會觸發的情況 -->
        <q-select
          v-bind="QSelectProps"
          :ref="(el) => (inputRefs[`ProcedureCode-${rowIndex}`] = el)"
          :rules="rules.ProcedureCode"
          v-model="row.ProcedureCode"
          :options="procedureFilterItems"
          option-label="ProcedureCode"
          use-input
          lazy-rules
          @input-value="filterLoading = true"
          @filter="(val, update) => procedureFilterHandler(val, update, rowIndex)"
          @clear="Object.assign(row, cloneDeep(procedureInitData))"
          @update:model-value="(val) => (!!val ? onProcedureSelect(val, row) : null)"
          input-style="width:100px"
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
              :disable="rows.find((item) => item.ProcedureCode === scope.opt.ProcedureCode) !== undefined && !isDental"
            >
              <q-item-section>
                <q-item-label>
                  <div v-html="scope.opt.filterLabel"></div>
                </q-item-label>
                <q-item-label
                  v-if="rows.find((item) => item.ProcedureCode === scope.opt.ProcedureCode) !== undefined && !isDental"
                  class="text-negative"
                >
                  此 檢查治療 已存在
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
          <template #after>
            <q-btn color="primary" icon="search" unelevated dense @click="addProcedureSearched(rowIndex)"></q-btn>
          </template>
        </q-select>
      </q-td>
    </template>
    <template v-if="!readonly" #body-cell-SelfPayFlag="{ col, row, rowIndex }">
      <q-td :props="{ col }">
        <q-select
          v-bind="QSelectProps"
          :ref="(el) => (inputRefs[`SelfPayFlag-${rowIndex}`] = el)"
          :rules="row.ProcedureCode ? rules.SelfPayFlag : undefined"
          v-model="row.SelfPayFlag"
          :options="selfPayItems"
          option-label="label"
          option-value="value"
          map-options
          emit-value
          :clearable="false"
        >
        </q-select>
      </q-td>
    </template>
    <template v-if="!readonly" #body-cell-SelfFlag="{ col, row, rowIndex }">
      <q-td :props="{ col }">
        <q-select
          v-bind="QSelectProps"
          :ref="(el) => (inputRefs[`SelfFlag-${rowIndex}`] = el)"
          :rules="row.ProcedureCode ? rules.SelfFlag : undefined"
          v-model="row.SelfFlag"
          :options="selfPayItems"
          option-label="label"
          option-value="value"
          map-options
          emit-value
          :clearable="false"
        >
        </q-select>
      </q-td>
    </template>
    <template v-if="!readonly" #body-cell-Amount="{ col, row, rowIndex }">
      <q-td :props="{ col }">
        <q-input
          v-bind="QInputProps"
          :ref="(el) => (inputRefs[`Amount-${rowIndex}`] = el)"
          :rules="row.ProcedureCode ? rules.Amount : undefined"
          v-model="row.Amount"
          type="number"
        ></q-input>
      </q-td>
    </template>
    <template #body-cell-TreatmentSites="{ col, row }">
      <q-td :props="{ col }">
        <div v-if="readonly">
          {{ row.TreatmentSitesName }}
        </div>
        <div v-else-if="isDental" class="flex flex-nowrap">
          <div class="flex items-center mr-1">
            <img style="width: 28px" :src="teethPic" alt="" @click="toOpdDental(row)" />
          </div>
          <p
            class="p-2 border border-solid border-[#215dbb] grow text-left"
            style="min-height: 40px; line-height: 22px"
          >
            {{ row.TreatmentSites.length > 0 ? row.TreatmentSites.join(' , ') : '' }}
          </p>
        </div>
        <q-select
          ref="TreatmentSitesRef"
          v-bind="QSelectProps"
          v-model="row.TreatmentSites"
          :options="setSiteRestrictsItems(row)"
          option-label="Name"
          option-value="No"
          map-options
          emit-value
          use-chips
          multiple
          :clearable="false"
          @filter="(val, update) => getTreatmentSiteRestricts(row, val, update)"
          v-else
        >
          <template #no-option>
            <q-item>
              <q-item-section class="text-grey">
                <span>請先選擇治療處置代碼</span>
              </q-item-section>
            </q-item>
          </template>
          <template #option="scope">
            <q-item>
              <q-item-section>
                <q-checkbox size="sm" v-model="row.TreatmentSites" :val="scope.opt.No" :label="scope.opt.Name" />
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-td>
    </template>
    <template #body-cell-ToothSurface="{ col, row, rowIndex }">
      <q-td :props="{ col, row, rowIndex }">
        <q-select
          v-bind="QSelectProps"
          v-model="row.IntArrToothSurfaceCombination"
          :options="toothSurfaceOptions"
          option-label="CName"
          option-value="ToothSurfaceCode"
          map-options
          emit-value
          use-chips
          multiple
          :ref="(el) => (inputRefs[`ToothSurface-${rowIndex}`] = el)"
          :rules="Math.sign(row.RequiredToothSurfaces) === 1 ? rules.ToothSurface(row) : undefined"
          @update:model-value="(val) => onToothSurface(val, row)"
          :loading="toothSurfaceLoading"
          :disable="!row.RequiredToothSurfaces && !readonly"
          :clearable="false"
          :readonly="readonly"
        >
          <template #no-option>
            <q-item>
              <q-item-section class="text-grey">
                <span>無資料</span>
              </q-item-section>
            </q-item>
          </template>
          <template #option="scope">
            <q-item>
              <q-item-section>
                <q-checkbox
                  size="sm"
                  v-model="row.IntArrToothSurfaceCombination"
                  :val="scope.opt.ToothSurfaceCode"
                  :label="scope.opt.CName"
                  @update:model-value="(val) => onToothSurface(val, row)"
                />
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-td>
    </template>
    <template #body-cell-EmergencyFlag="{ col, row }">
      <q-td :props="{ col }">
        <q-checkbox v-if="!readonly" v-model="row.EmergencyFlag"></q-checkbox>
        <q-icon
          v-else
          :name="row.EmergencyFlag ? 'check_box' : 'check_box_outline_blank'"
          size="md"
          color="primary"
        ></q-icon>
      </q-td>
    </template>
    <template v-if="!readonly" #body-cell-Note="{ col, row }">
      <q-td :props="{ col }">
        <div class="flex flex-nowrap">
          <q-btn
            title="顯示完整註記"
            icon="book"
            text-color="info"
            unelevated
            round
            dense
            @click="toRemarkDialog(row)"
          ></q-btn>
          <q-input v-bind="QInputProps" v-model="row.Note"></q-input>
        </div>
      </q-td>
    </template>
    <template v-if="!readonly" #body-cell-StartDate="{ col, row }">
      <q-td :props="{ col }">
        <my-date-input v-bind="QInputProps" v-model="row.StartDate"></my-date-input>
      </q-td>
    </template>
    <template v-if="!readonly" #body-cell-EndDate="{ col, row }">
      <q-td :props="{ col }">
        <my-date-input v-bind="QInputProps" v-model="row.EndDate"></my-date-input>
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
import { QTableProps, QSelectProps, QInputProps } from 'utils/quasar-extends/base-props.js'
import { cloneDeep } from 'lodash-es'
import { getProcedure, getMedicalPart, getToothSurfaceCombinationList } from 'api'
import setSearchQuery from 'utils/setSearchQuery.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import { useQuasar } from 'quasar'
import { usePresetKeydown } from 'utils/preset-keydown-handler.js'
import { validate } from 'utils/quasar-extends/validate.js'
import { useRequired } from 'utils/rules.js'
import { useFilter } from 'utils/quasar-extends/use-filter.js'
import PresetActionBtns from './PresetActionBtns.vue'
import ProcedurePreset from './ProcedurePreset.vue'
import ProcedurePresetEditItem from './ProcedurePresetEditItem.vue'
import ProcedureSearchedAdd from './ProcedureSearchedAdd.vue'
import ProcedureBooking from './ProcedureBooking.vue'
import dayjs from 'dayjs'
import { usePresetStore } from 'stores/preset.js'
import RemarkDialog from './RemarkDialog.vue'
import OpdDental from 'components/opd/OpdDental.vue'
import teethPic from 'assets/teethType/teeth.png'

const presetStore = usePresetStore()
const $q = useQuasar()
const slots = useSlots()
const props = defineProps({
  rows: Array,
  columns: Array,
  title: {
    type: String,
    default: 'E 檢查治療',
  },
  preset: Boolean,
  loading: Boolean,
  readonly: Boolean,
  isShowExamination: {
    type: Boolean,
    default: true,
  },
  DclDepartmentNo: String,

  useHotkey: {
    type: Boolean,
    default: true,
  },
  presetHotkeyItems: Array,
})

const presetHotkeyItems = computed(() => props.presetHotkeyItems || presetStore.presetItems.Procedure)
const underThisNhiChap = computed(() => {
  if (props.DclDepartmentNo === '40') {
    return '3'
  } else if (props.DclDepartmentNo === '60') {
    return '4'
  } else {
    return '2'
  }
})
const emit = defineEmits(['update:rows', 'setCaseType'])

const columns = [
  {
    name: 'index',
    label: '序號',
    field: 'index',
    align: 'center',
    headerClasses: 'sticky top-0 z-10 min-w-[60px]',
  },
  {
    name: 'ProcedureDate',
    label: '開立日期',
    field: (row) => row?.ProcedureDate?.substring(0, 10) || dayjs().format('YYYY-MM-DD'),
    align: 'center',
    headerClasses: 'sticky top-0 z-10 min-w-[120px]',
  },
  {
    name: 'ProcedureCode',
    label: '治療處置代碼',
    field: 'ProcedureCode',
    align: 'center',
    headerClasses: 'sticky top-0 z-10  min-w-[120px]',
  },
  {
    name: 'Name',
    label: '治療處置名稱',
    field: (row) => row.ProcedureCname || row.ProcedureEname || row.ProcedureName,
    align: 'left',
    headerClasses: 'sticky top-0 z-10 min-w-[160px]',
  },
  {
    name: 'TreatmentSites',
    label: '檢驗/部位',
    field: 'TreatmentSites',
    align: 'center',
    headerClasses: 'sticky top-0 z-10 min-w-[260px]',
  },
  {
    name: 'ToothSurface',
    label: '牙面',
    field: 'ToothSurface',
    align: 'center',
    headerClasses: 'sticky top-0 z-10 min-w-[260px]',
  },
  {
    name: 'EmergencyFlag',
    label: '緊急',
    field: 'EmergencyFlag',
    align: 'center',
    headerClasses: 'sticky top-0 z-10 min-w-[60px]',
  },
  {
    name: 'Amount',
    label: '數量',
    field: 'Amount',
    align: 'center',
    headerClasses: 'sticky top-0 z-10 min-w-[60px]',
  },
  {
    name: 'SelfPrice',
    label: '單價',
    field: (row) => row.SelfPrice || row.Price || row.HealthPrice,
    align: 'center',
    headerClasses: 'sticky top-0 z-10 min-w-[60px]',
  },
  {
    name: 'Price',
    label: '單價',
    field: (row) => row.SelfPrice || row.Price || row.HealthPrice,
    align: 'center',
    headerClasses: 'sticky top-0 z-10 min-w-[60px]',
  },
  {
    name: 'Note',
    label: '註記',
    field: 'Note',
    align: 'left',
    headerClasses: 'sticky top-0 z-10 min-w-[180px]',
    classes: 'break-all',
  },
  {
    name: 'SelfPayFlag',
    label: '自費/健保',
    field: (row) => (row.SelfPayFlag ? '自費' : '健保'),
    align: 'center',
    headerClasses: 'sticky top-0 z-10 min-w-[120px]',
  },
  {
    name: 'SelfFlag',
    label: '自費/健保',
    field: (row) => (row.SelfFlag ? '自費' : '健保'),
    align: 'center',
    headerClasses: 'sticky top-0 z-10 min-w-[120px]',
  },
  {
    name: 'BookingStartTime',
    label: '執行開始時間',
    field: (row) => row.BookingStartTime?.substring(0, 10),
    align: 'center',
    headerClasses: 'sticky top-0 z-10 min-w-[140px]',
  },
  {
    name: 'BookingEndTime',
    label: '執行結束時間',
    field: (row) => row.BookingEndTime?.substring(0, 10),
    align: 'center',
    headerClasses: 'sticky top-0 z-10 min-w-[140px]',
  },
  {
    name: 'action',
    label: '操作',
    field: 'action',
    align: 'center',
    headerClasses: 'sticky top-0 z-10 min-w-[60px]',
  },
]

// 牙科、牙面
const toothSurfaceOptions = ref([])

const toothSurfaceLoading = ref(false)

const GetToothSurfaceCombinationList = async () => {
  try {
    toothSurfaceLoading.value = true
    const res = await getToothSurfaceCombinationList()
    if (res.status === 200) {
      toothSurfaceOptions.value = res.data
    }
  } catch (err) {
    console.log(err)
  } finally {
    toothSurfaceLoading.value = false
  }
}

const onToothSurface = (val, row) => {
  if (val.length > Math.abs(row.RequiredToothSurfaces)) {
    row.IntArrToothSurfaceCombination.splice(val.length - 2, 1)
  }
}

const isDental = computed(() => {
  return props.DclDepartmentNo === '40'
})

const procedureInitData = {
  ProcedureId: null,
  ProcedureDate: null,
  ProcedureCode: null,
  ProcedureCname: null,
  ProcedureEname: null,
  TreatmentSites: [],
  Amount: 1,
  Cost: 0,
  Note: null,
  SelfPayFlag: false,
  EmergencyFlag: false,
  TreatmentSiteRestricts: [],
  IntArrToothSurfaceCombination: null,
}

const filterColumns = computed(() => {
  if (props.columns) {
    let cols = columns.filter((item) => props.columns.includes(item.name))

    if (props.DclDepartmentNo !== '40') {
      cols = cols.filter((item) => item.name !== 'ToothSurface')
    }

    if (props.rows[0]?.SelfFlag === undefined) {
      return cols.filter((item) => item.name !== 'SelfFlag')
    } else if (props.rows[0]?.SelfPayFlag === undefined) {
      return cols.filter((item) => item.name !== 'SelfPayFlag')
    } else {
      return cols
    }
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
  emit('update:rows', props.rows.concat([cloneDeep(procedureInitData)]))
}

const onDeleteRowClick = (rowIndex) => {
  emit('update:rows', props.rows.slice(0, rowIndex).concat(props.rows.slice(rowIndex + 1)))
}

const toPreset = () => {
  const dialog = $q.dialog({
    component: ProcedurePreset,
    componentProps: {
      columns: props.columns,
      DclDepartmentNo: props.DclDepartmentNo,
      onPaste(pasteRows) {
        console.log('test', pasteRows)
        emit('update:rows', pasteRows)
        dialog.hide()
      },
    },
  })
}

const toPresetAdd = () => {
  const dialog = $q.dialog({
    component: ProcedurePresetEditItem,
    componentProps: {
      editType: 'add',
      rows: props.rows,
      columns: props.columns,
      DclDepartmentNo: props.DclDepartmentNo,
    },
  })
}

const inputRefs = reactive({})
const rules = {
  ProcedureCode: useRequired({ title: '檢查治療代碼', type: 'select' }),
  SelfPayFlag: useRequired({ title: '自費/健保', type: 'select' }),
  SelfFlag: useRequired({ title: '自費/健保', type: 'select' }),
  Amount: useRequired({ title: '數量', type: 'input' }),
  ToothSurface: (row) => {
    return [(val) => val.length === row.RequiredToothSurfaces || `需選擇${row.RequiredToothSurfaces}項`]
  },
}

const procedureFilter = (searchString, searchKeys) => {
  const str = searchKeys
    .reduce((filterArray, key) => {
      if (isValidSearchValue(searchString)) {
        switch (key) {
          case 'ProcedureCode':
            return filterArray.concat(setOdataFilter({ key, value: searchString, operator: 'startswith' }))
          case 'ProcedureCname':
          case 'ProcedureEname':
            return filterArray.concat(setOdataFilter({ key, value: searchString, operator: 'contains' }))
          default:
            return filterArray
        }
      } else {
        return filterArray
      }
    }, [])
    .join(' or ')

  return str
    ? `(${str}) and Status eq true and (NhiChap eq '${underThisNhiChap.value}' or NhiChap eq '6')`
    : `Status eq true and (NhiChap eq '${underThisNhiChap.value}' or NhiChap eq '6')`
}

const filterCount = ref(0)
const filterLoading = ref(false)
const procedureFilterKeys = ['ProcedureCode', 'ProcedureCname', 'ProcedureEname']
const procedureItems = ref([])
const GetProcedure = async (searchString, isProcedureCodeItemsLess50 = false) => {
  // 取得醫令時優先搜尋 ProcedureCode ，若 items 不滿 50 才接著搜尋藥品名稱
  if (!isProcedureCodeItemsLess50) filterCount.value++
  const selfFilterCount = filterCount.value
  const searchKeys = isProcedureCodeItemsLess50 ? procedureFilterKeys.slice(1) : procedureFilterKeys.slice(0, 1)

  try {
    const query = setSearchQuery({
      $top: 50,
      $filter: procedureFilter(searchString, searchKeys),
    })
    const res = await getProcedure(query)
    if (selfFilterCount === filterCount.value) {
      const resultItems = res.data.Items
      if (isProcedureCodeItemsLess50) {
        procedureItems.value = procedureItems.value.concat(resultItems)
      } else {
        procedureItems.value = resultItems
      }
    }
  } catch (err) {
    console.log(err)
  } finally {
    if (selfFilterCount === filterCount.value) filterCount.value = 0
  }
}

const { filterItems: procedureFilterItems, filterHandler } = useFilter(
  {
    items: procedureItems,
    filterKeys: ['ProcedureCode', 'ProcedureCname', 'ProcedureEname'],
  },
  () => {
    filterLoading.value = false
  }
)

const procedureFilterHandler = async (val, update, rowIndex) => {
  await GetProcedure(val)
  if (procedureItems.value.length < 50) await GetProcedure(val, true)

  filterHandler(val, update)
}

const onProcedureSelect = (opt, row) => {
  row.ProcedureCode = opt.ProcedureCode
  row.ProcedureId = opt.ProcedureId
  row.ProcedureCname = opt.ProcedureCname
  row.ProcedureEname = opt.ProcedureEname
  row.Price = opt.AfterNhiPoint
  row.SelfPrice = opt.AfterNhiPoint
  row.TreatmentSiteRestricts = opt.TreatmentSiteRestricts
  row.NhiNote = opt.NhiNote

  if (!!opt.RequiredToothSurfaces) {
    row.IntArrToothSurfaceCombination = []
    row.RequiredToothSurfaces = opt.RequiredToothSurfaces
  }
  //用來影響案件分類
  const restrictionArr = ['92015C', '92016C', '92020B', '92056C', '92057C', '92058C', '92059C'] //暫時寫死 之後看是不是請後端提供
  if (restrictionArr.includes(opt.ProcedureCode)) {
    emit('setCaseType', 'procedure')
  }
}

const allMedicalPartItems = ref([])
const GetMedicalPart = async () => {
  try {
    const res = await getMedicalPart()
    allMedicalPartItems.value = res.data
  } catch (err) {
    console.log(err)
  }
}
const setSiteRestrictsItems = (row) => {
  if (row.TreatmentSiteRestricts && row.TreatmentSiteRestricts.length !== 0) return row.TreatmentSiteRestricts
  else {
    return allMedicalPartItems.value.filter((item) => {
      return row.TreatmentSites.includes(item.No)
    })
  }
}
const getTreatmentSiteRestricts = async (row, val, update) => {
  if (!row.ProcedureCode) {
    update(() => {
      row.TreatmentSiteRestricts = []
    })
  } else {
    const query = setSearchQuery({
      $top: 50,
      $filter: procedureFilter(row.ProcedureCode, ['ProcedureCode']),
    })
    const res = await getProcedure(query)
    if (res.data.Items[0].TreatmentSiteRestricts.length === 0) {
      update(() => {
        row.TreatmentSiteRestricts = allMedicalPartItems.value
      })
    } else {
      update(() => {
        row.TreatmentSiteRestricts = allMedicalPartItems.value.filter((item) => {
          return res.data.Items[0].TreatmentSiteRestricts.includes(item.No)
        })
      })
    }
  }
}

const selfPayItems = [
  {
    label: '自費',
    value: true,
  },
  {
    label: '健保',
    value: false,
  },
]

const presetKeydownCallback = (item) => {
  emit('update:rows', item.PresetProcedureItems)
}

const focusOptions = reactive({
  isFocus: false,
  onFocus: null,
})

defineExpose({
  onAddRowClick,
  validate: () => validate(inputRefs),
})

const addProcedureSearched = (rowIndex) => {
  //02YA0Z0
  const dialog = $q
    .dialog({
      component: ProcedureSearchedAdd,
      componentProps: {
        underThisNhiChap: underThisNhiChap.value,
      },
    })
    .onOk((addProcedureSearched) => {
      const newProcedureTable = cloneDeep(props.rows)
      newProcedureTable[rowIndex].ProcedureId = addProcedureSearched.ProcedureId
      newProcedureTable[rowIndex].ProcedureCode = addProcedureSearched.ProcedureCode
      newProcedureTable[rowIndex].ProcedureCname = addProcedureSearched.ProcedureCname
      newProcedureTable[rowIndex].Price = addProcedureSearched.AfterNhiPoint
      newProcedureTable[rowIndex].TreatmentSiteRestricts = addProcedureSearched.TreatmentSiteRestricts
      if (!!addProcedureSearched.RequiredToothSurfaces) {
        newProcedureTable[rowIndex].IntArrToothSurfaceCombination = []
        newProcedureTable[rowIndex].RequiredToothSurfaces = addProcedureSearched.RequiredToothSurfaces
      }
      if (
        props.rows.find((item) => item.ProcedureCode === addProcedureSearched.ProcedureCode) !== undefined &&
        !isDental.value
      ) {
        $q.notify({
          type: 'negative',
          message: '此治療處置代碼已存在!',
          position: 'top',
        })
        dialog.show()
      } else {
        emit('update:rows', newProcedureTable)
      }
    })
}

const rowSelectedIndex = ref(null)
const rowSelected = ref([])
const onRowSelect = (evt, row, index) => {
  rowSelected.value = [row]
  rowSelectedIndex.value = index
}

const toProcedureBooking = () => {
  const dialog = $q
    .dialog({
      component: ProcedureBooking,
      componentProps: {
        row: rowSelected.value[0],
      },
    })
    .onOk((newEditItem) => {
      dialog.hide()
      const newProcedureTable = cloneDeep(props.rows)
      newProcedureTable[rowSelectedIndex.value] = newEditItem
      emit('update:rows', newProcedureTable)
    })
}

const toRemarkDialog = (row) => {
  $q.dialog({
    component: RemarkDialog,
    componentProps: {
      reMark: row.NhiNote,
    },
  })
}

const toOpdDental = (row) => {
  if (!!row.ProcedureCode) {
    if (row.TreatmentSiteRestricts.length !== 0) {
      $q.dialog({
        component: OpdDental,
        componentProps: {
          selectData: row.TreatmentSites,
          optionData: row.TreatmentSiteRestricts,
        },
      }).onOk((selectedTooth) => {
        row.TreatmentSites = selectedTooth
      })
    } else {
      $q.notify({
        type: 'negative',
        message: '此醫令無須選擇部位',
        position: 'top',
      })
    }
  } else {
    $q.notify({
      type: 'negative',
      message: '請先選擇醫令代碼',
      position: 'top',
    })
  }
}

watch(
  () => props.DclDepartmentNo,
  (val) => {
    if (val === '40') GetToothSurfaceCombinationList()
  },
  { immediate: true }
)

const init = () => {
  if (props.readonly) return
  if (props.useHotkey) {
    if (!presetHotkeyItems.value) presetStore.getPreset('Procedure')

    const { isFocus, onFocus } = usePresetKeydown({
      presetItems: presetHotkeyItems,
      target: tableRef,
      callback: presetKeydownCallback,
    })

    Object.assign(focusOptions, { isFocus, onFocus })
  }
  GetMedicalPart()
}
init()
</script>

