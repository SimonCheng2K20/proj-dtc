<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss full-width>
    <my-dialog-content :header="editHeader" width="540px" @close="onDialogCancel">
      <div>
        <my-input-group class="">
          <my-input-wrapper class="mb-1" label="日期">
            <my-date-input v-bind="QInputProps" v-model="editItem.TbDate"></my-date-input>
          </my-input-wrapper>
          <my-input-wrapper class="mb-1" label="事件">
            <q-input v-bind="QInputProps" v-model="editItem.Event"> </q-input>
          </my-input-wrapper>
          <my-input-wrapper class="mb-1" label="申報編號">
            <q-input v-bind="QInputProps" v-model="editItem.ApplyNo"> </q-input>
          </my-input-wrapper>
        </my-input-group>
      </div>
      <template #actions>
        <q-btn unelevated color="grey" label="取消" @click="onDialogCancel"></q-btn>
        <q-btn v-if="editType === 'add'" unelevated color="secondary" label="新增" :loading="editLoading" @click="onSaveClick"></q-btn>
        <q-btn v-if="editType === 'edit'" unelevated dense color="primary" label="儲存" :loading="editLoading" @click="onSaveClick"></q-btn>
        <q-btn v-if="editType === 'delete'" unelevated dense color="negative" label="確定刪除" :loading="editLoading" @click="DeletePatientTraceTb(props.Id)">
        </q-btn>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch, watchEffect } from 'vue'
import { event, useDialogPluginComponent, useQuasar } from 'quasar'
import { QInputProps, QSelectProps } from 'utils/quasar-extends/base-props.js'
import { cloneDeep } from 'lodash-es'
import { postPatientTraceTb, putPatientTraceTb, deletePatientTraceTb } from 'api'
import { useRouter, useRoute } from 'vue-router'

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()
const qDateProxy = ref()
const $q = useQuasar()
const route = useRoute()

const props = defineProps({
  step: Number,
  editType: String,
  Id: Number,
  editItem: Object,
})
const editType = ref(props.editType)
const editItem = reactive({
  Id: 0,
  OpdId: null,
  Step: null,
  TbDate: null,
  Event: null,
  ApplyNo: null,
  EventStatus: false,
})

const init = () => {
  if (!!props.Id) {
    Object.assign(editItem, props.editItem)
  }
}
init()

const editHeader = computed(() => {
  switch (editType.value) {
    case 'add': {
      return '新增事件'
    }
    case 'edit': {
      return '編輯事件'
    }
    default: {
      return null
    }
  }
})

const onSaveClick = () => {
  const cloneEditItem = cloneDeep(editItem)

  switch (props.editType) {
    case 'add':
      cloneEditItem.PatientId = route.query.PatientId
      cloneEditItem.Step = props.step
      PostPatientTraceTb(cloneEditItem)
      break
    case 'edit':
      PutPatientTraceTb(cloneEditItem)
      break
  }
}

const editLoading = ref(false)
const PostPatientTraceTb = async (editItem) => {
  try {
    editLoading.value = true
    const res = await postPatientTraceTb(editItem)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '新增欄位成功',
        position: 'top',
      })
      onDialogOK()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '新增欄位失敗：' + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const PutPatientTraceTb = async (editItem) => {
  try {
    editLoading.value = true
    const res = await putPatientTraceTb(editItem)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '編輯欄位成功',
        position: 'top',
      })
      onDialogOK()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '編輯欄位失敗：' + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const DeletePatientTraceTb = async (id) => {
  try {
    editLoading.value = true
    const res = await deletePatientTraceTb(id)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '刪除欄位成功',
        position: 'top',
      })
      onDialogOK()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '刪除欄位失敗：' + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}
</script>
