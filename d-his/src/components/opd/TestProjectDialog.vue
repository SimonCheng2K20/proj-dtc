<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss full-width>
    <my-dialog-content header="試辦計畫" @close="onDialogCancel">
      <q-table
        ref="tableRef"
        v-bind="QTableProps"
        :rows="tableData"
        :columns="columns"
        :pagination="{ rowsPerPage: 0 }"
      >
        <template #header="">
          <q-tr>
            <q-th rowspan="2" class="w-[60px]">序號</q-th>
            <q-th rowspan="2">計畫情形</q-th>
            <q-th colspan="3">特定治療項代號</q-th>
            <q-th rowspan="2">案件分類</q-th>
          </q-tr>
          <q-tr>
            <q-th style="border: 1px solid #215cba66; border-width: 0 0 1px 1px">欄位(一)</q-th>
            <q-th>欄位(二)</q-th>
            <q-th>欄位(三)</q-th>
          </q-tr>
        </template>
        <template #body-cell-index="{ rowIndex }">
          <q-td>
            <div class="text-center">
              {{ rowIndex + 1 }}
            </div>
          </q-td>
        </template>
        <!-- <template v-slot:bottom>
          <my-pagination class="mx-auto p-4" v-model="pagination" v-on:update:model-value="pageChange"></my-pagination>
        </template> -->
      </q-table>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { QTableProps, QSelectProps, QInputProps } from 'utils/quasar-extends/base-props.js'
import setSearchQuery from 'src/utils/setSearchQuery'
import { getSpecialTherapy } from 'api'

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()
const props = defineProps({
  DclDepartmentNo: String,
})

// const pagination = ref({ page: 1, rowsPerPage: 10, rowsNumber: 0 })
const columns = [
  { name: 'index', label: '序號', field: 'index', align: 'center' },
  { name: 'PlanText', label: '計畫情形', field: 'PlanText', align: 'center' },
  {
    name: 'CureItemNo1',
    label: '特定治療項代號\n欄位(一)',
    field: 'CureItemNo1',
    align: 'center',
    headerClasses: 'whitespace-pre',
  },
  {
    name: 'CureItemNo2',
    label: '特定治療項代號\n欄位(二)',
    field: 'CureItemNo2',
    align: 'center',
    headerClasses: 'whitespace-pre',
  },
  {
    name: 'CureItemNo3',
    label: '特定治療項代號\n欄位(三)',
    field: 'CureItemNo3',
    align: 'center',
    headerClasses: 'whitespace-pre',
  },
  { name: 'CaseType', label: '案件分類', field: 'CaseType', align: 'center' },
]
const tableData = ref([])
const GetSpecialTherapy = async () => {
  const query = setSearchQuery({
    $top: 50,
    $skip: 133,
  })
  try {
    const res = await getSpecialTherapy(query)
    if (res.status === 200) {
      tableData.value = res.data.Items
      if (props.DclDepartmentNo === '60') {
        tableData.value = tableData.value.filter((d) => {
          return d.PlanText.includes('中醫')
        })
      }
    }
  } catch (err) {
    console.log(err)
  }
}
const init = () => {
  GetSpecialTherapy()
}
init()
</script>

<style lang="scss" scoped></style>

