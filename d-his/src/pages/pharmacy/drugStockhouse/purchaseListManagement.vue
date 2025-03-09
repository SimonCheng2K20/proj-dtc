<template>
  <q-page>
    <my-title no-fixed title="採購單管理"></my-title>
    <div class="p-2">
      <my-search-area gridCols="3" class="mb-2" @search-submit="searchSubmit" @search-clear="searchClear">
        <my-input-wrapper label="採購日期">
          <my-date-input
            v-bind="QInputProps"
            v-model="search.PurchaseDatetime"
            @keydown.enter="searchSubmit"
            @date-select="searchSubmit"
          ></my-date-input>
        </my-input-wrapper>
        <my-input-wrapper label="採購單號"
          ><q-input v-bind="QInputProps" v-model="search.PurchaseId"></q-input
        ></my-input-wrapper>
        <my-input-wrapper label="採購人員"
          ><q-select v-bind="QSelectProps" :options="option" v-model="search.BuyerId"></q-select
        ></my-input-wrapper>
        <template v-slot:btn-expand>
          <q-btn unelevated color="secondary" icon="add" label="新增採購單" @click="AddOrder"> </q-btn>
        </template>
      </my-search-area>

      <q-table
        v-bind="QTableProps"
        :rows="rows"
        :columns="columns"
        row-key="name"
        :loading="tableLoading"
        :pagination="pagination"
      >
        <template #body-cell-action="{ row, col }">
          <q-td :props="{ row, col }">
            <div class="flex justify-center items-center gap-1">
              <q-btn
                v-if="row.OrderStatus === 0"
                class="text-black"
                unelevated
                dense
                color="warning"
                @click="DeleteOrder(row)"
              >
                <template #default>
                  <q-icon name="remove" size="xs"></q-icon>
                  <span>刪除</span>
                </template>
              </q-btn>
              <q-btn
                v-if="row.OrderStatus === 0"
                unelevated
                dense
                icon="article"
                color="info"
                label="採購單明細"
                @click="OrderDetails(row)"
              ></q-btn>
              <q-btn
                v-if="row.OrderStatus === 0"
                unelevated
                dense
                icon="article"
                color="positive"
                label="採購單入庫"
                @click="OrderInStock(row)"
              ></q-btn>
              <q-btn
                v-if="row.OrderStatus === -1 || row.OrderStatus === 1"
                unelevated
                dense
                icon="article"
                color="accent"
                label="檢視採購單"
                @click="ViewOrder(row)"
              ></q-btn>
            </div>
          </q-td>
        </template>
        <template v-slot:bottom>
          <my-pagination class="mx-auto p-4" v-model="pagination" @update:model-value="GetOrder"></my-pagination>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useQuasar } from 'quasar'
import dayjs from 'dayjs'
import Edit from './components/purchaseListEdit.vue'
import { cloneDeep } from 'lodash-es'

// api
import { getOrder } from 'api'

// utils
import setSearchQuery from 'utils/setSearchQuery'
import setOdataFilter from 'utils/setOdataFilter'
import { QSelectProps, QInputProps, QTableProps } from 'utils/quasar-extends/base-props'
import isValidSearchValue from 'utils/isValidSearchValue.js'

const columns = computed(() => {
  return [
    {
      name: 'action',
      label: '操作',
      align: 'center',
      field: 'action',
      style: 'width:350px',
    },
    {
      name: 'PurchaseId',
      label: '採購單號',
      align: 'right',
      field: 'PurchaseId',
    },
    {
      name: 'PurchaseDatetime',
      label: '採購日期',
      align: 'right',
      field: (row) => ChageDateFormat(row.PurchaseDatetime),
    },
    {
      name: 'OrderStatus',
      label: '訂單狀態',
      align: 'left',
      field: 'OrderStatusName',
    },
    {
      name: 'InStockDatetime',
      label: '訂單完成時間',
      align: 'right',
      field: (row) => ChageDateFormat(row.InStockDatetime),
    },
    { name: 'BuyerId', label: '採購人員ID', align: 'left', field: 'BuyerId' },
    {
      name: 'ModifyDatetime',
      label: '異動日期',
      align: 'right',
      field: (row) => ChageDateFormat(row.ModifyDatetime),
    },
  ]
})

const ChageDateFormat = (date) => {
  return date === null ? null : dayjs(date).format('YYYY/MM/DD')
}

const rows = ref([])

const option = ['datacom', '王採購']

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

const initData = {}

initData.search = {
  PurchaseDatetime: null,
  PurchaseId: null,
  BuyerId: null,
}

const search = reactive(cloneDeep(initData.search))

// $orderBy參數
const sortBy = ref([['PurchaseDatetime', 'desc']])

const orderBy = computed(() => {
  return sortBy.value.map((item) => item.join(' ')).join(',')
})

// $filter參數
const filter = computed(() => {
  const str = Object.entries(search)
    .filter(([key, value]) => isValidSearchValue(value))
    .map(([key, value]) => {
      switch (key) {
        case 'PurchaseDatetime':
          let str1 = setOdataFilter({
            key,
            value: encodeURIComponent(dayjs(value).format()),
            operator: 'ge',
          })
          let str2 = setOdataFilter({
            key,
            value: encodeURIComponent(dayjs(value).add(1, 'day').format()),
            operator: 'lt',
          })
          return `${str1} and ${str2}`
        case 'PurchaseId':
          return setOdataFilter({ key, value, operator: 'contains' })
        case 'BuyerId':
          return setOdataFilter({ key, value, operator: 'eq' })
      }
    })
    .join(' and ')

  return str
})

const tableLoading = ref(false)

// 表格資料請求
const GetOrder = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getOrder(query)
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

// 查詢按鈕
const searchSubmit = () => {
  console.log(search.PurchaseDatetime)
  pagination.value.page = 1
  GetOrder()
}

// 清除按鈕
const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetOrder()
}

// 編輯彈出視窗
const $q = useQuasar()

const AddOrder = () => {
  $q.dialog({
    component: Edit,
    componentProps: {
      editType: 'add',
      gridCols: 3,
    },
  }).onOk(() => {
    pagination.value.page = 1
    GetOrder()
  })
}

const DeleteOrder = (row) => {
  $q.dialog({
    component: Edit,
    componentProps: {
      editType: 'delete',
      gridCols: 4,
      row,
    },
  }).onOk(() => {
    const prePage = pagination.value.page - 1
    if (prePage > 0) {
      if (pagination.value.rowsNumber - 1 <= prePage * pagination.value.rowsPerPage) pagination.value.page = prePage
    }
    GetOrder()
  })
}

const OrderDetails = (row) => {
  $q.dialog({
    component: Edit,
    componentProps: {
      editType: 'details',
      gridCols: 4,
      row,
    },
  }).onOk(() => {
    GetOrder()
  })
}

const OrderInStock = (row) => {
  $q.dialog({
    component: Edit,
    componentProps: {
      editType: 'inStock',
      gridCols: 4,
      row,
      GetOrder,
    },
  }).onOk(() => {
    GetOrder()
  })
}

const ViewOrder = (row) => {
  $q.dialog({
    component: Edit,
    componentProps: {
      editType: 'view',
      gridCols: 3,
      row,
    },
  })
}

const init = async () => {
  await GetOrder()
}

init()
</script>

