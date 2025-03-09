<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss>
    <my-dialog-content :header="editHeader" width="1280px" @close="onDialogCancel" :loading="getDataLoading">
      <div v-if="editType === 'delete'" class="text-negative mb-1">是否確定刪除此收據類別？</div>
      <my-input-group class="grid gap-2">
        <my-input-wrapper label="收據類別代碼" required-mark>
          <q-input
            v-bind="QInputProps"
            :ref="(el) => (inputRefs.Code = el)"
            :rules="rules.Code"
            v-model="editItem.Code"
            :readonly="editType !== 'add'"
          >
          </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="收據類別名稱">
          <q-input v-bind="QInputProps" v-model="editItem.Name" :readonly="editType === 'delete'"> </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="門診會計科目">
          <q-input v-bind="QInputProps" v-model="editItem.AccOpd" :readonly="editType === 'delete'"> </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="急診會計科目">
          <q-input v-bind="QInputProps" v-model="editItem.AccEr" :readonly="editType === 'delete'"> </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="住院會計科目">
          <q-input v-bind="QInputProps" v-model="editItem.AccIpd" :readonly="editType === 'delete'"> </q-input>
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
          @click="DeleteOpdReceiptCategoryItem(editItem.Code)"
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
  getOpdReceiptCategoryItem,
  postOpdReceiptCategoryItem,
  putOpdReceiptCategoryItem,
  deleteOpdReceiptCategoryItem,
} from 'api'
import { validate } from 'utils/quasar-extends/validate.js'
import { useRequired } from 'utils/rules.js'
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
      return `新增收據類別`
    case 'edit':
      return `編輯收據類別`
    case 'delete':
      return `刪除收據類別`
    default:
      return null
  }
})

const editItem = reactive({
  Code: null,
  Name: null,
  AccOpd: null,
  AccEr: null,
  AccIpd: null,
})

const getDataLoading = ref(false)
const GetOpdReceiptCategoryItem = async () => {
  try {
    getDataLoading.value = true
    const res = await getOpdReceiptCategoryItem(props.id)
    Object.assign(editItem, res.data)
  } catch (err) {
    console.log(err)
  } finally {
    getDataLoading.value = false
  }
}

const inputRefs = reactive({})
const rules = {
  Code: useRequired({ title: '收據代碼', type: 'input' }),
}

const onSaveClick = async () => {
  const { result, errorInputRef } = validate(inputRefs)

  if (result === false) {
    errorInputRef.focus()
    return
  }

  switch (props.editType) {
    case 'add':
      PostOpdReceiptCategoryItem(editItem)
      break
    case 'edit':
      PutOpdReceiptCategoryItem(editItem)
      break
  }
}

const editLoading = ref(false)
const PostOpdReceiptCategoryItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await postOpdReceiptCategoryItem(editItem)
    $q.notify({
      type: 'positive',
      message: '新增收據類別成功',
      position: 'top',
    })
    onDialogOK()
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '新增收據類別失敗：' + typeof error.data === 'string' ? error.data : JSON.stringify(error.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const PutOpdReceiptCategoryItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await putOpdReceiptCategoryItem(editItem)
    $q.notify({
      type: 'positive',
      message: '編輯收據類別成功',
      position: 'top',
    })
    onDialogOK()
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '編輯收據類別失敗：' + typeof error.data === 'string' ? error.data : JSON.stringify(error.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const DeleteOpdReceiptCategoryItem = async (id) => {
  try {
    editLoading.value = true
    const res = await deleteOpdReceiptCategoryItem(id)
    $q.notify({
      type: 'positive',
      message: '刪除收據類別成功',
      position: 'top',
    })
    onDialogOK()
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '刪除收據類別失敗：' + typeof error.data === 'string' ? error.data : JSON.stringify(error.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const init = () => {
  if (props.id) GetOpdReceiptCategoryItem()
}
init()
</script>

