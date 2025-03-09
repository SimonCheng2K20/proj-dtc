<template>
  <div class="record-content custom-scroll-bar">
    <socketServerDownload ref="socketServerDownloadRef"></socketServerDownload>
    <medicalCardMessage ref="medicalCardMessageRecordingConponent"></medicalCardMessage>
    <medicalCardCertification ref="medicalCardCertificationRecordingConponent"></medicalCardCertification>
    <div class="flex justify-between text-xl font-bold p-2" style="background: #d6e4f2">
      <div><span class="redStar">*</span>會診記錄</div>

      <div class="flex gap-2">
        <Button v-if="itemData.data.CanRecording" style="background: #061e77"
          @click="dialog.select.show = true">匯入所選記錄</Button>
        <Button v-if="itemData.data.CanRecording" style="background: rgb(27 52 151)"
          @click="onSelectSelfClick">匯入個人記錄</Button>
        <Button style="background: grey" @click="closeRecordView">關閉</Button>
      </div>
    </div>
    <div v-if="!itemData.data.CanRecording">
      <template v-if="itemData.data.Records.length > 0">
        <div v-for="(item, rIdx) in itemData.data.Records" :key="rIdx" class="border rounded-lg p-2 mt-1 doctor-content"
          style="background-color: #f0f6e9">
          <div class="flex items-center">
            <img class="mr-2" style="width: 28px" src="/assets/members-icon.png" />
            <div>
              參與者:
              <span class="font-bold">{{ item.MeetMemberAccountName || '' }}</span><br />單位:
              <span class="font-bold">{{ item.MeetMemberAccountInstitutionName || '' }}</span>
            </div>
            <div class="ml-auto border" v-if="item.Content">
              <Button class="p-button-text p-button-sm" @click.stop="showAuthContentEvent(item)">展開</Button>
            </div>
          </div>
          <div v-if="item.Content">
            <div :title="item.Content">
              會診記錄:
              <span class="font-bold">{{ !item.Content ? 'none' : item.Content.length > 220 ? item.Content.substring(0,
                  220) + '...' : item.Content
              }}</span>
            </div>
            <div :title="item.Recommendation">
              建議事項:
              <span class="font-bold">{{ item.Recommendation || 'none' }}</span>
            </div>
            <button v-show="item.IsSignatured"
              class="px-2 py-1 rounded-md text-sm border text-green-600 border-green-600 active:bg-green-700 font-black stamp-btn cursor-default">
              已簽章
            </button>
            <button v-show="!item.IsSignatured"
              class="px-2 py-1 rounded-md text-sm border text-red-600 border-red-600 font-black stamp-btn cursor-default">
              未簽章
            </button>
          </div>
        </div>
      </template>
      <div class="p-2 border h-28 flex justify-center items-center" v-else>no content</div>
    </div>

    <template v-else>
      <Textareaprime class="textarea-content" maxlength="2000" v-model="itemData.data.recordingMessage"
        :disabled="!itemData.data.CanRecording" />
      <h4><span class="redStar">*</span>後續建議處理</h4>
      <InputOptions :options="suggestion" :itemData="itemData.data" itemKey="suggestion" otherKey="suggestionOther"
        inputType="radio" :isDisabled="!itemData.data.CanRecording" />
    </template>

    <div class="flex mt-2" v-show="!isRecordBuilder">
      <div class="mr-1">
        <Button v-show="!$route.query?.viewdetail && !(+status == 100 || !itemData.data.CanRecording)"
          class="p-button-primary" :disabled="+status == 100 || !itemData.data.CanRecording"
          @click.stop="buttonClickEvent('temp')">暫存</Button>
      </div>
      <div class="mr-1">
        <Button v-show="!$route.query?.viewdetail && !(+status == 100 || !itemData.data.CanRecording)"
          class="p-button-success" :disabled="+status == 100 || !itemData.data.CanRecording"
          @click.stop="foreverSend">確認送出</Button>
      </div>
      <!-- <Button class="p-button-outlined" @click="$router.push($route.query.back || '/diagnosisManage/recordingMaintain')" style="margin-right: 10px">回主畫面</Button> -->
      <Button class="p-button-outlined" @click="$router.push('/diagnosisManage/recordingMaintain')"
        style="margin-right: 10px">回主畫面</Button>
      <span v-show="itemData.data.CanRecording" :title="Boolean(medicalCardData) ? '已完成醫事人員卡認證' : ''"><Button
          v-if="!itemData.data.Records[0]?.IsSignatured" label="醫事人員卡認證" class="p-button-outlined p-button-danger"
          @click="checkMedicalCard" :disabled="Boolean(medicalCardData)" v-show="!showLoadingButton" />

        <Button label="loading..." class="p-button-danger" icon="pi pi-spin pi-spinner" v-show="showLoadingButton" />
      </span>
    </div>

    <Dialog v-model:visible="modalData.show" @hide="closeDialogEvent" class="custom-modal custom-scroll-bar"
      :draggable="false" :modal="true" style="width: 775px" :breakpoints="{ '960px': '75vw', '640px': '95vw' }">
      <template #header>
        <div>會診記錄</div>
      </template>
      <div style="min-height: 55vh" class="flex flex-col">
        <div class="flex items-center">
          <img class="mr-2" style="width: 25px" src="/assets/members-icon.png" />
          <div class="font-bold">
            參與者:
            <span style="color: rgb(55 74 151); font-size: 17px; font-weight: 550">{{ modalData.auth }}</span>
          </div>
        </div>
        <div class="font-bold mt-2">會診記錄:</div>
        <Textareaprime class="w-full rounded-t-none custom-scroll-bar" v-model="modalData.content" disabled rows="12" />
        <div class="font-bold mt-2">建議事項:</div>
        <Textareaprime class="w-full rounded-t-none custom-scroll-bar" v-model="modalData.recommendation" disabled
          rows="3" />
      </div>
    </Dialog>
    <Dialog class="custom-modal" v-model:visible="showConfirmMessage" style="width: 500px" :modal="true"
      :draggable="false">
      <template #header>
        <h3>系統資訊</h3>
      </template>
      <div class="font-bold" style="font-size: 25px">確認送出後將無法修改，是否確認送出?</div>
      <template #footer>
        <Button label="確認送出" @click="buttonClickEvent('send')" />
        <Button label="取消" class="p-button-success" @click="showConfirmMessage = false" />
      </template>
    </Dialog>

    <Dialog v-model:visible="dialog.select.show" header="匯入所選記錄" style="width: 1000px" :draggable="false" :modal="true">
      <chat-select ref="choosedConversationRef" :id="itemData.data.Id"></chat-select>

      <template #footer>
        <Button label="匯入記錄" @click="getChoosedWord" />
        <Button label="取消" class="p-button-success" @click="dialog.select.show = false" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'
