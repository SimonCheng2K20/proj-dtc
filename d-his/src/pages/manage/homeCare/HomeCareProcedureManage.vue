<template>
  <q-page>
    <my-title title="醫令診療項目管理(待後臺API)" no-fixed></my-title>
    <div class="p-2">
      <my-search-area grid-cols="1" v-on:search-submit="searchSubmit" v-on:search-clear="searchClear">
        <my-input-wrapper label="支付編號">
          <q-input v-bind="QInputProps" v-model="search.支付編號" @keydown.enter="searchSubmit"> </q-input>
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
          <my-pagination class="mx-auto p-4" v-model="pagination" v-on:update:model-value="GetServiceProcedure">
          </my-pagination>
        </template>
      </q-table>
    </div>
  </q-page>
</template>
<script setup>
// import { getServiceProcedure } from 'api'
import { ref, reactive, computed } from 'vue'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { cloneDeep } from 'lodash-es'
import { useQuasar } from 'quasar'
import EditItem from './components/HomeCareProcedureEditItem.vue'
import { QInputProps, QTableProps } from 'utils/quasar-extends/base-props.js'

const $q = useQuasar()

const columns = [
  { name: 'action', label: '操作', field: 'action', align: 'center' },
  { name: '支付編號', label: '支付編號', field: '支付編號', align: 'left' },
  { name: '診療照護材料項目', label: '診療/照護/材料項目', field: '診療照護材料項目', align: 'left' },
  { name: '支付點數', label: '支付點數', field: '支付點數', align: 'left' },
  { name: '特殊照護群組', label: '特殊照護群組', field: '特殊照護群組', align: 'left' },
]

const tableLoading = ref(false)
const rows = ref([])
const GetServiceProcedure = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getServiceProcedure(query)
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
  支付編號: null,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  return Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case '支付編號':
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
  GetServiceProcedure()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetServiceProcedure()
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
      GetServiceProcedure()
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
      GetServiceProcedure()
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
      GetServiceProcedure()
    })
}

const init = async () => {
  GetServiceProcedure()
}
init()
</script>

