<template>
  <div class="bg-white border border-solid border-blue-500 text-lg font-extrabold relative">
    <div class="absolute top-2 right-2">
      <q-btn class="mr-2" unelevated dense color="info" label="回上頁" @click="router.go(-2)"></q-btn>
      <q-btn
        unelevated
        dense
        color="edit"
        :loading="editLoading"
        @click="PostIpdIdentityChange()"
        label="確定儲存"
      ></q-btn>
    </div>

    <div class="flex justify-center border-b border-solid border-blue-500">
      <div class="py-3">
        <span>切帳(身分變更) :</span>
        <div style="width: 1100px" class="pl-28 py-2 grid grid-cols-9">
          <div class="col-span-4 p-2 bg-yellow-50">
            <span>原 :</span>
            <my-input-group class="grid gap-2 grid-cols-1 px-4 pb-4 pt-12">
              <my-input-wrapper label="住院身分"
                ><q-select
                  v-bind="QSelectProps"
                  readonly
                  :model-value="ipdStore.ipdData.IdentityName"
                  :loading="originLoading"
                ></q-select
              ></my-input-wrapper>
              <my-input-wrapper label="折扣身分"
                ><q-select
                  v-bind="QSelectProps"
                  readonly
                  :model-value="ipdStore.ipdData.IdentityDiscountName"
                  :loading="originLoading"
                ></q-select
              ></my-input-wrapper>
              <my-input-wrapper label="部分負擔"
                ><q-select
                  v-bind="QSelectProps"
                  readonly
                  :model-value="ipdStore.ipdData.PartialAfford"
                  :loading="originLoading"
                ></q-select
              ></my-input-wrapper>
              <my-input-wrapper label="給付類別"
                ><q-select
                  v-bind="QSelectProps"
                  readonly
                  :model-value="ipdStore.ipdData.PayTypeName"
                  :loading="originLoading"
                ></q-select
              ></my-input-wrapper>
            </my-input-group>
          </div>
          <div class="flex justify-center items-center">
            <q-icon name="arrow_right_alt" color="primary" size="lg"></q-icon>
          </div>
          <div class="col-span-4 p-2 bg-yellow-50">
            <span>變更 :</span>
            <my-input-group class="grid gap-2 grid-cols-1 px-4 pb-4">
              <my-input-wrapper label="切帳變更日期"
                ><my-date-input
                  v-bind="QInputProps"
                  :date-options="dateOption"
                  v-model="identityData.ChangeDate"
                ></my-date-input
              ></my-input-wrapper>
              <my-input-wrapper label="住院身分">
                <q-select
                  v-bind="QSelectProps"
                  v-model="afterIdentity"
                  :options="identityFilterItems"
                  option-label="Name"
                  use-input
                  @filter="onIdentityFilter"
                  @input-value="filterLoading = true"
                  @update:model-value="(val) => identityChange(val)"
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
              <my-input-wrapper label="折扣身分">
                <q-select
                  v-bind="QSelectProps"
                  v-model="identityData.AfterIdentityDiscount"
                  :options="discountFilterItems"
                  option-label="Name"
                  option-value="No"
                  map-options
                  emit-value
                  use-input
                  @filter="onDiscountFilter"
                  @input-value="filterLoading = true"
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
              <my-input-wrapper label="部分負擔"
                ><q-input v-bind="QInputProps" v-model="identityData.AfterPartialAfford" readonly></q-input
              ></my-input-wrapper>
              <my-input-wrapper label="給付類別"
                ><q-select
                  v-bind="QSelectProps"
                  v-model="identityData.AfterPayType"
                  :options="payTypeFilterItems"
                  option-label="Name"
                  option-value="No"
                  map-options
                  emit-value
                  use-input
                  @filter="onPayTypeFilter"
                  @input-value="filterLoading = true"
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
            </my-input-group>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-center">
      <div class="py-3">
        <span>身分變更歷程 :</span>
        <div style="width: 1200px" class="pl-8 py-2 font-normal">
          <q-table
            v-bind="QTableProps"
            style="max-height: 279px"
            :columns="columns"
            :rows="rows"
            :loading="tableLoading"
            virtual-scroll
            :rows-per-page-options="[0]"
          ></q-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { cloneDeep } from 'lodash-es'
