<template>
  <div class="w-full">

    <passwordchange ref="passwordRefAuth"></passwordchange>
    <applyaccount ref="applyaccountRef"></applyaccount>

    <Dialog v-model:visible="accountExpiredRef.isShowDialog" :draggable="false" style="width: 800px; z-index: 1000;"
      header="更改密碼通知" :closable="true" :modal="true" class="custom-modal">
      <div class="accountExpiredBox">
        <p style="text-align: center;">
          <strong>
            {{ accountExpiredRef.Message || '更改密碼' }}
          </strong>
        </p>
      </div>
      <template #footer>
        <Button label="確定" @click="accountExpiredRef.isShowDialog = false, passwordRefAuth.isShowDialog = true" />
      </template>
    </Dialog>

    <Dialog v-model:visible="institutionSelectRef.isShowDialog" :draggable="false" style="width: 800px; z-index: 1000;"
      header="選擇醫療機構單位" :closable="true" :modal="true" class="custom-modal">
      <div class="institutionSelectBox select">
        <p style="text-align: left; width: 100%;">
          <strong>
            請選擇您所在的醫療機構單位:
          </strong>
        </p>
        <section style="width: 100%; min-height: 20vh;" :style="{
            'overflow-y': institutionSelectRef.InstitutionNos.length > 6 ? 'scroll' : 'none'
          }">
          <div class="innerBox">
            <Button v-for="(v, i) in institutionSelectRef.InstitutionNos" :key="i" :label="`${v.Name} ${v.No}`"
              class="instituteBtn" @click="institutionSelectRef.isShowDialog = false, loginSelect(v)" />
          </div>
        </section>
      </div>
    </Dialog>

    <div class="auth">
      <div class="main-title">
        <img src="/assets/logo.png" />
      </div>

      <notice style="transform: translateY(-70px)" />
      <socketServerDownload ref="socketServerDownloadRef"></socketServerDownload>

      <div class="login-panel" style="transform: translateY(-70px)">
        <div class="login-header">
          <img src="/assets/user-icon.jpg" />
          系統登入
        </div>
        <div class="p-field p-col mb-5">
          <span class="p-input-icon-left w-full relative">
            <img class="absolute left-1 top-2" src="/assets/input-name.png" />
            <InputText id="name" class="w-full" v-model.trim="Name" @keydown.enter="inputEnterEvent" type="text"
              placeholder="請輸入帳號" autocomplete="off" @keyup="setIsPermanent(Name)" />
          </span>
        </div>
        <div class="p-field p-col mb-5">
          <span class="p-input-icon-left w-full relative">
            <img class="absolute left-1 top-2" src="/assets/input-password.png" />
            <InputText id="permit" class="w-full" v-model.trim="Permit" @keydown.enter="inputEnterEvent" type="password"
              placeholder="請輸入密碼" />
          </span>
        </div>
        <div class="p-field p-col mb-5">
          <span class="p-input-icon-left w-full relative">
            <img class="absolute left-1 top-2" src="/assets/input-password.png" />
            <InputText class="w-full" v-model.trim="MedicalCardPassword" @keydown.enter="inputEnterEvent"
              type="password" placeholder="請輸入醫事人員卡密碼(電子簽章用)" />
          </span>
        </div>
        <div class="p-field p-col mb-5 flex items-center">
          <span class="p-input-icon-left w-full relative">
            <img class="absolute left-1 top-2" src="/assets/input-valid.png" />
            <input id="inputCodes" ref="inputCodes" class="w-full" v-model="Code" @keydown.enter="inputEnterEvent"
              type="text" placeholder="請輸入驗證碼" />
          </span>
          <i class="pi pi-refresh mx-2 cursor-pointer" @click.stop="fetchCaptcha" style="font-size: 24px" />
          <img :src="captchaData.Image" />
        </div>
        <div class="flex login-buttons mb-1" style="position: relative">
          <Button class="flex-1 confirm" type="button" label="登入" :disabled="!isAbleToLogin" @click.stop="loginEvent"
            v-show="!showLoadingButton" />
          <Button label="loading..." class="flex-1 confirm" icon="pi pi-spin pi-spinner" v-show="showLoadingButton" />
          <div class="w-1.5" />
          <Button class="p-button-outlined refresh" type="button" label="重新輸入"
            :disabled="!isAbleToLogin || showLoadingButton" @click.stop="resetData" />
          <div class="register cursor-pointer" @click="applyAccount">申請帳號</div>
          <div class="permanent-place" v-show="isShowPermanentWord">
            <label for="isNeedPermanentLoginId">
              <input
                class="h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                type="checkbox" id="isNeedPermanentLoginId" value="second_checkbox" v-model="isNeedPermanentLogin" />
              <span style="display: inline-block" class="pb-1">是否長久登入</span>
            </label>
          </div>
        </div>
      </div>
      <footerComp />
    </div>
  </div>
