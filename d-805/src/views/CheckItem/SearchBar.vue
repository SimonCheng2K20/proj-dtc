<template>
  <div class="control-section accordion-control-section">
    <b-card
      no-body
      class="mx-1"
      bg-variant="transparent"
    >
      <b-card-header class="bg-primary text-white cardHeader">
        <b-row no-gutters>
          <b-col cols="6">檢查項目維護．查詢作業</b-col>
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
                placeholder="院內代碼"
                :showClearButton="true"
                @keyup.enter="onFilter"
              />
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <ejs-textbox
                v-model="NhiNo"
                floatLabelType="Always"
                placeholder="健保代碼"
                :showClearButton="true"
                @keyup.enter="onFilter"
              />
            </b-col>
            <!-- <b-col sm="2" class="px-1">
              <ejs-textbox
                v-model="EngName"
                floatLabelType="Always"
                placeholder="檢查項目英文名稱"
                :showClearButton="true"
                @keyup.enter="onFilter"
              />
            </b-col> -->
            <b-col
              sm="2"
              class="px-1"
            >
              <ejs-textbox
                v-model="Name"
                floatLabelType="Always"
                placeholder="檢查項目名稱"
                :showClearButton="true"
                @keyup.enter="onFilter"
              />
            </b-col>
            <b-col
              sm="2"
              class="px-1"
              style="display: table; height: 60px;"
            >
              <div style="display: table-cell; vertical-align: middle;">
                <b-form-radio-group
                  v-model="IsActive"
                  class="pt-2 pl-2 rounded-right radio-inputs"
                >
                  <b-form-radio value="Y">啟用</b-form-radio>
                  <b-form-radio value="N">未啟用</b-form-radio>
                  <!-- <b-form-radio value="">啟用及未啟用</b-form-radio> -->
                </b-form-radio-group>
              </div>
            </b-col>
            <b-col
              sm="4"
              class="px-1"
              style="display: table; height: 60px;"
            >
              <div style="display: table-cell; vertical-align: middle;">
                <b-form-radio-group
                  v-model="NonSchedule"
                  class="pt-2 pl-2 rounded-right radio-inputs"
                >
                  <b-form-radio value="Y">隨到隨檢</b-form-radio>
                  <b-form-radio value="N">可預約</b-form-radio>
                </b-form-radio-group>
              </div>
            </b-col>
          </b-row>
          <b-row no-gutters>
            <b-col
              sm="2"
              class="px-1"
            >
              <ejs-dropdownlist
                v-model="Modality"
                floatLabelType="Always"
                :dataSource="modalityList"
                :fields="{ text: 'Name', value: 'No' }"
                placeholder="儀器類別"
                :showClearButton="true"
              ></ejs-dropdownlist>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <ejs-dropdownlist
                v-model="InstitutionId"
                floatLabelType="Always"
                :dataSource="institutionList"
                :fields="{ text: 'Name', value: 'Id' }"
                placeholder="檢查科別"
                :showClearButton="true"
              ></ejs-dropdownlist>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <ejs-dropdownlist
                v-model="CheckCategory"
                :dataSource="checkCategories"
                :fields="{ text: 'Name', value: 'Id' }"
                floatLabelType="Always"
                :showClearButton="true"
                placeholder="檢查類別"
              ></ejs-dropdownlist>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <ejs-dropdownlist
                v-model="ModalityCategory"
                :dataSource="modalityCategories"
                :fields="{ text: 'Name', value: 'Id' }"
                floatLabelType="Always"
                :showClearButton="true"
                placeholder="自訂分類"
              ></ejs-dropdownlist>
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
import { DropDownListPlugin } from "@syncfusion/ej2-vue-dropdowns";
import { RadioButtonPlugin } from "@syncfusion/ej2-vue-buttons";
import { TextBoxPlugin } from "@syncfusion/ej2-vue-inputs";
import { mapGetters } from "vuex";

Vue.use(TextBoxPlugin);
Vue.use(RadioButtonPlugin);
Vue.use(DropDownListPlugin);

export default {
  props: ["checkCategories", "modalityCategories", "modalityList", "institutionList"],
  data () {
    return {
      Modality: null,
      No: "",
      NhiNo: "",
      Name: "",
      EngName: "",
      IsActive: "",
      NonSchedule: "",
      CheckCategory: null,
      ModalityCategory: null,
      InstitutionId: null,
    };
  },
  methods: {
    onFilter: function () {
      this.$emit("filter", this);
    },
    onClear: function () {
      this.Modality = null;
      this.No = "";
      this.Name = "";
      this.IsActive = "";
      this.NonSchedule = "";
      this.CheckCategory = null;
      this.ModalityCategory = null;
      this.InstitutionId = null;
      this.NhiNo = "";
      this.EngName = "";
      this.$emit("filterClear", this);
    },
  },
  computed: {
    ...mapGetters(["getThemeColors"]),
  },
};
</script>

<style lang="scss" scoped>
div {
  &.lightTheme,
  &.darkTheme {
    .radio-inputs {
      /deep/ label.custom-control-label {
        color: inherit !important;
      }
    }
  }
}
</style>
