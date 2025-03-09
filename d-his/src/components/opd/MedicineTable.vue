<template>
  <q-table
    :class="{ selected: focusOptions.isFocus }"
    ref="tableRef"
    v-bind="QTableProps"
    :rows="rows"
    :columns="filterColumns"
    row-key="MedicineId"
    :pagination="{ rowsPerPage: -1 }"
    :loading="loading"
    v-touch-pan.prevent.mouse="dragScrollHandler"
    @click.capture="focusOptions.onFocus"
  >
    <template #top>
      <div v-if="slots['title-prepend']" class="mr-2">
        <slot name="title-prepend"></slot>
      </div>
      <div class="text-xl font-bold mr-2">{{ title }}</div>
      <preset-action-btns v-if="preset && !readonly" @to-preset="toPreset" @to-preset-add="toPresetAdd">
        <template #btn-expand>
          <q-btn color="primary" label="用藥查詢" dense unelevated @click="toDrugRecordSearch"></q-btn>
        </template>
      </preset-action-btns>
      <q-btn
        v-if="!readonly"
        color="clear"
        label="清除"
        dense
        unelevated
        @click="emit('update:rows', [cloneDeep(medicineInitData)])"
      ></q-btn>
      <q-btn class="ml-2" v-if="useDitto" color="blue-4" label="Ditto" dense unelevated @click="addDitto"></q-btn>
      <q-space></q-space>

      <slot name="btn-expand"></slot>
      <q-btn v-if="!readonly" color="add" icon="add" dense unelevated @click="onAddRowClick"> </q-btn>
    </template>

    <template #body-cell-index="{ col, rowIndex }">
      <q-td :props="{ col }">
        {{ rowIndex + 1 }}
      </q-td>
    </template>
    <template v-if="!readonly" #body-cell-MedicineId="{ col, row, rowIndex }">
      <q-td :props="{ col }">
        <!-- 在 update:model-value 時更新其他欄位，而非在 click 時更新，避免用鍵盤選擇時不會觸發的情況 -->
        <q-select
          v-bind="QSelectProps"
          :ref="(el) => (inputRefs[`MedicineId-${rowIndex}`] = el)"
          :rules="rules.MedicineId"
          v-model="row.MedicineId"
          :options="medicineFilterItems"
          option-label="MedicineId"
          use-input
          input-style="width:60px"
          @input-value="filterLoading = true"
          @filter="(val, update) => medicineFilterHandler(val, update, rowIndex)"
          @clear="Object.assign(row, cloneDeep(medicineInitData))"
          @update:model-value="(val) => (!!val ? onMedicineSelect(val, row) : null)"
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
              :disable="rows.find((item) => item.MedicineId === scope.opt.MedicineId) !== undefined"
            >
              <q-item-section>
                <q-item-label>
                  <div v-html="scope.opt.filterLabel"></div>
                </q-item-label>
                <q-item-label
                  v-if="rows.find((item) => item.MedicineId === scope.opt.MedicineId) !== undefined"
                  class="text-negative"
                >
                  此 藥品 已存在
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
      </q-td>
    </template>
    <template #body-cell-book="{ col, row }">
      <q-td :props="{ col }">
        <q-btn icon="book" text-color="green" unelevated round dense @click="toDrugBook(row)"></q-btn>
      </q-td>
    </template>
    <template v-if="!readonly" #body-cell-DoseOnce="{ col, row, rowIndex }">
      <q-td :props="{ col }">
        <q-input
          v-bind="QInputProps"
          :ref="(el) => (inputRefs[`DoseOnce-${rowIndex}`] = el)"
          :rules="row.MedicineId ? rules.DoseOnce : undefined"
          v-model="row.DoseOnce"
          type="number"
          @update:model-value="setTotalAmount(row), setTotalAmountInHospitalized(row)"
        ></q-input>
      </q-td>
    </template>
    <template v-if="!readonly" #body-cell-MedicationUnitCode="{ col }">
      <q-td :props="{ col }"> </q-td>
    </template>
    <template #body-cell-FrequencyCode="{ col, row, rowIndex }">
      <q-td :props="{ col }">
        <q-select
          v-bind="QSelectProps"
          :ref="(el) => (inputRefs[`FrequencyCode-${rowIndex}`] = el)"
          :rules="row.MedicineId ? rules.FrequencyCode : undefined"
          v-model="row.FrequencyCode"
          :options="frequencyFilterItems"
          option-label="Name"
          option-value="Code"
          map-options
          emit-value
          use-input
          input-style="width:60px"
          @filter="(val, update) => frequencyFilterHandler(val, update, rowIndex)"
          @input-value="filterLoading = true"
          @update:model-value="setTotalAmount(row)"
          v-if="!readonly"
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
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label>
                  <div v-html="scope.opt.filterLabel"></div>
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <div v-else>
          {{ row.FrequencyName }}
        </div>
      </q-td>
    </template>
    <template v-if="!readonly" #body-cell-MedicationDays="{ col, row, rowIndex }">
      <q-td :props="{ col }">
        <q-input
          v-bind="QInputProps"
          :ref="(el) => (inputRefs[`MedicationDays-${rowIndex}`] = el)"
          :rules="row.MedicineId ? rules.MedicationDays : undefined"
          v-model="row.MedicationDays"
          type="number"
          min="0"
          @update:model-value="
            () => {
              setTotalAmount(row)
            }
          "
        ></q-input>
      </q-td>
    </template>
    <template v-if="!readonly" #body-cell-MedicationDays2="{ col, row, rowIndex }">
      <q-td :props="{ col }">
        <q-input
          v-bind="QInputProps"
          :ref="(el) => (inputRefs[`MedicationDays2-${rowIndex}`] = el)"
          :rules="row.MedicineId ? rules.MedicationDays2 : undefined"
          v-model="row.MedicationDays2"
          type="number"
          min="0"
          @update:model-value="
            () => {
              setTotalAmount(row)
            }
          "
        ></q-input>
      </q-td>
    </template>
    <template #body-cell-SelfFlag="{ col, row, rowIndex }">
      <q-td :props="{ col }">
        <q-select
          v-bind="QSelectProps"
          :ref="(el) => (inputRefs[`SelfFlag-${rowIndex}`] = el)"
          :rules="row.MedicineId ? rules.SelfFlag : undefined"
          v-model="row.SelfFlag"
          :options="SelfFlagOptions"
          option-label="label"
          option-value="value"
          emit-value
          map-options
          v-if="!readonly"
          :clearable="false"
        ></q-select>
        <span v-else>
          {{ row.SelfFlag ? '自費' : '健保' }}
        </span>
      </q-td>
    </template>
    <template #body-cell-Formula="{ col, row }">
      <q-td :props="{ col }">
        <q-checkbox v-if="!readonly" v-model="row.Formula"></q-checkbox>
        <q-icon v-else :name="row.Formula ? 'check_box' : 'check_box_outline_blank'" size="md"></q-icon>
      </q-td>
    </template>
    <template #body-cell-Mill="{ col, row }">
      <q-td :props="{ col }">
        <q-checkbox v-if="!readonly" v-model="row.Mill"></q-checkbox>
        <q-icon v-else :name="row.Mill ? 'check_box' : 'check_box_outline_blank'" size="md"></q-icon>
      </q-td>
    </template>
    <template v-if="!readonly" #body-cell-StartDate="{ col, row }">
      <q-td :props="{ col }">
        <template #default>
          <my-date-input
            v-bind="QInputProps"
            v-model="row.StartDate"
            @update:model-value="setMedicationDays(row), setTotalAmountInHospitalized(row)"
          ></my-date-input>
        </template>
      </q-td>
    </template>
    <template v-if="!readonly" #body-cell-EndDate="{ col, row }">
      <q-td :props="{ col }">
        <template #default>
          <my-date-input
            v-bind="QInputProps"
            v-model="row.EndDate"
            @update:model-value="setMedicationDays(row), setTotalAmountInHospitalized(row)"
          ></my-date-input>
        </template>
      </q-td>
    </template>
    <template #body-cell-ChronicNotes="{ col, row, rowIndex }">
      <q-td :props="{ col }">
        <div v-if="!readonly" class="flex no-wrap">
          <q-checkbox v-model="row.ChronicNotes" @update:model-value="chronicOneMonth(row)"></q-checkbox>
          <q-select
            v-bind="QSelectProps"
            :ref="(el) => (inputRefs[`ChronicMonths-${rowIndex}`] = el)"
            :rules="row.MedicineId && row.ChronicNotes ? rules.ChronicMonths : undefined"
            v-model="row.ChronicMonths"
            :options="chronicMonthsItems"
            option-label="Name"
            option-value="No"
            emit-value
            map-options
            @update:model-value="
              (val) => {
                onChronicChange(val, row)
                setTotalAmount(row)
              }
            "
            :disable="!row.ChronicNotes"
            :clearable="false"
          ></q-select>
        </div>
        <div v-else class="flex flex-center no-wrap">
          <q-icon :name="row.ChronicNotes ? 'check_box' : 'check_box_outline_blank'" size="md"></q-icon>
          <div v-show="row.ChronicNotes">
            {{ chronicMonthsItems.find((item) => item.No === row.ChronicMonths)?.Name }}
          </div>
        </div>
      </q-td>
    </template>
    <template #body-cell-RouteCode="{ col, row, rowIndex }">
      <q-td :props="{ col }">
        <q-select
          v-bind="QSelectProps"
          :ref="(el) => (inputRefs[`RouteCode-${rowIndex}`] = el)"
          :rules="row.MedicineId ? rules.RouteCode : undefined"
          v-model="row.RouteCode"
          :options="routeFilterItems"
          option-label="Name"
          option-value="No"
          map-options
          emit-value
          use-input
          input-style="width:60px"
          @filter="(val, update) => routeFilterHandler(val, update, rowIndex)"
          @input-value="filterLoading = true"
          v-if="!readonly"
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
            <q-item v-bind="scope.itemProps">
              <q-item-section>
                <q-item-label>
                  <div v-html="scope.opt.filterLabel || routeFilterKeys.map((key) => scope.opt[key]).join(' - ')"></div>
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <div v-else>
          {{ row.RouteName }}
        </div>
      </q-td>
    </template>
    <template #body-cell-StopFlag="{ col, row }">
      <q-td :props="{ col }">
        <q-checkbox v-if="!readonly" v-model="row.StopFlag" @update:model-value="setStopDate(row)"></q-checkbox>
        <q-icon v-else :name="row.StopFlag ? 'check_box' : 'check_box_outline_blank'" size="md"></q-icon>
        <div class="inline-block">
          {{ row.StopFlag ? '是' : '否' }}
        </div>
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
import { ref, reactive, watch, computed, useSlots, nextTick } from 'vue'
import { useFilter } from 'utils/quasar-extends/use-filter.js'
import { QTableProps, QSelectProps, QInputProps } from 'utils/quasar-extends/base-props.js'
import { cloneDeep } from 'lodash-es'
import {
  getMedFrequencyCode,
  getRouteCodeDropdown,
  getChronicMonthsDropdown,
  getDrug,
  getIpdMedicationsItem,
} from 'api'
import setSearchQuery from 'utils/setSearchQuery.js'
import PresetActionBtns from './PresetActionBtns.vue'
import MedicinePreset from './MedicinePreset.vue'
import MedicinePresetEditItem from './MedicinePresetEditItem.vue'
import DrugRecordSearch from './DrugRecordSearch.vue'
import DrugManageEditItem from 'pages/pharmacy/components/DrugManageEditItem.vue'
import { useQuasar } from 'quasar'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import { usePresetKeydown } from 'utils/preset-keydown-handler.js'
import { validate } from 'utils/quasar-extends/validate.js'
import dayjs from 'dayjs'
import { usePresetStore } from 'stores/preset.js'
import { useRoute } from 'vue-router'
import { useRequired } from 'utils/rules.js'
import { useOpdStore } from 'stores/opd.js'

