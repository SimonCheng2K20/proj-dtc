<template>
  <q-table
    class="font-bold"
    v-bind="QTableProps"
    :rows="rows"
    :columns="filterColumns"
    row-key="PcsCode"
    :pagination="pagination"
  >
    <template #top>
      <div class="w-full flex justify-between">
        <div class="row items-center gap-2">
          <span class="text-xl">ICD-10-PCS處置碼</span>
          <q-btn
            label="清除"
            color="clear"
            dense
            unelevated
            v-if="!readonly"
            @click="emit('update:rows', [cloneDeep(initPcsRow)])"
          ></q-btn>
        </div>
        <div>
          <q-btn
            class="mr-2 bg-purple-800 text-white"
            label="虛擬碼"
            dense
            unelevated
            @click="addVirtualCode"
            v-if="!readonly"
          >
          </q-btn>
          <q-btn color="add" icon="add" dense unelevated @click="addRow" v-if="!readonly"> </q-btn>
        </div>
      </div>
    </template>
    <template #body-cell-index="{ col, rowIndex }">
      <q-td :props="{ col }"> {{ rowIndex === 0 ? '主' : '次' + rowIndex }}</q-td>
    </template>
    <template #body-cell-PcsCode="{ col, row, rowIndex }">
      <q-td :props="{ col }">
        <q-select
          class="flex items-center"
          v-bind="QSelectProps"
          v-model="row.PcsCode"
          :ref="(el) => (inputRefs[`PcsCode-${rowIndex}`] = el)"
          :rules="rules.PcsCode"
          :options="pcsFilterItems"
          option-label="filterLabel"
          use-input
          @input-value="filterLoading = true"
          @filter="(val, update) => pcsFilterHandler(val, update)"
          @update:model-value="(val) => (!!val ? onSelect(val, row) : null)"
          :loading="loadLimit"
          :readonly="!procedureId || rowIndex !== 0"
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
              :disable="rows.find((item) => item.PcsCode === scope.opt.PcsCode) !== undefined"
            >
              <q-item-section>
                <q-item-label>
                  <div v-html="scope.opt.filterLabel"></div>
                </q-item-label>
                <q-item-label
                  v-if="rows.find((item) => item.PcsCode === scope.opt.PcsCode) !== undefined"
                  class="text-negative"
                >
                  此 Icd-10-PCS 已存在
                </q-item-label>
              </q-item-section>
            </q-item>
          </template>
          <template #after v-if="hasLimit !== true || rowIndex !== 0">
            <q-btn color="primary" icon="search" unelevated dense @click="addPCSCode(rowIndex)"></q-btn>
          </template>
        </q-select>
        <!-- <div v-else>
            {{ row.PcsCode || row.Code }}
          </div> -->
      </q-td>
    </template>
    <template #body-cell-action="{ col, rowIndex }" v-if="!readonly">
      <q-td :props="{ col }">
        <q-btn color="delete" label="刪除" unelevated dense @click="deletePCSCode(rowIndex)"></q-btn>
      </q-td>
    </template>
  </q-table>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useQuasar } from 'quasar'
import { getIcd10PcsAllList } from 'api'
import { cloneDeep } from 'lodash-es'
import { QTableProps, QSelectProps } from 'utils/quasar-extends/base-props.js'
import { useFilter } from 'utils/quasar-extends/use-filter.js'
import { validate } from 'utils/quasar-extends/validate.js'
import { useRequired } from 'utils/rules.js'

import AddPCSCode from './AddPCSCode.vue'
import AddVirtualCode from './AddVirtualCode.vue'
import dayjs from 'dayjs'

const $q = useQuasar()
const props = defineProps({
  rows: Array,
  columns: Array,
  readonly: Boolean,
  procedureId: Number,
  loading: Boolean,
})

const emit = defineEmits(['update:rows'])
const basicColumns = [
  { name: 'index', label: '項次', field: 'index', align: 'center', headerClasses: ' w-[60px]' },
  {
    name: 'Icd10PcsDate',
    label: '開立日期',
    field: (row) => row?.Icd10PcsDate?.substring(0, 10) || dayjs().format('YYYY-MM-DD'),
    align: 'center',
    headerClasses: ' w-[120px]',
  },
  { name: 'PcsCode', label: '處置碼/虛擬碼', field: 'PcsCode', align: 'center' },
  { name: 'CName', label: '診斷中文名稱', field: 'CName', align: 'left' },
  // { name: 'EName', label: '診斷英文名稱', field: 'EName', align: 'left' },
  { name: 'action', label: '操作', field: 'action', align: 'center', headerClasses: ' w-[68px]' },
]

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

const pagination = ref({
  page: 1,
  rowsPerPage: -1,
})

const inputRefs = reactive({})
const rules = {
  PcsCode: useRequired({ title: '處置碼/虛擬碼', type: 'select' }),
}

const loadLimit = ref(false)
const hasLimit = ref(false)
const pcsCodeSelection = ref([])
const GetIcd10PcsAllList = async () => {
  loadLimit.value = true
  const params = `?procedureId=${props.procedureId}`
  try {
    const res = await getIcd10PcsAllList(params) //0016070
    if (res.status === 200) {
      pcsCodeSelection.value = res.data
      hasLimit.value = true
    }
  } catch (err) {
    console.log(err)
  } finally {
    loadLimit.value = false
  }
}

const filterLoading = ref(false)
const pcsFilterKeys = ['PcsCode', 'CName', 'EName']

const { filterItems: pcsFilterItems, filterHandler: pcsCodeFilterHandler } = useFilter(
  { items: pcsCodeSelection, filterKeys: pcsFilterKeys },
  () => {
    filterLoading.value = false
  }
)

const pcsFilterHandler = async (val, update) => {
  filterLoading.value = true
  pcsCodeFilterHandler(val, update)
}
const initPcsRow = {
  Icd10PcsDate: null,
  PcsCode: null,
  CName: null,
  EName: null,
}

const addRow = () => {
  emit('update:rows', props.rows.concat([cloneDeep(initPcsRow)]))
}
const addPCSCode = (rowIndex) => {
  //
  const dialog = $q
    .dialog({
      component: AddPCSCode,
    })
    .onOk((addPCS) => {
      const newPcsTable = cloneDeep(props.rows)
      newPcsTable[rowIndex] = addPCS
      emit('update:rows', newPcsTable)
      if (props.rows.find((item) => item.PcsCode === addPCS.PcsCode) !== undefined) {
        $q.notify({
          type: 'negative',
          message: '此處置代碼已存在!',
          position: 'top',
        })
        dialog.show()
      } else {
        emit('update:rows', newPcsTable)
      }
    })
}

const addVirtualCode = () => {
  const dialog = $q
    .dialog({
      component: AddVirtualCode,
    })
    .onOk((addVirtualCode) => {
      dialog.hide()
      emit('update:rows', props.rows.concat(addVirtualCode))
    })
}

const onSelect = async (opt, row) => {
  row.PcsCode = opt.PcsCode
  row.CName = opt.CName
  row.EName = opt.EName
}

const deletePCSCode = (rowIndex) => {
  const newRows = cloneDeep(props.rows)
  newRows.splice(rowIndex, 1)
  emit('update:rows', newRows)
}

defineExpose({ validate: () => validate(inputRefs) })

const init = () => {
  if (props.procedureId) GetIcd10PcsAllList()
}
init()
</script>

