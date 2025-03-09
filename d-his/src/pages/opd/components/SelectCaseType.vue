<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss full-width>
    <my-dialog-content header="選擇案件分類" width="1280px" @close="onDialogCancel">
      <div class="grid grid-cols-2 gap-2">
        <q-table
          class="mt-2"
          v-bind="QTableProps"
          :rows="rows.slice(0, rowsLengthHalf)"
          :columns="columns"
          row-key="No"
          :pagination="{ rowsPerPage: -1 }"
          :loading="tableLoading"
        >
          <template #body-cell-action="{ col, row }">
            <q-td :props="{ col }">
              <q-btn color="edit" @click="onDialogOK(row.No)" label="選取" unelevated dense></q-btn>
            </q-td>
          </template>
        </q-table>
        <q-table
          class="mt-2"
          v-bind="QTableProps"
          :rows="rows.slice(rowsLengthHalf)"
          :columns="columns"
          row-key="No"
          :pagination="{ rowsPerPage: -1 }"
          :loading="tableLoading"
        >
          <template #body-cell-action="{ col, row }">
            <q-td :props="{ col }">
              <q-btn color="edit" @click="onDialogOK(row.No)" label="選取" unelevated dense></q-btn>
            </q-td>
          </template>
        </q-table>
      </div>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { getCaseTypeList } from 'api'
import { QTableProps } from 'utils/quasar-extends/base-props.js'

const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  items: {
    typeof: Array,
    default: [],
  },
})

const columns = [
  { name: 'action', label: '操作', field: 'action', align: 'center', headerClasses: 'min-w-[60px]' },
  { name: 'No', label: '案件分類代碼', field: 'No', align: 'center', headerClasses: 'w-[80px]' },
  { name: 'Name', label: '案件分類名稱', field: 'Name', align: 'left' },
]

const tableLoading = ref(false)
const rows = ref(props.items)
const GetCaseTypeList = async () => {
  try {
    tableLoading.value = true
    const res = await getCaseTypeList()
    if (res.status === 200) {
      rows.value = res.data
    }
  } catch (err) {
    console.log(err)
  } finally {
    tableLoading.value = false
  }
}

const rowsLengthHalf = computed(() => Math.ceil(rows.value.length / 2))

const init = () => {
  if (!props.items) GetCaseTypeList()
}
init()
</script>

