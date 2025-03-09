<template>
  <div class="pageLeftContent pb-1">
    <searchBar
      :departments="departments"
      :medications="medications"
      @filter="grdSubMedication_filter"
      @filterClear="grdSubMedication_filterClear"
    ></searchBar>
    <b-container
      fluid
      class="mt-1 px-1"
    >
      <ejs-grid
        id="grdSubMedication"
        ref="grdSubMedication"
        :dataSource="dsSubMedication"
        :allowPaging="true"
        :allowSorting="true"
        :allowResizing="true"
        :allowTextWrap="true"
        :pageSettings="pageSettings"
        :editSettings="editSettings"
        :toolbar="toolbar"
        :allowFiltering="true"
        :filterSettings="{ type: 'CheckBox' }"
        :actionBegin="actionBegin"
        :actionComplete="actionComplete"
        :actionFailure="actionFailure"
      >
        <e-columns>
          <e-column
            field="Id"
            :isPrimaryKey="true"
            :visible="false"
            :allowSearching="false"
          ></e-column>
          <e-column
            field="InstitutionId"
            headerText="科別"
            width="100"
            :dataSource="departments"
            foreignKeyValue="Name"
            foreignKeyField="Id"
            :validationRules="{ required: true }"
          ></e-column>
          <e-column
            field="ParentMedicationId"
            headerText="藥品"
            :dataSource="medications"
            foreignKeyValue="Name"
            foreignKeyField="Id"
            :validationRules="{ required: true }"
          ></e-column>
          <e-column
            field="Name"
            headerText="藥品子代碼"
            width="120"
            :validationRules="{ required: true }"
          ></e-column>
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
          <e-column
            headerText
            :commands="commands"
            width="100"
            :allowResizing="false"
          ></e-column>
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
  data () {
    return {
      dsSubMedication: new DataManager({
        url: configs.publicPath + "../api/SubMedication",
        adaptor: new WebApiAdaptor(),
        crossDomain: true,
      }),
      departments: [],
      medications: [],
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
      currentEditKey: null,
      toolbar: ["Add"],
      requiredRules: {
        required: true,
      },
    };
  },
  computed: {
    ...mapGetters(["getThemeColors"])
  },
  provide: {
    grid: [ForeignKey, Page, Sort, Edit, Toolbar, Filter, Resize, CommandColumn],
  },
  components: {
    searchBar,
  },
  methods: {
    grdSubMedication_filter: function (e) {
      //startsWith, endsWith, contains, equal, notEqual, greaterThan, greaterThanOrEqual, lessThan, lessThanOrEqual
      if (e.InstitutionId != null) this.$refs.grdSubMedication.filterByColumn("InstitutionId", "equal", e.InstitutionId);
      else this.$refs.grdSubMedication.ej2Instances.removeFilteredColsByField("InstitutionId");
      if (e.ParentMedicationId != null) this.$refs.grdSubMedication.filterByColumn("ParentMedicationId", "equal", e.ParentMedicationId);
      else this.$refs.grdSubMedication.ej2Instances.removeFilteredColsByField("ParentMedicationId");
      if (e.Name != "") this.$refs.grdSubMedication.filterByColumn("Name", "contains", e.Name);
      else this.$refs.grdSubMedication.ej2Instances.removeFilteredColsByField("Name");
      if (e.IsActive != "") this.$refs.grdSubMedication.filterByColumn("IsActive", "equal", e.IsActive == "Y");
      else this.$refs.grdSubMedication.ej2Instances.removeFilteredColsByField("IsActive");
    },
    grdSubMedication_filterClear: function () {
      this.$refs.grdSubMedication.clearFiltering();
    },
    actionBegin: function (args) {
      if (args.requestType === "beginEdit") {
        this.currentEditKey = args.primaryKeyValue[0];
      }
    },
    actionComplete: function (args) {
      if (args.requestType === "beginEdit" || args.requestType === "add") {
        let dialog = args.dialog;
        window.$("div[role='dialog']").css("max-height", "");
        // change the header of the dialog
        if (args.requestType === "beginEdit") dialog.header = "編輯『" + args.rowData["Name"] + "』";
      }
      if ((args.action == "edit" || args.action == "add") && args.requestType != "cancel")
        Swal.fire({
          type: "success",
          title: "儲存成功！",
          timer: 1500,
        });
    },
    actionFailure: function (args) {
      Common.actionFailure(args);
    },
  },
  created: function () {
    let _this = this;
    window.axios.get("/medication/SelectList?$filter=ParentMedicationId%20eq%20null").then((e) => {
      _this.medications = e.Items;
    });
    window.axios.get("/institution/SelectList?getAll=false&showNo=true").then((e) => {
      _this.departments = e.Items;
    });
  },
};
</script>
<style>
#grdSubMedication_dialogEdit_wrapper {
  width: 600px !important;
}
</style>
