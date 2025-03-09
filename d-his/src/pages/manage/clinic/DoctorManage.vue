<template>
  <q-page>
    <my-title title="門診醫生管理" no-fixed></my-title>
    <div class="p-2">
      <my-search-area grid-cols="4" v-on:search-submit="searchSubmit" v-on:search-clear="searchClear">
        <my-input-wrapper label="部門">
          <my-filter-select
            v-bind="QSelectProps"
            v-model="search.ParentDepartmentNo"
            :listKey="departmentLayer1ListKey"
            @update:model-value="searchSubmit"
          >
          </my-filter-select>
        </my-input-wrapper>
        <my-input-wrapper label="科別">
          <my-filter-select
            v-bind="QSelectProps"
            v-model="search.DepartmentNo"
            :listKey="departmentLayer2ListKey"
            @update:model-value="searchSubmit"
          >
          </my-filter-select>
        </my-input-wrapper>
        <my-input-wrapper label="醫生">
          <my-filter-select
            v-bind="QSelectProps"
            v-model="search.PersonId"
            :listKey="doctorListKey"
            @update:model-value="searchSubmit"
          >
          </my-filter-select>
        </my-input-wrapper>
        <my-input-wrapper label="啟用狀態">
          <q-select
            v-bind="QSelectProps"
            v-model="search.Actived"
            :options="activeStatusItems"
            option-label="label"
            option-value="value"
            map-options
            emit-value
            @update:model-value="searchSubmit"
          ></q-select>
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
        :row-key="(row) => [row.ParentDepartmentNo, row.DepartmentNo, row.PersonId].join('-')"
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
          <my-pagination class="mx-auto p-4" v-model="pagination" v-on:update:model-value="GetDoctor"> </my-pagination>
        </template>
      </q-table>
    </div>
  </q-page>
</template>
<script setup>
import { getDoctor } from 'api'
import { ref, reactive, computed } from 'vue'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { cloneDeep } from 'lodash-es'
import { useQuasar } from 'quasar'
import EditItem from './components/DoctorEditItem.vue'
import { QSelectProps, QTableProps } from 'utils/quasar-extends/base-props.js'
import { activeStatusItems } from 'utils/options.js'
import { useList } from 'utils/use-list.js'
import numberFormat from 'utils/numberFormat'

const $q = useQuasar()

const columns = [
  { name: 'action', label: '操作', field: 'action', align: 'center' },
  {
    name: 'ParentDepartmentNo',
    label: '部門名稱',
    field: (row) => departmentLayer1Items.value.find(({ No }) => No === row.ParentDepartmentNo)?.Name,
    align: 'left',
  },
  { name: 'PersonId', label: '醫生代碼', field: 'PersonId', align: 'left' },
  { name: 'Name', label: '醫生姓名', field: 'Name', align: 'left' },
  {
    name: 'DepartmentNo',
    label: '看診科別',
    field: (row) => departmentLayer2Items.value.find(({ No }) => No === row.DepartmentNo)?.Name,
    align: 'left',
  },
  { name: 'FirstLimit', label: '初診上限', field: (row) => numberFormat(row.FirstLimit), align: 'right' },
  { name: 'Limit', label: '人數上限', field: (row) => numberFormat(row.Limit), align: 'right' },
  { name: 'IsActive', label: '啟用狀態', field: (row) => (row.IsActive ? '啟用' : '未啟用'), align: 'left' },
]

const tableLoading = ref(false)
const rows = ref([])
const GetDoctor = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getDoctor(query)
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
  ParentDepartmentNo: null,
  DepartmentNo: null,
  PersonId: null,
  Actived: null,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  return Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'ParentDepartmentNo':
          case 'DepartmentNo':
          case 'PersonId':
          case 'Actived':
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
  GetDoctor()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetDoctor()
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
      GetDoctor()
    })
}

const toEdit = (row) => {
  const dialog = $q
    .dialog({
      component: EditItem,
      componentProps: {
        editType: 'edit',
        id: `ParentDepartmentNo(${row.ParentDepartmentNo}),DepartmentNo(${row.DepartmentNo}),PersonId(${row.PersonId})`,
      },
    })
    .onOk(() => {
      dialog.hide()
      GetDoctor()
    })
}

const toDelete = (row) => {
  const dialog = $q
    .dialog({
      component: EditItem,
      componentProps: {
        editType: 'delete',
        id: `ParentDepartmentNo(${row.ParentDepartmentNo}),DepartmentNo(${row.DepartmentNo}),PersonId(${row.PersonId})`,
      },
    })
    .onOk(() => {
      dialog.hide()
      const prePage = pagination.value.page - 1
      if (prePage > 0) {
        if (pagination.value.rowsNumber - 1 <= prePage * pagination.value.rowsPerPage) pagination.value.page = prePage
      }
      GetDoctor()
    })
}

const doctorListKey = ['employee', '?roleNo=Doctor']
const departmentLayer1ListKey = ['department', '?layer=1']
const departmentLayer2ListKey = ['department', '?layer=2']

const { 'department?layer=1': departmentLayer1Items, 'department?layer=2': departmentLayer2Items } = useList([
  departmentLayer1ListKey,
  departmentLayer2ListKey,
])

const init = async () => {
  GetDoctor()
}
init()
</script>

