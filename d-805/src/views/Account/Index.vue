<template>
  <div class="pageLeftContent pb-1">
    <searchBar @filter="grdAccount_filter" @filterClear="grdAccount_filterClear" :roles="dsRole" :accTypes="accTypes" :accStatus="accStatus"></searchBar>
    <b-container fluid class="mt-1 px-1">
      <ejs-grid
        ref="grdAccount"
        :dataSource="dsAccount"
        allowPaging="true"
        allowSorting="true"
        :allowTextWrap="true"
        :pageSettings="pageSettings"
        :editSettings="editSettings"
        :toolbar="toolbar"
        :allowFiltering="true"
        :allowResizing="true"
        :filterSettings="{ type: 'CheckBox' }"
        :actionBegin="actionBegin"
        :actionComplete="actionComplete"
        :actionFailure="actionFailure"
        :commandClick="resetPassword"
      >
        <e-columns>
          <e-column field="Id" :isPrimaryKey="true" :visible="false" :allowSearching="false"></e-column>
          <e-column field="No" type="string" :isPrimaryKey="true" headerText="系統帳號" width="120" :validationRules="{ required: true }"></e-column>
          <e-column field="Employee.Name" headerText="帳號對應員工" width="150"></e-column>
          <e-column
            field="Type"
            headerText="帳號類別"
            width="100"
            foreignKeyValue="Name"
            foreignKeyField="No"
            :dataSource="accTypes"
            :validationRules="{ required: true }"
          ></e-column>
          <e-column field="RoleNames" headerText="授權角色" :allowSorting="false" :allowSearching="false" :allowFiltering="false"></e-column>
          <e-column
            field="LastLoginTime"
            headerText="最後登入時間"
            headerTextAlign="center"
            :allowSearching="false"
            :format="{ type: 'dateTime', format: 'yyyy/MM/dd HH:mm' }"
            width="140"
          ></e-column>
          <!-- <e-column
            field="PasswordChangeTime"
            headerText="最後修改密碼時間"
            headerTextAlign="center"
            :allowSearching="false"
            :format="{ type: 'dateTime', format: 'yyyy/MM/dd HH:mm' }"
            width="180"
          ></e-column> -->
          <e-column
            field="Status"
            headerText="帳號狀態"
            width="100"
            foreignKeyValue="Name"
            foreignKeyField="No"
            :dataSource="accStatus"
            :validationRules="{ required: true }"
          ></e-column>
          <!-- <e-column
            field="IsActive"
            headerText="啟用"
            width="40"
            textAlign="Center"
            type="boolean"
            displayAsCheckBox="true"
            editType="booleanedit"
            :allowResizing="false"
          ></e-column> -->
          <e-column headerText :commands="commands" width="150" :allowResizing="false"></e-column>
        </e-columns>
      </ejs-grid>
    </b-container>
  </div>
</template>

<script>
import Vue from 'vue'
import Swal from 'sweetalert2'
import { GridPlugin, Page, Sort, Edit, Toolbar, Filter, Resize, ForeignKey, CommandColumn } from '@syncfusion/ej2-vue-grids'
import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data'
import * as configs from '@/config'
import searchBar from './SearchBar'
import DialogTemplate from './DialogTemplate'
import Common from '@/library/Common'
import { mapGetters } from 'vuex'

Vue.use(GridPlugin)

