<template>
  <div>
    <q-table v-bind="QTableProps" :rows="rows" :columns="tableColumns" :loading="loading">
      <template #top>
        <div class="w-full flex justify-between">
          <div class="text-xl font-bold mr-2">{{ title }}</div>
          <q-btn
            v-if="!readonly"
            color="add"
            icon="add"
            dense
            unelevated
            @click="editProgressNote({ editType: 'add' })"
          >
          </q-btn>
        </div>
      </template>
      <template #body-cell-action="{ col, row }">
        <q-td :props="{ col, row }">
          <q-btn
            v-if="!readonly"
            class="mr-2"
            color="primary"
            label="修改"
            unelevated
            dense
            @click="editProgressNote({ row, editType: 'edit' })"
          ></q-btn>
          <q-btn
            v-if="!readonly"
            color="delete"
            label="刪除"
            unelevated
            dense
            @click="editProgressNote({ row, editType: 'delete' })"
          ></q-btn>
          <q-btn
            v-if="readonly"
            color="primary"
            label="閱覽"
            unelevated
            dense
            @click="editProgressNote({ row, editType: 'reading' })"
          ></q-btn>
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watchEffect, provide } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { getIpdProgressNote } from 'api'
import { QTableProps, QInputProps, QSelectProps } from 'utils/quasar-extends/base-props.js'
import { useRoute } from 'vue-router'
import setSearchQuery from 'utils/setSearchQuery.js'

import EditProgressNote from './EditProgressNote.vue'

const $q = useQuasar()
const props = defineProps({
  title: {
    type: String,
    default: '病程紀錄',
  },
  rows: Array,
  columns: Array,
  readonly: Boolean,
  loading: Boolean,
})
const emit = defineEmits(['refreshTable'])

// 預編輯物件資料

const tableColumns = computed(() => {
  const arr = [
    { name: 'action', label: '操作', field: 'action', align: 'center' },
    {
      name: 'ProgressNoteDate',
      label: '日期',
      field: (row) => row?.ProgressNoteDate?.substring(0, 10),
      align: 'center',
    },
    { name: 'PomrDescription', label: 'POMR 問題描述', field: 'PomrDescription', align: 'center' },
    { name: 'AttendingDocName', label: '主治醫師', field: 'AttendingDocName', align: 'center' },
    { name: 'WritingDocName', label: '撰寫醫師', field: 'WritingDocName', align: 'center' },
  ]

  return arr.filter((item) => {
    return props.columns.includes(item.name)
  })
})

const editProgressNote = ({ row, editType }) => {
  const dialog = $q
    .dialog({
      component: EditProgressNote,
      componentProps: {
        editType: editType,
        id: row?.Id,
      },
    })
    .onOk(() => {
      dialog.hide()
      emit('refreshTable')
    })
}

const init = () => {}
init()
</script>

