<template>
  <q-page>
    <my-title title="醫令資料維護" no-fixed></my-title>

    <div class="p-2">
      <my-search-area gridCols="3" @searchSubmit="searchSubmit" @searchClear="searchClear">
        <my-input-wrapper label="健保醫令分章">
          <my-filter-select
            v-bind="QSelectProps"
            v-model="search.NhiChap"
            list-key="nhiChap"
            @update:model-value="
              (val) => {
                if (val) GetRelationNhiSectDropdown({ code: val })
                nhiSectDropdown = []
                nhiItemDropdown = []
                search.NhiSect = null
                search.NhiItem = null
                searchSubmit()
              }
            "
          >
          </my-filter-select>
        </my-input-wrapper>
        <my-input-wrapper label="健保醫令分節">
          <my-filter-select
            v-bind="QSelectProps"
            v-model="search.NhiSect"
            :options="nhiSectDropdown"
            @update:model-value="
              (val) => {
                if (val) GetRelationNhiItemDropdown({ code: val })
                nhiItemDropdown = []
                search.NhiItem = null
                searchSubmit()
              }
            "
          >
          </my-filter-select>
        </my-input-wrapper>
        <my-input-wrapper label="健保醫令分項" v-if="search.NhiChap === '2'">
          <my-filter-select
            v-bind="QSelectProps"
            v-model="search.NhiItem"
            :options="nhiItemDropdown"
            @update:model-value="searchSubmit"
          >
          </my-filter-select>
        </my-input-wrapper>
        <my-input-wrapper label="健保醫令代碼">
          <q-input v-bind="QInputProps" v-model="search.ProcedureCode" @keydown.enter="searchSubmit"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="診療項目中文">
          <q-input v-bind="QInputProps" v-model="search['ProcedureCname']" @keydown.enter="searchSubmit"></q-input>
        </my-input-wrapper>
        <my-input-wrapper label="診療項目英文">
          <q-input v-bind="QInputProps" v-model="search['ProcedureEname']" @keydown.enter="searchSubmit"></q-input>
        </my-input-wrapper>

        <template #btn-expand>
          <q-btn label="新增資料" icon="add" color="add" @click="toAdd" unelevated></q-btn>
        </template>
      </my-search-area>

      <q-table
        class="mt-2"
        v-bind="QTableProps"
        :rows="rows"
        :columns="columns"
        row-key="ProcedureCode"
        :pagination="pagination"
        :loading="tableLoading"
      >
        <template #body-cell-action="{ col, row }">
          <q-td :props="{ col }">
            <q-btn class="mr-1" color="edit" @click="toEdit(row)" label="編輯" unelevated dense></q-btn>
            <q-btn color="delete" @click="toDelete(row)" label="刪除" unelevated dense></q-btn>
          </q-td>
        </template>
        <template #body-cell-HospitalLevel-1="{ col, value }">
          <q-td :props="{ col }">
            <q-icon :name="value ? 'check_box' : 'check_box_outline_blank'" size="md" color="primary"></q-icon>
          </q-td>
        </template>
        <template #body-cell-HospitalLevel-2="{ col, value }">
          <q-td :props="{ col }">
            <q-icon :name="value ? 'check_box' : 'check_box_outline_blank'" size="md" color="primary"></q-icon>
          </q-td>
        </template>
        <template #body-cell-HospitalLevel-3="{ col, value }">
          <q-td :props="{ col }">
            <q-icon :name="value ? 'check_box' : 'check_box_outline_blank'" size="md" color="primary"></q-icon>
          </q-td>
        </template>
        <template #body-cell-HospitalLevel-4="{ col, value }">
          <q-td :props="{ col }">
            <q-icon :name="value ? 'check_box' : 'check_box_outline_blank'" size="md" color="primary"></q-icon>
          </q-td>
        </template>
        <template #body-cell-Status="{ col, value }">
          <q-td :props="{ col }"> {{ value ? '啟用' : '未啟用' }} </q-td>
        </template>

        <template v-slot:bottom>
          <my-pagination
            class="mx-auto p-4"
            v-model="pagination"
            v-on:update:model-value="GetProcedure"
          ></my-pagination>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup>
import EditItem from './components/ProcedureManageEditItem.vue'
import {
  getProcedure,
  getHospitalLevelDropdown,
  getRelationNhiSectDropdown,
  getRelationNhiItemDropdown,
  getOrganization,
} from 'api'
import { reactive, ref, computed } from 'vue'
import { cloneDeep } from 'lodash-es'
import { useQuasar } from 'quasar'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import numberFormat from 'utils/numberFormat'
import { QInputProps, QSelectProps, QTableProps } from 'utils/quasar-extends/base-props.js'

const $q = useQuasar()

