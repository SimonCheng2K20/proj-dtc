<template>
  <router-view :metaName="routeMetaName" />
</template>

<script>
import { useRoute } from 'vue-router'
import { computed } from 'vue'
export default {
  setup () {
    const route = useRoute()
    const routeMetaName = computed(() => route.meta.title || '')
    return {
      routeMetaName
    }
  }
}
</script>

<style>

</style>
