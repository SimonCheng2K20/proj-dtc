<template>
  <q-dialog ref="dialogRef">
    <my-dialog-content :header="header" width="600px" @close="onDialogCancel">
      <div v-if="editType === 'delete'" class="text-negative mb-1">是否確定刪除此就醫類別？</div>
      <my-input-group class="grid gap-2">
        <my-input-wrapper label="就醫類別代碼" required-mark>
          <q-input
            v-bind="QInputProps"
            :ref="(el) => (inputRefs.No = el)"
            :rules="rules.No"
            v-model="editItem.No"
            :readonly="editType !== 'add'"
          >
          </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="就醫類別名稱">
          <q-input v-bind="QInputProps" v-model="editItem.Text" :readonly="editType === 'delete'"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="就醫序號">
          <q-select
            v-bind="QSelectProps"
            v-model="editItem.Medtype"
            :options="medtypeItems"
            option-label="label"
            option-value="value"
            emit-value
            map-options
            :readonly="editType === 'delete'"
          ></q-select>
        </my-input-wrapper>
      </my-input-group>

      <template #actions>
        <q-btn unelevated color="grey" label="取消" @click="onDialogCancel" />
        <q-btn
          v-if="editType === 'add'"
          unelevated
          color="secondary"
          label="新增"
          :loading="loading"
          @click="onSaveClick"
        />
        <q-btn
          v-if="editType === 'edit'"
          unelevated
          color="primary"
          label="儲存"
          :loading="loading"
          @click="onSaveClick"
        />
        <q-btn
          v-if="editType === 'delete'"
          unelevated
          color="negative"
          label="刪除"
          :loading="loading"
          @click="onDeleteClick"
        />
      </template>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { QInputProps, QSelectProps } from 'utils/quasar-extends/base-props'
import { validate } from 'utils/quasar-extends/validate.js'
import { useRequired } from 'utils/rules.js'
import { postCommonDataItem, putCommonDataItem, deleteCommonDataItem } from 'api'
import { cloneDeep } from 'lodash-es'

const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  editType: String,
  category: String,
  data: {
    type: Object,
    default: () => ({
      No: null,
      Text: null,
      Medtype: null,
    }),
  },
})

const editItem = reactive({ ...cloneDeep(props.data), Category: props.category })

const header = computed(() => {
  switch (props.editType) {
    case 'add':
      return `新增就醫類別`
    case 'edit':
      return `編輯就醫類別`
    case 'delete':
      return `刪除就醫類別`
    default:
      return null
  }
})

const inputRefs = reactive({})
const rules = {
  No: useRequired({ label: `就醫類別代碼`, type: 'input' }),
  Text: useRequired({ label: `就醫類別名稱`, type: 'input' }),
}

const loading = ref(false)
const callApi = async (param) => {
  loading.value = true

  const api = {
    add: postCommonDataItem,
    edit: putCommonDataItem,
    delete: deleteCommonDataItem,
  }

  let error
  try {
    await api[props.editType](param)
  } catch (err) {
    error = err
  }

  $q.notify({
    type: error ? 'negative' : 'positive',
    message: header.value + (error ? '失敗' : '成功'),
    position: 'top',
  })

  if (!error) {
    onDialogOK()
  }

  loading.value = false
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
  callApi(`Category(${editItem.Category}),No(${editItem.No})`)
}

const medtypeItems = [
  { label: '不累計', value: 0 },
  { label: '累計', value: 1 },
]
</script>

