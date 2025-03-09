<template>
  <q-page class="p-2">
    <my-title title="系統角色管理"></my-title>
    <my-search-area grid-cols="4" v-on:search-submit="searchSubmit" v-on:search-clear="searchClear">
      <my-input-wrapper label="角色類型">
        <q-select
          v-bind="QSelectProps"
          v-model="search.Type"
          :options="roleTypeItems"
          option-label="Name"
          option-value="Id"
          map-options
          emit-value
          @update:model-value="searchSubmit"
        >
        </q-select>
      </my-input-wrapper>
      <my-input-wrapper label="角色代碼">
        <q-input v-bind="QInputProps" v-model="search.No" @keydown.enter="searchSubmit"></q-input>
      </my-input-wrapper>
      <my-input-wrapper label="角色名稱">
        <q-input v-bind="QInputProps" v-model="search.Name" @keydown.enter="searchSubmit"></q-input>
      </my-input-wrapper>
      <my-input-wrapper label="啟用狀態">
        <q-select
          v-bind="QSelectProps"
          v-model="search.IsActive"
          :options="activeStatusItems"
          option-label="label"
          option-value="value"
          map-options
          emit-value
          @update:model-value="searchSubmit"
        ></q-select>
      </my-input-wrapper>

      <template v-slot:btn-expand>
        <q-btn unelevated color="secondary" icon="add" label="新增資料" @click="toAdd"> </q-btn>
      </template>
    </my-search-area>
    <q-table
      class="mt-2"
      v-bind="QTableProps"
      :rows="rows"
      :columns="columns"
      row-key="No"
      :pagination="pagination"
      :loading="tableLoading"
    >
      <template #body="props">
        <HasChildrenBody v-bind="props" :children-show="props.row.subShow">
          <template v-slot:body-cell-action="{ col, row }">
            <q-td :props="{ col }">
              <q-btn class="mr-1" color="edit" @click="toEdit(row)" label="編輯" unelevated dense></q-btn>
              <q-btn color="delete" @click="toDelete(row)" label="刪除" unelevated dense></q-btn>
            </q-td>
          </template>
          <template #body-cell-subShow="{ col, row }">
            <q-td :props="{ col }">
              <q-btn
                v-model="row.subShow"
                :class="{ 'rotate-90': row.subShow }"
                icon="chevron_right"
                @click="row.subShow = !row.subShow"
                round
                unelevated
                dense
              ></q-btn>
            </q-td>
          </template>

          <template #children="{ row: parentRow, cols }">
            <q-td v-if="parentRow.subShow" :colspan="cols.length">
              <q-table
                v-bind="QTableProps"
                :columns="functionColumns"
                :rows="functionItems"
                row-key="No"
                :pagination="{ rowsPerPage: -1 }"
              >
                <template #body-cell-selected="{ key, col }">
                  <q-td :props="{ col }">
                    <q-checkbox
                      v-model="functionSelected[parentRow.No]"
                      :val="key"
                      @update:model-value="(val) => onSelect(val, parentRow.No, key)"
                    ></q-checkbox>
                  </q-td>
                </template>
              </q-table>
            </q-td>
          </template>
        </HasChildrenBody>
      </template>
      <template v-slot:bottom>
        <my-pagination class="mx-auto p-4" v-model="pagination" v-on:update:model-value="GetRole"> </my-pagination>
      </template>
    </q-table>
  </q-page>
</template>
<script setup>
import { getRole, getRoleFunctionNos, getFunctionList, postAddFunction, postRemoveFunction, getRoleTypeList } from 'api'
import { ref, reactive, computed } from 'vue'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { cloneDeep } from 'lodash-es'
import { useQuasar } from 'quasar'
import EditItem from './components/RoleEditItem.vue'
import { QSelectProps, QInputProps, QTableProps } from 'utils/quasar-extends/base-props.js'
import { activeStatusItems } from 'utils/options.js'
import HasChildrenBody from 'components/HasChildrenBody'

const $q = useQuasar()

const columns = [
  { name: 'action', label: '操作', field: 'action', align: 'center' },
  { name: 'subShow', label: '授權作業', field: 'subShow', align: 'left' },
  { name: 'TypeName', label: '角色類型', field: 'TypeName', align: 'left' },
  { name: 'No', label: '角色代碼', field: 'No', align: 'left' },
  { name: 'Name', label: '角色名稱', field: 'Name', align: 'left' },
  { name: 'IsActive', label: '啟用狀態', field: (row) => (row.IsActive ? '啟用' : '未啟用'), align: 'left' },
]

const functionColumns = [
  { name: 'selected', field: 'selected', align: 'center' },
  { name: 'No', label: '功能代碼', field: 'No', align: 'left' },
  { name: 'Name', label: '功能名稱', field: 'Name', align: 'left' },
]

const functionSelected = reactive({})

const tableLoading = ref(false)
const rows = ref([])
const GetRole = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getRole(query)
    rows.value = res.data.Items
    pagination.value.rowsNumber = res.data.Count

    rows.value.forEach(({ No }) => {
      if (!functionSelected[No]) {
        functionSelected[No] = []
        GetRoleFunctionNos(No)
      }
    })
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
  Type: null,
  No: null,
  Name: null,
  IsActive: null,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  return Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'Type':
          case 'IsActive':
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
  GetRole()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetRole()
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
      GetRole()
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
      GetRole()
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
      GetRole()
    })
}

const onSelect = (val, roleNo, funcNo) => {
  const body = { RoleNo: roleNo, FunctionNo: funcNo }
  if (val.includes(funcNo)) PostAddFunction(body)
  else PostRemoveFunction(body)
}

const PostAddFunction = async (body) => {
  try {
    const res = await postAddFunction(body)
  } catch (error) {
    console.log(error)
  }
}

const PostRemoveFunction = async (body) => {
  try {
    const res = await postRemoveFunction(body)
  } catch (error) {
    console.log(error)
  }
}

const roleFunctionNos = reactive({
  // key: []
})
const GetRoleFunctionNos = async (roleNo) => {
  try {
    const res = await getRoleFunctionNos(roleNo)
    functionSelected[roleNo] = res.data
  } catch (error) {
    console.log(error)
  }
}

const functionItems = ref([])
const GetFunctionList = async () => {
  try {
    const res = await getFunctionList()
    functionItems.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const roleTypeItems = ref([])
const GetRoleTypeList = async () => {
  try {
    const res = await getRoleTypeList()
    roleTypeItems.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const init = async () => {
  GetFunctionList()
  GetRoleTypeList()
  GetRole()
}
init()
</script>

