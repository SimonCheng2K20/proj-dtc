<template>
  <div class="headerMenuMobile" @click="$emit('input',false)">
    <div class="headerMenuMobileBox" @click.stop>
      <div class="headerMenuMobileBoxMember title-1">系統管理員</div>
      <template v-for="(item,index) in $router.options.routes">
        <HeaderMenuMobileItem :data="item" :key="index" />
      </template>
      <div class="HeaderMenuMobileItem" @click="$emit('callChangePasswordBox')">
        <div class="HeaderMenuMobileItemTitle">
          更改密碼
        </div>
      </div>
      <div class="HeaderMenuMobileItem" @click="logout">
        <div class="HeaderMenuMobileItemTitle">
          登出
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderMenuMobileItem from '@/components/HeaderMenuMobileItem'

export default {
  props: ['value'],
  components: {HeaderMenuMobileItem},
  data() {
    return {
    }
  },
  methods: {
    async logout() {
      await this.$api.logOut()
      localStorage.token=''
      location.href='./login'
    }
  },
}
</script>