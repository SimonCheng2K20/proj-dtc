<template>
  <!-- 會診單 -->
  <div class="formal">
    <nav class="flex items-center justify-between flex-wrap bg-white py-4 lg:px-12 small-nav">
      <div class="flex justify-between lg:w-auto w-full lg:border-b-0 pl-6 pr-2 border-gray-300 pb-5 lg:pb-0"
        :class="mobileMenuIsOpen ? 'border-solid border-b-1' : ''">
        <div class="flex items-center flex-shrink-0 text-gray-800 mr-16"></div>
        <div class="block lg:hidden">
          <button id="nav"
            class="flex items-center px-3 py-2 border-2 rounded text-blue-700 border-blue-700 hover:text-blue-700 hover:border-blue-700"
            @click="openChatroom">
            <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <!-- <title>Menu</title> -->
              <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"></path>
            </svg>
          </button>
        </div>
      </div>

      <div class="menu w-full flex-grow lg:flex lg:items-center lg:w-auto lg:px-3 px-8" v-show="mobileMenuIsOpen">
        <div class="text-md font-bold text-blue-700 lg:flex-grow">
          <a href="#responsive-header"
            class="block mt-4 lg:inline-block lg:mt-0 hover:text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
            @click.prevent="openChatroom">
            即時聊天室
          </a>
        </div>
      </div>
    </nav>

    <div class="formal-groupdata" @click="showParticipantGroupDatas" v-show="groupData">
      <img src="/assets/contact.svg" :style="groupData ? 'cursor: pointer' : ''"
        v-tooltip.bottom="`${groupData ? '群組資訊' : ''}`" />
    </div>
    <group-datas ref="participantdataref"></group-datas>

    <!-- formal-form -->
    <menuFunc v-model="funcName" @change="changeFuncName" @buttonClickEvent="buttonClickEvent"
      @callGetUrl="callUrlEvent" :itemData="itemData" ref="menuFuncFormalForm" />

    <div class="form-side" v-show="!showOtherContent">
      <div class="member-content">
        <div class="stamp-content">
          <button v-show="!Boolean(itemData.data?.IsSignatured)"
            class="px-2 py-1 rounded-md text-xl border transition text-red-600 border-red-600 font-black stamp-btn cursor-default"
            style="height: 70%">
            未簽章
          </button>
          <button v-show="Boolean(itemData.data?.IsSignatured)"
            class="px-2 py-1 rounded-md text-xl border transition text-green-600 border-green-600 active:bg-green-700 font-black stamp-btn cursor-default"
            style="height: 70%">
            已簽章
          </button>
        </div>
        <members class="mb-2" :records="itemData.data.Records" :items="meetingMembers"
          :meetingInstitutionMembers="itemData.data.MeetingInstitutionMembers" :id="itemData.data.Id"
          :status="itemData.data.state" :builderInstitution="itemData.data.InstitutionNo"
          :CanClose="itemData.data.CanClose" @clickEvent="buttonClickEvent" :detailWidth="detailWidth"
          :funcName="funcName" />
      </div>

      <sheet ref="sheetDom" :itemData="itemData" :disabled="true" :detailWidth="detailWidth" />
    </div>

    <transition>
      <component v-if="!showOtherContent" :style="detailWidth ? `width: ${detailWidth}px` : ''" ref="comps"
        :name="funcName" :is="funcComp" :itemData="itemData" class="w-102" @btnClick="buttonClickEvent"
        :status="itemData.data.state" @closeRightCompFunc="closeRightCompFunc" />
    </transition>

    <transition name="slide-fade">
      <iframecontent class="ml-1" v-if="itemData.data.Status === 10"
        v-show="showOtherContent && otherContent === 'videoTab'" :itemData="itemData" ref="iframecontentRef">
      </iframecontent>
    </transition>

    <attachview ref="attachcomponent" v-if="showOtherContent && otherContent == 'attach'"></attachview>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted, onBeforeUnmount, watch, onMounted, nextTick, provide } from 'vue'
import { suggestion } from 'comps/diagnosis/options'
import { useStore } from 'vuex'
import members from 'comps/diagnosis/members.vue'
import sheet from 'comps/diagnosis/sheet.vue'
import menuFunc from 'comps/diagnosis/menu-func.vue'
import recording from './recording.vue'

import revisecloud from 'comps/diagnosis/revisecloud.vue'
import revisehis from 'comps/diagnosis/revisehis.vue'
import reviseEec from 'comps/diagnosis/reviseEec.vue'

