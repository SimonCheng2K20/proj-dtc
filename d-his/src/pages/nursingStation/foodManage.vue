<template>
  <q-page>
    <my-title title="護理站伙食設定"></my-title>
    <div class="p-2">
      <my-search-area grid-cols="4" @search-submit="searchSubmit" @search-clear="searchClear">
        <my-input-wrapper label="時段">
          <q-select
            v-bind="QSelectProps"
            v-model="search.FoodTime"
            :options="foodOptions"
            option-label="Name"
            option-value="No"
            emit-value
            map-options
            :loading="foodTimeLoading"
            @update:model-value="searchSubmit"
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
            v-model="search.FoodType"
            :options="typeOptions"
            option-label="Name"
            option-value="No"
            emit-value
            map-options
            :loading="foodTypeLoading"
            @update:model-value="searchSubmit"
          >
            <template v-slot:no-option>
              <q-item>
                <q-item-section class="text-grey"> 無資料 </q-item-section>
              </q-item>
            </template>
          </q-select>
        </my-input-wrapper>
        <my-input-wrapper label="醫令碼"
          ><q-input v-bind="QInputProps" v-model="search.FoodCode" @keydown.enter="searchSubmit"></q-input
        ></my-input-wrapper>
        <my-input-wrapper label="醫令名稱"
          ><q-input v-bind="QInputProps" v-model="search.Name" @keydown.enter="searchSubmit"></q-input
        ></my-input-wrapper>

        <template #btn-expand>
          <q-btn unelevated color="secondary" icon="add" label="新增資料" @click="toEdit('add')"> </q-btn>
        </template>
      </my-search-area>

      <q-table
        v-bind="QTableProps"
        class="mt-2"
        :rows="rows"
        :columns="columns"
        row-key="BackoutId"
        :pagination="pagination"
        :loading="tableLoading"
      >
        <template #body-cell-action="{ col, row }">
          <q-td :props="{ col, row }">
            <div class="flex justify-center items-center gap-2">
              <q-btn unelevated dense color="delete" label="刪除" @click="toEdit('delete', row.Id)"> </q-btn>
              <q-btn class="text-white mr-3" unelevated dense color="edit" label="編輯" @click="toEdit('edit', row.Id)">
              </q-btn>
            </div>
          </q-td>
        </template>
        <template v-slot:bottom
          ><my-pagination
            class="mx-auto p-4"
            v-model="pagination"
            @update:model-value="GetHospitalFood()"
          ></my-pagination>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { cloneDeep } from 'lodash-es'
import { useQuasar } from 'quasar'

// api
import { getHospitalFood, getFoodTime, getFoodType } from 'api'

// utils
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { QInputProps, QSelectProps, QTableProps } from 'utils/quasar-extends/base-props.js'

//components
import Edit from './components/FoodEditItem.vue'

const $q = useQuasar()

const columns = reactive([
  { name: 'action', label: '操作', field: 'action', align: 'center', style: 'width:200px;' },
  { name: 'FoodTime', label: '時段', field: 'FoodTimeName', align: 'left' },
  { name: 'FoodType', label: '類型', field: 'FoodTypeName', align: 'left' },
  { name: 'FoodCode', label: '醫令碼', field: 'FoodCode', align: 'right' },
  { name: 'Name', label: '醫令名稱', field: 'Name', align: 'left' },
  { name: 'Amount', label: '金額', field: 'Amount', align: 'right' },
])

const rows = ref([])

const initData = {}
initData.search = {
  FoodTime: null,
  FoodType: null,
  FoodCode: null,
  Name: null,
}
const search = reactive(cloneDeep(initData.search))

const sortBy = ref([])
const orderBy = computed(() => {
  return sortBy.value.map((item) => item.join(' ')).join(',')
})

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

// 表格資料
const tableLoading = ref(false)

const GetHospitalFood = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
    })
    const res = await getHospitalFood(query)
    if (res.status === 200) {
      rows.value = res.data.Items
      pagination.value.rowsNumber = res.data.Count
    }
  } catch (err) {
    console.log(err)
  } finally {
    tableLoading.value = false
  }
}

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

const filter = computed(() => {
  return Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'FoodTime':
          case 'FoodType':
            return filterArray.concat(setOdataFilter({ key, value, operator: 'eq' }))
          case 'FoodCode':
          case 'Name':
            return filterArray.concat(setOdataFilter({ key, value, operator: 'contains' }))
          default:
            return filterArray
        }
      } else {
        return filterArray
      }
    }, [])
    .join(' and ')
})

const searchSubmit = () => {
  pagination.value.page = 1
  GetHospitalFood()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetHospitalFood()
}

const toEdit = (type, FoodCode) => {
  $q.dialog({
    component: Edit,
    componentProps: {
      editType: type,
      FoodCode: FoodCode,
    },
  }).onOk(() => {
    const prePage = pagination.value.page - 1
    if (prePage > 0) {
      if (pagination.value.rowsNumber - 1 <= prePage * pagination.value.rowsPerPage) pagination.value.page = prePage
    }
    GetHospitalFood()
  })
}

const init = () => {
  GetFoodType()
  GetFoodTime()
  GetHospitalFood()
}

init()
</script>
