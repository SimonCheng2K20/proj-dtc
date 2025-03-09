<template>
  <div>
    <div class="flex flex-wrap py-4">
      <DtxInputGroup class="mr-2 mb-2" title="廠商編號">
        <InputText v-model="search.vendorId" @keydown.enter="searchSubmit" />
      </DtxInputGroup>
      <DtxInputGroup class="mr-2 mb-2" title="廠商名稱">
        <InputText v-model="search.name" @keydown.enter="searchSubmit" />
      </DtxInputGroup>

      <div class="flex mb-2">
        <Button class="mr-2" label="進行查詢" icon="pi pi-search" @click="searchSubmit" />
        <Button class="p-button-secondary mr-2" label="清除查詢" icon="pi pi-undo" @click="searchClear" />
        <Button label="新增資料" class="btn-add" icon="pi pi-plus" @click="toAdd" />
      </div>
    </div>

    <v-data-table :headers="headers" :items="items" :pageOptions="pageOptions" @pageChange="pageChange">
      <template #item-action="{ item }">
        <Button class="p-button-sm mr-1" @click="toEdit(item)">編輯</Button>
        <Button class="p-button-sm p-button-warning" @click="toDelete(item)">刪除</Button>
      </template>
    </v-data-table>

    <Dialog :header="editHeader" v-model:visible="dialog.edit.show" :draggable="false" modal style="width: 768px">
      <div class="grid gap-2">
        <DtxInputGroup title="廠商編號">
          <InputText v-model="editItem.vendorId" :disabled="dialog.edit.type !== 'add'" />
        </DtxInputGroup>
        <DtxInputGroup title="廠商名稱">
          <InputText v-model="editItem.name" :disabled="dialog.edit.type === 'delete'" />
        </DtxInputGroup>
        <DtxInputGroup title="廠商地址">
          <InputText v-model="editItem.address" :disabled="dialog.edit.type === 'delete'" />
        </DtxInputGroup>
        <DtxInputGroup title="廠商聯絡人">
          <InputText v-model="editItem.contact" :disabled="dialog.edit.type === 'delete'" />
        </DtxInputGroup>
        <DtxInputGroup title="廠商電話">
          <InputText v-model="editItem.phone" :disabled="dialog.edit.type === 'delete'" />
        </DtxInputGroup>
        <DtxInputGroup title="統一發票號碼">
          <InputText v-model="editItem.taxId" :disabled="dialog.edit.type === 'delete'" />
        </DtxInputGroup>
      </div>

      <template #footer>
        <Button class="p-button-outlined p-button-plain" @click="dialog.edit.show = false">取消</Button>
        <Button v-if="dialog.edit.type === 'add'" @click="PostDrugVendor">建立</Button>
        <Button v-if="dialog.edit.type === 'edit'" @click="PutDrugVendor">儲存</Button>
        <Button v-if="dialog.edit.type === 'delete'" class="p-button-warning" @click="DeleteDrugVendor">刪除</Button>
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
  { text: '操作', value: 'action', width: '97px' },
  { text: '廠商編號', value: 'vendorId' },
  { text: '廠商名稱', value: 'name' },
  { text: '廠商地址', value: 'address' },
  { text: '廠商聯絡人', value: 'contact' },
  { text: '廠商電話', value: 'phone' },
  { text: '統一發票號碼', value: 'taxId' },
])

const items = ref([])
const GetDrugVendor = async (query = '') => {
  try {
    const res = await getDrugVendor(query)

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
  } catch (err) {
    console.log(err)
  }
}

const pageOptions = reactive({
  firstIndex: 0,
  perPageCount: 10,
  totalItemsCount: 0,
  rowsPerPage: [10, 20, 30],
})

const search = reactive({
  vendorId: '',
  name: '',
})

const pageChange = (e) => {
  const query = `?pageStart=${e.first}&limit=${pageOptions.perPageCount}&${searchQuery.value}`
  GetDrugVendor(query)
}

const searchQuery = computed(() => {
  const queryArr = []
  _.forEach(Object.keys(search), (key) => {
    queryArr.push(`${key}=${search[key]}`)
  })
  return _.join(queryArr, '&')
})

const searchSubmit = () => {
  const query = `?limit=${pageOptions.perPageCount}&${searchQuery.value}`

  GetDrugVendor(query)
  pageOptions.firstIndex = 0
}

const searchClear = () => {
  _.forEach(Object.entries(search), ([key]) => {
    search[key] = ''
  })

  GetDrugVendor(`?limit=${pageOptions.perPageCount}`)
  pageOptions.firstIndex = 0
}

const dialog = reactive({
  edit: {
    show: false,
    type: '',
  },
})

const editItem = reactive({
  vendorId: '',
  name: '',
  address: '',
  contact: '',
  phone: '',
  taxId: '',
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
      return '新增藥品廠商'
    case 'edit':
      return '編輯藥品廠商'
    case 'delete':
      return '刪除藥品廠商'
    default:
      return
  }
})

const PostDrugVendor = async () => {
  try {
    const res = await postDrugVendor(editItem)
    switch (res.status) {
      case 200:
        $q.notify({
          type: 'positive',

          message: '新增藥品藥房成功',
          position: 'top',
        })
        dialog.edit.show = false

        const query = `?limit=${pageOptions.perPageCount}&${searchQuery.value}`
        GetDrugVendor(query)
        pageOptions.firstIndex = 0
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

      message: '新增藥品藥房失敗',
      position: 'top',
    })
  }
}

const PutDrugVendor = async () => {
  try {
    const res = await putDrugVendor(editItem)
    switch (res.status) {
      case 200:
        $q.notify({
          type: 'positive',

          message: '編輯藥品藥房成功',
          position: 'top',
        })
        dialog.edit.show = false

        const query = `?pageStart=${pageOptions.firstIndex}&limit=${pageOptions.perPageCount}&${searchQuery.value}`
        GetDrugVendor(query)
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

      message: '編輯藥品藥房失敗',
      position: 'top',
    })
  }
}

const DeleteDrugVendor = async () => {
  try {
    const res = await deleteDrugVendor(editItem.vendorId)
    switch (res.status) {
      case 200:
        $q.notify({
          type: 'positive',

          message: '刪除藥品藥房成功',
          position: 'top',
        })
        dialog.edit.show = false

        const query = `?pageStart=${pageOptions.firstIndex}&limit=${pageOptions.perPageCount}&${searchQuery.value}`
        GetDrugVendor(query)
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

      message: '刪除藥品藥房失敗',
      position: 'top',
    })
  }
}

// init
const init = () => {
  GetDrugVendor(`?limit=${pageOptions.perPageCount}`)
}
init()
</script>

