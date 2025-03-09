<template>
  <q-page>
    <!-- <my-search-area gridCols="2" @searchSubmit="searchSubmit" @searchClear="searchClear">
      <DtxInputGroup title="健保代碼"> <InputText v-model="search.NhiCode" @keydown.enter="searchSubmit" /></DtxInputGroup>
      <DtxInputGroup title="院內碼"> <InputText v-model="search.MedicineId" @keydown.enter="searchSubmit" /></DtxInputGroup>

      <template #btn-expand> </template>
    </my-search-area> -->
    <my-title no-fixed title="藥價資料更新"></my-title>
    <div class="p-2">
      <div class="flex justify-end gap-2 p-2 bg-[#eeeeee] rounde">
        <Button label="新增資料" class="btn-add" icon="pi pi-plus" @click="toAdd" />

        <Button label="匯出 Excel" @click="PostPriceUpdateExcel" />
        <Button label="藥價更新" @click="PostDoPriceUpdate" />
      </div>

      <v-data-table
        class="max-h-[688px] mt-2"
        :headers="headers"
        :items="items"
        :loading="loading"
        :pageOptions="pageOptions"
        @pageChange="pageChange"
        v-model:sortBy="sortBy"
        @sort="searchSubmit"
      >
        <template #header-select>
          <div>
            <Button
              class="p-button-sm"
              style="background: white; color: black"
              label="全選"
              :icon="isSelectAll ? 'pi pi-check' : undefined"
              @click="onSelectAllClick"
            ></Button>
          </div>
        </template>

        <template #item-action="{ item }">
          <div class="flex justify-center gap-3">
            <Button class="p-button-sm" @click="toEdit(item)" label="編輯" icon="pi pi-pencil" />
            <Button class="p-button-warning p-button-sm" label="刪除" @click="toDelete(item)" icon="pi pi-trash" />
          </div>
        </template>
        <template #item-select="{ item }">
          <q-checkbox v-model="selectedItems" :value="item" @change="onCheckboxChange"></q-checkbox>
        </template>
      </v-data-table>

      <Dialog v-model:visible="dialog.edit.show" :draggable="false" modal :header="editHeader" style="width: 768px">
        <div v-if="dialog.edit.type === 'delete'" class="font-bold">是否確定刪除此藥價更新？</div>

        <my-input-group class="grid gap-2">
          <DtxInputGroup title="健保代碼">
            <InputText
              v-model="editItem.NhiCode"
              :disabled="dialog.edit.type === 'delete'"
            />
          </DtxInputGroup>
          <DtxInputGroup title="院內碼">
            <InputText
              v-model="editItem.MedicineId"
              :disabled="dialog.edit.type === 'delete'"
            />
          </DtxInputGroup>
          <DtxInputGroup title="藥品名稱">
            <InputText :value="editItem.CName || editItem.EName" disabled />
          </DtxInputGroup>
          <DtxInputGroup title="原單價">
            <InputText v-model="editItem.OriginPrice" type="number" :disabled="dialog.edit.type === 'delete'" />
          </DtxInputGroup>
          <DtxInputGroup title="新單價">
            <InputText v-model="editItem.NewPrice" type="number" :disabled="dialog.edit.type === 'delete'" />
          </DtxInputGroup>
          <DtxInputGroup title="生效日期">
            <InputText
              :value="editItem.EffectiveDate?.substring(0, 10)"
              readonly
              :disabled="dialog.edit.type === 'delete'"
            ></InputText>
            <Button
              v-if="dialog.edit.type !== 'delete'"
              icon="pi pi-calendar"
              @click="showCalenderDetail(editItem.EffectiveDate, 'EffectiveDate')"
            />
          </DtxInputGroup>
        </my-input-group>

        <template #footer>
          <Button class="p-button-grey" @click="dialog.edit.show = false">取消</Button>
          <Button v-if="dialog.edit.type === 'add'" @click="PostPriceUpdate">建立</Button>
          <Button v-if="dialog.edit.type === 'edit'" @click="PutPriceUpdate">儲存</Button>
          <Button v-if="dialog.edit.type === 'delete'" class="p-button-warning" @click="DeletePriceUpdate">刪除</Button>
        </template>
      </Dialog>
    </div>
  </q-page>
</template>

