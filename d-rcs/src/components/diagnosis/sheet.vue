<template>
  <div class="diagnosis-page sheet custom-scroll-bar" id="main-sheet">
    <loading v-if="isShowLoading" />
    <h4 style="margin-top: 0">
      病人資訊
      <tailwind-btn v-show="$route.name == 'postEditForm'" wording="讀取健保卡" bgbolor="rgb(27 52 151)" class="mx-5"
        @click="readHealthIdCard" />
    </h4>
    <div class="patient-info" :class="{
      'avoid-clicks': isFormalForm,
      'patient-small-container': +detailWidth > 905,
    }">
      <div class="p-inputgroup">
        <span class="p-inputgroup-addon">姓名</span>
        <InputText placeholder="請輸入..." autocomplete="off" v-model="itemData.data.Patient.Name"
          :class="$route.name != 'postEditForm' ? 'avoid-clicks' : ''" />
        <!-- <span class="p-inputgroup-addon">姓名</span>
        <div class="content">{{ itemData.data.Patient.Name || "" }}</div> -->
      </div>
      <div class="p-inputgroup">
        <span class="p-inputgroup-addon">性別</span>
        <!-- <div class="content">{{ itemData.data.Patient.GenderCode || "" }}</div> -->
        <Dropdown v-model="itemData.data.Patient.GenderCode" :options="genderOptions" placeholder="選擇性別"
          style="padding-top: 5px" optionLabel="text" optionValue="value" class="custom-height"
          :class="$route.name != 'postEditForm' ? 'avoid-clicks' : ''" />
      </div>
      <div class="p-inputgroup">
        <span class="p-inputgroup-addon">
          <span v-if="itemData.data.UnclearPatientInfo === false || route.name === 'postEditForm'"
            class="redStar">*</span>
          <span>出生年月日</span>
        </span>
        <div class="content" v-if="isFormalForm">
          {{
              Boolean(itemData.data.Patient.Birthday)
                ? `${itemData.data.Patient.Birthday.includes('T') ? itemData.data.Patient.Birthday.split('T')[0] :
                  itemData.data.Patient.Birthday}`
                : ''
          }}
        </div>
        <Calendar v-else v-model="itemData.data.Patient.Birthday" :showIcon="true" dateFormat="yy-mm-dd"
          :maxDate="maxDate" v-date-input />
      </div>
      <div class="p-inputgroup">
        <span class="p-inputgroup-addon">初診日期</span>
        <div class="content" v-if="isFormalForm">
          {{
              Boolean(itemData.data.Patient.FirstVisitDate)
                ? `${itemData.data.Patient.FirstVisitDate.includes('T') ? itemData.data.Patient.FirstVisitDate.split('T')[0] :
                  itemData.data.Patient.FirstVisitDate
                }`
                : ''
          }}
        </div>
        <Calendar v-else v-model="itemData.data.Patient.FirstVisitDate" :showIcon="true" dateFormat="yy-mm-dd"
          v-date-input />
      </div>
      <div class="p-inputgroup">
        <span class="p-inputgroup-addon">初診科別</span>
        <InputText placeholder="請輸入..." autocomplete="off" v-model.trim="itemData.data.Patient.FirstVisitMed" />
      </div>
      <div class="p-inputgroup">
        <span class="p-inputgroup-addon">區域</span>
        <Dropdown v-model="itemData.data.Patient.Area" :options="areaOptions" style="padding-top: 5px"
          optionLabel="text" optionValue="value" class="custom-height" />
      </div>
      <div class="p-inputgroup">
        <span class="p-inputgroup-addon red-star">身分證字號</span>
        <InputText placeholder="請輸入..." autocomplete="off" v-model.trim="itemData.data.Patient.Identifier"
          maxlength="10" :class="$route.name != 'postEditForm' ? 'avoid-clicks' : ''" />
        <Button v-show="$route.name == 'postEditForm'" @click="setHis(itemData.data.Patient.Identifier, 1)">Sync
          His</Button>
      </div>
      <div class="p-inputgroup">
        <span class="p-inputgroup-addon">病歷號</span>
        <InputText placeholder="請輸入..." autocomplete="off" v-model.trim="itemData.data.Patient.PatientId" />
        <Button v-show="$route.name == 'postEditForm'" @click="setHis(itemData.data.Patient.PatientId, 2)">Sync
          His</Button>
      </div>
      <div class="p-inputgroup">
        <span class="p-inputgroup-addon">婚姻狀態</span>
        <Dropdown v-model="itemData.data.Patient.MaritalStatus" :options="marriageOptions" placeholder="請選擇..."
          style="padding-top: 5px" optionLabel="text" optionValue="value" class="custom-height" />
      </div>
      <div class="p-inputgroup">
        <span class="p-inputgroup-addon">電話</span>
        <InputText placeholder="請輸入..." autocomplete="off" v-model.trim="itemData.data.Patient.Tel" />
      </div>
      <div class="p-inputgroup" style="grid-column: span 2">
        <span class="p-inputgroup-addon">地址</span>
        <InputText placeholder="請輸入..." autocomplete="off" v-model.trim="itemData.data.Patient.Address" />
      </div>
      <div class="custom-colum" :class="{
        'custom-colum-small-container': +detailWidth > 905,
      }">
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon spec-col">緊急聯絡人</span>
          <InputText placeholder="請輸入..." autocomplete="off" v-model.trim="itemData.data.Patient.ContactName" />
        </div>
        <div class="p-inputgroup ml-3">
          <span class="p-inputgroup-addon spec-col">緊急聯絡人與病患關係</span>
          <InputText placeholder="請輸入..." autocomplete="off" v-model.trim="itemData.data.Patient.ContactRelation" />
        </div>
        <div class="p-inputgroup ml-3">
          <span class="p-inputgroup-addon spec-col">緊急聯絡人電話</span>
          <InputText placeholder="請輸入..." autocomplete="off" v-model.trim="itemData.data.Patient.ContactTel" />
        </div>
      </div>
    </div>
    <h4>病人生活史</h4>
    <div class="patient-info" :class="isFormalForm ? 'avoid-clicks' : ''">
      <div class="p-inputgroup" style="grid-column: 1/-1">
        <span class="p-inputgroup-addon">職業</span>
        <InputText placeholder="請輸入..." autocomplete="off" v-model.trim="itemData.data.Patient.Career" />
      </div>
      <div class="p-inputgroup" style="grid-column: 1/-1">
        <span class="p-inputgroup-addon">就醫身份別</span>
        <div class="form-check mr-2 mt-2" v-for="(item, index) in patientSourcOptions" :key="index">
          <input
            class="form-check-input rounded-full h-5 w-5 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
            type="radio" :id="'radioPatientSourceType' + item.value + item.text"
            v-model="itemData.data.PatientSourceType" :value="item.value" @change="setSubData('PatientSourceType')" />
          <label class="form-check-label inline-block text-gray-800"
            :for="'radioPatientSourceType' + item.value + item.text">
            {{ item.text }}
          </label>
        </div>

        <InputText class="p-button-sm" v-model.trim="itemData.data.PatientSourceOtherType"
          :disabled="+itemData.data.PatientSourceType != 0" />
      </div>
    </div>

    <h4 class="flex justify-between items-center">
      <div><span class="redStar">*</span>疾病診斷</div>
      <Button v-if="isFormalForm === false" @click="addIcdItem" class="p-button-sm"
        style="padding: 0 5px; line-height: 1.5">ADD</Button>
    </h4>

    <my-table :headers="headers" :items="itemData.data.Icds" :pageOptions="pageOptions">
      <template #item-Icd10="{ item }">
        <AutoComplete v-model="item.Icd10" class="w-full" :suggestions="icdSuggestions" :delay="300"
          @complete="GetIcd10($event.query)" field="Name" @item-select="selectIcd($event.value, item)"
          :disabled="isFormalForm" />
      </template>
      <template #item-action="{ index }">
        <Button class="p-button-danger p-button-sm" style="padding: 0 10px" @click="itemData.data.Icds.splice(index, 1)"
          :disabled="isFormalForm">
          刪除
        </Button>
      </template>
    </my-table>
    <h4>會診說明</h4>
    <div class="flex items-start" :class="isFormalForm ? 'avoid-clicks' : ''">
      <div class="condition-title px-2 py-1 border mr-2" :class="{
        hidden: +detailWidth > 905,
      }">
        <span class="redStar">*</span>類別
      </div>
      <div class="grow grid gap-2">
        <div class="flex items-center gap-2">
          <div class="form-check">
            <input
              class="form-check-input rounded-full h-5 w-5 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
              type="radio" id="flexRadioDefault1" v-model="itemData.data.ConsultationType" :value="1"
              @change="setSubData('ConsultationType')" />
            <label class="form-check-label inline-block text-gray-800" for="flexRadioDefault1"> 一般會診 </label>
          </div>

          <div class="flex items-center gap-2">
            <div class="form-check" v-for="(item, index) in patientIllustrateOptions1" :key="index">
              <input
                class="form-check-input rounded-full h-5 w-5 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                type="radio" :id="'radiopatientIllustrateOptions1' + item.value + item.text" v-model="subType1"
                :value="item.value" :disabled="+itemData.data.ConsultationType != 1" @change="setOtherWord(1)" />
              <label class="form-check-label inline-block text-gray-800"
                :for="'radiopatientIllustrateOptions1' + item.value + item.text">
                {{ item.text }}

                <!-- 一般會診- -->
              </label>
            </div>
            <InputText class="p-button-sm" v-model.trim="subOtherType1"
              :disabled="+itemData.data.ConsultationType != 1 || !`${subType1}`.includes('其他')" />
            <!-- 一般會診其他 -->
          </div>
        </div>

        <div class="flex items-center gap-2">
          <div class="form-check" style="margin-right: 2px; padding: 8px 15px 4px 0; height: 100%;">
            <input
              class="form-check-input rounded-full h-5 w-5 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
              type="radio" name="flexRadioDefault2" id="flexRadioDefault2" v-model="itemData.data.ConsultationType"
              :value="2" @change="setSubData('ConsultationType')" />
            <label class="form-check-label inline-block text-gray-800" for="flexRadioDefault2"> 急重症 </label>
          </div>

          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-2">
              <div class="form-check" v-for="(item, index) in patientIllustrateOptions2" :key="index">
                <input
                  class="form-check-input rounded-full h-5 w-5 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                  type="radio" :id="'radiopatientIllustrateOptions2' + item.value + item.text" v-model="subType1"
                  :value="item.value" :disabled="+itemData.data.ConsultationType != 2" @change="setOtherWord(2)" />
                <label class="form-check-label inline-block text-gray-800"
                  :for="'radiopatientIllustrateOptions2' + item.value + item.text">
                  {{ item.text }}
                </label>
              </div>
              <InputText class="p-button-sm" v-model.trim="subOtherType2"
                :disabled="+itemData.data.ConsultationType != 2 || !`${subType1}`.includes('其他')" />
              <!-- 急重症其他: -->
            </div>

            <div class="flex items-center gap-2">
              <span class="mr-4">檢傷分類：</span>
              <div class="form-check mr-2" v-for="(item, index) in patientIllustrateOptions3" :key="index">
                <input
                  class="form-check-input rounded-full h-5 w-5 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                  type="radio" :id="'radiopatientIllustrateOptions3' + item.value + item.text"
                  v-model="itemData.data.InjuryLevel" :value="item.value"
                  :disabled="+itemData.data.ConsultationType != 2" />
                <label class="form-check-label inline-block text-gray-800"
                  :for="'radiopatientIllustrateOptions3' + item.value + item.text">
                  {{ item.text }}
                </label>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <span class="mr-4">照會科別：</span>

              <div class="flex items-center gap-2">
                <input type="radio" class="h-5 w-5" v-model="itemData.data.NotifyDapart" value="急診內科" id="aa"
                  :disabled="+itemData.data.ConsultationType != 2" />
                <label for="aa">急診內科</label>
              </div>
              <div class="flex items-center gap-2">
                <input type="radio" class="h-5 w-5" v-model="itemData.data.NotifyDapart" value="急診外傷" id="bb"
                  :disabled="+itemData.data.ConsultationType != 2" />
                <label for="bb">急診外傷</label>
              </div>
              <div class="flex items-center gap-2">
                <input type="radio" class="h-5 w-5" v-model="itemData.data.NotifyDapart" value="急診兒科" id="cc"
                  :disabled="+itemData.data.ConsultationType != 2" />
                <label for="cc">急診兒科</label>
              </div>
              <div class="flex items-center gap-2">
                <input type="radio" class="h-5 w-5" v-model="itemData.data.NotifyDapart" value="急診其他科" id="dd"
                  :disabled="+itemData.data.ConsultationType != 2" />
                <label for="dd">急診其他科</label>
              </div>
            </div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <div class="form-check">
            <input
              class="form-check-input rounded-full h-5 w-5 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
              type="radio" name="flexRadioDefault3" id="flexRadioDefault3" v-model="itemData.data.ConsultationType"
              :value="0" @change="setSubData('ConsultationType')" />
            <label class="form-check-label inline-block text-gray-800" for="flexRadioDefault3"> 其他 </label>
          </div>

          <InputText v-model.trim="itemData.data.ConsultationOtherType"
            :disabled="+itemData.data.ConsultationType != 0" />

        </div>
      </div>
    </div>

    <div class="grid grid-cols-2 gap-2 py-1">
      <TextArea maxlength="10" v-model="itemData.data.ConditionDesc" title="病況描述" class="red-star col-span-full"
        :disabled="isFormalForm" :hasredStar="true" />
      <TextArea maxlength="10" v-model="itemData.data.Subjective" title="S 主訴" :disabled="isFormalForm"
        :hasredStar="true" />
      <TextArea maxlength="10" v-model="itemData.data.Objective" title="O 客觀" :disabled="isFormalForm"
        :hasredStar="true" />
      <TextArea maxlength="10" v-model="itemData.data.Assessment" title="A 處置" :disabled="isFormalForm"
        :hasredStar="true" />
      <TextArea maxlength="10" v-model="itemData.data.Plan" title="P 計畫" :disabled="isFormalForm" :hasredStar="true" />
      <TextArea v-model="itemData.data.Remark" title="備註" class="col-span-full" :disabled="isFormalForm" />
    </div>
    <h4>會診目的</h4>
    <div class="p-2" :class="isFormalForm ? 'avoid-clicks' : ''">
      <div class="flex items-start mb-2">
        <div class="condition-title px-2 py-1 border mr-2"><span class="redStar">*</span>目的</div>
        <div class="flex">
          <div class="form-check mr-2 mt-2" v-for="(item, index) in aimedOptions" :key="index">
            <input
              class="form-check-input rounded-full h-5 w-5 border border-gray-300 bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
              type="radio" :id="'radioAimed' + item.value + item.text" v-model="itemData.data.Aimed" :value="item.value"
              @change="setSubData('Aimed')" />
            <label class="form-check-label inline-block text-gray-800" :for="'radioAimed' + item.value + item.text">
              {{ item.text }}
            </label>
          </div>
          <InputText class="p-button-sm" v-model.trim="itemData.data.OtherAimed"
            :disabled="+itemData.data.Aimed != 0" />
        </div>
      </div>

      <div class="flex items-start mb-2 sheet-pad-b">
        <div class="condition-title px-2 py-1 border mr-2"><span class="redStar">*</span>會診單位</div>
        <MultiSelect v-model="itemData.data.NotifyInstitutionNos" :options="institutionFilterItems" option-value="No"
          option-label="Name" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { patientInsertColumns, patientColumns, lifeHistoryColumns, diseaseColumns, instruction, purpose } from './options' // , diseaseColumns, lifeHistoryColumns,
