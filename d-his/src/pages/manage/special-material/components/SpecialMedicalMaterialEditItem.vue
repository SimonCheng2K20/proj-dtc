<template>
  <q-dialog ref="dialogRef" full-width no-backdrop-dismiss>
    <my-dialog-content :header="editHeader" width="1280px" @close="onDialogCancel" :loading="getDataLoading">
      <div v-if="editType === 'delete'" class="text-negative mb-1">是否確定刪除此特材品項？</div>
      <my-input-group class="grid grid-cols-4 gap-2">
        <my-input-wrapper label="院內代碼">
          <q-input v-bind="QInputProps" v-model="editItem.HospitalCode" :readonly="editType === 'delete'"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="特材代碼" required-mark>
          <q-input
            v-bind="QInputProps"
            :ref="(el) => (inputRefs.SpecialCode = el)"
            :rules="rules.SpecialCode"
            lazy-rules
            v-model="editItem.SpecialCode"
            :disable="editType === 'edit'"
            :readonly="editType === 'delete'"
          ></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="給付類別">
          <q-input v-bind="QInputProps" v-model="editItem.OrderPay" :readonly="editType === 'delete'"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="啟用狀態">
          <q-select
            v-bind="QSelectProps"
            v-model="editItem.Status"
            :options="activeStatusItems"
            option-label="label"
            option-value="value"
            map-options
            emit-value
            :readonly="editType === 'delete'"
          ></q-select>
        </my-input-wrapper>

        <my-input-wrapper label="大類碼" class="col-span-2">
          <q-input v-bind="QInputProps" v-model="editItem.BigCode" :readonly="editType === 'delete'"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="大小類碼" class="col-span-2">
          <q-select
            v-bind="QSelectProps"
            v-model="editItem.SubCode"
            :options="subCodeFilterItems"
            option-label="Name"
            option-value="No"
            map-options
            emit-value
            use-input
            @filter="onSubCodeFilter"
            @input-value="filterLoading = true"
            :readonly="editType === 'delete'"
          >
            <template #no-option="{ inputValue }">
              <q-item v-if="!!inputValue">
                <q-item-section class="text-grey">
                  <q-spinner v-if="filterLoading" color="primary"></q-spinner>
                  <span v-else>找不到符合的資料</span>
                </q-item-section>
              </q-item>
            </template>
            <template #option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>
                    <div v-html="scope.opt.filterLabel"></div>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </my-input-wrapper>
        <my-input-wrapper label="品名碼" class="col-span-2">
          <q-input v-bind="QInputProps" v-model="editItem.NameCode" :readonly="editType === 'delete'"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="功能類別" class="col-span-2">
          <q-select
            v-bind="QSelectProps"
            v-model="editItem.Category"
            :options="specialCategoryFilterItems"
            option-label="Name"
            option-value="No"
            map-options
            emit-value
            use-input
            @filter="onSpecialCategoryFilter"
            @input-value="filterLoading = true"
            :readonly="editType === 'delete'"
          >
            <template #no-option="{ inputValue }">
              <q-item v-if="!!inputValue">
                <q-item-section class="text-grey">
                  <q-spinner v-if="filterLoading" color="primary"></q-spinner>
                  <span v-else>找不到符合的資料</span>
                </q-item-section>
              </q-item>
            </template>
            <template #option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>
                    <div v-html="scope.opt.filterLabel"></div>
                  </q-item-label>
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </my-input-wrapper>
        <my-input-wrapper label="核價類別名稱" class="col-span-2">
          <q-input v-bind="QInputProps" v-model="editItem.ApprovedCategory" :readonly="editType === 'delete'"></q-input>
        </my-input-wrapper>
        <div class="col-span-2"></div>

        <my-input-wrapper label="中文品名" class="col-span-full">
          <q-input v-bind="QInputProps" v-model="editItem.Cname" :readonly="editType === 'delete'"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="英文品名" class="col-span-full">
          <q-input v-bind="QInputProps" v-model="editItem.Ename" :readonly="editType === 'delete'"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="產品型號/規格" class="col-span-full">
          <q-input v-bind="QInputProps" v-model="editItem.Specification" :readonly="editType === 'delete'"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="單位">
          <q-input v-bind="QInputProps" v-model="editItem.Unit" :readonly="editType === 'delete'"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="支付點數">
          <q-input
            v-bind="QInputProps"
            v-model="editItem.PayPoint"
            type="number"
            :readonly="editType === 'delete'"
          ></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="自費點數">
          <q-input
            v-bind="QInputProps"
            v-model="editItem.SelfPoint"
            type="number"
            :readonly="editType === 'delete'"
          ></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="核定費用">
          <q-input
            v-bind="QInputProps"
            v-model="editItem.ApprovedFee"
            type="number"
            :readonly="editType === 'delete'"
          ></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="生效日期">
          <my-date-input v-model="editItem.EffectDate" :readonly="editType === 'delete'"></my-date-input>
        </my-input-wrapper>
        <my-input-wrapper label="事前審查生效日期">
          <my-date-input v-model="editItem.PreEffectDate" :readonly="editType === 'delete'"></my-date-input>
        </my-input-wrapper>
        <my-input-wrapper label="事前審查">
          <q-input v-bind="QInputProps" v-model="editItem.PreSetting" :readonly="editType === 'delete'"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="給付規定代碼">
          <q-input v-bind="QInputProps" v-model="editItem.PayCode" :readonly="editType === 'delete'"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="失效日期">
          <my-date-input v-model="editItem.InvalidDate" :readonly="editType === 'delete'"></my-date-input>
        </my-input-wrapper>
        <my-input-wrapper label="申請者簡稱">
          <q-input v-bind="QInputProps" v-model="editItem.ApplicantNo" :readonly="editType === 'delete'"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="許可證字號" class="col-span-2">
          <q-input v-bind="QInputProps" v-model="editItem.ApprovedName" :readonly="editType === 'delete'"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="自付差額品名" class="col-span-2">
          <q-input v-bind="QInputProps" v-model="editItem.SelfMarkupName" :readonly="editType === 'delete'"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="整組組件特材關聯代碼表" class="col-span-2" data-group="a">
          <q-input v-bind="QInputProps" v-model="editItem.ComRelationCode" :readonly="editType === 'delete'"></q-input>
        </my-input-wrapper>
      </my-input-group>

      <template #actions>
        <q-btn unelevated color="grey" label="取消" @click="onDialogCancel" />
        <q-btn
          v-if="editType === 'add'"
          unelevated
          color="secondary"
          label="新增"
          :loading="editLoading"
          @click="onSaveClick"
        />
        <q-btn
          v-if="editType === 'edit'"
          unelevated
          color="primary"
          label="儲存"
          :loading="editLoading"
          @click="onSaveClick"
        />
        <q-btn
          v-if="editType === 'delete'"
          unelevated
          color="negative"
          label="刪除"
          :loading="editLoading"
          @click="DeleteSpecialMedicalMaterialItem(editItem.SpecialCode)"
        />
      </template>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import {
  getSpecialMedicalMaterialItem,
  postSpecialMedicalMaterialItem,
  putSpecialMedicalMaterialItem,
  deleteSpecialMedicalMaterialItem,
  getSubCodeList,
  getSpecialCategoryList,
} from 'api'
import { QInputProps, QSelectProps } from 'utils/quasar-extends/base-props.js'
import { useFilter } from 'utils/quasar-extends/use-filter.js'
import { activeStatusItems } from 'utils/options.js'
import { cloneDeep } from 'lodash-es'

