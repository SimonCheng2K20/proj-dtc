<template>
  <div class="p-2">
    <TwDRGs
      :loading="loadingCasePayment"
      v-model:twDRGsIcdTable="twDRGsIcdTable"
      v-model:twDRGsPcsTable="twDRGsPcsTable"
      @freshCheck="freshCheck"
    >
      <template #bottom>
        <div class="flex justify-end mt-2">
          <q-btn color="pink-10" unelevated dense size="16px" v-if="readonly !== true" @click="PutIpdTwDrgsItem"
            >完成醫囑</q-btn
          >
        </div>
      </template>
    </TwDRGs>
    <div class="flex justify-end items-center gap-3 mt-2">
      <div class="flex-1 justify-center flex gap-2 items-center mr-5">
        <span class="font-bold"> 驗證上方手術診斷表格 是否為「主要合併症或併發症」 </span>
        <q-select
          v-bind="QSelectProps"
          v-model="status"
          :options="[
            { label: '死亡', value: 1 },
            { label: '非死亡', value: 0 },
          ]"
          option-label="label"
          option-value="value"
          emit-value
          map-options
        >
        </q-select>
        <q-btn color="primary" label="驗證" @click="CheckComorbidity" unelevated dense></q-btn>
        <span class="font-bold flex items-center" v-if="isComorbidity !== null">
          <span>驗證結果：</span>
          <span :class="isComorbidity ? 'text-positive' : 'text-negative'"> {{ isComorbidity ? '是' : '否' }}</span>
        </span>

        <div class="ml-5 border-0 border-l-2 border-blue-500">
          <q-btn
            class="ml-5"
            color="primary"
            label="DRG編審"
            unelevated
            dense
            @click="generateTwDRGsTable()"
            :disable="!hasCheck"
          ></q-btn>
        </div>
      </div>
    </div>
    <div class="mt-3 m-2" style="padding-bottom: 100px" v-if="showTwDRGsTable">
      <TwDRGsEditorTable
        :icd10Main="twDRGsIcdTable[0]"
        :isComorbidity="isComorbidity"
        :rows="drgTableData"
        :loading="tableLoading"
      ></TwDRGsEditorTable>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useQuasar } from 'quasar'
import { QSelectProps } from 'utils/quasar-extends/base-props.js'
import setSearchQuery from 'utils/setSearchQuery.js'
import { checkComorbidity, postFindDRG, putIpdTwDrgsItem, getIpdTwDrgsItem } from 'api'
import { cloneDeep } from 'lodash-es'
import dayjs from 'dayjs'
import { useIpdStore } from 'stores/ipd'

import TwDRGs from 'components/tw-drgs/TwDRGs.vue'
import TwDRGsEditorTable from 'components/tw-drgs/TwDRGsEditorTable.vue'
import { useRoute } from 'vue-router'

const $q = useQuasar()
const props = defineProps({
  readonly: Boolean,
  routeIpdId: String,
})
const route = useRoute()
const ipdStore = useIpdStore()
// 預編輯物件資料
const loadingCasePayment = ref(false)
const twDRGsIcdTable = ref([])
const twDRGsPcsTable = ref([])
const editItem = ref({})
const GetIpdTwDrgsItem = async () => {
  loadingCasePayment.value = true
  const query = setSearchQuery({ ipdId: route.params.Id })

  try {
    const res = await getIpdTwDrgsItem(query)
    if (res.status === 200) {
      twDRGsIcdTable.value = cloneDeep(res.data.DiagnosisItems)
      twDRGsPcsTable.value = cloneDeep(res.data.Icd10PcsItems) ? cloneDeep(res.data.Icd10PcsItems) : []
      editItem.value = cloneDeep(res.data)
    }
  } catch (error) {
    console.log(error)
  } finally {
    loadingCasePayment.value = false
  }
}
const PutIpdTwDrgsItem = async () => {
  loadingCasePayment.value = true

  const body = {
    DiagnosisItems: twDRGsIcdTable.value,
    Icd10PcsItems: twDRGsPcsTable.value,
    Id: editItem.value.Id,
    IpdId: route.params.Id,
  }
  try {
    const res = await putIpdTwDrgsItem(body)
    if (res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '成功完成住院Tw-DRG醫囑!',
        position: 'top',
      })
      GetIpdTwDrgsItem()
    }
  } catch (error) {
    console.log(error)
  } finally {
    loadingCasePayment.value = false
  }
}

const showTwDRGsTable = ref(false)
const generateTwDRGsTable = () => {
  showTwDRGsTable.value = true
  PostFindDRG()
}

const status = ref(0)
const isComorbidity = ref(null)
const hasCheck = ref(false)

const CheckComorbidity = async () => {
  if (twDRGsIcdTable.value[0] === undefined || twDRGsIcdTable.value[0].Icd10Code === null) {
    $q.notify({
      type: 'negative',
      message: '請先添加手術診斷!',
      position: 'top',
    })
    return
  }
  const icd10Main = twDRGsIcdTable.value[0]
  const icd10SecArr = twDRGsIcdTable.value
    .map((item) => {
      return item.Icd10Code
    })
    .splice(1)
  const body = { icd10Main: icd10Main.Icd10Code, icd10Secs: icd10SecArr, status: status.value }
  const res = await checkComorbidity(body)
  if (res.status === 200) {
    isComorbidity.value = res.data
    hasCheck.value = true
  }
}

const tableLoading = ref(false)
const drgTableData = ref([])
const PostFindDRG = async () => {
  tableLoading.value = true

  const icd10MainArr = [twDRGsIcdTable.value[0].Icd10Code]
  const icd10SecArr = twDRGsIcdTable.value
    .map((item) => {
      return item.Icd10Code
    })
    .splice(1)
  const allPcsCodeArr = twDRGsPcsTable.value.map((item) => {
    return item.PcsCode
  })
  const IpdDate = dayjs(ipdStore.ipdData.IpdDate)
  const birthDate = dayjs(ipdStore.ipdData.Patient.Person.BirthDate)
  const diffInDays = IpdDate.diff(birthDate, 'day')
  const body = {
    Diagnosis: {
      Principal: icd10MainArr,
      Secondary: icd10SecArr,
    },
    Procedure: allPcsCodeArr,
    Comorbidity: isComorbidity.value,
    NewbornDays: diffInDays,
  }
  try {
    const res = await postFindDRG(body)
    if (res.status === 200) {
      console.log('test', res.data)
      if (res.data.DRGList !== null) {
        drgTableData.value = cloneDeep(res.data.DRGList)
        drgTableData.value.forEach((element) => {
          element.complication = isComorbidity.value
        })
      }
    }
  } catch (error) {
    console.log(error)
  } finally {
    tableLoading.value = false
  }
}

const freshCheck = () => {
  hasCheck.value = false
  isComorbidity.value = null
}

const init = () => {
  GetIpdTwDrgsItem()
}
init()
</script>

