<template>
  <section class="dashboard">
    <img width="749" height="3252" src="private.png" />
  </section>
</template>

<script>
export default {
  name: "pushNotifyMsg",
  data() {
    return {
      msg: store.pnMsg,
    };
  },
  components: {},
  computed: {
    isLogin() {
      return store.isLogin;
    },
  },
  methods: {},

  async mounted() {},
  async beforeCreate() {},
};
</script>

<style lang="scss" scoped>
.dashboard {
  background: white;
}
</style>
