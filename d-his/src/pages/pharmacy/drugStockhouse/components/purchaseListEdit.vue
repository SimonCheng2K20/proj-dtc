<template>
  <q-dialog ref="dialogRef" full-width full-height no-backdrop-dismiss>
    <my-dialog-content :header="title" width="90vw" @close="onDialogCancel" :loading="getDataLoading">
      <div class="pb-2">
        <my-input-group ref="searchWrapper" class="grid gap-2 p-2" :class="[`grid-cols-${gridCols}`]">
          <my-input-wrapper label="採購日期">
            <my-date-input
              v-bind="QInputProps"
              :readonly="editType !== 'add'"
              :bg-color="editType !== 'add' ? 'blue-grey-1' : null"
              :rules="rule.Datetime"
              v-model="purchaseData.PurchaseDatetime"
              :ref="(el) => (inputRefs.PurchaseDatetime = el)"
              :date-options="dateOption"
            >
            </my-date-input>
          </my-input-wrapper>

          <my-input-wrapper label="採購單號">
            <q-input
              :readonly="editType !== 'add'"
              :bg-color="editType !== 'add' ? 'blue-grey-1' : null"
              v-bind="QInputProps"
              v-model="purchaseData.PurchaseId"
              :loading="PurchaseIdLoading"
              :rules="rule.PurchaseId"
              :ref="(el) => (inputRefs.PurchaseId = el)"
            >
            </q-input>
          </my-input-wrapper>

          <my-input-wrapper label="採購人員">
            <q-select
              :readonly="editType !== 'add'"
              :bg-color="editType !== 'add' ? 'blue-grey-1' : null"
              v-bind="QSelectProps"
              :options="option"
              :rules="rule.BuyerId"
              v-model="purchaseData.BuyerId"
              :ref="(el) => (inputRefs.BuyerId = el)"
            >
            </q-select>
          </my-input-wrapper>

          <template v-if="editType === 'inStock'">
            <my-input-wrapper label="入庫人員">
              <q-select
                v-bind="QSelectProps"
                :options="option"
                v-model="purchaseData.InStockId"
                :ref="(el) => (inputRefs.InStockId = el)"
                :rules="rule.BuyerId"
              >
              </q-select>
            </my-input-wrapper>
          </template>

          <template v-if="editType === 'view' && row.OrderStatus === -1">
            <my-input-wrapper label="刪除時間">
              <q-input
                bg-color="blue-grey-1"
                readonly
                v-bind="QInputProps"
                mask="date"
                :model-value="row.DeleteDatetime"
              >
                <template v-slot:append>
                  <q-icon name="today"></q-icon>
                </template>
              </q-input>
            </my-input-wrapper>
            <my-input-wrapper label="刪除採購人員">
              <q-input
                bg-color="blue-grey-1"
                readonly
                v-bind="QInputProps"
                :model-value="row.DeleteBuyerName"
              ></q-input>
            </my-input-wrapper>
          </template>
          <template v-if="editType === 'view' && row.OrderStatus === 1">
            <my-input-wrapper label="訂單完成時間">
              <q-input
                bg-color="blue-grey-1"
                readonly
                v-bind="QInputProps"
                mask="date"
                :model-value="row.InStockDatetime"
              >
                <template v-slot:append>
                  <q-icon name="today"></q-icon>
                </template>
              </q-input>
            </my-input-wrapper>
            <my-input-wrapper label="訂單狀態">
              <q-input
                bg-color="blue-grey-1"
                readonly
                v-bind="QInputProps"
                :model-value="row.OrderStatusName"
              ></q-input>
            </my-input-wrapper>
          </template>
        </my-input-group>

        <div v-if="editType === 'add' || editType === 'details'" class="px-2 flex justify-end">
          <q-btn padding="4px 8px" unelevated color="secondary" icon="add" label="新增" @click="addRow()"></q-btn>
        </div>
      </div>

      <q-table
        v-bind="QTableProps"
        style="max-height: 600px"
        :columns="columns"
        :rows="rows"
        :rows-per-page-options="[0]"
      >
        <template #header-cell-ReceiveFlag="{ col }">
          <q-th :props="{ col }">
            <q-btn unelevated dense color="pink-4" label="全數入庫" @click="PutAllStock()"> </q-btn>
          </q-th>
        </template>
        <template v-if="editType === 'add' || editType === 'details'" #body-cell-action="{ row, col }">
          <q-td :props="{ row, col }">
            <q-btn class="text-black" unelevated dense color="warning" @click="removeRow(row)">
              <template #default>
                <q-icon name="remove" size="xs"></q-icon>
                <span>刪除</span>
              </template>
            </q-btn>
          </q-td>
        </template>
        <template #body-cell-Index="{ rowIndex, col }">
          <q-td :props="{ rowIndex, col }">
            {{ rowIndex + 1 }}
          </q-td>
        </template>
        <template v-if="editType === 'add' || editType === 'details'" #body-cell-NhiCode="{ col, row, rowIndex }">
          <q-td :props="{ col, row, rowIndex }">
            <q-select
              v-bind="QSelectProps"
              v-model="row.NhiCode"
              :options="drugOpiton"
              use-input
              hide-dropdown-icon
              :loading="codeLoading"
              :ref="
                (el) => {
                  inputRefs[`NhiCode${rowIndex}`] = el
                }
              "
              :rules="rule.NhiCode"
              lazy-rules
              @filter="(val, update) => filterFn(val, update, 'NhiCode')"
              @update:model-value="(val) => rowUpdate(val, row)"
              @virtual-scroll="(details) => scrollLoad(details, 'NhiCode')"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-italic text-grey"> 無資料 </q-item-section>
                </q-item>
              </template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.NhiCode }} - {{ scope.opt.CName }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-td>
        </template>
        <template v-if="editType === 'add' || editType === 'details'" #body-cell-MedicineId="{ col, row, rowIndex }">
          <q-td :props="{ col, row, rowIndex }">
            <q-select
              v-bind="QSelectProps"
              v-model="row.MedicineId"
              :options="drugOpiton"
              use-input
              hide-dropdown-icon
              :loading="codeLoading"
              :ref="
                (el) => {
                  inputRefs[`MedicineId${rowIndex}`] = el
                }
              "
              :rules="rule.MedicineId"
              lazy-rules
              options-selected-class="h-96"
              @filter="(val, update) => filterFn(val, update, 'MedicineId')"
              @update:model-value="(val) => rowUpdate(val, row)"
              @virtual-scroll="(details) => scrollLoad(details, 'MedicineId')"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-italic text-grey"> 無資料 </q-item-section>
                </q-item>
              </template>
              <template v-slot:option="scope">
                <q-item v-bind="scope.itemProps">
                  <q-item-section>
                    <q-item-label>{{ scope.opt.MedicineId }} - {{ scope.opt.CName }}</q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-td>
        </template>
        <template v-if="editType === 'add' || editType === 'details'" #body-cell-BuyQuantity="{ col, row, rowIndex }">
          <q-td :props="{ col, row, rowIndex }">
            <q-input
              v-bind="QInputProps"
              input-class="text-center"
              :rules="rule.BuyQuantity"
              lazy-rules
              v-model="row.BuyQuantity"
              :ref="
                (el) => {
                  inputRefs[`BuyQuantity${rowIndex}`] = el
                }
              "
            >
            </q-input>
          </q-td>
        </template>
        <template v-if="editType === 'inStock'" #body-cell-ReceiveFlag="{ col, row, rowIndex }">
          <q-td v-if="row.ReceiveFlag" :props="{ col, row, rowIndex }">
            <q-btn unelevated dense color="pink-4" label="入庫" @click="cloneBuyQuantity(row)">
              <q-popup-edit
                v-model="inStockQuantity"
                max-width="230px"
                class="flex justify-end"
                :cover="false"
                self="bottom middle"
                :ref="(el) => (row.editRef = el)"
              >
                <template v-slot:default>
                  <q-input
                    type="text"
                    v-model="inStockQuantity"
                    v-bind="QInputProps"
                    :rules="[
                      (val) =>
                        (0 < val && val <= row.BuyQuantity - (row.InStockQuantity ? row.InStockQuantity : 0)) ||
                        `請輸入:1 ~ ${row.BuyQuantity - (row.InStockQuantity ? row.InStockQuantity : 0)}`,
                    ]"
                    :ref="
                      (el) => {
                        inputRefs[`inStockQuantity${rowIndex}`] = el
                      }
                    "
                  >
                    <template v-slot:before>
                      <span class="text-black text-base">入庫數量:</span>
                    </template>
                  </q-input>
                  <div class="mt-1.5">
                    <q-btn
                      class="bg-[#B8B8B8]"
                      padding="2px 8px"
                      unelevated
                      label="取消"
                      @click="row.editRef.cancel()"
                    ></q-btn>
                    <q-btn
                      class="ml-2 bg-[#005CD5] text-white"
                      padding="2px 8px"
                      unelevated
                      label="儲存"
                      :loading="codeLoading"
                      @click="PutSetInStock(row)"
                    >
                    </q-btn>
                  </div>
                </template>
              </q-popup-edit>
            </q-btn>
          </q-td>
          <q-td v-if="!row.ReceiveFlag">
            <div class="flex justify-center">
              <span>入庫</span>
            </div>
          </q-td>
        </template>
      </q-table>

      <template #actions>
        <div class="px-2">
          <q-btn
            class="mr-1.5"
            padding="4px 8px"
            unelevated
            color="clear"
            :label="btnLabel[0].lable"
            @click="onDialogCancel"
          ></q-btn>
          <q-btn
            padding="4px 8px"
            unelevated
            v-show="btnLabel[1].show"
            :label="btnLabel[1].lable"
            :class="btnLabel[1].class"
            :disable="getDataLoading"
            :loading="subLoading"
            @click="makeRequest()"
          >
          </q-btn>
        </div>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { computed, ref, reactive, toRaw } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { cloneDeep } from 'lodash-es'