</template>

<script>
import { useToast } from 'vue-toastification'
import { reactive, toRefs, computed, ref, onUnmounted, onMounted, watch, nextTick } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { getCaptcha, getGetIdentifier, authRenew, getInstitutionList } from 'Service/apis.js'
import passwordchange from '@/components/layout/passwordchange.vue'
import applyaccount from '@/components/layout/applyaccount.vue'

import notice from './notice.vue'
import version from './version.vue'
import dayjs from 'dayjs'
import footerComp from '@/components/layout/footer.vue'

import { medicalCardWebSocket, medicalWebSocketCheckServer } from '@/service/websocket.js'

import socketServerDownload from '@/components/medicalWebSocketServerDownload.vue'

import setSearchQuery from 'utils/setSearchQuery.js'

import { cloneDeep } from 'lodash'

export default {
  components: {
    notice,
    version,
    footerComp,
    socketServerDownload,
    passwordchange,
    applyaccount,
  },
  setup() {
    const newTokenRef = ref(null)
    const institutionList = ref([])
    const accountExpiredRef = ref({
      isShowDialog: false,
      Message: null,
    })
    const institutionSelectRef = ref({
      isShowDialog: false,
      InstitutionNos: [],
      InstitutionNosSelected: '',
      record: 0,
    })
    const passwordRefAuth = ref(null)
    const applyaccountRef = ref(null)
    const socketServerDownloadRef = ref(null)
    const showLoadingButton = ref(false)
    const inputCodes = ref(null)
    const toast = useToast()
    const authData = reactive({
      Name: null,
      Permit: null,
      MedicalCardPassword: null,
      Code: null,
    })
    const captchaData = reactive({ Code: null, Image: null, HashCode: null })
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    const captchaTimer = ref(null)

    const isAbleToLogin = computed(
      () => {
        return authData.Name && authData.Permit && authData.Code
      }
      // Object.values(authData).every((v) => !!v)
    )

    const isShowPermanentWord = ref(false)
    const isNeedPermanentLogin = ref(false)

    const setIsPermanent = (Name) => {
      if (Name.substring(0, 1) == '/') {
        isShowPermanentWord.value = true
      } else {
        isShowPermanentWord.value = false
        isNeedPermanentLogin.value = false
      }
    }

    const versionTime = dayjs(window.versionTime).format('YYYY-MM-DD HH:mm:ss')
    const resetData = () => {
      authData.Name = null
      authData.Permit = null
      authData.MedicalCardPassword = null
      authData.Code = null
      isNeedPermanentLogin.value = false
      fetchCaptcha()
    }

    const loginEvent = async () => {
      let checkedName = ''

      if (authData.Name.substring(0, 1) == '/') {
        checkedName = authData.Name.substring(1)
      } else {
        checkedName = authData.Name
      }

      if (authData.Code === captchaData.Code) {
        //check invalidData
        // if (localStorage.getItem("invalidData")) {
        //   const existInvalidDataList = JSON.parse(localStorage.getItem("invalidData"));
        //   // let { Name } = authData;

        //   const existInvalidData = existInvalidDataList.find(
        //     (s) => s.Name === checkedName
        //   );

        //   if (existInvalidData) {
        //     const { count, time } = existInvalidData;
        //     const isOver15Min = Date.now() - time > 1000 * 60 * 15;

        //     if (count >= 3 && !isOver15Min) {
        //       // 達三次失敗 並在15分鐘內
        //       const duration = dayjs(1000 * 60 * 15 - (Date.now() - time)).format(
        //         "mm分ss秒"
        //       );
        //       toast.error(
        //         `輸入帳號: ${checkedName} ，該帳號達三次失敗 請在${duration}後再登入`,
        //         {
        //           timeout: 5000,
        //           hideProgressBar: true,
        //         }
        //       );
        //       return;
        //     }
        //     if (count >= 3 && isOver15Min) {
        //       // 達三次失敗 並在超過15分鐘
        //       localStorage.setItem(
        //         "invalidData",
        //         JSON.stringify(existInvalidDataList.filter((s) => s.Name !== checkedName))
        //       );
        //     }
        //   }
        // }

        //檢查醫事人員卡身分證和密碼是否正確
        if (!!authData.MedicalCardPassword) {
          showLoadingButton.value = true
          let identifierData = ''
          let identifierDataRes = await getGetIdentifier(`?user=${authData.Name}`)
          try {
            identifierData = identifierDataRes.data
            const socketRes = await medicalCardWebSocket(identifierData, authData.MedicalCardPassword)

            if (socketRes == 'error') {
              authData.MedicalCardPassword = null
              showLoadingButton.value = false
              return
            }
          } catch (error) {
            authData.MedicalCardPassword = null
            showLoadingButton.value = false
            return
          }
          showLoadingButton.value = false
        }

        const res = await store.dispatch('a_authLogin', {
          ...authData,
          CaptchaHashCode: captchaData.HashCode,
          isLoginForever: isNeedPermanentLogin.value,
        })

        if (res.status === 200) {
          // console.log(res.data)
          sessionStorage.setItem('token', res.data.Token)

          // // remove dev test (test)
          // if (res.data.IsFirstLogin && import.meta.env.PROD === true) { }

          if (res.data.IsFirstLogin) {

            authData.Name = null
            authData.Permit = null
            authData.MedicalCardPassword = null
            authData.Code = null

            accountExpiredRef.value.isShowDialog = true
            accountExpiredRef.value.Message = res.data.Message

            toast.error(res.data.Message ? res.data.Message : '更改密碼', {
              timeout: 5000,
              hideProgressBar: true,
            })

            passwordRefAuth.value.accountData = res.data.Name

          } else {

            if (authData.isLoginForever) {
              sessionStorage.setItem('isNotAutoOut', 'yes')
            }

            store.commit('m_setNoticeLogin')
            store.commit('m_setAuthData', res.data)

            store.dispatch('meetingHub/init')
            let hostName = `https://${window.location.hostname}`

            if (!!res.data.AppServer && res.data.AppServer.toLowerCase() !== hostName.toLowerCase() && /127\.0\.0\.1|localhost/.test('localhost') === false) {
              window.onbeforeunload = null
              window.location.replace(`${res.data.AppServer}#/jump?token=${res.data.Token}`)
              return
            }

            if (!!res.data.Institutions) {

              if (res.data.Institutions.length) {

                // console.log(store.state.dakar)

                await GetInstitutionList()

                institutionSelectRef.value.isShowDialog = true

                let tempArr = cloneDeep(res.data.Institutions)

                // if (institutionSelectRef.value.record === 0) {
                //   institutionList.value.forEach((v, i) => {
                //     for (let val of res.data.InstitutionNos) {
                //       if (val === v.value) {
                //         tempArr.push(v)
                //       }
                //     }
                //   })
                // }

                if (institutionSelectRef.value.record === 0) {
                  institutionSelectRef.value.InstitutionNos = institutionSelectRef.value.InstitutionNos.concat(tempArr)
                }

                institutionSelectRef.value.record++

                await nextTick()

                console.log(institutionSelectRef.value.InstitutionNos)

              } else {
                router.replace({ name: 'Home' })
              }
            } else {
              router.replace({ name: 'Home' })
            }

          }

        } else if (res.status === 401) {
          fetchCaptcha()
        }
      } else {

        toast.error(`驗證碼輸入錯誤，請重新輸入`, {
          timeout: 5000,
          hideProgressBar: true,
        })

        inputCodes.value.focus()
        authData.Code = null
        fetchCaptcha()

        return
      }
    }

    const loginSelect = async (item) => {
      try {
        console.log(item)
        const query = item.No
        const res = await authRenew(query)

        if (res.status === 200 || res.status === 204) {
          store.commit('m_setAuthData', res.data)
          sessionStorage.setItem('token', res.data.Token)

          toast.success(`${item.Name}`, {
            timeout: 5000,
            hideProgressBar: true,
          })

          router.replace({ name: 'Home' })
        }

      } catch (e) {
        toast.error(`${e.response ? e.response.data : e}`, {
          timeout: 5000,
          hideProgressBar: true,
        })
      }
    }

    const fetchCaptcha = () => {
      if (captchaTimer.value) clearInterval(captchaTimer.value)
      getCaptcha().then(({ data }) => {
        captchaData.Code = data.Code
        captchaData.Image = data.Image
        captchaData.HashCode = data.HashCode
        if (process.env.NODE_ENV === 'development') {
          authData.Name = 'sysdebug' //-系統管理員
          authData.Permit = 'sysdebug!Q6'
          authData.Code = data.Code
        }
        authData.MedicalCardPassword = ''
        captchaTimer.value = setInterval(fetchCaptcha, 3 * 60 * 1000)
      })
    }

    const inputEnterEvent = (e) => {
      if (e.target.id === 'name') {
        document.getElementById('permit').focus()
      } else if (e.target.id === 'permit') {
        document.getElementById('inputCodes').focus()
      } else if (e.target.id === 'inputCodes') {
        loginEvent()
      }
    }

    const checkSocket = async () => {
      //it need to checksocket first,if not open,it need show message to tell user to open it

      if (route.name == 'Auth') {
        const res = await medicalWebSocketCheckServer()
        if (res?.type == 'error') {
          if (route.name != 'Auth') {
            return
          }
          socketServerDownloadRef.value.showMedicalWebSocketServerDownload = true
        }
      }
    }

    const applyAccount = async () => {
      applyaccountRef.value.isShowApplyAccount = true
    }

    const GetInstitutionList = async () => {
      try {
        const res = await getInstitutionList('')
        institutionList.value = res.data.Items.map((item) => ({ text: `${item.Name}【${item.No}】`, value: item.No }))
      } catch (err) {
        console.log(err)
      }
    }

    onMounted(async () => {
      // window.onbeforeunload = null;

      await checkSocket()
      sessionStorage.clear()

    })

    onUnmounted(() => {
      if (captchaTimer.value) clearInterval(captchaTimer.value)
    })

    fetchCaptcha()

    return {
      ...toRefs(authData),
      newTokenRef,
      institutionList,
      GetInstitutionList,
      captchaData,
      isAbleToLogin,
      versionTime,
      loginEvent,
      loginSelect,
      resetData,
      fetchCaptcha,
      inputEnterEvent,

      inputCodes,

      isShowPermanentWord,
      isNeedPermanentLogin,
      setIsPermanent,
      showLoadingButton,
      socketServerDownloadRef,
      passwordRefAuth,
      accountExpiredRef,
      institutionSelectRef,
      applyaccountRef,
      applyAccount,
    }
  },
}
</script>