import Textarea from 'comps/textarea.vue'
import { postSaveRecord, getChatById } from 'Service/apis.js'
import { suggestion } from 'comps/diagnosis/options'
import { ref, computed, reactive, onMounted, inject, watch } from 'vue'
import { useStore } from 'vuex'
import chatSelect from './components/chatSelect.vue'
import socketServerDownload from '@/components/medicalWebSocketServerDownload.vue'

import medicalCardMessage from '@/components/medicalCardMessage.vue'
import medicalCardCertification from '@/components/medicalCardCertification.vue'
import { useToast } from 'vue-toastification'
import { medicalCardWebSocketCheckIdentifier, medicalCardWebSocketCheckCode } from '@/service/websocket.js'

const props = defineProps({
  itemData: {
    type: Object,
    required: true,
  },
  status: {
    type: [Number, String],
    default: '',
  },
  funcValue: {
    type: [Object, Array],
  },
})

const emit = defineEmits(['btnClick', 'closeRightCompFunc'])

const toast = useToast()

const modalData = reactive({ show: false, auth: '', content: '' })
const store = useStore()
const allRecords = ref(props.itemData.data.Records)

const showConfirmMessage = ref(false)
const router = useRouter()
const route = useRoute()

const isRecordBuilder = computed(() => {
  const accountInstitutionNo = store.state?.others ? store.state?.others.InstitutionNo : ''

  return props.itemData.data.InstitutionNo == accountInstitutionNo
})

