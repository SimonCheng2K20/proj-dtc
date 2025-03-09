<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss full-width>
    <my-dialog-content :header="Title" width="563px" @close="onDialogCancel" :loading="getDataLoading">
      <p v-if="editType === 'delete'" class="font-semibold text-xl mb-1">是否確定刪除此醫令碼?</p>
      <div class="pb-1">
        <my-input-group class="grid gap-2.5 grid-cols-1">
          <my-input-wrapper label="時段">
            <q-select
              v-bind="QSelectProps"
              v-model="foodData.FoodTime"
              :options="foodOptions"
              option-label="Name"
              option-value="No"
              emit-value
              map-options
              :loading="foodTimeLoading"
              :readonly="editType === 'delete'"
              :bg-color="editType === 'delete' ? 'blue-grey-1' : null"
              :rules="rule.FoodTime"
              :ref="(el) => (inputRefs.FoodTime = el)"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"> 無資料 </q-item-section>
                </q-item>
              </template>
            </q-select>
          </my-input-wrapper>
          <my-input-wrapper label="類型"
            ><q-select
              v-bind="QSelectProps"
              v-model="foodData.FoodType"
              :options="typeOptions"
              option-label="Name"
              option-value="No"
              emit-value
              map-options
              :loading="foodTypeLoading"
              :readonly="editType === 'delete'"
              :bg-color="editType === 'delete' ? 'blue-grey-1' : null"
              :rules="rule.FoodType"
              :ref="(el) => (inputRefs.FoodType = el)"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey"> 無資料 </q-item-section>
                </q-item>
              </template>
            </q-select>
          </my-input-wrapper>
          <my-input-wrapper label="醫令碼"
            ><q-input
              v-bind="QInputProps"
              v-model="foodData.FoodCode"
              :readonly="editType === 'delete'"
              :bg-color="editType === 'delete' ? 'blue-grey-1' : null"
              :rules="rule.FoodCode"
              :ref="(el) => (inputRefs.FoodCode = el)"
            ></q-input
          ></my-input-wrapper>
          <my-input-wrapper label="醫令名稱"
            ><q-input
              v-bind="QInputProps"
              v-model="foodData.Name"
              :readonly="editType === 'delete'"
              :bg-color="editType === 'delete' ? 'blue-grey-1' : null"
              :rules="rule.Name"
              :ref="(el) => (inputRefs.Name = el)"
            ></q-input
          ></my-input-wrapper>
          <my-input-wrapper label="金額"
            ><q-input
              v-bind="QInputProps"
              v-model="foodData.Amount"
              :readonly="editType === 'delete'"
              :bg-color="editType === 'delete' ? 'blue-grey-1' : null"
              :rules="rule.Amount"
              :ref="(el) => (inputRefs.Amount = el)"
            ></q-input
          ></my-input-wrapper>
        </my-input-group>
      </div>

      <template #actions>
        <q-btn color="grey" label="取消" dense unelevated @click="onDialogCancel"></q-btn>
        <q-btn
          :label="editType === 'delete' ? '確定刪除' : '確定'"
          dense
          unelevated
          :color="editType === 'delete' ? 'negative' : 'primary'"
          :loading="subLoading"
          :disable="getDataLoading"
          @click="onSaveClick()"
        ></q-btn>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref, computed, reactive } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { cloneDeep } from 'lodash-es'

// api
import { postHospitalFood, putHospitalFood, deleteHospitalFood, getHospitalFoodItem, getFoodTime, getFoodType } from 'api'

// utils
import { QInputProps, QSelectProps, QTableProps } from 'utils/quasar-extends/base-props.js'

const $q = useQuasar()

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  editType: String,
  FoodCode: [String, Number],
})

const Title = computed(() => {
  let str = ''
  switch (props.editType) {
    case 'add':
      str = '新增資料'
      break
    case 'edit':
      str = '編輯資料'
      break
    case 'delete':
      str = '刪除'
      break
  }

  return str
})

const initData = {
  FoodTime: '',
  FoodType: '',
  FoodCode: '',
  Name: '',
  Amount: '',
}

const foodData = reactive(cloneDeep(initData))

// 時段
const foodTimeLoading = ref(false)

const foodOptions = ref([])

const GetFoodTime = async () => {
  try {
    foodTimeLoading.value = true
    const res = await getFoodTime()

    if (res.status === 200) {
      foodOptions.value = res.data
    }
  } catch (err) {
    console.log(err)
  } finally {
    foodTimeLoading.value = false
  }
}

// 類別
const foodTypeLoading = ref(false)

const typeOptions = ref([])

const GetFoodType = async () => {
  try {
    foodTypeLoading.value = true
    const res = await getFoodType()
    if (res.status === 200) {
      typeOptions.value = res.data
    }
  } catch (err) {
    console.log(err)
  } finally {
    foodTypeLoading.value = false
  }
}

const onSaveClick = () => {
  if (validate() === true) {
    switch (props.editType) {
      case 'add':
        if (confirm('確定新增此筆餐點')) PostHospitalFood(foodData)
        break
      case 'edit':
        if (confirm('確定編輯此筆餐點')) PutHospitalFood(foodData)
        break
      case 'delete':
        if (confirm('確定刪除此筆餐點')) DeleteHospitalFood(props.FoodCode)
        break
    }
  }
}

// 單筆餐點資料
const getDataLoading = ref(false)

const GetHospitalFoodItem = async (FoodCode) => {
  try {
    getDataLoading.value = true
    const res = await getHospitalFoodItem(FoodCode)
    if (res.status === 200) {
      Object.assign(foodData, res.data)
    }
  } catch (err) {
    console.log(err)
  } finally {
    getDataLoading.value = false
  }
}

// 新增
const subLoading = ref(false)

const PostHospitalFood = async (foodData) => {
  try {
    subLoading.value = true
    const res = await postHospitalFood(foodData)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '新增成功',
        position: 'top',
      })
      onDialogOK()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '新增失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
      position: 'top',
    })
  } finally {
    subLoading.value = false
  }
}

// 編輯
const PutHospitalFood = async (foodData) => {
  try {
    subLoading.value = true
    const res = await putHospitalFood(foodData)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '編輯成功',
        position: 'top',
      })
      onDialogOK()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '編輯失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
      position: 'top',
    })
  } finally {
    subLoading.value = false
  }
}

// 編輯
const DeleteHospitalFood = async (id) => {
  try {
    subLoading.value = true
    const res = await deleteHospitalFood(id)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '刪除成功',
        position: 'top',
      })
      onDialogOK()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '刪除失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
      position: 'top',
    })
  } finally {
    subLoading.value = false
  }
}

// 表單驗證
const inputRefs = reactive({})

const reg = /^[0-9]*$/

const rule = {
  FoodTime: [(val) => (val !== null && val !== '') || '請輸入時段'],
  FoodType: [(val) => (val !== null && val !== '') || '請輸入類別'],
  FoodCode: [(val) => (val !== null && val !== '') || '請輸入醫令碼'],
  Name: [(val) => (val !== null && val !== '') || '請輸入醫令名稱'],
  Amount: [(val) => (reg.test(val) && val !== null && val !== '') || '請輸入正確金額'],
}

const validate = () => {
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

const init = async () => {
  await GetFoodType()
  await GetFoodTime()
  if (!!props.FoodCode) {
    GetHospitalFoodItem(props.FoodCode)
  }
}

init()
</script>
