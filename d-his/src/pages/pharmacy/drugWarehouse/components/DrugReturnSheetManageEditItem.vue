<template>
  <q-dialog ref="dialogRef" full-width full-height no-backdrop-dismiss>
    <my-dialog-content :header="editHeader" width="90vw" @close="onDialogCancel" :loading="getDataLoading">
      <div v-if="editType === 'delete'" class="text-negative mb-1">是否確定刪除此藥房退庫單？</div>
      <div class="pb-2">
        <my-input-group class="grid gap-2 grid-cols-4 p-2" style="width: 100%">
          <my-input-wrapper label="退庫日期">
            <my-date-input
              v-bind="QInputProps"
              :readonly="editType !== 'add'"
              :bg-color="editType !== 'add' ? 'blue-grey-1' : null"
              :date-options="dateOption"
              v-model="editItem.BackoutDate"
              :rules="rule.BackoutDate"
              :ref="(el) => (inputRefs.BackoutDate = el)"
            >
            </my-date-input>
          </my-input-wrapper>
          <my-input-wrapper label="退庫單號">
            <q-input
              :readonly="editType !== 'add'"
              :bg-color="editType !== 'add' ? 'blue-grey-1' : null"
              v-bind="QInputProps"
              v-model="editItem.BackoutId"
              :loading="backoutIdLoading"
              :rules="rule.BackoutId"
              :ref="(el) => (inputRefs.BackoutId = el)"
            ></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="退庫人員">
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
          <my-input-wrapper label="退庫藥房">
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
          <template v-if="editType === 'view' && editItem.Status === 1">
            <my-input-wrapper label="退庫單完成時間">
              <my-date-input v-bind="QInputProps" readonly bg-color="blue-grey-1" v-model="editItem.CheckAcceptDate">
              </my-date-input>
            </my-input-wrapper>
            <my-input-wrapper label="退庫單狀態">
              <q-input readonly bg-color="blue-grey-1" v-bind="QInputProps" v-model="editItem.StatusName"></q-input>
            </my-input-wrapper>
          </template>
          <template v-if="editType === 'view' && editItem.Status === -1">
            <my-input-wrapper label="刪除日期">
              <my-date-input v-bind="QInputProps" readonly bg-color="blue-grey-1" v-model="editItem.DeleteDatetime">
              </my-date-input>
            </my-input-wrapper>
            <my-input-wrapper label="刪除退庫單人員">
              <q-input
                readonly
                bg-color="blue-grey-1"
                v-bind="QInputProps"
                v-model="editItem.DeletePersonName"
              ></q-input>
            </my-input-wrapper>
          </template>
        </my-input-group>
        <div class="px-2 flex justify-end" v-if="editType === 'add' || editType === 'edit'">
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
        :rows="editItem.StoreStockReturnDetails"
        :columns="columns"
        virtual-scroll
        :rows-per-page-options="[0]"
      >
        <template v-if="editType === 'add' || editType === 'edit'" #body-cell-action="{ col, row }">
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
        <template v-if="editType === 'add' || editType === 'edit'" #body-cell-NhiCode="{ col, row, rowIndex }">
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
        <template v-if="editType === 'add' || editType === 'edit'" #body-cell-MedicineId="{ col, row, rowIndex }">
          <q-td :props="{ col, row, rowIndex }">
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
        <template v-if="editType === 'add' || editType === 'edit'" #body-cell-BackoutAmount="{ col, row, rowIndex }">
          <q-td :props="{ col, row, rowIndex }">
            <q-input
              v-bind="QInputProps"
              input-class="text-center"
              :rules="rule.BackoutAmount"
              :ref="
                (el) => {
                  inputRefs[`BackoutAmount${rowIndex}`] = el
                }
              "
              lazy-rules
              v-model="row.BackoutAmount"
            >
            </q-input>
          </q-td>
        </template>
      </q-table>

      <Stamp
        v-if="editType === 'view' && editItem.Status === 1"
        :title="'庫房簽收人'"
        :content="editItem.CheckAcceptPersonName"
      ></Stamp>

      <template #actions>
        <q-btn unelevated color="grey" label="取消" @click="onDialogCancel"></q-btn>
        <q-btn
          v-if="editType === 'add'"
          unelevated
          color="secondary"
          label="新增"
          :loading="editLoading"
          :disable="getDataLoading"
          @click="OnSaveClick('確定送出此筆退庫單?')"
        ></q-btn>
        <q-btn
          v-if="editType === 'edit'"
          unelevated
          color="primary"
          label="編輯"
          :loading="editLoading"
          :disable="getDataLoading"
          @click="OnSaveClick('確定修改此筆退庫單?')"
        ></q-btn>
        <q-btn
          v-if="editType === 'delete'"
          unelevated
          color="negative"
          label="刪除"
          :loading="editLoading"
          :disable="getDataLoading"
          @click="DeleteClick('確定刪除此筆退庫單?')"
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
  getStoreStockReturnItem,
  postStoreStockReturnItem,
  putStoreStockReturnItem,
  deleteStoreStockReturnItem,
  getNewReturnId,
  getDrugStore,
  getDrug,
} from 'api'

// utils
import { QInputProps, QSelectProps, QTableProps } from 'utils/quasar-extends/base-props.js'
import setSearchQuery from 'utils/setSearchQuery'

// components
import Stamp from '../../components/stamp.vue'

const $q = useQuasar()

const qDateProxy = ref()

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  editType: String,
  id: [String, Number],
})

// 退庫人員
const options = ['datacom']

