<template>
  <table
    class="custom-event-editor default"
    width="100%"
    cellpadding="6"
  >
    <tbody>
      <tr>
        <td
          class="e-textlabel"
          style="width:150px;"
        >時段類型</td>
        <td>
          <ejs-dropdownlist
            ref="Type"
            id="Type"
            name="Type"
            class="e-field"
            placeholder="選擇時段類型"
            :validationRules="{ required: true }"
            :fields="{ text: 'label', value: 'value' }"
            :dataSource="[
              { label: '85歲以上優先', value: 0 },
              { label: '停用(維修、保養...)', value: 1 },
              { label: '限制可檢查項目(正向表列)、來源', value: 2 },
              { label: '限制不可檢查項目(負向表列)、來源', value: 3 },
              { label: '檢查項目直接預約格', value: 10 },
              { label: '保留時段', value: 99 },
            ]"
            @change="selectType_change"
            v-model="data.Type"
          ></ejs-dropdownlist>
          <input
            id="Id"
            class="e-field e-input"
            type="text"
            name="Id"
            style="display: none;"
          />
          <input
            ref="isMri"
            id="isMri"
            name="isMri"
            class="e-field e-input"
            type="text"
            style="display: none;"
          />
          <input
            id="TypeName"
            class="e-field e-input"
            type="text"
            name="TypeName"
            style="display: none;"
            v-model="data.TypeName"
          />
          <!-- <input id="CheckItemName" class="e-field e-input" type="text" name="CheckItemName" style="display: none;" /> -->
          <input
            id="CheckItemNames"
            class="e-field e-input"
            type="text"
            name="CheckItemNames"
            style="display: none;"
            v-model="data.CheckItemNames"
          />
        </td>
      </tr>
      <tr v-show="data.Type == 99">
        <td
          class="e-textlabel"
          colspan="2"
          style="text-align: center;"
        >
          ------------ 釋放保留時段後限制可檢查項目、來源 ------------
        </td>
      </tr>
      <tr v-show="showDirects || showDirect">
        <td
          ref="CheckItemLabel"
          class="e-textlabel"
          v-show="showDirects"
        >指定可檢查項目<br />(空則不限制)</td>
        <td
          class="e-textlabel"
          v-show="showDirect"
        >指定檢查項目</td>
        <td>
          <ejs-multiselect
            ref="CheckItemIds"
            id="CheckItemIds"
            name="CheckItemIds"
            class="e-field"
            placeholder="選擇檢查項目"
            :fields="{ text: 'Name', value: 'Id', groupBy: 'CheckCategoryName' }"
            v-model="data.CheckItemIds"
            mode="CheckBox"
            :enableSelectionOrder="false"
            filterBarPlaceholder="搜尋檢查項目"
            :enableGroupCheckBox="true"
            @change="checkItemIds_change"
          ></ejs-multiselect>
        </td>
      </tr>
      <tr v-show="showDirects || showDirect">
        <td class="e-textlabel">允許就診來源<br />(空則不限制)</td>
        <td>
          <ejs-multiselect
            ref="ExamineSources"
            id="ExamineSources"
            name="ExamineSources"
            class="e-field"
            placeholder="指定就診來源"
            mode="Box"
            :allowFiltering="false"
            :fields="{ text: 'Name', value: 'Id' }"
            :dataSource="dsExamineSource"
            v-model="data.ExamineSources"
          ></ejs-multiselect>
        </td>
      </tr>
      <tr v-show="showDirects || showDirect">
        <td class="e-textlabel">就診來源解鎖天數</td>
        <td>
          <ejs-dropdownlist
            ref="FreeDays"
            id="FreeDays"
            name="FreeDays"
            class="e-field"
            placeholder="選擇天數…"
            :fields="{ text: 'label', value: 'value' }"
            :dataSource="freeDays"
            v-model="data.FreeDays"
          ></ejs-dropdownlist>
        </td>
      </tr>
      <tr v-show="showMriDuration">
        <td class="e-textlabel">允許檢查分鐘數</td>
        <td>
          <ejs-dropdownlist
            ref="Duration"
            id="Duration"
            name="Duration"
            class="e-field"
            placeholder="選擇分鐘數…"
            :fields="{ text: 'label', value: 'value' }"
            :dataSource="[
              { label: '不限制', value: 0 },
              { label: '20', value: 20 },
              { label: '30', value: 30 },
            ]"
            v-model="data.Duration"
            :change="DurationOnChange"
          ></ejs-dropdownlist>
        </td>
      </tr>
      <tr v-show="showDirects || showDirect">
        <td class="e-textlabel">年齡限制</td>
        <td>
          <ejs-dropdownlist
            ref="IsOld"
            id="IsOld"
            name="IsOld"
            class="e-field"
            :showClearButton="true"
            placeholder="選擇年齡…"
            :fields="{ text: 'label', value: 'value' }"
            :dataSource="[
              { label: '85歲以上', value: true },
              { label: '85歲以下', value: false },
            ]"
            v-model="data.IsOld"
          ></ejs-dropdownlist>
        </td>
      </tr>
      <tr>
        <td class="e-textlabel">開始時間</td>
        <td>
          <ejs-datetimepicker
            ref="StartTime"
            id="StartTime"
            class="e-field"
            name="StartTime"
            v-model="data.StartTime"
            step="5"
            :allowEdit="false"
            :validationRules="{ required: true }"
            :format="customFormat"
            :showClearButton="false"
            :showTodayButton="false"
          ></ejs-datetimepicker>
        </td>
      </tr>
      <tr>
        <td class="e-textlabel">結束時間</td>
        <td>
          <ejs-datetimepicker
            ref="EndTime"
            id="EndTime"
            name="EndTime"
            class="e-field"
            step="5"
            :allowEdit="false"
            :min="data.StartTime"
            v-model="data.EndTime"
            :format="customFormat"
            :validationRules="{ required: true }"
            :showClearButton="false"
            :showTodayButton="false"
          ></ejs-datetimepicker>
        </td>
      </tr>
      <tr>
        <td class="e-textlabel">備註</td>
        <td>
          <textarea
            id="Description"
            class="e-field e-input"
            name="Description"
            style="width:100%;"
            placeholder="輸入提示備註資訊"
            rows="3"
          ></textarea>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import Vue from "vue";
