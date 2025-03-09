<template>
  <div class="barCode">
    <div class="barCodeBox">
      <div class="barCodeItem">
        <div class="barCodeItemTitle">條碼列印：</div>
        <div class="barCodeItemContent noPadLR">
          <div class="barCodeItemContentItem">
            <svg class="svgJsBarCode" v-if="hasData"></svg>
            <p class="noData" v-else>{{ noData }}</p>
          </div>
        </div>
      </div>
      <div class="barCodeItem">
        <div class="barCodeItemTitle">條碼內容：</div>
        <div class="barCodeItemContent noPadLR">
          <div class="barCodeItemContentItem">
            <p class="cusPadL" v-if="hasData">
              {{ barCodeText }}
            </p>
            <p class="noData" v-else>{{ noData }}</p>
          </div>
        </div>
      </div>
      <div class="notice" :class="{ noData: noData }">
        <p>病例號嗎</p>
      </div>
    </div>
    <div class="flex justify-end">
      <q-btn class="btn-sp" dense unelevated label="列印條碼" @click="printDiv" v-if="hasData"></q-btn>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, watch, onMounted, nextTick, computed, inject } from 'vue'
import JsBarcode from 'jsbarcode'
import dayjs from 'dayjs'

const props = defineProps({
  getData: Object,
})

const delay = (x) => {
  return new Promise(function (resolve) {
    setTimeout(() => {
      resolve()
    }, x)
  })
}

const hasData = ref(null)
const noData = ref(null)
const barCodeText = ref(null)
const svgText = ref(null)

const loopText = (data, prop = []) => {
  let temp = ''
  Object.keys(data).forEach((v) => {
    prop.forEach((w) => {
      if (w === v && data[w]) {
        if (w === 'BirthDate') {
          temp += dayjs(data[w]).format('-YYYY/MM/DD')
        } else {
          temp += data[w]
        }
      }
    })
  })
  return temp
}

const checkPropData = async (data, prop = []) => {
  let temp = 0
  Object.keys(data).forEach((v) => {
    prop.forEach((w) => {
      if (w === v && data[w]) {
        temp += 1
      }
    })
  })
  if (temp === prop.length) {
    hasData.value = true
  } else {
    switch (temp) {
      case 0:
        noData.value = '無資料'
        break
      default:
        noData.value = '資料不完整'
    }
  }
}

const generateBarCode = (data, prop) => {
  let barCodeValue = loopText(data, prop)
  barCodeText.value = barCodeValue
  JsBarcode('.svgJsBarCode', barCodeValue, {
    displayValue: false,
  })
}

const generateBarCodePrint = (data, prop) => {
  let barCodeValue = loopText(data, prop)
  const xmlSerializer = new XMLSerializer()
  const svgNode = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  JsBarcode(svgNode, barCodeValue, {
    xmlDocument: document,
  })
  svgText.value = xmlSerializer.serializeToString(svgNode)
}

const printDiv = async () => {
  const popupWindow = (url, windowName, win, w, h) => {
    const y = win.top.outerHeight / 2 + win.top.screenY - h / 2
    const x = win.top.outerWidth / 2 + win.top.screenX - w / 2
    return win.open(
      url,
      windowName,
      `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${y}, left=${x}`
    )
  }

  const WinPrint = popupWindow('', '', window, 1024, 600)

  if (hasData.value) {
    generateBarCodePrint(props.getData, ['PatientId'])
  }

  WinPrint.document.write(`
    <!DOCTYPE html>
    <html>
      <body>
        ${svgText.value}
      </body>
    </html>
  `)

  await delay(500)

  WinPrint.document.close()
  WinPrint.focus()
  WinPrint.print()
  WinPrint.close()
}

onMounted(async () => {
  console.log(`from barcode: `, props.getData)
  await checkPropData(props.getData, ['PatientId'])
  if (hasData.value) {
    generateBarCode(props.getData, ['PatientId'])
  }
})
</script>

<style lang="scss" scoped>
.barCode {
  .barCodeItem {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-content: flex-start;
    align-items: flex-start;
    width: 100%;
  }
  .barCodeItemTitle {
    width: 100%;
    font-size: 20px;
    font-weight: bold;
  }
  .barCodeItemContent {
    width: 100%;
    padding: 10px;
    &.noPadLR {
      padding: 10px 0;
    }
    &.cusPadB {
      padding: 10px 10px 30px 10px;
    }
  }
  .barCodeItemContentItem {
    min-height: 100px;
    font-size: 32px;
    color: #000000;

    p {
      &.noData {
        text-align: center;
      }
      &.cusPadL {
        padding-left: 10px;
      }
    }
  }
  .barCodeText {
    font-family: 'Libre Barcode 39', cursive;
    font-size: 40px;
  }
  .notice {
    box-sizing: border-box;
    margin-bottom: 20px;
    padding: 0 12px;
    line-height: 24px;
    background: #d2fcf1;
    color: #00a87b;
    font-size: 13px;
    letter-spacing: 1px;
    border-radius: 4px;
    &.noData {
      background: #ffd4e3;
      color: #c90449;
      font-size: 15px;
    }
  }
}
</style>
