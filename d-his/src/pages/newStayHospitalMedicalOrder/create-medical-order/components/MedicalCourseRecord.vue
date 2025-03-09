<template>
  <!-- 病程紀錄 -->
  <div>
    <ProgressTable
      :rows="progressNoteTableData"
      :columns="columns"
      :loading="loadingMedicalCourseRecord"
      @refreshTable="refreshTable"
    ></ProgressTable>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watchEffect, provide } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { getIpdProgressNote } from 'api'
import { QTableProps, QInputProps, QSelectProps } from 'utils/quasar-extends/base-props.js'
import { useRoute } from 'vue-router'
import setSearchQuery from 'utils/setSearchQuery.js'

import ProgressTable from 'components/opd/ProgressTable.vue'

const $q = useQuasar()
const route = useRoute()

// 預編輯物件資料
const progressNoteTableData = ref([])

const columns = ['action', 'ProgressNoteDate', 'PomrDescription', 'AttendingDocName', 'WritingDocName']

const loadingMedicalCourseRecord = ref(false)
const GetIpdProgressNote = async () => {
  loadingMedicalCourseRecord.value = true
  const query = setSearchQuery({ $filter: `IpdId eq '${route.params.Id}'` })
  try {
    const res = await getIpdProgressNote(query)
    if (res.status === 200) {
      progressNoteTableData.value = res.data.Items
    }
  } catch (error) {
    console.log(error)
  } finally {
    loadingMedicalCourseRecord.value = false
  }
}
const refreshTable = () => {
  GetIpdProgressNote()
}

const init = () => {
  GetIpdProgressNote()
}
init()
</script>

