<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss>
    <my-dialog-content :header="editHeader" width="1280px" @close="onDialogCancel" :loading="getDataLoading">
      <div v-if="editType === 'delete'" class="text-negative mb-1">是否確定刪除此系統角色？</div>
      <my-input-group class="grid gap-2">
        <my-input-wrapper label="角色類型">
          <q-select
            v-bind="QSelectProps"
            v-model="editItem.Type"
            :options="roleTypeItems"
            option-label="Name"
            option-value="Id"
            map-options
            emit-value
            :readonly="editType === 'delete'"
          >
          </q-select>
        </my-input-wrapper>
        <my-input-wrapper label="角色代碼" required-mark>
          <q-input
            v-bind="QInputProps"
            :ref="(el) => (inputRefs.No = el)"
            :rules="rules.No"
            v-model="editItem.No"
            :readonly="editType !== 'add'"
          >
          </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="角色名稱">
          <q-input v-bind="QInputProps" v-model="editItem.Name" :readonly="editType === 'delete'"> </q-input>
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
        >
        </q-btn>
        <q-btn
          v-if="editType === 'delete'"
          unelevated
          color="negative"
          label="刪除"
          :loading="editLoading"
          :disable="getDataLoading"
          @click="DeleteRoleItem(editItem.No)"
        >
        </q-btn>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>
<script setup>
import { ref, reactive, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { getRoleItem, postRoleItem, putRoleItem, deleteRoleItem, getRoleTypeList } from 'api'
import { validate } from 'utils/quasar-extends/validate.js'
import { useRequired } from 'utils/rules.js'
import { QSelectProps, QInputProps } from 'utils/quasar-extends/base-props.js'
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
      return `新增系統角色`
    case 'edit':
      return `編輯系統角色`
    case 'delete':
      return `刪除系統角色`
    default:
      return null
  }
})

const editItem = reactive({
  Type: null,
  No: null,
  Name: null,
  IsActive: true,
})

const getDataLoading = ref(false)
const GetRoleItem = async () => {
  try {
    getDataLoading.value = true
    const res = await getRoleItem(props.id)
    Object.assign(editItem, res.data)
  } catch (err) {
    console.log(err)
  } finally {
    getDataLoading.value = false
  }
}

const inputRefs = reactive({})
const rules = {
  No: useRequired({ title: '角色代碼', type: 'input' }),
}

const onSaveClick = async () => {
  const { result, errorInputRef } = validate(inputRefs)

  if (result === false) {
    errorInputRef.focus()
    return
  }

  switch (props.editType) {
    case 'add':
      PostRoleItem(editItem)
      break
    case 'edit':
      PutRoleItem(editItem)
      break
  }
}

const editLoading = ref(false)
const PostRoleItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await postRoleItem(editItem)
    $q.notify({
      type: 'positive',
      message: '新增系統角色成功',
      position: 'top',
    })
    onDialogOK()
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '新增系統角色失敗：' + typeof error.data === 'string' ? error.data : JSON.stringify(error.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const PutRoleItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await putRoleItem(editItem)
    $q.notify({
      type: 'positive',
      message: '編輯系統角色成功',
      position: 'top',
    })
    onDialogOK()
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '編輯系統角色失敗：' + typeof error.data === 'string' ? error.data : JSON.stringify(error.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const DeleteRoleItem = async (id) => {
  try {
    editLoading.value = true
    const res = await deleteRoleItem(id)
    $q.notify({
      type: 'positive',
      message: '刪除系統角色成功',
      position: 'top',
    })
    onDialogOK()
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '刪除系統角色失敗：' + typeof error.data === 'string' ? error.data : JSON.stringify(error.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const roleTypeItems = ref([])
const GetRoleTypeList = async () => {
  try {
    const res = await getRoleTypeList()
    roleTypeItems.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const init = () => {
  if (props.id) GetRoleItem()
  GetRoleTypeList()
}
init()
</script>

