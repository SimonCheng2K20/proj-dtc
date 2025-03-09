<template>
  <div>
    <h3 class="router-title">{{ metaName }}</h3>
    <div class="flex gap-4 px-4 py-2 h-full" style="">
      <div class="flex flex-col flex-shrink-0 border rounded-lg border-blue-300 overflow-hidden">
        <div class="text-center text-xl font-bold p-2 relative" style="background: #f1f9e8" title="僅限建立會診單的單位可新增、編輯、刪除附件與同意書">
          <div>附件總覽清單</div>
          <div class="flex absolute top-2 right-2" style="gap: 8px">
            <Button v-if="isSameInstitution" label="視訊拍照" class="p-button-sm" style="padding: 4px; height: 32px" @click="toVideoCapture" />
            <Button
              v-if="isSameInstitution"
              icon="pi pi-plus"
              label="新增附件"
              class="p-button-warning p-button-sm"
              style="padding: 4px; height: 32px"
              @click.stop="showEditModal(1)"
            />
          </div>
        </div>

        <my-table :headers="headers" :items="items" :loading="loading" hide-default-footer>
          <template #item-action="{ item }">
            <div v-if="item.FileName === '病患資料同意書' || item.FileName === '遠距會診同意書'">
              <button v-if="isSameInstitution" class="attach-button" style="background: #166bde" @click="toEdit(item)">編輯</button>
              <button v-if="isSameInstitution" class="attach-button" style="background: #fabf3e; color: #333333cf" @click="onUploadImageClick(item)">
                上傳
              </button>
              <button class="attach-button" style="background: #7f57f2" @click="toViewForm(item)">檢閱</button>
            </div>
            <div v-else>
              <button
                v-if="isSameInstitution"
                class="attach-button"
                style="background: #fc5792; opacity: "
                :class="[{ disabled: checkDicom(item.Id) }]"
                :disabled="checkDicom(item.Id)"
                @click="toDelete(item)"
              >
                刪除
              </button>
              <button class="attach-button" style="background: #03a870" @click="toDownload(item)">下載</button>
              <button class="attach-button" style="background: #7f57f2" @click="toView(item)">檢閱</button>
            </div>
          </template>
        </my-table>
      </div>

      <div class="h-full">
        <div class="flex items-start gap-2 mb-2">
          <div class="flex flex-wrap gap-4 text-lg">
            <div class="whitespace-nowrap">
              <span>病患姓名：</span>
              <span class="font-bold">{{ sheetData.Patient.Name }}</span>
            </div>
            <div class="whitespace-nowrap">
              <span>性別：</span>
              <span class="font-bold">{{ sheetData.Patient.GenderCode }}</span>
            </div>
            <div class="whitespace-nowrap">
              <span>年齡：</span>
              <span class="font-bold">{{ sheetData.PatientAge }} 歲</span>
            </div>
            <div class="whitespace-nowrap">
              <span>出生年月日：</span>
              <span class="font-bold">{{ sheetData.Patient.Birthday?.substring(0, 10) }}</span>
            </div>
            <div class="whitespace-nowrap">
              <span>身分證號：</span>
              <span class="font-bold">{{ sheetData.Patient.Identifier }}</span>
            </div>
            <div class="whitespace-nowrap">
              <span>就醫身分別：</span>
              <span class="font-bold">
                {{
                  sheetData.PatientSourceType === 1
                    ? '健保'
                    : sheetData.PatientSourceType === 2
                    ? '自費'
                    : sheetData.PatientSourceType === 0
                    ? `其他-${sheetData.PatientSourceOtherType}`
                    : ''
                }}
              </span>
            </div>
            <div class="whitespace-nowrap">
              <span>區域：</span>
              <span class="font-bold">{{ sheetData.Patient.Area }}</span>
            </div>
            <div class="whitespace-nowrap">
              <span>初診科別：</span>
              <span class="font-bold">{{ sheetData.Patient.FirstVisitMed }}</span>
            </div>
          </div>

          <div class="flex gap-2 flex-shrink-0">
            <Button v-if="showType.includes('data-edit')" label="儲存同意書" class="p-button-success" @click="toSaveForm"></Button>
            <Button v-if="showType.includes('data')" label="列印同意書" class="p-button-danger" @click="toPrint"></Button>
            <Button
              label="返回會診清單"
              class="p-button-outlined p-button-info"
              @click="$router.push($route.query.back || '/diagnosisManage/recordingMaintain')"
            ></Button>
          </div>
        </div>

        <div class="p-8 border border-blue-300 rounded" v-if="!!showItem && showType.includes('data') === false">
          <div class="p-2 text-center text-2xl">附件檢視：{{ showItem.FileName }}</div>
          <div class="text-right pr-2 text-sm">
            {{ showItem?.CreateTime.substring(0, 10) }}
          </div>
          <div class="flex justify-center">
            <iframe v-if="showItem.Type === 'pdf'" :src="showItem.FilePath" class="h-screen w-full"></iframe>
            <img v-else :src="showItem.FilePath" />
          </div>
        </div>

        <div v-if="showType.includes('data')">
          <consentForm v-if="showType === 'consent-data-edit'" ref="consentFormRef" :sheet-data="sheetData"> </consentForm>

          <teleport to="body" :disabled="printing === false">
            <consentFormPrint v-if="(printing === true && showType.includes('consent-data')) || showType === 'consent-data-view'"> </consentFormPrint>
          </teleport>

          <confirmForm v-if="showType === 'confirm-data-edit'" ref="confirmFormRef" :sheet-data="sheetData"> </confirmForm>

          <teleport to="body" :disabled="printing === false">
            <confirmFormPrint v-if="(printing === true && showType.includes('confirm-data')) || showType === 'confirm-data-view'"> </confirmFormPrint>
          </teleport>
        </div>
      </div>
    </div>

    <!-- //EditModal -->
    <Dialog v-model:visible="editModal" :style="nowType == 3 ? 'width: 480px' : 'width: 980px'" :draggable="false" :modal="true" class="custom-modal">
      <template #header>
        <h3>
          {{ nowType == 1 ? '新增附件' : nowType == 2 ? '編輯附件' : '刪除附件' }}
        </h3>
      </template>
      <section>
        <div class="about" v-show="false">
          <input id="file-upload" type="file" @change="fileChange($event)" ref="inputFile" accept="image/bmp,image/x-bmp,image/jpeg,image/png,.pdf" />
        </div>
        <div class="modal-main-content" v-if="nowType == 1 || nowType == 2">
          <div class="left-img" @click="selectFile('file1')">
            <img src="/assets/upload.png" />
          </div>
          <div class="right-list">
            <header class="right-main-content">
              <div>操作</div>

              <div>檔名</div>
              <div>檔案類型</div>
            </header>
            <section class="right-main-content mt-3" v-if="currentFileType">
              <div style="padding: 9px 0">
                <Button style="height: 25px" @click="clearFile2">刪除</Button>
              </div>

              <!-- <div>{{ currentFileName || "" }}</div> -->
              <InputText v-model.trim="currentFileName" placeholder="請輸入檔案名稱" />
              <div>{{ currentFileType || '' }}</div>
            </section>
          </div>
        </div>
        <div class="modal-main-content" v-else style="grid-template-columns: 110px 1fr">
          <div>
            <img class="mt-4 mr-2 float-right w-9" src="/assets/notice-icon2.png" />
          </div>
          <div class="delete-main-content">
            <div>是否確定要刪除此附件?</div>
            <div>檔名: {{ modalItem.FileName || '' }}</div>
          </div>
        </div>
      </section>

      <template #footer>
        <Button v-if="nowType == 1 || nowType == 2" label="確定新增" @click="saveEditModal" />
        <Button v-else label="確定刪除" @click="DeleteAttach(modalItem.Id)" class="p-button-danger" />
        <Button label="取消" class="p-button-success" @click="editModal = false" />
      </template>
    </Dialog>

    <!-- <Dialog  v-model:visible="dialog.upload.show" maximizable :draggable="false" :showHeader="false">
      <attachUpload @attachUpload="onVideoCapture"></attachUpload>

      <template #footer>
        <Button label="關閉" class="p-button-success" @click="dialog.video.show = false" />
      </template>
    </Dialog> -->

    <Dialog ref="dialogRef" v-model:visible="dialog.video.show" maximizable :draggable="false" :showHeader="false">
      <video-capture @video-capture="onVideoCapture"></video-capture>

      <template #footer>
        <Button label="關閉" class="p-button-success" @click="dialog.video.show = false" />
      </template>
    </Dialog>

    <Dialog v-model:visible="dialog.saveWarn.show" header="注意" class="custom-modal" :draggable="false">
      <div>您編輯中的同意書尚未儲存，是否仍要離開此頁面？</div>
      <template #footer>
        <Button label="繼續編輯" class="p-button-success" @click="emitter.emit('saveWarnCallback', false)" />
        <Button label="離開頁面" class="p-button-warning" @click="emitter.emit('saveWarnCallback', true)" />
      </template>
    </Dialog>

    <Dialog v-model:visible="dialog.editWarn.show" header="注意" class="custom-modal" :draggable="false">
      <div>您已上傳了同意書。若編輯同意書，儲存後將會覆蓋您已上傳的同意書，是否繼續編輯同意書？</div>
      <template #footer>
        <Button label="取消" style="background: grey" @click="emitter.emit('editWarnCallback', false)" />
        <Button label="確定編輯" @click="emitter.emit('editWarnCallback', true)" />
      </template>
    </Dialog>
  </div>
