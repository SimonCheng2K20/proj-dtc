<template>
  <div class="pageLeftContent pb-1">
    <searchBar
      :modalities="modalities"
      @filter="grdModalityCategory_filter"
      @filterClear="grdModalityCategory_filterClear"
    ></searchBar>
    <b-container
      fluid
      class="mt-1 px-1"
    >
      <ejs-grid
        id="grdModalityCategory"
        ref="grdModalityCategory"
        :dataSource="dsModalityCategory"
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
            field="Modality"
            headerText="儀器類別"
            :dataSource="modalities"
            foreignKeyValue="Name"
            foreignKeyField="No"
            width="120"
            :validationRules="{ required: true }"
          ></e-column>
          <e-column
            field="Category"
            headerText="自訂分類"
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
      dsModalityCategory: new DataManager({
        url: configs.publicPath + "../api/ModalityCategory",
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      }),
      modalities: [],
      pageSettings: {
        pageSizes: true,
        pageSize: 10
      },
      editSettings: {
        allowEditing: true,
        allowAdding: true,
        allowDeleting: true,
        mode: "Dialog",
        showConfirmDialog: true,
        showDeleteConfirmDialog: true
      },
      sortSettings: {
        columns: [{ field: "No" }]
      },
      commands: [
        {
          type: "Edit",
          buttonOption: {
            iconCss: " e-icons e-edit",
            cssClass: "e-flat"
          }
          // },
          // {
          //   type: "Delete",
          //   buttonOption: {
          //     iconCss: " e-icons e-delete",
          //     cssClass: "e-flat"
          //   }
        }
      ],
      filterSettings: { type: "Menu" },
      currentEditKey: null,
      toolbar: ["Add"],
      requiredRules: {
        required: true
      }
    };
  },
  computed: {
    ...mapGetters(["getThemeColors"])
  },
  provide: {
    grid: [ForeignKey, Page, Sort, Edit, Toolbar, Filter, Resize, CommandColumn]
  },
  components: {
    searchBar
  },
  methods: {
    grdModalityCategory_filter: function (e) {
      //startsWith, endsWith, contains, equal, notEqual, greaterThan, greaterThanOrEqual, lessThan, lessThanOrEqual
      if (e.Modality != null) this.$refs.grdModalityCategory.filterByColumn("Modality", "equal", e.Modality);
      else this.$refs.grdModalityCategory.ej2Instances.removeFilteredColsByField("Modality");
      if (e.Category != "") this.$refs.grdModalityCategory.filterByColumn("Category", "contains", e.Category);
      else this.$refs.grdModalityCategory.ej2Instances.removeFilteredColsByField("Category");
      if (e.IsActive != "") this.$refs.grdModalityCategory.filterByColumn("IsActive", "equal", e.IsActive == "Y");
      else this.$refs.grdModalityCategory.ej2Instances.removeFilteredColsByField("IsActive");
    },
    grdModalityCategory_filterClear: function () {
      this.$refs.grdModalityCategory.clearFiltering();
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
        if (args.requestType === "beginEdit") dialog.header = "編輯『" + args.rowData["Category"] + "』";
      }
      if ((args.action == "edit" || args.action == "add") && args.requestType != "cancel")
        Swal.fire({
          type: "success",
          title: "儲存成功！",
          timer: 1500
        });
    },
    actionFailure: function (args) {
      Common.actionFailure(args);
    }
  },
  created: function () {
    let _this = this;
    window.axios.get("/exam/GetModalityNoList").then(e => {
      _this.modalities = e;
    });
  }
};
</script>
<style>
#grdModalityCategory_dialogEdit_wrapper {
  width: 600px !important;
}
</style>
