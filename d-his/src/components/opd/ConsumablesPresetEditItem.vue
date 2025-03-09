<template>
  <q-dialog ref="dialogRef" full-width full-height no-backdrop-dismiss>
    <my-dialog-content :header="editHeader" @close="onDialogCancel" :loading="getDataloading">
      <div v-if="editType === 'delete'" class="text-negative mb-1">是否確定刪除此手術耗材組套？</div>
      <my-input-group class="grid gap-2">
        <my-input-wrapper label="組套名稱">
          <q-input v-bind="QInputProps" v-model="editItem.PresetName"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="快捷鍵">
          <KeysItems :keys="shortcutArr" class="mx-2"></KeysItems>
          <q-btn
            v-if="editType !== 'delete'"
            color="primary"
            label="設置快捷鍵"
            @click="toSetPreset"
            unelevated
          ></q-btn>
        </my-input-wrapper>
        <my-input-wrapper label="備註">
          <q-input v-bind="QInputProps" v-model="editItem.Note" type="textarea"></q-input>
        </my-input-wrapper>
      </my-input-group>

      <ConsumablesTable
        class="mt-2"
        v-model:rows="editItem.OperationMaterialPresetItems"
        :columns="columns"
        :loading="getDataloading"
      ></ConsumablesTable>

      <template #actions>
        <q-btn unelevated color="grey" label="取消" @click="onDialogCancel" />
        <q-btn
          v-if="editType === 'add'"
          unelevated
          color="secondary"
          label="新增"
          :loading="editLoading"
          @click="onSaveClick"
        />
        <q-btn
          v-if="editType === 'edit'"
          unelevated
          color="primary"
          label="儲存"
          :loading="editLoading"
          @click="onSaveClick"
        />
        <q-btn
          v-if="editType === 'delete'"
          unelevated
          color="negative"
          label="刪除"
          :loading="editLoading"
          @click="DeletePresetItem(editItem.Id)"
        />
      </template>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { QInputProps } from 'utils/quasar-extends/base-props.js'
import ConsumablesTable from 'components/opd/ConsumablesTable.vue'
import { cloneDeep } from 'lodash-es'
import {
  getPresetDiagnosisItem,
  postOperationMaterialPreset,
  putOperationMaterialPreset,
  deleteOperationMaterialPreset,
} from 'api'
import { usePresetStore } from 'stores/preset.js'
import { useAuthStore } from 'stores/auth'

import SetPreset from 'components/preset/SetPreset.vue'
import KeysItems from 'components/preset/KeysItems.vue'

const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()
const authStore = useAuthStore()
const presetStore = usePresetStore()

const props = defineProps({
  editType: String,
  row: Object,
  columns: Array,
  tableData: Array,
})

const editHeader = computed(() => {
  switch (props.editType) {
    case 'add':
      return `新增手術耗材組套`
    case 'edit':
      return `編輯手術耗材組套`
    case 'delete':
      return `刪除手術耗材組套`
    default:
      return null
  }
})

const editItem = reactive({
  Id: 0,
  AccountNo: authStore.userData.No,
  PresetName: null,
  Shortcut: null,
  Note: null,
  OperationMaterialPresetItems: [],
})
const shortcutArr = computed(() => (editItem.Shortcut ? editItem.Shortcut.split(',') : []))

const getDataloading = ref(false)

const onSaveClick = async () => {
  switch (props.editType) {
    case 'add':
      PostPresetItem(editItem)
      break
    case 'edit':
      PutPresetItem(editItem)
      break
  }
}

const editLoading = ref(false)
const PostPresetItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await postOperationMaterialPreset(editItem)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: `新增手術耗材組套成功`,
        position: 'top',
      })
      onDialogOK()
    }
    presetStore.getPreset('Consumable')
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: `新增手術耗材組套失敗：` + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const PutPresetItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await putOperationMaterialPreset(editItem)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: `儲存手術耗材組套成功`,
        position: 'top',
      })
      onDialogOK()
    }
    presetStore.getPreset('Consumable')
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: `儲存手術耗材組套失敗：` + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const DeletePresetItem = async (id) => {
  try {
    editLoading.value = true
    const res = await deleteOperationMaterialPreset(id)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: `刪除手術耗材組套成功`,
        position: 'top',
      })
      onDialogOK()
    }
    presetStore.getPreset('Consumable')
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: `刪除手術耗材組套失敗：` + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const toSetPreset = () => {
  const dialog = $q
    .dialog({
      component: SetPreset,
      componentProps: {
        shortcut: editItem.Shortcut,
        presetKey: 'Consumable',
      },
    })
    .onOk((shortcut) => {
      editItem.Shortcut = shortcut
      dialog.hide()
    })
}

const init = async () => {
  console.log(props.tableData)
  if (props.editType !== 'add') Object.assign(editItem, props.row)
  else editItem.OperationMaterialPresetItems = props.tableData
}
init()
</script>

