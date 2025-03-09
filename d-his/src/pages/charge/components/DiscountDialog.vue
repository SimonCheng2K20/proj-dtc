<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss full-width>
    <my-dialog-content :header="title" width="500px" @close="onDialogCancel" :loading="loading">
      <div v-if="editType === 'delete'" class="text-negative mb-1">是否確定刪除此藥品過敏記錄？</div>
      <my-input-group class="grid gap-2 pb-1">
        <my-input-wrapper label="優免類型" required-mark>
          <q-option-group
            class="ml-2 flex items-center"
            v-model="editItem.DeductionType"
            :disable="editType !== 'add'"
            dense
            :options="discountTypeOptions"
            @update:model-value="(val) => deductionTypeChange(val)"
          ></q-option-group>
        </my-input-wrapper>
        <div class="grid gap-2" v-if="editItem.DeductionType === '1'">
          <my-input-wrapper label="優免日期" required-mark>
            <my-date-input
              v-bind="QInputProps"
              :readonly="editType === 'delete'"
              v-model="editItem.DeductionDate"
              :ref="(el) => (inputRefs.DeductionDate = el)"
              :rules="rule.DeductionDate"
            >
            </my-date-input>
          </my-input-wrapper>
          <my-input-wrapper label="基金名稱" required-mark>
            <q-input
              v-bind="QInputProps"
              :readonly="editType === 'delete'"
              v-model="editItem.FundName"
              :ref="(el) => (inputRefs.FundName = el)"
              :rules="rule.FundName"
            >
            </q-input>
          </my-input-wrapper>
          <my-input-wrapper label="申請金額" required-mark>
            <q-input
              v-bind="QInputProps"
              :readonly="editType === 'delete'"
              v-model="editItem.RequestFee"
              :ref="(el) => (inputRefs.RequestFee = el)"
              :rules="rule.RequestFee"
            >
            </q-input>
          </my-input-wrapper>
          <my-input-wrapper label="核可金額" required-mark>
            <q-input
              v-bind="QInputProps"
              :readonly="editType === 'delete'"
              v-model="editItem.ApprovedFee"
              :ref="(el) => (inputRefs.ApprovedFee = el)"
              :rules="rule.ApprovedFee"
            >
            </q-input>
          </my-input-wrapper>
          <my-input-wrapper label="申請人" required-mark>
            <q-input
              v-bind="QInputProps"
              :readonly="editType === 'delete'"
              v-model="editItem.RequestName"
              :ref="(el) => (inputRefs.RequestName = el)"
              :rules="rule.RequestName"
            >
            </q-input>
          </my-input-wrapper>
          <my-input-wrapper label="核可人" required-mark>
            <q-input
              v-bind="QInputProps"
              :readonly="editType === 'delete'"
              v-model="editItem.ApprovedName"
              :ref="(el) => (inputRefs.ApprovedName = el)"
              :rules="rule.ApprovedName"
            >
            </q-input>
          </my-input-wrapper>
          <my-input-wrapper label="備註">
            <q-input v-bind="QInputProps" :readonly="editType === 'delete'" v-model="editItem.Remark"> </q-input>
          </my-input-wrapper>
        </div>
        <div class="grid gap-2" v-else>
          <my-input-wrapper label="優免日期" required-mark>
            <my-date-input
              v-bind="QInputProps"
              :readonly="editType === 'delete'"
              v-model="editItem.DeductionDate"
              :ref="(el) => (inputRefs.DeductionDate = el)"
              :rules="rule.DeductionDate"
            >
            </my-date-input>
          </my-input-wrapper>
          <my-input-wrapper label="收據號" required-mark>
            <q-input
              v-bind="QInputProps"
              :readonly="editType === 'delete'"
              v-model="editItem.ReceiptNo"
              :ref="(el) => (inputRefs.ReceiptNo = el)"
              :rules="rule.ReceiptNo"
            >
            </q-input>
          </my-input-wrapper>
          <my-input-wrapper label="核可人" required-mark>
            <q-input
              v-bind="QInputProps"
              :readonly="editType === 'delete'"
              v-model="editItem.ApprovedName"
              :ref="(el) => (inputRefs.ApprovedName = el)"
              :rules="rule.ApprovedName"
            >
            </q-input>
          </my-input-wrapper>
          <my-input-wrapper label="優免金額" required-mark>
            <q-input
              v-bind="QInputProps"
              :readonly="editType === 'delete'"
              v-model="editItem.ApprovedFee"
              :ref="(el) => (inputRefs.ApprovedFee = el)"
              :rules="rule.ApprovedFee"
            >
            </q-input>
          </my-input-wrapper>
          <my-input-wrapper label="申請人" required-mark>
            <q-input
              v-bind="QInputProps"
              :readonly="editType === 'delete'"
              v-model="editItem.RequestName"
              :ref="(el) => (inputRefs.RequestName = el)"
              :rules="rule.RequestName"
            >
            </q-input>
          </my-input-wrapper>
          <my-input-wrapper label="備註">
            <q-input v-bind="QInputProps" :readonly="editType === 'delete'" v-model="editItem.Remark"> </q-input>
          </my-input-wrapper>
        </div>
      </my-input-group>
      <template #actions>
        <q-btn label="關閉" unelevated color="grey" @click="onDialogCancel"></q-btn>
        <q-btn v-if="editType === 'add'" label="新增" unelevated color="add" @click="PostIpdDeductionHistory()"></q-btn>
        <q-btn
          v-if="editType === 'edit'"
          label="編輯"
          unelevated
          color="primary"
          :disable="loading"
          @click="PutIpdDeductionHistory()"
        ></q-btn>
        <q-btn
          v-if="editType === 'delete'"
          label="刪除"
          unelevated
          color="delete"
          :disable="loading"
          @click="DeleteIpdDeductionHistory()"
        ></q-btn>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>
