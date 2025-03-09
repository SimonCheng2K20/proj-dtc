<template>
  <div>
    <my-title noFixed :title="titleName"></my-title>
    <search
      :sItems="sItems"
      :gridNum="3"
      v-model:results="sVal"
      @sEvt="handleSearch"
      @addEvt="
        () => {
          modifyType = 'add'
          handleModify({})
        }
      "
    />
    <v-data-table :headers="headers" :items="codeLst" :pageOptions="pageOptions" @pageChange="handleSearch">
      <template #item-action="{ item }">
        <div class="flex justify-center gap-3">
          <Button
            class="p-button-sm font-bold"
            label="編輯"
            icon="pi pi-pencil"
            @click.stop="
              () => {
                modifyType = 'edit'
                handleModify(item)
              }
            "
          />
          <Button
            class="p-button-warning p-button-sm font-bold"
            label="刪除"
            icon="pi pi-trash"
            @click.stop="
              () => {
                modifyType = 'delete'
                handleModify(item)
              }
            "
          />
        </div>
      </template>
      <template #item-IsActive="{ item }">
        <div class="flex justify-center gap-3">
          {{ item.IsActive ? '啟用' : '未啟用' }}
        </div>
      </template>
      <template #item-DepartmentParentNo="{ item }">
        {{ item.DepartmentParentNoDis }}
      </template>
      <template #item-DepartmentNo="{ item }">
        {{ item.DepartmentNoDis }}
      </template>
    </v-data-table>
    <Dialog
      v-model:visible="showDialog"
      :draggable="false"
      :modal="true"
      :header="`${modifyType === 'add' ? '新增' : modifyType === 'edit' ? '編輯' : '刪除'}資料`"
      style="width: 640px"
    >
      <div v-show="modifyType === 'delete'" class="mb-3">是否確定刪除此診間代號?</div>
      <div class="px-16 grid grid-cols-1 gap-2">
        <DtxInputGroup :title="headers[1].text" labelWidth="100">
          <Dropdown
            v-if="modifyType === 'add'"
            v-model="cur.DepartmentParentNo"
            :options="headers[1].options"
            optionLabel="text"
            optionValue="value"
            class="rounded-l-none border-l-0"
            @change="changeVal"
          />
          <InputText v-else v-model="cur.DepartmentParentNo" class="rounded-l-none border-l-0" :disabled="true" />
        </DtxInputGroup>
        <DtxInputGroup :title="headers[2].text" labelWidth="100">
          <Dropdown
            v-if="modifyType === 'add'"
            v-model="cur.DepartmentNo"
            :options="headers[2].options"
            optionLabel="text"
            optionValue="value"
            :disabled="modifyType === 'delete' && modifyType === 'edit'"
            class="rounded-l-none border-l-0"
          />
          <InputText v-else v-model="cur.DepartmentNo" class="rounded-l-none border-l-0" :disabled="true" />
        </DtxInputGroup>
        <DtxInputGroup :title="headers[3].text" labelWidth="100">
          <InputText
            v-model="cur.No"
            class="rounded-l-none border-l-0"
            :disabled="modifyType === 'delete' || modifyType === 'edit'"
          />
        </DtxInputGroup>
        <DtxInputGroup :title="headers[4].text" labelWidth="100">
          <InputText v-model="cur.Name" class="rounded-l-none border-l-0" :disabled="modifyType === 'delete'" />
        </DtxInputGroup>
        <DtxInputGroup :title="headers[5].text" labelWidth="100">
          <Dropdown
            v-model="cur.IsActive"
            :options="headers[5].options"
            optionLabel="text"
            optionValue="value"
            :disabled="modifyType === 'delete'"
            class="rounded-l-none border-l-0"
          />
        </DtxInputGroup>
      </div>
      <template #footer>
        <Button class="btn-close" label="取消" @click.stop="showDialog = false" />
        <Button v-if="modifyType === 'delete'" class="p-button-danger" label="確定刪除" @click.stop="handleStore" />
        <Button v-else class="p-button-primary" label="確定" @click.stop="handleStore" />
      </template>
    </Dialog>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import search from 'components/searchBar.vue'
import { useQuasar } from 'quasar'
import { getDepartment, getRoomLst, postRoomLst, putRoomLst, deleteRoomLst, getRoomItem } from 'api'
const $q = useQuasar()

const route = useRoute()

const titleName = computed(() => {
  if (route.path.includes('/roomMaintenance')) {
    return '門診診間維護'
  } else {
    return '診間名稱設定'
  }
})

