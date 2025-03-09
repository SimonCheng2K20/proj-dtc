<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss full-width full-height>
    <my-dialog-content :header="editHeader" width="90vw" @close="onDialogCancel" :loading="getDataLoading">
      <div v-if="editType === 'delete'" class="text-negative mb-1">是否確定刪除此藥品申領單？</div>
      <div class="pb-2">
        <my-input-group class="grid gap-2 grid-cols-4 p-2" style="width: 100%">
          <my-input-wrapper label="申領日期">
            <my-date-input
              v-bind="QInputProps"
              :readonly="editType !== 'add'"
              :bg-color="editType !== 'add' ? 'blue-grey-1' : null"
              :date-options="dateOption"
              v-model="editItem.ApplyDate"
              :rules="rule.ApplyDate"
              :ref="(el) => (inputRefs.ApplyDate = el)"
            >
            </my-date-input>
          </my-input-wrapper>
          <my-input-wrapper label="申領單號">
            <q-input
              :readonly="editType !== 'add'"
              :bg-color="editType !== 'add' ? 'blue-grey-1' : null"
              v-bind="QInputProps"
              v-model="editItem.ApplyId"
              :loading="applyIdLoading"
              :rules="rule.ApplyId"
              :ref="(el) => (inputRefs.ApplyId = el)"
            ></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="申領人員">
            <q-select
              :readonly="editType !== 'add'"
              :bg-color="editType !== 'add' ? 'blue-grey-1' : null"
              v-bind="QSelectProps"
              :options="options"
              v-model="editItem.PersonId"
              :rules="rule.PersonId"
              :ref="(el) => (inputRefs.PersonId = el)"
            ></q-select>
          </my-input-wrapper>
          <my-input-wrapper label="申領藥房">
            <q-select
              :readonly="editType !== 'add'"
              :bg-color="editType !== 'add' ? 'blue-grey-1' : null"
              v-bind="QInputProps"
              :options="pharmacyOptions"
              v-model="editItem.PharmacyId"
              emit-value
              map-options
              option-value="PharmacyId"
              option-label="CName"
              :loading="pharmacyIdLoading"
              :rules="rule.PharmacyId"
              :ref="(el) => (inputRefs.PharmacyId = el)"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-italic text-grey"> 無資料 </q-item-section>
                </q-item>
              </template>
            </q-select>
          </my-input-wrapper>
          <template v-if="editType === 'view' && editItem.Status === 2">
            <my-input-wrapper label="訂單完成時間">
              <my-date-input v-bind="QInputProps" readonly bg-color="blue-grey-1" v-model="editItem.ApplyDate">
              </my-date-input>
            </my-input-wrapper>
            <my-input-wrapper label="訂單狀態">
              <q-input readonly bg-color="blue-grey-1" v-bind="QInputProps" v-model="editItem.StatusName"></q-input>
            </my-input-wrapper>
          </template>
          <template v-if="editType === 'view' && editItem.Status === -1">
            <my-input-wrapper label="刪除日期">
              <my-date-input v-bind="QInputProps" readonly bg-color="blue-grey-1" v-model="editItem.DeleteDatetime">
              </my-date-input>
            </my-input-wrapper>
            <my-input-wrapper label="刪除申領單人員">
              <q-input
                readonly
                bg-color="blue-grey-1"
                v-bind="QInputProps"
                v-model="editItem.DeletePersonName"
              ></q-input>
            </my-input-wrapper>
          </template>
        </my-input-group>
        <div class="px-2 flex justify-end" v-if="editType === 'add' || (editType === 'edit' && editItem.Status === 0)">
          <q-btn
            padding="4px 8px"
            unelevated
            color="secondary"
            icon="add"
            label="新增"
            :disable="getDataLoading"
            @click="addRow()"
          ></q-btn>
        </div>
      </div>

      <q-table
        v-bind="QTableProps"
        style="max-height: 600px"
        :rows="editItem.StoreStockApplyDetails"
        :columns="columns"
        virtual-scroll
        :rows-per-page-options="[0]"
      >
        <template #header-cell-Warehousing="{ col }">
          <q-th :props="{ col }">
            <q-btn unelevated dense color="pink-4" label="全數入庫" @click="PutApplyAllInStock()"> </q-btn>
          </q-th>
        </template>
        <template
          v-if="editType === 'add' || (editType === 'edit' && editItem.Status === 0)"
          #body-cell-action="{ col, row }"
        >
          <q-td :props="{ col, row }">
            <q-btn class="text-black" unelevated dense color="warning" @click="removeRow(row)">
              <template #default>
                <q-icon name="remove" size="xs"></q-icon>
                <span>刪除</span>
              </template>
            </q-btn>
          </q-td>
        </template>
        <template #body-cell-Index="{ col, rowIndex }">
          <q-td :props="{ col, rowIndex }">
            {{ rowIndex + 1 }}
          </q-td>
        </template>
        <template
          v-if="editType === 'add' || (editType === 'edit' && editItem.Status === 0)"
          #body-cell-NhiCode="{ col, row, rowIndex }"
        >
          <q-td :props="{ col, row, rowIndex }">
            <q-select
              v-bind="QSelectProps"
              v-model="row.NhiCode"
              :options="drugOpitons"
              use-input
              hide-dropdown-icon
              :loading="codeLoading"
              :rules="rule.NhiCode"
              :ref="
                (el) => {
                  inputRefs[`NhiCode${rowIndex}`] = el
                }
              "
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
        <template
          v-if="editType === 'add' || (editType === 'edit' && editItem.Status === 0)"
          #body-cell-MedicineId="{ col, row, rowIndex }"
        >
          <q-td :props="{ col, row }">
            <q-select
              v-bind="QSelectProps"
              v-model="row.MedicineId"
              :options="drugOpitons"
              use-input
              hide-dropdown-icon
              :loading="codeLoading"
              :rules="rule.MedicineId"
              :ref="
                (el) => {
                  inputRefs[`MedicineId${rowIndex}`] = el
                }
              "
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
        <template
          v-if="editType === 'add' || (editType === 'edit' && editItem.Status === 0)"
          #body-cell-ApplyAmount="{ col, row, rowIndex }"
        >
          <q-td :props="{ col, row, rowIndex }">
            <q-input
              v-bind="QInputProps"
              input-class="text-center"
              :rules="rule.ApplyAmount"
              :ref="
                (el) => {
                  inputRefs[`ApplyAmount${rowIndex}`] = el
                }
              "
              lazy-rules
              v-model="row.ApplyAmount"
            >
            </q-input>
          </q-td>
        </template>
        <template v-if="editType === 'edit' && editItem.Status === 1" #body-cell-Arrival="{ col, row }">
          <q-td :props="{ col, row }">
            <q-select
              v-bind="QSelectProps"
              :options="arrivalOptions"
              clearable="true"
              emit-value
              map-options
              option-value="value"
              option-label="label"
              v-model="row.Arrival"
            ></q-select>
          </q-td>
        </template>
        <template v-if="editType === 'edit' && editItem.Status === 1" #body-cell-Warehousing="{ col, row, rowIndex }">
          <q-td v-if="row.Warehousing" :props="{ col, row }">
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
                        (0 < val && val <= row.ApplyAmount - (row.InStockQuantity ? row.InStockQuantity : 0)) ||
                        `請輸入:1 ~ ${row.ApplyAmount - (row.InStockQuantity ? row.InStockQuantity : 0)}`,
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
                    <q-btn color="grey" unelevated label="取消" @click="row.editRef.cancel()"></q-btn>
                    <q-btn
                      class="ml-2 text-white"
                      color="edit"
                      unelevated
                      label="儲存"
                      :loading="inStockLoading"
                      @click="PutApplyInStock(row)"
                    >
                    </q-btn>
                  </div>
                </template>
              </q-popup-edit>
            </q-btn>
          </q-td>
          <q-td v-if="!row.Warehousing" :props="{ col, row }">
            <p>入庫</p>
          </q-td>
        </template>
        <template v-if="editType === 'edit' && editItem.Status === 1" #body-cell-Note="{ col, row }">
          <q-td :props="{ col, row }">
            <q-input v-bind="QInputProps" v-model="row.Note"></q-input>
          </q-td>
        </template>
      </q-table>

      <template #actions>
        <q-btn unelevated color="grey" label="取消" @click="onDialogCancel"></q-btn>
        <q-btn
          v-if="editType === 'add'"
          unelevated
          color="secondary"
          label="新增"
          :loading="editLoading"
          :disable="getDataLoading"
          @click="OnSaveClick('確定送出此筆申領單?')"
        ></q-btn>
        <q-btn
          v-if="editType === 'edit'"
          unelevated
          color="primary"
          label="編輯"
          :loading="editLoading"
          :disable="getDataLoading"
          @click="OnSaveClick('確定修改此筆申領單?')"
        ></q-btn>
        <q-btn
          v-if="editType === 'delete'"
          unelevated
          color="negative"
          label="刪除"
          :loading="editLoading"
          :disable="getDataLoading"
          @click="DeleteClick('確定刪除此筆申領單?')"
        ></q-btn>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>
