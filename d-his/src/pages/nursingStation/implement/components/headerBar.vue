<template>
  <div class="flex items-center gap-2" style="flex-wrap: wrap">
    <data-header :items="patientTitle" type="gray">
      <div class="flex items-center gap-2" style="font-size: 15px">
        <div style="height: 72%"></div>
        <div class="cus-input-wrapper-pink cursorClick" :class="{ barCoded: isCheckPatient }">
          <div class="label"><span>病患姓名</span></div>
          <div class="input min-w-[120px]" @click="setBarCode">
            {{ checkPatientName ? checkPatientName : '(請掃描BarCode)' }}
          </div>
        </div>
        <div>
          <div v-if="isCheckPatient" class="bg-white text-green-500 border-green-500 rounded border px-1 cus-link-poi">
            <q-icon name="done"></q-icon>
            <span>病患身分確認</span>
          </div>
          <div v-else class="bg-white text-red-500 border-red-500 rounded border px-1 cus-link-poi">
            <q-icon name="close"></q-icon>
            <span>病患身分錯誤</span>
          </div>
        </div>
      </div>
    </data-header>
  </div>

  <Dialog
    modal
    :closeOnEscape="false"
    :dismissableMask="false"
    v-model:visible="dialog.set.show"
    :draggable="false"
    :showHeader="false"
    :contentStyle="{ padding: '0' }"
  >
    <div class="inputDivNS" :class="{ done: dialog.set.done }">
      <div>
        <p>請掃描病患條碼 (BarCode)</p>
        <p>
          <strong>{{ dialog.set.shortcut ? dialog.set.shortcut : '' }}</strong>
        </p>
        <div class="barCodeItem">
          <svg class="svgJsBarCode"></svg>
        </div>
      </div>
      <div class="flex justify-center w-full hb-btn-abs">
        <Button class="p-button cus-hb-btn-pink" label="關閉" @click="closeSetBarCode" />
      </div>
    </div>
  </Dialog>

  <Dialog v-model:visible="dialog.error.show" :dismissableMask="false" modal style="width: 360px">
    <template #header>
      <p>提示</p>
    </template>
    <p style="text-align: center">
      <strong>{{ dialog.error.message }}</strong>
    </p>
    <template #footer>
      <Button
        @click="
          () => {
            dialog.error.show = false
            dialog.error.path ? false : router.push('/System/nursingStation/implement/drug')
          }
        "
        >確定</Button
      >
    </template>
  </Dialog>
</template>

