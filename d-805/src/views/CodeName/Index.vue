<template>
  <div class="pageLeftContent pb-1" style="width: 100%;">
    <searchBar
      :medicationTypes="medicationTypes"
      @filter="grdCodeName_filter"
      @filterClear="grdCodeName_filterClear"
      style="max-width: 700px; margin: 0 auto;"
    ></searchBar>
    <b-container fluid class="mt-1 px-1">
      <ejs-grid
        ref="grdCodeName"
        style="max-width: 700px; margin: 0 auto;"
        :dataSource="dsCodeName"
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
          <e-column field="CodeName" :isPrimaryKey="true" headerText="放射師簡碼" width="100" :validationRules="{ required: true }"></e-column>
          <e-column field="EmployeeName" :visible="false"></e-column>
          <e-column field="EmployeeId" headerText="放射師姓名" foreignKeyValue="Name" foreignKeyField="No" :dataSource="employees"></e-column>
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
import { DropDownListPlugin } from "@syncfusion/ej2-vue-dropdowns";
import * as configs from "@/config";
import searchBar from "./SearchBar";
import Swal from "sweetalert2";
import Common from "@/library/Common";

Vue.use(GridPlugin);
Vue.use(DropDownListPlugin);

export default {
  data() {
    return {
      dsCodeName: new DataManager({
        url: configs.publicPath + "../api/Radiographer_CodeName",
        adaptor: new WebApiAdaptor(),
        crossDomain: true,
      }),
      employees: [],
      pageSettings: {
        pageSizes: true,
        pageSize: 10,
      },
      editSettings: {
        allowEditing: true,
        allowAdding: true,
        allowDeleting: true,
        showConfirmDialog: true,
        showDeleteConfirmDialog: true,
      },
      sortSettings: {
        columns: [{ field: "No" }],
      },
      toolbar: ["Edit", "Update", "Cancel"],
      filterSettings: { type: "Menu" },
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
    grdCodeName_filter: function(e) {
      //startsWith, endsWith, contains, equal, notEqual, greaterThan, greaterThanOrEqual, lessThan, lessThanOrEqual
      if (e.CodeName != "") this.$refs.grdCodeName.filterByColumn("CodeName", "contains", e.CodeName);
      else this.$refs.grdCodeName.ej2Instances.removeFilteredColsByField("CodeName");
      if (e.EmployeeName != "") this.$refs.grdCodeName.filterByColumn("EmployeeName", "contains", e.EmployeeName);
      else this.$refs.grdCodeName.ej2Instances.removeFilteredColsByField("EmployeeName");
    },
    grdCodeName_filterClear: function() {
      this.$refs.grdCodeName.clearFiltering();
    },
    actionComplete: function(args) {
      if (args.action == "edit" && args.requestType != "cancel")
        Swal.fire({
          type: "success",
          title: "儲存成功！",
          showConfirmButton: false,
          timer: 400,
        });
    },
    actionFailure: function(args) {
      Common.actionFailure(args);
    },
  },
  created: function() {
    window.axios.get("/employee/SelectNoList?staffType=35&showNo=true").then((e) => {
      this.employees = [{ No: null, Name: "" }, ...e.Items];
    });
  },
};
</script>
<style></style>