<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { cloneDeep } from 'lodash'

// api
import {
  putIpdDeductionHistory,
  postIpdDeductionHistory,
  getIpdDeductionHistoryItem,
  deleteIpdDeductionHistoryItem,
} from 'api'

// utils
import { QTableProps, QInputProps, QSelectProps } from 'utils/quasar-extends/base-props.js'
import { useRequired } from 'utils/rules.js'
import { validate } from 'src/utils/quasar-extends/validate'
import dayjs from 'dayjs'

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const $q = useQuasar()

const route = useRoute()

const props = defineProps({
  editType: String,
  row: Object,
})

const title = computed(() => {
  switch (props.editType) {
    case 'add':
      return '新增優免資料'
    case 'edit':
      return '編輯優免資料'
    case 'delete':
      return '刪除優免資料'
    default:
      return ''
  }
})

const initData = {
  IpdId: route.params.ipdId,
  DeductionDate: dayjs(new Date()).format('YYYY-MM-DD'),
  DeductionType: '1',
  FundName: '',
  RequestFee: '',
  ApprovedFee: '',
  RequestName: '',
  ApprovedName: '',
  ReceiptNo: '',
  Remark: '',
}

const editItem = ref(cloneDeep(initData))

const discountTypeOptions = [
  { label: '社福優免', value: '1' },
  { label: '人工優免', value: '2' },
]

const PostIpdDeductionHistory = async () => {
  if (validate(inputRefs.value).result === true) {
    try {
      const res = await postIpdDeductionHistory(editItem.value)
      if (res.status === 200 || res.status === 204) {
        $q.notify({
          type: 'positive',
          message: '新增優免資料成功',
          position: 'top',
        })
        onDialogOK()
      }
    } catch (err) {
      console.log(err)
      $q.notify({
        type: 'negative',
        message: `新增優免資料失敗：` + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
        position: 'top',
      })
    }
  }
}

const PutIpdDeductionHistory = async () => {
  if (validate(inputRefs.value).result === true) {
    try {
      const res = await putIpdDeductionHistory(editItem.value)
      if (res.status === 200 || res.status === 204) {
        $q.notify({
          type: 'positive',
          message: '修改優免資料成功',
          position: 'top',
        })
        onDialogOK()
      }
    } catch (err) {
      console.log(err)
      $q.notify({
        type: 'negative',
        message: `修改優免資料失敗：` + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
        position: 'top',
      })
    }
  }
}

const DeleteIpdDeductionHistory = async () => {
  if (validate(inputRefs.value).result === true) {
    try {
      const res = await deleteIpdDeductionHistoryItem(editItem.value.Id)
      if (res.status === 200 || res.status === 204) {
        $q.notify({
          type: 'positive',
          message: '刪除優免資料成功',
          position: 'top',
        })
        onDialogOK()
      }
    } catch (err) {
      console.log(err)
      $q.notify({
        type: 'negative',
        message: `刪除優免資料失敗：` + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
        position: 'top',
      })
    }
  }
}

const loading = ref(false)
const GetIpdDeductionHistoryItem = async () => {
  try {
    loading.value = true
    const res = await getIpdDeductionHistoryItem(props.row.Id)
    if (res.status === 200 || res.status === 204) {
      editItem.value = res.data
    }
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
  }
}

const inputRefs = ref({})

const reg = /^[1-9][0-9]*$/

const rule = computed(() => {
  return {
    DeductionDate: useRequired({ title: '優免日期', type: 'input' }),
    FundName: useRequired({ title: '基金名稱', type: 'input' }),
    RequestFee: [(val) => reg.test(val) || '請輸入整數金額'],
    ApprovedFee: [(val) => reg.test(val) || '請輸入整數金額'],
    RequestName: useRequired({ title: editItem.value.DeductionType === '1' ? '申請人' : '經手人', type: 'input' }),
    ApprovedName: useRequired({ title: '核可人', type: 'input' }),
    ReceiptNo: useRequired({ title: '收據號', type: 'input' }),
  }
})

const deductionTypeChange = (val) => {
  editItem.value = cloneDeep(initData)
  editItem.value.DeductionType = val
  if (val === '2') editItem.value.RequestFee = 0
}

const init = () => {
  if (props.editType !== 'add') {
    GetIpdDeductionHistoryItem()
  }
}

init()
</script>
