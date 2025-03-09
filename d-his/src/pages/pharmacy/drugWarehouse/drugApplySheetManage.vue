<template>
  <q-page>
    <my-title no-fixed title="藥品申領單維護"></my-title>
    <div class="p-2">
      <my-search-area grid-cols="3" @search-submit="searchSubmit" @search-clear="searchClear">
        <my-input-wrapper label="申領日期" range-input>
          <template #range-input-0>
            <my-date-input
              v-bind="QInputProps"
              v-model="search.ApplyDateStart"
              @keydown.enter="searchSubmit"
              @date-select="searchSubmit"
            ></my-date-input>
          </template>
          <template #range-input-1>
            <my-date-input
              v-bind="QInputProps"
              v-model="search.ApplyDateEnd"
              @keydown.enter="searchSubmit"
              @date-select="searchSubmit"
            ></my-date-input>
          </template>
        </my-input-wrapper>
        <my-input-wrapper label="申領單號"
          ><q-input v-bind="QInputProps" v-model="search.ApplyId" @keydown.enter="searchSubmit"></q-input
        ></my-input-wrapper>
        <my-input-wrapper label="申領單狀態">
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
        <my-input-wrapper label="申領藥房">
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
        <my-input-wrapper label="申領人員">
          <q-select
            v-bind="QSelectProps"
            v-model="search.PersonId"
            :options="options"
            @update:model-value="searchSubmit"
          >
          </q-select>
        </my-input-wrapper>

        <template #btn-expand>
          <q-btn unelevated color="secondary" icon="add" label="新增申領單" @click="toAdd"> </q-btn>
        </template>
      </my-search-area>

      <q-table
        v-bind="QTableProps"
        class="mt-2"
        :rows="rows"
        :columns="columns"
        row-key="ApplyId"
        :pagination="pagination"
        :loading="tableLoading"
      >
        <template v-slot:body-cell-action="{ col, row }">
          <q-td :props="{ col }">
            <div class="flex justify-center items-center gap-2">
              <q-btn v-if="row.Status === 0" class="text-black" unelevated dense color="warning" @click="toDelete(row)">
                <template #default>
                  <q-icon name="remove" size="xs"></q-icon>
                  <span>刪除</span>
                </template>
              </q-btn>
              <q-btn
                v-if="row.Status === 0 || row.Status === 1"
                unelevated
                dense
                icon="article"
                color="info"
                label="申領單明細"
                @click="toEdit(row)"
              ></q-btn>
              <q-btn
                v-if="row.Status === 2 || row.Status === -1"
                unelevated
                dense
                icon="article"
                color="accent"
                label="檢視申領單"
                @click="toView(row)"
              ></q-btn>
            </div>
          </q-td>
        </template>
        <template v-slot:bottom>
          <my-pagination
            class="mx-auto p-4"
            v-model="pagination"
            v-on:update:model-value="GetStoreStockApply"
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
import { getStoreStockApply, getDrugStore } from 'api'

// utils
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { QInputProps, QSelectProps, QTableProps } from 'utils/quasar-extends/base-props.js'

// components
import EditItem from './components/DrugApplySheetManageEditItem.vue'

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
  { name: 'ApplyId', label: '申領單號', field: 'ApplyId', align: 'right' },
  {
    name: 'ApplyDate',
    label: '申領日期',
    field: (row) => (dayjs(row.ApplyDate).isValid() ? dayjs(row.ApplyDate).format('YYYY-MM-DD') : row.ApplyDate),
    align: 'right',
  },
  {
    name: 'Warehousingdate',
    label: '入庫時間',
    field: (row) =>
      dayjs(row.Warehousingdate).isValid() ? dayjs(row.Warehousingdate).format('YYYY-MM-DD') : row.Warehousingdate,
    align: 'right',
  },
  { name: 'StatusName', label: '訂單狀態', field: 'StatusName', align: 'left' },
  { name: 'PharmacyName', label: '申領藥房', field: 'PharmacyName', align: 'left' },
  { name: 'PersonName', label: '申領人員', field: 'PersonName', align: 'left' },
  {
    name: 'ModifyDatetime',
    label: '異動日期',
    field: (row) =>
      dayjs(row.ModifyDatetime).isValid() ? dayjs(row.ModifyDatetime).format('YYYY-MM-DD') : row.ModifyDatetime,
    align: 'right',
  },
])

const rows = ref([])

// 人員
const options = ['datacom']

// 訂單狀態
const statusOptions = [
  { label: '已取消訂單', value: -1 },
  { label: '未出庫', value: 0 },
  { label: '已出庫', value: 1 },
  { label: '已完成申領', value: 2 },
]

// 表格資料
const tableLoading = ref(false)

const GetStoreStockApply = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getStoreStockApply(query)
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
  ApplyDateStart: null,
  ApplyDateEnd: null,
  ApplyId: null,
  Status: null,
  PharmacyId: null,
  PersonId: null,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  return Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'ApplyDateStart':
            return filterArray.concat(
              setOdataFilter({
                key: 'CreatedDatetime',
                value: encodeURIComponent(dayjs(value).format()),
                operator: 'ge',
              })
            )
          case 'ApplyDateEnd':
            return filterArray.concat(
              setOdataFilter({
                key: 'CreatedDatetime',
                value: encodeURIComponent(dayjs(value).add(1, 'day').format()),
                operator: 'lt',
              })
            )
          case 'PharmacyId':
          case 'Status':
          case 'PersonId':
            return filterArray.concat(setOdataFilter({ key, value, operator: 'eq' }))
          case 'ApplyId':
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

const sortBy = ref([['ApplyDate', 'desc']])
const orderBy = computed(() => {
  return sortBy.value.map((item) => item.join(' ')).join(',')
})

const searchSubmit = () => {
  pagination.value.page = 1
  GetStoreStockApply()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetStoreStockApply()
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

const toAdd = () => {
  $q.dialog({
    component: EditItem,
    componentProps: {
      editType: 'add',
    },
  }).onOk(() => {
    pagination.value.page = 1
    GetStoreStockApply()
  })
}

const toEdit = (row) => {
  $q.dialog({
    component: EditItem,
    componentProps: {
      editType: 'edit',
      id: row.ApplyId,
    },
  }).onOk(() => {
    GetStoreStockApply()
  })
}

const toDelete = (row) => {
  $q.dialog({
    component: EditItem,
    componentProps: {
      editType: 'delete',
      id: row.ApplyId,
    },
  }).onOk(() => {
    const prePage = pagination.value.page - 1
    if (prePage > 0) {
      if (pagination.value.rowsNumber - 1 <= prePage * pagination.value.rowsPerPage) pagination.value.page = prePage
    }
    GetStoreStockApply()
  })
}

const toView = (row) => {
  $q.dialog({
    component: EditItem,
    componentProps: {
      editType: 'view',
      id: row.ApplyId,
    },
  })
}

const init = async () => {
  GetStoreStockApply()
  GetDrugStore()
}
init()
</script>