const btns = [
  {
    label: '暫存',
    key: 'temp',
    className: 'p-button-primary',
    get disabled() {
      return props.status == '20' || !props.itemData.data.CanRecording
    },
  },
  {
    label: '確認送出',
    key: 'sendCheck',
    className: 'p-button-success',
    get disabled() {
      return props.status == '20' || !props.itemData.data.CanRecording
    },
  },
  {
    label: '回主畫面',
    key: 'back',
    className: 'p-button-outlined',
  },
]

const foreverSend = () => {
  //先check data 再show是否永久送出的訊息
  const { recordingMessage = '', suggestion = '' } = props.itemData.data

  let arrCheck = [
    {
      data: recordingMessage,
      title: '會診記錄',
    },
    {
      data: suggestion,
      title: '後續建議處理',
    },
  ]
  arrCheck = arrCheck.filter((s) => !Boolean(s.data))
  let arrCheckMessage = arrCheck.map((k) => `${k.title}`).join('、')

  if (!Boolean(recordingMessage) || !Boolean(suggestion)) {
    toast.error(`${arrCheckMessage} 為必填資料，輸入後才可送出。`, {
      timeout: 5000,
      hideProgressBar: true,
    })
    return
  }

  //check data

  //show是否永久送出的訊息
  showConfirmMessage.value = true
}

async function buttonClickEvent(key) {
  //temp:暫存、send:永久送出

  showConfirmMessage.value = false
  const { Id, recordingMessage = '', suggestion = '', suggestionOther = '' } = props.itemData.data

  if (recordingMessage.length > 2000) {
    toast.error(`會診記錄字數不得大於 2000 字`, {
      timeout: 5000,
      hideProgressBar: true,
    })
    return
  }

  await PostSaveRecord({
    SheetId: Id,
    Content: recordingMessage,
    Recommendation: suggestion + (suggestionOther ? '-' : '') + suggestionOther,
    IsFinal: key === 'send',
    Signature: !!store.state.medicalCardData ? store.state.medicalCardData : null,
  })

  store.state.meetingHub.emitter.emit('StatusChanged', { id: Id })

  if (key === 'send') {
    router.push(route.query.back || '/diagnosisManage/recordingMaintain')
  }
}

const PostSaveRecord = async (data) => {
  try {
    const res = await postSaveRecord(data)
    if (res.status === 200 || res.status === 204) {
      toast.success('儲存成功', {
        timeout: 5000,
        hideProgressBar: true,
      })
    }
  } catch (err) {
    console.log(err)
    toast.error(`(${err.response.status}) 錯誤: ${err.response.data}`, {
      timeout: 5000,
      hideProgressBar: true,
    })
  }
}

function showAuthContentEvent(record) {
  modalData.auth = `${record.MeetMemberAccountName || ''}(${record.MeetMemberAccountInstitutionName || ''})`
  modalData.content = record.Content || ''
  modalData.recommendation = record.Recommendation || ''
  modalData.show = true
}

function closeDialogEvent() {
  modalData.auth = null
  modalData.content = null
}

