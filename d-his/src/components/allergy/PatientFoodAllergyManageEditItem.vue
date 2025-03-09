<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss>
    <my-dialog-content :header="editHeader" width="1280px" @close="onDialogCancel" :loading="getDataLoading">
      <div v-if="editType === 'delete'" class="text-negative mb-1">是否確定刪除此食物過敏記錄？</div>
      <my-input-group class="grid gap-2">
        <my-input-wrapper label="食品名稱" required-mark>
          <q-input
            v-bind="QInputProps"
            :ref="(el) => (inputRefs.FoodName = el)"
            :rules="rules.FoodName"
            v-model="editItem.FoodName"
            :readonly="editType === 'delete'"
          ></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="備註">
          <q-input v-bind="QInputProps" v-model="editItem.Remark" :readonly="editType === 'delete'"></q-input>
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
          @click="DeletePatientFoodAllergyItem(editItem.Id)"
        >
        </q-btn>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>
<script setup="">
import { ref, reactive, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { getPatientFoodAllergyItem, postPatientFoodAllergyItem, putPatientFoodAllergyItem, deletePatientFoodAllergyItem } from 'api'
import { QInputProps } from 'utils/quasar-extends/base-props.js'
import { cloneDeep } from 'lodash-es'
import { useAuthStore } from 'stores/auth'

const authStore = useAuthStore()
const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  editType: String,
  id: [String, Number],
  patientId: String,
})

const editHeader = computed(() => {
  switch (props.editType) {
    case 'add':
      return `新增食物過敏記錄`
    case 'edit':
      return `編輯食物過敏記錄`
    case 'delete':
      return `刪除食物過敏記錄`
    default:
      return null
  }
})

const editItem = reactive({
  FoodName: null,
  Remark: null,
})

const getDataLoading = ref(false)
const GetPatientFoodAllergyItem = async () => {
  try {
    getDataLoading.value = true
    const res = await getPatientFoodAllergyItem(props.id)
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
  FoodName: [(val) => (val !== null && val !== '') || '請輸入食品名稱'],
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
      PostPatientFoodAllergyItem(cloneEditItem)
      break
    case 'edit':
      PutPatientFoodAllergyItem(cloneEditItem)
      break
  }
}

const editLoading = ref(false)
const PostPatientFoodAllergyItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await postPatientFoodAllergyItem(editItem)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '新增食物過敏記錄成功',
        position: 'top',
      })
      onDialogOK()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '新增食物過敏記錄失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const PutPatientFoodAllergyItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await putPatientFoodAllergyItem(editItem)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '編輯食物過敏記錄成功',
        position: 'top',
      })
      onDialogOK()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '編輯食物過敏記錄失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const DeletePatientFoodAllergyItem = async (id) => {
  try {
    editLoading.value = true
    const res = await deletePatientFoodAllergyItem(id)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '刪除食物過敏記錄成功',
        position: 'top',
      })
      onDialogOK()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '刪除食物過敏記錄失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const init = () => {
  if (props.id) GetPatientFoodAllergyItem()
}
init()
</script>

