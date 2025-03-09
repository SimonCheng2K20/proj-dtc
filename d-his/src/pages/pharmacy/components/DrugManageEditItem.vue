<template>
  <q-dialog ref="dialogRef" full-width no-backdrop-dismiss>
    <my-dialog-content :header="editHeader" width="1280px" @close="onDialogCancel" :loading="getDataLoading">
      <div v-if="editType === 'delete'" class="text-negative mb-1">是否確定刪除此藥品資料？</div>

      <my-input-group v-if="editType !== 'book'" class="grid grid-cols-4 gap-2">
        <h1 class="text-xl font-bold col-span-full">藥品資料</h1>

        <my-input-wrapper label="健保代碼">
          <q-input v-bind="QInputProps" v-model="editItem.NhiCode"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="院內代碼" required-mark>
          <q-input v-bind="QInputProps" v-model="editItem.MedicineId" :disabled="editType !== 'add'"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="藥品啟用狀態" class="col-end-4">
          <q-select
            v-bind="QSelectProps"
            v-model="editItem.Status"
            :options="activeStatusItems"
            option-label="label"
            option-value="value"
            emit-value
            map-options
          ></q-select>
        </my-input-wrapper>

        <my-input-wrapper label="中文藥名" class="col-span-4">
          <q-input v-bind="QInputProps" v-model="editItem.CName"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="英文藥名" class="col-span-4">
          <q-input v-bind="QInputProps" v-model="editItem.EName"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="藥品學名" class="col-span-4">
          <!--  -->
          <q-input v-bind="QInputProps" v-model="editItem.ScientificName"></q-input>
        </my-input-wrapper>

        <my-input-wrapper label="方名" class="col-end-2">
          <!--  -->
          <q-input v-bind="QInputProps" v-model="editItem.IngredientDesc"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="規格量" class="col-end-3">
          <q-input v-bind="QInputProps" v-model="editItem.StandardDesc"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="單/複方" class="col-end-4">
          <q-select v-bind="QSelectProps" v-model="editItem.CompoundDesc" :options="compoundDescItems"></q-select>
        </my-input-wrapper>

        <my-input-wrapper label="原核定價" class="col-end-2">
          <q-input v-bind="QInputProps" type="number" min="0" step="0.25" v-model="editItem.OriginPrice"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="新核定價" class="col-end-3">
          <q-input v-bind="QInputProps" type="number" min="0" step="0.25" v-model="editItem.NewPrice"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="生效日期" class="col-end-4">
          <my-date-input v-bind="QInputProps" v-model="editItem.EffectiveDate"> </my-date-input>
        </my-input-wrapper>
        <my-input-wrapper label="發文號" class="col-end-5">
          <q-input v-bind="QInputProps" v-model="editItem.IssueNumber"></q-input>
        </my-input-wrapper>

        <my-input-wrapper label="藥品劑型" class="col-end-2">
          <q-input v-bind="QInputProps" v-model="editItem.DosageFormCode"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="藥品分類" class="col-end-3">
          <q-select
            v-bind="QSelectProps"
            v-model="editItem.CategoryCode"
            :options="categoryCodeItems"
            option-label="Name"
            option-value="No"
            emit-value
            map-options
          ></q-select>
        </my-input-wrapper>
        <my-input-wrapper label="產地" class="col-end-4">
          <q-input v-bind="QInputProps" v-model="editItem.ProductPlace"></q-input>
        </my-input-wrapper>

        <my-input-wrapper label="分類分組名稱" class="col-span-4">
          <q-input v-bind="QInputProps" v-model="editItem.PharmacologyCode"></q-input>
        </my-input-wrapper>

        <MedVenderSelection
          class="col-span-4"
          labelName="藥商"
          useInput
          v-model:selectedData="venderData"
          @update:selectedData="editItem.VendorId = venderData?.VendorId"
        ></MedVenderSelection>

        <my-input-wrapper label="ATC碼">
          <q-input v-bind="QInputProps" v-model="editItem.AtcCode"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="自費價格">
          <q-input v-bind="QInputProps" type="number" min="0" step="0.25" v-model="editItem.SelfPay"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="管制用藥">
          <q-select
            v-bind="QSelectProps"
            v-model="editItem.ControlledCode"
            :options="controlledCodeItems"
            option-label="Name"
            option-value="No"
            emit-value
            map-options
          ></q-select>
        </my-input-wrapper>
        <my-input-wrapper label="皮試標誌">
          <q-select
            v-bind="QSelectProps"
            v-model="editItem.SkinTestFlag"
            :options="skinTestFlagItems"
            option-label="Name"
            option-value="No"
            emit-value
            map-options
          ></q-select>
        </my-input-wrapper>

        <my-input-wrapper label="抗生素藥物">
          <q-select
            v-bind="QSelectProps"
            v-model="editItem.AntibioticsFlag"
            :options="antibioticsCodeItems"
            option-label="Name"
            option-value="No"
            emit-value
            map-options
          ></q-select>
        </my-input-wrapper>
        <my-input-wrapper label="用藥途徑">
          <q-select
            v-bind="QSelectProps"
            v-model="editItem.RouteCode"
            :options="routeItems"
            :option-label="(item) => `${item.No}-${item.Name}`"
            option-value="No"
            emit-value
            map-options
          ></q-select>
        </my-input-wrapper>
        <my-input-wrapper label="用藥頻率">
          <q-select
            v-bind="QSelectProps"
            v-model="editItem.FrequencyCode"
            :options="frequencyCodeItems"
            :option-label="(item) => `${item.No}-${item.Name}`"
            option-value="No"
            emit-value
            map-options
          ></q-select>
        </my-input-wrapper>
        <my-input-wrapper label="服用時間">
          <q-select v-bind="QSelectProps" v-model="editItem.TakeTime" emit-value map-options></q-select>
        </my-input-wrapper>

        <my-input-wrapper label="用藥單位">
          <q-select
            v-bind="QSelectProps"
            v-model="editItem.MedicationUnitCode"
            :options="unitCodeItems"
            option-label="Name"
            option-value="No"
            emit-value
            map-options
          ></q-select>
        </my-input-wrapper>
        <my-input-wrapper label="收費項目">
          <q-select
            v-bind="QSelectProps"
            v-model="editItem.ChargeCode"
            :options="inChargesItems"
            option-label="Name"
            option-value="No"
            emit-value
            map-options
          ></q-select>
        </my-input-wrapper>
        <my-input-wrapper label="庫存上限">
          <q-input v-bind="QInputProps" type="number" min="0" v-model="editItem.UpperLimit"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="庫存下限">
          <q-input v-bind="QInputProps" type="number" min="0" v-model="editItem.LowerLimit"></q-input>
        </my-input-wrapper>
      </my-input-group>

      <h1 class="text-xl font-bold mt-2">藥理資料</h1>
      <my-input-group class="grid gap-2">
        <my-input-wrapper label="適應症">
          <q-input
            v-bind="QInputProps"
            type="textarea"
            v-model="editItem.Indication"
            :readonly="editType === 'view' || editType === 'book'"
          ></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="不良反應/副作用">
          <q-input
            v-bind="QInputProps"
            type="textarea"
            v-model="editItem.AdverseReaction"
            :readonly="editType === 'view' || editType === 'book'"
          ></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="藥理作用">
          <q-input
            v-bind="QInputProps"
            type="textarea"
            v-model="editItem.PharmacologicalAction"
            :readonly="editType === 'view' || editType === 'book'"
          ></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="警語">
          <q-input
            v-bind="QInputProps"
            type="textarea"
            v-model="editItem.Warning"
            :readonly="editType === 'view' || editType === 'book'"
          ></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="用法與用量">
          <q-input
            v-bind="QInputProps"
            type="textarea"
            v-model="editItem.Dosage"
            :readonly="editType === 'view' || editType === 'book'"
          ></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="使用禁忌">
          <q-input
            v-bind="QInputProps"
            type="textarea"
            v-model="editItem.Contraindication"
            :readonly="editType === 'view' || editType === 'book'"
          ></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="懷孕相關">
          <q-input
            v-bind="QInputProps"
            type="textarea"
            v-model="editItem.PregnantNotes"
            :readonly="editType === 'view' || editType === 'book'"
          ></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="交互作用">
          <q-input
            v-bind="QInputProps"
            type="textarea"
            v-model="editItem.InteractionEffect"
            :readonly="editType === 'view' || editType === 'book'"
          ></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="藥品外觀">
          <q-input
            v-bind="QInputProps"
            type="textarea"
            v-model="editItem.Look"
            :readonly="editType === 'view' || editType === 'book'"
          ></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="圖片名稱" style="grid-column: 1 / -1">
          <div
            class="w-full flex justify-center items-center cursor-pointer"
            @click="editType !== 'book' ? imageUpload() : null"
          >
            <div v-if="!editItem.Image && editType !== 'book'" style="height: 120px">選擇圖片</div>
            <div v-else>
              <img :src="imageSrc" alt="" />
            </div>
          </div>
        </my-input-wrapper>
      </my-input-group>

      <template v-if="editType !== 'book'" #actions>
        <q-btn unelevated color="grey" label="取消" @click="onDialogCancel"></q-btn>
        <q-btn
          v-if="editType === 'add'"
          unelevated
          color="secondary"
          label="新增"
          :loading="editLoading"
          @click="onSaveClick"
        ></q-btn>
        <q-btn
          v-if="editType === 'edit'"
          unelevated
          color="primary"
          label="儲存"
          :loading="editLoading"
          @click="onSaveClick"
        ></q-btn>
        <q-btn
          v-if="editType === 'delete'"
          unelevated
          color="negative"
          label="刪除"
          :loading="editLoading"
          @click="DeleteDrugItem(editItem.PharmacyId)"
        ></q-btn>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'

