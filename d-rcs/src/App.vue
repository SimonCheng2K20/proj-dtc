<template>
  <Layout>
    <router-view style="min-height: calc(100vh - 187px)" />
  </Layout>
  <!-- <router-view /> -->
</template>

<script>
import Layout from './components/layout/index.vue'
import { ref, reactive, computed, provide, nextTick, inject, onBeforeUnmount, onUnmounted, onUpdated, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
export default {
  components: { Layout },
  setup() {
    const router = useRouter()
    const route = useRoute()
    const store = useStore()
    const themeColor = reactive({
      // main: '#eee',
    })
    const globalVariable = inject('globalVariable')

    const setOnbeforeunload = () => {
      window.onbeforeunload = async () => {
        const objEditItem = { ...store.state?.editItem }
        const objDakar = { ...store.state?.dakar }
        const objFunctions = { ...store.state?.functions }
        const objOthers = { ...store.state?.others }

        sessionStorage.setItem('globalVariable', JSON.stringify(globalVariable))
        sessionStorage.setItem('objEditItem', JSON.stringify(objEditItem))
        sessionStorage.setItem('objDakar', JSON.stringify(objDakar))
        sessionStorage.setItem('objFunctions', JSON.stringify(objFunctions))
        sessionStorage.setItem('objOthers', JSON.stringify(objOthers))
      }
    }

    const setGlobalData = () => {
      const allData = sessionStorage.getItem('globalVariable') ? JSON.parse(sessionStorage.getItem('globalVariable')) : {}

      Object.entries(allData).forEach(([key, value]) => {
        globalVariable[`${key}`] = allData[`${key}`]
      })

      //set important store data

      const editItem = sessionStorage.getItem('objEditItem') ? JSON.parse(sessionStorage.getItem('objEditItem')) : {}
      const dakarItem = sessionStorage.getItem('objDakar') ? JSON.parse(sessionStorage.getItem('objDakar')) : {}
      const functionItem = sessionStorage.getItem('objFunctions') ? JSON.parse(sessionStorage.getItem('objFunctions')) : {}
      const othersItem = sessionStorage.getItem('objOthers') ? JSON.parse(sessionStorage.getItem('objOthers')) : {}

      store.commit('m_setEditItem', editItem)
      store.commit('m_setAuthData', dakarItem)
      store.commit('m_setFunctionList', functionItem)
      store.commit('m_setOthersData', othersItem)

      sessionStorage.setItem('globalVariable', '')

      sessionStorage.setItem('objEditItem', '')
      sessionStorage.setItem('objDakar', '')
      sessionStorage.setItem('objFunctions', '')
      sessionStorage.setItem('objOthers', '')
    }

    onMounted(async () => {
      await setOnbeforeunload()
      await setGlobalData()
    })

    return {
      themeColor,
      // isRouterAlive,
    }
  },
}
</script>

<style lang="scss">
@import './styles/main.scss';

.warning-idle {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(#000, 0.8);
  display: grid;
  place-items: center;
  z-index: 99999;

  > nav {
    width: 500px;
    height: 200px;
    border-radius: 5px;
    color: black;
    background: #dfdcdc;
    display: flex;
    flex-direction: column;
    text-align: center;

    header {
      height: 40px;
      color: white;
      background: red;
      font-size: 20px;
      padding-left: 5px;
      line-height: 40px;
    }
  }
}
</style>