import videoTab from 'comps/diagnosis/video.vue'
import iframecontent from './iframecontent.vue'
import attachview from './attachview.vue'

import { funcObject } from 'comps/diagnosis/diagnosisSource.js'
import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'
import { getSheetById, getPaceUrlById, postCloseMeeting, postLeaveTheMeeting } from 'Service/apis.js'
import dayjs from 'dayjs'
import { useToast } from 'vue-toastification'
import groupDatas from '@/components/diagnosis/groupDatas.vue'

const detailWidth = ref(775) //right component size
const store = useStore()
const route = useRoute()
const router = useRouter()
const itemData = ref({
  data: {
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
  },
})
const sheetDom = ref()
const toast = useToast()
const iframecontentRef = ref(null)

if (!!route.params.item === false) {
  router.replace(route.query.back || '/diagnosisManage/recordingMaintain')
}

const funcName = ref('')
const funcComp = computed(() => {
  switch (funcName.value) {
    case 'revisehis':
      return revisehis
    case 'reviseEec':
      return reviseEec
    case 'revisecloud':
      return revisecloud
    case 'recording':
      return recording
    default:
      return null
  }
})
const meetingMembers = computed(() => itemData.value.data.MeetingMembers || ['none'])
const comps = ref()

function changeFuncName() {
  if (!!comps.value && !!comps.value.emptyCompList) comps.value.emptyCompList()
  setTimeout(() => {
    if (comps.value && comps.value.fetchCompList) comps.value.fetchCompList()
  }, 0)
}

const PostCloseMeeting = async () => {
  try {
    const res = await postCloseMeeting(itemData.value.data.Id)
    if (res.status === 200) {
      toast.success(`結束會診成功`, {
        timeout: 2000,
        hideProgressBar: true,
      })
      router.push(route.query.back || '/diagnosisManage/recordingMaintain')
    }
  } catch (err) {
    console.log(err)
  }
}

async function buttonClickEvent(key) {
  // console.log("back");
  if (key == 'back') {
    router.push('/diagnosisManage/recordingMaintain')
  } else if (key === 'finish') {
    PostCloseMeeting()
  }
}

//show pacs or meeting iframe or attach
const showOtherContent = ref(false)
const otherContent = ref('')
const meetingurl = ref({})
const attachcomponent = ref(null)
async function callUrlEvent(key) {
  // formal form callUrlEvent
  if (key === 'pacs' || key === 'videoTab') {
    if (itemData.value.data.Status != 10 && key === 'videoTab') {
      return
    }
    if (key === 'pacs') {
      const res = await getPaceUrlById(itemData.value.data.Id)
      window.open(res.data)
    } else if (key === 'videoTab') {
      showOtherContent.value = true
      otherContent.value = 'videoTab'
    }
  } else if (key === 'attach') {
    showOtherContent.value = true
    otherContent.value = 'attach'
    await nextTick()

    attachcomponent.value.getData()
  } else {
    showOtherContent.value = false
  }
}

