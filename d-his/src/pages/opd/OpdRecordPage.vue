<template>
  <my-elastic-wrapper v-bind="myElasticWrapperProps">
    <div :class="{ 'flex no-wrap': !isDitto }">
      <data-header :items="patientTitle" v-if="isDitto"></data-header>

      <my-title v-if="isDitto" title="瀏覽病史記錄">
        <template #expand>
          <q-space></q-space>
          <div class="flex gap-2">
            <q-btn
              v-if="seekMedicaltype !== 'ipd'"
              class="header-btn"
              label="DITTO S.O.A"
              dense
              unelevated
              @click="onDittoClick('soa')"
            ></q-btn>
            <q-btn
              v-if="seekMedicaltype !== 'ipd'"
              class="header-btn"
              label="DITTO Selected"
              dense
              unelevated
              @click="onDittoClick('selected')"
            ></q-btn>
            <q-btn
              v-if="seekMedicaltype !== 'ipd'"
              class="header-btn"
              label="DITTO All"
              dense
              unelevated
              @click="onDittoClick('all')"
            ></q-btn>
            <q-btn
              class="header-btn"
              label="返回"
              dense
              unelevated
              @click="router.push(route.query.backpath ? route.query.backpath : router.go(-2))"
            ></q-btn>
          </div>
        </template>
      </my-title>

      <my-aside>
        <opd-aside
          ref="opdAsideRef"
          @search="onSearch"
          @select="onSelect"
          :columns="asideColumns"
          :rows="asideRows"
          :loading="asideTableLoading"
          :width="350"
        >
          <template #top v-if="isFromTracePage">
            <div class="p-1 bg-blue-200 mb-3">
              <div class="flex justify-between items-center mb-1">
                <div class="font-bold">個案備註說明</div>
                <div>
                  <q-btn class="mr-2" padding="0 5px" color="grey" dense unelevated>清除</q-btn>
                  <q-btn color="accent " padding="0 5px" dense unelevated @click="PutPatientTrace">儲存</q-btn>
                </div>
              </div>
              <q-input v-bind="QInputProps" type="textarea" class="bg-white" v-model="traceNote"></q-input>
            </div>
          </template>
          <template #moreWrapper v-if="isFromTracePage">
            <my-input-wrapper label="疾病類別">
              <q-option-group
                v-model="diseaseSelected"
                :options="diseaseOptions"
                inline
                @update:model-value="selectDisease"
              ></q-option-group>
            </my-input-wrapper>
          </template>
        </opd-aside>
      </my-aside>

      <div class="flex flex-col grow pb-2">
        <div class="font-bold text-xl p-4 text-center relative">瀏覽病史記錄</div>
        <div class="px-2 mt-2">
          <div class="flex gap-2">
            <div class="text-center" v-if="selectedItem">
              完成日期 :
              {{ selectedItem.CreateDatetime?.substring(0, 10) || selectedItem.IpdDate?.substring(0, 10) }}　 醫師姓名 :
              {{ selectedItem.SignedDocName || selectedItem.AttendingDocName }}
            </div>
            <q-space></q-space>
            <div v-for="(item, index) in bodyData" :key="index">{{ item.label }}：{{ item.value }}</div>
          </div>
        </div>

        <div class="px-2 clear-both">
          <RecordHospitalized :selectedItem="opdData" v-if="seekMedicaltype === 'ipd'"></RecordHospitalized>
          <opd-record :opdData="opdData" :selectable="isDitto" v-model:selected="dittoSelected" v-else></opd-record>
        </div>
      </div>
    </div>
  </my-elastic-wrapper>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { cloneDeep, isNaN } from 'lodash-es'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useOpdStore } from 'stores/opd.js'

// api
import {
  getDITTOAll,
  getDITTOHalfYear,
  getDITTOOneYear,
  getDITTOTwoYear,
  getDITTOErAll,
  getDITTOErHalfYear,
  getDITTOErOneYear,
  getDITTOErTwoYear,
  getDITTOIpdAll,
  getDITTOIpdHalfYear,
  getDITTOIpdOneYear,
  getDITTOIpdTwoYear,
  getOpdRecordItem,
  getIpdRecordItem,
  getChronicMonthsDropdown,
  putPatientTrace,
  getPatientTraceTb,
} from 'api'

// utils
import setSearchQuery from 'utils/setSearchQuery'
import { QInputProps, QSelectProps, QTableProps } from 'utils/quasar-extends/base-props.js'

// components
import OpdAside from 'pages/opd/components/OpdAside.vue'
import DataHeader from 'components/DataHeader.vue'
import OpdRecord from 'components/opd/OpdRecord.vue'
import RecordHospitalized from './components/RecordHospitalized.vue'

