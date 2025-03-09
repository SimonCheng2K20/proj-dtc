<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss>
    <my-dialog-content :header="editHeader" width="1280px" @close="onDialogCancel" :loading="getDataLoading">
      <div v-if="editType === 'delete'" class="text-negative mb-1">是否確定刪除此科別管理？</div>
      <my-input-group class="grid gap-2" style>
        <my-input-wrapper label="部門名稱">
          <q-select
            v-bind="QSelectProps"
            v-model="editItem.ParentNo"
            :options="departmentItems"
            option-label="Name"
            option-value="No"
            map-options
            emit-value
            :readonly="editType === 'delete'"
          >
          </q-select>
        </my-input-wrapper>
        <my-input-wrapper label="科別代碼">
          <q-input
            v-bind="QInputProps"
            v-model="editItem.No"
            :ref="(el) => (inputRefs.No = el)"
            :rules="rules.No"
            :readonly="editType !== 'add'"
          >
          </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="科別名稱">
          <q-input v-bind="QInputProps" v-model="editItem.Name" :readonly="editType === 'delete'"> </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="申報科別代碼">
          <q-input v-bind="QInputProps" v-model="editItem.DeclaredDepartmentNo" :readonly="editType === 'delete'">
          </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="申報科別名稱">
          <q-input v-bind="QInputProps" v-model="editItem.DeclaredDepartmentName" :readonly="editType === 'delete'">
          </q-input>
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
  getDepartmentItem,
  postDepartmentItem,
  putDepartmentItem,
  deleteDepartmentItem,
  getDepartmentDropdown,
} from 'api'
import { validate } from 'utils/quasar-extends/validate.js'
import { useRequired } from 'utils/rules.js'
import { QSelectProps, QInputProps } from 'utils/quasar-extends/base-props.js'
import { activeStatusItems } from 'utils/options.js'
import setSearchQuery from 'utils/setSearchQuery.js'

const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  editType: String,
  id: [String, Number],
})

const editHeader = computed(() => {
  switch (props.editType) {
    case 'add':
      return `新增科別管理`
    case 'edit':
      return `編輯科別管理`
    case 'delete':
      return `刪除科別管理`
    default:
      return null
  }
})

const editItem = reactive({
  ParentNo: null,
  No: null,
  Name: null,
  DeclaredDepartmentNo: null,
  DeclaredDepartmentName: null,
  IsActive: true,
})

const getDataLoading = ref(false)
const GetDepartmentItem = async () => {
  getDataLoading.value = true
  const { data } = await getDepartmentItem(props.id)
  if (data) Object.assign(editItem, data)
  getDataLoading.value = false
}

const inputRefs = reactive({})
const rules = {
  No: useRequired({ title: '科別代碼', type: 'input' }),
}

const editLoading = ref(false)
const callApi = async (param) => {
  editLoading.value = true

  const api = {
    add: postDepartmentItem,
    edit: putDepartmentItem,
    delete: deleteDepartmentItem,
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
  callApi(editItem.No)
}

const departmentItems = ref([])
const GetDepartmentDropdown = async () => {
  try {
    const query = setSearchQuery({ layer: 1 })
    const res = await getDepartmentDropdown(query)
    if (res.data) departmentItems.value = res.data.Items
  } catch (error) {
    console.log(error)
  }
}

const init = () => {
  if (props.id) GetDepartmentItem()
  GetDepartmentDropdown()
}
init()
</script>

