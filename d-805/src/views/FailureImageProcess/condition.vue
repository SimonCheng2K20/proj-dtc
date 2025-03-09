<template>
  <card-frame title="搜尋條件">
    <b-card-text>
      <div class="d-flex">
        <div
          class="flex-1 d-grid grid-col-4 px-1"
          style="grid-gap: 2px;"
        >
          <b-input-group prepend="檢查日期">
            <div
              id="checkDataPicker"
              class="form-control"
              style="padding: 0px 0px ;"
            >
              <ejs-daterangepicker v-model="condition.dateTime"></ejs-daterangepicker>
            </div>
          </b-input-group>

          <b-input-group prepend="檢查單號">
            <b-input v-model="condition.accessionNo" />
          </b-input-group>

          <b-input-group prepend="病歷號">
            <b-input v-model="condition.orderNo" />
          </b-input-group>

          <b-input-group prepend="病患姓名">
            <b-input v-model="condition.patientName" />
          </b-input-group>
        </div>
        <div class="search-action d-flex align-items-end">
          <b-button
            class="mr-1"
            variant="primary"
            @click.stop="$emit('search', condition)"
          >
            <font-awesome-icon
              icon="search"
              class="mr-1"
            />查詢</b-button>
          <b-button
            variant="success"
            @click.stop="clearCondition"
          >
            <font-awesome-icon
              icon="eraser"
              class="mr-1"
            />清除</b-button>
        </div>
      </div>

      <!-- <b-form-file
        ref="file-input"
        multiple
        v-model="files"
        accept="image/jpeg, image/png, image/gif"
      />

      <div
        v-for="file in files"
        :key="file.name"
        v-text="file.name"
      /> -->
    </b-card-text>
  </card-frame>

  <!-- <b-card
    header-bg-variant="primary"
    header-text-variant="white"
    header-class="p-1 px-2"
    body-class="p-1"
  >
    <template v-slot:header>
      <div>搜尋條件</div>
    </template>
    

  </b-card> -->
</template>

<script>
import Vue from "vue";
import { DateRangePickerPlugin } from "@syncfusion/ej2-vue-calendars";
Vue.use(DateRangePickerPlugin);
export default {
  data () {
    return {
      condition: {
        dateTime: null,
        accessionNo: null,
        orderNo: null,
        patientName: null
      }
    }
  },
  methods: {
    clearCondition () {
      Object.keys(this.condition).forEach(k => {
        this.condition[k] = null;
      });
    }
  }
}
</script>

<style lang="scss">
</style>
