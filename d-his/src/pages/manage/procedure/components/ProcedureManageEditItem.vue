<template>
  <q-dialog ref="dialogRef" full-width no-backdrop-dismiss>
    <my-dialog-content :header="editHeader" width="1280px" @close="onDialogCancel" :loading="loading">
      <div class="text-right">院所等級：{{ hospitalLevelChinese }}</div>
      <div v-if="editType === 'delete'" class="text-negative mb-1">是否確定刪除此醫令資料？</div>
      <my-input-group class="grid grid-cols-4 gap-2">
        <my-input-wrapper label="健保醫令分章">
          <q-select
            v-bind="QSelectProps"
            v-model="editItem.NhiChap"
            :options="nhiChapDropdown"
            optionLabel="Name"
            optionValue="No"
            emit-value
            map-options
            :readonly="editType === 'delete'"
            @update:model-value="
              (val) => {
                if (val) GetRelationNhiSectDropdown({ code: val })
                nhiSectDropdown = []
                nhiItemDropdown = []
                editItem.NhiSect = null
                editItem.NhiItem = null
                editItem.TreatmentSiteRestricts = []
              }
            "
          ></q-select>
        </my-input-wrapper>
        <my-input-wrapper label="健保醫令分節">
          <q-select
            v-bind="QSelectProps"
            v-model="editItem.NhiSect"
            :options="nhiSectDropdown"
            optionLabel="Name"
            optionValue="No"
            emit-value
            map-options
            :readonly="editType === 'delete'"
            @update:model-value="
              (val) => {
                if (val) GetRelationNhiItemDropdown({ code: val })
                nhiItemDropdown = []
                editItem.NhiItem = null
              }
            "
          ></q-select>
        </my-input-wrapper>
        <my-input-wrapper label="健保醫令分項">
          <q-select
            v-bind="QSelectProps"
            v-model="editItem.NhiItem"
            :options="nhiItemDropdown"
            optionLabel="Name"
            optionValue="No"
            emit-value
            map-options
            :readonly="editType === 'delete'"
          ></q-select>
        </my-input-wrapper>

        <div><!-- 佔位 --></div>

        <my-input-wrapper label="院內醫令代碼" required-mark>
          <q-input
            v-bind="QInputProps"
            :ref="(el) => (inputRefs.ProcedureCode = el)"
            :rules="rules.ProcedureCode"
            v-model="editItem.ProcedureCode"
            :readonly="editType === 'delete'"
          ></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="健保醫令代碼" required-mark>
          <q-input
            v-bind="QInputProps"
            :ref="(el) => (inputRefs.NhiCode = el)"
            :rules="rules.NhiCode"
            v-model="editItem.NhiCode"
            :readonly="editType === 'delete'"
          ></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="特別診療代碼" required-mark>
          <q-input v-bind="QInputProps" v-model="editItem.ChronicCode" :readonly="editType === 'delete'"></q-input>
        </my-input-wrapper>
        <my-input-wrapper class="col-span-full" label="診療項目(中文)">
          <q-input v-bind="QInputProps" v-model="editItem.ProcedureCname"></q-input>
        </my-input-wrapper>
        <my-input-wrapper class="col-span-full" label="診療項目(英文)">
          <q-input v-bind="QInputProps" v-model="editItem.ProcedureEname"></q-input>
        </my-input-wrapper>
        <my-input-wrapper class="col-span-full" label="診療部位代碼">
          <q-select
            ref="TreatmentSitesRef"
            v-bind="QSelectProps"
            v-model="editItem.TreatmentSiteRestricts"
            :options="medicalPartOptions"
            option-label="Name"
            option-value="No"
            map-options
            emit-value
            use-chips
            multiple
            :clearable="false"
          >
            <template #no-option>
              <q-item>
                <q-item-section class="text-grey">
                  <span>請先選擇治療處置代碼</span>
                </q-item-section>
              </q-item>
            </template>
            <template #option="scope">
              <q-item>
                <q-item-section>
                  <q-checkbox
                    size="sm"
                    v-model="editItem.TreatmentSiteRestricts"
                    :val="scope.opt.No"
                    :label="scope.opt.Name"
                  />
                </q-item-section>
              </q-item>
            </template>
            <template v-if="editItem.NhiChap === '3'" v-slot:after>
              <img class="cursor-pointer" title="選擇牙齒部位" :src="teethPic" @click="toOpdDental()" />
            </template>
          </q-select>
        </my-input-wrapper>

        <my-input-wrapper label="醫令類別">
          <q-input
            v-bind="QInputProps"
            v-model="editItem.HealthyCareExpense"
            :readonly="editType === 'delete'"
          ></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="院內收費項目">
          <q-input v-bind="QInputProps" v-model="editItem.InHospitalCharge" :readonly="editType === 'delete'"></q-input>
        </my-input-wrapper>

        <div class="col-span-2"><!-- 佔位 --></div>

        <my-input-wrapper label="生效日期">
          <my-date-input
            v-bind="QInputProps"
            v-model="editItem.EffectiveDate"
            :readonly="editType === 'delete'"
          ></my-date-input>
        </my-input-wrapper>
        <my-input-wrapper label="資料狀態">
          <q-input v-bind="QInputProps" v-model="editItem.DataState" :readonly="editType === 'delete'"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="自購註記">
          <q-input v-bind="QInputProps" v-model="editItem.Selfbuy" :readonly="editType === 'delete'"></q-input>
        </my-input-wrapper>

        <div><!-- 佔位 --></div>

        <my-input-wrapper label="前健保價">
          <q-input
            v-bind="QInputProps"
            v-model="editItem.BeforeNhiPoint"
            editType="number"
            :readonly="editType === 'delete'"
          ></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="後健保價">
          <q-input
            v-bind="QInputProps"
            v-model="editItem.AfterNhiPoint"
            editType="number"
            :readonly="editType === 'delete'"
          ></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="支付點數">
          <q-input v-bind="QInputProps" v-model="editItem.AfterNhiPoint" editType="number" rea:readonly></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="自費金額">
          <q-input
            v-bind="QInputProps"
            v-model="editItem.AfterSelfPay"
            editType="number"
            :readonly="editType === 'delete'"
          ></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="前自費價">
          <q-input
            v-bind="QInputProps"
            v-model="editItem.BeforeSelfPay"
            editType="number"
            :readonly="editType === 'delete'"
          ></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="後自費價">
          <q-input
            v-bind="QInputProps"
            v-model="editItem.AfterSelfPay"
            editType="number"
            :readonly="editType === 'delete'"
          ></q-input>
        </my-input-wrapper>

        <div><!-- 佔位 --></div>
      </my-input-group>

      <!-- <div class="mt-2">
        <q-btn class="w-full" color="grey" unelevated dense label="顯示加成"></q-btn>
      </div> -->
      <addition
        class="mt-2"
        v-model:data="editItem.ProcedureNhiRate"
        :show-all="showAllAddition"
        :nhiSect="data.NhiSect"
        :hospitalLevel="data.HospitalLevel"
        v-if="data.HospitalLevel && data.NhiSect"
      ></addition>

      <my-input-group class="mt-2 grid grid-cols-4 gap-2">
        <my-input-wrapper label="檢驗主分類">
          <q-input v-bind="QInputProps" v-model="editItem.InspectionMain" :readonly="editType === 'delete'"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="檢驗次分類">
          <q-input v-bind="QInputProps" v-model="editItem.InspectionSub" :readonly="editType === 'delete'"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="啟用狀態">
          <q-select
            v-bind="QSelectProps"
            v-model="editItem.Status"
            :options="activeStatusItems"
            optionLabel="label"
            optionValue="value"
            emit-value
            map-options
            :readonly="editType === 'delete'"
          ></q-select>
        </my-input-wrapper>
        <my-input-wrapper label="院所等級(測試用)">
          <q-input v-bind="QInputProps" v-model="editItem.HospitalLevel"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="申報註記" class="col-span-4">
          <q-input
            v-bind="QInputProps"
            type="textarea"
            v-model="editItem.Description"
            :readonly="editType === 'delete'"
          ></q-input>
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
          @click="DeleteProcedureItem(editItem.ProcedureId)"
        ></q-btn>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import {
  getProcedureItem,
  postProcedureItem,
  putProcedureItem,
  deleteProcedureItem,
  getOrderPayDropdown,
  getHospitalLevelDropdown,
  getNHIChapDropdown,
  getRelationNhiSectDropdown,
  getRelationNhiItemDropdown,
  getMedicalPart,
  getToothMedicalPart,
} from 'api'
import setSearchQuery from 'utils/setSearchQuery'
import Addition from './Addition.vue'
import { QInputProps, QSelectProps } from 'utils/quasar-extends/base-props'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { activeStatusItems } from 'utils/options.js'
import { validate } from 'utils/quasar-extends/validate.js'
import { useRequired } from 'utils/rules.js'
import teethPic from 'assets/teethType/teeth.png'
import OpdDental from 'components/opd/OpdDental.vue'