import { reactive, ref, inject, computed, watch, onBeforeMount, onMounted, onUpdated, nextTick } from 'vue'
import { saveingSheet, getIcd10ListByKeyword, getIcd10, getMyNetGroupHospitals } from 'Service/apis.js'
import dayjs from 'dayjs'
import { cloneDeep, trim } from 'lodash-es'
import setSearchQuery from 'utils/setSearchQuery.js'
import { useToast } from 'vue-toastification'
import { useStore } from 'vuex'
import { healthIDCardWebSocketServer } from '@/service/websocket.js'
import loading from '@/components/loading.vue'

const props = defineProps({
  itemData: {
    type: Object,
    required: true,
  },
  isInsert: {
    type: Boolean,
    default: true,
  },
  patientInfoGridNum: {
    type: Number,
    default: 3,
  },
  patientShouldInsert: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  detailWidth: {
    type: Number,
    default: 100,
  },
})

const genderOptions = ref([
  { text: '男', value: '男' },
  { text: '女', value: '女' },
  { text: '未知', value: '未知' },
  { text: '其他', value: '其他' },
])
const maxDate = ref(new Date())
const route = useRoute()
const router = useRouter()
const store = useStore()
const toast = useToast()
const subType1 = ref(null)
const subOtherType1 = ref(null)
const subOtherType2 = ref(null)
const emitter = inject('emitter')

