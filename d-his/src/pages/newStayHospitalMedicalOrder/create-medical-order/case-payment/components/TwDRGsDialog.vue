<template>
  <q-dialog ref="dialogRef" full-width no-backdrop-dismiss>
    <my-dialog-content header="編修醫囑" @close="onDialogCancel">
      <TwDRGs
      :DclDepartmentNo="'05'"
        :procedureId="procedureId"
        v-model:twDRGsIcdTable="twDRGsIcdTable"
        v-model:twDRGsPcsTable="twDRGsPcsTable"
      >
        <template #bottom>
          <div class="flex justify-end mt-2">
            <q-btn class="bg-pink-10 text-white mx-2" @click="PutIpdPieceProcedure" v-if="readonly !== true"
              >完成醫囑</q-btn
            >
          </div>
        </template>
      </TwDRGs>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, computed, watchEffect, provide, onMounted } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { QInputProps, QSelectProps } from 'utils/quasar-extends/base-props.js'
import { getIpdPieceProcedureItem, putIpdPieceProcedure } from 'api'
import setSearchQuery from 'src/utils/setSearchQuery'
import { useRoute } from 'vue-router'
import { cloneDeep } from 'lodash-es'

import TwDRGs from 'components/tw-drgs/TwDRGs.vue'

const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()
const route = useRoute()
const props = defineProps({
  procedureId: Number,
  readonly: Boolean,
  DclDepartmentNo: String,
})
// 預編輯物件資料
const pieceProcedureItem = ref(null)

const twDRGsIcdTable = ref([])
const twDRGsPcsTable = ref([])

const GetIpdPieceProcedureItem = async () => {
  try {
    const query = setSearchQuery({ ipdId: route.params.Id || props.routeIpdId, procedureId: props.procedureId })
    const res = await getIpdPieceProcedureItem(query) //0016070
    if (res.status === 200) {
      pieceProcedureItem.value = cloneDeep(res.data)
      twDRGsIcdTable.value = cloneDeep(res.data.DiagnosisItems)
      twDRGsPcsTable.value = cloneDeep(res.data.Icd10PcsItems)
    }
  } catch (err) {
    console.log(err)
  }
}

const PutIpdPieceProcedure = async () => {
  console.log('test', twDRGsIcdTable.value)
  const newPieceProcedureData = cloneDeep(pieceProcedureItem.value)
  newPieceProcedureData.DiagnosisItems = twDRGsIcdTable.value
  newPieceProcedureData.Icd10PcsItems = twDRGsPcsTable.value
  delete newPieceProcedureData.IpdPieceProcedureSteps
  try {
    const res = await putIpdPieceProcedure(newPieceProcedureData) //0016070
    if (res.status === 200) {
      $q.notify({
        type: 'positive',
        message: '修改病例計酬醫囑成功',
        position: 'top',
      })
      onDialogOK()
    }
  } catch (err) {
    console.log(err)
  }
}

const init = () => {
  if (props.procedureId) GetIpdPieceProcedureItem()
}
init()
</script>

