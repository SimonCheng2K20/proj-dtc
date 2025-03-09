<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss full-width>
    <my-dialog-content :header="editHeader" width="1280px" @close="onDialogCancel" :loading="getDataLoading">
      <div v-if="editType === 'delete'" class="text-negative mb-1">是否確定刪除此基本資料？</div>
      <div v-else class="text-red mb-1">請核對並確實填寫以下資訊！</div>
      <my-input-group class="grid grid-cols-2 gap-2">
        <my-input-wrapper label="病歷號">
          <q-input v-bind="QInputProps" v-model="editItem.PatientId" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="身分證號">
          <q-input v-bind="QInputProps" v-model="editItem.Patient.PersonId" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="姓名">
          <q-input v-bind="QInputProps" v-model="editItem.Patient.Person.Name" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="生日">
          <my-date-input v-bind="QInputProps" v-model="editItem.Patient.Person.BirthDate" readonly></my-date-input>
        </my-input-wrapper>
        <my-input-wrapper label="性別">
          <q-input v-bind="QInputProps" v-model="editItem.Patient.Person.GenderCode" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="連絡電話">
          <q-input v-bind="QInputProps" v-model="editItem.Patient.Person.Phone" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="科別">
          <q-input v-bind="QInputProps" v-model="editItem.DepartmentName" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="就診身分">
          <q-input v-bind="QInputProps" v-model="editItem.IdentityName" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="病患來源">
          <q-input v-bind="QInputProps" v-model="editItem.Source" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="預約入院日期">
          <my-date-input v-bind="QInputProps" v-model="editItem.IpdPreDate" readonly></my-date-input>
        </my-input-wrapper>
        <my-input-wrapper label="主治醫師">
          <q-input v-bind="QInputProps" v-model="editItem.AttendingDocName" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="預計出院日期">
          <my-date-input v-bind="QInputProps" v-model="editItem.IpdPreDate" readonly></my-date-input>
        </my-input-wrapper>
        <my-input-wrapper label="醫師備註" class="col-span-2">
          <q-input v-bind="QInputProps" v-model="editItem.Note" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="病患床位意向" class="col-span-full">
          <q-option-group
            v-bind="QOptionProps"
            class="flex items-center border-dashed"
            v-model="editItem.病患床位意向"
            :options="[
              { label: '健保床', value: '0' },
              { label: '單人床', value: '1' },
              { label: '雙人床', value: '2' },
            ]"
            type="checkbox"
            disable
          ></q-option-group>
        </my-input-wrapper>

        <my-input-wrapper label="護理站名稱">
          <q-input v-bind="QInputProps" v-model="editItem.HospitalBed.NursingStation" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="床位等級">
          <q-input v-bind="QInputProps" v-model="editItem.HospitalBed.BedLevel" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="床位類別">
          <q-select
            v-bind="QSelectProps"
            v-model="editItem.HospitalBed.BedType"
            :options="bedTypeOptions"
            option-label="Name"
            option-value="No"
            map-options
            emit-value
          >
          </q-select>
        </my-input-wrapper>
        <my-input-wrapper label="差額床">
          <q-input v-bind="QInputProps" v-model="editItem.HospitalBed.MakeUpPrice" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="床位樓層">
          <q-input v-bind="QInputProps" v-model="editItem.HospitalBed.Floor" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="房號">
          <q-input v-bind="QInputProps" v-model="editItem.HospitalBed.Room" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="給付類別">
          <q-input v-bind="QInputProps" v-model="editItem.HospitalBed.BedType" readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="床位號碼">
          <q-input v-bind="QInputProps" v-model="editItem.HospitalBed.BedName" readonly>
            <template #append>
              <q-btn icon="bed" text-color="blue" dense unelevated @click="openBedStatusDialog()"></q-btn>
            </template>
          </q-input>
        </my-input-wrapper>
        <div class="col-span-full grid grid-cols-3 gap-2">
          <my-input-wrapper label="聯絡人1">
            <q-input v-bind="QInputProps" v-model="editItem.Contact1" :readonly="editType === 'delete'"></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="關係">
            <q-input v-bind="QInputProps" v-model="editItem.Relationship1" :readonly="editType === 'delete'"></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="連絡電話">
            <q-input v-bind="QInputProps" v-model="editItem.Telphone1" :readonly="editType === 'delete'"></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="聯絡人2">
            <q-input v-bind="QInputProps" v-model="editItem.Contact2" :readonly="editType === 'delete'"></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="關係">
            <q-input v-bind="QInputProps" v-model="editItem.Relationship2" :readonly="editType === 'delete'"></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="連絡電話">
            <q-input v-bind="QInputProps" v-model="editItem.Telphone2" :readonly="editType === 'delete'"></q-input>
          </my-input-wrapper>
        </div>
        <my-input-wrapper label="住院中心備註" class="col-span-2">
          <q-input v-bind="QInputProps" v-model="editItem.Note"></q-input>
        </my-input-wrapper>
      </my-input-group>
      <template #actions>
        <q-btn
          v-if="editType === 'edit'"
          unelevated
          color="pink-4"
          label="條碼列印"
          :loading="editLoading"
          :disable="getDataLoading"
          @click="getBarCode"
        ></q-btn>
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
          label="報到"
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
          @click="DeleteIpdRecordItem(editItem.IpdId)"
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
  getIpdRecordItem,
  postIpdRecordItem,
  putIpdRecordItem,
  deleteIpdRecordItem,
  getIpdRecordBarCode,
  getBedTypeDropdown,
} from 'api'
import { QInputProps, QOptionProps, QSelectProps } from 'utils/quasar-extends/base-props.js'
import { cloneDeep } from 'lodash-es'

