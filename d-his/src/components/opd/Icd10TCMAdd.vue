<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss full-width>
    <my-dialog-content header="中醫常用-新增ICD-10" @close="onDialogCancel" :loading="getDataLoading">
      <div class="py-3 px-5 font-bold min-h-[600px]">
        <div
          class="inline-block mb-2 cursor-pointer"
          v-for="(item, index) in guideFlow.data"
          :key="index"
          @click="guideFlowSelect(index)"
        >
          <span class="inline-block border border-blue-300 text-white p-1" :class="levelColor(index)">{{
            item.Name
          }}</span>
        </div>
        <hr />
        <div
          class="inline-block mt-2"
          :class="getDataLoading ? 'cursor-not-allowed' : 'cursor-pointer'"
          v-for="(item, index) in quesFlow.data"
          :key="index"
          @click="quesFlowSelect(index)"
        >
          <span
            :class="guideSelected === index ? 'text-blue-400' : 'text-blue-800'"
            class="inline-block hoverColor"
            v-if="index < guideFlow.data.length + 1"
          >
            {{ item }}
          </span>
          <q-icon
            color="primary"
            name="arrow_right"
            size="sm"
            v-if="item !== '查詢結果' && index < guideFlow.data.length + 1"
          ></q-icon>
        </div>
        <div
          class="my-3 grid grid-cols-6 gap-3"
          :style="`grid-template-rows: repeat(${Math.ceil(labels?.data.length / 6)}, minmax(0, 1fr))`"
          v-if="guideSelected === 0"
        >
          <div
            class="labels-div text-center grid grid-cols-1 items-center p-1 text-xl"
            :class="levelColor(guideSelected)"
            v-for="(item, index) in labels.data"
            :key="index"
            @click="labelsSelect(item)"
          >
            {{ item.Name }}
          </div>
        </div>
        <div class="my-3" v-else>
          <q-table
            ref="tableRef"
            v-bind="QTableProps"
            :rows="tableData"
            :columns="columns"
            row-key="Icd10Code"
            :pagination="pagination"
            wrap-cells
          >
            <template #body-cell-action="{ col, row }">
              <q-td :props="{ col }">
                <q-btn color="primary" @click="addIcd(row)" label="帶入" unelevated dense></q-btn>
              </q-td>
            </template>

            <template v-slot:bottom>
              <my-pagination
                class="mx-auto p-4"
                v-model="pagination"
                :loading="getDataLoading"
                v-on:update:model-value="GetNhiFormChineseMedicine(guideFlow.data[0].NhiFormId)"
              ></my-pagination>
            </template>
          </q-table>
        </div>
      </div>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch, watchEffect } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { getNhiForm, getNhiFormChineseMedicine, getIcd10Cm } from 'api'
import { QInputProps, QSelectProps, QTableProps } from 'utils/quasar-extends/base-props.js'
import setSearchQuery from 'utils/setSearchQuery.js'
import { cloneDeep } from 'lodash-es'

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  pcsTableData: Array,
  DclDepartmentNo: String,
})

const getDataLoading = ref(false)
const guideFlow = reactive({ data: [] })
const guideSelected = ref(0)

const quesFlow = reactive({ data: ['請點選科別'] })

const labels = reactive({
  data: [],
})
const columns = [
  {
    name: 'Icd10',
    label: 'ICD-10-CM',
    field: 'Icd10',
    align: 'center',
    headerClasses: 'sticky top-0 z-10',
  },
  {
    name: 'Icd10Cht',
    label: '中文診斷',
    field: 'Icd10Cht',
    align: 'left',
    headerClasses: 'sticky top-0 z-10',
  },
  { name: 'action', label: '操作', field: 'action', align: 'center', headerClasses: 'sticky top-0 z-10 w-[120px]' },
]

const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

const levelColor = (level) => {
  switch (level) {
    case 0: {
      return 'color-bg-purple'
    }
    case 1: {
      return 'color-bg-green'
    }
    case 2: {
      return 'color-bg-lightblue'
    }
    case 3: {
      return 'color-bg-pink'
    }
    case 4: {
      return 'color-bg-orange'
    }
    case 5: {
      return 'color-bg-brown'
    }
    case 6: {
      return 'color-bg-blue'
    }
    case 7: {
      return 'color-bg-purple'
    }
    case 8: {
      return 'color-bg-green'
    }
    case 9: {
      return 'color-bg-lightblue'
    }
    default: {
      return 'color-bg-purple'
    }
  }
}

