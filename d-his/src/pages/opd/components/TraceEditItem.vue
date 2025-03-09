<template>
  <q-dialog ref="dialogRef" full-width full-height no-backdrop-dismiss>
    <my-dialog-content
      :header="hasTrace ? '編輯個案追蹤' : '加入個案追蹤'"
      @close="onDialogCancel"
      :loading="getDataloading"
    >
      <div>
        <my-input-wrapper class="mb-1" label="疾病類別">
          <div class="pr-3 border border-blue-900 border-l-0">
            <q-radio v-model="disease" val="TraceTb" label="結核病" />
            <q-radio v-model="disease" val="TraceDb" label="糖尿病" />
            <q-radio v-model="disease" val="Other" label="其他" />
          </div>
        </my-input-wrapper>
      </div>
      <div class="flex justify-between px-5">
        <span>病歷號：{{ opdStore.opdData.PatientId }}</span>
        <span>姓名：{{ opdStore.opdData.PersonName }}</span>
        <span>性別：{{ opdStore.opdData.Gender }}</span>
        <span>年齡：{{ opdStore.opdData.Age }}</span>
        <span>生日：{{ opdStore.opdData.BirthDate.substring(0, 10) }}</span>
        <span>身分證號：{{ opdStore.opdData.Idetifier }}</span>
        <span>身分別：{{ opdStore.opdData.IdentityName }}</span>
        <span>過敏：{{ opdStore.opdData.Allergy }}</span>
      </div>

      <div class="grid grid-cols-2" v-if="disease !== 'Other'">
        <div class="m-1" v-for="(step, index) in steps" :key="index">
          <q-table v-bind="QTableProps" :rows="tableDatas[step]" :columns="columns" :pagination="pagination">
            <template #top>
              <div class="w-full flex justify-between">
                <div class="row items-center">
                  <span>第{{ stepCh(index) }}階段</span>
                </div>
                <q-btn
                  label="新增欄位"
                  color="indigo-5"
                  unelevated
                  @click="editDiseaseEvent('add', index + 1, undefined, editItem)"
                ></q-btn>
              </div>
            </template>

            <template #body-cell-action="{ col, row, rowIndex }">
              <q-td :props="{ col }">
                <q-btn
                  class="mr-2"
                  color="primary"
                  label="編輯"
                  unelevated
                  dense
                  @click="editDiseaseEvent('edit', index + 1, row.Id, row, rowIndex)"
                ></q-btn>
                <q-btn
                  color="delete"
                  label="刪除"
                  unelevated
                  dense
                  @click="editDiseaseEvent('delete', index + 1, row.Id, row, rowIndex)"
                ></q-btn>
              </q-td>
            </template>
            <template #body-cell-EventStatus="{ col, row }">
              <q-td :props="{ col }">
                <q-btn
                  :color="row.EventStatus ? 'delete' : 'green'"
                  :label="row.EventStatus ? '已完成' : '確認'"
                  unelevated
                  dense
                  :loading="editLoading"
                  @click="hasTrace ? PutPatientTraceTb(row) : (row.EventStatus = !row.EventStatus)"
                >
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </div>
      </div>

      <div v-if="disease === 'Other'">
        <div class="font-bold my-2">備註說明:</div>
        <q-input v-bind="QInputProps" type="textarea" v-model="note"></q-input>
      </div>

      <template #actions>
        <q-btn unelevated color="grey" label="取消" @click="onDialogCancel" />
        <q-btn
          v-if="hasTrace && disease === 'Other'"
          unelevated
          color="primary"
          label="更新備註"
          :loading="editLoading"
          @click="PutPatientTrace"
        />
        <q-btn
          v-if="!hasTrace"
          unelevated
          color="primary"
          label="建立個案追蹤"
          :loading="editLoading"
          @click="PostPatientTrace"
        />
      </template>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import baseTraceTb from 'assets/patient-trace/baseTraceTb.json'
import { ref, reactive, computed, watchEffect, provide } from 'vue'
import { QTableProps, QInputProps, QSelectProps } from 'utils/quasar-extends/base-props.js'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { getPatientTraceTb, putPatientTraceTb, postPatientTrace, putPatientTrace } from 'api'
import { useOpdStore } from 'stores/opd.js'

import EditDiseaseEvent from './EditDiseaseEvent.vue'

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()
const props = defineProps({
  editType: String,
  traceData: Object,
  hasTrace: Boolean,
})
const note = ref(props.traceData.Notes)
const hasTrace = ref(props.hasTrace)

const $q = useQuasar()
const opdStore = useOpdStore()