const presetStore = usePresetStore()
const $q = useQuasar()
const route = useRoute()
const slots = useSlots()
const props = defineProps({
  rows: Array,
  columns: Array,
  title: {
    type: String,
    default: 'M 用藥',
  },
  preset: Boolean,
  loading: Boolean,

  readonly: Boolean,

  DclDepartmentNo: String,

  useHotkey: {
    type: Boolean,
    default: true,
  },
  presetHotkeyItems: Array,
  useDitto: Boolean,
  presetKeyName: {
    type: String,
    default: 'Medication',
  },
})

const presetHotkeyItems = computed(() => props.presetHotkeyItems || presetStore.presetItems[props.presetKeyName])
const emit = defineEmits(['update:rows'])
const medicineInitData = {
  MedicineId: null,
  MedicationDate: null,
  EName: null,
  CName: null,
  DoseOnce: 1,
  MedicationUnitCode: null,
  SelfFlag: false,
  FrequencyCode: null,
  TimesOneDay: props.DclDepartmentNo === '60' ? 7 : 3,
  MedicationDays: 0,
  MedicationDays2: props.DclDepartmentNo === '60' ? 7 : 3,
  Formula: false,
  Mill: false,
  StartDate: null,
  EndDate: null,
  TotalAmount: 0,
  TotalAmount2: props.DclDepartmentNo === '60' ? 7 : 3,
  ChronicNotes: false,
  RouteCode: null,
  StopFlag: false,
  StopDate: null,
}