const tOptions = (to = 2000, hpb = true, coc = true) => {
  return {
    timeout: to,
    hideProgressBar: hpb,
    closeOnClick: coc,
  }
}

const initData = {}
initData.icdItem = {
  Icd10: null,
  Icd9: null,
  Cht: null,
  Eng: null,
}

const headers = computed(() => {
  const arr = [
    { key: 'Seq', text: null, value: (row, index) => (index === 0 ? '主' : '次') },
    { key: 'Icd10', text: 'ICD-10', value: 'Icd10', width: '22%' },
    { key: 'Icd9', text: 'ICD-9', value: 'Icd9', width: '22%' },
    { key: 'Cht', text: '診斷名稱', value: 'Cht', width: '22%' },
    { key: 'Eng', text: '英文診斷名稱', value: 'Eng', width: '22%' },
  ]

  if (isFormalForm.value === false) {
    arr.push({ key: 'action', text: '操作', value: 'action' })
  }

  return arr
})

const isFormalForm = computed(() => {
  return route.name == 'formalForm' || route.name == 'sheetOnlyView'
})

const pageOptions = reactive({
  firstIndex: 0,
  perPageCount: 10,
  totalItemsCount: 0,
  rowsPerPage: [10, 20, 30],
})

const addIcdItem = () => {
  props.itemData.data.Icds.push(cloneDeep(initData.icdItem))
}

