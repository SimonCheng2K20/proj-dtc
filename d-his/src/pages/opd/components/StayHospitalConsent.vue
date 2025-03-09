<template>
  <q-dialog ref="dialogRef" full-width full-height no-backdrop-dismiss>
    <my-dialog-content header="住院同意書" width="1280px" height="90%" @close="onDialogCancel" :loading="getDataLoading">
      <iframe ref="printRef" :src="pdfSrc" frameborder="0" class="w-full h-screen"></iframe>

      <template #actions>
        <q-btn unelevated color="grey" label="取消" @click="onDialogCancel" />
        <q-btn unelevated color="primary" label="列印" @click="onPrintClick" />
      </template>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { getIpdRecordConsentPdf } from 'api'
import { nextTick, ref } from 'vue'
import { useDialogPluginComponent } from 'quasar'

const printRef = ref()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  IpdId: String,
  // {
  //   AttendingDoc: null,
  //   AttendingDocId: null,
  //   BedIdNo: null,
  //   DepartmentId: null,
  //   DepartmentName: null,
  //   IpdId: null,
  //   IpdPreDate: null,
  //   PatientId: null,
  // },
})

const getDataLoading = ref(false)
const pdfSrc = ref(null)
const GetIpdRecordConsentPdf = async () => {
  try {
    getDataLoading.value = true
    const res = await getIpdRecordConsentPdf(props.IpdId)
    if (res.status === 200) {
      pdfSrc.value = res.data
    }
  } catch (err) {
    console.log(err)
  } finally {
    getDataLoading.value = false
  }
}

const printLoading = ref(false)
const onPrintClick = async () => {
  printLoading.value = true
  printRef.value.contentWindow.print()
}

const init = () => {
  if (!!props.IpdId) GetIpdRecordConsentPdf()
}
init()
</script>

