<template>
  <div class="pageLeftContent pb-1">
    <searchBar
      @filter="grdCheckCategory_filter"
      @filterClear="grdCheckCategory_filterClear"
      :modalityList="modalityList"
    ></searchBar>
    <b-container
      fluid
      class="mt-1 px-1"
    >
      <ejs-grid
        ref="grdCheckCategory"
        :dataSource="dsCheckCategory"
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
          <e-column
            field="Id"
            :isPrimaryKey="true"
            headerText="ID"
            width="160"
            :visible="false"
          ></e-column>
          <e-column
            field="No"
            headerText="檢查套餐代碼"
            width="160"
            :validationRules="{ required: true }"
          ></e-column>
          <e-column
            field="Name"
            headerText="檢查套餐名稱"
            :validationRules="{ required: true }"
          ></e-column>
          <e-column
            field="Duration"
            headerText="檢查時間(分鐘)"
            editType="numericedit"
            width="160"
            :validationRules="{ required: true }"
          ></e-column>
          <e-column
            field="Modality"
            headerText="儀器類別"
            width="100"
            :dataSource="modalityList"
            foreignKeyValue="Name"
            foreignKeyField="No"
            :validationRules="{ required: true }"
          ></e-column>
          <!-- <e-column
            field="SubjectionCheckCategoryId"
            headerText="隸屬檢查類別"
            :dataSource="checkCategories"
            foreignKeyValue="Name"
            foreignKeyField="Id"
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
          <e-column
            headerText
            :commands="commands"
            width="50"
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
  data () {
    return {
      dsCheckCategory: new DataManager({
        url: configs.publicPath + "../api/CheckCombo",
        adaptor: new WebApiAdaptor(),
        crossDomain: true,
      }),
      checkCategories: [],
      modalityList: [],
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
      DetailCheckItem: function () {
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
    ...mapGetters(["getThemeColors"])
  }
  ,
  provide: {
    grid: [ForeignKey, Page, Sort, Edit, Toolbar, Filter, Resize, CommandColumn, DetailRow],
  },
  components: {
    searchBar,
  },
  methods: {
    grdCheckCategory_filter: function (e) {
      //startsWith, endsWith, contains, equal, notEqual, greaterThan, greaterThanOrEqual, lessThan, lessThanOrEqual
      if (e.Modality != null) this.$refs.grdCheckCategory.filterByColumn("Modality", "equal", e.Modality);
      else this.$refs.grdCheckCategory.ej2Instances.removeFilteredColsByField("Modality");
      if (e.No != "") this.$refs.grdCheckCategory.filterByColumn("No", "contains", e.No);
      else this.$refs.grdCheckCategory.ej2Instances.removeFilteredColsByField("No");
      if (e.Name != "") this.$refs.grdCheckCategory.filterByColumn("Name", "contains", e.Name);
      else this.$refs.grdCheckCategory.ej2Instances.removeFilteredColsByField("Name");
      // if (e.SubjectionCheckCategory != null) this.$refs.grdCheckCategory.filterByColumn("SubjectionCheckCategoryId", "equal", e.SubjectionCheckCategory);
      // else this.$refs.grdCheckCategory.ej2Instances.removeFilteredColsByField("SubjectionCheckCategoryId");
      if (e.IsActive != "") this.$refs.grdCheckCategory.filterByColumn("IsActive", "equal", e.IsActive == "Y");
      else this.$refs.grdCheckCategory.ej2Instances.removeFilteredColsByField("IsActive");
    },
    grdCheckCategory_filterClear: function () {
      this.$refs.grdCheckCategory.clearFiltering();
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
        if (args.requestType === "beginEdit") dialog.header = "編輯『" + args.rowData["No"] + "』";
        if (Browser.isDevice) {
          dialog.height = window.innerHeight - 90 + "px";
          dialog.dataBind();
        }
      }
      if ((args.action == "edit" || args.action == "add") && args.requestType != "cancel") {
        this.$refs.grdCheckCategory.refresh();
        Swal.fire({
          type: "success",
          title: "儲存成功！",
          timer: 1000,
        });
      }
    },
    actionFailure: function (args) {
      Common.actionFailure(args);
    },
  },
  created: function () {
    let _this = this;
    window.axios.get("/checkCategory/SelectList").then((e) => {
      _this.checkCategories = e.Items;
    });
    window.axios.get("/exam/GetModalityNoList").then((e) => {
      _this.modalityList = e;
    });
  },
};
</script>
<style></style>
