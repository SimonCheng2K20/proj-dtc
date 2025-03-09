<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss>
    <my-dialog-content :header="editHeader" @close="onDialogCancel" :loading="getDataLoading">
      <div v-if="editType === 'delete'" class="text-negative mb-1">是否確定刪除此外送單位？</div>
      <my-input-group class="grid gap-2">
        <my-input-wrapper label="外送單位代碼" required-mark>
          <q-input v-bind="QInputProps" :ref="(el) => (inputRefs.No = el)" :rules="rules.No" v-model="editItem.No" :readonly="editType !== 'add'"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="外送單位名稱">
          <q-input v-bind="QInputProps" v-model="editItem.Text" :readonly="editType === 'delete'"></q-input>
        </my-input-wrapper>
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
        <q-btn v-if="editType === 'edit'" unelevated color="primary" label="儲存" :loading="editLoading" :disable="getDataLoading" @click="onSaveClick"></q-btn>
        <q-btn
          v-if="editType === 'delete'"
          unelevated
          color="negative"
          label="刪除"
          :loading="editLoading"
          :disable="getDataLoading"
          @click="DeleteCommonDataItem"
        >
        </q-btn>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>
<script setup>
import { ref, reactive, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { getCommonDataItem, postCommonDataItem, putCommonDataItem, deleteCommonDataItem } from 'api'
import { QInputProps } from 'utils/quasar-extends/base-props.js'

const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  editType: String,
  id: [String, Number],
})

const editHeader = computed(() => {
  switch (props.editType) {
    case 'add':
      return `新增外送單位`
    case 'edit':
      return `編輯外送單位`
    case 'delete':
      return `刪除外送單位`
    default:
      return null
  }
})

const editItem = reactive({
  Category: 'deliveryUnit',
  No: null,
  Text: null,
})

const getDataLoading = ref(false)
const GetCommonDataItem = async () => {
  try {
    getDataLoading.value = true
    const res = await getCommonDataItem(props.id)
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
  No: [(val) => (val !== null && null !== '') || '請輸入外送單位代碼'],
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

  switch (props.editType) {
    case 'add':
      PostCommonDataItem(editItem)
      break
    case 'edit':
      PutCommonDataItem(editItem)
      break
  }
}

const editLoading = ref(false)
const PostCommonDataItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await postCommonDataItem(editItem)
    $q.notify({
      type: 'positive',
      message: '新增外送單位成功',
      position: 'top',
    })
    onDialogOK()
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '新增外送單位失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const PutCommonDataItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await putCommonDataItem(editItem)
    $q.notify({
      type: 'positive',
      message: '編輯外送單位成功',
      position: 'top',
    })
    onDialogOK()
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '編輯外送單位失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const DeleteCommonDataItem = async () => {
  try {
    editLoading.value = true
    const res = await deleteCommonDataItem(props.id)
    $q.notify({
      type: 'positive',
      message: '刪除外送單位成功',
      position: 'top',
    })
    onDialogOK()
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '刪除外送單位失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const init = () => {
  if (!!props.id) GetCommonDataItem()
}
init()
</script>

