<template>
  <div class="pageLeftContent pb-1">
    <searchBar @filter="grdInstitution_filter" @filterClear="grdInstitution_filterClear" :departments="departments"></searchBar>
    <b-container fluid class="mt-1 px-1">
      <ejs-treegrid
        ref="grdInstitution"
        childMapping="Childs"
        :treeColumnIndex="1"
        :dataSource="dsInstitution"
        :allowPaging="true"
        :allowSorting="true"
        :allowResizing="true"
        :allowTextWrap="true"
        :allowFiltering="true"
        :enableCollapseAll="true"
        :allowRowDragAndDrop="false"
        :pageSettings="pageSettings"
        :editSettings="editSettings"
        :filterSettings="filterSettings"
        :toolbar="toolbar"
        :actionBegin="actionBegin"
        :actionComplete="actionComplete"
        :actionFailure="actionFailure"
      >
        <e-columns>
          <e-column field="Id" :isPrimaryKey="true" :visible="false"></e-column>
          <e-column field="No" :isPrimaryKey="true" headerText="科室代碼" width="100" :validationRules="{ required: true }"></e-column>
          <e-column field="Name" headerText="科室名稱" :validationRules="{ required: true }"></e-column>
          <e-column field="ParentInstitutionId" headerText="隸屬科室" :visible="false"></e-column>
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
          <e-column headerText :commands="commands" width="50" :allowResizing="false" :allowFiltering="false"></e-column>
        </e-columns>
      </ejs-treegrid>
    </b-container>
  </div>
</template>
<script>
import Vue from "vue";
import { mapGetters } from "vuex";
import Swal from "sweetalert2";
import { TreeGridPlugin, Edit, Page, Sort, Toolbar, Filter, Resize, CommandColumn, RowDD } from "@syncfusion/ej2-vue-treegrid";
import Common from "../../library/Common";
import searchBar from "./SearchBar";
import DialogTemplate from "./DialogTemplate";

Vue.use(TreeGridPlugin);

export default {
  data() {
    return {
      hospitals: [],
      departments: [],
      dsInstitution: [],
      pageSettings: {
        pageSizes: true,
        pageSize: 10,
      },
      filterSettings: { type: "CheckBox", hierarchyMode: "Both", mode: "Immediate" },
      editSettings: {
        allowEditing: true,
        allowAdding: true,
        allowDeleting: false,
        mode: "Dialog",
        showConfirmDialog: true,
        newRowPosition: "Child",
        template: function() {
          return { template: DialogTemplate };
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
        },
      ],
      toolbar: ["Add", "ExpandAll", "CollapseAll"],
    };
  },
  computed: {
    ...mapGetters(["getThemeColors"]),
  },
  provide: {
    treegrid: [Page, Sort, Edit, Toolbar, Filter, Resize, CommandColumn, RowDD],
  },
  components: {
    searchBar,
  },
  methods: {
    grdInstitution_filter(e) {
      //startsWith, endsWith, contains, equal, notEqual, greaterThan, greaterThanOrEqual, lessThan, lessThanOrEqual
      if (e.No != "") this.$refs.grdInstitution.filterByColumn("No", "contains", e.No);
      else this.$refs.grdInstitution.ej2Instances.removeFilteredColsByField("No");
      if (e.Name != "") this.$refs.grdInstitution.filterByColumn("Name", "contains", e.Name);
      else this.$refs.grdInstitution.ej2Instances.removeFilteredColsByField("Name");
      if (e.Hospital != null) this.$refs.grdInstitution.filterByColumn("ParentInstitutionId", "equal", e.Hospital);
      else this.$refs.grdInstitution.ej2Instances.removeFilteredColsByField("ParentInstitutionId");
      if (e.IsActive != "") this.$refs.grdInstitution.filterByColumn("IsActive", "equal", e.IsActive == "Y");
      else this.$refs.grdInstitution.ej2Instances.removeFilteredColsByField("IsActive");
    },
    grdInstitution_filterClear() {
      this.$refs.grdInstitution.clearFiltering();
    },
    actionBegin(args) {
      let _this = this;
      switch (args.requestType) {
        case "add":
          break;
        case "save":
          if (args.action == "edit")
            window.axios
              .put("/api/institution", args.data)
              .then(function() {
                Swal.fire({
                  type: "success",
                  title: "儲存成功！",
                  timer: 500,
                });
                window.axios.get("/api/institution").then((e) => {
                  _this.dsInstitution = e.Items;
                });
              })
              .catch(function(error) {
                Swal.fire({
                  type: "error",
                  title: error,
                });
              });
          else {
            args.cancel = true;
            window.axios
              .post("/api/institution", args.data)
              .then(function() {
                Swal.fire({
                  type: "success",
                  title: "新增成功！",
                  timer: 500,
                });
                window.axios.get("/api/institution").then((e) => {
                  _this.dsInstitution = e.Items;
                });
              })
              .catch(function(e) {
                Swal.fire(e.response.status === 409 ? "驗證錯誤！" : "伺服器錯誤！", e.response.data, "error");
              });
          }

          args.dialog.close();
      }
    },
    actionComplete: function(args) {
      if (args.requestType === "beginEdit" || args.requestType === "add") {
        let dialog = args.dialog;
        window.$("div[role='dialog']").css("max-height", "");
        // change the header of the dialog
        if (args.requestType === "beginEdit") dialog.header = "編輯『" + args.rowData["No"] + "』";
        dialog.element.querySelector("#ParentInstitutionId").ej2_instances[0].dataSource = this.hospitals;
        if (args.requestType === "add") {
          let selectDataRows = this.$refs.grdInstitution.getSelectedRecords();
          if (selectDataRows.length > 0 && args.rowData["ParentInstitutionId"] != selectDataRows[0].Id) {
            dialog.element.querySelector("#ParentInstitutionId").ej2_instances[0].value = selectDataRows[0].Id;
          }
        }
      }
    },
    actionFailure(args) {
      Common.actionFailure(args);
    },
  },
  mounted() {
    let _this = this;
    window.axios.get("/institution/SelectList?getAll=false&showNo=true").then((e) => {
      _this.departments = e.Items;
      _this.hospitals = [{ Id: null, Name: "" }, ...e.Items];
    });
    window.axios.get("/api/institution").then((e) => {
      _this.dsInstitution = e.Items;
    });
  },
};
</script>
