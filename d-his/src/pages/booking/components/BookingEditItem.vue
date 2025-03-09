<template>
  <my-elastic-wrapper v-bind="myElasticWrapperProps">
    <div ref="containerRef" class="relative flex flex-nowrap">
      <q-card class="bg-grey-2 w-full" flat>
        <q-card-section>
          <my-input-group class="grid gap-1">
            <div class="flex justify-between">
              <div class="text-xl font-bold">病患基本資料</div>
              <q-btn v-if="isDev" label="快速掛號" color="primary" unelevated @click="bookingForTest"></q-btn>
              <q-checkbox
                v-if="editType === 'booking' && route.fullPath === '/System/EmergencyBooking'"
                v-model="bookingStore.patientData.FallDownFlag"
                label="路倒病人"
                @update:model-value="onFallDownFlagChange"
              ></q-checkbox>
            </div>
            <q-option-group
              v-model="bookingStore.patientData.patientType"
              dense
              :options="patientTypeItems"
            ></q-option-group>

            <my-input-wrapper :label="bookingStore.patientData.patientType === 'PersonId' ? '身分證號' : '護照號碼'">
              <q-select
                v-bind="QSelectProps"
                v-model="bookingStore.patientData.PersonId"
                :options="patientItems"
                option-label="PersonId"
                use-input
                map-options
                emit-value
                :disable="bookingStore.patientData.FallDownFlag"
                @filter="(val, update) => pateintFilterHandler(val, update, 'PersonId')"
                @input-value="filterLoading = true"
                @clear="onPatientSearchClear"
                @update:model-value="onPatientSelect"
              >
                <template #no-option="{ inputValue }">
                  <q-item v-if="!!inputValue" clickable @click="toWriteFirstVisitSheet('PersonId', inputValue)">
                    <q-item-section class="text-grey">
                      <q-spinner v-if="filterLoading" color="primary"></q-spinner>
                      <q-item-label v-else>
                        <div>找不到符合的資料</div>
                        <div class="text-primary">前往填寫初診病歷</div>
                      </q-item-label>
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
            <my-input-wrapper label="病歷號" :required-mark="!bookingStore.patientData.FallDownFlag">
              <q-select
                v-bind="QSelectProps"
                :ref="(el) => (inputRefs.PatientId = el)"
                :rules="rules.PatientId.value"
                v-model="bookingStore.patientData.PatientId"
                :options="patientItems"
                option-label="PatientId"
                use-input
                map-options
                emit-value
                :disable="bookingStore.patientData.FallDownFlag"
                @filter="(val, update) => pateintFilterHandler(val, update, 'PatientId')"
                @input-value="filterLoading = true"
                @clear="onPatientSearchClear"
                @update:model-value="onPatientSelect"
              >
                <template #no-option="{ inputValue }">
                  <q-item v-if="!!inputValue" clickable @click="toWriteFirstVisitSheet">
                    <q-item-section class="text-grey">
                      <q-spinner v-if="filterLoading" color="primary"></q-spinner>
                      <q-item-label v-else>
                        <div>找不到符合的資料</div>
                        <div class="text-primary">前往填寫初診病歷</div>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
                <template #option="scope">
                  <q-item v-bind="scope.itemProps">
                    <q-item-section>
                      <q-item-label>
                        <div v-html="scope.opt.filterLabel || scope.opt.PatientId"></div>
                      </q-item-label>
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </my-input-wrapper>
            <my-input-group style="display: flex; gap: 5px; flex-direction: row">
              <my-input-wrapper label="姓名" style="display: inline-block; width: 60%">
                <q-select
                  v-bind="QSelectProps"
                  v-model="bookingStore.patientData.Name"
                  :options="patientItems"
                  option-label="Name"
                  use-input
                  map-options
                  emit-value
                  :input-style="{
                    display: bookingStore.patientData.Name ? 'none' : 'block',
                    width: bookingStore.patientData.Name ? 0 : '50px',
                  }"
                  :disable="bookingStore.patientData.FallDownFlag"
                  @filter="(val, update) => pateintFilterHandler(val, update, 'Name')"
                  @input-value="filterLoading = true"
                  @clear="onPatientSearchClear"
                  @update:model-value="onPatientSelect"
                >
                  <template #no-option="{ inputValue }">
                    <q-item v-if="!!inputValue" clickable @click="toWriteFirstVisitSheet('Name', inputValue)">
                      <q-item-section class="text-grey">
                        <q-spinner v-if="filterLoading" color="primary"></q-spinner>
                        <q-item-label v-else>
                          <div>找不到符合的資料</div>
                          <div class="text-primary">前往填寫初診病歷</div>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                  <template #option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label>
                          <div v-html="scope.opt.filterLabel || scope.opt.Name"></div>
                        </q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </my-input-wrapper>
              <my-input-wrapper label="性別" style="display: inline-block; width: 40%">
                <q-select
                  v-bind="QSelectProps"
                  v-model="bookingStore.patientData.GenderCode"
                  :options="genderCodeItems"
                  option-label="label"
                  option-value="value"
                  map-options
                  emit-value
                  readonly
                >
                </q-select>
              </my-input-wrapper>
            </my-input-group>

            <my-input-wrapper label="出生日期">
              <my-date-input v-bind="QInputProps" v-model="bookingStore.patientData.BirthDate" readonly></my-date-input>
            </my-input-wrapper>
          </my-input-group>
        </q-card-section>
      </q-card>

      <q-card v-if="bookingStore.isPatientBookingListShow === false" class="bg-grey-2 w-full" flat>
        <q-card-section>
          <my-input-group class="grid grid-cols-2 gap-1">
            <div class="col-span-2 text-xl font-bold">就醫身分</div>
            <my-input-wrapper
              class="col-span-2"
              v-if="route.name !== 'EmergencyBooking'"
              label="就醫身分"
              required-mark
            >
              <q-select
                v-bind="QSelectProps"
                v-model="bookingStore.patientData.AttendCategory"
                :options="attendCategoryItems"
                option-label="Name"
                option-value="No"
                map-options
                emit-value
                @update:model-value="onAttendCategoryChange"
              >
              </q-select>
            </my-input-wrapper>

            <my-input-wrapper label="轉介機構代號 d17" v-if="bookingStore.patientData.AttendCategory === '5'">
              <q-input v-bind="QInputProps" v-model="bookingStore.patientData.TransCode"></q-input>
            </my-input-wrapper>

            <template v-if="bookingStore.patientData.AttendCategory === '4'">
              <my-input-wrapper label="檢傷分類" required-mark>
                <q-select
                  v-bind="QSelectProps"
                  :ref="(el) => (inputRefs.InjuredGrade = el)"
                  :rules="rules.InjuredGrade"
                  v-model="bookingStore.patientData.InjuredGrade"
                  :options="injuredGradeItems"
                  option-label="Name"
                  option-value="No"
                  map-options
                  emit-value
                >
                </q-select>
              </my-input-wrapper>
              <my-input-wrapper label="病人動向">
                <q-select
                  v-bind="QSelectProps"
                  v-model="bookingStore.patientData.ErTrend"
                  :options="patientERStatusItems"
                  option-label="Name"
                  option-value="No"
                  map-options
                  emit-value
                >
                </q-select>
              </my-input-wrapper>
            </template>

            <my-input-wrapper class="col-span-2" label="就診身分" required-mark>
              <q-select
                v-bind="QSelectProps"
                :ref="(el) => (inputRefs.Identity = el)"
                :rules="rules.Identity"
                v-model="bookingStore.patientData.Identity"
                :options="identityItems"
                option-label="Name"
                option-value="No"
                map-options
                emit-value
                @update:model-value="onAttendCategoryChange"
              >
              </q-select>
            </my-input-wrapper>
            <my-input-wrapper class="col-span-1" label="折扣身分">
              <q-select
                v-bind="QSelectProps"
                v-model="bookingStore.patientData.IdentityDiscount"
                :options="identityDiscountItems"
                option-label="Name"
                option-value="No"
                map-options
                emit-value
              ></q-select>
            </my-input-wrapper>
            <my-input-wrapper class="col-span-1" label="部分負擔">
              <q-input v-bind="QInputProps" v-model="bookingStore.patientData.PartialAfford"></q-input>
            </my-input-wrapper>
            <my-input-wrapper class="col-span-2" label="就醫類別">
              <q-field v-bind="QInputProps" :model-value="bookingStore.patientData.SeekMedical" :disable="isEmergency">
                <template #control>
                  <div>
                    {{ seekMedicalItems.find((item) => item.No === bookingStore.patientData.SeekMedical)?.Text }}
                  </div>
                </template>
                <template #append>
                  <q-icon name="arrow_drop_down" class="q-select__dropdown-icon"></q-icon>
                </template>
              </q-field>
              <div
                class="absolute h-full w-full"
                :class="{
                  'cursor-pointer': !isEmergency,
                  'pointer-events-none': isEmergency,
                }"
                @click="isEmergency ? null : onSeekMedicalClick()"
              ></div>
            </my-input-wrapper>
            <my-input-wrapper v-if="bookingStore.patientData.Identity === 'Y'" label="預防保健">
              <q-select
                v-bind="QSelectProps"
                v-model="bookingStore.patientData.Prevent"
                :options="preventItems"
                option-label="Name"
                option-value="No"
                map-options
                emit-value
              ></q-select>
            </my-input-wrapper>

            <my-input-wrapper class="col-span-1" label="健保卡序">
              <q-input v-bind="QInputProps" v-model="bookingStore.patientData.NhicardCode" readonly></q-input>
            </my-input-wrapper>
            <q-checkbox
              class="col-span-1 ml-auto"
              v-model="bookingStore.patientData.isTakeCard"
              label="掛號後取卡號"
            ></q-checkbox>

            <my-input-wrapper label="檢傷分級" v-if="bookingStore.patientData.AttendCategory === '3'">
              <q-select
                v-bind="QInputProps"
                v-model="bookingStore.patientData.ErExamination"
                :options="[
                  { Name: '1', No: 1 },
                  { Name: '2', No: 2 },
                  { Name: '3', No: 3 },
                  { Name: '4', No: 4 },
                  { Name: '5', No: 5 },
                ]"
                option-label="Name"
                option-value="No"
                map-options
                emit-value
              >
              </q-select>
            </my-input-wrapper>
          </my-input-group>
        </q-card-section>
      </q-card>

      <q-card v-if="bookingStore.isPatientBookingListShow === false" class="bg-grey-2 w-full" flat>
        <q-card-section>
          <my-input-group class="grid grid-cols-2 gap-1">
            <template v-if="bookingStore.patientData.AttendCategory === '4'">
              <div class="col-span-2 text-xl font-bold">急診掛號作業</div>
              <my-input-wrapper class="col-span-2" label="科別" required-mark>
                <q-select
                  v-bind="QSelectProps"
                  :ref="(el) => (inputRefs.ErDepartmentNo = el)"
                  :rules="rules.ErDepartmentNo"
                  v-model="bookingStore.patientData.ErDepartmentNo"
                  :options="ERDepartmentItems"
                  option-label="Name"
                  option-value="No"
                  map-options
                  emit-value
                >
                </q-select>
              </my-input-wrapper>

              <q-separator class="col-span-2 my-2"></q-separator>
            </template>

            <div class="col-span-2 flex items-center justify-between text-xl font-bold">
              <div>應付金額</div>
            </div>
            <my-input-wrapper label="掛號費用">
              <q-input
                v-bind="QInputProps"
                v-model="bookingStore.patientData.Booking_Fee"
                type="number"
                readonly
              ></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="部分負擔">
              <q-input
                v-bind="QInputProps"
                v-model="bookingStore.patientData.PartialAfford"
                type="number"
                readonly
              ></q-input>
            </my-input-wrapper>

            <my-input-wrapper label="欠卡押金">
              <q-input
                v-bind="QInputProps"
                v-model="bookingStore.patientData.NoNhiCardFee"
                type="number"
                readonly
              ></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="優免金額">
              <q-input
                v-bind="QInputProps"
                :model-value="
                  identityDiscountItems.find((item) => item.No === bookingStore.patientData.IdentityDiscount)?.Fee
                "
                type="number"
                readonly
              >
              </q-input>
            </my-input-wrapper>

            <my-input-wrapper label="累計應繳">
              <q-input
                v-bind="QInputProps"
                v-model="bookingStore.patientData.Accumulated_Payable"
                type="number"
                readonly
              ></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="已繳金額">
              <q-input
                v-bind="QInputProps"
                v-model="bookingStore.patientData.Paid_Fee"
                type="number"
                readonly
              ></q-input>
            </my-input-wrapper>
          </my-input-group>
        </q-card-section>
      </q-card>

      <patient-booking-list v-if="bookingStore.isPatientBookingListShow === true"> </patient-booking-list>
    </div>

    <template v-if="wrapperType === 'dialog'" #actions="{ onDialogOK, onDialogCancel }">
      <q-btn unelevated color="grey" label="取消" @click="onDialogCancel"></q-btn>
      <q-btn
        unelevated
        color="primary"
        label="儲存"
        :loading="editLoading"
        :disable="editLoading"
        @click="onSaveClick"
      ></q-btn>
    </template>
  </my-elastic-wrapper>