import { DateTimePickerPlugin } from "@syncfusion/ej2-vue-calendars";
import { DropDownListPlugin, MultiSelectPlugin, CheckBoxSelection } from "@syncfusion/ej2-vue-dropdowns";
import { CheckBoxPlugin } from "@syncfusion/ej2-vue-buttons";
import { RecurrenceEditorPlugin } from "@syncfusion/ej2-vue-schedule";
import { TextBoxPlugin } from "@syncfusion/ej2-vue-inputs";

Vue.use(TextBoxPlugin);
Vue.use(RecurrenceEditorPlugin);
Vue.use(DropDownListPlugin);
Vue.use(MultiSelectPlugin);
Vue.use(DateTimePickerPlugin);
Vue.use(CheckBoxPlugin);

export default {
  data () {
    return {
      data: {},
      customFormat: "HH:mm",
      dsExamineSource: [
        { Id: "O", Name: "門診" },
        { Id: "G", Name: "健檢" },
        { Id: "E", Name: "急診" },
        { Id: "I", Name: "住院" },
        { Id: "Z", Name: "轉檢" },
        { Id: "T", Name: "轉診" }
      ],
      freeDays: [
        { label: "不解鎖", value: 0 },
        { label: "1天", value: 1 },
        { label: "2天", value: 2 },
        { label: "3天", value: 3 },
        { label: "4天", value: 4 },
        { label: "5天", value: 5 },
        { label: "6天", value: 6 },
        { label: "7天", value: 7 },
      ],
      //Show -- 85歲以上優先
      showSource: false,
      //Show -- 限制可檢查項目、來源(正向表列 or 負向表列)
      showDirects: false,
      //Show -- 檢查項目直接預約格
      showDirect: false,
      //
      endTimeDisabled: true,
      showMriDuration: false,
      filterBarPlaceholder: "",
    };
  },
  provide: {
    multiselect: [CheckBoxSelection],
  },
  // computed() {
  //   console.log(this.data);
  // },
  methods: {
    selectType_change: function (e) {
      if (e.itemData == null) return;
      // this.$refs.EndTime.ej2Instances.enabled = this.data.Type != 10 && !this.data.IsMri && this.data.Duration > 0;
      if (e.itemData.value == 2 || e.itemData.value == 3 || e.itemData.value == 99) {
        this.showDirects = true;
        this.showDirect = false;
        this.showSource = true;
        this.data.ExamineSources = [];
        if (this.$refs.isMri.value == "1") this.data.IsMri = true;
        if (this.data.IsMri) this.showMriDuration = true;
        this.SpecialTimeChange();
      } else if (e.itemData.value == 10) {
        this.showDirects = false;
        this.showDirect = true;
        this.data.ExamineSources = [];
        this.showSource = true;
        this.showMriDuration = false;
      } else {
        this.showDirects = false;
        this.showDirect = false;
        this.showSource = e.itemData.value == 0;
        this.showMriDuration = false;
        this.SpecialTimeChange();
      }

      // if (this.data.IsMri) {
      //   this.SpecialTimeChange();
      // }
      this.data.TypeName = e.itemData.label;
    },
    checkItemIds_change: function (e) {
      if (e.value == null || e.value.length == 0) return;
      let ds = this.$refs.CheckItemIds.ej2Instances.dataSource;
      let checkItemNames = [];
      e.value.forEach((i) => {
        ds.some((j) => {
          if (j.Id == i) {
            checkItemNames.push(j.Name);
            return true;
          }
        });
      });

      this.data.CheckItemNames = checkItemNames.join(",");

      this.SpecialTimeChange();
    },
    SpecialTimeChange: function () {
      this.$refs.EndTime.ej2Instances.enabled = this.data.Type != 10 && (!this.data.IsMri || this.data.Duration == 0);
      let _this = this;
      if (this.data.Type === 10) {
        var checkItem = null;
        this.$refs.CheckItemIds.ej2Instances.dataSource.forEach((c) => {
          _this.data.CheckItemIds.forEach((c2) => {
            if (c2 == c.Id && (checkItem == null || c.Duration > checkItem.Duration)) {
              checkItem = c;
            }
          });
        });
        if (checkItem) {
          var duration = checkItem.Duration;
          if (this.$refs.StartTime.ej2Instances.value) this.data.EndTime = new Date(this.$refs.StartTime.ej2Instances.value.getTime() + duration * 60000);
        }
      } else if (this.data.IsMri && this.data.Duration > 0) {
        this.data.EndTime = new Date(this.$refs.StartTime.ej2Instances.value.getTime() + 60 * 60000);
      }
    },
    DurationOnChange () {
      this.SpecialTimeChange();
    },
  },
  watch: {
    "data.StartTime": function (newValue) {
      if (this.data.EndTime < newValue) this.data.EndTime.setMinutes(newValue.getMinutes() + 10);
      this.SpecialTimeChange();
    },
    "data.CheckItemIds": function (newValue) {
      console.log(newValue);
    },
  },
  mounted () {
    if (this.data.Type == null) {
      this.$refs.Type.ej2Instances.index = 0;
      // this.$refs.Duration.ej2Instances.index = 0;
      // this.$refs.FreeDays.ej2Instances.index = 0;
      // this.$refs.IsOld.ej2Instances.index = 0;
      this.data.Duration = 0;
      this.data.FreeDays = 0;
      // this.data.IsOld = null;
    }

    if (this.data.CheckItemIds && this.data.CheckItemIds.length > 0 && Number.isInteger(this.data.CheckItemIds[0])) {
      this.data.CheckItemIds = this.data.CheckItemIds.map((i) => {
        return i.toString();
      });
    }

    this.showDirects = this.data.Type == 2 || this.data.Type == 3 || this.data.Type == 99;
    if (this.data.Type == 3) this.$refs.CheckItemLabel.innerHTML = "指定不可檢查項目<br />(空則不限制)";
    if (this.data.IsMri) this.showMriDuration = true;
    this.showDirect = this.data.Type == 10;
    this.showSource = this.data.Type != 1;
  },
};
</script>
<style>
.custom-event-editor .e-date-icon {
  display: none !important;
}
</style>
