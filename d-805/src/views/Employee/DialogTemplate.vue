<template>
  <b-container class="mt-1 px-1" style="max-width: 800px;">
    <b-row no-gutters>
      <b-col sm="8">
        <b-card no-body class="mx-1">
          <b-card-header class="bg-primary text-white cardHeader">
            <b-row no-gutters>
              <b-col cols="6" class="float-left text-left">員工資料</b-col>
            </b-row>
          </b-card-header>
          <b-card-text class="text-left py-1">
            <b-container fluid class="px-1">
              <b-row no-gutters>
                <div formGroup="userForm">
                  <div class="form-row row">
                    <div class="form-group col-md-6 mb-1">
                      <ejs-textbox
                        ref="No"
                        id="No"
                        name="No"
                        v-model="data.No"
                        type="text"
                        floatLabelType="Always"
                        placeholder="員工編號"
                      ></ejs-textbox>
                    </div>
                    <div class="form-group col-md-6 mb-1">
                      <ejs-textbox
                        ref="Name"
                        id="Name"
                        name="Name"
                        v-model="data.Name"
                        type="text"
                        floatLabelType="Always"
                        placeholder="員工姓名"
                      ></ejs-textbox>
                    </div>
                  </div>
                  <div class="form-row row">
                    <div class="form-group col-md-6 mb-1">
                      <ejs-maskedtextbox
                        id="PhoneNo"
                        name="PhoneNo"
                        v-model="data.PhoneNo"
                        mask="0999-999999"
                        type="text"
                        floatLabelType="Always"
                        placeholder="手機號碼"
                      ></ejs-maskedtextbox>
                    </div>
                    <div class="form-group col-md-6 mb-1">
                      <ejs-textbox
                        ref="Email"
                        id="Email"
                        name="Email"
                        v-model="data.Email"
                        type="text"
                        floatLabelType="Always"
                        placeholder="電子郵件"
                      ></ejs-textbox>
                    </div>
                    <!-- <div class="form-group col-md-6">
                      <ejs-maskedtextbox
                        id="NaturalPerson___PhoneNo4Residence"
                        name="NaturalPerson___PhoneNo4Residence"
                        v-model="data.NaturalPerson.PhoneNo4Residence"
                        mask="(099)9999-9999"
                        type="text"
                        floatLabelType="Always"
                        placeholder="住家電話"
                      ></ejs-maskedtextbox>
                    </div> -->
                  </div>
                  <div class="form-row row">
                    <div class="form-group col-md-6 mb-1">
                      <div v-if="isInstitutionMultiselect">
                        <div style="font-weight: bold">隸屬科別</div>
                        <ejs-multiselect
                          id="InstitutionIds"
                          name="InstitutionIds"
                          placeholder="隸屬科別"
                          :fields="{ text: 'Name', value: 'Id' }"
                          :allowFiltering="true"
                          v-model="data.InstitutionIds"
                        ></ejs-multiselect>
                      </div>
                      <ejs-dropdownlist
                        v-else
                        id="InstitutionId"
                        name="InstitutionId"
                        floatLabelType="Always"
                        placeholder="隸屬科別"
                        :fields="{ text: 'Name', value: 'Id' }"
                        :allowFiltering="true"
                        v-model="data.InstitutionId"
                      ></ejs-dropdownlist>
                    </div>
                    <div class="form-group col-md-6 mb-1">
                      <ejs-dropdownlist
                        id="StaffType"
                        name="StaffType"
                        floatLabelType="Always"
                        placeholder="職務"
                        :fields="{ text: 'Name', value: 'No' }"
                        v-model="data.StaffType"
                      ></ejs-dropdownlist>
                    </div>
                  </div>
                  <div class="form-row row">
                    <div class="form-group col-md-6 mb-1">
                      <ejs-dropdownlist
                        id="StaffStatus"
                        name="StaffStatus"
                        floatLabelType="Always"
                        placeholder="員工狀態"
                        :fields="{ text: 'Name', value: 'No' }"
                        v-model="data.StaffStatus"
                      ></ejs-dropdownlist>
                    </div>
                    <div class="form-group col-md-6 mb-1">
                      <ejs-dropdownlist
                        id="Sex"
                        name="Sex"
                        floatLabelType="Always"
                        placeholder="性別"
                        :fields="{ text: 'Name', value: 'No' }"
                        v-model="data.Sex"
                      ></ejs-dropdownlist>
                      <div class="e-float-input">
                        <ejs-checkbox
                          label="啟用"
                          id="IsActive"
                          name="IsActive"
                          :checked="data.IsActive"
                        ></ejs-checkbox>
                        <span class="e-float-line"></span>
                      </div>
                    </div>
                  </div>
                </div>
              </b-row>
            </b-container>
          </b-card-text>
        </b-card>
        <b-card
          no-body
          class="mx-1 mt-2"
          style="height: 254px; overflow-y: auto"
        >
          <b-card-header class="bg-primary text-white cardHeader">
            <b-row no-gutters>
              <b-col cols="6" class="float-left text-left">醫師證照</b-col>
            </b-row>
          </b-card-header>
          <b-card-text class="text-left py-1">
            <b-container fluid class="px-1">
              <!-- MedicalSpeciaList -->
              <input
                type="hidden"
                id="medicalSpecList"
                :value="JSON.stringify(data.MedicalSpeciaList)"
              />
              <b-row
                no-gutters
                class="align-items-end"
                v-for="(ms, idx) in data.MedicalSpeciaList"
                :key="idx"
              >
                <b-col class="pr-1">
                  <ejs-textbox
                    v-model="ms.MdLicenseNo"
                    type="text"
                    floatLabelType="Always"
                    placeholder="證照號碼"
                  ></ejs-textbox>
                </b-col>
                <b-col class="px-1">
                  <label class="expireDate">到期日期</label>
                  <ejs-datepicker
                    name="expireDate"
                    format="yyyy-MM-dd"
                    placeholder="到期日期"
                    locale="zh-Hant"
                    v-model="ms.MdLicenseIssueDate"
                  />
                </b-col>
                <b-button
                  variant="danger"
                  @click="removeNewMedicalSpecialList(ms)"
                  size="sm"
                  >刪除</b-button
                >
              </b-row>
              <b-button
                class="mt-1"
                variant="primary"
                @click="addNewMedicalSpecialList"
                size="sm"
                >增加</b-button
              >
            </b-container>
          </b-card-text>
        </b-card>
      </b-col>
      <b-col sm="4">
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
              height="530"
              locale="zh-TW"
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
import {
  ListBoxPlugin,
  CheckBoxSelection,
  DropDownListPlugin,
  MultiSelectPlugin,
} from "@syncfusion/ej2-vue-dropdowns";
import { CheckBoxPlugin } from "@syncfusion/ej2-vue-buttons";
import { TextBoxPlugin, MaskedTextBoxPlugin } from "@syncfusion/ej2-vue-inputs";
import { DatePickerPlugin } from "@syncfusion/ej2-vue-calendars";