const fetchCount = ref(0)
provide('fetchCount', fetchCount)
const fetchSheetById = async (nowType = 1) => {
  //nowType為了讓第一次載入時觸發就好，status change時不要觸發 "需要撰寫會診記錄"的訊息
  const { data } = await getSheetById(route.params.item)
  if (data.CanRecording && nowType == 1) {
    toast.success('需要撰寫會診記錄', {
      timeout: 2000,
      hideProgressBar: true,
    })
  }

  //整理三種介接eec、cloud、his

  //eec
  data.EecEncounters.sort((a, b) => {
    if (a.PeriodStart > b.PeriodStart) return -1
    if (a.PeriodStart < b.PeriodStart) return 1
  })

  data.EecEncounters = data.EecEncounters.map((s) => {
    s.creatTimes = s.CreateTime ? dayjs(s.CreateTime).format('YYYY/MM/DD') : ''
    s.periodStart = s.PeriodStart ? dayjs(s.PeriodStart).format('YYYY/MM/DD') : ''
    s.conditionSummary = s.Complaints.map((k) => `${k.Evidence}`).join('\n')
    return s
  })

  const eecData1 = data.EecEncounters.filter((s) => s.Code == 'EEC02') //門診病歷
  const eecData2 = data.EecEncounters.filter((s) => s.Code == 'EEC01') //出院病摘
  const eecData3 = data.EecEncounters.filter((s) => s.Code == 'EEC05') //醫療影像及報告
  const eecData4 = data.EecEncounters.filter((s) => s.Code == 'EEC04') //檢驗報告
  const eecData5 = data.EecEncounters.filter((s) => s.Category == '57833-6') //門診用藥紀錄
  const eecData6 = data.EecEncounters.filter((s) => s.Category == '18748-4') // 醫學影像報告

  itemData.value.data = {
    ...itemData.value.data,
    ...data,
  }

  itemData.value.eecData1 = [...eecData1]
  itemData.value.eecData2 = [...eecData2]
  itemData.value.eecData3 = [...eecData3]
  itemData.value.eecData4 = [...eecData4]
  itemData.value.eecData5 = [...eecData5]
  itemData.value.eecData6 = [...eecData6]

  //his
  data.Patient?.Encounters.sort((a, b) => {
    if (a.PeriodStart > b.PeriodStart) return -1
    if (a.PeriodStart < b.PeriodStart) return 1
  })

  data.Patient.Encounters = data.Patient?.Encounters.map((s) => {
    s.creatTimes = s.CreateTime ? dayjs(s.CreateTime).format('YYYY/MM/DD') : ''
    s.periodStart = s.PeriodStart ? dayjs(s.PeriodStart).format('YYYY/MM/DD') : ''
    s.times = s.PeriodStart ? dayjs(s.PeriodStart).format('YYYY/MM/DD') : ''
    s.conditionSummary = s.Complaints.map((k) => `${k.Evidence}`).join('\n')
    s.specialNote = s.Complaints.map((k) => `${k.Category}`).join('\n')
    return s
  })

  const hisData1 = data.Patient.Encounters.filter((s) => s.Category == 'IPD') //門診
  const hisData2 = data.Patient.Encounters.filter((s) => s.Category == 'ER') //急診
  const hisData3 = data.Patient.Encounters.filter((s) => s.Category == 'OPD') //住院(出院)

  let hisData1TimesArray = []
  hisData1TimesArray = hisData1.map((s) => `${s.times}`)
  hisData1TimesArray = [...new Set(hisData1TimesArray)]
  hisData1TimesArray = hisData1TimesArray.filter((s) => !!s)

  let hisData2TimesArray = []
  hisData2TimesArray = hisData2.map((s) => `${s.times}`)
  hisData2TimesArray = [...new Set(hisData2TimesArray)]
  hisData2TimesArray = hisData2TimesArray.filter((s) => !!s)

  let hisData3TimesArray = []
  hisData3TimesArray = hisData3.map((s) => `${s.times}`)
  hisData3TimesArray = [...new Set(hisData3TimesArray)]
  hisData3TimesArray = hisData3TimesArray.filter((s) => !!s)

  if (hisData1TimesArray.length > 1) {
    hisData1TimesArray.unshift('All Data')
  }
  if (hisData2TimesArray.length > 1) {
    hisData2TimesArray.unshift('All Data')
  }

  if (hisData3TimesArray.length > 1) {
    hisData3TimesArray.unshift('All Data')
  }

  itemData.value.hisData1 = [...hisData1]
  itemData.value.hisData2 = [...hisData2]
  itemData.value.hisData3 = [...hisData3]

  itemData.value.his1TimesArray = hisData1TimesArray
  itemData.value.his2TimesArray = hisData2TimesArray
  itemData.value.his3TimesArray = hisData3TimesArray

  //cloud
  //01-雲端藥歷
  const cloud1 = !!data.Nhi01
    ? data.Nhi01.map((s) => {
      s.times = s.DosageInstructionDateStart ? `${s.DosageInstructionDateStart}`.split(' ')[0] : ''
      s.timedata = s?.DosageInstructionDateStart
      return s
    })
    : []
  cloud1.sort((a, b) => {
    if (a.times > b.times) return -1
    if (a.times < b.times) return 1
  })
  let cloud1TimesArray = []
  cloud1TimesArray = cloud1.map((s) => `${s.times}`)
  cloud1TimesArray = [...new Set(cloud1TimesArray)]
  cloud1TimesArray = cloud1TimesArray.filter((s) => !!s)

  if (cloud1TimesArray.length > 1) {
    cloud1TimesArray.unshift('All Data')
  }
  itemData.value.cloud1 = [...cloud1]
  itemData.value.cloud1TimesArray = cloud1TimesArray

  //02-檢查檢驗
  const cloud2 = !!data.Nhi02
    ? data.Nhi02.map((s) => {
      s.times = s.PPeriodStart ? `${s.PPeriodStart}`.split(' ')[0] : ''
      s.timedata = s?.PPeriodStart
      return s
    })
    : []
  cloud2.sort((a, b) => {
    if (a.times > b.times) return -1
    if (a.times < b.times) return 1
  })
  let cloud2TimesArray = []
  cloud2TimesArray = cloud1.map((s) => `${s.times}`)
  cloud2TimesArray = [...new Set(cloud2TimesArray)]
  cloud2TimesArray = cloud2TimesArray.filter((s) => !!s)

  if (cloud2TimesArray.length > 1) {
    cloud2TimesArray.unshift('All Data')
  }
  itemData.value.cloud2 = [...cloud2]
  itemData.value.cloud2TimesArray = cloud2TimesArray

  //03-手術明細記錄
  const cloud3 = !!data.Nhi03
    ? data.Nhi03.map((s) => {
      s.times = s?.StartDate ? `${s.StartDate}`.split(' ')[0] : ''
      s.timedata = s?.StartDate
      return s
    })
    : []
  cloud3.sort((a, b) => {
    if (a.times > b.times) return -1
    if (a.times < b.times) return 1
  })
  let cloud3TimesArray = []
  cloud3TimesArray = cloud3.map((s) => `${s.times}`)
  cloud3TimesArray = [...new Set(cloud3TimesArray)]
  cloud3TimesArray = cloud3TimesArray.filter((s) => !!s)

  if (cloud3TimesArray.length > 1) {
    cloud3TimesArray.unshift('All Data')
  }
  itemData.value.cloud3 = [...cloud3]
  itemData.value.cloud3TimesArray = cloud3TimesArray

  //04-牙科處置及手術作業
  const cloud4 = !!data.Nhi04
    ? data.Nhi04.map((s) => {
      s.times = s?.StartDate ? `${s.StartDate}`.split(' ')[0] : ''
      s.timedata = s?.StartDate
      return s
    })
    : []
  cloud4.sort((a, b) => {
    if (a.times > b.times) return -1
    if (a.times < b.times) return 1
  })
  let cloud4TimesArray = []
  cloud4TimesArray = cloud4.map((s) => `${s.times}`)
  cloud4TimesArray = [...new Set(cloud4TimesArray)]
  cloud4TimesArray = cloud4TimesArray.filter((s) => !!s)

  if (cloud4TimesArray.length > 1) {
    cloud4TimesArray.unshift('All Data')
  }
  itemData.value.cloud4 = [...cloud4]
  itemData.value.cloud4TimesArray = cloud4TimesArray

  //05-過敏藥
  const cloud5 = !!data.Nhi05
    ? data.Nhi05.map((s) => {
      s.times = s?.StartDate ? `${s.StartDate}`.split(' ')[0] : ''
      s.timedata = s?.StartDate
      return s
    })
    : []
  cloud5.sort((a, b) => {
    if (a.times > b.times) return -1
    if (a.times < b.times) return 1
  })
  let cloud5TimesArray = []
  cloud5TimesArray = cloud5.map((s) => `${s.times}`)
  cloud5TimesArray = [...new Set(cloud5TimesArray)]
  cloud5TimesArray = cloud5TimesArray.filter((s) => !!s)

  if (cloud5TimesArray.length > 1) {
    cloud5TimesArray.unshift('All Data')
  }
  itemData.value.cloud5 = [...cloud5]
  itemData.value.cloud5TimesArray = cloud5TimesArray

  //06-檢驗(查)結果
  const cloud6 = !!data.Nhi06
    ? data.Nhi06.map((s) => {
      s.times = s.EffectivePeriodStart ? `${s.EffectivePeriodStart}`.split(' ')[0] : ''
      s.timedata = s?.EffectivePeriodStart
      return s
    })
    : []
  cloud6.sort((a, b) => {
    if (a.times > b.times) return -1
    if (a.times < b.times) return 1
  })
  let cloud6TimesArray = []
  cloud6TimesArray = cloud6.map((s) => `${s.times}`)
  cloud6TimesArray = [...new Set(cloud6TimesArray)]
  cloud6TimesArray = cloud6TimesArray.filter((s) => !!s)
  // cloud6TimesArray.push('2022/2/19');

  if (cloud6TimesArray.length > 1) {
    cloud6TimesArray.unshift('All Data')
  }
  itemData.value.cloud6 = [...cloud6]
  itemData.value.cloud6TimesArray = cloud6TimesArray

  //07-出院病摘
  const cloud7 = !!data.Nhi07
    ? data.Nhi07.map((s) => {
      s.times = s?.StartDate ? `${s.StartDate}`.split(' ')[0] : ''
      s.timedata = s?.StartDate
      return s
    })
    : []
  cloud7.sort((a, b) => {
    if (a.times > b.times) return -1
    if (a.times < b.times) return 1
  })
  let cloud7TimesArray = []
  cloud7TimesArray = cloud7.map((s) => `${s.times}`)
  cloud7TimesArray = [...new Set(cloud7TimesArray)]
  cloud7TimesArray = cloud7TimesArray.filter((s) => !!s)

  if (cloud7TimesArray.length > 1) {
    cloud7TimesArray.unshift('All Data')
  }
  itemData.value.cloud7 = [...cloud7]
  itemData.value.cloud7TimesArray = cloud7TimesArray

  //08-復健醫療
  const cloud8 = !!data.Nhi08
    ? data.Nhi08.map((s) => {
      s.times = s?.StartDate ? `${s.StartDate}`.split(' ')[0] : ''
      s.timedata = s?.StartDate
      return s
    })
    : []
  cloud8.sort((a, b) => {
    if (a.times > b.times) return -1
    if (a.times < b.times) return 1
  })
  let cloud8TimesArray = []
  cloud8TimesArray = cloud8.map((s) => `${s.times}`)
  cloud8TimesArray = [...new Set(cloud8TimesArray)]
  cloud8TimesArray = cloud8TimesArray.filter((s) => !!s)

  if (cloud8TimesArray.length > 1) {
    cloud8TimesArray.unshift('All Data')
  }
  itemData.value.cloud8 = [...cloud8]
  itemData.value.cloud8TimesArray = cloud8TimesArray

  //09-中醫用藥
  const cloud9 = !!data.Nhi09
    ? data.Nhi09.map((s) => {
      s.times = s?.StartDate ? `${s.StartDate}`.split(' ')[0] : ''
      s.timedata = s?.StartDate
      return s
    })
    : []
  cloud9.sort((a, b) => {
    if (a.times > b.times) return -1
    if (a.times < b.times) return 1
  })
  let cloud9TimesArray = []
  cloud9TimesArray = cloud9.map((s) => `${s.times}`)
  cloud9TimesArray = [...new Set(cloud9TimesArray)]
  cloud9TimesArray = cloud9TimesArray.filter((s) => !!s)

  if (cloud9TimesArray.length > 1) {
    cloud9TimesArray.unshift('All Data')
  }
  itemData.value.cloud9 = [...cloud9]
  itemData.value.cloud9TimesArray = cloud9TimesArray

  fetchCount.value++
}

