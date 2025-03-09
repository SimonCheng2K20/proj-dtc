<template>
  <div style="max-width:1600px;">
    <ejs-grid
      ref="grdProcedureGroup"
      :dataSource="dsProcedureGroup"
      height="385"
      :allowSorting="false"
      :checkBoxChange="checkBoxChange"
      :selectionSettings="{ checkboxOnly: true }"
      :toolbar="[{ text: '儲存變更', tooltipText: '儲存變更', prefixIcon: 'e-update', id: 'btnSave' }]"
      :toolbarClick="onSave"
      :actionComplete="actionComplete"
      :actionFailure="actionFailure"
    >
      <e-columns>
        <e-column type="checkbox" field="IsChecked" width="90" textAlign="Center"></e-column>
        <e-column field="No" :isPrimaryKey="true" headerText="專長群組代碼" width="160" :validationRules="{ required: true }"></e-column>
        <e-column field="Name" headerText="專長群組名稱" :validationRules="{ required: true }"></e-column>
      </e-columns>
    </ejs-grid>
  </div>
</template>

<script>
import { Sort, Toolbar, Page } from "@syncfusion/ej2-vue-grids";
import { DataManager, WebApiAdaptor } from "@syncfusion/ej2-data";
import * as configs from "@/config";
import Swal from "sweetalert2";
import Common from "../../library/Common";

export default {
  data() {
    return {
      data: {},
      // selectMedications: [],
      // detailChanged: false,
      dsProcedureGroup: []
    };
  },
  provide: {
    grid: [Sort, Page, Toolbar]
  },
  methods: {
    actionComplete: function(args) {
      this.$refs.grdProcedureGroup.ej2Instances.toolbarModule.enableItems(["btnSave"], false); //Disable toolbar items.
    },
    actionFailure: function(args) {
      Common.actionFailure(args);
    },
    checkBoxChange: function(e) {
      this.$refs.grdProcedureGroup.ej2Instances.toolbarModule.enableItems(["btnSave"], true); //Enable toolbar items.
    },
    onSave: function(args) {
      if (args.item.id === "btnSave") {
        window.axios
          .put("/employee/UpdateProcedureGroups", {
            Id: this.data.Id,
            Items: this.$refs.grdProcedureGroup.getSelectedRecords()
          })
          .then(e => {
            this.$refs.grdProcedureGroup.ej2Instances.toolbarModule.enableItems(["btnSave"], false); //Disable toolbar items.
            Swal.fire({
              type: "success",
              title: "儲存成功！",
              timer: 1500
            });
          })
          .catch(function(error) {
            Swal.fire("儲存失敗！", error, "error");
          });
      }
    }
  },
  mounted: function() {
    this.dsProcedureGroup = new DataManager({
      url: configs.publicPath + "../employee/ProcedureGroups?id=" + this.data.Id,
      adaptor: new WebApiAdaptor(),
      crossDomain: true
    });
  }
};
</script>
<style></style>
