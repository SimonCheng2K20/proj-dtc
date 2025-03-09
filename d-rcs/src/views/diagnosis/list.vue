<template>
  <section class="dtc-main-section px-3">
    <section
      style="background: #fbfcf9; border: 1px solid #bdbdbd; border-radius: 0.25rem 0.25rem 0 0; margin-top: 8px; margin-bottom: 8px;">
      <h5 class="router-title big-title">{{ route.meta.title }}</h5>
      <div class="flex flex-col 2xl:flex-row gap-2 p-2">
        <my-input-group class="grid md:grid-cols-2 2xl:grid-cols-3 gap-2">
          <my-input-wrapper label="會診申請時間">
            <Calendar class="calendar" v-model="search.ApplyTimeStart" :showIcon="true" :manualInput="true"
              dateFormat="yy/mm/dd" v-date-input />
            <span class="mx-1 flex items-center">~</span>
            <Calendar class="calendar" v-model="search.ApplyTimeEnd" :showIcon="true" :manualInput="true"
              dateFormat="yy/mm/dd" v-date-input />
          </my-input-wrapper>
          <my-input-wrapper v-if="route.name === 'recordingMaintain'" label="會診狀態">
            <div class="flex gap-2">
              <Button class="justify-center whitespace-nowrap"
                :class="{ 'p-button-secondary': search.Status.includes(0) === false }" @click="onSearchStatusChange(0)">
                草稿
              </Button>
              <Button class="justify-center whitespace-nowrap" @click="onSearchStatusChange(10)"
                :class="{ 'p-button-secondary': search.Status.includes(10) === false }">
                會診中
              </Button>
              <Button class="justify-center whitespace-nowrap" @click="onSearchStatusChange(20)"
                :class="{ 'p-button-secondary': search.Status.includes(20) === false }">
                會診結束
              </Button>
              <!-- <Button
                class="justify-center whitespace-nowrap"
                @click="onSearchStatusChange(100)"
                :class="{ 'p-button-secondary': search.Status.includes(100) === false }"
              >
                已結案
              </Button> -->
            </div>
          </my-input-wrapper>
          <my-input-wrapper label="病患姓名">
            <InputText type="text" v-model.trim="search.patientName" @keydown.enter="searchSubmit" />
          </my-input-wrapper>
          <my-input-wrapper label="病患身分證字號">
            <InputText type="text" v-model.trim="search.patientIdentifier" @keydown.enter="searchSubmit" />
          </my-input-wrapper>

          <!-- 諮詢 -->
          <my-input-wrapper label="諮詢單位">
            <AutoComplete :class="['full-w']" v-model="InstituteTemp.InstitutionNo" :suggestions="InstituteSuggest"
              placeholder="全部" optionLabel="text" :delay="300" :dropdown="true" @complete="GetInstitute($event.query)"
              @item-select="SetInstitute($event.value)" @change="CheckInstitute($event.value)" :selectOnFocus="false"
              :autoOptionFocus="false" :autoHighlight="false" />
          </my-input-wrapper>
          <my-input-wrapper label="諮詢醫師">
            <InputText type="text" placeholder="名稱" v-model.trim="search['CreateAccount/Name']"
              @keydown.enter="searchSubmit" />
          </my-input-wrapper>

          <!-- 會診 -->
          <my-input-wrapper label="會診單位">
            <AutoComplete :class="['full-w']" v-model="InstituteTemp.InstitutionNoC" :suggestions="InstituteSuggest"
              placeholder="全部" optionLabel="text" :delay="300" :dropdown="true" @complete="GetInstituteC($event.query)"
              @item-select="SetInstituteC($event.value)" @change="CheckInstituteC($event.value)" :selectOnFocus="false"
              :autoOptionFocus="false" :autoHighlight="false" />
          </my-input-wrapper>
          <my-input-wrapper label="會診醫師">
            <InputText type="text" placeholder="代碼" v-model.trim="search['CreateAccount/No']"
              @keydown.enter="searchSubmit" />
          </my-input-wrapper>

        </my-input-group>
        <div class="flex items-start justify-end flex-shrink-0 gap-2">
          <Button style="background: #0c69e1" @click="searchSubmit"> 查詢 </Button>
          <Button style="background: #6a9f3e" @click="searchClear"> 清除 </Button>
          <Button @click="exportExcel" class="p-button-danger" v-if="route.name !== 'recordingDelete'">匯出Excel</Button>
          <!-- 隸屬於急診醫療站的單位之帳號才可建立會診單 -->
          <Button v-if="$route.name == 'recordingMaintain' && isAbleToAddSheet" @click="modalPatientSheet.showSheet()"
            class="p-button-warning" :disabled="!isAbleToAddSheet">
            <i class="pi pi-plus mr-1"></i>
            <span>建立會診單</span>
          </Button>

          <!-- 隸屬於急診醫療站的單位之帳號才可建立快速會診單 -->
          <Button v-if="$route.name == 'recordingMaintain' && isAbleToAddSheet" :disabled="!isAbleToAddSheet"
            @click="creatQuickSheet">
            <i class="pi pi-sign-out mr-1"></i>
            <span>快速會診</span>
          </Button>
        </div>
      </div>
    </section>

    <my-table class="max-h-[688px]" :headers="headers" :items="items" :loading="loading" v-model:sortBy="sortBy"
      @sort="searchSubmit" :pageOptions="pageOptions" @pageChange="pageChange" pageQuery>
      <template #item-action="{ item }">
        <div class="flex justify-center" v-if="$route.name !== 'recordingDelete'"
          :title="item.MeetingInstitutionMembers.join('、')">
          <img v-if="!item.CanEdit && !item.CanMeeting && !item.CanCancel" class="cursor-pointer"
            src="/assets/sheetdetail.svg" style="width: 42px" @click.stop="clickItemEvent('enterClosedCase', item)"
            title="檢視會診紀錄" />
          <img v-if="
            (item.ConsultationOtherType?.includes('快速') || item.ConsultationOtherType?.includes('路倒')) &&
            +item.Status === 20 &&
            isAbleToAddSheet &&
            item.CreateAccountNo == loginAccount
          " style="width: 30px" class="cursor-pointer ml-2" src="/assets/editicon.png"
            title="編輯會診單病患資料 (快速或路倒病患才可在會診結束時進行資料編輯)" @click.stop="clickItemEvent('postedit', item)" />
          <img v-if="(+item.Status == 20 || +item.Status == 100) && isAirReferralAccount" style="width: 30px"
            class="ml-2" :class="!item.IsAirReferral ? 'cursor-pointer' : ''" src="/assets/filetransfer.png"
            title="執行空轉" @click="clickItemEvent('implementTransfer', item)"
            :style="item.IsAirReferral ? 'pointer-events: none;background: rgb(207 209 214);' : ''" />
          <Button v-if="item.CanEdit" class="p-button-sm p-button-success" @click.stop="clickItemEvent('edit', item)"
            style="margin-left: 3px !important">
            編輯草稿
          </Button>
          <div v-if="item.CanMeeting" class="relative">
            <Button class="p-button-sm p-button-primary ml-5" @click.stop="showRemind('accessMeeting', item)"
              style="margin-left: 3px !important">
              進入會診
            </Button>
            <span v-if="item.RecordingWarning" class="dot"> ! </span>
          </div>

          <Button v-if="item.CanCancel" class="p-button-sm p-button-warning ml-5"
            @click.stop="showRemind('cancelSheet', item)" style="margin-left: 3px !important">會診單抽回</Button>
        </div>
        <div class="flex justify-center" v-if="$route.name == 'recordingDelete'">
          <Button class="p-button-sm ml-5" style="margin-left: 3px !important"
            @click.stop="clickItemEvent('viewDetail', item)">檢視</Button>
          <Button v-if="isAbleToAddSheet || isAdminAccount" class="p-button-sm p-button-danger ml-5"
            style="margin-left: 3px !important" @click.stop="clickItemEvent('deleteDraft', item)">刪除</Button>
        </div>
      </template>
      <template #item-attach="{ item }">
        <div class="flex justify-center">
          <div class="relative">
            <img style="width: 43px" class="cursor-pointer" src="/assets/attach-icon.png"
              @click.stop="clickItemEvent('attach', item)" :title="!item.HasConsentForm ? '尚未填寫病患資料同意書' : ''" />
            <span class="dot" v-if="!item.HasConsentForm" v-show="item.InstitutionNo == accountInstitutionNData"
              title="尚未填寫病患資料同意書"> !</span>
          </div>
        </div>
      </template>
      <template #header-sheet>
        <div class="flex justify-center items-center gap-2">
          <Checkbox v-model="isAllSelect" binary @change="onSelectAllChange"></Checkbox>
          <Button @click="onDownloadClick">會診單下載</Button>
        </div>
      </template>
      <template #item-sheet="{ item }">
        <div class="flex justify-center items-center gap-2" style="padding-top: 5px">
          <Checkbox v-model="selected" :value="item.Id"></Checkbox>
          <img style="width: 36px" class="cursor-pointer" src="/assets/pdf-icon.png" @click.stop="toPDF(item)" />
        </div>
      </template>
      <template #item-record="{ item }">
        <div class="flex justify-center">
          <img style="width: 43px" class="cursor-pointer" src="/assets/play-icon.png"
            @click.stop="clickItemEvent('play', item)" />
        </div>
      </template>
      <template #item-history="{ item }">
        <div class="flex justify-center">
          <img style="width: 40px" class="cursor-pointer" src="/assets/history2.png"
            @click.stop="clickItemEvent('history', item)" />
        </div>
      </template>
      <template #item-IsAirReferral="{ item }">
        <div class="flex justify-center" style="display: flex; align-items: flex-start; padding-top: 5px">
          <span v-if="item.IsAirReferral" title="已執行空轉"><svg class="h-8 w-8 text-green-500" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <span v-else title="尚未執行空轉(會診結束時才可執行空轉)">
            <svg class="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </span>
        </div>
      </template>
    </my-table>

    <!-- 會診單抽回 -->
    <Dialog class="custom-modal" v-model:visible="modalShowRemind" style="width: 600px" :modal="true"
      :draggable="false">
      <template #header>
        <h3>
          {{ modalTypeShowRemind == 'accessMeeting' ? '進入會診' : '會診單抽回' }}
        </h3>
      </template>
      <div class="flex justify-center m-5">
        <div class="mr-2">
          <img class="w-9" src="/assets/notice-icon2.png" />
        </div>
        <div class="text-3xl font-bold">通知</div>
      </div>
      <main class="font-bold text-lg">
        <div v-if="modalTypeShowRemind == 'accessMeeting'">您將要進入會診，相關資訊如下:</div>
        <div v-else>您將要抽回會診單，相關資訊如下:</div>

        <div class="mt-5">申請單位: {{ modalItemShowRemind.InstitutionName }}</div>
        <div>申請時間: {{ dayjs(modalItemShowRemind.ApplyTime).format('YYYY-MM-DD') }}</div>
        <div class="mb-5">病人姓名: {{ modalItemShowRemind.Patient.Name }}</div>

        <div v-if="modalTypeShowRemind == 'accessMeeting'">如要加入會診，會診結束須填寫「會診紀錄」!</div>
        <div v-else>如會診紀錄已經有醫師填寫，抽回會診單將會清空</div>
      </main>

      <template #footer>
        <div class="footer-modal relative">
          <Button :label="modalTypeShowRemind == 'accessMeeting' ? '加入' : '確定抽回'" @click="confirmRemind" />
          <Button :label="modalTypeShowRemind == 'accessMeeting' ? '不加入' : '取消抽回'" class="p-button-danger"
            @click="modalShowRemind = false" />

          <Button v-if="modalTypeShowRemind === 'accessMeeting'"
            style="position: absolute; right: 0px; background: white; color: black"
            @click="clickItemEvent('look', modalItemShowRemind)">
            僅查閱
          </Button>
        </div>
      </template>
    </Dialog>

    <Dialog class="custom-modal" v-model:visible="dialog.addMeet.show" style="width: 600px" :modal="true"
      :draggable="false" header="進入會診">
      <div class="flex justify-center">
        <div class="mr-2">
          <img class="w-9" src="/assets/notice-icon2.png" />
        </div>
        <div class="text-3xl font-bold">通知</div>
      </div>
      <div class="font-bold text-lg">
        <div>您將要進入會診，相關資訊如下：</div>
        <div class="mt-5">申請單位: {{ modalItemShowRemind.InstitutionName }}</div>
        <div>申請醫師: {{ modalItemShowRemind.CreateAccountName }}</div>
        <div>申請時間: {{ dayjs(modalItemShowRemind.ApplyTime).format('YYYY-MM-DD') }}</div>
        <div>病人姓名: {{ modalItemShowRemind.Patient.Name }}</div>
        <div class="mt-5">如要加入會診，會診結束須填寫「會診紀錄」!</div>
      </div>

      <div class="mt-5">
        <div class="font-bold text-lg">已加入會診醫師：</div>
        <my-table :headers="memberHeaders" :items="meetingMemberItems" hide-default-footer></my-table>
      </div>

      <template #footer>
        <div class="footer-modal relative">
          <Button label="加入" @click="clickItemEvent('accessMeeting', modalItemShowRemind)" />
          <Button label="不加入" class="p-button-danger" @click="dialog.addMeet.show = false" />

          <Button style="position: absolute; right: 0px; background: white; color: black"
            @click="toView(modalItemShowRemind.Id)"> 僅查閱 </Button>
        </div>
      </template>
    </Dialog>

    <!-- 歷程紀錄 -->
    <Dialog class="custom-modal3" v-model:visible="modalShowHistory" style="width: 768px" :modal="true"
      :draggable="false">
      <template #header>
        <h3>歷程記錄</h3>
      </template>
      <medical-history :modalItemHistory="modalItemHistory"></medical-history>
    </Dialog>

    <!-- 會診單下載 -->
    <download-sheet v-show="modalShowDownload" :modalItemDownload="modalItemDownload" @close="modalShowDownload = false"
      ref="modalDownload"></download-sheet>

    <!-- 建立會診單 -->
    <consultation-sheet ref="modalPatientSheet" @close="sheetIsOpened"></consultation-sheet>

    <!-- 執行空轉 -->
    <air-tranfer-message ref="modalAirTransfer" @update="searchSubmit"></air-tranfer-message>

    <!--刪除草稿 -->
    <recordingDeleteMessage ref="modalRecordingDelete" @closeDeleteMessage="searchClear"> </recordingDeleteMessage>
  </section>
