<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss full-width>
    <my-dialog-content :header="editHeader" width="1280px" @close="onDialogCancel" :loading="getDataLoading">
      <div v-if="editType === 'delete'" class="text-negative mb-1">是否確定刪除此病床固定費用管理？</div>
      <my-input-group class="grid grid-cols-2 gap-2">
        <my-input-wrapper label="固定費用代碼" required-mark>
          <q-input
            v-bind="QInputProps"
            :ref="(el) => (inputRefs.HbedFixChargeNo = el)"
            :rules="rules.HbedFixChargeNo"
            v-model="editItem.HbedFixChargeNo"
            :readonly="editType === 'delete'"
          >
          </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="固定費用名稱" required-mark>
          <q-input
            v-bind="QInputProps"
            :ref="(el) => (inputRefs.HbedFixChargeName = el)"
            :rules="rules.HbedFixChargeName"
            v-model="editItem.HbedFixChargeName"
            :readonly="editType === 'delete'"
          >
          </q-input>
        </my-input-wrapper>
      </my-input-group>

      <q-table
        class="mt-2"
        v-bind="QTableProps"
        :rows="editItem.HbedFixChargeDetails"
        :columns="columns"
        row-key="HbedFixChargeNo"
        :pagination="{ rowsPerPage: -1 }"
        :loading="getDataLoading"
      >
        <template #top>
          <q-space></q-space>
          <q-btn color="add" icon="add" dense unelevated @click="onAddRowClick"> </q-btn>
        </template>
        <template v-slot:body-cell-ProcedureCode="{ col, row, rowIndex }">
          <q-td :props="{ col }">
            <q-select
              v-bind="QSelectProps"
              :ref="(el) => (inputRefs[`ProcedureCode-${rowIndex}`] = el)"
              :rules="rules.ProcedureCode"
              v-model="row.ProcedureCode"
              :options="procedureFilterItems"
              option-label="ProcedureCode"
              use-input
              lazy-rules
              @input-value="filterLoading = true"
              @filter="procedureFilterHandler"
              @clear="Object.assign(row, cloneDeep(procedureInitData))"
              @update:model-value="(val) => (val ? onProcedureSelect(val, row) : null)"
            >
              <template #no-option="{ inputValue }">
                <q-item v-if="!!inputValue">
                  <q-item-section class="text-grey">
                    <q-spinner v-if="filterLoading" color="primary"></q-spinner>
                    <span v-else>找不到符合的資料</span>
                  </q-item-section>
                </q-item>
              </template>
              <template #option="scope">
                <q-item
                  v-bind="scope.itemProps"
                  :disable="
                    editItem.HbedFixChargeDetails.find((item) => item.ProcedureCode === scope.opt.ProcedureCode) !==
                    undefined
                  "
                >
                  <q-item-section>
                    <q-item-label>
                      <div v-html="scope.opt.filterLabel"></div>
                    </q-item-label>
                    <q-item-label
                      v-if="
                        editItem.HbedFixChargeDetails.find((item) => item.ProcedureCode === scope.opt.ProcedureCode) !==
                        undefined
                      "
                      class="text-negative"
                    >
                      此 檢查治療 已存在
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
              <template #after>
                <q-btn color="primary" icon="search" unelevated dense @click="addProcedureSearched(row)"></q-btn>
              </template>
            </q-select>
          </q-td>
        </template>
        <template v-slot:body-cell-InchargeNo="{ col, row, rowIndex }">
          <q-td :props="{ col }">
            <q-select
              v-bind="QSelectProps"
              :ref="(el) => (inputRefs[`InchargeNo-${rowIndex}`] = el)"
              :rules="rules.InchargeNo"
              v-model="row.InchargeNo"
              :options="inChargeItems"
              option-label="Name"
              option-value="No"
              emit-value
              map-options
              :readonly="editType === 'delete'"
            ></q-select>
          </q-td>
        </template>
        <template v-slot:body-cell-Amount="{ col, row, rowIndex }">
          <q-td :props="{ col }">
            <q-input
              v-bind="QInputProps"
              :ref="(el) => (inputRefs[`Amount-${rowIndex}`] = el)"
              :rules="rules.Amount"
              v-model="row.Amount"
              type="number"
              :readonly="editType === 'delete'"
            ></q-input>
          </q-td>
        </template>
        <template v-slot:body-cell-MakeUpPrice="{ col, row, rowIndex }">
          <q-td :props="{ col }">
            <q-input
              v-bind="QInputProps"
              :ref="(el) => (inputRefs[`MakeUpPrice-${rowIndex}`] = el)"
              :rules="rules.MakeUpPrice"
              v-model="row.MakeUpPrice"
              type="number"
              :readonly="editType === 'delete'"
            ></q-input>
          </q-td>
        </template>
        <template v-slot:body-cell-SelfPrice="{ col, row, rowIndex }">
          <q-td :props="{ col }">
            <q-input
              v-bind="QInputProps"
              :ref="(el) => (inputRefs[`SelfPrice-${rowIndex}`] = el)"
              :rules="rules.SelfPrice"
              v-model="row.SelfPrice"
              type="number"
              :readonly="editType === 'delete'"
            ></q-input>
          </q-td>
        </template>
        <template v-slot:body-cell-HealthFlag="{ col, row }">
          <q-td :props="{ col }">
            <q-checkbox v-model="row.HealthFlag" :disable="editType === 'delete'"></q-checkbox>
          </q-td>
        </template>
        <template v-slot:body-cell-DailyChargeFlag="{ col, row }">
          <q-td :props="{ col }">
            <q-checkbox v-model="row.DailyChargeFlag" :disable="editType === 'delete'"></q-checkbox>
          </q-td>
        </template>
        <template v-slot:body-cell-DischargeFlag="{ col, row }">
          <q-td :props="{ col }">
            <q-checkbox v-model="row.DischargeFlag" :disable="editType === 'delete'"></q-checkbox>
          </q-td>
        </template>
        <template v-slot:body-cell-action="{ col, rowIndex }">
          <q-td :props="{ col }">
            <q-btn
              color="delete"
              @click="editItem.HbedFixChargeDetails.splice(rowIndex, 1)"
              label="刪除"
              unelevated
              dense
            ></q-btn>
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
          @click="onSaveClick"
        >
        </q-btn>
        <q-btn
          v-if="editType === 'edit'"
          unelevated
          color="primary"
          label="儲存"
          :loading="editLoading"
          :disable="getDataLoading"
          @click="onSaveClick"
        >
        </q-btn>
        <q-btn
          v-if="editType === 'delete'"
          unelevated
          color="negative"
          label="刪除"
          :loading="editLoading"
          :disable="getDataLoading"
          @click="DeleteHbedFixChargeItem(editItem.HbedFixChargeNo)"
        >
        </q-btn>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>
