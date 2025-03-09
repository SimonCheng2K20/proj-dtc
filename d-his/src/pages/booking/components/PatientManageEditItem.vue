<template>
  <my-elastic-wrapper v-bind="myElasticWrapperProps">
    <teleport v-if="isLayoutMouted && wrapperType === 'page'" to="#header-expand">
      <my-title>
        <div>{{ isFirstVisit ? '初診病歷' : '修改病歷' }}</div>
        <q-space></q-space>
        <div class="flex gap-2">
          <q-btn class="header-btn" label="回上一頁" unelevated dense @click="onBackPageClick"></q-btn>
          <q-btn class="header-btn" label="列印" unelevated dense></q-btn>
          <q-btn class="header-btn" label="儲存資料" unelevated dense @click="onSaveClick"></q-btn>
        </div>
      </my-title>
    </teleport>

    <div class="max-w-[1280px] mx-auto">
      <div v-if="editType === 'delete'" class="text-negative mb-1">是否確定刪除此病歷維護？</div>
      <div class="grid gap-4" :class="{ 'p-2': wrapperType === 'page' }">
        <q-card>
          <q-card-section class="my-card-title"> 病患基本資料 </q-card-section>
          <q-card-section>
            <div class="flex justify-between">
              <div>初診日期：{{ editItem.Visit1stDate }}</div>
              <div>病歷號碼：{{ editItem.PatientId }}</div>
            </div>
            <my-input-group class="grid grid-cols-3 gap-2">
              <my-input-wrapper label="姓名" required-mark>
                <q-input
                  v-bind="QInputProps"
                  :ref="(el) => (inputRefs.Name = el)"
                  :rules="rules.Name"
                  v-model="editItem.Person.Name"
                  :readonly="editType === 'delete'"
                ></q-input>
              </my-input-wrapper>
              <my-input-wrapper label="生日" required-mark>
                <my-date-input
                  v-bind="QInputProps"
                  :ref="(el) => (inputRefs.BirthDate = el)"
                  :rules="rules.BirthDate"
                  v-model="editItem.Person.BirthDate"
                  :readonly="editType === 'delete'"
                  :date-options="(date) => dayjs(date).isSameOrBefore(dayjs())"
                ></my-date-input>
              </my-input-wrapper>
              <my-input-wrapper label="性別" required-mark input-border>
                <q-option-group
                  v-model="editItem.Person.GenderCode"
                  :options="genderCodeItems"
                  color="primary"
                  inline
                  :disable="editType === 'delete'"
                >
                </q-option-group>
              </my-input-wrapper>
              <my-input-wrapper label="身分證號" required-mark>
                <q-input
                  v-bind="QInputProps"
                  :ref="(el) => (inputRefs.PersonId = el)"
                  :rules="rules.PersonId"
                  v-model="editItem.Person.PersonId"
                >
                </q-input>
              </my-input-wrapper>
              <my-input-wrapper label="手機號碼" required-mark>
                <q-input
                  v-bind="QInputProps"
                  :ref="(el) => (inputRefs.Phone = el)"
                  :rules="rules.Phone"
                  v-model="editItem.Person.Phone"
                  :readonly="editType === 'delete'"
                ></q-input>
              </my-input-wrapper>
              <my-input-wrapper label="血型" required-mark>
                <q-select
                  v-bind="QSelectProps"
                  :ref="(el) => (inputRefs.BloodType = el)"
                  :rules="rules.BloodType"
                  v-model="editItem.BloodType"
                  :options="bloodTypeItems"
                  option-label="label"
                  option-value="value"
                  map-options
                  emit-value
                  :readonly="editType === 'delete'"
                ></q-select>
              </my-input-wrapper>
              <my-input-wrapper label="國籍">
                <q-input
                  v-bind="QInputProps"
                  v-model="editItem.Person.Nationality"
                  :readonly="editType === 'delete'"
                ></q-input>
              </my-input-wrapper>
              <my-input-wrapper label="婚姻狀況">
                <q-select
                  v-bind="QSelectProps"
                  v-model="editItem.Marriage"
                  :options="marriageStatusItems"
                  option-label="label"
                  option-value="value"
                  map-options
                  emit-value
                  :readonly="editType === 'delete'"
                ></q-select>
              </my-input-wrapper>
              <my-input-wrapper label="職業"
                ><q-input v-bind="QInputProps" v-model="editItem.JobType" :readonly="editType === 'delete'"></q-input
              ></my-input-wrapper>
              <my-input-wrapper label="通訊地址" class="col-span-full" required-mark>
                <q-select
                  v-bind="QSelectProps"
                  :ref="(el) => (inputRefs.Address_0 = el)"
                  :rules="rules.Address_0"
                  v-model="editItem.Person.Address[0]"
                  :options="zonesData"
                  option-label="text"
                  option-value="value"
                  emit-value
                  map-options
                  :readonly="editType === 'delete'"
                ></q-select>
                <q-select
                  v-bind="QSelectProps"
                  :ref="(el) => (inputRefs.Address_1 = el)"
                  :rules="rules.Address_1"
                  v-model="editItem.Person.Address[1]"
                  :options="zonesData.find((item) => item.value === editItem.Person.Address[0])?.zone || []"
                  :readonly="editType === 'delete'"
                >
                  <template #no-option>
                    <q-item>
                      <q-item-section class="text-grey">
                        <span>請選擇縣/市</span>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
                <q-input
                  class="basis-[200%]"
                  v-bind="QInputProps"
                  :ref="(el) => (inputRefs.Address_2 = el)"
                  :rules="rules.Address_2"
                  v-model="editItem.Person.Address[2]"
                  :readonly="editType === 'delete'"
                ></q-input>
              </my-input-wrapper>
              <my-input-wrapper label="藥物過敏" required-mark input-border>
                <q-option-group
                  v-model="editItem.Allergy"
                  :options="yesOrNoItems"
                  color="primary"
                  inline
                  :disable="editType === 'delete'"
                >
                </q-option-group>
              </my-input-wrapper>
              <my-input-wrapper v-if="editItem.Allergy" label="藥名" required-mark>
                <q-input
                  v-bind="QInputProps"
                  :ref="(el) => (inputRefs.AllergyMedicine = el)"
                  :rules="rules.AllergyMedicine.value"
                  v-model="editItem.AllergyMedicine"
                  :readonly="editType === 'delete'"
                ></q-input>
              </my-input-wrapper>
              <my-input-wrapper v-if="editItem.Allergy" label="反應" required-mark>
                <q-input
                  v-bind="QInputProps"
                  :ref="(el) => (inputRefs.AllergyComment = el)"
                  :rules="rules.AllergyComment.value"
                  v-model="editItem.AllergyComment"
                  :readonly="editType === 'delete'"
                ></q-input>
              </my-input-wrapper>
              <my-input-wrapper label="最近是否動過手術" input-border>
                <q-option-group
                  v-model="editItem.HadSurgery"
                  :options="yesOrNoItems"
                  color="primary"
                  inline
                  :disable="editType === 'delete'"
                >
                </q-option-group>
              </my-input-wrapper>
              <my-input-wrapper v-if="editItem.HadSurgery" label="手術名稱" required-mark>
                <q-input
                  v-bind="QInputProps"
                  :ref="(el) => (inputRefs.HadSurgery = el)"
                  :rules="rules.HadSurgery.value"
                  v-model="editItem.SurgeryComment"
                  :readonly="editType === 'delete'"
                ></q-input>
              </my-input-wrapper>
              <div v-if="editItem.HadSurgery">
                <!-- 佔位 -->
              </div>
              <my-input-wrapper label="是否懷孕" input-border>
                <q-option-group
                  v-model="editItem.Pregnant"
                  :options="yesOrNoItems"
                  color="primary"
                  inline
                  :disable="editType === 'delete'"
                >
                </q-option-group>
              </my-input-wrapper>
              <my-input-wrapper label="慢性病史（可多選）" class="col-span-full" input-border>
                <q-option-group
                  v-model="editItem.ChronicDisease"
                  :options="chronicItems"
                  type="checkbox"
                  color="primary"
                  :disable="editType === 'delete'"
                >
                </q-option-group>
              </my-input-wrapper>
              <my-input-wrapper label="緊急聯絡人姓名" required-mark>
                <q-input
                  v-bind="QInputProps"
                  :ref="(el) => (inputRefs.EmergencyContact = el)"
                  :rules="rules.EmergencyContact"
                  v-model="editItem.EmergencyContact"
                  :readonly="editType === 'delete'"
                ></q-input>
              </my-input-wrapper>
              <my-input-wrapper label="緊急聯絡人關係" required-mark>
                <q-input
                  v-bind="QInputProps"
                  :ref="(el) => (inputRefs.ContactRelationship = el)"
                  :rules="rules.ContactRelationship"
                  v-model="editItem.ContactRelationship"
                  :readonly="editType === 'delete'"
                ></q-input>
              </my-input-wrapper>
              <my-input-wrapper label="緊急聯絡人電話" required-mark>
                <q-input
                  v-bind="QInputProps"
                  :ref="(el) => (inputRefs.ContactTelphone = el)"
                  :rules="rules.ContactTelphone"
                  v-model="editItem.ContactTelphone"
                  :readonly="editType === 'delete'"
                ></q-input>
              </my-input-wrapper>
            </my-input-group>
          </q-card-section>
        </q-card>

        <q-card>
          <q-card-section class="my-card-title"> 疫苗接種情況 </q-card-section>
          <q-card-section>
            <my-input-group class="grid grid-cols-3 gap-2">
              <my-input-wrapper label="疫苗接種次數">
                <q-input
                  v-bind="QInputProps"
                  v-model="editItem.VaccineTimes"
                  type="number"
                  :readonly="editType === 'delete'"
                ></q-input>
              </my-input-wrapper>
              <my-input-wrapper label="快篩" input-border>
                <q-option-group
                  v-model="editItem.QuickSieve"
                  :options="quickSieveOptions"
                  color="primary"
                  inline
                  :disable="editType === 'delete'"
                ></q-option-group>
              </my-input-wrapper>
              <my-input-wrapper label="體溫" input-border>
                <q-option-group
                  v-model="editItem.Fever"
                  :options="feverOptions"
                  color="primary"
                  inline
                  :disable="editType === 'delete'"
                ></q-option-group>
                <q-input
                  v-bind="QInputProps"
                  v-model="editItem.Temperature"
                  :readonly="editType === 'delete'"
                  min="0"
                  type="number"
                >
                  <template #append><sup>&deg;</sup>C</template>
                </q-input>
              </my-input-wrapper>
              <my-input-wrapper label="出現症狀（可多選）" class="col-span-full" input-border>
                <q-option-group
                  v-model="editItem.Symptoms"
                  :options="symptomsItems"
                  type="checkbox"
                  color="primary"
                  :disable="editType === 'delete'"
                ></q-option-group>
              </my-input-wrapper>
            </my-input-group>
          </q-card-section>
        </q-card>

        <q-card>
          <q-card-section class="my-card-title"> 病患健康自評表（病患填寫） </q-card-section>
          <q-card-section>
            <my-input-group class="grid grid-cols-3 gap-2">
              <my-input-wrapper label="身高">
                <q-input
                  v-bind="QInputProps"
                  v-model="editItem.Height"
                  min="0"
                  :rules="rules.Integer"
                  :readonly="editType === 'delete'"
                  type="number"
                >
                  <template #append>cm</template>
                </q-input>
              </my-input-wrapper>
              <my-input-wrapper label="體重">
                <q-input
                  v-bind="QInputProps"
                  v-model="editItem.Weight"
                  :rules="rules.Integer"
                  min="0"
                  :readonly="editType === 'delete'"
                  type="number"
                >
                  <template #append>kg</template>
                </q-input>
              </my-input-wrapper>
              <my-input-wrapper label="BMI">
                <q-input
                  v-bind="QInputProps"
                  :model-value="getBMI({ height: editItem.Height, weight: editItem.Weight })"
                  readonly
                >
                </q-input>
              </my-input-wrapper>
              <my-input-wrapper label="收縮壓">
                <q-input
                  v-bind="QInputProps"
                  v-model="editItem.BloodPressurediastolic"
                  :rules="rules.Integer"
                  min="0"
                  :readonly="editType === 'delete'"
                  type="number"
                >
                  <template #append>mmHg</template>
                </q-input>
              </my-input-wrapper>
              <my-input-wrapper label="舒張壓">
                <q-input
                  v-bind="QInputProps"
                  v-model="editItem.BloodPressuresystolic"
                  :rules="rules.Integer"
                  min="0"
                  :readonly="editType === 'delete'"
                  type="number"
                >
                  <template #append>mmHg</template>
                </q-input>
              </my-input-wrapper>
              <my-input-wrapper label="脈搏">
                <q-input
                  v-bind="QInputProps"
                  v-model="editItem.Pulse"
                  :rules="rules.Integer"
                  min="0"
                  :readonly="editType === 'delete'"
                  type="number"
                >
                  <template #append>次/分</template>
                </q-input>
              </my-input-wrapper>
            </my-input-group>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <template v-if="wrapperType === 'dialog'" #actions="{ onDialogOK, onDialogCancel }">
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
      ></q-btn>
      <q-btn
        v-if="editType === 'delete'"
        unelevated
        color="negative"
        label="刪除"
        :loading="editLoading"
        :disable="getDataLoading"
        @click="DeletePatientItem(editItem.Id)"
      >
      </q-btn>
    </template>
  </my-elastic-wrapper>