Vue.use(ListBoxPlugin);
Vue.use(DropDownListPlugin);
Vue.use(MultiSelectPlugin);

Vue.use(TextBoxPlugin);
Vue.use(MaskedTextBoxPlugin);
Vue.use(CheckBoxPlugin);
Vue.use(DatePickerPlugin);

export default {
  data() {
    return {
      data: {},
      isInstitutionMultiselect: JSON.parse(
        process.env.VUE_APP_EMPLOYEE_IS_INSTITUTUION_MULTI
      ),
      departments: [],
    };
  },
  provide: {
    // Injecting CheckBoxSelection module
    listbox: [CheckBoxSelection],
  },
  methods: {
    addNewMedicalSpecialList() {
      this.data.MedicalSpeciaList.push({
        uid: this.generatorUid(),
        MdLicenseNo: "",
        MdLicenseIssueDate: new Date(),
      });
    },
    removeNewMedicalSpecialList({ MdLicenseNo, uid }) {
      this.data.MedicalSpeciaList = this.data.MedicalSpeciaList.filter(
        (ms) => ms.uid !== uid
      );
    },
    generatorUid() {
      const s4 = () =>
        Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      return (
        s4() +
        s4() +
        "-" +
        s4() +
        "-" +
        s4() +
        "-" +
        s4() +
        "-" +
        s4() +
        s4() +
        s4()
      );
    },
  },
  created() {
    window.axios
      .get("/institution/SelectList?getAll=true&showNo=true")
      .then((e) => {
        this.departments = e.Items;
      });
  },
  mounted() {
    // console.log(this);
    // console.log(`this.data: `, this.data);

    // Set initail Focus
    if (this.data.isAdd) {
      this.data.No = "";
      this.data.MedicalSpeciaList = [];
      // this.$refs.No.focus();
    } else {
      if (
        this.data.MedicalSpeciaList &&
        this.data.MedicalSpeciaList.length > 0
      ) {
        this.data.MedicalSpeciaList = this.data.MedicalSpeciaList.map((ms) => ({
          ...ms,
          uid: this.generatorUid(),
        }));
      } else {
        this.data.MedicalSpeciaList = [];
      }
      // this.$refs.Name.focus();
    }

    // this.addNewMedicalSpecialList()
  },
};
</script>
<style scoped>
.col-md-6,
.col-md-3 {
  padding-right: 15px;
  padding-left: 15px;
  padding-top: 5px;
}
label.expireDate {
  margin: 0;
  font-weight: bold;
}
</style>
