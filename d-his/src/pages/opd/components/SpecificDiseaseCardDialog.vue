<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss>
    <my-dialog-content header="診療項目要求表記錄" @close="onDialogCancel" :width="'1200px'">
      <div class="flex flex-nowrap">
        <div
          class="border border-blue-400 bg-[#D0FF8A] flex items-center justify-center font-bold"
          style="writing-mode: vertical-lr"
        >
          處置項目
        </div>
        <div class="grow">
          <q-table ref="tableRef" v-bind="QTableProps" :rows="tableData" :columns="columns">
            <template #body-cell-index="{ col, row, rowIndex }">
              <q-td :props="{ col }"> {{ rowIndex + 1 }}</q-td>
            </template>
            <template #body-cell-Code="{ col, row, rowIndex }">
              <q-td :props="{ col }" rowspan="7" v-if="rowIndex === 0"> {{ props.SpecificDisease.NhiCode }}</q-td>
            </template>
            <template #body-cell-Point="{ col, row, rowIndex }">
              <q-td :props="{ col }" rowspan="7" v-if="rowIndex === 0"> {{ props.SpecificDisease.AfterNhiPoint }}</q-td>
            </template>
            <template #body-cell-ExecutionDatetime="{ col, row, rowIndex }">
              <q-td :props="{ col }">
                <q-btn
                  class="text-blue-10 font-bold"
                  color="yellow-3"
                  padding="0 5px"
                  label="完成"
                  dense
                  unelevated
                  :disable="readonly"
                  @click="done(row, rowIndex)"
                  v-if="row.ExecutionDatetime === null"
                ></q-btn>
                <span v-else>{{ row?.ExecutionDatetime?.substring(0, 10) }}</span>
              </q-td>
            </template>
          </q-table>
        </div>
      </div>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { QTableProps, QSelectProps, QInputProps } from 'utils/quasar-extends/base-props.js'
import { useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  SpecificDisease: Object,
  readonly: Boolean,
})
const emit = defineEmits(['done'])
const columns = [
  {
    name: 'index',
    label: '序號',
    field: 'index',
    align: 'center',
    headerClasses: 'whitespace-nowrap',
    classes: 'whitespace-nowrap',
  },
  {
    name: 'Code',
    label: '代碼',
    field: 'Code',
    align: 'center',
    headerClasses: 'whitespace-nowrap',
    classes: 'whitespace-nowrap',
  },
  { name: 'Name', label: '名稱', field: 'Name', align: 'center', classes: 'whitespace-nowrap' },
  {
    name: 'Point',
    label: '支付點數',
    field: 'Point',
    align: 'center',
    headerClasses: 'whitespace-nowrap',
    classes: 'whitespace-nowrap',
  },
  {
    name: 'ExecutionDatetime',
    label: '執行時間',
    field: 'ExecutionDatetime',
    align: 'center',
    headerClasses: 'whitespace-nowrap',
    classes: 'whitespace-nowrap',
  },
]
const tableData = ref(props.SpecificDisease.ProcedureRequestFormItems)

const done = (row, rowIndex) => {
  if (row.ExecutionDatetime !== undefined) {
    emit('done', rowIndex)
  }
}
</script>