</template>
<script setup>
import { ref, reactive, computed, inject, nextTick } from 'vue'
import { useQuasar, scroll } from 'quasar'
import { getPatientItem, postPatientItem, putPatientItem, deletePatientItem } from 'api'
import { QInputProps, QSelectProps } from 'utils/quasar-extends/base-props.js'
import { zonesData, genderCodeItems, bloodTypeItems, marriageStatusItems, yesOrNoItems } from 'utils/options.js'
import { useRoute, useRouter } from 'vue-router'
import { cloneDeep, isNaN } from 'lodash-es'
import { identifier, useRequired, useDate } from 'utils/rules.js'
import dayjs from 'dayjs'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'

dayjs.extend(isSameOrBefore)

const pageRef = ref()
const $q = useQuasar()

const qDateProxy = ref()
const route = useRoute()
const router = useRouter()
const isLayoutMouted = inject('isLayoutMouted')

const props = defineProps({
  wrapperType: String,
  editType: String,
  id: [String, Number],
})

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
          header: editHeader.value,
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

const editHeader = computed(() => {
  switch (props.editType) {
    case 'add':
      return `新增初診病歷`
    case 'edit':
      return `病歷維護`
    case 'delete':
      return `刪除病歷`
    default:
      return '病歷維護'
  }
})

