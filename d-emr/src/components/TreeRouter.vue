<template>
  <div class="treeRouter" v-if="data.meta&&data.meta.show">
    <template v-if="first">
      <div class="treeRouterTitle">
        <router-link :to="{name:data.name}">
          {{data.meta.title}}
          <i class="el-icon-arrow-down" v-if="data.children&&data.children.length" />
        </router-link>
        <div class="treeRouterChildren" v-if="data.children&&data.children.length">
          <TreeRouter v-for="(item,index) in data.children" :data="item"   :first="false" :key="index" />
        </div>
      </div>
    </template>
    <template v-else>
      <div class="treeRouterTitle childrenRouter">
        <router-link :to="{name:data.name}">{{data.meta.title}}</router-link>
        <div class="treeRouterChildren childrenRouterMenu" v-if="data.children&&data.children.length">
          <TreeRouter v-for="(item,index) in data.children" :data="item"   :first="false" :key="index" />
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import TreeRouter from '@/components/TreeRouter.vue'

export default {
  name: 'TreeRouter',
  props: ['data','first'],
  components: {TreeRouter}
}
</script>