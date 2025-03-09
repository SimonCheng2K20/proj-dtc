<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss>
    <my-dialog-content :header="editHeader" width="1280px" @close="onDialogCancel" :loading="getDataLoading">
      <div v-if="editType === 'delete'" class="text-negative mb-1">是否確定刪除此住院折扣身分？</div>
      <my-input-group class="grid gap-2">
        <my-input-wrapper label="住院折扣身分代碼">
          <q-input
            v-bind="QInputProps"
            :ref="(el) => (inputRefs.Code = el)"
            :rules="rules.Code"
            v-model="editItem.Code"
            :readonly="editType === 'delete'"
          >
          </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="住院折扣身分名稱">
          <q-input v-bind="QInputProps" v-model="editItem.Name" :readonly="editType === 'delete'"> </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="折扣金額">
          <q-input v-bind="QInputProps" v-model="editItem.Amount" type="number" :readonly="editType === 'delete'">
          </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="啟用狀態">
          <q-select
            v-bind="QSelectProps"
            v-model="editItem.Actived"
            :options="activeStatusItems"
            option-label="label"
            option-value="value"
            emit-value
            map-options
            :readonly="editType === 'delete'"
          >
          </q-select>
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
<script setup="">
import { ref, reactive, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
// import {
//   getIdentityDiscountsItem,
//   postIdentityDiscountsItem,
//   putIdentityDiscountsItem,
//   deleteIdentityDiscountsItem,
// } from 'api'
import { validate } from 'utils/quasar-extends/validate.js'
import { useRequired } from 'utils/rules.js'
import { QInputProps, QSelectProps } from 'utils/quasar-extends/base-props.js'
import { activeStatusItems } from 'utils/options.js'

const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  editType: String,
  id: [String, Number],
})

const editHeader = computed(() => {
  switch (props.editType) {
    case 'add':
      return `新增住院折扣身分`
    case 'edit':
      return `編輯住院折扣身分`
    case 'delete':
      return `刪除住院折扣身分`
    default:
      return null
  }
})

const editItem = reactive({
  Code: null,
  Name: null,
  Amount: null,
  Actived: true,
})

const getDataLoading = ref(false)
const GetIdentityDiscountsItem = async () => {
  getDataLoading.value = true
  const { data } = await getIdentityDiscountsItem(props.id)
  if (data) Object.assign(editItem, data)
  getDataLoading.value = false
}

const inputRefs = reactive({})
const rules = {
  Code: useRequired({ title: '住院折扣身分代碼' }),
}

const editLoading = ref(false)
const callApi = async (param) => {
  editLoading.value = true

  const api = {
    add: postIdentityDiscountsItem,
    edit: putIdentityDiscountsItem,
    delete: deleteIdentityDiscountsItem,
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
  callApi(editItem.Code)
}

const init = () => {
  if (props.id) GetIdentityDiscountsItem()
}
init()
</script>

