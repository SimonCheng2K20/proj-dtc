<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss full-width>
    <my-dialog-content :header="editHeader" width="1280px" @close="onDialogCancel" :loading="getDataLoading">
      <div v-if="editType === 'delete'" class="text-negative mb-1">是否確定刪除此藥品交互作用資料？</div>
      <my-input-group class="grid grid-cols-3 gap-2">
        <my-input-wrapper label="ATC碼">
          <q-select
            v-bind="QSelectProps"
            :ref="inputRefs.AtcCode"
            :rules="rules.AtcCode"
            v-model="editItem.AtcCode"
            :options="filterItems"
            option-label="AtcCode"
            use-input
            @input-value="filterLoading = true"
            @filter="(val, update) => medicineFilterHandler(val, update, 'AtcCode')"
            @clear="Object.assign(editItem, cloneDeep({ AtcCode: null, MedicineId: null, NhiCode: null }))"
            @update:model-value="(val) => (!!val ? onMedicineSelect(val, editItem) : null)"
            :readonly="editType === 'delete'"
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
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>
                    <div v-html="scope.opt.filterLabel"></div>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </my-input-wrapper>
        <my-input-wrapper label="健保代碼">
          <q-select
            v-bind="QSelectProps"
            :ref="inputRefs.NhiCode"
            :rules="rules.NhiCode"
            v-model="editItem.NhiCode"
            :options="filterItems"
            option-label="NhiCode"
            use-input
            @input-value="filterLoading = true"
            @filter="(val, update) => medicineFilterHandler(val, update, 'NhiCode')"
            @clear="Object.assign(editItem, cloneDeep({ AtcCode: null, MedicineId: null, NhiCode: null }))"
            @update:model-value="(val) => (!!val ? onMedicineSelect(val, editItem) : null)"
            :readonly="editType === 'delete'"
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
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>
                    <div v-html="scope.opt.filterLabel"></div>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </my-input-wrapper>
        <my-input-wrapper label="院內代碼">
          <q-select
            v-bind="QSelectProps"
            :ref="inputRefs.MedicineId"
            :rules="rules.MedicineId"
            v-model="editItem.MedicineId"
            :options="filterItems"
            option-label="MedicineId"
            use-input
            @input-value="filterLoading = true"
            @filter="(val, update) => medicineFilterHandler(val, update, 'MedicineId')"
            @clear="Object.assign(editItem, cloneDeep({ AtcCode: null, MedicineId: null, NhiCode: null }))"
            @update:model-value="(val) => (!!val ? onMedicineSelect(val, editItem) : null)"
            :readonly="editType === 'delete'"
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
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>
                    <div v-html="scope.opt.filterLabel"></div>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </my-input-wrapper>
      </my-input-group>

      <q-table
        class="mt-2"
        v-bind="QTableProps"
        :rows="editItem.DrugInteractDetails"
        :columns="detailColumns"
        row-key="Id"
        :loading="getDataLoading"
      >
        <template #top v-if="editType !== 'delete'">
          <q-space></q-space>
          <q-btn color="add" icon="add" dense unelevated @click="onAddRowClick"> </q-btn>
        </template>
        <template v-slot:body-cell-DrugInteractAtcCode="{ col, row }">
          <q-td :props="{ col }">
            <q-select
              v-bind="QSelectProps"
              :ref="(el) => (inputRefs[`DrugInteractAtcCode-${rowIndex}`] = el)"
              :rules="rules.AtcCode"
              v-model="row.DrugInteractAtcCode"
              :options="medicineItems"
              option-label="AtcCode"
              use-input
              @input-value="filterLoading = true"
              @filter="(val, update) => medicineFilterHandler(val, update, 'AtcCode')"
              @clear="
                Object.assign(
                  row,
                  cloneDeep({ DrugInteractAtcCode: null, DrugInteractMedicineId: null, DrugInteractNhiCode: null })
                )
              "
              @update:model-value="(val) => (!!val ? onMedicineSelect(val, row) : null)"
              :readonly="editType === 'delete'"
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
                  :disable="rows.find((item) => item.DrugInteractAtcCode === scope.opt.ActCode) !== undefined"
                >
                  <q-item-section>
                    <q-item-label>
                      <div v-html="scope.opt.filterLabel"></div>
                    </q-item-label>
                    <q-item-label
                      v-if="rows.find((item) => item.DrugInteractAtcCode === scope.opt.ActCode) !== undefined"
                      class="text-negative"
                    >
                      此 藥品 已存在
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-td>
        </template>
        <template v-slot:body-cell-DrugInteractNhiCode="{ col, row }">
          <q-td :props="{ col }">
            <q-select
              v-bind="QSelectProps"
              :ref="(el) => (inputRefs[`DrugInteractNhiCode-${rowIndex}`] = el)"
              :rules="rules.NhiCode"
              v-model="row.DrugInteractNhiCode"
              :options="medicineItems"
              option-label="NhiCode"
              use-input
              @input-value="filterLoading = true"
              @filter="(val, update) => medicineFilterHandler(val, update, 'NhiCode')"
              @clear="
                Object.assign(
                  row,
                  cloneDeep({ DrugInteractAtcCode: null, DrugInteractMedicineId: null, DrugInteractNhiCode: null })
                )
              "
              @update:model-value="(val) => (!!val ? onMedicineSelect(val, row) : null)"
              :readonly="editType === 'delete'"
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
                  :disable="rows.find((item) => item.DrugInteractNhiCode === scope.opt.NhiCode) !== undefined"
                >
                  <q-item-section>
                    <q-item-label>
                      <div v-html="scope.opt.filterLabel"></div>
                    </q-item-label>
                    <q-item-label
                      v-if="rows.find((item) => item.DrugInteractNhiCode === scope.opt.NhiCode) !== undefined"
                      class="text-negative"
                    >
                      此 藥品 已存在
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-td>
        </template>
        <template v-slot:body-cell-DrugInteractMedicineId="{ col, row }">
          <q-td :props="{ col }">
            <q-select
              v-bind="QSelectProps"
              :ref="(el) => (inputRefs[`DrugInteractMedicineId-${rowIndex}`] = el)"
              :rules="rules.MedicineId"
              v-model="row.DrugInteractMedicineId"
              :options="medicineItems"
              option-label="MedicineId"
              use-input
              lazy-rules
              @input-value="filterLoading = true"
              @filter="(val, update) => medicineFilterHandler(val, update, 'MedicineId')"
              @clear="
                Object.assign(
                  row,
                  cloneDeep({ DrugInteractAtcCode: null, DrugInteractMedicineId: null, DrugInteractNhiCode: null })
                )
              "
              @update:model-value="(val) => (!!val ? onMedicineSelect(val, row) : null)"
              :readonly="editType === 'delete'"
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
                  :disable="rows.find((item) => item.DrugInteractMedicineId === scope.opt.MedicineId) !== undefined"
                >
                  <q-item-section>
                    <q-item-label>
                      <div v-html="scope.opt.filterLabel"></div>
                    </q-item-label>
                    <q-item-label
                      v-if="rows.find((item) => item.DrugInteractMedicineId === scope.opt.MedicineId) !== undefined"
                      class="text-negative"
                    >
                      此 藥品 已存在
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </q-td>
        </template>
        <template v-slot:body-cell-Effect="{ col, row }">
          <q-td :props="{ col }">
            <q-input v-bind="QInputProps" v-model="row.Effect" :readonly="editType === 'delete'"></q-input>
          </q-td>
        </template>
        <template v-slot:body-cell-Mechanism="{ col, row }">
          <q-td :props="{ col }">
            <q-input v-bind="QInputProps" v-model="row.Mechanism" :readonly="editType === 'delete'"></q-input>
          </q-td>
        </template>
        <template v-slot:body-cell-Description="{ col, row }">
          <q-td :props="{ col }">
            <q-input v-bind="QInputProps" v-model="row.Description" :readonly="editType === 'delete'"></q-input>
          </q-td>
        </template>
        <template v-slot:body-cell-action="{ col, rowIndex }">
          <q-td :props="{ col }">
            <q-btn
              color="delete"
              @click="editItem.DrugInteractDetails.splice(rowIndex, 1)"
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
          @click="DeleteDrugInteractItem(editItem.Id)"
        >
        </q-btn>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>