const menuFuncFormalForm = ref(null)

const closeRightCompFunc = () => {
  menuFuncFormalForm.value.closeRightComp()
}

//set 群組資訊 data
const groupData = computed(() => {
  const partnerHospitalsData =
    store.state?.dakar && store.state?.dakar.PartnerHospitals
      ? store.state?.dakar.PartnerHospitals.map((s) => `機構: ${s.Name}  電話: ${Boolean(s.Tel) ? s.Tel : '123'}`).join('\n')
      : ''

  const responsibilityHospitalsData =
    store.state?.dakar && store.state?.dakar.ResponsibilityHospitals
      ? store.state?.dakar.ResponsibilityHospitals.map((s) => `機構:${s.Name}  電話:${Boolean(s.Tel) ? s.Tel : ''}`).join('\n')
      : ''

  return (
    `${Boolean(partnerHospitalsData) || Boolean(responsibilityHospitalsData) ? '【群組資訊】 \n\n' : ''}` +
    `${Boolean(partnerHospitalsData) ? `合作醫院: \n${partnerHospitalsData}\n\n` : ''}` +
    `${Boolean(responsibilityHospitalsData) ? `重度急救責任醫院: \n${responsibilityHospitalsData}` : ''}`
  )
})

const participantdataref = ref(null)
const showParticipantGroupDatas = () => {
  if (!groupData.value) {
    return
  }
  participantdataref.value.modalShowGroupDatas = true
}

