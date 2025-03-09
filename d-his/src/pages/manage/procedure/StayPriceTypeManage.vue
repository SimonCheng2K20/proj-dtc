<template>
  <q-page>
    <my-title title="住院費用類別維護" no-fixed></my-title>
    <div class="p-2">
      <my-search-area grid-cols="2" v-on:search-submit="searchSubmit" v-on:search-clear="searchClear">
        <my-input-wrapper label="住院費用類別代碼"><q-input v-bind="QInputProps" v-model="search.No" @keydown.enter="searchSubmit"></q-input></my-input-wrapper>
        <my-input-wrapper label="住院費用類別名稱"> <q-input v-bind="QInputProps" v-model="search.Text" @keydown.enter="searchSubmit"></q-input></my-input-wrapper>

        <template #btn-expand>
          <q-btn label="新增資料" color="add" icon="add" @click="toAdd" unelevated></q-btn>
        </template>
      </my-search-area>
      <q-table class="mt-2" v-bind="QTableProps" :rows="rows" :columns="columns" row-key="No" :pagination="pagination" :loading="tableLoading">
        <template v-slot:body-cell-action="{ col, row }">
          <q-td :props="{ col }">
            <q-btn class="mr-1" color="edit" @click="toEdit(row)" label="編輯" unelevated dense></q-btn>
            <q-btn color="delete" @click="toDelete(row)" label="刪除" unelevated dense></q-btn>
          </q-td>
        </template>
        <template v-slot:bottom> <my-pagination class="mx-auto p-4" v-model="pagination" v-on:update:model-value="GetCommonData"></my-pagination> </template>
      </q-table>
    </div>
  </q-page>
</template>
<script setup>
import { getCommonData } from 'api'
import { ref, reactive, computed } from 'vue'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { cloneDeep } from 'lodash-es'
import { useQuasar } from 'quasar'
import EditItem from './components/DeliveryUnitEditItem.vue'
import { QInputProps, QTableProps } from 'utils/quasar-extends/base-props.js'

const $q = useQuasar()

const columns = [
  { name: 'action', label: '操作', field: 'action', align: 'center' },
  { name: 'No', label: '住院費用類別代碼', field: 'No', align: 'left' },
  { name: 'Text', label: '住院費用類別名稱', field: 'Text', align: 'left' },
]

const tableLoading = ref(false)
const rows = ref([])
const GetCommonData = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getCommonData(query)
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

const initData = {}
initData.search = {
  No: null,
  Text: null,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  const str = Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'No':
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

  return str ? str + ` and Category eq 'inpatientExpense'` : `Category eq 'inpatientExpense'`
})

const sortBy = ref([])
const orderBy = computed(() => {
  return sortBy.value.map((item) => item.join(' ')).join(',')
})

const searchSubmit = () => {
  pagination.value.page = 1
  GetCommonData()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetCommonData()
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
      GetCommonData()
    })
}

const toEdit = (row) => {
  const dialog = $q
    .dialog({
      component: EditItem,
      componentProps: {
        editType: 'edit',
        id: `Category(inpatientExpense),No(${row.No})`,
      },
    })
    .onOk(() => {
      dialog.hide()
      GetCommonData()
    })
}

const toDelete = (row) => {
  const dialog = $q
    .dialog({
      component: EditItem,
      componentProps: {
        editType: 'delete',
        id: `Category(inpatientExpense),No(${row.No})`,
      },
    })
    .onOk(() => {
      dialog.hide()
      const prePage = pagination.value.page - 1
      if (prePage > 0) {
        if (pagination.value.rowsNumber - 1 <= prePage * pagination.value.rowsPerPage) pagination.value.page = prePage
      }
      GetCommonData()
    })
}

const init = async () => {
  GetCommonData()
}
init()
</script>

