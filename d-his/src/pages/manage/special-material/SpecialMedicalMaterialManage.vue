<template>
  <q-page>
    <my-title title="特材品項維護" no-fixed></my-title>
    <div class="p-2">
      <my-search-area grid-cols="4" @search-submit="searchSubmit" @search-clear="searchClear">
        <my-input-wrapper label="院內代碼">
          <q-input v-bind="QInputProps" v-model="search.HospitalCode" @keydown.enter="searchSubmit"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="特材代碼">
          <q-input v-bind="QInputProps" v-model="search.SpecialCode" @keydown.enter="searchSubmit"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="功能類別">
          <q-select
            v-bind="QSelectProps"
            v-model="search.Category"
            :options="specialCategoryFilterItems"
            option-label="Name"
            option-value="No"
            map-options
            emit-value
            use-input
            @filter="onSpecialCategoryFilter"
            @input-value="filterLoading = true"
            @update:model-value="searchSubmit"
          >
            <template #no-option="{ inputValue }">
              <q-item v-if="!!inputValue">
                <q-item-section class="text-grey">
                  <q-spinner v-if="filterLoading" color="primary"></q-spinner>
                  <span v-else>找不到符合的資料</span>
                </q-item-section>
              </q-item>
            </template>
            <template #option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>
                    <div v-html="scope.opt.filterLabel"></div>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </my-input-wrapper>
        <my-input-wrapper label="特材名稱">
          <q-input v-bind="QInputProps" v-model="search.Name" @keydown.enter="searchSubmit"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="啟用狀態">
          <q-select
            v-bind="QSelectProps"
            v-model="search.Status"
            :options="activeStatusItems"
            option-label="label"
            option-value="value"
            map-options
            emit-value
            @update:model-value="searchSubmit"
          >
          </q-select>
        </my-input-wrapper>

        <template #btn-expand>
          <q-btn label="新增資料" icon="add" color="add" @click="toAdd" unelevated></q-btn>
        </template>
      </my-search-area>

      <q-table
        v-bind="QTableProps"
        :rows="rows"
        :columns="columns"
        row-key="SpecialCode"
        :pagination="pagination"
        :loading="tableLoading"
        class="mt-2"
      >
        <template v-slot:body-cell-action="{ col, row }">
          <q-td :props="{ col }">
            <q-btn class="mr-1" color="edit" @click="toEdit(row)" label="編輯" unelevated dense></q-btn>
            <q-btn color="delete" @click="toDelete(row)" label="刪除" unelevated dense></q-btn>
          </q-td>
        </template>
        <template v-slot:bottom>
          <my-pagination class="mx-auto p-4" v-model="pagination" v-on:update:model-value="GetSpecialMedicalMaterial">
          </my-pagination>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup>
import { getSpecialMedicalMaterial, getSpecialCategoryList } from 'api'
import { ref, reactive, computed } from 'vue'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { cloneDeep } from 'lodash-es'
import { useQuasar } from 'quasar'
import EditItem from './components/SpecialMedicalMaterialEditItem.vue'
import { QInputProps, QSelectProps, QTableProps } from 'utils/quasar-extends/base-props.js'
import { useFilter } from 'utils/quasar-extends/use-filter.js'
import { activeStatusItems } from 'utils/options.js'

const $q = useQuasar()

const columns = reactive([
  { name: 'action', label: '操作', field: 'action', align: 'center', headerClasses: 'min-w-[104px]' },
  {
    name: 'HospitalCode',
    label: '院內代碼',
    field: 'HospitalCode',
    align: 'left',
  },
  {
    name: 'SpecialCode',
    label: '特材代碼',
    field: 'SpecialCode',
    align: 'left',
  },
  {
    name: 'Name',
    label: '特材名稱',
    field: (row) => (!!row.Cname ? row.Cname : '') + (!!row.Ename ? `（${row.Ename}）` : ''),
    align: 'left',
  },
  {
    name: 'Category',
    label: '功能類別',
    field: (row) => (!!row.Category ? row.Category + ' - ' + row.CategoryName : ''),
    align: 'left',
  },
  {
    name: 'Status',
    label: '啟用狀態',
    field: (row) => activeStatusItems.find((item) => item.value === row.Status)?.label,
    align: 'left',
  },
])

const tableLoading = ref(false)
const rows = ref([])
const GetSpecialMedicalMaterial = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getSpecialMedicalMaterial(query)
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
  HospitalCode: null,
  SpecialCode: null,
  Name: null,
  Category: null,
  Status: null,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  return Object.entries(search)
    .filter(([key, value]) => isValidSearchValue(value))
    .map(([key, value]) => {
      switch (key) {
        case 'HospitalCode':
        case 'SpecialCode':
          return setOdataFilter({ key, value, operator: 'contains' })
        case 'Name':
          return `(${setOdataFilter({
            key: 'Ename',
            value,
            operator: 'contains',
          })} or ${setOdataFilter({
            key: 'Cname',
            value,
            operator: 'contains',
          })})`
        case 'Category':
        case 'Status':
          return setOdataFilter({ key, value, operator: 'eq' })
      }
    })
    .join(' and ')
})

const sortBy = ref([])
const orderBy = computed(() => {
  return sortBy.value.map((item) => item.join(' ')).join(',')
})

const searchSubmit = () => {
  pagination.value.page = 1
  GetSpecialMedicalMaterial()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetSpecialMedicalMaterial()
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
      GetSpecialMedicalMaterial()
    })
}

const toEdit = (row) => {
  const dialog = $q
    .dialog({
      component: EditItem,
      componentProps: {
        editType: 'edit',
        id: row.SpecialCode,
      },
    })
    .onOk(() => {
      dialog.hide()
      GetSpecialMedicalMaterial()
    })
}

const toDelete = (row) => {
  const dialog = $q
    .dialog({
      component: EditItem,
      componentProps: {
        editType: 'delete',
        id: row.SpecialCode,
      },
    })
    .onOk(() => {
      dialog.hide()
      const prePage = pagination.value.page - 1
      if (prePage > 0) {
        if (pagination.value.rowsNumber - 1 <= prePage * pagination.value.rowsPerPage) pagination.value.page = prePage
      }
      GetSpecialMedicalMaterial()
    })
}

const filterLoading = ref(false)
const specialCategoryItems = ref([])
const specialCategoryFilterKeys = ['No', 'Name']
const GetSpecialCategoryList = async () => {
  try {
    const res = await getSpecialCategoryList()
    if (res.data) specialCategoryItems.value = res.data
  } catch (err) {
    console.log(err)
  }
}

const { filterItems: specialCategoryFilterItems, filterHandler: onSpecialCategoryFilter } = useFilter(
  { items: specialCategoryItems, filterKeys: specialCategoryFilterKeys },
  () => {
    filterLoading.value = false
  }
)

const init = async () => {
  GetSpecialMedicalMaterial()
  GetSpecialCategoryList()
}
init()
</script>

