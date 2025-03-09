<template>
  <div class="pageLeftContent pb-1">
    <searchBar @filter="grdRole_filter" @filterClear="grdRole_filterClear" class="mb-1"></searchBar>
    <ejs-grid
      ref="grdRole"
      :dataSource="dsRole"
      :allowPaging="true"
      :allowSorting="true"
      :allowResizing="true"
      :allowTextWrap="true"
      :pageSettings="pageSettings"
      :editSettings="editSettings"
      :toolbar="['Add']"
      :allowFiltering="true"
      :filterSettings="{ type: 'CheckBox' }"
      :sortSettings="{ columns: [{ field: 'No' }] }"
      :detailTemplate="Detail"
      :actionComplete="actionComplete"
      :actionFailure="actionFailure"
    >
      <e-columns>
        <e-column field="No" :isPrimaryKey="true" headerText="角色代碼" width="120" :validationRules="{ required: true }"></e-column>
        <e-column field="Name" headerText="角色名稱" :validationRules="{ required: true }"></e-column>
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
  </div>
</template>
<script>
import Vue from "vue";
import { Browser } from "@syncfusion/ej2-base";
import { DataManager, WebApiAdaptor } from "@syncfusion/ej2-data";
import { GridPlugin, Page, Sort, Edit, Toolbar, Filter, ForeignKey, Resize, CommandColumn, DetailRow } from "@syncfusion/ej2-vue-grids";
import * as configs from "@/config";
import searchBar from "./SearchBar";
import Detail from "./Detail";
import Swal from "sweetalert2";
import Common from "../../library/Common";
import { mapGetters } from "vuex";

Vue.use(GridPlugin);

export default {
  data() {
    return {
      dsRole: new DataManager({
        url: configs.publicPath + "../api/Role",
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
      commands: [
        {
          type: "Edit",
          buttonOption: {
            iconCss: " e-icons e-edit",
            cssClass: "e-flat",
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
      Detail: function() {
        return { template: Detail };
      },
    };
  },
  computed: {
    ...mapGetters(["getThemeColors"]),
  },
  provide: {
    grid: [Page, Sort, Edit, Toolbar, Filter, Resize, CommandColumn, ForeignKey, DetailRow],
  },
  components: {
    searchBar,
  },
  methods: {
    grdRole_filter: function(e) {
      //startsWith, endsWith, contains, equal, notEqual, greaterThan, greaterThanOrEqual, lessThan, lessThanOrEqual
      if (e.No != null) this.$refs.grdRole.filterByColumn("No", "contains", e.No);
      else this.$refs.grdRole.ej2Instances.removeFilteredColsByField("No");
      if (e.Name != null) this.$refs.grdRole.filterByColumn("Name", "contains", e.Name);
      else this.$refs.grdRole.ej2Instances.removeFilteredColsByField("Name");
      if (e.IsActive != "") this.$refs.grdRole.filterByColumn("IsActive", "equal", e.IsActive == "Y");
      else this.$refs.grdRole.ej2Instances.removeFilteredColsByField("IsActive");
    },
    grdRole_filterClear: function() {
      this.$refs.grdRole.clearFiltering();
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
          timer: 1500,
        });
    },
    actionFailure: function(args) {
      Common.actionFailure(args);
    },
  },
};
</script>
<style>
/* .e-grid {
    min-height: 518px;
  } */
</style>
