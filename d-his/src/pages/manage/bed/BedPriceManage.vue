<template>
  <q-page>
    <my-title title="病床固定費用管理" no-fixed></my-title>
    <div class="p-2">
      <my-search-area grid-cols="2" v-on:search-submit="searchSubmit" v-on:search-clear="searchClear">
        <my-input-wrapper label="固定費用代碼">
          <q-input v-bind="QInputProps" v-model="search.HbedFixChargeNo" @keydown.enter="searchSubmit"> </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="固定費用名稱">
          <q-input v-bind="QInputProps" v-model="search.HbedFixChargeName" @keydown.enter="searchSubmit"> </q-input>
        </my-input-wrapper>
        <template #btn-expand>
          <q-btn label="新增資料" icon="add" color="add" @click="toAdd" unelevated></q-btn>
        </template>
      </my-search-area>
      <q-table
        class="mt-2"
        v-bind="QTableProps"
        :rows="rows"
        :columns="columns"
        row-key="HbedFixChargeNo"
        :pagination="pagination"
        :loading="tableLoading"
      >
        <template #body="props">
          <has-children-body v-bind="props" :children-show="props.row.subShow">
            <template #body-cell-subShow="{ col, row }">
              <q-td :props="{ col }">
                <q-btn
                  v-model="row.subShow"
                  :class="{ 'rotate-90': row.subShow }"
                  icon="chevron_right"
                  @click="row.subShow = !row.subShow"
                  round
                  unelevated
                  dense
                ></q-btn>
              </q-td>
            </template>

            <template v-slot:body-cell-action="{ col, row }">
              <q-td :props="{ col }">
                <q-btn class="mr-1" color="edit" @click="toEdit(row)" label="編輯" unelevated dense></q-btn>
                <q-btn color="delete" @click="toDelete(row)" label="刪除" unelevated dense></q-btn>
              </q-td>
            </template>

            <template #children="{ row: parentRow, cols }">
              <q-td v-if="parentRow.subShow" :colspan="cols.length">
                <q-table
                  v-bind="QTableProps"
                  class="max-h-[60vh]"
                  :rows="parentRow.HbedFixChargeDetails"
                  :columns="detailColumns"
                  row-key="ProcedureCode"
                  :pagination="{ rowsPerPage: -1 }"
                  virtual-scroll
                >
                  <template #body-cell-HealthFlag="{ col, row }">
                    <q-td :props="{ col }">
                      <q-icon :name="row.HealthFlag ? 'check_box' : 'check_box_outline_blank'" size="md" color="primary"></q-icon>
                    </q-td>
                  </template>
                  <template #body-cell-DailyChargeFlag="{ col, row }">
                    <q-td :props="{ col }">
                      <q-icon :name="row.DailyChargeFlag ? 'check_box' : 'check_box_outline_blank'" size="md" color="primary"></q-icon>
                    </q-td>
                  </template>
                  <template #body-cell-DischargeFlag="{ col, row }">
                    <q-td :props="{ col }">
                      <q-icon :name="row.DischargeFlag ? 'check_box' : 'check_box_outline_blank'" size="md" color="primary"></q-icon>
                    </q-td>
                  </template>
                </q-table>
              </q-td>
            </template>
          </has-children-body>
        </template>

        <template v-slot:bottom>
          <my-pagination class="mx-auto p-4" v-model="pagination" v-on:update:model-value="GetHbedFixCharge">
          </my-pagination>
        </template>
      </q-table>
    </div>
  </q-page>
</template>
<script setup>
import { getHbedFixCharge, getInChargeList } from 'api'
import { ref, reactive, computed } from 'vue'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { cloneDeep } from 'lodash-es'
import { useQuasar } from 'quasar'
import EditItem from './components/BedPriceManageEditItem.vue'
import { QInputProps, QTableProps } from 'utils/quasar-extends/base-props.js'
import HasChildrenBody from 'components/HasChildrenBody.js'

const $q = useQuasar()

const columns = [
  { name: 'subShow', label: '展開', field: 'subShow', align: 'center' },
  { name: 'action', label: '操作', field: 'action', align: 'center' },
  { name: 'HbedFixChargeNo', label: '固定費用代碼', field: 'HbedFixChargeNo', align: 'left' },
  { name: 'HbedFixChargeName', label: '固定費用名稱', field: 'HbedFixChargeName', align: 'left' },
]

const detailColumns = [
  { name: 'ProcedureCode', label: '醫令代碼', field: 'ProcedureCode', align: 'left', headerClasses: 'min-w-[200px]' },
  { name: 'ProcedureName', label: '醫令名稱', field: 'ProcedureName', align: 'left', headerClasses: 'min-w-[120px]' },
  { name: 'InchargeNo', label: '收費項目', field: 'InchargeNo', align: 'left', headerClasses: 'min-w-[120px]' },
  { name: 'Amount', label: '數量', field: 'Amount', align: 'left' },
  { name: 'MakeUpPrice', label: '健保差價', field: 'MakeUpPrice', align: 'left' },
  { name: 'SelfPrice', label: '自費價', field: 'SelfPrice', align: 'left' },
  { name: 'HealthFlag', label: '健保否', field: 'HealthFlag', align: 'center' },
  { name: 'DailyChargeFlag', label: '日結過帳', field: 'DailyChargeFlag', align: 'center' },
  { name: 'DischargeFlag', label: '出院過帳', field: 'DischargeFlag', align: 'center' },
]

const tableLoading = ref(false)
const rows = ref([])
const GetHbedFixCharge = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getHbedFixCharge(query)
    rows.value = res.data.Items
    pagination.value.rowsNumber = res.data.Count
  } catch (error) {
    console.log(error)
  } finally {
    tableLoading.value = false
  }
}

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

const initData = {}
initData.search = {
  HbedFixChargeNo: null,
  HbedFixChargeName: null,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  return Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'HbedFixChargeNo':
          case 'HbedFixChargeName':
            return filterArray.concat(setOdataFilter({ key, value, operator: 'contains' }))
          default:
            return filterArray
        }
      } else {
        return filterArray
      }
    }, [])
    .join(' and ')
})

const sortBy = ref([])
const orderBy = computed(() => {
  return sortBy.value.map((item) => item.join(' ')).join(',')
})

const searchSubmit = () => {
  pagination.value.page = 1
  GetHbedFixCharge()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetHbedFixCharge()
}

const toAdd = () => {
  const dialog = $q
    .dialog({
      component: EditItem,
      componentProps: {
        editType: 'add',
      },
    })
    .onOk(() => {
      dialog.hide()
      pagination.value.page = 1
      GetHbedFixCharge()
    })
}

const toEdit = (row) => {
  const dialog = $q
    .dialog({
      component: EditItem,
      componentProps: {
        editType: 'edit',
        id: row.HbedFixChargeNo,
      },
    })
    .onOk(() => {
      dialog.hide()
      GetHbedFixCharge()
    })
}

const toDelete = (row) => {
  const dialog = $q
    .dialog({
      component: EditItem,
      componentProps: {
        editType: 'delete',
        id: row.HbedFixChargeNo,
      },
    })
    .onOk(() => {
      dialog.hide()
      const prePage = pagination.value.page - 1
      if (prePage > 0) {
        if (pagination.value.rowsNumber - 1 <= prePage * pagination.value.rowsPerPage) pagination.value.page = prePage
      }
      GetHbedFixCharge()
    })
}

const inChargeItems = ref([])
const GetInChargeList = async () => {
  try {
    const res = await getInChargeList()
    inChargeItems.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const init = async () => {
  GetHbedFixCharge()
  GetInChargeList()
}
init()
</script>

