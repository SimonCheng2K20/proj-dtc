<template>
  <q-page>
    <my-title title="MDC24 各部位外傷診斷碼（附表7.1.10）" no-fixed></my-title>
    <div class="p-2">
      <my-search-area grid-cols="4" v-on:search-submit="searchSubmit" v-on:search-clear="searchClear">
        <my-input-wrapper label="代號">
          <q-select
            v-bind="QSelectProps"
            v-model="search.Code"
            :options="codePartsItems"
            option-label="Code"
            option-value="Code"
            map-options
            @update:model-value="onCodePartsSelect"
          ></q-select>
        </my-input-wrapper>
        <my-input-wrapper label="部位">
          <q-select
            v-bind="QSelectProps"
            v-model="search.Parts"
            :options="codePartsItems"
            option-label="Parts"
            option-value="Parts"
            map-options
            @update:model-value="onCodePartsSelect"
          ></q-select>
        </my-input-wrapper>
        <my-input-wrapper label="手術處置代碼">
          <q-input v-bind="QInputProps" v-model="search.PcsCode" @keydown.enter="searchSubmit"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="英文名稱"> <q-input v-bind="QInputProps" v-model="search.PcsName" @keydown.enter="searchSubmit"></q-input></my-input-wrapper>
      </my-search-area>
      <q-table class="mt-2" v-bind="QTableProps" :rows="rows" :columns="columns" row-key="twdrgid" :pagination="pagination" :loading="tableLoading">
        <template v-slot:bottom> <my-pagination class="mx-auto p-4" v-model="pagination" v-on:update:model-value="GetIcd10Pcs7110"></my-pagination> </template>
      </q-table>
    </div>
  </q-page>
</template>
<script setup>
import { getIcd10Pcs7110 } from 'api'
import { ref, reactive, computed } from 'vue'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { cloneDeep } from 'lodash-es'
import { useQuasar } from 'quasar'
import { QInputProps, QSelectProps, QTableProps } from 'utils/quasar-extends/base-props.js'

const $q = useQuasar()

const columns = [
  { name: 'Code', label: '代號', field: 'Code', align: 'left' },
  { name: 'Parts', label: '部位', field: 'Parts', align: 'left' },
  { name: 'PcsCode', label: '手術處置代碼', field: 'PcsCode', align: 'left' },
  { name: 'PcsName', label: '英文名稱', field: 'PcsName', align: 'left' },
]

const tableLoading = ref(false)
const rows = ref([])
const GetIcd10Pcs7110 = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getIcd10Pcs7110(query)
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
  Code: null,
  Parts: null,
  PcsCode: null,
  PcsName: null,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  return Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'Code':
          case 'Parts':
            return filterArray.concat(setOdataFilter({ key, value, operator: 'eq' }))
          case 'PcsCode':
          case 'PcsName':
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
  GetIcd10Pcs7110()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetIcd10Pcs7110()
}

const onCodePartsSelect = (val) => {
  if (val) {
    search.Code = val.Code
    search.Parts = val.Parts
  }
  searchSubmit()
}

const codePartsItems = [
  { Code: '1', Parts: 'HEAD' },
  { Code: '2', Parts: 'CHEST' },
  { Code: '3', Parts: 'ABDOMINAL' },
  { Code: '4', Parts: 'KIDNEY' },
  { Code: '5', Parts: 'URINARY SYSTEM' },
  { Code: '6', Parts: 'PELVIS OR SPINE' },
  { Code: '7', Parts: 'UPPER LIMB' },
  { Code: '8', Parts: 'LOWER LIMB' },
]

const init = async () => {
  GetIcd10Pcs7110()
}
init()
</script>
