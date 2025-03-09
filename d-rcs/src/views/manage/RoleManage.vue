<template>
  <div class="p-2">
    <div class="border border-gray-400 rounded overflow-hidden">
      <h5 class="router-title">角色授權管理</h5>
      <my-search-area gridCols="3" @searchSubmit="searchSubmit" @searchClear="searchClear">
        <my-input-wrapper label="角色代碼"><input-text v-model="search.No" @keydown.enter="searchSubmit"></input-text></my-input-wrapper>
        <my-input-wrapper label="角色名稱"><input-text v-model="search.Name" @keydown.enter="searchSubmit"></input-text></my-input-wrapper>
        <my-input-wrapper label="啟用狀態">
          <div class="flex gap-2 px-2">
            <div>
              <input v-model="search.IsActivated" :value="true" id="radio-IsActivated-true" type="radio" class="cursor-pointer" @change="searchSubmit" />
              <label class="cursor-pointer" for="radio-IsActivated-true">啟用</label>
            </div>
            <div>
              <input v-model="search.IsActivated" :value="false" id="radio-IsActivated-false" type="radio" class="cursor-pointer" @change="searchSubmit" />
              <label class="cursor-pointer" for="radio-IsActivated-false">未啟用</label>
            </div>
          </div>
        </my-input-wrapper>

        <template #btn-expand>
          <Button label="新增資料" class="p-button-add" icon="pi pi-plus" @click="toAdd" />
        </template>
      </my-search-area>
    </div>

    <my-table
      class="max-h-[688px] mt-2"
      :headers="headers"
      :items="items"
      :loading="tableLoading"
      :pageOptions="pageOptions"
      @pageChange="GetRole"
      v-model:sortBy="sortBy"
      @sort="searchSubmit"
    >
      <template #item-action="{ item }">
        <div class="flex justify-center gap-2">
          <Button class="p-button-sm" @click="toEdit(item)" label="編輯" />
          <Button class="p-button-delete p-button-sm" label="刪除" @click="toDelete(item)" />
        </div>
      </template>
      <template #item-subShow="{ item }">
        <InputSwitch v-model="item.subShow" />
      </template>
      <template #item-IsActivated="{ item }">
        <Checkbox :binary="true" v-model="item.IsActivated" @change="changeActivate(item)" />
      </template>

      <template #childs="{ item: parentItem }">
        <tr v-if="parentItem.subShow">
          <td :colspan="headers.length">
            <div class="bg-gray-200 p-2">
              <my-input-group class="grid grid-cols-4 gap-2 bg-gray-400 p-2">
                <my-input-wrapper label="功能代碼"><input-text v-model="funcSearch[`${parentItem.No}-No`]"></input-text></my-input-wrapper>
                <my-input-wrapper label="功能名稱"><input-text v-model="funcSearch[`${parentItem.No}-Name`]"></input-text></my-input-wrapper>
              </my-input-group>
              <my-table :headers="functionHeaders" :items="getFuncItemsFilter(parentItem.No)" hide-default-footer>
                <template #item-action="{ item }">
                  <Checkbox
                    binary
                    v-model="item.isAuthorize"
                    @change="item.isAuthorize ? AddRoleFunction(parentItem, item.No) : RemoveRoleFunction(parentItem, item.No)"
                    :disabled="authorizeLoading"
                  />
                </template>
              </my-table>
            </div>
          </td>
        </tr>
      </template>
    </my-table>

    <edit-item ref="editItemRef" :levelItems="levelItems" @ok="onOk"></edit-item>
  </div>
</template>

<script setup>
import { getRole, getFunctionSelectList, getRoleFunctionNos, addRoleFunction, removeRoleFunction } from 'api'
import { reactive, ref, computed } from 'vue'
import { cloneDeep } from 'lodash-es'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import EditItem from './components/RoleManageEditItem.vue'
import { useToast } from 'vue-toastification'

const toast = useToast()
const editItemRef = ref()
const tableLoading = ref(true)
const sortBy = ref([])
const headers = reactive([
  { key: 'action', text: '操作', value: 'action', align: 'center' },
  { key: 'subShow', text: '授權作業', value: 'subShow', align: 'center' },
  { key: 'IsActivated', text: '啟用狀態', value: (row) => (row.IsActivated ? '啟用' : '未啟用'), align: 'center' },
  { key: 'No', text: '角色代碼', value: 'No', align: 'center' },
  { key: 'Name', text: '角色名稱', value: 'Name', align: 'center' },
  { key: 'Level', text: '機構層級', value: (row) => levelItems.value.find((item) => item.No === row.Level).Name, align: 'center' },
])

const items = ref([])
const GetRole = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pageOptions.perPageCount,
      $skip: pageOptions.firstIndex,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getRole(query)
    if (res.status === 200) {
      items.value = res.data.Items
      pageOptions.totalItemsCount = res.data.Count

      items.value.forEach((item) => {
        GetRoleFunctionNos(item)
      })
    }
  } catch (err) {
    console.log(err)
  } finally {
    tableLoading.value = false
  }
}

const pageOptions = reactive({
  firstIndex: 0,
  perPageCount: 10,
  totalItemsCount: 0,
  rowsPerPage: [10, 20, 30],
})

