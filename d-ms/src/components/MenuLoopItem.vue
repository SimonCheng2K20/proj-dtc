<template>
  <router-link :to="{name:data.name}" class="menuLoopItem" v-if="data.meta&&data.meta.show&&$store.state.userData&&$store.state.userData.FunctionNos.includes(data.name)">
    <div class="menuLoopItemTitle">
      <div>{{data.meta.title}}</div>
      <i class="el-icon-arrow-down" v-if="data.children&&data.children.length" />
    </div>
    <div class="menuLoopItemChildren" v-if="data.children&&data.children.length">
      <MenuLoopItem v-for="(item,index) in routerList" :data="item" :key="index" />
    </div>
  </router-link>
</template>

<script>
import MenuLoopItem from '@/components/MenuLoopItem.vue'
export default {
  name: 'MenuLoopItem',
  components: {MenuLoopItem},
  props: ['data'],
  computed: {
    routerList() {
      if(this.data.children&&this.data.children.length) return this.data.children.filter(res=>res.meta&&res.meta.show&&this.$store.state.userData&&this.$store.state.userData.FunctionNos.includes(res.name))
      else return null
    }
  },
}
</script>