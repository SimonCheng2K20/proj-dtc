<template>
  <div class="pathBox">
    <div class="pathBoxList" v-if="routerData">
      <div class="pathBoxListItem" v-for="(item,index) in routerData" :key="index">
        <router-link :to="{path:item.path}">{{item.meta.title}}</router-link>
        <i class="el-icon-arrow-right" v-if="index+1!==routerData.length" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    routerData() {
      return this.$store.state.routerPath&&this.$store.state.routerPath.matched ? this.$store.state.routerPath.matched : null
    }
  }
}
</script>