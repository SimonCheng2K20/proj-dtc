<template>
  <q-dialog ref="dialogRef" full-width full-height no-backdrop-dismiss>
    <my-dialog-content header="E 檢查治療組套清單" width="1280px" @close="onDialogCancel">
      <q-table
        v-bind="QTableProps"
        :columns="columns"
        :rows="rows"
        row-key="Id"
        :pagination="pagination"
        :loading="tableLoading"
      >
        <template #body-cell-action="{ col, row }">
          <q-td :props="{ col }">
            <q-btn class="mr-1" color="edit" label="編輯" dense unelevated @click="toEdit(row)"></q-btn>
            <q-btn class="mr-1" color="green" label="帶入" dense unelevated @click="toPaste(row)"></q-btn>
            <q-btn class="mr-1" color="delete" label="刪除" dense unelevated @click="toDelete(row)"></q-btn>
          </q-td>
        </template>
        <template v-slot:bottom>
          <my-pagination
            class="mx-auto p-4"
            v-model="pagination"
            v-on:update:model-value="GetPresetProcedure()"
          ></my-pagination>
        </template>
      </q-table>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { QTableProps } from 'utils/quasar-extends/base-props.js'
import setSearchQuery from 'utils/setSearchQuery.js'
import { getPresetProcedure } from 'api'
import ProcedurePresetEditItem from './ProcedurePresetEditItem.vue'

const $q = useQuasar()
const { dialogRef, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  columns: Array,
  DclDepartmentNo: String,
})

const emit = defineEmits(['paste'])

const columns = [
  { name: 'action', label: '操作', field: 'action', align: 'center' },
  { name: 'PresetName', label: '組套名稱', field: 'PresetName', align: 'left' },
  { name: 'Shortcut', label: '快捷鍵', field: 'Shortcut', align: 'left' },
  { name: 'Note', label: '備註', field: 'Note', align: 'left' },
]

const tableLoading = ref(false)
const rows = ref([])
const GetPresetProcedure = async () => {
  tableLoading.value = true
  try {
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: props.DclDepartmentNo === '40' ? 'ToothFlag eq true' : 'ToothFlag eq false',
    })
    const res = await getPresetProcedure(query)
    if (res.status === 200) {
      rows.value = res.data.Items
      pagination.value.rowsNumber = res.data.Count
    }
  } catch (err) {
    console.log(err)
  } finally {
    tableLoading.value = false
  }
}

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

const toEdit = (row) => {
  const dialog = $q
    .dialog({
      component: ProcedurePresetEditItem,
      componentProps: {
        editType: 'edit',
        id: row.Id,
        columns: props.columns,
        DclDepartmentNo: props.DclDepartmentNo,
      },
    })
    .onOk(() => {
      dialog.hide()
      GetPresetProcedure()
    })
}

const toPaste = (row) => {
  emit('paste', row.PresetProcedureItems)
}

const toDelete = (row) => {
  const dialog = $q
    .dialog({
      component: ProcedurePresetEditItem,
      componentProps: {
        editType: 'delete',
        id: row.Id,
        columns: props.columns,
        DclDepartmentNo: props.DclDepartmentNo,
      },
    })
    .onOk(() => {
      dialog.hide()
      const prePage = pagination.value.page - 1
      if (prePage > 0) {
        if (pagination.value.rowsNumber - 1 <= prePage * pagination.value.rowsPerPage) pagination.value.page = prePage
      }
      GetPresetProcedure()
    })
}

const init = () => {
  GetPresetProcedure()
}
init()
</script>
