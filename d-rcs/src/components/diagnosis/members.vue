<template>
  <div class="members">
    <!-- 群組資訊 -->
    <group-datas ref="groupdataref"></group-datas>
    <!-- 參與會診者 -->
    <div class="whitespace-normal flex items-center special-font">
      <img
        v-show="!groupData"
        :src="groupData ? '/assets/participant.png' : '/assets/members-icon.png'"
        class="mr-2"
        :style="groupData ? 'cursor: pointer' : ''"
        v-tooltip.bottom="`${groupData ? '群組資訊' : ''}`"
        @click.stop="btnClickEvent('showgroup')"
      />

      <span
        v-tooltip.bottom="{
          value: `目前參與會診者: ${meetingInstitutionMembers}`,
          class: 'custom-member',
        }"
        >參與會診者: {{ items.join(',') }}</span
      >
    </div>

    <div class="flex gap-2" :style="+status != 100 ? 'min-width: 132px' : ''">
      <div class="flex items-center cursor-pointer" @click="copyAssistLink" title="取得協助會診單連結" v-if="+sheetStatus == 10" style="transform: scaleX(-1)">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
          />
        </svg>
      </div>
      <Button class="p-button-sm button-back" @click.stop="btnClickEvent('back')">回主畫面</Button>
      <Button v-if="sheetStatus === 10 && CanClose && items.length > 0" class="p-button-sm button-over" @click="showFinishConfirmMessage = true">
        會診結束
      </Button>
    </div>

    <Dialog class="custom-modal" v-model:visible="showFinishConfirmMessage" style="width: 500px" :modal="true" :draggable="false">
      <template #header>
        <h3>系統資訊</h3>
      </template>
      <div class="font-bold" style="font-size: 25px">確定結束會診?</div>
      <div class="mt-3 font-bold" style="font-size: 16px">注意:</div>
      <div class="font-bold" style="font-size: 16px">會診結束將會將會診狀態從會診中轉至會診結束</div>
      <div class="font-bold" style="font-size: 16px">如只是要暫離此畫面，請點選「回主畫面」</div>

      <template #footer>
        <Button label="確認送出" @click="btnClickEvent('finish')" />
        <Button label="取消" class="p-button-success" @click="showFinishConfirmMessage = false" />
      </template>
    </Dialog>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import groupDatas from './groupDatas.vue'
import { useClipboard } from '@vueuse/core'
import { getSheetAssistLink } from 'Service/apis.js'
import { ref, computed, reactive } from 'vue'
import { useToast } from 'vue-toastification'
import { useStore } from 'vuex'
export default {
  props: {
    meetingInstitutionMembers: {
      type: Array,
      default: () => [],
    },
    items: {
      type: Array,
      default: () => [],
    },
    id: {
      type: [Number, String],
      default: '',
    },
    status: {
      type: [Number, String],
      default: '33',
    },
    records: {
      type: Array,
      default: [],
    },
    builderInstitution: {
      type: [String],
      default: '',
    },
    funcName: {
      type: [String],
      default: '',
    },
    CanClose: Boolean,
  },
  components: { groupDatas },
  setup(props, { emit }) {
    const router = useRouter()
    const toast = useToast()
    const store = useStore()
    const showFinishConfirmMessage = ref(false)

    const { copy } = useClipboard()
    const copyAssistLink = async () => {
      try {
        const res = await getSheetAssistLink(store.state.editItem?.Id)

        copy(`${res?.data}`)
        toast.success(`協助連結複製成功`, {
          timeout: 5000,
          hideProgressBar: true,
        })
      } catch (e) {
        toast.error(`${e.response ? e.response.data : e}`, {
          timeout: 5000,
          hideProgressBar: true,
        })
      }
    }

    const sheetStatus = computed(() => {
      return store.state.editItem?.Status
    })

    const isRecordBuilderInstitution = computed(() => {
      const accountInstitutionNo = store.state?.others ? store.state?.others.InstitutionNo : ''
      return props.builderInstitution === accountInstitutionNo
    })

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

    const groupdataref = ref(null)

    const btnClickEvent = (key) => {
      if (key == 'showgroup') {
        if (!groupData.value) {
          return
        }
        groupdataref.value.modalShowGroupDatas = true
      } else {
        emit('clickEvent', key)
      }
    }

    return {
      btnClickEvent,
      isRecordBuilderInstitution,

      showFinishConfirmMessage,
      groupData,

      groupdataref,
      copyAssistLink,
      sheetStatus,
    }
  },
}
</script>

<style lang="scss" scoped>
.members {
  @apply font-bold py-2 px-4 flex justify-between;
  font-size: 1.3rem;
  background-color: #fdf3e8;
  color: #4e65c1;
  ::v-deep(.p-button) {
    @apply text-lg font-bold py-1 border-0;
    color: #5d4e61;
    &.button-back {
      background-color: #bdc6d8;
    }
    &.button-over {
      background-color: #6ad8f8;
    }
  }
}
.special-font {
  font-family: Microsoft JhengHei, Helvetica;
}
</style>
<style>
.custom-member .p-tooltip-text {
  width: 400px;
}
/* .custom-member.p-tooltip-right .p-tooltip-arrow {
  
} */
</style>