</template>

<script setup>
import { reactive, ref, nextTick, onBeforeUnmount, computed } from 'vue'
import {
  getPatient,
  getPatientInfo,
  getIdentityList,
  getPreventList,
  getIdentityDiscountsList,
  getPartialAffordPrice,
  getAttendCategoryList,
  getSeekMedicalList,
  getPatientERStatus,
  getERDepartment,
  getInjuredGrade,
  getRoomBookingItem,
  postRoomBooking,
} from 'api'
import setSearchQuery from 'utils/setSearchQuery.js'
import { QSelectProps, QInputProps } from 'utils/quasar-extends/base-props.js'
import { genderCodeItems } from 'utils/options'
import { replace, pickBy, isNull, cloneDeep } from 'lodash-es'
import SelectSeekMedical from './SelectSeekMedical.vue'
import { useQuasar, scroll } from 'quasar'
import dayjs from 'dayjs'
import { useRoute, useRouter } from 'vue-router'
import { useBookingStore } from 'stores/booking.js'
import PatientBookingList from './PatientBookingList.vue'

const isDev = process.env.DEV
const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const bookingStore = useBookingStore()
const containerRef = ref()
const isEmergency = computed(() => route.name === 'EmergencyBooking' || props.editType === 'emergency-edit')
const patientBaseData = computed(() => ({
  AttendCategory: isEmergency.value ? '4' : '2',

  // 非急診掛號，不要自動帶入就醫類別為急診
  SeekMedical: isEmergency.value || bookingStore.patientData.AttendCategory === '4' ? '04' : null,
}))

