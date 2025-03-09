<template>
  <div class="flex">
    <div class="p-2">
      <my-input-wrapper label="疾病類別">
        <q-option-group
          v-model="diseaseSelected"
          :options="diseaseOptions"
          inline
          @update:model-value="selectDisease"
        ></q-option-group>
      </my-input-wrapper>
    </div>

    <div class="flex-1 grid grid-cols-2">
      <div class="m-1" v-for="(step, index) in steps" :key="index">
        <q-table v-bind="QTableProps" :rows="tableDatas[step]" :columns="columns" :pagination="pagination">
          <template #top>
            <div class="w-full flex justify-between">
              <div class="row items-center">
                <span>第{{ stepCh(index) }}階段</span>
              </div>
              <q-btn
                label="新增欄位"
                color="indigo-5"
                unelevated
                @click="editDiseaseEvent('add', index + 1, undefined, editItem)"
              ></q-btn>
            </div>
          </template>

          <template #body-cell-action="{ col, row }">
            <q-td :props="{ col }">
              <q-btn
                class="mr-2"
                color="primary"
                label="編輯"
                unelevated
                dense
                @click="editDiseaseEvent('edit', index, row.Id, row)"
              ></q-btn>
              <q-btn
                color="delete"
                label="刪除"
                unelevated
                dense
                @click="editDiseaseEvent('delete', index, row.Id, row)"
              ></q-btn>
            </q-td>
          </template>
          <template #body-cell-EventStatus="{ col, row }">
            <q-td :props="{ col }">
              <q-btn
                :color="row.EventStatus ? 'delete' : 'green'"
                :label="row.EventStatus ? '已完成' : '確認'"
                unelevated
                dense
                :loading="editLoading"
                @click="PutOpdTraceTb(row)"
              >
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watchEffect, provide } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { getPatientTraceTb, putPatientTraceTb } from 'api'
import { QTableProps, QInputProps, QSelectProps } from 'utils/quasar-extends/base-props.js'
import { useRouter, useRoute } from 'vue-router'

import OpdAside from 'pages/opd/components/OpdAside.vue'
import EditDiseaseEvent from './EditDiseaseEvent.vue'

const emit = defineEmits(['selectDisease'])
const $q = useQuasar()
const route = useRoute()
const props = defineProps({
  disease: String,
})

const editLoading = ref(false)
// 預編輯物件資料
const steps = reactive(['step1', 'step2', 'step3', 'step4'])
const tableDatas = reactive({})

const editItem = reactive({
  Id: 0,
  OpdId: null,
  Step: null,
  TbDate: null,
  Event: null,
  ApplyNo: null,
  EventStatus: false,
})

const columns = computed(() => {
  const arr = [
    {
      name: 'TbDate',
      label: '日期',
      field: (row) => row.TbDate?.substring(0, 10),
      align: 'center',
      classes: 'whitespace-nowrap',
    },
    { name: 'Event', label: '事件', field: 'Event', align: 'center' },
    { name: 'ApplyNo', label: '申請編號', field: 'ApplyNo', align: 'center', classes: 'whitespace-nowrap' },
    { name: 'action', label: '操作', field: 'action', align: 'center', classes: 'whitespace-nowrap' },
    { name: 'EventStatus', label: '完成事件', field: 'EventStatus', align: 'center', classes: 'whitespace-nowrap' },
  ]

  return arr
})

const pagination = ref({
  page: 1,
  rowsPerPage: -1,
})

const stepCh = (index) => {
  switch (index) {
    case 0:
      return '一'
    case 1:
      return '二'
    case 2:
      return '三'
    case 3:
      return '四'
  }
}

const GetPatientTraceTb = async () => {
  try {
    const res = await getPatientTraceTb(`?$filter=PatientId eq '${route.query.PatientId}'`) //根據 "身分證" 做篩選
    if (res.status === 200) {
      tableDatas.step1 = res.data.Items.filter((item) => {
        return item.Step === 1
      })
      tableDatas.step2 = res.data.Items.filter((item) => {
        return item.Step === 2
      })
      tableDatas.step3 = res.data.Items.filter((item) => {
        return item.Step === 3
      })
      tableDatas.step4 = res.data.Items.filter((item) => {
        return item.Step === 4
      })
    }
  } catch (err) {
    console.log(err)
  }
}

const editDiseaseEvent = (action, index, Id, row) => {
  const dialog = $q
    .dialog({
      component: EditDiseaseEvent,
      componentProps: {
        step: index,
        editType: action,
        Id: Id,
        editItem: row,
      },
    })
    .onOk(() => {
      dialog.hide()
      GetPatientTraceTb()
    })
}

const PutOpdTraceTb = async (row) => {
  row.EventStatus = true
  try {
    editLoading.value = true
    const res = await putPatientTraceTb(row)
    if (res.status === 200 || res.status === 204) {
      $q.notify({
        type: 'positive',
        message: '編輯欄位成功',
        position: 'top',
      })
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      message: '編輯欄位失敗：' + (typeof err.data === 'string' ? err.data : JSON.stringify(err.data)),
      position: 'top',
    })
  } finally {
    editLoading.value = false
  }
}

const diseaseSelected = ref(props.disease)
const diseaseOptions = [
  { label: '結核病', value: '結核病' },
  { label: '糖尿病', value: '糖尿病' },
  { label: '其他', value: '其他' },
]
const selectDisease = () => {
  emit('selectDisease', diseaseSelected.value)
}

const init = () => {
  GetPatientTraceTb()
}
init()
</script>

<style lang="scss" scoped>
.bg-to-blue {
  background-color: antiquewhite;
}
</style>

