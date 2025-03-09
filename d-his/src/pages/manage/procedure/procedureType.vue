<template>
  <div>
    <my-title noFixed title="醫令分類維護"></my-title>
    <div class="flex flex-wrap gap-2 py-2">
      <DtxInputGroup title="主分類代碼">
        <InputText v-model="search.Category" @keydown.enter="searchSubmit" />
      </DtxInputGroup>
      <DtxInputGroup title="主分類名稱">
        <InputText v-model="search.Text" @keydown.enter="searchSubmit" />
      </DtxInputGroup>

      <div class="flex gap-2">
        <Button label="進行查詢" icon="pi pi-search" @click="searchSubmit" />
        <Button class="p-button-secondary" label="清除查詢" icon="pi pi-undo" @click="searchClear" />
        <Button label="新增醫令分類" class="btn-add" icon="pi pi-plus" @click="toAdd" />
      </div>
    </div>

    <v-data-table
      class="max-h-[688px]"
      :headers="headers"
      :items="procedureCategoryList"
      :loading="loading"
      :pageOptions="pageOptions"
      @pageChange="pageChange"
      v-model:sortBy="sortBy"
      @sort="searchSubmit"
    >
      <template #item-Category="{ item }">
        <div class="flex justify-center items-center relative">
          <MySwitch v-model="item.subShow" text="次分類項目" style="position: absolute; left: 0"> </MySwitch>
          <div>{{ item.Category }}</div>
        </div>
      </template>
      <template #item-action="{ item }">
        <Button class="p-button-sm mr-1" @click="toEdit(item)">編輯</Button>
        <Button class="p-button-warning p-button-sm" @click="toDelete(item)">刪除</Button>
      </template>
      <template #childs="{ item }">
        <tr v-if="item.subShow === true">
          <td class="childs" :colspan="headers.length">
            <v-data-table
              class="ml-[120px]"
              :items="item.ProcedureCategoryItems"
              :headers="subHeaders"
              hide-default-footer
            >
            </v-data-table>
          </td>
        </tr>
      </template>
    </v-data-table>

    <Dialog v-model:visible="dialog.edit.show" :draggable="false" modal :header="editHeader" style="width: 768px">
      <div v-if="dialog.edit.type === 'delete'" class="font-bold">是否確定刪除此醫令分類？</div>
      <div class="grid gap-2">
        <DtxInputGroup title="主分類代碼">
          <InputText v-model="editItem.Category" :disabled="dialog.edit.type !== 'add'" />
        </DtxInputGroup>
        <DtxInputGroup title="主分類名稱">
          <InputText v-model="editItem.Text" :disabled="dialog.edit.type === 'delete'" />
        </DtxInputGroup>
        <DtxInputGroup title="次分類項目" direction="column">
          <template #title-append>
            <div class="ml-2">
              <Button class="p-button-sm btn-add" @click="addChilds">新增</Button>
            </div>
          </template>

          <v-data-table
            class="w-full max-h-[540px]"
            :headers="editSubHeaders"
            :items="editItem.ProcedureCategoryItems"
            sticky-header
            hide-default-footer
          >
            <template #item-SecondCategory="{ item }">
              <InputText v-model="item.SecondCategory" :disabled="dialog.edit.type === 'delete'"></InputText>
            </template>
            <template #item-SecondText="{ item }">
              <InputText v-model="item.SecondText" :disabled="dialog.edit.type === 'delete'"></InputText>
            </template>
            <template #item-action="{ index }">
              <Button class="p-button-warning p-button-sm" @click="editItem.ProcedureCategoryItems.splice(index, 1)"
                >刪除</Button
              >
            </template>
          </v-data-table>
        </DtxInputGroup>
      </div>

      <template #footer>
        <Button class="p-button-grey" @click="dialog.edit.show = false">取消</Button>
        <Button v-if="dialog.edit.type === 'add'" @click="PostProcedureCategory">建立</Button>
        <Button v-if="dialog.edit.type === 'edit'" @click="PutProcedureCategory">儲存</Button>
        <Button v-if="dialog.edit.type === 'delete'" class="p-button-warning" @click="DeleteProcedureCategory"
          >刪除</Button
        >
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import _ from 'lodash'
import {
  getProcedureCategory,
  getProcedureCategoryItem,
  postProcedureCategory,
  putProcedureCategory,
  deleteProcedureCategory,
} from 'api'
import setSearchQuery from 'utils/setSearchQuery'
import { useQuasar } from 'quasar'
import MySwitch from 'components/MySwitch.vue'

const $q = useQuasar()

const sortBy = ref([['Category', 'asc']])
const headers = reactive([
  { text: '操作', value: 'action' },
  { text: '主分類代碼', value: 'Category', sortable: true },
  { text: '主分類名稱', value: 'Text' },
])

const subHeaders = reactive([
  { text: '次分類代碼', value: 'SecondCategory' },
  { text: '次分類名稱', value: 'SecondText' },
])