const getDataloading = ref(false)
const editLoading = ref(false)
const disease = ref('Other')

const steps = reactive(['step1', 'step2', 'step3', 'step4'])
const tableDatas = reactive({})

const editItem = reactive({
  Id: 0,
  PatientId: null,
  Step: null,
  TbDate: null,
  Event: null,
  ApplyNo: null,
  EventStatus: false,
})

const columns = computed(() => {
  const arr = [
    { name: 'TbDate', label: '日期', field: (row) => row.TbDate?.substring(0, 10), align: 'center' },
    { name: 'Event', label: '事件', field: 'Event', align: 'center' },
    { name: 'ApplyNo', label: '申請編號', field: 'ApplyNo', align: 'center' },
    { name: 'action', label: '操作', field: 'action', align: 'center' },
    { name: 'EventStatus', label: '完成事件', field: 'EventStatus', align: 'center' },
  ]

  return arr
})

const stepCh = (index) => {
  switch (index) {
    case 0:
      return '一'
    case 1:
      return '二'
    case 2:
      return '三'
    case 3:
      return '四'
  }
}

const pagination = ref({
  page: 1,
  rowsPerPage: -1,
})

const GetPatientTraceTb = async () => {
  getDataloading.value = true
  try {
    const res = await getPatientTraceTb(`?filter=PatientId eq '${opdStore.opdData.PatientId}'`) //根據 "身分證" 做篩選
    if (res.status === 200) {
      if (res.data.Items.length !== 0) {
        hasTrace.value = true
        for (let i = 1; i < 5; i++) {
          tableDatas['step' + i] = res.data.Items.filter((item) => {
            return item.Step === i
          })
        }
      } else {
        baseTraceTb.forEach((element) => {
          element.PatientId = opdStore.opdData.PatientId
        })
        for (let i = 1; i < 5; i++) {
          tableDatas['step' + i] = baseTraceTb.filter((item) => {
            return item.Step === i
          })
        }
      }
    }
  } catch (err) {
    console.log(err)
  } finally {
    getDataloading.value = false
  }
}

const editDiseaseEvent = (action, step, Id, row, rowIndex) => {
  const dialog = $q
    .dialog({
      component: EditDiseaseEvent,
      componentProps: {
        step: step,
        editType: action,
        Id: Id,
        editItem: row,
        hasTrace: hasTrace.value,
        patientId: opdStore.opdData.PatientId,
      },
    })
    .onOk((newRow) => {
      dialog.hide()
      if (hasTrace.value) {
        GetPatientTraceTb()
      } else {
        if (action === 'add') {
          tableDatas['step' + step].push(newRow)
        } else if (action === 'edit') {
          tableDatas['step' + step].splice(rowIndex, 1, newRow)
        } else if (action === 'delete') {
          tableDatas['step' + step].splice(rowIndex, 1)
        }
      }
    })
}

const PutPatientTraceTb = async (row) => {
  row.EventStatus = !row.EventStatus
  try {
    editLoading.value = true
    const res = await putPatientTraceTb(row)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '編輯個案追蹤成功',
        position: 'top',
      })
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '編輯個案追蹤失敗：' + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

// 加入個案追蹤
const PostPatientTrace = async () => {
  const totalTable = [...tableDatas.step1, ...tableDatas.step2, ...tableDatas.step3, ...tableDatas.step4]
  editLoading.value = true
  try {
    const body = {
      PatientId: opdStore.opdData.PatientId,
      DiseaseType: '99',
      Pacs: false,
      Laboratory: false,
      Notes: note.value,
      PatientTraceTbs: totalTable,
    }
    const res = await postPatientTrace(body)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '加入個案追蹤成功',
        position: 'top',
      })
      onDialogOK()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '加入個案追蹤失敗：' + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

// 更新個案追蹤
const PutPatientTrace = async () => {
  console.log('props.note', note.value)
  const totalTable = [...tableDatas.step1, ...tableDatas.step2, ...tableDatas.step3, ...tableDatas.step4]
  editLoading.value = true
  try {
    const body = {
      PatientId: opdStore.opdData.PatientId,
      DiseaseType: '99',
      Pacs: false,
      Laboratory: false,
      Notes: note.value,
      PatientTraceTbs: totalTable,
    }
    const res = await putPatientTrace(body)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '更新個案追蹤成功',
        position: 'top',
      })
      onDialogOK()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '加入個案追蹤失敗：' + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const init = () => {
  console.log('get test GetPatientTraceTb')
  GetPatientTraceTb()
}
init()
</script>

