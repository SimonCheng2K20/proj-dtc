<template>
  <div class="header">
    <Dialog title="變更密碼" v-model="changePasswordBox" :width="'30vw'">
      <ChangePassword @closeMe="closeChangPassword" @close="changePasswordBox = !changePasswordBox" />
    </Dialog>
    <Dialog title="醫事人員卡資訊" v-model="cardInfoBox" :width="'30vw'">
      <CardInfo @close="cardInfoBox = !cardInfoBox" />
    </Dialog>
    <div class="headerBox">
      <router-link class="headerBoxLogo" :to="{ path: '/' }">
        <img src="../assets/img/svg/logo.svg" />
      </router-link>
      <template v-if="showMenu">
        <div class="headerBoxMenu">
          <template v-for="(item, index) in $router.options.routes">
            <div
              :key="index"
              v-if="
                item.meta &&
                item.meta.show &&
                $store.state.userData &&
                $store.state.userData.FunctionNos &&
                $store.state.userData.FunctionNos.includes(item.name)
              "
            >
              <div v-if="item.children && item.children.length">
                <div
                  class="headerBoxMenuItem mr-cus-1"
                  :class="{
                    onChoose: $store.state.routerPath && $store.state.routerPath.matched[0].name === item.name,
                  }"
                >
                  <div>
                    {{ item.meta.title }}
                    <i class="el-icon-arrow-down" />
                  </div>
                  <MenuLoop class="headerBoxMenuItemMenu" :router="true" :data="item.children" />
                </div>
              </div>
              <div class="el-dropdown" v-else>
                <div
                  class="headerBoxMenuItem mr-cus-1"
                  @click="$router.push({ name: item.name }).catch((err) => err)"
                  v-if="item.meta && item.meta.show"
                >
                  {{ item.meta.title }}
                </div>
              </div>
            </div>
          </template>
          <a class="el-icon-download headerBoxMenuItem" href="/EMR/UploadFiles/emrcardreadersetup.msi"></a>
          <div class="headerBoxMenuItem">
            <div>
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
            <MenuLoop class="headerBoxMenuItemMenu">
              <!-- <div class="menuLoopBox">
                <div class="menuLoopBoxName" @click="cardInfoBox=!cardInfoBox">醫事人員卡資訊</div>
              </div> -->
              <div class="menuLoopBox" style="padding: 4px 12px">
                <div style="border: 1px solid #cccccc; padding: 8px">
                  <div style="color: #1a5a9b; text-align: center">自動簽章</div>
                  <div style="text-align: center">
                    <el-switch
                      v-model="isAutoSignature"
                      active-color="#13ce66"
                      active-text="啟用"
                      inactive-color="#123456"
                      inactive-text="未啟用"
                      @change="isAutoSignatureChange"
                    >
                    </el-switch>
                  </div>
                </div>
              </div>
              <div class="menuLoopBox">
                <div
                  class="menuLoopBoxName"
                  @click="
                    () => {
                      cardInfoBox = !cardInfoBox
                    }
                  "
                >
                  醫事人員卡資訊
                </div>
              </div>
              <div class="menuLoopBox">
                <div
                  class="menuLoopBoxName"
                  @click="
                    () => {
                      changePasswordBox = !changePasswordBox
                    }
                  "
                >
                  更改密碼
                </div>
              </div>
              <div class="menuLoopBox">
                <div
                  class="menuLoopBoxName"
                  @click="
                    () => {
                      logout()
                    }
                  "
                >
                  登出
                </div>
              </div>
            </MenuLoop>
          </div>
        </div>
        <div class="headerBoxMenuMobile">
          <div class="headerBoxMenuMobileIcon" @click="openMobileMenu = !openMobileMenu">
            <img class="headerBoxMenuMobileIconImg" src="../assets/img/svg/more.svg" />
          </div>
          <transition name="slide-fade">
            <HeaderMenuMobile
              v-model="openMobileMenu"
              @callCardInfoBox="cardInfoBox = !cardInfoBox"
              @callChangePasswordBox="changePasswordBox = true"
              @closeMobileMenu="openMobileMenu = false"
              v-if="openMobileMenu"
            />
          </transition>
        </div>
      </template>
    </div>
    <MedicalCardCheckPassword
      v-model="medicalCardCheckPasswordShow"
      @ok="onMedicalCardCheckOk"
      @error="onMedicalCardCheckError"
    ></MedicalCardCheckPassword>
  </div>
