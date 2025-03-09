<template>
  <CardiacFrame>
    <b-input-group prepend="導管號碼" class="required">
      <b-input />
    </b-input-group>

    <b-input-group v-if="withStorage" prepend="組織庫" class="required">
      <b-form-select
        :options="[
          { value: null, text: 'Please select an option' },
          { value: 'a', text: 'This is First option' },
          { value: 'b', text: 'Selected Option' }
        ]"
      ></b-form-select>
    </b-input-group>

    <b-input-group v-if="withDate" prepend="日期" class="required d-flex">
      <div class="date-picker">
        <ejs-datepicker
          ref="StartTime"
          id="StartTime"
          name="StartTime"
          class="e-field"
          step="5"
          :allowEdit="false"
          format="YYYY-MM-DD"
          :validationRules="{ required: true }"
          :showClearButton="false"
          :showTodayButton="false"
        />
      </div>
    </b-input-group>
  </CardiacFrame>
</template>

<script>
import CardiacFrame from './frame'
export default {
  data() {
    return {}
  },
  props: {
    withStorage: {
      type: Boolean,
      default: true
    },
    withDate: {
      type: Boolean,
      default: true
    }
  },
  components: {
    CardiacFrame
  }
}
</script>

<style lang="scss">
.date-picker {
  flex: 1 0 0;

  > span {
    height: 100%;
    border-radius: 0 5px 5px 0 !important;
  }
}
</style>
