<template>
  <div>
    <my-title noFixed label="護理站管理"></my-title>
    <Dialog
      :header="editType === 'add' ? '新增護理站及床位' : editType === 'edit' ? '編輯護理站及床位' : '刪除'"
      v-model:visible="showEditBox"
      :modal="true"
      :maximizable="true"
      style="width: 30vw"
    >
      <my-input-group class="grid gap-2">
        <my-input-wrapper label="護理站別">
          <my-filter-select
            v-bind="QSelectProps"
            v-model="formCopy.StationType"
            :options="departmentDropdown"
            :list-key="['department', '?layer=2']"
            :readonly="editType === 'delete'"
          >
          </my-filter-select>
        </my-input-wrapper>
        <my-input-wrapper label="護理站代碼">
          <q-input v-bind="QInputProps" v-model="formCopy.StationId" :readonly="editType !== 'add'"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="護理站名">
          <q-input v-bind="QInputProps" v-model="formCopy.StationName" :readonly="editType === 'delete'"></q-input>
        </my-input-wrapper>
      </my-input-group>

      <template #footer>
        <Button class="p-button-grey" @click="showEditBox = !showEditBox">取消</Button>
        <Button v-if="editType === 'add'" @click="sub">建立</Button>
        <Button v-if="editType === 'edit'" @click="sub">儲存</Button>
        <Button v-if="editType === 'delete'" class="p-button-warning" @click="sub">刪除</Button>
      </template>
    </Dialog>
    <div class="flex flex-wrap gap-2 py-2">
      <my-input-wrapper label="護理站代碼">
        <q-input v-bind="QInputProps" v-model="searchFormCopy.StationId"></q-input>
      </my-input-wrapper>
      <my-input-wrapper label="護理站名">
        <q-input v-bind="QInputProps" v-model="searchFormCopy.StationName"></q-input>
      </my-input-wrapper>
      <div class="flex gap-2">
        <Button label="進行查詢" icon="pi pi-search" @click="getData" />
        <Button class="p-button-secondary" label="清除查詢" icon="pi pi-undo" @click="clear" />
        <Button label="新增資料" class="btn-add" icon="pi pi-plus" @click="toAdd" />
      </div>
    </div>

    <v-data-table
      :headers="headers"
      :items="tableData.Items"
      :pageOptions="pageOptions"
      @pageChange="pageChange"
      v-if="tableData"
    >
      <template #item-action="{ item }">
        <div class="flex justify-center gap-3">
          <Button class="p-button-sm" label="編輯" icon="pi pi-pencil" @click="toEdit(item)" />
          <Button class="p-button-warning p-button-sm" label="刪除" icon="pi pi-trash" @click="toDel(item)" />
        </div>
      </template>
    </v-data-table>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import {
  getNursingStation,
  postNursingStation,
  putNursingStation,
  deleteNursingStation,
  getDepartmentDropdown,
} from 'api'
import _ from 'lodash'
import { useQuasar } from 'quasar'
import setSearchQuery from 'utils/setSearchQuery.js'
import { QInputProps, QSelectProps } from 'utils/quasar-extends/base-props.js'

const editType = ref('add')
const showEditBox = ref(false)

const $q = useQuasar()
const headers = reactive([
  { text: '操作', value: 'action', width: '170px' },
  { text: '護理站代碼', value: 'StationId' },
  { text: '護理站名', value: 'StationName' },
  { text: '護理站別', value: 'StationTypeName' },
])

const searchForm = ref({
  StationId: null,
  StationName: null,
})

let searchFormCopy = ref(JSON.parse(JSON.stringify(searchForm.value)))

const form = ref({
  StationId: null,
  StationName: null,
  StationType: null,
})

const formCopy = ref(JSON.parse(JSON.stringify(form.value)))

const tableData = ref(null)

const pageOptions = reactive({
  firstIndex: 0,
  perPageCount: 10,
  totalItemsCount: 0,
  rowsPerPage: [10, 20, 30],
})

const pageChange = async (e) => {
  pageOptions.firstIndex = e.first
  pageOptions.perPageCount = e.rows
  console.log(e)
  await getData()
}

const getData = async () => {
  let filter = []
  if (searchFormCopy.value.StationId) filter.push(`contains(StationId,'${searchFormCopy.value.StationId}')`)
  if (searchFormCopy.value.StationName) filter.push(`contains(StationName,'${searchFormCopy.value.StationName}')`)
  let data = {
    $skip: pageOptions.firstIndex,
    $top: pageOptions.perPageCount,
    $filter: filter.length ? filter.join(' and ') : null,
  }
  const query = setSearchQuery(data)
  tableData.value = await getNursingStation(query).then((res) => res.data)
  pageOptions.totalItemsCount = tableData.value.Count
}

const clear = async () => {
  searchFormCopy.value = JSON.parse(JSON.stringify(searchForm.value))
  await getData()
}

let departmentDropdown = ref([])

const arrToObj = (x, key) => {
  const res = {}
  for (let item of x) {
    if (!res[item[key]]) res[item[key]] = []
    res[item[key]] = item
  }
  return res
}

const departmentDropdownObj = computed(() => {
  return arrToObj(departmentDropdown.value, 'No')
})

const toAdd = () => {
  editType.value = 'add'
  formCopy.value = JSON.parse(JSON.stringify(form.value))
  showEditBox.value = !showEditBox.value
}

const toEdit = (x) => {
  editType.value = 'edit'
  formCopy.value = JSON.parse(JSON.stringify(x))
  showEditBox.value = !showEditBox.value
}

const toDel = (x) => {
  editType.value = 'delete'
  formCopy.value = JSON.parse(JSON.stringify(x))
  showEditBox.value = !showEditBox.value
}

const sub = async () => {
  if (editType.value === 'add') {
    await postNursingStation(formCopy.value)
    $q.notify({
      type: 'positive',

      message: '新增成功',
      position: 'top',
    })
  } else if (editType.value === 'edit') {
    await putNursingStation(formCopy.value)
    $q.notify({
      type: 'positive',

      message: '修改成功',
      position: 'top',
    })
  } else if (editType.value === 'delete') {
    await deleteNursingStation(formCopy.value.StationId)
    $q.notify({
      type: 'positive',

      message: '刪除成功',
      position: 'top',
    })
  }
  await getData()
  showEditBox.value = !showEditBox.value
}

const getInit = async () => {
  departmentDropdown.value = await getDepartmentDropdown('?layer=2').then((res) => res.data.Items)
  await getData()
}

getInit()
</script>

