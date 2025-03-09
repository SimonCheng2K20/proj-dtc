<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss full-width>
    <my-dialog-content header="檢視科室公用組套" width="1100px" @close="onDialogCancel" :loading="getDataLoading">
      <my-input-group class="grid grid-cols-1">
        <IcdTable
          v-model:rows="editItem.DepPresetDiagnosisItems"
          :columns="columns"
          :title="'手術診斷'"
          readonly
        ></IcdTable>
        <div class="my-2 font-bold">診斷說明 :</div>
        <q-input v-bind="QInputProps" v-model="editItem.Note" filled type="textarea" readonly />
      </my-input-group>
      <template #actions>
        <q-btn unelevated color="grey" label="取消" @click="onDialogCancel"></q-btn>
        <q-btn
          unelevated
          color="primary"
          label="帶入診斷"
          @click="onDialogOK(editItem.DepPresetDiagnosisItems)"
        ></q-btn>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useDialogPluginComponent } from 'quasar'
import { getDepPresetItem } from 'api'
import { QInputProps } from 'utils/quasar-extends/base-props.js'

import IcdTable from 'components/opd/IcdTable.vue'

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  editType: String,
  id: [String, Number],
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

const columns = ['index', 'Icd10Code', 'Icd9Code', 'Name']

const pagination = ref({
  page: 1,
  rowsPerPage: -1,
})

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
const rules = {}

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

const init = () => {
  if (!!props.id) GetDepPresetItem()
}
init()
</script>

