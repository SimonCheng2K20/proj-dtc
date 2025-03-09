<template>
  <div>
    <my-title noFixed title="機密等級管理"></my-title>
    <div class="flex flex-wrap gap-2 py-2">
      <DtxInputGroup title="機密等級代碼">
        <InputText v-model="search.code" @keydown.enter="searchSubmit" />
      </DtxInputGroup>
      <DtxInputGroup title="機密等級名稱">
        <InputText v-model="search.name" @keydown.enter="searchSubmit" />
      </DtxInputGroup>

      <div class="flex gap-2">
        <Button label="進行查詢" icon="pi pi-search" @click="searchSubmit" />
        <Button class="p-button-secondary" label="清除查詢" icon="pi pi-undo" @click="searchClear" />
        <Button label="新增資料" class="btn-add" icon="pi pi-plus" @click="toAdd" />
      </div>
    </div>

    <v-data-table :headers="headers" :items="items" :pageOptions="pageOptions" @pageChange="pageChange">
      <template #item-action="{ item }">
        <div class="flex justify-center gap-3">
          <Button class="p-button-sm" @click="toEdit(item)" label="編輯" icon="pi pi-pencil" />
          <Button class="p-button-warning p-button-sm" label="刪除" @click="toDelete(item)" icon="pi pi-trash" />
        </div>
      </template>
    </v-data-table>

    <Dialog v-model:visible="dialog.edit.show" :draggable="false" modal :header="editHeader" style="width: 768px">
      <div v-if="dialog.edit.type === 'delete'" class="font-bold">是否確定刪除此機密等級？</div>
      <div class="grid gap-2">
        <DtxInputGroup title="機密等級代碼">
          <InputText v-model="editItem.code" :disabled="dialog.edit.type !== 'add'" />
        </DtxInputGroup>
        <DtxInputGroup title="機密等級名稱">
          <InputText v-model="editItem.name" :disabled="dialog.edit.type === 'delete'" />
        </DtxInputGroup>
        <DtxInputGroup title="電腦等級代碼">
          <InputText v-model="editItem.computerLevelCode" :disabled="dialog.edit.type === 'delete'" />
        </DtxInputGroup>
        <DtxInputGroup title="機密等級備註">
          <InputText v-model="editItem.note" :disabled="dialog.edit.type === 'delete'" />
        </DtxInputGroup>
      </div>

      <template #footer>
        <Button class="p-button-grey" @click="dialog.edit.show = false">取消</Button>
        <Button v-if="dialog.edit.type === 'add'" @click="PostSecretLevel">建立</Button>
        <Button v-if="dialog.edit.type === 'edit'" @click="PutSecretLevel">儲存</Button>
        <Button v-if="dialog.edit.type === 'delete'" class="p-button-warning" @click="DeleteSecretLevel">刪除</Button>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import _ from 'lodash'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const headers = reactive([
  { text: '操作', value: 'action', width: '170px' },
  { text: '機密等級代碼', value: 'code' },
  { text: '機密等級名稱', value: 'name' },
  { text: '電腦等級代碼', value: 'computerLevelCode' },
  { text: '機密等級備註', value: 'note' },
])

const items = ref([])
const GetSecretLevel = async (query = '') => {
  try {
    const res = await getSecretLevel(query)

    switch (res.status) {
      case 200:
        items.value = res.data.entry
        pageOptions.totalItemsCount = res.data.count
        break
      default: {
        const errText = await res.text()
        throw Error(`${res.status}: ${errText}`)
      }
    }
  } catch (e) {
    console.log(e)
  }
}

const pageOptions = reactive({
  firstIndex: 0,
  perPageCount: 10,
  totalItemsCount: 0,
  rowsPerPage: [10, 20, 30],
})

const search = reactive({
  code: '',
  name: '',
})

const pageChange = (e) => {
  const query = `?pageStart=${e.first}&limit=${pageOptions.perPageCount}&${searchQuery.value}`
  GetSecretLevel(query)
}

const searchQuery = computed(() => {
  const queryArr = []
  _.forEach(Object.entries(search), ([key, value]) => {
    queryArr.push(`${key}=${value}`)
  })
  return _.join(queryArr, '&')
})

const searchSubmit = () => {
  const query = `?limit=${pageOptions.perPageCount}&${searchQuery.value}`
  GetSecretLevel(query)
  pageOptions.firstIndex = 0
}

const searchClear = () => {
  const query = `?limit=${pageOptions.perPageCount}`
  _.forEach(Object.keys(search), (key) => {
    search[key] = ''
  })
  GetSecretLevel(query)
  pageOptions.firstIndex = 0
}

const dialog = reactive({
  edit: {
    show: false,
  },
})

const editItem = reactive({
  code: '',
  name: '',
  computerLevelCode: '',
  note: '',
})

const toAdd = () => {
  _.forEach(Object.keys(editItem), (key) => {
    editItem[key] = ''
  })

  dialog.edit.type = 'add'
  dialog.edit.show = true
}

const toEdit = (item) => {
  _.forEach(Object.keys(editItem), (key) => {
    editItem[key] = item[key]
  })

  dialog.edit.type = 'edit'
  dialog.edit.show = true
}

const toDelete = (item) => {
  _.forEach(Object.keys(editItem), (key) => {
    editItem[key] = item[key]
  })

  dialog.edit.type = 'delete'
  dialog.edit.show = true
}

const editHeader = computed(() => {
  switch (dialog.edit.type) {
    case 'add':
      return '新增機密等級'
    case 'edit':
      return '編輯機密等級'
    case 'delete':
      return '刪除機密等級'
    default:
      return
  }
})

const PostSecretLevel = async () => {
  try {
    const res = await postSecretLevel(editItem)

    switch (res.status) {
      case 200:
        $q.notify({
          type: 'positive',

          message: '新增機密等級成功',
          position: 'top',
        })
        dialog.edit.show = false
        GetSecretLevel(`?limit=${pageOptions.perPageCount}`)
        pageOptions.firstIndex = 0
        break
      default: {
        const errText = await res.text()
        throw Error(`${res.status}: ${errText}`)
      }
    }
  } catch (e) {
    console.log(e)
    $q.notify({
      type: 'negative',

      message: '新增機密等級失敗',
      position: 'top',
    })
  }
}

const PutSecretLevel = async () => {
  try {
    const res = await putSecretLevel(editItem)

    switch (res.status) {
      case 200:
        $q.notify({
          type: 'positive',

          message: '編輯機密等級成功',
          position: 'top',
        })
        dialog.edit.show = false
        GetSecretLevel(`?pageStart=${pageOptions.firstIndex}&limit=${pageOptions.perPageCount}&${searchQuery.value}`)
        break
      default: {
        const errText = await res.text()
        throw Error(`${res.status}: ${errText}`)
      }
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',

      message: '編輯機密等級失敗',
      position: 'top',
    })
  }
}

const DeleteSecretLevel = async () => {
  try {
    const res = await deleteSecretLevel(editItem)

    switch (res.status) {
      case 200:
        $q.notify({
          type: 'positive',

          message: '刪除機密等級成功',
          position: 'top',
        })
        dialog.edit.show = false
        GetSecretLevel(`?pageStart=${pageOptions.firstIndex}&limit=${pageOptions.perPageCount}&${searchQuery.value}`)
        break
      default: {
        const errText = await res.text()
        throw Error(`${res.status}: ${errText}`)
      }
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',

      message: '刪除機密等級失敗',
      position: 'top',
    })
  }
}

// init
;(() => {
  const query = `?limit=${pageOptions.perPageCount}`
  GetSecretLevel(query)
})()
</script>
