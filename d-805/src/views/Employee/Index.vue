<template>
  <div class="pageLeftContent pb-1">
    <searchBar
      @filter="grdEmployee_filter"
      @filterClear="grdEmployee_filterClear"
      :staffStatusType="staffStatusType"
      :staffTypes="staffTypes"
      :roles="dsRole"
      :departments="departmentsWithNo"
      :isInstitutionMultiselect="isInstitutionMultiselect"
    ></searchBar>
    <b-container fluid class="mt-1 px-1">
      <ejs-grid
        ref="grdEmployee"
        :dataSource="dsEmployee"
        allowPaging="true"
        allowSorting="true"
        :allowTextWrap="true"
        :pageSettings="pageSettings"
        :editSettings="editSettings"
        :toolbar="toolbar"
        :allowFiltering="true"
        :allowResizing="true"
        :filterSettings="{ type: 'CheckBox' }"
        :detailTemplate="isNeedDetailProcedureGroup ? DetailProcedureGroup : null"
        :actionBegin="actionBegin"
        :actionComplete="actionComplete"
        :actionFailure="actionFailure"
      >
        <e-columns>
          <e-column field="Id" :isPrimaryKey="true" :visible="false" :allowSearching="false"></e-column>
          <e-column
            v-if="isInstitutionMultiselect"
            field="InstitutionIds"
            headerText="隸屬科別"
            :dataSource="departmentsWithId"
            foreignKeyValue="Name"
            foreignKeyField="Id"
            :validationRules="{ required: true }"
            :formatter="InstitutionIdsFormatt"
          >
          </e-column>
          <e-column
            v-else
            field="InstitutionId"
            headerText="隸屬科別"
            :dataSource="departmentsWithId"
            foreignKeyValue="Name"
            foreignKeyField="Id"
            :validationRules="{ required: true }"
          >
          </e-column>
          <!-- <e-column
            field="NaturalPerson.PhoneNo4Residence"
            :visible="false"
          ></e-column> -->
          <!-- <e-column
            field="NaturalPerson.Sex"
            :visible="false"
          ></e-column> -->
          <e-column field="No" type="string" :isPrimaryKey="true" headerText="員工編號" width="120" :validationRules="{ required: true }"></e-column>
          <e-column field="Name" headerText="員工姓名" width="120" type="string" :validationRules="{ required: true }" :allowSearching="false"></e-column>
          <e-column
            field="Sex"
            headerText="性別"
            width="60"
            foreignKeyValue="Name"
            foreignKeyField="No"
            :dataSource="sexs"
            :allowResizing="false"
            :validationRules="{ required: true }"
          ></e-column>
          <e-column field="PhoneNo" headerText="手機號碼" width="120" type="string"></e-column>
          <e-column field="Email" headerText="電子郵件" width="120" type="string"></e-column>
          <e-column
            field="StaffType"
            headerText="職務"
            width="100"
            foreignKeyValue="Name"
            foreignKeyField="No"
            :dataSource="staffTypes"
            allowSearching
            :validationRules="{ required: true }"
          ></e-column>
          <e-column
            field="MDLicenseNo"
            type="string"
            :isPrimaryKey="true"
            headerText="執業執照號碼"
            width="120"
            :allowSorting="false"
            :allowSearching="false"
            :allowFiltering="false"
          ></e-column>
          <e-column
            field="MDPId"
            type="string"
            :isPrimaryKey="true"
            headerText="醫事人員編號"
            width="120"
            :allowSorting="false"
            :allowSearching="false"
            :allowFiltering="false"
          ></e-column>
          <e-column
            field="StaffStatus"
            headerText="員工狀態"
            width="100"
            :allowResizing="false"
            foreignKeyValue="Name"
            foreignKeyField="No"
            :dataSource="staffStatusType"
            :validationRules="{ required: true }"
          ></e-column>
          <!-- <e-column
            field="RoleNames"
            headerText="授權角色"
            :allowSorting="false"
            :allowSearching="false"
            :allowFiltering="false"
          ></e-column> -->
          <!-- <e-column
            field="NaturalPerson.Birthday"
            headerText="出生日期"
            headerTextAlign="center"
            :format="{ type: 'date', format: 'yyyy/MM/dd' }"
            width="100"
            :allowSorting="false"
            :allowSearching="false"
            :allowFiltering="false"
          ></e-column> -->
          <e-column
            field="IsActive"
            headerText="啟用"
            width="70"
            textAlign="Center"
            type="boolean"
            displayAsCheckBox="true"
            editType="booleanedit"
            :allowResizing="false"
          ></e-column>
          <e-column headerText :commands="commands" width="50" :allowResizing="false"></e-column>
        </e-columns>
      </ejs-grid>
    </b-container>
  </div>