const $q = useQuasar()
const route = useRoute()
const isDitto = computed(() => route.name === 'OpdRecord-Ditto')
const router = useRouter()
const opdStore = useOpdStore()
const opdAsideRef = ref(null)
// 疾病相關變數 for 個案追蹤
const emit = defineEmits(['selectDisease', 'autoDiseaseSelect'])
const diseaseSelected = ref('其他')

const diseaseOptions = [
  { label: '結核病', value: '結核病' },
  { label: '糖尿病', value: '糖尿病' },
  { label: '其他', value: '其他' },
]

const myElasticWrapperProps = computed(() => {
  const wrapperProps = {
    wrapperType: props.wrapperType,
  }
  switch (props.wrapperType) {
    case 'page':
      break
    case 'dialog':
      Object.assign(wrapperProps, {
        fullWidth: true,
        myDialogContentProps: {
          header: '瀏覽病史記錄',
          width: '1280px',
          loading: getDataLoading.value,
        },
      })
      break
    default:
      break
  }
  return wrapperProps
})

const props = defineProps({
  wrapperType: String,
  isFromTracePage: Boolean,
  note: String,
})

const patientTitle = computed(() => {
  return [
    { label: '目前診號', value: opdData?.RoomBooking?.Seq },
    { label: '病歷號', value: opdData?.PatientId },
    { label: '姓名', value: opdData?.PersonName || opdData?.Patient?.Person?.Name },
    { label: '性別', value: opdData?.Gender },
    { label: '年齡', value: opdData?.Age },
    { label: '生日', value: opdData?.BirthDate || opdData?.Patient?.Person?.BirthDate?.substring(0, 10) },
    { label: '身分證號', value: opdData?.Idetifier || opdData?.Patient?.Person?.PersonId },
    { label: '身份別', value: opdData?.IdentityName },
    { label: '過敏', value: opdData?.Allergy },
  ]
})

const searchObj = {
  'opd-half': getDITTOHalfYear,
  'opd-one': getDITTOOneYear,
  'opd-two': getDITTOTwoYear,
  'opd-all': getDITTOAll,
  'er-half': getDITTOErHalfYear,
  'er-one': getDITTOErOneYear,
  'er-two': getDITTOErTwoYear,
  'er-all': getDITTOErAll,
  'ipd-half': getDITTOIpdHalfYear,
  'ipd-one': getDITTOIpdOneYear,
  'ipd-two': getDITTOIpdTwoYear,
  'ipd-all': getDITTOIpdAll,
}

const asideColumns = reactive([
  {
    name: 'CreateDatetime',
    label: '日期',
    field: (row) => row.CreateDatetime?.substring(0, 10) || row.IpdDate?.substring(0, 10),
    align: 'left',
  },
  { name: 'SignedDocName', label: '醫生', field: (row) => row.SignedDocName || row.AttendingDocName, align: 'left' },
])

const asideTableLoading = ref(false)
const asideRows = ref([])
const GetDITTO = async (search) => {
  try {
    asideTableLoading.value = true

    const query = setSearchQuery({
      doctor: search.doctor === 'all' ? false : true,
      $filter: `PatientId eq '${route.query.PatientId}'`,
      $orderBy: 'CreateDatetime desc',
    })

    const res = await searchObj[`${search.type}-${search.year}`](query)
    asideRows.value = res.data.Items
    if (asideRows.value.length !== 0) {
      opdAsideRef.value.onRowClick(undefined, asideRows.value[0])
    }
  } catch (error) {
    console.log(error)
  } finally {
    asideTableLoading.value = false
  }
}

const selectedItem = ref(null)

const seekMedicaltype = ref(null)
const onSearch = (search) => {
  seekMedicaltype.value = search.type
  resetData()
  GetDITTO(search)
}

const onSelect = (item) => {
  selectedItem.value = item
  switch (seekMedicaltype.value) {
    case 'opd':
      GetOpdRecordItem(item.OpdId)
      break
    case 'ipd':
      GetIpdRecordItem(item.IpdId)
      break
  }
}

//選擇疾病類別
const selectDisease = () => {
  emit('selectDisease', diseaseSelected.value)
}

const BMI = computed(() => {
  const bmi = Math.round((opdData?.Weight / (opdData?.Height / 100) ** 2) * 10) / 10
  return isNaN(bmi) || bmi === Infinity ? null : bmi
})

const bodyData = computed(() => {
  return [
    {
      label: '血壓',
      value: `${opdData?.BloodPressureHigh || '--'}/${opdData?.BloodPressureLow || '--'}`,
    },
    { label: '脈搏', value: opdData?.Pulse || '--' },
    { label: '身高', value: opdData?.Height || '--' },
    { label: '體重', value: opdData?.Weight || '--' },
    { label: 'BMI', value: BMI.value || '--' },
  ]
})

