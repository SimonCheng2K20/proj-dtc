<template>
  <b-container fluid class="mt-1 px-1">
    <b-row no-gutters>
      <b-col sm="6">
        <b-card no-body class="mx-1">
          <b-card-header class="bg-primary text-white cardHeader">
            <b-row no-gutters>
              <b-col cols="6" class="float-left text-left">帳號資料</b-col>
            </b-row>
          </b-card-header>
          <b-card-text class="text-left py-1">
            <b-container fluid class="px-1">
              <b-row no-gutters>
                <div formGroup="userForm">
                  <div class="form-row row">
                    <div class="form-group col-md-12">
                      <ejs-textbox
                        ref="No"
                        id="No"
                        name="No"
                        v-model="data.No"
                        type="text"
                        floatLabelType="Always"
                        :enabled="data.isAdd"
                        placeholder="帳號"
                      ></ejs-textbox>
                    </div>
                  </div>
                  <div class="form-row row">
                    <div class="form-group col-md-12">
                      <ejs-dropdownlist
                        id="Type"
                        name="Type"
                        floatLabelType="Always"
                        placeholder="帳號類別"
                        :fields="{ text: 'Name', value: 'No' }"
                        v-model="data.Type"
                      ></ejs-dropdownlist>
                    </div>
                  </div>
                  <div class="form-row row">
                    <div class="form-group col-md-12">
                      <ejs-dropdownlist
                        id="Status"
                        name="Status"
                        floatLabelType="Always"
                        placeholder="帳號狀態"
                        :fields="{ text: 'Name', value: 'No' }"
                        v-model="data.Status"
                      ></ejs-dropdownlist>
                    </div>
                  </div>
                </div>
              </b-row>
            </b-container>
          </b-card-text>
        </b-card>
      </b-col>
      <b-col sm="6">
        <b-card no-body class="mx-1">
          <b-card-header class="bg-primary text-white cardHeader">
            <b-row no-gutters>
              <b-col cols="6" class="float-left text-left">授權角色</b-col>
            </b-row>
          </b-card-header>
          <b-card-text class="text-left py-1">
            <ejs-listbox
              id="RoleNos"
              name="RoleNos"
              :selectionSettings="{ mode: 'Multiple', showCheckbox: true }"
              :fields="{ text: 'Name', value: 'No' }"
              v-model="data.RoleNos"
            ></ejs-listbox>
          </b-card-text>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import Vue from "vue";
import { ListBoxPlugin, CheckBoxSelection, DropDownListPlugin } from "@syncfusion/ej2-vue-dropdowns";

// import { CheckBoxPlugin } from "@syncfusion/ej2-vue-buttons";
import { TextBoxPlugin, MaskedTextBoxPlugin } from "@syncfusion/ej2-vue-inputs";
// import { DatePickerPlugin } from "@syncfusion/ej2-vue-calendars";

Vue.use(ListBoxPlugin);
Vue.use(DropDownListPlugin);
Vue.use(TextBoxPlugin);
Vue.use(MaskedTextBoxPlugin);
// Vue.use(CheckBoxPlugin);
// Vue.use(DatePickerPlugin);

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
  mounted() {
    // Set initail Focus
    if (this.data.isAdd) {
      this.data.No = "";
      // this.$refs.No.focus();
    } else {
      // this.$refs.Name.focus();
    }
  }
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