const columns = computed(() => {
  const levelList = [
    { name: 'HospitalLevel-4', label: '基層院所', field: 'HospitalLevel-4', align: 'center' },
    { name: 'HospitalLevel-3', label: '地區醫院', field: 'HospitalLevel-3', align: 'center' },
    { name: 'HospitalLevel-2', label: '區域醫院', field: 'HospitalLevel-2', align: 'center' },
    { name: 'HospitalLevel-1', label: '醫學中心', field: 'HospitalLevel-1', align: 'center' },
  ]
  const arr = [
    { name: 'action', label: '操作', field: 'action', align: 'left', headerClasses: 'min-w-[104px]' },
    { name: 'NhiSectCn', label: '健保醫令分節', field: 'NhiSectCn', align: 'left' },
    { name: 'NhiCode', label: '健保醫令代碼', field: 'NhiCode', align: 'left' },
    { name: 'ProcedureCode', label: '院內醫令代碼', field: 'ProcedureCode', align: 'left' },
    { name: 'ChronicCode', label: '特別診療代碼', field: 'ChronicCode', align: 'left' },
    { name: 'ProcedureCname', label: '診療項目中文', field: (row) => row.ProcedureCname, align: 'left' },
    { name: 'ProcedureEname', label: '診療項目英文', field: (row) => row.ProcedureEname, align: 'left' },
    { name: 'AfterNhiPoint', label: '支付點數', field: (row) => numberFormat(row.AfterNhiPoint), align: 'right' },
    { name: 'AfterSelfPay', label: '自費金額', field: (row) => numberFormat(row.AfterSelfPay), align: 'right' },
    { name: 'Status', label: '啟用狀態', field: 'Status', align: 'left' },
  ]
  if (!search.HospitalLevel || search.HospitalLevel === '4') arr.splice(6, 0, levelList[0])
  if (!search.HospitalLevel || search.HospitalLevel === '3') arr.splice(6, 0, levelList[1])
  if (!search.HospitalLevel || search.HospitalLevel === '2') arr.splice(6, 0, levelList[2])
  if (!search.HospitalLevel || search.HospitalLevel === '1') arr.splice(6, 0, levelList[3])
  if (search.NhiChap === '2') {
    arr.splice(2, 0, {
      name: 'NhiItemCn',
      label: '健保醫令分項',
      field: 'NhiItemCn',
      align: 'left',
    })
  }

  return arr
})

const tableLoading = ref(false)
const rows = ref([])
const GetProcedure = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getProcedure(query)
    rows.value = res.data.Items.map((item) => ({
      ...item,
      'HospitalLevel-1': item.HospitalLevel === '1',
      'HospitalLevel-2': item.HospitalLevel === '2',
      'HospitalLevel-3': item.HospitalLevel === '3',
      'HospitalLevel-4': item.HospitalLevel === '4',
    }))
    pagination.value.rowsNumber = res.data.Count
  } catch (error) {
    console.log(error)
  } finally {
    tableLoading.value = false
  }
}

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

const initData = {}
initData.search = {
  NhiChap: null,
  NhiSect: null,
  NhiItem: null,
  HospitalLevel: null,
  ProcedureCode: null,
  ProcedureEname: null,
  ProcedureCname: null,
  Status: null,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  return Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'NhiChap':
          case 'NhiSect':
          case 'NhiItem':
          // case 'HospitalLevel':   不用下醫院等級了 後端那邊會自己判斷
          case 'Status':
            return filterArray.concat(setOdataFilter({ key, value, operator: 'eq' }))
          case 'ProcedureCode':
          case 'ProcedureEname':
          case 'ProcedureCname':
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

const sortBy = ref([])
const orderBy = computed(() => {
  return sortBy.value.map((item) => item.join(' ')).join(',')
})

const searchSubmit = () => {
  pagination.value.page = 1
  GetProcedure()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetProcedure()
}

const toAdd = () => {
  const dialog = $q
    .dialog({
      component: EditItem,
      componentProps: {
        editType: 'add',
      },
    })
    .onOk(() => {
      dialog.hide()
      pagination.value.page = 1
      GetProcedure()
    })
}

const toEdit = (row) => {
  const dialog = $q
    .dialog({
      component: EditItem,
      componentProps: {
        editType: 'edit',
        id: row.ProcedureId,
        data: row,
      },
    })
    .onOk(() => {
      dialog.hide()
      GetProcedure()
    })
}

const toDelete = (row) => {
  const dialog = $q
    .dialog({
      component: EditItem,
      componentProps: {
        editType: 'delete',
        id: row.ProcedureId,
        data: row,
      },
    })
    .onOk(() => {
      dialog.hide()
      const prePage = pagination.value.page - 1
      if (prePage > 0) {
        if (pagination.value.rowsNumber - 1 <= prePage * pagination.value.rowsPerPage) pagination.value.page = prePage
      }
      GetProcedure()
    })
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

const getNhiSectCount = ref(0)
const nhiSectDropdown = ref([])
const GetRelationNhiSectDropdown = async (qeuryOptions) => {
  getNhiSectCount.value++
  const selfCount = getNhiSectCount.value
  const query = setSearchQuery(qeuryOptions)
  await getRelationNhiSectDropdown(query).then(({ data }) => {
    if (data && selfCount === getNhiSectCount.value) {
      nhiSectDropdown.value = data
      getNhiSectCount.value = 0
    }
  })
}

const getNhiItemCount = ref(0)
const nhiItemDropdown = ref([])
const GetRelationNhiItemDropdown = async (qeuryOptions) => {
  getNhiItemCount.value++
  const selfCount = getNhiItemCount.value
  const query = setSearchQuery(qeuryOptions)
  await getRelationNhiItemDropdown(query).then(({ data }) => {
    if (data && selfCount === getNhiItemCount.value) {
      nhiItemDropdown.value = data
      getNhiItemCount.value = 0
    }
  })
}

const organization = reactive({
  LevelId: null,
})
const GetOrganization = async () => {
  try {
    const res = await getOrganization()
    Object.assign(organization, res.data)
    initData.search.HospitalLevel = organization.LevelId
    search.HospitalLevel = organization.LevelId
  } catch (err) {
    console.log(err)
  }
}

const init = async () => {
  GetHospitalLevelDropdown()
  await GetOrganization()
  GetProcedure()
}
init()
</script>