import dayjs from 'dayjs'

// api
import { GetNewPurchaseId, getDrug, postOrder, deleteOrder, putOrder, putAllStock, putSetInStock, getOrder } from 'api'

// utils
import { QSelectProps, QInputProps, QTableProps } from 'utils/quasar-extends/base-props'
import setSearchQuery from 'utils/setSearchQuery'

const $q = useQuasar()

const qDateProxy = ref()

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const editRef = ref()

const props = defineProps({
  editType: String,
  gridCols: {
    type: [Number, String],
    default: 1,
  },
  row: {
    type: Object,
    default: () => ({}),
  },
})

const title = computed(() => {
  switch (props.editType) {
    case 'add':
      return '新增採購單'
    case 'delete':
      return '刪除採購單'
    case 'inStock':
      return '採購單入庫'
    case 'view':
      return '檢視採購單'
    case 'details':
      return '採購單明細'
    default:
      return ''
  }
})

const option = ['datacom', '王採購']

// 表格
const columns = computed(() => {
  switch (props.editType) {
    case 'add':
    case 'delete':
    case 'details':
      return [
        totalCols.action,
        totalCols.Index,
        totalCols.NhiCode,
        totalCols.MedicineId,
        totalCols.CName,
        totalCols.EName,
        totalCols.VendorName,
        totalCols.StockNow,
        totalCols.BuyQuantity,
      ]
    case 'inStock':
      return [
        totalCols.Index,
        totalCols.NhiCode,
        totalCols.MedicineId,
        totalCols.CName,
        totalCols.EName,
        totalCols.VendorName,
        totalCols.BuyQuantity,
        totalCols.InStockQuantity,
        totalCols.InStockDate,
        totalCols.ReceiveFlag,
        totalCols.InStockId,
      ]
    case 'view':
      return [
        totalCols.Index,
        totalCols.NhiCode,
        totalCols.MedicineId,
        totalCols.CName,
        totalCols.EName,
        totalCols.VendorName,
        totalCols.StockNow,
        totalCols.BuyQuantity,
      ]
    default:
      return []
  }
})

