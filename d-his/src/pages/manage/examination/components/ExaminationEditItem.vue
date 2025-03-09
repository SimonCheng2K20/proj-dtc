<template>
  <q-dialog ref="dialogRef" full-width no-backdrop-dismiss>
    <my-dialog-content :header="editHeader" width="1280px" @close="onDialogCancel" :loading="getDataLoading">
      <div v-if="editType === 'delete'" class="text-negative mb-1">是否確定刪除此檢驗項目？</div>
      <my-input-group class="grid grid-cols-2 gap-2">
        <my-input-wrapper label="醫令代碼">
          <q-input v-bind="QInputProps" v-model="editItem.醫令代碼" :readonly="editType === 'delete'"> </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="醫令名稱">
          <q-input v-bind="QInputProps" v-model="editItem.醫令名稱" :readonly="editType === 'delete'"> </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="項目序號">
          <q-input v-bind="QInputProps" v-model="editItem.項目序號" :readonly="editType === 'delete'"> </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="報告簡稱">
          <q-input v-bind="QInputProps" v-model="editItem.報告簡稱" :readonly="editType === 'delete'"> </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="檢體">
          <q-select
            v-bind="QSelectProps"
            v-model="editItem.檢體"
            :options="specimenItems"
            option-label="Text"
            option-value="No"
            map-options
            emit-value
            :readonly="editType === 'delete'"
          >
          </q-select>
        </my-input-wrapper>
        <my-input-wrapper label="單位">
          <q-input v-bind="QInputProps" v-model="editItem.單位" :readonly="editType === 'delete'"> </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="檢體組別">
          <q-select
            v-bind="QSelectProps"
            v-model="editItem.檢體組別"
            :options="specimenGroupItems"
            option-label="Text"
            option-value="No"
            map-options
            emit-value
            :readonly="editType === 'delete'"
          >
          </q-select>
        </my-input-wrapper>
        <my-input-wrapper label="標準上下限值" class="col-span-full">
          <div class="grid grid-cols-2 gap-2 p-2">
            <my-input-wrapper label="男上限">
              <q-input v-bind="QInputProps" v-model="editItem.男上限" :readonly="editType === 'delete'"> </q-input>
            </my-input-wrapper>
            <my-input-wrapper label="男下限">
              <q-input v-bind="QInputProps" v-model="editItem.男下限" :readonly="editType === 'delete'"> </q-input>
            </my-input-wrapper>
            <my-input-wrapper label="女上限">
              <q-input v-bind="QInputProps" v-model="editItem.女上限" :readonly="editType === 'delete'"> </q-input>
            </my-input-wrapper>
            <my-input-wrapper label="女下限">
              <q-input v-bind="QInputProps" v-model="editItem.女下限" :readonly="editType === 'delete'"> </q-input>
            </my-input-wrapper>
          </div>
        </my-input-wrapper>
        <my-input-wrapper label="資料型態">
          <q-input v-bind="QInputProps" v-model="editItem.資料型態" :readonly="editType === 'delete'"> </q-input>
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
          @click="DeleteExaminationItem(editItem.Id)"
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
  getCommonData /* getExaminationItem, postExaminationItem, putExaminationItem, deleteExaminationItem*/,
} from 'api'
import { validate } from 'utils/quasar-extends/validate.js'
import { useRequired } from 'utils/rules.js'
import { QInputProps, QSelectProps } from 'utils/quasar-extends/base-props.js'
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
      return `新增檢驗項目`
    case 'edit':
      return `編輯檢驗項目`
    case 'delete':
      return `刪除檢驗項目`
    default:
      return null
  }
})

const editItem = reactive({
  醫令代碼: null,
  醫令名稱: null,
  項目序號: null,
  報告簡稱: null,
  檢體: null,
  單位: null,
  檢體組別: null,
  男上限: null,
  男下限: null,
  女上限: null,
  女下限: null,
  資料型態: null,
})

const getDataLoading = ref(false)
const GetExaminationItem = async () => {
  try {
    getDataLoading.value = true
    const res = await getExaminationItem(props.id)
    Object.assign(editItem, res.data)
  } catch (err) {
    console.log(err)
  } finally {
    getDataLoading.value = false
  }
}

const inputRefs = reactive({})
const rules = {}

const onSaveClick = async () => {
  const { result, errorInputRef } = validate(inputRefs)

  if (result === false) {
    errorInputRef.focus()
    return
  }

  switch (props.editType) {
    case 'add':
      PostExaminationItem(editItem)
      break
    case 'edit':
      PutExaminationItem(editItem)
      break
  }
}

const editLoading = ref(false)
const PostExaminationItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await postExaminationItem(editItem)
    $q.notify({
      type: 'positive',
      message: '新增檢驗項目成功',
      position: 'top',
    })
    onDialogOK()
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '新增檢驗項目失敗：' + typeof error.data === 'string' ? error.data : JSON.stringify(error.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const PutExaminationItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await putExaminationItem(editItem)
    $q.notify({
      type: 'positive',
      message: '編輯檢驗項目成功',
      position: 'top',
    })
    onDialogOK()
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '編輯檢驗項目失敗：' + typeof error.data === 'string' ? error.data : JSON.stringify(error.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const DeleteExaminationItem = async (id) => {
  try {
    editLoading.value = true
    const res = await deleteExaminationItem(id)
    $q.notify({
      type: 'positive',
      message: '刪除檢驗項目成功',
      position: 'top',
    })
    onDialogOK()
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '刪除檢驗項目失敗：' + typeof error.data === 'string' ? error.data : JSON.stringify(error.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const specimenGroupItems = ref([])
const specimenItems = ref([])
const GetSpecimenGroup = async () => {
  try {
    const query = setSearchQuery({
      $filter: `Category eq 'specimenGroup'`,
    })
    const res = await getCommonData(query)
    if (res.data) {
      specimenGroupItems.value = res.data.Items
    }
  } catch (error) {
    console.log(error)
  }
}

const GetSpecimen = async () => {
  try {
    const query = setSearchQuery({
      $filter: `Category eq 'specimen'`,
    })
    const res = await getCommonData(query)
    if (res.data) {
      specimenItems.value = res.data.Items
    }
  } catch (error) {
    console.log(error)
  }
}

const init = () => {
  if (props.id) GetExaminationItem()
  GetSpecimenGroup()
  GetSpecimen()
}
init()
</script>

