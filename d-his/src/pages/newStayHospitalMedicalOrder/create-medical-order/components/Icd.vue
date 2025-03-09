<template>
  <div>
    <IcdTable
      ref="icdTableRef"
      title="手術診斷"
      v-model:rows="icdRows"
      :columns="icdColumns"
      :loading="getDataLoading"
      preset
    >
    </IcdTable>

    <div class="h-16 border border-soild border-[#a6bee3] bg-[#EEF8FF] flex justify-end items-center border-t-0">
      <q-btn
        class="mr-5"
        label="完成醫囑"
        color="pink-10"
        unelevated
        dense
        :loading="getDataLoading"
        @click="PutIpdDiagnosis"
      >
      </q-btn>
    </div>

    <div class="mt-10 px-3 flex">
      <p class="bg-[#1976d2] text-white text-xl font-medium px-2 rounded">手術診斷紀錄</p>
    </div>

    <IcdTable v-model:rows="icdRowsReadOnly" :columns="icdColReadOnly" :loading="getDataLoading" preset readonly>
    </IcdTable>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { cloneDeep } from 'lodash-es'
import { useQuasar } from 'quasar'
import { getIpdDiagnosis, putIpdDiagnosis } from 'api'
import setSearchQuery from 'utils/setSearchQuery.js'
import { useRoute } from 'vue-router'
import dayjs from 'dayjs'

import IcdTable from 'components/opd/IcdTable.vue'

const $q = useQuasar()
const route = useRoute()

const icdRows = ref([])
const icdColumns = ['DiagnosisDate', 'Icd10Code', 'Icd9Code', 'Name', 'action']

const icdRowsReadOnly = ref([])
const icdColReadOnly = ['DiagnosisDate', 'Icd10Code', 'Icd9Code', 'Name']

const getDataLoading = ref(false)
const stayIcdItem = ref({})
const GetIpdDiagnosis = async () => {
  getDataLoading.value = true
  try {
    const query = setSearchQuery({ ipdId: route.params.Id })
    const res = await getIpdDiagnosis(query)
    if (res.status === 200) {
      icdRows.value = cloneDeep(res.data.DiagnosisItems)
      icdRowsReadOnly.value = cloneDeep(res.data.DiagnosisItems)
      stayIcdItem.value = cloneDeep(res.data)
    }
  } catch (error) {
    console.log(error)
  } finally {
    getDataLoading.value = false
  }
}
const icdTableRef = ref()
const PutIpdDiagnosis = async () => {
  icdTableRef.value.validate()
  if (!icdTableRef.value.validate().result) {
    icdTableRef.value.validate().errorInputRef.focus()
    return false
  }
  getDataLoading.value = true

  const body = {
    Id: stayIcdItem.value.Id,
    IpdId: route.params.Id,
    DiagnosisItems: icdRows.value.map((item) => {
      return { ...item, DiagnosisDate: dayjs(new Date()) }
    }),
  }
  try {
    const res = await putIpdDiagnosis(body)
    if (res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '成功完成住院手術診斷!',
        position: 'top',
      })
      GetIpdDiagnosis()
    }
  } catch (error) {
    console.log(error)
  } finally {
    getDataLoading.value = false
  }
}

const init = () => {
  GetIpdDiagnosis()
}
init()
</script>

