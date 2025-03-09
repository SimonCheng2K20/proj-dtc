<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss full-width>
    <my-dialog-content header="選擇就醫類別" width="1280px" @close="onDialogCancel">
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
              <q-btn class="mr-1" color="edit" @click="onDialogOK(row.No)" label="選取" unelevated dense></q-btn>
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
              <q-btn class="mr-1" color="edit" @click="onDialogOK(row.No)" label="選取" unelevated dense></q-btn>
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
import { getSeekMedicalList } from 'api'
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
  { name: 'action', label: '操作', field: 'action', align: 'center' },
  { name: 'No', label: '就醫類別代碼', field: 'No', align: 'left' },
  { name: 'Text', label: '就醫類別名稱', field: 'Text', align: 'left' },
]

const tableLoading = ref(false)
const rows = ref(props.items)
const GetSeekMedicalList = async () => {
  try {
    tableLoading.value = true
    const res = await getSeekMedicalList()
    if (res.status === 200) {
      rows.value = res.data.Items
    }
  } catch (err) {
    console.log(err)
  } finally {
    tableLoading.value = false
  }
}

const rowsLengthHalf = computed(() => Math.ceil(rows.value.length / 2))

const init = () => {
  if (!props.items) GetSeekMedicalList()
}
init()
</script>