const GetNhiForm = async () => {
  getDataLoading.value = true
  labels.data = []
  try {
    const res = await getNhiForm() //0016070
    if (res.status === 200) {
      labels.data = cloneDeep(res.data.Items).filter((item) => {
        return item.NhiFormId.substr(0, 2).includes('4.')
      })
    }
  } catch (err) {
    console.log(err)
  } finally {
    getDataLoading.value = false
  }
}

const tableData = ref([])
const GetNhiFormChineseMedicine = async (nhiFormId) => {
  getDataLoading.value = true
  labels.data = []

  const query = setSearchQuery({
    nhiFormId: nhiFormId,
    $top: pagination.value.rowsPerPage,
    $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
  })

  try {
    const res = await getNhiFormChineseMedicine(query) //0016070
    if (res.status === 200) {
      tableData.value = res.data.Items
      pagination.value.rowsNumber = res.data.Count
    }
  } catch (err) {
    console.log(err)
  } finally {
    getDataLoading.value = false
  }
}

const guideFlowSelect = (index) => {
  guideSelected.value = index + 1
  if (index === 0) {
    GetNhiForm()
  } else {
    GetNhiFormChineseMedicine(guideFlow.data[0].NhiFormId)
  }
}
const quesFlowSelect = (index) => {
  guideSelected.value = index
  if (index === 0) {
    GetNhiForm()
  } else {
    GetNhiFormChineseMedicine(guideFlow.data[0].NhiFormId)
  }
}

const labelsSelect = (item) => {
  pagination.value.page = 1
  guideFlow.data = guideFlow.data.slice(0, guideSelected.value)
  quesFlow.data = quesFlow.data.slice(0, guideSelected.value + 1)
  quesFlow.data = quesFlow.data.concat(['查詢結果'])
  guideSelected.value++
  guideFlow.data = guideFlow.data.concat([item])
  GetNhiFormChineseMedicine(item.NhiFormId)
}

const GetIcd10Cm = async (Icd10Code) => {
  try {
    const query = setSearchQuery({
      $filter: `contains(Icd10, '${Icd10Code}')`,
    })
    const res = await getIcd10Cm(query)
    if (res.status === 200) {
      const icdSearched = {}
      icdSearched.Icd10Code =
        typeof res.data.Items[0].Icd10 === 'string' ? res.data.Items[0].Icd10 : res.data.Items[0].Icd10[0]
      icdSearched.Icd9Code =
        typeof res.data.Items[0].Icd9 === 'string' ? res.data.Items[0].Icd9 : res.data.Items[0].Icd9[0]
      icdSearched.Icd10Cht = res.data.Items[0].Icd10Cht
      icdSearched.Icd10Eng = res.data.Items[0].Icd10Eng
      icdSearched.Icd9Cht = res.data.Items[0].Icd9Cht
      icdSearched.Icd9Eng = res.data.Items[0].Icd9Eng
      onDialogOK(icdSearched)
    }
  } catch (error) {
    console.log(error)
  }
}

const addIcd = (row) => {
  // GetIcd10Cm(row.Icd10Code)
  onDialogOK(row)
}

const init = async () => {
  await GetNhiForm()
}
init()
</script>

<style lang="scss" scoped>
.hoverColor {
  &:hover {
    color: #0696ac;
  }
}

.labels-div {
  border: 1px solid #1d67dc;
  border-radius: 5px;
  color: white;
  cursor: pointer;
}

.color-bg-purple {
  background-color: #a05ef8;
  &:hover {
    background-color: #560fb4;
  }
}
.color-bg-green {
  background-color: #56b849;
  &:hover {
    background-color: #167e09;
  }
}
.color-bg-lightblue {
  background-color: #11bbd6;
  &:hover {
    background-color: #0696ac;
  }
}
.color-bg-pink {
  background-color: #e93592;
  &:hover {
    background-color: #950f54;
  }
}
.color-bg-orange {
  background-color: #f68132;
  &:hover {
    background-color: #c7601b;
  }
}
.color-bg-brown {
  background-color: #745145;
  &:hover {
    background-color: #442013;
  }
}
.color-bg-blue {
  background-color: #1868e1;
  &:hover {
    background-color: #063d91;
  }
}
</style>

