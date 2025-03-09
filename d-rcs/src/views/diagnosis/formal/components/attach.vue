<template>
  <div ref="imageContainerRef" class="grid grid-cols-4 gap-2 select-none overflow-y-auto custom-scroll-bar"
    style="height: 240px; grid-template-rows: repeat(1, 80px)" @mousemove="mousemove" @mouseleave="mouseleave"
    @click="onContainerClick" @dblclick="onContainerDbclick">
    <div
      class="upload border w-full h-full rounded flex justify-center items-center cursor-pointer bg-blue-500 hover:bg-blue-700 text-white"
      style="height: 80px" @click="onUploadImageClick">
      上傳附件
    </div>

    <div v-for="(item, index) in sheetData.Attaches" :key="index" :data-name="item.FilePath" :data-type="item.Type"
      class="imageWrapper flex flex-col justify-center cursor-pointer overflow-hidden"
      :class="{ selected: selectedImage === item.FilePath }" style="height: 80px" :title="item.FileName">
      <div v-if="item.Type === 'jpeg' || item.Type === 'png' || item.Type === 'jpg'"
        class="flex justify-center items-center">
        <img :src="item.FilePath" style="height: 64px" />
      </div>
      <div v-else class="flex justify-center items-center">
        <i class="pi pi-file" style="font-size: 64px"></i>
      </div>
      <div class="whitespace-nowrap text-start" style="font-size: 12px; line-height: 16px">{{ item.FileName }}</div>
    </div>

    <Dialog v-model:visible="dialog.image.show" :draggable="false" :modal="true" dismissableMask header="附件檢視"
      style="width: 90%; height: 100%">
      <div class="flex justify-center items-center select-none" style="height: 78vh">
        <iframe v-if="dialog.image.type === 'pdf'" :src="selectedImage" frameborder="0" width="100%"
          height="100%"></iframe>
        <img v-else :src="selectedImage" />
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import dayjs from 'dayjs'
import { useRoute } from 'vue-router'
import { getSheetById, addAttach, getDicomFile } from 'Service/apis.js'
import { useToast } from 'vue-toastification'
import { cloneDeep, groupBy } from 'lodash'

const toast = useToast()

const props = defineProps({
  id: Number,
})

const emit = defineEmits(['change'])

const dialog = reactive({
  image: {
    show: false,
    type: '',
  },
})
const route = useRoute()

const imageContainerRef = ref()

const checkElement = (el) => {
  if (el.classList.contains('imageWrapper')) return el
  else return checkElement(el.parentNode)
}

const selectedImage = ref()
const mousemove = (evt) => {
  let imageWrapper = null
  if (evt.target !== imageContainerRef.value && evt.target.classList.contains('upload') === false) {
    imageWrapper = checkElement(evt.target)
  }
  const allImageWrapper = imageContainerRef.value.querySelectorAll('.imageWrapper')
  for (let el of allImageWrapper) {
    if (el !== imageWrapper) el.classList.remove('active')
    else el.classList.add('active')
  }
}

const mouseleave = (evt) => {
  evt.target.querySelector('.imageWrapper.active')?.classList.remove('active')
}

const onContainerClick = (evt) => {
  let imageWrapper = null
  if (evt.target !== imageContainerRef.value && evt.target.classList.contains('upload') === false) {
    imageWrapper = checkElement(evt.target)
  }

  const selected = imageContainerRef.value.querySelector('.imageWrapper.selected')
  if (selected !== null) {
    selectedImage.value = undefined
    selected.classList.remove('selected')
  }

  if (imageWrapper !== null) {
    selectedImage.value = imageWrapper.getAttribute('data-name')
    imageWrapper.classList.add('selected')
  }
}

const onContainerDbclick = (evt) => {
  let imageWrapper = null
  if (evt.target !== imageContainerRef.value && evt.target.classList.contains('upload') === false) {
    imageWrapper = checkElement(evt.target)
  }

  if (imageWrapper !== null) {
    selectedImage.value = imageWrapper.getAttribute('data-name')
    dialog.image.type = imageWrapper.getAttribute('data-type')
    dialog.image.show = true
  }
}

const onUploadImageClick = () => {
  const uploader = document.createElement('input')
  uploader.setAttribute('type', 'file')
  uploader.setAttribute('accept', 'image/*,.pdf')

  uploader.click()

  uploader.onchange = async (evt) => {
    const file = evt.target.files[0]

    if (file === undefined) {
      // 取消，沒有上傳
      return
    } else {
      AddAttach(file)
    }
  }
}

const sheetData = reactive({
  Attaches: [],
})

const dicomInit = {
  CreateAccountNo: null,
  CreateTime: null,
  FileName: null,
  FilePath: null,
  Id: null,
  Type: null,
}

const dicomData = reactive({
  items: []
})
const dicomItems = ref(cloneDeep(dicomData.items))

const dicomCount = reactive({
  count: 0
})

const GetSheetById = async () => {
  try {
    const res = await getSheetById(props.id)

    if (res.status === 200) {

      res.data.Attaches.forEach((item) => {
        item.FilePath += `?random=${Math.random()}`
      })

      Object.assign(sheetData, res.data)

      // Dicom
      let resDicom = await getDicomFile(props.id)

      if (resDicom.status === 200 && dicomCount.count === 0) {
        dicomCount.count++
        console.log(dicomCount.count)
        if (resDicom.data.length) {
          resDicom.data.forEach((v, i) => {
            if (v.DicomFiles.length) {
              v.DicomFiles.forEach((w, j) => {

                let tempObj = cloneDeep(dicomInit);
                let tempReg = /\/(\w+).dcm$/
                let tempNo = w.Dicom.match(tempReg)
                let tempTag = 'dicom_'

                tempObj.CreateAccountNo = v.AccountNo
                tempObj.CreateTime = dayjs(new Date().getTime()).format('YYYY-MM-DD')
                tempObj.FileName = tempReg.test(w.Dicom) ? tempNo[1] : new Date().getTime()
                tempObj.FilePath = w.Jpeg + `?random=${Math.random()}`
                tempObj.Id = tempReg.test(w.Dicom) ? tempTag + tempNo[1] : tempTag + new Date().getTime()
                tempObj.Type = 'jpeg'

                dicomItems.value.push(tempObj)
              })
            }
          })
        }
      }

      sheetData.Attaches = [...new Set([...dicomItems.value, ...sheetData.Attaches])]

    }
  } catch (err) {
    console.log(err)
  }
}

const AddAttach = async (file) => {
  try {
    const formData = new FormData()
    formData.append('SheetId', props.id)
    formData.append('FileName', file.name)
    formData.append('File', file)

    const res = await addAttach(formData)
    if (res.status === 200 || res.status === 204) {
      GetSheetById()
      emit('change', file.name)
      toast.success('上傳附件成功', {
        timeout: 5000,
        hideProgressBar: true,
      })
    }
  } catch (err) {
    toast.error(`上傳失敗：${err.toSrting()}`, {
      timeout: 5000,
      hideProgressBar: true,
    })
  }
}

defineExpose({
  GetSheetById,
})

const init = () => {
  GetSheetById()
}
init()
</script>

<style lang="scss" scoped>
.imageWrapper {
  border: 1px solid #ffffff;
  border-radius: 0.25rem;

  &.active {
    border-color: rgb(229, 231, 235);
  }

  &.selected {
    border-color: #123456;
  }

  &.active,
  &.selected {
    transition: border-color 150ms cubic-bezier(0.4, 0, 0.2, 1);
  }
}
</style>
