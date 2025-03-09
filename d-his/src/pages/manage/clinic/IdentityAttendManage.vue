<template>
  <q-page>
    <my-title title="就診身分管理" no-fixed></my-title>
    <div class="p-2">
      <my-search-area grid-cols="3" v-on:search-submit="searchSubmit" v-on:search-clear="searchClear">
        <my-input-wrapper label="投保類別">
          <q-select
            v-bind="QSelectProps"
            v-model="search.Category"
            :options="identityCategoryItems"
            option-label="Name"
            option-value="No"
            map-options
            emit-value
            @update:model-value="searchSubmit"
          >
          </q-select>
        </my-input-wrapper>
        <my-input-wrapper label="就診身分名稱">
          <q-input v-bind="QInputProps" v-model="search.Identity" @keydown.enter="searchSubmit"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="啟用狀態">
          <q-select
            v-bind="QSelectProps"
            v-model="search.Active"
            :options="activeStatusItems"
            option-label="label"
            option-value="value"
            map-options
            emit-value
            @update:model-value="searchSubmit"
          >
          </q-select>
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
        row-key="Id"
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
          <my-pagination class="mx-auto p-4" v-model="pagination" v-on:update:model-value="GetIdentityAttend">
          </my-pagination>
        </template>
      </q-table>
    </div>
  </q-page>
</template>
<script setup>
import { getIdentityAttend, getIdentityCategoryList } from 'api'
import { ref, reactive, computed } from 'vue'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { cloneDeep } from 'lodash-es'
import { useQuasar } from 'quasar'
import EditItem from './components/IdentityAttendManageEditItem.vue'
import { QSelectProps, QInputProps, QTableProps } from 'utils/quasar-extends/base-props.js'
import { activeStatusItems } from 'utils/options.js'

const $q = useQuasar()

const columns = [
  { name: 'action', label: '操作', field: 'action', align: 'center' },
  { name: 'CategoryName', label: '投保類別', field: 'CategoryName', align: 'left' },
  { name: 'Identity', label: '就診身分名稱', field: 'Identity', align: 'left' },
  { name: 'PartialCode', label: '免部分負擔代碼', field: 'PartialCode', align: 'left' },
  { name: 'PartiaFee', label: '部分負擔金額', field: 'PartiaFee', align: 'right' },
  { name: 'Active', label: '啟用狀態', field: (row) => (row.Active ? '啟用' : '未啟用'), align: 'left' },
]

const tableLoading = ref(false)
const rows = ref([])
const GetIdentityAttend = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getIdentityAttend(query)
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
  Identity: null,
  Active: null,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  return Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'Category':
          case 'Active':
            return filterArray.concat(setOdataFilter({ key, value, operator: 'eq' }))
          case 'Identity':
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
  GetIdentityAttend()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetIdentityAttend()
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
      GetIdentityAttend()
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
      GetIdentityAttend()
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
      GetIdentityAttend()
    })
}

const identityCategoryItems = ref([])
const GetIdentityCategoryList = async () => {
  try {
    const res = await getIdentityCategoryList()
    identityCategoryItems.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const init = async () => {
  GetIdentityAttend()
  GetIdentityCategoryList()
}
init()
</script>

