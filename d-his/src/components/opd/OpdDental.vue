<template>
  <q-dialog ref="dialogRef" full-width>
    <my-dialog-content header="牙科診療部位代碼" width="1200px" class="text-xl font-bold" @close="onDialogCancel">
      <section class="p-2 bg-blue-2">
        <div class="grid grid-cols-5 gap-2">
          <q-btn
            v-for="btn in partialTooth"
            :key="btn.value"
            class="border border-solid border-[#215dbb] font-bold"
            :class="bgColor[toothStatus[btn.value]]"
            dense
            unelevated
            :disable="!toothStatus[btn.value]"
            text-color="black"
            :label="btn.label"
            @click="changeStatus(btn.value)"
          ></q-btn>
        </div>
      </section>

      <section class="p-3 pb-4 bg-[#deecff]">
        <div class="relative">
          <p class="text-center">恆牙</p>
          <div class="hot-Key flex" v-if="setupModel">
            <q-btn
              class="border border-solid border-[#215dbb] font-medium mr-1"
              dense
              unelevated
              color="white"
              text-color="black"
              size="md"
              label="清除"
              @click="clearAllTooth(permanentTeeth)"
            ></q-btn>
            <q-btn
              class="border border-solid border-[#215dbb] font-medium"
              dense
              unelevated
              color="white"
              text-color="black"
              size="md"
              label="全選乳牙"
              @click="addAllTooth(permanentTeeth)"
            ></q-btn>
          </div>
        </div>

        <div class="flex justify-center">
          <table class="dental-table bg-white">
            <tr>
              <td rowspan="2" class="text-xl font-bold p-2">右</td>
              <td
                v-for="(item, index) in permanentTeeth[0]"
                :key="index"
                class=""
                :class="bgColor[toothStatus[item]] || ''"
                @click="!!item ? changeStatus(item) : ''"
              >
                <div class="w-[53px] h-[53px] text-xl font-bold flex flex-center">
                  {{ item }}
                  <div class="absolute top-0 left-0 w-full h-full p-2" v-if="toothStatus[item] === 2">
                    <div class="w-full h-full border-2 border-solid border-red-600 rounded-full"></div>
                  </div>
                </div>
              </td>
              <td rowspan="2" class="text-xl font-bold p-2">左</td>
            </tr>
            <tr>
              <td
                v-for="(item, index) in permanentTeeth[1]"
                :key="index"
                :class="bgColor[toothStatus[item]] || ''"
                @click="!!item ? changeStatus(item) : ''"
              >
                <div class="w-[53px] h-[53px] text-xl font-bold flex flex-center">
                  {{ item }}
                  <div class="absolute top-0 left-0 w-full h-full p-2" v-if="toothStatus[item] === 2">
                    <div class="w-full h-full border-2 border-solid border-red-600 rounded-full"></div>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </section>

      <section class="p-3 pb-4 bg-light-green-1">
        <div class="relative">
          <p class="text-center">乳牙</p>
          <div class="hot-Key flex" v-if="setupModel">
            <q-btn
              class="border border-solid border-[#215dbb] font-medium mr-1"
              dense
              unelevated
              color="white"
              text-color="black"
              size="md"
              label="清除"
              @click="clearAllTooth(deciduousTeeth)"
            ></q-btn>
            <q-btn
              class="border border-solid border-[#215dbb] font-medium"
              dense
              unelevated
              color="white"
              text-color="black"
              size="md"
              label="全選乳牙"
              @click="addAllTooth(deciduousTeeth)"
            ></q-btn>
          </div>
        </div>
        <div class="flex justify-center">
          <table class="dental-table bg-white">
            <tr>
              <td rowspan="2" class="text-xl font-bold p-2">右</td>
              <td
                v-for="(item, index) in deciduousTeeth[0]"
                :key="index"
                :class="bgColor[toothStatus[item]] || ''"
                @click="!!item ? changeStatus(item) : ''"
              >
                <div class="w-[53px] h-[53px] text-xl font-bold flex flex-center">
                  {{ item }}
                  <div class="absolute top-0 left-0 w-full h-full p-2" v-if="toothStatus[item] === 2">
                    <div class="w-full h-full border-2 border-solid border-red-600 rounded-full"></div>
                  </div>
                </div>
              </td>
              <td rowspan="2" class="text-xl font-bold p-2">左</td>
            </tr>
            <tr>
              <td
                v-for="(item, index) in deciduousTeeth[1]"
                :key="index"
                :class="bgColor[toothStatus[item]] || ''"
                @click="!!item ? changeStatus(item) : ''"
              >
                <div class="w-[53px] h-[53px] text-xl font-bold flex flex-center">
                  {{ item }}
                  <div class="absolute top-0 left-0 w-full h-full p-2" v-if="toothStatus[item] === 2">
                    <div class="w-full h-full border-2 border-solid border-red-600 rounded-full"></div>
                  </div>
                </div>
              </td>
            </tr>
          </table>
        </div>
      </section>

      <section class="mt-2">
        <div class="flex flex-nowrap border border-solid border-[#215dbb]">
          <p
            class="flex items-center p-2 bg-[#deecff] font-bold border-r border-solid border-[#215dbb]"
            style="white-space: nowrap"
          >
            已選部位:
          </p>
          <p class="p-2 text-lg font-medium">
            {{ selectedTooth.length > 0 ? selectedTooth.join(' , ') : '' }}
          </p>
        </div>
      </section>

      <template #actions>
        <q-btn color="delete" unelevated label="清除" @click="clearAllTooth()"></q-btn>
        <q-btn color="grey" unelevated label="取消" @click="onDialogCancel"></q-btn>
        <q-btn unelevated color="primary" label="確定" @click="onDialogOK(selectedTooth)"></q-btn>
      </template>
    </my-dialog-content>
  </q-dialog>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'

