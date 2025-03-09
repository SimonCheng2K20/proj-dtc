<template>
  <div id="app">
    <Loading v-if="$store.state.loading" />
    <Header :showMenu="isLogin" />
    <PathBox v-if="isLogin" />
    <div class="layout" :class="{ layoutFull: $store.state.routerPath?.meta?.noPathList }">
      <router-view class="content" />
      <Floor />
    </div>
    <div v-if="isLogin">
      <TimeOut v-if="idleData.idle" />
    </div>
  </div>
</template>

<script>
import Loading from '@/components/Loading.vue'
import Header from '@/components/Header.vue'
import PathBox from '@/components/PathBox.vue'
import Floor from '@/components/Floor.vue'
import TimeOut from '@/components/TimeOut.vue'
import useIdle from '@/assets/js/use-idle.js'

export default {
  name: 'Home',
  components: { Loading, Header, PathBox, Floor, TimeOut },
  data() {
    return {
      idleData: {
        idle: false,
      },
    }
  },
  watch: {
    isLogin(val) {
      if (val) this.idleData = useIdle(60 * 60 * 1000)
      else this.idleData = { idle: false }
    },
  },
  provide() {
    return {
      globalAutoSignature: this.globalAutoSignature,
    }
  },
  created() {
    window.addEventListener(
      'error',
      (evt) => {
        if (evt.target.tagName === 'LINK') {
          this.$message.error('檢測到系統更新，請重新刷新頁面！')
        }
      },
      { once: true, capture: true }
    )
  },
  computed: {
    globalAutoSignature: {
      get() {
        return this.$store.state.userData.AutoSignature
      },
      set(val) {
        this.$store.commit('userData', { AutoSignature: val })
      },
    },
    isLogin() {
      return !!this.$store.state.userData.No
    },
  },
}
</script>
