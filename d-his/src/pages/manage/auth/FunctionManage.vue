<template>
  <q-page class="p-2">
    <my-title title="系統作業管理"></my-title>
    <my-search-area grid-cols="3" @searchSubmit="searchSubmit" @searchClear="searchClear">
      <my-input-wrapper label="功能代碼">
        <q-input v-bind="QInputProps" v-model="search.No" @keydown.enter="searchSubmit"></q-input>
      </my-input-wrapper>
      <my-input-wrapper label="功能名稱">
        <q-input v-bind="QInputProps" v-model="search.Name" @keydown.enter="searchSubmit"></q-input>
      </my-input-wrapper>
      <my-input-wrapper label="啟用狀態">
        <q-select
          v-bind="QSelectProps"
          v-model="search.IsActive"
          :options="activeStatusItems"
          option-label="label"
          option-value="value"
          map-options
          emit-value
          @update:model-value="searchSubmit"
        >
        </q-select>
      </my-input-wrapper>

      <template v-slot:btn-expand>
        <q-btn unelevated color="secondary" icon="add" label="新增資料" @click="toAdd"> </q-btn>
      </template>
    </my-search-area>
    <q-table
      class="mt-2"
      v-bind="QTableProps"
      :rows="rows"
      :columns="columns"
      row-key="No"
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
        <my-pagination class="mx-auto p-4" v-model="pagination" v-on:update:model-value="GetFunction"> </my-pagination>
      </template>
    </q-table>
  </q-page>
</template>
<script setup>
import { getFunction } from 'api'
import { ref, reactive, computed } from 'vue'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { cloneDeep } from 'lodash-es'
import { useQuasar } from 'quasar'
import { QInputProps, QSelectProps, QTableProps } from 'utils/quasar-extends/base-props.js'
import { activeStatusItems } from 'utils/options.js'
import EditItem from './components/FunctionEditItem.vue'

const $q = useQuasar()

const columns = [
  { name: 'action', label: '操作', field: 'action', align: 'center' },
  { name: 'No', label: '功能代碼', field: 'No', align: 'left' },
  { name: 'Name', label: '功能名稱', field: 'Name', align: 'left' },
  { name: 'IsActive', label: '啟用狀態', field: 'IsActive', align: 'center' },
]

const tableLoading = ref(false)
const rows = ref([])
const GetFunction = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getFunction(query)
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
  Name: null,
  IsActive: null,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  return Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'IsActive':
            return filterArray.concat(setOdataFilter({ key, value, operator: 'eq' }))
          case 'No':
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
  GetFunction()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetFunction()
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
      GetFunction()
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
      GetFunction()
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
      GetFunction()
    })
}

const init = async () => {
  GetFunction()
}
init()
</script>

