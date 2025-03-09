<template>
  <q-page>
    <my-title title="ICD-10-CM 查詢" no-fixed></my-title>

    <div class="px-2">
      <my-search-area class="mt-2" grid-cols="3" v-on:search-submit="searchSubmit" v-on:search-clear="searchClear">
        <my-input-wrapper label="章節">
          <q-select
            v-bind="QSelectProps"
            v-model="search.Icd10CmChap"
            :options="icd10ChapItems"
            option-label="No"
            @update:model-value="onIcd10CmChapSelect"
          >
            <template #option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>
                    <div>{{ `${scope.opt.No} - ${scope.opt.CName} - ${scope.opt.EName}` }}</div>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </my-input-wrapper>
        <my-input-wrapper label="章節中文名稱">
          <q-input v-bind="QInputProps" :model-value="search.CName" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="章節英文名稱">
          <q-input v-bind="QInputProps" :model-value="search.EName" readonly></q-input>
        </my-input-wrapper>

        <my-input-wrapper label="ICD-10 碼">
          <q-input v-bind="QInputProps" v-model="search.Icd10" @keydown.enter="searchSubmit"></q-input
        ></my-input-wrapper>
        <my-input-wrapper label="特定治療代碼">
          <q-input v-bind="QInputProps" v-model="search.Icd10CmChronic" @keydown.enter="searchSubmit"></q-input
        ></my-input-wrapper>
      </my-search-area>
      <q-table
        class="mt-2"
        v-bind="QTableProps"
        :rows="rows"
        :columns="columns"
        row-key="Icd10"
        :pagination="pagination"
        :loading="tableLoading"
      >
        <template #body-cell-action="{ col, row }">
          <q-td :props="{ col }">
            <q-btn label="編輯" dense unelevated color="primary" @click="toEdit(row)"></q-btn>
          </q-td>
        </template>
        <template v-slot:bottom>
          <my-pagination class="mx-auto p-4" v-model="pagination" v-on:update:model-value="GetIcd10Cm"></my-pagination>
        </template>
      </q-table>
    </div>
  </q-page>
</template>
<script setup>
import { getIcd10Cm, putIcd10Cm, getIcd10cmChap } from 'api'
import { ref, reactive, computed } from 'vue'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { cloneDeep } from 'lodash-es'
import { useQuasar } from 'quasar'
import { QInputProps, QSelectProps, QTableProps } from 'utils/quasar-extends/base-props.js'

import Icd10SearchChronicEditDialog from './components/Icd10SearchChronicEditDialog.vue'

const $q = useQuasar()

const columns = [
  { name: 'action', label: '操作', field: 'action', align: 'center' },
  { name: 'Icd10', label: 'ICD-10 碼', field: 'Icd10', align: 'left' },
  { name: 'Icd10Cht', label: 'ICD-10 中文名稱', field: 'Icd10Cht', align: 'left' },
  { name: 'Icd10Eng', label: 'ICD-10 英文名稱', field: 'Icd10Eng', align: 'left' },
  { name: 'Icd10CmChronic', label: '特定治療代碼', field: 'Icd10CmChronic', align: 'left' },
]

const tableLoading = ref(false)
const rows = ref([])
const GetIcd10Cm = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getIcd10Cm(query)
    rows.value = res.data.Items
    pagination.value.rowsNumber = res.data.Count
  } catch (error) {
    console.log(error)
  } finally {
    tableLoading.value = false
  }
}

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

const initData = {}
initData.search = {
  Icd10CmChap: null,
  CName: null,
  EName: null,
  Icd10: null,
  Icd10CmChronic: null,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  return Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'Icd10CmChap':
            return filterArray.concat(setOdataFilter({ key, value, operator: 'eq' }))
          case 'Icd10':
            return filterArray.concat(setOdataFilter({ key, value, operator: 'contains' }))
          case 'Icd10CmChronic':
            return filterArray.concat(setOdataFilter({ key, value, operator: 'contains' }))
          default:
            return filterArray
        }
      } else {
        return filterArray
      }
    }, [])
    .join(' and ')
})

const sortBy = ref([])
const orderBy = computed(() => {
  return sortBy.value.map((item) => item.join(' ')).join(',')
})

const searchSubmit = () => {
  pagination.value.page = 1
  GetIcd10Cm()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetIcd10Cm()
}

const onIcd10CmChapSelect = (val) => {
  if (val) {
    search.Icd10CmChap = val.No
    search.CName = val.CName
    search.EName = val.EName
  } else {
    search.Icd10CmChap = null
    search.CName = null
    search.EName = null
  }

  GetIcd10Cm()
}

const icd10ChapItems = ref([])
const GetIcd10cmChap = async () => {
  try {
    const res = await getIcd10cmChap()
    icd10ChapItems.value = res.data
  } catch (error) {
    console.log(error)
  }
}
// 編修特定治療代碼 彈窗
const toEdit = (row) => {
  const dialog = $q
    .dialog({
      component: Icd10SearchChronicEditDialog,
      componentProps: {
        row: row,
      },
    })
    .onOk(async (editItem) => {
      dialog.hide()
      await PutIcd10Cm(editItem)
      GetIcd10Cm()
    })
}
//編修特定治療代碼
const PutIcd10Cm = async (editItem) => {
  try {
    tableLoading.value = true
    const body = cloneDeep(editItem)
    const res = await putIcd10Cm(body)
    if (res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '編修ICD-10成功!',
        position: 'top',
      })
    }
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '編修ICD-10失敗!',
      position: 'top',
    })
  } finally {
    tableLoading.value = false
  }
}

const init = async () => {
  GetIcd10Cm()
  GetIcd10cmChap()
}
init()
</script>

