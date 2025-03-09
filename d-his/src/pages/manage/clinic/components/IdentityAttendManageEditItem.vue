<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss>
    <my-dialog-content :header="editHeader" width="1280px" @close="onDialogCancel" :loading="getDataLoading">
      <div v-if="editType === 'delete'" class="text-negative mb-1">是否確定刪除此就診身分？</div>
      <my-input-group class="grid gap-2">
        <my-input-wrapper label="投保類別" required-mark>
          <q-select
            v-bind="QSelectProps"
            v-model="editItem.Category"
            :ref="(el) => (inputRefs.Category = el)"
            :rules="rules.Category"
            :options="identityCategoryItems"
            option-label="Name"
            option-value="No"
            map-options
            emit-value
            :readonly="editType === 'delete'"
          ></q-select>
        </my-input-wrapper>
        <my-input-wrapper label="就診身分名稱" required-mark>
          <q-input
            v-bind="QInputProps"
            :ref="(el) => (inputRefs.Identity = el)"
            :rules="rules.Identity"
            v-model="editItem.Identity"
            :readonly="editType === 'delete'"
          >
          </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="免部分負擔代碼">
          <q-input v-bind="QInputProps" v-model="editItem.PartialCode" :readonly="editType === 'delete'"> </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="部分負擔金額">
          <q-input v-bind="QInputProps" v-model="editItem.PartiaFee" :readonly="editType === 'delete'"> </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="啟用狀態">
          <q-select
            v-bind="QSelectProps"
            v-model="editItem.Active"
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
        >
        </q-btn>
        <q-btn
          v-if="editType === 'delete'"
          unelevated
          color="negative"
          label="刪除"
          :loading="editLoading"
          :disable="getDataLoading"
          @click="DeleteIdentityAttendItem(editItem.Id)"
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
  getIdentityAttendItem,
  postIdentityAttendItem,
  putIdentityAttendItem,
  deleteIdentityAttendItem,
  getIdentityCategoryList,
} from 'api'
import { QSelectProps, QInputProps } from 'utils/quasar-extends/base-props.js'
import { validate } from 'utils/quasar-extends/validate.js'
import { useRequired } from 'utils/rules.js'
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
      return `新增就診身分`
    case 'edit':
      return `編輯就診身分`
    case 'delete':
      return `刪除就診身分`
    default:
      return null
  }
})

const editItem = reactive({
  Category: null,
  Identity: null,
  PartialCode: null,
  PartiaFee: null,
  Active: true,
})

const getDataLoading = ref(false)
const GetIdentityAttendItem = async () => {
  try {
    getDataLoading.value = true
    const res = await getIdentityAttendItem(props.id)
    Object.assign(editItem, res.data)
  } catch (err) {
    console.log(err)
  } finally {
    getDataLoading.value = false
  }
}

const inputRefs = reactive({})
const rules = {
  Category: useRequired({ title: '投保類別', type: 'select' }),
  Identity: useRequired({ title: '就診身分名稱', type: 'input' }),
}

const onSaveClick = async () => {
  const { result, errorInputRef } = validate(inputRefs)

  if (result === false) {
    errorInputRef.focus()
    return
  }

  switch (props.editType) {
    case 'add':
      PostIdentityAttendItem(editItem)
      break
    case 'edit':
      PutIdentityAttendItem(editItem)
      break
  }
}

const editLoading = ref(false)
const PostIdentityAttendItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await postIdentityAttendItem(editItem)
    $q.notify({
      type: 'positive',
      message: '新增就診身分成功',
      position: 'top',
    })
    onDialogOK()
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '新增就診身分失敗：' + typeof error.data === 'string' ? error.data : JSON.stringify(error.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const PutIdentityAttendItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await putIdentityAttendItem(editItem)
    $q.notify({
      type: 'positive',
      message: '編輯就診身分成功',
      position: 'top',
    })
    onDialogOK()
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '編輯就診身分失敗：' + typeof error.data === 'string' ? error.data : JSON.stringify(error.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const DeleteIdentityAttendItem = async (id) => {
  try {
    editLoading.value = true
    const res = await deleteIdentityAttendItem(id)
    $q.notify({
      type: 'positive',
      message: '刪除就診身分成功',
      position: 'top',
    })
    onDialogOK()
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '刪除就診身分失敗：' + typeof error.data === 'string' ? error.data : JSON.stringify(error.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const identityCategoryItems = ref([])
const GetIdentityCategoryList = async () => {
  try {
    const res = await getIdentityCategoryList()
    identityCategoryItems.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const init = () => {
  if (props.id) GetIdentityAttendItem()
  GetIdentityCategoryList()
}
init()
</script>

