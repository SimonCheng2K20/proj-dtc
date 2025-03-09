<template>
  <q-dialog ref="dialogRef" full-width no-backdrop-dismiss>
    <my-dialog-content :header="editHeader" width="1280px" @close="onDialogCancel" :loading="getDataLoading">
      <div v-if="editType === 'delete'" class="text-negative mb-1">是否確定刪除此帳號？</div>

      <div class="grid grid-cols-2 place-items-start justify-items-stretch gap-2">
        <my-input-group class="grid gap-2">
          <my-input-wrapper label="帳號" required-mark>
            <q-input
              v-bind="QInputProps"
              v-model="editItem.No"
              :ref="(el) => (inputRefs.No = el)"
              :rules="rules.No"
              :readonly="editType === 'delete'"
            ></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="姓名" required-mark>
            <q-input
              v-bind="QInputProps"
              v-model="editItem.Name"
              :ref="(el) => (inputRefs.Name = el)"
              :rules="rules.Name"
              :readonly="editType === 'delete'"
            ></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="隸屬科別" required-mark>
            <q-select
              v-bind="QSelectProps"
              :ref="(el) => (inputRefs.DepartmentNo = el)"
              :rules="rules.DepartmentNo"
              v-model="editItem.DepartmentNo"
              :options="departmentItems"
              option-label="Name"
              option-value="No"
              map-options
              emit-value
              :readonly="editType === 'delete'"
            >
            </q-select>
          </my-input-wrapper>
          <my-input-wrapper label="聯絡電話">
            <q-input v-bind="QInputProps" v-model="editItem.Phone" :readonly="editType === 'delete'"></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="Email">
            <q-input v-bind="QInputProps" v-model="editItem.Email" :readonly="editType === 'delete'"></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="帳號到期日">
            <my-date-input v-bind="QInputProps" v-model="editItem.Expiration" :readonly="editType === 'delete'">
            </my-date-input>
          </my-input-wrapper>
          <my-input-wrapper label="啟用狀態" required-mark>
            <q-select
              v-bind="QSelectProps"
              :ref="(el) => (inputRefs.Status = el)"
              :rules="rules.Status"
              v-model="editItem.Status"
              :options="statusItems"
              option-label="Name"
              option-value="Id"
              map-options
              emit-value
              :readonly="editType === 'delete'"
            >
            </q-select>
          </my-input-wrapper>
        </my-input-group>

        <div>
          <div class="font-bold">授權角色</div>
          <q-option-group
            v-model="editItem.RoleNos"
            :options="roleItems.map((item) => ({ ...item, label: item.Name, value: item.No }))"
            color="primary"
            type="checkbox"
          ></q-option-group>
        </div>
      </div>

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
          @click="DeleteAccountItem"
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
  getAccountItem,
  postAccountItem,
  putAccountItem,
  deleteAccountItem,
  getDepartmentDropdown,
  getRole,
  getAccountStatusList,
} from 'api'
import { QInputProps, QSelectProps } from 'utils/quasar-extends/base-props.js'
import { validate } from 'utils/quasar-extends/validate.js'
import { useRequired } from 'utils/rules.js'
import setSearchQuery from 'utils/setSearchQuery'
import { cloneDeep, pick } from 'lodash-es'

const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  editType: String,
  id: [String, Number],
})

const editHeader = computed(() => {
  switch (props.editType) {
    case 'add':
      return `新增帳號`
    case 'edit':
      return `編輯帳號`
    case 'delete':
      return `刪除帳號`
    default:
      return null
  }
})

const initData = {}
initData.editItem = {
  No: null,
  Name: null,
  Phone: null,
  Email: null,
  Expiration: null,
  Status: null,
  DepartmentNo: null,
  RoleNos: [],
}
const editItem = reactive(cloneDeep(initData.editItem))

const getDataLoading = ref(false)
const GetAccountItem = async () => {
  try {
    getDataLoading.value = true
    const res = await getAccountItem(props.id)
    Object.assign(editItem, res.data)
  } catch (err) {
    console.log(err)
  } finally {
    getDataLoading.value = false
  }
}

const inputRefs = reactive({})
const rules = {
  No: useRequired({ title: '帳號', type: 'input' }),
  Name: useRequired({ title: '姓名', type: 'input' }),
  DepartmentNo: useRequired({ title: '隸屬科別', type: 'select' }),
  Status: useRequired({ title: '啟用狀態', type: 'select' }),
}

const onSaveClick = async () => {
  const { result, errorInputRef } = validate(inputRefs)

  if (result === false) {
    errorInputRef.focus()
    return
  }

  const cloneEditItem = cloneDeep(editItem)

  switch (props.editType) {
    case 'add':
      PostAccountItem(pick(cloneEditItem, Object.keys(initData.editItem)))
      break
    case 'edit':
      PutAccountItem(pick(cloneEditItem, Object.keys(initData.editItem)))
      break
  }
}

const editLoading = ref(false)
const PostAccountItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await postAccountItem(editItem)
    $q.notify({
      type: 'positive',
      message: '新增帳號成功',
      position: 'top',
    })
    onDialogOK()
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '新增帳號失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const PutAccountItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await putAccountItem(editItem)
    if (res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '編輯帳號成功',
        position: 'top',
      })
      onDialogOK()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '編輯帳號失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const DeleteAccountItem = async () => {
  try {
    editLoading.value = true
    const res = await deleteAccountItem(props.id)
    $q.notify({
      type: 'positive',
      message: '刪除帳號成功',
      position: 'top',
    })
    onDialogOK()
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '刪除帳號失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const departmentItems = ref([])
const GetDepartmentDropdown = async () => {
  try {
    const query = setSearchQuery({ layer: 2 })
    const res = await getDepartmentDropdown(query)
    departmentItems.value = res.data.Items
  } catch (error) {
    console.log(error)
  }
}

const roleItems = ref([])
const GetRole = async () => {
  try {
    const res = await getRole()
    roleItems.value = res.data.Items
  } catch (error) {
    console.log(error)
  }
}

const statusItems = ref([])
const GetAccountStatus = async () => {
  try {
    const res = await getAccountStatusList()
    statusItems.value = res.data
  } catch (err) {
    console.log(err)
  }
}

const init = () => {
  if (props.id) GetAccountItem()
  GetRole()
  GetDepartmentDropdown()
  GetAccountStatus()
}
init()
</script>

