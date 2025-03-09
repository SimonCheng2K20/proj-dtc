<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss full-width>
    <my-dialog-content :header="editHeader" width="1100px" @close="onDialogCancel" :loading="getDataLoading">
      <div class="relative font-semibold">
        <div class="text-center text-2xl">Progress Note 病程記錄</div>
        <div class="absolute bottom-0 left-2 text-xl">病程紀錄日期:{{ data?.ProgressNoteDate?.substring(0, 10) }}</div>
      </div>

      <div class="grid grid-cols-2 gap-2 pt-1">
        <q-card flat bordered>
          <q-card-section class="bg-[#cbe3f3] p-1 text-xl font-semibold">POMR 問題描述</q-card-section>
          <q-card-section class="pt-0">
            <q-input :readonly="props.editType === 'reading'" v-model="data.PomrDescription" type="textarea"></q-input>
          </q-card-section>
        </q-card>
        <q-card flat bordered>
          <q-card-section class="bg-[#cbe3f3] p-1 text-xl font-semibold">Subjective 主訴</q-card-section>
          <q-card-section class="pt-0">
            <q-input :readonly="props.editType === 'reading'" v-model="data.Subjective" type="textarea"></q-input>
          </q-card-section>
        </q-card>
        <q-card class="row-span-2" flat bordered>
          <q-card-section class="bg-[#cbe3f3] p-1 text-xl font-semibold">Objective 客觀</q-card-section>
          <q-card-section class="pt-0">
            <q-input :readonly="props.editType === 'reading'" v-model="data.Objective" type="textarea" rows="17"></q-input>
          </q-card-section>
        </q-card>
        <q-card flat bordered>
          <q-card-section class="bg-[#cbe3f3] p-1 text-xl font-semibold">Assessment 診斷</q-card-section>
          <q-card-section class="pt-0">
            <q-input :readonly="props.editType === 'reading'" v-model="data.Assessment" type="textarea"></q-input>
          </q-card-section>
        </q-card>
        <q-card flat bordered>
          <q-card-section class="bg-[#cbe3f3] p-1 text-xl font-semibold">Plan 治療計畫</q-card-section>
          <q-card-section class="pt-0">
            <q-input :readonly="props.editType === 'reading'" v-model="data.Plan" type="textarea"></q-input>
          </q-card-section>
        </q-card>
      </div>
      <template #actions>
        <q-btn unelevated color="grey" label="取消" @click="onDialogCancel"></q-btn>
        <q-btn v-if="props.editType === 'add'" unelevated color="secondary" label="新增" :disable="getDataLoading" @click="onEdit"></q-btn>
        <q-btn v-if="props.editType === 'edit'" unelevated color="primary" label="儲存" :disable="getDataLoading" @click="onEdit"></q-btn>
        <q-btn v-if="props.editType === 'delete'" unelevated color="negative" label="確定刪除" :disable="getDataLoading" @click="onEdit"> </q-btn>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch, watchEffect } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { getIpdProgressNoteItem, postIpdProgressNote, putIpdProgressNote, deleteIpdProgressNote, getIpdRecordItem } from 'api'
import { useRoute } from 'vue-router'
import { useAuthStore } from 'stores/auth'
import { cloneDeep } from 'lodash-es'
import dayjs from 'dayjs'

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()
const $q = useQuasar()
const route = useRoute()
const authStore = useAuthStore()

const props = defineProps({
  editType: String,
  id: [String, Number],
})

const getDataLoading = ref(false)

const editHeader = computed(() => {
  switch (props.editType) {
    case 'add':
      return `新增Progress Note 病程記錄`
    case 'edit':
      return `修改Progress Note 病程記錄`
    case 'delete':
      return `刪除Progress Note 病程記錄`
    case 'reading':
      return `Progress Note 病程記錄`
    default:
      return null
  }
})

const data = ref({
  Id: 0,
  IpdId: route.params.Id,
  ProgressNoteDate: dayjs().format('YYYY-MM-DD'),
  PomrDescription: null,
  Subjective: null,
  Objective: null,
  Assessment: null,
  Plan: null,
  WritingDocId: authStore.userData.No,
})
// 拿單一病人資訊
const GetIpdRecordItem = async () => {
  try {
    const res = await getIpdRecordItem(route.params.Id)
    if (res.status === 200) {
      data.value.AttendingDocName = res.data.AttendingDocName
    }
  } catch (err) {
    console.log(err)
  }
}
// 拿病程紀錄 processNote
const GetIpdProgressNoteItem = async () => {
  getDataLoading.value = true
  try {
    const res = await getIpdProgressNoteItem(props.id)
    if (res.status === 200) {
      data.value = res.data
    }
  } catch (error) {
    console.log(error)
  } finally {
    getDataLoading.value = false
  }
}

const onEdit = () => {
  switch (props.editType) {
    case 'add':
      PostIpdProgressNoteItem()
      return
    case 'edit':
      PutIpdProgressNoteItem()
      return
    case 'delete':
      DeleteIpdProgressNoteItem()
      return
    default:
      return null
  }
}

const PostIpdProgressNoteItem = async () => {
  getDataLoading.value = true
  const body = cloneDeep(data.value)
  try {
    const res = await postIpdProgressNote(body)
    if (res.status === 200) {
      $q.notify({
        type: 'positive',
        message: '新增Progress Note 病程記錄成功',
        position: 'top',
      })
      onDialogOK()
    }
  } catch (error) {
    console.log(error)
  } finally {
    getDataLoading.value = false
  }
}

const PutIpdProgressNoteItem = async () => {
  getDataLoading.value = true
  const body = cloneDeep(data.value)
  try {
    const res = await putIpdProgressNote(body)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '修改Progress Note 病程記錄成功',
        position: 'top',
      })
      onDialogOK()
    }
  } catch (error) {
    console.log(error)
  } finally {
    getDataLoading.value = false
  }
}

const DeleteIpdProgressNoteItem = async () => {
  getDataLoading.value = true
  try {
    const res = await deleteIpdProgressNote(props.id)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '刪除Progress Note 病程記錄成功',
        position: 'top',
      })
      onDialogOK()
    }
  } catch (error) {
    console.log(error)
  } finally {
    getDataLoading.value = false
  }
}

const init = () => {
  if (props.id) GetIpdProgressNoteItem()
  GetIpdRecordItem()
}
init()
</script>