const icdSuggestions = ref([])
const GetIcd10 = async (inputValue) => {
  try {
    const query = setSearchQuery({
      $top: 100,
      $filter: `contains(Icd10,'${inputValue}') or contains(Icd9,'${inputValue}') or contains(Cht,'${inputValue}') or contains(Eng,'${inputValue}')`,
    })
    const res = await getIcd10(query)
    if (res.status === 200) icdSuggestions.value = res.data.Items.map((item) => ({ Name: `${item.Icd10} - ${item.Icd9} - ${item.Cht} - ${item.Eng}`, ...item }))
  } catch (err) {
    console.log(err)
  }
}

const selectIcd = (option, item) => {
  if (props.itemData.data.Icds.find((__item) => __item.Icd10 === option.Icd10) !== undefined) {
    item.Icd10 = null
    toast.error(`此ICD已存在，請重新選擇`, tOptions())
    return
  } else {
    Object.assign(item, option)
  }
}

const checkData = (data) => {
  const rejectData = []

  console.log(data)

  if (!!data.Patient.Identifier === false) rejectData.push('身分證字號')

  if (!!data.UnclearPatientInfo === false || route.name === 'postEditForm') {
    if (!!data.Patient.Birthday === false) rejectData.push('出生年月日')
  }

  if (data.Icds.length === 0) rejectData.push('疾病診斷')
  else {
    if (data.Icds.filter((item) => !!item.Icd10 === false).length > 0) rejectData.push('ICD-10')
  }

  if (typeof data.ConsultationType !== 'number') rejectData.push('會診說明-類別')
  else {
    if (data.ConsultationType === 1) {
      if (!!subType1.value === false) rejectData.push('會診說明-類別-一般會診')
    } else if (data.ConsultationType === 2) {
      if (!!subType1.value === false) rejectData.push('會診說明-類別-急重症')
      if (!!data.InjuryLevel === false) rejectData.push('會診說明-類別-急重症-檢傷分類')
      if (!!data.NotifyDapart === false) rejectData.push('會診說明-類別-急重症-照會科別')
    } else if (data.ConsultationType === 0) {
      if (!!data.ConsultationOtherType === false) rejectData.push('會診說明-類別-其他')
    }
  }

  if (!!data.ConditionDesc === false) rejectData.push('會診說明-病況描述')

  // if (!!data.Aimed === false) rejectData.push('會診目的-目的')
  if (data.Aimed === null) rejectData.push('會診目的-目的')

  if (data.NotifyInstitutionNos.length === 0) rejectData.push('會診目的-諮詢單位')

  if (rejectData.length > 0) {
    toast.error(`${rejectData.join('、')} 為必填欄位`, tOptions())
    return false
  } else {
    return true
  }
}

