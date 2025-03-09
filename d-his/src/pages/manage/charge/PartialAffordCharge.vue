<template>
  <q-page>
    <my-title no-fixed>
      <div>健保門急診部分負擔設定</div>
      <q-space></q-space>
      <q-btn color="primary" label="儲存" unelevated dense @click="onSaveClick" :loading="saveLoading"></q-btn>
    </my-title>

    <div class="p-2 grid gap-2">
      <q-table v-bind="QTableProps" :columns="columns" :rows="rows">
        <template #top>
          <div class="font-bold text-xl">藥品部分負擔（含慢性病連續處方箋第一次調劑）</div>
        </template>

        <template #body-cell-DrugFree="{ col, row }">
          <q-td :props="{ col }">
            <q-input v-bind="QInputProps" v-model="row.DrugFree" type="number"></q-input>
          </q-td>
        </template>
        <template #body-cell-DrugRatio="{ col, row }">
          <q-td :props="{ col }">
            <q-input v-bind="QInputProps" v-model="row.DrugRatio" type="number"></q-input>
          </q-td>
        </template>
        <template #body-cell-DrugUpper="{ col, row }">
          <q-td :props="{ col }">
            <q-input v-bind="QInputProps" v-model="row.DrugUpper" type="number"></q-input>
          </q-td>
        </template>
      </q-table>

      <q-table v-bind="QTableProps" :columns="columns2" :rows="rows">
        <template #top>
          <div class="font-bold text-xl">檢查（驗）部分負擔</div>
        </template>

        <template #body-cell-CheckFree="{ col, row }">
          <q-td :props="{ col }">
            <q-input v-bind="QInputProps" v-model="row.CheckFree" type="number"></q-input>
          </q-td>
        </template>
        <template #body-cell-CheckQuota="{ col, row }">
          <q-td :props="{ col }">
            <q-input v-bind="QInputProps" v-model="row.CheckQuota" type="number"></q-input>
          </q-td>
        </template>
        <template #body-cell-CheckRatio="{ col, row }">
          <q-td :props="{ col }">
            <q-input v-bind="QInputProps" v-model="row.CheckRatio" type="number"></q-input>
          </q-td>
        </template>
        <template #body-cell-CheckUpper="{ col, row }">
          <q-td :props="{ col }">
            <q-input v-bind="QInputProps" v-model="row.CheckUpper" type="number"></q-input>
          </q-td>
        </template>
        <template #body-cell-ReferralCheckQuota="{ col, row }">
          <q-td :props="{ col }">
            <q-input v-bind="QInputProps" v-model="row.ReferralCheckQuota" type="number"></q-input>
          </q-td>
        </template>
        <template #body-cell-ReferralCheckRatio="{ col, row }">
          <q-td :props="{ col }">
            <q-input v-bind="QInputProps" v-model="row.ReferralCheckRatio" type="number"></q-input>
          </q-td>
        </template>
        <template #body-cell-ReferralCheckUpper="{ col, row }">
          <q-td :props="{ col }">
            <q-input v-bind="QInputProps" v-model="row.ReferralCheckUpper" type="number"></q-input>
          </q-td>
        </template>
      </q-table>

      <q-table v-bind="QTableProps" :columns="columns3" :rows="rows">
        <template #top>
          <div class="font-bold text-xl">急診部分負擔</div>
        </template>

        <template #body-cell-EmrTriage1Fee="{ col, row }">
          <q-td :props="{ col }">
            <q-input v-bind="QInputProps" v-model="row.EmrTriage1Fee" type="number"></q-input>
          </q-td>
        </template>
        <template #body-cell-EmrTriage2Fee="{ col, row }">
          <q-td :props="{ col }">
            <q-input v-bind="QInputProps" v-model="row.EmrTriage2Fee" type="number"></q-input>
          </q-td>
        </template>
        <template #body-cell-EmrTriage3Fee="{ col, row }">
          <q-td :props="{ col }">
            <q-input v-bind="QInputProps" v-model="row.EmrTriage3Fee" type="number"></q-input>
          </q-td>
        </template>
        <template #body-cell-EmrTriage4Fee="{ col, row }">
          <q-td :props="{ col }">
            <q-input v-bind="QInputProps" v-model="row.EmrTriage4Fee" type="number"></q-input>
          </q-td>
        </template>
        <template #body-cell-EmrTriage5Fee="{ col, row }">
          <q-td :props="{ col }">
            <q-input v-bind="QInputProps" v-model="row.EmrTriage5Fee" type="number"></q-input>
          </q-td>
        </template>
      </q-table>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { getHospitalLevelDropdown, getSysLevelPartial, putSysLevelPartial } from 'api'
