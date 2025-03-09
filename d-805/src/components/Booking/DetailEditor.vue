<template>
  <table width="100%" cellpadding="12">
    <tbody>
      <tr>
        <td class="e-textlabel" style="width:120px;">指定檢查室</td>
        <td colspan="11">
          <!-- <input id="RoomId" class="e-field" type="hidden" :value="locationId"> -->
          <input id="CheckItemId" class="e-input" type="hidden" />
          <input ref="Duration" id="Duration" class="e-input" type="hidden" />

          <!-- <span id="LocationName" class="e-input-group"></span> -->
          <ejs-dropdownlist id="RoomId" name="RoomId" class="e-field" :readonly="true" :fields="{ text: 'Name', value: 'Id' }" :value="locationId"></ejs-dropdownlist>
        </td>
      </tr>
      <tr>
        <td class="e-textlabel">預約檢查項目</td>
        <td colspan="11">
          <span id="CheckItemName" class="e-input-group"></span>
        </td>
      </tr>
      <tr>
        <td class="e-textlabel">申請單號</td>
        <td colspan="11">
          <span id="AccessionNo" class="e-input-group"></span>
        </td>
      </tr>
      <tr>
        <td class="e-textlabel">病患姓名</td>
        <td colspan="11">
          <span id="PatientName" class="e-input-group"></span>
        </td>
      </tr>

      <tr>
        <td class="e-textlabel">電話[住家]</td>
        <td colspan="11">
          <input id="PhoneNo4Residence" name="PhoneNo4Residence" style="width:100%;" class="e-field" rows="1" />
        </td>
      </tr>

      <tr>
        <td class="e-textlabel">電話[手機]</td>
        <td colspan="11">
          <input id="PhoneNo4Mobile" name="PhoneNo4Mobile" style="width:100%;" class="e-field" rows="1" />
        </td>
      </tr>

      <tr>
        <td class="e-textlabel">電話[工作]</td>
        <td colspan="11">
          <input id="PhoneNo4Work" name="PhoneNo4Work" style="width:100%;" class="e-field" rows="1" />
        </td>
      </tr>

      <!-- <tr>
        <td class="e-textlabel">電話[手機]</td>
        <td colspan="11">
          <input id="PhoneNo4Mobile" class="e-input" v-model="data.PhoneNo4Mobile" />
        </td>
      </tr>
      <tr>
        <td class="e-textlabel">電話[工作]</td>
        <td colspan="11">
          <input id="PhoneNo4Work" class="e-input" v-model="data.PhoneNo4Work" />
        </td>
      </tr> -->
      <!-- <tr>
        <td class="e-textlabel">開單日期</td>
        <td colspan="11">{{}}</td>
      </tr>-->
      <tr>
        <td class="e-textlabel">開始時間</td>
        <td colspan="11">
          <ejs-datetimepicker
            ref="StartTime"
            id="StartTime"
            name="StartTime"
            class="e-field"
            step="5"
            v-model="data.StartTime"
            :allowEdit="false"
            :format="customFormat"
            :validationRules="{ required: true }"
            :showClearButton="false"
            :showTodayButton="false"
          ></ejs-datetimepicker>
        </td>
      </tr>
      <tr>
        <td class="e-textlabel">結束時間</td>
        <td colspan="11">
          <ejs-datetimepicker
            ref="EndTime"
            id="EndTime"
            name="EndTime"
            class="e-field"
            step="10"
            v-model="data.EndTime"
            disabled
            :format="customFormat"
            :validationRules="{ required: true }"
            :showClearButton="false"
            :showTodayButton="false"
          ></ejs-datetimepicker>
        </td>
      </tr>
      <tr>
        <td class="e-textlabel">備註</td>
        <td colspan="11">
          <textarea id="Description" name="Description" style="width:100%;" class="e-field" rows="4" v-model="data.Description"></textarea>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import Vue from "vue";
import Swal from "sweetalert2";
import { DateTimePickerPlugin } from "@syncfusion/ej2-vue-calendars";
import { MultiSelectPlugin, DropDownListPlugin } from "@syncfusion/ej2-vue-dropdowns";
import { RecurrenceEditorPlugin, RecurrenceEditorChangeEventArgs } from "@syncfusion/ej2-vue-schedule";

Vue.use(RecurrenceEditorPlugin);
Vue.use(DropDownListPlugin);
Vue.use(DateTimePickerPlugin);
Vue.use(MultiSelectPlugin);

export default {
  data() {
    return {
      data: {},
      customFormat: "HH:mm",
      locationId: null
      // selectedType: 1,
      // checkItemIds: []
    };
  },
  methods: {
    BookingSlotChange: function(args) {
      // if (
      //   this.$refs.CheckItemId.ej2Instances.dataSource.length > 0 &&
      //   this.$refs.CheckItemId.value
      // ) {
      //   var duration = this.$refs.CheckItemId.ej2Instances.dataSource.find(
      //     i => i.Id == this.$refs.CheckItemId.value
      //   ).Duration;
      if (this.$refs.Duration.value) this.data.EndTime = new Date(this.$refs.StartTime.ej2Instances.value.getTime() + this.$refs.Duration.value * 60000);
      // }
    }
  },
  watch: {
    "data.StartTime": function(newValue, oldValue) {
      this.BookingSlotChange(null);
    }
  },
  created: function() {
    window.$("div[role='dialog']").css("max-height", "");
  },
  mounted: function() {
    // if (this.data.RoomId != null && this.data.RoomId.length > 0) {
    //   this.locationId = this.data.RoomId[0];
    //   this.$refs.StartTime.ej2Instances.focusIn();
    // }

    if (this.data.RoomId != null) {
      if (this.data.RoomId instanceof Array && this.data.RoomId.length > 0) {
        this.locationId = this.data.RoomId[0];
        this.$refs.StartTime.ej2Instances.focusIn();
      } else {
        this.locationId = this.data.RoomId;
        this.$refs.StartTime.ej2Instances.focusIn();
      }
    }
  }
};
</script>

<style>
.e-clear-icon {
  display: none;
}
.booking-event-editor .e-search-icon {
  display: none !important;
}
.booking-event-editor .e-date-icon {
  display: none !important;
}
</style>
