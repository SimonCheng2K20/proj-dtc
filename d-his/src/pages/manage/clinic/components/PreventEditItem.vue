<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss>
    <my-dialog-content :header="editHeader" width="1280px" @close="onDialogCancel" :loading="getDataLoading">
      <div v-if="editType === 'delete'" class="text-negative mb-1">是否確定刪除此預防保健管理？</div>
      <my-input-group class="grid gap-2" style>
        <my-input-wrapper label="就醫序號">
          <q-input
            v-bind="QInputProps"
            :ref="(el) => (inputRefs.No = el)"
            :rules="rules.No"
            v-model="editItem.No"
            :readonly="editType !== 'add'"
          >
          </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="保健服務項目">
          <q-input v-bind="QInputProps" v-model="editItem.Text" :readonly="editType === 'delete'"> </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="健保卡註記">
          <q-input v-bind="QInputProps" v-model="editItem.CardRemark" :readonly="editType === 'delete'"> </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="取消代碼">
          <q-input v-bind="QInputProps" v-model="editItem.CancelCode" :readonly="editType === 'delete'"> </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="醫令代碼">
          <q-input v-bind="QInputProps" v-model="editItem.NhiCode" :readonly="editType === 'delete'"> </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="補助時程">
          <q-input v-bind="QInputProps" v-model="editItem.SupportRemark" :readonly="editType === 'delete'"> </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="建議年齡">
          <q-input v-bind="QInputProps" v-model="editItem.SupportAge" :readonly="editType === 'delete'"> </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="啟用狀態">
          <q-select
            v-bind="QSelectProps"
            v-model="editItem.Actived"
            :options="activeStatusItems"
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
import { getPreventItem, postPreventItem, putPreventItem, deletePreventItem } from 'api'
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
      return `新增預防保健管理`
    case 'edit':
      return `編輯預防保健管理`
    case 'delete':
      return `刪除預防保健管理`
    default:
      return null
  }
})

const editItem = reactive({
  No: null,
  Text: null,
  CardRemark: null,
  CancelCode: null,
  NhiCode: null,
  SupportRemark: null,
  SupportAge: null,
  Actived: null,
})

const getDataLoading = ref(false)
const GetPreventItem = async () => {
  getDataLoading.value = true
  const { data } = await getPreventItem(props.id)
  if (data) Object.assign(editItem, data)
  getDataLoading.value = false
}

const inputRefs = reactive({})
const rules = {
  No: useRequired({ title: '就醫序號', type: 'input' }),
}

const editLoading = ref(false)
const callApi = async (param) => {
  editLoading.value = true

  const api = {
    add: postPreventItem,
    edit: putPreventItem,
    delete: deletePreventItem,
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

const init = () => {
  if (props.id) GetPreventItem()
}
init()
</script>