import dayjs from 'dayjs'

// api
import {
  getIdentityList,
  getIdentityDiscount,
  getPayTypeDropdown,
  getPartialAffordPrice,
  getIpdIdentityChange,
  postIpdIdentityChange,
  getIpdRecordItem,
} from 'api'

// utils
import { QInputProps, QSelectProps, QTableProps } from 'utils/quasar-extends/base-props.js'
import { useFilter } from 'utils/quasar-extends/use-filter.js'
import { useIpdStore } from 'stores/ipd'

const ipdStore = useIpdStore()

const $q = useQuasar()

const route = useRoute()

const router = useRouter()

// 日期配置
const dateOption = (date) => {
  return date >= dayjs(new Date()).format('YYYY/MM/DD')
}

const columns = computed(() => {
  return [
    {
      name: 'ChangeDate',
      label: '異動日期',
      align: 'center',
      field: (row) => (dayjs(row.ChangeDate).isValid() ? dayjs(row.ChangeDate).format('YYYY-MM-DD') : row.ChangeDate),
      headerClasses: 'sticky top-0 z-10',
    },
    {
      name: 'AfterIdentityName',
      label: '身分別',
      align: 'center',
      field: 'AfterIdentityName',
      headerClasses: 'sticky top-0 z-10',
    },
    {
      name: 'AfterIdentityDiscountName',
      label: '折扣身分',
      align: 'center',
      field: 'AfterIdentityDiscountName',
      headerClasses: 'sticky top-0 z-10',
    },
    {
      name: 'AfterPartialAfford',
      label: '部分負擔',
      align: 'center',
      field: 'AfterPartialAfford',
      headerClasses: 'sticky top-0 z-10',
    },
    {
      name: 'AfterPayTypeName',
      label: '給付類別',
      align: 'center',
      field: 'AfterPayTypeName',
      headerClasses: 'sticky top-0 z-10',
    },
    {
      name: 'ChangeUserName',
      label: '異動人員',
      align: 'center',
      field: 'ChangeUserName',
      headerClasses: 'sticky top-0 z-10',
    },
    {
      name: 'CreateDatetime',
      label: '異動日期時間',
      align: 'center',
      field: (row) =>
        dayjs(row.CreateDatetime).isValid()
          ? dayjs(row.CreateDatetime).format('YYYY-MM-DD HH:mm:ss')
          : row.CreateDatetime,
      headerClasses: 'sticky top-0 z-10',
    },
  ]
})

const rows = ref([])

// 歷程列表
const tableLoading = ref(false)

const GetIpdIdentityChange = async () => {
  try {
    tableLoading.value = true
    const query = `?$filter= IpdId eq '${route.params.ipdId}'`
    const res = await getIpdIdentityChange(query)
    if (res.status === 200) {
      rows.value = res.data.Items
    }
  } catch (err) {
    console.log(err)
  } finally {
    tableLoading.value = false
  }
}

const initData = {
  IpdId: route.params.ipdId,
  ChangeDate: dayjs(new Date()).format(),
  AfterIdentity: null,
  AfterIdentityDiscount: null,
  AfterPartialAfford: null,
  AfterPayType: null,
}

const identityData = reactive(cloneDeep(initData))

const afterIdentity = ref(null)

// 就診身分
const filterLoading = ref(false)
const identityItems = ref([])
const identityFilterKeys = ['Name']
const GetIdentityList = async () => {
  try {
    filterLoading.value = true
    const res = await getIdentityList()
    if (res.data) identityItems.value = res.data
  } catch (err) {
    console.log(err)
  }
}

const { filterItems: identityFilterItems, filterHandler: onIdentityFilter } = useFilter(
  { items: identityItems, filterKeys: identityFilterKeys },
  () => {
    filterLoading.value = false
  }
)

