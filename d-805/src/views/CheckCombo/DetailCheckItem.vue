<template>
  <div style="max-width:1600px;">
    <b-tabs card>
      <b-tab title="套餐檢查項目" active>
        <ejs-grid
          ref="grdCheckItem"
          :dataSource="dsMedication"
          height="385"
          :allowSorting="false"
          :checkBoxChange="grdCheckItemCheckBoxChange"
          :selectionSettings="{ checkboxOnly: true }"
          :toolbar="[{ text: '儲存變更', tooltipText: '儲存變更', prefixIcon: 'e-update', id: 'btnSave' }]"
          :toolbarClick="grdCheckItemOnSave"
          :actionComplete="grdCheckItemActionComplete"
          :actionFailure="grdCheckItemActionFailure"
        >
          <e-columns>
            <e-column type="checkbox" field="IsChecked" width="90" textAlign="Center"></e-column>
            <e-column field="No" :isPrimaryKey="true" headerText="院內代碼" width="160" :validationRules="{ required: true }"></e-column>
            <e-column field="NhiNo" headerText="健保代碼" width="140" :validationRules="{ required: true }"></e-column>
            <!-- <e-column field="EngName" headerText="檢查項目英文名稱" :validationRules="{ required: true }"></e-column> -->
            <e-column field="Name" headerText="檢查項目名稱" :validationRules="{ required: true }"></e-column>
          </e-columns>
        </ejs-grid>
      </b-tab>
      <b-tab title="指定檢查室">
        <ejs-grid
          ref="grdRoom"
          :dataSource="dsRoom"
          height="385"
          :allowSorting="false"
          :checkBoxChange="grdRoomCheckBoxChange"
          :selectionSettings="{ checkboxOnly: true }"
          :toolbar="[{ text: '儲存變更', tooltipText: '儲存變更', prefixIcon: 'e-update', id: 'btnSave' }]"
          :toolbarClick="grdRoomOnSave"
          :actionComplete="grdRoomActionComplete"
          :actionFailure="grdRoomActionFailure"
        >
          <e-columns>
            <e-column type="checkbox" field="IsChecked" width="90" textAlign="Center"></e-column>
            <e-column field="No" :isPrimaryKey="true" headerText="檢查室代碼" width="160" :validationRules="{ required: true }"></e-column>
            <e-column field="Name" headerText="檢查室名稱" :validationRules="{ required: true }"></e-column>
          </e-columns>
        </ejs-grid>
      </b-tab>
    </b-tabs>
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
      selectMedications: [],
      // detailChanged: false,
      dsMedication: [],
      dsRoom: []
    };
  },
  provide: {
    grid: [Sort, Page, Toolbar]
  },
  methods: {
    grdCheckItemActionComplete: function(args) {
      this.$refs.grdCheckItem.ej2Instances.toolbarModule.enableItems(["btnSave"], false); //Disable toolbar items.
    },
    grdCheckItemActionFailure: function(args) {
      Common.actionFailure(args);
    },
    grdCheckItemCheckBoxChange: function(e) {
      this.$refs.grdCheckItem.ej2Instances.toolbarModule.enableItems(["btnSave"], true); //Enable toolbar items.
    },
    grdCheckItemOnSave: function(args) {
      if (args.item.id === "btnSave") {
        window.axios
          .put("/checkCategory/UpdateComboCheckItems", {
            Id: this.data.Id,
            Items: this.$refs.grdCheckItem.getSelectedRecords()
          })
          .then(e => {
            this.$refs.grdCheckItem.ej2Instances.toolbarModule.enableItems(["btnSave"], false); //Disable toolbar items.
            Swal.fire({
              type: "success",
              title: "套餐檢查項目儲存成功！",
              timer: 1500
            });
          })
          .catch(function(error) {
            Swal.fire("套餐檢查項目儲存失敗！", error, "error");
          });
      }
    },
    grdRoomActionComplete: function(args) {
      this.$refs.grdRoom.ej2Instances.toolbarModule.enableItems(["btnSave"], false); //Disable toolbar items.
    },
    grdRoomActionFailure: function(args) {
      Common.actionFailure(args);
    },
    grdRoomCheckBoxChange: function(e) {
      this.$refs.grdRoom.ej2Instances.toolbarModule.enableItems(["btnSave"], true); //Enable toolbar items.
    },
    grdRoomOnSave: function(args) {
      if (args.item.id === "btnSave") {
        window.axios
          .put("/checkCategory/UpdateComboRooms", {
            Id: this.data.Id,
            Items: this.$refs.grdRoom.getSelectedRecords()
          })
          .then(e => {
            this.$refs.grdRoom.ej2Instances.toolbarModule.enableItems(["btnSave"], false); //Disable toolbar items.
            Swal.fire({
              type: "success",
              title: "指定檢查室儲存成功！",
              timer: 1500
            });
          })
          .catch(function(error) {
            Swal.fire("指定檢查室儲存失敗！", error, "error");
          });
      }
    }
  },
  mounted: function() {
    this.dsMedication = new DataManager({
      url: configs.publicPath + "../checkCategory/ComboCheckItems?id=" + this.data.Id,
      adaptor: new WebApiAdaptor(),
      crossDomain: true
    });
    this.dsRoom = new DataManager({
      url: configs.publicPath + "../checkCategory/ComboRooms?id=" + this.data.Id,
      adaptor: new WebApiAdaptor(),
      crossDomain: true
    });
  }
};
</script>
<style></style>
