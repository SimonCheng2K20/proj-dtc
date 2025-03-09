<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss full-width>
    <my-dialog-content header="開立診斷證明書" width="1280px" @close="onDialogCancel">
      <certificate ref="certificateRef"></certificate>
      <template #actions>
        <q-btn color="grey-7" label="取消" @click="onDialogCancel"></q-btn>
        <q-btn
          color="green-6"
          label="儲存並列印"
          @click="saveCertificateAndPrint"
          :loading="certificateLoading"
        ></q-btn>
        <q-btn color="primary" label="儲存" @click="saveCertificate" :loading="certificateLoading"></q-btn>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>
<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { postCertificate, putCertificate, getCertificatePDF } from 'api'
import { QTableProps, QInputProps, QSelectProps } from 'utils/quasar-extends/base-props.js'
import { useOpdStore } from 'stores/opd.js'

import certificate from './certificate.vue'

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()
const $q = useQuasar()
const opdStore = useOpdStore()

const certificateRef = ref()
const PostCertificate = async () => {
  try {
    certificateLoading.value = true
    const body = {
      OpdId: opdStore.opdData.OpdId,
      DiagnosisNo: opdStore.opdData.OpdDiagnoses[0]?.Icd10Code || null,
      PatientId: opdStore.opdData.PatientId,
      PatientName: opdStore.opdData.PersonName,
      GenderCode: opdStore.opdData.Gender,
      BirthDate: opdStore.opdData.BirthDate,
      Visit1stDate: opdStore.opdData.CreateDatetime,
      Age: opdStore.opdData.Age,
      DoctorName: opdStore.opdData.SignedDocName,
      DepartmentName: opdStore.opdData.DepartmentName,
      Identity: opdStore.opdData.Idetifier,
      Allergy: opdStore.opdData.Allergy,
      Address: opdStore.opdData.RoomBooking.Patient.Person.Address
        ? opdStore.opdData.RoomBooking.Patient.Person.Address.replace(/＞|＜/g, '')
        : '',
      Icd10Name: opdStore.opdData.OpdDiagnoses[0]?.Icd10Cht || null,
      Advice: certificateRef.value.getAdvice(),
      OpdTooth: opdStore.opdData.OpdTooth,
    }

    const res = await postCertificate(body)
    if (res.status === 204) {
      $q.notify({
        type: 'positive',

        message: '儲存成功',
        position: 'top',
      })
      onDialogOK()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',

      message: `錯誤:${err.status}`,
      position: 'top',
    })
  } finally {
    certificateLoading.value = false
  }
}

const PutCertificate = async () => {
  try {
    certificateLoading.value = true
    const body = {
      OpdId: opdStore.opdData.OpdId,
      DiagnosisNo: opdStore.opdData.OpdDiagnoses[0]?.Icd10Code || null,
      PatientId: opdStore.opdData.PatientId,
      PatientName: opdStore.opdData.PersonName,
      GenderCode: opdStore.opdData.Gender,
      BirthDate: opdStore.opdData.BirthDate,
      Visit1stDate: opdStore.opdData.CreateDatetime,
      Age: opdStore.opdData.Age,
      DoctorName: opdStore.opdData.SignedDocName,
      DepartmentName: opdStore.opdData.DepartmentName,
      Identity: opdStore.opdData.Idetifier,
      Allergy: opdStore.opdData.Allergy,
      Address: opdStore.opdData.RoomBooking.Patient.Person.Address
        ? opdStore.opdData.RoomBooking.Patient.Person.Address.replace(/＞|＜/g, '')
        : '',
      Icd10Name: opdStore.opdData.OpdDiagnoses[0]?.Icd10Cht || null,
      Advice: certificateRef.value.getAdvice(),
      OpdTooth: opdStore.opdData.OpdTooth,
    }

    const res = await putCertificate(body)
    $q.notify({
      type: 'positive',
      message: '儲存成功',
      position: 'top',
    })
    onDialogOK()
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',

      message: `錯誤:${err.status}`,
      position: 'top',
    })
  } finally {
    certificateLoading.value = false
  }
}

const GetCertificatePDF = async () => {
  try {
    certificateLoading.value = true
    const res = await getCertificatePDF(opdStore.opdData.OpdId)
    if (res.status === 200) {
      const a = document.createElement('a')
      a.setAttribute('href', res.data)
      a.setAttribute('target', '_blank')
      a.click()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',

      message: `${err.status}: ${err.data.toString()}`,
      position: 'top',
    })
  } finally {
    certificateLoading.value = false
  }
}

const certificateLoading = ref(false)

const saveCertificateAndPrint = async () => {
  if (certificateRef.value.getIs404()) await PostCertificate()
  else await PutCertificate()
  GetCertificatePDF()
}

const saveCertificate = () => {
  if (certificateRef.value.getIs404()) PostCertificate()
  else PutCertificate()
}
</script>