const columns = [
  {
    name: 'index',
    label: '序號',
    field: 'index',
    align: 'center',
    headerClasses: 'sticky top-0 z-10 min-w-[48px]',
  },
  {
    name: 'MedicationDate',
    label: '開立日期',
    field: (row) => row?.MedicationDate?.substring(0, 10) || dayjs().format('YYYY-MM-DD'),
    align: 'center',
    headerClasses: 'sticky top-0 z-10 min-w-[60px]',
    classes: 'whitespace-nowrap',
  },
  {
    name: 'MedicineId',
    label: '藥品代碼',
    field: 'MedicineId',
    align: 'left',
    headerClasses: 'sticky top-0 z-10 max-w-[120px]',
  },
  {
    name: 'book',
    label: '藥典',
    field: 'book',
    align: 'center',
    headerClasses: 'sticky top-0 z-10 min-w-[60px]',
  },
  {
    name: 'Name',
    label: '藥品名稱',
    field: (row) => row.CName || row.EName || row.MedicineName,
    align: 'left',
    headerClasses: 'sticky top-0 z-10 min-w-[160px]',
  },
  {
    name: 'DoseOnce',
    label: '單次劑量',
    field: 'DoseOnce',
    align: 'center',
    classes: props.readonly ? null : 'w-[60px]',
    headerClasses: 'sticky top-0 z-10 min-w-[84px]',
  },
  {
    name: 'UnitName',
    label: '單位',
    field: 'UnitName',
    align: 'left',
    headerClasses: 'sticky top-0 z-10 min-w-[60px]',
  },
  {
    name: 'FrequencyCode',
    label: '頻次',
    field: (row) => frequencyItems.value.find((item) => item.Code === row.FrequencyCode)?.Name,
    align: 'left',
    headerClasses: 'sticky top-0 z-10 min-w-[200px]',
  },
  {
    name: 'MedicationDays',
    label: '自費天數',
    field: 'MedicationDays',
    align: 'center',
    classes: props.readonly ? null : 'w-[80px]',
    headerClasses: 'sticky top-0 z-10 min-w-[92px]',
  },
  {
    name: 'MedicationDays2',
    label: '健保天數',
    field: 'MedicationDays2',
    align: 'center',
    classes: props.readonly ? null : 'w-[80px]',
    headerClasses: 'sticky top-0 z-10 min-w-[92px]',
  },
  {
    name: 'TimesOneDay',
    label: '日份',
    field: (row) => Number(row.MedicationDays) + Number(row.MedicationDays2),
    align: 'center',
    headerClasses: 'sticky top-0 z-10 min-w-[60px]',
  },
  {
    name: 'OneDayInHospital',
    label: '日份',
    field: (row) => row.MedicationDays,
    align: 'center',
    headerClasses: 'sticky top-0 z-10 min-w-[60px]',
  },
  {
    name: 'SelfFlag',
    label: '自費/健保',
    field: 'SelfFlag',
    align: 'center',
    headerClasses: 'sticky top-0 z-10 min-w-[60px] whitespace-nowrap',
    classes: 'whitespace-nowrap',
  },
  {
    name: 'Formula',
    label: '交付調劑',
    field: 'Formula',
    align: 'center',
    headerClasses: 'sticky top-0 z-10 w-[60px]',
  },
  {
    name: 'Mill',
    label: '磨粉',
    field: 'Mill',
    align: 'center',
    headerClasses: 'sticky top-0 z-10 min-w-[60px]',
  },
  {
    name: 'StartDate',
    label: '起日',
    field: (row) => row.StartDate?.substring(0, 10),
    align: 'center',
    classes: props.readonly ? null : 'min-w-[160px]',
    headerClasses: 'sticky top-0 z-10 min-w-[60px]',
  },
  {
    name: 'EndDate',
    label: '迄日',
    field: (row) => row.EndDate?.substring(0, 10),
    align: 'center',
    classes: props.readonly ? null : 'min-w-[160px]',
    headerClasses: 'sticky top-0 z-10 min-w-[60px]',
  },
  {
    name: 'TotalAmount',
    label: '自費總量',
    field: 'TotalAmount',
    align: 'center',
    classes: props.readonly ? null : 'w-[60px]',
    headerClasses: 'sticky top-0 z-10 min-w-[60px]',
  },
  {
    name: 'TotalAmount2',
    label: '健保總量',
    field: 'TotalAmount2',
    align: 'center',
    classes: props.readonly ? null : 'w-[60px]',
    headerClasses: 'sticky top-0 z-10 min-w-[60px]',
  },
  {
    name: 'ChronicNotes',
    label: '慢箋',
    field: 'ChronicNotes',
    align: 'center',
    classes: props.readonly ? null : 'min-w-[160px]',
    headerClasses: 'sticky top-0 z-10 min-w-[60px]',
  },
  {
    name: 'RouteCode',
    label: '途徑',
    field: (row) => routeItems.value.find((item) => item.No === row.RouteCode)?.Name,
    align: 'left',
    headerClasses: 'sticky top-0 z-10 max-w-[200px]',
    classes: 'whitespace-nowrap',
  },
  {
    name: 'StopFlag',
    label: '是否停用',
    field: 'StopFlag',
    align: 'center',
    headerClasses: 'sticky top-0 z-10 min-w-[60px] whitespace-nowrap',
    classes: 'whitespace-nowrap',
  },
  {
    name: 'TotalAmountStayHospital',
    label: '總量（天）',
    field: 'TotalAmount',
    align: 'center',
    classes: 'min-w-[120px]',
  },
  {
    name: 'StopDate',
    label: '停用時間',
    field: (row) => row.StopDate?.substring(0, 10),
    align: 'center',
    classes: 'min-w-[100px]',
    headerClasses: 'sticky top-0 z-10 min-w-[60px]',
  },
  {
    name: 'AttendingDocName',
    label: '開立醫師',
    field: 'AttendingDocName',
    align: 'center',
    headerClasses: 'sticky top-0 z-10 min-w-[60px]',
  },
  {
    name: 'ExecuteStatus',
    label: '執行狀態',
    field: 'ExecuteStatus',
    align: 'center',
    headerClasses: 'sticky top-0 z-10 min-w-[60px]',
  },
  {
    name: 'ExecuteStaffName',
    label: '執行人員',
    field: 'ExecuteStaffName',
    align: 'center',
    headerClasses: 'sticky top-0 z-10 min-w-[60px]',
  },
  {
    name: 'action',
    label: '操作',
    field: 'action',
    align: 'center',
    headerClasses: 'sticky top-0 z-10 min-w-[60px]',
  },
]

