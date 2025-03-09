<template>
  <div class="pageLeftContent pb-1">
    <searchBar @filter="grdFunction_filter" @filterClear="grdFunction_filterClear"></searchBar>
    <b-container fluid class="mt-1 px-1">
      <ejs-grid
        ref="grdFunction"
        :dataSource="dsFunction"
        :allowPaging="true"
        :allowSorting="true"
        :allowResizing="true"
        :allowTextWrap="true"
        :pageSettings="pageSettings"
        :editSettings="editSettings"
        :toolbar="toolbar"
        :allowFiltering="true"
        :filterSettings="{ type: 'CheckBox' }"
        :actionComplete="actionComplete"
        :actionFailure="actionFailure"
      >
        <e-columns>
          <e-column field="Id" :isPrimaryKey="true" headerText="ID" width="160" :visible="false"></e-column>
          <e-column field="No" :isPrimaryKey="true" headerText="功能代碼" width="160" :validationRules="{ required: true }"></e-column>
          <e-column field="Name" headerText="功能名稱" :validationRules="{ required: true }"></e-column>
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
import { DataManager, WebApiAdaptor } from "@syncfusion/ej2-data";
import { GridPlugin, ForeignKey, Page, Sort, Edit, Toolbar, Filter, Resize, CommandColumn } from "@syncfusion/ej2-vue-grids";
import * as configs from "@/config";
import searchBar from "./SearchBar";
import Swal from "sweetalert2";
import Common from "@/library/Common";
import { mapGetters } from "vuex";

Vue.use(GridPlugin);

export default {
  data() {
    return {
      dsFunction: new DataManager({
        url: configs.publicPath + "../api/Function",
        adaptor: new WebApiAdaptor(),
        crossDomain: true,
      }),
      pageSettings: {
        pageSizes: true,
        pageSize: 10,
      },
      editSettings: {
        allowEditing: true,
        allowAdding: true,
        allowDeleting: true,
        mode: "Dialog",
        showConfirmDialog: true,
        showDeleteConfirmDialog: true,
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
        {
          type: "Delete",
          buttonOption: {
            iconCss: " e-icons e-delete",
            cssClass: "e-flat",
          },
        },
      ],
      filterSettings: { type: "Menu" },
      toolbar: ["Add"],
      requiredRules: {
        required: true,
      },
    };
  },
  provide: {
    grid: [ForeignKey, Page, Sort, Edit, Toolbar, Filter, Resize, CommandColumn],
  },
  computed: {
    ...mapGetters(["getThemeColors"]),
  },
  components: {
    searchBar,
  },
  methods: {
    grdFunction_filter: function(e) {
      //startsWith, endsWith, contains, equal, notEqual, greaterThan, greaterThanOrEqual, lessThan, lessThanOrEqual
      if (e.No != "") this.$refs.grdFunction.filterByColumn("No", "contains", e.No);
      else this.$refs.grdFunction.ej2Instances.removeFilteredColsByField("No");
      if (e.Name != "") this.$refs.grdFunction.filterByColumn("Name", "contains", e.Name);
      else this.$refs.grdFunction.ej2Instances.removeFilteredColsByField("Name");
      if (e.IsActive != "") this.$refs.grdFunction.filterByColumn("IsActive", "equal", e.IsActive == "Y");
      else this.$refs.grdFunction.ej2Instances.removeFilteredColsByField("IsActive");
    },
    grdFunction_filterClear: function() {
      this.$refs.grdFunction.clearFiltering();
    },
    actionComplete: function(args) {
      if (args.requestType === "beginEdit" || args.requestType === "add") {
        let dialog = args.dialog;
        window.$("div[role='dialog']").css("max-height", "");
        // change the header of the dialog
        if (args.requestType === "beginEdit") dialog.header = "編輯『" + args.rowData["No"] + "』";
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
};
</script>
<style></style>