const showAllAddition = ref(true)
const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  editType: String,
  id: [Number, String],
  data: {
    type: Object,
    default: () => ({
      HospitalLevel: null,
      NhiChap: null,
      NhiSect: null,
      NhiItem: null,
    }),
  },
})

const editHeader = computed(() => {
  switch (props.editType) {
    case 'add':
      return `新增醫令資料`
    case 'edit':
      return `編輯醫令資料`
    case 'delete':
      return `刪除醫令資料`
    default:
      return null
  }
})

const editItem = reactive({
  EffectiveDate: null,
  ProcedureId: null,
  ProcedureCode: null,
  ChronicCode: null,
  NhiCode: null,
  HospitalLevel: null,
  NhiChap: null,
  NhiSect: null,
  NhiItem: null,
  InHospitalCharge: null,
  Selfbuy: null,
  HealthyCareExpense: null,
  BeforeNhiPoint: null,
  AfterNhiPoint: null,
  BeforeSelfPay: null,
  AfterSelfPay: null,
  Status: true,
  CreateDatetime: null,
  ModifyDatetime: null,
  SpecialtyId: null,
  Series: null,
  DataState: null,
  BeforePriceDifference: null,
  AfterPriceDifference: null,
  DeclareState: null,
  Discount: null,
  ReportType: null,
  TreatmentSite: null,
  InspectionMain: null,
  InspectionSub: null,
  NhiChapCn: null,
  NhiSectCn: null,
  NhiItemCn: null,
  NhiNote: null,
  NhiCode: null,
  ProcedureCname: null,
  ProcedureEname: null,
  StartDate: null,
  EndDate: null,
  Description: null,
  HospitalLevel: null,
  ProcedureNhiRate: {},
})

