<template>
  <div class="bg-white border border-solid border-blue-500">
    <div class="flex justify-between pl-40 h-12">
      <span class="text-2xl font-extrabold self-end">伙食</span>
      <div class="p-2">
        <q-btn
          class="mr-2"
          unelevated
          dense
          color="add"
          icon="add"
          label="新增伙食"
          :loading="btnLoading"
          @click="addRow()"
        ></q-btn>
        <q-btn class="mr-2" unelevated dense color="info" label="回上頁" @click="router.go(-2)"></q-btn>
        <q-btn
          unelevated
          dense
          color="edit"
          :loading="btnLoading"
          label="訂餐儲存"
          @click="PostIpdHfoodInsertAll()"
        ></q-btn>
      </div>
    </div>

    <div class="px-40 pb-4 border-b border-solid border-blue-500">
      <span class="text-lg font-extrabold">一般伙食訂餐 :</span>
      <div class="px-6">
        <q-table
          v-bind="QTableProps"
          style="max-height: 279px"
          :columns="generalColumns"
          :rows="generalRows"
          virtual-scroll
          :rows-per-page-options="[0]"
        >
          <template #body-cell-FoodTime="{ col, row }">
            <q-td :props="{ col, row }">
              <q-select
                v-bind="QInputProps"
                :options="foodTimeOptions"
                v-model="row.FoodTime"
                emit-value
                map-options
                option-value="No"
                option-label="Name"
                :loading="foodTimeLoading"
                @update:model-value="searchHospitalFood(row)"
                :rules="rule.FoodTime"
                :ref="
                  (el) => {
                    inputRefs[`${row.ruleId}FoodTime`] = el
                  }
                "
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-italic text-grey"> 無資料 </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </q-td>
          </template>
          <template #body-cell-FoodType="{ col, row }">
            <q-td :props="{ col, row }">
              <q-select
                v-bind="QInputProps"
                :options="foodTypeOptions"
                v-model="row.FoodType"
                emit-value
                map-options
                option-value="No"
                option-label="Name"
                :loading="foodTypeLoading"
                @update:model-value="searchHospitalFood(row)"
                :rules="rule.FoodType"
                :ref="
                  (el) => {
                    inputRefs[`${row.ruleId}FoodType`] = el
                  }
                "
              >
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-italic text-grey"> 無資料 </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </q-td>
          </template>
          <template #body-cell-Quantity="{ col, row }">
            <q-td :props="{ col, row }">
              <q-input
                v-bind="QInputProps"
                v-model="row.Quantity"
                type="number"
                min="1"
                @input="QQ()"
                :rules="rule.Quantity"
                :ref="
                  (el) => {
                    inputRefs[`${row.ruleId}Quantity`] = el
                  }
                "
              ></q-input>
            </q-td>
          </template>
          <template #body-cell-StartDate="{ col, row }">
            <q-td :props="{ col, row }">
              <my-date-input
                v-bind="QInputProps"
                v-model="row.StartDate"
                :date-options="dateOption"
                :rules="rule.StartDate"
                :ref="
                  (el) => {
                    inputRefs[`${row.ruleId}StartDate`] = el
                  }
                "
              ></my-date-input>
            </q-td>
          </template>
          <template #body-cell-action="{ col, row }">
            <q-td :props="{ col, row }">
              <q-btn unelevated dense color="delete" label="刪除" @click="deleteRow(row)"></q-btn>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>

    <div class="px-40 py-4">
      <span class="text-lg font-extrabold">伙食訂餐歷程 :</span>
      <div class="px-6">
        <q-table
          v-bind="QTableProps"
          style="max-height: 279px"
          :columns="foodHistoryColumns"
          :rows="foodHistoryRows"
          virtual-scroll
          :rows-per-page-options="[0]"
        >
          <template #body-cell-action="{ col, row }">
            <q-td :props="{ col, row }">
              <q-btn
                v-if="!row.StopDate"
                unelevated
                dense
                color="delete"
                label="停訂"
                @click="foodStopClick(row)"
              ></q-btn>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>

    <q-dialog v-model="foodStopShow">
      <my-dialog-content header="停訂日期" @close="foodStopShow = false">
        <div>
          <my-date-input
            v-bind="QInputProps"
            v-model="foodStopItem.StopDate"
            :date-options="dateOption"
            :rules="[(val) => (val !== null && val !== '') || '請輸入停訂日期']"
            lazy-rules
            ref="stopDate"
          ></my-date-input>
        </div>
        <template #actions>
          <q-btn unelevated color="grey" label="取消" @click="foodStopShow = false"></q-btn>
          <q-btn unelevated color="delete" label="確定停訂" :loading="foodStopLoading" @click="foodStopSave()"></q-btn>
        </template>
      </my-dialog-content>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { cloneDeep } from 'lodash-es'
