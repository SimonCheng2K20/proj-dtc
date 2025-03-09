<template>
  <div>
    <my-title no-fixed title="藥房庫存查詢"></my-title>
    <div class="p-2">
      <my-search-area gridCols="3" @searchSubmit="searchSubmit" @searchClear="searchClear">
        <my-input-wrapper label="藥房名稱">
          <q-select
            v-bind="QInputProps"
            :options="pharmacyOptions"
            v-model="search.PharmacyId"
            emit-value
            map-options
            option-value="PharmacyId"
            option-label="CName"
            :loading="pharmacyLoading"
            @update:model-value="searchSubmit()"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-italic text-grey"> 無資料 </q-item-section>
              </q-item>
            </template>
          </q-select>
        </my-input-wrapper>
        <my-input-wrapper label="院內代碼">
          <q-input v-bind="QInputProps" v-model="search.MedicineId" @keydown.enter="searchSubmit"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="英文名稱">
          <q-input v-bind="QInputProps" v-model="search['Drug/EName']" @keydown.enter="searchSubmit"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="ATC碼">
          <q-input v-bind="QInputProps" v-model="search['Drug/AtcCode']" @keydown.enter="searchSubmit"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="健保代碼">
          <q-input v-bind="QInputProps" v-model="search['Drug/NhiCode']" @keydown.enter="searchSubmit"></q-input>
        </my-input-wrapper>
        <MedVenderSelection
          labelName="藥商名稱"
          useInput
          v-model:selectedData="venderData"
          @update:selectedData=";(search['Drug/VendorId'] = venderData?.VendorId), searchSubmit()"
        ></MedVenderSelection>
      </my-search-area>

      <q-table
        class="mt-2"
        v-bind="QTableProps"
        :columns="columns"
        :rows="rows"
        :pagination="pagination"
        :loading="loading"
      >
        <template #body-cell-action="{ col, row }">
          <q-td :props="{ col, row }">
            <q-toggle :disable="loading" v-model="row.ApplyFlag" @click="PutStoreStockToApply(row)" />
          </q-td>
        </template>
        <template #bottom>
          <my-pagination class="mx-auto p-4" v-model="pagination" @update:model-value="GetStoreStock"></my-pagination>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import _ from 'lodash'
import dayjs from 'dayjs'

// api
import { getStoreStock, putStoreStockToApply, getDrugStore } from 'api'

// components
import MedVenderSelection from 'src/components/type-selection/MedVenderSelection.vue'

// utils
import numberFormat from 'utils/numberFormat'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { QTableProps, QInputProps, QSelectProps } from 'utils/quasar-extends/base-props.js'

const $q = useQuasar()

const loading = ref(true)

const columns = computed(() => {
  return [
    { name: 'action', label: '提出申請單', align: 'center', field: 'action' },
    { name: 'PharmacyName', label: '藥房名稱', align: 'center', field: 'PharmacyName' },
    { name: 'UpperLimit', label: '庫存上限', align: 'center', field: (row) => row.Drug.UpperLimit },
    { name: 'LowerLimit', label: '庫存下限', align: 'center', field: (row) => row.Drug.LowerLimit },
    { name: 'CName', label: '中文藥名', align: 'center', field: (row) => row.Drug.CName, style: 'width:200px' },
    { name: 'EName', label: '英文藥名', align: 'center', field: (row) => row.Drug.EName, style: 'width:200px' },
    { name: 'AtcCode', label: 'ATC碼', align: 'center', field: (row) => row.Drug.AtcCode },
    { name: 'NewPrice', label: '新核定價', align: 'center', field: (row) => row.Drug.NewPrice },
    { name: 'SelfPay', label: '自費價格', align: 'center', field: (row) => row.Drug.SelfPay },
    {
      name: 'EffectiveDate',
      label: '生效日期',
      align: 'center',
      field: (row) => (row.Drug.EffectiveDate ? dayjs(row.Drug.EffectiveDate).format('YYYY-MM-DD') : ''),
    },
    { name: 'NhiCode', label: '健保代碼', align: 'center', field: (row) => row.Drug.NhiCode },
    { name: 'MedicineId', label: '院內代碼', align: 'center', field: (row) => row.Drug.MedicineId },
    { name: 'StockNow', label: '現有庫存', align: 'center', field: (row) => row.Drug.StockNow },
    { name: 'StorePlaceCode', label: '儲存位置', align: 'center', field: (row) => row.Drug.StorePlaceCode },
    { name: 'VendorName', label: '藥商名稱', align: 'center', field: (row) => row.Drug.VendorName },
    { name: 'CategoryCode', label: '藥品分類', align: 'center', field: (row) => row.Drug.CategoryCode },
    { name: 'ProductPlace', label: '產地', align: 'center', field: (row) => row.Drug.ProductPlace },
  ]
})

const rows = ref([])

const GetStoreStock = async () => {
  try {
    loading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getStoreStock(query)
    if (res.status === 200) {
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

const venderData = ref(null)

const initData = {}
initData.search = {
  PharmacyId: null,
  MedicineId: null,
  'Drug/EName': null,
  'Drug/AtcCode': null,
  'Drug/NhiCode': null,
  'Drug/VendorId': null,
}
const search = reactive(_.cloneDeep(initData.search))

const filter = computed(() => {
  return Object.entries(search)
    .filter(([key, value]) => isValidSearchValue(value))
    .map(([key, value]) => {
      switch (key) {
        case 'PharmacyId':
        case 'Drug/VendorId':
          return setOdataFilter({ key, value, operator: 'eq' })
        case 'MedicineId':
        case 'Drug/EName':
        case 'Drug/AtcCode':
        case 'Drug/NhiCode':
          return setOdataFilter({ key, value, operator: 'contains' })
      }
    })
    .join(' and ')
})

const sortBy = ref([])

const orderBy = computed(() => {
  const orderByArr = []
  sortBy.value.forEach((item) => {
    orderByArr.push(`${item[0]} ${item[1]}`)
  })
  return !!orderByArr.length ? orderByArr.join(',') : ''
})

const searchSubmit = () => {
  pagination.value.page = 1
  GetStoreStock()
}

const searchClear = () => {
  Object.assign(search, _.cloneDeep(initData.search))
  pagination.value.page = 1
  GetStoreStock()
}

// 藥房列表
const pharmacyOptions = ref([])

const pharmacyLoading = ref(false)

const GetDrugStore = async () => {
  try {
    pharmacyLoading.value = true
    const res = await getDrugStore()
    if (res.status === 200) {
      pharmacyOptions.value = res.data.Items
    }
  } catch (err) {
    console.log(err)
  } finally {
    pharmacyLoading.value = false
  }
}

const PutStoreStockToApply = async (row) => {
  try {
    loading.value = true
    const body = {
      PharmacyId: row.PharmacyId,
      MedicineId: row.MedicineId,
      ApplyFlag: row.ApplyFlag,
    }
    const res = await putStoreStockToApply(body)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '設定申請單成功',
        position: 'top',
      })
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '設定申請單失敗：' + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
    GetStoreStock()
  } finally {
    loading.value = false
  }
}

const init = async () => {
  GetStoreStock()
  GetDrugStore()
}
init()
</script>
