<template>
  <q-page>
    <my-title no-fixed title="庫存查詢作業"></my-title>
    <div class="p-2">
      <my-search-area grid-cols="4" @searchSubmit="searchSubmit" @searchClear="searchClear">
        <my-input-wrapper label="院內代碼"
          ><q-input v-bind="QInputProps" v-model="search.MedicineId" @keydown.enter="searchSubmit"></q-input
        ></my-input-wrapper>
        <my-input-wrapper label="藥品學名">
          <q-input v-bind="QInputProps" v-model="search.ScientificName" @keydown.enter="searchSubmit"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="ACT碼"
          ><q-input v-bind="QInputProps" v-model="search.AtcCode" @keydown.enter="searchSubmit"></q-input
        ></my-input-wrapper>
        <my-input-wrapper label="健保代碼"
          ><q-input v-bind="QInputProps" v-model="search.NhiCode" @keydown.enter="searchSubmit"></q-input
        ></my-input-wrapper>
        <my-input-wrapper label="藥商名稱">
          <q-input v-bind="QInputProps" v-model="search.VendorId" @keydown.enter="searchSubmit"></q-input
        ></my-input-wrapper>
      </my-search-area>

      <q-table
        ref="tableRef"
        v-bind="QTableProps"
        :rows="rows"
        :columns="columns"
        row-key="MedicineId"
        :pagination="pagination"
        :loading="tableLoading"
        v-touch-pan.prevent.mouse="dragScrollHandler"
        class="mt-2"
      >
        <template v-slot:body-cell-action="{ col, row }">
          <q-td :props="{ col }">
            <q-toggle
              v-model="row.AutoBuyFlag"
              :disable="tableLoading"
              @update:model-value="PutAutoBuyApply(row)"
            ></q-toggle>
          </q-td>
        </template>
        <template v-slot:body-cell-StorePlaceCode="{ col, row, rowIndex, value }">
          <q-td :props="{ col }">
            <div>
              {{ value }}
              <q-btn icon="edit" round unelevated dense :loading="editLoading">
                <q-popup-edit v-model="row.StorePlaceCode" v-slot="scope">
                  <q-input
                    v-bind="QInputProps"
                    v-model="scope.value"
                    autofocus
                    @keyup.enter="onStorePlaceCodeSave(row, rowIndex, scope)"
                  ></q-input>
                  <div class="mt-2 flex justify-center gap-2">
                    <q-btn label="取消" unelevated dense color="grey" @click="scope.cancel"></q-btn>
                    <q-btn
                      label="儲存"
                      unelevated
                      dense
                      color="primary"
                      @click="onStorePlaceCodeSave(row, rowIndex, scope)"
                    ></q-btn>
                  </div>
                </q-popup-edit>
              </q-btn>
            </div>
          </q-td>
        </template>
        <template v-slot:bottom>
          <my-pagination class="mx-auto p-4" v-model="pagination" v-on:update:model-value="GetDrug"></my-pagination>
        </template>
      </q-table>
    </div>
  </q-page>
</template>
<script setup>
import { ref, reactive, computed, watch } from 'vue'
import { cloneDeep } from 'lodash-es'
import { useQuasar } from 'quasar'

// api
import { getDrug, putDrugStorePlace, putAutoBuy } from 'api'

// utils
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { QInputProps, QTableProps } from 'utils/quasar-extends/base-props.js'

const $q = useQuasar()

const columns = reactive([
  { name: 'action', label: '採購單', field: 'action', align: 'left' },
  { name: 'UpperLimit', label: '庫存上限', field: 'UpperLimit', align: 'right' },
  { name: 'LowerLimit', label: '庫存下限', field: 'LowerLimit', align: 'right' },
  { name: 'CName', label: '中文藥名', field: 'CName', align: 'left' },
  { name: 'EName', label: '英文藥名', field: 'EName', align: 'left' },
  { name: 'ScientificName', label: '藥品學名', field: 'ScientificName', align: 'left' },
  { name: 'AtcCode', label: 'ACT碼', field: 'AtcCode', align: 'left' },
  { name: 'NewPrice', label: '新核定價', field: 'NewPrice', align: 'right' },
  { name: 'SelfPay', label: '自費價格', field: 'SelfPay', align: 'right' },
  {
    name: 'EffectiveDate',
    label: '生效日期',
    field: (row) => row.EffectiveDate?.substring(0, 10),
    align: 'left',
  },
  { name: 'NhiCode', label: '健保代碼', field: 'NhiCode', align: 'left' },
  { name: 'MedicineId', label: '院內代碼', field: 'MedicineId', align: 'left' },
  { name: 'StockNow', label: '現有庫存', field: 'StockNow', align: 'left' },
  { name: 'StorePlaceCode', label: '儲存位置', field: 'StorePlaceCode', align: 'left' },
  { name: 'VendorId', label: '藥商名稱', field: 'VendorId', align: 'left' },
  { name: 'CategoryCode', label: '藥品分類', field: 'CategoryCode', align: 'left' },
  { name: 'ProductPlace', label: '產地', field: 'ProductPlace', align: 'left' },
])

