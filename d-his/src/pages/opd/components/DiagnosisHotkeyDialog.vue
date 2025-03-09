<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss full-width>
    <my-dialog-content header="科室公用組套" width="1200px" @close="onDialogCancel" :loading="tableLoading">
      <div class="p-2">
        <q-table class="mt-2" v-bind="QTableProps" :rows="rows" :columns="columns" row-key="IpdId" :pagination="pagination" :loading="tableLoading">
          <template #body-cell-Shortcut="{ col, row }">
            <q-td :props="{ col }"> Alt + {{ row.Shortcut }} </q-td>
          </template>
          <template #body-cell-action="{ col, row }">
            <q-td :props="{ col }">
              <q-btn class="mr-1" color="primary" @click="onDialogOK(row.DepPresetDiagnosisItems)" label="帶入" unelevated dense></q-btn>
              <q-btn class="mr-1" color="accent" @click="toView(row)" label="檢視" unelevated dense></q-btn>
            </q-td>
          </template>
          <template v-slot:bottom>
            <my-pagination class="mx-auto p-4" v-model="pagination" v-on:update:model-value="GetDepPreset"></my-pagination>
          </template>
        </q-table>
      </div>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { getDepPreset } from 'api'
import { ref, computed } from 'vue'
import setSearchQuery from 'utils/setSearchQuery.js'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { QTableProps } from 'utils/quasar-extends/base-props.js'
import EditItem from './IcdEditTable.vue'

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()
const $q = useQuasar()

const columns = computed(() => {
  let arr = []

  arr = [
    {
      name: 'CName',
      label: '疾病中文名稱',
      align: 'center',
      field: 'CName',
    },
    {
      name: 'EName',
      label: '疾病英文名稱',
      align: 'center',
      field: 'EName',
    },
    {
      name: 'Shortcut',
      label: '快捷鍵',
      align: 'center',
      field: 'Shortcut',
    },
    { name: 'action', label: '操作', align: 'center', field: 'action' },
  ]

  return arr
})

const tableLoading = ref(false)
const rows = ref([])
const GetDepPreset = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $orderBy: orderBy.value,
    })
    const res = await getDepPreset(query)
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

const sortBy = ref([])
const orderBy = computed(() => {
  return sortBy.value.map((item) => item.join(' ')).join(',')
})

// 編輯按鈕
const toView = (row) => {
  const dialog = $q
    .dialog({
      component: EditItem,
      componentProps: {
        editType: 'view',
        id: row.Id,
      },
    })
    .onOk((rows) => {
      onDialogOK(rows)
      dialog.hide()
    })
}

const init = async () => {
  GetDepPreset()
}
init()
</script>

