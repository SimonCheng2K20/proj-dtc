<template>
  <q-page>
    <my-title no-fixed title="提出採購單"></my-title>
    <div class="p-2">
      <div class="flex no-wrap items-center gap-2 p-4 bg-grey-3 rounded mb-2">
        <my-input-group class="grid gap-2 grid-cols-3" style="width: 100%">
          <my-input-wrapper label="採購日期">
            <my-date-input
              v-bind="QInputProps"
              v-model="purchaseData.PurchaseDatetime"
              mask="date"
              :rules="rule.Datetime"
              :ref="(el) => (inputRefs.Datetime = el)"
              :date-options="dateOption"
            >
            </my-date-input>
          </my-input-wrapper>
          <my-input-wrapper label="採購單號">
            <q-input v-bind="QInputProps" v-model="purchaseData.PurchaseId" :rules="rule.PurchaseId"></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="採購人員">
            <q-select
              v-bind="QSelectProps"
              :options="options"
              v-model="purchaseData.BuyerId"
              :rules="rule.BuyerId"
              :ref="(el) => (inputRefs.BuyerId = el)"
            ></q-select>
          </my-input-wrapper>
        </my-input-group>
        <div class="flex gap-2 shrink-0 mr-10">
          <q-btn
            class="bg-[#D63F95] text-white"
            unelevated
            label="提出採購單"
            @click="PostOrder()"
            :loading="subLoading"
          ></q-btn>
        </div>
      </div>

      <q-table
        v-bind="QTableProps"
        :rows="rows"
        :columns="columns"
        row-key="Sn"
        :loading="tableLoading"
        virtual-scroll
        :rows-per-page-options="[0]"
        hide-pagination
      >
        <template #body-cell-BuyQuantity="{ row, col }">
          <q-td class="w-2/12" :props="{ row, col }">
            <q-input
              v-bind="QInputProps"
              input-class="text-right"
              v-model="orderdatas[row.MedicineId].BuyQuantity"
              :rules="rule.BuyQuantity"
              lazy-rules
            >
            </q-input>
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed, onMounted, nextTick } from 'vue'
import { cloneDeep } from 'lodash-es'
import dayjs from 'dayjs'

// api
import { postOrder, getPurchaseItem, GetNewPurchaseId } from 'api'

// utils
import setSearchQuery from 'utils/setSearchQuery'
import { QSelectProps, QInputProps, QTableProps } from 'utils/quasar-extends/base-props'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import setOdataFilter from 'utils/setOdataFilter'
import router from '../../../router'

const qDateProxy = ref()

const columns = computed(() => {
  return [
    { name: 'Sn', label: '序號', align: 'right', field: 'Sn' },
    { name: 'NhiCode', label: '健保代碼', align: 'left', field: 'NhiCode' },
    {
      name: 'MedicineId',
      label: '院內代碼',
      align: 'left',
      field: 'MedicineId',
    },
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
    {
      name: 'VendorName',
      label: '藥商名稱',
      align: 'left',
      field: 'VendorName',
    },
    { name: 'StockNow', label: '現有存量', align: 'right', field: 'StockNow' },
    {
      name: 'BuyQuantity',
      label: '採購數量',
      align: 'right',
      field: 'BuyQuantity',
    },
  ]
})

const rows = ref([])

const options = ['datacom', '王採購']

// 表格請求Function
const tableLoading = ref(false)

const GetPurchaseItem = async () => {
  try {
    tableLoading.value = true
    const res = await getPurchaseItem()
    if (res.status === 200) {
      rows.value = res.data.OrderItems
      orderDatasInit()
    }
  } catch (err) {
    console.log(err)
  } finally {
    tableLoading.value = false
  }
}

// 採購單號請求
const getNewPurchaseId = async () => {
  try {
    const res = await GetNewPurchaseId()
    if (res.status === 200) {
      purchaseData.PurchaseId = res.data
    }
  } catch (err) {
    console.log(err)
  }
}

// 新增採購單
const initData = {
  PurchaseDatetime: dayjs(new Date()).format('YYYY/MM/DD'),
  BuyerId: null,
  PurchaseId: null,
}

const purchaseData = reactive(cloneDeep(initData))

// q-date 日期設置
const dateOption = (date) => {
  return date >= dayjs(new Date()).format('YYYY/MM/DD')
}

const orderdatas = ref({})

const orderDatasInit = () => {
  orderdatas.value = {}
  for (let i = 0; i < rows.value.length; i++) {
    let row = rows.value[i]
    orderdatas.value[row.MedicineId] = { ...row }
    orderdatas.value[row.MedicineId].PurchaseId = purchaseData.PurchaseId
    delete orderdatas.value[row.MedicineId].Sn
  }
}

// 將orderdatas轉為array
const orderItems = computed(() => {
  const arr = Object.values(orderdatas.value).filter((item) => {
    if (item.BuyQuantity > 0) {
      return true
    } else {
      return false
    }
  })

  return arr
})

const subLoading = ref(false)

// postOrder請求Function
const PostOrder = async () => {
  if (validate() === true && checkOrderItems() === true && confirm('確認提交此筆採購單?')) {
    subLoading.value = true
    try {
      const body = {
        PurchaseId: purchaseData.PurchaseId,
        PurchaseDatetime: dayjs(purchaseData.PurchaseDatetime).format(),
        BuyerId: purchaseData.BuyerId,
        OrderStatus: 0,
        OrderItems: orderItems.value,
      }

      const res = await postOrder(body)
      if (res.status === 200) {
        $q.notify({
          type: 'positive',
          message: '新增藥品採購單成功',
          position: 'top',
        })
        init()
      }
    } catch (err) {
      console.log(err)
      $q.notify({
        type: 'negative',
        message: '新增藥品採購單失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
        position: 'top',
      })
    } finally {
      subLoading.value = false
    }
  }
}

// 表單驗證
const inputRefs = reactive({})

const reg = /^\d*$/

const rule = {
  Datetime: [(val) => (val !== null && val !== '') || '請輸入正確日期'],
  BuyerId: [(val) => (val !== null && val !== '') || '請選擇採購人員'],
  PurchaseId: [(val) => (val !== null && val !== '') || '請輸入採購單號'],
  BuyQuantity: [(val) => reg.test(val) || val === null || '請輸入整數'],
}

const validate = () => {
  let errorInputRef = null

  const validationArr = Object.entries(inputRefs).map(([key, inputRef]) => {
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

// 訂單數量確認
const checkOrderItems = () => {
  if (orderItems.value.length > 0) {
    return true
  } else {
    $q.notify({
      type: 'negative',
      message: '並未下採購數量!',
      position: 'top',
    })
    return false
  }
}

// 初次執行
const init = () => {
  GetPurchaseItem()
  getNewPurchaseId()
}

init()
</script>

