<template>
  <div>
    <loading />
  </div>
</template>

<script>
import { inject, ref, defineComponent, watch, computed, onMounted, nextTick } from 'vue'
import { getCaptcha } from 'Service/apis.js'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { getDakarInfo, getDakarById } from 'Service/apis.js'
import loading from '@/components/loading.vue'

export default defineComponent({
  props: {},
  components: { loading },
  setup(props, { emit }) {
    const route = useRoute()
    const router = useRouter()
    const store = useStore()

    const setAcountData = async (tokenData) => {
      console.log('tokenData', tokenData)
      store.commit('m_setToDefaultData')
      sessionStorage.clear()
      sessionStorage.setItem('token', tokenData)

      //set main data
      const { data } = await getDakarInfo()
      data.Token = tokenData
      store.commit('m_setAuthData', data)
      sessionStorage.setItem('dakar', JSON.stringify(data))

      //set other data
      const accountNo = store.state?.dakar ? store.state?.dakar.No : ''
      const { data: otherData } = await getDakarById(`${accountNo}`)

      store.commit('m_setOthersData', otherData)
      store.dispatch('a_setFunctionList')

      await nextTick()
      setTimeout(() => {
        router.push({ name: 'Home' })
      }, 200)
    }

    onMounted(async () => {
      if (!!route.query?.token) {
        await setAcountData(route.query.token)
        return
      }
    })
    return {}
  },
})
</script>

<style lang="scss" scoped></style>
