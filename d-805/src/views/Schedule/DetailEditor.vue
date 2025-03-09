<template>
  <table class="custom-event-editor" width="100%" cellpadding="12">
    <tbody>
      <tr>
        <td class="e-textlabel" style="width:80px;">檢查項目</td>
        <td colspan="11">
          <input id="Subject" class="e-field e-input" type="text" name="Subject" readonly />
        </td>
      </tr>
      <tr>
        <td class="e-textlabel" style="width:80px;">病人來源</td>
        <td colspan="5">
          <ejs-dropdownlist
            ref="ValueSet"
            id="ValueSet"
            name="ValueSet"
            class="e-field"
            placeholder="Choose status"
            :fields="{ text: 'label', value: 'value' }"
            :dataSource="[{ label: '', value: '' }]"
            @select="selectValueSet_select"
          ></ejs-dropdownlist>
        </td>
        <td class="e-textlabel" style="width:80px;">申請單號</td>
        <td colspan="5">
          <ejs-dropdownlist
            ref="ValueSet"
            id="ValueSet"
            name="ValueSet"
            class="e-field"
            placeholder="Choose status"
            :fields="{ text: 'label', value: 'value' }"
            :dataSource="[{ label: '', value: '' }]"
            @select="selectValueSet_select"
          ></ejs-dropdownlist>
        </td>
      </tr>
      <tr>
        <td class="e-textlabel">開單日期</td>
        <td colspan="5">
          <input id="X" class="e-field e-input" type="text" name="X" value="2018/10/10" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import Vue from "vue";
import { DateTimePickerPlugin } from "@syncfusion/ej2-vue-calendars";
import { DropDownListPlugin } from "@syncfusion/ej2-vue-dropdowns";
import { RecurrenceEditorPlugin } from "@syncfusion/ej2-vue-schedule";

Vue.use(RecurrenceEditorPlugin);
Vue.use(DropDownListPlugin);
Vue.use(DateTimePickerPlugin);
export default {
  data() {
    return {
      data: {},
      customFormat: "HH:mm",
      step: 5,
      selectedType: 1,
      StartTime: new Date(),
      EndTime: new Date(),
      RepeatRules: [
        { label: "", value: null },
        { label: "由開始時間重複此時段排滿整天", value: "SlotRepeatOneDay" },
        { label: "每日重複此時段", value: "DayRepeat" },
        { label: "每週重複此時段", value: "WeekRepeat" }
      ]
    };
  },
  methods: {
    StartTime_change: function() {
      if (this.$refs.ValueSet.ej2Instances.value == null) return;
      let duration =
        this.$refs.ValueSet.ej2Instances.value.split("@")[1] * 60000;
      let StartTime = this.$refs.StartTime.ej2Instances;
      let EndTime = this.$refs.EndTime.ej2Instances;
      let end = new Date(StartTime.value);

      end.setMilliseconds(StartTime.value.getMilliseconds() + duration);
      EndTime.value = end;
    },
    selectValueSet_select: function(e) {
      let duration = e.itemData.value.split("@")[1] * 60000;
      let StartTime = this.$refs.StartTime.ej2Instances;
      let EndTime = this.$refs.EndTime.ej2Instances;
      let end = new Date(StartTime.value);

      end.setMilliseconds(StartTime.value.getMilliseconds() + duration);
      EndTime.value = end;
      // this.EndTime = EndTime.value
    },

    disableDate: function(args) {
      args.isDisabled = true;
    }
  }
};
</script>

<style>
.e-clear-icon {
  display: none;
}
</style>