<script setup>
import { ref, reactive, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import dayjs from 'dayjs'

// api
import {
  getStoreStockApplyItem,
  postStoreStockApplyItem,
  putStoreStockApplyItem,
  deleteStoreStockApplyItem,
  getNewApplyId,
  getDrugStore,
  getDrug,
  putApplyInStock,
  putApplyAllInStock,
  putEditInStock,
} from 'api'

// utils
import { QInputProps, QSelectProps, QTableProps } from 'utils/quasar-extends/base-props.js'
import setSearchQuery from 'utils/setSearchQuery'

const $q = useQuasar()

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const qDateProxy = ref()

const props = defineProps({
  editType: String,
  id: [String, Number],
})

// 申領人員
const options = ['datacom']

const totalColItem = {
  action: {
    name: 'action',
    label: '操作',
    align: 'center',
    field: 'action',
    headerClasses: 'sticky top-0 z-10',
    style: 'width:120px;',
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
    style: 'white-space:pre-wrap;',
  },
  EName: {
    name: 'EName',
    label: '英文藥名',
    align: 'center',
    field: 'EName',
    headerClasses: 'sticky top-0 z-10',
    style: 'white-space:pre-wrap;',
  },
  ApplyAmount: {
    name: 'ApplyAmount',
    label: '申領數量',
    align: 'center',
    field: 'ApplyAmount',
    headerClasses: 'sticky top-0 z-10',
    style: 'width:100px',
  },
  InStockQuantity: {
    name: 'InStockQuantity',
    label: '已入庫數量',
    align: 'center',
    field: 'InStockQuantity',
    headerClasses: 'sticky top-0 z-10',
    style: 'width:80px',
  },
  Arrival: {
    name: 'Arrival',
    label: '是否到貨',
    align: 'center',
    field: 'Arrival',
    headerClasses: 'sticky top-0 z-10',
    style: 'width:50px',
  },
  Warehousing: {
    name: 'Warehousing',
    label: '是否入庫',
    align: 'center',
    field: '入庫',
    headerClasses: 'sticky top-0 z-10',
    style: 'width:100px',
  },

  InStockDate: {
    name: 'InStockDate',
    label: '入庫時間',
    align: 'center',
    field: (row) => (dayjs(row.InStockDate).isValid() ? dayjs(row.InStockDate).format('YYYY-MM-DD') : row.InStockDate),
    headerClasses: 'sticky top-0 z-10',
    style: 'white-space:pre-wrap; width:100px',
  },
  Note: {
    name: 'Note',
    label: '備註',
    align: 'center',
    field: 'Note',
    headerClasses: 'sticky top-0 z-10',
    style: 'white-space:pre-wrap; width:300px',
  },
}

const columns = computed(() => {
  const {
    action,
    Index,
    NhiCode,
    MedicineId,
    CName,
    EName,
    ApplyAmount,
    Arrival,
    Warehousing,
    InStockDate,
    Note,
    InStockQuantity,
  } = totalColItem
  switch (props.editType) {
    case 'add':
    case 'delete':
      return [action, Index, NhiCode, MedicineId, CName, EName, ApplyAmount]
    case 'edit':
      if (editItem.Status === 1) {
        return [
          Index,
          NhiCode,
          MedicineId,
          CName,
          EName,
          ApplyAmount,
          InStockQuantity,
          Arrival,
          Warehousing,
          InStockDate,
          Note,
        ]
      } else {
        return [action, Index, NhiCode, MedicineId, CName, EName, ApplyAmount]
      }
    case 'view':
      return [Index, NhiCode, MedicineId, CName, EName, ApplyAmount, InStockDate, Note]
    default:
      return []
  }
})

const editHeader = computed(() => {
  switch (props.editType) {
    case 'add':
      return `新增藥品申領單`
    case 'edit':
      return `編輯藥品申領單`
    case 'delete':
      return `刪除藥品申領單`
    default:
      return null
  }
})

const editItem = reactive({
  ApplyId: null,
  PharmacyId: null,
  ApplyDate: dayjs(new Date()).format('YYYY/MM/DD'),
  PersonId: null,
  Status: 0,
  Arrival: null,
  Warehousing: null,
  Note: null,
  StoreStockApplyDetails: [],
})

// 日期配置
const dateOption = (date) => {
  return date >= dayjs(new Date()).format('YYYY/MM/DD')
}

// 新增項目
const addRow = () => {
  editItem.StoreStockApplyDetails.push({})
}

// 刪除項目
const removeRow = (row) => {
  editItem.StoreStockApplyDetails = editItem.StoreStockApplyDetails.filter((item) => {
    return item !== row
  })
}

// 獲取申領單資料
const getDataLoading = ref(false)

const GetStoreStockApplyItem = async () => {
  try {
    getDataLoading.value = true
    const res = await getStoreStockApplyItem(props.id)
    if (res.status === 200) {
      Object.assign(editItem, res.data)
    }
  } catch (err) {
    console.log(err)
  } finally {
    getDataLoading.value = false
  }
}

const OnSaveClick = (remind) => {
  if (validate() === true && confirm(remind)) {
    switch (props.editType) {
      case 'add':
        PostStoreStockApplyItem(editItem)
        break
      case 'edit':
        if (editItem.Status === 0) PutStoreStockApplyItem(editItem)
        else PutEditInStock(editItem)
        break
    }
  }
}

const DeleteClick = (remind) => {
  if (confirm(remind)) {
    DeleteStoreStockApplyItem(editItem.ApplyId)
  }
}

// 增刪改
const editLoading = ref(false)

const addApplyId = () => {
  editItem.StoreStockApplyDetails.forEach((item) => {
    item.ApplyId = editItem.ApplyId
  })
}

const PostStoreStockApplyItem = async (editItem) => {
  addApplyId()
  try {
    editLoading.value = true
    const res = await postStoreStockApplyItem(editItem)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '新增藥品申領單成功',
        position: 'top',
      })
      onDialogOK()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '新增藥品申領單失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const PutStoreStockApplyItem = async (editItem) => {
  addApplyId()
  try {
    editLoading.value = true
    const res = await putStoreStockApplyItem(editItem)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '編輯藥品申領單成功',
        position: 'top',
      })
      onDialogOK()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '編輯藥品申領單失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const DeleteStoreStockApplyItem = async (id) => {
  try {
    editLoading.value = true
    const res = await deleteStoreStockApplyItem(id)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '刪除藥品申領單成功',
        position: 'top',
      })
      onDialogOK()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '刪除藥品申領單失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

