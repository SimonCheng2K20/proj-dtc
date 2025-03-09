<template>
  <div
    class="pageLeftContent pb-1"
    
  >
    <searchBar
      @filter="grdRoom_filter"
      @filterClear="grdRoom_filterClear"
      :departments="departments"
    ></searchBar>
    <b-container
      fluid
      class="mt-1 px-1"
    >
      <ejs-grid
        ref="grdRoom"
        :dataSource="dsRoom"
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
          <e-column
            field="Id"
            :isPrimaryKey="true"
            headerText="ID"
            width="160"
            :visible="false"
          ></e-column>
          <e-column
            field="No"
            :isPrimaryKey="true"
            headerText="檢查室代碼"
            width="160"
            :validationRules="{ required: true }"
          ></e-column>
          <e-column
            field="Name"
            headerText="檢查室名稱"
            :validationRules="{ required: true }"
          ></e-column>
          <e-column
            field="PhonNo"
            headerText="檢查室電話"
            width="120"
          ></e-column>
          <e-column
            field="InstitutionId"
            headerText="隸屬醫院(科別)"
            :dataSource="departments"
            foreignKeyValue="Name"
            foreignKeyField="Id"
            :validationRules="{ required: true }"
          ></e-column>
          <e-column
            field="IsCheckUp"
            headerText="健檢專用"
            width="80"
            textAlign="Center"
            type="boolean"
            displayAsCheckBox="true"
            editType="booleanedit"
            :allowResizing="false"
          ></e-column>
          <e-column
            field="IsEmergency"
            headerText="急診專用"
            width="80"
            textAlign="Center"
            type="boolean"
            displayAsCheckBox="true"
            editType="booleanedit"
            :allowResizing="false"
          ></e-column>
          <e-column
            field="IsPortable"
            headerText="移動式"
            width="70"
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
import { GridPlugin, ForeignKey, Page, Sort, Edit, Toolbar, Filter, Resize, CommandColumn } from "@syncfusion/ej2-vue-grids";
import * as configs from "@/config";
import searchBar from "./SearchBar";
import Common from "@/library/Common";

Vue.use(GridPlugin);

export default {
  data () {
    return {
      dsRoom: new DataManager({
        url: configs.publicPath + "../api/room",
        adaptor: new WebApiAdaptor(),
        crossDomain: true,
      }),
      departments: [],
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
      filterSettings: { type: "Menu" },
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
    grid: [ForeignKey, Page, Sort, Edit, Toolbar, Filter, Resize, CommandColumn],
  },
  components: {
    searchBar,
  },
  methods: {
    aliasCheck: function (args) {
      if (args.element.disabled) return true;
      return !this.dsRoom.dataSource.json.find((item) => item._alias == args.value);
    },
    grdRoom_filter: function (e) {
      //startsWith, endsWith, contains, equal, notEqual, greaterThan, greaterThanOrEqual, lessThan, lessThanOrEqual
      if (e.No != "") this.$refs.grdRoom.filterByColumn("No", "contains", e.No);
      else this.$refs.grdRoom.ej2Instances.removeFilteredColsByField("No");
      if (e.Name != "") this.$refs.grdRoom.filterByColumn("Name", "contains", e.Name);
      else this.$refs.grdRoom.ej2Instances.removeFilteredColsByField("Name");
      if (e.PhonNo != "") this.$refs.grdRoom.filterByColumn("PhonNo", "contains", e.PhonNo);
      else this.$refs.grdRoom.ej2Instances.removeFilteredColsByField("PhonNo");
      if (e.Department != null) this.$refs.grdRoom.filterByColumn("InstitutionId", "equal", e.Department);
      else this.$refs.grdRoom.ej2Instances.removeFilteredColsByField("InstitutionId");
      if (e.IsActive != "") this.$refs.grdRoom.filterByColumn("IsActive", "equal", e.IsActive === "Y");
      else this.$refs.grdRoom.ej2Instances.removeFilteredColsByField("IsActive");
    },
    grdRoom_filterClear: function () {
      this.$refs.grdRoom.clearFiltering();
    },
    actionComplete: function (args) {
      if (args.requestType === "beginEdit" || args.requestType === "add") {
        let dialog = args.dialog;
        window.$("div[role='dialog']").css("max-height", "");
        // change the header of the dialog
        if (args.requestType === "beginEdit") dialog.header = "編輯『" + args.rowData["No"] + "』";
        else {
          for (var i = 0; i < this.$refs.grdRoom.getColumns().length; i++) {
            if (this.$refs.grdRoom.getColumns()[i].field == "InstitutionId") {
              this.$refs.grdRoom.getColumns()[i].edit.obj.index = 0;
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
    actionFailure: function (args) {
      Common.actionFailure(args);
    },
  },
  created: function () {
    window.axios.get("/institution/SelectList?getAll=true&showNo=true").then(e => {
      this.departments = e.Items;
    });
  },
};
</script>
<style></style>
