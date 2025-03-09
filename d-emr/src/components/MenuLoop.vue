<template>
  <div class="menuLoop">
    <template v-if="router">
      <template v-for="(item,index) in data">
        <router-link class="menuLoopBox" :to="{name:item.name}" :key="index" v-if="$store.state.userData&&$store.state.userData.FunctionNos&&$store.state.userData.FunctionNos.includes(item.name)">
          <div class="menuLoopBoxName">
            <i class="menuLoopBoxNameIcon el-icon-arrow-left" v-if="item.children&&item.children.length" />
            {{item.meta.title}}
          </div>
          <div class="menuLoopBoxChildren" v-if="item.children&&item.children.length">
            <MenuLoop v-for="(item2,index2) in item.children" :router="true" :key="index2" :data="[item2]" />
          </div>
        </router-link>
      </template>
    </template>
    <template v-else>
      <slot />
    </template>
  </div>
</template>

<script>
import MenuLoop from '@/components/MenuLoop.vue'
export default {
  components:{MenuLoop},
  name:'MenuLoop',
  props:['router','data'],
  data() {
    return {
    }
  }
}
</script>