const loading = ref(true)
const procedureCategoryList = ref([])
const GetProcedureCategory = async () => {
  try {
    loading.value = true
    const query = setSearchQuery({
      $top: pageOptions.perPageCount,
      $skip: pageOptions.firstIndex,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getProcedureCategory(query)

    if (res.status === 200) {
      procedureCategoryList.value = res.data.Items
      pageOptions.totalItemsCount = res.data.Count
    }
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
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
  Category: '',
  Text: '',
}
const search = reactive(_.cloneDeep(initData.search))

const pageChange = () => {
  GetProcedureCategory()
}

const filter = computed(() => {
  const filterArr = []
  _.forEach(Object.entries(search), ([key, value]) => {
    if (value === '') return
    else filterArr.push(`contains(${key},'${value}')`)
  })

  return !!filterArr.length ? _.join(filterArr, ' and ') : ''
})

const orderBy = computed(() => {
  const orderByArr = []
  sortBy.value.forEach((item) => {
    orderByArr.push(`${item[0]} ${item[1]}`)
  })
  return !!orderByArr.length ? orderByArr.join(',') : ''
})

const searchSubmit = () => {
  pageOptions.firstIndex = 0
  GetProcedureCategory()
}

const searchClear = () => {
  Object.assign(search, initData.search)
  pageOptions.firstIndex = 0
  GetProcedureCategory()
}

const dialog = reactive({
  edit: {
    show: false,
    type: '',
  },
})

initData.editItem = {
  Category: '',
  Text: '',
  ProcedureCategoryItems: [
    {
      SecondCategory: '',
      SecondText: '',
    },
  ],
}
const editItem = reactive(_.cloneDeep(initData.editItem))

const editSubHeaders = computed(() => {
  const arr = [
    { text: '次分類代碼', value: 'SecondCategory' },
    { text: '次分類名稱', value: 'SecondText' },
  ]
  if (dialog.edit.type !== 'delete') {
    arr.push({ text: '操作', value: 'action' })
  }
  return arr
})

const toAdd = () => {
  Object.assign(editItem, _.cloneDeep(initData.editItem))

  dialog.edit.type = 'add'
  dialog.edit.show = true
}

const toEdit = (item) => {
  GetProcedureCategoryItem(item.Category)

  dialog.edit.type = 'edit'
  dialog.edit.show = true
}

const toDelete = (item) => {
  GetProcedureCategoryItem(item.Category)

  dialog.edit.type = 'delete'
  dialog.edit.show = true
}

const editHeader = computed(() => {
  switch (dialog.edit.type) {
    case 'add':
      return '新增醫令分類'
    case 'edit':
      return '編輯醫令分類'
    case 'delete':
      return '刪除醫令分類'
    default:
      return
  }
})

const GetProcedureCategoryItem = async (id) => {
  try {
    const res = await getProcedureCategoryItem(id)
    if (res.status === 200) {
      Object.assign(editItem, res.data)
    }
  } catch (err) {
    console.log(err)
  }
}

const editCheck = () => {
  if (!!editItem.Category === false) {
    $q.notify({ type: 'negative', message: '請輸入主分類代碼', position: 'top' })
    return false
  }
  if (!!editItem.Text === false) {
    $q.notify({ type: 'negative', message: '請輸入主分類名稱', position: 'top' })
    return false
  }

  for (let i = editItem.ProcedureCategoryItems.length - 1; i >= 0; i--) {
    if (!!editItem.SecondCategory === false && !!editItem.SecondText === false) {
      editItem.ProcedureCategoryItems.splice(i, 1)
      break
    }

    if (!!editItem.SecondCategory === false) {
      $q.notify({ type: 'negative', message: '請輸入次分類代碼', position: 'top' })
      return false
    }
    if (!!editItem.SecondText === false) {
      $q.notify({ type: 'negative', message: '請輸入次分類名稱', position: 'top' })
      return false
    }
  }

  return true
}
const PostProcedureCategory = async () => {
  try {
    if (editCheck() === false) return
    const _editItem = _.cloneDeep(editItem)
    _editItem.ProcedureCategoryItems = _editItem.ProcedureCategoryItems.map((item) => ({
      Category: _editItem.Category,
      ...item,
    }))
    const res = await postProcedureCategory(_editItem)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',

        message: '新增醫令分類成功',
        position: 'top',
      })
      dialog.edit.show = false
      GetProcedureCategory()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',

      message: '新增醫令分類失敗：' + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  }
}

const PutProcedureCategory = async () => {
  try {
    if (editCheck() === false) return
    const _editItem = _.cloneDeep(editItem)
    _editItem.ProcedureCategoryItems = _editItem.ProcedureCategoryItems.map((item) => ({
      Category: _editItem.Category,
      ...item,
    }))
    const res = await putProcedureCategory(_editItem)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',

        message: '編輯醫令分類成功',
        position: 'top',
      })
      dialog.edit.show = false
      GetProcedureCategory()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',

      message: '編輯醫令分類失敗：' + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  }
}

const DeleteProcedureCategory = async () => {
  try {
    const res = await deleteProcedureCategory(editItem.Category)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',

        message: '刪除醫令分類成功',
        position: 'top',
      })
      dialog.edit.show = false
      GetProcedureCategory()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',

      message: '刪除醫令分類失敗：' + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  }
}

const addChilds = () => {
  editItem.ProcedureCategoryItems.push({
    SecondCategory: '',
    SecondText: '',
  })
}

const init = () => {
  GetProcedureCategory()
}
init()
</script>