</template>

<script setup>
import medicalHistory from './medicalHistory.vue'
import downloadSheet from './downloadSheet.vue'
import consultationSheet from './consultationSheet.vue'
import airTranferMessage from './airTranferMessage.vue'
import recordingDeleteMessage from './recordingDeleteMessage.vue'
import { hisWebSocketServerCallServer, hisWebSocketServerCallPatientData } from '@/service/websocket.js'
import { ref, computed, onMounted, onBeforeUnmount, onUnmounted, onDeactivated, reactive, watch, nextTick } from 'vue'
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'
import { useStore } from 'vuex'
import { getSheetList, getInstitutionList, getSheetById, getDakarInfo, getDakarById, addQuickSheet, getSheetExcel, getSheetPdf } from 'Service/apis.js'
import { sheetStatusArr } from 'Service/constants.js'
import { useToast } from 'vue-toastification'
import dayjs from 'dayjs'
import setSearchQuery from 'utils/setSearchQuery.js'
import setOdataFilter from 'utils/setOdataFilter.js'
import isValidSearchValue from 'utils/isValidSearchValue.js'
import { cloneDeep } from 'lodash-es'

const modalPatientSheet = ref(null)
const modalAirTransfer = ref()
const modalRecordingDelete = ref(null)
const router = useRouter()
const route = useRoute()
const store = useStore()
const toast = useToast()

