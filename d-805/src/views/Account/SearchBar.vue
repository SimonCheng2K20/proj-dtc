<template>
  <div class="control-section accordion-control-section">
    <b-card bg-variant="transparent" no-body class="mx-1">
      <b-card-header class="bg-primary text-white cardHeader">
        <b-row no-gutters>
          <b-col cols="6">系統帳號管理．查詢作業</b-col>
        </b-row>
      </b-card-header>
      <b-card-text class="text-left py-1">
        <b-container fluid class="px-1">
          <b-row no-gutters>
            <b-col sm="2" class="px-1">
              <ejs-textbox v-model="No" floatLabelType="Always" placeholder="系統帳號" @keyup.enter="onFilter" :showClearButton="true" />
            </b-col>
            <b-col sm="2" class="px-1">
              <ejs-textbox v-model="EmployeeName" floatLabelType="Always" placeholder="帳號對應員工" @keyup.enter="onFilter" :showClearButton="true" />
            </b-col>
            <b-col sm="2" class="px-1">
              <ejs-dropdownlist
                v-model="Type"
                :dataSource="accTypes"
                :fields="{ text: 'Name', value: 'No' }"
                floatLabelType="Always"
                placeholder="帳號類別"
                :showClearButton="true"
              ></ejs-dropdownlist>
            </b-col>
            <b-col sm="2" class="px-1">
              <ejs-dropdownlist
                v-model="Status"
                :dataSource="accStatus"
                :fields="{ text: 'Name', value: 'No' }"
                floatLabelType="Always"
                placeholder="帳號狀態"
                :showClearButton="true"
              ></ejs-dropdownlist>
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
              <b-button variant="success" @click="onClear"> <font-awesome-icon icon="eraser" /> 清除</b-button>&nbsp;
              <b-button variant="primary" @click="onFilter"> <font-awesome-icon icon="search" /> 查詢</b-button>
            </b-col>
          </b-row>
        </b-container>
      </b-card-text>
    </b-card>
  </div>
</template>
<script>
import Vue from 'vue'
import { DropDownListPlugin } from '@syncfusion/ej2-vue-dropdowns'
import { RadioButtonPlugin } from '@syncfusion/ej2-vue-buttons'
import { TextBoxPlugin } from '@syncfusion/ej2-vue-inputs'
import { mapGetters } from 'vuex'

Vue.use(TextBoxPlugin)
Vue.use(RadioButtonPlugin)
Vue.use(DropDownListPlugin)

export default {
  props: ['roles', 'accTypes', 'accStatus'],
  data() {
    return {
      No: '',
      EmployeeName: '',
      RoleNo: null,
      Type: null,
      Status: null,
    }
  },
  methods: {
    onFilter: function () {
      this.$emit('filter', this)
    },
    onClear: function () {
      this.No = ''
      this.EmployeeName = ''
      this.RoleNo = null
      this.Type = null
      this.Status = null

      this.$emit('filterClear', this)
    },
  },
  computed: {
    ...mapGetters(['getThemeColors']),
  },
}
</script>
