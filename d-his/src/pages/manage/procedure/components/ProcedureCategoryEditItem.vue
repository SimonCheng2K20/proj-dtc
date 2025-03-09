<template>
  <q-dialog ref="dialogRef" full-width no-backdrop-dismiss>
    <my-dialog-content :header="editHeader" width="1280px" @close="onDialogCancel" :loading="getDataLoading">
      <div v-if="editType === 'delete'" class="text-negative mb-1">是否確定刪除此醫令分類維護？</div>
      <my-input-group class="grid gap-2">
        <my-input-wrapper label="主分類代碼" required-mark>
          <q-input
            v-bind="QInputProps"
            :ref="(el) => (inputRefs.Category = el)"
            :rules="rules.Category"
            v-model="editItem.Category"
            :readonly="editType === 'delete'"
          >
          </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="主分類名稱">
          <q-input
            v-bind="QInputProps"
            :ref="(el) => (inputRefs.Text = el)"
            :rules="rules.Text"
            v-model="editItem.Text"
            :readonly="editType === 'delete'"
          >
          </q-input>
        </my-input-wrapper>
      </my-input-group>

      <q-table
        v-bind="QTableProps"
        class="mt-2"
        :rows="editItem.ProcedureCategoryItems"
        :columns="childrenColumns"
        row-key="SecondCategory"
        :pagination="{ rowsPerPage: -1 }"
        virtual-scroll
      >
        <template #top>
          <div>次分類項目</div>
          <q-space></q-space>
          <q-btn color="add" icon="add" dense unelevated @click="onAddRowClick"> </q-btn>
        </template>

        <template v-slot:body-cell-action="{ col, rowIndex }">
          <q-td :props="{ col }">
            <q-btn
              color="delete"
              @click="editItem.ProcedureCategoryItems.splice(rowIndex, 1)"
              label="刪除"
              unelevated
              dense
            ></q-btn>
          </q-td>
        </template>
        <template v-slot:body-cell-SecondCategory="{ col, row }">
          <q-td :props="{ col }">
            <q-input v-bind="QInputProps" v-model="row.SecondCategory" :readonly="editType === 'delete'"> </q-input>
          </q-td>
        </template>
        <template v-slot:body-cell-SecondText="{ col, row }">
          <q-td :props="{ col }">
            <q-input v-bind="QInputProps" v-model="row.SecondText" :readonly="editType === 'delete'"> </q-input>
          </q-td>
        </template>
      </q-table>

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
  getProcedureCategoryItem,
  postProcedureCategoryItem,
  putProcedureCategoryItem,
  deleteProcedureCategoryItem,
} from 'api'
import { validate } from 'utils/quasar-extends/validate.js'
import { useRequired } from 'utils/rules.js'
import { QInputProps, QTableProps } from 'utils/quasar-extends/base-props.js'
import { cloneDeep } from 'lodash-es'

const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  editType: String,
  id: [String, Number],
})

const editHeader = computed(() => {
  switch (props.editType) {
    case 'add':
      return `新增醫令分類維護`
    case 'edit':
      return `編輯醫令分類維護`
    case 'delete':
      return `刪除醫令分類維護`
    default:
      return null
  }
})

const childrenColumns = computed(() => {
  const arr = [
    { name: 'SecondCategory', label: '次分類代碼', field: 'SecondCategory', align: 'left' },
    { name: 'SecondText', label: '次分類名稱', field: 'SecondText', align: 'left' },
  ]

  if (props.editType !== 'delete') arr.push({ name: 'action', label: '操作', field: 'action', align: 'center' })

  return arr
})

const editItem = reactive({
  Category: null,
  Text: null,
  ProcedureCategoryItems: [],
})

const initData = {}
initData.ProcedureCategoryItem = {
  SecondCategory: null,
  SecondText: null,
}

const onAddRowClick = () => {
  editItem.ProcedureCategoryItems.push(cloneDeep(initData.ProcedureCategoryItem))
}

const getDataLoading = ref(false)
const GetProcedureCategoryItem = async () => {
  getDataLoading.value = true
  const { data } = await getProcedureCategoryItem(props.id)
  Object.assign(editItem, data)
  getDataLoading.value = false
}

const inputRefs = reactive({})
const rules = {
  Category: useRequired({ title: '主分類代碼', type: 'input' }),
  Text: useRequired({ title: '主分類名稱', type: 'input' }),
}

const editLoading = ref(false)
const callApi = async (param) => {
  editLoading.value = true

  const api = {
    add: postProcedureCategoryItem,
    edit: putProcedureCategoryItem,
    delete: deleteProcedureCategoryItem,
  }

  let error
  try {
    await api[props.editType](param)
  } catch (err) {
    error = err
  }

  $q.notify({
    type: error ? 'negative' : 'positive',
    message: editHeader.value + (!error ? '成功' : `失敗：${JSON.stringify(error.response.data)}`),
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

  const cloneEditItem = cloneDeep(editItem)
  cloneEditItem.ProcedureCategoryItems.forEach((item) => (item.Category = cloneEditItem.Category))

  callApi(cloneEditItem)
}

const onDeleteClick = () => {
  callApi(editItem.Category)
}

const init = () => {
  if (props.id) GetProcedureCategoryItem()
}
init()
</script>

