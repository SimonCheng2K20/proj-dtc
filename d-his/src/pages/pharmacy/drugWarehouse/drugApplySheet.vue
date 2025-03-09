<template>
  <q-page>
    <my-title no-fixed title="提出申領單"></my-title>
    <div class="p-2">
      <div class="flex no-wrap items-center gap-2 p-4 bg-grey-3 rounded mb-2">
        <my-input-group class="grid gap-2 grid-cols-4" style="width: 100%">
          <my-input-wrapper label="申領藥房">
            <q-select
              v-bind="QSelectProps"
              :options="pharmacyOptions"
              v-model="addData.PharmacyId"
              emit-value
              map-options
              option-value="PharmacyId"
              option-label="CName"
              :loading="pharmacyLoading"
              :rules="rule.PharmacyId"
              :ref="(el) => (inputRefs.PharmacyId = el)"
              lazy-rules
              @update:model-value="(val) => getTableList(val)"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-italic text-grey"> 無資料 </q-item-section>
                </q-item>
              </template>
            </q-select>
          </my-input-wrapper>
          <my-input-wrapper label="申領日期">
            <my-date-input
              v-bind="QInputProps"
              v-model="addData.ApplyDate"
              :rules="rule.ApplyDate"
              :ref="(el) => (inputRefs.ApplyDate = el)"
              :date-options="dateOption"
            >
            </my-date-input>
          </my-input-wrapper>
          <my-input-wrapper label="申領單號">
            <q-input
              v-bind="QInputProps"
              v-model="addData.ApplyId"
              :rules="rule.ApplyId"
              :ref="(el) => (inputRefs.ApplyId = el)"
            ></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="申領人員">
            <q-select
              v-bind="QSelectProps"
              :options="options"
              v-model="addData.PersonId"
              :rules="rule.PersonId"
              :ref="(el) => (inputRefs.PersonId = el)"
              lazy-rules
            ></q-select>
          </my-input-wrapper>
        </my-input-group>
        <div class="flex gap-2 shrink-0 mr-10">
          <q-btn
            class="bg-[#D63F95] text-white"
            unelevated
            label="提出申領單"
            @click="PostStoreStockApplyItem()"
            :loading="subLoading"
          ></q-btn>
        </div>
      </div>

      <q-table
        v-bind="QTableProps"
        class="my-sticky-header-table"
        :rows="rows"
        :columns="columns"
        row-key="MedicineId"
        no-data-label="請選取申領藥房取得資料"
        :loading="tableLoading"
        virtual-scroll
        :rows-per-page-options="[0]"
      >
        <template #body-cell-action="{ row, col }">
          <q-td :props="{ row, col }">
            <q-btn unelevated dense color="delete" label="刪除" @click="deleteRow(row)"> </q-btn>
          </q-td>
        </template>
        <template #body-cell-Index="{ rowIndex, col }">
          <q-td :props="{ rowIndex, col }">
            {{ rowIndex + 1 }}
          </q-td>
        </template>
        <template #body-cell-ApplyAmount="{ row, col }">
          <q-td :props="{ row, col }">
            <q-input v-bind="QInputProps" :rules="rule.ApplyAmount" lazy-rules v-model="row.ApplyAmount"> </q-input>
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { cloneDeep } from 'lodash-es'
import dayjs from 'dayjs'
import { useQuasar } from 'quasar'

// api
import { postStoreStockApplyItem, getDrugStore, getNewApplyId, getStoreStockDetail } from 'api'

// utils
import setSearchQuery from 'utils/setSearchQuery'
import { QSelectProps, QInputProps, QTableProps } from 'utils/quasar-extends/base-props'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import setOdataFilter from 'utils/setOdataFilter'

const $q = useQuasar()

const qDateProxy = ref()

const dateOption = (date) => {
  return date >= dayjs(new Date()).format('YYYY/MM/DD')
}

const options = ['datacom']

