<template>
  <b-container fluid class="mt-1 px-0">
    <b-row no-gutters>
      <b-col>
        <ejs-textbox ref="No" id="No" name="No" v-model="data.No" type="text" floatLabelType="Always" placeholder="科別代碼"></ejs-textbox>
      </b-col>
    </b-row>
    <b-row no-gutters>
      <b-col>
        <ejs-textbox ref="Name" id="Name" name="Name" v-model="data.Name" type="text" floatLabelType="Always" placeholder="科別名稱"></ejs-textbox>
      </b-col>
    </b-row>
    <b-row no-gutters>
      <b-col>
        <ejs-dropdownlist
          ref="ParentInstitutionId"
          id="ParentInstitutionId"
          name="ParentInstitutionId"
          floatLabelType="Always"
          placeholder="隸屬科室"
          :fields="{ text: 'Name', value: 'Id' }"
          v-model="data.ParentInstitutionId"
        ></ejs-dropdownlist>
      </b-col>
    </b-row>
    <b-row no-gutters>
      <b-col>
        <ejs-checkbox label="啟用" id="IsActive" name="IsActive" :checked="data.IsActive"></ejs-checkbox>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Vue from "vue";
import { ListBoxPlugin, CheckBoxSelection, DropDownListPlugin } from "@syncfusion/ej2-vue-dropdowns";
import { CheckBoxPlugin } from "@syncfusion/ej2-vue-buttons";
import { TextBoxPlugin } from "@syncfusion/ej2-vue-inputs";

Vue.use(ListBoxPlugin);
Vue.use(DropDownListPlugin);
Vue.use(TextBoxPlugin);
Vue.use(CheckBoxPlugin);

export default {
  data() {
    return {
      data: {},
    };
  },
  provide: {
    // Injecting CheckBoxSelection module
    listbox: [CheckBoxSelection],
  },
  mounted() {},
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
