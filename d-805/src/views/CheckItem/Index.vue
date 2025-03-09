<template>
  <div class="pageLeftContent pb-1">
    <searchBar
      @filter="grdCheckItem_filter"
      @filterClear="grdCheckItem_filterClear"
      :checkCategories="checkCategories"
      :modalityCategories="modalityCategories"
      :modalityList="modalityList"
      :institutionList="institutionList"
    ></searchBar>
    <b-container
      fluid
      class="mt-1 px-1"
    >
      <ejs-grid
        ref="grdCheckItem"
        :dataSource="dsCheckItem"
        :allowPaging="true"
        :allowSorting="true"
        :allowResizing="true"
        :allowTextWrap="true"
        :pageSettings="pageSettings"
        :editSettings="editSettings"
        :toolbar="toolbar"
        :actionComplete="actionComplete"
        :actionFailure="actionFailure"
        :allowFiltering="true"
        :filterSettings="{ type: 'CheckBox' }"
      >
        <e-columns>
          <e-column
            field="Id"
            :isPrimaryKey="true"
            headerText="ID"
            :visible="false"
          ></e-column>
          <e-column
            field="No"
            :isPrimaryKey="true"
            headerText="院內代碼"
            width="120"
            :validationRules="{ required: true }"
          ></e-column>
          <e-column
            field="NhiNo"
            headerText="健保代碼"
            width="120"
            :validationRules="{ required: true }"
          ></e-column>
          <e-column
            field="Modality"
            headerText="儀器類別"
            width="180"
            :dataSource="modalityList"
            foreignKeyValue="Name"
            foreignKeyField="No"
            :validationRules="{ required: true }"
          ></e-column>
          <!-- <e-column
            field="EngName"
            headerText="檢查項目英文名稱"
            :validationRules="{ required: true }"
          ></e-column> -->
          <e-column
            field="Name"
            headerText="檢查項目名稱"
            :validationRules="{ required: true }"
          ></e-column>
          <e-column
            field="CheckCategoryId"
            headerText="檢查類別"
            width="140"
            :dataSource="checkCategories"
            foreignKeyValue="Name"
            foreignKeyField="Id"
            :validationRules="{ required: true }"
          ></e-column>
          <e-column
            field="ModalityCategoryId"
            headerText="自訂分類"
            width="120"
            :dataSource="modalityCategories"
            foreignKeyValue="Name"
            foreignKeyField="Id"
          ></e-column>
          <e-column
            field="InstitutionId"
            headerText="檢查科別"
            width="100"
            :dataSource="institutionList"
            foreignKeyValue="Name"
            foreignKeyField="Id"
            :validationRules="{ required: true }"
          ></e-column>
          <e-column
            field="NonSchedule"
            headerText="隨到隨檢"
            type="boolean"
            width="100"
            textAlign="Center"
            displayAsCheckBox="true"
            editType="booleanedit"
          ></e-column>
          <e-column
            field="Duration"
            headerText="檢查時間(分鐘)"
            editType="numericedit"
            width="150"
            :validationRules="{ required: true }"
            :edit="numericParams"
          ></e-column>
          <e-column
            field="HasContrastMedia"
            headerText="顯影劑"
            width="70"
            textAlign="Center"
            type="boolean"
            displayAsCheckBox="true"
            editType="booleanedit"
            :allowResizing="false"
          ></e-column>
          <e-column
            field="IsSpeciality"
            headerText="醫師專長"
            width="100"
            textAlign="Center"
            type="boolean"
            displayAsCheckBox="true"
            editType="booleanedit"
            :allowResizing="false"
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
import Swal from "sweetalert2";
import { DataManager, WebApiAdaptor } from "@syncfusion/ej2-data";
import { GridPlugin, Page, Sort, ForeignKey, Edit, Toolbar, Filter, Resize, CommandColumn, DetailRow } from "@syncfusion/ej2-vue-grids";
import * as configs from "@/config";
import searchBar from "./SearchBar";
import Common from "../../library/Common";

Vue.use(GridPlugin);

