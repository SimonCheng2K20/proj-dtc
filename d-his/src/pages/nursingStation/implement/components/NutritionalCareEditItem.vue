<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss>
    <my-dialog-content :header="editHeader" @close="onDialogCancel" :loading="getDataLoading">
      <div v-if="editType === 'delete'" class="text-negative mb-1">是否確定刪除此管灌及營養照護紀錄？</div>
      <my-input-group class="grid gap-2">
        <my-input-wrapper label="執行日期時間">
          <q-input
            v-bind="QInputProps"
            :model-value="dayjs(editItem.ExecutionDateTime).format('YYYY-MM-DD HH:mm:ss')"
            readonly
          ></q-input>
        </my-input-wrapper>

        <my-input-wrapper label="診療項目" required-mark>
          <q-select
            v-bind="QSelectProps"
            :ref="(el) => (inputRefs.ProcedureId = el)"
            :rules="rules.ProcedureId"
            v-model="editItem.ProcedureId"
            :options="procedureFilterItems"
            :option-label="(opt) => (opt ? opt?.ProcedureCname : null)"
            option-value="ProcedureId"
            map-options
            use-input
            @filter="onProcedureFilter"
            @update:model-value="(val) => (val ? onProcedureSelect(val) : null)"
            :readonly="editType === 'delete'"
          >
            <template #no-option="{ inputValue }">
              <q-item v-if="!!inputValue">
                <q-item-section class="text-grey">
                  <q-spinner v-if="filterLoading" color="primary"></q-spinner>
                  <span v-else>找不到符合的資料</span>
                </q-item-section>
              </q-item>
            </template>
            <template #option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>
                    <div v-html="scope.opt.filterLabel"></div>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </my-input-wrapper>
        <my-input-wrapper label="健保代碼">
          <q-input v-bind="QInputProps" v-model="editItem.NhiCode" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="健保點數">
          <q-input v-bind="QInputProps" v-model="editItem.AfterNhiPoint" readonly></q-input>
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
          :disable="getDataLoading"
          @click="onSaveClick"
        ></q-btn>
        <q-btn
          v-if="editType === 'edit'"
          unelevated
          color="primary"
          label="儲存"
          :loading="editLoading"
          :disable="getDataLoading"
          @click="onSaveClick"
        ></q-btn>
        <q-btn
          v-if="editType === 'delete'"
          unelevated
          color="negative"
          label="刪除"
          :loading="editLoading"
          :disable="getDataLoading"
          @click="DeleteIpdNasogastricTubeItem"
        >
        </q-btn>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>
<script setup>
import { ref, reactive, computed, toRef, watch } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { getIpdNasogastricTubeItem, putIpdNasogastricTubeItem, deleteIpdNasogastricTubeItem } from 'api'
import { QInputProps, QSelectProps } from 'utils/quasar-extends/base-props.js'
import { validate } from 'utils/quasar-extends/validate.js'
import { useRequired } from 'utils/rules.js'
import dayjs from 'dayjs'
import { useFilter } from 'utils/quasar-extends/use-filter.js'

const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  editType: String,
  ipdId: String,
  id: [String, Number],
  procedureItems: Array,
})

const editHeader = computed(() => {
  switch (props.editType) {
    case 'add':
      return `新增管灌及營養照護紀錄`
    case 'edit':
      return `編輯管灌及營養照護紀錄`
    case 'delete':
      return `刪除管灌及營養照護紀錄`
    default:
      return null
  }
})

const editItem = reactive({
  IpdId: props.ipdId,
  ExecutionDateTime: dayjs().format(),
  ProcedureId: null,
  NhiCode: null,
  AfterNhiPoint: null,
})

const getDataLoading = ref(false)
const GetIpdNasogastricTubeItem = async () => {
  try {
    getDataLoading.value = true
    const res = await getIpdNasogastricTubeItem(props.id)
    if (res.status === 200) {
      Object.assign(editItem, res.data)
    }
  } catch (err) {
    console.log(err)
  } finally {
    getDataLoading.value = false
  }
}

const inputRefs = reactive({})
const rules = {
  ProcedureId: useRequired({ title: '診療項目', type: 'input' }),
}

const onSaveClick = async () => {
  const { result, errorInputRef } = validate(inputRefs)

  if (result === false) {
    errorInputRef.focus()
    return
  }

  PutIpdNasogastricTubeItem(editItem)
}

const editLoading = ref(false)
const PutIpdNasogastricTubeItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await putIpdNasogastricTubeItem(editItem)
    $q.notify({
      type: 'positive',
      message: '編輯管灌及營養照護紀錄成功',
      position: 'top',
    })
    onDialogOK()
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '編輯管灌及營養照護紀錄失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const DeleteIpdNasogastricTubeItem = async () => {
  try {
    editLoading.value = true
    const res = await deleteIpdNasogastricTubeItem(props.id)
    $q.notify({
      type: 'positive',
      message: '刪除管灌及營養照護紀錄成功',
      position: 'top',
    })
    onDialogOK()
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '刪除管灌及營養照護紀錄失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const filterLoading = ref(false)
const procedureFilterKeys = ['ProcedureCode', 'ProcedureCname']

const { filterItems: procedureFilterItems, filterHandler: onProcedureFilter } = useFilter(
  { items: props.procedureItems, filterKeys: procedureFilterKeys },
  () => {
    filterLoading.value = false
  }
)

const onProcedureSelect = (opt) => {
  editItem.ProcedureId = opt.ProcedureId
  editItem.NhiCode = opt.NhiCode
  editItem.AfterNhiPoint = opt.AfterNhiPoint
}

const init = () => {
  if (!!props.id) GetIpdNasogastricTubeItem()
}
init()
</script>

