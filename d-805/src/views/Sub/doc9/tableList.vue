<template>
  <b-table
    striped
    hover
    small
    dark
    class="mt-2"
    :items="items"
    :fields="fields"
  >
    <slot></slot>
  </b-table>
</template>

<script>
export default {
  name: 'tableList',
  data () {
    return {

    }
  },
  props: {
    items: {
      type: Array
    },
    fields: {
      type: Array
    }
  },
  created () {

  },
}
</script>
