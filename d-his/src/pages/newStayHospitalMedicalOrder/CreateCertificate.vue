<template>
  <div class="text-lg font-bold text-[#0A2548] grid gap-2 m-5 p-3 border border-black">
    <div class="text-center">
      XX醫院
      <br />
      乙種診斷證明書
    </div>
    <my-input-group class="grid gap-2 grid-cols-5">
      <my-input-wrapper label="診斷文號" class="col-start-5">
        <q-input v-bind="QInputProps" v-model="report.OpdId" readonly></q-input>
      </my-input-wrapper>
      <my-input-wrapper label="病歷號碼">
        <q-input v-bind="QInputProps" v-model="report.PatientId" readonly></q-input>
      </my-input-wrapper>
      <my-input-wrapper label="姓名">
        <q-input v-bind="QInputProps" v-model="report.Patient.Person.Name" readonly></q-input>
      </my-input-wrapper>
      <my-input-wrapper label="性別">
        <q-input v-bind="QInputProps" v-model="report.Gender" readonly></q-input>
      </my-input-wrapper>
      <my-input-wrapper label="生日">
        <q-input v-bind="QInputProps" v-model="report.Patient.Person.BirthDate" readonly></q-input>
      </my-input-wrapper>
      <my-input-wrapper label="年齡">
        <q-input v-bind="QInputProps" v-model="report.Patient.Person.Age" readonly></q-input>
      </my-input-wrapper>
    </my-input-group>
    <div class="grid gap-2 grid-cols-10">
      <my-input-wrapper label="身分證字號" class="col-span-2">
        <q-input v-bind="QInputProps" v-model="report.Patient.Person.PersonId" readonly></q-input>
      </my-input-wrapper>
      <my-input-wrapper label="軍人補給證兵籍號碼" class="col-span-3">
        <q-input v-bind="QInputProps" v-model="report.SoldierCode" readonly></q-input>
      </my-input-wrapper>
    </div>
    <my-input-group class="grid gap-2 grid-cols-1">
      <my-input-wrapper label="病名">
        <q-input v-bind="QInputProps" v-model="report.OpdDiagnosisIcd10Name" readonly></q-input>
      </my-input-wrapper>
      <my-input-wrapper label="醫師囑言">
        <q-input v-bind="QInputProps" v-model="report.CertificateNote"></q-input>
      </my-input-wrapper>
    </my-input-group>
    <my-input-group class="grid gap-2 grid-cols-5">
      <my-input-wrapper label="開立日期">
        <q-input v-bind="QInputProps" v-model="report.CreateDatetime" readonly></q-input>
      </my-input-wrapper>
      <my-input-wrapper label="主治醫師">
        <q-input v-bind="QInputProps" v-model="report.AttendingDocName" readonly></q-input>
      </my-input-wrapper>
      <my-input-wrapper label="科別">
        <q-input v-bind="QInputProps" v-model="report.DepartmentName" readonly></q-input>
      </my-input-wrapper>
      <my-input-wrapper label="開單醫師">
        <q-input v-bind="QInputProps" v-model="report.writeDoctor" readonly></q-input>
      </my-input-wrapper>
      <my-input-wrapper label="醫師證號">
        <q-input v-bind="QInputProps" v-model="report.AttendingDocId" readonly></q-input>
      </my-input-wrapper>
    </my-input-group>
    <div class="flex justify-between">
      <div class="flex flex-col justify-between pl-2">
        <div>
          以上病人經本院醫師診斷屬實特予證明 <br />
          院長(負責醫師)：
        </div>
        <span> 注意：本證明書如無本院印章、國民身分證統一編號（軍人補給證兵籍號碼）則認為無效。YYYY/MM/DD </span>
      </div>
      <div class="w-[280px] h-[160px] text-center border border-blue-500">(無醫院印信者，無效)</div>
    </div>
  </div>
  <div class="flex justify-end m-3 mx-8 gap-2">
    <q-btn label="儲存並列印" color="green-6"></q-btn>
    <q-btn label="儲存" color="primary"></q-btn>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { QTableProps, QInputProps, QSelectProps } from 'utils/quasar-extends/base-props.js'
import { useIpdStore } from 'stores/ipd'
import { cloneDeep } from 'lodash-es'
import dayjs from 'dayjs'

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()
const $q = useQuasar()
const ipdStore = useIpdStore()

const report = ref({
  OpdId: '',
  PatientId: '',
  Patient: {
    Person: {
      PersonId: '',
      BirthDate: '',
      Name: '',
      Age: '',
    },
  },
  Gender: '',
  SoldierCode: '',
  OpdDiagnosisIcd10Name: '',
  CertificateNote: '',
  CreateDatetime: '',
  DepartmentName: '',
  AttendingDocName: '',
})

watch(
  ipdStore,
  () => {
    const keys = Object.keys(report.value)
    for (let index = 0; index < keys.length; index++) {
      report.value[keys[index]] = ipdStore.ipdData[keys[index]]
    }
    const birthDate = dayjs(ipdStore.ipdData.Patient.Person.BirthDate)
    const today = dayjs()
    const diffInDays = today.diff(birthDate, 'year')
    report.value.Patient.Person.Age = diffInDays
  },
  { immediate: true }
)

const init = () => {}
init()
</script>

<style lang="scss" scoped></style>