</template>
<script setup>
import { useStore } from 'vuex'
import { computed, ref, reactive, nextTick, provide, watch } from 'vue'
import dayjs from 'dayjs'
import {
  getSheetById,
  addAttach,
  deleteAttach,
  getConsentById,
  getConsultConsentForm,
  postConsent,
  postConsultConsentForm,
  getDicomFile,
} from 'Service/apis.js'
import { useToast } from 'vue-toastification'
import videoCapture from './components/videoCapture.vue'

import consentForm from './components/consentForm.vue'
import consentFormPrint from './components/consentFormPrint.vue'
import confirmForm from './components/confirmForm.vue'
import confirmFormPrint from './components/confirmFormPrint.vue'

// import attachUpload from './components/attachUpload.vue'
import { cloneDeep, groupBy } from 'lodash'
import { useRoute, onBeforeRouteLeave } from 'vue-router'
import mitt from 'mitt'

const emitter = mitt()

const props = defineProps({
  metaName: String,
})

const toast = useToast()
const store = useStore()
const route = useRoute()

const consentFormRef = ref()
const confirmFormRef = ref()

const consentWork = ref(null)
const consentImgData = ref(null)

const loading = ref(false)
const headers = reactive([
  { text: '操作', key: 'action', value: 'action' },
  { text: '檔名', key: 'FileName', value: 'FileName' },
  { text: '建立日期', key: 'CreateTime', value: (row) => row.CreateTime?.substring(0, 10) },
  { text: '檔案類型', key: 'Type', value: 'Type' },
])

