<template>
  <q-dialog ref="dialogRef" full-width no-backdrop-dismiss>
    <my-dialog-content header="交班記錄查詢" @close="onDialogCancel">
      <q-table
        v-bind="QTableProps"
        :columns="shiftRecordColumns"
        :rows="shiftRecordRows"
        row-key="Id"
        :pagination="pagination"
        :loading="shiftRecordLoading"
      >
        <template #body-cell-index="{ col, rowIndex }">
          <q-td :props="{ col }">
            {{ rowIndex + 1 }}
          </q-td>
        </template>
        <template #body-cell-PreAssignItem="{ col, rowIndex, row }">
          <q-td :props="{ col }" :title="row.PreAssignItem">
            {{ row.PreAssignItem }}
          </q-td>
        </template>
        <template #body-cell-AssignItem="{ col, rowIndex, row }">
          <q-td :props="{ col }" :title="row.AssignItem">
            {{ row.AssignItem }}
          </q-td>
        </template>
        <template #body-cell-Shift="{ col, rowIndex, row }">
          <q-td :props="{ col }">
            <q-icon :name="row.Shift ? 'check_box' : 'check_box_outline_blank'" size="md"></q-icon>
          </q-td>
        </template>
        <template v-slot:bottom>
          <my-pagination
            class="mx-auto p-4"
            v-model="pagination"
            v-on:update:model-value="GetIpdNursingShift(false)"
          ></my-pagination>
        </template>
      </q-table>
      <template #actions>
        <span class="mr-3 text-orange-700"
          ><span class="text-red-500">*</span> 交班記錄只會紀錄交班時間往前推8小時內的病患狀態</span
        >
        <q-btn label="關閉" color="grey" @click="onDialogCancel"></q-btn>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>
<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { QTableProps, QInputProps, QSelectProps } from 'utils/quasar-extends/base-props.js'
import { getIpdNursingShift } from 'api'
import setSearchQuery from 'src/utils/setSearchQuery'

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()
const $q = useQuasar()
const props = defineProps({
  filter: String,
})

const shiftRecordColumns = ref([
  { name: 'index', label: 'No.', field: 'index', align: 'center', headerClasses: 'whitespace-nowrap' },
  { name: 'Bed', label: '床號', field: 'Bed', align: 'center', headerClasses: 'whitespace-nowrap' },
  { name: 'PatientId', label: '病歷號', field: 'PatientId', align: 'center', headerClasses: 'whitespace-nowrap' },
  { name: 'PatientName', label: '病患姓名', field: 'PatientName', align: 'center', headerClasses: 'whitespace-nowrap' },
  {
    name: 'NoteDate',
    label: '記錄日期',
    field: (row) => (row.NoteDate ? `${row.NoteDate?.substring(0, 10)} ${row.NoteDate?.substring(11, 16)}` : ''),
    align: 'center',
  },
  {
    name: 'PatientStatusName',
    label: '病患狀態',
    field: 'PatientStatusName',
    align: 'center',
    classes: 'whitespace-nowrap',
  },
  {
    name: 'NursingStaffName',
    label: '交班護理師',
    field: 'NursingStaffName',
    align: 'center',
    headerClasses: 'whitespace-nowrap',
  },
  { name: 'TimeSlotName', label: '班別', field: 'TimeSlotName', align: 'center', headerClasses: 'whitespace-nowrap' },
  {
    name: 'PreAssignItem',
    label: '接辦事項',
    field: 'PreAssignItem',
    align: 'center',
    classes: 'overflow-hidden text-ellipsis whitespace-nowrap max-w-[280px]',
  },
  {
    name: 'AssignItem',
    label: '交辦事項',
    field: 'AssignItem',
    align: 'center',
    classes: 'overflow-hidden text-ellipsis whitespace-nowrap max-w-[280px]',
  },
  {
    name: 'NextNursingStaffName',
    label: '接班護理師',
    field: 'NextNursingStaffName',
    align: 'center',
    headerClasses: 'whitespace-nowrap',
  },
  {
    name: 'ShiftDatetime	',
    label: '交班時間',
    field: (row) =>
      row.ShiftDatetime ? `${row.ShiftDatetime?.substring(0, 10)} ${row.ShiftDatetime?.substring(11, 16)}` : '',
    align: 'center',
  },
])

const shiftRecordLoading = ref(false)
const shiftRecordRows = ref([])
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

const sortBy = ref([['ShiftDatetime desc'], ['TimeSlotNo desc']])
const orderBy = computed(() => {
  return sortBy.value.map((item) => item.join(' ')).join(',')
})
// 獲取交班記錄查詢結果
const GetIpdNursingShift = async () => {
  shiftRecordLoading.value = true
  try {
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: props.filter,
      $orderby: orderBy.value,
    })
    const res = await getIpdNursingShift(query)
    if (res.status === 200) {
      pagination.value.rowsNumber = res.data.Count
      shiftRecordRows.value = res.data.Items
    }
  } catch (error) {
    console.log(error)
  } finally {
    shiftRecordLoading.value = false
  }
}
const init = () => {
  GetIpdNursingShift()
}
init()
</script>
<style lang="scss" scoped></style>