</template>

<script>
import Dialog from '@/components/Dialog.vue'
import ChangePassword from '@/components/ChangePassword.vue'
import CardInfo from '@/components/CardInfo.vue'
import HeaderMenuMobile from '@/components/HeaderMenuMobile.vue'
import MenuLoop from '@/components/MenuLoop.vue'
import MedicalCardCheckPassword from './MedicalCardCheckPassword.vue'

export default {
  props: ['showMenu'],
  components: {
    Dialog,
    ChangePassword,
    HeaderMenuMobile,
    MenuLoop,
    MedicalCardCheckPassword,
    CardInfo,
  },
  data() {
    return {
      changePasswordBox: false,
      cardInfoBox: false,
      openMobileMenu: false,
      medicalCardCheckPasswordShow: false,
    }
  },
  watch: {
    // "$store.state.userData.AutoSignature": {
    //   handler(val){
    //     if(val && val === true){
    //       // this.isAutoSignature = true;
    //       this.globalAutoSignature = true
    //     }else{
    //       // this.isAutoSignature = false
    //       this.globalAutoSignature = false
    //     }
    //   },
    //   immedaite: true,
    //   deep: true,
    // },
    // "$store.state.signature": {
    //   handler(val){
    //     if(val){
    //       console.log(`$store.state.signature`, val)
    //     }
    //   },
    //   immedaite: true,
    //   deep: true,
    // },
    $route: {
      handler(val, old) {
        if (val && val.fullPath !== old.fullPath) {
          this.openMobileMenu = false
        }
      },
      immedaite: true,
      deep: true,
    },
  },
  methods: {
    logout() {
      this.$store.commit('reset')
      sessionStorage.token = ''
      sessionStorage.cardCert = ''
      location.href = './#/login'
    },
    showMenuFlag(index) {
      let res = false
      let all = this.$router.options.routes[index].children.map((r) => r.name)
      for (let item of all) {
        if (this.$store.state.userData.FunctionNos.includes(item)) res = true
      }
      return res
    },
    async isAutoSignatureChange(val) {
      if (val) {
        // if (!this.isSignatured) {
        //   this.medicalCardCertify();
        // }
        this.medicalCardCertify()
      } else {
        this.$api.postSetAutoSignature({
          AutoSignature: false,
          HcaSignature: null,
        })
      }
    },
    async medicalCardCheck() {
      try {
        const { data, error } = await this.$global.medicalCardCheck()

        if (error) {
          console.log(`error`)
        }

        if (data) {
          console.log(`reader data: `, data)
        }
      } catch (err) {
        console.log(`error: `, err)
      }
    },
    async medicalCardCertify() {
      try {
        this.$store.commit('loading', true)

        const { data, error } = await this.$global.medicalCardCertify(this.$store.state.userData.Identifier)

        if (error) {
          this.$message.error(error)
          this.onMedicalCardCheckError()
          return
        }

        if (data === undefined || data === null) {
          console.log(`no matched id`)
          this.isAutoSignature = false
        }

        if (data) {
          this.medicalCardCheckPasswordShow = true
        }
      } catch (err) {
        console.log(`error: `, err)
      } finally {
        this.$store.commit('loading', false)
      }
    },
    async onMedicalCardCheckOk() {
      const res = await this.$api.postSetAutoSignature({
        AutoSignature: true,
        HcaSignature: this.$store.state.signature,
      })

      if (res.status === 200 || res.status === 204) {
        this.$store.commit('userData', { AutoSignature: true })
      }
    },
    onMedicalCardCheckError() {
      this.isAutoSignature = false
    },
    closeChangPassword() {
      this.changePasswordBox = false
    },
  },
  computed: {
    isAutoSignature: {
      get() {
        return this.$store.state.userData.AutoSignature
      },
      set(val) {
        this.$store.commit('userData', { AutoSignature: val })
      },
    },
    isSignatured: {
      get() {
        return this.$store.state.signature
      },
      set(val) {
        this.$store.commit('setSignature', val)
      },
    },
  },
  async mounted() {
    await this.medicalCardCheck()
  },
}
</script>
