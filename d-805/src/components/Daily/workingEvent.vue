<template>
  <div class="rounded text-light mr-1 mb-1 work-event">
    <b-button
      :id="patient.AccessionNo"
      @click="clickEvent"
      class="text-left text-bold"
      :class="'status' + patient.Status"
      :variant="
        patient.Status === '12'
          ? 'primary'
          : patient.Status === '11'
          ? 'danger'
          : 'light'
      "
    >
      <span
        class="title text-black"
        :class="{ 'text-danger text-bold': patient.EmgFlag === 'R' }"
      >
        {{ patient.PatientName }}
        <font v-text="patient.StatusName" />
      </span>
      <span class="content" v-text="patient.ProcedureName" />
      <span
        class="content"
        v-text="
          '開始: ' + $moment(patient.ScheduleTime).format('YYYY-MM-DD HH:mm')
        "
      />
      <span
        v-if="patient.ScheduleEndTime"
        class="content"
        v-text="
          '結束: ' + $moment(patient.ScheduleEndTime).format('YYYY-MM-DD HH:mm')
        "
      />

      <span class="content"
        >櫃檯報到時間:
        {{
          patient.CounterRegister
            ? $moment(patient.CounterRegister).format("YYYY-MM-DD HH:mm")
            : "--"
        }}</span
      >
    </b-button>

    <b-popover :target="patient.AccessionNo" triggers="hover">
      <template v-slot:title>
        <font class="text-black">{{ patient.ProcedureName }}</font>
      </template>
      <div class="text-bold" v-html="patientInfo"></div>
    </b-popover>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userData: null,
    };
  },
  creatd() {
    this.userData = this.patient;
  },
  props: {
    patient: {
      type: Object,
      default: new Object(),
    },
  },
  methods: {
    clickEvent() {
      this.$emit("clickedPatient", this.patient);
    },
  },
  computed: {
    patientInfo() {
      return (
        this.$moment(this.patient.ScheduleTime).format("YYYY-MM-DD HH:mm:ss") +
        "<br/>" +
        this.$moment(this.patient.ScheduleEndTime).format(
          "YYYY-MM-DD HH:mm:ss"
        ) +
        "<br/>" +
        this.patient.StatusName +
        "<br/>" +
        this.patient.AccessionNo
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.work-event {
  span {
    display: block;
    line-height: 1;
    &.title {
      border-bottom: 1px solid #666;
      padding-bottom: 3px;
      margin-bottom: 3px;
      word-break: break-all;
      font {
        font-size: 11px;
        white-space: nowrap;
      }
    }
    &.content {
      font-size: 12px;
    }
  }
  .status21 {
    span {
      &.title {
        border-bottom: 1px solid #aaa;
        color: #333;
      }
      &.content {
        color: #333;
      }
    }
  }
}
/deep/ .tooltip {
  bottom: 200%;
}
</style>
