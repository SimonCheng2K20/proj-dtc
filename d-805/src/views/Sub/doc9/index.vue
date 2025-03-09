<template>
  <div
    class="class-report"
    style="background-color: #111;"
  >
    <div class="p-2">
      <patients v-on:editWithTemplate="editPatientEvent" />
      <recode />
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import patients from './patients';
import recode from './recode';
export default {
  data () {
    return {

    };
  },
  methods: {
    editPatientEvent ({ tmp, patient }) {
      const tmpObj = { path: '/sub/doc/demo/0' };
      this.$store.registerModule('patientData', { 'state': { patient, tmp } });
      this.$router.push(tmpObj);
    }
  },
  computed: {
    ...mapState(["tempItemList", "reportItemList"])
  },
  components: { patients, recode },
  created () {

  }
};
</script>
<style lang="scss" scoped>
.class-report {
  padding-top: 56px;
  min-height: 100vh;
}
.temp-list {
  > div {
    border-bottom: 1px solid var(--dark);
    &:nth-last-child(1) {
      border-bottom-width: 0;
    }
  }
}
</style>
