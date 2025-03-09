<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss>
    <my-dialog-content :header="editHeader" width="1280px" @close="onDialogCancel" :loading="getDataLoading">
      <div v-if="editType === 'delete'" class="text-negative mb-1">是否確定刪除此醫令診療項目管理？</div>
      <my-input-group>
        <my-input-wrapper label="支付編號">
          <q-input v-bind="QInputProps" v-model="editItem.支付編號" :readonly="editType === 'delete'"> </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="診療/照護/材料項目">
          <q-input v-bind="QInputProps" v-model="editItem.診療照護材料項目" :readonly="editType === 'delete'">
          </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="支付點數">
          <q-input v-bind="QInputProps" v-model="editItem.支付點數" :readonly="editType === 'delete'"> </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="特殊照護群組">
          <q-input v-bind="QInputProps" v-model="editItem.特殊照護群組" :readonly="editType === 'delete'"> </q-input>
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
// import {
//   getServiceProcedureItem,
//   postServiceProcedureItem,
//   putServiceProcedureItem,
//   deleteServiceProcedureItem,
// } from 'api'
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
      return `新增醫令診療項目管理`
    case 'edit':
      return `編輯醫令診療項目管理`
    case 'delete':
      return `刪除醫令診療項目管理`
    default:
      return null
  }
})

const editItem = reactive({
  支付編號: null,
  診療照護材料項目: null,
  支付點數: null,
  特殊照護群組: null,
})

const getDataLoading = ref(false)
const GetServiceProcedureItem = async () => {
  getDataLoading.value = true
  const { data } = await getServiceProcedureItem(props.id)
  if (data) Object.assign(editItem, data)
  getDataLoading.value = false
}

const inputRefs = reactive({})
const rules = {}

const editLoading = ref(false)
const callApi = async (param) => {
  editLoading.value = true

  const api = {
    add: postServiceProcedureItem,
    edit: putServiceProcedureItem,
    delete: deleteServiceProcedureItem,
  }

  let error
  try {
    await api[props.editType](param)
  } catch (err) {
    error = err
  }

  $q.notify({
    type: error ? 'negative' : 'positive',
    message: editHeader.value + (!error ? '成功' : `失敗：${JSON.stringify(error.response.data)}`),
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
  callApi(editItem.Id)
}

const init = () => {
  if (props.id) GetServiceProcedureItem()
}
init()
</script>