<script setup>
import { ref, reactive, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { getDrugInteractItem, postDrugInteractItem, putDrugInteractItem, deleteDrugInteractItem, getDrug } from 'api'
import { QInputProps, QSelectProps, QTableProps } from 'utils/quasar-extends/base-props.js'
import { validate } from 'utils/quasar-extends/validate.js'
import { useRequired } from 'utils/rules.js'
import { useFilter } from 'utils/quasar-extends/use-filter.js'
import setSearchQuery from 'utils/setSearchQuery.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import { cloneDeep } from 'lodash-es'

const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  editType: String,
  id: [String, Number],
})

const editHeader = computed(() => {
  switch (props.editType) {
    case 'add':
      return `新增藥品交互作用資料`
    case 'edit':
      return `編輯藥品交互作用資料`
    case 'delete':
      return `刪除藥品交互作用資料`
    default:
      return null
  }
})

const detailColumns = computed(() => {
  const arr = [
    { name: 'DrugInteractAtcCode', label: '互斥ATC碼', field: 'DrugInteractAtcCode', align: 'left' },
    { name: 'DrugInteractNhiCode', label: '互斥健保代碼', field: 'DrugInteractNhiCode', align: 'left' },
    { name: 'DrugInteractMedicineId', label: '互斥院內代碼', field: 'DrugInteractMedicineId', align: 'left' },
    { name: 'Effect', label: '影響', field: 'Effect', align: 'left' },
    { name: 'Mechanism', label: '機制', field: 'Mechanism', align: 'left' },
    { name: 'Description', label: '說明', field: 'Description', align: 'left' },
  ]

  if (props.editType !== 'delete') {
    arr.push({ name: 'action', label: '操作', field: 'action', align: 'left', headerClasses: 'min-w-[60px]' })
  }

  return arr
})

