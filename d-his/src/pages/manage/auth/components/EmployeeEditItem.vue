<template>
  <q-dialog ref="dialogRef" full-width no-backdrop-dismiss>
    <my-dialog-content :header="editHeader" width="1280px" @close="onDialogCancel" :loading="getDataLoading">
      <q-card>
        <q-card-section class="my-card-title"> 個人資料 </q-card-section>
        <q-card-section class="p-4 mt-2">
          <div class="flex no-wrap gap-2">
            <my-input-group class="grid grid-cols-4 gap-2" :group-by="['col', 4]">
              <my-input-wrapper label="中文姓名" required-mark>
                <q-input
                  v-bind="QInputProps"
                  v-model="editItem.Person.Name"
                  :ref="(el) => (inputRefs.Name = el)"
                  :rules="rules.Name"
                  :readonly="editType === 'delete'"
                />
              </my-input-wrapper>
              <my-input-wrapper label="英文姓名">
                <q-input v-bind="QInputProps" v-model="editItem.Person.EName" :readonly="editType === 'delete'" />
              </my-input-wrapper>
              <my-input-wrapper label="隸屬科別" required-mark>
                <q-select
                  v-bind="QSelectProps"
                  v-model="editItem.DepartmentNo"
                  :options="departmentItems"
                  optionLabel="Name"
                  optionValue="No"
                  emit-value
                  map-options
                  :ref="(el) => (inputRefs.DepartmentNo = el)"
                  :rules="rules.DepartmentNo"
                  :readonly="editType === 'delete'"
                ></q-select>
              </my-input-wrapper>
              <my-input-wrapper label="職稱" required-mark>
                <q-select
                  v-bind="QSelectProps"
                  v-model="editItem.EmployeeDuty"
                  :options="roleItems"
                  optionLabel="Name"
                  optionValue="No"
                  emit-value
                  map-options
                  :ref="(el) => (inputRefs.EmployeeDuty = el)"
                  :rules="rules.EmployeeDuty"
                  :readonly="editType === 'delete'"
                ></q-select>
              </my-input-wrapper>
              <my-input-wrapper label="身分證號/護照號碼" required-mark>
                <q-input
                  v-bind="QInputProps"
                  v-model="editItem.PersonId"
                  :ref="(el) => (inputRefs.PersonId = el)"
                  :rules="rules.PersonId"
                  :readonly="editType === 'delete'"
                  @update:model-value="(val) => (editItem.Person.PersonId = val)"
                />
              </my-input-wrapper>
              <my-input-wrapper label="出生年月日">
                <my-date-input
                  v-bind="QInputProps"
                  v-model="editItem.Person.BirthDate"
                  :readonly="editType === 'delete'"
                ></my-date-input>
              </my-input-wrapper>
              <my-input-wrapper label="性別">
                <q-select
                  v-bind="QSelectProps"
                  v-model="editItem.Person.GenderCode"
                  :options="genderCodeItems"
                  optionLabel="label"
                  optionValue="value"
                  emit-value
                  map-options
                  :readonly="editType === 'delete'"
                ></q-select>
              </my-input-wrapper>
              <my-input-wrapper label="可配合班別">
                <q-select
                  v-bind="QSelectProps"
                  v-model="editItem.WorkShift"
                  :options="workShiftItems"
                  optionLabel="Name"
                  optionValue="No"
                  emit-value
                  map-options
                  :readonly="editType === 'delete'"
                ></q-select>
              </my-input-wrapper>
              <my-input-wrapper label="國籍">
                <q-input v-bind="QInputProps" v-model="editItem.Person.Nationality" :readonly="editType === 'delete'" />
              </my-input-wrapper>
              <my-input-wrapper label="血型">
                <q-select
                  v-bind="QSelectProps"
                  v-model="editItem.BloodType"
                  :options="bloodTypeItems"
                  optionLabel="label"
                  optionValue="value"
                  emit-value
                  map-options
                  :readonly="editType === 'delete'"
                ></q-select>
              </my-input-wrapper>
              <my-input-wrapper label="婚姻狀況">
                <q-select
                  v-bind="QSelectProps"
                  v-model="editItem.Marriage"
                  :options="marriageStatusItems"
                  optionLabel="Name"
                  optionValue="No"
                  emit-value
                  map-options
                  :readonly="editType === 'delete'"
                ></q-select>
              </my-input-wrapper>
              <my-input-wrapper label="子女數" v-if="editItem.Marriage === '1'">
                <q-input v-bind="QInputProps" v-model="editItem.Children" :readonly="editType === 'delete'" />
              </my-input-wrapper>
              <my-input-wrapper label="兵役狀況">
                <q-select
                  v-bind="QSelectProps"
                  v-model="editItem.MilitaryService"
                  :options="militaryServiceItems"
                  optionLabel="Name"
                  optionValue="No"
                  emit-value
                  map-options
                  :readonly="editType === 'delete'"
                ></q-select>
              </my-input-wrapper>
              <my-input-wrapper label="戶籍電話">
                <q-input v-bind="QInputProps" v-model="editItem.Telphone" :readonly="editType === 'delete'" />
              </my-input-wrapper>
              <my-input-wrapper label="行動電話(1)">
                <q-input v-bind="QInputProps" v-model="editItem.Mobile" :readonly="editType === 'delete'" />
              </my-input-wrapper>
              <my-input-wrapper label="是否為原住民">
                <q-select
                  v-bind="QSelectProps"
                  v-model="editItem.Indigenous"
                  :options="yesOrNoItems"
                  optionLabel="label"
                  optionValue="value"
                  emit-value
                  map-options
                  :readonly="editType === 'delete'"
                ></q-select>
              </my-input-wrapper>
              <my-input-wrapper label="原住民族群" v-if="editItem.Indigenous">
                <q-select
                  v-bind="QSelectProps"
                  v-model="editItem.IndigenousType"
                  :options="indigenousItems"
                  optionLabel="Name"
                  optionValue="No"
                  emit-value
                  map-options
                  :readonly="editType === 'delete'"
                ></q-select>
              </my-input-wrapper>
              <my-input-wrapper label="領有殘障手冊">
                <q-select
                  v-bind="QSelectProps"
                  v-model="editItem.Handicap"
                  :options="withOrWithoutItems"
                  optionLabel="label"
                  optionValue="value"
                  emit-value
                  map-options
                  :readonly="editType === 'delete'"
                ></q-select>
              </my-input-wrapper>
              <my-input-wrapper label="殘障級別" v-if="editItem.Handicap">
                <q-select
                  v-bind="QSelectProps"
                  v-model="editItem.HandicapLevel"
                  :options="handicapLevelItems"
                  optionLabel="label"
                  optionValue="value"
                  emit-value
                  map-options
                  :readonly="editType === 'delete'"
                ></q-select>
              </my-input-wrapper>
            </my-input-group>
            <div class="w-[160px] shrink-0 text-center">
              <q-img :src="imageSrc"></q-img>
              <q-btn
                v-if="editItem !== 'delete'"
                class="mt-2"
                color="primary"
                label="上傳照片"
                unelevated
                @click="imageUpload"
              />
            </div>
          </div>
          <my-input-group class="grid grid-cols-3 gap-2 mt-2">
            <my-input-wrapper label="現址電話">
              <q-input v-bind="QInputProps" v-model="editItem.TelphoneNow" :readonly="editType === 'delete'" />
            </my-input-wrapper>
            <my-input-wrapper label="行動電話(2)">
              <q-input v-bind="QInputProps" v-model="editItem.MobileNow" :readonly="editType === 'delete'" />
            </my-input-wrapper>
            <my-input-wrapper label="Email">
              <q-input v-bind="QInputProps" v-model="editItem.Person.Email" :readonly="editType === 'delete'" />
            </my-input-wrapper>
            <my-input-wrapper label="戶籍地址" class="col-span-full">
              <q-input v-bind="QInputProps" v-model="editItem.Address" :readonly="editType === 'delete'" />
            </my-input-wrapper>
            <my-input-wrapper label="現居地址" class="col-span-full">
              <q-input v-bind="QInputProps" v-model="editItem.AddressNow" :readonly="editType === 'delete'" />
            </my-input-wrapper>
            <my-input-wrapper label="緊急聯絡人姓名">
              <q-input v-bind="QInputProps" v-model="editItem.EmergencyContact" :readonly="editType === 'delete'" />
            </my-input-wrapper>
            <my-input-wrapper label="緊急聯絡人關係">
              <q-input v-bind="QInputProps" v-model="editItem.ContactRelationship" :readonly="editType === 'delete'" />
            </my-input-wrapper>
            <my-input-wrapper label="緊急聯絡人電話">
              <q-input v-bind="QInputProps" v-model="editItem.ContactTelphone" :readonly="editType === 'delete'" />
            </my-input-wrapper>
          </my-input-group>
        </q-card-section>
      </q-card>

      <q-table
        class="mt-2"
        v-bind="QTableProps"
        :rows="editItem.EmployeeEducations"
        :columns="employeeEducationsColumns"
        :pagination="{ rowsPerPage: -1 }"
      >
        <template #top>
          <div>學歷</div>
          <q-space></q-space>
          <q-btn
            v-if="editType !== 'delete'"
            color="add"
            icon="add"
            unelevated
            dense
            @click="editItem.EmployeeEducations.push(cloneDeep(initData.EmployeeCertificates))"
          ></q-btn>
        </template>
        <template #body-cell-EducationLevel="{ col, row }">
          <q-td :props="{ col }">
            <q-select
              v-bind="QSelectProps"
              v-model="row.EducationLevel"
              :options="educationLevelItems"
              :readonly="editType === 'delete'"
            ></q-select>
          </q-td>
        </template>
        <template #body-cell-SchoolName="{ col, row }">
          <q-td :props="{ col }">
            <q-input v-bind="QInputProps" v-model="row.SchoolName" :readonly="editType === 'delete'"></q-input>
          </q-td>
        </template>
        <template #body-cell-Major="{ col, row }">
          <q-td :props="{ col }">
            <q-input v-bind="QInputProps" v-model="row.Major" :readonly="editType === 'delete'"></q-input>
          </q-td>
        </template>
        <template #body-cell-Status="{ col, row }">
          <q-td :props="{ col }">
            <q-select
              v-bind="QSelectProps"
              v-model="row.Status"
              :options="educationStatusItems"
              :readonly="editType === 'delete'"
            ></q-select>
          </q-td>
        </template>
        <template #body-cell-action="{ col, rowIndex }">
          <q-td :props="{ col }">
            <q-btn
              color="delete"
              label="刪除"
              unelevated
              dense
              @click="editItem.EmployeeEducations.splice(rowIndex, 1)"
            >
            </q-btn>
          </q-td>
        </template>
      </q-table>

      <q-table
        class="my-2"
        v-bind="QTableProps"
        :rows="editItem.EmployeeCertificates"
        :columns="employeeCertificatesColumns"
        :pagination="{ rowsPerPage: -1 }"
      >
        <template #top>
          <div>證照</div>
          <q-space></q-space>
          <q-btn
            v-if="editType !== 'delete'"
            color="add"
            icon="add"
            unelevated
            dense
            @click="editItem.EmployeeCertificates.push(cloneDeep(initData.EmployeeCertificates))"
          ></q-btn>
        </template>
        <template #body-cell-CertificateType="{ col, row }">
          <q-td :props="{ col }">
            <q-select
              v-bind="QSelectProps"
              v-model="row.CertificateType"
              :options="certificateTypeItems"
              :readonly="editType === 'delete'"
            ></q-select>
          </q-td>
        </template>
        <template #body-cell-DepartmentName="{ col, row }">
          <q-td :props="{ col }">
            <q-input v-bind="QInputProps" v-model="row.DepartmentName" :readonly="editType === 'delete'"></q-input>
          </q-td>
        </template>
        <template #body-cell-CertificateNo="{ col, row }">
          <q-td :props="{ col }">
            <q-input v-bind="QInputProps" v-model="row.CertificateNo" :readonly="editType === 'delete'"></q-input>
          </q-td>
        </template>
        <template #body-cell-ExpireDate="{ col, row }">
          <q-td :props="{ col }">
            <my-date-input
              v-bind="QInputProps"
              v-model="row.ExpireDate"
              :readonly="editType === 'delete'"
            ></my-date-input>
          </q-td>
        </template>
        <template #body-cell-action="{ col, rowIndex }">
          <q-td :props="{ col }">
            <q-btn
              color="delete"
              label="刪除"
              unelevated
              dense
              @click="editItem.EmployeeCertificates.splice(rowIndex, 1)"
            >
            </q-btn>
          </q-td>
        </template>
      </q-table>

      <q-card>
        <q-card-section class="my-card-title"> 人事檔 </q-card-section>
        <q-card-section class="mt-2 p-4">
          <my-input-group class="grid grid-cols-4 gap-2">
            <my-input-wrapper label="員工帳號" required-mark>
              <q-input
                v-bind="QInputProps"
                :ref="(el) => (inputRefs.AccountNo = el)"
                :rules="rules.AccountNo"
                v-model="editItem.AccountNo"
                :readonly="editType === 'delete'"
                @update:model-value="(val) => (editItem.AccountNo = val)"
              />
            </my-input-wrapper>
            <my-input-wrapper label="識別證號">
              <q-input v-bind="QInputProps" v-model="editItem.IdentificationCode" :readonly="editType === 'delete'" />
            </my-input-wrapper>
            <my-input-wrapper label="報到日">
              <my-date-input
                v-bind="QInputProps"
                v-model="editItem.EmploymentDay"
                :readonly="editType === 'delete'"
              ></my-date-input>
            </my-input-wrapper>
            <my-input-wrapper label="離職日">
              <my-date-input
                v-bind="QInputProps"
                v-model="editItem.LayoffDay"
                :readonly="editType === 'delete'"
              ></my-date-input>
            </my-input-wrapper>
            <my-input-wrapper label="狀態" required-mark>
              <q-select
                v-bind="QSelectProps"
                v-model="editItem.Status"
                :options="activeStatusNumberItems"
                optionLabel="label"
                optionValue="value"
                emit-value
                map-options
                :ref="(el) => (inputRefs.Status = el)"
                :rules="rules.Status"
                :readonly="editType === 'delete'"
              ></q-select>
            </my-input-wrapper>
          </my-input-group>
        </q-card-section>
      </q-card>

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
        ></q-btn>
        <q-btn
          v-if="editType === 'delete'"
          unelevated
          color="negative"
          label="刪除"
          :loading="editLoading"
          :disable="getDataLoading"
          @click="DeleteEmployeeItem"
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
  getEmployeeItem,
  putEmployeeItem,
  postEmployeeItem,
  deleteEmployeeItem,
  getDepartmentDropdown,
  getMarriage,
  getMilitaryService,
  getIndigenous,
  getRoleSelectNoList,
  getWorkShift,
  putEmployeeUploadImage,
} from 'api'
import { QInputProps, QSelectProps } from 'utils/quasar-extends/base-props.js'
import { validate } from 'utils/quasar-extends/validate.js'
import { useRequired } from 'utils/rules.js'
import setSearchQuery from 'utils/setSearchQuery'
import { cloneDeep, pick } from 'lodash-es'
import {
  genderCodeItems,
  bloodTypeItems,
  activeStatusNumberItems,
  yesOrNoItems,
  withOrWithoutItems,
} from 'utils/options.js'
import { QTableProps } from 'src/utils/quasar-extends/base-props'

