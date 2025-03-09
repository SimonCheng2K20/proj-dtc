<template>
  <div class="p-2 grid gap-2" :class="'grid-cols-' + pieceProcedureSteps?.length">
    <q-card
      class="border-blue-500 overflow-hidden font-bold"
      flat
      bordered
      v-for="(item, index) in pieceProcedureSteps"
      :key="item.PieceStepName"
    >
      <div class="h-full flex flex-col">
        <div
          class="border-b border-blue-500 text-end h-9 relative flex items-center justify-end"
          :class="getColor(index)"
        >
          <span class="absolute left-0 w-full h-full flex items-center justify-center" :class="getColor(index)">
            {{ item.PieceStepName }}
          </span>
          <q-btn
            class="mr-2"
            color="primary"
            padding="0 5px"
            dense
            unelevated
            @click="save(index)"
            v-if="autoSave !== true && readonly !== true"
            >儲存</q-btn
          >
        </div>
        <div class="flex no-wrap">
          <div class="border-r border-blue-500 text-center" :class="getColor(index)" style="writing-mode: vertical-lr">
            基本診療項目
          </div>
          <div class="grow font-semibold p-2">
            <div v-for="(item, index) in item.BasicItems" :key="index">
              <div class="flex items-center mb-1">
                <p class="w-56">{{ item.Name }}</p>
                <q-input v-bind="QInputProps" class="grow" v-model="item.Value" @update:model-value="done"></q-input>
              </div>
              <div class="grid gap-1 my-1" v-if="!!item.NameValueDetail">
                <div class="flex items-center" v-for="(item, index) in item.NameValueDetail" :key="index">
                  <p class="w-56 pl-5">{{ item.Name }}</p>
                  <q-input v-bind="QInputProps" class="grow" v-model="item.Value" @update:model-value="done"></q-input>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="flex flex-nowrap w-full grow">
          <div class="border-t border-blue-500 text-center" :class="getColor(index)" style="writing-mode: vertical-lr">
            收費代碼及處置項目
          </div>
          <div class="min-w-auto grow p-1 border-t border-l border-blue-500">
            <q-table
              v-bind="QTableProps"
              wrap-cells
              :columns="columns"
              :rows="item.ChargeProcedureItems"
              :pagination="{ rowsPerPage: -1 }"
            >
              <template #body-cell-ExecutionDatetime="{ col, row }">
                <q-td :props="{ col }">
                  <q-btn
                    class="text-blue-10 font-bold"
                    color="yellow-3"
                    padding="0 5px"
                    label="執行"
                    dense
                    unelevated
                    @click="done(row)"
                    v-if="row.ExecutionDatetime === null"
                    :disable="readonly"
                  ></q-btn>
                  <span v-else>{{ row?.ExecutionDatetime?.substring(0, 10) }}</span>
                </q-td>
              </template>
            </q-table>
          </div>
        </div>
      </div>
    </q-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed } from 'vue'
import { QTableProps, QInputProps } from 'utils/quasar-extends/base-props.js'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { getIpdPieceProcedureAllStep, putIpdPieceProcedureStep } from 'api'
import { useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'

const $q = useQuasar()
const route = useRoute()

const props = defineProps({
  pieceProcedureSteps: Array,
  autoSave: Boolean,
  readonly: Boolean,
})
const emit = defineEmits(['doneDoctorOrder', 'done'])

const columns = [
  { name: 'Sn', label: '序號', field: 'Sn', align: 'center', headerClasses: 'whitespace-nowrap' },
  { name: 'NhiCode', label: '代碼', field: 'NhiCode', align: 'center' },
  { name: 'NhiName', label: '名稱', field: 'NhiName', align: 'left' },
  { name: 'Quantity', label: '數量', field: 'Quantity', align: 'center', headerClasses: 'whitespace-nowrap' },
  {
    name: 'ExecutionDatetime',
    label: '執行',
    field: 'ExecutionDatetime',
    align: 'center',
    classes: 'whitespace-nowrap',
  },
]

const getColor = (index) => {
  switch (index) {
    case 0:
      return 'bg-[#D0FF8A]'
    case 1:
      return 'bg-[#FFBEF8]'
    case 2:
      return 'bg-[#FFCC65]'
    default:
      break
  }
}

const PutIpdPieceProcedureStep = async (index) => {
  try {
    const body = props.pieceProcedureSteps[index]
    const res = await putIpdPieceProcedureStep(body) //query
    if (res.status === 200) {
      $q.notify({
        type: 'positive',
        message: '儲存病例計酬診療紀錄成功',
        position: 'top',
      })
      emit('doneDoctorOrder')
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '儲存病例計酬診療紀錄失敗：' + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  }
}

const save = (index) => {
  PutIpdPieceProcedureStep(index)
}

const done = (row) => {
  const date = dayjs()
  if (row.ExecutionDatetime !== undefined) {
    row.ExecutionDatetime = date.format('YYYY-MM-DD')
  }
  emit('done', row.NhiCode)
}

const init = () => {}
init()
</script>

