<template>
  <!-- origin draft form -->
  <medicalCardMessage ref="medicalCardMessageConponent"></medicalCardMessage>
  <medicalCardCertification ref="medicalCardCertificationConponent"></medicalCardCertification>
  <socketServerDownload ref="socketServerDownloadRef"></socketServerDownload>

  <div class="flex-1 flex flex-col border-r pr-2 overflow-hidden">
    <sheet v-if="!!itemData" ref="sheetDom" :itemData="itemData" :patientInfoGridNum="8" :patientShouldInsert="true"
      :detailWidth="detailWidth" />
    <div class="btns flex justify-center py-5">
      <div class="mr-1" v-if="!$route.query.viewdetail && $route.name == 'draftForm'">
        <Button class="p-temp" @click="savingSheetData('temporary')"><span class="text-white">暫存</span></Button>
      </div>
      <div class="mr-1" v-if="!$route.query.viewdetail && $route.name == 'draftForm'">
        <Button class="p-confirm" @click="savingSheetData('forever')"><span class="text-white">確認送出</span></Button>
      </div>
      <div class="mr-2" v-if="$route.name == 'draftForm'">
        <Button @click="openDeletDraftMessage" class="p-button-sm p-button-danger"
          style="margin-right: 5px !important; color: #fff">會診單刪除</Button>
        <!-- <Button class="p-button-outlined"
          @click="$route.query?.viewdetail ? $router.push({ name: 'recordingDelete' }) : $router.push(route.query.back || '/diagnosisManage/recordingMaintain')">關閉</Button> -->
        <Button class="p-button-outlined"
          @click="$route.query?.viewdetail ? $router.push({ name: 'recordingDelete' }) : $router.push($route.query.back || '/diagnosisManage/recordingMaintain')">關閉</Button>
      </div>

      <div v-if="$route.name == 'postEditForm'">
        <Button @click="postEditSave" style="margin-right: 8px" class="p-confirm" title="確認送出後，此病患將變為已結案狀態"><span
            class="text-white">確認送出</span></Button>
      </div>
      <div class="mr-2" v-if="$route.name == 'postEditForm'">
        <!-- <Button class="p-button-outlined"
          @click="; +itemData.data.Status == 100 ? $router.push({ name: 'closedList' }) : $router.push(route.query.back || '/diagnosisManage/recordingMaintain')">關閉</Button> -->
        <Button class="p-button-outlined"
          @click="; +itemData.data.Status == 100 ? $router.push({ name: 'closedList' }) : $router.push($route.query.back || '/diagnosisManage/recordingMaintain')">關閉</Button>
      </div>
      <div class="ml-2">
        <Button label="關閉" class="p-button-outlined p-button-danger"
          @click="$router.push({ name: 'supplementarySeal' })" supplementarySeal
          v-if="$route.name == 'sheetOnlyView'" />
      </div>
      <div class="ml-2" v-if="$route.name != 'sheetOnlyView'" :title="Boolean(medicalCardData) ? '已完成醫事人員卡認證' : ''">
        <Button label="醫事人員卡認證" class="p-button-outlined p-verydager" @click="checkMedicalCard"
          v-if="!showLoadingButton" :disabled="Boolean(medicalCardData)" />
        <Button label="loading..." class="p-button-outlined p-verydager" icon="pi pi-spin pi-spinner"
          v-if="showLoadingButton" />
      </div>
    </div>
  </div>
  <!--刪除草稿 -->
  <recordingDeleteMessage ref="modalRecordingDelete" @closeDeleteMessage="afterDeleteDraft"></recordingDeleteMessage>
</template>

<script>
import sheet from 'comps/diagnosis/sheet.vue'
import { ref, onMounted, computed, nextTick } from 'vue'
import { getSheetById } from 'Service/apis.js'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useToast } from 'vue-toastification'

import medicalCardMessage from '@/components/medicalCardMessage.vue'
import medicalCardCertification from '@/components/medicalCardCertification.vue'
import socketServerDownload from '@/components/medicalWebSocketServerDownload.vue'

import recordingDeleteMessage from '@/views/diagnosis/recordingDeleteMessage.vue'
import { medicalCardWebSocketCheckIdentifier, medicalCardWebSocketCheckCode } from '@/service/websocket.js'

