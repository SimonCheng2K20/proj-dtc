<template>
  <div class="p-2">
    <div class="border border-gray-400 rounded overflow-hidden">
      <h5 class="router-title">功能管理</h5>

      <my-search-area gridCols="3" @searchSubmit="searchSubmit" @searchClear="searchClear">
        <my-input-wrapper label="功能代碼"> <input-text v-model="search.No" @keydown.enter="searchSubmit"></input-text></my-input-wrapper>
        <my-input-wrapper label="功能名稱"> <input-text v-model="search.Name" @keydown.enter="searchSubmit"></input-text></my-input-wrapper>
        <my-input-wrapper label="啟用狀態">
          <div class="flex gap-2 px-2">
            <div>
              <input class="cursor-pointer" v-model="search.IsActivated" id="radio-IsActivated-true" type="radio" :value="true" @change="searchSubmit" />
              <label class="cursor-pointer" for="radio-IsActivated-true">啟用</label>
            </div>
            <div>
              <input class="cursor-pointer" v-model="search.IsActivated" id="radio-IsActivated-false" type="radio" :value="false" @change="searchSubmit" />
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
      @pageChange="GetFunction"
      v-model:sortBy="sortBy"
      @sort="searchSubmit"
    >
      <template #item-action="{ item }">
        <div class="flex justify-center gap-2">
          <Button class="p-button-sm" @click="toEdit(item)" label="編輯" />
          <Button class="p-button-delete p-button-sm" label="刪除" @click="toDelete(item)" />
        </div>
      </template>
      <template #item-IsActivated="{ item }">
        <Checkbox :binary="true" v-model="item.IsActivated" @change="changeActivate(item)" />
      </template>
    </my-table>

    <edit-item ref="editItemRef" @ok="onOk"></edit-item>
  </div>
</template>

<script setup>
import { getFunction } from 'api'
import { reactive, ref, computed } from 'vue'
import { cloneDeep } from 'lodash-es'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import EditItem from './components/FunctionManageEditItem.vue'
// import dateChange from 'utils/dateChange'
// import dayjs from 'dayjs'
// import numberFormat from 'utils/numberFormat'

const editItemRef = ref()
const tableLoading = ref(true)
const sortBy = ref([])
const headers = reactive([
  { key: 'action', text: '操作', value: 'action', align: 'center' },
  { key: 'No', text: '功能代碼', value: 'No', align: 'center' },
  { key: 'Name', text: '功能名稱', value: 'Name', align: 'center' },
  { key: 'Seq', text: '顯示順序', value: 'Seq', align: 'center' },
  { key: 'IsActivated', text: '啟用狀態', value: (row) => (row.IsActivated ? '啟用' : '未啟用'), align: 'center' },
])

const items = ref([])
const GetFunction = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pageOptions.perPageCount,
      $skip: pageOptions.firstIndex,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getFunction(query)
    if (res.status === 200) {
      items.value = res.data.Items
      pageOptions.totalItemsCount = res.data.Count
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
  GetFunction()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pageOptions.firstIndex = 0
  GetFunction()
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
    GetFunction()
  }
}

const changeActivate = async (item) => {
  isChangeActivate.value = true
  await editItemRef.value.PutFunctionItem(item)
  isChangeActivate.value = false
}

// GetDropdownReplace

const init = async () => {
  GetFunction()
  // InitDropdownReplace
}
init()
</script>
