<template>
  <div class="flex justify-center relative">
    <video ref="videoRef" style="height: calc(100vh - 100px)"></video>
  </div>
  <Button style="top: 20px; left: 20px; position: absolute; z-index: 1" v-if="userMediaConfirm === false" label="開啟視訊鏡頭"
    @click="createStream" />

  <Button v-if="userMediaConfirm" icon="pi pi-camera" class="p-button-rounded"
    style="top: 20px; right: 20px; position: absolute; z-index: 1; width: 60px; height: 60px"
    @click="onVideoCaptureClick" :disabled="isFlashing" />
  <div class="screen-shot-flash" :class="{ flashing: isFlashing }"></div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'
import { useToast } from 'vue-toastification'

const toast = useToast()

const emit = defineEmits(['videoCapture'])

const userMediaConfirm = ref(false)
const videoRef = ref()
const stream = ref()
const createStream = async () => {
  try {
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: true,
    })

    userMediaConfirm.value = true

    videoRef.value.onloadedmetadata = () => {
      videoRef.value.play()
    }

    if ('srcObject' in videoRef.value) {
      videoRef.value.srcObject = stream.value
    } else {
      videoRef.value.src = URL.createObjectURL(stream.value)
    }
  } catch (err) {
    console.log(err)
    toast.error(`取得視訊鏡頭發生錯誤`, {
      timeout: 3000,
      hideProgressBar: true,
    })
    userMediaConfirm.value = false
  }
}

const isFlashing = ref(false)
const onVideoCaptureClick = async () => {
  isFlashing.value = true

  setTimeout(() => {
    isFlashing.value = false
  }, 400)

  const canvas = document.createElement('canvas')
  canvas.width = videoRef.value.videoWidth
  canvas.height = videoRef.value.videoHeight
  // 渲染
  await canvas.getContext('2d').drawImage(videoRef.value, 0, 0, canvas.width, canvas.height)

  canvas.toBlob((blob) => {
    const fileName = `視訊截圖_${Date.now()}.jpeg`
    const file = new File([blob], fileName, { type: 'image/jpeg' })
    emit('videoCapture', file)
  }, 'image/jpeg')
}

onUnmounted(() => {
  if (stream.value) {
    stream.value.getTracks().forEach((item) => {
      item.stop()
    })
  }
})

const init = () => {
  createStream()
}
init()
</script>

<style lang="scss" scoped>
.screen-shot-flash {
  position: absolute;
  top: 0px;
  width: 100%;
  height: 100%;
  background: #ffffff;
  opacity: 0;

  &.flashing {
    animation: 0.36s ease-in-out Flash;
  }
}

@keyframes Flash {
  0% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}
</style>
