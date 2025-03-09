<template>
  <q-dialog ref="dialogRef" full-width no-backdrop-dismiss>
    <my-dialog-content :header="editHeader" height="600px" @close="onDialogCancel" :loading="getDataloading">
      <div v-if="editType === 'delete'" class="text-negative mb-1">是否確定刪除此用藥組套？</div>
      <my-input-group class="grid gap-2">
        <my-input-wrapper label="組套名稱">
          <q-input v-bind="QInputProps" v-model="editItem.PresetName" :readonly="editType === 'delete'"></q-input>
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
          <q-input
            v-bind="QInputProps"
            v-model="editItem.Note"
            type="textarea"
            :readonly="editType === 'delete'"
          ></q-input>
        </my-input-wrapper>
      </my-input-group>

      <medicine-table
        class="mt-2"
        v-model:rows="editItem.PresetMedicationItems"
        title="組套內容"
        :columns="columns"
        :loading="getDataloading"
        :readonly="editType === 'delete'"
        v-if="presetKeyName === 'Medication'"
      ></medicine-table>
      <medicine-table
        class="mt-2"
        v-model:rows="editItem.IpdMedicationPresetItems"
        title="組套內容"
        :columns="columns"
        :loading="getDataloading"
        :readonly="editType === 'delete'"
        v-else
      ></medicine-table>

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
import MedicineTable from 'components/opd/MedicineTable.vue'
import { cloneDeep } from 'lodash-es'
import {
  getPresetMedication,
  getPresetMedicationItem,
  postPresetMedicationItem,
  putPresetMedicationItem,
  deletePresetMedicationItem,
  getIpdMedicationPresetsItem,
  postIpdMedicationPreset,
  putIpdMedicationPreset,
  deleteIpdMedicationPreset,
} from 'api'
import { useAuthStore } from 'stores/auth'
import { usePresetStore } from 'stores/preset.js'
import SetPreset from 'components/preset/SetPreset.vue'
import KeysItems from 'components/preset/KeysItems.vue'

const presetStore = usePresetStore()
const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()
const authStore = useAuthStore()

const props = defineProps({
  editType: String,
  id: [String, Number],
  rows: {
    type: Array,
    default: () => [],
  },
  columns: Array,
  presetKeyName: {
    type: String,
    default: 'Medication',
  },
})

const editHeader = computed(() => {
  switch (props.editType) {
    case 'add':
      return `新增用藥組套`
    case 'edit':
      return `編輯用藥組套`
    case 'delete':
      return `刪除用藥組套`
    default:
      return null
  }
})

const editItem = reactive({
  DoctorId: authStore.userData.No,
  AccountNo: authStore.userData.No,
  PresetName: null,
  Shortcut: null,
  Note: null,
  PresetMedicationItems: cloneDeep(props.rows),
  IpdMedicationPresetItems: cloneDeep(props.rows),
})
const shortcutArr = computed(() => (editItem.Shortcut ? editItem.Shortcut.split(',') : []))

const getDataloading = ref(false)
const GetMedecinePresetItem = async () => {
  try {
    getDataloading.value = true
    const res =
      props.presetKeyName === 'Medication'
        ? await getPresetMedicationItem(props.id)
        : await getIpdMedicationPresetsItem(props.id)
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
    const res =
      props.presetKeyName === 'Medication'
        ? await postPresetMedicationItem(editItem)
        : await postIpdMedicationPreset(editItem)
    $q.notify({
      type: 'positive',
      message: `新增用藥組套成功`,
      position: 'top',
    })
    onDialogOK()
    presetStore.getPreset(props.presetKeyName)
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: `新增用藥組套失敗：` + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const PutPresetItem = async (editItem) => {
  try {
    editLoading.value = true
    const res =
      props.presetKeyName === 'Medication'
        ? await putPresetMedicationItem(editItem)
        : await putIpdMedicationPreset(editItem)
    $q.notify({
      type: 'positive',
      message: `儲存用藥組套成功`,
      position: 'top',
    })
    onDialogOK()
    presetStore.getPreset(props.presetKeyName)
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: `儲存用藥組套失敗：` + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const DeletePresetItem = async (id) => {
  try {
    editLoading.value = true
    const res =
      props.presetKeyName === 'Medication' ? await deletePresetMedicationItem(id) : await deleteIpdMedicationPreset(id)
    $q.notify({
      type: 'positive',
      message: `刪除用藥組套成功`,
      position: 'top',
    })
    onDialogOK()
    presetStore.getPreset(props.presetKeyName)
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: `刪除用藥組套失敗：` + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
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
        presetKey: props.presetKeyName,
      },
    })
    .onOk((shortcut) => {
      editItem.Shortcut = shortcut
      dialog.hide()
    })
}

const init = async () => {
  if (!!props.id) GetMedecinePresetItem()
}
init()
</script>

