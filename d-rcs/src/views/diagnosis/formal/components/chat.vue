<template>
  <div class="row justify-content-center chatroom">
    <h1 class="text-center my-2 font-bold text-xl border-b flex justify-center">
      <span>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M7 8.5H12M7 12H15M7 18V20.3355C7 20.8684 7 21.1348 7.10923 21.2716C7.20422 21.3906 7.34827 21.4599 7.50054 21.4597C7.67563 21.4595 7.88367 21.2931 8.29976 20.9602L10.6852 19.0518C11.1725 18.662 11.4162 18.4671 11.6875 18.3285C11.9282 18.2055 12.1844 18.1156 12.4492 18.0613C12.7477 18 13.0597 18 13.6837 18H16.2C17.8802 18 18.7202 18 19.362 17.673C19.9265 17.3854 20.3854 16.9265 20.673 16.362C21 15.7202 21 14.8802 21 13.2V7.8C21 6.11984 21 5.27976 20.673 4.63803C20.3854 4.07354 19.9265 3.6146 19.362 3.32698C18.7202 3 17.8802 3 16.2 3H7.8C6.11984 3 5.27976 3 4.63803 3.32698C4.07354 3.6146 3.6146 4.07354 3.32698 4.63803C3 5.27976 3 6.11984 3 7.8V14C3 14.93 3 15.395 3.10222 15.7765C3.37962 16.8117 4.18827 17.6204 5.22354 17.8978C5.60504 18 6.07003 18 7 18Z"
            stroke="#041C79"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
      <span title="無法在即時聊天室送出文字訊息時，可點擊此重新加入即時聊天室">即時聊天室:</span>
    </h1>

    <div>
      <div class="overflow-y-auto custom-scroll-bar" style="height: calc(100vh - 438px)" ref="chatContainRef">
        <div
          class="flex flex-wrap mt-2"
          v-for="(item, key) in chatItems"
          :key="key"
          :class="{
            'text-end flex-row-reverse': item.AccountNo === store.state.dakar.No,
          }"
        >
          <div class="w-9 h-9 mt-1 rounded-full bg-gray-100 flex justify-center items-center" :title="item.AccountName">
            {{ `${item.AccountName}`.substring(0, 1) }}
          </div>

          <div class="mx-2">
            <div class="pt-1" :class="{ 'text-right': item.AccountNo === store.state.dakar.No }" :title="item.AccountName">
              <strong>
                {{ item.AccountNo == store.state.dakar.No ? '我' : item.AccountName }}
              </strong>
            </div>

            <div
              class="rounded text-sm break-all p-2 text-right border-gray-200 border"
              :style="
                item.AccountNo !== store.state.dakar.No
                  ? 'background: #f8f9fa;color:#0a0908'
                  : 'background: #cef3d0;color:#0a0908;border: 0.1px solid rgb(176 214 178);'
              "
            >
              <p class="mb-0 text-left">{{ item.Text }}</p>
              <small style="color: #838f95">
                {{ new Date(item.CreateTime).toLocaleDateString() }}
                {{ new Date(item.CreateTime).toLocaleTimeString() }}
              </small>
            </div>
          </div>
        </div>

        <div class="flex flex-wrap mt-2 text-end flex-row-reverse" v-show="temporaryMessage">
          <div class="avatar-message d-flex justify-content-center">
            <div class="w-9 h-9 mt-1 rounded-full bg-gray-100 flex justify-center items-center">
              {{ `${store.state.dakar.No}`.substring(0, 1) }}
            </div>

            <div class="mx-2">
              <div class="pt-1">
                <strong> 我 </strong>
              </div>

              <div
                class="rounded text-sm break-all p-2 text-right border-gray-200 border"
                style="background: #cef3d0; color: #0a0908; border: 0.1px solid rgb(176 214 178)"
              >
                <p class="mb-0 text-left">{{ temporaryMessage }}</p>
                <small style="color: #838f95"> temporary </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-1 py-2 bg-white bottom-0">
        <InputText
          v-model="message"
          class="p-button-sm"
          placeholder="輸入訊息"
          @keypress.enter="addMessage()"
          style="width: 292px; margin-right: 2px"
          v-if="!isRecordingNow"
        />

        <InputText class="p-button-sm" placeholder="輸入訊息" disabled style="width: 284px; margin-right: 2px" v-if="isRecordingNow" />

        <button class="w-9 h-9 flex justify-center items-center" @click="speechToText" v-if="!isRecordingNow">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-6 w-6"
            viewBox="0 0 20 20"
            fill="currentColor"
            style="color: #6b7280; cursor: pointer; margin-right: 2px"
          >
            <path
              fill-rule="evenodd"
              d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z"
              clip-rule="evenodd"
            />
          </svg>
        </button>

        <button class="w-9 h-9 flex justify-center items-center" id="button" @click="speechToText" v-if="isRecordingNow">
          <div class="anima-item"></div>
        </button>

        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded w-9 h-9 flex justify-center items-center"
          style="font-size: 10px; transform: scaleX(-1)"
          type="button"
          @click.stop="copyAssistLink"
          title="取得協助會診單連結"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
            />
          </svg>
        </button>

        <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded flex justify-center items-center h-9 px-4"
          type="button"
          @click="addMessage()"
          :disabled="isRecordingNow"
          :title="isRecordingNow ? '進行語音輸入中，如需送出請關閉語音輸入中' : ''"
        >
          送出
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { getChatById, getSheetAssistLink } from 'Service/apis.js'
import dayjs from 'dayjs'
import { useClipboard } from '@vueuse/core'
import { useToast } from 'vue-toastification'

const toast = useToast()
const store = useStore()
const chatContainRef = ref()

