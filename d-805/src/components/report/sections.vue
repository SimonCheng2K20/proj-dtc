<template>
  <div
    class="item-section noBreak"
    :class="{ 'no-title': !section.title, 'mt-1': section.title }"
  >
    <h4>{{ section.title }}</h4>
    <tempGrid :cols="section.columns">
      <item
        v-for="(item, idx) in section.items"
        :item="item"
        :imageOptions="imageOptions"
        :key="'item' + idx"
        :pos="[...pos, idx]"
      />
    </tempGrid>
  </div>
</template>

<script>
import tempGrid from "@/components/template/tempGrid";
import item from "./item";
export default {
  data () {
    return {};
  },
  mounted () {
    // console.log(this.section);
  },
  components: {
    tempGrid,
    item,
  },
  props: {
    section: {
      type: Object,
    },
    imageOptions: {
      type: Array,
      default: () => [],
    },
    pos: {
      type: Array,
      default: () => [1, 2]
    }
  },
};
</script>

<style lang="scss">
// .no-title {
//   margin-top: -14px;
// }
h4 {
  color: inherit;
}
</style>
