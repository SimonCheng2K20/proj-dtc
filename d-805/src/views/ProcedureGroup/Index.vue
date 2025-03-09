<template>
  <div class="pageLeftContent pb-1">
    <searchBar @filter="grdProcedureGroup_filter" @filterClear="grdProcedureGroup_filterClear" :checkCategories="checkCategories"></searchBar>
    <b-container fluid class="mt-1 px-1">
      <ejs-grid
        ref="grdProcedureGroup"
        :dataSource="dsProcedureGroup"
        :allowPaging="true"
        :allowSorting="true"
        :allowResizing="true"
        :allowTextWrap="true"
        :pageSettings="pageSettings"
        :editSettings="editSettings"
        :toolbar="toolbar"
        :allowFiltering="true"
        :filterSettings="{ type: 'CheckBox' }"
        :detailTemplate="DetailCheckItem"
        :actionBegin="actionBegin"
        :actionComplete="actionComplete"
        :actionFailure="actionFailure"
      >
        <e-columns>
          <e-column field="No" headerText="專長群組代碼" width="160" :isPrimaryKey="true" :validationRules="{ required: true }"></e-column>
          <e-column field="Name" headerText="專長群組名稱" :validationRules="{ required: true }"></e-column>
          <e-column field="Seq" headerText="排序" editType="numericedit" width="160" :validationRules="{ required: true }" :edit="numericParams"></e-column>
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
import { Browser } from "@syncfusion/ej2-base";
import Swal from "sweetalert2";
import { DataManager, WebApiAdaptor } from "@syncfusion/ej2-data";
import { GridPlugin, ForeignKey, Page, Sort, Edit, Toolbar, Filter, Resize, CommandColumn, DetailRow } from "@syncfusion/ej2-vue-grids";
import * as configs from "@/config";
import searchBar from "./SearchBar";
import DetailCheckItem from "./DetailCheckItem";
import Common from "../../library/Common";

Vue.use(GridPlugin);

export default {
  data() {
    return {
      dsProcedureGroup: new DataManager({
        url: configs.publicPath + "../api/ProcedureGroup",
        adaptor: new WebApiAdaptor(),
        crossDomain: true,
      }),
      checkCategories: [],
      numericParams: {
        params: {
          validateDecimalOnType: true,
          decimals: 1,
          format: "N",
        },
      },
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
      sortSettings: {
        columns: [{ field: "No" }],
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
      DetailCheckItem: function() {
        return { template: DetailCheckItem };
      },
      filterSettings: { type: "Menu" },
      currentEditKey: null,
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
    grdProcedureGroup_filter: function(e) {
      //startsWith, endsWith, contains, equal, notEqual, greaterThan, greaterThanOrEqual, lessThan, lessThanOrEqual
      if (e.No != "") this.$refs.grdProcedureGroup.filterByColumn("No", "contains", e.No);
      else this.$refs.grdProcedureGroup.ej2Instances.removeFilteredColsByField("No");
      if (e.Name != "") this.$refs.grdProcedureGroup.filterByColumn("Name", "contains", e.Name);
      else this.$refs.grdProcedureGroup.ej2Instances.removeFilteredColsByField("Name");
      if (e.IsActive != "") this.$refs.grdProcedureGroup.filterByColumn("IsActive", "equal", e.IsActive == "Y");
      else this.$refs.grdProcedureGroup.ej2Instances.removeFilteredColsByField("IsActive");
    },
    grdProcedureGroup_filterClear: function() {
      this.$refs.grdProcedureGroup.clearFiltering();
    },
    actionBegin: function(args) {
      if (args.requestType === "beginEdit") {
        this.currentEditKey = args.primaryKeyValue[0];
      }
    },
    actionComplete: function(args) {
      if (args.requestType === "beginEdit" || args.requestType === "add") {
        let dialog = args.dialog;
        window.$("div[role='dialog']").css("max-height", "");
        // change the header of the dialog
        if (args.requestType === "beginEdit") dialog.header = "編輯『" + args.rowData["No"] + "』";
        if (Browser.isDevice) {
          dialog.height = window.innerHeight - 90 + "px";
          dialog.dataBind();
        }
      }
      if ((args.action == "edit" || args.action == "add") && args.requestType != "cancel")
        Swal.fire({
          type: "success",
          title: "儲存成功！",
          timer: 1000,
        });
    },
    actionFailure: function(args) {
      Common.actionFailure(args);
    },
  },
};
</script>
<style></style>
