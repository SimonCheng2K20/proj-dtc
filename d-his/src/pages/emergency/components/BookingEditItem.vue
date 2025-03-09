<template>
  <q-dialog ref="dialogRef" full-width no-backdrop-dismiss>
    <my-dialog-content header="掛號資料" @close="onDialogCancel">
      <div ref="containerRef" class="relative flex flex-nowrap">
        <q-card class="bg-grey-2 w-full" flat>
          <q-card-section>
            <my-input-group class="grid gap-1">
              <div class="text-xl font-bold">病患基本資料</div>
              <q-option-group v-model="patientType" dense :options="patientTypeItems"></q-option-group>

              <my-input-wrapper :label="patientType === 'PersonId' ? '身分證號' : '護照號碼'" required-mark>
                <q-input
                  v-bind="QInputProps"
                  :ref="(el) => (inputRefs.PersonId = el)"
                  :rules="rules.PersonId.value"
                  v-model="bookingData.Patient.Person.PersonId"
                ></q-input>
              </my-input-wrapper>
              <my-input-wrapper label="病歷號" required-mark>
                <q-input v-bind="QInputProps" v-model="bookingData.Patient.PatientId" readonly></q-input>
              </my-input-wrapper>
              <my-input-group class="grid grid-cols-2 gap-1">
                <my-input-wrapper label="姓名">
                  <q-input v-bind="QInputProps" v-model="bookingData.Patient.Person.Name"></q-input>
                </my-input-wrapper>
                <my-input-wrapper label="性別">
                  <q-select
                    v-bind="QSelectProps"
                    v-model="bookingData.Patient.Person.GenderCode"
                    :options="genderCodeItems"
                    option-label="label"
                    option-value="value"
                    map-options
                    emit-value
                  >
                  </q-select>
                </my-input-wrapper>
              </my-input-group>

              <my-input-wrapper label="出生日期">
                <my-date-input v-bind="QInputProps" v-model="bookingData.Patient.Person.BirthDate"></my-date-input>
              </my-input-wrapper>
            </my-input-group>
          </q-card-section>
        </q-card>

        <q-card class="bg-grey-2 w-full" flat>
          <q-card-section>
            <my-input-group class="grid grid-cols-2 gap-1">
              <div class="col-span-2 text-xl font-bold">就醫身分</div>

              <my-input-wrapper label="檢傷分類" required-mark>
                <q-select
                  v-bind="QSelectProps"
                  :ref="(el) => (inputRefs.InjuredGrade = el)"
                  :rules="rules.InjuredGrade"
                  v-model="bookingData.InjuredGrade"
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
                  v-model="bookingData.ErTrend"
                  :options="patientERStatusItems"
                  option-label="Name"
                  option-value="No"
                  map-options
                  emit-value
                >
                </q-select>
              </my-input-wrapper>

              <my-input-wrapper class="col-span-2" label="就診身分" required-mark>
                <q-select
                  v-bind="QSelectProps"
                  :ref="(el) => (inputRefs.Identity = el)"
                  :rules="rules.Identity"
                  v-model="bookingData.Identity"
                  :options="identityItems"
                  option-label="Name"
                  option-value="No"
                  map-options
                  emit-value
                  @update:model-value="onAttendCategoryChange"
                >
                </q-select>
              </my-input-wrapper>
              <my-input-wrapper label="折扣身分">
                <q-select
                  v-bind="QSelectProps"
                  v-model="bookingData.IdentityDiscount"
                  :options="identityDiscountItems"
                  option-label="Name"
                  option-value="No"
                  map-options
                  emit-value
                ></q-select>
              </my-input-wrapper>
              <my-input-wrapper label="部分負擔">
                <q-input v-bind="QInputProps" v-model="bookingData.PartialAfford"></q-input>
              </my-input-wrapper>
              <my-input-wrapper class="col-span-2" label="就醫類別">
                <q-field v-bind="QInputProps" :model-value="bookingData.SeekMedical" readonly>
                  <template #control>
                    <div>
                      {{ seekMedicalItems.find((item) => item.No === bookingData.SeekMedical)?.Text }}
                    </div>
                  </template>
                  <template #append>
                    <q-icon name="arrow_drop_down" class="q-select__dropdown-icon"></q-icon>
                  </template>
                </q-field>
              </my-input-wrapper>
              <my-input-wrapper label="健保卡序">
                <q-input v-bind="QInputProps" v-model="bookingData.CardSerial" readonly></q-input>
              </my-input-wrapper>
            </my-input-group>
          </q-card-section>
        </q-card>

        <q-card class="bg-grey-2 w-full" flat>
          <q-card-section>
            <my-input-group class="grid grid-cols-2 gap-1">
              <div class="col-span-2 text-xl font-bold">急診掛號作業</div>
              <my-input-wrapper class="col-span-2" label="科別">
                <q-select
                  v-bind="QSelectProps"
                  v-model="bookingData.ErDepartmentNo"
                  :options="ERDepartmentItems"
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
      </div>

      <template #actions>
        <q-btn unelevated color="grey" label="取消" @click="onDialogCancel"></q-btn>
        <q-btn unelevated color="primary" label="儲存" :loading="editLoading" @click="onSaveClick"></q-btn>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useQuasar, useDialogPluginComponent } from 'quasar'
