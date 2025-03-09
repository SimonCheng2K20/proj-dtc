<template>
  <!-- 草稿page -->
  <div class="draft-formal" :style="$route.name == 'postEditForm' || $route.name == 'sheetOnlyView' ? 'padding:4px !important' : ''">
    <!-- for draft form and postedit form -->

    <menuFunc
      v-show="$route.name != 'postEditForm' && $route.name != 'sheetOnlyView'"
      v-model="funcName"
      @change="changeFuncName"
      @buttonClickEvent="buttonClickEvent"
      @callGetUrl="callUrlEvent"
      ref="menuFuncDraftForm"
    />
    <div class="draft-form-side" v-show="!showOtherContent">
      <sheet ref="sheetDom" :detailWidth="detailWidth" />
    </div>
    <!-- <div id="resize" @mousedown="dragControllerDiv"></div> -->
    <transition>
      <component
        v-show="!showOtherContent"
        :style="detailWidth ? `width: ${detailWidth}px` : ''"
        ref="comps"
        :name="funcComp"
        :title="funcObject[funcComp]"
        v-if="funcComp"
        :is="funcComp"
        :itemData="itemData"
        class="w-102"
        @btnClick="buttonClickEvent"
        :status="itemData.data.state"
        @closeRightCompFunc="closeRightCompFunc"
      />
    </transition>
    <attachview ref="attachcomponent" :itemData="itemData" v-show="showOtherContent && otherContent == 'attach'"></attachview>
  </div>
</template>

<script>
import { ref, computed, onUnmounted, onMounted } from 'vue'
import { suggestion } from 'comps/diagnosis/options'
import { useStore } from 'vuex'
import members from 'comps/diagnosis/members.vue'

import sheet from './index.vue'
import menuFunc from 'comps/diagnosis/menu-funcfordraft.vue'

import videoTab from 'comps/diagnosis/video.vue'
import attachview from '@/views/diagnosis/formal/attachview.vue'

import { funcObject, cloudIdNameObject } from 'comps/diagnosis/diagnosisSource.js'
import { useRouter, useRoute } from 'vue-router'
import { getSheetById, getPaceUrlById } from 'Service/apis.js'
import dayjs from 'dayjs'
import { useToast } from 'vue-toastification'
import revisehis from 'comps/diagnosis/revisehis.vue'
import revisecloud from 'comps/diagnosis/revisecloud.vue'
import reviseEec from 'comps/diagnosis/reviseEec.vue'
export default {
  components: {
    members,
    sheet,
    menuFunc,
    // his: rightSideColumns,
    his: revisehis,
    // electronic: rightSideColumns,
    electronic: reviseEec,
    // cloud: rightSideColumns,
    cloud: revisecloud,
    videoTab,
    attachview,
  },
  setup() {
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const itemData = ref({ data: {} })
    const sheetDom = ref()
    const toast = useToast()
    if (route.params.item) {
      itemData.value.data = {
        ...itemData.value.data,
        ...store.state.editItem
        // ...JSON.parse(route.params.item),
      }
    } else {
      router.replace('/diagnosisManage/recordingMaintain')
    }

    const funcName = ref('draftForm')
    const funcComp = computed(() => (Object.keys(funcObject).some((v) => v === funcName.value) ? funcName.value : null))
    const meetingMembers = computed(() => itemData.value.data.MeetingMembers || ['none'])
    const comps = ref()

    function changeFuncName() {
      if (!!comps.value && !!comps.value.emptyCompList) comps.value.emptyCompList()
      setTimeout(() => {
        if (comps.value && comps.value.fetchCompList) comps.value.fetchCompList()
      }, 0)
    }

    function buttonClickEvent(key) {
      if (key == 'back') {
        //回主畫面
        router.push('/diagnosisManage/recordingMaintain')
      }
    }

    //show pacs  or attach
    const showOtherContent = ref(false)
    const otherContent = ref('')
    const attachcomponent = ref(null)
    function callUrlEvent(key) {
      // console.log("callUrlEvent", key);
      if (key === 'pacs') {
        const getUrl = getPaceUrlById
        getUrl(itemData.value.data.Id).then((res) => {
          window.open(res.data)
        })
      } else if (key === 'attach') {
        showOtherContent.value = true
        otherContent.value = 'attach'
        attachcomponent.value.getData()
      } else {
        showOtherContent.value = false
      }
    }

    async function fetchSheetById() {

      console.log(
        `itemData.value.data.Id: `, itemData.value.data.Id,
        `+route.params.item: `, +route.params.item
      )

      //新增會診單判斷
      if(itemData.value.data.Id !== +route.params.item){
        return
      }

      const { data } = await getSheetById(itemData.value.data.Id)

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

      console.log('itemData.value', itemData.value)

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
    }

    //resize component div
    const detailWidth = ref(775)

    const menuFuncDraftForm = ref(null)
    const closeRightCompFunc = () => {
      menuFuncDraftForm.value.closeDraftRightComp()
    }

    onMounted(async () => {
      await fetchSheetById()
    })

    return {
      sheetDom,
      itemData,
      suggestion,

      funcName,
      changeFuncName,
      funcComp,
      funcObject,
      comps,
      meetingMembers,
      buttonClickEvent,
      callUrlEvent,

      detailWidth,
      // dragControllerDiv,

      showOtherContent,
      otherContent,
      attachcomponent,

      menuFuncDraftForm,
      closeRightCompFunc,
    }
  },
}
</script>

<style lang="scss" scoped>
.draft-formal {
  @apply flex flex-1 overflow-hidden p-2;
  .draft-form-side {
    height: calc(100vh - 79px);
    @apply flex-1 flex flex-col border-r px-2 overflow-y-auto;
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
  > div {
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
</style>
