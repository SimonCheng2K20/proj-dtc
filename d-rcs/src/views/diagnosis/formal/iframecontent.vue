<template>
  <div class="main-section relative" id="meetframe" ref="pageRef">
    <div class="iframe-section" v-if="readyMeet" ref="meetWrapperRef"></div>
    <div class="iframe-section" v-if="!readyMeet">
      <section class="flex items-center h-full p-16 bg-gray-900 text-gray-100">
        <div class="container flex flex-col items-center justify-center px-5 mx-auto my-8">
          <div class="max-w-md text-center">
            <h2 class="mb-8 font-extrabold text-5xl text-gray-600">Meeting Closed</h2>
          </div>
        </div>
      </section>
    </div>
    <!-- <div v-if="!!meetApi" class="screen-share-custom" title="分享螢幕" @click="toggleShareScreen">
      <span>分享<br>螢幕</span>
    </div> -->
    <div class="relative">
      <attach ref="attachRef" :id="itemData.data.Id" @change="onUploadChange"></attach>
      <chat ref="chatRef" :id="itemData.data.Id" @attachChanged="onAttachChanged"></chat>
      <div class="absolute" style="top: 240px">
        <Button v-if="isGetClipboardImage" style="padding: 4px; color: #0288d1; background: white" label="上傳螢幕截圖"
          @click="uploadClipboardImage"></Button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onUnmounted, nextTick, watch, reactive } from 'vue'
import { useStore } from 'vuex'
import { addAttach, getMeetUrlById, getSheetAssistLink } from 'Service/apis.js'
import { useToast } from 'vue-toastification'
import { onBeforeRouteLeave } from 'vue-router'
import attach from './components/attach.vue'
import chat from './components/chat.vue'

const props = defineProps({
  itemData: Object,
})

const chatRef = ref()
const toast = useToast()
const store = useStore()
const attachRef = ref()

const onUploadChange = (fileName) => {
  chatRef.value.addMessage(`已上傳附件: ${fileName}`)
}

const onAttachChanged = () => {
  attachRef.value.GetSheetById()
}

// meet
const readyMeet = ref(false)
const meetWrapperRef = ref(null)
const pageRef = ref(null)
const meetApi = ref('')

const importExternal = (url) => {
  return new Promise((resolve, reject) => {
    const isHaveScript = document.querySelector('script#jitsi-api')
    if (isHaveScript !== null) return resolve()
    const script = document.createElement('script')
    script.setAttribute('id', 'jitsi-api')
    script.src = url
    script.async = true

    script.onload = () => resolve()
    script.onerror = reject

    document.body.appendChild(script)
  })
}

const moderatorRecording = (data) => {
  console.log(data)
  if (data.role === 'moderator' && store.state.dakar.No === props.itemData.data.CreateAccountNo && props.itemData.data.Status < 20) {
    meetApi.value.executeCommand('startRecording', { mode: 'file' })
  } else {
    meetApi.value?.executeCommand('stopRecording', 'file')
  }
}

const recordingStatus = ref(false)
const createMeet = async () => {
  readyMeet.value = true
  await nextTick()

  meetApi.value = new JitsiMeetExternalAPI(meetData.Server.split('//')[1], {
    roomName: meetData.SheetNo,
    parentNode: meetWrapperRef.value,
    userInfo: { displayName: meetData.UserName },
  })

  const iframe = meetApi.value.getIFrame()
  iframe.setAttribute('allow', 'camera; microphone; display-capture; autoplay; clipboard-write')

  meetApi.value.addListener('participantJoined', (data) => {
    meetApi.value.executeCommand('setTileView', true)
  })

  meetApi.value.addListener('participantLeft', (data) => {
    meetApi.value.executeCommand('setTileView', true) // 設置格狀檢視
  })

  meetApi.value.addListener('participantRoleChanged', moderatorRecording)

  meetApi.value.addListener('recordingStatusChanged', (evt) => {
    recordingStatus.value = evt.on
    console.log('recordingStatusChanged', evt)
  })

  meetApi.value.addListener('readyToClose', async () => {
    readyMeet.value = false
    console.log('掛斷了')
  })
}

// const toggleShareScreen = () => {
//   meetApi.value.executeCommand('toggleShareScreen', { enable: true })
// }

