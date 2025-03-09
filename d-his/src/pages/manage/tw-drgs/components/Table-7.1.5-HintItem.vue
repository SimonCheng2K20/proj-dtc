<template>
  <q-dialog ref="dialogRef" full-width>
    <my-dialog-content header="提示" width="1280px" @close="onDialogCancel" :loading="getDataLoading">
      <div>主診斷與手術不相關（附表7.1.5）{{ type }} 相關處置碼</div>
      <q-table class="mt-2" v-bind="QTableProps" :rows="rows" :columns="columns" row-key="twdrgid" :pagination="{ rowsPerPage: -1 }"> </q-table>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { QTableProps } from 'utils/quasar-extends/base-props.js'

const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  type: String,
  rows: Array,
})

const columns = [
  { name: '手術處置碼', label: '手術處置碼', field: '手術處置碼', align: 'left' },
  { name: '英文名稱', label: '英文名稱', field: '英文名稱', align: 'left' },
]

const getDataLoading = ref(false)

const init = () => {}
init()
</script>