const loading = ref(false)
const GetProcedureItem = async (id) => {
  loading.value = true
  await getProcedureItem(id).then(({ data }) => {
    if (data) Object.assign(editItem, data)
  })
  loading.value = false
}

const inputRefs = reactive({})
const rules = {
  ProcedureCode: useRequired({ title: '院內醫令代碼', type: 'input' }),
  NhiCode: useRequired({ title: '健保醫令代碼', type: 'input' }),
}

const onSaveClick = async () => {
  const { result, errorInputRef } = validate(inputRefs)

  if (result === false) {
    errorInputRef.focus()
    return
  }

  switch (props.editType) {
    case 'add':
      PostProcedureItem(editItem)
      break
    case 'edit':
      PutProcedureItem(editItem)
      break
  }
}

const editLoading = ref(false)
const PostProcedureItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await postProcedureItem(editItem)
    $q.notify({
      type: 'positive',
      message: '新增醫令資料成功',
      position: 'top',
    })
    onDialogOK()
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '新增醫令資料失敗：' + (typeof error.data === 'string' ? error.data : JSON.stringify(error.data)),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const PutProcedureItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await putProcedureItem(editItem)
    $q.notify({
      type: 'positive',
      message: '編輯醫令資料成功',
      position: 'top',
    })
    onDialogOK()
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '編輯醫令資料失敗：' + (typeof error.data === 'string' ? error.data : JSON.stringify(error.data)),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const DeleteProcedureItem = async (id) => {
  try {
    editLoading.value = true
    const res = await deleteProcedureItem(id)
    $q.notify({
      type: 'positive',
      message: '刪除醫令資料成功',
      position: 'top',
    })
    onDialogOK()
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message: '刪除醫令資料失敗：' + (typeof error.data === 'string' ? error.data : JSON.stringify(error.data)),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const orderPayDropdown = ref([])
const GetOrderPayDropdown = async () => {
  try {
    const res = await getOrderPayDropdown()
    orderPayDropdown.value = res.data.map((item) => ({
      No: Number(item.No),
      Name: item.Name,
    }))
  } catch (error) {
    console.log(error)
  }
}

const hospitalLevelDropdown = ref([])
const GetHospitalLevelDropdown = async () => {
  try {
    const res = await getHospitalLevelDropdown()
    hospitalLevelDropdown.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const nhiChapDropdown = ref([])
const GetNHIChapDropdown = async () => {
  try {
    const res = await getNHIChapDropdown()
    nhiChapDropdown.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const nhiSectDropdown = ref([])
const GetRelationNhiSectDropdown = async (qeuryOptions) => {
  try {
    const query = setSearchQuery(qeuryOptions)
    const res = await getRelationNhiSectDropdown(query)
    nhiSectDropdown.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const nhiItemDropdown = ref([])
const GetRelationNhiItemDropdown = async (qeuryOptions) => {
  try {
    const query = setSearchQuery(qeuryOptions)
    const res = await getRelationNhiItemDropdown(query)
    nhiItemDropdown.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const hospitalLevelChinese = computed(() => {
  return hospitalLevelDropdown.value.find((val) => val.No === (editItem.HospitalLevel || props.data.HospitalLevel))
    ?.Name
})

const medicalPartOptions = computed(() => {
  if (editItem.NhiChap === '3') {
    return toothMedicalPart.value
  } else {
    return allMedicalPartItems.value
  }
})

const allMedicalPartItems = ref([])
const GetMedicalPart = async () => {
  try {
    const res = await getMedicalPart()
    allMedicalPartItems.value = res.data
  } catch (err) {
    console.log(err)
  }
}

const toothMedicalPart = ref([])
const GetToothMedicalPart = async () => {
  try {
    const res = await getToothMedicalPart()
    toothMedicalPart.value = res.data
  } catch (err) {
    console.log(err)
  }
}

// const getTreatmentSiteRestricts = async (row, val, update) => {
//   update(() => {
//     editItem.TreatmentSiteRestricts = allMedicalPartItems.value.filter((item) => {
//       return editItem.TreatmentSiteRestricts.includes(item.No)
//     })
//   })
// }

const toOpdDental = () => {
  $q.dialog({
    component: OpdDental,
    componentProps: {
      selectData: editItem.TreatmentSiteRestricts,
      setupModel: true,
    },
  }).onOk((selectedTooth) => {
    editItem.TreatmentSiteRestricts = selectedTooth
  })
}

const init = async () => {
  if (props.id) {
    GetProcedureItem(props.id)
  }

  if (props.data.NhiChap) {
    GetRelationNhiSectDropdown({ code: props.data.NhiChap })
  }

  if (props.data.NhiSect) {
    GetRelationNhiItemDropdown({ code: props.data.NhiSect })
  }

  GetNHIChapDropdown()
  GetHospitalLevelDropdown()
  GetOrderPayDropdown()
  GetMedicalPart()
  GetToothMedicalPart()
}
init()
</script>