const meetData = reactive({
  Server: null,
  SheetNo: null,
  UserName: null,
})
const GetMeetUrlById = async () => {
  try {
    const res = await getMeetUrlById(props.itemData.data.Id)
    Object.assign(meetData, res.data)
  } catch (err) {
    console.log(err)
  }
}

onBeforeRouteLeave(async (to, from, next) => {
  if (readyMeet.value) {
    meetApi.value?.executeCommand('stopRecording', 'file')

    let timeout

    await new Promise((resolve) => {
      if (recordingStatus.value === false) {
        resolve()
      } else {
        const unwatch = watch(recordingStatus, (val) => {
          if (val === false) {
            unwatch()
            resolve()
          }
        })
      }

      timeout = setTimeout(() => {
        resolve()
      }, 5000)
    })

    clearTimeout(timeout)
  }
  next()
})

const AddAttach = async ({ file, type }) => {
  try {
    const formData = new FormData()
    formData.append('SheetId', props.itemData.data.Id)
    formData.append('FileName', type === 'consent' ? '病患資料同意書' : file.name)
    formData.append('File', file)
    formData.append('IsConsentForm', type === 'consent')

    const res = await addAttach(formData)
    if (res.status === 200 || res.status === 204) {
      toast.success(`附件上傳成功`, {
        timeout: 3000,
        hideProgressBar: true,
      })
      attachRef.value.GetSheetById()
    }
  } catch (err) {
    console.log(err)
    toast.error(`附件上傳失敗`, {
      timeout: 3000,
      hideProgressBar: true,
    })
  }
}

const keyup = async (evt) => {
  if (evt.key === 'PrintScreen') {
    if (store.state?.editItem.InstitutionNo != store.state?.others.InstitutionNo) {
      toast.error('影像截圖上傳失敗，建立此會診單的單位才可進行影像截圖上傳', {
        timeout: 5000,
        hideProgressBar: true,
      })
      return
    }

    const permission = await navigator.permissions.query({ name: 'clipboard-read' })

    if (permission.state === 'denied') {
      throw new Error('Not allowed to read clipboard.')
    }

    toast.info('已取得螢幕截圖', {
      timeout: 3000,
      hideProgressBar: true,
    })

    isGetClipboardImage.value = true
  }
}

const isGetClipboardImage = ref(false)
const getClipboardImage = async () => {
  const [item] = await navigator.clipboard.read()
  const blob = await item.getType('image/png')
  const fileName = `視訊截圖_${Date.now()}.png`
  const file = new File([blob], fileName, {
    //file檔案
    type: 'image/png',
  })

  return file
}

const uploadClipboardImage = async () => {
  const file = await getClipboardImage()
  await AddAttach({ file })
  isGetClipboardImage.value = false
}

const blur = (evt) => {
  // 避免 focus iframe 無法截圖
  setTimeout(() => {
    evt.target.focus()
  }, 20)
}

onUnmounted(() => {
  window.removeEventListener('blur', blur)
  window.removeEventListener('keyup', keyup)
})

const init = async () => {
  window.addEventListener('blur', blur)
  window.addEventListener('keyup', keyup)

  await GetMeetUrlById()
  await importExternal(`${meetData.Server}/external_api.js`)
  await createMeet() //建立MEET
}
init()
</script>

<style lang="scss">
.main-section {
  width: calc(100% - 140px);
  display: grid;
  grid-template-columns: 1fr 460px;
  grid-column-gap: 8px;

  .iframe-section {
    height: 90vh;
    width: 100%;
    padding-right: 5px;
    border-right: 1px solid rgb(229, 231, 235);
  }
}

.screen-share-custom {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 10px;
  margin: auto auto auto 0;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
  align-items: center;

  text-align: center;

  background: rgb(67, 128, 226);
  color: white;
  border-radius: 3px;

  cursor: pointer;

  width: 56px;
  height: 56px;
  font-size: 14px;
  line-height: 16px;

  &:hover,
  &:focus {
    opacity: 0.8;
  }
}

@media screen and (max-width: 1280px) {
  .screen-share-custom {
    width: 38px;
    height: 38px;
    font-size: 12px;
    line-height: 14px;
  }
}

@media screen and (max-width: 500px) {
  .main-section {
    .iframe-section {
      width: 100vw;
      height: 100vh;
    }
  }
  .screen-share-custom {
    width: 42px;
    height: 42px;
    font-size: 14px;
    line-height: 16px;
  }
}

</style>