const totalCols = reactive({
  action: {
    name: 'action',
    label: '操作',
    align: 'center',
    field: 'action',
    headerClasses: 'sticky top-0 z-10',
    style: 'width:120px',
  },
  Index: {
    name: 'Index',
    label: '序號',
    align: 'center',
    field: 'Index',
    headerClasses: 'sticky top-0 z-10',
    style: 'width:50px;',
  },
  NhiCode: {
    name: 'NhiCode',
    label: '健保代碼',
    align: 'center',
    field: 'NhiCode',
    headerClasses: 'sticky top-0 z-10',
    style: 'width:200px',
  },
  MedicineId: {
    name: 'MedicineId',
    label: '院內代碼',
    align: 'center',
    field: 'MedicineId',
    headerClasses: 'sticky top-0 z-10',
    style: 'width:200px',
  },
  CName: {
    name: 'CName',
    label: '中文藥名',
    align: 'center',
    field: 'CName',
    headerClasses: 'sticky top-0 z-10',
    style: 'white-space:pre-wrap;max-width:300px',
  },
  EName: {
    name: 'EName',
    label: '英文藥名',
    align: 'center',
    field: 'EName',
    headerClasses: 'sticky top-0 z-10',
    style: 'white-space:pre-wrap;max-width:300px',
  },
  VendorName: {
    name: 'VendorName',
    label: '藥商名稱',
    align: 'center',
    field: 'VendorName',
    headerClasses: 'sticky top-0 z-10',
  },
  StockNow: {
    name: 'StockNow',
    label: '現有存量',
    align: 'center',
    field: 'StockNow',
    headerClasses: 'sticky top-0 z-10',
  },
  BuyQuantity: {
    name: 'BuyQuantity',
    label: '採購數量',
    align: 'center',
    field: 'BuyQuantity',
    headerClasses: 'sticky top-0 z-10',
    style: 'width:200px',
  },
  InStockQuantity: {
    name: 'InStockQuantity',
    label: '已入庫數量',
    align: 'center',
    field: 'InStockQuantity',
    headerClasses: 'sticky top-0 z-10',
  },
  InStockDate: {
    name: 'InStockDate',
    label: '入庫時間',
    align: 'center',
    field: (row) => ChageDateFormat(row.InStockDate),
    headerClasses: 'sticky top-0 z-10',
  },
  ReceiveFlag: {
    name: 'ReceiveFlag',
    label: '是否入庫',
    align: 'center',
    field: (row) => (row.ReceiveFlag ? '入庫' : ''),
    headerClasses: 'sticky top-0 z-10',
  },
  InStockId: {
    name: 'InStockId',
    label: '入庫人員',
    align: 'center',
    field: 'InStockId',
    headerClasses: 'sticky top-0 z-10',
  },
})