const tableLoading = ref(false)
const rows = ref([])
const GetDrug = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getDrug(query)
    if (res.status === 200) {
      rows.value = res.data.Items
      pagination.value.rowsNumber = res.data.Count
    }
  } catch (err) {
    console.log(err)
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
  MedicineId: null,
  ScientificName: null,
  AtcCode: null,
  NhiCode: null,
  VendorId: null,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  return Object.entries(search)
    .filter(([key, value]) => isValidSearchValue(value))
    .map(([key, value]) => {
      switch (key) {
        case 'MedicineId':
        case 'ScientificName':
        case 'AtcCode':
        case 'NhiCode':
        case 'VendorId':
          return setOdataFilter({ key, value, operator: 'contains' })
      }
    })
    .join(' and ')
})

const sortBy = ref([])
const orderBy = computed(() => {
  return sortBy.value.map((item) => item.join(' ')).join(',')
})

const searchSubmit = () => {
  pagination.value.page = 1
  GetDrug()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetDrug()
}

const toAdd = () => {
  const dialog = $q
    .dialog({
      component: EditItem,
      componentProps: {
        editType: 'add',
      },
    })
    .onOk(() => {
      dialog.hide()
      pagination.value.page = 1
      GetDrug()
    })
}

const toEdit = (row) => {
  const dialog = $q
    .dialog({
      component: EditItem,
      componentProps: {
        editType: 'edit',
        id: row.Id,
      },
    })
    .onOk(() => {
      dialog.hide()
      GetDrug()
    })
}

const toDelete = (row) => {
  const dialog = $q
    .dialog({
      component: EditItem,
      componentProps: {
        editType: 'delete',
        id: row.Id,
      },
    })
    .onOk(() => {
      dialog.hide()
      const prePage = pagination.value.page - 1
      if (prePage > 0) {
        if (pagination.value.rowsNumber - 1 <= prePage * pagination.value.rowsPerPage) pagination.value.page = prePage
      }
      GetDrug()
    })
}

const editLoading = reactive({})
const PutDrugStorePlace = async (editItem, index) => {
  try {
    editLoading[index] = true
    const res = await putDrugStorePlace(editItem)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '變更儲存位置成功',
        position: 'top',
      })
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '變更儲存位置失敗：' + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  } finally {
    editLoading[index] = false
  }
}

const onStorePlaceCodeSave = async (row, rowIndex, scope) => {
  await PutDrugStorePlace({ MedicineId: row.MedicineId, StorePlaceCode: scope.value }, rowIndex)
  scope.set()
}

const PutAutoBuyApply = async (item) => {
  try {
    tableLoading.value = true
    const res = await putAutoBuy({
      MedicineId: item.MedicineId,
      AutoBuyFlag: item.AutoBuyFlag,
    })

    if (res.status === 200 || res.status === 204) {
      if (item.AutoBuyFlag === true) {
        $q.notify({
          type: 'positive',
          message: '設定自動換轉採購單成功',
          position: 'top',
        })
      } else {
        $q.notify({
          type: 'info',
          message: '取消自動換轉採購單',
          position: 'top',
        })
      }
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',

      message: '自動轉採購單失敗：' + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
    GetDrug()
  } finally {
    tableLoading.value = false
  }
}

const tableRef = ref()
const tableMiddleRef = ref()
const unwatch = watch(tableRef, (val) => {
  tableMiddleRef.value = val.$el.querySelector('.q-table__middle')
  unwatch()
})

const dragScrollHandler = (evt) => {
  tableMiddleRef.value.scrollLeft -= evt.delta.x
}

const init = async () => {
  GetDrug()
}
init()
</script>