const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  editType: String,
  id: [String, Number],
})

const editHeader = computed(() => {
  switch (props.editType) {
    case 'add':
      return `新增員工`
    case 'edit':
      return `編輯員工`
    case 'delete':
      return `刪除員工`
    default:
      return null
  }
})

const editItem = reactive({
  AccountNo: null, //員工員工
  PersonId: null,
  Status: null,
  Image: null,
  Mobile: null, //行動電話(1)
  MobileNow: null, //行動電話(2)
  DepartmentNo: null, //所屬部門
  EmployeeDuty: null, //職稱
  WorkShift: null, //可配合班別
  BloodType: null, //血型
  Marriage: null, //婚姻狀況
  Children: null, //子女數
  MilitaryService: null, //兵役狀況
  Telphone: null, //戶籍電話
  Indigenous: null, //是否為原住民
  IndigenousType: null, //原住民族群
  Handicap: null, //領有殘障手冊
  HandicapLevel: null, //殘障級別
  TelphoneNow: null, //現址電話
  Address: null, //戶籍地址
  AddressNow: null, //現居地址
  EmergencyContact: null, //緊急聯繫人
  ContactRelationship: null, //與緊急聯繫人關係
  ContactTelphone: null, //緊急聯繫人電話
  AccountNo: null, //員工員工
  IdentificationCode: null, //識別證號
  EmploymentDay: null, //報到日
  LayoffDay: null, //離職日
  Person: {
    PersonId: null,
    Name: null, //中文姓名
    EName: null, //英文姓名
    PersonId: null, //身分證號
    BirthDate: null, //生日
    GenderCode: null, //性別
    Email: null, //電子郵件
    Nationality: null, //國籍
  },
  EmployeeEducations: [],
  EmployeeCertificates: [],
})