<script setup>
import { ref, reactive, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import {
  getHbedFixChargeItem,
  postHbedFixChargeItem,
  putHbedFixChargeItem,
  deleteHbedFixChargeItem,
  getInChargeList,
  getProcedure,
} from 'api'
import { QInputProps, QSelectProps, QTableProps } from 'utils/quasar-extends/base-props.js'
import { cloneDeep } from 'lodash-es'
import { validate } from 'utils/quasar-extends/validate.js'
import { useRequired } from 'utils/rules.js'
import { useFilter } from 'utils/quasar-extends/use-filter.js'
import setSearchQuery from 'utils/setSearchQuery.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import ProcedureSearchedAdd from 'components/opd/ProcedureSearchedAdd.vue'

const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  editType: String,
  id: [String, Number],
})

const editHeader = computed(() => {
  switch (props.editType) {
    case 'add':
      return `新增病床固定費用管理`
    case 'edit':
      return `編輯病床固定費用管理`
    case 'delete':
      return `刪除病床固定費用管理`
    default:
      return null
  }
})

const columns = [
  { name: 'ProcedureCode', label: '醫令代碼', field: 'ProcedureCode', align: 'left', headerClasses: 'min-w-[200px]' },
  { name: 'ProcedureName', label: '醫令名稱', field: 'ProcedureName', align: 'left', headerClasses: 'min-w-[120px]' },
  { name: 'InchargeNo', label: '收費項目', field: 'InchargeNo', align: 'left', headerClasses: 'min-w-[120px]' },
  { name: 'Amount', label: '數量', field: 'Amount', align: 'left' },
  { name: 'MakeUpPrice', label: '健保差價', field: 'MakeUpPrice', align: 'left' },
  { name: 'SelfPrice', label: '自費價', field: 'SelfPrice', align: 'left' },
  { name: 'HealthFlag', label: '健保否', field: 'HealthFlag', align: 'center' },
  { name: 'DailyChargeFlag', label: '日結過帳', field: 'DailyChargeFlag', align: 'center' },
  { name: 'DischargeFlag', label: '出院過帳', field: 'DischargeFlag', align: 'center' },
  { name: 'action', label: '操作', field: 'action', align: 'center', headerClasses: 'min-w-[60px]' },
]

const initData = {}
initData.detail = {
  ProcedureCode: null,
  ProcedureName: null,
  InchargeNo: null,
  Amount: 1,
  MakeUpPrice: null,
  SelfPrice: null,
  HealthFlag: false,
  DailyChargeFlag: false,
  DischargeFlag: false,
}
const editItem = reactive({
  HbedFixChargeNo: null,
  HbedFixChargeName: null,
  HbedFixChargeDetails: [cloneDeep(initData.detail)],
})

const getDataLoading = ref(false)
const GetHbedFixChargeItem = async () => {
  try {
    getDataLoading.value = true
    const res = await getHbedFixChargeItem(props.id)
    Object.assign(editItem, res.data)
  } catch (err) {
    console.log(err)
  } finally {
    getDataLoading.value = false
  }
}

const onAddRowClick = () => {
  editItem.HbedFixChargeDetails.push(cloneDeep(initData.detail))
}