const props = defineProps({
  metaName: String,
})

//基層醫院(急診醫療站)才可新增會診單
const isAbleToAddSheet = computed(() => {
  const groupbelong = JSON.parse(sessionStorage.getItem('groupbelong')) || []
  return groupbelong.includes(0)
})

//是否此帳號的組織單位為空轉使用者
const isAirReferralAccount = computed(() => store.state.dakar.IsAirReferralUser)

//是否為系統管理員帳號
const isAdminAccount = computed(() => {
  const userRoles = store.state?.dakar ? store.state?.dakar.RoleNos : []
  return userRoles.includes('Admins')
})

//使用者帳號
const loginAccount = computed(() => {
  return store.state?.dakar ? store.state?.dakar?.No : ''
})

//查詢使用者機構代碼
const accountInstitutionNData = computed(() => {
  const accountInstitutionNo = store.state?.others ? store.state?.others.InstitutionNo : ''
  return accountInstitutionNo
})

const modalShowHistory = ref(false)
const modalItemHistory = ref({})
const modalShowDownload = ref(false)
const modalItemDownload = ref({})
const modalDownload = ref(null)

const modalShowRemind = ref(false)
const modalTypeShowRemind = ref('')
const modalItemShowRemind = ref({})

const showRemind = (type, item) => {
  if (type == 'accessMeeting') {
    if (item.RecordingWarning) {
      modalItemShowRemind.value = item
      toMeeting(item)
    } else {
      clickItemEvent('accessMeeting', item)
    }
  }
  if (type == 'cancelSheet') {
    modalTypeShowRemind.value = type
    modalShowRemind.value = true
    modalItemShowRemind.value = item
  }
}