const SelfFlagOptions = [
  { label: '健保', value: false },
  { label: '自費', value: true },
]

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

const addDitto = () => {
  GetIpdMedicationsItem()
}

const GetIpdMedicationsItem = async () => {
  try {
    const res = await getIpdMedicationsItem(route.params.Id)
    if (res.status === 200) {
      emit('update:rows', cloneDeep(res.data.IpdMedications))
    }
  } catch (error) {
    console.log(error)
  }
}

const onAddRowClick = () => {
  emit('update:rows', props.rows.concat([cloneDeep(medicineInitData)]))
}

const onDeleteRowClick = (rowIndex) => {
  emit('update:rows', props.rows.slice(0, rowIndex).concat(props.rows.slice(rowIndex + 1)))
}

const toPreset = () => {
  const dialog = $q.dialog({
    component: MedicinePreset,
    componentProps: {
      columns: props.columns,
      presetKeyName: props.presetKeyName,
      onPaste(pasteRows) {
        emit('update:rows', pasteRows)
        dialog.hide()
      },
    },
  })
}

const toPresetAdd = () => {
  const dialog = $q.dialog({
    component: MedicinePresetEditItem,
    componentProps: {
      editType: 'add',
      rows: props.rows,
      columns: props.columns,
      presetKeyName: props.presetKeyName,
    },
  })
}