const initData = {}
initData.items = [{ FileName: '病患資料同意書' }, { FileName: '遠距會診同意書' }]
const items = ref(cloneDeep(initData.items))

const dicomArr = ref([
  {
    AccountNo: null,
    Modality: null,
    DicomFiles: [
      {
        Dicom: null,
        Size: null,
        Jpeg: null,
      },
    ],
  },
])

const dicomInit = {
  CreateAccountNo: null,
  CreateTime: null,
  FileName: null,
  FilePath: null,
  Id: null,
  Type: null,
}

const dicomData = reactive({
  items: [],
})
const dicomItems = ref(cloneDeep(dicomData.items))

const checkDicom = (item) => {
  const reg = /^dicom_/
  return reg.test(item)
}

const dicomCount = reactive({
  count: 0,
})

const sheetData = reactive({
  InstitutionNo: null,
  CreateAccountNo: null,
  Nhi01: [],
  Nhi02: [],
  Nhi03: [],
  Nhi04: [],
  Nhi05: [],
  Nhi06: [],
  Nhi07: [],
  Nhi08: [],
  Nhi09: [],
  EecEncounters: [],
  MeetingMembers: [],
  MeetingInstitutionMembers: [],
  CanRecording: true,
  CanClose: true,
  Records: [],
  Patient: {
    Identifier: null,
    Encounters: [],
    Active: null,
    CreateTime: null,
    CreatePractitionerId: null,
    UpdateTime: null,
    UpdatePractitionerId: null,
    FirstVisitDate: null,
    FirstVisitMed: null,
    Career: null,
    PatientId: null,
    Name: null,
    Tel: null,
    GenderCode: null,
    Birthday: null,
    Address: null,
    MaritalStatus: null,
    ContactName: null,
    ContactTel: null,
    ContactAddress: null,
    ContactRelation: null,
    Area: null,
  },
  Attaches: [],
  Icds: [],
  PatientAge: null,
  IsSignatured: null,
  Id: null,
  PatientSourceType: null,
  ConsultationType: null,
  PatientSourceOtherType: null,
  ConsultationOtherType: null,
  InjuryLevel: null,
  SubType: null,
  ConditionDesc: null,
  Remark: null,
  Aimed: null,
  OtherAimed: null,
  Status: null,
  UnclearPatientInfo: null,
  UnclearConsultationInfo: null,
  Subjective: null,
  Objective: null,
  Assessment: null,
  Plan: null,
  NotifyDapart: null,
  NotifyInstitutionNos: [],
  IsOutsideReading: null,
})
provide('sheetData', sheetData)

