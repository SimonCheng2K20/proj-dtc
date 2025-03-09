<template>
  <div>
    <my-title noFixed title="醫令異動狀態"></my-title>
    <my-search-area class="my-2" @searchSubmit="searchSubmit" @searchClear="searchClear" gridCols="1">
      <DtxInputGroup title="健保醫令代碼">
        <InputText v-model="search.NhiCode" @keydown.enter="searchSubmit"
      /></DtxInputGroup>

      <template #btn-expand>
        <Button label="新增資料" class="btn-add" icon="pi pi-plus" @click="toAdd" />
        <Button class="p-button-help" label="自動更新" icon="pi pi-undo" @click="ProcedureAutoUpdate" />
      </template>
    </my-search-area>

    <v-data-table
      class="max-h-[688px]"
      :headers="headers"
      :items="items"
      :loading="loading"
      :pageOptions="pageOptions"
      @pageChange="pageChange"
      v-model:sortBy="sortBy"
      @sort="searchSubmit"
    >
      <template #item-action="{ item }">
        <div class="flex justify-center gap-3">
          <Button class="p-button-sm" @click="toEdit(item)" label="編輯" icon="pi pi-pencil" />
          <Button class="p-button-warning p-button-sm" label="刪除" @click="toDelete(item)" icon="pi pi-trash" />
        </div>
      </template>
      <template #item-BeforeNhiPoint="{ value }">{{ numberFormat(value) }}</template>
      <template #item-BeforeSelfPay="{ value }">{{ numberFormat(value) }}</template>
      <template #item-AfterNhiPoint="{ value }">{{ numberFormat(value) }}</template>
      <template #item-AfterSelfPay="{ value }">{{ numberFormat(value) }}</template>
    </v-data-table>

    <Dialog v-model:visible="dialog.edit.show" :draggable="false" modal :header="editHeader" style="width: 768px">
      <div v-if="dialog.edit.type === 'delete'" class="font-bold">是否確定刪除此醫令異動狀態？</div>

      <my-input-group class="grid gap-2">
        <DtxInputGroup title="健保醫令代碼">
          <InputText v-model="editItem.NhiCode" :disabled="dialog.edit.type === 'delete'"></InputText>
        </DtxInputGroup>
        <DtxInputGroup title="診療項目(中文)"> <InputText v-model="editItem.ProcedureCname" disabled /></DtxInputGroup>
        <DtxInputGroup title="支付點數">
          <InputText v-model="editItem.BeforeNhiPoint" :disabled="dialog.edit.type === 'delete'"
        /></DtxInputGroup>
        <DtxInputGroup title="自費金額">
          <InputText v-model="editItem.BeforeSelfPay" :disabled="dialog.edit.type === 'delete'"
        /></DtxInputGroup>
        <DtxInputGroup title="變更點數">
          <InputText v-model="editItem.AfterNhiPoint" :disabled="dialog.edit.type === 'delete'"
        /></DtxInputGroup>
        <DtxInputGroup title="變更自費金額">
          <InputText v-model="editItem.AfterSelfPay" :disabled="dialog.edit.type === 'delete'"
        /></DtxInputGroup>
        <DtxInputGroup
          title="生效日期"
          @click="dialog.edit.type === 'delete' ? null : (calenderRef.showCalendar = true)"
        >
          <InputText
            :value="editItem.EffectiveDate"
            style="pointer-events: none"
            :disabled="dialog.edit.type === 'delete'"
          />
        </DtxInputGroup>
      </my-input-group>

      <template #footer>
        <Button class="p-button-grey" @click="dialog.edit.show = false">取消</Button>
        <Button v-if="dialog.edit.type === 'add'" @click="PostProcedureChange">建立</Button>
        <Button v-if="dialog.edit.type === 'edit'" @click="PutProcedureChange">儲存</Button>
        <Button v-if="dialog.edit.type === 'delete'" class="p-button-warning" @click="DeleteProcedureChange"
          >刪除</Button
        >
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import {
  getProcedure,
  getProcedureChange,
  getProcedureChangeItem,
  postProcedureChange,
  putProcedureChange,
  deleteProcedureChange,
  procedureAutoUpdate,
} from 'api'
import { reactive, ref, computed } from 'vue'
import _ from 'lodash'
import { useQuasar } from 'quasar'
import setSearchQuery from 'utils/setSearchQuery'
import dayjs from 'dayjs'
import numberFormat from 'utils/numberFormat'

const calenderRef = ref(null)
const $q = useQuasar()

const loading = ref(true)
const sortBy = ref([])
const headers = reactive([
  {
    key: 'action',
    text: '操作',
    value: 'action',
    minWidth: '160px',
  },
  {
    key: 'NhiCode',
    text: '健保醫令代碼',
    value: 'NhiCode',
    minWidth: '126px',
  },
  {
    key: 'ProcedureCname',
    text: '診療項目(中文)',
    value: 'ProcedureCname',
  },
  {
    key: 'BeforeNhiPoint',
    text: '支付點數',
    value: 'BeforeNhiPoint',
    minWidth: '86px',
    align: 'end',
  },
  {
    key: 'BeforeSelfPay',
    text: '自費金額',
    value: 'BeforeSelfPay',
    minWidth: '86px',
    align: 'end',
  },
  {
    key: 'AfterNhiPoint',
    text: '變更點數',
    value: 'AfterNhiPoint',
    minWidth: '86px',
    align: 'end',
  },
  {
    key: 'AfterSelfPay',
    text: '變更自費金額',
    value: 'AfterSelfPay',
    minWidth: '126px',
    align: 'end',
  },
  {
    key: 'EffectiveDate',
    text: '生效日期',
    value: 'EffectiveDate',
    minWidth: '86px',
    width: '160px',
  },
  {
    key: 'IsActived',
    text: '自動更新',
    value: 'IsActived',
    minWidth: '86px',
  },
])

