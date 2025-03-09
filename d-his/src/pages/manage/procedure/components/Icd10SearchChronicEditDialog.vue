<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss full-width>
    <my-dialog-content header="編輯ICD-10 特定治療代碼" width="800px" @close="onDialogCancel">
      <my-input-group class="grid gap-2">
        <my-input-wrapper label="ICD10 代碼">
          <q-input v-bind="QInputProps" v-model="editItem.Icd10" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="ICD10 中文">
          <q-input v-bind="QInputProps" v-model="editItem.Icd10Cht" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="ICD10 英文">
          <q-input v-bind="QInputProps" v-model="editItem.Icd10Eng" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="特定治療代碼">
          <q-input
            ref="inputRef"
            v-bind="QInputProps"
            :rules="[(val) => val.length < 3 || '不能超過兩碼']"
            v-model="editItem.Icd10CmChronic"
          ></q-input>
        </my-input-wrapper>
      </my-input-group>
      <template #actions>
        <q-btn label="關閉" color="grey" @click="onDialogCancel"></q-btn>
        <q-btn label="儲存" color="primary" @click="saveEdit"></q-btn>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>
<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { QTableProps, QInputProps, QSelectProps } from 'utils/quasar-extends/base-props.js'
import { cloneDeep } from 'lodash-es'

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()
const $q = useQuasar()
const props = defineProps({
  row: Object,
})

const inputRef = ref(null)

const editItem = ref({
  Icd9: null,
  Icd10: null,
  Icd10Eng: null,
  Icd10Cht: null,
  Icd10CmChronic: null,
  Icd10CmChap: null,
  Icd10Chronic: null,
})

const saveEdit = () => {
  if (editItem.value.Icd10CmChronic.length > 2) {
    return
  } else {
    onDialogOK(editItem.value)
  }
}

const init = () => {
  editItem.value = cloneDeep(props.row)
}
init()
</script>
<style lang="scss" scoped></style>