const columns = reactive([
  {
    name: 'action',
    label: '操作',
    align: 'center',
    field: 'action',
    style: 'width:100px;',
  },
  { name: 'Index', label: '序號', align: 'center', field: 'Sn' },
  { name: 'NhiCode', label: '健保代碼', align: 'right', field: 'NhiCode' },
  { name: 'MedicineId', label: '院內代碼', align: 'right', field: 'MedicineId' },
  {
    name: 'CName',
    label: '中文藥名',
    align: 'left',
    field: 'CName',
    style: 'white-space:pre-wrap',
  },
  {
    name: 'EName',
    label: '英文藥名',
    align: 'left',
    field: 'EName',
    style: 'white-space:pre-wrap',
  },
  { name: 'VendorName', label: '藥商名稱', align: 'left', field: 'VendorName' },
  { name: 'StockNow', label: '現有存量', align: 'right', field: 'StockNow' },
  { name: 'ApplyAmount', label: '申領數量', align: 'right', field: 'ApplyAmount' },
])

const rows = ref([])

const deleteRow = (row) => {
  rows.value = rows.value.filter((item) => {
    return item !== row
  })
}

const initData = {
  ApplyId: null,
  PharmacyId: null,
  ApplyDate: dayjs(new Date()).format(),
  PersonId: null,
}

const addData = reactive(cloneDeep(initData))

const applyData = computed(() => {
  let arr = rows.value
    .filter((item) => {
      return item.ApplyAmount > 0
    })
    .map((item) => {
      return {
        ApplyId: addData.ApplyId,
        MedicineId: item.MedicineId,
        ApplyAmount: item.ApplyAmount,
      }
    })

  return arr
})

// 提出申領單
const subLoading = ref(false)

const checkApplyData = () => {
  if (applyData.value.length > 0) {
    return true
  } else {
    $q.notify({
      type: 'negative',
      message: '並未下申領數量',
      position: 'top',
    })
    return false
  }
}

const PostStoreStockApplyItem = async () => {
  if (validate() === true && checkApplyData() === true && confirm('確認要送出此筆申領單嗎?')) {
    try {
      subLoading.value = true
      const body = {
        ...addData,
        Status: 0,
        StoreStockApplyDetails: applyData.value,
      }
      const res = await postStoreStockApplyItem(body)
      if (res.status === 200 || res.status === 204) {
        $q.notify({
          type: 'positive',
          message: '新增藥品申領單成功',
          position: 'top',
        })
        clearData()
      }
    } catch (err) {
      console.log(err)
      $q.notify({
        type: 'negative',
        message: '新增藥品申領單失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
        position: 'top',
      })
    } finally {
      subLoading.value = false
    }
  }
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

// 請購單號
const GetNewApplyId = async () => {
  try {
    const res = await getNewApplyId()
    if (res.status === 200) {
      addData.ApplyId = res.data
    }
  } catch (err) {
    console.log(err)
  }
}

// 表格資料
const tableLoading = ref(false)

const GetStoreStockDetail = async (id) => {
  try {
    tableLoading.value = true
    const res = await getStoreStockDetail(id)
    if (res.status === 200) {
      rows.value = res.data.StoreStockApplyDetails
    }
  } catch (err) {
    console.log(err)
  } finally {
    tableLoading.value = false
  }
}

const getTableList = async (val) => {
  if (!!val) {
    GetStoreStockDetail(val)
  } else {
    pharmacyOptions.value = []
  }
}

// 表單驗證
const inputRefs = ref({})

const reg = /^[0-9]*$/

const rule = {
  PharmacyId: [(val) => (val !== null && val !== '') || '請選取藥房'],
  ApplyDate: [(val) => (val !== null && val !== '') || '請輸入日期'],
  ApplyId: [(val) => (val !== null && val !== '') || '請輸入申領單號'],
  PersonId: [(val) => (val !== null && val !== '') || '請選取申領人員'],
  ApplyAmount: [(val) => reg.test(val) || val === null || '請輸入整數數量'],
}

const validate = () => {
  let errorInputRef = null

  const validationArr = Object.values(inputRefs.value).map((inputRef) => {
    if (!!inputRef) {
      const validatedResult = inputRef.validate()
      if (errorInputRef === null && validatedResult === false) errorInputRef = inputRef
      return validatedResult
    } else {
      return null
    }
  })

  if (validationArr.includes(false) === false) return true
  else {
    errorInputRef.focus()
    return false
  }
}

// 清除資料
const clearData = () => {
  Object.assign(addData, cloneDeep(initData))
  rows.value = []
  GetNewApplyId()
}

const init = () => {
  GetDrugStore()
  GetNewApplyId()
}

init()
</script>

<style lang="scss">
.my-sticky-header-table {
  max-height: 600px;

  thead tr th {
    position: sticky;
    z-index: 1;
    top: 0;
  }
}
</style>
