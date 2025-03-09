<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss>
    <my-dialog-content header="床位預約" @close="onDialogCancel">
      <div class="font-bold text-[#E8125B]">此病患已預約住院</div>

      <div>
        <div>預約日期：{{ data.IpdPreDate?.substring(0, 10) }}</div>
        <div>科　　別：{{ data.DepartmentName }}</div>
        <div>醫生姓名：{{ data.AttendingDoc }}</div>
        <div>病歷號碼：{{ data.PatientId }}</div>
        <div>病患姓名：{{ data.PersonName }}</div>
      </div>

      <template #actions>
        <q-btn unelevated color="purple" label="更改預約" @click="onDialogOK" />
        <q-btn unelevated color="primary" label="知道了" @click="onDialogCancel" />
      </template>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent, useQuasar } from 'quasar'

const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  data: Object,
  // {
  //   AttendingDoc: null,
  //   AttendingDocId: null,
  //   BedIdNo: null,
  //   DepartmentId: null,
  //   DepartmentName: null,
  //   IpdId: null,
  //   IpdPreDate: null,
  //   PatientId: null,
  // },
})
</script>
