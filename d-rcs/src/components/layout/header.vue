<template>
  <div class="header" :class="{
    'avoid-clicks': accountNoDataCheck,
  }">
    <div class="flex items-center system-title h-logo" @click.stop="getHomeEvent">
      <img src="/assets/logo.png" />
    </div>

    <div class="system-detail">
      <Menubar @click.stop="menuClickEvent" @mouseover="upMenubar" :model="functionList" p-menuitem
        class="mr-5 menu-bar" style="--tw-text-opacity: 0.25; z-index: 100" />
      <div class="user-notice" @click.stop="checkNoticeEvent">
        <div class="p-overlay-badge">
          <img src="/assets/notice-icon.png" />
          <span class="p-badge p-badge-danger" v-show="+unrecordNum > 0 && !hasClickNotify">！</span>
        </div>
      </div>
      <div class="user-download" @click.stop="toggleDownloadPanelEvent">
        <div class="p-overlay-badge">
          <svg class="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
            stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </div>
      </div>

      <div class="user-detail" @click.stop="toggleUserPanelEvent">
        {{ userInfo.name }}
        <img src="/assets/detail-icon.png" />
      </div>

      <OverlayPanel ref="userPanel" :dismissable="true">
        <div class="text-center">
          <span><i class="pi pi-user" style="color: #4f66bf"></i>個人中心</span>
          <hr class="w-full border-gray-300 hidden sm:block mt-1 mb-2" />
        </div>
        <div>
          <Button class="p-button-sm p-button-outlined mr-3" style="margin-right: 10px"
            @click.stop="showPwdDialog">更改密碼</Button>
          <Button class="p-button-sm" @click.stop="logoutEvent">登出</Button>
        </div>
      </OverlayPanel>
      <OverlayPanel ref="downloadPanel" :dismissable="true">
        <div class="text-center">
          <span><i class="pi pi-download" style="color: #4f66bf"></i>下載專區</span>
          <hr class="w-full border-gray-300 hidden sm:block mt-1 mb-2" />
        </div>
        <div style="cursor: pointer" @click="openManul(1)">操作手冊</div>
        <div style="cursor: pointer" @click="openManul(2)">簡易操作手冊</div>
        <div style="cursor: pointer" @click="openReaderMsi">讀卡機伺服器</div>
      </OverlayPanel>
      <passwordchange ref="passwordRef"></passwordchange>

      <message ref="messageRef"></message>
    </div>
  </div>
</template>

<script>
import { computed, watch, ref, onMounted, onUpdated } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import passwordchange from './passwordchange.vue'

import message from './message.vue'
import { authLogout, getNotify } from 'Service/apis.js'