// api
import {
  getDrugItem,
  postDrugItem,
  putDrugItem,
  deleteDrugItem,
  getRouteCodeDropdown,
  getUnitCodeDropdown,
  getPharmacologyCodeDropdown,
  getCategoryCodeDropdown,
  getControlledCodeDropdown,
  getAntibioticsCodeDropdown,
  getFrequencyCodeDropdown,
  getInChargeList,
  uploadImage,
} from 'api'

// components
import MedVenderSelection from 'src/components/type-selection/MedVenderSelection.vue'

// utils
import { activeStatusItems } from 'utils/options'
import { QInputProps, QSelectProps } from 'utils/quasar-extends/base-props.js'

const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  editType: String,
  id: [String, Number],
})

const editHeader = computed(() => {
  switch (props.editType) {
    case 'add':
      return `新增藥品資料`
    case 'edit':
      return `編輯藥品資料`
    case 'delete':
      return `刪除藥品資料`
    case 'book':
      return `藥典`
    default:
      return null
  }
})

const venderData = ref(null)

const editItem = reactive({
  MedicineId: null,
  NhiCode: null,
  EName: null,
  CName: null,
  ScientificName: null,
  DosageFormCode: null,
  CategoryCode: null,
  PharmacologyCode: null,
  MedicationUnitCode: null,
  FrequencyCode: null,
  RouteCode: null,
  IngredientDesc: null,
  MadeInCode: null,
  VendorId: null,
  ControlledCode: null,
  SkinTestFlag: null,
  AntibioticsFlag: null,
  AntibioticsCode: null,
  StorePlaceCode: null,
  OriginPrice: null,
  NewPrice: null,
  SelfPay: null,
  EffectiveDate: null,
  IssueNumber: null,
  ChargeCode: null,
  TakeTime: null,
  UpperLimit: null,
  LowerLimit: null,
  Status: true,
  CompoundDesc: null,
  AtcCode: null,
  StandardDesc: null,
  StockNow: null,
  DosageUnit: null,
  Indication: null,
  AdverseReaction: null,
  PharmacologicalAction: null,
  Warning: null,
  DosageForm: null,
  Contraindication: null,
  PregnantNotes: null,
  InteractionEffect: null,
  Dosage: null,
  Look: null,
  VendorId: null,
  Image: null,
  ProductPlace: null,
})