const initData = {}
initData.EmployeeEducations = {
  PersonId: null, //身分證號
  EducationLevel: null, //教育程度
  SchoolName: null, //學校名稱
  Major: null, //學校主修
  Status: null, //就學狀態
}

initData.EmployeeCertificates = {
  PersonId: null, //身分證號
  CertificateType: null, //證照類型
  CertificateNo: null, //證書字號
  ExpireDate: null, //證書過期日期
}

const employeeEducationsColumns = computed(() => {
  const arr = [
    { name: 'EducationLevel', label: '教育程度', field: 'EducationLevel', align: 'left' },
    { name: 'SchoolName', label: '學校名稱', field: 'SchoolName', align: 'left' },
    { name: 'Major', label: '主修', field: 'Major', align: 'left' },
    { name: 'Status', label: '就學狀態', field: 'Status', align: 'left' },
  ]

  if (props.editType !== 'delete') {
    arr.push({ name: 'action', label: '操作', field: 'action', align: 'center' })
  }

  return arr
})

const employeeCertificatesColumns = computed(() => {
  const arr = [
    { name: 'CertificateType', label: '證照類型', field: 'CertificateType', align: 'left' },
    { name: 'DepartmentName', label: '專科名', field: 'DepartmentName', align: 'left' },
    { name: 'CertificateNo', label: '證書字號', field: 'CertificateNo', align: 'left' },
    { name: 'ExpireDate', label: '證書日期', field: 'ExpireDate', align: 'left' },
  ]

  if (props.editType !== 'delete') {
    arr.push({ name: 'action', label: '操作', field: 'action', align: 'center' })
  }

  return arr
})

