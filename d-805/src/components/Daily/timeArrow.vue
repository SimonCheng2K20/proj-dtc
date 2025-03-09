<template>
  <div class="d-flex">
    <b-icon
      icon="arrow-left-short"
      class="cursor-pointer"
      :font-scale="fontScale"
      @click="modifyDate('subtract')"
    />
    <ejs-datepicker
      v-model="aDate"
      ref="StartTime"
      step="5"
      :allowEdit="true"
      :showClearButton="false"
      :showTodayButton="true"
      @change="changeDate"
    />
    <b-icon
      icon="arrow-right-short"
      class="cursor-pointer"
      :font-scale="fontScale"
      @click="modifyDate('add')"
    />
  </div>
</template>

<script>
export default {
  props: {
    date: {
      type: Date
    },
    fontScale: {
      type: Number,
      default: 3
    }
  },
  data () {
    return {
      aDate: this.date
    }
  },
  methods: {
    modifyDate (method) {
      this.aDate = this.$moment(this.aDate)[method](1, 'days').toDate();
      // this.$emit('changeDate', this.aDate);
    },
    changeDate () {
      this.$emit('changeDate', this.aDate);
    }
  }
}
</script>