const editItem = reactive({
  PatientId: null,
  PersonId: props.PersonId || route.query.PersonId || null,
  Status: 1,
  Pregnant: null,
  HadSurgery: null,
  Allergy: null,
  QuickSieve: null,
  VaccineTimes: null,
  Fever: null,
  Temperature: null,
  ChronicDisease: [],
  ChronicDiseaseOther: null,
  Symptoms: [],
  SymptomsOther: null,
  Height: null,
  Weight: null,
  Bmi: null,
  EmergencyContact: null,
  ContactRelationship: null,
  ContactTelphone: null,
  EmergencyContact2: null,
  ContactRelationship2: null,
  ContactTelphone2: null,
  Pulse: null,
  BloodPressurediastolic: null,
  BloodPressuresystolic: null,
  IsDeleted: null,
  Visit1stDate: null,
  Marriage: null,
  BloodType: null,
  JobType: null,
  AllergyMedicine: null,
  AllergyComment: null,
  SurgeryComment: null,
  Identity: null,
  IdentityDiscount: null,
  PartialCharge: null,
  SeekMedical: null,
  AttendCategory: null,
  Person: {
    PersonId: props.PersonId || route.query.PersonId || null,
    Name: props.Name || route.query.Name || null,
    EName: null,
    GenderCode: null,
    BirthDate: null,
    Phone: null,
    Address: [null, null, null],
    Email: null,
    Nationality: null,
  },
})

