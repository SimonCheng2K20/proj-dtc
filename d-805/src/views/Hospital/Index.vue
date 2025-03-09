<template>
  <div class="pageLeftContent pb-1">
    <searchBar @filter="grdHospital_filter" @filterClear="grdHospital_filterClear" :organizationTypes="organizationTypes"></searchBar>
    <b-container fluid class="mt-1 px-1">
      <ejs-grid
        ref="grdHospital"
        :dataSource="dsHospital"
        :allowPaging="true"
        :allowSorting="true"
        :allowResizing="true"
        :allowTextWrap="true"
        :pageSettings="pageSettings"
        :editSettings="editSettings"
        :toolbar="toolbar"
        :allowFiltering="true"
        :filterSettings="{ type: 'CheckBox' }"
        :detailTemplate="DetailDoctor"
        :actionComplete="actionComplete"
        :actionFailure="actionFailure"
      >
        <e-columns>
          <e-column field="Id" :isPrimaryKey="true" headerText="ID" width="160" :visible="false"></e-column>
          <e-column
            id="OrganizationType"
            name="OrganizationType"
            field="OrganizationType"
            headerText="組織類別"
            :dataSource="organizationTypes"
            foreignKeyValue="Name"
            foreignKeyField="No"
            :validationRules="{ required: true }"
          ></e-column>
          <!-- <e-column field="No" :isPrimaryKey="true" headerText="檢查室代碼" width="160" :validationRules="{ required: true }"></e-column> -->
          <e-column field="Name" headerText="醫院名稱" :validationRules="{ required: true }"></e-column>
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
import Vue from "vue";
import { mapGetters } from "vuex";
import Swal from "sweetalert2";
import { DataManager, WebApiAdaptor } from "@syncfusion/ej2-data";
import { GridPlugin, ForeignKey, Page, Sort, Edit, Toolbar, Filter, Resize, CommandColumn, DetailRow } from "@syncfusion/ej2-vue-grids";
import * as configs from "@/config";
import searchBar from "./SearchBar";
import Common from "@/library/Common";
import DetailDoctor from "./DetailDoctor";

Vue.use(GridPlugin);

export default {
  data() {
    return {
      dsHospital: new DataManager({
        url: configs.publicPath + "../api/Hospital",
        adaptor: new WebApiAdaptor(),
        crossDomain: true,
      }),
      organizationTypes: [
        // { No: "DPT", Name: "科室" },
        { No: "RMDI", Name: "轉診醫院" },
        { No: "TMDI", Name: "轉檢醫院" },
      ],
      pageSettings: {
        pageSizes: true,
        pageSize: 10,
      },
      editSettings: {
        allowEditing: true,
        allowAdding: true,
        allowDeleting: false,
        mode: "Dialog",
        showConfirmDialog: true,
      },
      commands: [
        {
          type: "Edit",
          buttonOption: {
            iconCss: " e-icons e-edit",
            cssClass: "e-flat",
          },
        },
      ],
      DetailDoctor: function() {
        return { template: DetailDoctor };
      },
      filterSettings: { type: "Menu" },
      toolbar: ["Add"],
      requiredRules: {
        required: true,
      },
    };
  },
  computed: {
    ...mapGetters(["getThemeColors"]),
  },
  provide: {
    grid: [ForeignKey, Page, Sort, Edit, Toolbar, Filter, Resize, CommandColumn, DetailRow],
  },
  components: {
    searchBar,
  },
  methods: {
    aliasCheck: function(args) {
      if (args.element.disabled) return true;
      return !this.dsHospital.dataSource.json.find((item) => item._alias == args.value);
    },
    grdHospital_filter: function(e) {
      //startsWith, endsWith, contains, equal, notEqual, greaterThan, greaterThanOrEqual, lessThan, lessThanOrEqual
      if (e.Name != "") this.$refs.grdHospital.filterByColumn("Name", "contains", e.Name);
      else this.$refs.grdHospital.ej2Instances.removeFilteredColsByField("Name");
      if (e.OrganizationType != null) this.$refs.grdHospital.filterByColumn("OrganizationType", "equal", e.OrganizationType);
      else this.$refs.grdHospital.ej2Instances.removeFilteredColsByField("OrganizationType");
      if (e.IsActive != "") this.$refs.grdHospital.filterByColumn("IsActive", "equal", e.IsActive === "Y");
      else this.$refs.grdHospital.ej2Instances.removeFilteredColsByField("IsActive");
    },
    grdHospital_filterClear: function() {
      this.$refs.grdHospital.clearFiltering();
    },
    actionComplete: function(args) {
      if (args.requestType === "beginEdit" || args.requestType === "add") {
        let dialog = args.dialog;
        window.$("div[role='dialog']").css("max-height", "");
        // change the header of the dialog
        if (args.requestType === "beginEdit") dialog.header = "編輯『" + args.rowData["No"] + "』";
        else {
          for (var i = 0; i < this.$refs.grdHospital.getColumns().length; i++) {
            if (this.$refs.grdHospital.getColumns()[i].field == "InstitutionId") {
              this.$refs.grdHospital.getColumns()[i].edit.obj.index = 0;
            }
          }
        }
      }
      if ((args.action == "edit" || args.action == "add") && args.requestType != "cancel")
        Swal.fire({
          type: "success",
          title: "儲存成功！",
          timer: 1500,
        });
    },
    actionFailure: function(args) {
      Common.actionFailure(args);
    },
  },
  created: function() {
    // window.axios.get("/institution/SelectList?getAll=true&showNo=true").then((e) => {
    //   this.departments = e.Items;
    // });
  },
};
</script>
<style></style>
