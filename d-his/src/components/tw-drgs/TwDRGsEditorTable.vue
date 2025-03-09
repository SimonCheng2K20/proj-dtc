<template>
  <div class="font-bold">
    <q-table
      no-data-label="'無相關DRG編審結果'"
      v-bind="QTableProps"
      :rows="rows"
      :columns="columns"
      row-key="PcsCode"
      :pagination="pagination"
      :loading="loading"
    >
      <template #top>
        <div class="w-full flex justify-between">
          <div class="row items-center gap-2">
            <span class="text-xl">DRG編審</span>
          </div>
        </div>
      </template>
      <template #body-cell-Index="{ col, rowIndex }">
        <q-td :props="{ col }">
          {{ rowIndex + 1 }}
        </q-td>
      </template>
      <template #body-cell-PCS="{ col, row }">
        <q-td :props="{ col }">
          <q-select
            v-bind="QSelectProps"
            v-model="row.PcsCode"
            :options="pcsFilterItems"
            option-label="filterLabel"
            use-input
            @input-value="filterLoading = true"
            @filter="(val, update) => pcsFilterHandler(val, update)"
            @update:model-value="(val) => onSelect(val, row)"
            :loading="loadLimit"
            v-if="!!procedureId"
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
          </q-select>
          <div v-else>
            {{ row.PcsCode }}
          </div>
        </q-td>
      </template>
      <template #body-cell-complication="{ col, row }">
        <q-td :props="{ col }">
          {{ props.isComorbidity ? '是' : '否' }}
        </q-td>
      </template>
      <template #body-cell-action="{ col, rowIndex, row }" v-if="!readonly">
        <q-td :props="{ col }">
          <q-btn
            class="mr-2"
            color="primary"
            label="DRG編審"
            unelevated
            dense
            @click="checkDRGDetail(row)"
            :disable="!row.IsPaid"
          ></q-btn>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watchEffect, inject } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { getIcd10PcsAllList } from 'api'
import { cloneDeep } from 'lodash-es'
import { QTableProps, QInputProps, QSelectProps } from 'utils/quasar-extends/base-props.js'
import { useFilter } from 'utils/quasar-extends/use-filter.js'
import { useIpdStore } from 'stores/ipd'

import DRGDetail from './DRGDetail.vue'
import dayjs from 'dayjs'

const ipdStore = useIpdStore()
const $q = useQuasar()
const props = defineProps({
  rows: {
    type: Array,
    default() {
      return [{ PcsCode: 'exp880C', CName: '範例', EName: 'example' }]
    },
  },
  readonly: Boolean,
  procedureId: Number,
  loading: Boolean,
  isComorbidity: Boolean,
  icd10Main: Object,
})

const emit = defineEmits(['update:rows'])

const columns = computed(() => {
  const basicColumns = [
    { name: 'Index', label: 'DRG編審結果排序', field: 'Index', align: 'center', headerClasses: ' w-[80px]' },
    {
      name: 'Icd10PcsDate',
      label: '開立日期',
      field: (row) => row?.Icd10PcsDate?.substring(0, 10) || dayjs().format('YYYY-MM-DD'),
      align: 'center',
      headerClasses: ' w-[120px]',
    },
    {
      name: 'DiagnosisList',
      label: '相關ICD診斷碼',
      field: (row) => row.DiagnosisList.toString(),
      align: 'center',
      headerClasses: 'whitespace-nowrap',
    },
    {
      name: 'ProcedureList',
      label: '相關PCS處置碼',
      field: (row) => row.ProcedureList.toString(),
      align: 'center',
      headerClasses: 'whitespace-nowrap',
    },
    { name: 'MDC', label: 'MDC', field: 'MDC', align: 'center' },
    { name: 'DRG', label: 'DRG', field: 'DRG', align: 'center' },
    {
      name: 'complication',
      label: '合併併發症',
      field: 'complication',
      align: 'center',
      headerClasses: ' w-[80px]',
    },
    { name: 'Point', label: '點數', field: 'Point', align: 'center', headerClasses: 'w-[50px]' },
    { name: 'MdcCname', label: 'Mdc中文名稱', field: 'MdcCname', align: 'left' },
    { name: 'DrgCname', label: 'Drg中文名稱', field: 'DrgCname', align: 'left' },
    {
      name: 'IsPaid',
      label: '結果',
      field: (row) => (row.IsPaid ? '支付' : '不支付'),
      align: 'center',
      headerClasses: 'w-[150px]',
    },
    { name: 'action', label: '操作', field: 'action', align: 'center', headerClasses: 'w-[150px]' },
  ]
  if (props.readonly) {
    return basicColumns.filter((i) => i.field !== 'action')
  } else {
    return basicColumns
  }
})

const pagination = ref({
  page: 1,
  rowsPerPage: -1,
})

const loadLimit = ref([])
const pcsCodeSelection = ref([])
const GetIcd10PcsAllList = async () => {
  loadLimit.value = true
  const params = `?procedureId=${props.procedureId}`
  try {
    const res = await getIcd10PcsAllList(params) //0016070
    if (res.status === 200) {
      pcsCodeSelection.value = res.data
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

const onSelect = async (opt, row) => {
  row.PcsCode = opt.PcsCode
  row.CName = opt.CName
  row.EName = opt.EName
}

const checkDRGDetail = (row) => {
  const dialog = $q.dialog({
    component: DRGDetail,
    componentProps: {
      row: row,
      icd10MainCode: props.icd10Main.Icd10Code,
      birthday: ipdStore.ipdData.Patient.Person.BirthDate.substring(0, 10),
      patientData: ipdStore.ipdData,
    },
  })
}

const deletePCSCode = (rowIndex) => {
  const newRows = cloneDeep(props.rows)
  newRows.splice(rowIndex, 1)
  emit('update:rows', newRows)
}

const init = () => {
  if (props.procedureId) GetIcd10PcsAllList()
}
init()
</script>

