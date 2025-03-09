<template>
  <div class="control-section accordion-control-section">
    <b-card
      no-body
      class="mx-1"
      bg-variant="transparent"
    >
      <b-card-header class="bg-primary text-white cardHeader">
        <b-row no-gutters>
          <b-col cols="6">高風險通報關鍵字維護．查詢作業</b-col>
        </b-row>
      </b-card-header>
      <b-card-text class="text-left py-1">
        <b-container
          fluid
          class="px-1"
        >
          <b-row no-gutters>
            <b-col
              sm="4"
              class="px-1"
            >
              <ejs-textbox
                v-model="Word"
                floatLabelType="Always"
                placeholder="關鍵字"
                :showClearButton="true"
                @keyup.enter="onFilter"
              />
            </b-col>

            <b-col
              class="px-2 d-flex align-items-center justify-content-end"
              style="height: 60px;"
            >
              <b-button
                variant="success"
                @click="onClear"
              >
                <font-awesome-icon icon="eraser" /> 清除</b-button>&nbsp;
              <b-button
                variant="primary"
                @click="onFilter"
              >
                <font-awesome-icon icon="search" /> 查詢</b-button>

            </b-col>
          </b-row>
        </b-container>
      </b-card-text>
    </b-card>
  </div>
</template>
<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import { TextBoxPlugin } from "@syncfusion/ej2-vue-inputs";

Vue.use(TextBoxPlugin);

export default {
  props: ["medicationTypes"],
  data () {
    return {
      Word: "",
    };
  },
  methods: {
    onFilter: function () {
      this.$emit("filter", this);
    },
    onClear: function () {
      this.Word = "";

      this.$emit("filterClear", this);
    }
  },
  computed: {
    ...mapGetters(["getThemeColors"])
  }
};
</script>