const initOpdData = {
  OpdId: null,
  RegId: null,
  PatientId: null,
  Subjective: null,
  Objective: null,
  OpdPlan: null,
  SignedDocId: null,
  SignedDocName: null,
  DclDepartmentNo: null,
  Note: null,
  Height: null,
  Weight: null,
  Pulse: null,
  BloodPressureLow: null,
  BloodPressureHigh: null,
  Status: null,
  OpdDiagnoses: [],
  OpdMedications: [],
  OpdProcedures: [],
  Age: null,
  BirthDate: null,
  DepartmentName: null,
  Gender: null,
  Identity: null,
  IdentityDiscount: null,
  PartialAfford: null,
  SeekMedical: null,
  Prevent: null,
  Idetifier: null,
  Laboratory: null,
  PACS: null,
  PersonName: null,
  PrimaryIcd: null,
  RoomName: null,
  SignedDocId: null,
  SignedDocName: null,
  CreateDatetime: null,
  ModifyDatetime: null,
  Status: null,
  EName: null,
  Allergy: null,
  OpdChronics: [],
  OpdTooth: {},
}

const opdData = reactive(cloneDeep(initOpdData))

const resetData = () => {
  asideRows.value = []
  selectedItem.value = null
  Object.assign(opdData, initOpdData)
}

const GetIpdRecordItem = async (ipdId) => {
  try {
    const res = await getIpdRecordItem(ipdId)
    Object.assign(opdData, res.data)
  } catch (error) {
    console.log(error)
  }
}

const GetOpdRecordItem = async (opdId) => {
  try {
    const res = await getOpdRecordItem(opdId)
    Object.assign(opdData, res.data)
    emit('autoDiseaseSelect', opdData)
  } catch (error) {
    console.log(error)
  }
}

const dittoSelected = ref([])
const onDittoClick = (key) => {
  if (!selectedItem.value) {
    $q.notify({ type: 'negative', message: '請選擇病歷紀錄', position: 'top' })
    return
  }

  switch (key) {
    case 'all': {
      opdStore.setOpdData({
        Subjective: opdData.Subjective,
        Objective: opdData.Objective,
        OpdDiagnoses: opdData.OpdDiagnoses,
        OpdPlan: opdData.OpdPlan,
        OpdMedications: opdData.OpdMedications,
        OpdProcedures: opdData.OpdProcedures,
      })
      break
    }
    case 'soa': {
      opdStore.setOpdData({
        Subjective: opdData.Subjective,
        Objective: opdData.Objective,
        OpdDiagnoses: opdData.OpdDiagnoses,
      })
      break
    }
    case 'selected': {
      if (dittoSelected.value.length === 0) {
        $q.notify({ type: 'negative', message: '請選擇 DITTO 項目', position: 'top' })
        return
      }

      opdStore.setOpdData(Object.assign({}, ...dittoSelected.value.map((key) => ({ [key]: opdData[key] }))))
      break
    }
  }

  router.go(-2)
}

const chronicMonthsItems = ref([])

const GetChronicMonthsList = async () => {
  try {
    const res = await getChronicMonthsDropdown()
    chronicMonthsItems.value = res.data
  } catch (error) {
    console.log(error)
  }
}
// 獲取個案追蹤
const traceNote = ref(props.note)
const tableDatas = reactive({})
const GetPatientTraceTb = async () => {
  try {
    const res = await getPatientTraceTb(`?filter=PatientId eq '${route.query.PatientId}'`) //根據 "身分證" 做篩選
    if (res.status === 200) {
      if (res.data.Items.length !== 0) {
        for (let i = 1; i < 5; i++) {
          tableDatas['step' + i] = res.data.Items.filter((item) => {
            return item.Step === i
          })
        }
      }
    }
  } catch (err) {
    console.log(err)
  }
}
// 更新個案追蹤
const PutPatientTrace = async () => {
  const totalTable = [...tableDatas.step1, ...tableDatas.step2, ...tableDatas.step3, ...tableDatas.step4]
  try {
    const body = {
      PatientId: opdData.PatientId,
      DiseaseType: '99',
      Pacs: false,
      Laboratory: false,
      Notes: traceNote.value,
      PatientTraceTbs: totalTable,
    }
    const res = await putPatientTrace(body)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '更新個案追蹤成功',
        position: 'top',
      })
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '加入個案追蹤失敗：' + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  }
}

const init = () => {
  if (props.isFromTracePage) {
    GetPatientTraceTb()
  }
  GetChronicMonthsList()
}
init()
</script>

