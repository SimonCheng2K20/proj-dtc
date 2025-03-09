<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss>
    <div class="inputDivNS" :class="{ done: dialog.set.done }">
      <div>
        <p>請掃描護士條碼 (BarCode)</p>
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
  </q-dialog>
</template>

<script setup>
import { ref, reactive, watch, computed } from 'vue'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import JsBarcode from 'jsbarcode'

const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()
const $q = useQuasar()
const props = defineProps({
  beingCompared: Array, // beingCompared 怕會有多個對象要比對所以用陣列 而且table 選擇行後 資料會是陣列 因為有可能複選
})
const emit = defineEmits(['scanDone'])

const dialog = reactive({
  set: {
    shortcut: '',
    done: null,
  },
})
const scanedData = ref({})
const presetItem = reactive({
  Shortcut: '',
})

const generateBarCode = (data) => {
  JsBarcode('.svgJsBarCode', data, {
    displayValue: true,
  })
}

const keydownHandler = (evt) => {
  dialog.set.shortcut += evt.key
  const reg = /[A-Za-z0-9]{7}$/g
  // const reg = /[A-Za-z0-9]{8}$/g

  if (dialog.set.shortcut && reg.test(dialog.set.shortcut)) {
    generateBarCode(dialog.set.shortcut)
    removeEvent()
  }
}

const setBarCode = () => {
  dialog.set.shortcut = ''
  window.addEventListener('keydown', keydownHandler)
}

const closeSetBarCode = () => {
  onDialogCancel()
  window.removeEventListener('keydown', keydownHandler)
}

const isCheck = computed(() => {
  return scanedData.value?.No === props.beingCompared?.[0]?.No
})

const removeEvent = () => {
  window.removeEventListener('keydown', keydownHandler)
  dialog.set.done = true
  presetItem.Shortcut = dialog.set.shortcut
  setTimeout(() => {
    dialog.set.done = false
    dialog.set.shortcut = ''
    if (presetItem.Shortcut === props.beingCompared?.[0].No) {
      scanedData.value = props.beingCompared?.[0]
      $q.notify({
        type: 'positive',
        message: `護士身分符合`,
        position: 'top',
      })
    } else {
      scanedData.value = {}
      $q.notify({
        type: 'negative',
        message: `護士身分不符合`,
        position: 'top',
      })
    }
    onDialogOK(isCheck.value)
  }, 1000)
}

const init = () => {
  setBarCode()
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

