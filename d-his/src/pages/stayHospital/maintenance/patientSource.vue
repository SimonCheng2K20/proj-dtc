<template>
  <div>
    <div class="flex flex-wrap py-4">
      <DtxInputGroup class="mr-2 mb-2" title="病患來源代碼">
        <InputText v-model="search.code" class="w-full" />
      </DtxInputGroup>
      <DtxInputGroup class="mr-2 mb-2" title="病患來源名稱">
        <InputText v-model="search.name" class="w-full" />
      </DtxInputGroup>

      <div class="flex mb-2">
        <Button class="mr-2" label="進行查詢" icon="pi pi-search" @click="searchSubmit" />
        <Button class="p-button-secondary mr-2" label="清除查詢" icon="pi pi-undo" @click="searchClear" />
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
      <div v-if="dialog.edit.type === 'delete'" class="font-bold">是否確定刪除此病患來源？</div>
      <DtxInputGroup title="病患來源代碼">
        <InputText v-if="dialog.edit.type === 'add'" v-model="editItem.code" class="w-full" />
        <InputText v-else :value="editItem.code" class="w-full" disabled />
      </DtxInputGroup>
      <DtxInputGroup title="病患來源名稱" class="mt-2">
        <InputText v-if="dialog.edit.type !== 'delete'" v-model="editItem.name" class="w-full" />
        <InputText v-else :value="editItem.name" class="w-full" disabled />
      </DtxInputGroup>

      <template #footer>
        <Button class="p-button-grey" @click="dialog.edit.show = false">取消</Button>
        <Button v-if="dialog.edit.type === 'add'" @click="PostPatientSource">建立</Button>
        <Button v-if="dialog.edit.type === 'edit'" @click="PutPatientSource">儲存</Button>
        <Button v-if="dialog.edit.type === 'delete'" class="p-button-warning" @click="DeletePatientSource">刪除</Button>
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
  { text: '操作', value: 'action' },
  { text: '病患來源代碼', value: 'code' },
  { text: '病患來源名稱', value: 'name' },
])

const items = ref([])
const GetPatientSource = async (query = '') => {
  try {
    const res = await getPatientSource(query)

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
  GetPatientSource(query)
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
  GetPatientSource(query)
  pageOptions.firstIndex = 0
}

const searchClear = () => {
  const query = `?limit=${pageOptions.perPageCount}`
  _.forEach(Object.keys(search), (key) => {
    search[key] = ''
  })
  GetPatientSource(query)
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
      return '新增病患來源'
    case 'edit':
      return '編輯病患來源'
    case 'delete':
      return '刪除病患來源'
    default:
      return
  }
})

const PostPatientSource = async () => {
  try {
    const res = await postPatientSource(editItem)

    switch (res.status) {
      case 200:
        $q.notify({ type: 'positive', message: '新增病患來源成功', position: 'top' })
        dialog.edit.show = false
        GetPatientSource(`?limit=${pageOptions.perPageCount}`)
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

      message: '新增病患來源失敗：' + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  }
}

const PutPatientSource = async () => {
  try {
    const res = await putPatientSource(editItem)

    switch (res.status) {
      case 200:
        $q.notify({ type: 'positive', message: '編輯病患來源成功', position: 'top' })
        dialog.edit.show = false
        GetPatientSource(`?pageStart=${pageOptions.firstIndex}&limit=${pageOptions.perPageCount}&${searchQuery.value}`)
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

      message: '編輯病患來源失敗：' + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  }
}

const DeletePatientSource = async () => {
  try {
    const res = await deletePatientSource(editItem)

    switch (res.status) {
      case 200:
        $q.notify({ type: 'positive', message: '刪除病患來源成功', position: 'top' })
        dialog.edit.show = false
        GetPatientSource(`?pageStart=${pageOptions.firstIndex}&limit=${pageOptions.perPageCount}&${searchQuery.value}`)
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

      message: '刪除病患來源失敗：' + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  }
}

// init
;(() => {
  const query = `?limit=${pageOptions.perPageCount}`
  GetPatientSource(query)
})()
</script>

