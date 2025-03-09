<template>
  <div class="pageLeftContent pb-1">
    <searchBar
      @filter="grdDevice_filter"
      @filterClear="grdDevice_filterClear"
      :locations="locations"
      :modalityList="modalityList"
    ></searchBar>
    <b-container
      fluid
      class="mt-1 px-1"
    >
      <ejs-grid
        ref="grdDevice"
        :dataSource="dsDevice"
        :allowPaging="true"
        :allowSorting="true"
        :allowResizing="true"
        :allowTextWrap="true"
        :pageSettings="pageSettings"
        :editSettings="editSettings"
        :toolbar="['Add']"
        :allowFiltering="true"
        :filterSettings="{ type: 'CheckBox' }"
        :sortSettings="sortSettings"
        :detailTemplate="DetailCheckCategory"
        :actionComplete="actionComplete"
        :actionFailure="actionFailure"
      >
        <e-columns>
          <e-column
            field="id"
            :isPrimaryKey="true"
            headerText="ID"
            :visible="false"
          ></e-column>
          <e-column
            field="No"
            :isPrimaryKey="true"
            headerText="檢查儀器代碼"
            width="160"
            :validationRules="{ required: true }"
          ></e-column>
          <e-column
            field="Name"
            headerText="檢查儀器名稱"
            :validationRules="{ required: true }"
          ></e-column>
          <e-column
            field="RoomId"
            headerText="放置檢查室"
            foreignKeyValue="Name"
            foreignKeyField="Id"
            :dataSource="locations"
            :validationRules="{ required: true }"
          ></e-column>
          <e-column
            field="Modality"
            headerText="造影設備類別"
            width="160"
            foreignKeyValue="Name"
            foreignKeyField="No"
            :dataSource="modalityList"
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
import { DataManager, WebApiAdaptor } from "@syncfusion/ej2-data";
import { GridPlugin, Page, Sort, Edit, Toolbar, Filter, ForeignKey, Resize, CommandColumn, DetailRow } from "@syncfusion/ej2-vue-grids";
import * as configs from "@/config";
import searchBar from "./SearchBar";
import DetailCheckCategory from "./DetailCheckCategory";
import Swal from "sweetalert2";
import Common from "@/library/Common";

Vue.use(GridPlugin);

export default {
  data () {
    return {
      dsDevice: new DataManager({
        url: configs.publicPath + "../api/Device",
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      }),
      locations: [],
      modalityList: [],
      pageSettings: {
        pageSizes: true,
        pageSize: 10
      },
      editSettings: {
        allowEditing: true,
        allowAdding: true,
        allowDeleting: false,
        mode: "Dialog",
        showConfirmDialog: true
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
        }
      ],
      DetailCheckCategory: function () {
        return { template: DetailCheckCategory };
      }
    };
  },
  computed: {
    ...mapGetters(["getThemeColors"])
  },
  provide: {
    grid: [Page, Sort, Edit, Toolbar, Filter, Resize, CommandColumn, ForeignKey, DetailRow]
  },
  components: {
    searchBar
  },
  methods: {
    grdDevice_filter: function (e) {
      //startsWith, endsWith, contains, equal, notEqual, greaterThan, greaterThanOrEqual, lessThan, lessThanOrEqual
      if (e.No != "") this.$refs.grdDevice.filterByColumn("No", "contains", e.No);
      else this.$refs.grdDevice.ej2Instances.removeFilteredColsByField("No");
      if (e.Name != "") this.$refs.grdDevice.filterByColumn("Name", "contains", e.Name);
      else this.$refs.grdDevice.ej2Instances.removeFilteredColsByField("Name");
      if (e.Location != null) this.$refs.grdDevice.filterByColumn("RoomId", "equal", e.Location);
      else this.$refs.grdDevice.ej2Instances.removeFilteredColsByField("RoomId");
      if (e.IsActive != "") this.$refs.grdDevice.filterByColumn("IsActive", "equal", e.IsActive == "Y");
      else this.$refs.grdDevice.ej2Instances.removeFilteredColsByField("IsActive");
    },
    grdDevice_filterClear: function () {
      this.$refs.grdDevice.clearFiltering();
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
          timer: 1500
        });
    },
    actionFailure: function (args) {
      Common.actionFailure(args);
    }
  },
  created: function () {
    window.axios.get("/room/SelectList").then(e => {
      this.locations = e.Items;
    });
    window.axios.get("/exam/GetModalityNoList").then(e => {
      this.modalityList = e;
    });
  }
};
</script>
<style>
/* .e-grid {
    min-height: 518px;
  } */
</style>