const getDataLoading = ref(false)
const GetPatientItem = async () => {
  try {
    getDataLoading.value = true
    const res = await getPatientItem(props.id || route.query.PatientId)
    if (res.status === 200) {
      res.data.ChronicDisease = res.data.ChronicDisease.split(',')
      res.data.Symptoms = res.data.Symptoms.split(',')

      if (res.data.Person.Address !== null) {
        if (res.data.Person.Address.indexOf('＞') === -1 && res.data.Person.Address.indexOf('＜') === -1) {
          res.data.Person.Address = res.data.Person.Address.split(',')
        } else {
          res.data.Person.Address = res.data.Person.Address.split('＞')

          if (res.data.Person.Address[1]) {
            res.data.Person.Address = [res.data.Person.Address[0]].concat(res.data.Person.Address[1].split('＜'))
          }
        }

        for (let i = 0; i < 3; i++) {
          if (!res.data.Person.Address[i]) {
            res.data.Person.Address[i] = null
          }
        }
      } else {
        res.data.Person.Address = [null, null, null]
      }

      Object.assign(editItem, res.data)
    }
  } catch (err) {
    console.log(err)
  } finally {
    getDataLoading.value = false
  }
}

const inputRefs = reactive({})

const reg = /^[1-9][0-9]*$/