const confirmRemind = () => {
  if (modalTypeShowRemind.value == 'accessMeeting') {
    clickItemEvent('accessMeeting', modalItemShowRemind.value)
  }
  if (modalTypeShowRemind.value == 'cancelSheet') {
    clickItemEvent('cancelSheet', modalItemShowRemind.value)
  }
  modalShowRemind.value = false
}

const toView = (id) => {
  router.push({
    name: 'formalForm',
    query: { isLook: true, back: route.fullPath },
    params: { item: id },
  })
}

const toPDF = async (item) => {
  await nextTick()
  modalItemDownload.value = { ...item }
  modalDownload.value.getData(item.Id, item)
  modalShowDownload.value = true
}

const clickItemEvent = async (key, item) => {
  // this is recordingMaintain page

  if (key === 'accessMeeting' || key === 'edit' || key === 'look') {
    const _paramItem = JSON.parse(JSON.stringify(item))
    if (key === 'look') _paramItem.isLook = true
    store.commit('m_setEditItem', _paramItem)
    router.push({
      name: key === 'edit' ? 'draftForm' : 'formalForm',
      params: { item: _paramItem.Id },
      query: {
        back: route.fullPath,
      },
    })
  } else if (key === 'postedit') {
    store.commit('m_setEditItem', item)
    const _paramItem = JSON.parse(JSON.stringify(item))
    router.push({
      name: 'postEditForm',
      params: { item: _paramItem.Id },
    })
  } else if (key === 'implementTransfer') {
    modalAirTransfer.value.showDialog(item.Id)
  } else if (key === 'viewDetail') {
    store.commit('m_setEditItem', item)
    const _paramItem = JSON.parse(JSON.stringify(item))
    router.push({
      name: item.Status == 0 ? 'draftForm' : 'formalForm',
      params: { item: _paramItem.Id },
      query: {
        viewdetail: true,
        back: route.fullPath,
      },
    })
  } else if (key === 'deleteDraft') {
    store.commit('m_setEditItem', item)
    modalRecordingDelete.value.showRecordingDeleteMessage = true
  } else if (key === 'play') {
    store.commit('m_setEditItem', item)
    router.push({
      name: 'videoRecord',
      query: {
        viewfrom: route.name,
      },
    })
  } else if (key === 'attach') {
    store.commit('m_setEditItem', item)
    router.push({
      name: 'attachMaintain',
      params: {
        id: item.Id,
      },
    })
  } else if (key === 'cancelSheet') {
    await store.dispatch('meetingHub/invokeCancelSheet', item.Id)
    toast.success('成功', {
      timeout: 5000,
      hideProgressBar: true,
    })
  } else if (key === 'enterClosedCase') {
    store.commit('m_setEditItem', item)
    router.push({
      name: 'formalForm',
      params: { item: item.Id },
      query: { back: route.fullPath },
    })
  } else if (key === 'history') {
    modalShowHistory.value = true
    modalItemHistory.value = { ...item }
    nextTick()
  }
}

