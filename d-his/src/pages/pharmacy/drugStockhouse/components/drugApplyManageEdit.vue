<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss full-width full-height>
    <my-dialog-content :header="editHeader" width="90vw" @close="onDialogCancel" :loading="getDataLoading">
      <div class="pb-2">
        <my-input-group class="grid gap-2 grid-cols-4 p-2" style="width: 100%">
          <my-input-wrapper label="申領日期">
            <my-date-input
              v-bind="QInputProps"
              readonly
              bg-color="blue-grey-1"
              mask="date"
              v-model="editItem.ApplyDate"
            >
            </my-date-input>
          </my-input-wrapper>
          <my-input-wrapper label="申領單號">
            <q-input readonly bg-color="blue-grey-1" v-bind="QInputProps" v-model="editItem.ApplyId"></q-input>
          </my-input-wrapper>
          <my-input-wrapper label="申領人員">
            <q-select
              readonly
              bg-color="blue-grey-1"
              v-bind="QSelectProps"
              :options="options"
              v-model="editItem.PersonId"
            ></q-select>
          </my-input-wrapper>
          <my-input-wrapper label="申領藥房">
            <q-select
              readonly
              bg-color="blue-grey-1"
              v-bind="QInputProps"
              :options="pharmacyOptions"
              v-model="editItem.PharmacyId"
              emit-value
              map-options
              option-value="PharmacyId"
              option-label="CName"
              :loading="pharmacyIdLoading"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-italic text-grey"> 無資料 </q-item-section>
                </q-item>
              </template>
            </q-select>
          </my-input-wrapper>
          <template v-if="editType === 'view' && editItem.Status === 1">
            <my-input-wrapper label="申領單完成時間">
              <my-date-input
                v-bind="QInputProps"
                readonly
                bg-color="blue-grey-1"
                mask="date"
                v-model="editItem.ApplyDate"
              >
              </my-date-input>
            </my-input-wrapper>
            <my-input-wrapper label="申領單狀態">
              <q-input readonly bg-color="blue-grey-1" v-bind="QInputProps" v-model="editItem.StatusName"></q-input>
            </my-input-wrapper>
          </template>

          <template v-if="editType === 'view' && editItem.Status === -1">
            <my-input-wrapper label="刪除日期">
              <my-date-input
                v-bind="QInputProps"
                readonly
                bg-color="blue-grey-1"
                mask="date"
                v-model="editItem.DeleteDatetime"
              >
              </my-date-input>
            </my-input-wrapper>
            <my-input-wrapper label="刪除申領單人員">
              <q-input
                readonly
                bg-color="blue-grey-1"
                v-bind="QInputProps"
                v-model="editItem.DeletePersonName"
              ></q-input>
            </my-input-wrapper>
          </template>
          <my-input-wrapper v-if="editItem.Status === 0" label="庫房出庫人">
            <q-select
              readonly
              bg-color="blue-grey-1"
              v-bind="QSelectProps"
              :options="options"
              option-label="Name"
              option-value="No"
              emit-value
              map-options
              v-model="editItem.ShipPersonId"
            ></q-select>
          </my-input-wrapper>
        </my-input-group>
      </div>

      <q-table
        v-bind="QTableProps"
        style="max-height: 550px"
        :rows="editItem.StoreStockApplyDetails"
        :columns="columns"
        virtual-scroll
        :rows-per-page-options="[0]"
      >
        <template #body-cell-Index="{ rowIndex, col }">
          <q-td :props="{ rowIndex, col }">
            {{ rowIndex + 1 }}
          </q-td>
        </template>
      </q-table>

      <Stamp
        v-if="editType === 'view' && editItem.Status === 1"
        :title="'庫房出庫人'"
        :content="editItem.ShipPersonName"
      ></Stamp>

      <template #actions>
        <q-btn unelevated color="grey" label="取消" @click="onDialogCancel"></q-btn>
        <q-btn
          v-if="editType === 'edit'"
          unelevated
          color="primary"
          label="確定出庫"
          :loading="editLoading"
          :disable="getDataLoading"
          @click="OnSaveClick('確定出庫此筆申領單?')"
        ></q-btn>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>
