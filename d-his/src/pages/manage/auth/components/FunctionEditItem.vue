<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss>
    <my-dialog-content :header="editHeader" width="1280px" @close="onDialogCancel" :loading="getDataLoading">
      <div v-if="editType === 'delete'" class="text-negative mb-1">是否確定刪除此功能？</div>
      <my-input-group class="grid gap-2">
        <my-input-wrapper label="功能代碼" required-mark>
          <q-input
            v-bind="QInputProps"
            v-model="editItem.No"
            :ref="(el) => (inputRefs.No = el)"
            :rules="rules.No"
            :readonly="editType !== 'add'"
          ></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="功能名稱">
          <q-input v-bind="QInputProps" v-model="editItem.Name" :readonly="editType === 'delete'"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="啟用狀態">
          <q-select
            v-bind="QSelectProps"
            v-model="editItem.IsActive"
            :options="activeStatusItems"
            option-label="label"
            option-value="value"
            map-options
            emit-value
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
        ></q-btn>
        <q-btn
          v-if="editType === 'delete'"
          unelevated
          color="negative"
          label="刪除"
          :loading="editLoading"
          :disable="getDataLoading"
          @click="DeleteFunctionItem"
        >
        </q-btn>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>
<script setup>
import { ref, reactive, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { getFunctionItem, postFunctionItem, putFunctionItem, deleteFunctionItem } from 'api'
import { QInputProps, QSelectProps } from 'utils/quasar-extends/base-props.js'
import { activeStatusItems } from 'utils/options.js'
import { validate } from 'utils/quasar-extends/validate.js'
import { useRequired } from 'utils/rules.js'

const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  editType: String,
  id: [String, Number],
})

const editHeader = computed(() => {
  switch (props.editType) {
    case 'add':
      return `新增功能`
    case 'edit':
      return `編輯功能`
    case 'delete':
      return `刪除功能`
    default:
      return null
  }
})

const editItem = reactive({
  No: null,
  Name: null,
  IsActive: true,
})

const getDataLoading = ref(false)
const GetFunctionItem = async () => {
  try {
    getDataLoading.value = true
    const res = await getFunctionItem(props.id)
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
  No: useRequired({ title: '功能代碼', type: 'input' }),
}

const onSaveClick = async () => {
  const { result, errorInputRef } = validate(inputRefs)

  if (result === false) {
    errorInputRef.focus()
    return
  }

  switch (props.editType) {
    case 'add':
      PostFunctionItem(editItem)
      break
    case 'edit':
      PutFunctionItem(editItem)
      break
  }
}

const editLoading = ref(false)
const PostFunctionItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await postFunctionItem(editItem)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '新增功能成功',
        position: 'top',
      })
      onDialogOK()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '新增功能失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const PutFunctionItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await putFunctionItem(editItem)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '編輯功能成功',
        position: 'top',
      })
      onDialogOK()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '編輯功能失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const DeleteFunctionItem = async () => {
  try {
    editLoading.value = true
    const res = await deleteFunctionItem(props.id)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '刪除功能成功',
        position: 'top',
      })
      onDialogOK()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '刪除功能失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const init = () => {
  if (!!props.id) GetFunctionItem()
}
init()
</script>