// 單一入庫
const inStockQuantity = ref(0)

const cloneBuyQuantity = (row) => {
  inStockQuantity.value = row.ApplyAmount - (row.InStockQuantity ? row.InStockQuantity : 0)
}

const inStockLoading = ref(false)

const PutApplyInStock = async (row) => {
  if (validate() === true && confirm('確定將藥品入庫嗎?')) {
    try {
      inStockLoading.value = true
      const body = {
        ApplyId: row.ApplyId,
        MedicineId: row.MedicineId,
        InStockQuantity: inStockQuantity.value,
      }
      const res = await putApplyInStock(body)
      if (res.status === 200) {
        row.editRef.hide()
        $q.notify({
          type: 'positive',
          message: '藥品入庫成功',
          position: 'top',
        })
        await GetStoreStockApplyItem()
        if (editItem.Status === 2) onDialogOK()
      }
    } catch (err) {
      console.log(err)
      $q.notify({
        type: 'negative',
        message: '藥品入庫失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
        position: 'top',
      })
    } finally {
      inStockLoading.value = false
    }
  }
}

// 全數入庫
const PutApplyAllInStock = async () => {
  if (confirm('確定要全數入庫嗎?')) {
    try {
      inStockLoading.value = true
      const body = {
        ApplyId: props.id,
      }
      const res = await putApplyAllInStock(body)
      if (res.status === 204) {
        GetStoreStockApplyItem()
        $q.notify({
          type: 'positive',
          message: '申領單入庫成功',
          position: 'top',
        })
        onDialogOK()
      }
    } catch (err) {
      console.log(err)
      $q.notify({
        type: 'negative',
        message: '申領單入庫失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
        position: 'top',
      })
    } finally {
      inStockLoading.value = false
    }
  }
}

