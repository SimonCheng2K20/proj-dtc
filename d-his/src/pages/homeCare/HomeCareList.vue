<template>
  <q-page class="p-2">
    <my-title title="居家照護清單"></my-title>
    <my-search-area grid-cols="3" v-on:search-submit="searchSubmit" v-on:search-clear="searchClear">
      <my-input-wrapper label="核定日期" range-input class="col-span-2">
        <template #range-input-0>
          <my-date-input
            v-bind="QInputProps"
            v-model="search.核定日期Start"
            @keydown.enter="searchSubmit"
          ></my-date-input>
        </template>
        <template #range-input-1>
          <my-date-input
            v-bind="QInputProps"
            v-model="search.核定日期End"
            @keydown.enter="searchSubmit"
          ></my-date-input>
        </template>
      </my-input-wrapper>
      <my-input-wrapper label="身分證字號">
        <q-input v-bind="QInputProps" v-model="search.身分證字號" @keydown.enter="searchSubmit"> </q-input>
      </my-input-wrapper>

      <template #btn-expand>
        <q-btn unelevated color="secondary" icon="add" label="檢視彈窗按鈕(待API串接後刪除)" @click="toAdd"> </q-btn>
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
        <my-pagination class="mx-auto p-4" v-model="pagination" v-on:update:model-value="GetHomeCareList">
        </my-pagination>
      </template>
    </q-table>
  </q-page>
</template>
<script setup>
// import { getHomeCareList } from 'api'
import { ref, reactive, computed } from 'vue'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { cloneDeep } from 'lodash-es'
import { useQuasar } from 'quasar'
import EditItem from './components/HomeCareListEditItem.vue'
import { QInputProps, QTableProps } from 'utils/quasar-extends/base-props.js'

const $q = useQuasar()

const columns = [
  { name: 'action', label: '操作', field: 'action', align: 'center' },
  { name: '訪視單', label: '訪視單', field: '訪視單', align: 'left' },
  { name: '歷次紀錄', label: '歷次紀錄', field: '歷次紀錄', align: 'left' },
  { name: '核定日期', label: '核定日期', field: '核定日期', align: 'left' },
  { name: '上次訪視日期', label: '上次訪視日期', field: '上次訪視日期', align: 'left' },
  { name: '下次訪視日期', label: '下次訪視日期', field: '下次訪視日期', align: 'left' },
  { name: '訪視人員', label: '訪視人員', field: '訪視人員', align: 'left' },
  { name: '姓名', label: '姓名', field: '姓名', align: 'left' },
  { name: '身分證字號', label: '身分證字號', field: '身分證字號', align: 'left' },
  { name: '出生日', label: '出生日', field: '出生日', align: 'left' },
  { name: '年齡', label: '年齡', field: '年齡', align: 'left' },
  { name: '性別', label: '性別', field: '性別', align: 'left' },
  { name: '居住地址', label: '居住地址', field: '居住地址', align: 'left' },
  { name: '連絡電話', label: '連絡電話', field: '連絡電話', align: 'left' },
  { name: '聯絡人', label: '聯絡人', field: '聯絡人', align: 'left' },
  { name: '與病人關係', label: '與病人關係', field: '與病人關係', align: 'left' },
]

const tableLoading = ref(false)
const rows = ref([])
const GetHomeCareList = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getHomeCareList(query)
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
  核定日期: null,
  身分證字號: null,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  return Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case '核定日期':
            return filterArray.concat(setOdataFilter({ key, value, operator: 'eq' }))
          case '身分證字號':
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
  GetHomeCareList()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetHomeCareList()
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
      GetHomeCareList()
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
      GetHomeCareList()
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
      GetHomeCareList()
    })
}

const init = async () => {
  GetHomeCareList()
}
init()
</script>
