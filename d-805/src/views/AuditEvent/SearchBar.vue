<template>
  <div class="control-section accordion-control-section">
    <b-card
      bg-variant="transparent"
      no-body
      class="mx-1"
    >
      <b-card-header class="bg-primary text-white cardHeader">
        <b-row no-gutters>
          <b-col cols="6">稽核記錄．查詢作業</b-col>
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
              <ejs-daterangepicker
                v-model="CreateTime"
                floatLabelType="Always"
                placeholder="記錄時間"
                :showClearButton="true"
                @keyup.enter="onFilter"
              ></ejs-daterangepicker>
            </b-col>
            <b-col sm="2" class="px-1">
              <ejs-dropdownlist
                v-model="EventType"
                :dataSource="auditEventTypes"
                :fields="{ text: 'Name', value: 'Id' }"
                floatLabelType="Always"
                placeholder="記錄類型"
                :showClearButton="true"
              ></ejs-dropdownlist>
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <ejs-textbox
                v-model="ProcessStack"
                floatLabelType="Always"
                placeholder="執行動作"
                :showClearButton="true"
                @keyup.enter="onFilter"
              />
            </b-col>
            <b-col
              sm="6"
              class="px-1"
            >
              <ejs-textbox
                v-model="Data"
                floatLabelType="Always"
                placeholder="資料內容(多個關鍵字以;分隔)"
                :showClearButton="true"
                @keyup.enter="onFilter"
              />
            </b-col>
          </b-row>
          <b-row no-gutters>
            <b-col
              sm="2"
              class="px-1"
            >
              <ejs-textbox
                v-model="Account"
                floatLabelType="Always"
                placeholder="使用者代碼"
                :showClearButton="true"
                @keyup.enter="onFilter"
              />
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <ejs-textbox
                v-model="HostAddress"
                floatLabelType="Always"
                placeholder="用戶端IP"
                :showClearButton="true"
                @keyup.enter="onFilter"
              />
            </b-col>
            <b-col
              sm="2"
              class="px-1"
            >
              <ejs-textbox
                v-model="Key"
                floatLabelType="Always"
                placeholder="資料主代碼"
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
                <font-awesome-icon icon="eraser" />清除 </b-button>&nbsp;
              <b-button
                variant="primary"
                @click="onFilter"
              >
                <font-awesome-icon icon="search" />查詢 </b-button>
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
import { TextBoxPlugin } from "@syncfusion/ej2-vue-inputs";
import { DateRangePickerPlugin } from "@syncfusion/ej2-vue-calendars";
import { mapGetters } from "vuex";

Vue.use(TextBoxPlugin);
Vue.use(DropDownListPlugin);
Vue.use(DateRangePickerPlugin);

export default {
  props: ["auditEventTypes"],
  data () {
    return {
      CreateTime: null,
      EventType: null,
      Account: "",
      AccountName: "",
      HostAddress: "",
      ProcessStack: "",
      Data: "",
      Key: ""
    };
  },
  methods: {
    onFilter: function () {
      this.$emit("filter", this);
    },
    onClear: function () {
      this.CreateTime = null;
      this.EventType = null;
      this.Account = "";
      this.AccountName = "";
      this.HostAddress = "";
      this.ProcessStack = "";
      this.Data = "";
      this.Key = "";

      this.$emit("filterClear", this);
    }
  },
  computed: {
    ...mapGetters(["getThemeColors"])
  }
};
</script>
