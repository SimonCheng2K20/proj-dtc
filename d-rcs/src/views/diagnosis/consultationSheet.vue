<template>
  <div>
    <loading v-if="isShowLoading" />
    <Dialog class="custom-modal" v-model:visible="modalShowConsultationSheet" style="width: 650px" :modal="true" :draggable="false">
      <template #header>
        <h3>病人基本資訊建立</h3>
      </template>

      <div class="float-right mb-2">
        <Button @click="readHealthIdCard">讀取健保卡</Button>
      </div>

      <div v-if="groupbelong.includes(3)" class="flex gap-2">
        <Button :style="modalItem.IsOutsideReading ? 'background: grey' : ''" @click="modalItem.IsOutsideReading = false">
          <i v-if="modalItem.IsOutsideReading === false" class="pi pi-check"></i>
          <span>遠距會診</span>
        </Button>

        <Button :style="modalItem.IsOutsideReading ? '' : 'background: grey'" @click="modalItem.IsOutsideReading = true">
          <i v-if="modalItem.IsOutsideReading" class="pi pi-check"></i>
          <span>影像遠距判讀</span>
        </Button>
      </div>

      <div class="patient-info">
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon red-star">身分證字號</span>
          <InputText
            placeholder="請輸入..."
            v-model.trim="modalItem.Identifier"
            :class="!modalItem.Identifier ? 'p-invalid' : ''"
            :disabled="lockSpecificColum"
            maxlength="10"
            @change="setHis(modalItem.Identifier, 1)"
          />
        </div>
        <div class="text-right text-red-500 text-sm bg-red-100 p-1 mb-2">請務必輸入與HIS系統一致，如為路倒病人，請點選姓名旁之「無名氏」按鈕</div>
        <div class="p-inputgroup mb-2">
          <span class="p-inputgroup-addon red-star">姓名</span>
          <InputText
            placeholder="請輸入..."
            v-model.trim="modalItem.Name"
            style="margin-right: 10px"
            :class="!modalItem.Name ? 'p-invalid' : ''"
            :disabled="lockSpecificColum"
          />
          <Button class="p-button-danger p-button-sm" style="padding: 0 10px" @click.stop="setNoNameData" title="可點擊清除把鎖定資料進行解除">無名氏</Button>
        </div>
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">病歷號</span>
          <InputText placeholder="請輸入..." v-model.trim="modalItem.PatientId" />
          <Button @click="setHis(modalItem.PatientId, 2)">Sync His</Button>
        </div>
        <div class="text-right text-red-500 text-sm bg-red-100 p-1 mb-2">請務必輸入與HIS系統一致</div>

        <div class="p-inputgroup mb-2">
          <span class="p-inputgroup-addon">性別</span>
          <Dropdown
            v-model="modalItem.GenderCode"
            :options="genderOptions"
            placeholder="選擇性別"
            style="padding-top: 5px"
            optionLabel="text"
            optionValue="value"
            class="custom-height"
          />
        </div>
        <div class="p-inputgroup mb-2">
          <span class="p-inputgroup-addon">區域</span>
          <Dropdown
            v-model="modalItem.Area"
            :options="areaOptions"
            placeholder="選擇區域"
            style="padding-top: 5px"
            optionLabel="text"
            optionValue="value"
            class="custom-height"
          />
        </div>

        <div class="p-inputgroup mb-2">
          <span class="p-inputgroup-addon">生日</span>

          <Calendar v-model="modalItem.Birthday" :showIcon="true" dateFormat="yy-mm-dd" @date-select="setAge" :maxDate="maxDate" v-date-input />
        </div>
        <div class="p-inputgroup mb-2">
          <span class="p-inputgroup-addon">初診日期</span>
          <Calendar v-model="modalItem.FirstVisitDate" :showIcon="true" dateFormat="yy-mm-dd" :maxDate="maxDate" v-date-input />
        </div>
        <div class="p-inputgroup mb-2">
          <span class="p-inputgroup-addon">初診科別</span>
          <InputText placeholder="請輸入..." v-model.trim="modalItem.FirstVisitMed" />
        </div>
        <div class="p-inputgroup mb-2">
          <span class="p-inputgroup-addon">職業</span>
          <InputText placeholder="請輸入..." v-model.trim="modalItem.Career" />
        </div>
        <div class="p-inputgroup">
          <span class="p-inputgroup-addon">年齡</span>
          <InputNumber placeholder="選擇生日後會自動帶入" v-model="modalItem.PatientAge" :min="0" :max="1000" disabled />
        </div>
      </div>

      <template #footer>
        <div class="footer-modal">
          <Button label="確定建立" @click="saveSheet" />
          <Button class="p-button-warning" label="清除" @click="clearSheet" />
          <Button
            label="
            取消
          "
            class="p-button-success"
            @click="modalShowConsultationSheet = false"
          />
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, inject, defineEmits, defineExpose } from 'vue'
import { healthIDCardWebSocketServer } from '@/service/websocket.js'
import loading from '@/components/loading.vue'
import { useToast } from 'vue-toastification'
import { addSheet } from 'Service/apis.js'
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash-es'

