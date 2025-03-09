<template>
  <q-page class="p-2">
    <my-title title="慢性精神疾病申請書與評量表查詢"></my-title>
    <my-search-area grid-cols="3" v-on:search-submit="searchSubmit" v-on:search-clear="searchClear">
      <my-input-wrapper label="申請日期" range-input class="col-span-2">
        <template #range-input-0>
          <my-date-input
            v-bind="QInputProps"
            v-model="search.申請日期Start"
            @keydown.enter="searchSubmit"
          ></my-date-input>
        </template>
        <template #range-input-1>
          <my-date-input
            v-bind="QInputProps"
            v-model="search.申請日期End"
            @keydown.enter="searchSubmit"
          ></my-date-input>
        </template>
      </my-input-wrapper>
      <my-input-wrapper label="申請單類型">
        <q-select v-bind="QSelectProps" v-model="search.申請單類型" @keydown.enter="searchSubmit"> </q-select>
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
        <my-pagination class="mx-auto p-4" v-model="pagination" v-on:update:model-value="GetMentalList">
        </my-pagination>
      </template>
    </q-table>
  </q-page>
</template>
<script setup>
import { ref, reactive, computed } from 'vue'
import { cloneDeep } from 'lodash-es'
import { useQuasar } from 'quasar'
import dayjs from 'dayjs'

// api
// import { getMentalList } from 'api'

// components
import EditItem from './components/MentalApplyEvaluateEditItem.vue'

// utils
import { QInputProps, QTableProps, QSelectProps } from 'utils/quasar-extends/base-props.js'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'

const $q = useQuasar()

const columns = [
  { name: 'action', label: '操作', field: 'action', align: 'center' },
  { name: '項次', label: '項次', field: '項次', align: 'left' },
  { name: '申請日期', label: '申請日期', field: '申請日期', align: 'left' },
  { name: '申請書', label: '申請書', field: '申請書', align: 'left' },
  { name: '申請單類型', label: '申請單類型', field: '申請單類型', align: 'left' },
  { name: '姓名', label: '姓名', field: '姓名', align: 'left' },
  { name: '身分證字號', label: '身分證字號', field: '身分證字號', align: 'left' },
  { name: '年齡', label: '年齡', field: '年齡', align: 'left' },
  { name: '性別', label: '性別', field: '性別', align: 'left' },
  { name: '前次核定起日', label: '前次核定起日', field: '前次核定起日', align: 'left' },
  { name: '個案所在地', label: '個案所在地', field: '個案所在地', align: 'left' },
  { name: '居住地址', label: '居住地址', field: '居住地址', align: 'left' },
  { name: '連絡電話', label: '連絡電話', field: '連絡電話', align: 'left' },
  { name: '聯絡人', label: '聯絡人', field: '聯絡人', align: 'left' },
]

const tableLoading = ref(false)
const rows = ref([])
const GetMentalList = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getMentalList(query)
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
  申請日期Start: null,
  申請日期end: null,
  申請單類型: null,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  return Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case '申請單類型':
            return filterArray.concat(setOdataFilter({ key, value, operator: 'eq' }))
          case '申請日期Start':
            return filterArray.concat(
              setOdataFilter({
                key,
                value: encodeURIComponent(dayjs(value).format()),
                operator: 'contains',
              })
            )
          case '申請日期end':
            return filterArray.concat(
              setOdataFilter({
                key,
                value: encodeURIComponent(dayjs(value).add(1, 'day').format()),
                operator: 'contains',
              })
            )
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
  GetMentalList()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetMentalList()
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
      GetMentalList()
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
      GetMentalList()
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
      GetMentalList()
    })
}

const init = async () => {
  GetMentalList()
}
init()
</script>