const toDrugRecordSearch = () => {
  const dialog = $q.dialog({
    component: DrugRecordSearch,
  })
}

const toDrugBook = (row) => {
  const dialog = $q.dialog({
    component: DrugManageEditItem,
    componentProps: {
      editType: 'book',
      id: row.MedicineId,
    },
  })
}

const setTotalAmount = (row) => {
  const frequencyItem = frequencyItems.value.find((item) => item.Code === row.FrequencyCode)
  if (frequencyItem) {
    row.TotalAmount = Number(frequencyItem.PerTimes) * Number(row.MedicationDays) * Number(row.DoseOnce)
    row.TotalAmount2 = Number(frequencyItem.PerTimes) * Number(row.MedicationDays2) * Number(row.DoseOnce)
  }
}

// 這是 住院醫囑 - 開立醫囑 裡面的M用藥在用的 計算日分
const setMedicationDays = (row) => {
  const StartDate = dayjs(row.StartDate)
  const EndDate = dayjs(row.EndDate)
  const diffInDays = EndDate.diff(StartDate, 'day')
  row.MedicationDays = diffInDays
}
// 這是 住院醫囑 - 開立醫囑 裡面的M用藥在用的 計算總量
const setTotalAmountInHospitalized = (row) => {
  const frequencyItem = frequencyItems.value.find((item) => item.Code === row.FrequencyCode)
  if (frequencyItem) {
    row.TotalAmount = Number(frequencyItem.PerTimes) * Number(row.DoseOnce) * row.MedicationDays
  }
}

