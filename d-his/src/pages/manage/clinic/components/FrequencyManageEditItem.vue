<template>
  <q-dialog ref="dialogRef" full-width no-backdrop-dismiss>
    <my-dialog-content :header="editHeader" width="1280px" @close="onDialogCancel" :loading="getDataLoading">
      <div v-if="editType === 'delete'" class="text-negative mb-1">是否確定刪除此用藥頻率？</div>
      <my-input-group class="grid grid-cols-2 gap-2">
        <my-input-wrapper label="用藥頻率代碼">
          <q-input
            v-bind="QInputProps"
            :ref="(el) => (inputRefs.Code = el)"
            :rules="rules.Code"
            v-model="editItem.Code"
            :readonly="editType === 'delete'"
          >
          </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="健保用藥頻率代碼">
          <q-input
            v-bind="QInputProps"
            :ref="(el) => (inputRefs.NhiCode = el)"
            :rules="rules.NhiCode"
            v-model="editItem.NhiCode"
            :readonly="editType === 'delete'"
          >
          </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="用藥頻率名稱">
          <q-input
            v-bind="QInputProps"
            :ref="(el) => (inputRefs.Name = el)"
            :rules="rules.Name"
            v-model="editItem.Name"
            :readonly="editType === 'delete'"
          >
          </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="啟用狀態">
          <q-select
            v-bind="QSelectProps"
            :ref="(el) => (inputRefs.Actived = el)"
            :rules="rules.Actived"
            v-model="editItem.Actived"
            :options="activeStatusItems"
            option-label="label"
            option-value="value"
            map-options
            emit-value
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
      </my-input-group>

      <div class="grid gap-2 mt-2">
        <div class="font-bold">使用用藥頻率：</div>
        <div class="flex items-center">
          <q-radio v-model="editItem.FrequenyType" :val="1" :disable="editType === 'delete'"></q-radio>
          <div class="flex gap-2 items-center">
            每
            <q-select
              v-bind="QSelectProps"
              v-model="PerTimes.FrequenyType_1"
              :options="[1, 2, 3, 4, 5, 6, 8, 12]"
              :readonly="editType === 'delete'"
            ></q-select>
            小時，一次
          </div>
        </div>
        <div class="flex items-center">
          <q-radio v-model="editItem.FrequenyType" :val="2" :disable="editType === 'delete'"></q-radio>
          <div class="flex gap-2 items-center">
            每
            <q-input
              v-bind="QInputProps"
              v-model="PerCycles.FrequenyType_2"
              type="number"
              :readonly="editType === 'delete'"
            ></q-input>
            天，
            <q-input
              v-bind="QInputProps"
              v-model="PerTimes.FrequenyType_2"
              type="number"
              :readonly="editType === 'delete'"
            ></q-input>
            次
          </div>
        </div>
        <div class="flex items-center">
          <q-radio v-model="editItem.FrequenyType" :val="3" :disable="editType === 'delete'"></q-radio>
          <div class="flex gap-2 items-center">
            每週
            <q-input
              v-bind="QInputProps"
              v-model="PerTimes.FrequenyType_3"
              type="number"
              :readonly="editType === 'delete'"
            ></q-input>
            次，星期：
            <q-btn
              v-for="CName in weekItems"
              :key="CName"
              :label="CName"
              :color="PerCycles.FrequenyType_3.includes(CName) ? 'primary' : undefined"
              dense
              :outline="PerCycles.FrequenyType_3.includes(CName) ? false : true"
              unelevated
              :disable="editType === 'delete'"
              @click="onWeekSelect(CName)"
            ></q-btn>
          </div>
        </div>
        <div>
          <q-radio v-model="editItem.FrequenyType" :val="4" label="需要時" :disable="editType === 'delete'"></q-radio>
        </div>
        <div>
          <q-radio
            v-model="editItem.FrequenyType"
            :val="5"
            label="STAT(立即)"
            :disable="editType === 'delete'"
          ></q-radio>
        </div>
        <div>
          <q-radio
            v-model="editItem.FrequenyType"
            :val="6"
            label="依照醫囑指示"
            :disable="editType === 'delete'"
          ></q-radio>
        </div>
      </div>

      <div class="grid gap-2 mt-2">
        <div class="font-bold">服用時間：{{ editItem.PerHours.join(', ') }}</div>
        <div class="grid grid-cols-[repeat(13,minmax(0,1fr))] gap-2 items-center">
          <div class="col-start-1 row-start-1">清晨時段</div>
          <div class="col-start-1 row-start-2">上午時段</div>
          <div class="col-start-1 row-start-3">下午時段</div>
          <div class="col-start-1 row-start-4">晚間時段</div>
          <q-btn
            v-for="time in timeItems"
            :key="time"
            :label="time"
            :color="editItem.PerHours.includes(time) ? 'primary' : undefined"
            dense
            :outline="editItem.PerHours.includes(time) ? false : true"
            unelevated
            :disable="editType === 'delete'"
            @click="onTimeSelect(time)"
          ></q-btn>
        </div>
      </div>
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
        >
        </q-btn>
        <q-btn
          v-if="editType === 'edit'"
          unelevated
          color="primary"
          label="儲存"
          :loading="editLoading"
          :disable="getDataLoading"
          @click="onSaveClick"
        >
        </q-btn>
        <q-btn
          v-if="editType === 'delete'"
          unelevated
          color="negative"
          label="刪除"
          :loading="editLoading"
          :disable="getDataLoading"
          @click="DeleteMedFrequencyCodeItem(editItem.Code)"
        >
        </q-btn>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>