const ChageDateFormat = (date) => {
  return date === null ? null : dayjs(date).format('YYYY/MM/DD')
}

const rows = ref([])

const btnLabel = computed(() => {
  switch (props.editType) {
    case 'add':
      return [
        { lable: '取消' },
        {
          lable: '提交表單',
          class: ['bg-[#D63F95]', 'text-white'],
          show: true,
        },
      ]
    case 'delete':
      return [
        { lable: '取消' },
        {
          lable: '確定刪除',
          class: ['bg-[#C60B28]', 'text-white'],
          show: true,
        },
      ]
    case 'details':
      return [{ lable: '取消' }, { lable: '更新', class: ['bg-[#D63F95]', 'text-white'], show: true }]
    case 'inStock':
      return [{ lable: '關閉' }, { show: false }]
    case 'view':
      return [{ lable: '關閉' }, { show: false }]
    default:
      return []
  }
})

const initData = {
  PurchaseDatetime: dayjs(props.editType === 'add' ? new Date() : props.row.PurchaseDatetime).format('YYYY/MM/DD'),
  PurchaseId: props.row.PurchaseId,
  BuyerId: props.row.BuyerId,
  InStockId: null,
}

const purchaseData = reactive(cloneDeep(initData))

// q-date 採購日期設置
const dateOption = (date) => {
  return date >= dayjs(new Date()).format('YYYY/MM/DD')
}

//新增按鈕
const addRow = () => {
  rows.value.push({})
}

// 移除按鈕
const removeRow = (row) => {
  rows.value = rows.value.filter((item) => {
    return item !== row
  })
}

// 新增採購單

// 請求新採購單號
const PurchaseIdLoading = ref(false)