const inputRefs = reactive({})
const rules = {
  MedicineId: useRequired({ title: '藥品代碼', type: 'select' }),
  DoseOnce: useRequired({ title: '單次劑量', type: 'input' }),
  FrequencyCode: useRequired({ title: '頻次', type: 'select' }),
  MedicationDays: useRequired({ title: '自費天數', type: 'input' }),
  MedicationDays2: useRequired({ title: '健保天數', type: 'input' }),
  TotalAmount: useRequired({ title: '自費總量', type: 'input' }),
  TotalAmount2: useRequired({ title: '健保總量', type: 'input' }),
  SelfFlag: useRequired({ title: '自費/健保', type: 'select' }),
  ChronicMonths: useRequired({ title: '慢箋', type: 'select' }),
  RouteCode: useRequired({ title: '途徑', type: 'select' }),
}

const medicineFilter = (searchString, searchKeys) => {
  const str = searchKeys
    .reduce((filterArray, key) => {
      if (isValidSearchValue(searchString)) {
        switch (key) {
          case 'MedicineId':
            return filterArray.concat(setOdataFilter({ key, value: searchString, operator: 'startswith' }))
          case 'CName':
            return filterArray.concat(setOdataFilter({ key, value: searchString, operator: 'contains' }))
          case 'EName': {
            if (props.DclDepartmentNo === '60') {
              return filterArray
            } else {
              return filterArray.concat(setOdataFilter({ key, value: searchString, operator: 'contains' }))
            }
          }
          default:
            return filterArray
        }
      } else {
        return filterArray
      }
    }, [])
    .join(' or ')

  const enameFilter = setOdataFilter({ key: 'EName', value: '中藥', operator: 'contains' })
  const statusFilter = setOdataFilter({ key: 'Status', value: true, operator: 'eq' })

  const addFilter = [statusFilter, enameFilter]
    .filter((filterStr) => filterStr !== '')
    .join(props.DclDepartmentNo === '60' ? ' and ' : ' and not ')

  return str ? `(${str}) and ${addFilter}` : addFilter
}