const editHeader = computed(() => {
  switch (props.editType) {
    case 'add':
      return `新增藥房退庫單`
    case 'edit':
      return `編輯藥房退庫單`
    case 'delete':
      return `刪除藥房退庫單`
    default:
      return null
  }
})

const columns = reactive([
  {
    name: 'action',
    label: '操作',
    align: 'center',
    field: 'action',
    headerClasses: 'sticky top-0 z-10',
    style: 'width:120px',
  },
  {
    name: 'Index',
    label: '序號',
    align: 'center',
    field: 'Index',
    headerClasses: 'sticky top-0 z-10',
  },
  {
    name: 'NhiCode',
    label: '健保代碼',
    align: 'center',
    field: 'NhiCode',
    headerClasses: 'sticky top-0 z-10',
  },
  {
    name: 'MedicineId',
    label: '院內代碼',
    align: 'center',
    field: 'MedicineId',
    headerClasses: 'sticky top-0 z-10',
  },
  {
    name: 'CName',
    label: '中文藥名',
    align: 'center',
    field: 'CName',
    headerClasses: 'sticky top-0 z-10',
    style: 'white-space:pre-wrap;',
  },
  {
    name: 'EName',
    label: '英文藥名',
    align: 'center',
    field: 'EName',
    headerClasses: 'sticky top-0 z-10',
    style: 'white-space:pre-wrap;',
  },
  {
    name: 'BackoutAmount',
    label: '退庫數量',
    align: 'center',
    field: 'BackoutAmount',
    headerClasses: 'sticky top-0 z-10',
    style: 'width:200px',
  },
])

const editItem = reactive({
  BackoutDate: dayjs(new Date()).format('YYYY/MM/DD'),
  BackoutId: null,
  Status: 0,
  PharmacyId: null,
  PersonId: null,
  CheckAcceptPersonId: null,
  CheckAcceptPersonName: null,
  StoreStockReturnDetails: [],
})

// 日期配置
const dateOption = (date) => {
  return date >= dayjs(new Date()).format('YYYY/MM/DD')
}

// 新增項目
const addRow = () => {
  editItem.StoreStockReturnDetails.push({})
}

// 刪除項目
const removeRow = (row) => {
  editItem.StoreStockReturnDetails = editItem.StoreStockReturnDetails.filter((item) => {
    return item !== row
  })
}

//表格資料
const getDataLoading = ref(false)

const GetStoreStockReturnItem = async () => {
  try {
    getDataLoading.value = true
    const res = await getStoreStockReturnItem(props.id)
    if (res.status === 200) {
      Object.assign(editItem, res.data)
    }
  } catch (err) {
    console.log(err)
  } finally {
    getDataLoading.value = false
  }
}

// 表單驗證
const inputRefs = reactive({})

const reg = /^[1-9][0-9]*$/

const rule = {
  PharmacyId: [(val) => (val !== null && val !== '') || '請選取藥房'],
  BackoutDate: [(val) => (val !== null && val !== '') || '請輸入日期'],
  BackoutId: [(val) => (val !== null && val !== '') || '請輸入退庫單號'],
  PersonId: [(val) => (val !== null && val !== '') || '請選取申請人員'],
  NhiCode: [(val) => (val !== null && val !== '' && val !== undefined) || '請輸入健保代碼'],
  MedicineId: [(val) => (val !== null && val !== '' && val !== undefined) || '請輸入院內代碼'],
  BackoutAmount: [(val) => reg.test(val) || '請輸入整數數量'],
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

const OnSaveClick = (remind) => {
  if (validate() === true && confirm(remind)) {
    switch (props.editType) {
      case 'add':
        PostStoreStockReturnItem(editItem)
        break
      case 'edit':
        PutStoreStockReturnItem(editItem)
        break
    }
  }
}

const DeleteClick = (remind) => {
  if (confirm(remind)) {
    DeleteStoreStockReturnItem(editItem.BackoutId)
  }
}

// 增刪改
const editLoading = ref(false)

const addBackoutId = () => {
  editItem.StoreStockReturnDetails.forEach((item) => {
    item.BackoutId = editItem.BackoutId
  })
}

const PostStoreStockReturnItem = async (editItem) => {
  try {
    addBackoutId()
    editLoading.value = true
    const res = await postStoreStockReturnItem(editItem)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '新增藥房退庫單成功',
        position: 'top',
      })
      onDialogOK()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '新增藥房退庫單失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const PutStoreStockReturnItem = async (editItem) => {
  try {
    addBackoutId()
    editLoading.value = true
    const res = await putStoreStockReturnItem(editItem)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '編輯藥房退庫單成功',
        position: 'top',
      })
      onDialogOK()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '編輯藥房退庫單失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const DeleteStoreStockReturnItem = async (id) => {
  try {
    editLoading.value = true
    const res = await deleteStoreStockReturnItem(id)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '刪除藥房退庫單成功',
        position: 'top',
      })
      onDialogOK()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '刪除藥房退庫單失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

// 取得退庫單號
const backoutIdLoading = ref(false)

const GetNewReturnId = async () => {
  try {
    backoutIdLoading.value = true
    const res = await getNewReturnId()
    if (res.status === 200) {
      editItem.BackoutId = res.data
    }
  } catch (err) {
    console.log(err)
  } finally {
    backoutIdLoading.value = false
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

const init = () => {
  GetDrugStore()
  switch (props.editType) {
    case 'add':
      GetNewReturnId()
      break
    case 'delete':
    case 'edit':
    case 'view':
      GetStoreStockReturnItem()
      break
  }
}
init()
</script>