async function catchAsync(func, msg) {
  try {
    await func
    $q.notify({
      type: 'positive',

      message: `${msg}成功`,
      position: 'top',
    })
  } catch (e) {
    return $q.notify({
      type: 'negative',

      message: `${msg}失敗`,
      position: 'top',
    })
  } finally {
    handleSearch()
  }
}
const headers = ref([
  { text: '操作', value: 'action', width: '170px' },
  {
    text: '部門',
    value: 'DepartmentParentNo',
    type: 'select',
    options: [],
    labelW: 100,
  },
  {
    text: '科別',
    value: 'DepartmentNo',
    type: 'select',
    options: [],
    labelW: 100,
  },
  { text: '診間代號', value: 'No', type: 'inputtext', labelW: 100 },
  { text: '診間名稱', value: 'Name', type: 'inputtext', labelW: 100 },
  {
    text: '啟用狀態',
    value: 'IsActive',
    type: 'select',
    options: [
      { text: '啟用', value: true },
      { text: '未啟用', value: false },
    ],
    labelW: 100,
  },
])

const getLst = async () => {
  const { data } = await getDepartment('')
  allLst.value = data.Items
}
const sItems = ref([
  ...headers.value.slice(1, 2),
  {
    text: '科別',
    value: 'DepartmentNo',
    type: 'select',
    options: [],
    labelW: 100,
  },
  ...headers.value.slice(-1),
  ...headers.value.slice(3, 5),
])
const codeLst = ref([])
const sVal = ref({})

const showDialog = ref(false)
const modifyType = ref('add')

const pageOptions = reactive({
  firstIndex: 0,
  perPageCount: 10,
  totalItemsCount: 0,
  rowsPerPage: [10, 20, 30],
})

const cur = ref({ No: '', Name: '', name2: '', IsActive: '' })

async function handleModify(item) {
  try {
    let obj
    if (modifyType.value !== 'add') {
      let { data } = await getRoomItem(`Name(${item.Name || ''}),No(${item.No || ''})`)
      obj = { ...data }
    } else {
      obj = {}
    }
    changeVal()

    cur.value = { ...obj }
    showDialog.value = true
  } catch (e) {}
}

const allLst = ref([])

const init = async () => {
  try {
    const res1 = await getDepartment('?&$filter=parentNo eq null')
    let obj1 = headers.value.find((elm) => elm.value === 'DepartmentParentNo')
    obj1.options = res1.data.Items.map((elm) => ({
      ...elm,
      text: elm.Name,
      value: elm.No,
    }))
    const res2 = await getDepartment(`?&$filter=parentNo ne null`)
    let obj2 = sItems.value.find((elm) => elm.value === 'DepartmentNo')
    obj2.options = res2.data.Items.map((elm) => ({
      ...elm,
      text: elm.Name,
      value: elm.No,
    }))
  } catch (e) {}
}
async function changeVal() {
  try {
    const res2 = await getDepartment(`?&$filter=parentNo eq '${cur.value.DepartmentParentNo}'`)
    let obj2 = headers.value.find((elm) => elm.value === 'DepartmentNo')
    obj2.options = res2.data.Items.map((elm) => ({
      ...elm,
      text: elm.Name,
      value: elm.No,
    }))
  } catch (e) {}
}
async function handleStore() {
  if (modifyType.value === 'add') {
    catchAsync(postRoomLst(cur.value), '新增')
  } else if (modifyType.value === 'edit') {
    catchAsync(putRoomLst(cur.value), '更新')
  } else if (modifyType.value === 'delete') {
    catchAsync(
      deleteRoomLst(`Name(${cur.value.Name}),No(${cur.value.No})`),
      //   "Name(內科一診),No(R001)"
      // ),
      '刪除'
    )
  }
  showDialog.value = false
}

const searchParam = computed(() => {
  const _param = Object.entries(sVal.value)
    .reduce((acc, [key, value]) => {
      if (!value && value !== false) return acc

      const s1 =
        key === 'DepartmentParentNo'
          ? `Department/ParentNo eq '${value}'`
          : key === 'IsActive'
          ? `${key} eq ${value}`
          : `(contains(tolower(${key}),'${value}'))`
      return acc.concat(s1)
    }, [])
    .join(' and ')

  return _param ? `&$filter=${_param}` : ''
})

async function handleSearch() {
  const { data } = await getRoomLst(
    `?${searchParam.value}&$top=${pageOptions.perPageCount}&$skip=${pageOptions.firstIndex}`
  )
  // allLst
  codeLst.value = data.Items.map((elm) => {
    let obj = allLst.value.find((e) => e.No === elm.DepartmentNo)
    return {
      ...elm,
      DepartmentParentNo: obj?.ParentNo,
      DepartmentParentNoDis: obj?.ParentName,
      DepartmentNoDis: obj?.Name,
    }
  })
  pageOptions.totalItemsCount = data.Count
}

onMounted(() => {
  getLst()
  handleSearch()
  handleSearch()
  init()
})
</script>
