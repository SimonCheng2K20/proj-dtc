<template>
  <q-table
    ref="tableRef"
    v-bind="QTableProps"
    :rows="rows"
    :columns="columns"
    row-key="Id"
    :pagination="pagination"
    :loading="tableLoading"
    v-touch-pan.prevent.mouse="dragScrollHandler"
    wrap-cells
  >
    <template #top>
      <div class="text-xl font-bold">食物過敏記錄</div>
      <q-space></q-space>
      <q-btn color="add" label="新增藥品過敏記錄" dense unelevated @click="toAdd"></q-btn>
    </template>

    <template v-slot:body-cell-action="{ col, row }">
      <q-td :props="{ col }">
        <!-- <q-btn class="mr-1" color="edit" @click="toEdit(row)" label="編輯" unelevated dense></q-btn> -->
        <q-btn color="delete" @click="toDelete(row)" label="刪除" unelevated dense></q-btn>
      </q-td>
    </template>
    <template v-slot:bottom> <my-pagination class="mx-auto p-4" v-model="pagination" v-on:update:model-value="GetPatientFoodAllergy"></my-pagination> </template
  ></q-table>
</template>
<script setup="">
import { getPatientFoodAllergy } from 'api'
import { ref, watch, computed } from 'vue'
import setSearchQuery from 'utils/setSearchQuery.js'
import { useQuasar } from 'quasar'
import EditItem from './PatientFoodAllergyManageEditItem.vue'
import { QTableProps } from 'utils/quasar-extends/base-props.js'

const $q = useQuasar()
const props = defineProps({
  patientId: String,
})

const tableRef = ref()
const tableMiddleRef = ref()
const unwatch = watch(tableRef, (val) => {
  tableMiddleRef.value = val.$el.querySelector('.q-table__middle')
  unwatch()
})

const dragScrollHandler = (evt) => {
  tableMiddleRef.value.scrollLeft -= evt.delta.x
}

const columns = [
  { name: 'action', label: '操作', field: 'action', align: 'center', headerClasses: 'min-w-[60px]' },
  { name: 'FoodName', label: '食品名稱', field: 'FoodName', align: 'left', headerClasses: 'min-w-[60px]' },
  { name: 'Remark', label: '備註', field: 'Remark', align: 'left', headerClasses: 'min-w-[60px]' },
  { name: 'Writer', label: '寫入者', field: 'Writer', align: 'left', headerClasses: 'min-w-[60px]' },
  { name: 'WriteDate', label: '建立日期', field: (row) => row.WriteDate?.substring(0, 10), align: 'left', headerClasses: 'min-w-[60px]' },
  { name: 'Remover', label: '移除者', field: 'Remover', align: 'left', headerClasses: 'min-w-[60px]' },
  { name: 'RemoveDate', label: '移除日期', field: (row) => row.RemoveDate?.substring(0, 10), align: 'left', headerClasses: 'min-w-[60px]' },
]

const tableLoading = ref(false)
const rows = ref([])
const GetPatientFoodAllergy = async () => {
  try {
    tableLoading.value = true
    const query = setSearchQuery({
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
      $filter: `PatientId eq '${props.patientId}'`,
      $orderBy: orderBy.value,
    })
    const res = await getPatientFoodAllergy(query)
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

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

const sortBy = ref([])
const orderBy = computed(() => {
  return sortBy.value.map((item) => item.join(' ')).join(',')
})

const toAdd = () => {
  const dialog = $q
    .dialog({
      component: EditItem,
      componentProps: {
        editType: 'add',
        patientId: props.patientId,
      },
    })
    .onOk(() => {
      dialog.hide()
      pagination.value.page = 1
      GetPatientFoodAllergy()
    })
}

const toEdit = (row) => {
  const dialog = $q
    .dialog({
      component: EditItem,
      componentProps: {
        editType: 'edit',
        id: row.Id,
        patientId: props.patientId,
      },
    })
    .onOk(() => {
      dialog.hide()
      GetPatientFoodAllergy()
    })
}

const toDelete = (row) => {
  const dialog = $q
    .dialog({
      component: EditItem,
      componentProps: {
        editType: 'delete',
        id: row.Id,
      },
    })
    .onOk(() => {
      dialog.hide()
      const prePage = pagination.value.page - 1
      if (prePage > 0) {
        if (pagination.value.rowsNumber - 1 <= prePage * pagination.value.rowsPerPage) pagination.value.page = prePage
      }
      GetPatientFoodAllergy()
    })
}

const init = () => {
  if (props.patientId) {
    GetPatientFoodAllergy()
  } else {
    const unwatch = watch(
      () => props.patientId,
      (val) => {
        if (val) {
          GetPatientFoodAllergy()
          unwatch()
        }
      }
    )
  }
}
init()
</script>