</template>

<script>
import Vue from 'vue'
import { mapGetters } from 'vuex'
import Swal from 'sweetalert2'
import { GridPlugin, Page, Sort, Edit, Toolbar, Filter, Resize, ForeignKey, CommandColumn, DetailRow } from '@syncfusion/ej2-vue-grids'
import { DataManager, WebApiAdaptor } from '@syncfusion/ej2-data'
import * as configs from '@/config'
import searchBar from './SearchBar'
import DialogTemplate from './DialogTemplate'
import DetailProcedureGroup from './DetailProcedureGroup'
import Common from '@/library/Common'

Vue.use(GridPlugin)

export default {
  data() {
    return {
      url: configs.publicPath + '../api/Employee',

      staffTypes: [],
      staffStatusType: [],
      sexs: [],
      dsRole: [],
      departmentsWithId: [],
      departmentsWithNo: [],
      pageSettings: { pageSizes: true, pageSize: 10 },
      editSettings: {
        allowEditing: true,
        allowAdding: true,
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
          // },
          // {
          //   type: "Delete",
          //   buttonOption: {
          //     iconCss: " e-icons e-delete",
          //     cssClass: "e-flat"
          //   }
        },
      ],
      DetailProcedureGroup: function () {
        return { template: DetailProcedureGroup }
      },
      isNeedDetailProcedureGroup: JSON.parse(process.env.VUE_APP_EMPLOYEE_IS_NEED_DetailProcedureGroup),
      toolbar: ['Add'],
      isInstitutionMultiselect: JSON.parse(process.env.VUE_APP_EMPLOYEE_IS_INSTITUTUION_MULTI),
    }
  },
  computed: {
    ...mapGetters(['getThemeColors']),
    dsEmployee() {
      return new DataManager({
        url: this.url,
        adaptor: new WebApiAdaptor(),
        crossDomain: true,
      })
    },
  },
  provide: {
    grid: [Page, Sort, Edit, Toolbar, Filter, Resize, ForeignKey, CommandColumn, DetailRow],
  },
  components: {
    searchBar,
  },
  methods: {
    grdEmployee_filter(e) {
      //startsWith, endsWith, contains, equal, notEqual, greaterThan, greaterThanOrEqual, lessThan, lessThanOrEqual

      if (e.StuffDepartment) {
        this.url = configs.publicPath + '../api/Employee' + this.setUrlParams(e)
      } else {
        this.url = configs.publicPath + '../api/Employee'
      }

      if (e.No) this.$refs.grdEmployee.filterByColumn('No', 'contains', e.No)
      else this.$refs.grdEmployee.ej2Instances.removeFilteredColsByField('No')

      if (e.Name) this.$refs.grdEmployee.filterByColumn('Name', 'contains', e.Name)
      else this.$refs.grdEmployee.ej2Instances.removeFilteredColsByField('Name')

      if (e.StaffType) this.$refs.grdEmployee.filterByColumn('StaffType', 'equal', e.StaffType)
      else this.$refs.grdEmployee.ej2Instances.removeFilteredColsByField('StaffType')

      if (e.StaffStatus) this.$refs.grdEmployee.filterByColumn('StaffStatus', 'equal', e.StaffStatus)
      else this.$refs.grdEmployee.ej2Instances.removeFilteredColsByField('StaffStatus')

      if (e.IsActive) this.$refs.grdEmployee.filterByColumn('IsActive', 'equal', e.IsActive == 'true')
      else this.$refs.grdEmployee.ej2Instances.removeFilteredColsByField('IsActive')
    },
    setUrlParams: function (e) {
      return `?institutionNo=${e.StuffDepartment}`
    },

    grdEmployee_filterClear(e) {
      if (e.StuffDepartment) {
        this.url = configs.publicPath + '../api/Employee' + this.setUrlParams(e)
      } else {
        this.url = configs.publicPath + '../api/Employee'
      }

      this.$refs.grdEmployee.clearFiltering()
    },
    async actionBegin(args) {
      if (args.requestType === 'save') {
        args.data.RoleNos = args.form.querySelector('#RoleNos').ej2_instances[0].value
        args.data.InstitutionIds = args.form.querySelector('#InstitutionIds').ej2_instances[0].value

        args.data.MedicalSpeciaList = JSON.parse(args.form.querySelector('#medicalSpecList').value)
          .map((ms) => ({
            MdLicenseNo: ms.MdLicenseNo,
            MdLicenseIssueDate: ms.MdLicenseIssueDate,
          }))
          .filter((ms) => ms.MdLicenseNo && ms.MdLicenseIssueDate)
        // console.log(args.data.MedicalSpeciaList);
        // alert( [...args.data.MedicalSpeciaList].map( ({MdLicenseNo}) => MdLicenseNo).join(','));
      }
    },
    InstitutionIdsFormatt(column, row) {
      if (row.InstitutionIds) {
        return row.InstitutionIds.map((id) => {
          const item = this.departmentsWithId.find((item) => item.Id === id)
          if (item) return item.Name
          else return ''
        }).join(',')
      } else {
        return row.InstitutionIds
      }
    },
    actionComplete: function (args) {
      if (args.requestType === 'beginEdit' || args.requestType === 'add') {
        let dialog = args.dialog
        window.$("div[role='dialog']").css('max-height', '')
        // change the header of the dialog
        if (args.requestType === 'beginEdit') dialog.header = '編輯『' + args.rowData['No'] + '』'
        dialog.element.querySelector('#RoleNos').ej2_instances[0].dataSource = this.dsRole

        dialog.element.querySelector('#StaffType').ej2_instances[0].dataSource = this.staffTypes

        dialog.element.querySelector('#StaffStatus').ej2_instances[0].dataSource = this.staffStatusType
        if (this.isInstitutionMultiselect) {
          dialog.element.querySelector('#InstitutionIds').ej2_instances[0].dataSource = this.departmentsWithId
        } else {
          dialog.element.querySelector('#InstitutionId').ej2_instances[0].dataSource = this.departmentsWithId
        }
        dialog.element.querySelector('#Sex').ej2_instances[0].dataSource = this.sexs

        if (args.requestType === 'add') {
          dialog.element.querySelector('#StaffType').ej2_instances[0].index = 0
          dialog.element.querySelector('#StaffStatus').ej2_instances[0].index = 0
          dialog.element.querySelector('#Sex').ej2_instances[0].index = 0
        }
      }
      if ((args.action == 'edit' || args.action == 'add') && args.requestType != 'cancel') {
        this.$refs.grdEmployee.refresh()
        Swal.fire({
          type: 'success',
          title: '儲存成功！',
          timer: 1000,
        })
      }
    },
    actionFailure: function (args) {
      Common.actionFailure(args)
    },
  },
  created: function () {
    window.axios.get('/institution/SelectList?getAll=true&showNo=true').then((e) => {
      this.departmentsWithId = e.Items
    })
    window.axios.get('/institution/SelectNoList?getAll=true').then((e) => {
      this.departmentsWithNo = e.Items
    })
    window.axios.get('/role/SelectList').then((e) => {
      if (e != null) {
        this.dsRole = e.Items
      }
    })
    window.axios.get('/GeneralData/SelectNoList?groupNo=StaffType').then((e) => {
      if (e != null) {
        this.staffTypes = e.Items
      }
    })
    window.axios.get('/GeneralData/SelectNoList?groupNo=StaffStatus').then((e) => {
      if (e != null) {
        this.staffStatusType = e.Items
      }
    })
    window.axios.get('/GeneralData/SelectNoList?groupNo=Sex').then((e) => {
      if (e != null) {
        this.sexs = e.Items
      }
    })
  },
}
</script>