const props = defineProps({
  id: Number,
})

const emit = defineEmits(['attachChanged'])

const chatItems = ref([])
const GetChatById = async () => {
  try {
    const res = await getChatById(props.id)
    if (res.status === 200) chatItems.value = res.data
  } catch (err) {
    console.log(err)
  }
}

const message = ref('')
const addMessage = async (str = '') => {
  const __message = str || message.value
  if (!!__message === false) return

  await store.dispatch('chatHub/invokeSendMessage', [props.id, __message])

  chatItems.value.push({
    AccountName: store.state.dakar.Name,
    AccountNo: store.state.dakar.No,
    CreateTime: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
    SheetId: props.id,
    Text: __message,
  })

  message.value = ''
}

const setChatContainScrollTop = async () => {
  await nextTick()

  if (chatContainRef.value.scrollHeight <= 0) {
    setTimeout(() => {
      setChatContainScrollTop()
    }, 1000)
  }

  chatContainRef.value.scrollTop = chatContainRef.value.scrollHeight
}

watch(chatItems, setChatContainScrollTop)

const { copy } = useClipboard()
const copyAssistLink = async () => {
  try {
    const res = await getSheetAssistLink(props.id)

    if (res.status === 200) {
      copy(res.data)
      toast.success(`協助連結複製成功`, {
        timeout: 5000,
        hideProgressBar: true,
      })
    }
  } catch (err) {
    toast.error(err?.toString() || err, {
      timeout: 5000,
      hideProgressBar: true,
    })
  }
}

const finalAlltext = ref('')
const temporaryAlltext = ref('')
const isRecordingNow = ref(false)
const recognition = new webkitSpeechRecognition()
const temporaryMessage = ref('')
let myTimeout

const timerChange = async () => {
  message.value = temporaryMessage.value
  await addMessage()
  message.value = ''
  temporaryMessage.value = ''
}

const stopTimerChange = () => {
  clearTimeout(myTimeout)
}

const speechToText = () => {
  if (!('webkitSpeechRecognition' in window)) {
    alert('此瀏覽器不支援語音輸入')
  }

  let finalText = ''

  recognition.continuous = true
  recognition.interimResults = true
  recognition.lang = 'cmn-Hant-TW'

  if (isRecordingNow.value) {
    recognition.stop()
    isRecordingNow.value = false
    message.value = temporaryMessage.value
    temporaryMessage.value = ''
    addMessage()
    return
  } else {
    message.value = ''
    temporaryMessage.value = ''
    recognition.start()
    isRecordingNow.value = true
  }

  recognition.onstart = function () {
    // console.log("開始辨識...");
  }

  recognition.onerror = function (event) {
    // console.log("辨識error...，停止辨識");
    isRecordingNow.value = false
    message.value = ''
    temporaryMessage.value = ''
    recognition.stop()
    toast.error('無法辨識麥克風', {
      timeout: 5000,
      hideProgressBar: true,
    })
  }

  recognition.onresult = function (event) {
    stopTimerChange()

    let midText = ''
    // console.log(event);

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalText = finalText + ' ' + event.results[i][0].transcript
      } else {
        midText += event.results[i][0].transcript
      }
      finalAlltext.value = finalText
      temporaryAlltext.value = midText

      if (!Boolean(midText)) {
        myTimeout = setTimeout(timerChange, 1200)
        setTimeout(function () {
          finalText = ''
        }, 1200)
      }

      // console.log("finalText", finalText, " midText", midText);
    }
  }
}

watch(finalAlltext, (v, prev) => {
  temporaryMessage.value = finalAlltext.value + temporaryAlltext.value
})

watch(temporaryAlltext, (v, prev) => {
  temporaryMessage.value = finalAlltext.value + temporaryAlltext.value
})

const onNewChat = (message) => {
  GetChatById()
}

const onAttachChanged = (message) => {
  emit('attachChanged')
}

defineExpose({
  addMessage,
})

onMounted(() => {
  setChatContainScrollTop()
})

onUnmounted(async () => {
  store.state.chatHub.emitter.off('NewChat', onNewChat)
  store.state.chatHub.emitter.off('AttachChanged', onAttachChanged)
})

const init = () => {
  GetChatById()

  store.state.chatHub.emitter.on('NewChat', onNewChat)
  store.state.chatHub.emitter.on('AttachChanged', onAttachChanged)
}
init()
</script>

<style lang="scss">
.anima-item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  font-family: 'Material Icons';
  font-size: 12px;
  color: #4587f1;
  border: 2px solid #4587f1;
  background: none;
  border-radius: 50%;
  transition: 0.15s linear;
}

.anima-item:hover {
  transition: 0.15s linear;
  transform: scale(1.05);
}

.anima-item:active {
  background: #f5f5f5;
}

.anima-item:after {
  content: '\26AB';
}

.anima-item[disabled] {
  border: 2px solid #ccc;
}

.anima-item[disabled]:after {
  content: '\E02B';
  color: #ccc;
}

.anima-item[disabled]:hover {
  transition: 0.15s linear;
  transform: none;
}

.anima-item[disabled]:active {
  background: none;
}

.anima-item {
  animation: recording 2s infinite ease-in-out;
  position: relative;
}

.anima-item:before {
  content: '';
  display: inline-block;
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0px;
  height: 0px;
  margin: 0px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.05);
  animation: recording_before 2s infinite ease-in-out;
}

@keyframes recording {
  from {
    transform: scale(1.1);
  }

  50% {
    transform: none;
  }

  to {
    transform: scale(1.1);
  }
}

@keyframes recording_before {
  80% {
    width: 30px;
    height: 30px;
    margin: -15px;
    opacity: 0;
  }

  to {
    opacity: 0;
  }
}
</style>