const saveData = (type = 'temporary') => {
  const data = cloneDeep(props.itemData.data)

  data.Status = type === 'temporary' ? 0 : 10

  data.SubType = subType1.value ? subType1.value : ''

  //會診說明
  if (+data.ConsultationType == 1) {
    if (`${subType1.value}`.includes('其他')) {
      data.SubType = `其他:${subOtherType1.value ? subOtherType1.value : ''}`
    }
  }

  if (+data.ConsultationType == 2) {
    if (`${subType1.value}`.includes('其他')) {
      data.SubType = `其他:${subOtherType2.value ? subOtherType2.value : ''}`
    }
  }

  if (Boolean(data.Patient.FirstVisitDate)) {
    data.Patient.FirstVisitDate = dayjs(data.Patient.FirstVisitDate).format()
  }

  if (Boolean(data.Patient.Birthday)) {
    data.Patient.Birthday = dayjs(data.Patient.Birthday).format()
  }

  if (Boolean(store.state?.medicalCardData)) {
    data.Signature = store.state?.medicalCardData
  }

  data.Icds.forEach((item) => {
    item.Icd10 = trim(item.Icd10)
  })

  return new Promise((resolve, reject) => {

    console.log(data)

    if (type !== 'temporary') {
      if (checkData(data) === false) return
    }

    saveingSheet(data)
      .then((res) => {
        // console.log("---------success---------");
        toast.success(`草稿${+data.Status == 10 ? '確認送出' : '暫存'}成功`, tOptions())
        resolve()
        if (+data.Status == 10) {
          store.commit('m_setEditItem', data)
          const _paramItem = JSON.parse(JSON.stringify(data))
          // columns
          //   .map((col) => col.key)
          //   .forEach((key) => {
          //     if (_paramItem[key]) delete _paramItem[key];
          //   });

          router.push({
            name: 'formalForm',
            params: { item: _paramItem.Id },
            query: { back: route.fullPath.replace(/\/diagnosisManage\/draftForm\/[0-9]*/, '/diagnosisManage/recordingMaintain') },
          })
        } else {
          router.push(route.query.back || '/diagnosisManage/recordingMaintain')
        }
      })
      .catch((err) => {
        console.log(err)
        toast.error(`(${err}) 錯誤`, tOptions())
        reject(err)
        // console.log("---------failtUre---------");
        // console.log(err)
      })
  })
}

