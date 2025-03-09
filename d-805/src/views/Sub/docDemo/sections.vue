<template>
  <div
    class="item-section"
    :class="{'no-title': !section.title, 'mt-1': section.title}"
  >
    <h4>{{section.title}}</h4>
    <tempGrid :cols="section.columns">
      <item
        v-for="(item,idx) in section.items"
        :item="item"
        :secTime="section.createTime"
        :key="'item'+idx"
      />
    </tempGrid>
  </div>
</template>

<script>
import tempGrid from './tempGrid';
import item from './item';
export default {
  data () {
    return {

    }
  },
  created () {
    // console.log(this.section);
  },
  components: {
    tempGrid, item
  },
  props: {
    section: {
      type: Object
    }
  }
}
</script>

<style lang="scss">
// .no-title {
//   margin-top: -14px;
// }
</style>