const getNewPurchaseId = async () => {
  try {
    PurchaseIdLoading.value = true
    const res = await GetNewPurchaseId()
    if (res.status === 200) {
      purchaseData.PurchaseId = res.data
    }
  } catch (err) {
    console.log(err)
  } finally {
    PurchaseIdLoading.value = false
  }
}

// 藥品資料請求
const codeLoading = ref(false)

const drugCode = ref(null)

const drugOpiton = ref([])

const GetDrug = async (val, key) => {
  const query = setSearchQuery({
    $filter: `contains(${key},'${val}')`,
    $top: 15,
  })
  codeLoading.value = true
  try {
    const res = await getDrug(query)
    if (res.status === 200) {
      drugOpiton.value = res.data.Items
    }
  } catch (err) {
    console.log(err)
  } finally {
    codeLoading.value = false
  }
}

const filterFn = (val, update, key) => {
  if (!!val) {
    drugCode.value = val
    update(() => {
      GetDrug(val, key)
    })
  } else {
    update(() => {
      drugOpiton.value = []
    })
  }
}

const rowUpdate = (val, row) => {
  if (!!val) {
    row.NhiCode = val.NhiCode
    row.MedicineId = val.MedicineId
    row.EName = val.EName
    row.CName = val.CName
    row.VendorName = val.VendorName
    row.StockNow = val.StockNow
  } else {
    row.NhiCode = ''
    row.MedicineId = ''
    row.EName = ''
    row.CName = ''
    row.VendorName = ''
    row.StockNow = ''
  }
}

const scrollLoad = async (details, key) => {
  if (details.to === details.index) {
    const query = setSearchQuery({
      $filter: `contains(${key},'${drugCode.value}')`,
      $skip: drugOpiton.value.length,
      $top: 15,
    })
    codeLoading.value = true
    try {
      const res = await getDrug(query)
      if (res.status === 200) {
        drugOpiton.value = [...drugOpiton.value, ...res.data.Items]
      }
    } catch (err) {
      console.log(err)
    } finally {
      codeLoading.value = false
    }
  }
}

// 表單驗證
let inputRefs = reactive({})
const reg = /^[1-9][0-9]*$/

