<template>
  <q-page class="px-2">
    <my-title title="員工資料管理"></my-title>
    <my-search-area grid-cols="4" v-on:search-submit="searchSubmit" v-on:search-clear="searchClear">
      <my-input-wrapper label="員工編號">
        <q-input v-bind="QInputProps" v-model="search.AccountNo" @keydown.enter="searchSubmit"> </q-input>
      </my-input-wrapper>
      <my-input-wrapper label="身分證號">
        <q-input v-bind="QInputProps" v-model="search.PersonId" @keydown.enter="searchSubmit"> </q-input>
      </my-input-wrapper>
      <my-input-wrapper label="姓名">
        <q-input v-bind="QInputProps" v-model="search.Name" @keydown.enter="searchSubmit"></q-input>
      </my-input-wrapper>
      <my-input-wrapper label="性別">
        <q-select
          v-bind="QSelectProps"
          v-model="search.GenderCode"
          :options="genderCodeItems"
          option-label="label"
          option-value="value"
          map-options
          emit-value
          @update:model-value="searchSubmit"
        >
        </q-select>
      </my-input-wrapper>
      <my-input-wrapper label="科別">
        <q-select
          v-bind="QSelectProps"
          v-model="search.DepartmentNo"
          :options="departmentItems"
          option-label="Name"
          option-value="No"
          map-options
          emit-value
          @update:model-value="searchSubmit"
        >
        </q-select>
      </my-input-wrapper>
      <my-input-wrapper label="職稱">
        <q-select
          v-bind="QSelectProps"
          v-model="search.EmployeeDuty"
          :options="roleItems"
          option-label="Name"
          option-value="No"
          map-options
          emit-value
          @update:model-value="searchSubmit"
        >
        </q-select>
      </my-input-wrapper>
      <my-input-wrapper label="啟用狀態">
        <q-select
          v-bind="QSelectProps"
          v-model="search.Status"
          :options="activeStatusNumberItems"
          option-label="label"
          option-value="value"
          map-options
          emit-value
          @update:model-value="searchSubmit"
        >
        </q-select>
      </my-input-wrapper>

      <template v-slot:btn-expand>
        <q-btn unelevated color="secondary" icon="add" label="新增資料" @click="toAdd"> </q-btn>
      </template>
    </my-search-area>

    <q-table
      v-bind="QTableProps"
      :rows="rows"
      :columns="columns"
      row-key="PersonId"
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
        <my-pagination class="mx-auto p-4" v-model="pagination" v-on:update:model-value="GetEmployee"> </my-pagination>
      </template>
    </q-table>
  </q-page>
</template>
<script setup>
import { getEmployee, getDepartmentDropdown, getRoleSelectNoList, getAccountList } from 'api'
import { ref, reactive, computed } from 'vue'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { cloneDeep } from 'lodash-es'
import { useQuasar } from 'quasar'
import EditItem from './components/EmployeeEditItem.vue'
import { QInputProps, QSelectProps, QTableProps } from 'utils/quasar-extends/base-props.js'
import { genderCodeItems, activeStatusNumberItems } from 'utils/options.js'

const $q = useQuasar()

const columns = [
  { name: 'action', label: '操作', field: 'action', align: 'center' },
  { name: 'AccountNo', label: '員工帳號', field: 'AccountNo', align: 'center' },
  { name: 'PersonId', label: '身分證號', field: 'PersonId', align: 'center' },
  { name: 'Name', label: '姓名', field: (row) => row.Person.Name, align: 'center' },
  {
    name: 'GenderCode',
    label: '性別',
    field: (row) => genderCodeItems.find(({ value }) => value === row.Person.GenderCode)?.label,
    align: 'center',
  },
  {
    name: 'DepartmentNo',
    label: '部門',
    field: (row) => departmentItems.value.find((d) => row.DepartmentNo === d.No)?.Name,
    align: 'center',
  },
  {
    name: 'EmployeeDuty',
    label: '職稱',
    field: (row) => roleItems.value.find(({ No }) => No === row.EmployeeDuty)?.Name,
    align: 'center',
  },
  {
    name: 'Status',
    label: '啟用狀態',
    field: (row) => activeStatusNumberItems.find(({ value }) => value === row.Status)?.label,
    align: 'center',
  },
]

const tableLoading = ref(false)
const rows = ref([])
const GetEmployee = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getEmployee(query)
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
  AccountNo: null,
  PersonId: null,
  Name: null,
  GenderCode: null,
  DepartmentNo: null,
  EmployeeDuty: null,
  Status: null,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  return Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'AccountNo':
          case 'PersonId':
          case 'Name':
            return filterArray.concat(setOdataFilter({ key, value, operator: 'contains' }))
          case 'GenderCode':
          case 'DepartmentNo':
          case 'EmployeeDuty':
          case 'Status':
            return filterArray.concat(setOdataFilter({ key, value, operator: 'eq' }))
          default:
            return filterArray
        }
      } else {
        return filterArray
      }
    }, [])
    .join(' and ')
})

const sortBy = ref([['Person/Name asc']])
const orderBy = computed(() => {
  return sortBy.value.map((item) => item.join(' ')).join(',')
})

const searchSubmit = () => {
  pagination.value.page = 1
  GetEmployee()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetEmployee()
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
      GetEmployee()
    })
}

const toEdit = (row) => {
  const dialog = $q
    .dialog({
      component: EditItem,
      componentProps: {
        editType: 'edit',
        id: row.PersonId,
      },
    })
    .onOk(() => {
      dialog.hide()
      GetEmployee()
    })
}

const hasAccount = ref(0)
const GetAccount = async (AccountNo) => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $filter: `contains(No,'${AccountNo}')`,
    })
    const res = await getAccountList(query)
    hasAccount.value = res.data.Count
  } catch (err) {
    console.log(err)
  } finally {
    tableLoading.value = false
  }
}

const toDelete = async (row) => {
  await GetAccount(row.AccountNo)
  if (hasAccount.value !== 0) {
    $q.notify({
      type: 'negative',
      message: '此員工帳號未被刪除，請先到帳號管理刪除帳號!',
      position: 'top',
    })
    return
  }
  const dialog = $q
    .dialog({
      component: EditItem,
      componentProps: {
        editType: 'delete',
        id: row.PersonId,
      },
    })
    .onOk(() => {
      dialog.hide()
      const prePage = pagination.value.page - 1
      if (prePage > 0) {
        if (pagination.value.rowsNumber - 1 <= prePage * pagination.value.rowsPerPage) pagination.value.page = prePage
      }
      GetEmployee()
    })
}

const departmentItems = ref([])
const GetDepartmentDropdown = async () => {
  try {
    const query = setSearchQuery({ layer: 2 })
    const res = await getDepartmentDropdown(query)
    departmentItems.value = res.data.Items
  } catch (error) {
    console.log(error)
  }
}

const roleItems = ref([])
const GetRoleSelectNoList = async () => {
  try {
    const query = setSearchQuery({ type: 2 })
    const res = await getRoleSelectNoList(query)
    roleItems.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const init = async () => {
  GetEmployee()
  GetDepartmentDropdown()
  GetRoleSelectNoList()
}
init()
</script>

