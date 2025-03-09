<template>
  <div style="max-width:1000px;">
    <!-- <ejs-treegrid
      ref="grdFunction"
      :dataSource="dsFunction"
      idMapping="Id"
      parentIdMapping="ParentId"
      hasChildMapping="IsParent"
      :treeColumnIndex="1"
      :allowSorting="false"
      height="240"
      :selectionSettings="{ checkboxOnly: true }"
      :toolbar="[
        {
          text: '儲存變更',
          tooltipText: '儲存變更',
          prefixIcon: 'e-update',
          id: 'grdFunction_btnSave'
        }
      ]"
      :checkBoxChange="grdFunction_checkBoxChange"
      :toolbarClick="grdFunction_onSave"
      :actionComplete="grdFunction_actionComplete"
      :actionFailure="actionFailure"
    > -->
    <ejs-grid
      ref="grdFunction"
      :dataSource="dsFunction"
      :allowSorting="false"
      height="385"
      :selectionSettings="{ checkboxOnly: true }"
      :toolbar="[
        {
          text: '儲存變更',
          tooltipText: '儲存變更',
          prefixIcon: 'e-update',
          id: 'grdFunction_btnSave'
        }
      ]"
      :checkBoxChange="grdFunction_checkBoxChange"
      :toolbarClick="grdFunction_onSave"
      :actionComplete="grdFunction_actionComplete"
      :actionFailure="actionFailure"
    >
      <e-columns>
        <e-column field="Id" :isPrimaryKey="true" :visible="false" :allowSearching="false"></e-column>
        <e-column type="checkbox" field="IsChecked" width="90" textAlign="Center"></e-column>
        <e-column field="No" :isPrimaryKey="true" headerText="授權作業代碼" width="200"></e-column>
        <e-column field="Name" headerText="授權作業名稱"></e-column>
      </e-columns>
    </ejs-grid>
  </div>
</template>

<script>
import Vue from "vue";
import { GridPlugin, Toolbar } from "@syncfusion/ej2-vue-grids";
import { DataManager, WebApiAdaptor } from "@syncfusion/ej2-data";
import * as configs from "@/config";
import Swal from "sweetalert2";
import Common from "../../library/Common";

Vue.use(GridPlugin);

export default {
  props: ["No"],
  data() {
    return {
      data: {},
      dsFunction: []
    };
  },
  provide: {
    grid: [Toolbar]
  },
  methods: {
    grdFunction_actionComplete: function() {
      this.$refs.grdFunction.ej2Instances.toolbarModule.enableItems(["grdFunction_btnSave"], false); //Disable toolbar items.
    },
    grdFunction_checkBoxChange: function() {
      this.$refs.grdFunction.ej2Instances.toolbarModule.enableItems(["grdFunction_btnSave"], true); //Enable toolbar items.
    },
    grdFunction_onSave: function(args) {
      if (args.item.id === "grdFunction_btnSave") {
        let currentSelectFunctions = this.$refs.grdFunction.getSelectedRecords();
        window.axios
          .put("/role/UpdateFunctions", {
            No: this.No,
            Items: currentSelectFunctions
          })
          .then(() => {
            // this.$refs.grdFunction.ej2Instances.toolbarModule.enableItems(["grdFunction_btnSave"], false); //Disable toolbar items.
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
    },
    actionFailure: function(args) {
      Common.actionFailure(args);
    }
  },
  mounted: function() {
    this.dsFunction = new DataManager({
      url: configs.publicPath + "../role/Functions?no=" + this.No,
      adaptor: new WebApiAdaptor(),
      crossDomain: true
    });
  }
};
</script>
<style>
/* .q-tab-panels {
  background-color: transparent !important;
} */
</style>
