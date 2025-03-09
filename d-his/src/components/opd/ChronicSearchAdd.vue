<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss full-width>
    <my-dialog-content header="新增特定治療項目" @close="onDialogCancel" :loading="getDataLoading">
      <div class="py-3 px-5 font-bold min-h-[600px]">
        <div class="mb-2">
          <div
            class="inline-block mb-2 cursor-pointer"
            v-for="(item, index) in guideFlow.data"
            :key="index"
            @click="guideFlowSelect(index, item)"
          >
            <span class="border border-blue-300 text-white p-1" :class="levelColor(index)">{{ item.Name }}</span>
            <q-icon color="primary" name="arrow_right" size="md" v-if="item.No === '01'"></q-icon>
          </div>
        </div>
        <hr />
        <div class="my-3">
          <div
            class="inline-block"
            :class="getDataLoading ? 'cursor-not-allowed' : 'cursor-pointer'"
            v-for="(item, index) in quesFlow"
            :key="index"
            @click="quesFlowSelect(index, item)"
          >
            <span
              :class="guideSelected === index ? 'text-blue-400' : 'text-blue-800'"
              class="hoverColor"
              v-if="index < guideFlow.data.length + 1"
            >
              {{ item }}
            </span>
            <q-icon color="primary" name="arrow_right" size="sm" v-if="item !== '查詢結果'"></q-icon>
          </div>
        </div>
        <div
          class="my-3 grid grid-cols-8 gap-3"
          :style="`grid-template-rows: repeat(${Math.ceil(labels?.data.length / 6)}, minmax(0, 1fr))`"
          v-if="quesFlow[guideSelected] !== '查詢結果'"
        >
          <div
            class="labels-div text-center grid grid-cols-1 items-center p-1 text-xl"
            :class="levelColor(guideSelected)"
            v-for="(item, index) in labels.data"
            :key="index"
            @click="labelsSelect(item, index)"
          >
            {{ item.Name }}
          </div>
        </div>
        <div v-else>
          <q-table ref="tableRef" v-bind="QTableProps" :rows="tableData" :columns="columns" :pagination="pagination">
            <template #body-cell-action="{ col, row }">
              <q-td :props="{ col }">
                <q-btn color="primary" label="帶入" unelevated dense @click="addChronic(row)"></q-btn>
              </q-td>
            </template>
            <template v-slot:bottom>
              <my-pagination
                class="mx-auto p-4"
                v-model="pagination"
                v-on:update:model-value="onPageChange"
              ></my-pagination>
            </template>
          </q-table>
          <div class="ml-3 mt-2">
            註：中醫慢性病(給藥七日以上者)
            特定治療項目代號為上述編碼01至12、14、19、25、27、32、45、65、67、69、76、77等23項。
          </div>
        </div>
      </div>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch, watchEffect } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { QTableProps, QSelectProps, QInputProps } from 'utils/quasar-extends/base-props.js'
import { getChronic, getSpecialCureList, getSpecialCureChronicItem } from 'api'
import setSearchQuery from 'utils/setSearchQuery.js'
import { cloneDeep } from 'lodash-es'

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()
const $q = useQuasar()

const props = defineProps({
  rowIndex: Number,
  DclDepartmentNo: String,
})

const columns = [
  { name: 'Code', label: '代碼', field: 'Code', align: 'center' },
  { name: 'Name', label: '名稱', field: 'Name', align: 'center' },
  { name: 'action', label: '操作', field: 'action', align: 'center' },
]
const tableData = ref([])
const pagination = ref({
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
})

const getDataLoading = ref(false)

const guideFlow = reactive({ data: [] })
const guideSelected = ref(0)

const quesFlow = ref(['請點選特定治療項目'])

const labels = reactive({
  data: [],
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
  }
}

