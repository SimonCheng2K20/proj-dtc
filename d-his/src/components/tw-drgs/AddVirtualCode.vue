<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss full-width>
    <my-dialog-content header="新增虛擬碼" @close="onDialogCancel" :loading="getDataLoading">
      <div class="py-3 px-5 font-bold min-h-[600px]">
        <div
          class="inline-block mb-2 cursor-pointer"
          v-for="(item, index) in guideFlow.data"
          :key="index"
          @click="guideFlowSelect(index)"
        >
          <span class="inline-block border border-blue-300 text-white p-1" :class="levelColor(index)"
            >{{ item.EName }}{{ item.CName }}</span
          >
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
          <q-icon color="primary" name="arrow_right" size="sm" v-if="index < guideFlow.data.length"></q-icon>
        </div>
        <div class="my-3 grid grid-cols-6 gap-3" v-if="guideSelected === 0">
          <div
            class="labels-div text-center grid grid-cols-1 items-center p-1 text-xl"
            :class="levelColor(guideSelected)"
            v-for="(item, index) in labels.data"
            :key="index"
            @click="labelsSelect(item)"
          >
            {{ item.EName }} <br />
            {{ item.CName }}
          </div>
        </div>
        <div v-else>
          <q-table
            ref="tableRef"
            v-bind="QTableProps"
            :rows="tableData"
            :columns="columns"
            :pagination="pagination"
            :loading="tableloading"
          >
            <template #body-cell-index="{ col, rowIndex }">
              <q-td :props="{ col }">
                {{ rowIndex + 1 }}
              </q-td>
            </template>
            <template #body-cell-action="{ col, row }">
              <q-td :props="{ col }">
                <q-btn label="帶入" color="primary" @click="addVirtualCode(row)"></q-btn>
              </q-td>
            </template>
            <template v-slot:bottom>
              <my-pagination
                class="mx-auto p-4"
                v-model="pagination"
                v-on:update:model-value="pageChange()"
              ></my-pagination>
            </template>
          </q-table>
        </div>

        <div v-if="labels.data.length === 0 && !getDataLoading">暫無資料</div>
      </div>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch, watchEffect } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { QTableProps, QSelectProps, QInputProps } from 'utils/quasar-extends/base-props.js'
import { getPcsvCodeList } from 'api'
import setSearchQuery from 'utils/setSearchQuery.js'
import { uniqBy } from 'lodash-es'

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  pcsTableData: Array,
})

const getDataLoading = ref(false)
const guideFlow = reactive({ data: [] })
const guideSelected = ref(0)

const quesFlow = reactive({ data: ['請選擇類別', '查詢結果'] })

const labels = reactive({
  data: [
    // { EName: 'PRE MDC', CName: '器官移植' },
    { EName: 'MDC1', CName: '神經系統' },
    // { EName: 'MDC2', CName: '眼' },
    // { EName: 'MDC3', CName: '耳鼻喉及口腔' },
    { EName: 'MDC4', CName: '呼吸系統' },
    { EName: 'MDC5', CName: '循環系統' },
    // { EName: 'MDC6', CName: '消化系統' },
    // { EName: 'MDC7', CName: '肝、膽系統或胰臟' },
    { EName: 'MDC8', CName: '骨骼、肌肉系統及結締組織' },
    { EName: 'MDC9', CName: '皮膚、皮下組織及乳房' },
    { EName: 'MDC10', CName: '內分泌、營養及新陳代謝' },
    // { EName: 'MDC11', CName: '腎及尿道' },
    // { EName: 'MDC12', CName: '男性生殖系統' },
    // { EName: 'MDC13', CName: '女性生殖系統' },
    // { EName: 'MDC14', CName: '妊娠、生產與產褥期' },
    // { EName: 'MDC15', CName: '新生兒與其他源於 週產期病態之新生兒' },
    // { EName: 'MDC16', CName: '血液及造血器官' },
    // { EName: 'MDC17', CName: '骨髓增生性疾病或 分化不明腫瘤' },
    // { EName: 'MDC18', CName: '傳染疾病寄生蟲病' },
    { EName: 'MDC21', CName: '損傷、中毒與藥品毒性作用' },
    { EName: 'MDC23', CName: '影響健康狀態之因素與 需要其他醫療服務' },
  ],
})

const pagination = ref({ page: 1, rowsPerPage: 10, rowsNumber: 0 })
const columns = [
  { name: 'index', label: '序號', field: 'index', align: 'center' },
  { name: 'OpCode', label: '處置代碼', field: 'OpCode', align: 'center' },
  { name: 'CName', label: '中文處置名稱', field: 'CName', align: 'center' },
  { name: 'EName', label: '英文處置名稱', field: 'EName', align: 'center' },
  { name: 'action', label: '操作', field: 'action', align: 'center' },
]
const tableData = ref([])

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

const guideFlowSelect = (index) => {
  guideSelected.value = index + 1
}
const quesFlowSelect = (index) => {
  guideSelected.value = index
}

const labelsSelect = (item) => {
  pagination.value.page = 1
  guideFlow.data = guideFlow.data.slice(0, guideSelected.value)
  guideSelected.value++
  guideFlow.data = guideFlow.data.concat([item])
  GetPcsvCodeList(guideFlow.data[guideFlow.data.length - 1].EName)
}

const tableloading = ref(false)
const oringinTableData = ref([])
const GetPcsvCodeList = async () => {
  tableloading.value = true
  tableData.value = []
  try {
    const query = setSearchQuery({
      mdc: guideFlow.data[guideFlow.data.length - 1].EName,
      $top: pagination.value.rowsPerPage,
      $skip: (pagination.value.page - 1) * pagination.value.rowsPerPage,
    })
    const res = await getPcsvCodeList(query)
    if (res.status === 200) {
      // oringinTableData.value = uniqBy(res.data.Items, 'OpCode')
      // pagination.value.rowsNumber = oringinTableData.value.length
      // tableData.value = oringinTableData.value.slice(
      //   (pagination.value.page - 1) * pagination.value.rowsPerPage,
      //   pagination.value.page * pagination.value.rowsPerPage
      // )
      tableData.value = res.data.Items
      pagination.value.rowsNumber = res.data.Count
    }
  } catch (err) {
    console.log(err)
  } finally {
    tableloading.value = false
  }
}
const pageChange = () => {
  // tableData.value = oringinTableData.value.slice(
  //   (pagination.value.page - 1) * pagination.value.rowsPerPage,
  //   pagination.value.page * pagination.value.rowsPerPage
  // )
  GetPcsvCodeList()
}
const addVirtualCode = (row) => {
  const toAddData = {}
  toAddData.PcsCode = row.OpCode
  toAddData.EName = row.EName
  toAddData.CName = row.CName
  onDialogOK(toAddData)
}

const init = () => {}
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