console.log(route.fullPath)

const savePostEditData = async () => {
  const data = cloneDeep(props.itemData.data)

  // 會診說明
  if (data.ConsultationType === 0) {
    data.SubType = data.ConsultationOtherType
  } else {
    if (`${subType1.value}`.includes('其他')) data.SubType = `其他:${subOtherType2.value || ''}`
    else data.SubType = subType1.value
  }

  data.Icds.forEach((item) => {
    item.Icd10 = trim(item.Icd10)
  })

  data.Patient.Birthday = !!data.Patient.Birthday ? dayjs(data.Birthday).format('YYYY-MM-DDTHH:mm:ss') : null
  data.Patient.FirstVisitDate = !!data.Patient.FirstVisitDate ? dayjs(data.FirstVisitDate).format('YYYY-MM-DDTHH:mm:ss') : null

  if (checkData(data) === false) return

  // fix for Status 20, sever ignore / skip
  data.Status = 100

  try {
    const res = await saveingSheet(data)
    if (res.status === 200 || res.status === 204) {
      toast.success(`資料送出成功！\n此病患變為已結案，可在已結案會診記錄中搜尋此病患。`, tOptions())
      router.push(route.query.back || '/diagnosisManage/recordingMaintain')
    }
  } catch (err) {
    toast.error(`${err.response ? err.response.data : err}`, tOptions())
  }
}

  ;[...lifeHistoryColumns, ...patientColumns].forEach((col) => {
    col.disabled = props.disabled
  })

const areaOptions = ref([
  { text: '未知', value: '未知' },
  { text: '本地', value: '本地' },
  { text: '外來', value: '外來' },
])

const marriageOptions = ref([
  { text: '未婚', value: '未婚' },
  { text: '已婚', value: '已婚' },
  { text: '其他', value: '其他' },
  { text: '未知', value: '未知' },
])

const patientSourcOptions = ref([
  { text: '健保', value: 1 },
  { text: '自費', value: 2 },
  { text: '其他', value: 0 },
])

const patientIllustrateOptions1 = ref([
  { text: '內科', value: '內科' },
  { text: '外科', value: '外科' },
  { text: '兒科', value: '兒科' },
  { text: '婦產科', value: '婦產科' },
  { text: '其他', value: '一般會診其他' },
])
const patientIllustrateOptions2 = ref([
  { text: '急診', value: '急診' },
  { text: '急性腦中風', value: '急性腦中風' },
  { text: '緊急外傷', value: '緊急外傷' },
  { text: '心肌梗塞', value: '心肌梗塞' },
  { text: '其他', value: '急重症其他' },
])
const patientIllustrateOptions3 = ref([
  { text: '第一級', value: 1 },
  { text: '第二級', value: 2 },
  { text: '第三級', value: 3 },
  { text: '第四級', value: 4 },
  { text: '第五級', value: 5 },
])

const aimedOptions = ref([
  { text: '第二意見', value: 1 },
  { text: '轉診', value: 2 },
  { text: '其他', value: 0 },
])

