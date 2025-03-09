<template>
  <CardiacFrame>
    <b-form-group
      v-for="(input, index) in inputs"
      :key="index"
      :label="`${input.label}: `"
    >
      <b-form-checkbox-group
        :id="`checkbox-group-${index}`"
        :name="`flavour-${index}`"
        :options="input.options"
        v-model="input.selected"
      ></b-form-checkbox-group>
    </b-form-group>
  </CardiacFrame>
</template>

<script>
import CardiacFrame from './frame'
export default {
  data () {
    return {}
  },
  props: {
    inputs: {
      type: Array
    }
  },
  components: {
    CardiacFrame
  }
}
</script>