// 備註&到貨編輯
const PutEditInStock = async (editItem) => {
  try {
    editLoading.value = true
    const res = await putEditInStock(editItem)
    if (res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '申領單編輯成功',
        position: 'top',
      })
      GetStoreStockApplyItem()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '申領單編輯失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

// 取得申領單號
const applyIdLoading = ref(false)

const GetNewApplyId = async () => {
  try {
    applyIdLoading.value = true
    const res = await getNewApplyId()
    if (res.status === 200) {
      editItem.ApplyId = res.data
    }
  } catch (err) {
    console.log(err)
  } finally {
    applyIdLoading.value = false
  }
}

// 藥房列表
const pharmacyOptions = ref([])

const pharmacyIdLoading = ref(false)

const GetDrugStore = async () => {
  try {
    pharmacyIdLoading.value = true
    const res = await getDrugStore()
    if (res.status === 200) {
      pharmacyOptions.value = res.data.Items
    }
  } catch (err) {
    console.log(err)
  } finally {
    pharmacyIdLoading.value = false
  }
}

// 藥品資料請求
const codeLoading = ref(false)

const drugCode = ref(null)

const drugOpitons = ref([])

const GetDrug = async (val, key) => {
  const query = setSearchQuery({
    $filter: `contains(${key},'${val}')`,
    $top: 15,
  })
  try {
    codeLoading.value = true
    const res = await getDrug(query)
    if (res.status === 200) {
      drugOpitons.value = res.data.Items
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
      drugOpitons.value = []
    })
  }
}