const dialogRef = ref()

const props = defineProps({
  wrapperType: String,
  editType: String, // booking, emergency-edit
  regId: [String, Number],
})

const patientId = computed(() => route.query.PatientId)

const myElasticWrapperProps = computed(() => {
  const wrapperProps = {
    ref: dialogRef,
    wrapperType: props.wrapperType,
  }
  switch (props.wrapperType) {
    case 'page':
      break
    case 'dialog':
      Object.assign(wrapperProps, {
        fullWidth: true,
        myDialogContentProps: {
          header: '編輯掛號',
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

const getDataLoading = ref(false)
const GetRoomBookingItem = async () => {
  try {
    getDataLoading.value = true
    const res = await getRoomBookingItem(props.regId)
    bookingStore.setPatientData(res.data)
  } catch (err) {
    console.log(err)
  } finally {
    getDataLoading.value = false
  }
}

const editLoading = ref(false)
const onSaveClick = () => {
  console.log(dialogRef.value)
}

let filterCount = 0 // 確定 API 返回的是最後一次的資料，避免第一次 GET 較第二次慢而帶入第一次資料的狀況
const patientItems = ref([])
const GetPatient = async (searchString, searchBy) => {
  filterCount++
  const selfFilterCount = filterCount

  try {
    const query = setSearchQuery({
      $filter: `contains(${searchBy === 'Name' ? 'Person/Name' : searchBy},'${searchString}')`,
    })
    const res = await getPatient(query)
    if (res.status === 200 && selfFilterCount === filterCount) {
      patientItems.value = res.data.Items.map((item) => {
        Object.assign(item, item.Person)

        const regex = new RegExp(searchString, 'gi')

        const filterStrings = [searchBy].map((key) =>
          replace(item[key], regex, (match) => {
            return '<span class="bg-amber-300">' + match + '</span>'
          })
        )

        return { ...item, filterLabel: filterStrings.join(' - ') }
      })
    }
  } catch (err) {
    console.log(err)
  } finally {
    if (selfFilterCount === filterCount) filterCount = 0
  }
}

const filterLoading = ref(false)
const pateintFilterHandler = (val, update, searchBy) => {
  if (val === '') {
    update(() => {
      patientItems.value = []
      filterLoading.value = false
    })
    return
  }

  update(async () => {
    await GetPatient(val, searchBy)
    filterLoading.value = false
  })
}

const onPatientSearchClear = () => {
  if (route.name !== 'EmergencyBooking') {
    bookingStore.resetPatientData({})
  } else {
    bookingStore.resetPatientData({ isEmergency })
  }

  if (props.wrapperType === 'item') router.replace({ name: route.name })
}

const onPatientSelect = async (opt) => {
  if (!opt) {
    return
  }

  const optData = pickBy(opt, (item) => !isNull(item))

  const { data: patientData } = await GetPatientInfo(optData.PatientId || optData.PersonId)

  const resultData = {}
  // 順序不應隨意更動，patientBaseData 應保持在最後，以覆蓋 patientData 上次掛號資料
  Object.assign(resultData, optData, patientData, patientBaseData.value)

  bookingStore.setPatientData(resultData)

  GetPartialAffordPrice()
  bookingStore.emitter.emit('GetPatientBooking')
  router.replace({ query: { PatientId: bookingStore.patientData.PatientId } })
}

const GetPatientInfo = async (personIdOrPatientId) => {
  try {
    const query = setSearchQuery({
      id: personIdOrPatientId,
    })
    const res = await getPatientInfo(query)
    return { data: pickBy(res.data, (item) => !isNull(item)) }
  } catch (error) {
    console.log(error)
    return { error }
  }
}

const onSeekMedicalClick = () => {
  $q.dialog({
    component: SelectSeekMedical,
    componentProps: {
      items: seekMedicalItems.value,
    },
  }).onOk((seekMedicalNo) => {
    bookingStore.patientData.SeekMedical = seekMedicalNo
  })
}

const toWriteFirstVisitSheet = (key, inputValue) => {
  const routeOptions = { name: 'PatientManage' }
  if (key && inputValue) {
    Object.assign(routeOptions, { query: { [key]: inputValue } })
  }
  router.push(routeOptions)
}

const onFallDownFlagChange = (val) => {
  if (val) {
    bookingStore.setPatientData({
      PersonId: dayjs().format('YYYYMMDDHHmmss'),
      Name: '無名氏',
      Identity: '3',
    })
  } else {
    bookingStore.setPatientData({
      PersonId: null,
      Name: null,
      Identity: null,
    })
  }
  inputRefs.PatientId.resetValidation()
}

const inputRefs = reactive({})

const rules = {
  PatientId: computed(() => {
    if (!bookingStore.patientData.FallDownFlag) {
      return [(val) => !!val || '請選擇病歷號']
    } else {
      return null
    }
  }),
  AttendCategory: [(val) => !!val || '請選擇就醫身分'],
  InjuredGrade: [(val) => !!val || '請選擇檢傷分類'],
  Identity: [(val) => !!val || '請選擇就診身分'],
  ErDepartmentNo: [(val) => !!val || '請選擇科別'],
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
    scrollToElement(errorInputRef.$el)
    return false
  }
}

const scrollToElement = async (el) => {
  await nextTick()

  const parent = containerRef.value

  let offsetTop = el.offsetTop

  while (el.offsetParent !== parent) {
    el = el.offsetParent
    offsetTop += el.offsetTop
  }

  const duration = 100
  scroll.setVerticalScrollPosition(
    document.querySelector('.q-drawer__content.scroll'),
    Math.max(offsetTop - 120, 0),
    duration
  )
}

const patientTypeItems = [
  { label: '身分證號/居留證號', value: 'PersonId' },
  { label: '護照號碼/大陸居民來往台灣通行證', value: 'Passport' },
]

const attendCategoryItems = ref([])
const GetAttendCategoryList = async () => {
  try {
    const res = await getAttendCategoryList()
    if (res.status === 200) {
      attendCategoryItems.value = cloneDeep(res.data).filter((item) => {
        return item.Name !== '住院'
      })
    }
  } catch (err) {
    console.log(err)
  }
}

const identityItems = ref([])
const GetIdentityList = async () => {
  try {
    const res = await getIdentityList()
    if (res.status === 200) {
      identityItems.value = res.data
    }
  } catch (err) {
    console.log(err)
  }
}

const identityDiscountItems = ref([])
const GetIdentityDiscountsList = async () => {
  try {
    const res = await getIdentityDiscountsList()
    if (res.status === 200) {
      identityDiscountItems.value = res.data
    }
  } catch (err) {
    console.log(err)
  }
}

const preventItems = ref([])
const GetPreventList = async () => {
  try {
    const res = await getPreventList()
    if (res.status === 200) {
      preventItems.value = res.data
    }
  } catch (err) {
    console.log(err)
  }
}

const seekMedicalItems = ref([])
const GetSeekMedicalList = async () => {
  try {
    const res = await getSeekMedicalList()
    if (res.status === 200) {
      seekMedicalItems.value = res.data.Items
    }
  } catch (err) {
    console.log(err)
  }
}

const onAttendCategoryChange = () => {
  if (bookingStore.patientData.Identity && bookingStore.patientData.AttendCategory) GetPartialAffordPrice()
  else Object.assign(bookingStore.patientData, { PartialAfford: null })
}

const GetPartialAffordPrice = async () => {
  try {
    const query = setSearchQuery({
      code: identityItems.value.find((item) => item.No === bookingStore.patientData.Identity)?.Name,
      ItemId: attendCategoryItems.value.find((item) => item.No === bookingStore.patientData.AttendCategory)?.ItemId,
    })
    const res = await getPartialAffordPrice(query)
    if (res.status === 200 && !!res.data && res.data.length > 0) {
      Object.assign(bookingStore.patientData, { PartialAfford: res.data?.[0]?.Fee ?? null })
    }
  } catch (err) {
    console.log(err)
  }
}

const patientERStatusItems = ref([])
const GetPatientERStatus = async () => {
  try {
    const res = await getPatientERStatus()
    if (res.status === 200) {
      patientERStatusItems.value = res.data
    }
  } catch (err) {
    console.log(err)
  }
}

const ERDepartmentItems = ref([])
const GetERDepartment = async () => {
  try {
    const res = await getERDepartment()
    if (res.status === 200) {
      ERDepartmentItems.value = res.data
    }
  } catch (err) {
    console.log(err)
  }
}

const injuredGradeItems = ref([])
const GetInjuredGrade = async () => {
  try {
    const res = await getInjuredGrade()
    if (res.status === 200) {
      injuredGradeItems.value = res.data
    }
  } catch (err) {
    console.log(err)
  }
}

const bookingForTest = async () => {
  await GetPatient('F', 'PersonId')

  for (const patient of patientItems.value) {
    // 需要 timeout 放緩速度，給號才不會出錯
    await new Promise((resolve) => {
      setTimeout(async () => {
        await onPatientSelect(patient)
        postRoomBooking({
          ...bookingStore.patientData,
          Type: 'O',
          TimeSlotNo: '1',
          RoomNo: '0201A',
          BookingDate: dayjs().format(),
        })
        resolve()
      }, 500)
    })
  }
}

onBeforeUnmount(() => {
  bookingStore.reset()
})

const init = () => {
  bookingStore.setPatientData(patientBaseData.value)
  // if (patientId.value) {
  if (props.editType === 'booking' && patientId.value) {
    onPatientSelect({ PatientId: patientId.value })
  } else if (props.editType === 'emergency-edit' && props.regId) {
    GetRoomBookingItem(patientId.value)
  }
  // }
  GetAttendCategoryList()
  GetIdentityList()
  GetIdentityDiscountsList()
  GetPreventList()
  GetSeekMedicalList()
  GetPatientERStatus()
  GetInjuredGrade()
  GetERDepartment()

  bookingStore.emitter.on('validate', async (callback) => {
    const result = await validate()
    callback(result)
  })

  bookingStore.emitter.on('read-health-card', onPatientSelect)
}
init()
</script>

