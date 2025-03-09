<template>
  <q-page>
    <my-title title="主診斷與手術不相關（附表7.1.5）47601-2 相關處置碼" no-fixed></my-title>
    <div class="p-2">
      <my-search-area grid-cols="2" v-on:search-submit="searchSubmit" v-on:search-clear="searchClear">
        <my-input-wrapper label="手術處置碼"><q-input v-bind="QInputProps" v-model="search.PcsCode" @keydown.enter="searchSubmit"></q-input></my-input-wrapper>
        <my-input-wrapper label="英文名稱"> <q-input v-bind="QInputProps" v-model="search.EName" @keydown.enter="searchSubmit"></q-input></my-input-wrapper>

        <template #btn-expand>
          <q-btn label="提示" color="purple" @click="toHint" unelevated></q-btn>
        </template>
      </my-search-area>
      <q-table class="mt-2" v-bind="QTableProps" :rows="rows" :columns="columns" row-key="twdrgid" :pagination="pagination" :loading="tableLoading">
        <template v-slot:bottom> <my-pagination class="mx-auto p-4" v-model="pagination" v-on:update:model-value="GetIcd10Pcs715"></my-pagination> </template>
      </q-table>
    </div>
  </q-page>
</template>
<script setup>
import { getIcd10Pcs715 } from 'api'
import { ref, reactive, computed } from 'vue'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { cloneDeep } from 'lodash-es'
import { useQuasar } from 'quasar'
import { QInputProps, QTableProps } from 'utils/quasar-extends/base-props.js'
import Table_715_HintItem from './components/Table-7.1.5-HintItem.vue'

const $q = useQuasar()

const columns = [
  { name: 'PcsCode', label: '手術處置碼', field: 'PcsCode', align: 'left' },
  { name: 'EName', label: '英文名稱', field: 'EName', align: 'left' },
]

const tableLoading = ref(false)
const rows = ref([])
const GetIcd10Pcs715 = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getIcd10Pcs715(query)
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
  PcsCode: null,
  EName: null,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  const str = Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'PcsCode':
          case 'EName':
            return filterArray.concat(setOdataFilter({ key, value, operator: 'contains' }))
          default:
            return filterArray
        }
      } else {
        return filterArray
      }
    }, [])
    .join(' and ')

  const codeFilter = ['47601', '47602'].map((item) => `contains(Code,'${item}')`).join(' and ')

  return str ? `${str} and (${codeFilter})` : codeFilter
})

const sortBy = ref([])
const orderBy = computed(() => {
  return sortBy.value.map((item) => item.join(' ')).join(',')
})

const searchSubmit = () => {
  pagination.value.page = 1
  GetIcd10Pcs715()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetIcd10Pcs715()
}

const toHint = () => {
  const dialog = $q.dialog({
    component: Table_715_HintItem,
    componentProps: {
      type: '47601-2',
    },
  })
}

const init = async () => {
  GetIcd10Pcs715()
}
init()
</script>

