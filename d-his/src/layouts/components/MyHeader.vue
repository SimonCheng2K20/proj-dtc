<template>
  <q-header class="bg-[#035ab8] text-white font-bold" :style="{ 'z-index': '999' }">
    <q-toolbar class="h-full">
      <div class="pr-4 pl-2">
        <q-img class="shrink-0 cursor-pointer" :src="logo" :alt="logoImageTitle" :title="logoImageTitle" width="calc(352px * 0.7)" height="calc(56px * 0.7)" @click="logoClick"></q-img>
      </div>
      <nav class="flex no-wrap w-full" v-if="route.name !== 'Login'">
        <ul class="flex items-center pb-[8px]">
          <my-menu></my-menu>
        </ul>
        <q-space></q-space>
        <div class="flex justify-end items-center no-wrap relative top-[-6px] min-w-fit">
          <span class="mr-2">{{ authStore.userData.Name }}</span>
          <q-btn icon="person" round flat bg="white" dense class="text-[#3E3FB0] bg-white">
            <q-popup-proxy v-model="popup.userMenu" class="min-w-fit text-[15px]">
              <q-card>
                <q-item>
                  <q-item-section>
                    <q-item-label><span class="text-[16px] tracking-wide">{{ authStore.userData.Name }}</span><span>&nbsp;&nbsp;您好 ~&nbsp;&nbsp;</span></q-item-label>
                  </q-item-section>
                </q-item>
                <q-separator></q-separator>
                <q-list>
                  <q-item
                    clickable
                    @click="
                      () => {
                        popup.userMenu = false
                        toChangePassword()
                      }
                    "
                  >
                    <q-item-section>
                      <q-item-label>更改密碼</q-item-label>
                    </q-item-section>
                  </q-item>
                  <q-item
                    clickable
                    @click="
                      () => {
                        popup.userMenu = false
                        logout()
                      }
                    "
                  >
                    <q-item-section>
                      <q-item-label>登出</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card>
            </q-popup-proxy>
          </q-btn>
        </div>
      </nav>

      <div class="absolute text-end text-xs right-4 bottom-0 bg-blue-10 px-1">
        {{ currentTime }}
      </div>
    </q-toolbar>

    <div id="header-expand"></div>
  </q-header>
</template>

<script setup>
import { ref, inject, reactive, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import dayjs from 'dayjs'
import logo from 'assets/his/dtc_logo_2.png'
import ChangePassword from './ChangePassword.vue'
import { useQuasar } from 'quasar'
import { cloneDeep } from 'lodash'
import MyMenu from './MyMenu.js'
import { useAuthStore } from 'stores/auth.js'

const $q = useQuasar()
const route = useRoute()
const router = useRouter()
const popup = reactive({})
const authStore = useAuthStore()

const currentTime = ref(dayjs().format('YYYY-MM-DD HH:mm:ss'))
const interval = setInterval(() => {
  currentTime.value = dayjs().format('YYYY-MM-DD HH:mm:ss')
}, 1000)

const logout = () => {
  sessionStorage.clear()
  router.replace({ name: 'Login' })
}

const toChangePassword = () => {
  const dialog = $q
    .dialog({
      component: ChangePassword,
    })
    .onOk(() => {
      dialog.hide()
    })
}

const logoClick = () => {
  if (authStore.userData.RoleNos.includes('Hospitalized')) {
    router.push({ name: 'staySearch' })
  }else if (authStore.userData.RoleNos.includes('NursingStaff') || authStore.userData.RoleNos.includes('Nurse')) {
    router.push({ name: 'NursingStation-Implement-BedList' })
  }else if (authStore.userData.RoleNos.includes('Admins')) {
    router.push({ name: 'TodayBooking' })
  }else if (authStore.userData.RoleNos.includes('Doctor') || authStore.userData.RoleNos.includes('AttendingDoctor')) {
    router.push({ name: 'OpdList', params: { status: 1 } })
  } else {
    router.push({ name: 'TodayBooking' })
  }
}

const logoImageTitleTemp = ref('')

const logoImageTitle = computed({
  get(){
    return logoImageTitleTemp.value
  },
  set(val){
    logoImageTitleTemp.value = cloneDeep(val)
  }
})


onMounted(()=>{
  console.log(`document.title: `, document.title)
  logoImageTitle.value = document.title
})

onUnmounted(() => {
  clearInterval(interval)
})

</script>

