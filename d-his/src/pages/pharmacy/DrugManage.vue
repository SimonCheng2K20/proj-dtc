<template>
  <q-page>
    <my-title no-fixed title="藥品資料維護"></my-title>
    <div class="p-2">
      <my-search-area grid-cols="4" v-on:search-submit="searchSubmit" v-on:search-clear="searchClear">
        <my-input-wrapper label="健保代碼"
          ><q-input v-bind="QInputProps" v-model="search.NhiCode" @keydown.enter="searchSubmit"></q-input
        ></my-input-wrapper>
        <my-input-wrapper label="院內代碼"
          ><q-input v-bind="QInputProps" v-model="search.MedicineId" @keydown.enter="searchSubmit"></q-input
        ></my-input-wrapper>
        <my-input-wrapper label="中文藥名"
          ><q-input v-bind="QInputProps" v-model="search.CName" @keydown.enter="searchSubmit"></q-input
        ></my-input-wrapper>
        <my-input-wrapper label="英文藥名"
          ><q-input v-bind="QInputProps" v-model="search.EName" @keydown.enter="searchSubmit"></q-input
        ></my-input-wrapper>
        <my-input-wrapper label="ACT碼"
          ><q-input v-bind="QInputProps" v-model="search.AtcCode" @keydown.enter="searchSubmit"></q-input
        ></my-input-wrapper>
        <my-input-wrapper label="藥品學名">
          <q-input v-bind="QInputProps" v-model="search.ScientificName" @keydown.enter="searchSubmit"></q-input>
        </my-input-wrapper>
        <MedVenderSelection
          labelName="藥商"
          useInput
          v-model:selectedData="venderData"
          @update:selectedData=";(search.VendorId = venderData?.VendorId), searchSubmit()"
        ></MedVenderSelection>

        <template #btn-expand>
          <q-btn label="新增藥品" color="add" icon="add" @click="toAdd" unelevated></q-btn>
        </template>
      </my-search-area>
      <q-table
        class="mt-2"
        v-bind="QTableProps"
        :rows="rows"
        :columns="columns"
        row-key="MedicineId"
        :pagination="pagination"
        :loading="tableLoading"
      >
        <template v-slot:body-cell-action="{ col, row }">
          <q-td :props="{ col }">
            <q-btn class="mr-1" color="edit" @click="toEdit(row)" label="編輯" unelevated dense></q-btn>
            <q-btn color="delete" @click="toDelete(row)" label="刪除" unelevated dense></q-btn>
          </q-td>
        </template>
        <template v-slot:bottom>
          <my-pagination class="mx-auto p-4" v-model="pagination" v-on:update:model-value="GetDrug"></my-pagination>
        </template>
      </q-table>
    </div>
  </q-page>
</template>
<script setup>
import { ref, reactive, computed } from 'vue'
import { cloneDeep } from 'lodash-es'
import { useQuasar } from 'quasar'

// api
import { getDrug, getMedVender } from 'api'

// components
import EditItem from './components/DrugManageEditItem.vue'
import MedVenderSelection from 'src/components/type-selection/MedVenderSelection.vue'

// utils
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import { QInputProps, QSelectProps, QTableProps } from 'utils/quasar-extends/base-props.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'

const $q = useQuasar()

const columns = reactive([
  { name: 'action', label: '操作', field: 'action', align: 'center', classes: 'whitespace-nowrap' },
  { name: 'NhiCode', label: '健保代碼', field: 'NhiCode', align: 'left' },
  { name: 'MedicineId', label: '院內代碼', field: 'MedicineId', align: 'left' },
  { name: 'AtcCode', label: 'ATC碼', field: 'AtcCode', align: 'left' },
  { name: 'CName', label: '中文藥名', field: 'CName', align: 'left' },
  { name: 'EName', label: '英文藥名', field: 'EName', align: 'left' },
  { name: 'ScientificName', label: '藥品學名', field: 'ScientificName', align: 'left' },
  { name: 'VendorName', label: '藥商名稱', field: 'VendorName', align: 'left' },
  {
    name: 'Status',
    label: '啟用狀態',
    field: (row) => (row.Status ? '啟用' : '未啟用'),
    align: 'left',
  },
])

const tableLoading = ref(false)
const rows = ref([])
const GetDrug = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getDrug(query)
    if (res.status === 200) {
      rows.value = res.data.Items
      pagination.value.rowsNumber = res.data.Count
    }
  } catch (err) {
    console.log(err)
  } finally {
    tableLoading.value = false
  }
}

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

const venderData = ref(null)

const initData = {}
initData.search = {
  NhiCode: null,
  MedicineId: null,
  CName: null,
  EName: null,
  AtcCode: null,
  ScientificName: null,
  VendorId: null,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  return Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'NhiCode':
          case 'MedicineId':
          case 'CName':
          case 'EName':
          case 'AtcCode':
          case 'ScientificName':
            return filterArray.concat(setOdataFilter({ key, value, operator: 'contains' }))
          case 'VendorId':
            return filterArray.concat(setOdataFilter({ key, value, operator: 'eq' }))
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
  GetDrug()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetDrug()
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
      GetDrug()
    })
}

const toEdit = (row) => {
  const dialog = $q
    .dialog({
      component: EditItem,
      componentProps: {
        editType: 'edit',
        id: row.MedicineId,
      },
    })
    .onOk(() => {
      dialog.hide()
      GetDrug()
    })
}

const toDelete = (row) => {
  const dialog = $q
    .dialog({
      component: EditItem,
      componentProps: {
        editType: 'delete',
        id: row.MedicineId,
      },
    })
    .onOk(() => {
      dialog.hide()
      const prePage = pagination.value.page - 1
      if (prePage > 0) {
        if (pagination.value.rowsNumber - 1 <= prePage * pagination.value.rowsPerPage) pagination.value.page = prePage
      }
      GetDrug()
    })
}

const init = async () => {
  GetDrug()
}
init()
</script>
