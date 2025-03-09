<template>
  <q-dialog ref="dialogRef" full-width no-backdrop-dismiss>
    <my-dialog-content :header="editHeader" width="600px" @close="onDialogCancel">
      <my-input-group class="grid gap-2">
        <my-input-wrapper label="BT(體溫)">
          <q-input v-bind="QInputProps" v-model="editItem.BodyTemperature" type="number">
            <template #append>°C</template>
          </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="血壓" range-input>
          <template #range-input-0>
            <q-input v-bind="QInputProps" v-model="editItem.BloodPressureHigh" type="number">
              <template #append>mmHg</template>
            </q-input>
          </template>
          <template #range-input-1>
            <q-input v-bind="QInputProps" v-model="editItem.BloodPressureLow" type="number">
              <template #append>mmHg</template>
            </q-input>
          </template>
        </my-input-wrapper>
        <my-input-wrapper label="HR(脈搏)">
          <q-input v-bind="QInputProps" v-model="editItem.Hr" type="number">
            <template #append>次/分</template>
          </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="RR(呼吸速率)">
          <q-input v-bind="QInputProps" v-model="editItem.Rr" type="number">
            <template #append>次/分</template>
          </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="Pain(疼痛)">
          <q-input v-bind="QInputProps" v-model="editItem.Pain" type="number" min="0" max="10">
            <template #append>(0-10)</template>
          </q-input>
        </my-input-wrapper>
      </my-input-group>
      <template #actions>
        <q-btn unelevated color="grey" label="取消" @click="onDialogCancel"></q-btn>
        <q-btn
          v-if="editType === 'add'"
          unelevated
          color="secondary"
          label="新增"
          :loading="editLoading"
          @click="onSaveClick"
        ></q-btn>
        <q-btn
          v-if="editType === 'edit'"
          unelevated
          color="primary"
          label="儲存"
          :loading="editLoading"
          @click="onSaveClick"
        ></q-btn>
        <q-btn
          v-if="editType === 'delete'"
          unelevated
          color="negative"
          label="刪除"
          :loading="editLoading"
          @click="DeleteIpdVitalSignItem"
        >
        </q-btn>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { getIpdVitalSignItem, postIpdVitalSignItem, putIpdVitalSignItem, deleteIpdVitalSignItem } from 'api'
import { QInputProps } from 'utils/quasar-extends/base-props.js'
import { validate } from 'utils/quasar-extends/validate.js'
import { useRequired } from 'utils/rules.js'
import { cloneDeep } from 'lodash-es'

const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  editType: String,
  ipdId: String,
  data: {
    type: Object,
    default: () => ({
      BodyTemperature: null,
      BloodPressureLow: null,
      BloodPressureHigh: null,
      BloodPressureAvg: null,
      Hr: null,
      Rr: null,
      Pain: null,
    }),
  },
  id: String,
})

const editHeader = computed(() => {
  switch (props.editType) {
    case 'add':
      return `新增 Vital Signs`
    case 'edit':
      return `編輯 Vital Signs`
    case 'delete':
      return `刪除 Vital Signs`
    default:
      return null
  }
})

const editItem = reactive(cloneDeep(props.data))

const getDataLoading = ref(false)
const GetIpdVitalSignItem = async () => {
  try {
    getDataLoading.value = true
    const res = await getIpdVitalSignItem(props.id)
    Object.assign(editItem, res.data)
  } catch (err) {
    console.log(err)
  } finally {
    getDataLoading.value = false
  }
}

const inputRefs = reactive({})
const rules = {}

const onSaveClick = async () => {
  const { result, errorInputRef } = validate(inputRefs)

  if (result === false) {
    errorInputRef.focus()
    return
  }

  const cloneEditItem = cloneDeep(editItem)
  cloneEditItem.IpdId = props.ipdId
  cloneEditItem.BloodPressureAvg =
    Number(cloneEditItem.BloodPressureHigh) / 3 + (Number(cloneEditItem.BloodPressureLow) * 2) / 3

  switch (props.editType) {
    case 'add':
      PostIpdVitalSignItem(cloneEditItem)
      break
    case 'edit':
      PutIpdVitalSignItem(cloneEditItem)
      break
  }
}

const editLoading = ref(false)
const PostIpdVitalSignItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await postIpdVitalSignItem(editItem)
    $q.notify({
      type: 'positive',
      message: '新增 Vital Signs成功',
      position: 'top',
    })
    onDialogOK()
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '新增 Vital Signs失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const PutIpdVitalSignItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await putIpdVitalSignItem(editItem)
    $q.notify({
      type: 'positive',
      message: '編輯 Vital Signs成功',
      position: 'top',
    })
    onDialogOK()
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '編輯 Vital Signs失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const DeleteIpdVitalSignItem = async () => {
  try {
    editLoading.value = true
    const res = await deleteIpdVitalSignItem(props.id)
    $q.notify({
      type: 'positive',
      message: '刪除 Vital Signs成功',
      position: 'top',
    })
    onDialogOK()
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '刪除 Vital Signs失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}
</script>