const $q = useQuasar()
const emit = defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  editType: String,
  id: [String, Number],
})

const editHeader = computed(() => {
  switch (props.editType) {
    case 'add':
      return `新增特材品項`
    case 'edit':
      return `編輯特材品項`
    case 'delete':
      return `刪除特材品項`
    default:
      return null
  }
})

const editItem = reactive({
  HospitalCode: null,
  SpecialCode: null,
  Status: null,
  BigCode: null,
  SubCode: null,
  NameCode: null,
  Category: null,
  ApprovedCategory: null,
  Cname: null,
  Ename: null,
  Specification: null,
  Unit: null,
  PayPoint: null,
  SelfPoint: null,
  ApprovedFee: null,
  EffectDate: null,
  PreEffectDate: null,
  PreSetting: null,
  PayCode: null,
  InvalidDate: null,
  ApplicantNo: null,
  ApprovedName: null,
  SelfMarkupName: null,
  ComRelationCode: null,
})

const getDataLoading = ref(false)
const GetSpecialMedicalMaterialItem = async () => {
  try {
    getDataLoading.value = true
    const res = await getSpecialMedicalMaterialItem(props.id)
    if (res.status === 200) {
      Object.assign(editItem, res.data)
    }
  } catch (err) {
    console.log(err)
  } finally {
    getDataLoading.value = false
  }
}

