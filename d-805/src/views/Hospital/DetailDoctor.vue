<template>
  <div>
    <ejs-grid
      ref="grdDoctor"
      :dataSource="dsDoctor"
      height="385"
      :toolbar="['Add']"
      :editSettings="editSettings"
      :actionBegin="actionBegin"
      :actionComplete="actionComplete"
      :actionFailure="actionFailure"
    >
      <e-columns>
        <e-column field="Id" :isPrimaryKey="true" :visible="false"></e-column>
        <e-column field="InstitutionId" :visible="false"></e-column>
        <e-column field="DoctorName" headerText="醫師姓名" :validationRules="{ required: true }"></e-column>
        <e-column headerText :commands="commands" width="120" :allowResizing="false"></e-column>
      </e-columns>
    </ejs-grid>
  </div>
</template>

<script>
import { Sort, Toolbar, Page, Edit, CommandColumn } from "@syncfusion/ej2-vue-grids";
import { DataManager, WebApiAdaptor } from "@syncfusion/ej2-data";
import * as configs from "@/config";
import Swal from "sweetalert2";
import Common from "../../library/Common";

export default {
  data() {
    return {
      data: {},
      dsDoctor: [],
      editSettings: {
        allowEditing: true,
        allowAdding: true,
        allowDeleting: true,
        mode: "Dialog",
        showConfirmDialog: true,
        showDeleteConfirmDialog: true,
      },
      commands: [
        {
          type: "Edit",
          buttonOption: {
            iconCss: " e-icons e-edit",
            cssClass: "e-flat",
          },
        },
        { type: "Delete", buttonOption: { cssClass: "e-flat", iconCss: "e-delete e-icons" } },
      ],
    };
  },
  provide: {
    grid: [Sort, Page, Toolbar, Edit, CommandColumn],
  },
  methods: {
    actionBegin(args) {
      let _this = this;
      if (args.requestType === "add") {
        args.data.InstitutionId = this.data.Id;
      }
      if (args.requestType === "delete") {
        // args.data.InstitutionId = this.data.Id + "," + args.data.DoctorName;
        window.axios.delete("/api/HospitalDoctor?id=" + args.data[0].Id).then((e) => {
          _this.$refs.grdDoctor.ej2Instances.refresh();
        });
        args.cancel = true;
      }
    },
    actionComplete(args) {
      // if (args.requestType === "add") {
      //   args.data.InstitutionId = this.data.Id;
      // }
    },
    actionFailure: function(args) {
      Common.actionFailure(args);
    },
  },
  mounted: function() {
    this.dsDoctor = new DataManager({
      url: `${configs.publicPath}../api/HospitalDoctor?$filter=InstitutionId eq ${this.data.Id}`,
      adaptor: new WebApiAdaptor(),
      crossDomain: true,
    });
  },
};
</script>
<style></style>