function setData() {
  const arr = props.itemData.data.Records
  const accountName = store.state?.dakar ? store.state?.dakar.Name : ''

  let obj = {}
  if (arr.length) {
    obj = arr.find((s) => accountName == s.MeetMemberAccountName) ? arr.find((s) => accountName == s.MeetMemberAccountName) : {}
    props.itemData.data.recordingMessage = obj.Content || ''
    props.itemData.data.suggestion =
      obj.Recommendation && obj.Recommendation.includes('-') ? obj.Recommendation.split('-')[0] : obj.Recommendation ? obj.Recommendation : ''

    props.itemData.data.suggestionOther = obj.Recommendation && obj.Recommendation.includes('其他-') ? obj.Recommendation.split('-')[1] : ''
  }
}

const onSelectSelfClick = async () => {
  await GetChatById()
  const myChatItems = chatItems.value
    .filter((item) => item.AccountNo === store.state.dakar.No)
    .map((item) => item.Text)
    .join('\n')
  props.itemData.data.recordingMessage = `${!!props.itemData.data.recordingMessage ? props.itemData.data.recordingMessage + '\n' : ''}` + myChatItems
}

const choosedConversationRef = ref()

const getChoosedWord = () => {
  const selected = choosedConversationRef.value.getSelected()
  props.itemData.data.recordingMessage = `${!!props.itemData.data.recordingMessage ? props.itemData.data.recordingMessage + '\n' : ''}` + selected
  dialog.select.show = false
}

const closeRecordView = () => {
  emit('closeRightCompFunc')
}

const medicalCardMessageRecordingConponent = ref(null)
const medicalCardCertificationRecordingConponent = ref(null)

const checkMedicalCardMessage = async () => {
  //沒有醫事人員卡密碼則跳出此訊息
  if (props.itemData.data.CanRecording === false) return
  const noneedMessage = sessionStorage.getItem('noneedMes') ? sessionStorage.getItem('noneedMes').replace(/\"/g, '') : ''

  const accountNoCheck = store.state?.dakar ? store.state?.dakar.No : ''

  if (noneedMessage == 'true' || Boolean(store.state?.medicalCardData) || `${accountNoCheck}`.includes('assist')) {
    return
  }

  medicalCardMessageRecordingConponent.value.showMedcalCardMessage = true
}

const medicalCardData = computed(() => {
  return store.state?.medicalCardData
})

const showLoadingButton = ref(false)
const socketServerDownloadRef = ref(null)

const checkMedicalCard = async () => {
  //輸入醫事人員卡密碼的component
  //it need use socket to connect backend software to check card first,if it's right card and show input paswword modal
  showLoadingButton.value = true
  const res = await medicalCardWebSocketCheckIdentifier()

  if (res?.type == 'error') {
    socketServerDownloadRef.value.showMedicalWebSocketServerDownload = true
  }

  if (res == 'matchok') {
    medicalCardCertificationRecordingConponent.value.showMedicalCardCertification = true
  }
  showLoadingButton.value = false
}

onMounted(() => {
  checkMedicalCardMessage()
  setData()
})

const dialog = reactive({
  select: {
    show: false,
  },
})

const chatItems = ref([])
const GetChatById = async () => {
  try {
    const res = await getChatById(props.itemData.data.Id)
    console.log(res)
    if (res.status === 200) chatItems.value = res.data.filter((item) => item.Text?.includes('已上傳附件') === false)
  } catch (err) {
    console.log(err)
  }
}

const fetchCount = inject('fetchCount')
watch(fetchCount, setData)
</script>

<style lang="scss" scoped>
.record-content {
  height: calc(100vh - 96px);

  @apply pt-0 pl-2 bg-gray-50 overflow-y-auto pr-2;

  .textarea-content {
    @apply rounded border my-2 w-full border-purple-500 flex flex-col;
    height: 50vh;
    max-height: 540px;

    ::v-deep(textarea) {
      @apply h-full flex-1;
    }
  }
}

.doctor-content {
  position: relative;

  .stamp-btn {
    position: absolute;
    right: 10px;
    bottom: 5px;
  }
}
</style>

<style>
.custom-tipcontent .p-tooltip-text {
  width: 520px;
}

.p-disabled,
.p-component:disabled {
  opacity: 1;
}
</style>
