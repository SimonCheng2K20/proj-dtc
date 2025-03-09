<template>
  <q-page>
    <my-title title="中度複雜性針灸適應症（附表4.4.1）" no-fixed></my-title>
    <div class="p-2">
      <my-search-area grid-cols="1" v-on:search-submit="searchSubmit" v-on:search-clear="searchClear">
        <my-input-wrapper label="ICD-10碼">
          <q-input v-bind="QInputProps" v-model="search.Icd10" @keydown.enter="searchSubmit"> </q-input>
        </my-input-wrapper>
      </my-search-area>
      <q-table
        class="mt-2"
        v-bind="QTableProps"
        :rows="rows"
        :columns="columns"
        row-key="chimedid"
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
          <my-pagination class="mx-auto p-4" v-model="pagination" v-on:update:model-value="GetNhiFormChineseMedicine">
          </my-pagination>
        </template>
      </q-table>
    </div>
  </q-page>
</template>
<script setup>
import { getNhiFormChineseMedicine } from 'api'
import { ref, reactive, computed } from 'vue'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { cloneDeep } from 'lodash-es'
import { useQuasar } from 'quasar'
import { QInputProps, QTableProps } from 'utils/quasar-extends/base-props.js'

const $q = useQuasar()

const columns = [
  { name: 'Icd10', label: 'ICD-10碼', field: 'Icd10', align: 'left' },
  { name: 'Icd10Cht', label: 'ICD-10中文名稱', field: 'Icd10Cht', align: 'left' },
]

const tableLoading = ref(false)
const rows = ref([])
const GetNhiFormChineseMedicine = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      nhiFormId: '4.4.1',
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getNhiFormChineseMedicine(query)
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
  Icd10: null,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  return Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'Icd10':
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
  GetNhiFormChineseMedicine()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetNhiFormChineseMedicine()
}

const init = async () => {
  GetNhiFormChineseMedicine()
}
init()
</script>