const rule = {
  Datetime: [(val) => (val !== null && val !== '') || '請輸入正確日期'],
  PurchaseId: [(val) => (val !== null && val !== '' && val !== undefined) || '請輸入採購單號'],
  BuyerId: [(val) => (val !== null && val !== '' && val !== undefined) || '請選擇採購人員'],
  NhiCode: [(val) => (val !== null && val !== '' && val !== undefined) || '請輸入健保代碼'],
  MedicineId: [(val) => (val !== null && val !== '' && val !== undefined) || '請輸入院內代碼'],
  BuyQuantity: [(val) => reg.test(val) || '請輸入整數數量'],
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

// 請求資料OrderItems
const orderItems = () => {
  let arr = []

  for (let i = 0; i < rows.value.length; i++) {
    let row = rows.value[i]
    let obj = { ...row }
    delete obj.targets
    arr.push(obj)
  }

  return arr
}

// 採購單新增請求
const subLoading = ref(false)

// 添加採購單號
const addPurchaseId = () => {
  for (let i = 0; i < rows.value.length; i++) {
    rows.value[i].PurchaseId = purchaseData.PurchaseId
  }
}

const PostOrder = async () => {
  if (validate() === true && rows.value.length > 0 && confirm('確認更新此筆採購單?')) {
    try {
      addPurchaseId()
      subLoading.value = true
      const body = {
        PurchaseDatetime: dayjs(purchaseData.PurchaseDatetime).format(),
        PurchaseId: purchaseData.PurchaseId,
        BuyerId: purchaseData.BuyerId,
        OrderStatus: 0,
        OrderItems: orderItems(),
      }

      const res = await postOrder(body)
      if (res.status === 200) {
        $q.notify({
          type: 'positive',
          message: '新增採購單成功',
          position: 'top',
        })
        onDialogOK()
      }
    } catch (err) {
      console.log(err)
      $q.notify({
        type: 'negative',
        message: '新增採購單失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
        position: 'top',
      })
    } finally {
      subLoading.value = false
    }
  }
}

// 刪除採購單
const DeleteOrder = async () => {
  if (confirm('確定刪除此筆採購單?')) {
    subLoading.value = true
    try {
      const res = await deleteOrder(purchaseData.PurchaseId)
      if (res.status === 204) {
        $q.notify({
          type: 'positive',
          message: '刪除採購單成功',
          position: 'top',
        })
        onDialogOK()
      }
    } catch (err) {
      console.log(err)

      if (err.data === '此訂單已入庫') {
        $q.notify({
          type: 'negative',
          message: '採購單已部分入庫',
          position: 'top',
        })
      } else {
        $q.notify({
          type: 'negative',
          message: '刪除採購單失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
          position: 'top',
        })
      }
    } finally {
      subLoading.value = false
    }
  }
}

// 更新採購單
const PutOrder = async () => {
  if (validate() === true && rows.value.length > 0 && confirm('確認更新此筆採購單?')) {
    subLoading.value = true
    try {
      addPurchaseId()
      const body = {
        PurchaseDatetime: dayjs(purchaseData.PurchaseDatetime).format(),
        PurchaseId: purchaseData.PurchaseId,
        BuyerId: purchaseData.BuyerId,
        OrderStatus: 0,
        OrderItems: orderItems(),
      }
      const res = await putOrder(body)
      if (res.status === 200) {
        $q.notify({
          type: 'positive',
          message: '編輯採購單成功',
          position: 'top',
        })
        onDialogOK()
      }
    } catch (err) {
      console.log(err)
      $q.notify({
        type: 'negative',
        message: '編輯採購單失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
        position: 'top',
      })
    } finally {
      subLoading.value = false
    }
  }
}

// 採購單全數入庫
const PutAllStock = async () => {
  if (validate() === true && confirm('確定全數入庫?')) {
    try {
      const body = {
        InStockId: purchaseData.InStockId,
        PurchaseId: purchaseData.PurchaseId,
      }
      const res = await putAllStock(body)
      if (res.status === 204) {
        viewUpdate()
        $q.notify({
          type: 'positive',
          message: '採購單入庫成功',
          position: 'top',
        })
        onDialogOK()
      }
    } catch (err) {
      console.log(err)
      $q.notify({
        type: 'negative',
        message: '採購單入庫失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
        position: 'top',
      })
    }
  }
}

// 採購單一入庫
const inStockQuantity = ref(0)

const cloneBuyQuantity = (row) => {
  inStockQuantity.value = row.BuyQuantity - (row.InStockQuantity ? row.InStockQuantity : 0)
}

const PutSetInStock = async (row) => {
  if (validate() === true && confirm('確認入庫?')) {
    try {
      codeLoading.value = true
      const body = {
        PurchaseId: purchaseData.PurchaseId,
        MedicineId: row.MedicineId,
        InStockQuantity: inStockQuantity.value,
        InStockId: purchaseData.InStockId,
      }
      const res = await putSetInStock(body)
      if (res.status === 200) {
        row.editRef.hide()
        await viewUpdate()
        $q.notify({
          type: 'positive',
          message: '單筆採購單入庫成功',
          position: 'top',
        })
      }
    } catch (err) {
      console.log(err)
      $q.notify({
        type: 'negative',
        message: '單筆採購單入庫失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
        position: 'top',
      })
    } finally {
      codeLoading.value = false
    }
  }
}

// 更新頁面
const getDataLoading = ref(false)

const viewUpdate = async () => {
  getDataLoading.value = true
  try {
    const query = `?$filter= PurchaseId eq '${purchaseData.PurchaseId}'`

    const res = await getOrder(query)
    if (res.status === 200) {
      rows.value = res.data.Items[0].OrderItems
    }
  } catch (err) {
    console.log(err)
  } finally {
    getDataLoading.value = false
  }
}

// 請求按鈕function
const makeRequest = () => {
  switch (props.editType) {
    case 'add':
      PostOrder()
      break
    case 'delete':
      DeleteOrder()
      break
    case 'details':
      PutOrder()
      break
  }
}

const init = () => {
  switch (props.editType) {
    case 'add':
      getNewPurchaseId()
      break
    case 'delete':
    case 'details':
    case 'inStock':
    case 'view':
      viewUpdate()
      break
  }
}

init()
</script>