//his sheet-----------------

const setAcountData = async (sheetId, tokenData) => {
  store.commit('m_setToDefaultData')
  sessionStorage.clear()
  sessionStorage.setItem('token', tokenData)

  //set main data
  const { data } = await getDakarInfo()
  data.Token = tokenData
  store.commit('m_setAuthData', data)
  sessionStorage.setItem('dakar', JSON.stringify(data))

  //set other data
  const accountNo = store.state?.dakar ? store.state?.dakar.No : ''
  const { data: otherData } = await getDakarById(`${accountNo}`)

  store.commit('m_setOthersData', otherData)
  store.dispatch('a_setFunctionList')
}

const setSheetData = async (sheetId, tokenData) => {
  //get sheet data and edit
  const { data } = await getSheetById(sheetId)

  if (Boolean(route.query?.isHIS) && !!data.Patient?.Identifier) {
    if (data.Patient?.Identifier && data.Patient?.Name != '無名氏') {
      const resWebsocket = await hisWebSocketServerCallServer()
      if (resWebsocket == 'ok') {
        await hisWebSocketServerCallPatientData(data.Patient?.Identifier)
      }
    }
    clickItemEvent('edit', data)
  } else {
    clickItemEvent('accessMeeting', data)
  }
}

const isAllSelect = ref(false)
const selected = ref([])

const onSelectAllChange = async () => {
  if (isAllSelect.value) {
    await GetSheetList('all')
    selected.value = items.value.map((item) => item.Id)
  } else selected.value = []
}

const onDownloadClick = () => {
  if (selected.value.length === 0) {
    toast.error('請選取要下載之會診單！', {
      timeout: 5000,
      hideProgressBar: true,
    })
  } else {
    selected.value.forEach((item) => {
      GetSheetPdf(item)
    })
  }
}

const GetSheetPdf = async (id) => {
  try {
    const query = setSearchQuery({ id })
    const res = await getSheetPdf(query)
    const filename = res.data.match(/\/(會診紀錄單.*\.pdf)/)[1]
    const a = document.createElement('a')
    a.setAttribute('href', res.data)
    a.setAttribute('download', filename)
    a.click()
  } catch (err) {
    console.log(err)
  }
}

