<template>
  <q-page class="p-2">
    <my-title>
      機構設定
      <q-space></q-space>
      <q-btn class="header-btn" label="儲存設定" dense unelevated @click="PutOrganization"></q-btn>
    </my-title>

    <q-card class="bg-gray-100" flat>
      <q-card-section>
        <div class="font-bold">機構設定</div>
        <my-input-group class="grid gap-2 grid-cols-4">
          <my-input-wrapper label="服務機構代碼" class="col-span-2">
            <q-input v-bind="QInputProps" v-model="organization.Code"></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="院所等級" class="col-span-2">
            <q-select
              v-bind="QSelectProps"
              v-model="organization.LevelId"
              :options="hospitalLevelItems"
              optionLabel="Name"
              optionValue="No"
              emit-value
              map-options
            ></q-select>
          </my-input-wrapper>
          <my-input-wrapper label="機構名稱" class="col-span-2">
            <q-input v-bind="QInputProps" v-model="organization.Name"></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="機構簡稱" class="col-span-2">
            <q-input v-bind="QInputProps" v-model="organization.Abbr"></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="郵遞區號">
            <q-input v-bind="QInputProps" v-model="organization.PostalCode" maxlength="3"></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="機構地址" class="col-span-3">
            <q-input v-bind="QInputProps" v-model="organization.Address"></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="連絡電話" class="col-span-2">
            <q-input v-bind="QInputProps" v-model="organization.Phone"></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="傳真電話" class="col-span-2">
            <q-input v-bind="QInputProps" v-model="organization.Fax"></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="主要科別" class="col-span-full">
            <q-select
              v-bind="QSelectProps"
              v-model="organization.SpecialtyId"
              :options="departmentItems"
              optionLabel="Name"
              optionValue="No"
              emit-value
              map-options
            ></q-select>
          </my-input-wrapper>
          <my-input-wrapper label="調劑方式">
            <q-select
              v-bind="QSelectProps"
              v-model="organization.Formula"
              :options="medTypeItems"
              optionLabel="Name"
              optionValue="No"
              emit-value
              map-options
            ></q-select>
          </my-input-wrapper>
          <my-input-wrapper label="押單金額">
            <q-input v-bind="QInputProps" v-model="organization.NoNhiCardFee" type="number"></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="一般掛號費">
            <q-input v-bind="QInputProps" v-model="organization.Booking_Fee" type="number"></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="急診掛號費">
            <q-input v-bind="QInputProps" v-model="organization.ER_Booking_Fee" type="number"></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="偏遠地區設定">
            <q-select
              v-bind="QSelectProps"
              v-model="organization.RemoteSiteFlag"
              :options="yesOrNoItems"
              optionLabel="label"
              optionValue="value"
              emit-value
              map-options
            ></q-select>
          </my-input-wrapper>
          <my-input-wrapper label="離島地區設定">
            <q-select
              v-bind="QSelectProps"
              v-model="organization.OffshoreIslandsFlag"
              :options="yesOrNoItems"
              optionLabel="label"
              optionValue="value"
              emit-value
              map-options
            ></q-select>
          </my-input-wrapper>
          <my-input-wrapper label="牙科感染SOP">
            <q-select
              v-bind="QSelectProps"
              v-model="organization.DentalInfectionSop"
              :options="conformOrInconformItems"
              optionLabel="label"
              optionValue="value"
              emit-value
              map-options
            ></q-select>
          </my-input-wrapper>

          <my-input-wrapper label="平均護病比加成率">
            <q-input v-bind="QInputProps" v-model="organization.AvgNursingPatientAdditionRate">
              <template #append>
                <div>%</div>
              </template>
            </q-input>
          </my-input-wrapper>
        </my-input-group>
      </q-card-section>
    </q-card>

    <q-card class="bg-gray-100 mt-2" flat>
      <q-card-section>
        <div class="font-bold">Tw-DRG 設定</div>
        <my-input-group class="grid grid-cols-3 gap-2">
          <my-input-wrapper label="標準給付額SPR">
            <q-input v-bind="QInputProps" v-model="organization.StdPaymentRate"></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="基本診療加成率">
            <q-input v-bind="QInputProps" v-model="organization.BasicItemAdditionRate">
              <template #append>
                <div>%</div>
              </template>
            </q-input>
          </my-input-wrapper>
          <my-input-wrapper label="山地離島地區醫院加成率">
            <q-input v-bind="QInputProps" v-model="organization.IslandsDistrictHospitalAdditionRate">
              <template #append>
                <div>%</div>
              </template>
            </q-input>
          </my-input-wrapper>
          <my-input-wrapper label="CMI加成率">
            <q-input v-bind="QInputProps" v-model="organization.CmiAddtionRate">
              <template #append>
                <div>%</div>
              </template>
            </q-input>
          </my-input-wrapper>
          <my-input-wrapper label="實施日">
            <my-date-input v-bind="QInputProps" v-model="organization.ImplementDate"></my-date-input>
          </my-input-wrapper>

          <div class="col-span-full bg-[#deecff] border border-[#1e40af] text-center font-bold p-2">兒童加成率</div>
          <div class="bg-[#deecff] border border-[#1e40af] text-center font-bold p-2">非MDC15內科系加成：</div>
          <div class="bg-[#deecff] border border-[#1e40af] text-center font-bold p-2">非MDC15外科系加成：</div>
          <div class="bg-[#deecff] border border-[#1e40af] text-center font-bold p-2">MDC15加成：</div>
          <my-input-wrapper label="年齡小於6個月者">
            <q-input v-bind="QInputProps" v-model="organization.NonMdc15ImType1AdditionRate">
              <template #append>
                <div>%</div>
              </template>
            </q-input>
          </my-input-wrapper>
          <my-input-wrapper label="年齡小於6個月者">
            <q-input v-bind="QInputProps" v-model="organization.NonMdc15SurgeryType1AdditionRate">
              <template #append>
                <div>%</div>
              </template>
            </q-input>
          </my-input-wrapper>
          <my-input-wrapper label="年齡小於6個月者">
            <q-input v-bind="QInputProps" v-model="organization.Mdc15Type1AdditionRate">
              <template #append>
                <div>%</div>
              </template>
            </q-input>
          </my-input-wrapper>
          <my-input-wrapper label="年齡大於等於6個月，小於2歲者">
            <q-input v-bind="QInputProps" v-model="organization.NonMdc15ImType2AdditionRate">
              <template #append>
                <div>%</div>
              </template>
            </q-input>
          </my-input-wrapper>
          <my-input-wrapper label="年齡大於等於6個月，小於2歲者">
            <q-input v-bind="QInputProps" v-model="organization.NonMdc15SurgeryType2AdditionRate">
              <template #append>
                <div>%</div>
              </template>
            </q-input>
          </my-input-wrapper>
          <my-input-wrapper label="年齡大於等於6個月，小於2歲者">
            <q-input v-bind="QInputProps" v-model="organization.Mdc15Type2AdditionRate">
              <template #append>
                <div>%</div>
              </template>
            </q-input>
          </my-input-wrapper>
          <my-input-wrapper label="年齡大於等於2歲，小於等於6歲者">
            <q-input v-bind="QInputProps" v-model="organization.NonMdc15ImType3AdditionRate">
              <template #append>
                <div>%</div>
              </template>
            </q-input>
          </my-input-wrapper>
          <my-input-wrapper label="年齡大於等於2歲，小於等於6歲者">
            <q-input v-bind="QInputProps" v-model="organization.NonMdc15SurgeryType3AdditionRate">
              <template #append>
                <div>%</div>
              </template>
            </q-input>
          </my-input-wrapper>
          <my-input-wrapper label="年齡大於等於2歲，小於等於6歲者">
            <q-input v-bind="QInputProps" v-model="organization.Mdc15Type3AdditionRate">
              <template #append>
                <div>%</div>
              </template>
            </q-input>
          </my-input-wrapper>
        </my-input-group>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, reactive } from 'vue'
