<template>
  <div class="control-section accordion-control-section">
    <b-card
      no-body
      class="mx-1"
      bg-variant="transparent"
    >
      <b-card-header class="bg-primary text-white cardHeader">
        <b-row no-gutters>
          <b-col cols="6">放射師個人工作量統計．查詢作業</b-col>
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
                placeholder="員工編號"
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
                placeholder="員工姓名"
                :showClearButton="true"
                @keyup.enter="onFilter"
              />
            </b-col>
            <b-col
              sm="3"
              class="px-1"
              style="padding: 12px; text-align: center;"
            >
              <b-form-radio-group
                v-model="Tab"
                class="pt-2 pl-2 rounded-right"
              >
                <b-form-radio value="day">依日期區間</b-form-radio>
                <b-form-radio value="year">依年度</b-form-radio>
              </b-form-radio-group>
            </b-col>
            <b-col
              sm="3"
              class="px-1"
            >
              <div v-show="Tab == 'day'">
                <ejs-daterangepicker
                  floatLabelType="Always"
                  placeholder="匯出日期區間"
                  v-model="DateRange"
                  :allowEdit="false"
                  :showClearButton="false"
                ></ejs-daterangepicker>
              </div>
              <div v-show="Tab == 'year'">
                <ejs-dropdownlist
                  :dataSource="years"
                  v-model="Year"
                  floatLabelType="Always"
                  placeholder="匯出年份"
                ></ejs-dropdownlist>
              </div>
            </b-col>
          </b-row>
          <b-row no-gutters>
            <!-- <b-col sm="2" class="px-1">
              <ejs-dropdownlist
                v-model="StaffType"
                :dataSource="staffTypes"
                :fields="{ text: 'Name', value: 'No' }"
                floatLabelType="Always"
                placeholder="職務"
                :showClearButton="true"
              ></ejs-dropdownlist>
            </b-col>
            <b-col sm="2" class="px-1">
              <ejs-dropdownlist
                v-model="StaffStatus"
                :dataSource="staffStatusType"
                :fields="{ text: 'Name', value: 'No' }"
                floatLabelType="Always"
                placeholder="員工狀態"
                :showClearButton="true"
              ></ejs-dropdownlist>
            </b-col> -->
            <b-col
              class="px-2 text-right"
              style="display: table; height: 60px;"
            >
              <div style="display: table-cell; vertical-align: middle">
                <b-button
                  variant="success"
                  @click="onClear"
                >
                  <font-awesome-icon icon="eraser" /> 清除</b-button>&nbsp;
                <b-button
                  variant="primary"
                  @click="onFilter"
                >
                  <font-awesome-icon icon="search" /> 查詢</b-button>&nbsp;
                <b-button
                  variant="primary"
                  @click="onExport"
                >
                  <font-awesome-icon icon="file-excel" /> 匯出 Excel檔</b-button>
              </div>
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
import { TextBoxPlugin } from "@syncfusion/ej2-vue-inputs";
import { DateRangePickerPlugin } from "@syncfusion/ej2-vue-calendars";
import DateHelper from "@/library/DateHelper";

Vue.use(TextBoxPlugin);
Vue.use(DropDownListPlugin);
Vue.use(DateRangePickerPlugin);

export default {
  props: ["staffStatusType", "staffTypes"],
  data () {
    return {
      years: [2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030],
      Year: new Date().getFullYear(),
      No: "",
      Name: "",
      StaffStatus: null,
      StaffType: null,
      DateRange: [DateHelper.getPrevMonthFirst(), DateHelper.getPrevMonthLast()],
      Tab: "day"
    };
  },
  methods: {
    onExport: function () {
      this.$emit("export", this);
    },
    onFilter: function () {
      this.$emit("filter", this);
    },
    onClear: function () {
      this.No = "";
      this.Name = "";
      this.StaffStatus = null;
      this.StaffType = null;
      this.Tab = "day";
      this.DateRange = [DateHelper.getPrevMonthFirst(), DateHelper.getPrevMonthLast()];
      this.Year = new Date().getFullYear();

      this.$emit("filterClear", this);
    }
  },
  created: function () { },
  computed: {
    ...mapGetters(["getThemeColors"])
  }

};
</script>
