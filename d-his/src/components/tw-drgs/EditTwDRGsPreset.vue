<template>
  <q-dialog ref="dialogRef" full-width full-height no-backdrop-dismiss>
    <my-dialog-content :header="editHeader" @close="onDialogCancel" :loading="getDataloading">
      <div v-if="editType === 'delete'" class="text-negative mb-1">是否確定刪除此{{ presetTitle }}？</div>
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

      <icd-table
        title="手術診斷"
        class="mt-2"
        v-model:rows="editItem.DiagnosisItems"
        :columns="icdColumns"
        :loading="getDataloading"
      ></icd-table>
      <PCSTable class="mt-2" v-model:rows="editItem.Icd10PcsItems"></PCSTable>

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
          @click="DeletePresetItem(props.id)"
        />
      </template>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { QInputProps } from 'utils/quasar-extends/base-props.js'
import { cloneDeep } from 'lodash-es'
import {
  getPieceProcedurePresetItem,
  postPieceProcedurePreset,
  putPieceProcedurePreset,
  deletePieceProcedurePreset,
} from 'api'
import { useAuthStore } from 'stores/auth'
import { usePresetStore } from 'stores/preset.js'

import IcdTable from 'components/opd/IcdTable.vue'
import SetPreset from 'components/preset/SetPreset.vue'
import PCSTable from './PCSTable.vue'
import KeysItems from 'components/preset/KeysItems.vue'

const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()
const authStore = useAuthStore()
const presetStore = usePresetStore()

const props = defineProps({
  editType: String,
  id: [String, Number],
  icdTableData: {
    type: Array,
    default: () => [],
  },
  pcsTableData: {
    type: Array,
    default: () => [],
  },
  presetTitle: String,
})

const icdColumns = ['index', 'Icd10Code', 'Icd9Code', 'Name', 'action']

const editHeader = computed(() => {
  switch (props.editType) {
    case 'add':
      return `新增Tw-DRGs組套`
    case 'edit':
      return `編輯Tw-DRGs組套`
    case 'delete':
      return `刪除Tw-DRGs組套`
    default:
      return null
  }
})

const editItem = reactive({
  DoctorId: authStore.userData.No,
  PresetName: null,
  Shortcut: null,
  Note: null,
  DiagnosisItems: cloneDeep(props.icdTableData),
  Icd10PcsItems: cloneDeep(props.pcsTableData),
})

const shortcutArr = computed(() => (editItem.Shortcut ? editItem.Shortcut.split(',') : []))

const getDataloading = ref(false)
const GetPieceProcedurePresetItem = async () => {
  try {
    getDataloading.value = true
    const res = await getPieceProcedurePresetItem(props.id)
    if (res.status === 200) {
      Object.assign(editItem, res.data)
    }
  } catch (err) {
    console.log(err)
  } finally {
    getDataloading.value = false
  }
}

const onSaveClick = async () => {
  console.log(editItem.PresetName)
  if (!editItem.PresetName) {
    $q.notify({
      type: 'negative',
      message: `缺少組套名稱`,
      position: 'top',
    })
    return
  }
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
    const res = await postPieceProcedurePreset(editItem)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: `新增Tw-DRGs組套成功`,
        position: 'top',
      })
      onDialogOK()
      presetStore.getPreset('twdrg')
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: `新增Tw-DRGs組套失敗：` + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const PutPresetItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await putPieceProcedurePreset(editItem)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: `儲存Tw-DRGs組套成功`,
        position: 'top',
      })
      onDialogOK()
      presetStore.getPreset('twdrg')
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: `儲存Tw-DRGs組套失敗：` + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const DeletePresetItem = async (id) => {
  try {
    editLoading.value = true
    const res = await deletePieceProcedurePreset(id)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: `刪除Tw-DRGs組套成功`,
        position: 'top',
      })
      onDialogOK()
      presetStore.getPreset('twdrg')
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: `刪除Tw-DRGs組套失敗：` + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
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
        presetKey: 'twdrg',
      },
    })
    .onOk((shortcut) => {
      editItem.Shortcut = shortcut
      dialog.hide()
    })
}

const init = async () => {
  if (!!props.id) GetPieceProcedurePresetItem()
}
init()
</script>