const headers = ref([
  { key: 'action', value: 'action', text: '操作' },
  { key: 'attach', value: 'attach', text: '附件' },
  { key: 'sheet', value: 'sheet', text: '會診單下載' },
  { key: 'record', value: 'record', text: '視訊紀錄' },
  { key: 'history', value: 'history', text: '歷程紀錄' },
  {
    key: 'Status',
    value: (row) => sheetStatusArr.find((item) => item.value === row.Status).text || 'No Data',
    text: '會診狀態',
  },
  { key: 'subStatus', value: (row) => (row.UnclearPatientInfo && row.UnclearConsultationInfo ? '快速' : row.UnclearPatientInfo ? '路倒' : ''), text: '子狀態' },
  { key: 'IsAirReferral', value: 'IsAirReferral', text: '執行空轉' },
  { key: 'Name', value: (row) => row.Patient.Name, text: '姓名' },
  { key: 'Identifier', value: (row) => row.Patient.Identifier, text: '身分證字號' },
  { key: 'InstitutionName', value: 'InstitutionName', text: '諮詢單位' },
  { key: 'CreateAccountName', value: 'CreateAccountName', text: '諮詢醫師' },

  { key: 'MeetingInstitutionMembers', value: (row) => `${row.MeetingInstitutionMembers ? row.MeetingInstitutionMembers.join(',') : ''}`, text: '會診單位' },
  { key: 'MeetingMembers', value: (row) => `${row.MeetingMembers ? row.MeetingMembers.join(',') : ''}`, text: '會診醫師' },

  { key: 'ApplyTime', value: (row) => row.ApplyTime?.replace('T', ' '), text: '會診申請時間' },
])

const items = ref([])

const loading = ref(false)

let cacheSearch = {
  patientName: null,
  patientIdentifier: null,
  $skip: null,
  $top: null,
  $filter: null,
  $orderBy: null,
  InstitutionNoC: null,
  InstitutionNo: null,
}

const GetSheetList = async (isAll) => {
  try {
    loading.value = true

    const temp = {
      patientName: search.patientName,
      patientIdentifier: search.patientIdentifier,
      $skip: isAll ? null : pageOptions.firstIndex,
      $top: isAll ? null : pageOptions.perPageCount,
      $filter: filter.value,
      $orderBy: orderBy.value,
    }

    const query = setSearchQuery(temp)

    const res = await getSheetList(query)
    items.value = res.data.Items
    pageOptions.totalItemsCount = res.data.Count
  } catch (err) {
    console.log(err)
  } finally {
    loading.value = false
  }
}

const sortBy = ref([['ApplyTime', 'desc']])
const orderBy = computed(() => {
  return sortBy.value.map((item) => item.join(' ')).join(',')
})

const pageOptions = reactive({
  firstIndex: Number(route.query.firstIndex) || 0,
  perPageCount: Number(route.query.perPageCount) || 5,
  totalItemsCount: 0,
  rowsPerPage: [5, 10, 20, 30],
})

const initData = {}
initData.search = {
  ApplyTimeStart: null,
  ApplyTimeEnd: null,
  InstitutionNoC: null,
  InstitutionNo: null,
  'CreateAccount/No': null,
  'CreateAccount/Name': null,
  patientName: null,
  patientIdentifier: null,
  Status: route.name === 'closedList' ? [100] : [],
}
const search = reactive(cloneDeep(initData.search))

const filter = computed(() => {

  const query = {
    ApplyTimeStart: search.ApplyTimeStart,
    ApplyTimeEnd: search.ApplyTimeEnd,
    InstitutionNoC: search.InstitutionNoC,
    InstitutionNo: search.InstitutionNo,
    'CreateAccount/No': search['CreateAccount/No'],
    'CreateAccount/Name': search['CreateAccount/Name'],
    Status: search.Status,
  }

  const filterString = Object.entries(query)
    .filter(([key, value]) => isValidSearchValue(value))
    .map(([key, value]) => {
      switch (key) {
        case 'ApplyTimeStart':
          return setOdataFilter({ key: 'ApplyTime', value: encodeURIComponent(dayjs(value).format()), operator: 'ge' })
        case 'ApplyTimeEnd':
          return setOdataFilter({ key: 'ApplyTime', value: encodeURIComponent(dayjs(value).add(1, 'day').format()), operator: 'lt' })
        case 'InstitutionNoC':
          let tempIN = setOdataFilter({ key: 'InstitutionNo', value, operator: 'eq' })
          let retIN = `Records/any(m:m/Account/${tempIN})`
          return retIN
        case 'InstitutionNo':
          return setOdataFilter({ key, value, operator: 'eq' })
        case 'CreateAccount/No':
          let tempAN = setOdataFilter({ key: 'AccountNo', value, operator: 'eq' })
          let retAN = `Records/any(m:m/${tempAN})`
          return retAN
        case 'CreateAccount/Name':
          return setOdataFilter({ key, value, operator: 'contains' })
        case 'Status': {
          const statusFilterArr = value.map((item) => setOdataFilter({ key, value: item, operator: 'eq' })).join(' or ')
          return `(${statusFilterArr})`
        }
      }
    }).join(' and ')

  if (route.name === 'recordingMaintain') {
    if (filterString.length === 0) {
      return 'Status lt 100'
    } else {
      return filterString.concat(' and Status lt 100')
    }
  } else {
    return filterString
  }
})