const getDataLoading = ref(false)
const GetEmployeeItem = async () => {
  try {
    getDataLoading.value = true
    const res = await getEmployeeItem(props.id)
    Object.assign(editItem, res.data)
  } catch (err) {
    console.log(err)
  } finally {
    getDataLoading.value = false
  }
}

const inputRefs = reactive({})
const rules = {
  AccountNo: useRequired({ title: '員工帳號', type: 'input' }),
  PersonId: useRequired({ title: '身分證號', type: 'input' }),
  Status: useRequired({ title: '狀態', type: 'input' }),
  Name: useRequired({ title: '中文姓名', type: 'input' }),
  DepartmentNo: useRequired({ title: '隸屬科別', type: 'input' }),
  EmployeeDuty: useRequired({ title: '職稱', type: 'input' }),
}

const onSaveClick = async () => {
  editLoading.value = true

  const { result, errorInputRef } = validate(inputRefs)

  if (result === false) {
    errorInputRef.focus()
    editLoading.value = false
    return
  }

  const tasks = []

  if (imageFile.value) {
    tasks.push(PutEmployeeUploadImage())
  }

  switch (props.editType) {
    case 'add':
      tasks.push(PostEmployeeItem(editItem))
      break
    case 'edit':
      tasks.push(PutEmployeeItem(editItem))
      break
  }

  const res = await Promise.all(tasks)

  if (!res.find(({ error }) => error)) {
    onDialogOK()
  }

  editLoading.value = false
}

