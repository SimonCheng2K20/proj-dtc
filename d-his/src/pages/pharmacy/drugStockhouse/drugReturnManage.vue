<template>
  <q-page>
    <my-title no-fixed title="藥房退庫單維護"></my-title>
    <div class="p-2">
      <my-search-area grid-cols="3" @search-submit="searchSubmit" @search-clear="searchClear">
        <my-input-wrapper label="退庫日期" range-input>
          <template #range-input-0>
            <my-date-input
              v-bind="QInputProps"
              v-model="search.BackoutDateStart"
              @keydown.enter="searchSubmit"
              @date-select="searchSubmit"
            ></my-date-input>
          </template>
          <template #range-input-1>
            <my-date-input
              v-bind="QInputProps"
              v-model="search.BackoutDateEnd"
              @keydown.enter="searchSubmit"
              @date-select="searchSubmit"
            ></my-date-input>
          </template>
        </my-input-wrapper>
        <my-input-wrapper label="退庫單號">
          <q-input v-bind="QInputProps" v-model="search.BackoutId" @keydown.enter="searchSubmit"> </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="退庫單狀態">
          <q-select
            v-bind="QSelectProps"
            v-model="search.Status"
            :options="statusOptions"
            option-label="label"
            option-value="value"
            map-options
            emit-value
            @update:model-value="searchSubmit"
          >
          </q-select>
        </my-input-wrapper>
        <my-input-wrapper label="退庫藥房">
          <q-select
            v-bind="QSelectProps"
            :options="pharmacyOptions"
            v-model="search.PharmacyId"
            emit-value
            map-options
            option-value="PharmacyId"
            option-label="CName"
            :loading="pharmacyLoading"
            @update:model-value="searchSubmit"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-italic text-grey"> 無資料 </q-item-section>
              </q-item>
            </template>
          </q-select>
        </my-input-wrapper>
        <my-input-wrapper label="退庫人員">
          <q-select
            v-bind="QSelectProps"
            v-model="search.PersonId"
            :options="options"
            @update:model-value="searchSubmit"
          >
          </q-select>
        </my-input-wrapper>
        <my-input-wrapper label="退庫入庫人">
          <q-select
            v-bind="QSelectProps"
            v-model="search.CheckAcceptPersonId"
            :options="options"
            @update:model-value="searchSubmit"
          >
          </q-select>
        </my-input-wrapper>
      </my-search-area>

      <q-table
        v-bind="QTableProps"
        class="mt-2"
        :rows="rows"
        :columns="columns"
        row-key="BackoutId"
        :pagination="pagination"
        :loading="tableLoading"
      >
        <template v-slot:body-cell-action="{ col, row }">
          <q-td :props="{ col }">
            <div class="flex justify-center items-center gap-2">
              <q-btn
                v-if="row.Status === 0"
                unelevated
                dense
                icon="article"
                color="info"
                label="退庫單明細"
                @click="toEdit(row, 'edit')"
              ></q-btn>
              <q-btn
                v-if="row.Status === 1 || row.Status === -1"
                unelevated
                dense
                icon="article"
                color="accent"
                label="檢視退庫單"
                @click="toEdit(row, 'view')"
              ></q-btn>
            </div>
          </q-td>
        </template>
        <template v-slot:bottom>
          <my-pagination
            class="mx-auto p-4"
            v-model="pagination"
            v-on:update:model-value="GetStoreStockReturn"
          ></my-pagination>
        </template>
      </q-table>
    </div>
  </q-page>
</template>
<script setup>
import { ref, reactive, computed } from 'vue'
import { cloneDeep } from 'lodash-es'
import { useQuasar } from 'quasar'
import dayjs from 'dayjs'

// api
import { getStoreStockReturn, getDrugStore } from 'api'

// utils
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { QInputProps, QSelectProps, QTableProps } from 'utils/quasar-extends/base-props.js'

// components
import Edit from './components/drugReturnManageEdit.vue'

const $q = useQuasar()

const qDateProxy = ref()

const columns = reactive([
  {
    name: 'action',
    label: '操作',
    field: 'action',
    align: 'center',
    style: 'width:250px;',
  },
  { name: 'BackoutId', label: '退庫單號', field: 'BackoutId', align: 'right' },
  {
    name: 'BackoutDate',
    label: '退庫日期',
    field: (row) => (dayjs(row.BackoutDate).isValid() ? dayjs(row.BackoutDate).format('YYYY-MM-DD') : row.BackoutDate),
    align: 'right',
  },
  { name: 'StatusName', label: '訂單狀態', field: 'StatusName', align: 'left' },
  {
    name: 'CheckAcceptDate',
    label: '退庫單簽收/入庫完成時間',
    field: (row) =>
      dayjs(row.CheckAcceptDate).isValid() ? dayjs(row.CheckAcceptDate).format('YYYY-MM-DD') : row.CheckAcceptDate,
    align: 'left',
  },
  { name: 'PersonName', label: '退庫人員', field: 'PersonName', align: 'left' },
  { name: 'CheckAcceptPersonName', label: '庫房入庫人', field: 'CheckAcceptPersonName', align: 'left' },
])

const rows = ref([])

// 人員
const options = ['datacom']

// 訂單狀態
const statusOptions = [
  { label: '已取消退庫單', value: -1 },
  { label: '未簽收', value: 0 },
  { label: '已完成簽收', value: 1 },
]

// 表格資料
const tableLoading = ref(false)

const GetStoreStockReturn = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getStoreStockReturn(query)
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
  BackoutDateStart: null,
  BackoutDateEnd: null,
  BackoutId: null,
  Status: null,
  PharmacyId: null,
  PersonId: null,
  CheckAcceptPersonId: null,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  return Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'BackoutDateStart':
            return filterArray.concat(
              setOdataFilter({
                key: 'BackoutDate',
                value: encodeURIComponent(dayjs(value).format()),
                operator: 'ge',
              })
            )
          case 'BackoutDateEnd':
            return filterArray.concat(
              setOdataFilter({
                key: 'BackoutDate',
                value: encodeURIComponent(dayjs(value).add(1, 'day').format()),
                operator: 'lt',
              })
            )
          case 'Status':
            return filterArray.concat(setOdataFilter({ key, value, operator: 'eq' }))
          case 'PharmacyId':
          case 'PersonId':
          case 'CheckAcceptPersonId':
            return filterArray.concat(setOdataFilter({ key, value, operator: 'eq' }))
          case 'BackoutId':
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

const sortBy = ref([['BackoutDate', 'desc']])
const orderBy = computed(() => {
  return sortBy.value.map((item) => item.join(' ')).join(',')
})

const searchSubmit = () => {
  pagination.value.page = 1
  GetStoreStockReturn()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetStoreStockReturn()
}

// 藥房列表
const pharmacyOptions = ref([])

const pharmacyLoading = ref(false)

const GetDrugStore = async () => {
  try {
    pharmacyLoading.value = true
    const res = await getDrugStore()
    if (res.status === 200) {
      pharmacyOptions.value = res.data.Items
    }
  } catch (err) {
    console.log(err)
  } finally {
    pharmacyLoading.value = false
  }
}

const toEdit = (row, editType) => {
  $q.dialog({
    component: Edit,
    componentProps: {
      editType: editType,
      id: row.BackoutId,
    },
  }).onOk(() => {
    GetStoreStockReturn()
  })
}

const init = async () => {
  GetStoreStockReturn()
  GetDrugStore()
}
init()
</script>