export default {
  data () {
    return {
      checkCategories: [],
      modalityCategories: [],
      modalityList: [],
      institutionList: [],
      dsCheckItem: new DataManager({
        url: configs.publicPath + "../api/CheckItem",
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
      numericParams: {
        params: {
          validateDecimalOnType: true,
          decimals: 0,
          format: "N",
        },
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
          // },
          // {
          //   type: "Delete",
          //   buttonOption: {
          //     iconCss: " e-icons e-delete",
          //     cssClass: "e-flat"
          //   }
        },
      ],
      toolbar: ["Add"],
    };
  },
  computed: {
    ...mapGetters(["getThemeColors"])
  }
  ,
  provide: {
    grid: [Page, Sort, Edit, Toolbar, Filter, Resize, CommandColumn, DetailRow, ForeignKey],
  },
  components: {
    searchBar,
  },
  methods: {
    grdCheckItem_filter: function (e) {
      //startsWith, endsWith, contains, equal, notEqual, greaterThan, greaterThanOrEqual, lessThan, lessThanOrEqual
      if (e.Modality != null) this.$refs.grdCheckItem.filterByColumn("Modality", "equal", e.Modality);
      else this.$refs.grdCheckItem.ej2Instances.removeFilteredColsByField("Modality");
      if (e.No != "") this.$refs.grdCheckItem.filterByColumn("No", "contains", e.No);
      else this.$refs.grdCheckItem.ej2Instances.removeFilteredColsByField("No");
      if (e.Name != "") this.$refs.grdCheckItem.filterByColumn("Name", "contains", e.Name.replace("'", "''"));
      else this.$refs.grdCheckItem.ej2Instances.removeFilteredColsByField("Name");
      if (e.NhiNo != "") this.$refs.grdCheckItem.filterByColumn("NhiNo", "contains", e.NhiNo);
      else this.$refs.grdCheckItem.ej2Instances.removeFilteredColsByField("NhiNo");
      if (e.EngName != "") this.$refs.grdCheckItem.filterByColumn("EngName", "contains", e.EngName);
      else this.$refs.grdCheckItem.ej2Instances.removeFilteredColsByField("EngName");
      if (e.CheckCategory != null) this.$refs.grdCheckItem.filterByColumn("CheckCategoryId", "equal", e.CheckCategory);
      else this.$refs.grdCheckItem.ej2Instances.removeFilteredColsByField("CheckCategoryId");
      if (e.ModalityCategory != null) this.$refs.grdCheckItem.filterByColumn("ModalityCategoryId", "equal", e.ModalityCategory);
      else this.$refs.grdCheckItem.ej2Instances.removeFilteredColsByField("ModalityCategoryId");
      if (e.InstitutionId != null) this.$refs.grdCheckItem.filterByColumn("InstitutionId", "equal", e.InstitutionId);
      else this.$refs.grdCheckItem.ej2Instances.removeFilteredColsByField("InstitutionId");
      if (e.IsActive != "") this.$refs.grdCheckItem.filterByColumn("IsActive", "equal", e.IsActive == "Y");
      else this.$refs.grdCheckItem.ej2Instances.removeFilteredColsByField("IsActive");
      if (e.NonSchedule != "") this.$refs.grdCheckItem.filterByColumn("NonSchedule", "equal", e.NonSchedule == "Y");
      else this.$refs.grdCheckItem.ej2Instances.removeFilteredColsByField("NonSchedule");
    },
    grdCheckItem_filterClear: function () {
      this.$refs.grdCheckItem.clearFiltering();
    },
    actionComplete: function (args) {
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
    actionFailure: function (args) {
      Common.actionFailure(args);
    },
  },
  created: function () {
    let _this = this;
    window.axios.get("/checkCategory/SelectList?isAll=true").then((e) => {
      _this.checkCategories = e.Items;
    });
    window.axios.get("/modalityCategory/SelectList?modalityName=true").then((e) => {
      _this.modalityCategories = [{ No: null, Name: "" }, ...e.Items];
    });
    window.axios.get("/exam/GetModalityNoList").then((e) => {
      _this.modalityList = e;
    });
    window.axios.get("/institution/SelectList?showNo=true").then((e) => {
      _this.institutionList = e.Items;
    });
  },
};
</script>
<style></style>