<script setup>
import {
  getPriceUpdate,
  getPriceUpdateItem,
  postPriceUpdate,
  putPriceUpdate,
  deletePriceUpdate,
  getDrug,
  postDoPriceUpdate,
  postPriceUpdateExcel,
} from 'api'
import { reactive, ref, computed } from 'vue'
import _ from 'lodash'
import { useQuasar } from 'quasar'
import setSearchQuery from 'utils/setSearchQuery'
import dayjs from 'dayjs'
import numberFormat from 'utils/numberFormat'

const $q = useQuasar()
const calenderRef = ref()
const loading = ref(true)
const sortBy = ref([])
const headers = reactive([
  { key: 'action', text: '操作', value: 'action' },
  { key: 'NhiCode', text: '健保代碼', value: 'NhiCode' },
  { key: 'MedicineId', text: '院內碼', value: 'MedicineId' },
  { key: 'CName', text: '藥品名稱', value: 'CName' },
  {
    key: 'OriginPrice',
    text: '原單價',
    value: (row) => (_.isNumber(row.OriginPrice) ? numberFormat(row.OriginPrice) : row.OriginPrice),
  },
  {
    key: 'NewPrice',
    text: '新單價',
    value: (row) => (_.isNumber(row.NewPrice) ? numberFormat(row.NewPrice) : row.NewPrice),
  },
  { key: 'EffectiveDate', text: '生效日期', value: 'EffectiveDate' },
  {
    key: 'PriceDifference',
    text: '價差',
    value: (row) => (_.isNumber(row.PriceDifference) ? numberFormat(row.PriceDifference) : row.PriceDifference),
  },
  { key: 'VendorName', text: '廠商', value: 'VendorName' },
  { key: 'select', text: '選取', value: 'select', minWidth: '86px', align: 'center' },
])

const items = ref([])
const GetPriceUpdate = async () => {
  try {
    loading.value = true
    const query = setSearchQuery({
      $top: pageOptions.perPageCount,
      $skip: pageOptions.firstIndex,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getPriceUpdate(query)
    if (res.status === 200) {
      selectedInit()
      items.value = res.data.Items
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
  NhiCode: '',
  MedicineId: '',
}
const search = reactive(_.cloneDeep(initData.search))

const pageChange = () => {
  GetPriceUpdate()
}

const filter = computed(() => {
  const filterArr = []
  Object.entries(search).forEach(([key, value]) => {
    if (value === '') return
    else filterArr.push(`contains(${key},'${value}')`)
  })

  return !!filterArr.length ? filterArr.join(' and ') : ''
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
  GetPriceUpdate()
}

const searchClear = () => {
  Object.assign(search, _.cloneDeep(initData.search))
  pageOptions.firstIndex = 0
  GetPriceUpdate()
}

const dialog = reactive({
  edit: {
    show: false,
    type: '',
  },
})

initData.editItem = {
  NhiCode: null,
  MedicineId: null,
  CName: null,
  EName: null,
  OriginPrice: null,
  NewPrice: null,
  EffectiveDate: null,
}
const editItem = reactive(_.cloneDeep(initData.editItem))

const toAdd = () => {
  Object.assign(editItem, _.cloneDeep(initData.editItem))
  dialog.edit.type = 'add'
  dialog.edit.show = true
}

const toEdit = (item) => {
  Object.assign(editItem, _.cloneDeep(initData.editItem))
  GetPriceUpdateItem(item.MedicineId)
  dialog.edit.type = 'edit'
  dialog.edit.show = true
}

const toDelete = (item) => {
  Object.assign(editItem, _.cloneDeep(initData.editItem))
  GetPriceUpdateItem(item.MedicineId)
  dialog.edit.type = 'delete'
  dialog.edit.show = true
}

const editHeader = computed(() => {
  switch (dialog.edit.type) {
    case 'add':
      return `新增藥價更新`
    case 'edit':
      return `編輯藥價更新`
    case 'delete':
      return `刪除藥價更新`
    default:
      return ''
  }
})

const GetPriceUpdateItem = async (id) => {
  try {
    const res = await getPriceUpdateItem(id)
    if (res.status === 200) {
      Object.assign(editItem, res.data)
    }
  } catch (err) {
    console.log(err)
  }
}

const PostPriceUpdate = async () => {
  try {
    const __editItem = _.cloneDeep(editItem)
    __editItem.PriceDifference = Math.abs(__editItem.NewPrice - __editItem.OriginPrice)
    const res = await postPriceUpdate(__editItem)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',

        message: '新增藥價更新成功',
        position: 'top',
      })
      dialog.edit.show = false
      pageOptions.firstIndex = 0
      GetPriceUpdate()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',

      message: '新增藥價更新失敗：' + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  }
}

const PutPriceUpdate = async () => {
  try {
    const __editItem = _.cloneDeep(editItem)
    __editItem.PriceDifference = Math.abs(__editItem.NewPrice - __editItem.OriginPrice)
    const res = await putPriceUpdate(__editItem)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',

        message: '編輯藥價更新成功',
        position: 'top',
      })
      dialog.edit.show = false
      pageOptions.firstIndex = 0
      GetPriceUpdate()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',

      message: '編輯藥價更新失敗：' + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  }
}

const DeletePriceUpdate = async () => {
  try {
    const res = await deletePriceUpdate(editItem.MedicineId)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',

        message: '刪除藥價更新成功',
        position: 'top',
      })
      dialog.edit.show = false
      pageOptions.firstIndex = 0
      GetPriceUpdate()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',

      message: '刪除藥價更新失敗：' + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  }
}