const inputRefs = reactive({})
const rules = {
  SpecialCode: [
    (val) => (val !== null && val !== '') || '請輸入特材代碼',
    (val) => val.length <= 20 || '長度不得大於 ' + 20,
  ],
}

const validate = async () => {
  let errorInputRef = null

  const validationArr = Object.entries(inputRefs).map(([key, inputRef]) => {
    if (!!inputRef) {
      const validatedResult = inputRef.validate()
      if (errorInputRef === null && validatedResult === false) errorInputRef = inputRef
      return validatedResult
    } else {
      return null
    }
  })

  if (validationArr.includes(false) === false) return true
  else {
    errorInputRef.focus()
    return false
  }
}

const onSaveClick = async () => {
  if ((await validate()) === false) return

  const cloneEditItem = cloneDeep(editItem)

  cloneEditItem.EffectDate = dayjs(cloneEditItem.EffectDate).format()
  cloneEditItem.PreEffectDate = dayjs(cloneEditItem.PreEffectDate).format()
  cloneEditItem.InvalidDate = dayjs(cloneEditItem.InvalidDate).format()

  switch (props.editType) {
    case 'add':
      PostSpecialMedicalMaterialItem(cloneEditItem)
      break
    case 'edit':
      PutSpecialMedicalMaterialItem(cloneEditItem)
      break
  }
}

const editLoading = ref(false)
const PostSpecialMedicalMaterialItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await postSpecialMedicalMaterialItem(editItem)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '新增特材品項成功',
        position: 'top',
      })
      emit('ok')
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '新增特材品項失敗：' + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const PutSpecialMedicalMaterialItem = async (editItem) => {
  try {
    editLoading.value = true
    const res = await putSpecialMedicalMaterialItem(editItem)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '編輯特材品項成功',
        position: 'top',
      })
      emit('ok')
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '編輯特材品項失敗：' + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const DeleteSpecialMedicalMaterialItem = async (id) => {
  try {
    editLoading.value = true
    const res = await deleteSpecialMedicalMaterialItem(id)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '刪除特材品項成功',
        position: 'top',
      })
      emit('ok')
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '刪除特材品項失敗：' + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const filterLoading = ref(false)
const subCodeItems = ref([])
const subCodeFilterKeys = ['No', 'Name']
const GetSubCodeList = async () => {
  try {
    const res = await getSubCodeList()
    if (res.data) subCodeItems.value = res.data
  } catch (err) {
    console.log(err)
  }
}

const { filterItems: subCodeFilterItems, filterHandler: onSubCodeFilter } = useFilter(
  { items: subCodeItems, filterKeys: subCodeFilterKeys },
  () => {
    filterLoading.value = false
  }
)

const specialCategoryItems = ref([])
const specialCategoryFilterKeys = ['No', 'Name']
const GetSpecialCategoryList = async () => {
  try {
    const res = await getSpecialCategoryList()
    if (res.data) specialCategoryItems.value = res.data
  } catch (err) {
    console.log(err)
  }
}

const { filterItems: specialCategoryFilterItems, filterHandler: onSpecialCategoryFilter } = useFilter(
  { items: specialCategoryItems, filterKeys: specialCategoryFilterKeys },
  () => {
    filterLoading.value = false
  }
)

const init = () => {
  if (!!props.id) GetSpecialMedicalMaterialItem()
  GetSubCodeList()
  GetSpecialCategoryList()
}
init()
</script>

