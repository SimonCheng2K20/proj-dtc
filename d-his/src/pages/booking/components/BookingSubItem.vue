<template>
  <q-dialog ref="dialogRef" no-backdrop-dismiss>
    <q-card class="my-dialog-content q-dialog-plugin w-[480px]">
      <div class="q-title-cus">
        <h2>
          <span class="icon-wrap-cus">
            <i class="pi pi-check"></i>
          </span>
          <span>急診掛號成功!</span>
        </h2>
      </div>
      <q-card-section class="pb-2">
        <div class="q-list-cus">
          <div class="cus-item">
            <div>掛號日期:</div>
            <div>
              {{ dayjs(props.bookingData.AsignDate).format('YYYY-MM-DD') }}
            </div>
          </div>
          <div class="cus-item">
            <div>科別:</div>
            <div>
              {{ props.bookingData.ErDepartmentNo }}
            </div>
          </div>
          <div class="cus-item">
            <div>醫生姓名:</div>
            <div>
              {{ props.bookingDoctor }}
            </div>
          </div>
          <div class="cus-item">
            <div>看診號:</div>
            <div>
              {{ props.bookingNo }}
            </div>
          </div>
          <div class="cus-item">
            <div>病例號碼:</div>
            <div>
              {{ props.bookingData.PatientId }}
            </div>
          </div>
          <div class="cus-item">
            <div>病患姓名:</div>
            <div>
              {{ props.bookingData.Person.Name }}
            </div>
          </div>
        </div>
      </q-card-section>
      <q-card-actions class="p-5" align="right">
        <q-btn :class="['btnConfirm', 'Pink']" padding="4px 8px" unelevated color="clear" :label="'知道了'" @click="dialogRef.hide()"></q-btn>
        <q-btn :class="['btnConfirm', 'Green']" padding="4px 8px" unelevated color="clear" :label="'列印條碼'" @click="printDiv"></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { reactive, ref, watch, onMounted, nextTick, computed } from 'vue'
import { useQuasar, useDialogPluginComponent } from 'quasar'
import { QInputProps } from 'utils/quasar-extends/base-props.js'
import JsBarcode from 'jsbarcode'
import dayjs from 'dayjs'

const $q = useQuasar()
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const props = defineProps({
  bookingType: String,
  bookingData: Object,
  bookingNo: String,
  bookingDoctor: String,
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
    generateBarCodePrint(props.bookingData, ['PatientId'])
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
  console.log(`from barcode: `, props.bookingData)
  await checkPropData(props.bookingData, ['PatientId'])
})

// const init = async () => {
//   console.log(`props.bookingType: `, props.bookingType);
//   console.log(`props.bookingData: `, props.bookingData);
//   console.log(`props.bookingNo: `, props.bookingNo);
//   console.log(`props.bookingDoctor: `, props.bookingDoctor);
// };

// init();
</script>
<style lang="scss" scoped>
.q-title-cus {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: flex-start;
  align-items: center;

  padding: 0.25rem 1rem;
  width: 100%;

  background-color: #e3ffd4;
  border-bottom: #c3dbb6 1px solid;

  > h2 {
    font-size: 20px;
    font-weight: bold;

    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-content: flex-start;
    align-items: center;

    line-height: 48px;
  }
}
.q-list-cus {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: flex-start;
  align-items: flex-start;

  width: 100%;

  .cus-item {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-content: flex-start;
    align-items: stretch;

    width: 100%;

    font-size: 18px;

    > div {
      padding: 4px;
      width: 50%;
      line-height: 28px;

      &:nth-child(1) {
        width: 92px;
        font-size: 16px;
      }
      &:nth-child(2) {
        width: calc(100% - 92px);
      }
    }
  }
}

.icon-wrap-cus {
  display: inline-block;

  width: 42px;
  height: 42px;
  line-height: 42px;

  background: #67c23a;
  border-radius: 100%;
  margin-right: 8px;
  text-align: center;

  position: relative;

  > .pi {
    color: #ffffff;
    font-size: 28px;
    font-weight: bold;
    line-height: 42px;
  }
}

.btnConfirm {
  color: #000000 !important;
  &.Pink {
    background: #ffd8f7;
    border: #8f0a74 1px solid;
  }
  &.Green {
    background: #f0f9eb;
    border: #468821 1px solid;
  }
}
</style>