const setSubData = (type) => {
  if (type == 'ConsultationType') {
    console.log(props.itemData.data)
    subOtherType1.value = null
    subOtherType2.value = null
    props.itemData.data.SubType = null
    props.itemData.data.InjuryLevel = null
    props.itemData.data.NotifyDapart = null
    subType1.value = null
    props.itemData.data.ConsultationOtherType = null
  } else if (type == 'Aimed') {
    if (+props.itemData.data.Aimed != 0) props.itemData.data.OtherAimed = null
  } else if (type == 'PatientSourceType') {
    if (+props.itemData.data.PatientSourceType != 0) props.itemData.data.PatientSourceOtherType = null
  }
}

const setOtherWord = (type) => {
  if (+type == 1) {
    //一般會診
    if (!`${subType1.value}`.includes('其他')) subOtherType1.value = null
  } else if (+type == 2) {
    //急重症
    if (!`${subType1.value}`.includes('其他')) subOtherType2.value = null
  }
}

const readHealthIdCard = async () => {
  try {
    const res = await healthIDCardWebSocketServer()

    props.itemData.data.Patient.Name = res.name
    props.itemData.data.Patient.Identifier = res.id

    const birthday = res.birthday
    const y = birthday.slice(0, 3)
    const m = birthday.slice(3, 5)
    const d = birthday.slice(5, 7)
    props.itemData.data.Patient.Birthday = new Date(`${Number(y) + 1911}-${m}-${d}`)
    props.itemData.data.Patient.GenderCode = res.gender === 'M' ? '男' : '女'

    toast.success(`健保卡讀取成功`, tOptions())
  } catch (e) {
    toast.error(`錯誤: ${e?.type ? '請確認已打開讀卡機伺服器' : e}`, tOptions())
  }
}

const ws = ref()

const connectReadCard = () => {
  return new Promise((resolve, reject) => {
    ws.value = new WebSocket('ws://127.0.0.1:8889/Chat')

    ws.value.onopen = resolve

    ws.value.onerror = (err) => {
      toast.error(`連線讀卡機伺服器發生錯誤`, tOptions(2500))

      console.log(err)
      reject(err)
    }

    ws.value.onclose = (err) => {
      ws.value = undefined
      console.log(err)
      reject(err)
    }

    ws.value.onmessage = (event) => {
      if (!!event.data) emitter.emit('onmessage', event.data)
    }
  })
}

const hisWebSocketServerCallServer = async () => {
  if (!!ws.value === false) {
    await connectReadCard()
  }

  return new Promise((resolve, reject) => {
    const serverurl = `https://${window.location.hostname}`

    const onmessage = (data) => {
      emitter.off('onmessage', onmessage)
      if (data.includes('OK')) resolve('ok')
      else reject('hisWebSocketServerCallServer Error')
    }
    emitter.on('onmessage', onmessage)

    ws.value.send(`serverUrl=${serverurl}`)
  })
}

const hisWebSocketServerCallPatientData = async (identifier) => {
  if (!!ws.value === false) await connectReadCard()

  return new Promise((resolve, reject) => {
    const tokendata = sessionStorage.getItem('token')

    const onmessage = (data) => {
      emitter.off('onmessage', onmessage)
      if (data !== '{}' && !!data) resolve(data)
      else reject('hisWebSocketServerCallPatientData Error')
    }
    emitter.on('onmessage', onmessage)

    ws.value.send(`identifier=${identifier},token=${tokendata}`)
  })
}

const hisWebSocketServerCallPatientDataUsePatientId = async (patientId) => {
  if (!!ws.value === false) await connectReadCard()

  return new Promise((resolve, reject) => {
    const tokendata = sessionStorage.getItem('token')

    const onmessage = (data) => {
      emitter.off('onmessage', onmessage)
      if (data !== '{}' && !!data) resolve(data)
      else reject('hisWebSocketServerCallPatientDataUsePatientId Error')
    }
    emitter.on('onmessage', onmessage)

    ws.value.send(`patientId=${patientId},token=${tokendata}`)
  })
}

const isShowLoading = ref(false)

