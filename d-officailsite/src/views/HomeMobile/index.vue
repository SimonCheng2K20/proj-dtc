<template>
  <section class="dtc-home">
    <main-banner />
    <introductions />
    <reputations />
    <contact />
  </section>
</template>

<script>
import mainBanner from './mainBanner';
import introductions from './introductions';
import reputations from './reputations';
import contact from './contact';
export default {
  components: { mainBanner, introductions, reputations, contact },
  data() {
    return {
      
    };
  },
  methods: {
    
  },
  mounted() { },
};
</script>
<style scoped lang="scss">
.dtc-home {
  min-height: calc(100vh - 129.2px);
}
</style>
