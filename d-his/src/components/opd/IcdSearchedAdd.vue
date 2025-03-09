<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss full-width>
    <my-dialog-content header="新增ICD-10" @close="onDialogCancel" :loading="getDataLoading">
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
          <q-icon color="primary" name="arrow_right" size="md" v-if="item.Quest !== '查詢結果'"></q-icon>
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
          v-if="labels?.data[0]?.Code !== 'ans'"
        >
          <div
            class="labels-div text-center grid grid-cols-1 items-center p-1 text-xl"
            :class="levelColor(guideSelected)"
            v-for="(item, index) in labels.data"
            :key="index"
            @click="labelsSelect(item)"
          >
            {{ item.Code }}
            <br />
            <!-- {{ item.EName }} -->
            <!-- <br v-if="item.EName" /> -->
            {{ item.CName }}
          </div>
        </div>
        <div class="my-3" v-else>
          <div class="header-btn max-w-[60%] min-h-[105px] flex items-center p-2">
            <div class="w-[84%]">
              <div class="flex flex-nowrap">
                <div class="min-w-[100px]">ICD10-CM :</div>
                <div class="grow">{{ labels.data[0].Parent }}</div>
              </div>
              <div class="flex flex-nowrap">
                <div class="min-w-[100px]">中 文 診 斷 :</div>
                <div class="grow">{{ labels.data[0].CName }}</div>
              </div>
              <div class="flex flex-nowrap">
                <div class="min-w-[100px]">英 文 診 斷 :</div>
                <div class="grow">{{ labels.data[0].EName }}</div>
              </div>
            </div>
            <div class="w-[16%] flex flex-col justify-center">
              <q-btn class="m-auto mb-2" color="primary" @click="addIcd" label="帶入診斷" unelevated dense></q-btn>
              <q-btn class="m-auto" color="grey" @click="clearSearch" label="重新查詢" unelevated dense></q-btn>
            </div>
          </div>
        </div>

        <div v-if="labels.data.length === 0 && !getDataLoading">暫無資料</div>
      </div>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { ref, reactive, computed, watch, watchEffect } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { getIcd10CMTable, getIcd10Cm } from 'api'
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

const GetIcd10CMTable = async (parentCode) => {
  getDataLoading.value = true
  labels.data = []
  try {
    let query = ''
    if (parentCode) {
      query = setSearchQuery({ CodeLevel: guideSelected.value, Parent: parentCode })
    }
    const res = await getIcd10CMTable(query) //0016070
    if (res.status === 200) {
      labels.data = cloneDeep(res.data)
      if (
        (props.DclDepartmentNo === '60' || props.DclDepartmentNo === '40' || props.DclDepartmentNo === '05') &&
        guideSelected.value === 0
      ) {
        labels.data = labels.data.filter((item) => {
          return item.Parent === props.DclDepartmentNo
        })
      }
    }
  } catch (err) {
    console.log(err)
  } finally {
    getDataLoading.value = false
  }
}

const guideFlowSelect = (index) => {
  guideSelected.value = index + 1
  GetIcd10CMTable(guideFlow.data[index].Code)
}
const quesFlowSelect = (index) => {
  guideSelected.value = index
  GetIcd10CMTable(guideFlow?.data[index - 1]?.Code)
}

const labelsSelect = (item) => {
  guideFlow.data = guideFlow.data.slice(0, guideSelected.value)
  quesFlow.data = quesFlow.data.slice(0, guideSelected.value + 1)
  if (guideSelected.value === 0) {
    quesFlow.data = quesFlow.data.concat(['疾病?'])
  } else {
    quesFlow.data = quesFlow.data.concat([item.Quest])
  }
  guideSelected.value++
  guideFlow.data = guideFlow.data.concat([item])
  GetIcd10CMTable(item.Code)
}

const clearSearch = () => {
  labels.data = []
  guideFlow.data = []
  GetIcd10CMTable()
  guideSelected.value = 0
}

const GetIcd10Cm = async () => {
  try {
    const query = setSearchQuery({
      $filter: `contains(Icd10, '${labels.data[0].Parent}')`,
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

const addIcd = () => {
  GetIcd10Cm()
}

const init = async () => {
  await GetIcd10CMTable()
  if (props.DclDepartmentNo === '60') {
    const item = labels.data.filter((item) => {
      return item.Parent === props.DclDepartmentNo
    })
    labelsSelect(item[0])
  }
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

