<template>
  <div class="my-2 mr-2 flex justify-end">
    <q-btn label="回上頁" color="info" unelevated dense @click="router.push({ name: 'NursingStation-Clerk' })"></q-btn>
    <q-btn class="ml-2" label="確定儲存" color="primary" unelevated dense @click="test"></q-btn>
  </div>
  <div class="mr-2 grid grid-cols-4 gap-2">
    <div class="col-span-2 grid gap-2">
      <q-card class="w-full">
        <q-card-section>
          <my-input-group class="grid grid-cols-2 gap-2">
            <my-input-wrapper label="病歷號碼">
              <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.PatientId" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="身份證號">
              <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.Patient.PersonId" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="住院號碼">
              <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.IpdId" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="是否隔離">
              <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.IsIsolate" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="姓名">
              <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.Patient.Person.Name" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="生日">
              <my-date-input v-bind="QInputProps" v-model="ipdStore.ipdData.Patient.Person.BirthDate" readonly />
            </my-input-wrapper>
            <my-input-wrapper label="性別">
              <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.Gender" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="連絡電話">
              <q-input v-bind="QInputProps" readonly v-model="ipdStore.ipdData.Patient.Person.Phone"></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="地址" class="col-span-full">
              <q-input v-bind="QInputProps" readonly v-model="ipdStore.ipdData.Patient.Person.Address"></q-input>
            </my-input-wrapper>

            <div class="col-span-full grid grid-cols-3 gap-2">
              <my-input-wrapper label="聯絡人一">
                <q-input v-bind="QInputProps" readonly v-model="ipdStore.ipdData.Contact1"></q-input>
              </my-input-wrapper>
              <my-input-wrapper label="關係">
                <q-input v-bind="QInputProps" readonly v-model="ipdStore.ipdData.Relationship1"></q-input>
              </my-input-wrapper>
              <my-input-wrapper label="連絡電話">
                <q-input v-bind="QInputProps" readonly v-model="ipdStore.ipdData.Telphone1"></q-input>
              </my-input-wrapper>
              <my-input-wrapper label="聯絡人二">
                <q-input v-bind="QInputProps" readonly v-model="ipdStore.ipdData.Contact2"></q-input>
              </my-input-wrapper>
              <my-input-wrapper label="關係">
                <q-input v-bind="QInputProps" readonly v-model="ipdStore.ipdData.Relationship2"></q-input>
              </my-input-wrapper>
              <my-input-wrapper label="連絡電話">
                <q-input v-bind="QInputProps" readonly v-model="ipdStore.ipdData.Telphone2"></q-input>
              </my-input-wrapper>
              <template>
                <my-input-wrapper label="重大傷病卡號">
                  <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.重大傷病卡號"></q-input>
                </my-input-wrapper>
                <my-input-wrapper label="重大傷病卡號起日">
                  <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.重大傷病卡號起日"></q-input>
                </my-input-wrapper>
                <my-input-wrapper label="重大傷病卡號迄日">
                  <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.重大傷病卡號迄日"></q-input>
                </my-input-wrapper>
              </template>
            </div>
          </my-input-group>
        </q-card-section>
      </q-card>

      <q-card>
        <q-card-section>
          <my-input-group class="grid grid-cols-3 gap-2">
            <my-input-wrapper label="主治醫師">
              <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.AttendingDocName" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="住院醫師">
              <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.AttendingDocName" readonly></q-input>
            </my-input-wrapper>
            <my-input-wrapper label="科別">
              <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.DepartmentName" readonly></q-input>
            </my-input-wrapper>
          </my-input-group>
        </q-card-section>
      </q-card>
    </div>

    <q-card>
      <q-card-section>
        <my-input-group class="grid gap-2">
          <my-input-wrapper label="入院日期">
            <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.IpdDate" readonly></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="住院身分">
            <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.IdentityName" readonly></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="折扣身分">
            <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.IdentityDiscountName" readonly></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="部分負擔">
            <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.PartialAfford" readonly></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="給付類別">
            <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.PayTypeName" readonly></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="健保卡序">
            <q-input v-bind="QInputProps" readonly></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="交通事故">
            <q-input
              v-bind="QInputProps"
              :model-value="ipdStore.ipdData.TrafficeAccidentFlag ? '是' : '否'"
              readonly
            ></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="病患來源">
            <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.SourceName" readonly></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="註記">
            <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.Note" readonly></q-input>
          </my-input-wrapper>
        </my-input-group>
      </q-card-section>
    </q-card>

    <q-card>
      <q-card-section>
        <my-input-group class="grid gap-2">
          <my-input-wrapper label="護理站名稱">
            <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.HospitalBed.Bed" readonly></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="床位樓層">
            <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.HospitalBed.Floor" readonly></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="房號">
            <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.HospitalBed.Room" readonly></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="床位號碼">
            <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.HospitalBed.Bed" readonly></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="床位等級">
            <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.HospitalBed.BedLevelName" readonly></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="差額床">
            <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.HospitalBed.MakeUpPrice" readonly></q-input>
          </my-input-wrapper>
        </my-input-group>
        <my-input-group class="mt-2 grid gap-2" v-if="ipdStore.ipdData.HospitalBed.HbedType">
          <my-input-wrapper label="床位類別">
            <q-select
              v-bind="QSelectProps"
              v-model="ipdStore.ipdData.HospitalBed.BedType"
              :options="bedTypeDropdown"
              option-label="Name"
              option-value="No"
              emit-value
              map-options
            ></q-select>
          </my-input-wrapper>
          <my-input-wrapper label="病房費">
            <q-input
              v-bind="QInputProps"
              v-model="ipdStore.ipdData.HospitalBed.HbedType.HbedTypeNhiPoint"
              readonly
            ></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="支付代碼">
            <q-input
              v-bind="QInputProps"
              v-model="ipdStore.ipdData.HospitalBed.HbedType.HbedTypeNhiCode"
              readonly
            ></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="護理費(1天)點數">
            <q-input
              v-bind="QInputProps"
              v-model="ipdStore.ipdData.HospitalBed.HbedType.NursingOneDayNhiPoint"
              readonly
            ></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="護理費(1天)支付代碼">
            <q-input
              v-bind="QInputProps"
              v-model="ipdStore.ipdData.HospitalBed.HbedType.NursingOneDayNhiCode"
              readonly
            ></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="護理費(2天)點數">
            <q-input
              v-bind="QInputProps"
              v-model="ipdStore.ipdData.HospitalBed.HbedType.NursingAfterTwoDayNhiPoint"
              readonly
            ></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="護理費(2天)支付代碼">
            <q-input
              v-bind="QInputProps"
              v-model="ipdStore.ipdData.HospitalBed.HbedType.NursingAfterTwoDayNhiCode"
              readonly
            ></q-input>
          </my-input-wrapper>
        </my-input-group>
      </q-card-section>
    </q-card>

    <q-card class="col-span-2">
      <q-card-section>
        <my-input-group class="grid gap-2">
          <my-input-wrapper label="入院主診斷">
            <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.OpdDiagnosisIcd10" readonly></q-input>
            <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.OpdDiagnosisIcd10Name" readonly />
          </my-input-wrapper>
          <my-input-wrapper label="入院主診斷1">
            <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.OpdDiagnosisIcd101" readonly></q-input>
            <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.OpdDiagnosisIcd101Name" readonly />
          </my-input-wrapper>
          <my-input-wrapper label="入院主診斷2">
            <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.OpdDiagnosisIcd102" readonly></q-input>
            <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.OpdDiagnosisIcd102Name" readonly />
          </my-input-wrapper>
          <my-input-wrapper label="入院主診斷3">
            <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.OpdDiagnosisIcd103" readonly></q-input>
            <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.OpdDiagnosisIcd103Name" readonly />
          </my-input-wrapper>
          <my-input-wrapper label="入院主診斷4">
            <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.OpdDiagnosisIcd104" readonly></q-input>
            <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.OpdDiagnosisIcd104Name" readonly />
          </my-input-wrapper>
        </my-input-group>
      </q-card-section>
    </q-card>

    <q-card class="col-span-2">
      <q-card-section>
        <my-input-group class="grid gap-2">
          <my-input-wrapper label="住院主診斷">
            <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.OpdDiagnosisIcd10" readonly></q-input>
            <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.OpdDiagnosisIcd10Name" readonly />
          </my-input-wrapper>
          <my-input-wrapper label="住院主診斷1">
            <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.OpdDiagnosisIcd101" readonly></q-input>
            <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.OpdDiagnosisIcd101Name" readonly />
          </my-input-wrapper>
          <my-input-wrapper label="住院主診斷2">
            <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.OpdDiagnosisIcd102" readonly></q-input>
            <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.OpdDiagnosisIcd102Name" readonly />
          </my-input-wrapper>
          <my-input-wrapper label="住院主診斷3">
            <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.OpdDiagnosisIcd103" readonly></q-input>
            <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.OpdDiagnosisIcd103Name" readonly />
          </my-input-wrapper>
          <my-input-wrapper label="住院主診斷4">
            <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.OpdDiagnosisIcd104" readonly></q-input>
            <q-input v-bind="QInputProps" v-model="ipdStore.ipdData.OpdDiagnosisIcd104Name" readonly />
          </my-input-wrapper>
        </my-input-group>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import { QInputProps, QSelectProps } from 'utils/quasar-extends/base-props.js'
import { useIpdStore } from 'stores/ipd'
import { useRoute, useRouter } from 'vue-router'
import { getHbedType, getIpdRecordItem, putIpdRecordItem } from 'api'
import { cloneDeep } from 'lodash'

const ipdStore = useIpdStore()
const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const bedTypeDropdown = ref()
const GetHbedType = async () => {
  try {
    const res = await getHbedType()
    if (res.status === 200) {
      bedTypeDropdown.value = res.data
    }
  } catch (error) {
    console.log(error)
  }
}

const GetIpdRecordItem = async () => {
  try {
    const res = await getIpdRecordItem(route.params.ipdId)
    if (res.status === 200) {
      ipdStore.setIpdData(res.data)
    }
  } catch (err) {
    console.log(err)
  }
}
const PutIpdRecord = async () => {
  const body = cloneDeep(ipdStore.ipdData)
  try {
    const res = await putIpdRecordItem(body)
    if (res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '更改病床類別成功!',
        position: 'top',
      })
    }
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '更改病床類別失敗!',
      position: 'top',
    })
  }
}
const test = async () => {
  await PutIpdRecord()
  GetIpdRecordItem()
}

const init = () => {
  GetHbedType()
}
init()
</script>

