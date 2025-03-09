<template>
  <div>
    <my-title no-fixed title="藥品廠商維護"></my-title>
    <div class="p-2">
      <my-search-area class="mb-2" gridCols="2" @searchSubmit="searchSubmit" @searchClear="searchClear">
        <my-input-wrapper label="廠商編號">
          <q-input v-bind="QInputProps" v-model="search.VendorId" @keydown.enter="searchSubmit"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="廠商名稱">
          <q-input v-bind="QInputProps" v-model="search.Name" @keydown.enter="searchSubmit"></q-input>
        </my-input-wrapper>

        <template #btn-expand>
          <q-btn label="新增資料" icon="add" color="add" @click="toAdd" unelevated></q-btn>
        </template>
      </my-search-area>

      <q-table v-bind="QTableProps" :columns="columns" :rows="rows" row-key="VendorId" :pagination="pagination">
        <template v-slot:body-cell-action="{ col, row }">
          <q-td :props="{ col }">
            <q-btn class="mr-1" color="edit" @click="toEdit(row)" label="編輯" unelevated dense></q-btn>
            <q-btn color="delete" @click="toDelete(row)" label="刪除" unelevated dense></q-btn>
          </q-td>
        </template>
        <template #bottom>
          <my-pagination class="mx-auto" v-model="pagination" @update:modelValue="GetMedVender"></my-pagination>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { format, useQuasar } from 'quasar'
import _ from 'lodash'

// api
import { getMedVender, getMedVenderItem, postMedVender, putMedVender, deleteMedVender } from 'api'

// components
import DrugVendorEditItem from './components/DrugVendorEditItem.vue'

// utils
import isValidSearchValue from 'utils/isValidSearchValue.js'
import setOdataFilter from 'utils/setOdataFilter'
import setSearchQuery from 'utils/setSearchQuery'
import { QInputProps, QTableProps } from 'utils/quasar-extends/base-props.js'

const $q = useQuasar()

const loading = ref(true)

const columns = computed(() => {
  return [
    { name: 'action', label: '操作', field: 'action', align: 'center' },
    { name: 'VendorId', label: '廠商編號', field: 'VendorId', align: 'center', headerClasses: 'min-w-[104px]' },
    { name: 'Name', label: '廠商名稱', field: 'Name', align: 'left' },
    { name: 'Address', label: '廠商地址', field: 'Address', align: 'left' },
    { name: 'Contact', label: '廠商聯絡人', field: 'Contact', align: 'left' },
    { name: 'Phone', label: '廠商電話', field: 'Phone', align: 'left' },
    { name: 'TaxId', label: '統一發票號碼', field: 'TaxId', align: 'left' },
  ]
})

const rows = ref([])

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

const GetMedVender = async () => {
  try {
    loading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getMedVender(query)

    switch (res.status) {
      case 200:
        rows.value = res.data.Items
        pagination.value.rowsNumber = res.data.Count

        break
      default: {
        const errText = await res.text()
        throw Error(`${res.status}: ${errText}`)
      }
    }
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
  }
}

const initData = {}

initData.search = {
  VendorId: '',
  Name: '',
}

const search = reactive({ VendorId: '', Name: '' })

// $orderBy參數
const sortBy = ref([])

const orderBy = computed(() => {
  return sortBy.value.map((item) => item.join(' ')).join(',')
})

// filter
const filter = computed(() => {
  const str = Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'VendorId':
          case 'Name':
            return filterArray.concat(setOdataFilter({ key, value, operator: 'contains' }))
        }
      } else {
        return filterArray
      }
    }, [])
    .join(' and ')

  return str
})

const searchSubmit = () => {
  pagination.value.page = 1
  GetMedVender()
}

const searchClear = () => {
  Object.assign(search, initData.search)
  pagination.value.page = 1
  GetMedVender()
}

const toAdd = () => {
  $q.dialog({
    component: DrugVendorEditItem,
    componentProps: {
      editType: 'add',
    },
  }).onOk(() => {
    GetMedVender()
  })
}

const toEdit = (row) => {
  $q.dialog({
    component: DrugVendorEditItem,
    componentProps: {
      id: row.VendorId,
      editType: 'edit',
    },
  }).onOk(() => {
    GetMedVender()
  })
}

const toDelete = (row) => {
  $q.dialog({
    component: DrugVendorEditItem,
    componentProps: {
      id: row.VendorId,
      editType: 'delete',
    },
  }).onOk(() => {
    if (pagination.value.rowsNumber - 1 !== 0) {
      pagination.value.page = Math.ceil((pagination.value.rowsNumber - 1) / pagination.value.rowsPerPage)
    }

    GetMedVender()
  })
}

const init = () => {
  GetMedVender()
}
init()
</script>