const items = ref([])
const GetProcedureChange = async () => {
  try {
    loading.value = true
    const query = setSearchQuery({
      $top: pageOptions.perPageCount,
      $skip: pageOptions.firstIndex,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getProcedureChange(query)
    if (res.status === 200) {
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
}
const search = reactive(_.cloneDeep(initData.search))

const pageChange = () => {
  GetProcedureChange()
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
  GetProcedureChange()
}

const searchClear = () => {
  Object.assign(search, _.cloneDeep(initData.search))
  pageOptions.firstIndex = 0
  GetProcedureChange()
}

const dialog = reactive({
  edit: {
    show: false,
    type: '',
  },
})

initData.editItem = {
  NhiCode: null,
  ProcedureCname: null,
  BeforeNhiPoint: null,
  BeforeSelfPay: null,
  AfterNhiPoint: null,
  AfterSelfPay: null,
  EffectiveDate: null,
}
const editItem = reactive(_.cloneDeep(initData.editItem))

const toAdd = () => {
  Object.assign(editItem, _.cloneDeep(initData.editItem))
  dialog.edit.type = 'add'
  dialog.edit.show = true
}

const toEdit = (item) => {
  Object.assign(editItem, _.cloneDeep(item))
  // GetProcedureChangeItem(item.NhiCode)
  dialog.edit.type = 'edit'
  dialog.edit.show = true
}

const toDelete = (item) => {
  Object.assign(editItem, _.cloneDeep(item))
  // GetProcedureChangeItem(item.NhiCode)
  dialog.edit.type = 'delete'
  dialog.edit.show = true
}

const editHeader = computed(() => {
  switch (dialog.edit.type) {
    case 'add':
      return `新增醫令異動狀態`
    case 'edit':
      return `編輯醫令異動狀態`
    case 'delete':
      return `刪除醫令異動狀態`
    default:
      return
  }
})

const GetProcedureChangeItem = async (id) => {
  try {
    const res = await getProcedureChangeItem(id)
    if (res.status === 200) {
      Object.assign(editItem, res.data)
    }
  } catch (err) {
    console.log(err)
  }
}

const PostProcedureChange = async () => {
  try {
    const res = await postProcedureChange(editItem)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',

        message: '新增醫令異動狀態成功',
        position: 'top',
      })
      dialog.edit.show = false
      pageOptions.firstIndex = 0
      GetProcedureChange()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',

      message: '新增醫令異動狀態失敗：' + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  }
}

const PutProcedureChange = async () => {
  try {
    const res = await putProcedureChange(editItem)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',

        message: '編輯醫令異動狀態成功',
        position: 'top',
      })
      dialog.edit.show = false
      pageOptions.firstIndex = 0
      GetProcedureChange()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',

      message: '編輯醫令異動狀態失敗：' + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  }
}

const DeleteProcedureChange = async () => {
  try {
    const res = await deleteProcedureChange(editItem.NhiCode)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',

        message: '刪除醫令異動狀態成功',
        position: 'top',
      })
      dialog.edit.show = false
      pageOptions.firstIndex = 0
      GetProcedureChange()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',

      message: '刪除醫令異動狀態失敗：' + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  }
}

const procedureSuggestion = ref([])
const GetProcedure = async (queryOptions) => {
  try {
    const query = setSearchQuery(queryOptions)
    const res = await getProcedure(query)
    procedureSuggestion.value = _.map(res.data.Items, (item) => ({
      ...item,
      Name: `${item.ProcedureCode} - ${item.ProcedureCname || item.ProcedureEname}`,
    }))
  } catch (err) {
    console.log(err)
  }
}

const procedureChange = (option, item) => {
  item.NhiCode = option.NhiCode
  item.ProcedureCname = option.ProcedureCname
  item.BeforeNhiPoint = option.BeforeNhiPoint
  item.BeforeSelfPay = option.BeforeSelfPay
  item.AfterNhiPoint = option.AfterNhiPoint
  item.AfterSelfPay = option.AfterSelfPay
}

const onDateSelect = (date) => {
  editItem.EffectiveDate = date
  calenderRef.value.showCalendar = false
}

const ProcedureAutoUpdate = async () => {
  try {
    const res = await procedureAutoUpdate()
    if (res.status === 200) {
      $q.notify({
        type: 'positive',

        message: '更新醫令異動狀態成功',
        position: 'top',
      })
    }
  } catch (err) {
    console.log(err)
  }
}

const init = async () => {
  GetProcedureChange()
}
init()
</script>