const getDataLoading = ref(false)
const GetDrugItem = async (id) => {
  try {
    getDataLoading.value = true
    const res = await getDrugItem(id)
    if (res.status === 200) {
      Object.assign(editItem, res.data)
    }
  } catch (error) {
    console.log(error)
  } finally {
    getDataLoading.value = false
  }
}

const onSaveClick = async () => {
  editLoading.value = true

  // if ((await validate()) === false) return

  const tasks = []

  if (imageFile.value) {
    tasks.push(PostDrugImage())
  }

  switch (props.editType) {
    case 'add':
      tasks.push(PostDrugItem(editItem))
      break
    case 'edit':
      tasks.push(PutDrugItem(editItem))
      break
  }

  await Promise.all(tasks)

  if (tasks.includes(false) === false) {
    onDialogOK()
  }
  editLoading.value = false
}

const editLoading = ref(false)
const PostDrugItem = async (editItem) => {
  try {
    const res = await postDrugItem(editItem)
    $q.notify({
      type: 'positive',
      message: '新增藥房資料成功',
      position: 'top',
    })
    return true
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '新增藥房資料失敗：' + (typeof error.data === 'string' ? error.data : JSON.stringify(error.data)),
      position: 'top',
    })
    return false
  }
}

const PutDrugItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await putDrugItem(editItem)
    $q.notify({
      type: 'positive',
      message: '編輯藥房資料成功',
      position: 'top',
    })
    return true
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '編輯藥房資料失敗：' + (typeof error.data === 'string' ? error.data : JSON.stringify(error.data)),
      position: 'top',
    })
    return false
  }
}

