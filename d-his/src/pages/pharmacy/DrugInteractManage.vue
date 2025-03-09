<template>
  <q-page>
    <my-title title="藥品交互作用資料維護" no-fixed></my-title>
    <div class="p-2">
      <my-search-area grid-cols="3" @search-submit="searchSubmit" @search-clear="searchClear">
        <my-input-wrapper label="ATC碼">
          <q-input v-bind="QInputProps" v-model="search.AtcCode" @keydown.enter="searchSubmit"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="健保代碼">
          <q-input v-bind="QInputProps" v-model="search.NhiCode" @keydown.enter="searchSubmit"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="院內代碼">
          <q-input v-bind="QInputProps" v-model="search.MedicineId" @keydown.enter="searchSubmit"></q-input>
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
        row-key="Id"
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
                  :key="key"
                  v-bind="QTableProps"
                  class="max-h-[60vh]"
                  :rows="parentRow.DrugInteractDetails"
                  :columns="detailColumns"
                  row-key="Id"
                  :pagination="{ rowsPerPage: -1 }"
                  virtual-scroll
                ></q-table>
              </q-td>
            </template>
          </has-children-body>
        </template>

        <template v-slot:bottom>
          <my-pagination class="mx-auto p-4" v-model="pagination" @update:model-value="GetDrugInteract"></my-pagination>
        </template>
      </q-table>
    </div>
  </q-page>
</template>
<script setup>
import { getDrugInteractList } from 'api'
import { ref, reactive, computed } from 'vue'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { cloneDeep } from 'lodash-es'
import { useQuasar } from 'quasar'
import EditItem from './components/DrugInteractManageEditItem.vue'
import { QInputProps, QTableProps } from 'utils/quasar-extends/base-props.js'
import HasChildrenBody from 'components/HasChildrenBody.js'

const $q = useQuasar()

const columns = [
  { name: 'subShow', label: '展開', field: 'subShow', align: 'left' },
  { name: 'action', label: '操作', field: 'action', align: 'center', headerClasses: 'min-w-[104px]' },
  { name: 'AtcCode', label: 'ATC碼', field: 'AtcCode', align: 'left' },
  { name: 'NhiCode', label: '健保代碼', field: 'NhiCode', align: 'left' },
  { name: 'MedicineId', label: '院內代碼', field: 'MedicineId', align: 'left' },
]

const detailColumns = [
  { name: 'DrugInteractAtcCode', label: '互斥ATC碼', field: 'DrugInteractAtcCode', align: 'left' },
  { name: 'DrugInteractNhiCode', label: '互斥健保代碼', field: 'DrugInteractNhiCode', align: 'left' },
  { name: 'DrugInteractMedicineId', label: '互斥院內代碼', field: 'DrugInteractMedicineId', align: 'left' },
  { name: 'Effect', label: '影響', field: 'Effect', align: 'left' },
  { name: 'Mechanism', label: '機制', field: 'Mechanism', align: 'left' },
  { name: 'Description', label: '說明', field: 'Description', align: 'left' },
]

const tableLoading = ref(false)
const rows = ref([])
const GetDrugInteract = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getDrugInteractList(query)
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
  AtcCode: null,
  NhiCode: null,
  MedicineId: null,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  return Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'AtcCode':
          case 'NhiCode':
          case 'MedicineId':
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
  GetDrugInteract()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetDrugInteract()
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
      GetDrugInteract()
    })
}

const toEdit = (row) => {
  const dialog = $q
    .dialog({
      component: EditItem,
      componentProps: {
        editType: 'edit',
        id: row.Id,
      },
    })
    .onOk(() => {
      dialog.hide()
      GetDrugInteract()
    })
}

const toDelete = (row) => {
  const dialog = $q
    .dialog({
      component: EditItem,
      componentProps: {
        editType: 'delete',
        id: row.Id,
      },
    })
    .onOk(() => {
      dialog.hide()
      const prePage = pagination.value.page - 1
      if (prePage > 0) {
        if (pagination.value.rowsNumber - 1 <= prePage * pagination.value.rowsPerPage) pagination.value.page = prePage
      }
      GetDrugInteract()
    })
}

const init = async () => {
  GetDrugInteract()
}
init()
</script>