<script setup>
import { ref, reactive, computed } from 'vue'
import { useAuthStore } from 'stores/auth'
import { useDialogPluginComponent, useQuasar } from 'quasar'

// api
import { putStoreStockApplyShip, getDrugStore, getStoreStockApplyItem } from 'api'

// utils
import { QInputProps, QSelectProps, QTableProps } from 'utils/quasar-extends/base-props.js'

// components
import Stamp from '../../components/stamp.vue'

const $q = useQuasar()

const authStore = useAuthStore()

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const qDateProxy = ref()

const props = defineProps({
  editType: String,
  id: [String, Number],
})

// 申領人員
const options = [{ No: 'datacom', Name: 'datacom' }]

const columns = computed(() => {
  return [
    {
      name: 'Index',
      label: '序號',
      align: 'center',
      field: 'Index',
      headerClasses: 'sticky top-0 z-10',
      style: 'width:50px;',
    },
    {
      name: 'NhiCode',
      label: '健保代碼',
      align: 'center',
      field: 'NhiCode',
      headerClasses: 'sticky top-0 z-10',
      style: 'width:200px',
    },
    {
      name: 'MedicineId',
      label: '院內代碼',
      align: 'center',
      field: 'MedicineId',
      headerClasses: 'sticky top-0 z-10',
      style: 'width:200px',
    },
    {
      name: 'CName',
      label: '中文藥名',
      align: 'center',
      field: 'CName',
      headerClasses: 'sticky top-0 z-10',
      style: 'white-space:pre-wrap;',
    },
    {
      name: 'EName',
      label: '英文藥名',
      align: 'center',
      field: 'EName',
      headerClasses: 'sticky top-0 z-10',
      style: 'white-space:pre-wrap;',
    },
    {
      name: 'ApplyAmount',
      label: '申領數量',
      align: 'center',
      field: 'ApplyAmount',
      headerClasses: 'sticky top-0 z-10',
      style: 'width:200px',
    },
  ]
})

const editHeader = computed(() => {
  switch (props.editType) {
    case 'edit':
      return `藥房申領單明細`
    case 'view':
      return `檢視申領單`
    case 'delete':
      return `刪除申領單紀錄`
    default:
      return null
  }
})

const editItem = reactive({
  ApplyId: null,
  PharmacyId: null,
  ApplyDate: null,
  PersonId: null,
  Status: 0,
  ShipPersonId: null,
  ShipPersonName: null,
  StoreStockApplyDetails: [],
})

// 獲取申領單資料
const getDataLoading = ref(false)

const GetStoreStockApplyItem = async () => {
  try {
    getDataLoading.value = true
    const res = await getStoreStockApplyItem(props.id)
    if (res.status === 200) {
      Object.assign(editItem, res.data)
    }
  } catch (err) {
    console.log(err)
  } finally {
    getDataLoading.value = false
  }
}

const OnSaveClick = (remind) => {
  if (confirm(remind)) {
    PutStoreStockApplyShip()
  }
}

// 出庫
const editLoading = ref(false)

const PutStoreStockApplyShip = async () => {
  try {
    editLoading.value = true
    const body = {
      ApplyId: editItem.ApplyId,
      ShipPersonId: editItem.ShipPersonId,
    }
    const res = await putStoreStockApplyShip(body)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '申領單出庫成功',
        position: 'top',
      })
      onDialogOK()
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '申領單出庫失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

// 藥房列表
const pharmacyOptions = ref([])

const pharmacyIdLoading = ref(false)

const GetDrugStore = async () => {
  try {
    pharmacyIdLoading.value = true
    const res = await getDrugStore()
    if (res.status === 200) {
      pharmacyOptions.value = res.data.Items
    }
  } catch (err) {
    console.log(err)
  } finally {
    pharmacyIdLoading.value = false
  }
}

const init = async () => {
  await GetDrugStore()
  await GetStoreStockApplyItem()
  if (props.editType === 'edit') {
    editItem.ShipPersonId = authStore.userData.No
  }
}

init()
</script>
<style lang="scss">
.my-sticky-header-table {
  max-height: 600px;

  thead tr th {
    position: sticky;
    z-index: 1;
    top: 0;
  }
}
</style>
