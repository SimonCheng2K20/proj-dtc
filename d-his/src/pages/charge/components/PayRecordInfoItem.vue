<template>
  <q-dialog ref="dialogRef" full-width no-backdrop-dismiss>
    <my-dialog-content header="記帳紀錄" width="1280px" @close="onDialogCancel" :loading="getDataLoading">
      <my-input-group class="grid gap-2">
        <my-input-wrapper label="記帳人員">
          <q-input v-bind="QInputProps"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="記帳金額">
          <q-input v-bind="QInputProps"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="單據">
          <q-input v-bind="QInputProps"></q-input>
        </my-input-wrapper>
      </my-input-group>

      <q-table class="mt-2" v-bind="QTableProps" :rows="rows" :columns="columns" :pagination="{ rowsPerPage: -1 }"></q-table>

      <template #actions>
        <q-btn unelevated color="grey" label="取消" @click="onDialogCancel"></q-btn>
        <q-btn unelevated color="primary" label="記帳儲存" :loading="editLoading" :disable="getDataLoading" @click="onSaveClick"></q-btn>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { QInputProps, QTableProps } from 'utils/quasar-extends/base-props.js'

const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  id: [String, Number],
  editType: String,
})

const columns = [
  { name: '序', label: '序', field: '序' },
  { name: '操作', label: '操作', field: '操作' },
  { name: '記帳人員', label: '記帳人員', field: '記帳人員' },
  { name: '記帳金額', label: '記帳金額', field: '記帳金額' },
  { name: '單據', label: '單據', field: '單據' },
  { name: '操作人', label: '操作人', field: '操作人' },
  { name: '操作時間', label: '操作時間', field: '操作時間' },
]

const getDataLoading = ref(false)
const rows = ref([])

const init = () => {}
init()
</script>