const identityChange = (val) => {
  if (!val) {
    identityData.AfterIdentity = null
    identityData.AfterPartialAfford = null
  } else {
    identityData.AfterIdentity = val.No
    GetPartialAffordPrice(val)
  }
}

// 折扣身分
const discountItems = ref([])
const discountFilterKeys = ['Name']
const GetIdentityDiscount = async () => {
  try {
    filterLoading.value = true
    const res = await getIdentityDiscount()
    if (res.data) discountItems.value = res.data
  } catch (err) {
    console.log(err)
  }
}

const { filterItems: discountFilterItems, filterHandler: onDiscountFilter } = useFilter(
  { items: discountItems, filterKeys: discountFilterKeys },
  () => {
    filterLoading.value = false
  }
)

// 部分負擔
const affordPriceLoading = ref(false)

const GetPartialAffordPrice = async (val) => {
  try {
    affordPriceLoading.value = true
    const query = `?code=${val.Name}&ItemId=5`
    const res = await getPartialAffordPrice(query)
    if (res.status === 200) {
      identityData.AfterPartialAfford = res.data[0].Fee
    }
  } catch (err) {
    console.log(err)
  } finally {
    affordPriceLoading.value = false
  }
}

//給付類別
const payTypeItems = ref([])
const payTypeFilterKeys = ['Name']

const GetPayTypeDropdown = async () => {
  try {
    filterLoading.value = true
    const res = await getPayTypeDropdown()
    if (res.data) payTypeItems.value = res.data
  } catch (err) {
    console.log(err)
  }
}

const { filterItems: payTypeFilterItems, filterHandler: onPayTypeFilter } = useFilter(
  { items: payTypeItems, filterKeys: payTypeFilterKeys },
  () => {
    filterLoading.value = false
  }
)

// 修改身分
const editLoading = ref(false)

const dataValid = () => {
  return (
    !!identityData.AfterIdentity ||
    !!identityData.AfterIdentityDiscount ||
    !!identityData.AfterPartialAfford ||
    !!identityData.AfterPayType
  )
}

const PostIpdIdentityChange = async () => {
  if (dataValid() === true) {
    try {
      editLoading.value = true
      const body = {
        IpdId: identityData.IpdId,
        ChangeDate: identityData.ChangeDate,
        AfterIdentity: identityData.AfterIdentity ? identityData.AfterIdentity : ipdStore.ipdData.Identity,
        AfterIdentityDiscount: identityData.AfterIdentityDiscount
          ? identityData.AfterIdentityDiscount
          : ipdStore.ipdData.IdentityDiscount,
        AfterPartialAfford: identityData.AfterPartialAfford
          ? identityData.AfterPartialAfford
          : ipdStore.ipdData.PartialAfford,
        AfterPayType: identityData.AfterPayType ? identityData.AfterPayType : ipdStore.ipdData.PayType,
      }
      const res = await postIpdIdentityChange(body)
      if (res.status === 204) {
        $q.notify({
          type: 'positive',
          message: '身分修改成功',
          position: 'top',
        })
        GetIpdRecordItem()
        GetIpdIdentityChange()
      }
    } catch (err) {
      console.log(err)
      $q.notify({
        type: 'negative',
        message: '身分修改失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
        position: 'top',
      })
    } finally {
      editLoading.value = false
    }
  } else {
    $q.notify({
      type: 'negative',
      message: '請至少輸入一項身分變更',
      position: 'top',
    })
  }
}

// 取得病患資訊
const originLoading = ref(false)

const GetIpdRecordItem = async () => {
  try {
    originLoading.value = true
    const res = await getIpdRecordItem(route.params.ipdId)
    if (res.data) {
      ipdStore.setIpdData(res.data)
    }
  } catch (err) {
    console.log(err)
  } finally {
    originLoading.value = false
  }
}

const init = () => {
  GetIdentityList()
  GetIdentityDiscount()
  GetPayTypeDropdown()
  GetIpdIdentityChange()
}

init()
</script>

