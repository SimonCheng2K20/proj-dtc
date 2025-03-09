<template>
  <div :style="{ border: `${border.width}px solid ${border.color}`, borderRadius: `${border.radius}px` }">
    <div
      class="dtc-grid"
      :style="{ 
        gridTemplateColumns: (numberOfColumn ? numberOfColumn : [[5, 1]]).map(v => 'repeat(' + v[0] + ',' + v[1] + 'fr)').join(' ')
      }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {}
  },
  props: {
    theme: {
      type: String
    },
    numberOfColumn: {
      type: Array
    },
    border: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: { width: 1, color: '#fff', radius: 0 }
    }
  }
}
</script>

<style lang="scss">
.dtc-grid {
  display: grid;
  grid-gap: 3px;
  grid-row-gap: 3px;
  padding: 3px;
}
</style>
