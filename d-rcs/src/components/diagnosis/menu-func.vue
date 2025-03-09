<template>
  <div class="main-menu">
    <div v-for="(items, itemIdx) in Object.values(menu.items)" :key="itemIdx">
      <div
        v-for="(button, idx) in items"
        :class="{ 'mt-1': idx > 0 }"
        :key="button.key"
        :title="
          (+itemData.data.Status != 10 || $route.query?.viewdetail || $route.query?.sealViewdetail) && button.key == 'videoTab'
            ? '視訊諮詢僅在會診記錄作業的會診中案件可進行使用'
            : ''
        "
      >
        <Button
          class="w-full p-button-text p-button-lg"
          :class="{ active: modelValue === button.key }"
          @click.stop="btnClickEvent(button)"
          :disabled="(+itemData.data.Status != 10 || $route.query?.viewdetail || $route.query?.sealViewdetail) && button.key == 'videoTab'"
        >
          <span v-html="button.label" />
        </Button>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

export default {
  props: {
    modelValue: {
      type: [String, Number],
    },
    itemData: {
      type: Object,
      required: true,
    },
  },
  // setup(_, { emit }) {
  setup(props, { emit }) {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()

    watch(
      () => props.modelValue,
      (val) => {
        console.log(val)
        menu.current = val
      }
    )
    const menu = reactive({
      current: null,
      items: {
        one: [
          { label: '會診單', key: 'draftForm' },
          { label: 'HIS歷史資料', key: 'revisehis' },
          { label: '健保署<br />雲端藥歷', key: 'revisecloud' },
          { label: '電子病歷<br />交換中心', key: 'reviseEec' },
          { label: '調閱PACS', key: 'pacs' },
          { label: '檢視附件', key: 'attach' },
        ],
        two: [
          { label: '視訊諮詢', key: 'videoTab' },
          { label: '會診記錄', key: 'recording' },
          { label: '回主畫面', key: 'gobacklist' },
        ],
      },
    })

    function btnClickEvent(button) {
      if (button.key == 'gobacklist') {
        router.push('/diagnosisManage/recordingMaintain')
      }

      emit('callGetUrl', button.key)
      if (button.key == 'pacs') {
        return
      } else if (button.key == 'videoTab') {
        menu.current = 'videoTab'
        emit('update:modelValue', menu.current)
        return
      }

      menu.current = menu.current !== button.key ? button.key : ''

      emit('update:modelValue', menu.current)
      emit('change')
    }

    const closeRightComp = () => {
      menu.current = ''
      emit('update:modelValue', menu.current)
    }

    const openVideoSide = () => {
      menu.current = 'videoTab'
      emit('callGetUrl', 'videoTab')
      emit('update:modelValue', 'videoTab')
      emit('change')
    }

    const setMenu = () => {
      const accountNoCheck = store.state?.dakar ? store.state?.dakar.No : ''

      if (`${accountNoCheck}`.includes('assist')) {
        menu.items = {
          one: [
            { label: '會診單', key: 'draftForm' },
            { label: 'HIS歷史資料', key: 'his' },
            { label: '健保署<br />雲端藥歷', key: 'cloud' },
            { label: '電子病歷<br />交換中心', key: 'electronic' },
            { label: '調閱PACS', key: 'pacs' },
            { label: '檢視附件', key: 'attach' },
          ],
          two: [
            { label: '視訊諮詢', key: 'videoTab' },
            { label: '會診記錄', key: 'recording' },
            // { label: "回主畫面", key: "gobacklist" },
          ],
        }
      }
    }

    onMounted(async () => {
      setMenu()
    })

    return { menu, btnClickEvent, closeRightComp, openVideoSide }
  },
}
</script>

<style lang="scss" scoped>
.main-menu {
  height: 90vh;
  @apply w-40 rounded py-16 px-2 mb-2 flex flex-col justify-between;
  background-color: #849aeb;

  ::v-deep(.p-button) {
    @apply justify-center text-white px-1 font-bold;

    &:hover,
    &.active {
      @apply bg-white;
    }

    &.active {
      @apply text-blue-600;
    }

    span {
      text-shadow: 1px 1px 2px #888;
      line-height: 1.2;
    }
  }
}

@media screen and (max-width: 500px) {
  .main-menu {
    display: none;
  }

  //會診中side bar
}
</style>
