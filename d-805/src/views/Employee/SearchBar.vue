<template>
  <div class="control-section accordion-control-section">
    <b-card no-body class="mx-1" bg-variant="transparent">
      <b-card-header class="bg-primary text-white cardHeader">
        <b-row no-gutters>
          <b-col cols="6">員工管理．查詢作業</b-col>
        </b-row>
      </b-card-header>
      <b-card-text class="text-left py-1">
        <b-container fluid class="px-1">
          <b-row no-gutters>
            <b-col sm="2" class="px-1">
              <ejs-textbox v-model="No" floatLabelType="Always" placeholder="員工編號" @keyup.enter="onFilter" :showClearButton="true" />
            </b-col>
            <b-col sm="2" class="px-1">
              <ejs-textbox v-model="Name" floatLabelType="Always" placeholder="員工姓名" :showClearButton="true" @keyup.enter="onFilter" />
            </b-col>
            <b-col sm="2" class="px-1">
              <ejs-dropdownlist
                v-model="StaffType"
                :dataSource="staffTypes"
                :fields="{ text: 'Name', value: 'No' }"
                floatLabelType="Always"
                placeholder="職務"
                :showClearButton="true"
              ></ejs-dropdownlist>
            </b-col>
          </b-row>
          <b-row no-gutters>
            <b-col sm="2" class="px-1">
              <ejs-dropdownlist
                v-model="StuffDepartment"
                :dataSource="departments"
                :fields="{ text: 'Name', value: 'No' }"
                floatLabelType="Always"
                placeholder="隸屬科別"
                :showClearButton="true"
                :allowFiltering="true"
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
            </b-col>
            <b-col sm="2" class="px-1" style="display: table; height: 60px">
              <div style="display: table-cell; vertical-align: middle">
                <b-form-radio-group v-model="IsActive" class="pt-2 pl-2 rounded-right">
                  <b-form-radio value="true">啟用</b-form-radio>
                  <b-form-radio value="false">未啟用</b-form-radio>
                  <!-- <b-form-radio value=null>啟用及未啟用</b-form-radio> -->
                </b-form-radio-group>
              </div>
            </b-col>
            <!-- <b-col sm="2" class="px-1">
              <ejs-dropdownlist
                v-model="RoleNo"
                :dataSource="roles"
                :fields="{ text: 'Name', value: 'No' }"
                floatLabelType="Always"
                placeholder="員工角色"
                :showClearButton="true"
              ></ejs-dropdownlist>
            </b-col> -->
            <b-col class="px-2 d-flex align-items-center justify-content-end" style="height: 60px">
              <b-button variant="primary" @click="onFilter"> <font-awesome-icon icon="search" /> 查詢</b-button>&nbsp;
              <b-button variant="secondary" @click="onClear"> <font-awesome-icon icon="eraser" /> 清除</b-button>
            </b-col>
          </b-row>
        </b-container>
      </b-card-text>
    </b-card>
  </div>
</template>
<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { DropDownListPlugin } from '@syncfusion/ej2-vue-dropdowns'
import { RadioButtonPlugin } from '@syncfusion/ej2-vue-buttons'
import { TextBoxPlugin } from '@syncfusion/ej2-vue-inputs'

Vue.use(TextBoxPlugin)
Vue.use(RadioButtonPlugin)
Vue.use(DropDownListPlugin)

export default {
  props: ['staffStatusType', 'staffTypes', 'roles', 'departments', 'isInstitutionMultiselect'],
  data() {
    return {
      No: null,
      Name: null,
      StaffStatus: null,
      StaffType: null,
      RoleNo: null,
      IsActive: null,
      StuffDepartment: null,
    }
  },
  methods: {
    onFilter: function () {
      this.$emit('filter', this)
    },
    onClear: function () {
      this.No = null
      this.Name = null
      this.StaffStatus = null
      this.StaffType = null
      this.RoleNo = null
      this.IsActive = null
      this.StuffDepartment = null

      this.$emit('filterClear', this)
    },
  },
  computed: {
    ...mapGetters(['getThemeColors']),
  },
}
</script>