<style lang="scss">
.auth {
  .login-panel {
    .login-buttons button.p-button {
      border-radius: 10px;
      @apply shadow-md;

      span.p-button-label {
        font-size: 24px !important;
      }

      &.confirm {
        background-color: #3f60d8;
      }

      &.refresh {
        border-color: #bbb;
      }
    }
  }
}
</style>

<style lang="scss" scoped>
#inputCodes {
  height: 42px;
  border: 1px solid #ced4da;
  border-radius: 3px;
  padding-left: 32px;
}

.auth {
  // background: #E2EBFF url('/public/assets/auth_background.png') no-repeat center center / cover;
  // background-color: #e2ebff ;
  background: url('/public/assets/dot-right.png') no-repeat calc(100% - 19px) 25%, url('/public/assets/dot-left.png') no-repeat 19px calc(100% - 150px),
    url('/public/assets/line.png') no-repeat left bottom, radial-gradient(farthest-corner at 66% 44%, rgb(255, 255, 255) 0%, rgb(226, 235, 255) 100%);
  @apply flex justify-center items-center h-screen;

  .login-panel {
    width: 375px;
    @apply ml-16 bg-white px-10 pt-10 pb-16 border-t-4;
    border-color: #9ebdfb;

    .login-header {
      @apply text-3xl font-bold flex justify-center items-center mb-10;
      color: #3f60d8;

      img {
        @apply mr-2;
      }
    }
  }

  .auth-footer {
    @apply text-black text-center absolute w-full;
    display: flex;
    justify-content: center;
    align-items: flex-end;
    background: #021a7b;
    color: #ffffff;
    bottom: 0px;
    font-size: 14px;
    font-weight: 400;
    height: 96px;
    padding-bottom: 20px;

    .version {
      margin-right: 30px;
    }

    .wording {
      text-align: left;

      .word1 {
        .commonqa {
          background: #ffffff;
          border-radius: 5px;
          display: inline-block;
          background: #fff;
          box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
          padding: 2px 4px;
          color: #00187d;
          font-weight: 800;
          margin-left: 5px;
          cursor: pointer;
        }
      }
    }
  }

  @media screen and (max-width: 1400px) {
    .auth-footer {
      padding-bottom: 36px;
    }
  }

  .main-title {
    @apply absolute left-0 top-0 font-bold text-4xl flex items-center w-full;
    color: #0f2974;
    background: #021a7b;
    height: 80px;
    padding: 0px 0 1px 20px;
    color: #ffffff;
    font-size: 30px;

    img {
      @apply mr-3;
      // max-width: 60px;
      // width: 424px;
    }
  }
}

.permanent-place {
  position: absolute;
  bottom: -40px;
}

.register {
  font-size: 21.5px;
  position: absolute;
  bottom: -44px;
  right: 0;
  color: #1f509f;
}

.accountExpiredBox,
.institutionSelectBox {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: center;
  align-items: center;

  padding: 20px;
  padding-top: 10px;

  &.select {
    flex-direction: column;
    flex-wrap: wrap;
  }

  .innerBox {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-start;
    width: 100%;
    text-align: left;
    margin-bottom: 5px;
  }

  .instituteBtn {
    margin: 0 10px 12px 0;
    padding: 4px 12px;
    line-height: 36px;
    height: 36px;
    font-size: 14px;
  }

  p {
    padding-bottom: 15px;
  }

}
</style>