const $q = useQuasar()

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  selectData: {
    type: Array,
    default: () => [],
  },
  optionData: {
    type: Array,
    default: () => [],
  },
  setupModel: {
    type: Boolean,
    default: false,
  },
})

const permanentTeeth = [
  ['19', '18', '17', '16', '15', '14', '13', '12', '11', '', '21', '22', '23', '24', '25', '26', '27', '28', '29'],
  ['49', '48', '47', '46', '45', '44', '43', '42', '41', '', '31', '32', '33', '34', '35', '36', '37', '38', '39'],
]

const deciduousTeeth = [
  ['', '', '', '', '55', '54', '53', '52', '51', '', '61', '62', '63', '64', '65', '', '', '', ''],
  ['', '', '', '', '85', '84', '83', '82', '81', '', '71', '72', '73', '74', '75', '', '', '', ''],
]

const partialTooth = [
  { label: 'FM 全口', value: 'FM' },
  { label: 'UA 上顎前齒部位', value: 'UA' },
  { label: 'UB 上半口', value: 'UB' },
  { label: 'UR 上半右口', value: 'UR' },
  { label: 'UL 上半左口', value: 'UL' },
  { label: '99 無法表示之部位', value: '99' },
  { label: 'LA 下顎前齒部位', value: 'LA' },
  { label: 'LB 下半口', value: 'LB' },
  { label: 'LR 下半右口', value: 'LR' },
  { label: 'LL 下半左口', value: 'LL' },
]

const bgColor = {
  0: 'bg-gray-200 cursor-not-allowed',
  1: 'bg-white cursor-pointer',
  2: 'bg-yellow-100 cursor-pointer',
}

// 狀態 0為不可選 1為可選 2為已選
const toothStatus = reactive({
  FM: 0,
  UA: 0,
  UB: 0,
  UR: 0,
  UL: 0,
  99: 0,
  LA: 0,
  LB: 0,
  LR: 0,
  LL: 0,
  11: 0,
  12: 0,
  13: 0,
  14: 0,
  15: 0,
  16: 0,
  17: 0,
  18: 0,
  19: 0,
  21: 0,
  22: 0,
  23: 0,
  24: 0,
  25: 0,
  26: 0,
  27: 0,
  28: 0,
  29: 0,
  31: 0,
  32: 0,
  33: 0,
  34: 0,
  35: 0,
  36: 0,
  37: 0,
  38: 0,
  39: 0,
  41: 0,
  42: 0,
  43: 0,
  44: 0,
  45: 0,
  46: 0,
  47: 0,
  48: 0,
  49: 0,
  51: 0,
  52: 0,
  53: 0,
  54: 0,
  55: 0,
  61: 0,
  62: 0,
  63: 0,
  64: 0,
  65: 0,
  71: 0,
  72: 0,
  73: 0,
  74: 0,
  75: 0,
  81: 0,
  82: 0,
  83: 0,
  84: 0,
  85: 0,
})

const selectedTooth = ref([])

const changeStatus = (item) => {
  switch (toothStatus[item]) {
    case 0:
      break
    case 1:
      if (selectedTooth.value.length === 9 && !props.setupModel) {
        $q.notify({
          type: 'negative',
          message: '此醫令最多填九個編碼',
          position: 'top',
        })
      } else {
        toothStatus[item] = 2
        selectedTooth.value.push(item)
        break
      }

    case 2:
      toothStatus[item] = 1
      selectedTooth.value = selectedTooth.value.filter((i) => {
        return i !== item
      })
      break
  }
}

const clearAllTooth = (toothObj) => {
  if (!!toothObj) {
    let toothArr = toothObj[0].concat(toothObj[1])
    toothArr.forEach((i) => {
      if (!!i && toothStatus[i] === 2) {
        toothStatus[i] = 1
        selectedTooth.value = selectedTooth.value.filter((e) => e !== i)
      }
    })
  } else {
    selectedTooth.value.forEach((i) => {
      toothStatus[i] = 1
    })
    selectedTooth.value = []
  }
}

const addAllTooth = (toothObj) => {
  if (!!toothObj) {
    let toothArr = toothObj[0].concat(toothObj[1])
    toothArr.forEach((i) => {
      if (!!i && toothStatus[i] === 1) {
        toothStatus[i] = 2
        selectedTooth.value.push(i)
      }
    })
  }
}

const initChangeStatus = () => {
  if (props.setupModel) {
    Object.keys(toothStatus).forEach((i) => {
      toothStatus[i] = 1
    })
  } else if (props.optionData.length !== 0) {
    props.optionData.forEach((i) => {
      toothStatus[i] = 1
    })
  }
  if (props.selectData.length !== 0) {
    selectedTooth.value = [...props.selectData]
    props.selectData.forEach((i) => {
      toothStatus[i] = 2
    })
  }
}

const init = () => {
  initChangeStatus()
}

init()
</script>

<style lang="scss" scoped>
.dental-table {
  border-width: 1px;
  border-color: rgba(33, 92, 186, 0.4);
  border-collapse: collapse;
  border-spacing: 0;
  td {
    position: relative;
    border-left-width: 1px;
    border-bottom-width: 1px;
    border-color: rgba(33, 92, 186, 0.4);
  }
}
.hot-Key {
  position: absolute;
  top: -8px;
  right: 4px;
}
</style>
