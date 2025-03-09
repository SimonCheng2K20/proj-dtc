import { defineStore } from 'pinia'
import { getOrganization, getAccountInfo } from 'api'

/*
 * 僅在登入時(/pages/Login.vue) 和 頁面刷新且有有效 Token 時(/router/index.js) 設置 UserData
 */
export const useAuthStore = defineStore('auth', {
  state: () => ({
    userData: {
      No: null,
      Name: null,
      FunctionNos: [],
      RoleNos: [],
      IsFirstLogin: null,
      Profile: null,

      // 醫事人員卡認證
      medicalCardSignature: null,
    },

    organizeData: {
      LevelId: null,
    },
  }),
  actions: {
    setUserData(data) {
      Object.assign(this.userData, data)
    },
    setOrganizeData(data) {
      Object.assign(this.organizeData, data)
    },

    async GetAccountInfo() {
      try {
        const res = await getAccountInfo()
        this.setUserData(res.data)
        return { data: res.data }
      } catch (error) {
        console.log(error)
        return { error }
      }
    },

    async GetOrganization() {
      try {
        const res = await getOrganization()
        this.setOrganizeData(res.data)
        return { data: res.data }
      } catch (error) {
        console.log(error)
        return { error }
      }
    },

    async getData() {
      const tasks = [this.GetAccountInfo(), this.GetOrganization()]
      const res = await Promise.all(tasks)
      return res
    },
  },
})

