<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss full-width>
    <my-dialog-content header="新增ICD-10-PCS處置碼" @close="onDialogCancel" :loading="getDataLoading">
      <div class="py-3 px-5 font-bold min-h-[600px]">
        <div class="mb-2">
          <div
            class="inline-block mb-2 cursor-pointer"
            v-for="(item, index) in guideFlow.data"
            :key="index"
            @click="guideFlowSelect(index)"
          >
            <span class="border border-blue-300 text-white p-1" :class="levelColor(index)"
              >{{ item.EName }}{{ item.CName }}</span
            >
            <q-icon color="primary" name="arrow_right" size="md" v-if="index !== 6"></q-icon>
          </div>
        </div>
        <hr />
        <div class="my-3">
          <div
            class="inline-block"
            :class="getDataLoading ? 'cursor-not-allowed' : 'cursor-pointer'"
            v-for="(item, index) in quesFlow"
            :key="index"
            @click="quesFlowSelect(index)"
          >
            <span
              :class="guideSelected === index ? 'text-blue-400' : 'text-blue-800'"
              class="hoverColor"
              v-if="index < guideFlow.data.length + 1"
            >
              {{ item }}
            </span>
            <q-icon
              color="primary"
              name="arrow_right"
              size="sm"
              v-if="index < guideFlow.data.length + 1 && index !== 7"
            ></q-icon>
          </div>
        </div>
        <div class="my-3" v-if="labels.data.PcsCode !== undefined">
          <div class="header-btn max-w-[60%] min-h-[105px] flex items-center p-2">
            <div class="w-[84%]">
              <div class="flex flex-nowrap">
                <div class="min-w-[100px]">ICD10-PCS :</div>
                <div class="grow">{{ labels.data.PcsCode }}</div>
              </div>
              <div class="flex flex-nowrap">
                <div class="min-w-[100px]">中 文 診 斷 :</div>
                <div class="grow">{{ labels.data.CName }}</div>
              </div>
              <div class="flex flex-nowrap">
                <div class="min-w-[100px]">英 文 診 斷 :</div>
                <div class="grow">{{ labels.data.EName }}</div>
              </div>
            </div>
            <div class="w-[16%] flex flex-col items-center justify-center">
              <q-btn class="mb-2" color="primary" @click="addPCS" label="帶入診斷" unelevated dense></q-btn>
              <q-btn color="grey" @click="clearSearch" label="重新查詢" unelevated dense></q-btn>
            </div>
          </div>
        </div>
        <div
          class="my-3 grid grid-cols-8 gap-3"
          :style="`grid-template-rows: repeat(${Math.ceil(labels?.data.length / 6)}, minmax(0, 1fr))`"
          v-else
        >
          <div
            class="labels-div text-center grid grid-cols-1 items-center p-1 text-lg"
            :class="levelColor(guideSelected)"
            v-for="(item, index) in labels.data"
            :key="index"
            @click="labelsSelect(item)"
          >
            {{ item.Code }}
            <br />
            {{ item.EName }}
            <br v-if="item.EName" />
            {{ item.CName }}
          </div>
        </div>
      </div>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch, watchEffect } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { getIcd10PcsTable, getIcd10PcsItem } from 'api'

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  pcsTableData: Array,
})

const getDataLoading = ref(false)

const pcsCode = computed(() => {
  let str = ''
  guideFlow.data.forEach((element) => {
    str = str + element.Code
  })
  return str.substring(0, guideSelected.value)
})
const guideFlow = reactive({ data: [] })
const guideSelected = ref(0)

const quesFlow = ref([
  '請點選章節',
  '哪個身體系統?',
  '手術方式?',
  '哪個身體部位?',
  '手術途徑?',
  '裝置物?',
  '修飾詞?',
  '查詢結果',
])

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

const GetIcd10PcsTable = async (code) => {
  getDataLoading.value = true
  labels.data = []
  let params = ''
  if (code !== undefined) {
    params = `?Pcscode=${code}`
  }
  try {
    const res = await getIcd10PcsTable(params)
    if (res.status === 200) {
      labels.data = res.data
    }
  } catch (err) {
    console.log(err)
  } finally {
    getDataLoading.value = false
  }
}
const GetIcd10PcsItem = async (pcsCode) => {
  getDataLoading.value = true
  labels.data = []
  try {
    const res = await getIcd10PcsItem(`/${pcsCode}`) //0016070
    if (res.status === 200) {
      labels.data = res.data
    }
  } catch (err) {
    console.log(err)
  } finally {
    getDataLoading.value = false
  }
}

const guideFlowSelect = (index) => {
  if (getDataLoading.value) {
    return
  }
  guideSelected.value = index + 1
  if (index + 1 === 7) {
    GetIcd10PcsItem(pcsCode.value)
  } else if (index + 1 !== 0) {
    GetIcd10PcsTable(pcsCode.value)
  }
}
const quesFlowSelect = (index) => {
  if (getDataLoading.value) {
    return
  }
  guideSelected.value = index
  if (index === 7) {
    GetIcd10PcsItem(pcsCode.value)
  } else if (index !== 0) {
    GetIcd10PcsTable(pcsCode.value)
  } else {
    GetIcd10PcsTable()
  }
}

const labelsSelect = (item) => {
  if (guideFlow.data.length === 6) {
    guideFlow.data.push(item)
    guideSelected.value++
    GetIcd10PcsItem(pcsCode.value)
  } else if (guideSelected.value === guideFlow.data.length) {
    guideFlow.data.push(item)
    guideSelected.value++
    GetIcd10PcsTable(pcsCode.value)
  } else {
    guideFlow.data = guideFlow.data.slice(0, guideSelected.value)
    guideSelected.value++
    guideFlow.data = guideFlow.data.concat([item])
    if (guideSelected.value === 7) {
      GetIcd10PcsItem(pcsCode.value)
    } else {
      GetIcd10PcsTable(pcsCode.value)
    }
  }
}

const clearSearch = () => {
  labels.data = []
  guideFlow.data = []
  GetIcd10PcsTable()
  guideSelected.value = 0
}

const addPCS = () => {
  onDialogOK(labels.data)
}

const init = () => {
  GetIcd10PcsTable()
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