import dayjs from 'dayjs'

// api
import { getIpdHfoods, getFoodTime, getFoodType, getHospitalFood, postIpdHfoodInsertAll, putIpdHfood } from 'api'

// utils
import { QInputProps, QSelectProps, QTableProps } from 'utils/quasar-extends/base-props.js'

const $q = useQuasar()

const route = useRoute()

const router = useRouter()

const dateOption = (date) => {
  return date >= dayjs(new Date()).format('YYYY/MM/DD')
}

const generalColumns = computed(() => {
  return [
    {
      name: 'FoodTime',
      label: '時段',
      align: 'center',
      field: 'FoodTime',
      headerClasses: 'sticky top-0 z-10',
      style: 'width:150px',
    },
    {
      name: 'FoodType',
      label: '類型',
      align: 'center',
      field: 'FoodType',
      headerClasses: 'sticky top-0 z-10',
      style: 'width:150px',
    },
    { name: 'FoodCode', label: '醫令碼', align: 'center', field: 'FoodCode', headerClasses: 'sticky top-0 z-10' },
    { name: 'Name', label: '醫令名稱', align: 'center', field: 'Name', headerClasses: 'sticky top-0 z-10' },
    {
      name: 'Quantity',
      label: '數量',
      align: 'center',
      field: 'Quantity',
      headerClasses: 'sticky top-0 z-10',
      style: 'width:150px',
    },
    { name: 'Amount', label: '金額', align: 'center', field: 'Amount', headerClasses: 'sticky top-0 z-10' },
    {
      name: 'StartDate',
      label: '起訂日期',
      align: 'center',
      field: 'action',
      headerClasses: 'sticky top-0 z-10',
      style: 'width:250px',
    },
    { name: 'action', label: '操作', align: 'center', field: 'action', headerClasses: 'sticky top-0 z-10' },
  ]
})

const generalRows = ref([])

const initRowData = {
  FoodTime: null,
  FoodType: null,
  FoodCode: null,
  Name: null,
  Quantity: 1,
  Amount: null,
  StartDate: dayjs(new Date()).format(),
}

const addRow = () => {
  let obj = cloneDeep(initRowData)
  obj.ruleId = Date.now()
  obj.IpdId = route.params.ipdId
  generalRows.value.push(obj)
  searchHospitalFood(obj)
}

const deleteRow = (row) => {
  generalRows.value = generalRows.value.filter((item) => {
    return item !== row
  })

  delete inputRefs[`${row.ruleId}FoodTime`]
  delete inputRefs[`${row.ruleId}FoodType`]
  delete inputRefs[`${row.ruleId}StartDate`]
  delete inputRefs[`${row.ruleId}Quantity`]
}

// 時段list
const foodTimeLoading = ref(false)

const foodTimeOptions = ref([])

const GetFoodTime = async () => {
  try {
    foodTimeLoading.value = true
    const res = await getFoodTime()
    if (res.status === 200) {
      foodTimeOptions.value = res.data
    }
  } catch (err) {
    console.log(err)
  } finally {
    foodTimeLoading.value = false
  }
}

// 類別list
const foodTypeLoading = ref(false)

const foodTypeOptions = ref([])

const GetFoodType = async () => {
  try {
    foodTimeLoading.value = true
    const res = await getFoodType()
    if (res.status === 200) {
      foodTypeOptions.value = res.data
    }
  } catch (err) {
    console.log(err)
  } finally {
    foodTimeLoading.value = false
  }
}

// 餐點資料
const btnLoading = ref(false)

const nullData = {
  FoodCode: null,
  Name: null,
  Amount: null,
  Id: null,
}

const searchHospitalFood = async (row) => {
  if (!!row.FoodType && !!row.FoodTime) {
    try {
      btnLoading.value = true
      const query = `?$filter= FoodCode eq '${row.FoodTime.concat(row.FoodType)}'`
      const res = await getHospitalFood(query)
      if (res.status === 200) {
        if (!!res.data.Items[0]) Object.assign(row, res.data.Items[0])
        else Object.assign(row, nullData)
      }
    } catch (err) {
      console.log(err)
    } finally {
      btnLoading.value = false
    }
  }
}

// 批次儲存
const deleteRuleId = () => {
  generalRows.value.forEach((item) => {
    delete item.ruleId
  })
}

const addFoodId = () => {
  generalRows.value.forEach((item) => {
    item.FoodId = item.Id
  })
}