export default {
  components: {
    sheet,
    medicalCardMessage,
    medicalCardCertification,
    recordingDeleteMessage,
    socketServerDownload,
  },
  props: {
    detailWidth: {
      type: Number,
      default: 100,
    },
  },
  setup() {
    const store = useStore()
    const socketServerDownloadRef = ref(null)
    const itemData = ref(null)
    const route = useRoute()
    const router = useRouter()
    const toast = useToast()
    const sheetDom = ref()
    const modalRecordingDelete = ref(null)
    const columns = [
      { key: 'custom1', label: '操作', type: 'text', width: '238px' },
      { key: 'custom2', label: '附件', type: 'text', width: '120px' },
      { key: 'custom3', label: '會診單下載', type: 'text', width: '128px' },
      { key: 'custom5', label: '歷程紀錄', type: 'text', width: '120px' },
      { key: 'custom4', label: '視訊紀錄', type: 'text', width: '120px' },
      { key: 'stateName', label: '會診狀態', type: 'text' },
      { key: 'name', label: '姓名', type: 'text' },
      { key: 'identy', label: '身分證字號', type: 'text' },
      { key: 'unit', label: '會診申請單位', type: 'text' },
      { key: 'CreateAccountName', label: '會診申請醫師', type: 'text' },
      { key: 'applyTime', label: '會診申請時間', type: 'text' },
    ]

    if (route.params.item) {
      // getSheetById
      const Id = JSON.parse(route.params.item)

      getSheetById(Id)
        .then(({ data }) => {
          if (Boolean(data.Patient.FirstVisitDate)) {
            data.Patient.FirstVisitDate = data.Patient.FirstVisitDate.split('T')[0]
          }
          if (data.CanRecording) {
            toast.success('需要撰寫會診記錄', {
              timeout: 2000,
              hideProgressBar: true,
            })
          }
          itemData.value = { data }
        })
        .catch(() => {
          toast.error('發生錯誤', {
            timeout: 5000,
            hideProgressBar: true,
          })
          router.replace(route.query.back || '/diagnosisManage/recordingMaintain')
        })
    } else {
      router.replace(route.query.back || '/diagnosisManage/recordingMaintain')
    }
    const savingSheetData = (type = 'temporary') => {
      // console.log("sheetDom.value", sheetDom.value);
      sheetDom.value
        .saveData(type)
        .then((res) => {
          // console.log("success savesheet");
          // router.push({ name: "recordingMaintain" });
        })
        .catch((err) => {
          console.log(err)
        })
    }

    const postEditSave = () => {
      sheetDom.value.savePostEditData()
    }

    const medicalCardMessageConponent = ref(null)
    const medicalCardCertificationConponent = ref(null)

    const checkMedicalCardMessage = () => {
      const noneedMessage = sessionStorage.getItem('noneedMes') ? sessionStorage.getItem('noneedMes').replace(/\"/g, '') : ''

      if (noneedMessage == 'true' || Boolean(store.state?.medicalCardData)) {
        return
      }
      medicalCardMessageConponent.value.showMedcalCardMessage = true
    }
    const showLoadingButton = ref(false)

    const checkMedicalCard = async () => {
      //it need use socket to connect backend software to check card first,if it's right card and show input paswword modal

      // medicalCardCertificationConponent.value.showMedicalCardCertification = true;
      showLoadingButton.value = true
      const res = await medicalCardWebSocketCheckIdentifier()

      if (res?.type == 'error') {
        socketServerDownloadRef.value.showMedicalWebSocketServerDownload = true
      }

      if (res == 'matchok') {
        medicalCardCertificationConponent.value.showMedicalCardCertification = true
      }
      showLoadingButton.value = false
    }

    const openDeletDraftMessage = () => {
      nextTick()
      modalRecordingDelete.value.showRecordingDeleteMessage = true
      modalRecordingDelete.value.getSheetId(itemData.value.data)
    }

    const afterDeleteDraft = () => {
      const obj1 = {
        selectedDate: '',
        selectedPatientName: '',
        selectedUnit: '',
        selectedIdNumber: '',
        selectedDoctor: '',
        selectedStatus: [],
      }

      const obj2 = {
        offset: 0,
        rows: 5,
        orderByArr: ['ApplyTime desc,Id desc'],
        headers: [
          { name: '操作', key: '', sortDesc: null },
          { name: '附件', key: '', sortDesc: null },
          { name: '會診單下載', key: '', sortDesc: null },
          { name: '視訊紀錄', key: '', sortDesc: null },
          { name: '歷程紀錄', key: '', sortDesc: null },
          { name: '會診狀態', key: 'Status', sortDesc: null },
          { name: '子狀態', key: '', sortDesc: null },
          { name: '執行空轉', key: '', sortDesc: null },
          { name: '姓名', key: '', sortDesc: null },
          { name: '身分證字號', key: '', sortDesc: null },
          { name: '會診申請單位', key: 'InstitutionNo', sortDesc: null },
          { name: '會診申請醫師', key: 'CreateAccountNo', sortDesc: null },
          { name: '會診申請時間', key: 'ApplyTime', sortDesc: null },
        ],
      }

      sessionStorage.setItem('filterData', JSON.stringify(obj1))
      sessionStorage.setItem('paginationData', JSON.stringify(obj2))

      if (route.query?.viewdetail) {
        router.push({ name: 'recordingDelete' })
      } else {
        router.push(route.query.back || '/diagnosisManage/recordingMaintain')
      }
    }

    const medicalCardData = computed(() => {
      return store.state?.medicalCardData
    })

    onMounted(() => {
      checkMedicalCardMessage()
    })

    return {
      columns,
      itemData,
      savingSheetData,
      sheetDom,
      medicalCardMessageConponent,
      medicalCardCertificationConponent,

      checkMedicalCard,
      postEditSave,

      modalRecordingDelete,
      openDeletDraftMessage,

      afterDeleteDraft,
      showLoadingButton,
      medicalCardData,
      socketServerDownloadRef,
    }
  },
}
</script>

<style lang="scss" scoped>
.btns {
  ::v-deep(.p-button) {
    @apply text-lg font-bold py-1;
    color: #5d4e61;

    &.p-temp {
      background-color: #20a0ab;
      border: 1px solid #20a0ab;
    }

    &.p-confirm {
      background-color: #1c3695;
    }

    &.p-verydager {
      // background-color: #00a0ad;
      // background-color: #d82012;
      // border: 1px solid#d82012;
      // color: aliceblue;
      background-color: #fff;
      border: 1px solid #d12a34;
      color: #d12a34;
    }
  }
}
</style>
