<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss>
    <my-dialog-content :header="editHeader" @close="onDialogCancel" :loading="getDataLoading">
      <div v-if="editType === 'delete'" class="text-negative mb-1">是否確定刪除此藥房資料？</div>
      <my-input-group class="grid gap-2">
        <my-input-wrapper label="藥房編號" required-mark>
          <q-input
            v-bind="QInputProps"
            :ref="(el) => (inputRefs.PharmacyId = el)"
            :rules="rules.PharmacyId"
            lazy-rules
            v-model="editItem.PharmacyId"
            :disable="editType === 'edit'"
            :readonly="editType === 'delete'"
          ></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="藥房名稱">
          <q-input v-bind="QInputProps" v-model="editItem.CName" :readonly="editType === 'delete'"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="藥房地址">
          <q-input v-bind="QInputProps" v-model="editItem.Place" :readonly="editType === 'delete'"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="啟用狀態">
          <q-select
            v-bind="QSelectProps"
            v-model="editItem.Status"
            :options="activeStatusNumberItems"
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
        <q-btn v-if="editType === 'add'" unelevated color="secondary" label="新增" :loading="editLoading" @click="onSaveClick"></q-btn>
        <q-btn v-if="editType === 'edit'" unelevated color="primary" label="儲存" :loading="editLoading" @click="onSaveClick"></q-btn>
        <q-btn
          v-if="editType === 'delete'"
          unelevated
          color="negative"
          label="刪除"
          :loading="editLoading"
          @click="DeleteDrugStoreItem(editItem.PharmacyId)"
        ></q-btn>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { getDrugStoreItem, postDrugStoreItem, putDrugStoreItem, deleteDrugStoreItem } from 'api'
import { QInputProps, QSelectProps } from 'utils/quasar-extends/base-props.js'
import { activeStatusNumberItems } from 'utils/options.js'

const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  editType: String,
  id: [String, Number],
})

const editHeader = computed(() => {
  switch (props.editType) {
    case 'add':
      return `新增藥房資料`
    case 'edit':
      return `編輯藥房資料`
    case 'delete':
      return `刪除藥房資料`
    default:
      return null
  }
})

const editItem = reactive({
  PharmacyId: null,
  CName: null,
  Place: null,
  Status: 1,
})

const getDataLoading = ref(false)
const GetDrugStoreItem = async () => {
  try {
    getDataLoading.value = true
    const res = await getDrugStoreItem(props.id)
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
  PharmacyId: [(val) => (val !== null && val !== '') || '請輸入藥房編號'],
}

const validate = async () => {
  let errorInputRef = null

  const validationArr = Object.entries(inputRefs).map(([key, inputRef]) => {
    if (!!inputRef) {
      const validatedResult = inputRef.validate()
      if (errorInputRef === null && validatedResult === false) errorInputRef = inputRef
      return validatedResult
    } else {
      return null
    }
  })

  if (validationArr.includes(false) === false) return true
  else {
    errorInputRef.focus()
    return false
  }
}

const onSaveClick = async () => {
  if ((await validate()) === false) return

  switch (props.editType) {
    case 'add':
      PostDrugStoreItem(editItem)
      break
    case 'edit':
      PutDrugStoreItem(editItem)
      break
  }
}

const editLoading = ref(false)
const PostDrugStoreItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await postDrugStoreItem(editItem)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '新增藥房資料成功',
        position: 'top',
      })
      onDialogOK()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '新增藥房資料失敗：' + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const PutDrugStoreItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await putDrugStoreItem(editItem)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '編輯藥房資料成功',
        position: 'top',
      })
      onDialogOK()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '編輯藥房資料失敗：' + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const DeleteDrugStoreItem = async (id) => {
  try {
    editLoading.value = true
    const res = await deleteDrugStoreItem(id)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '刪除藥房資料成功',
        position: 'top',
      })
      onDialogOK()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '刪除藥房資料失敗：' + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const init = () => {
  if (!!props.id) GetDrugStoreItem()
}
init()
</script>

