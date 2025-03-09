<template>
  <CardiacFrame
    :numberOfColumn="numberOfColumn"
    :title="title"
  >
    <div v-html="content" />
  </CardiacFrame>
</template>

<script>
import CardiacFrame from './frame'
export default {
  data () {
    return {}
  },
  props: {
    title: {
      type: String
    },
    content: {
      type: String
    },
    numberOfColumn: {
      type: Number,
      default: 5
    }
  },
  components: {
    CardiacFrame
  }
}
</script>

