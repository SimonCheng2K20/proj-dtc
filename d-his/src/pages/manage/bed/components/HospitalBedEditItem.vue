<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss>
    <my-dialog-content :header="editHeader" width="1280px" @close="onDialogCancel" :loading="getDataLoading">
      <div v-if="editType === 'delete'" class="text-negative mb-1">是否確定刪除此護理站及床位？</div>
      <my-input-group class="grid gap-2">
        <my-input-wrapper label="科別">
          <q-select
            v-bind="QSelectProps"
            v-model="editItem.Area"
            :options="departmentItems"
            option-label="Name"
            option-value="No"
            map-options
            emit-value
            :readonly="editType === 'delete'"
          >
          </q-select>
        </my-input-wrapper>
        <my-input-wrapper label="護理站代碼">
          <q-select
            v-bind="QSelectProps"
            v-model="editItem.NursingStation"
            :options="nursingStationItems"
            option-label="StationName"
            option-value="StationId"
            map-options
            emit-value
            :readonly="editType === 'delete'"
          >
          </q-select>
        </my-input-wrapper>
        <my-input-wrapper label="所在樓別">
          <q-input v-bind="QInputProps" v-model="editItem.Floor" :readonly="editType === 'delete'"> </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="房號">
          <q-input v-bind="QInputProps" v-model="editItem.Room" :readonly="editType === 'delete'"> </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="床位號碼">
          <q-input v-bind="QInputProps" v-model="editItem.Bed" :readonly="editType === 'delete'"> </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="健保性質">
          <q-select
            v-bind="QSelectProps"
            v-model="editItem.HealthBed"
            :options="healthBedItems"
            option-label="Name"
            option-value="No"
            map-options
            emit-value
            :readonly="editType === 'delete'"
          >
          </q-select>
        </my-input-wrapper>
        <my-input-wrapper label="床位類別">
          <q-select
            v-bind="QSelectProps"
            v-model="editItem.BedType"
            :options="bedTypeItems"
            option-label="Name"
            option-value="No"
            map-options
            emit-value
            :readonly="editType === 'delete'"
          >
          </q-select>
        </my-input-wrapper>
        <my-input-wrapper label="床位等級">
          <q-select
            v-bind="QSelectProps"
            v-model="editItem.BedLevel"
            :options="bedLevelItems"
            option-label="Name"
            option-value="No"
            map-options
            emit-value
            :readonly="editType === 'delete'"
          >
          </q-select>
        </my-input-wrapper>
        <my-input-wrapper label="房價">
          <q-input v-bind="QInputProps" v-model="editItem.BedPrice" type="number" :readonly="editType === 'delete'">
          </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="差額">
          <q-input v-bind="QInputProps" v-model="editItem.MakeUpPrice" type="number" :readonly="editType === 'delete'">
          </q-input>
        </my-input-wrapper>
        <my-input-wrapper label="使用狀態">
          <q-select
            v-bind="QSelectProps"
            v-model="editItem.BedStatus"
            :options="bedStatusItems"
            option-label="Name"
            option-value="No"
            map-options
            emit-value
            :readonly="editType === 'delete'"
          >
          </q-select>
        </my-input-wrapper>
      </my-input-group>
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
        >
        </q-btn>
        <q-btn
          v-if="editType === 'delete'"
          unelevated
          color="negative"
          label="刪除"
          :loading="editLoading"
          :disable="getDataLoading"
          @click="DeleteHospitalBedItem(editItem.Id)"
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
  getHospitalBedItem,
  postHospitalBedItem,
  putHospitalBedItem,
  deleteHospitalBedItem,
  getBedLevelDropdown,
  getHbedType,
  getBedStatusDropdown,
  getHealthBedDropdown,
  getDepartmentDropdown,
  getNursingStation,
} from 'api'
import { validate } from 'utils/quasar-extends/validate.js'
import { useRequired } from 'utils/rules.js'
import { QSelectProps, QInputProps } from 'utils/quasar-extends/base-props.js'
import setSearchQuery from 'utils/setSearchQuery.js'

const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  editType: String,
  id: [String, Number],
})

const editHeader = computed(() => {
  switch (props.editType) {
    case 'add':
      return `新增護理站及床位`
    case 'edit':
      return `編輯護理站及床位`
    case 'delete':
      return `刪除護理站及床位`
    default:
      return null
  }
})

const editItem = reactive({
  Area: null,
  NursingStation: null,
  Floor: null,
  Room: null,
  Bed: null,
  HealthBed: null,
  BedType: null,
  BedLevel: null,
  BedPrice: null,
  MakeUpPrice: null,
  BedStatus: null,
})

const getDataLoading = ref(false)
const GetHospitalBedItem = async () => {
  try {
    getDataLoading.value = true
    const res = await getHospitalBedItem(props.id)
    Object.assign(editItem, res.data)
  } catch (err) {
    console.log(err)
  } finally {
    getDataLoading.value = false
  }
}

const inputRefs = reactive({})
const rules = {}

const onSaveClick = async () => {
  const { result, errorInputRef } = validate(inputRefs)

  if (result === false) {
    errorInputRef.focus()
    return
  }

  switch (props.editType) {
    case 'add':
      PostHospitalBedItem(editItem)
      break
    case 'edit':
      PutHospitalBedItem(editItem)
      break
  }
}

const editLoading = ref(false)
const PostHospitalBedItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await postHospitalBedItem(editItem)
    $q.notify({
      type: 'positive',
      message: '新增護理站及床位成功',
      position: 'top',
    })
    onDialogOK()
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '新增護理站及床位失敗：' + typeof error.data === 'string' ? error.data : JSON.stringify(error.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const PutHospitalBedItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await putHospitalBedItem(editItem)
    $q.notify({
      type: 'positive',
      message: '編輯護理站及床位成功',
      position: 'top',
    })
    onDialogOK()
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '編輯護理站及床位失敗：' + typeof error.data === 'string' ? error.data : JSON.stringify(error.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const DeleteHospitalBedItem = async (id) => {
  try {
    editLoading.value = true
    const res = await deleteHospitalBedItem(id)
    $q.notify({
      type: 'positive',
      message: '刪除護理站及床位成功',
      position: 'top',
    })
    onDialogOK()
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '刪除護理站及床位失敗：' + typeof error.data === 'string' ? error.data : JSON.stringify(error.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const bedLevelItems = ref([])
const GetBedLevelList = async () => {
  try {
    const res = await getBedLevelDropdown()
    bedLevelItems.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const bedTypeItems = ref([])
const GetHbedType = async () => {
  try {
    const res = await getHbedType()
    bedTypeItems.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const bedStatusItems = ref([])
const GetBedStatusList = async () => {
  try {
    const res = await getBedStatusDropdown()
    bedStatusItems.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const healthBedItems = ref([])
const GetHealthBedList = async () => {
  try {
    const res = await getHealthBedDropdown()
    healthBedItems.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const departmentItems = ref([])
const GetDepartmentList = async () => {
  try {
    const query = setSearchQuery({ layer: 2 })
    const res = await getDepartmentDropdown(query)
    departmentItems.value = res.data.Items
  } catch (error) {
    console.log(error)
  }
}

const nursingStationItems = ref([])
const GetNursingStationList = async () => {
  try {
    const res = await getNursingStation()
    nursingStationItems.value = res.data.Items
  } catch (error) {
    console.log(error)
  }
}

const init = () => {
  if (props.id) GetHospitalBedItem()
  GetBedLevelList()
  GetHbedType()
  GetBedStatusList()
  GetHealthBedList()
  GetDepartmentList()
  GetNursingStationList()
}
init()
</script>