const mobileMenuIsOpen = ref(false)
//mobile menu
const openChatroom = () => {
  iframecontentRef.value.showVideoSection = !iframecontentRef.value.showVideoSection
  mobileMenuIsOpen.value = false
}

const PostLeaveTheMeeting = async () => {
  try {
    await postLeaveTheMeeting(itemData.value.data.Id)
  } catch (err) {
    console.log(err)
  }
}

const onStatusChanged = (message) => {
  console.log('onStatusChanged')
  if (message.id !== itemData.value.data.Id) return

  fetchSheetById(2)
  itemData.value.data.MeetingMembers = message.MeetingMembers
}

const onCloudReady = (message) => {
  if (message.id !== itemData.value.data.Id) return

  fetchSheetById(2)
}

onBeforeRouteLeave(async (to, from, next) => {
  // 401 時 token 會清除，避免轉跳到登入時卡死
  if (!!sessionStorage.getItem('token')) {
    if (to.name !== 'recordingMaintain') {
      if (!!store.state.meetingHub.connection) {
        await store.state.meetingHub.connection.stop()
      }
      if (!!store.state.chatHub.connection) {
        await store.dispatch('chatHub/invokeExit', itemData.value.data.Id)
        await store.state.chatHub.connection.stop()
      }
      store.dispatch('chatHub/init')
      store.dispatch('meetingHub/init')
    }
    await PostLeaveTheMeeting()
    next()
  } else {
    if (to.name !== 'Auth') next('/auth')
    else next()
  }
})

