<template>
  <q-page
    class="flex flex-nowrap justify-center items-center"
    :style="{ background: `url(${backgroundImage})`, 'background-size': 'cover' }"
  >
    <q-card class="p-4 w-[400px]">
      <q-card-section>
        <!-- <q-tabs v-model="currentTab" indicator-color="light-green" active-color="light-green-10" align="center">
          <q-tab label="系統登入" name="login" />
          <q-tab label="醫事人員卡登入" name="medical-card-login" />
        </q-tabs> -->

        <div class="flex flex-col flex-center">
          <div class="text-xl font-bold">使用者登入</div>
          <div>User Login</div>
        </div>

        <q-separator></q-separator>

        <div class="relative flex flex-nowrap flex-col gap-8 mt-8 h-[150px]">
          <div>
            <q-input v-model="login.Name" autofocus outlined dense @keydown.enter="onLoginClick">
              <template #prepend>
                <q-icon name="person" color="blue"></q-icon>
              </template>
            </q-input>
          </div>
          <div>
            <q-input
              v-model="login.Permit"
              :type="isPwdShow ? 'text' : 'password'"
              outlined
              dense
              @keydown.enter="onLoginClick"
            >
              <template #prepend>
                <q-icon name="lock" color="blue"></q-icon>
              </template>

              <template #append>
                <q-icon
                  :name="isPwdShow ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="isPwdShow = !isPwdShow"
                ></q-icon>
              </template>
            </q-input>
            <div class="absolute w-full text-end">
              <q-btn class="text-xs" label="忘記密碼？" dense unelevated></q-btn>
              <!-- @click="toForgetPassword" -->
            </div>
          </div>
          <!-- <div>
          <div class="font-bold">驗證碼</div>
          <div class="flex flex-nowrap gap-2">
            <q-input v-model="login.Code" outlined dense @keydown.enter="onLoginClick"></q-input>
            <q-btn icon="refresh" unelevated round @click="GetCaptcha"></q-btn>
            <q-img :src="captcha.Image" width="80px" height="42px"></q-img>
          </div>
        </div> -->
        </div>
      </q-card-section>

      <q-card-section class="grid grid-cols-2 gap-2 pt-0">
        <q-btn
          color="clear"
          text-color="default"
          label="重新輸入"
          @click="Object.assign(login, cloneDeep(initData.login))"
          unelevated
          outline
        ></q-btn>
        <q-btn color="primary" type="submit" :loading="loginLoading" @click="onLoginClick" unelevated>登入</q-btn>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { postLogin } from 'api'
import { useQuasar } from 'quasar'
import { useAuthStore } from 'stores/auth'
import backgroundImage from 'src/assets/loginGround.png'
import { cloneDeep } from 'lodash-es'
import { useGlobalStore } from 'stores/global'
// import ChangePassword from 'layouts/components/ChangePassword.vue'
// import ForgetPassword from './components/ForgetPassword.vue'

const $q = useQuasar()
const router = useRouter()
const authStore = useAuthStore()
const globalStore = useGlobalStore()

const currentTab = ref('login')

const isPwdShow = ref(false)

const initData = {}
initData.login = {
  Name: process.env.DEV ? 'datacom' : null,
  Permit: process.env.DEV ? 'datacom' : null,
  CaptchaHashCode: 'null',
}
const login = reactive(cloneDeep(initData.login))

const loginLoading = ref(false)

const onLoginClick = () => {
  Postlogin(login)
}

const Postlogin = async (data) => {
  try {
    loginLoading.value = true
    const res = await postLogin(data)
    if (res.status === 200) {
      sessionStorage.setItem('token', res.data.Token)
      authStore.setUserData(res.data)
      authStore.GetOrganization()

      if (res.data.RoleNos.includes('Hospitalized')) {
        router.push({ name: 'staySearch' })
      } else if (res.data.RoleNos.includes('NursingStaff') || res.data.RoleNos.includes('Nurse')) {
        router.push({ name: 'NursingStation-Implement-BedList' })
      } else if (res.data.RoleNos.includes('Admins')) {
        router.push({ name: 'TodayBooking' })
      } else if (res.data.RoleNos.includes('Doctor') || res.data.RoleNos.includes('AttendingDoctor')) {
        router.push({ name: 'OpdList', params: { status: 1 } })
      } else {
        router.push({ name: 'TodayBooking' })
      }
    }
  } catch (err) {
    console.log(err)
    $q.notify({
      type: 'negative',
      position: 'top',
      message: '登入失敗：' + typeof err.data === 'string' ? err.data : JSON.stringify(err.data),
    })
  } finally {
    loginLoading.value = false
  }
}

// const toForgetPassword = () => {
//   const dialog = $q
//     .dialog({
//       component: ForgetPassword,
//     })
//     .onOk(() => {
//       dialog.hide()
//     })
// }
</script>