import {
  getOrganization,
  putOrganization,
  getMedTypeDropdown,
  getDepartmentDropdown,
  getHospitalLevelDropdown,
} from 'api'
import { useQuasar } from 'quasar'
import { QInputProps, QSelectProps } from 'utils/quasar-extends/base-props'
import { yesOrNoItems } from 'utils/options.js'
import setSearchQuery from 'utils/setSearchQuery.js'

const $q = useQuasar()
const organization = reactive({
  Code: null,
  LevelId: null,
  Name: null,
  Abbr: null,
  PostalCode: null,
  Address: null,
  Phone: null,
  Fax: null,
  SpecialtyId: null,
  Formula: null,
  Amount: null,
  NoNhiCardFee: null,
  Booking_Fee: null,
  ER_Booking_Fee: null,
  RemoteSiteFlag: null,
  OffshoreIslandsFlag: null,
  DentalInfectionSop: null,
  AvgNursingPatientAdditionRate: null,
  StdPaymentRate: null,
  BasicItemAdditionRate: null,
  CmiAddtionRate: null,
  NonMdc15ImType1AdditionRate: null,
  NonMdc15ImType2AdditionRate: null,
  NonMdc15ImType3AdditionRate: null,
  NonMdc15SurgeryType1AdditionRate: null,
  NonMdc15SurgeryType2AdditionRate: null,
  NonMdc15SurgeryType3AdditionRate: null,
  Mdc15Type1AdditionRate: null,
  Mdc15Type2AdditionRate: null,
  Mdc15Type3AdditionRate: null,
  IslandsDistrictHospitalAdditionRate: null,
  ImplementDate: null,
})

const GetOrganization = async () => {
  try {
    const res = await getOrganization()
    Object.assign(organization, res.data)
  } catch (err) {
    console.log(err)
  }
}

const PutOrganization = async () => {
  try {
    const res = await putOrganization(organization)
    $q.notify({ type: 'positive', message: '修改機構設定成功', position: 'top' })
    GetOrganization()
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '修改機構設定失敗：' + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  }
}

const conformOrInconformItems = [
  { label: '符合', value: true },
  { label: '不符合', value: false },
]

const medTypeItems = ref([])
const GetMedTypeDropdown = async () => {
  try {
    const res = await getMedTypeDropdown()
    medTypeItems.value = res.data
  } catch (error) {
    console.log(error)
  }
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

const hospitalLevelItems = ref([])
const GetHospitalLevelDropdown = async () => {
  try {
    const res = await getHospitalLevelDropdown()
    hospitalLevelItems.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const init = () => {
  GetOrganization()
  GetMedTypeDropdown()
  GetDepartmentDropdown()
  GetHospitalLevelDropdown()
}
init()
</script>

