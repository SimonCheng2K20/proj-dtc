<template>
  <div style="max-width:1000px;">
    <b-tabs card>
      <b-tab title="系統帳號" active>
        <ejs-grid
          ref="grdAccount"
          :dataSource="dsAccount"
          :allowSorting="false"
          height="385"
          :selectionSettings="{ checkboxOnly: true }"
          :toolbar="[
            {
              text: '儲存變更',
              tooltipText: '儲存變更',
              prefixIcon: 'e-update',
              id: 'grdAccount_btnSave',
            },
          ]"
          :checkBoxChange="grdAccount_checkBoxChange"
          :toolbarClick="grdAccount_onSave"
          :actionComplete="grdAccount_actionComplete"
          :actionFailure="actionFailure"
        >
          <e-columns>
            <e-column field="Id" :isPrimaryKey="true" headerText="ID" width="160" :visible="false"></e-column>
            <e-column type="checkbox" field="IsChecked" width="40" textAlign="Center"></e-column>
            <e-column field="No" :isPrimaryKey="true" headerText="帳號" width="140"></e-column>
            <e-column field="AccountName" :isPrimaryKey="true" headerText="姓名" width="140"></e-column>
          </e-columns>
        </ejs-grid>
      </b-tab>
      <b-tab title="授權作業">
        <functionDetail :No="data.No"></functionDetail>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import Vue from "vue";
import { GridPlugin, Toolbar } from "@syncfusion/ej2-vue-grids";
import { DataManager, WebApiAdaptor } from "@syncfusion/ej2-data";
import * as configs from "@/config";
import Swal from "sweetalert2";
import Common from "../../library/Common";
import functionDetail from "./FunctionDetail";

Vue.use(GridPlugin);

export default {
  data() {
    return {
      data: {},
      dsAccount: [],
      dsFunction: [],
      activeTab: "users",
    };
  },
  provide: {
    grid: [Toolbar],
  },
  components: {
    functionDetail,
  },
  methods: {
    grdAccount_actionComplete: function() {
      this.$refs.grdAccount.ej2Instances.toolbarModule.enableItems(["grdAccount_btnSave"], false); //Disable toolbar items.
    },
    grdAccount_checkBoxChange: function() {
      this.$refs.grdAccount.ej2Instances.toolbarModule.enableItems(["grdAccount_btnSave"], true); //Enable toolbar items.
    },
    grdAccount_onSave: function(args) {
      if (args.item.id === "grdAccount_btnSave") {
        let currentSelectAccounts = this.$refs.grdAccount.getSelectedRecords();
        window.axios
          .put("/role/UpdateAccounts", {
            No: this.data.No,
            Items: currentSelectAccounts,
          })
          .then(() => {
            this.$refs.grdAccount.ej2Instances.toolbarModule.enableItems(["grdAccount_btnSave"], false); //Disable toolbar items.
            Swal.fire({
              type: "success",
              title: "儲存成功！",
              timer: 1500,
            });
          })
          .catch(function(error) {
            Swal.fire("儲存失敗！", error, "error");
          });
      }
    },
    actionFailure: function(args) {
      Common.actionFailure(args);
    },
  },
  mounted: function() {
    this.dsAccount = new DataManager({
      url: configs.publicPath + "../role/Accounts?no=" + this.data.No,
      adaptor: new WebApiAdaptor(),
      crossDomain: true,
    });
    // this.dsFunction = new DataManager({
    //   url: configs.publicPath + "../role/Functions?no=" + this.data.No,
    //   adaptor: new WebApiAdaptor(),
    //   crossDomain: true
    // });
  },
};
</script>
<style>
/* .q-tab-panels {
  background-color: transparent !important;
} */
</style>