<script setup>
import { ref, reactive, inject, watch, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { cloneDeep } from 'lodash'
import dayjs from 'dayjs'
import JsBarcode from 'jsbarcode'
import { useRoute, useRouter } from 'vue-router'
import DataHeader from 'components/DataHeader.vue'
import { useIpdStore } from 'src/stores/ipd'

const ipdStore = useIpdStore()

const router = useRouter()
const route = useRoute()
const $q = useQuasar()
const emit = defineEmits(['scanPatient'])

const scanSelected = ref()
const isCheckPatient = computed(() => {
  return scanSelected.value ? scanSelected.value.PatientId === ipdStore.ipdData.PatientId : false
})
const checkPatientName = computed(() => {
  return scanSelected.value ? scanSelected.value.Patient.Person.Name : null
})

const patientTitle = computed(() => {
  return [
    { label: '床號', key: 'BedName', value: ipdStore.ipdData.BedName },
    { label: '病歷號', key: 'PatientId', value: ipdStore.ipdData.PatientId },
    { label: '姓名', key: 'Name', value: ipdStore.ipdData.Patient.Person.Name },
    { label: '性別', key: 'Gender', value: ipdStore.ipdData.Gender },
    {
      label: '生日',
      key: 'BirthDate',
      value: dayjs(ipdStore.ipdData.Patient?.Person?.BirthDate).format('YYYY-MM-DD'),
    },
  ]
})

// New
const dialog = reactive({
  set: {
    show: false,
    shortcut: '',
    done: null,
  },
  error: {
    show: false,
    message: '操作有誤',
    path: false,
  },
})

const patientItem = {
  HospitalCode: null,
  SpecialCode: null,
  Cname: null,
  CategoryName: null,
  Quantity: 0,
  Unit: null,
  Price: null,
  Total: null,
  EffectDate: new Date(),
  isNew: true,
}

const initData = {}

initData.presetItem = {
  Id: 0,
  PresetName: '',
  Shortcut: '',
  Note: '',
  PresetSMItems: [{ ...patientItem }],
}

const presetItem = reactive(cloneDeep(initData.presetItem))

const generateBarCode = (data) => {
  JsBarcode('.svgJsBarCode', data, {
    displayValue: true,
  })
}

const keydownHandler = (evt) => {
  dialog.set.shortcut += evt.key
  // const reg = /^Shift\w{1}.{9}-\d{4}\/\d{2}\/\d{2}Enter$/g;
  // const regN = /^Shift(.{1,})Enter$/g;
  const reg = /^\d{6}$/g

  if (dialog.set.shortcut && reg.test(dialog.set.shortcut)) {
    // dialog.set.shortcut = dialog.set.shortcut.replace(regN, ($, $1) => {
    //   return $1;
    // });

    generateBarCode(dialog.set.shortcut)
    removeEvent()
  }
}

const setBarCode = () => {
  dialog.set.shortcut = ''
  dialog.set.show = true

  window.addEventListener('keydown', keydownHandler)
}

const closeSetBarCode = () => {
  dialog.set.show = false
  window.removeEventListener('keydown', keydownHandler)
}

const removeEvent = () => {
  window.removeEventListener('keydown', keydownHandler)
  dialog.set.done = true
  presetItem.Shortcut = dialog.set.shortcut

  setTimeout(() => {
    dialog.set.show = false
    dialog.set.done = false
    dialog.set.shortcut = ''
    if (presetItem.Shortcut === ipdStore.ipdData.PatientId) {
      scanSelected.value = ipdStore.ipdData
      $q.notify({
        type: 'positive',
        message: `病患身分符合`,
        position: 'top',
      })
    } else {
      scanSelected.value = undefined
      $q.notify({
        type: 'negative',
        message: `病患身分不符合`,
        position: 'top',
      })
    }
    emit('scanPatient', isCheckPatient.value)
  }, 1000)
}

watch(
  () => dialog.set.show,
  (val) => {
    if (val === false) {
      dialog.set.shortcut = ''
    }
  }
)

const init = () => {
  if (!isCheckPatient.value) setBarCode()
}

init()
</script>
<style lang="scss" scoped>
.inputDivNS {
  position: relative;
  width: 42vw;
  height: 60vh;

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-content: center;
  align-items: center;
  background: #ffffff;
  color: #ec3b71;
  font-size: 1.5vw;
  font-weight: bold;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    margin: auto;

    width: calc(100% - 4vw);
    height: calc(100% - 4vw);

    border: #ec3b71 0.2vw solid;

    -webkit-animation: vibrate-1 0.3s linear infinite both;
    animation: vibrate-1 0.3s linear infinite both;
  }

  &.done {
    color: #02a189;
    &::before {
      border: #02bda1 0.2vw solid;
      animation: none;
    }

    .cus-hb-btn-pink {
      background-color: #02a189;
      border-color: #02a189;
      &:hover {
        background-color: #02a189 !important;
        border-color: #02a189 !important;
      }
    }
  }

  .hb-btn-abs {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;
    margin-bottom: 50px;
  }

  p {
    text-indent: 1px;
    letter-spacing: 1px;
    text-align: center;
  }

  .cus-hb-btn-pink {
    background-color: #ec3b71;
    border-color: #ec3b71;
    padding: 8px 12px;
    line-height: 18px;
    &:hover {
      background-color: #ec3b71 !important;
      border-color: #ec3b71 !important;
    }
  }

  .vibrate-1 {
    -webkit-animation: vibrate-1 0.3s linear infinite both;
    animation: vibrate-1 0.3s linear infinite both;
  }

  @-webkit-keyframes vibrate-1 {
    0% {
      -webkit-transform: translate(0);
      transform: translate(0);
    }
    20% {
      -webkit-transform: translate(-2px, 2px);
      transform: translate(-2px, 2px);
    }
    40% {
      -webkit-transform: translate(-2px, -2px);
      transform: translate(-2px, -2px);
    }
    60% {
      -webkit-transform: translate(2px, 2px);
      transform: translate(2px, 2px);
    }
    80% {
      -webkit-transform: translate(2px, -2px);
      transform: translate(2px, -2px);
    }
    100% {
      -webkit-transform: translate(0);
      transform: translate(0);
    }
  }
  @keyframes vibrate-1 {
    0% {
      -webkit-transform: translate(0);
      transform: translate(0);
    }
    20% {
      -webkit-transform: translate(-2px, 2px);
      transform: translate(-2px, 2px);
    }
    40% {
      -webkit-transform: translate(-2px, -2px);
      transform: translate(-2px, -2px);
    }
    60% {
      -webkit-transform: translate(2px, 2px);
      transform: translate(2px, 2px);
    }
    80% {
      -webkit-transform: translate(2px, -2px);
      transform: translate(2px, -2px);
    }
    100% {
      -webkit-transform: translate(0);
      transform: translate(0);
    }
  }
}

.barCodeItem {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  align-content: flex-start;
  align-items: flex-start;

  margin: 0 auto;
  width: 100%;
}
</style>