const GetSheetById = async () => {
  try {
    loading.value = true
    const res = await getSheetById(route.params.id)

    if (res.status === 200) {
      Object.assign(sheetData, res.data)

      const group = groupBy(res.data.Attaches, (item) => {
        if ((item.FileName === '病患資料同意書' && item.Type === '同意書') || (item.FileName === '遠距會診同意書' && item.Type === '會診同意書')) {
          return 'form'
        } else {
          return 'other'
        }
      })

      const __items = cloneDeep(initData.items)

      if (!!group.form?.[0]) {
        __items[0] = group.form[0]
        showType.value = 'consent-image'
      } else {
        showType.value = 'consent-data-view'
      }

      if (!!group.form?.[1]) {
        __items[1] = group.form[1]
      }

      items.value = __items

      if (!!group.other) {
        items.value = items.value.concat(group.other)
      }

      showItem.value = items.value[0]
    }
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
  }
}

const GetDicomFile = async () => {
  try {
    const res = await getDicomFile(route.params.id)
    if (res.status === 200) {
      if (res.data.DicomFiles.length > 0) {
        const dicomItems = res.data.DicomFiles.map((item) => {
          return {
            FileName: item.Dicom,
            Dicom: item.Dicom,
            Jpeg: item.Jpeg,
            Type: 'Dicom',
          }
        })
      }
    }
    //   if (resDicom.status === 200 && dicomCount.count === 0) {
    //     dicomCount.count++

    //     if (resDicom.data.length) {
    //       resDicom.data.forEach((v, i) => {
    //         if (v.DicomFiles.length) {
    //           v.DicomFiles.forEach((w, j) => {
    //             let tempObj = cloneDeep(dicomInit)
    //             let tempReg = /\/(\w+).dcm$/
    //             let tempNo = w.Dicom.match(tempReg)
    //             let tempTag = 'dicom_'
    //             tempObj.CreateAccountNo = v.AccountNo
    //             tempObj.CreateTime = dayjs(new Date().getTime()).format('YYYY-MM-DDTHH:mm:ss')
    //             tempObj.FileName = tempReg.test(w.Dicom) ? tempNo[1] : new Date().getTime()
    //             tempObj.FilePath = w.Jpeg
    //             tempObj.Id = tempReg.test(w.Dicom) ? tempTag + tempNo[1] : tempTag + new Date().getTime()
    //             tempObj.Type = 'jpeg'

    //             dicomItems.value.push(tempObj)
    //           })
    //         }
    //       })
    //     }
    //   }
    // }
  } catch (err) {
    console.log(err)
  }
}

const consentData = reactive({
  PatientName: null,
  StationName: null,
  HospitalName: null,
  ConsentIdentifier: null,
  ApplyTime: null,
  SheetId: null,
  ConsentName: null,
  ConsentSignature: null,
  ConsentRelationship: null,
  Eyewitness1Signature: null,
  Eyewitness2Signature: null,
  AgentSignature: null,
  AgentRelationship: null,
  AgentIdentifier: null,
  Birthday: null,
})
provide('consentData', consentData)

const GetConsentById = async () => {
  try {
    const res = await getConsentById(sheetData.Id)
    if (res.status === 200) {
      Object.assign(consentData, res.data)
      consentData.Birthday = consentData.Birthday?.substring(0, 10)
    }
  } catch (err) {
    console.log(err)
  }
}