const pageChange = () => {
  GetSheetList()
}

const searchSubmit = () => {
  pageOptions.firstIndex = 0
  GetSheetList()
}

const searchClear = () => {
  sessionStorage.removeItem('cacheSearch')
  Object.assign(search, cloneDeep(initData.search))
  InstituteTemp.InstitutionNoC = null
  InstituteTemp.InstitutionNo = null
  pageOptions.firstIndex = 0
  GetSheetList()
}

const onSearchStatusChange = (key) => {
  const index = search.Status.indexOf(key)
  if (index === -1) {
    search.Status.push(key)
  } else {
    search.Status.splice(index, 1)
  }
  searchSubmit()
}

//建立會診單
const sheetIsOpened = async (id) => {
  toast.success('建立會診單成功', {
    timeout: 3000,
    hideProgressBar: true,
  })
  router.push({
    name: 'draftForm',
    params: { item: id },
  })
}

//快速會診
const creatQuickSheet = async () => {
  try {
    const res = await addQuickSheet()
    // console.log("res", res, res.data);
    const all = res.data
    clickItemEvent('accessMeeting', all)
    toast.success('快速會診單建立成功', {
      timeout: 3000,
      hideProgressBar: true,
    })
  } catch (e) {
    toast.error('系統資訊: ' + e, {
      timeout: 5000,
      hideProgressBar: true,
    })
  }
}

//匯出excel
const exportExcel = async () => {
  const query = setSearchQuery({
    $skip: pageOptions.firstIndex,
    $top: pageOptions.perPageCount,
    $filter: filter.value,
    $orderBy: orderBy.value,
  })
  const res = await getSheetExcel(query)
  const url = window.URL.createObjectURL(res.data)
  const filename = decodeURIComponent(res.headers['content-disposition'].match(/filename\*=.*''(.*)/)[1])
  const a = document.createElement('a')
  a.setAttribute('href', url)
  a.setAttribute('download', filename)
  a.click()
}

const toMeeting = (item) => {
  meetingMemberItems.value = item.MeetingInstitutionMembers.map((item) => {
    const match = item.match(/<(.*)>(.*)/)
    const InstitutionName = match[1]
    const Name = match[2]

    return { InstitutionName, Name }
  })

  dialog.addMeet.show = true
}

const dialog = reactive({
  addMeet: { show: false },
})

const meetingMemberItems = ref([])
const memberHeaders = [
  { key: 'InstitutionName', text: '單位', value: 'InstitutionName' },
  { key: 'Name', text: '姓名', value: 'Name' },
]

const institutionList = ref([])
const GetInstitutionList = async () => {
  try {
    const res = await getInstitutionList()
    institutionList.value = res.data.Items.map((item) => ({ text: `${item.Name}【${item.No}】`, value: item.No }))
  } catch (err) {
    console.log(err)
  }
}

// for AutoComplete
const InstituteSuggest = ref([])
const InstituteTemp = reactive({
  InstitutionNo: null,
  InstitutionNoC: null
})

const GetInstitute = (query) => {
  InstituteSuggest.value = cloneDeep(institutionList.value.filter((v) => {
    if (v.text.includes(query)) {
      return true
    } else {
      return false
    }
  }))
}

const SetInstitute = (value) => {
  search.InstitutionNo = value.value
  if (Boolean(value)) {
    searchSubmit()
  }
}

const CheckInstitute = (value) => {
  if (!Boolean(value)) {
    searchClear()
  }
}

const GetInstituteC = (query) => {
  InstituteSuggest.value = cloneDeep(institutionList.value.filter((v) => {
    if (v.text.includes(query)) {
      return true
    } else {
      return false
    }
  }))
}

