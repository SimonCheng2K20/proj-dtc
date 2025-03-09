<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss>
    <my-dialog-content :header="editHeader" width="1280px" @close="onDialogCancel" :loading="getDataLoading">
      <div v-if="editType === 'delete'" class="text-negative mb-1">是否確定刪除此未用藥原因？</div>
      <my-input-group class="grid gap-2">
        <my-input-wrapper label="未用藥原因代碼" required-mark>
          <q-input
            v-bind="QInputProps"
            :ref="(el) => (inputRefs.No = el)"
            :rules="rules.No"
            v-model="editItem.No"
            :readonly="editType === 'delete'"
          >
          </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="未用藥原因名稱"
          ><q-input v-bind="QInputProps" v-model="editItem.Text" :readonly="editType === 'delete'"></q-input
        ></my-input-wrapper>
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
          label="刪除"
          :loading="editLoading"
          :disable="getDataLoading"
          @click="DeleteCommonDataItem(`Category(reason),No(${editItem.No})`)"
        ></q-btn>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>
<script setup>
import { ref, reactive, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { getCommonDataItem, postCommonDataItem, putCommonDataItem, deleteCommonDataItem } from 'api'
import { QInputProps } from 'utils/quasar-extends/base-props.js'
import { validate } from 'utils/quasar-extends/validate.js'

const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  editType: String,
  id: [String, Number],
})

const editHeader = computed(() => {
  switch (props.editType) {
    case 'add':
      return `新增未用藥原因`
    case 'edit':
      return `編輯未用藥原因`
    case 'delete':
      return `刪除未用藥原因`
    default:
      return null
  }
})

const editItem = reactive({
  Category: 'reason',
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
  No: [(val) => (val !== null && null !== '') || '請輸入未用藥原因代碼'],
}

const onSaveClick = async () => {
  const { result, errorInputRef } = validate(inputRefs)

  if (result === false) {
    errorInputRef.focus()
    return
  }

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
      message: '新增未用藥原因成功',
      position: 'top',
    })
    onDialogOK()
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '新增未用藥原因失敗：' + typeof error.data === 'string' ? error.data : JSON.stringify(error.data),
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
      message: '編輯未用藥原因成功',
      position: 'top',
    })
    onDialogOK()
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '編輯未用藥原因失敗：' + typeof error.data === 'string' ? error.data : JSON.stringify(error.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const DeleteCommonDataItem = async (id) => {
  try {
    editLoading.value = true
    const res = await deleteCommonDataItem(id)
    $q.notify({
      type: 'positive',
      message: '刪除未用藥原因成功',
      position: 'top',
    })
    onDialogOK()
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '刪除未用藥原因失敗：' + typeof error.data === 'string' ? error.data : JSON.stringify(error.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const init = () => {
  if (props.id) GetCommonDataItem()
}
init()
</script>

