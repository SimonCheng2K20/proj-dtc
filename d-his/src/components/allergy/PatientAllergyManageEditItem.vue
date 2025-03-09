<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss>
    <my-dialog-content :header="editHeader" width="1280px" @close="onDialogCancel" :loading="getDataLoading">
      <div v-if="editType === 'delete'" class="text-negative mb-1">是否確定刪除此藥品過敏記錄？</div>
      <my-input-group class="grid gap-2">
        <my-input-wrapper label="藥品代碼" required-mark>
          <q-select
            v-bind="QSelectProps"
            :ref="(el) => (inputRefs.MedicineId = el)"
            :rules="rules.MedicineId"
            v-model="editItem.MedicineId"
            :options="medicineFilterItems"
            option-label="MedicineId"
            use-input
            lazy-rules
            :readonly="editType === 'delete'"
            @input-value="filterLoading = true"
            @filter="medicineFilterHandler"
            @clear="Object.assign(editItem, cloneDeep(medicineInitData))"
            @update:model-value="(val) => (!!val ? onMedicineSelect(val, editItem) : null)"
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
        <my-input-wrapper label="藥品名稱"><q-input v-bind="QInputProps" :model-value="editItem.EName || editItem.CName" readonly></q-input></my-input-wrapper>
        <my-input-wrapper label="備註">
          <q-input v-bind="QInputProps" v-model="editItem.Remark" type="textarea" :readonly="editType === 'delete'"></q-input>
        </my-input-wrapper>
      </my-input-group>
      <template #actions>
        <q-btn unelevated color="grey" label="取消" @click="onDialogCancel"></q-btn>
        <q-btn v-if="editType === 'add'" unelevated color="secondary" label="新增" :loading="editLoading" :disable="getDataLoading" @click="onSaveClick">
        </q-btn>
        <q-btn v-if="editType === 'edit'" unelevated color="primary" label="儲存" :loading="editLoading" :disable="getDataLoading" @click="onSaveClick"></q-btn>
        <q-btn
          v-if="editType === 'delete'"
          unelevated
          color="negative"
          label="刪除"
          :loading="editLoading"
          :disable="getDataLoading"
          @click="DeletePatientAllergyItem(editItem.Id)"
        >
        </q-btn>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>
<script setup>
import { ref, reactive, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { getPatientAllergyItem, postPatientAllergyItem, putPatientAllergyItem, deletePatientAllergyItem, getDrug } from 'api'
import { QInputProps, QSelectProps } from 'utils/quasar-extends/base-props.js'
import { debounce, cloneDeep } from 'lodash-es'
import { useFilter } from 'utils/quasar-extends/use-filter.js'
import setSearchQuery from 'utils/setSearchQuery.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import { useAuthStore } from 'stores/auth'

const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()
const authStore = useAuthStore()

const props = defineProps({
  editType: String,
  id: [String, Number],
  patientId: String,
})

const editHeader = computed(() => {
  switch (props.editType) {
    case 'add':
      return `新增藥品過敏記錄`
    case 'edit':
      return `編輯藥品過敏記錄`
    case 'delete':
      return `刪除藥品過敏記錄`
    default:
      return null
  }
})

const editItem = reactive({
  MedicineId: null,
  EName: null,
  CName: null,
  Remark: null,
})

const getDataLoading = ref(false)
const GetPatientAllergyItem = async () => {
  try {
    getDataLoading.value = true
    const res = await getPatientAllergyItem(props.id)
    if (res.status === 200) {
      Object.assign(editItem, res.data)
    }
  } catch (err) {
    console.log(err)
  } finally {
    getDataLoading.value = false
  }
}

const inputRefs = reactive({})
const rules = {
  MedicineId: [(val) => (val !== null && val !== '') || '請選擇藥品代碼'],
}

const validate = async () => {
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

const onSaveClick = async () => {
  if ((await validate()) === false) return

  const cloneEditItem = cloneDeep(editItem)
  cloneEditItem.Writer = authStore.userData.No
  cloneEditItem.PatientId = props.patientId

  switch (props.editType) {
    case 'add':
      PostPatientAllergyItem(cloneEditItem)
      break
    case 'edit':
      PutPatientAllergyItem(cloneEditItem)
      break
  }
}

const editLoading = ref(false)
const PostPatientAllergyItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await postPatientAllergyItem(editItem)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '新增藥品過敏記錄成功',
        position: 'top',
      })
      onDialogOK()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '新增藥品過敏記錄失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const PutPatientAllergyItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await putPatientAllergyItem(editItem)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '編輯藥品過敏記錄成功',
        position: 'top',
      })
      onDialogOK()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '編輯藥品過敏記錄失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const DeletePatientAllergyItem = async (id) => {
  try {
    editLoading.value = true
    const res = await deletePatientAllergyItem(id)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '刪除藥品過敏記錄成功',
        position: 'top',
      })
      onDialogOK()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '刪除藥品過敏記錄失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
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
const medicineFilterKeys = ['MedicineId', 'EName', 'CName']
const medicineItems = ref([])
const GetDrug = async (searchString, isMedicineIdItemsLess50 = false) => {
  // 取得藥品時優先搜尋 MedicineId ，若 items 不滿 50 才接著搜尋藥品名稱
  if (!isMedicineIdItemsLess50) filterCount.value++
  const selfFilterCount = filterCount.value
  const searchKeys = isMedicineIdItemsLess50 ? medicineFilterKeys.slice(1) : medicineFilterKeys.slice(0, 1)
  try {
    const query = setSearchQuery({
      $top: isMedicineIdItemsLess50 ? 50 - medicineItems.value.length : 50,
      $filter: medicineFilter(searchString, searchKeys),
    })
    const res = await getDrug(query)
    if (selfFilterCount === filterCount.value) {
      const resultItems = res.data.Items
      if (isMedicineIdItemsLess50) {
        medicineItems.value = medicineItems.value.concat(resultItems)
      } else {
        medicineItems.value = resultItems
      }
    }
  } catch (error) {
    console.log(error)
  } finally {
    if (selfFilterCount === filterCount.value) filterCount.value = 0
  }
}

const { filterItems: medicineFilterItems, filterHandler } = useFilter({ items: medicineItems, filterKeys: medicineFilterKeys }, () => {
  filterLoading.value = false
})

const medicineFilterHandler = debounce(async (val, update) => {
  await GetDrug(val)
  if (medicineItems.value.length < 50) await GetDrug(val, true)

  filterHandler(val, update)
}, 500)

const onMedicineSelect = (opt, row) => {
  row.MedicineId = opt.MedicineId
  row.EName = opt.EName
  row.CName = opt.CName
}

const init = () => {
  if (props.id) GetPatientAllergyItem()
}
init()
</script>