const filterCount = ref(0)
const filterLoading = ref(false)
const medicineFilterKeys = ['MedicineId', 'EName', 'CName']
const medicineItems = ref([])
const GetDrug = async (searchString, isMedicineIdItemsLess50 = false) => {
  // 取得藥品時優先搜尋 MedicineId ，若 items 不滿 50 才接著搜尋藥品名稱
  if (!isMedicineIdItemsLess50) filterCount.value++
  const selfFilterCount = filterCount.value
  const searchKeys = isMedicineIdItemsLess50 ? medicineFilterKeys.slice(1) : medicineFilterKeys.slice(0, 1)
  try {
    const query = setSearchQuery({
      $top: isMedicineIdItemsLess50 ? 50 - medicineItems.value.length : 50,
      $filter: medicineFilter(searchString, searchKeys),
    })
    const res = await getDrug(query)
    if (selfFilterCount === filterCount.value) {
      const resultItems = res.data.Items
      if (isMedicineIdItemsLess50) {
        medicineItems.value = medicineItems.value.concat(resultItems)
      } else {
        medicineItems.value = resultItems
      }
    }
  } catch (error) {
    console.log(error)
  } finally {
    if (selfFilterCount === filterCount.value) filterCount.value = 0
  }
}

const { filterItems: medicineFilterItems, filterHandler } = useFilter(
  { items: medicineItems, filterKeys: medicineFilterKeys },
  () => {
    filterLoading.value = false
  }
)

const medicineFilterHandler = async (val, update, rowIndex) => {
  await GetDrug(val)
  if (medicineItems.value.length < 50) await GetDrug(val, true)

  filterHandler(val, update)
}

const onMedicineSelect = (opt, row) => {
  row.MedicineId = opt.MedicineId
  row.EName = opt.EName
  row.CName = opt.CName
}

const frequencyItems = ref([])
const GetMedFrequencyCode = async () => {
  try {
    const res = await getMedFrequencyCode()
    if (res.status === 200) {
      frequencyItems.value = res.data.Items
    }
  } catch (err) {
    console.log(err)
  }
}

const frequencyFilterKeys = ['Code', 'Name']
const { filterItems: frequencyFilterItems, filterHandler: onFrequencyFilter } = useFilter(
  { items: frequencyItems, filterKeys: frequencyFilterKeys },
  () => {
    filterLoading.value = false
  }
)
const frequencyFilterHandler = async (val, update, rowIndex) => {
  onFrequencyFilter(val, update)
}

const routeItems = ref([])
const GetRouteCodeList = async () => {
  try {
    const res = await getRouteCodeDropdown()
    if (res.status === 200) {
      routeItems.value = res.data
    }
  } catch (err) {
    console.log(err)
  }
}

const routeFilterKeys = ['No', 'Name']
const { filterItems: routeFilterItems, filterHandler: onRouteFilter } = useFilter(
  { items: routeItems, filterKeys: routeFilterKeys },
  () => {
    filterLoading.value = false
  }
)
const routeFilterHandler = async (val, update, rowIndex) => {
  onRouteFilter(val, update)
}

const chronicMonthsItems = ref([])
const GetChronicMonthsList = async () => {
  try {
    const res = await getChronicMonthsDropdown()
    chronicMonthsItems.value = res.data
  } catch (err) {
    console.log(err)
  }
}
const chronicOneMonth = (row) => {
  if (row.ChronicNotes) {
    row.ChronicMonths = '1'
    row.MedicationDays2 = 28
    setTotalAmount(row)
  }
}

const onChronicChange = (val, row) => {
  switch (val) {
    case '1':
      row.MedicationDays2 = 28
      break
    case '2':
      row.MedicationDays2 = 56
      break
    case '3':
      row.MedicationDays2 = 84
      break
  }
}

const presetKeydownCallback = (item) => {
  if (props.presetKeyName === 'Medication') {
    emit('update:rows', item.PresetMedicationItems)
  } else {
    emit('update:rows', item.IpdMedicationPresetItems)
  }
}

const focusOptions = reactive({
  isFocus: false,
  onFocus: null,
})

defineExpose({
  onAddRowClick,
  validate: () => validate(inputRefs),
})

const setStopDate = (row) => {
  if (row.StopFlag) {
    row.StopDate = dayjs().format('YYYY-MM-DD')
  } else {
    row.StopDate = null
  }
}

const init = () => {
  if (props.readonly) return
  GetMedFrequencyCode()
  GetRouteCodeList()
  GetChronicMonthsList()
  if (props.useHotkey) {
    if (!presetHotkeyItems.value) presetStore.getPreset(props.presetKeyName)

    const { isFocus, onFocus } = usePresetKeydown({
      presetItems: presetHotkeyItems,
      target: tableRef,
      callback: presetKeydownCallback,
    })

    Object.assign(focusOptions, { isFocus, onFocus })
  }
}
init()
</script>