const editLoading = ref(false)
const PostEmployeeItem = async (editItem) => {
  const addPersonIdToTable = cloneDeep(editItem)
  addPersonIdToTable.EmployeeCertificates.forEach((item, index, arr) => {
    arr[index].PersonId = editItem.PersonId
    return item
  })
  addPersonIdToTable.EmployeeEducations.forEach((item, index, arr) => {
    arr[index].PersonId = editItem.PersonId
    return item
  })
  try {
    editLoading.value = true
    const res = await postEmployeeItem(addPersonIdToTable)
    $q.notify({
      type: 'positive',
      message: '新增帳號成功',
      position: 'top',
    })
    return res
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '新增帳號失敗：' + typeof error.data === 'string' ? error.data : JSON.stringify(error.data),
      position: 'top',
    })
    if (error.data.includes('duplicate key row')) {
      alert('此帳號名稱被使用過')
    } else if (error.data.includes('employee_account')) {
      alert('員工身分證重複')
    } else if (error.data.includes('Person.PersonId')) {
      alert('和病患身分證重複')
    }
    return { error }
  }
}

const PutEmployeeItem = async (editItem) => {
  const addPersonIdToTable = cloneDeep(editItem)
  addPersonIdToTable.EmployeeCertificates.forEach((item, index, arr) => {
    arr[index].PersonId = editItem.PersonId
    return item
  })
  addPersonIdToTable.EmployeeEducations.forEach((item, index, arr) => {
    arr[index].PersonId = editItem.PersonId
    return item
  })
  try {
    editLoading.value = true
    const res = await putEmployeeItem(addPersonIdToTable)
    $q.notify({
      type: 'positive',
      message: '編輯帳號成功',
      position: 'top',
    })
    return res
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '編輯帳號失敗：' + typeof error.data === 'string' ? error.data : JSON.stringify(error.data),
      position: 'top',
    })
    return { error }
  }
}

