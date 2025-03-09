<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss full-width>
    <my-dialog-content header="預約手術排程" width="680px" @close="onDialogCancel">
      <div class="p-2 grid gap-2 grid-cols-3 font-bold">
        <span> 病歷號:{{ opdData.PatientId }} </span>
        <span> 姓名:{{ opdData.PersonName }} </span>
        <span> 姓別:{{ opdData.Gender }} </span>
        <span class="col-span-2"> 身分證號:{{ opdData.Idetifier }} </span>
        <span> 身分別:{{ opdData.IdentityName }} </span>
        <span> 年齡:{{ opdData.Age }} </span>
        <span> 生日:{{ opdData?.BirthDate?.substring(0, 10) }} </span>
        <span> 過敏:{{ opdData.Allergy }} </span>
        <span> 就診方式:{{ opdData.RoomName }} </span>
        <span> 科別:{{ opdData.DepartmentName }} </span>
        <span> 主治醫師:{{ opdData.SignedDocName }} </span>
      </div>
      <hr class="border-blue-500" />
      <div class="mt-2">
        <my-input-group class="grid gap-2">
          <my-input-wrapper label="預約手術日期" required-mark>
            <my-date-input v-bind="QInputProps" v-model="editItem.OperationReserveDate"> </my-date-input>
          </my-input-wrapper>
          <my-input-wrapper label="預約手術時間" required-mark>
            <q-select
              v-bind="QSelectProps"
              v-model="editItem.OperationReserveTimeName"
              :options="timeOptions"
              option-label="Name"
              :clearable="false"
              @update:model-value="(val) => onSelect(val)"
            >
            </q-select>
          </my-input-wrapper>
          <my-input-wrapper label="手術內容項目" required-mark>
            <q-input v-bind="QInputProps" type="textarea" v-model="editItem.OperationItem"></q-input>
          </my-input-wrapper>
        </my-input-group>
      </div>
      <template #actions>
        <q-btn label="取消" color="grey" @click="onDialogCancel()"></q-btn>
        <q-btn label="確認手術排程" color="pink-10" @click="PutOpdOperationReserve"></q-btn>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { QTableProps, QInputProps, QSelectProps } from 'utils/quasar-extends/base-props.js'
import { getOpdOperationReserveItem, putOpdOperationReserve, getOperationTime } from 'api'
import { useRoute } from 'vue-router'
import setSearchQuery from 'src/utils/setSearchQuery'
import { cloneDeep } from 'lodash-es'

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()
const $q = useQuasar()
const route = useRoute()

const props = defineProps({
  opdData: Object,
})

const editItem = reactive({
  OperationReserveTimeName: '',
  Id: 0,
  OpdId: null,
  OperationReserveDate: '',
  OperationReserveTime: '',
  OperationItem: '',
})

const timeOptions = ref([])

const GetOperationTime = async () => {
  try {
    const res = await getOperationTime(route.params.opdId)
    if (res.status === 200) {
      timeOptions.value = cloneDeep(res.data)
    }
  } catch (error) {
    console.log(error)
  }
}

const GetOpdOperationReserveItem = async () => {
  try {
    const res = await getOpdOperationReserveItem(route.params.opdId)
    if (res.status === 200) {
      Object.assign(editItem, res.data)
    }
  } catch (error) {
    console.log(error)
  }
}
const onSelect = (opt) => {
  editItem.OperationReserveTimeName = opt.Name
  editItem.OperationReserveTime = opt.No
}

const PutOpdOperationReserve = async () => {
  try {
    const res = await putOpdOperationReserve(editItem)
    if (res.status === 200 || res.status === 204) {
      onDialogOK()
      $q.notify({
        type: 'positive',
        message: '預約手術排程成功!',
        position: 'top',
      })
    }
  } catch (error) {
    console.log(error)
    onDialogOK()
    $q.notify({
      type: 'negative',
      message: '預約手術排程失敗!',
      position: 'top',
    })
  }
}

const init = () => {
  GetOpdOperationReserveItem()
  GetOperationTime()
}
init()
</script>

