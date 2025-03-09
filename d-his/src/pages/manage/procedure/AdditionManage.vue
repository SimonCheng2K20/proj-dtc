<template>
  <q-page>
    <my-title noFixed title="醫療服務給付項目加成維護"></my-title>

    <div class="p-2">
      <my-search-area @searchSubmit="searchSubmit" @searchClear="searchClear" gridCols="4">
        <my-input-wrapper label="院所等級">
          <q-select
            v-bind="QSelectProps"
            v-model="search.HospitalLevel"
            :options="hospitalLevelDropdown"
            optionLabel="Name"
            optionValue="No"
            emit-value
            map-options
            @update:model-value="searchSubmit"
          ></q-select>
        </my-input-wrapper>
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
        <my-input-wrapper label="健保醫令分項">
          <my-filter-select
            v-bind="QSelectProps"
            v-model="search.NhiItem"
            :options="nhiItemDropdown"
            @update:model-value="searchSubmit"
          >
          </my-filter-select>
        </my-input-wrapper>

        <template #btn-expand>
          <q-btn label="新增資料" color="add" icon="add" @click="toAdd" unelevated></q-btn>
        </template>
      </my-search-area>

      <q-table
        class="mt-2"
        v-bind="QTableProps"
        :rows="rows"
        :columns="columns"
        :pagination="pagination"
        :loading="tableLoading"
      >
        <template v-slot:body-cell-action="{ col, row }">
          <q-td :props="{ col }">
            <q-btn class="mr-1" color="edit" @click="toEdit(row)" label="編輯" unelevated dense></q-btn>
            <q-btn color="delete" @click="toDelete(row)" label="刪除" unelevated dense></q-btn>
          </q-td>
        </template>
        <template v-slot:bottom>
          <my-pagination
            class="mx-auto p-4"
            v-model="pagination"
            v-on:update:model-value="GetProcedureRate"
          ></my-pagination>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup>
import { getProcedureRate, getHospitalLevelDropdown, getRelationNhiSectDropdown, getRelationNhiItemDropdown } from 'api'
import { ref, reactive, computed } from 'vue'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { cloneDeep } from 'lodash-es'
import { useQuasar } from 'quasar'
import EditItem from './components/AdditionEditItem.vue'
import { QSelectProps, QTableProps } from 'utils/quasar-extends/base-props.js'

const $q = useQuasar()

const columns = [
  { name: 'action', label: '操作', field: 'action', align: 'center' },
  {
    name: 'HospitalLevel',
    label: '院所等級',
    field: (row) => hospitalLevelDropdown.value.find(({ No }) => No === row.HospitalLevel)?.Name,
    align: 'center',
  },
  { name: 'NhiChapCn', label: '健保醫令分章', field: 'NhiChapCn', align: 'center' },
  { name: 'NhiSectCn', label: '健保醫令分節', field: 'NhiSectCn', align: 'center' },
  { name: 'NhiItemCn', label: '健保醫令分項', field: 'NhiItemCn', align: 'center' },
]

const tableLoading = ref(false)
const rows = ref([])
const GetProcedureRate = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: filter.value,
      $orderBy: orderBy.value,
    })
    const res = await getProcedureRate(query)
    rows.value = res.data.Items
    pagination.value.rowsNumber = res.data.Count
  } catch (err) {
    console.log(err)
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
  HospitalLevel: null,
  NhiChap: null,
  NhiSect: null,
  NhiItem: null,
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {
  const str = Object.entries(search)
    .reduce((filterArray, [key, value]) => {
      if (isValidSearchValue(value)) {
        switch (key) {
          case 'HospitalLevel':
          case 'NhiChap':
          case 'NhiSect':
          case 'NhiItem':
            return filterArray.concat(setOdataFilter({ key, value, operator: 'eq' }))
          default:
            return filterArray
        }
      } else {
        return filterArray
      }
    }, [])
    .join(' and ')

  return str
})

const sortBy = ref([
  ['NhiChap', 'asc'],
  ['NhiSect', 'asc'],
  ['NhiItem', 'asc'],
])
const orderBy = computed(() => {
  return sortBy.value.map((item) => item.join(' ')).join(',')
})

const searchSubmit = () => {
  pagination.value.page = 1
  GetProcedureRate()
}

const searchClear = () => {
  Object.assign(search, cloneDeep(initData.search))
  pagination.value.page = 1
  GetProcedureRate()
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
      GetProcedureRate()
    })
}

const toEdit = (row) => {
  const dialog = $q
    .dialog({
      component: EditItem,
      componentProps: {
        editType: 'edit',
        id: `HospitalLevel(${row.HospitalLevel}),NhiChap(${row.NhiChap}),NhiSect(${row.NhiSect}),NhiItem(${row.NhiItem})`,
      },
    })
    .onOk(() => {
      dialog.hide()
      GetProcedureRate()
    })
}

const toDelete = (row) => {
  const dialog = $q
    .dialog({
      component: EditItem,
      componentProps: {
        editType: 'delete',
        id: `HospitalLevel(${row.HospitalLevel}),NhiChap(${row.NhiChap}),NhiSect(${row.NhiSect}),NhiItem(${row.NhiItem})`,
      },
    })
    .onOk(() => {
      dialog.hide()
      const prePage = pagination.value.page - 1
      if (prePage > 0) {
        if (pagination.value.rowsNumber - 1 <= prePage * pagination.value.rowsPerPage) pagination.value.page = prePage
      }
      GetProcedureRate()
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

const init = async () => {
  GetProcedureRate()
  GetHospitalLevelDropdown()
}
init()
</script>