const rowUpdate = (val, row) => {
  if (!!val) {
    row.NhiCode = val.NhiCode
    row.MedicineId = val.MedicineId
    row.EName = val.EName
    row.CName = val.CName
  } else {
    row.NhiCode = ''
    row.MedicineId = ''
    row.EName = ''
    row.CName = ''
  }
}

const scrollLoad = async (details, key) => {
  if (details.to === details.index) {
    const query = setSearchQuery({
      $filter: `contains(${key},'${drugCode.value}')`,
      $skip: drugOpitons.value.length,
      $top: 15,
    })
    codeLoading.value = true
    try {
      const res = await getDrug(query)
      if (res.status === 200) {
        drugOpitons.value = [...drugOpitons.value, ...res.data.Items]
      }
    } catch (err) {
      console.log(err)
    } finally {
      codeLoading.value = false
    }
  }
}

// 表單驗證
const inputRefs = reactive({})

const reg = /^[1-9][0-9]*$/

const rule = {
  PharmacyId: [(val) => (val !== null && val !== '') || '請選取藥房'],
  ApplyDate: [(val) => (val !== null && val !== '') || '請輸入日期'],
  ApplyId: [(val) => (val !== null && val !== '') || '請輸入申領單號'],
  PersonId: [(val) => (val !== null && val !== '') || '請選取申領人員'],
  NhiCode: [(val) => (val !== null && val !== '' && val !== undefined) || '請輸入健保代碼'],
  MedicineId: [(val) => (val !== null && val !== '' && val !== undefined) || '請輸入院內代碼'],
  ApplyAmount: [(val) => reg.test(val) || '請輸入整數數量'],
}

const validate = () => {
  console.log(inputRefs)
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

// 是否到達&是否入庫

const arrivalOptions = [
  { label: '是', value: true },
  { label: '否', value: false },
]

const init = () => {
  GetDrugStore()
  switch (props.editType) {
    case 'add':
      GetNewApplyId()
      break
    case 'delete':
    case 'edit':
    case 'view':
      GetStoreStockApplyItem()
      break
  }
}
init()
</script>
