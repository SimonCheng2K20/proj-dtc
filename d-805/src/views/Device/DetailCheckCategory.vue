<template>
  <div style="max-width:1000px;">
    <ejs-grid
      ref="grdCheckCategory"
      :dataSource="dsCheckCategory"
      :allowSorting="false"
      height="385"
      :toolbar="[{ text: '儲存變更', tooltipText: '儲存變更', prefixIcon: 'e-update', id: 'btnSave' }]"
      :toolbarClick="onSave"
      :selectionSettings="{ checkboxOnly: true }"
      :actionComplete="actionComplete"
      :actionFailure="actionFailure"
      :checkBoxChange="checkBoxChange"
    >
      <e-columns>
        <e-column type="checkbox" field="IsChecked" width="90" textAlign="Center"></e-column>
        <e-column field="Id" :isPrimaryKey="true" headerText="ID" width="160" :visible="false"></e-column>
        <e-column field="No" :isPrimaryKey="true" headerText="檢查類別代碼" width="140"></e-column>
        <e-column field="Name" headerText="檢查類別名稱"></e-column>
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
      selectCheckCategorys: [],
      dsCheckCategory: []
    };
  },
  provide: {
    grid: [Sort, Page, Toolbar]
  },
  methods: {
    actionComplete: function() {
      this.$refs.grdCheckCategory.ej2Instances.toolbarModule.enableItems(["btnSave"], false); //Disable toolbar items.
    },
    actionFailure: function(args) {
      Common.actionFailure(args);
    },
    checkBoxChange: function() {
      this.$refs.grdCheckCategory.ej2Instances.toolbarModule.enableItems(["btnSave"], true); //Enable toolbar items.
    },
    onSave: function(args) {
      if (args.item.id === "btnSave") {
        let currentSelectCheckCategorys = this.$refs.grdCheckCategory.getSelectedRecords();
        window.axios
          .put("/device/UpdateCheckCategories", { Id: this.data.Id, Items: currentSelectCheckCategorys })
          .then(() => {
            this.$refs.grdCheckCategory.ej2Instances.toolbarModule.enableItems(["btnSave"], false); //Disable toolbar items.
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
    this.dsCheckCategory = new DataManager({
      url: configs.publicPath + "../device/CheckCategories?id=" + this.data.Id,
      adaptor: new WebApiAdaptor(),
      crossDomain: true
    });
  }
};
</script>
<style></style>
