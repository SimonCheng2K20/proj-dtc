<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss>
    <my-dialog-content header="床位預約" width="1280px" @close="onDialogCancel">
      <div class="font-bold">是否確認預定此床位?</div>
      <my-input-group class="grid gap-2">
        <my-input-wrapper label="預定床位日期" required-mark>
          <my-date-input
            v-bind="QInputProps"
            :ref="(el) => (inputRefs.IpdPreDischargeDate = el)"
            :rules="rules.IpdPreDischargeDate"
            v-model="IpdPreDischargeDate"
            :date-options="(date) => dayjs(date).isSameOrAfter(dayjs())"
          ></my-date-input>
        </my-input-wrapper>
        <my-input-wrapper label="床位樓層">
          <q-input v-bind="QInputProps" :model-value="data.Floor" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="床位號碼">
          <q-input v-bind="QInputProps" :model-value="data.Bed" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="床位狀態">
          <q-input v-bind="QInputProps" :model-value="data.BedStatus" readonly></q-input>
        </my-input-wrapper>
      </my-input-group>

      <template #actions>
        <q-btn unelevated color="grey" label="取消" @click="onDialogCancel" />
        <q-btn unelevated color="primary" label="確定預約" :loading="reserveLoading" @click="onSubmitClick" />
      </template>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { QInputProps } from 'utils/quasar-extends/base-props.js'
import { postIpdRecordItem, deleteIpdRecordItem } from 'api'
import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import { useOpdStore } from 'stores/opd.js'

const opdStore = useOpdStore()
dayjs.extend(isSameOrAfter)
const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  data: Object,
  departmentNo: String,
  hasReservedId: String,
})

const IpdPreDischargeDate = ref(null)

const inputRefs = reactive({})
const rules = {
  IpdPreDischargeDate: [
    (val) => (val !== null && val !== '') || '請選擇預計入院時間',
    (val) => {
      console.log(val)
      return /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/.test(val) || '無效的日期'
    },
    (val) => {
      return dayjs(val).isValid() || '無效的日期'
    },
    (val) => {
      return dayjs(val).isSameOrAfter(dayjs()) || '預計入院時間不得小於今日日期'
    },
  ],
}

const validate = async () => {
  let errorInputRef = null

  const validationArr = Object.entries(inputRefs).map(([key, inputRef]) => {
    if (!!inputRef) {
      const validatedResult = inputRef.validate()
      if (errorInputRef === null && validatedResult === false) errorInputRef = inputRef
      return validatedResult
    } else {
      return null
    }
  })

  if (validationArr.includes(false) === false) return true
  else {
    errorInputRef.focus()
    return false
  }
}

const onSubmitClick = async () => {
  if ((await validate()) === false) return
  if (props.hasReservedId) {
    await DeleteIpdRecordItem()
  }
  PostIpdRecordItem()
}

const reserveLoading = ref(false)
const PostIpdRecordItem = async () => {
  try {
    reserveLoading.value = true
    const body = {
      PatientId: opdStore.opdData.PatientId,
      BedId: props.data.Id,
      IpdPreDate: dayjs(IpdPreDischargeDate.value).format(),
      DepartmentId: props.departmentNo,
      OpdId: opdStore.opdData.OpdId,
      Status: 1,
    }
    const res = await postIpdRecordItem(body)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '預約住院成功',
        position: 'top',
      })
      onDialogOK(res.data)
    }
  } catch (err) {
    console.log(JSON.stringify(err.data))
    $q.notify({
      type: 'negative',
      message: '預約住院失敗：' + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  } finally {
    reserveLoading.value = true
  }
}

const DeleteIpdRecordItem = async () => {
  try {
    reserveLoading.value = true
    const res = await deleteIpdRecordItem(props.hasReservedId)
  } catch (err) {
    console.log(JSON.stringify(err.data))
  }
}
</script>

