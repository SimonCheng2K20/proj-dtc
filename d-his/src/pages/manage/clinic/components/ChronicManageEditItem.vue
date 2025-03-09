<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss>
    <my-dialog-content :header="editHeader" width="1280px" @close="onDialogCancel" :loading="getDataLoading">
      <div v-if="editType === 'delete'" class="text-negative mb-1">是否確定刪除此特定治療項目？</div>
      <my-input-group class="grid gap-2">
        <my-input-wrapper label="特定治療項目" required-mark>
          <q-select
            v-bind="QSelectProps"
            :ref="(el) => (inputRefs.SpecialCureItem = el)"
            :rules="rules.SpecialCureItem"
            v-model="editItem.SpecialCureItem"
            :options="specialCureItems"
            option-label="Name"
            option-value="No"
            map-options
            emit-value
            :readonly="editType === 'delete'"
          >
          </q-select>
        </my-input-wrapper>
        <my-input-wrapper v-if="editItem.SpecialCureItem === '01'" label="疾病類別" required-mark>
          <q-select
            v-bind="QSelectProps"
            :ref="(el) => (inputRefs.Category = el)"
            :rules="rules.Category"
            v-model="editItem.Category"
            :options="chronicCategoryItems"
            option-label="Name"
            option-value="Category"
            map-options
            emit-value
            :readonly="editType === 'delete'"
          >
          </q-select>
        </my-input-wrapper>
        <my-input-wrapper label="代碼" required-mark>
          <q-input
            v-bind="QInputProps"
            :ref="(el) => (inputRefs.Code = el)"
            :rules="rules.Code"
            v-model="editItem.Code"
            :readonly="editType === 'delete'"
          >
          </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="名稱">
          <q-input v-bind="QInputProps" v-model="editItem.Name" :readonly="editType === 'delete'"> </q-input>
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
          @click="DeleteSpecialCureChronicItem(editItem.Sn)"
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
  getSpecialCureChronicItem,
  postSpecialCureChronicItem,
  putSpecialCureChronicItem,
  deleteSpecialCureChronicItem,
  getSpecialCureList,
  getChronic,
} from 'api'
import { QSelectProps, QInputProps } from 'utils/quasar-extends/base-props.js'
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
      return `新增特定治療項目`
    case 'edit':
      return `編輯特定治療項目`
    case 'delete':
      return `刪除特定治療項目`
    default:
      return null
  }
})

const editItem = reactive({
  SpecialCureItem: null,
  Category: null,
  Code: null,
  Name: null,
})

const getDataLoading = ref(false)
const GetSpecialCureChronicItem = async () => {
  try {
    getDataLoading.value = true
    const res = await getSpecialCureChronicItem(props.id)
    Object.assign(editItem, res.data)
  } catch (err) {
    console.log(err)
  } finally {
    getDataLoading.value = false
  }
}

const inputRefs = reactive({})
const rules = {
  SpecialCureItem: useRequired({ title: '特定治療項目', type: 'select' }),
  Category: useRequired({ title: '疾病類別', type: 'select' }),
  Code: useRequired({ title: '代碼', type: 'input' }),
}

const onSaveClick = async () => {
  const { result, errorInputRef } = validate(inputRefs)

  if (result === false) {
    errorInputRef.focus()
    return
  }

  switch (props.editType) {
    case 'add':
      PostSpecialCureChronicItem(editItem)
      break
    case 'edit':
      PutSpecialCureChronicItem(editItem)
      break
  }
}

const editLoading = ref(false)
const PostSpecialCureChronicItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await postSpecialCureChronicItem(editItem)
    $q.notify({
      type: 'positive',
      message: '新增特定治療項目成功',
      position: 'top',
    })
    onDialogOK()
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '新增特定治療項目失敗：' + typeof error.data === 'string' ? error.data : JSON.stringify(error.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const PutSpecialCureChronicItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await putSpecialCureChronicItem(editItem)
    $q.notify({
      type: 'positive',
      message: '編輯特定治療項目成功',
      position: 'top',
    })
    onDialogOK()
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '編輯特定治療項目失敗：' + typeof error.data === 'string' ? error.data : JSON.stringify(error.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const DeleteSpecialCureChronicItem = async (id) => {
  try {
    editLoading.value = true
    const res = await deleteSpecialCureChronicItem(id)
    $q.notify({
      type: 'positive',
      message: '刪除特定治療項目成功',
      position: 'top',
    })
    onDialogOK()
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '刪除特定治療項目失敗：' + typeof error.data === 'string' ? error.data : JSON.stringify(error.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const specialCureItems = ref([])
const GetSpecialCureList = async () => {
  try {
    const res = await getSpecialCureList()
    specialCureItems.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const chronicCategoryItems = ref([])
const GetChronic = async () => {
  try {
    const res = await getChronic()
    chronicCategoryItems.value = res.data.Items
  } catch (error) {
    console.log(error)
  }
}

const init = () => {
  if (props.id) GetSpecialCureChronicItem()
  GetSpecialCureList()
  GetChronic()
}
init()
</script>

