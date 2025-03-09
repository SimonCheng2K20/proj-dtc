<template>
  <div class="control-section accordion-control-section">
    <b-card
      no-body
      class="mx-1"
      bg-variant="transparent"
    >
      <b-card-header class="bg-primary text-white cardHeader">
        <b-row no-gutters>
          <b-col cols="6">轉診(轉檢)醫院維護．查詢作業</b-col>
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
              <ejs-dropdownlist
                floatLabelType="Always"
                placeholder="組織類別"
                :showClearButton="true"
                :fields="{ text: 'Name', value: 'No' }"
                v-model="OrganizationType"
                :dataSource="organizationTypes"
              ></ejs-dropdownlist>
            </b-col>
            <!-- <b-col sm="1" class="px-1">
              <ejs-textbox v-model="No" floatLabelType="Always" placeholder="檢查室代碼" :showClearButton="true" @keyup.enter="onFilter" />
            </b-col> -->
            <b-col
              sm="2"
              class="px-1"
            >
              <ejs-textbox
                v-model="Name"
                floatLabelType="Always"
                placeholder="醫院名稱"
                :showClearButton="true"
                @keyup.enter="onFilter"
              />
            </b-col>
            <b-col
              sm="3"
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
                  <!-- <b-form-radio value="">啟用及未啟用</b-form-radio> -->
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
import { mapGetters } from "vuex";
import { DropDownListPlugin } from "@syncfusion/ej2-vue-dropdowns";
import { RadioButtonPlugin } from "@syncfusion/ej2-vue-buttons";
import { TextBoxPlugin } from "@syncfusion/ej2-vue-inputs";

Vue.use(TextBoxPlugin);
Vue.use(RadioButtonPlugin);
Vue.use(DropDownListPlugin);

export default {
  props: ["organizationTypes"],
  data () {
    return {
      No: "",
      Name: "",
      OrganizationType: null,
      IsActive: "",
    };
  },
  methods: {
    onFilter: function () {
      this.$emit("filter", this);
    },
    onClear: function () {
      this.No = "";
      this.Name = "";
      this.OrganizationType = null;
      this.IsActive = "";

      this.$emit("filterClear", this);
    },
  },
  computed: {
    ...mapGetters(["getThemeColors"]),
  },
};
</script>
