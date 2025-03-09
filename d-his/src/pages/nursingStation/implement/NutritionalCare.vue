<template>
  <div>
    <header-bar @scanPatient="scanPatient"></header-bar>
    <q-table v-bind="QTableProps" :columns="columns" :rows="rows" :pagination="pagination" :loading="tableLoading">
      <template #top>
        <div>管灌及營養照護紀錄</div>
        <q-space></q-space>
        <q-btn color="add" label="新增紀錄" icon="add" unelevated dense @click="toAdd"></q-btn>
      </template>
      <template #body-cell-action="{ col, row }">
        <q-td :props="{ col }">
          <q-btn class="mr-1" color="edit" @click="toEdit(row)" label="編輯" unelevated dense></q-btn>
          <q-btn color="delete" @click="toDelete(row)" label="刪除" unelevated dense></q-btn>
        </q-td>
      </template>

      <template v-slot:bottom>
        <my-pagination
          class="mx-auto p-4"
          v-model="pagination"
          v-on:update:model-value="GetIpdNasogastricTube"
        ></my-pagination>
      </template>
    </q-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { QTableProps } from 'utils/quasar-extends/base-props.js'
import EditItem from './components/NutritionalCareEditItem.vue'
import { useQuasar } from 'quasar'
import headerBar from './components/headerBar.vue'
import setSearchQuery from 'utils/setSearchQuery.js'
import { getIpdNasogastricTube, getProcedure } from 'api'
import { useAuthStore } from 'stores/auth'
import { useRoute } from 'vue-router'
import numberFormat from 'utils/numberFormat.js'

const route = useRoute()
const authStore = useAuthStore()
const $q = useQuasar()

const columns = [
  { name: 'action', label: '操作', field: 'action', align: 'center' },
  {
    name: 'ExecutionDateTime',
    label: '執行日期時間',
    field: (row) => row.ExecutionDateTime?.substring(0, 10),
    align: 'left',
  },
  { name: 'ProcedureName', label: '診療項目', field: 'ProcedureName', align: 'left' },
  { name: 'NhiCode', label: '健保代碼', field: 'NhiCode', align: 'left' },
  { name: 'AfterNhiPoint', label: '健保點數', field: (row) => numberFormat(row.AfterNhiPoint), align: 'right' },
]

const tableLoading = ref(false)
const rows = ref([])

const GetIpdNasogastricTube = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      ipdId: route.params.ipdId,
    })
    const res = await getIpdNasogastricTube(query)
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

const scanPatient = (scanPatientSuccess) => {
  if (scanPatientSuccess) {
    GetIpdVitalSign()
  }
}

const toAdd = () => {
  const dialog = $q
    .dialog({
      component: EditItem,
      componentProps: {
        editType: 'add',
        ipdId: route.params.ipdId,
        procedureItems: procedureItems,
      },
    })
    .onOk(() => {
      dialog.hide()
      pagination.value.page = 1
      GetIpdNasogastricTube()
    })
}

const toEdit = (row) => {
  const dialog = $q
    .dialog({
      component: EditItem,
      componentProps: {
        editType: 'edit',
        ipdId: route.params.ipdId,
        id: row.Id,
        procedureItems: procedureItems,
      },
    })
    .onOk(() => {
      dialog.hide()
      GetIpdNasogastricTube()
    })
}

const toDelete = (row) => {
  const dialog = $q
    .dialog({
      component: EditItem,
      componentProps: {
        editType: 'delete',
        ipdId: route.params.ipdId,
        id: row.Id,
        procedureItems: procedureItems,
      },
    })
    .onOk(() => {
      dialog.hide()
      const prePage = pagination.value.page - 1
      if (prePage > 0) {
        if (pagination.value.rowsNumber - 1 <= prePage * pagination.value.rowsPerPage) pagination.value.page = prePage
      }
      GetIpdNasogastricTube()
    })
}

const procedureItems = ref([])

const GetProcedure = async () => {
  try {
    const query = setSearchQuery({
      $filter: `NhiChap eq '1' and NhiSect eq '1-5' and HospitalLevel eq '${authStore.organizeData.LevelId}'`,
    })
    const res = await getProcedure(query)
    procedureItems.value = res.data.Items
  } catch (error) {
    console.log(error)
  }
}

const init = () => {
  GetIpdNasogastricTube()
  GetProcedure()
}
init()
</script>

