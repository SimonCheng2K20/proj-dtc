<template>
  <q-page>
    <my-title no-fixed title="藥房資料維護"></my-title>
    <div class="p-2">
      <my-search-area grid-cols="3" @search-submit="searchSubmit" @search-clear="searchClear">
        <my-input-wrapper label="藥房編號"><q-input v-bind="QInputProps" v-model="search.PharmacyId" @keydown.enter="searchSubmit"></q-input></my-input-wrapper>
        <my-input-wrapper label="藥房名稱"><q-input v-bind="QInputProps" v-model="search.CName" @keydown.enter="searchSubmit"></q-input></my-input-wrapper>
        <my-input-wrapper label="啟用狀態">
          <q-select
            v-bind="QSelectProps"
            v-model="search.Status"
            :options="activeStatusNumberItems"
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

      <q-table v-bind="QTableProps" :rows="rows" :columns="columns" row-key="PharmacyId" :pagination="pagination" :loading="tableLoading" class="mt-2">
        <template v-slot:body-cell-action="{ col, row }">
          <q-td :props="{ col }">
            <q-btn class="mr-1" color="edit" @click="toEdit(row)" label="編輯" unelevated dense></q-btn>
            <q-btn color="delete" @click="toDelete(row)" label="刪除" unelevated dense></q-btn>
          </q-td>
        </template>
        <template v-slot:bottom>
          <my-pagination class="mx-auto p-4" v-model="pagination" v-on:update:model-value="GetDrugStore"></my-pagination>
        </template>
      </q-table>
    </div>
  </q-page>
</template>
<script setup>
import { getDrugStore } from 'api'
import { ref, reactive, computed } from 'vue'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { cloneDeep } from 'lodash-es'
import { useQuasar } from 'quasar'
import EditItem from './components/DrugStoreManageEditItem.vue'
import { QInputProps, QSelectProps, QTableProps } from 'utils/quasar-extends/base-props.js'
import { activeStatusNumberItems, activeEditNumberItems } from 'utils/options.js'

const $q = useQuasar()

const columns = reactive([
  { name: 'action', label: '操作', field: 'action', align: 'center' },
  { name: 'PharmacyId', label: '藥房編號', field: 'PharmacyId', align: 'left' },
  { name: 'CName', label: '藥房名稱', field: 'CName', align: 'left' },
  { name: 'Place', label: '藥房地址', field: 'Place', align: 'left' },
  {
    name: 'Status',
    label: '啟用狀態',
    field: (row) => activeStatusNumberItems.find((item) => item.value === row.Status)?.label,
    // activeEditNumberItems.find((item) => item.value === row.Status)?.label,
    align: 'left',
  },
])

const tableLoading = ref(false)
const rows = ref([])
const GetDrugStore = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getDrugStore(query)
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
  PharmacyId: null,
  CName: null,
  Status: null,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  return Object.entries(search)
    .filter(([key, value]) => isValidSearchValue(value))
    .map(([key, value]) => {
      switch (key) {
        case 'PharmacyId':
        case 'CName':
          return setOdataFilter({ key, value, operator: 'contains' })
        case 'Status':
          return setOdataFilter({ key, value, operator: 'eq' })
      }
    })
    .join(' and ')
})

const sortBy = ref([])
const orderBy = computed(() => {
  return sortBy.value.map((item) => item.join(' ')).join(',')
})

const searchSubmit = () => {
  pagination.value.page = 1
  GetDrugStore()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetDrugStore()
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
      GetDrugStore()
    })
}

const toEdit = (row) => {
  const dialog = $q
    .dialog({
      component: EditItem,
      componentProps: {
        editType: 'edit',
        id: row.PharmacyId,
      },
    })
    .onOk(() => {
      dialog.hide()
      GetDrugStore()
    })
}

const toDelete = (row) => {
  const dialog = $q
    .dialog({
      component: EditItem,
      componentProps: {
        editType: 'delete',
        id: row.PharmacyId,
      },
    })
    .onOk(() => {
      dialog.hide()
      const prePage = pagination.value.page - 1
      if (prePage > 0) {
        if (pagination.value.rowsNumber - 1 <= prePage * pagination.value.rowsPerPage) pagination.value.page = prePage
      }
      GetDrugStore()
    })
}

const init = async () => {
  GetDrugStore()
}
init()
</script>