const initData = {}
initData.DrugInteractDetail = {
  DrugInteractAtcCode: null,
  DrugInteractMedicineId: null,
  DrugInteractNhiCode: null,
  Effect: null,
  Mechanism: null,
  Description: null,
}
const editItem = reactive({
  Id: null,
  AtcCode: null,
  NhiCode: null,
  MedicineId: null,
  DrugInteractDetails: [cloneDeep(initData.DrugInteractDetail)],
})

const getDataLoading = ref(false)
const GetDrugInteractItem = async () => {
  try {
    getDataLoading.value = true
    const res = await getDrugInteractItem(props.id)
    Object.assign(editItem, res.data)
  } catch (err) {
    console.log(err)
  } finally {
    getDataLoading.value = false
  }
}

const onAddRowClick = () => {
  editItem.DrugInteractDetails.push(cloneDeep(initData.DrugInteractDetail))
}

const inputRefs = reactive({})
const rules = {
  AtcCode: useRequired({ title: 'ATC碼', type: 'select' }),
  NhiCode: useRequired({ title: '健保代碼', type: 'select' }),
  MedicineId: useRequired({ title: '院內代碼', type: 'select' }),
}

const onSaveClick = async () => {
  const { result, errorInputRef } = validate(inputRefs)

  if (result === false) {
    errorInputRef.focus()
    return
  }

  switch (props.editType) {
    case 'add':
      PostDrugInteractItem(editItem)
      break
    case 'edit':
      PutDrugInteractItem(editItem)
      break
  }
}

const editLoading = ref(false)
const PostDrugInteractItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await postDrugInteractItem(editItem)
    $q.notify({
      type: 'positive',
      message: '新增藥品交互作用資料成功',
      position: 'top',
    })
    onDialogOK()
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '新增藥品交互作用資料失敗：' + typeof error.data === 'string' ? error.data : JSON.stringify(error.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const PutDrugInteractItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await putDrugInteractItem(editItem)
    $q.notify({
      type: 'positive',
      message: '編輯藥品交互作用資料成功',
      position: 'top',
    })
    onDialogOK()
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '編輯藥品交互作用資料失敗：' + typeof error.data === 'string' ? error.data : JSON.stringify(error.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const DeleteDrugInteractItem = async (id) => {
  try {
    editLoading.value = true
    const res = await deleteDrugInteractItem(id)
    $q.notify({
      type: 'positive',
      message: '刪除藥品交互作用資料成功',
      position: 'top',
    })
    onDialogOK()
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '刪除藥品交互作用資料失敗：' + typeof error.data === 'string' ? error.data : JSON.stringify(error.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const medicineFilter = (searchString, searchKeys) => {
  const str = searchKeys
    .reduce((filterArray, key) => {
      if (isValidSearchValue(searchString)) {
        switch (key) {
          case 'MedicineId':
            return filterArray.concat(setOdataFilter({ key, value: searchString, operator: 'startswith' }))
          case 'CName':
          case 'EName':
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
const filterKey = ref('MedicineId')
const medicineItems = ref([])
const GetDrug = async (searchString) => {
  filterCount.value++
  const selfFilterCount = filterCount.value
  try {
    const query = setSearchQuery({
      $top: 50,
      $filter: medicineFilter(searchString, [filterKey.value]),
    })
    const res = await getDrug(query)
    if (selfFilterCount === filterCount.value) {
      const resultItems = res.data.Items
      medicineItems.value = resultItems
    }
  } catch (error) {
    console.log(error)
  } finally {
    if (selfFilterCount === filterCount.value) filterCount.value = 0
  }
}

const { filterItems, filterHandler } = useFilter(
  { items: medicineItems, filterKeys: computed(() => [filterKey.value]) },
  () => {
    filterLoading.value = false
  }
)

const medicineFilterHandler = async (val, update, key) => {
  filterKey.value = key
  await GetDrug(val)
  filterHandler(val, update)
}

const onMedicineSelect = (opt, item) => {
  item.AtcCode = opt.AtcCode
  item.NhiCode = opt.NhiCode
  item.MedicineId = opt.MedicineId
}

const init = () => {
  if (props.id) GetDrugInteractItem()
}
init()
</script>