const PostIpdHfoodInsertAll = async () => {
  if (validate() === true && confirm('確定儲存訂餐嗎?')) {
    try {
      btnLoading.value = true
      deleteRuleId()
      addFoodId()
      const res = await postIpdHfoodInsertAll(generalRows.value)
      if (res.status === 200 || res.status === 204) {
        $q.notify({
          type: 'positive',
          message: '訂餐儲存成功',
          position: 'top',
        })
        generalRows.value = []
        GetIpdHfoods()
      }
    } catch (err) {
      console.log(err)
      $q.notify({
        type: 'negative',
        message: '訂餐儲存失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
        position: 'top',
      })
    } finally {
      btnLoading.value = false
    }
  }
}

// 表單驗證
const inputRefs = reactive({})

const reg = /^[1-9][0-9]*$/

const rule = {
  FoodTime: [(val) => (val !== null && val !== '') || '請選取時段'],
  FoodType: [(val) => (val !== null && val !== '') || '請選取類別'],
  Quantity: [(val) => reg.test(val) || '請輸入正整數數量'],
  StartDate: [(val) => (val !== null && val !== '') || '請輸入起訂日期'],
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

const foodHistoryColumns = computed(() => {
  return [
    {
      name: 'StartDate',
      label: '開始供餐日',
      align: 'center',
      field: (row) => (dayjs(row.StartDate).isValid() ? dayjs(row.StartDate).format('YYYY-MM-DD') : row.StartDate),
      headerClasses: 'sticky top-0 z-10',
      sortable: true,
    },
    { name: 'CreateUser', label: '起訂人員', align: 'center', field: 'CreateUser', headerClasses: 'sticky top-0 z-10' },
    { name: 'FoodName', label: '醫令名稱', align: 'center', field: 'FoodName', headerClasses: 'sticky top-0 z-10' },
    { name: 'Quantity', label: '數量', align: 'center', field: 'Quantity', headerClasses: 'sticky top-0 z-10' },
    { name: 'Amount', label: '金額', align: 'center', field: 'Amount', headerClasses: 'sticky top-0 z-10' },
    {
      name: 'StopDate',
      label: '停訂日期',
      align: 'center',
      field: (row) => (dayjs(row.StopDate).isValid() ? dayjs(row.StopDate).format('YYYY-MM-DD') : row.StopDate),
      headerClasses: 'sticky top-0 z-10',
      sortable: true,
    },
    {
      name: 'FoodTimeName',
      label: '停止時段',
      align: 'center',
      field: 'FoodTimeName',
      headerClasses: 'sticky top-0 z-10',
    },
    { name: 'ModifyUser', label: '異動人員', align: 'center', field: 'ModifyUser', headerClasses: 'sticky top-0 z-10' },
    {
      name: 'ModifyDatetime',
      label: '異動日期',
      align: 'center',
      field: (row) =>
        dayjs(row.ModifyDatetime).isValid() ? dayjs(row.ModifyDatetime).format('YYYY-MM-DD') : row.ModifyDatetime,
      headerClasses: 'sticky top-0 z-10',
    },
    { name: 'action', label: '操作', align: 'center', field: 'action', headerClasses: 'sticky top-0 z-10' },
  ]
})

const foodHistoryRows = ref([])

// 歷程表格資料
const foodHistoryLoading = ref(false)

const GetIpdHfoods = async () => {
  try {
    foodHistoryLoading.value = true
    const res = await getIpdHfoods(route.params.ipdId)
    if (res.status === 200) {
      foodHistoryRows.value = res.data.IpdHfoods
    }
  } catch (err) {
    console.log(err)
  } finally {
    foodHistoryLoading.value = false
  }
}

// 停訂修改
const foodStopLoading = ref(false)

const stopDate = ref()

const foodStopSave = async () => {
  if (stopDate.value.validate() === true && confirm('確認停訂此筆餐點?')) {
    try {
      foodStopLoading.value = true
      const res = await putIpdHfood(foodStopItem.value)
      if (res.status === 200 || res.status === 204) {
        $q.notify({
          type: 'positive',
          message: '餐點停訂成功',
          position: 'top',
        })
        GetIpdHfoods()
        foodStopShow.value = false
      }
    } catch (err) {
      console.log(err)
      $q.notify({
        type: 'negative',
        message: '餐點停訂失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
        position: 'top',
      })
    } finally {
      foodStopLoading.value = false
    }
  }
}

// 停訂彈出框
const foodStopShow = ref(false)

const foodStopItem = ref({})

const foodStopClick = (item) => {
  Object.assign(foodStopItem.value, item)
  foodStopItem.value.StopDate = dayjs(new Date()).format()
  foodStopShow.value = true
}

const init = () => {
  GetFoodTime()
  GetFoodType()
  GetIpdHfoods()
}

init()
</script>