const emit = defineEmits(['close'])
const isShowLoading = ref(false)
const toast = useToast()
const modalShowConsultationSheet = ref(false)

const initData = {}
initData.modalItem = {
  IsOutsideReading: false,
}
const modalItem = ref(cloneDeep(initData.modalItem))

const emitter = inject('emitter')

const groupbelong = sessionStorage.getItem('groupbelong')

const getAge = (dateString) => {
  const today = new Date()
  const birthDate = new Date(dateString)
  let age = today.getFullYear() - birthDate.getFullYear()
  const m = today.getMonth() - birthDate.getMonth()
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

const setAge = () => {
  if (!!modalItem.value.Birthday) {
    modalItem.value.PatientAge = getAge(modalItem.value.Birthday)
  }
}

const areaOptions = ref([
  { text: '未知', value: '未知' },
  { text: '本地', value: '本地' },
  { text: '外來', value: '外來' },
])

const genderOptions = ref([
  { text: '男', value: '男' },
  { text: '女', value: '女' },
  { text: '未知', value: '未知' },
  { text: '其他', value: '其他' },
])

const ws = ref()

const connectReadCard = () => {
  return new Promise((resolve, reject) => {
    ws.value = new WebSocket('ws://127.0.0.1:8889/Chat')

    ws.value.onopen = resolve

    ws.value.onerror = (err) => {
      toast.error(`連線讀卡機伺服器發生錯誤`, {
        timeout: 2500,
        hideProgressBar: true,
      })

      console.log(err)
      reject(err)
    }

    ws.value.onclose = (err) => {
      ws.value = undefined
      console.log(err)
      reject(err)
    }

    ws.value.onmessage = (event) => {
      if (!!event.data) emitter.emit('onmessage', event.data)
    }
  })
}

const hisWebSocketServerCallServer = async () => {
  if (!!ws.value === false) {
    await connectReadCard()
  }

  return new Promise((resolve, reject) => {
    const serverurl = `https://${window.location.hostname}`

    const onmessage = (data) => {
      emitter.off('onmessage', onmessage)
      if (data.includes('OK')) resolve('ok')
      else reject('hisWebSocketServerCallServer Error')
    }
    emitter.on('onmessage', onmessage)

    ws.value.send(`serverUrl=${serverurl}`)
  })
}

const hisWebSocketServerCallPatientData = async (identifier) => {
  if (!!ws.value === false) await connectReadCard()

  return new Promise((resolve, reject) => {
    const tokendata = sessionStorage.getItem('token')

    const onmessage = (data) => {
      emitter.off('onmessage', onmessage)
      if (data !== '{}' && !!data) resolve(data)
      else reject('hisWebSocketServerCallPatientData Error')
    }
    emitter.on('onmessage', onmessage)

    ws.value.send(`identifier=${identifier},token=${tokendata}`)
  })
}

const hisWebSocketServerCallPatientDataUsePatientId = async (patientId) => {
  if (!!ws.value === false) await connectReadCard()

  return new Promise((resolve, reject) => {
    const tokendata = sessionStorage.getItem('token')

    const onmessage = (data) => {
      emitter.off('onmessage', onmessage)
      if (data !== '{}' && !!data) resolve(data)
      else reject('hisWebSocketServerCallPatientDataUsePatientId Error')
    }
    emitter.on('onmessage', onmessage)

    ws.value.send(`patientId=${patientId},token=${tokendata}`)
  })
}

const setHis = async (data, type) => {
  if (!!data === false) {
    toast.error(`請輸入資料內容`, {
      timeout: 2500,
      hideProgressBar: true,
    })
    return
  }

  isShowLoading.value = true

  try {
    const res = await hisWebSocketServerCallServer()

    if (res === 'ok') {
      //type為1時代表用身分證、2時代表用病歷號  去抓His資料

      const res2 = type === 1 ? await hisWebSocketServerCallPatientData(data) : await hisWebSocketServerCallPatientDataUsePatientId(data)

      const patientObj = JSON.parse(res2).patientInfo
      if (!!patientObj.name) modalItem.value.Name = patientObj.name
      if (!!patientObj.identifier) modalItem.value.Identifier = patientObj.identifier
      if (!!patientObj.patientId) modalItem.value.PatientId = patientObj.patientId
      if (!!patientObj.birthDate) modalItem.value.Birthday = patientObj.birthDate
      if (!!modalItem.value.Birthday) modalItem.value.PatientAge = getAge(modalItem.value.Birthday)
      if (!!patientObj.gender) modalItem.value.GenderCode = patientObj.gender == 'male' ? '男' : patientObj.gender == 'female' ? '女' : null
    }
  } catch (err) {
    toast.error(`無法取得His資訊`, {
      timeout: 2500,
      hideProgressBar: true,
    })
  } finally {
    isShowLoading.value = false
  }
}

const saveSheet = async () => {
  const obj = { ...modalItem.value }
  const _columnObj = {
    Name: '姓名',
    Identifier: '身分證字號',
  }

  const _invalidKeys = Object.keys(_columnObj)

  if (_invalidKeys.some((key) => !Boolean(obj[key]))) {
    const _invalidValues = _invalidKeys.filter((key) => !Boolean(obj[key])).map((key) => _columnObj[key])
    toast.error(`${_invalidValues.join(',')}為必填欄位`, {
      timeout: 5000,
      hideProgressBar: true,
    })
    return
  }
  try {
    if (!obj.PatientId) {
      obj.PatientId = obj.Identifier
    }

    if (Boolean(obj.Birthday)) {
      obj.Birthday = dayjs(obj.Birthday).format('YYYY-MM-DD')
    }

    if (Boolean(obj.FirstVisitDate)) {
      obj.FirstVisitDate = dayjs(obj.FirstVisitDate).format('YYYY-MM-DD')
    }

    const res = await addSheet(obj)

    modalShowConsultationSheet.value = false
    emit('close', res.data)
  } catch (e) {
    toast.error(`${e.response ? e.response.data : e}`, {
      timeout: 5000,
      hideProgressBar: true,
    })
  }
}

const lockSpecificColum = ref(false)

const showSheet = () => {
  lockSpecificColum.value = false
  modalItem.value = cloneDeep(initData.modalItem)
  modalItem.value.GenderCode = '未知'
  modalItem.value.Area = '未知'
  modalShowConsultationSheet.value = true
}

const setNoNameData = () => {
  //when click 無名氏 button,lock some column
  lockSpecificColum.value = true
  modalItem.value.Name = '無名氏'
  modalItem.value.UnclearPatientInfo = true

  modalItem.value.Identifier = dayjs(Date.now()).format('YYYYMMDDHHmmss')
}

const clearSheet = () => {
  lockSpecificColum.value = false
  modalItem.value = cloneDeep(initData.modalItem)
  modalItem.value.UnclearPatientInfo = false
}

const maxDate = ref(new Date())

const readHealthIdCard = async () => {
  try {
    const res = await healthIDCardWebSocketServer()

    modalItem.value.Name = res.name
    modalItem.value.Identifier = res.id

    const birthday = res.birthday
    const y = birthday.slice(0, 3)
    const m = birthday.slice(3, 5)
    const d = birthday.slice(5, 7)
    modalItem.value.Birthday = new Date(`${Number(y) + 1911}-${m}-${d}`)
    modalItem.value.PatientAge = getAge(modalItem.value.Birthday)
    modalItem.value.GenderCode = res.gender === 'M' ? '男' : '女'

    toast.success(`健保卡讀取成功`, {
      timeout: 5000,
      hideProgressBar: true,
    })

    setHis(res.id, 1)
  } catch (e) {
    toast.error(`錯誤: ${e?.type ? '請確認已打開讀卡機伺服器' : e}`, {
      timeout: 5000,
      hideProgressBar: true,
    })
  }
}

defineExpose({
  showSheet,
})
</script>

<style lang="scss" scoped>
.p-inputgroup {
  .p-inputgroup-addon {
    background: #f1f9e8;
    color: #000;
    height: 42px;
    border: 0px;
    width: 120px;
    font-size: 18px;
  }

  .content {
    height: 40px;
    line-height: 40px;
    border: 1px solid #e2e5e9;
    width: calc(100% - 120px);
    padding-left: 5px;
  }
}
</style>
