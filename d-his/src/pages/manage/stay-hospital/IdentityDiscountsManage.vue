<template>
  <q-page>
    <my-title title="住院折扣身分管理(待後臺API)" no-fixed></my-title>
    <div class="p-2">
      <my-search-area grid-cols="2" v-on:search-submit="searchSubmit" v-on:search-clear="searchClear">
        <my-input-wrapper label="住院折扣身分代碼">
          <q-input v-bind="QInputProps" v-model="search.Code" @keydown.enter="searchSubmit"> </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="住院折扣身分名稱">
          <q-input v-bind="QInputProps" v-model="search.Name" @keydown.enter="searchSubmit"> </q-input>
        </my-input-wrapper>
        <template #btn-expand>
          <q-btn label="新增資料" color="add" icon="add" @click="toAdd" unelevated></q-btn>
        </template>
      </my-search-area>
      <q-table
        class="mt-2"
        v-bind="QTableProps"
        :rows="rows"
        :columns="columns"
        row-key="Code"
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
          <my-pagination class="mx-auto p-4" v-model="pagination" v-on:update:model-value="GetIdentityDiscounts">
          </my-pagination>
        </template>
      </q-table>
    </div>
  </q-page>
</template>
<script setup>
// import { getIdentityDiscounts } from 'api'
import { ref, reactive, computed } from 'vue'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { cloneDeep } from 'lodash-es'
import { useQuasar } from 'quasar'
import EditItem from './components/IdentityDiscountsEditItem.vue'
import { QInputProps, QTableProps } from 'utils/quasar-extends/base-props.js'
import numberFormat from 'utils/numberFormat'

const $q = useQuasar()

const columns = [
  { name: 'action', label: '操作', field: 'action', align: 'center' },
  { name: 'Code', label: '住院折扣身分代碼', field: 'Code', align: 'left' },
  { name: 'Name', label: '住院折扣身分名稱', field: 'Name', align: 'left' },
  { name: 'Amount', label: '折扣金額', field: (row) => numberFormat(row.Amount), align: 'left' },
  { name: 'Actived', label: '啟用狀態', field: (row) => (row.Actived ? '啟用' : '未啟用'), align: 'left' },
]

const tableLoading = ref(false)
const rows = ref([])
const GetIdentityDiscounts = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getIdentityDiscounts(query)
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
  Code: null,
  Name: null,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  return Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'Code':
          case 'Name':
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
  GetIdentityDiscounts()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetIdentityDiscounts()
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
      GetIdentityDiscounts()
    })
}

const toEdit = (row) => {
  const dialog = $q
    .dialog({
      component: EditItem,
      componentProps: {
        editType: 'edit',
        id: row.Code,
      },
    })
    .onOk(() => {
      dialog.hide()
      GetIdentityDiscounts()
    })
}

const toDelete = (row) => {
  const dialog = $q
    .dialog({
      component: EditItem,
      componentProps: {
        editType: 'delete',
        id: row.Code,
      },
    })
    .onOk(() => {
      dialog.hide()
      const prePage = pagination.value.page - 1
      if (prePage > 0) {
        if (pagination.value.rowsNumber - 1 <= prePage * pagination.value.rowsPerPage) pagination.value.page = prePage
      }
      GetIdentityDiscounts()
    })
}

const init = async () => {
  GetIdentityDiscounts()
}
init()
</script>

