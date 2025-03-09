<template>
  <q-page>
    <my-title>個案追蹤管理</my-title>

    <div class="px-2">
      <my-search-area class="my-2" @searchSubmit="searchSubmit" @searchClear="searchClear" gridCols="3">
        <my-input-wrapper label="病歷號碼">
          <q-input v-bind="QInputProps" v-model="search.PatientId" @keydown.enter="searchSubmit"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="身分證號">
          <q-input v-bind="QInputProps" v-model="search.PersonId" @keydown.enter="searchSubmit"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="病患姓名">
          <q-input v-bind="QInputProps" v-model="search.Name" @keydown.enter="searchSubmit"></q-input>
        </my-input-wrapper>
      </my-search-area>

      <q-table
        v-bind="QTableProps"
        :columns="columns"
        :rows="rows"
        :loading="loading"
        row-key="PersonId"
        :pagination="pagination"
      >
        <template #body-cell-action="{ col, row }">
          <q-td :props="{ col, row }">
            <q-btn class="mr-1" label="編輯" color="edit" unelevated dense @click="toEdit(row)"></q-btn>
            <q-btn label="刪除" color="delete" unelevated dense @click="toDelete(row)"></q-btn>
          </q-td>
        </template>
        <template #bottom>
          <my-pagination
            class="mx-auto p-4"
            v-model="pagination"
            @update:modelValue="GetPatientTrace()"
          ></my-pagination>
        </template>
      </q-table>
    </div>

    <q-dialog v-model="dialog.edit.show">
      <my-dialog-content header="刪除個案追蹤" width="540px" @close="dialog.edit.show = false">
        <div class="font-bold">是否確定刪除此個案追蹤？</div>
        <template #actions>
          <q-btn color="grey" unelevated dense @click="dialog.edit.show = false">取消</q-btn>
          <q-btn color="delete" unelevated dense :loading="deleteLoading" @click="DeleteOpdTrace()">刪除</q-btn>
        </template>
      </my-dialog-content>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { getPatientTrace, deletePatientTrace } from 'api'
import { reactive, ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import setSearchQuery from 'utils/setSearchQuery'
import { useRouter } from 'vue-router'
import { QInputProps, QTableProps } from 'utils/quasar-extends/base-props.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'

import { cloneDeep } from 'lodash-es'
import dayjs from 'dayjs'

const $q = useQuasar()
const router = useRouter()

const loading = ref(true)
const sortBy = ref([])
const columns = computed(() => {
  return [
    { name: 'action', label: '操作', field: 'action', align: 'center', headerClasses: 'min-w-[104px]' },
    { name: 'PatientId', label: '病歷號碼', field: 'PatientId', align: 'left' },
    { name: 'Name', label: '病患姓名', field: 'Name', align: 'left' },
    { name: 'PersonId', label: '身分證號', field: 'PersonId', align: 'left' },
    { name: 'DiseaseTypeName', label: '疾病類別', field: 'DiseaseTypeName', align: 'left' },
    { name: 'Pacs', label: '影像到位', field: (row) => (row.Pacs ? '是' : '否'), align: 'left' },
    { name: 'Laboratory', label: '檢驗到位', field: (row) => (row.Laboratory ? '是' : '否'), align: 'left' },
    { name: 'GenderCn', label: '性別', field: 'GenderCn', align: 'left' },
    { name: 'Age', label: '年齡', field: 'Age', align: 'left' },
    { name: 'IdentityCn', label: '健保身份', field: 'IdentityCn', align: 'left' },
    {
      name: 'CreatedDatetime',
      label: '加入日期',
      field: (row) => (row.CreatedDatetime ? dayjs(row.CreatedDatetime).format('YYYY-MM-DD') : ''),
      align: 'left',
    },
    { name: 'Notes', label: '備註', field: 'Notes', align: 'left' },
  ]
})

const rows = ref([])

const filter = computed(() => {
  const str = Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'PatientId':
            return filterArray.concat(`contains(${key},'${value}')`)
          default:
            return filterArray.concat(`contains(Patient/Person/${key},'${value}')`)
        }
      } else {
        return filterArray
      }
    }, [])
    .join(' and ')
  return str
})

const orderBy = computed(() => {
  const orderByArr = []
  sortBy.value.forEach((item) => {
    orderByArr.push(`${item[0]} ${item[1]}`)
  })
  return !!orderByArr.length ? orderByArr.join(',') : ''
})

const items = ref()
const GetPatientTrace = async () => {
  try {
    loading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getPatientTrace(query) //query
    if (res.status === 200) {
      res.data.Items.forEach((element) => {
        if (element.PatientTraceTbs.every((e) => e.EventStatus === false)) {
          element.DiseaseTypeName = '其他'
        } else {
          element.DiseaseTypeName = '結核病'
        }
      })
      rows.value = res.data.Items
      pagination.value.rowsNumber = res.data.Count
    }
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
  }
}

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

const initData = {}
initData.search = {
  PatientId: '',
  PersonId: '',
  Name: '',
}
const search = reactive(cloneDeep(initData.search))

const searchSubmit = () => {
  pagination.value.page = 1
  GetPatientTrace()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetPatientTrace()
}

const dialog = reactive({
  edit: {
    show: false,
    type: 'delete',
  },
})

const toEdit = (row) => {
  router.push({ name: 'TraceEdit', query: { PatientId: row.PatientId, type: 'opd' } })
}

const editItem = reactive({
  PatientId: null,
})
const toDelete = (row) => {
  editItem.PatientId = row.PatientId
  dialog.edit.show = true
}
const deleteLoading = ref(false)
const DeleteOpdTrace = async () => {
  deleteLoading.value = true
  try {
    const res = await deletePatientTrace(editItem.PatientId)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '刪除個案追蹤成功',
        position: 'top',
      })
      dialog.edit.show = false
      GetPatientTrace()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '刪除個案追蹤失敗：' + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  } finally {
    deleteLoading.value = false
  }
}

const init = async () => {
  GetPatientTrace()
}
init()
</script>

