<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss full-width>
    <my-dialog-content :header="editHeader" width="1100px" @close="onDialogCancel" :loading="getDataLoading">
      <div class="mb-2 font-bold" style="color: #0a2548" v-if="props.editType === 'delete'">
        是否確定刪除此筆科室公用組套?
      </div>
      <my-input-group class="grid grid-cols-1">
        <div class="mb-2">
          <my-input-wrapper label="部門" class="mb-2">
            <q-select
              v-bind="QSelectProps"
              v-model="editItem.ParentDepartmentName"
              :options="departmentLayer1FilterItems"
              option-label="Name"
              option-value="value"
              map-options
              emit-value
              use-input
              @filter="onDepertmentLayer1Filter"
              @input-value="filterLoading = true"
              @update:model-value="onSelect1"
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
                      <div v-html="scope.opt.filterLabel || `${scope.opt.No} - ${scope.opt.Name}`"></div>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </my-input-wrapper>
          <my-input-wrapper label="科別" class="mb-2">
            <q-select
              v-bind="QSelectProps"
              v-model="editItem.DepartmentName"
              :options="departmentLayer2FilterItems"
              option-label="Name"
              option-value="value"
              map-options
              emit-value
              use-input
              @filter="onDepertmentLayer2Filter"
              @input-value="filterLoading = true"
              @update:model-value="onSelect2"
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
                      <div v-html="scope.opt.filterLabel || `${scope.opt.No} - ${scope.opt.Name}`"></div>
                    </q-item-label>
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </my-input-wrapper>
          <my-input-wrapper label="疾病中文名稱" class="mb-2">
            <q-input v-bind="QInputProps" v-model="editItem.CName" :readonly="editType === 'delete'"> </q-input>
          </my-input-wrapper>
          <my-input-wrapper label="疾病英文名稱" class="mb-2">
            <q-input v-bind="QInputProps" v-model="editItem.EName" :readonly="editType === 'delete'"> </q-input>
          </my-input-wrapper>
          <my-input-wrapper label="快捷鍵">
            <KeysItems :keys="shortcutArr" class="mx-2"></KeysItems>
            <q-btn
              v-if="editType !== 'delete'"
              color="primary"
              label="設置快捷鍵"
              @click="toSetPreset"
              unelevated
            ></q-btn>
          </my-input-wrapper>
        </div>
        <IcdTable v-model:rows="editItem.DepPresetDiagnosisItems" :columns="columns" :title="'手術診斷'"></IcdTable>
        <div class="my-2 font-bold">診斷說明 :</div>
        <q-input
          v-bind="QInputProps"
          v-model="editItem.Note"
          style="border: blue 1px solid"
          filled
          type="textarea"
          :readonly="editType === 'delete'"
        />
      </my-input-group>
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
        ></q-btn>
        <q-btn
          v-if="editType === 'edit'"
          unelevated
          color="primary"
          label="儲存"
          :loading="editLoading"
          :disable="getDataLoading"
          @click="onSaveClick"
        ></q-btn>
        <q-btn
          v-if="editType === 'delete'"
          unelevated
          color="negative"
          label="確定刪除"
          :loading="editLoading"
          :disable="getDataLoading"
          @click="DeleteDepPresetItem(editItem.Id)"
        >
        </q-btn>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, toRef, computed, watchEffect, provide } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { getDepPresetItem, postDepPresetItem, putDepPresetItem, deleteDepPresetItem } from 'api'
import { QInputProps, QSelectProps } from 'utils/quasar-extends/base-props.js'
import { cloneDeep } from 'lodash-es'
import { useFilter } from 'utils/quasar-extends/use-filter.js'
import { usePresetStore } from 'stores/preset.js'

import IcdTable from 'components/opd/IcdTable.vue'
import SetPreset from 'components/preset/SetPreset.vue'
import KeysItems from 'components/preset/KeysItems.vue'

const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()
const presetStore = usePresetStore()

const props = defineProps({
  editType: String,
  id: [String, Number],
  departmentLayer1Items: Array,
  departmentLayer2Items: Array,
})

provide('editType', props.editType)