export default {
  components: { passwordchange, message },
  setup() {
    const passwordRef = ref(null)
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const userPanel = ref()
    const downloadPanel = ref()
    const userInfo = computed(() => ({
      no: store.state.dakar.No,
      name: store.state.dakar.Name,
      functions: store.state.dakar.FunctionNos,
      roleNos: store.state.dakar.RoleNos,
    }))
    const functionList = ref([])
    const messageRef = ref(null)

    const menuItems = ref(
      router
        .getRoutes()
        .filter((item) => item.children.length > 0)
        .map((item) => ({
          label: item.meta.title,
          items: item.children
            .filter((ch) => !!ch.path)
            .map((ch) => ({
              label: ch.meta.title,
              name: ch.name,
              path: ch.path,
            })),
        }))
    )

    const subMenuItems = computed(() => menuItems.value.flatMap(({ items }) => items))

    async function logoutEvent() {
      // console.log("store.state.editItem", store.state);
      router.push({ name: 'Auth' })
      await authLogout()
      store.commit('m_setLogout')
      store.commit('m_setToDefaultData')
    }

    function menuClickEvent(e) {
      const _route = subMenuItems.value.find((item) => item.label === e.target.innerText)
      if (_route) router.push({ name: _route.name })
    }

    function getHomeEvent() {
      router.push({ name: 'Home' })
    }

    const toggleUserPanelEvent = (event) => {
      downloadPanel.value.hide()
      userPanel.value.toggle(event)
    }

    const toggleDownloadPanelEvent = (event) => {
      userPanel.value.hide()
      downloadPanel.value.toggle(event)
    }

    const openManul = (type) => {
      // console.log("openManul");
      if (+type == 1) {
        window.open(
          '/UploadFiles/Notices/20-%E3%80%8C%E9%81%A0%E8%B7%9D%E6%9C%83%E8%A8%BA%E8%AB%AE%E8%A9%A2%E7%B3%BB%E7%B5%B1%E3%80%8D%E6%95%99%E8%82%B2%E8%A8%93%E7%B7%B4%E7%B0%A1%E5%A0%B1_Rev%202[0].pdf'
        )
      } else {
        window.open('/UploadFiles/Notices/5-遠距會診諮詢平臺_簡易操作步驟.pdf')
      }
    }

    const openReaderMsi = () => {
      // console.log("openManul");
      window.open(`/UploadFiles/rConsultCardReaderSetup.msi?${Date.now()}`)
      // window.open("https://rmeeting.datacom.com.tw/UploadFiles/CardReader.msi");
    }

    function checkNoticeEvent() {
      userPanel.value.hide()
      downloadPanel.value.hide()
      messageRef.value.showMessageModal = true
      store.commit('m_setHasClickNotify', true)
    }

    function showPwdDialog(event) {
      userPanel.value.hide()
      downloadPanel.value.hide()
      // store.commit("m_setPwdDialogStatus", true);

      passwordRef.value.accountData = store.state?.dakar?.No
      passwordRef.value.isShowDialog = true
      console.log('header password change')
    }

    const unrecordNum = ref(0)
    const getUnRecordNums = async (event) => {
      const tokenData = sessionStorage.getItem('token') ? sessionStorage.getItem('token').replace(/\"/g, '') : ''
      if (Boolean(tokenData) && tokenData != 'undefined') {
        const res = await getNotify()
        let allData = res.data

        unrecordNum.value =
          +allData?.MyUnRecordCount + +allData?.MyUnRecordCount + +allData?.UnCloseCount + +allData?.UnRecordCount + +allData?.UnUploadConsentFormCount
      } else {
        unrecordNum.value = 0
      }
    }

    const accountNoDataCheck = computed(() => {
      const accountNoCheck = store.state?.dakar ? store.state?.dakar.No : ''

      return `${accountNoCheck}`.includes('assist')
    })

    const getAllFunctions = async () => {
      const tokenData = sessionStorage.getItem('token') ? sessionStorage.getItem('token').replace(/\"/g, '') : ''
      if (Boolean(tokenData) && tokenData != 'undefined') {
        store.dispatch('a_setFunctionList').then(() => {
          functionList.value = store.getters.g_functionsMenuList
        })
      }
    }

    onMounted(async () => {
      await getUnRecordNums()
      await getAllFunctions()
    })

    const upMenubar = () => {
      //for click menu to hide panel
      downloadPanel.value.hide()
      userPanel.value.hide()
    }

    const hasClickNotify = computed(() => {
      return store.state.hasClickNotify
    })

    return {
      hasClickNotify,
      userInfo,
      menuItems,
      userPanel,
      downloadPanel,
      functionList,
      messageRef,
      unrecordNum,

      menuClickEvent,
      logoutEvent,
      getHomeEvent,
      toggleUserPanelEvent,
      toggleDownloadPanelEvent,
      openManul,
      openReaderMsi,

      checkNoticeEvent,
      showPwdDialog,

      getUnRecordNums,
      getAllFunctions,
      upMenubar,
      passwordRef,
      accountNoDataCheck,
    }
  },
}
</script>

<style lang="scss" scoped>
.header {
  @apply flex justify-between border-b items-center px-5;
  background-color: #021a7b;

  .h-logo {
    text-align: center;

    img {
      margin: 8px auto;
      display: block;
    }
  }

  .system-title {
    @apply text-white font-bold text-3xl py-1 cursor-pointer;

    img {
      @apply mr-3;
    }
  }

  .system-detail {
    @apply flex;

    .user-detail {
      @apply text-white flex items-center text-xl font-bold cursor-pointer;

      img {
        @apply ml-3;
      }
    }

    .user-notice {
      @apply pt-3 mr-5 cursor-pointer;
    }

    .user-download {
      @apply pt-3 mr-4 cursor-pointer;
    }

    ::v-deep(.p-menubar) {
      @apply bg-transparent p-0 border-0 text-white;
    }

    ::v-deep(.p-menubar .p-menubar-root-list > .p-menuitem > .p-menuitem-link) {
      border-radius: 0px !important;

      .p-menuitem-text {
        @apply text-white text-xl;
      }

      &:not(.p-disabled):hover {
        background-color: rgba(255, 255, 255, 0.2);
        border-radius: 0px !important;

        .p-menuitem-text {
          @apply text-white text-xl;
        }
      }
    }

    ::v-deep(.p-menubar .p-menubar-root-list > .p-menuitem.p-menuitem-active > .p-menuitem-link) {
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 0px !important;

      .p-menuitem-text {
        @apply text-white text-xl;
      }
    }

    ::v-deep(.p-menubar .p-menubar-root-list > .p-menuitem > .p-menuitem-link .p-submenu-icon) {
      color: #fff;
      border-radius: 0px !important;
    }
  }
}

@media screen and (max-width: 500px) {
  .header {
    display: none;
  }

  //會診中side bar
}
</style>
