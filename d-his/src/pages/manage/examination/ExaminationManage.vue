<template>
  <q-page class="p-2">
    <my-title title="檢驗項目管理(待api)"></my-title>
    <my-search-area grid-cols="4" v-on:search-submit="searchSubmit" v-on:search-clear="searchClear">
      <my-input-wrapper label="醫令代碼">
        <q-input v-bind="QInputProps" v-model="search.醫令代碼" @keydown.enter="searchSubmit"> </q-input>
      </my-input-wrapper>
      <my-input-wrapper label="項目序號">
        <q-input v-bind="QInputProps" v-model="search.項目序號" @keydown.enter="searchSubmit"> </q-input>
      </my-input-wrapper>
      <my-input-wrapper label="報告簡稱">
        <q-input v-bind="QInputProps" v-model="search.報告簡稱" @keydown.enter="searchSubmit"> </q-input>
      </my-input-wrapper>
      <my-input-wrapper label="檢體代號">
        <q-input v-bind="QInputProps" v-model="search.檢體代號" @keydown.enter="searchSubmit"> </q-input>
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
        <my-pagination class="mx-auto p-4" v-model="pagination" v-on:update:model-value="GetExamination">
        </my-pagination>
      </template>
    </q-table>
  </q-page>
</template>
<script setup>
// import { getExamination } from 'api'
import { ref, reactive, computed } from 'vue'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { cloneDeep } from 'lodash-es'
import { useQuasar } from 'quasar'
import EditItem from './components/ExaminationEditItem.vue'
import { QInputProps, QTableProps } from 'utils/quasar-extends/base-props.js'

const $q = useQuasar()

const columns = [
  { name: 'action', label: '操作', field: 'action', align: 'center' },
  { name: '醫令代碼', label: '醫令代碼', field: '醫令代碼', align: 'left' },
  { name: '醫令名稱', label: '醫令名稱', field: '醫令名稱', align: 'left' },
  { name: '項目序號', label: '項目序號', field: '項目序號', align: 'left' },
  { name: '報告簡稱', label: '報告簡稱', field: '報告簡稱', align: 'left' },
  { name: '檢體', label: '檢體', field: '檢體', align: 'left' },
  { name: '單位', label: '單位', field: '單位', align: 'left' },
  { name: '檢體組別', label: '檢體組別', field: '檢體組別', align: 'left' },
  { name: '資料型態', label: '資料型態', field: '資料型態', align: 'left' },
]

const tableLoading = ref(false)
const rows = ref([])
const GetExamination = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getExamination(query)
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
  醫令代碼: null,
  項目序號: null,
  報告簡稱: null,
  檢體代號: null,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  return Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case '醫令代碼':
          case '項目序號':
          case '報告簡稱':
          case '檢體代號':
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
  GetExamination()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetExamination()
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
      GetExamination()
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
      GetExamination()
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
      GetExamination()
    })
}

const init = async () => {
  GetExamination()
}
init()
</script>