const drugItems = ref([])
const GetDrug = async (queryOptions) => {
  try {
    const query = setSearchQuery(queryOptions)
    const res = await getDrug(query)
    if (res.status === 200) {
      drugItems.value = _.map(res.data.Items, (item) => ({
        ...item,
        Name: `${item.MedicineId} - ${item.CName || item.EName}`,
      }))
    }
  } catch (err) {
    console.log(err)
  }
}

const medicineChange = (option) => {
  console.log(option)
  editItem.NhiCode = option.NhiCode
  editItem.MedicineId = option.MedicineId
  editItem.CName = option.CName
  editItem.EName = option.EName
  editItem.OriginPrice = option.OriginPrice
  editItem.NewPrice = option.NewPrice
  editItem.EffectiveDate = option.EffectiveDate
}

// const onEffectiveDateChange = (val) => {
//   editItem.EffectiveDate = val
//   calenderRef.value.showCalendar = false
// }

const showCalenderDetail = (data, prop) => {
  editItem.EffectiveDate = data
  calenderRef.value.tempProp = prop
  calenderRef.value.showCalendar = true
}

const closeCalenderDetail = (data) => {
  if (typeof data === 'string') {
    editItem[calenderRef.value.tempProp] = dayjs(data).format('YYYY-MM-DD')
  }
  calenderRef.value.showCalendar = false
}

const toDay = (data) => {
  editItem[calenderRef.value.tempProp] = dayjs(data).format('YYYY-MM-DD')
  calenderRef.value.showCalendar = false
}

const dateClear = () => {
  editItem[calenderRef.value.tempProp] = ''
  calenderRef.value.showCalendar = false
}

const PostDoPriceUpdate = async () => {
  try {
    const res = await postDoPriceUpdate(selectedItems.value)
    if (res.status === 200) {
      $q.notify({
        type: 'positive',

        message: '藥價更新成功',
        position: 'top',
      })
      pageOptions.firstIndex = 0
      GetPriceUpdate()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',

      message: '藥價更新失敗：' + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  }
}

const PostPriceUpdateExcel = async () => {
  try {
    const res = await postPriceUpdateExcel(body)
    if (res.status === 200) {
      const a = document.createElement('a')
      a.setAttribute('href', res.data)
      a.setAttribute('target', '_blank')
      // a.setAttribute('download', '藥價更新')
      a.click()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',

      message: '匯出 Excel 失敗：' + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  }
}

const isSelectAll = ref(false)
const selectedItems = ref([])
const onSelectAllClick = () => {
  isSelectAll.value = !isSelectAll.value
  if (isSelectAll.value) selectedItems.value = items.value
  else selectedItems.value = []
}

const onCheckboxChange = () => {
  if (selectedItems.value.length === items.value.length) isSelectAll.value = true
  else isSelectAll.value = false
}

const selectedInit = () => {
  isSelectAll.value = false
  selectedItems.value = []
}

const init = async () => {
  GetPriceUpdate()
}
init()
</script>