import {
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
  putRoomBooking,
  putPatientItem,
} from 'api'
import { QSelectProps, QInputProps } from 'utils/quasar-extends/base-props.js'
import { genderCodeItems } from 'utils/options'
import { validate } from 'utils/quasar-extends/validate.js'
import { useRequired } from 'utils/rules.js'

const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  id: String,
})

const bookingData = reactive({
  InjuredGrade: null,
  ErTrend: null,
  Identity: null,
  IdentityDiscount: null,
  PartialAfford: null,
  SeekMedical: null,
  CardSerial: null,
  Patient: {
    PatientId: null,
    PersonId: null,
    Person: {
      PersonId: null,
      Name: null,
      EName: null,
      GenderCode: null,
      BirthDate: null,
      Phone: null,
      Address: null,
      Email: null,
      Nationality: null,
    },
  },
})
const GetRoomBookingItem = async () => {
  try {
    const res = await getRoomBookingItem(props.id)
    if (res.data) Object.assign(bookingData, res.data)
  } catch (error) {
    console.log(error)
  }
}

const inputRefs = reactive({})
const rules = {
  PersonId: computed(() =>
    useRequired({ title: patientType.value === 'PersonId' ? '身分證號' : '護照號碼', type: 'input' })
  ),
  InjuredGrade: useRequired({ title: '檢傷分類', type: 'select' }),
  Identity: useRequired({ title: '就診身分', type: 'select' }),
}

const editLoading = ref(false)
const onSaveClick = async () => {
  const { result, errorInputRef } = validate(inputRefs)

  if (result === false) {
    errorInputRef.focus()
    return
  }

  editLoading.value = true

  await PutPatientItem()
  await PutRoomBooking()

  editLoading.value = false

  onDialogOK()
}

const PutPatientItem = async () => {
  try {
    const res = await putPatientItem(bookingData.Patient)
    $q.notify({
      type: 'positive',
      message: '編輯病歷成功',
      position: 'top',
    })
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '編輯病歷失敗：' + typeof err.data === null ? err.data : JSON.stringify(err.data),
      position: 'top',
    })
  }
}

const PutRoomBooking = async () => {
  try {
    const res = await putRoomBooking(bookingData)
    $q.notify({
      type: 'positive',
      message: '編輯掛號資料成功',
      position: 'top',
    })
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '編輯掛號資料失敗：' + typeof err.data === null ? err.data : JSON.stringify(err.data),
      position: 'top',
    })
  }
}

const patientType = ref('PersonId')
const patientTypeItems = [
  { label: '身分證號/居留證號', value: 'PersonId' },
  { label: '護照號碼/大陸居民來往台灣通行證', value: 'Passport' },
]

const attendCategoryItems = ref([])
const GetAttendCategoryList = async () => {
  try {
    const res = await getAttendCategoryList()
    attendCategoryItems.value = res.data.filter((item) => {
      return item.Name !== '住院'
    })
  } catch (err) {
    console.log(err)
  }
}

const identityItems = ref([])
const GetIdentityList = async () => {
  try {
    const res = await getIdentityList()
    identityItems.value = res.data
  } catch (err) {
    console.log(err)
  }
}

const identityDiscountItems = ref([])
const GetIdentityDiscountsList = async () => {
  try {
    const res = await getIdentityDiscountsList()
    identityDiscountItems.value = res.data
  } catch (err) {
    console.log(err)
  }
}

const preventItems = ref([])
const GetPreventList = async () => {
  try {
    const res = await getPreventList()
    preventItems.value = res.data
  } catch (err) {
    console.log(err)
  }
}

const seekMedicalItems = ref([])
const GetSeekMedicalList = async () => {
  try {
    const res = await getSeekMedicalList()
    seekMedicalItems.value = res.data.Items
  } catch (err) {
    console.log(err)
  }
}

const onAttendCategoryChange = () => {
  if (bookingData.Identity && bookingData.AttendCategory) GetPartialAffordPrice()
  else Object.assign(bookingData, { PartialAfford: null })
}

const GetPartialAffordPrice = async () => {
  try {
    const query = setSearchQuery({
      code: identityItems.value.find((item) => item.No === bookingData.Identity).Name,
      ItemId: attendCategoryItems.value.find((item) => item.No === bookingData.AttendCategory)?.ItemId,
    })
    const res = await getPartialAffordPrice(query)
    if (res.status === 200 && !!res.data && res.data.length > 0) {
      Object.assign(bookingData, { PartialAfford: res.data?.[0]?.Fee ?? null })
    }
  } catch (err) {
    console.log(err)
  }
}

const patientERStatusItems = ref([])
const GetPatientERStatus = async () => {
  try {
    const res = await getPatientERStatus()
    patientERStatusItems.value = res.data
  } catch (err) {
    console.log(err)
  }
}

const ERDepartmentItems = ref([])
const GetERDepartment = async () => {
  try {
    const res = await getERDepartment()
    ERDepartmentItems.value = res.data
  } catch (err) {
    console.log(err)
  }
}

const injuredGradeItems = ref([])
const GetInjuredGrade = async () => {
  try {
    const res = await getInjuredGrade()
    injuredGradeItems.value = res.data
  } catch (err) {
    console.log(err)
  }
}
const init = () => {
  GetRoomBookingItem()
  GetAttendCategoryList()
  GetIdentityList()
  GetIdentityDiscountsList()
  GetPreventList()
  GetSeekMedicalList()
  GetPatientERStatus()
  GetERDepartment()
  GetInjuredGrade()
}
init()
</script>

