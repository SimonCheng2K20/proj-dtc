<template>
  <div class="menuLoop">
    <template v-for="(item,index) in routerList">
      <router-link :to="{name:item.name}" class="menuLoopBox" :key="index" v-if="item.children&&item.children.length">
        <div class="menuLoopBoxTitle">
          <div>{{item.meta.title}}</div>
          <i class="el-icon-arrow-down" />
        </div>
        <div class="menuLoopBoxChildren">
          <MenuLoopItem :data="item2" v-for="(item2,index2) in item.children" :key="index2" />
        </div>
      </router-link>
      <router-link class="menuLoopBox" :to="{name:item.name}" :key="index" v-else>
        <div class="menuLoopBoxTitle">
          <div>{{item.meta.title}}</div>
        </div>
      </router-link>
    </template>
  </div>
</template>

<script>
import MenuLoopItem from '@/components/MenuLoopItem.vue'
export default {
  components:{MenuLoopItem},
  computed: {
    routerList() {
      return this.$router.options.routes.filter(res=>res.meta&&res.meta.show&&this.$store.state.userData&&this.$store.state.userData.FunctionNos.includes(res.name))
    }
  },
  created() {
    console.log(this.routerList)
  }
}
</script>