<template>
  <q-dialog ref="dialogRef" full-width no-backdrop-dismiss>
    <my-dialog-content header="輸入手術耗材" @close="onDialogCancel">
      <span class="text-lg font-bold text-[#0A2548]"> 耗材開立日期: {{ consumablesDate }} </span>
      <ConsumablesTable class="mt-2" v-model:rows="consumablesRows" :columns="consumablesColumns" preset useHotkey />
      <template #actions>
        <q-btn unelevated color="grey" label="取消" @click="onDialogCancel"></q-btn>
        <q-btn class="mr-2" unelevated color="secondary" label="耗材輸入完成" @click="onSave"> </q-btn>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import setSearchQuery from 'utils/setSearchQuery.js'
import { QInputProps } from 'utils/quasar-extends/base-props.js'
import { getIpdOperationMaterial, putIpdOperationMaterial } from 'api'

import ConsumablesTable from 'components/opd/ConsumablesTable.vue'
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash-es'

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()
const props = defineProps({
  IpdId: String,
})

const consumablesColumns = ['index', 'HospitalCode', 'SpecialCode', 'Cname', 'Category', 'Quantity', 'Unit', 'PayPoint', 'TotalAmount', 'date', 'action']

const consumablesRowsId = ref()
const consumablesRows = ref([])
const consumablesDate = ref('')

const GetIpdOperationMaterial = async () => {
  try {
    const query = setSearchQuery({
      ipdId: props.IpdId,
    })
    const res = await getIpdOperationMaterial(query)
    if (res.status === 200) {
      console.log(`GetIpdOperationMaterial: `, res.data)
      consumablesRowsId.value = res.data.Id
      consumablesRows.value = res.data.IpdOperationMaterialItems
      consumablesDate.value = res.data.IpdOperationMaterialDate ? dayjs(res.data.IpdOperationMaterialDate).format('YYYY-MM-DD HH:mm') : ''
    }
  } catch (err) {
    console.log(err)
  } finally {
  }
}
const PutIpdOperationMaterial = async () => {
  try {
    const body = {
      Id: consumablesRowsId.value,
      IpdId: props.IpdId,
      IpdOperationMaterialDate: new Date(),
      IpdOperationMaterialItems: cloneDeep(consumablesRows.value),
    }
    const res = await putIpdOperationMaterial(body)
    if (res.status === 200) {
      consumablesRows.value = res.data.IpdOperationMaterialItems
      consumablesDate.value = dayjs(res.data.IpdOperationMaterialDate).format('YYYY-MM-DD HH:mm')
    }
  } catch (err) {
    console.log(err)
  } finally {
  }
}

const onSave = () => {
  PutIpdOperationMaterial()
}

const init = () => {
  GetIpdOperationMaterial()
}
init()
</script>