const GetSpecialCureItem = async () => {
  tableData.value = []
  labels.data = []
  getDataLoading.value = true
  try {
    const res = await getSpecialCureList()
    if (res.status === 200) {
      labels.data = cloneDeep(res.data)
      if (props.DclDepartmentNo === '60') {
        labels.data = labels.data.filter((d) => {
          return d.No === '05'
        })
      }
      if (props.DclDepartmentNo === '40') {
        labels.data = labels.data.filter((d) => {
          return d.No === '04'
        })
      }
    }
  } catch (err) {
    console.log(err)
  } finally {
    getDataLoading.value = false
  }
}
const GetSpecialCureChronicItem = async (key, no) => {
  tableData.value = []
  labels.data = []
  getDataLoading.value = true
  const query = setSearchQuery({
    $top: pagination.value.rowsPerPage,
    $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
    $filter: `${key} eq '${no}'`,
  })
  try {
    const res = await getSpecialCureChronicItem(query)
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
const GetChronic = async () => {
  tableData.value = []
  labels.data = []
  getDataLoading.value = true
  try {
    const res = await getChronic()
    if (res.status === 200) {
      labels.data = cloneDeep(res.data.Items)
      // 處理把"其他"加到癌症裡的需求
      labels.data = labels.data.slice(0, -1)
      labels.data[0].Name = '癌症 + 其他'
    }
  } catch (err) {
    console.log(err)
  } finally {
    getDataLoading.value = false
  }
}
//專門處理"其他"加到癌症裡的需求
const ForMixOtherTable = async () => {
  getDataLoading.value = true
  const query = setSearchQuery({
    $top: pagination.value.rowsPerPage,
    $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
    $filter: `Category eq '001' or Category eq '016'`,
    $orderby: 'Sn desc',
  })
  try {
    const res = await getSpecialCureChronicItem(query)
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
const onPageChange = () => {
  if (guideFlow.data[guideFlow.data.length - 1].Category === undefined) {
    GetSpecialCureChronicItem('SpecialCureItem', guideFlow.data[guideFlow.data.length - 1].No)
  } else if (guideFlow.data[guideFlow.data.length - 1].Category === '001') {
    ForMixOtherTable()
  } else if (guideFlow.data[guideFlow.data.length - 1].Category !== '001') {
    GetSpecialCureChronicItem('Category', guideFlow.data[guideFlow.data.length - 1].Category)
  }
}

const guideFlowSelect = (index, item) => {
  if (getDataLoading.value) {
    return
  }
  if (item.No === '01') {
    GetChronic()
  } else if (item.No !== undefined) {
    GetSpecialCureChronicItem('SpecialCureItem', item.No)
  } else {
    GetSpecialCureChronicItem('Category', item.Category)
  }
  guideSelected.value = index + 1
}
const quesFlowSelect = (index, item) => {
  if (getDataLoading.value) {
    return
  }
  if (props.rowIndex === 0) {
    if (index === 0) {
      GetChronic()
    } else {
      GetSpecialCureChronicItem('Category', guideFlow.data[1].Category)
    }
  } else {
    if (index === 0) {
      GetSpecialCureItem()
    } else if (item === '請點選疾病類別') {
      GetChronic()
    } else if (index === 1) {
      GetSpecialCureChronicItem('SpecialCureItem', guideFlow.data[0].No)
    } else if (index === 2) {
      GetSpecialCureChronicItem('Category', guideFlow.data[1].Category)
    }
  }
  guideSelected.value = index
}

const labelsSelect = (item) => {
  pagination.value.page = 1

  guideFlow.data = guideFlow.data.slice(0, guideSelected.value)
  quesFlow.value = quesFlow.value.slice(0, guideSelected.value + 1)
  guideFlow.data.push(item)
  guideSelected.value++

  if (item.No === '01') {
    quesFlow.value.push('請點選疾病類別')
    GetChronic()
  } else if (item.No !== undefined) {
    GetSpecialCureChronicItem('SpecialCureItem', item.No)
    quesFlow.value.push('查詢結果')
  } else if (item.Category === '001') {
    //專門處理"其他"加到癌症裡的需求
    ForMixOtherTable()
    quesFlow.value.push('查詢結果')
  } else {
    GetSpecialCureChronicItem('Category', item.Category)
    quesFlow.value.push('查詢結果')
  }
}

const addChronic = (row) => {
  onDialogOK(row)
}

const init = () => {
  if (props.rowIndex === 0) {
    quesFlow.value = ['請點選疾病類別']
    GetChronic()
  } else GetSpecialCureItem()
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