const rules = {
  Name: useRequired({ type: 'input', title: '病患姓名' }),
  BirthDate: useRequired({ type: 'input', title: '出生日期' }).concat(
    useDate({ title: '出生日期', dateRange: [null, dayjs()] })
  ),
  GenderCode: useRequired({ type: 'select', title: '性別' }),
  PersonId: identifier,
  Phone: useRequired({ type: 'input', title: '手機號碼' }),
  BloodType: useRequired({ type: 'select', title: '血型' }),
  Address_0: useRequired({ type: 'select', title: '縣市' }),
  Address_1: useRequired({ type: 'select', title: '鄉鎮市區' }),
  Address_2: useRequired({ type: 'input', title: '地址' }),
  Allergy: useRequired({ type: 'select', title: '藥物過敏' }),
  AllergyMedicine: computed(() => {
    if (editItem.Allergy) {
      return useRequired({ type: 'input', title: '藥名' })
    } else {
      return null
    }
  }),
  AllergyComment: computed(() => {
    if (editItem.Allergy) {
      return useRequired({ type: 'input', title: '反應' })
    } else {
      return null
    }
  }),
  SurgeryComment: computed(() => {
    if (editItem.HadSurgery) {
      return useRequired({ type: 'input', title: '手術名稱' })
    } else {
      return null
    }
  }),
  EmergencyContact: useRequired({ type: 'input', title: '緊急聯絡人姓名' }),
  ContactRelationship: useRequired({ type: 'input', title: '緊急聯絡人關係' }),
  ContactTelphone: useRequired({ type: 'input', title: '緊急聯絡人電話' }),
  Integer: [(val) => reg.test(val) || '請輸入整數'],
}

