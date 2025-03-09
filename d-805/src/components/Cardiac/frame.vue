<template>
  <div :style="{ border: `${border.width}px solid ${border.color}`, borderRadius: `${border.radius}px` }">
    <header
      v-if="title"
      class="py-1 px-3 mb-1"
      :class="theme"
      v-text="title"
    />
    <div
      class="dtc-grid"
      :style="{ 
        gridTemplateColumns: (numberOfColumn ? numberOfColumn : [[5, 1]]).map(v => 'repeat(' + v[0] + ',' + v[1] + 'fr)').join(' '),
        padding: `${padding}px`
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
    title: {
      type: String
    },
    theme: {
      type: String
    },
    numberOfColumn: {
      type: Array
    },
    border: {
      type: Object,
      // eslint-disable-next-line vue/require-valid-default-prop
      default: { width: 0, color: 'transparent', radius: 0 }
    },
    padding: {
      type: Number,
      default: 3
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

header {
  background: var(--teal);
  color: var(--light);
  border-radius: 5px;
  box-sizing: border-box;
  &.primary {
    background: var(--primary);
  }
  &.purple {
    background: var(--purple);
  }
  &.pink {
    background: var(--pink);
  }
}
</style>