const setHis = async (data, type) => {
  if (!!data === false) {
    toast.error(`請輸入資料內容`, tOptions())
    return
  }

  isShowLoading.value = true

  try {
    const res = await hisWebSocketServerCallServer()

    if (res === 'ok') {
      //type為1時代表用身分證、2時代表用病歷號  去抓His資料

      const res2 = type === 1 ? await hisWebSocketServerCallPatientData(data) : await hisWebSocketServerCallPatientDataUsePatientId(data)

      const patientObj = JSON.parse(res2).patientInfo
      if (!!patientObj.name) props.itemData.data.Patient.Name = patientObj.name
      if (!!patientObj.identifier) props.itemData.data.Patient.Identifier = patientObj.identifier
      if (!!patientObj.patientId) props.itemData.data.Patient.PatientId = patientObj.patientId
      if (!!patientObj.birthDate) props.itemData.data.Patient.Birthday = patientObj.birthDate
      if (!!patientObj.address) props.itemData.data.Patient.Address = patientObj.address
      if (!!patientObj.gender) props.itemData.data.Patient.GenderCode = patientObj.gender == 'male' ? '男' : patientObj.gender == 'female' ? '女' : null
      if (!!patientObj.maritalStatus) props.itemData.data.Patient.MaritalStatus = patientObj.maritalStatus
      if (!!patientObj.telecom) props.itemData.data.Patient.Tel = patientObj.telecom
      if (!!patientObj.contactName) props.itemData.data.Patient.ContactName = patientObj.contactName
      if (!!patientObj.contactRelationship) props.itemData.data.Patient.ContactRelation = patientObj.contactRelationship
      if (!!patientObj.contactTelecom) props.itemData.data.Patient.ContactTel = patientObj.contactTelecom
    }
  } catch (err) {
    toast.error(`無法取得His資訊`, tOptions(2500))
  } finally {
    isShowLoading.value = false
  }
}

const institutionFilterItems = ref([])
const GetMyNetGroupHospitals = async () => {
  try {
    const res = await getMyNetGroupHospitals(props.itemData.data.Id || store.state.editItem.Id)
    if (res.status === 200) institutionFilterItems.value = res.data
  } catch (err) {
    console.log(err)
  }
}

const dataRetrive = async () => {

  subType1.value = props.itemData.data.SubType
  await nextTick()

}

defineExpose({
  saveData,
  savePostEditData,
})

watch(
  () => props.itemData.data.Icds,
  (val) => {
    pageOptions.totalItemsCount = val.length
  },
  { deep: true }
)

watch(
  () => props.itemData.data.SubType,
  () => {
    dataRetrive()
  },
  {
    immediate: true,
    deep: true,
  }
)

watch(
  () => props.itemData.data.Id || store.state.editItem.Id,
  () => {
      GetMyNetGroupHospitals()
  },
  {
    immediate: true,
    deep: true,
  }
)

const init = async () => {
  await GetMyNetGroupHospitals()
  await dataRetrive()

  if (+props.itemData.data.ConsultationType == 1) {
    subOtherType2.value = null
    props.itemData.data.InjuryLevel = null

    if (`${props.itemData.data.SubType}`.includes('其他')) {
      subType1.value = '一般會診其他'
      subOtherType1.value = `${props.itemData.data.SubType}`.split(':')[1]
    }
  }

  if (+props.itemData.data.ConsultationType == 2) {
    subOtherType1.value = null

    if (`${props.itemData.data.SubType}`.includes('其他')) {
      subType1.value = '急重症其他'
      subOtherType2.value = `${props.itemData.data.SubType}`.split(':')[1]
    }
  }

  if (+props.itemData.data.ConsultationType == 3) {
    subType1.value = null
    subOtherType1.value = null
    subOtherType2.value = null
  }

  if (`${props.itemData.data.Patient?.Birthday}`.includes('T')) {
    props.itemData.data.Patient.Birthday = `${props.itemData.data.Patient.Birthday}`.split('T')[0]
  }

}

init()

</script>

<style lang="scss" scoped>
.sheet {
  @apply flex-1 pr-2 overflow-y-auto;

  .p-autocomplete-input {
    @apply w-full;
  }
}

.patient-info {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 10px;
}

.patient-small-container {
  display: flex;
  flex-direction: column;
}

.p-inputgroup {
  .p-inputgroup-addon {
    background: #f1f9e8;
    color: #000;
    height: 42px;
    border: 0px;
    width: 120px;
    font-size: 18px;
  }

  .content {
    height: 40px;
    line-height: 40px;
    border: 1px solid #e2e5e9;
    width: calc(100% - 120px);
    padding-left: 5px;
  }
}

.redStar {
  color: #ff0057;
}

.custom-colum {
  grid-column: 1/-1;
  display: flex;

  .p-inputgroup {
    .spec-col {
      width: 185px;
      font-size: 16px;
    }
  }
}

.custom-colum-small-container {
  flex-direction: column;

  >div {
    margin-left: 0;
    margin-bottom: 10px;
  }
}

.custom-height {
  height: 42px;
}

label {
  margin-top: 1px;
}

.p-dropdown {
  line-height: 15px;
}

.condition-title {
  width: 128px;
}

.sheet-pad-b {
  padding-bottom: 20px;
}
</style>