const initData = {}
initData.search = {
  No: null,
  Name: null,
  IsActivated: null,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  return Object.entries(search)
    .filter(([key, value]) => isValidSearchValue(value))
    .map(([key, value]) => {
      switch (key) {
        case 'No':
        case 'Name':
          return setOdataFilter({ key, value, operator: 'contains' })
        case 'IsActivated':
          return setOdataFilter({ key, value, operator: 'eq' })
      }
    })
    .join(' and ')
})

const orderBy = computed(() => {
  return sortBy.value.map((item) => item.join(' ')).join(',')
})

const searchSubmit = () => {
  pageOptions.firstIndex = 0
  GetRole()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pageOptions.firstIndex = 0
  GetRole()
}

const toAdd = () => {
  editItemRef.value.show({ type: 'add' })
}

const toEdit = (row) => {
  editItemRef.value.show({ id: row.No, type: 'edit' })
}

const toDelete = (row) => {
  editItemRef.value.show({ id: row.No, type: 'delete' })
}

const isChangeActivate = ref(false)
const onOk = (editType) => {
  if (isChangeActivate.value === false) {
    switch (editType) {
      case 'add':
        pageOptions.firstIndex = 0
        break
      case 'edit':
        break
      case 'delete':
        if (pageOptions.firstIndex === Math.ceil(pageOptions.totalItemsCount / pageOptions.perPageCount)) {
          const prePage = pageOptions.firstIndex - 1
          if (pageOptions.totalItemsCount - 1 <= prePage * pageOptions.perPageCount) pageOptions.firstIndex = prePage
        }
        break
    }

    editItemRef.value.hide()
    GetRole()
  }
}

const changeActivate = async (item) => {
  isChangeActivate.value = true
  await editItemRef.value.PutRoleItem(item)
  isChangeActivate.value = false
}

const levelItems = ref([
  {
    No: 0,
    Name: '醫療機構',
  },
  {
    No: 20,
    Name: '各地衛生局',
  },
  {
    No: 90,
    Name: '計畫管理者',
  },
  {
    No: 100,
    Name: '系統管理群',
  },
])

const functionHeaders = reactive([
  { key: 'action', text: null, value: 'action', align: 'center' },
  { key: 'No', text: '功能代碼', value: 'No', align: 'center' },
  { key: 'Name', text: '功能名稱', value: 'Name', align: 'center' },
])

const funtionItems = ref([])
const GetFunctionSelectList = async () => {
  try {
    const res = await getFunctionSelectList()
    if (res.status === 200) {
      funtionItems.value = res.data
    }
  } catch (err) {
    console.log(err)
  }
}

const funcSearch = reactive({
  // roleNo-No: null,
  // roleNo-Name: null,
})

const getFuncItemsFilter = (roleNo) => {
  const row = items.value.find((item) => item.No === roleNo)
  return funtionItems.value
    .filter((item) => {
      if (!!funcSearch[`${roleNo}-No`] && !!funcSearch[`${roleNo}-Name`])
        return item.No.includes(funcSearch[`${roleNo}-No`]) && item.Name.includes(funcSearch[`${roleNo}-Name`])
      else if (!!funcSearch[`${roleNo}-No`]) return item.No.includes(funcSearch[`${roleNo}-No`])
      else if (!!funcSearch[`${roleNo}-Name`]) return item.Name.includes(funcSearch[`${roleNo}-Name`])
      else return item
    })
    .map((item) => ({ ...item, isAuthorize: row?.Authorize?.includes(item.No) }))
}

const GetRoleFunctionNos = async (row) => {
  try {
    const query = setSearchQuery({
      roleNo: row.No,
    })
    const res = await getRoleFunctionNos(query)
    if (res.status === 200) {
      row.Authorize = res.data
    }
  } catch (err) {
    console.log(err)
  }
}

const authorizeLoading = ref(false)
const AddRoleFunction = async (role, functionNo) => {
  try {
    authorizeLoading.value = true
    const res = await addRoleFunction({
      RoleNo: role.No,
      FunctionNo: functionNo,
    })
    if (res.status === 200) {
      role.Authorize.push(functionNo)
      toast.success('授權功能成功', {
        timeout: 5000,
        hideProgressBar: true,
      })
    }
  } catch (err) {
    console.log(err)
    toast.error('授權功能失敗', {
      timeout: 5000,
      hideProgressBar: true,
    })
  } finally {
    authorizeLoading.value = false
  }
}

const RemoveRoleFunction = async (role, functionNo) => {
  try {
    authorizeLoading.value = true
    const res = await removeRoleFunction({
      RoleNo: role.No,
      FunctionNo: functionNo,
    })
    if (res.status === 200) {
      role.Authorize.splice(role.Authorize.indexOf(functionNo), 1)
      toast.success('授權功能成功', {
        timeout: 5000,
        hideProgressBar: true,
      })
    }
  } catch (err) {
    console.log(err)
    toast.error('授權功能失敗', {
      timeout: 5000,
      hideProgressBar: true,
    })
  } finally {
    authorizeLoading.value = false
  }
}

const init = () => {
  GetRole()
  GetFunctionSelectList()
}
init()
</script>
