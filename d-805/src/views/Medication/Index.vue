<template>
  <div class="pageLeftContent pb-1">
    <searchBar :medicationTypes="medicationTypes" @filter="grdMedication_filter" @filterClear="grdMedication_filterClear"></searchBar>
    <b-container fluid class="mt-1 px-1">
      <ejs-grid
        ref="grdMedication"
        :dataSource="dsMedication"
        :allowPaging="true"
        :allowSorting="true"
        :allowResizing="true"
        :allowTextWrap="true"
        :pageSettings="pageSettings"
        :editSettings="editSettings"
        :toolbar="toolbar"
        :allowFiltering="true"
        :filterSettings="{ type: 'CheckBox' }"
        :sortSettings="{ columns: [{ field: 'No' }] }"
        :actionBegin="actionBegin"
        :actionComplete="actionComplete"
        :actionFailure="actionFailure"
      >
        <e-columns>
          <e-column field="Id" :isPrimaryKey="true" headerText="ID" width="160" :visible="false"></e-column>
          <e-column field="No" :isPrimaryKey="true" headerText="藥品代碼" width="160" :validationRules="{ required: true }"></e-column>
          <!-- <e-column field="EngName" headerText="藥品英文名稱" :validationRules="{ required: true }"></e-column> -->
          <e-column field="Name" headerText="藥品名稱" :validationRules="{ required: true }"></e-column>
          <!-- <e-column
            field="Type"
            headerText="類別"
            width="70"
            foreignKeyValue="Name"
            foreignKeyField="No"
            :dataSource="medicationTypes"
            :validationRules="{ required: true }"
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
          <e-column headerText :commands="commands" width="70" :allowResizing="false"></e-column>
        </e-columns>
      </ejs-grid>
    </b-container>
  </div>
</template>
<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import { DataManager, WebApiAdaptor } from "@syncfusion/ej2-data";
import { GridPlugin, ForeignKey, Page, Sort, Edit, Toolbar, Filter, Resize, CommandColumn } from "@syncfusion/ej2-vue-grids";
import * as configs from "@/config";
import searchBar from "./SearchBar";
import Swal from "sweetalert2";
import Common from "@/library/Common";

Vue.use(GridPlugin);

export default {
  data() {
    return {
      dsMedication: new DataManager({
        url: configs.publicPath + "../api/Medication",
        adaptor: new WebApiAdaptor(),
        crossDomain: true,
      }),
      medicationTypes: [
        { No: "001", Name: "藥品" },
        { No: "002", Name: "耗材" },
      ],
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
    grid: [ForeignKey, Page, Sort, Edit, Toolbar, Filter, Resize, CommandColumn],
  },
  components: {
    searchBar,
  },
  methods: {
    grdMedication_filter: function(e) {
      //startsWith, endsWith, contains, equal, notEqual, greaterThan, greaterThanOrEqual, lessThan, lessThanOrEqual
      if (e.No != "") this.$refs.grdMedication.filterByColumn("No", "contains", e.No);
      else this.$refs.grdMedication.ej2Instances.removeFilteredColsByField("No");
      if (e.Name != "") this.$refs.grdMedication.filterByColumn("Name", "contains", e.Name);
      else this.$refs.grdMedication.ej2Instances.removeFilteredColsByField("Name");
      // if (e.EngName != "") this.$refs.grdMedication.filterByColumn("EngName", "contains", e.EngName);
      // else this.$refs.grdMedication.ej2Instances.removeFilteredColsByField("EngName");
      // if (e.Type != null) this.$refs.grdMedication.filterByColumn("Type", "equal", e.Type);
      // else this.$refs.grdMedication.ej2Instances.removeFilteredColsByField("Type");
      if (e.IsActive != "") this.$refs.grdMedication.filterByColumn("IsActive", "equal", e.IsActive == "Y");
      else this.$refs.grdMedication.ej2Instances.removeFilteredColsByField("IsActive");
    },
    grdMedication_filterClear: function() {
      this.$refs.grdMedication.clearFiltering();
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
