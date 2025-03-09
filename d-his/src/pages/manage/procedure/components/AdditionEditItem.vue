<template>
  <q-dialog ref="dialogRef" full-width no-backdrop-dismiss>
    <my-dialog-content :header="editHeader" width="1280px" @close="onDialogCancel" :loading="getDataLoading">
      <div v-if="editType === 'delete'" class="text-negative mb-1">是否確定刪除此醫療服務給付項目加成？</div>
      <my-input-group class="grid gap-2 grid-cols-4 mb-2">
        <my-input-wrapper label="院所等級">
          <q-select
            v-bind="QSelectProps"
            v-model="editItem.HospitalLevel"
            :options="hospitalLevelDropdown"
            optionLabel="Name"
            optionValue="No"
            emit-value
            map-options
          ></q-select>
        </my-input-wrapper>
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
                else {
                  nhiSectDropdown = []
                  nhiItemDropdown = []
                }
                editItem.NhiSect = null
                editItem.NhiItem = null
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
                else {
                  nhiItemDropdown = []
                }
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
      </my-input-group>

      <addition
        class="mb-2"
        v-model:data="editItem"
        v-if="editItem.HospitalLevel && editItem.NhiSect"
      ></addition>

      <template #actions>
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
          @click="DeleteProcedureRateItem(editItem.ProcedureId)"
        ></q-btn>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import {
  getProcedureRateItem,
  postProcedureRateItem,
  putProcedureRateItem,
  deleteProcedureRateItem,
  getHospitalLevelDropdown,
  getNHIChapDropdown,
  getRelationNhiSectDropdown,
  getRelationNhiItemDropdown,
} from 'api'
import setSearchQuery from 'utils/setSearchQuery'
import Addition from './Addition.vue'
import { QSelectProps } from 'utils/quasar-extends/base-props'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { validate } from 'utils/quasar-extends/validate.js'
import { useRequired } from 'utils/rules.js'

const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  editType: String,
  id: [Number, String],
})

const editHeader = computed(() => {
  switch (props.editType) {
    case 'add':
      return `新增醫療服務給付項目加成`
    case 'edit':
      return `編輯醫療服務給付項目加成`
    case 'delete':
      return `刪除醫療服務給付項目加成`
    default:
      return null
  }
})

const editItem = reactive({
  Child2y6yRate: null,
  Child6m2yRate: null,
  ChildEr2y6yRate: null,
  ChildEr6m2yRate: null,
  ChildEr6mRate: null,
  ChildExpert2y6yRate: null,
  ChildExpert6m2yRate: null,
  ChildExpert6mRate: null,
  ChildExpertRate: null,
  ChildFourMidnightRate: null,
  ChildFourRate: null,
  ChildFourSurgicalMidnightRate: null,
  ChildFourSurgicalRate: null,
  ChildFourToSexRate: null,
  ChildInc2y6yRate: null,
  ChildInc6m2yRate: null,
  ChildInc6mRate: null,
  ChildOperation2y6yRate: null,
  ChildOperation6m2yRate: null,
  ChildOperation6mRate: null,
  ChildPsychiatry2y6yRate: null,
  ChildPsychiatryUnder2yRate: null,
  ChildRate: null,
  ChildSc2y6yRate: null,
  ChildSc6m2yRate: null,
  ChildSc6mRate: null,
  ChildScRate: null,
  ChildSixCpRate: null,
  ChildThreeImRate: null,
  ChildThreePsychiatryRate: null,
  ChildThreeRate: null,
  ChildThreeWsRate: null,
  ChildUnder6yRate: null,
  EmergencyRate: null,
  GeneralRate: null,
  HospitalLevel: null,
  HospitalLevelCn: null,
  InternalMedicineRate: null,
  ModifyDatetime: null,
  NhiChap: null,
  NhiChapCn: null,
  NhiItem: null,
  NhiItemCn: null,
  NhiSect: null,
  NhiSectCn: null,
  PsychiatryRate: null,
  Wc4ImAddition: null,
  Wc4ImMidnightAddition: null,
  WcSurgicalRate: null,
  WomanSurgicalRate: null,
  Year75UpImRate: null,
  Year75UpPsychiatryRate: null,
  Year75UpRate: null,
  Year75UpSurgicalRate: null,
  Year75UpWSurgicalRate: null,
})

const getDataLoading = ref(false)
const GetProcedureRateItem = async () => {
  try {
    getDataLoading.value = true
    const res = await getProcedureRateItem(props.id)
    Object.assign(editItem, res.data)
  } catch (error) {
    console.log(error)
  } finally {
    getDataLoading.value = false
  }
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
      PostProcedureRateItem(editItem)
      break
    case 'edit':
      PutProcedureRateItem(editItem)
      break
  }
}

const editLoading = ref(false)
const PostProcedureRateItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await postProcedureRateItem(editItem)
    $q.notify({
      type: 'positive',
      message: '新增醫療服務給付項目加成成功',
      position: 'top',
    })
    onDialogOK()
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message:
        '新增醫療服務給付項目加成失敗：' + (typeof error.data === 'string' ? error.data : JSON.stringify(error.data)),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const PutProcedureRateItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await putProcedureRateItem(editItem)
    $q.notify({
      type: 'positive',
      message: '編輯醫療服務給付項目加成成功',
      position: 'top',
    })
    onDialogOK()
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message:
        '編輯醫療服務給付項目加成失敗：' + (typeof error.data === 'string' ? error.data : JSON.stringify(error.data)),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const DeleteProcedureRateItem = async (id) => {
  try {
    editLoading.value = true
    const res = await deleteProcedureRateItem(id)
    $q.notify({
      type: 'positive',
      message: '刪除醫療服務給付項目加成成功',
      position: 'top',
    })
    onDialogOK()
  } catch (error) {
    console.log(error)
    $q.notify({
      type: 'negative',
      message:
        '刪除醫療服務給付項目加成失敗：' + (typeof error.data === 'string' ? error.data : JSON.stringify(error.data)),
      position: 'top',
    })
  } finally {
    editLoading.value = false
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

const init = async () => {
  GetNHIChapDropdown()
  GetHospitalLevelDropdown()

  if (props.id) {
    await GetProcedureRateItem(props.id)
  }

  if (editItem.NhiChap) {
    GetRelationNhiSectDropdown({ code: editItem.NhiChap })
  }

  if (editItem.NhiSect) {
    GetRelationNhiItemDropdown({ code: editItem.NhiSect })
  }
}
init()
</script>

