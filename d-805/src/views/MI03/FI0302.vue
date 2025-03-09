<template>
  <div class="pageContent px-1">
    <b-card
      no-body
      bg-variant="transparent"
    >
      <b-card-header class="bg-primary text-white cardHeader">
        <b-row no-gutters>
          <b-col
            cols="6"
            class="float-left text-left"
          >報告片語維護作業</b-col>
        </b-row>
      </b-card-header>
      <RxP />
    </b-card>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
import RxP from "@/components/CI0302ReportPhrase";

export default {
  name: "FI0302",
  components: { RxP },
  computed: {
    ...mapGetters(["getThemeColors"])
  },
  methods: {
    ...mapMutations(["CLEAR_PHRASE"])
  },
  beforeDestroy () {
    this.CLEAR_PHRASE();
  }
};
</script>

// bg-variant="dark" text-variant="white"

<style lang="scss" scoped>
/* .pageContent {
  box-shadow: 0 -130px 130px black;
} */
</style>
