<template>
  <q-page>
    <my-title>
      <div>科室公用組套維護</div>
    </my-title>

    <div class="p-2">
      <my-search-area grid-cols="3" @search-submit="searchSubmit" @search-clear="searchClear">
        <template #btn-expand>
          <q-btn label="新增資料" color="add" icon="add" @click="toEdit(undefined, 'add')" unelevated></q-btn>
        </template>
        <my-input-wrapper data-group="1" label="部門">
          <q-select
            v-bind="QSelectProps"
            v-model="search.ParentDepartmentNo"
            :options="departmentLayer1FilterItems"
            option-label="Name"
            option-value="No"
            map-options
            emit-value
            use-input
            @filter="onDepertmentLayer1Filter"
            @input-value="filterLoading = true"
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
        <my-input-wrapper data-group="1" label="科別">
          <q-select
            v-bind="QSelectProps"
            v-model="search.DepartmentNo"
            :options="departmentLayer2FilterItems"
            option-label="Name"
            option-value="No"
            map-options
            emit-value
            use-input
            @filter="onDepertmentLayer2Filter"
            @input-value="filterLoading = true"
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
        <my-input-wrapper data-group="1" label="疾病中文名稱">
          <q-input v-bind="QInputProps" v-model="search.CName" @keydown.enter="searchSubmit"> </q-input>
        </my-input-wrapper>
        <my-input-wrapper data-group="1" label="疾病英文名稱">
          <q-input v-bind="QInputProps" v-model="search.EName" @keydown.enter="searchSubmit"> </q-input>
        </my-input-wrapper>
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
        <template #body-cell-action="{ col, row }">
          <q-td :props="{ col }">
            <q-btn class="mr-1" color="edit" @click="toEdit(row, 'edit')" label="編輯" unelevated dense></q-btn>
            <q-btn class="mr-1" color="delete" @click="toEdit(row, 'delete')" label="刪除" unelevated dense></q-btn>
          </q-td>
        </template>
        <template v-slot:bottom>
          <my-pagination
            class="mx-auto p-4"
            v-model="pagination"
            v-on:update:model-value="GetDepPreset"
          ></my-pagination>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup>
import { getDepPreset, getDepartmentDropdown } from 'api'
import { ref, reactive, computed } from 'vue'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { cloneDeep } from 'lodash-es'
import { useQuasar } from 'quasar'
import { QTableProps, QInputProps, QSelectProps } from 'utils/quasar-extends/base-props.js'
import { useFilter } from 'utils/quasar-extends/use-filter.js'
import EditItem from './components/HotkeySettingEditItem.vue'
import { usePresetStore } from 'stores/preset.js'

const presetStore = usePresetStore()
const $q = useQuasar()

const columns = computed(() => {
  let arr = []

  arr = [
    { name: 'action', label: '操作', align: 'center', field: 'action' },
    {
      name: 'ParentDepartmentName',
      label: '部門',
      align: 'center',
      field: 'ParentDepartmentName',
    },
    {
      name: 'DepartmentName',
      label: '科別',
      align: 'center',
      field: 'DepartmentName',
    },
    {
      name: 'CName',
      label: '疾病中文名稱',
      align: 'center',
      field: 'CName',
    },
    {
      name: 'EName',
      label: '疾病英文名稱',
      align: 'center',
      field: 'EName',
    },
  ]

  return arr
})

const tableLoading = ref(false)
const rows = ref([])
const GetDepPreset = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getDepPreset(query)
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
  CName: null,
  EName: null,
  DepartmentNo: null,
  ParentDepartmentNo: null,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  const str = Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'CName':
            return filterArray.concat(
              setOdataFilter({
                key: 'CName',
                value,
                operator: 'contains',
              })
            )
          case 'EName':
            return filterArray.concat(
              setOdataFilter({
                key: 'EName',
                value,
                operator: 'contains',
              })
            )
          case 'DepartmentNo':
            return filterArray.concat(
              setOdataFilter({
                key: 'Department/No',
                value,
                operator: 'eq',
              })
            )
          case 'ParentDepartmentNo':
            return filterArray.concat(
              setOdataFilter({
                key: 'Department/Parent/No',
                value,
                operator: 'eq',
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

  return str
})

const sortBy = ref([])
const orderBy = computed(() => {
  return sortBy.value.map((item) => item.join(' ')).join(',')
})

const searchSubmit = () => {
  pagination.value.page = 1
  GetDepPreset()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetDepPreset()
}

// 部門清單
const filterLoading = ref(false)
const departmentLayer1Items = ref([])
const departmentFilterKeys = ['No', 'Name']
const GetDepartmentDropdownLayer1 = async () => {
  try {
    const res = await getDepartmentDropdown('?layer=1')
    if (res.data) departmentLayer1Items.value = res.data.Items
  } catch (err) {
    console.log(err)
  }
}

const { filterItems: departmentLayer1FilterItems, filterHandler: onDepertmentLayer1Filter } = useFilter(
  { items: departmentLayer1Items, filterKeys: departmentFilterKeys },
  () => {
    filterLoading.value = false
  }
)

// 科別清單
const departmentLayer2Items = ref([])
const GetDepartmentDropdownLayer2 = async () => {
  try {
    const res = await getDepartmentDropdown('?layer=2')
    if (res.data) departmentLayer2Items.value = res.data.Items
  } catch (err) {
    console.log(err)
  }
}

const { filterItems: departmentLayer2FilterItems, filterHandler: onDepertmentLayer2Filter } = useFilter(
  { items: departmentLayer2Items, filterKeys: departmentFilterKeys },
  () => {
    filterLoading.value = false
  }
)

// 編輯按鈕
const toEdit = (row, action) => {
  const dialog = $q
    .dialog({
      component: EditItem,
      componentProps: {
        editType: action,
        id: row?.Id,
        departmentLayer1Items: departmentLayer1Items.value,
        departmentLayer2Items: departmentLayer2Items.value,
      },
    })
    .onOk(() => {
      dialog.hide()
      GetDepPreset()
    })
}

const init = async () => {
  presetStore.getPreset('PublicDiagnosis')
  GetDepPreset()
  GetDepartmentDropdownLayer1()
  GetDepartmentDropdownLayer2()
}
init()
</script>