const confirmData = reactive({
  SheetId: null,
  Malady: null,
  InstitutionName: null,
  CreateAccountName: null,
  ConsultAccountName: null,
  CreateAccountTitle: null,
  CreateAccountDepartmentName: null,
  ConsentTime: null,
  ConsentSignature: null,
  ConsentIdentifier: null,
  ConsentRelationship: null,
  ConsentAddress: null,
  ConsentTel: null,
  Eyewitness1Signature: null,
  Eyewitness2Signature: null,
  ConsultAccountInstitutionNo: null,
  ConsultAccountNo: null,
})
provide('confirmData', confirmData)

const GetConsultConsentForm = async () => {
  try {
    const res = await getConsultConsentForm(sheetData.Id)
    if (res.status === 200) Object.assign(confirmData, res.data)
  } catch (err) {
    console.log(err)
  }
}

// ---modalItem---

const editModal = ref(false)
const nowType = ref(1)
const modalItem = ref({})

const file1 = ref('')
const currentFile = ref('')
const currentFileName = ref('')
const currentFileType = ref('')

function clearFile() {
  //put the file in it
  currentFile.value = ''
  currentFileName.value = ''
  currentFileType.value = ''
}

function clearFile2() {
  //put the file in it
  currentFile.value = ''
  currentFileName.value = ''
  currentFileType.value = ''
  document.getElementById('file-upload').value = ''
}

async function showEditModal(type, item) {
  //type- 1新增、2檢閱、3刪除

  if (type == 1) {
    clearFile()
    nowType.value = type
    editModal.value = true
  }
}

async function saveEditModal() {
  try {
    if (!Boolean(currentFileName.value)) {
      toast.error('請先選擇檔案', {
        timeout: 5000,
        hideProgressBar: true,
      })
      return
    }

    const formData = new FormData()
    formData.append('SheetId', route.params.id)
    formData.append('FileName', currentFileName.value)
    formData.append('File', currentFile.value)
    formData.append('IsConsentForm', false)
    formData.append('IsConsultConsentForm', false)

    AddAttach(formData)

    editModal.value = false
    await GetSheetById()
  } catch (e) {
    toast.error(`${e.response ? e.response.data : e}`, {
      timeout: 5000,
      hideProgressBar: true,
    })
  }
}

function selectFile() {
  document.getElementById('file-upload').click()
}

function fileChange(e) {
  console.log(e.target.files[0])
  currentFile.value = e.target.files[0]
  currentFileName.value = Boolean(e.target.files[0]) ? e.target.files[0].name.split('.')[0] : ''
  currentFileType.value = Boolean(e.target.files[0]) ? e.target.files[0].type : ''
}

const isSameInstitution = computed(() => {
  const accountInstitutionNo = store.state?.others ? store.state?.others.InstitutionNo : ''
  return sheetData.InstitutionNo == accountInstitutionNo
})

const printing = ref(false)
const toPrint = async () => {
  printing.value = true
  await nextTick()
  window.print()
  printing.value = false
}

onBeforeRouteLeave(async (to, from, next) => {
  if (isEditing.value) {
    dialog.saveWarn.show = true
    const choose = await new Promise((resolve) => {
      emitter.on('saveWarnCallback', async (choose) => {
        dialog.saveWarn.show = false
        await nextTick()
        emitter.off('saveWarnCallback')
        resolve(choose)
      })
    })

    if (choose) next()
    else next(false)
  } else {
    next()
  }
})

const showItem = ref()
const showType = ref('consent-data-view')

const toViewForm = (item) => {
  if (!!item.FilePath) {
    showItem.value = item
    showType.value = item.FileName === '病患資料同意書' ? 'consent-image' : 'confirm-image'
  } else {
    showType.value = item.FileName === '病患資料同意書' ? 'consent-data-view' : 'confirm-data-view'
  }
}

const toView = (item) => {
  showItem.value = item
  showType.value = 'image'
}

const isEditing = ref(false)

watch(showType, (val) => {
  isEditing.value = val.includes('edit')
  console.log(isEditing.value)
})

