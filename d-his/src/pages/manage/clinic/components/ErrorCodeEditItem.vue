<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss>
    <my-dialog-content :header="editHeader" width="1280px" @close="onDialogCancel" :loading="getDataLoading">
      <div v-if="editType === 'delete'" class="text-negative mb-1">是否確定刪除此異常代碼？</div>
      <my-input-group class="grid gap-2" style>
        <my-input-wrapper label="尚未取得就醫序號">
          <q-input v-bind="QInputProps" v-model="editItem.NoSeqNum" :readonly="editType === 'delete'"> </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="已取得就醫序號">
          <q-input v-bind="QInputProps" v-model="editItem.SeqNum" :readonly="editType === 'delete'"> </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="異常原因">
          <q-input v-bind="QInputProps" v-model="editItem.ErrorText" :readonly="editType === 'delete'"> </q-input>
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
          @click="onDeleteClick"
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
  getNhiCardErrorCodeItem,
  postNhiCardErrorCodeItem,
  putNhiCardErrorCodeItem,
  deleteNhiCardErrorCodeItem,
} from 'api'
import { validate } from 'utils/quasar-extends/validate.js'
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
      return `新增異常代碼`
    case 'edit':
      return `編輯異常代碼`
    case 'delete':
      return `刪除異常代碼`
    default:
      return null
  }
})

const editItem = reactive({
  NoSeqNum: null,
  SeqNum: null,
  ErrorText: null,
})

const getDataLoading = ref(false)
const GetNhiCardErrorCodeItem = async () => {
  getDataLoading.value = true
  const { data } = await getNhiCardErrorCodeItem(props.id)
  if (data) Object.assign(editItem, data)
  getDataLoading.value = false
}

const inputRefs = reactive({})
const rules = {}

const editLoading = ref(false)
const callApi = async (param) => {
  editLoading.value = true

  const api = {
    add: postNhiCardErrorCodeItem,
    edit: putNhiCardErrorCodeItem,
    delete: deleteNhiCardErrorCodeItem,
  }

  let error
  try {
    await api[props.editType](param)
  } catch (err) {
    error = err
  }

  $q.notify({
    type: error ? 'negative' : 'positive',
    message: editHeader.value + (!error ? '成功' : `失敗：${JSON.stringify(error.data)}`),
    position: 'top',
  })

  if (!error) {
    onDialogOK()
  }

  editLoading.value = false
}

const onSaveClick = () => {
  const { result, errorInputRef } = validate(inputRefs)

  if (!result) {
    errorInputRef.focus()
    return
  }

  callApi(editItem)
}

const onDeleteClick = () => {
  callApi(editItem.NoSeqNum)
}

const init = () => {
  if (props.id) GetNhiCardErrorCodeItem()
}
init()
</script>