import { useQuasar } from 'quasar'
import { QInputProps, QTableProps } from 'src/utils/quasar-extends/base-props'

const $q = useQuasar()
const columns = [
  { name: 'LevelId', label: '院所等級/項目', field: (row) => hospitalLevelItems.value.find(({ No }) => No === row.LevelId)?.Name, align: 'left' },
  { name: 'DrugFree', label: '藥費以下免收（元）', field: 'DrugFree', align: 'left' },
  { name: 'DrugRatio', label: '部分負擔比例（%）', field: 'DrugRatio', align: 'left' },
  { name: 'DrugUpper', label: '上限（元）', field: 'DrugUpper', align: 'left' },
]

const columns2 = [
  { name: 'LevelId', label: '院所等級/項目', field: (row) => hospitalLevelItems.value.find(({ No }) => No === row.LevelId)?.Name, align: 'left' },
  { name: 'CheckFree', label: '檢查檢驗以下免收（元）', field: 'CheckFree', align: 'left' },
  { name: 'CheckQuota', label: '定額（元）', field: 'CheckQuota', align: 'left' },
  { name: 'CheckRatio', label: '部分負擔比例（%）', field: 'CheckRatio', align: 'left' },
  { name: 'CheckUpper', label: '上限（元）', field: 'CheckUpper', align: 'left' },
  { name: 'ReferralCheckQuota', label: '定額（元）', field: 'ReferralCheckQuota', align: 'left' },
  { name: 'ReferralCheckRatio', label: '部分負擔比例（%）', field: 'ReferralCheckRatio', align: 'left' },
  { name: 'ReferralCheckUpper', label: '上限（元）', field: 'ReferralCheckUpper', align: 'left' },
]
const columns3 = [
  { name: 'LevelId', label: '院所等級/項目', field: (row) => hospitalLevelItems.value.find(({ No }) => No === row.LevelId)?.Name, align: 'left' },
  { name: 'EmrTriage1Fee', label: '1級', field: 'EmrTriage1Fee', align: 'left' },
  { name: 'EmrTriage2Fee', label: '2級', field: 'EmrTriage2Fee', align: 'left' },
  { name: 'EmrTriage3Fee', label: '3級', field: 'EmrTriage3Fee', align: 'left' },
  { name: 'EmrTriage4Fee', label: '4級', field: 'EmrTriage4Fee', align: 'left' },
  { name: 'EmrTriage5Fee', label: '5級', field: 'EmrTriage5Fee', align: 'left' },
]

const rows = ref([])
const GetSysLevelPartial = async () => {
  try {
    const res = await getSysLevelPartial()
    rows.value = res.data.Items
  } catch (error) {
    console.log(error)
  }
}

const PutSysLevelPartial = async (body) => {
  try {
    const res = await putSysLevelPartial(body)
  } catch (error) {
    console.log(error)
    $q.notify({ type: 'negative', message: '儲存失敗', position: 'top' })
  }
}

const saveLoading = ref(false)
const onSaveClick = async () => {
  saveLoading.value = true
  const tasks = []
  rows.value.forEach((item) => {
    tasks.push(PutSysLevelPartial(item))
  })

  await Promise.all(tasks)
  $q.notify({ type: 'positive', message: '儲存成功', position: 'top' })
  saveLoading.value = false
}

const hospitalLevelItems = ref([])
const GetHospitalLevelDropdown = async () => {
  try {
    const res = await getHospitalLevelDropdown()
    hospitalLevelItems.value = res.data
  } catch (error) {
    console.log(error)
  }
}

const init = async () => {
  GetSysLevelPartial()
  GetHospitalLevelDropdown()
  GetSysLevelPartial()
}
init()
</script>