import BedStatusDialog from 'components/BedStatusDialog.vue'

const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  editType: String,
  id: [String, Number],
})

const editHeader = computed(() => {
  switch (props.editType) {
    case 'add':
      return `新增住院基本資料`
    case 'edit':
      return `編輯核對住院基本資料`
    case 'delete':
      return `刪除住院基本資料`
    default:
      return null
  }
})

const editItem = reactive({
  IpdId: null,
  PatientId: null,
  BedId: null,
  IpdPreDate: null,
  IpdPreDischargeDate: null,
  IpdDate: null,
  IpdDischargeDate: null,
  Contact1: null,
  Relationship1: null,
  Telphone1: null,
  Contact2: null,
  Relationship2: null,
  Telphone2: null,
  DepartmentId: null,
  AttendingDocId: null,
  Source: null,
  Identity: null,
  BadReserveGrade: null,
  CreateDatetime: null,
  ModifyDatetime: null,
  Note: null,
  Status: null,
  DepartmentName: null,
  AttendingDocName: null,
  BedName: null,
  IdentityName: null,
  StatusName: null,
  InpatientDays: null,
  BedTypeName: null,
  Patient: {
    PatientId: null,
    PersonId: null,
    Status: null,
    Pregnant: null,
    HadSurgery: null,
    Allergy: null,
    QuickSieve: null,
    VaccineTimes: null,
    Fever: null,
    Temperature: null,
    ChronicDisease: null,
    ChronicDiseaseOther: null,
    Symptoms: null,
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
    CardSerial: null,
    AttendCategory: null,
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
  HospitalBed: {
    Id: null,
    Area: null,
    Floor: null,
    Room: null,
    Bed: null,
    BedPrice: null,
    MakeUp: null,
    MakeUpPrice: null,
    NursingStation: null,
    HealthBed: null,
    BedType: null,
    BedLevel: null,
    BedStatus: null,
    CreatedDatetime: null,
    ModifyDatetime: null,
  },
  病患床位意向: ['1', '2'],
})

const bedTypeOptions = ref([])
const GetBedTypeDropdown = async () => {
  try {
    const res = await getBedTypeDropdown()
    if (res.status === 200) {
      bedTypeOptions.value = res.data
    }
  } catch (err) {
    console.log(err)
  }
}

const getDataLoading = ref(false)
const GetIpdRecordItem = async () => {
  try {
    getDataLoading.value = true
    const res = await getIpdRecordItem(props.id)
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
const rules = {}

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
    return false
  }
}

const onSaveClick = async () => {
  if ((await validate()) === false) return

  const cloneEditItem = cloneDeep(editItem)
  cloneEditItem.Status = '2'

  switch (props.editType) {
    case 'add':
      PostIpdRecordItem(cloneEditItem)
      break
    case 'edit':
      PutIpdRecordItem(cloneEditItem)
      break
  }
}

const editLoading = ref(false)
const PostIpdRecordItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await postIpdRecordItem(editItem)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '新增基本資料成功',
        position: 'top',
      })
      onDialogOK()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '新增基本資料失敗：' + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const PutIpdRecordItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await putIpdRecordItem(editItem)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '編輯基本資料成功',
        position: 'top',
      })
      onDialogOK()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '編輯基本資料失敗：' + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const DeleteIpdRecordItem = async (id) => {
  try {
    editLoading.value = true
    const res = await deleteIpdRecordItem(id)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '刪除基本資料成功',
        position: 'top',
      })
      onDialogOK()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '刪除基本資料失敗：' + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const getBarCode = async () => {
  try {
    const editLoading = true
    const id = editItem.PatientId
    const res = await getIpdRecordBarCode(id)
    if (res.status === 200) {
      window.open(res.data, 'barcode')
    }
  } catch (err) {
    console.log(err)
  } finally {
    const editLoading = false
  }
}

const openBedStatusDialog = () => {
  const dialog = $q
    .dialog({
      component: BedStatusDialog,
      componentProps: {
        editType: 'edit',
      },
    })
    .onOk((bed) => {
      editItem.HospitalBed.NursingStation = bed.stationName
      editItem.HospitalBed.BedLevel = bed.BedLevel
      editItem.HospitalBed.BedType = bed.BedType
      editItem.HospitalBed.MakeUpPrice = bed.MakeUpPrice
      editItem.HospitalBed.Floor = bed.BedFloor
      editItem.HospitalBed.Room = bed.BedRoom
      editItem.HospitalBed.BedName = bed.BedNo
      dialog.hide()
    })
}

const init = () => {
  if (!!props.id) GetIpdRecordItem()
  GetBedTypeDropdown()
}
init()
</script>

