<template>
  <q-page>
    <my-title title="系統帳號管理"> </my-title>
    <my-search-area grid-cols="4" @searchSubmit="searchSubmit" @searchClear="searchClear">
      <my-input-wrapper label="使用者帳號">
        <q-input v-bind="QInputProps" v-model="search.No" @keydown.enter="searchSubmit"></q-input>
      </my-input-wrapper>
      <my-input-wrapper label="帳號姓名">
        <q-input v-bind="QInputProps" v-model="search.Name" @keydown.enter="searchSubmit"></q-input>
      </my-input-wrapper>
      <my-input-wrapper label="授權角色">
        <q-select
          v-bind="QSelectProps"
          v-model="search.roleNo"
          :options="roleItems"
          optionLabel="Name"
          optionValue="No"
          emit-value
          map-options
          @update:model-value="searchSubmit"
        ></q-select>
      </my-input-wrapper>
      <my-input-wrapper label="隸屬科別">
        <q-select
          v-bind="QSelectProps"
          v-model="search.deptNo"
          :options="departmentItems"
          optionLabel="Name"
          optionValue="No"
          emit-value
          map-options
          @update:model-value="searchSubmit"
        ></q-select>
      </my-input-wrapper>
      <my-input-wrapper label="帳號狀態">
        <q-select
          v-bind="QSelectProps"
          v-model="search.Status"
          :options="statusList"
          optionLabel="Name"
          optionValue="Id"
          emit-value
          map-options
          @update:model-value="searchSubmit"
        ></q-select>
      </my-input-wrapper>
      <!-- <template v-slot:btn-expand>
        <q-btn unelevated color="secondary" icon="add" label="新增資料" @click="toAdd"> </q-btn>
      </template> -->
    </my-search-area>
    <div class="px-2">
      <q-table
        v-bind="QTableProps"
        :columns="columns"
        :rows="rows"
        row-key="No"
        :pagination="pagination"
        :loading="tableLoading"
      >
        <template v-slot:body-cell-action="{ col, row }">
          <q-td :props="{ col }">
            <q-btn
              class="mr-1"
              color="yellow-9"
              @click="toResetPassword(row)"
              label="重置密碼"
              unelevated
              dense
            ></q-btn>
            <q-btn class="mr-1" color="edit" @click="toEdit(row)" label="編輯" unelevated dense></q-btn>
            <q-btn color="delete" @click="toDelete(row)" label="刪除" unelevated dense></q-btn>
          </q-td>
        </template>

        <template v-slot:bottom>
          <my-pagination class="mx-auto p-4" v-model="pagination" v-on:update:model-value="GetAccount"> </my-pagination>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup>
import { getAccountList, getAccountStatusList, getRole, getDepartmentDropdown } from 'api'
import { reactive, ref, computed } from 'vue'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { QInputProps, QSelectProps, QTableProps } from 'utils/quasar-extends/base-props.js'
import { useQuasar } from 'quasar'
import { cloneDeep } from 'lodash-es'
import EditItem from './components/AccountEditItem.vue'
import ResetPassword from './components/ResetPassword.vue'

const $q = useQuasar()
const columns = [
  { name: 'action', label: '操作', field: 'action', align: 'center', headerClasses: 'min-w-[180px]' },
  { name: 'DepartmentName', label: '隸屬科別', field: 'DepartmentName', align: 'left' },
  { name: 'No', label: '使用者帳號', field: 'No', align: 'left' },
  { name: 'Name', label: '使用者姓名', field: 'Name', align: 'left' },
  { name: 'PersonId', label: '身份證字號', field: 'PersonId', align: 'left' },
  {
    name: 'RoleNos',
    label: '授權角色',
    field: (row) => row.RoleNos.map((roleNo) => roleItems.value.find(({ No }) => No === roleNo)?.Name).join(', '),
    align: 'left',
  },
  {
    name: 'Status',
    label: '帳號狀態',
    field: (row) => statusList.value.find(({ Id }) => Id === row.Status)?.Name,
    align: 'left',
  },
  { name: 'Phone', label: '連絡電話', field: 'Phone', align: 'left' },
  { name: 'Email', label: 'E-MAIL', field: 'Email', align: 'left' },
  { name: 'Expiration', label: '帳號到期日', field: (row) => row.Expiration?.substring(0, 10), align: 'left' },
  { name: 'LastLoginTime', label: '最後登入時間', field: (row) => row.LastLoginTime?.substring(0, 10), align: 'left' },
]

const tableLoading = ref(false)
const rows = ref([])
const GetAccount = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      roleNo: search.roleNo,
      deptNo: search.deptNo,
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getAccountList(query)
    rows.value = res.data.Items
    pagination.value.rowsNumber = res.data.Count
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
  roleNo: null,
  deptNo: null,
  Status: null,
  No: null,
  Name: null,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  return Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'Status':
            return filterArray.concat(setOdataFilter({ key, value, operator: 'eq' }))
          case 'No':
          case 'Name':
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
  GetAccount()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetAccount()
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
      GetAccount()
    })
}

const toEdit = (row) => {
  const dialog = $q
    .dialog({
      component: EditItem,
      componentProps: {
        editType: 'edit',
        id: row.No,
      },
    })
    .onOk(() => {
      dialog.hide()
      GetAccount()
    })
}

const toDelete = (row) => {
  const dialog = $q
    .dialog({
      component: EditItem,
      componentProps: {
        editType: 'delete',
        id: row.No,
      },
    })
    .onOk(() => {
      dialog.hide()
      const prePage = pagination.value.page - 1
      if (prePage > 0) {
        if (pagination.value.rowsNumber - 1 <= prePage * pagination.value.rowsPerPage) pagination.value.page = prePage
      }
      GetAccount()
    })
}

const toResetPassword = (row) => {
  const dialog = $q
    .dialog({
      component: ResetPassword,
      componentProps: {
        data: row,
      },
    })
    .onOk(() => {
      dialog.hide()
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
const GetRole = async () => {
  try {
    const res = await getRole()
    roleItems.value = res.data.Items
  } catch (error) {
    console.log(error)
  }
}

const statusList = ref([])
const GetAccountStatus = async () => {
  try {
    const data = await getAccountStatusList()
    statusList.value = data.data
  } catch (err) {
    console.log(err)
  }
}

const init = () => {
  GetAccount()
  GetDepartmentDropdown()
  GetAccountStatus()
  GetRole()
}
init()
</script>