const SetInstituteC = (value) => {
  search.InstitutionNoC = value.value
  if (Boolean(value)) {
    searchSubmit()
  }
}

const CheckInstituteC = (value) => {
  if (!Boolean(value)) {
    searchClear()
  }
}

const onStatusChanged = () => {
  searchSubmit()
}

onBeforeRouteLeave(async (to, from, next) => {

  cacheSearch = cloneDeep({
    patientName: search.patientName,
    patientIdentifier: search.patientIdentifier,
    $skip: pageOptions.firstIndex,
    $top: pageOptions.perPageCount,
    $filter: search,
    $orderBy: orderBy.value,
    InstitutionNoC: InstituteTemp.InstitutionNoC,
    InstitutionNo: InstituteTemp.InstitutionNo,
  })

  sessionStorage.setItem('cacheSearch', JSON.stringify(cacheSearch))

  if (to.name !== 'formalForm' && store.state.meetingHub.connection !== null) {
    await store.state.meetingHub.connection.stop()
    store.dispatch('meetingHub/init')
  }
  next()
})

onUnmounted(() => {
  store.state.meetingHub.emitter.off('StatusChanged', onStatusChanged)
})

watch(
  () => route.name,
  (val) => {
    console.log(val)
    init()
  }
)

const init = async () => {

  if (route.name === 'recordingMaintain' && store.state.dakar.No !== 'assist') {
    // 會診單刪除作業無須 connect
    if (store.state.meetingHub.connection === null) {
      await store.dispatch('meetingHub/connectMeetingHub')
    }
    store.state.meetingHub.emitter.on('StatusChanged', onStatusChanged)
  }

  GetInstitutionList()
  await GetSheetList()

  if (Boolean(route.query.sheetId) && Boolean(route.query.token)) {
    await setAcountData(route.query.sheetId, route.query.token)
    await setSheetData(route.query.sheetId, route.query.token)
  }

  if (route.name === 'closedList') {
    initData.search.Status = [100]
  } else {
    initData.search.Status = []
  }

  if (sessionStorage.cacheSearch) {

    cacheSearch = JSON.parse(sessionStorage.cacheSearch)

    search.ApplyTimeStart = cacheSearch.$filter.ApplyTimeStart ? dayjs(cacheSearch.$filter.ApplyTimeStart).format('YYYY-MM-DD') : ''
    search.ApplyTimeEnd = cacheSearch.$filter.ApplyTimeEnd ? dayjs(cacheSearch.$filter.ApplyTimeEnd).format('YYYY-MM-DD') : ''

    // options value (InstitutionNo)
    InstituteTemp.InstitutionNoC = cacheSearch.InstitutionNoC ? cacheSearch.InstitutionNoC : ''
    InstituteTemp.InstitutionNo = cacheSearch.InstitutionNo ? cacheSearch.InstitutionNo : ''
    // select value (InstitutionNo)
    search.InstitutionNoC = cacheSearch.InstitutionNoC?.value ? cacheSearch.InstitutionNoC?.value : ''
    search.InstitutionNo = cacheSearch.InstitutionNo?.value ? cacheSearch.InstitutionNo?.value : ''

    search['CreateAccount/No'] = cacheSearch.$filter['CreateAccount/No'] ? cacheSearch.$filter['CreateAccount/No'] : ''
    search['CreateAccount/Name'] = cacheSearch.$filter['CreateAccount/Name'] ? cacheSearch.$filter['CreateAccount/Name'] : ''
    search.patientName = cacheSearch.patientName ? cacheSearch.patientName : ''
    search.patientIdentifier = cacheSearch.patientIdentifier ? cacheSearch.patientIdentifier : ''

    search.Status = route.name === 'closedList' ? [100] : []

    // page options
    pageOptions.firstIndex = cacheSearch.$skip
    pageOptions.perPageCount = cacheSearch.$top

    GetInstitutionList()
    await GetSheetList()

  } else {
    searchClear()
  }

}

init()

</script>

<style lang="scss" scoped>
.footer-modal {
  display: flex;
  justify-content: center;
}

.big-title {
  background: #e1e8f6;
  padding: 5px;
  color: #333;
  border-radius: 0.15rem 0.15rem 0 0;
  font-size: 20px;
  font-weight: bold;
}

.dot {
  position: absolute;
  right: -10px;
  top: -7px;
  display: inline-block;
  text-align: center;
  background: #d12a34;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 700;
  min-width: 1.4rem;
  height: 1.4rem;
  line-height: 1.4rem;
  border-radius: 50%;
  padding-left: 3px;
  z-index: 888;
}
</style>