const editHeader = computed(() => {
  switch (props.editType) {
    case 'add':
      return `新增科室公用組套`
    case 'edit':
      return `編輯科室公用組套`
    case 'delete':
      return `刪除科室公用組套`
    case 'view':
      return `檢視科室公用組套`
    default:
      return null
  }
})
// 預編輯物件資料
const editItem = reactive({
  CreatedDatetime: null,
  ModifyDatetime: null,
  DepartmentName: null,
  ParentDepartmentNo: null,
  ParentDepartmentName: null,
  DepPresetDiagnosisItems: [
    {
      Icd10Eng: null,
      Icd10Cht: null,
      Icd9Eng: null,
      Icd9Cht: null,
      Id: 0,
      Sn: 0,
      Icd10Code: null,
      Icd9Code: null,
    },
  ],
  Id: 0,
  CName: null,
  EName: null,
  Shortcut: null,
  DepartmentNo: null,
  Note: null,
})

const columns = ['index', 'Icd10Code', 'Icd9Code', 'Name', 'action']

// 部門和科別的下拉選單
const filterLoading = ref(false)
let departmentLayer1Items = toRef(props, 'departmentLayer1Items')
let departmentLayer2Items = toRef(props, 'departmentLayer2Items')

const shortcutArr = computed(() => (editItem.Shortcut ? editItem.Shortcut.split(',') : []))
const toSetPreset = () => {
  const dialog = $q
    .dialog({
      component: SetPreset,
      componentProps: {
        shortcut: editItem.Shortcut,
        presetKey: 'PublicDiagnosis',
      },
    })
    .onOk((shortcut) => {
      editItem.Shortcut = shortcut
      dialog.hide()
    })
}

const departmentFilterKeys = ['No', 'Name']
const { filterItems: departmentLayer1FilterItems, filterHandler: onDepertmentLayer1Filter } = useFilter(
  { items: departmentLayer1Items, filterKeys: departmentFilterKeys },
  () => {
    filterLoading.value = false
  }
)

const { filterItems: departmentLayer2FilterItems, filterHandler: onDepertmentLayer2Filter } = useFilter(
  { items: departmentLayer2Items, filterKeys: departmentFilterKeys },
  () => {
    filterLoading.value = false
  }
)

const getDataLoading = ref(false)
const GetDepPresetItem = async () => {
  try {
    getDataLoading.value = true
    const res = await getDepPresetItem(props.id)
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

const onSelect1 = (val) => {
  editItem.ParentDepartmentNo = val.No
  editItem.ParentDepartmentName = val.Name
}
const onSelect2 = (val) => {
  editItem.DepartmentNo = val.No
  editItem.DepartmentName = val.Name
}

const onSaveClick = async () => {
  if ((await validate()) === false) return

  const cloneEditItem = cloneDeep(editItem)
  cloneEditItem.Status = '2'

  switch (props.editType) {
    case 'add':
      PostDepPresetItem(cloneEditItem)
      break
    case 'edit':
      PutDepPresetItem(cloneEditItem)
      break
  }
}

const editLoading = ref(false)
const PostDepPresetItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await postDepPresetItem(editItem)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '新增科室公用組套成功',
        position: 'top',
      })
      onDialogOK()
    }
    presetStore.getPreset('PublicDiagnosis')
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '新增科室公用組套失敗：' + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const PutDepPresetItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await putDepPresetItem(editItem)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '編輯科室公用組套成功',
        position: 'top',
      })
      onDialogOK()
    }
    presetStore.getPreset('PublicDiagnosis')
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '編輯科室公用組套失敗：' + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const DeleteDepPresetItem = async (id) => {
  try {
    editLoading.value = true
    const res = await deleteDepPresetItem(id)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '刪除科室公用組套成功',
        position: 'top',
      })
      onDialogOK()
    }
    presetStore.getPreset('PublicDiagnosis')
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '刪除科室公用組套失敗：' + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const dialogOK = () => {
  onDialogOK()
}

const init = () => {
  if (!!props.id) GetDepPresetItem()
}
init()
</script>

<style lang="scss" scoped>
.list-top-bar {
  background: #cbe3f3;
  color: black;
  font-weight: bold;
}
</style>

