<template>
  <div class="default">
    <headerComp
      v-if="isMounted && $route.name != 'Jump' && $route.name != 'Auth'"
    />
    <div
      :class="
        $route.meta.needfooter
          ? 'main-content custom-scroll-bar2'
          : 'main-container'
      "
    >
      <slot />
      <footerComp v-if="!isAuth && isMounted && $route.meta.needfooter" />
    </div>

    <transition name="dialog-fade">
      <div class="loading" v-if="isLoading">
        <div class="content">
          <i class="pi pi-spin pi-spinner mr-2" />LOADING...
        </div>
      </div>
    </transition>
    <Dialog
      class="custom-modal"
      v-model:visible="dialog.show"
      :draggable="false"
      modal
      :breakpoints="{ '960px': '75vw', '640px': '95vw' }"
      style="width: 450px"
      :closable="false"
    >
      <template #header>
        <h3 class="w-full text-center text-xl" v-text="dialog.title" />
      </template>
      <div>{{ dialog.content }}</div>
      <template #footer>
        <Button @click.stop="hideDialogEvent">確認</Button>
      </template>
    </Dialog>
    <!-- <div style="display: none" v-text="detectLogout" /> -->
    <main
      class="warning-idle"
      v-if="showWarning && !$route.path.includes('auth') && !isForeverLogin"
    >
      <nav>
        <header>遠距醫療資訊平台</header>
        <p style="margin-top: 35px">系統已閒置一段期間,會將您自動登出帳戶</p>
        <p style="margin-top: 12px">
          將在
          <vue-countdown :time="1 * 60 * 1000" v-slot="{ seconds }">
            {{ seconds }}
          </vue-countdown>
          秒鐘之後自動登出
        </p>
      </nav>
    </main>
  </div>
</template>

<script>
import { defineComponent, computed, ref, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import footerComp from './footer.vue';
import headerComp from './header.vue';
import { useRoute, useRouter } from 'vue-router';
import { useIdle } from '@vueuse/core';
import { authLogout } from 'Service/apis.js';

export default defineComponent({
  name: 'DefaultLayout',
  components: { headerComp, footerComp },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const store = useStore();
    const isMounted = ref(false);
    const isLoading = computed(() => store.state.isLoading);
    const isAuth = computed(() => route.name === 'Auth');
    const dialog = computed(() => store.state.dialog);

    const isForeverLogin = ref(false);

    const isNewLogin = computed(() => {
      return store.getters.g_isNewLogin;
    });

    const setIsForeverLogin = () => {
      isForeverLogin.value =
        sessionStorage.getItem('isNotAutoOut') &&
        sessionStorage.getItem('isNotAutoOut') == 'yes'
          ? true
          : false;
    };

    watch(isNewLogin, (v, pv) => {
      setIsForeverLogin();
    });

    //idle1時間 + countdown時間 = idle2時間
    const { idle: showWarning } = useIdle(9 * 60 * 1000); //9分鐘
    const { idle: exeLogout } = useIdle(10 * 60 * 1000); //10分鐘
    // const { idle: showWarning } = useIdle(1 * 5 * 1000); //5 second -for test
    // const { idle: exeLogout } = useIdle(2 * 5 * 1000); //10 second -for test
    watch(
      () => exeLogout.value,
      (v, prev) => {
        if (v && !isForeverLogin.value) {
          logoutEvent();
        }
      }
    );

    onMounted(() => {
      setTimeout(() => {
        isMounted.value = true;
      }, 350);
    });

    function hideDialogEvent() {
      store.commit('m_setDialog', {});
    }

    async function logoutEvent() {
      await authLogout();
      store.commit('m_setLogout');
      store.commit('m_setToDefaultData');
      router.push({ name: 'Auth' });
    }

    return {
      isLoading,
      isAuth,
      isMounted,
      dialog,
      showWarning,
      exeLogout,

      hideDialogEvent,
      logoutEvent,

      isNewLogin,
      isForeverLogin,
    };
  },
});
</script>

<style lang="scss">
.default {
  min-height: 100vh;
  // overflow: hidden;
  // @apply flex flex-col min-h-screen overflow-y-hidden;
  .main-container {
    // @apply mx-auto w-full  flex flex-col flex-1;
    max-width: 1920px;
  }
  .main-content {
    overflow: auto;
    height: calc(100vh - 81px);
    margin-right: 0.5px;
  }
}
.loading {
  @apply absolute left-0 top-0 right-0 bottom-0 bg-black text-white bg-opacity-80 flex justify-center items-center;
}
.p-dialog-content {
  min-height: 80px;
}
</style>
