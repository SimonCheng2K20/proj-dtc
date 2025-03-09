<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss>
    <my-dialog-content :header="editHeader" width="1280px" @close="onDialogCancel" :loading="getDataLoading">
      <div v-if="editType === 'delete'" class="text-negative mb-1">是否確定刪除此特定治療管理？</div>
      <my-input-group class="grid gap-2" style>
        <my-input-wrapper label="序號" required-mark>
          <q-input
            v-bind="QInputProps"
            v-model="editItem.Sn"
            :ref="(el) => (inputRefs.Sn = el)"
            :rules="rules.Sn"
            type="number"
            :readonly="editType !== 'add'"
          >
          </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="計畫情形">
          <q-input v-bind="QInputProps" v-model="editItem.PlanText" :readonly="editType === 'delete'"> </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="特定治療項代號欄位(一)">
          <q-input v-bind="QInputProps" v-model="editItem.CureItemNo1" :readonly="editType === 'delete'"> </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="特定治療項代號欄位(二)">
          <q-input v-bind="QInputProps" v-model="editItem.CureItemNo2" :readonly="editType === 'delete'"> </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="特定治療項代號欄位(三)">
          <q-input v-bind="QInputProps" v-model="editItem.CureItemNo3" :readonly="editType === 'delete'"> </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="案件分類">
          <q-select
            v-bind="QSelectProps"
            v-model="editItem.CaseType"
            :options="caseTypeItems"
            option-label="Name"
            option-value="No"
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
  getSpecialTherapyItem,
  postSpecialTherapyItem,
  putSpecialTherapyItem,
  deleteSpecialTherapyItem,
  getCaseTypeList,
} from 'api'
import { validate } from 'utils/quasar-extends/validate.js'
import { useRequired } from 'utils/rules.js'
import { QInputProps, QSelectProps } from 'utils/quasar-extends/base-props.js'

const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  editType: String,
  id: [String, Number],
})

const editHeader = computed(() => {
  switch (props.editType) {
    case 'add':
      return `新增特定治療管理`
    case 'edit':
      return `編輯特定治療管理`
    case 'delete':
      return `刪除特定治療管理`
    default:
      return null
  }
})

const editItem = reactive({
  Sn: null,
  PlanText: null,
  CureItemNo1: null,
  CureItemNo2: null,
  CureItemNo3: null,
  CaseType: null,
})

const getDataLoading = ref(false)
const GetSpecialTherapyItem = async () => {
  getDataLoading.value = true
  const { data } = await getSpecialTherapyItem(props.id)
  if (data) Object.assign(editItem, data)
  getDataLoading.value = false
}

const inputRefs = reactive({})
const rules = {
  Sn: useRequired({ title: '序號', type: 'input' }),
}

const editLoading = ref(false)
const callApi = async (param) => {
  editLoading.value = true

  const api = {
    add: postSpecialTherapyItem,
    edit: putSpecialTherapyItem,
    delete: deleteSpecialTherapyItem,
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

const caseTypeItems = ref([])
const GetCaseTypeList = () => {
  getCaseTypeList().then(({ data }) => {
    if (data) {
      caseTypeItems.value = data
    }
  })
}

const init = () => {
  if (props.id) GetSpecialTherapyItem()
  GetCaseTypeList()
}
init()
</script>

