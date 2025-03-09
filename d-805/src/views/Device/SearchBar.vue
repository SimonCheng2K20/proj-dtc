<template>
  <div class="control-section accordion-control-section">
    <b-card
      no-body
      class="mx-1"
      bg-variant="transparent"
    >
      <b-card-header class="bg-primary text-white cardHeader">
        <b-row no-gutters>
          <b-col cols="6">檢查儀器維護．查詢作業</b-col>
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
                placeholder="檢查儀器代碼"
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
                placeholder="檢查儀器名稱"
                :showClearButton="true"
                @keyup.enter="onFilter"
              />
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <ejs-dropdownlist
                v-model="Location"
                :dataSource="locations"
                :fields="{ text: 'Name', value: 'Id' }"
                floatLabelType="Always"
                placeholder="放置檢查室"
                :showClearButton="true"
              ></ejs-dropdownlist>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <ejs-dropdownlist
                v-model="Modality"
                :dataSource="modalityList"
                :fields="{ text: 'Name', value: 'No' }"
                floatLabelType="Always"
                placeholder="造影設備類別"
                :showClearButton="true"
              ></ejs-dropdownlist>
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
  props: ["locations", "modalityList"],
  data () {
    return {
      No: "",
      Name: "",
      IsActive: "",
      Location: null,
      Modality: null
    };
  },
  methods: {
    onFilter: function () {
      this.$emit("filter", this);
    },
    onClear: function () {
      this.No = "";
      this.Name = "";
      this.IsActive = "";
      this.Location = null;
      this.Modality = null;

      this.$emit("filterClear", this);
    }
  },
  computed: {
    ...mapGetters(["getThemeColors"])
  }
};
</script>
<style></style>
