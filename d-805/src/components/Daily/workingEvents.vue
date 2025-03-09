<template>
  <div class="events d-flex pl-1 pt-1 flex-wrap">
    <!-- <div
      class="text-black bg-warning px-1 rounded w-100 text-center"
      v-if="overItems.length > 0"
      v-text="'上一時段佔用: ' + overItems.map(({PatientName})=> PatientName).join(',')"
    >

    </div> -->
    <outEvents
      v-if="overItems.length > 0"
      :patients="overItems"
    />
    <event
      v-for="(e,i) in items"
      :key="i"
      :content="e.Subjective"
      :state="e.Status"
      :patient="e"
      @clickedPatient="clickedSinglePatient"
    />

  </div>
</template>

<script>
import event from './workingEvent.vue';
import outEvents from "./overTimeEvents.vue";
export default {
  data () {
    return {

    }
  },
  props: {
    items: {
      type: Array,
      default: new Array()
    },
    overItems: {
      type: Array,
      default: []
    }
  },
  components: {
    event, outEvents
  },
  methods: {
    clickedSinglePatient (patient) {
      this.$emit('handlePatientState', patient);
    }
  }
}
</script>