const validate = async () => {
  let errorInputRef = null

  const validationArr = Object.entries(inputRefs).map(([key, inputRef]) => {
    if (inputRef) {
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
    scrollToElement(errorInputRef.$el)
    return false
  }
}

const scrollToElement = async (el) => {
  await nextTick()

  const parent = pageRef.value.$el

  let offsetTop = el.offsetTop

  while (el.offsetParent !== parent) {
    el = el.offsetParent
    offsetTop += el.offsetTop
  }

  const duration = 100
  scroll.setVerticalScrollPosition(document.documentElement, Math.max(offsetTop - 120, 0), duration)
}

const onSaveClick = async () => {
  if ((await validate()) === false) return

  const cloneEditItem = cloneDeep(editItem)
  cloneEditItem.ChronicDisease = cloneEditItem.ChronicDisease.join(',')
  cloneEditItem.Symptoms = cloneEditItem.Symptoms.join(',')
  cloneEditItem.Person.Address = cloneEditItem.Person.Address.join(',')
  cloneEditItem.PersonId = cloneEditItem.Person.PersonId

  if (props.editType === 'add' || !cloneEditItem.PatientId) {
    PostPatientItem(cloneEditItem)
  } else if (props.editType === 'edit' || cloneEditItem.PatientId) {
    PutPatientItem(cloneEditItem)
  }
}

const editLoading = ref(false)
const PostPatientItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await postPatientItem(editItem)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '新增病歷成功',
        position: 'top',
      })
      if (props.wrapperType === 'dialog') {
        onDialogOK()
      } else if (props.wrapperType === 'page') {
        router.push({ name: 'TodayBooking', query: { PatientId: res.data } })
      }
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '新增病歷失敗：' + typeof err.data === null ? err.data : JSON.stringify(err.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const PutPatientItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await putPatientItem(editItem)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '編輯病歷成功',
        position: 'top',
      })
      if (props.wrapperType === 'dialog') onDialogOK()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '編輯病歷失敗：' + typeof err.data === null ? err.data : JSON.stringify(err.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const DeletePatientItem = async (id) => {
  try {
    editLoading.value = true
    const res = await deletePatientItem(id)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '刪除病歷成功',
        position: 'top',
      })
      if (props.wrapperType === 'dialog') onDialogOK()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '刪除病歷失敗：' + typeof err.data === null ? err.data : JSON.stringify(err.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const onBackPageClick = () => {
  router.push({ name: 'TodayBooking', query: { PatientId: editItem.PatientId } })
}

const getBMI = ({ height, weight }) => {
  const bmi = Math.round((weight / (height / 100) ** 2) * 10) / 10
  return isNaN(bmi) || bmi === Infinity ? null : bmi
}

const chronicItems = [
  // { label: '無', value: '1' },
  { label: '癌症', value: '2' },
  {
    label: '心血管疾病（包括腦血管疾病、心臟衰竭、和冠狀動脈疾病、中風）',
    value: '3',
  },
  {
    label: '糖尿病（1型糖尿病、2型糖尿病、糖尿病前期、妊娠糖尿病）',
    value: '4',
  },
  {
    label: '慢性呼吸系統疾病（例如:哮喘，和慢性阻塞性肺病（簡稱COPD））',
    value: '5',
  },
  { label: '其他慢病史', value: '6' },
]

const symptomsItems = [
  { label: '喉嚨痛、喉嚨沙啞', value: '1' },
  { label: '腰酸背痛', value: '2' },
  { label: '打噴嚏', value: '3' },
  { label: '頭痛', value: '4' },
  { label: '其他症狀', value: '5' },
  { label: '鼻塞、流鼻涕', value: '6' },
  { label: '肌肉痠痛', value: '7' },
  { label: '疲倦、食慾不振', value: '8' },
  { label: '盜汗', value: '9' },
]

const quickSieveOptions = [
  {
    value: 1,
    label: '陰性',
  },
  {
    value: 2,
    label: '陽性',
  },
  {
    value: 3,
    label: '尚未快篩',
  },
]

const feverOptions = [
  {
    value: true,
    label: '正常',
  },
  {
    value: false,
    label: '發燒',
  },
]

const isFirstVisit = computed(() => !props.id && !route.query.PatientId)

const init = () => {
  if (!isFirstVisit.value) GetPatientItem()
  if (props.PersonId || route.query.personId) {
    editItem.PersonId = props.PersonId || route.query.personId
  }
}
init()
</script>