export default {
  data() {
    return {
      dsAccount: new DataManager({
        url: configs.publicPath + '../api/Account',
        adaptor: new WebApiAdaptor(),
        crossDomain: true,
      }),
      dsRole: [],
      accTypes: [],
      accStatus: [],
      pageSettings: { pageSizes: true, pageSize: 10 },
      editSettings: {
        allowEditing: true,
        allowAdding: true,
        allowDeleting: true,
        mode: 'Dialog',
        showDeleteConfirmDialog: true,
        template: function () {
          return { template: DialogTemplate }
        },
      },
      commands: [
        {
          type: 'Edit',
          buttonOption: {
            iconCss: ' e-icons e-edit',
            cssClass: 'e-flat',
          },
        },
        {
          type: 'resetPassword',
          buttonOption: { content: '重置密碼', cssClass: 'e-flat' },
        },
        // {
        //   type: "Delete",
        //   buttonOption: {
        //     iconCss: " e-icons e-delete",
        //     cssClass: "e-flat"
        //   }
        // }
      ],
      toolbar: ['Add'],
    }
  },
  provide: {
    grid: [Page, Sort, Edit, Toolbar, Filter, Resize, ForeignKey, CommandColumn],
  },
  computed: {
    ...mapGetters(['getThemeColors']),
  },
  components: {
    searchBar,
  },
  methods: {
    grdAccount_filter: function (e) {
      //startsWith, endsWith, contains, equal, notEqual, greaterThan, greaterThanOrEqual, lessThan, lessThanOrEqual
      if (e.No != '') this.$refs.grdAccount.filterByColumn('No', 'contains', e.No)
      else this.$refs.grdAccount.ej2Instances.removeFilteredColsByField('No')

      if (e.EmployeeName != '') this.$refs.grdAccount.filterByColumn('Employee.Name', 'contains', e.EmployeeName)
      else this.$refs.grdAccount.ej2Instances.removeFilteredColsByField('Employee.Name')

      if (e.Status != null) this.$refs.grdAccount.filterByColumn('Status', 'equal', e.Status)
      else this.$refs.grdAccount.ej2Instances.removeFilteredColsByField('Status')

      if (e.Type != null) this.$refs.grdAccount.filterByColumn('Type', 'equal', e.Type)
      else this.$refs.grdAccount.ej2Instances.removeFilteredColsByField('Type')
    },
    grdAccount_filterClear: function () {
      this.$refs.grdAccount.clearFiltering()
    },
    resetPassword: function (e) {
      if (e.target.title == '重置密碼')
        Swal.fire({
          type: 'question',
          title: '是否重置密碼？',
          showCancelButton: true,
          confirmButtonColor: '#20d320',
          cancelButtonColor: '#3085d6',
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          html: '密碼將重置為：<b>' + e.rowData.No + '</b>',
        })
          .then(function (d) {
            if (d.value) {
              window.axios.put('/auth/ResetPassword?userName=' + e.rowData.No).then(() => {})
              Swal.fire({
                type: 'success',
                title: '密碼重置成功！',
                timer: 1000,
              })
            }
          })
          .catch(function (error) {
            Swal.fire('密碼重置失敗！', error, 'error')
          })
    },
    actionBegin(args) {
      if (args.requestType === 'save') {
        args.data.RoleNos = args.form.querySelector('#RoleNos').ej2_instances[0].value
      }
    },
    actionComplete: function (args) {
      if (args.requestType === 'beginEdit' || args.requestType === 'add') {
        let dialog = args.dialog
        window.$("div[role='dialog']").css('max-height', '')
        // change the header of the dialog
        if (args.requestType === 'beginEdit') {
          dialog.header = '編輯『' + args.rowData['No']
          if (args.rowData.Employee) dialog.header += '(' + args.rowData.Employee.Name + ')'
          dialog.header += '』'
        }
        dialog.element.querySelector('#Type').ej2_instances[0].dataSource = this.accTypes
        dialog.element.querySelector('#Status').ej2_instances[0].dataSource = this.accStatus
        dialog.element.querySelector('#RoleNos').ej2_instances[0].dataSource = this.dsRole

        if (args.requestType === 'add') {
          dialog.element.querySelector('#Type').ej2_instances[0].index = 0
          dialog.element.querySelector('#Status').ej2_instances[0].index = 0
        }
      }
      if ((args.action == 'edit' || args.action == 'add') && args.requestType != 'cancel')
        Swal.fire({
          type: 'success',
          title: '儲存成功！',
          timer: 1000,
        })
    },
    actionFailure: function (args) {
      Common.actionFailure(args)
    },
  },
  created: function () {
    window.axios.get('/role/SelectList').then((e) => {
      if (e != null) {
        this.dsRole = e.Items
      }
    })
    window.axios.get('/GeneralData/SelectNoList?groupNo=AccType').then((e) => {
      if (e != null) {
        this.accTypes = e.Items
      }
    })
    window.axios.get('/GeneralData/SelectNoList?groupNo=AccStatus').then((e) => {
      if (e != null) {
        this.accStatus = e.Items
      }
    })
  },
}
</script>
