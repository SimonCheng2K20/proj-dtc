<template>
  <div class="header">
    <Dialog title="更改密碼" v-model="showChangePasswordBox">
      <ChangePassword @close="showChangePasswordBox = !showChangePasswordBox" />
    </Dialog>
    <Dialog title="註冊自然人憑證Pincode" v-model="showSetHiPinCodeBox">
      <SetHiPinCode @close="showSetHiPinCodeBox = !showSetHiPinCodeBox" />
    </Dialog>
    <div class="headerBox">
      <div class="headerBoxLogo">
        <img class="headerBoxLogoImg" src="../assets/img/logo-2.png" />
        <div class="headerBoxLogoText">紙本病歷掃描系統</div>
      </div>
      <div class="headerBoxMenu">
        <MenuLoop class="headerBoxMenuItem"></MenuLoop>
        <div class="menuLoop headerBoxMenuItem" style="margin-left: 0;">
          <div class="menuLoopBox" v-if="$store.state.userData">
            <div class="menuLoopBoxTitle">
              <div>{{ $store.state.userData.Name }}</div>
            </div>
            <div class="menuLoopBoxChildren">
              <div class="menuLoopItem" @click="showChangePasswordBox = !showChangePasswordBox">
                <div class="menuLoopItemTitle">
                  <div>變更密碼</div>
                </div>
              </div>
              <div class="menuLoopItem" @click="showSetHiPinCodeBox = !showSetHiPinCodeBox">
                <div class="menuLoopItemTitle">
                  <div>註冊自然人憑證Pincode</div>
                </div>
              </div>
              <div class="menuLoopItem" @click="logout">
                <div class="menuLoopItemTitle">
                  <div>登出</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="headerBoxMenuMobile">
        <div class="headerBoxMenuMobileIcon" @click="openMobileMenu = !openMobileMenu">
          <i class="el-icon-s-fold" />
        </div>
        <transition name="slide-fade">
          <HeaderMenuMobile v-model="openMobileMenu" @callChangePasswordBox="showChangePasswordBox=true"
            v-if="openMobileMenu" />
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import MenuLoop from '@/components/MenuLoop.vue'
import ChangePassword from '@/components/ChangePassword.vue'
import SetHiPinCode from '@/components/SetHiPinCode.vue'
import HeaderMenuMobile from '@/components/HeaderMenuMobile.vue'

export default {
  components: { MenuLoop, ChangePassword, SetHiPinCode, HeaderMenuMobile },
  data() {
    return {
      showChangePasswordBox: false,
      showSetHiPinCodeBox: false,
      openMobileMenu: false,
    }
  },
  computed: {
    routerList() {
      return this.$router.options.routes.filter(res => res.meta.show)
    }
  },
  methods: {
    async logout () {
      await this.$api.logOut()
      localStorage.token = ''
      location.reload()
     
    }
  }
}
</script>