const DeleteDrugItem = async (id) => {
  try {
    editLoading.value = true
    const res = await deleteDrugItem(id)
    $q.notify({
      type: 'positive',
      message: '刪除藥房資料成功',
      position: 'top',
    })
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '刪除藥房資料失敗：' + (typeof error.data === 'string' ? error.data : JSON.stringify(error.data)),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const PostDrugImage = async () => {
  try {
    const form = new FormData()
    form.append('MedicineId', editItem.MedicineId)
    form.append('File', imageFile.value)
    const res = await uploadImage(form)
    $q.notify({
      type: 'positive',
      message: '圖片上傳成功',
      position: 'top',
    })
    return true
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '圖片上傳失敗：' + (typeof error.data === 'string' ? error.data : JSON.stringify(error.data)),
      position: 'top',
    })
    return false
  }
}

const dataImage = ref()
const imageFile = ref()
const imageSrc = computed(() => {
  if (dataImage.value) return dataImage.value
  else {
    const path = editItem.Image + '?time=' + new Date().getTime()
    if (process.env.DEV) {
      return $setting.apiHost + '/his' + path
    } else {
      return $setting.apiHost + path
    }
  }
})

const imageUpload = () => {
  const uploader = document.createElement('input')
  uploader.setAttribute('type', 'file')
  uploader.setAttribute('accept', 'image/*')
  uploader.setAttribute('multiple', 'true')
  uploader.onchange = async (evt) => {
    const file = evt.target.files[0]

    if (file === undefined) {
      // 取消，沒有上傳
      return
    } else {
      const secondFilename = /(.+)\.(jpg|jpeg|png)/i
      if (!secondFilename.test(file.name)) {
        const dialog = $q.dialog({
          message: '請上傳正確的圖片類型，圖片副檔名必須為 jpg | jpeg | png | bmp | gif',
          type: 'negative',
          ok: {
            label: '確定',
            color: 'primary',
            unelevated: true,
          },
        })
      } else {
        const fr = new FileReader()
        fr.addEventListener('load', (evt) => {
          dataImage.value = evt.target.result
          imageFile.value = file
        })
        fr.readAsDataURL(file)
      }
    }
  }
  uploader.click()
}

const compoundDescItems = ['單方', '複方']
const skinTestFlagItems = [
  { No: 0, Name: '否' },
  { No: 1, Name: '是' },
]

const routeItems = ref([])
const GetRouteCodeDropdown = async () => {
  try {
    const res = await getRouteCodeDropdown()
    if (res.status === 200) routeItems.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const frequencyCodeItems = ref([])
const GetFrequencyCodeDropdown = async () => {
  try {
    const res = await getFrequencyCodeDropdown()
    if (res.status === 200) frequencyCodeItems.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const unitCodeItems = ref([])
const GetUnitCodeDropdown = async () => {
  try {
    const res = await getUnitCodeDropdown()
    if (res.status === 200) unitCodeItems.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const pharmacologyCodeItems = ref([])
const GetPharmacologyCodeDropdown = async () => {
  try {
    const res = await getPharmacologyCodeDropdown()
    if (res.status === 200) pharmacologyCodeItems.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const categoryCodeItems = ref([])
const GetCategoryCodeDropdown = async () => {
  try {
    const res = await getCategoryCodeDropdown()
    if (res.status === 200) categoryCodeItems.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const controlledCodeItems = ref([])
const GetControlledCodeDropdown = async () => {
  try {
    const res = await getControlledCodeDropdown()
    if (res.status === 200) controlledCodeItems.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const antibioticsCodeItems = ref([])
const GetAntibioticsCodeDropdown = async () => {
  try {
    const res = await getAntibioticsCodeDropdown()
    if (res.status === 200) antibioticsCodeItems.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const inChargesItems = ref([])
const GetInChargesDropdown = async () => {
  try {
    const res = await getInChargeList()
    if (res.status === 200) inChargesItems.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const init = async () => {
  if (props.id) {
    GetDrugItem(props.id)
  }
  GetRouteCodeDropdown()
  GetFrequencyCodeDropdown()
  GetUnitCodeDropdown()
  GetPharmacologyCodeDropdown()
  GetCategoryCodeDropdown()
  GetControlledCodeDropdown()
  GetAntibioticsCodeDropdown()
  GetInChargesDropdown()
}
init()
</script>
