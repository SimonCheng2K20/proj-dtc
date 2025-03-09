<template>
  <div class="rounded mb-1 over-event d-flex align-items-center bg-secondary text-black rounded pl-1 pb-1 out-time w-100 mr-1">
    <div class="text-white pr-1">上一時<br />段佔用</div>
    <div class="flex-1 d-flex flex-wrap">
      <div
        class="px-1 mt-1 mr-1 bg-warning rounded"
        v-for="patient in patients"
        :key="'out_' + patient.AccessionNo"
      >
        <div
          class="border-bottom"
          style="border-bottom-color: #000 !important;"
        >
          <span v-text="patient.PatientName" />-{{patient.AccessionNo}}
        </div>
        <div class="d-flex justify-content-between">
          <span v-text="$moment(patient.ScheduleTime).format('HH:mm')" />
          ~
          <span v-text="$moment(patient.ScheduleEndTime).format('HH:mm')" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {

    };
  },
  creatd () {

  },
  props: {
    patients: {
      type: Object,
      default: new Object()
    }
  },
  methods: {

  }

};
</script>

<style lang="scss" scoped>
.out-time {
  font-size: 12px;
}
</style>