onUnmounted(() => {
  store.state.meetingHub.emitter.off('StatusChanged', onStatusChanged)
  store.state.meetingHub.emitter.off('CloudReady', onCloudReady)
})

const isJoinMeeting = ref(false)
const isMounted = ref(false)

onMounted(() => {
  isMounted.value = true
})

const isAllFinish = computed(() => isJoinMeeting.value && isMounted.value)
const init = async () => {
  const unwatch = watch(isAllFinish, async (val) => {
    if (val) {
      await fetchSheetById(1)
      funcName.value = 'videoTab'
      callUrlEvent('videoTab')
      changeFuncName()
      unwatch()
    }
  })

  if (store.state.dakar.No === 'assist') {
    await fetchSheetById(1)
    funcName.value = 'videoTab'
    callUrlEvent('videoTab')
    changeFuncName()
    unwatch()
    return
  }

  await fetchSheetById(1)

  if (itemData.value.data.Status === 10) {
    if (store.state.meetingHub.connection === null) {
      await store.dispatch('meetingHub/connectMeetingHub')
    }
    store.dispatch('meetingHub/invokeJoinMeeting', [itemData.value.data.Id, !!route.query.isLook]).then(() => {
      isJoinMeeting.value = true
    })
    store.state.meetingHub.emitter.on('StatusChanged', onStatusChanged)
    store.state.meetingHub.emitter.on('CloudReady', onCloudReady)

    if (store.state.chatHub.connection === null) {
      await store.dispatch('chatHub/connectChatHub')
    }
    store.dispatch('chatHub/invokeJoin', itemData.value.data.Id)
  } else {
    funcName.value = 'recording'
    unwatch()
  }
}
init()
</script>

<style lang="scss" scoped>
.small-nav {
  position: absolute;
  top: -10px;
  left: 0;
  width: 100vw;
  background: transparent;
  z-index: 100;
}

.formal {
  @apply flex flex-1 overflow-hidden;
  padding: 0.5rem;

  .formal-groupdata {
    position: absolute;
    left: 53px;
    top: 106px;
    box-shadow: rgba(9, 30, 66, 0.25) 0px 1px 1px, rgba(9, 30, 66, 0.13) 0px 0px 1px 1px;
  }

  .form-side {
    height: calc(100vh - 79px);
    @apply flex-1 flex flex-col border-r px-2 overflow-y-auto;

    .member-content {
      display: grid;
      grid-template-columns: 83px 1fr;

      .stamp-content {
        display: flex;
        align-items: center;
      }
    }
  }
}

@media screen and (max-width: 500px) {
  .formal {
    padding: 0;

    .formal-groupdata {
      display: none;
    }
  }
}

.v-enter-active,
.v-leave-active {
  transition: all 0.25s;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translateX(100%);
  margin-left: -32rem;
}

.v-enter-to,
.v-leave-from {
  opacity: 1;
}
</style>

<style lang="scss">
.date-list {
  @apply p-2 text-lg text-center;
  color: #1d6196;

  >div {
    @apply pb-2;
  }

  .title {
    @apply rounded-lg text-white p-1 text-xl;
    background-color: #3186c8;
  }

  .active {
    background-color: #90f0ad;
  }
}

#resize {
  cursor: col-resize;
  width: 3px;
}

.slide-fade-enter-active {
  transition: all 0.1s ease-out;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
}
</style>