const DeleteEmployeeItem = async () => {
  try {
    editLoading.value = true
    const res = await deleteEmployeeItem(props.id)
    $q.notify({
      type: 'positive',
      message: '刪除帳號成功',
      position: 'top',
    })
    onDialogOK()
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '刪除帳號失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const PutEmployeeUploadImage = async () => {
  try {
    const form = new FormData()
    form.append('PersonId', editItem.Person.PersonId)
    form.append('File', imageFile.value)
    const res = await putEmployeeUploadImage(form)
    $q.notify({
      type: 'positive',
      message: '圖片上傳成功',
      position: 'top',
    })
    return res
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '圖片上傳失敗：' + (typeof error.data === 'string' ? error.data : JSON.stringify(error.data)),
      position: 'top',
    })
    return { error }
  }
}

const dataImage = ref()
const imageFile = ref()
const imageSrc = computed(() => {
  if (dataImage.value) return dataImage.value
  else {
    const path = (editItem.Image || '') + '?time=' + new Date().getTime()
    if (process.env.DEV) {
      return $setting.apiHost + '/his' + path
    } else {
      return $setting.apiHost + path
    }
  }
})

const imageUpload = () => {
  const uploader = document.createElement('input')
  uploader.setAttribute('type', 'file')
  uploader.setAttribute('accept', 'image/*')
  uploader.setAttribute('multiple', 'true')
  uploader.onchange = async (evt) => {
    const file = evt.target.files[0]

    if (file === undefined) {
      // 取消，沒有上傳
      return
    } else {
      const secondFilename = /(.+)\.(jpg|jpeg|png)/i
      if (!secondFilename.test(file.name)) {
        const dialog = $q.dialog({
          message: '請上傳正確的圖片類型，圖片副檔名必須為 jpg | jpeg | png | bmp | gif',
          type: 'negative',
          ok: {
            label: '確定',
            color: 'primary',
            unelevated: true,
          },
        })
      } else {
        const fr = new FileReader()
        fr.addEventListener('load', (evt) => {
          dataImage.value = evt.target.result
          imageFile.value = file
        })
        fr.readAsDataURL(file)
      }
    }
  }
  uploader.click()
}

const departmentItems = ref([])
const GetDepartmentDropdown = async () => {
  try {
    const query = setSearchQuery({ layer: 2 })
    const res = await getDepartmentDropdown(query)
    departmentItems.value = res.data.Items
  } catch (error) {
    console.log(error)
  }
}

const roleItems = ref([])
const GetRoleSelectNoList = async () => {
  try {
    const query = setSearchQuery({ type: 2 })
    const res = await getRoleSelectNoList(query)
    roleItems.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const workShiftItems = ref([])
const GetWorkShift = async () => {
  try {
    const res = await getWorkShift()
    workShiftItems.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const marriageStatusItems = ref([])
const GetMarriage = async () => {
  try {
    const res = await getMarriage()
    marriageStatusItems.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const militaryServiceItems = ref([])
const GetMilitaryService = async () => {
  try {
    const res = await getMilitaryService()
    militaryServiceItems.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const indigenousItems = ref([])
const GetIndigenous = async () => {
  try {
    const res = await getIndigenous()
    indigenousItems.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const handicapLevelItems = [
  { label: '1.輕度', value: 1 },
  { label: '2 中度', value: 2 },
  { label: '3 重度', value: 3 },
  { label: '4 極重度', value: 4 },
]

const educationLevelItems = ['博士', '碩士', '大學', '專科', '高中職']

const educationStatusItems = ['畢業', '肄業', '進修中']

const certificateTypeItems = ['證書', '執照']

const init = () => {
  if (props.id) GetEmployeeItem()
  GetDepartmentDropdown()
  GetRoleSelectNoList()
  GetWorkShift()
  GetMarriage()
  GetMilitaryService()
  GetIndigenous()
}
init()
</script>

