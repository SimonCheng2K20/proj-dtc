<template>
  <q-page>
    <my-title title="醫令分類維護" no-fixed></my-title>
    <div class="p-2">
      <my-search-area grid-cols="2" v-on:search-submit="searchSubmit" v-on:search-clear="searchClear">
        <my-input-wrapper label="主分類代碼">
          <q-input v-bind="QInputProps" v-model="search.Category" @keydown.enter="searchSubmit"> </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="主分類名稱">
          <q-input v-bind="QInputProps" v-model="search.Text" @keydown.enter="searchSubmit"> </q-input>
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
        row-key="Category"
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
                  :rows="parentRow.ProcedureCategoryItems"
                  :columns="childrenColumns"
                  row-key="SecondCategory"
                  :pagination="{ rowsPerPage: -1 }"
                  virtual-scroll
                >
                </q-table>
              </q-td>
            </template>
          </has-children-body>
        </template>

        <template v-slot:bottom>
          <my-pagination class="mx-auto p-4" v-model="pagination" v-on:update:model-value="GetProcedureCategory">
          </my-pagination>
        </template>
      </q-table>
    </div>
  </q-page>
</template>
<script setup>
import { getProcedureCategory } from 'api'
import { ref, reactive, computed } from 'vue'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { cloneDeep } from 'lodash-es'
import { useQuasar } from 'quasar'
import EditItem from './components/ProcedureCategoryEditItem.vue'
import { QInputProps, QTableProps } from 'utils/quasar-extends/base-props.js'
import HasChildrenBody from 'components/HasChildrenBody.js'

const $q = useQuasar()

const columns = [
  { name: 'subShow', field: 'subShow', align: 'center' },
  { name: 'action', label: '操作', field: 'action', align: 'center' },
  { name: 'Category', label: '主分類代碼', field: 'Category', align: 'left' },
  { name: 'Text', label: '主分類名稱', field: 'Text', align: 'left' },
]

const childrenColumns = [
  { name: 'SecondCategory', label: '次分類代碼', field: 'SecondCategory', align: 'left' },
  { name: 'SecondText', label: '次分類名稱', field: 'SecondText', align: 'left' },
]

const tableLoading = ref(false)
const rows = ref([])
const GetProcedureCategory = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getProcedureCategory(query)
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
  Category: null,
  Text: null,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  return Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'Category':
          case 'Text':
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
  GetProcedureCategory()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetProcedureCategory()
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
      GetProcedureCategory()
    })
}

const toEdit = (row) => {
  const dialog = $q
    .dialog({
      component: EditItem,
      componentProps: {
        editType: 'edit',
        id: row.Category,
      },
    })
    .onOk(() => {
      dialog.hide()
      GetProcedureCategory()
    })
}

const toDelete = (row) => {
  const dialog = $q
    .dialog({
      component: EditItem,
      componentProps: {
        editType: 'delete',
        id: row.Category,
      },
    })
    .onOk(() => {
      dialog.hide()
      const prePage = pagination.value.page - 1
      if (prePage > 0) {
        if (pagination.value.rowsNumber - 1 <= prePage * pagination.value.rowsPerPage) pagination.value.page = prePage
      }
      GetProcedureCategory()
    })
}

const init = async () => {
  GetProcedureCategory()
}
init()
</script>

