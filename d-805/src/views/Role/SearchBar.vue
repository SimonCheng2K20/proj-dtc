<template>
  <div class="control-section accordion-control-section">
    <b-card
      bg-variant="transparent"
      no-body
      class="mx-1"
    >
      <b-card-header class="bg-primary text-white cardHeader">
        <b-row no-gutters>
          <b-col cols="6">系統角色管理．查詢作業</b-col>
        </b-row>
      </b-card-header>
      <b-card-text class="text-left py-1">
        <b-container
          fluid
          class="px-1"
        >
          <b-row no-gutters>
            <b-col
              sm="2"
              class="px-1"
            >
              <ejs-textbox
                v-model="No"
                floatLabelType="Always"
                placeholder="角色代碼"
                :showClearButton="true"
                @keyup.enter="onFilter"
              />
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <ejs-textbox
                v-model="Name"
                floatLabelType="Always"
                placeholder="角色名稱"
                :showClearButton="true"
                @keyup.enter="onFilter"
              />
            </b-col>
            <b-col
              sm="4"
              class="px-1"
              style="display: table; height: 60px;"
            >
              <div style="display: table-cell; vertical-align: middle">
                <b-form-radio-group
                  v-model="IsActive"
                  class="pt-2 pl-2 rounded-right"
                >
                  <b-form-radio value="Y">啟用</b-form-radio>
                  <b-form-radio value="N">未啟用</b-form-radio>
                </b-form-radio-group>
              </div>
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

import { RadioButtonPlugin } from "@syncfusion/ej2-vue-buttons";
import { TextBoxPlugin } from "@syncfusion/ej2-vue-inputs";
import { mapGetters } from "vuex";

Vue.use(TextBoxPlugin);
Vue.use(RadioButtonPlugin);

export default {
  data () {
    return {
      No: null,
      Name: null,
      IsActive: ""
    };
  },
  methods: {
    onFilter: function () {
      this.$emit("filter", this);
    },
    onClear: function () {
      this.No = null;
      this.Name = null;
      this.IsActive = "";

      this.$emit("filterClear", this);
    }
  },
  computed: {
    ...mapGetters(["getThemeColors"])
  }
};
</script>
<style></style>
