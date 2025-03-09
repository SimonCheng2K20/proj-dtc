<template>
  <div class="headerMenuMobile" @click="$emit('input', false)">
    <div class="headerMenuMobileBox" @click.stop>
      <div class="headerMenuMobileBoxMember title-1">
        <el-tooltip
          class="item"
          effect="dark"
          :content="$store.state.cardInfo ? '已認證' : '未認證'"
          placement="left"
          :open-delay="600"
        >
          <i class="mr-1" :class="$store.state.cardInfo ? 'el-icon-success' : 'el-icon-warning'"></i>
        </el-tooltip>
        {{ $store.state.userData && $store.state.userData.Name ? $store.state.userData.Name : '系統管理者' }}
      </div>
      <template v-for="(item, index) in $router.options.routes">
        <HeaderMenuMobileItem :data="item" :key="index" />
      </template>
      <div
        class="HeaderMenuMobileItem"
        @click="
          () => {
            $emit('closeMobileMenu')
            $emit('callCardInfoBox')
          }
        "
      >
        <div class="HeaderMenuMobileItemTitle">醫事人員卡資訊</div>
      </div>
      <div
        class="HeaderMenuMobileItem"
        @click="
          () => {
            $emit('closeMobileMenu')
            $emit('callChangePasswordBox')
          }
        "
      >
        <div class="HeaderMenuMobileItemTitle">更改密碼</div>
      </div>
      <div
        class="HeaderMenuMobileItem"
        @click="
          () => {
            $emit('closeMobileMenu')
            logout()
          }
        "
      >
        <div class="HeaderMenuMobileItemTitle">登出</div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderMenuMobileItem from '@/components/HeaderMenuMobileItem'

export default {
  props: ['value'],
  components: { HeaderMenuMobileItem },
  data() {
    return {}
  },
  methods: {
    logout() {
      this.$store.commit('reset')
      sessionStorage.token = ''
      sessionStorage.cardCert = ''
      location.href = './#/login'
    },
  },
}
</script>
