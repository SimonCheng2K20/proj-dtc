<template>
  <div id="app">
    <Loading v-if="$store.state.loading" />
    <Header />
    <PathBox v-if="$store.state.routerPath&&!$store.state.routerPath.meta.noPathBox" />
    <router-view class="content" />
    <Floor />
  </div>
</template>

<script>
import Loading from '@/components/Loading.vue'
import Header from '@/components/Header.vue'
import PathBox from '@/components/PathBox.vue'
import Floor from '@/components/Floor.vue'

export default {
  components: {Loading,Header,PathBox,Floor}
}
</script>