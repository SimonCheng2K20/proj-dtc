<template>
  <div class="HeaderMenuMobileItem" v-if="data.meta&&data.meta.show">
    <div class="HeaderMenuMobileItemTitle" @click="open=!open" v-if="data.children&&data.children.length">
      {{data.meta.title}}
      <i class="HeaderMenuMobileItemTitleIcon el-icon-arrow-up" :class="{'isOpen':open}" />
    </div>
    <router-link class="HeaderMenuMobileItemTitle" :to="{name:data.name}" v-else>{{data.meta.title}}</router-link>
    <el-collapse-transition>
      <div class="HeaderMenuMobileItemChildren" v-if="data.children&&data.children.  length&&open">
        <HeaderMenuMobileItem v-for="(item,index) in data.children" :data="item"   :key="index" />
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
import HeaderMenuMobileItem from '@/components/HeaderMenuMobileItem'
export default {
  name:'HeaderMenuMobileItem',
  props: ['data'],
  components: {HeaderMenuMobileItem},
  data() {
    return {
      open:true
    }
  }
}
</script>