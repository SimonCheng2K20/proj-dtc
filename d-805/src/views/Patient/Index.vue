<template>
  <div class="pageLeftContent pb-1">
    <searchBar
      @filter="grdPatient_filter"
      @filterClear="grdPatient_filterClear"
      :patientStatusType="patientStatusType"
    ></searchBar>
    <b-container
      fluid
      class="mt-1 px-1"
    >
      <ejs-grid
        ref="grdPatient"
        :dataSource="dsPatient"
        allowPaging="true"
        allowSorting="true"
        :toolbar="toolbar"
        :allowTextWrap="true"
        :pageSettings="pageSettings"
        :editSettings="editSettings"
        :allowFiltering="true"
        :allowResizing="true"
        :filterSettings="{ type: 'CheckBox' }"
        :actionComplete="actionComplete"
        :actionFailure="actionFailure"
      >
        <e-columns>
          <e-column
            field="Id"
            :isPrimaryKey="true"
            headerText="ID"
            :visible="false"
          ></e-column>
          <e-column
            field="NaturalPerson.PhoneNo4Mobile"
            :visible="false"
          ></e-column>
          <e-column
            field="NaturalPerson.PhoneNo4Residence"
            :visible="false"
          ></e-column>
          <e-column
            field="NaturalPerson.Sex"
            :visible="false"
          ></e-column>
          <e-column
            field="No"
            type="string"
            :isPrimaryKey="true"
            headerText="病歷號"
            width="120"
            :validationRules="{ required: true }"
          ></e-column>
          <e-column
            field="NaturalPerson.Name"
            headerText="病患姓名"
            width="160"
            type="string"
            :validationRules="{ required: true }"
          ></e-column>
          <e-column
            field="NaturalPerson.PhoneNo4Mobile"
            headerText="手機號碼"
            width="120"
            type="string"
            :validationRules="{ required: true }"
          ></e-column>
          <e-column
            field="NaturalPerson.Birthday"
            headerText="出生日期"
            headerTextAlign="center"
            :format="{ type: 'date', format: 'yyyy/MM/dd' }"
            width="120"
          ></e-column>
          <e-column
            field="Confidentiality"
            headerText="病患資料機密性"
            width="180"
            foreignKeyValue="Name"
            foreignKeyField="No"
            :dataSource="confidentialities"
          ></e-column>
          <e-column
            field="PatientStatus"
            headerText="病患狀態"
            width="110"
            :allowResizing="false"
            foreignKeyValue="Name"
            foreignKeyField="No"
            :dataSource="patientStatusType"
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
import Swal from "sweetalert2";
import {
  GridPlugin,
  Page,
  Sort,
  Edit,
  Toolbar,
  Filter,
  Resize,
  ForeignKey,
  CommandColumn
} from "@syncfusion/ej2-vue-grids";
import { DataManager, WebApiAdaptor } from "@syncfusion/ej2-data";
import * as configs from "@/config";
import searchBar from "./SearchBar";
import DialogTemplate from "./DialogTemplate";
import Common from "@/library/Common";

Vue.use(GridPlugin);

export default {
  data () {
    return {
      dsPatient: new DataManager({
        url: configs.publicPath + "../api/patient",
        adaptor: new WebApiAdaptor(),
        crossDomain: true
      }),
      confidentialities: [],
      patientStatusType: [],
      sexs: [],
      dsRole: [],
      pageSettings: { pageSizes: true, pageSize: 10 },
      editSettings: {
        allowEditing: false,
        allowAdding: false,
        mode: "Dialog",
        showDeleteConfirmDialog: true,
        template: function () {
          return { template: DialogTemplate };
        }
      }
      // commands: [
      //   {
      //     type: "Edit",
      //     buttonOption: {
      //       iconCss: " e-icons e-edit",
      //       cssClass: "e-flat"
      //     }
      //   }
      //   // {
      //   //   type: "Delete",
      //   //   buttonOption: {
      //   //     iconCss: " e-icons e-delete",
      //   //     cssClass: "e-flat"
      //   //   }
      //   // }
      // ],
      // toolbar: ["Add"]
    };
  },
  computed: {
    ...mapGetters(["getThemeColors"])
  },
  provide: {
    grid: [Page, Sort, Edit, Toolbar, Filter, Resize, ForeignKey, CommandColumn]
  },
  components: {
    searchBar
  },
  methods: {
    grdPatient_filter: function (e) {
      if (e.No != "")
        this.$refs.grdPatient.filterByColumn("No", "contains", e.No);
      else this.$refs.grdPatient.ej2Instances.removeFilteredColsByField("No");

      if (e.Name != "")
        this.$refs.grdPatient.filterByColumn(
          "NaturalPerson.Name",
          "contains",
          e.Name
        );
      else
        this.$refs.grdPatient.ej2Instances.removeFilteredColsByField(
          "NaturalPerson.Name"
        );

      if (e.PatientStatus != null)
        this.$refs.grdPatient.filterByColumn(
          "PatientStatus",
          "equal",
          e.PatientStatus
        );
      else
        this.$refs.grdPatient.ej2Instances.removeFilteredColsByField(
          "PatientStatus"
        );
    },
    grdPatient_filterClear: function () {
      this.$refs.grdPatient.clearFiltering();
    },
    actionComplete: function (args) {
      if (args.requestType === "beginEdit" || args.requestType === "add") {
        let dialog = args.dialog;
        window.$("div[role='dialog']").css("max-height", "");

        // change the header of the dialog
        if (args.requestType === "beginEdit")
          dialog.header = "編輯『" + args.rowData["No"] + "』";
        dialog.element.querySelector(
          "#Confidentiality"
        ).ej2_instances[0].dataSource = this.confidentialities;
        dialog.element.querySelector(
          "#PatientStatus"
        ).ej2_instances[0].dataSource = this.patientStatusType;
        dialog.element.querySelector(
          "#NaturalPerson___Sex"
        ).ej2_instances[0].dataSource = this.sexs;
        if (args.requestType === "add") {
          dialog.element.querySelector(
            "#Confidentiality"
          ).ej2_instances[0].index = 0;
          dialog.element.querySelector(
            "#PatientStatus"
          ).ej2_instances[0].index = 0;
          dialog.element.querySelector(
            "#NaturalPerson___Sex"
          ).ej2_instances[0].index = 0;
        }
      }
      if (
        (args.action == "edit" || args.action == "add") &&
        args.requestType != "cancel"
      )
        Swal.fire({
          type: "success",
          title: "儲存成功！",
          timer: 1000
        });
    },
    actionFailure: function (args) {
      Common.actionFailure(args);
    }
  },
  created: function () {
    window.axios
      .get("/GeneralData/SelectNoList?groupNo=PatientStatus")
      .then(e => {
        if (e != null) {
          this.patientStatusType = e.Items;
        }
      });
    window.axios.get("/GeneralData/SelectNoList?groupNo=Sex").then(e => {
      if (e != null) {
        this.sexs = e.Items;
      }
    });
    window.axios
      .get("/GeneralData/SelectNoList?groupNo=PatientConfidentiality")
      .then(e => {
        if (e != null) {
          this.confidentialities = e.Items;
        }
      });
  }
};
</script>
