<template>
  <b-container fluid class="mt-1 px-0">
    <b-row no-gutters>
      <b-col sm="6">
        <ejs-textbox
          ref="No"
          id="No"
          name="No"
          v-model="data.No"
          type="text"
          floatLabelType="Always"
          placeholder="病歷號"
        ></ejs-textbox>
      </b-col>
      <b-col sm="6">
        <ejs-textbox
          ref="Name"
          id="NaturalPerson___Name"
          name="NaturalPerson___Name"
          v-model="data.NaturalPerson.Name"
          type="text"
          floatLabelType="Always"
          placeholder="病患姓名"
        ></ejs-textbox>
      </b-col>
    </b-row>
    <b-row no-gutters>
      <b-col sm="6">
        <ejs-maskedtextbox
          ref="PhoneNo4Mobile"
          id="NaturalPerson___PhoneNo4Mobile"
          name="NaturalPerson___PhoneNo4Mobile"
          v-model="data.NaturalPerson.PhoneNo4Mobile"
          mask="0999-999999"
          type="text"
          floatLabelType="Always"
          placeholder="手機號碼"
        ></ejs-maskedtextbox>
      </b-col>
      <b-col sm="6">
        <ejs-maskedtextbox
          ref="PhoneNo4Residence"
          id="NaturalPerson___PhoneNo4Residence"
          name="NaturalPerson___PhoneNo4Residence"
          v-model="data.NaturalPerson.PhoneNo4Residence"
          mask="(099)9999-9999"
          type="text"
          floatLabelType="Always"
          placeholder="住家電話"
        ></ejs-maskedtextbox>
      </b-col>
    </b-row>
    <b-row no-gutters>
      <b-col sm="6">
        <ejs-dropdownlist
          ref="Confidentiality"
          id="Confidentiality"
          name="Confidentiality"
          floatLabelType="Always"
          placeholder="病患資料機密性"
          :fields="{ text: 'Name', value: 'No' }"
          v-model="data.Confidentiality"
        ></ejs-dropdownlist>
      </b-col>
      <b-col sm="6">
        <ejs-dropdownlist
          ref="PatientStatus"
          id="PatientStatus"
          name="PatientStatus"
          floatLabelType="Always"
          placeholder="病患狀態"
          :fields="{ text: 'Name', value: 'No' }"
          v-model="data.PatientStatus"
        ></ejs-dropdownlist>
      </b-col>
    </b-row>
    <b-row no-gutters>
      <b-col sm="6">
        <ejs-datepicker
          id="NaturalPerson___Birthday"
          name="NaturalPerson___Birthday"
          placeholder="出生日期"
          v-model="data.NaturalPerson.Birthday"
          floatLabelType="Always"
          :showTodayButton="false"
        ></ejs-datepicker>
      </b-col>
      <b-col sm="4">
        <ejs-dropdownlist
          ref="Sex"
          id="NaturalPerson___Sex"
          name="NaturalPerson___Sex"
          class="e-field"
          floatLabelType="Always"
          placeholder="性別"
          :fields="{ text: 'Name', value: 'No' }"
          v-model="data.NaturalPerson.Sex"
        ></ejs-dropdownlist>
      </b-col>
      <b-col sm="2">
        <div class="e-float-input text-right">
          <ejs-checkbox label="啟用" id="IsActive" name="IsActive" :checked="data.IsActive"></ejs-checkbox>
          <span class="e-float-line"></span>
        </div>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Vue from "vue";
import {
  ListBoxPlugin,
  CheckBoxSelection,
  DropDownListPlugin
} from "@syncfusion/ej2-vue-dropdowns";
import { CheckBoxPlugin } from "@syncfusion/ej2-vue-buttons";
import { TextBoxPlugin, MaskedTextBoxPlugin } from "@syncfusion/ej2-vue-inputs";
import { DatePickerPlugin } from "@syncfusion/ej2-vue-calendars";

Vue.use(DatePickerPlugin);
Vue.use(ListBoxPlugin);
Vue.use(DropDownListPlugin);
Vue.use(TextBoxPlugin);
Vue.use(MaskedTextBoxPlugin);
Vue.use(CheckBoxPlugin);

export default {
  data() {
    return {
      data: {}
    };
  },
  provide: {
    // Injecting CheckBoxSelection module
    listbox: [CheckBoxSelection]
  },
  mounted() {}
};
</script>
<style>
.col-md-6,
.col-md-3 {
  padding-right: 15px;
  padding-left: 15px;
  padding-top: 5px;
}
</style>
