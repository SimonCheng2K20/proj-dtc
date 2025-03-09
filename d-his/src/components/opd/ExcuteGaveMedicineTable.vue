<template>
  <q-table
    ref="tableRef"
    v-bind="QTableProps"
    :rows="rows"
    :columns="filterColumns"
    row-key="MedicineId"
    :pagination="{ rowsPerPage: -1 }"
    :loading="loading"
  >
    <template #top>
      <slot name="top"></slot>
    </template>

    <template #body-cell-index="{ col, rowIndex }">
      <q-td :props="{ col }">
        {{ rowIndex + 1 }}
      </q-td>
    </template>
    <template #body-cell-book="{ col, row }">
      <q-td :props="{ col }">
        <q-btn icon="book" text-color="green" unelevated round dense @click="toDrugBook(row)"></q-btn>
      </q-td>
    </template>
    <template #body-cell-img="{ col, row }">
      <q-td :props="{ col }">
        <q-img :src="imageSrc(row)" style="width: 60px" @click="showImageDialog(imageSrc(row))" />
      </q-td>
    </template>
    <template #body-cell-TakeDoseFlag="{ col, row }">
      <q-td :props="{ col }">
        <q-checkbox v-model="row.TakeDoseFlag" @update:model-value="updateTakeDoseTime(row)"></q-checkbox>
      </q-td>
    </template>
    <template #body-cell-NonTakeReason="{ col, row }">
      <q-td :props="{ col }">
        <q-select
          v-bind="QSelectProps"
          v-model="row.NonTakeReason"
          :options="nonTakeReasonItems"
          option-label="Name"
          option-value="No"
          map-options
          emit-value
          @update:model-value="emit('update:rows', cloneDeep(props.rows))"
        >
        </q-select>
      </q-td>
    </template>
  </q-table>
</template>

<script setup>
import { ref, reactive, watch, computed, useSlots, toRef } from 'vue'
import { QTableProps, QSelectProps, QInputProps } from 'utils/quasar-extends/base-props.js'
import { debounce, cloneDeep } from 'lodash-es'
import { getNonTakeReason } from 'api'
import { useQuasar } from 'quasar'
import dayjs from 'dayjs'

import DrugManageEditItem from 'pages/pharmacy/components/DrugManageEditItem.vue'
import ShowImageDialog from '../ShowImageDialog.vue'

const $q = useQuasar()
const emit = defineEmits(['update:rows'])

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

  useHotkey: {
    type: Boolean,
    default: true,
  },
  presetHotkeyItems: Array,
})

const medicineInitData = {
  MedicineId: null,
  MedicationDate: null,
  EName: null,
  CName: null,
  DoseOnce: 0,
  MedicationUnitCode: null,
  FrequencyCode: null,
  RouteCode: null,
}

const columns = [
  {
    name: 'index',
    label: 'No.',
    field: 'index',
    align: 'center',
    headerClasses: 'sticky top-0 z-1',
  },
  {
    name: 'book',
    label: '藥典',
    field: 'book',
    align: 'center',
    headerClasses: 'sticky top-0 z-1',
  },
  {
    name: 'img',
    label: '藥品圖片',
    field: 'img',
    align: 'center',
    headerClasses: 'sticky top-0 z-1',
  },
  {
    name: 'Name',
    label: '藥品名稱',
    field: (row) => row.EName || row.CName || row.MedicineName,
    align: 'left',
    headerClasses: 'sticky top-0 z-1',
  },
  {
    name: 'DoseOnce',
    label: '單次劑量',
    field: 'DoseOnce',
    align: 'center',
    classes: props.readonly ? null : 'min-w-[120px]',
    headerClasses: 'sticky top-0 z-1',
  },
  {
    name: 'UnitName',
    label: '單位',
    field: 'UnitName',
    align: 'center',
    headerClasses: 'sticky top-0 z-1',
  },
  {
    name: 'RouteCode',
    label: '途徑',
    field: (row) => row.RouteName,
    align: 'center',
    headerClasses: 'sticky top-0 z-1',
  },
  {
    name: 'TakeDoseFlag',
    label: '服用',
    field: 'TakeDoseFlag',
    align: 'center',
    headerClasses: 'sticky top-0 z-1',
  },
  {
    name: 'TakeDoseTime',
    label: '服用時間',
    field: 'TakeDoseTime',
    align: 'center',
    headerClasses: 'sticky top-0 z-1 w-[160px]',
  },
  {
    name: 'NonTakeReason',
    label: '未服用原因',
    field: 'NonTakeReason',
    align: 'center',
    headerClasses: 'sticky top-0 z-1',
  },
]

const filterColumns = computed(() => {
  if (props.columns) {
    return columns.filter((item) => props.columns.includes(item.name))
  } else {
    return columns
  }
})

const tableRef = ref()

const toDrugBook = (row) => {
  const dialog = $q.dialog({
    component: DrugManageEditItem,
    componentProps: {
      editType: 'book',
      id: row.MedicineId,
    },
  })
}

const showImageDialog = (imageUrl) => {
  const dialog = $q.dialog({
    component: ShowImageDialog,
    componentProps: {
      imageUrl: imageUrl,
      title: '藥品圖片',
    },
  })
}

const imageSrc = (row) => {
  if (process.env.DEV) {
    return $setting.apiHost + '/his' + row.MedicineImage
  } else {
    return $setting.apiHost + row.MedicineImage
  }
}

const updateTakeDoseTime = (row) => {
  if (row.TakeDoseFlag) {
    row.TakeDoseTime = dayjs(new Date()).format('YYYY-MM-DD HH:mm')
  } else {
    row.TakeDoseTime = ''
  }
  emit('update:rows', cloneDeep(props.rows))
}

const nonTakeReasonItems = ref([])
const GetNonTakeReason = async () => {
  try {
    const res = await getNonTakeReason()
    if (res.status === 200) {
      nonTakeReasonItems.value = res.data
    }
  } catch (error) {
    console.log(error)
  }
}
const init = () => {
  GetNonTakeReason()
}

init()
</script>