const toEdit = (item) => {
  if (!!item.FilePath) {
    dialog.editWarn.show = true

    emitter.on('editWarnCallback', async (choose) => {
      dialog.editWarn.show = false
      emitter.off('editWarnCallback')
      if (choose) {
        showType.value = item.FileName === '病患資料同意書' ? 'consent-data-edit' : 'confirm-data-edit'
      }
    })
  } else {
    showType.value = item.FileName === '病患資料同意書' ? 'consent-data-edit' : 'confirm-data-edit'
  }
}

const toDelete = (item) => {
  modalItem.value = item
  nowType.value = 3
  editModal.value = true
}

const toDownload = (item) => {
  const a = document.createElement('a')
  a.setAttribute('href', item.FilePath)
  a.setAttribute('target', '_blank')
  a.setAttribute('download', item.FileName)
  a.click()
}

const toSaveForm = () => {
  if (showType.value === 'consent-data-edit') {
    PostConsent()
  } else if (showType.value === 'confirm-data-edit') {
    PostConsultConsentForm()
  } else return
}

const checkConsentData = (data) => {
  const errorArr = []
  if (data.ConsentRelationshipForRadio === 'other') {
    if (!!data.ConsentRelationship === false) {
      errorArr.push('與病人之關係')
    }
  }

  if (!!data.ConsentSignature === false) errorArr.push('立同意書人簽章')
  if (!!data.PatientIdentifier === false) errorArr.push('身分證字號')
  if (!!data.Birthday === false) errorArr.push('出生年月日')

  if (errorArr.length > 0) {
    toast.error(`${errorArr.join('、')}為必填欄位`, {
      timeout: 5000,
      hideProgressBar: true,
    })
    return false
  } else return true
}

const PostConsent = async () => {
  try {
    const __data = cloneDeep(consentData)
    if (__data.ConsentRelationshipForRadio === 'self') __data.ConsentRelationship = null
    __data.ApplyTime = dayjs().format()
    __data.Birthday = dayjs(__data.Birthday).format()

    if (checkConsentData(__data) === false) return

    const res = await postConsent(__data)
    if (res.status === 200 || res.status === 204) {
      GetConsentById()
      toast.success('儲存成功', {
        timeout: 5000,
        hideProgressBar: true,
      })
      isEditing.value = false

      if (!!items.value[0].FilePath) {
        await DeleteAttach(items.value[0].Id)
        GetSheetById()
      }
    }
  } catch (err) {
    console.log(err)
    toast.error('儲存失敗', {
      timeout: 5000,
      hideProgressBar: true,
    })
  }
}

const checkConfirmData = (data) => {
  const errorArr = []
  if (!!data.Malady === false) errorArr.push('罹患疾病')

  if (!!data.InstitutionName === false) errorArr.push('說明地點（醫院/機構）')
  if (!!data.CreateAccountName === false) errorArr.push('說明之醫事人員')
  if (data.CreateAccountTitleForRadio === 'other') {
    if (!!data.CreateAccountTitle === false) {
      errorArr.push('職稱')
    }
  }

  if (data.ConsentRelationshipForRadio === 'other') {
    if (!!data.ConsentRelationship === false) {
      errorArr.push('與病人之關係')
    }
  }

  if (!!data.ConsentSignature === false) errorArr.push('立同意書人簽章')
  if (!!data.ConsentIdentifier === false) errorArr.push('身分證字號')

  if (errorArr.length > 0) {
    toast.error(`${errorArr.join('、')}為必填欄位`, {
      timeout: 5000,
      hideProgressBar: true,
    })
    return false
  } else return true
}

const PostConsultConsentForm = async () => {
  try {
    const __data = cloneDeep(confirmData)
    if (__data.CreateAccountTitleForRadio === 'doctor') __data.CreateAccountTitle = '醫師'
    if (__data.ConsentRelationshipForRadio === 'self') __data.ConsentRelationship = null
    __data.ApplyTime = dayjs().format()

    if (checkConfirmData(__data) === false) return

    const res = await postConsultConsentForm(__data)
    if (res.status === 200 || res.status === 204) {
      GetConsultConsentForm()
      toast.success('儲存成功', {
        timeout: 5000,
        hideProgressBar: true,
      })
      isEditing.value = false

      if (!!items.value[1].FilePath) {
        await DeleteAttach(items.value[1].Id)
        GetSheetById()
      }
    }
  } catch (err) {
    console.log(err)
    toast.error('儲存失敗', {
      timeout: 5000,
      hideProgressBar: true,
    })
  }
}

