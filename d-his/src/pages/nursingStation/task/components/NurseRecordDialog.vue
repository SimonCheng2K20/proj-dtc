<template>
  <q-dialog ref="dialogRef" full-width no-backdrop-dismiss>
    <my-dialog-content header="交班事項" width="1280px" @close="onDialogCancel">
      <p class="p-2">
        床號:{{ patientsDataCurrent?.Bed }} | {{ patientsDataCurrent?.PatientId }}(病歷號) |
        {{ patientsDataCurrent?.PatientName }} | {{ patientsDataCurrent?.Gender }} | {{ patientsDataCurrent?.Age }}歲
      </p>
      <div class="flex min-h-[200px]">
        <div class="bg-[#EEEEEE] w-[30%] p-3 border border-[#215DBB]">
          <p>
            紀錄日期:{{ expandedNurseRecordItem.NoteDate?.substring(0, 10) }}
            {{ expandedNurseRecordItem.NoteDate?.substring(11, 16) }}
          </p>
          <p>護理師:{{ expandedNurseRecordItem.NursingStaffName }}</p>
          <p>病患狀態:{{ expandedNurseRecordItem.PatientStatusName }}</p>
        </div>
        <q-input
          class="w-[70%]"
          v-bind="QInputProps"
          type="textarea"
          v-model="editText"
          v-if="type === 'edit'"
        ></q-input>

        <div class="w-[70%] p-3 border border-[#215DBB] border-l-0" v-else>
          {{ recordText }}
        </div>
      </div>
      <template #actions>
        <q-btn label="關閉" color="grey" @click="onDialogCancel"></q-btn>
        <q-btn label="儲存交辦事項" color="primary" @click="updateRecordText" v-if="type === 'edit'"></q-btn>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>
<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { QTableProps, QInputProps, QSelectProps } from 'utils/quasar-extends/base-props.js'

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()
const $q = useQuasar()
const props = defineProps({
  type: String,
  patientsDataCurrent: Object,
  expandedNurseRecordItem: Object,
  recordText: String,
})
const editText = ref(props.recordText)
const updateRecordText = () => {
  onDialogOK(editText.value)
}
</script>
<style lang="scss" scoped></style>