const inputRefs = reactive({})
const rules = {
  HbedFixChargeNo: useRequired({ title: '固定費用代碼', type: 'input' }),
  HbedFixChargeName: useRequired({ title: '固定費用名稱', type: 'input' }),
  ProcedureCode: useRequired({ title: '醫令代碼', type: 'select' }),
  InchargeNo: useRequired({ title: '收費項目', type: 'select' }),
  Amount: useRequired({ title: '數量', type: 'input' }),
  MakeUpPrice: useRequired({ title: '健保差價', type: 'input' }),
  SelfPrice: useRequired({ title: '自費價', type: 'input' }),
}

const onSaveClick = async () => {
  const { result, errorInputRef } = validate(inputRefs)

  if (result === false) {
    errorInputRef.focus()
    return
  }

  switch (props.editType) {
    case 'add':
      PostHbedFixChargeItem(editItem)
      break
    case 'edit':
      PutHbedFixChargeItem(editItem)
      break
  }
}

const editLoading = ref(false)
const PostHbedFixChargeItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await postHbedFixChargeItem(editItem)
    $q.notify({
      type: 'positive',
      message: '新增病床固定費用管理成功',
      position: 'top',
    })
    onDialogOK()
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '新增病床固定費用管理失敗：' + typeof error.data === 'string' ? error.data : JSON.stringify(error.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const PutHbedFixChargeItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await putHbedFixChargeItem(editItem)
    $q.notify({
      type: 'positive',
      message: '編輯病床固定費用管理成功',
      position: 'top',
    })
    onDialogOK()
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '編輯病床固定費用管理失敗：' + typeof error.data === 'string' ? error.data : JSON.stringify(error.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const DeleteHbedFixChargeItem = async (id) => {
  try {
    editLoading.value = true
    const res = await deleteHbedFixChargeItem(id)
    $q.notify({
      type: 'positive',
      message: '刪除病床固定費用管理成功',
      position: 'top',
    })
    onDialogOK()
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '刪除病床固定費用管理失敗：' + typeof error.data === 'string' ? error.data : JSON.stringify(error.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const inChargeItems = ref([])
const GetInChargeList = async () => {
  try {
    const res = await getInChargeList()
    inChargeItems.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const procedureFilter = (searchString, searchKeys) => {
  const str = searchKeys
    .reduce((filterArray, key) => {
      if (isValidSearchValue(searchString)) {
        switch (key) {
          case 'ProcedureCode':
            return filterArray.concat(setOdataFilter({ key, value: searchString, operator: 'startswith' }))
          case 'ProcedureCname':
          case 'ProcedureEname':
            return filterArray.concat(setOdataFilter({ key, value: searchString, operator: 'contains' }))
          default:
            return filterArray
        }
      } else {
        return filterArray
      }
    }, [])
    .join(' or ')

  return str ? `(${str}) and Status eq true` : 'Status eq true'
}

const filterCount = ref(0)
const filterLoading = ref(false)
const procedureFilterKeys = ['ProcedureCode', 'ProcedureCname']
const procedureItems = ref([])
const GetProcedure = async (searchString, isProcedureCodeItemsLess50 = false) => {
  // 取得醫令時優先搜尋 ProcedureCode ，若 items 不滿 50 才接著搜尋藥品名稱
  if (!isProcedureCodeItemsLess50) filterCount.value++
  const selfFilterCount = filterCount.value
  const searchKeys = isProcedureCodeItemsLess50 ? procedureFilterKeys.slice(1) : procedureFilterKeys.slice(0, 1)

  try {
    const query = setSearchQuery({
      $top: 50,
      $filter: procedureFilter(searchString, searchKeys),
    })
    const res = await getProcedure(query)
    if (selfFilterCount === filterCount.value) {
      const resultItems = res.data.Items
      if (isProcedureCodeItemsLess50) {
        procedureItems.value = procedureItems.value.concat(resultItems)
      } else {
        procedureItems.value = resultItems
      }
    }
  } catch (err) {
    console.log(err)
  } finally {
    if (selfFilterCount === filterCount.value) filterCount.value = 0
  }
}

const { filterItems: procedureFilterItems, filterHandler } = useFilter(
  {
    items: procedureItems,
    filterKeys: ['ProcedureCode', 'ProcedureCname'],
  },
  () => {
    filterLoading.value = false
  }
)

const procedureFilterHandler = async (val, update) => {
  await GetProcedure(val)
  if (procedureItems.value.length < 50) await GetProcedure(val, true)
  filterHandler(val, update)
}

const onProcedureSelect = (opt, row) => {
  row.ProcedureCode = opt.ProcedureCode
  row.ProcedureId = opt.ProcedureId
  row.ProcedureName = opt.ProcedureCname
}

const addProcedureSearched = (row) => {
  //02YA0Z0
  const dialog = $q
    .dialog({
      component: ProcedureSearchedAdd,
    })
    .onOk((addProcedureSearched) => {
      row.ProcedureCode = addProcedureSearched.ProcedureCode
      row.ProcedureName = addProcedureSearched.ProcedureCname
      dialog.hide()
    })
}

const init = () => {
  if (props.id) GetHbedFixChargeItem()
  GetInChargeList()
}
init()
</script>