const onUploadImageClick = (item) => {
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
      const formData = new FormData()
      formData.append('SheetId', route.params.id)
      formData.append('FileName', item.FileName)
      formData.append('File', file)
      formData.append('IsConsentForm', item.FileName === '病患資料同意書')
      formData.append('IsConsultConsentForm', item.FileName === '遠距會診同意書')

      if (!!item.FilePath) {
        await DeleteAttach(consent.Id)
        AddAttach(formData)
      } else {
        AddAttach(formData)
      }
    }
  }
}

const AddAttach = async (formData) => {
  try {
    const res = await addAttach(formData)
    if (res.status === 200 || res.status === 204) {
      toast.success(`附件上傳成功`, {
        timeout: 3000,
        hideProgressBar: true,
      })
      GetSheetById()
    }
  } catch (err) {
    console.log(err)
    toast.error(`附件上傳失敗`, {
      timeout: 3000,
      hideProgressBar: true,
    })
  }
}

const DeleteAttach = async (id) => {
  try {
    const res = await deleteAttach(id)
    if (res.status === 200 || res.status === 204) {
      editModal.value = false
      toast.success(`附件更新成功`, {
        timeout: 3000,
        hideProgressBar: true,
      })
      GetSheetById()
    }
  } catch (err) {
    console.log(err)
    toast.error(`附件更新失敗`, {
      timeout: 3000,
      hideProgressBar: true,
    })
  }
}

const dialog = reactive({
  video: {
    show: false,
  },
  saveWarn: {
    show: false,
  },
  editWarn: {
    show: false,
  },
})

const dialogRef = ref()

const toVideoCapture = async () => {
  dialog.video.show = true
  await nextTick()
  if (dialogRef.value.maximized === false) dialogRef.value.maximize()
}

const onVideoCapture = (file) => {
  const formData = new FormData()
  formData.append('SheetId', route.params.id)
  formData.append('FileName', file.name)
  formData.append('File', file)
  formData.append('IsConsentForm', false)
  formData.append('IsConsultConsentForm', false)

  AddAttach(formData)
}

const init = async () => {
  await GetSheetById()
  GetConsentById()
  GetConsultConsentForm()
}
init()
</script>

<style lang="scss" scoped>
.attach-button {
  // @apply text-white font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-2 mb-1 text-sm;
  margin-right: 0.5rem;
  margin-bottom: 0.25rem;
  border-radius: 0.25rem;
  padding-left: 1rem;
  padding-right: 1rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  font-size: 0.875rem;
  line-height: 1.25rem;
  font-weight: 700;
  text-transform: uppercase;
  opacity: 1;
  color: rgba(255, 255, 255, 1);
  outline: 2px solid transparent;
  outline-offset: 2px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

  &.disabled {
    background-color: gray !important;
    cursor: not-allowed;
    opacity: 0.7;
  }
}

.modal-main-content {
  display: grid;
  grid-template-columns: 190px 1fr;
  padding: 10px;
  grid-column-gap: 20px;

  .left-img {
    width: 190px;
    border: 1px dashed #8cadef;
    border-radius: 6px;
    cursor: pointer;
  }

  .right-list {
    .right-main-content {
      display: grid;
      grid-template-columns: 120px 380px 1fr;

      > div {
        border: 1px solid rgb(255, 255, 255);
        border-bottom: none;
        border-right: none;
        overflow: hidden;
        text-overflow: ellipsis;
        -webkit-line-clamp: 1;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        font-size: 14px;
        padding: 8px 0;
        height: 52px;
        text-align: center;
      }

      > div:nth-child(4n) {
        border-right: 1px solid rgb(255, 255, 255);
      }
    }

    header {
      background: #e9e9e9;
      color: #364265;
      font-weight: 700;

      > div {
        padding-top: 12.5px !important;
      }
    }

    section {
      // background: #ecf6ff1c;
      color: #213474;
      font-weight: 600;
    }
  }

  .delete-main-content {
    color: #364265;
    font-weight: 600;
    font-size: 22px;
  }
}
</style>