<script setup>
import { ref, reactive, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import {
  getMedFrequencyCodeItem,
  postMedFrequencyCodeItem,
  putMedFrequencyCodeItem,
  deleteMedFrequencyCodeItem,
} from 'api'
import { validate } from 'utils/quasar-extends/validate.js'
import { useRequired } from 'utils/rules.js'
import { QInputProps, QSelectProps } from 'utils/quasar-extends/base-props.js'
import { activeStatusItems, weekNameItems } from 'utils/options.js'
import { range, cloneDeep } from 'lodash-es'
import dayjs from 'dayjs'

const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  editType: String,
  id: [String, Number],
})

const editHeader = computed(() => {
  switch (props.editType) {
    case 'add':
      return `新增用藥頻率`
    case 'edit':
      return `編輯用藥頻率`
    case 'delete':
      return `刪除用藥頻率`
    default:
      return null
  }
})

const editItem = reactive({
  Code: null,
  NhiCode: null,
  Name: null,
  Actived: true,
  FrequenyType: null,
  PerCycles: [],
  PerHours: [],
  PerTimes: null,
})

const PerCycles = reactive({
  FrequenyType_2: [],
  FrequenyType_3: [],
})

const PerTimes = reactive({
  FrequenyType_1: null,
  FrequenyType_2: null,
  FrequenyType_3: null,
})

const weekItems = weekNameItems.map(({ CName }) => CName.slice(2))
const onWeekSelect = (val) => {
  const index = PerCycles.FrequenyType_3.indexOf(val)
  if (index !== -1) PerCycles.FrequenyType_3.splice(index, 1)
  else PerCycles.FrequenyType_3.push(val)
}

const timeItems = range(0, 48).map((i) => {
  return dayjs()
    .hour(0)
    .minute(0)
    .add(i * 30, 'minute')
    .format('HH:mm')
})
const onTimeSelect = (val) => {
  const index = editItem.PerHours.indexOf(val)
  if (index !== -1) editItem.PerHours.splice(index, 1)
  else editItem.PerHours.push(val)
}

const getDataLoading = ref(false)
const GetMedFrequencyCodeItem = async () => {
  try {
    getDataLoading.value = true
    const res = await getMedFrequencyCodeItem(props.id)
    Object.assign(editItem, res.data)
    PerCycles[`FrequenyType_${editItem.FrequenyType}`] = editItem.PerCycles
    PerTimes[`FrequenyType_${editItem.FrequenyType}`] = editItem.PerTimes
  } catch (err) {
    console.log(err)
  } finally {
    getDataLoading.value = false
  }
}

const inputRefs = reactive({})
const rules = {
  Code: useRequired({ title: '用藥頻率代碼', type: 'input' }),
  NhiCode: useRequired({ title: '健保用藥頻率代碼', type: 'input' }),
  Name: useRequired({ title: '用藥頻率名稱', type: 'input' }),
  Actived: useRequired({ title: '啟用狀態', type: 'select' }),
}

const onSaveClick = async () => {
  const { result, errorInputRef } = validate(inputRefs)

  if (result === false) {
    errorInputRef.focus()
    return
  }

  const cloneEditItem = cloneDeep(editItem)
  cloneEditItem.PerCycles = PerCycles[`FrequenyType_${editItem.FrequenyType}`]
  cloneEditItem.PerTimes = PerTimes[`FrequenyType_${editItem.FrequenyType}`]

  switch (props.editType) {
    case 'add':
      PostMedFrequencyCodeItem(cloneEditItem)
      break
    case 'edit':
      PutMedFrequencyCodeItem(cloneEditItem)
      break
  }
}

const editLoading = ref(false)
const PostMedFrequencyCodeItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await postMedFrequencyCodeItem(editItem)
    $q.notify({
      type: 'positive',
      message: '新增用藥頻率成功',
      position: 'top',
    })
    onDialogOK()
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '新增用藥頻率失敗：' + typeof error.data === 'string' ? error.data : JSON.stringify(error.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const PutMedFrequencyCodeItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await putMedFrequencyCodeItem(editItem)
    $q.notify({
      type: 'positive',
      message: '編輯用藥頻率成功',
      position: 'top',
    })
    onDialogOK()
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '編輯用藥頻率失敗：' + typeof error.data === 'string' ? error.data : JSON.stringify(error.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const DeleteMedFrequencyCodeItem = async (id) => {
  try {
    editLoading.value = true
    const res = await deleteMedFrequencyCodeItem(id)
    $q.notify({
      type: 'positive',
      message: '刪除用藥頻率成功',
      position: 'top',
    })
    onDialogOK()
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '刪除用藥頻率失敗：' + typeof error.data === 'string' ? error.data : JSON.stringify(error.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const init = () => {
  if (props.id) GetMedFrequencyCodeItem()
}
init()
</script>

