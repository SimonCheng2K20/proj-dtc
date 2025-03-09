<template>
  <div>
    <toggle-button
      ref="toggleView"
      @change="togglePatientDetailView"
      :value="getToggleReport.patientDetail"
      :key="'patientDetail_' + getToggleReport.patientDetail"
      color="#3545dc"
      :font-size="14"
      :height="24"
      :width="120"
      :labels="{ checked: '顯示病患詳情', unchecked: '顯示病患詳情' }"
      style="margin: 0 5px;"
    />
    <toggle-button
      ref="toggleView"
      class="mr-1"
      @change="toggleDetailView"
      :value="getToggleReport.reportDetail"
      :key="'reportDetail_' + getToggleReport.reportDetail"
      color="#dc3545"
      :font-size="14"
      :height="24"
      :width="100"
      :labels="{ checked: '顯示詳情', unchecked: '顯示詳情' }"
      style="margin: 0 5px;"
    />
    <toggle-button
      ref="toggleView"
      class="ml-1"
      @change="toggleNavigation"
      :value="getToggleReport.navigation"
      :key="'navigation_' + getToggleReport.navigation"
      color="#35dc45"
      :font-size="14"
      :height="24"
      :width="100"
      :labels="{ checked: '顯示頭部', unchecked: '顯示頭部' }"
      style="margin: 0 5px;"
    />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  data () {
    return {
      toggleTime: Date.now()
    }
  },
  computed: {
    ...mapGetters(["getToggleReport"]),
  },
  methods: {
    ...mapMutations(["SET_REPORT_TOGGLE"]),
    toggleDetailView () {
      if (this.toggleTime + 250 > Date.now()) return;
      this.toggleTime = Date.now();
      this.SET_REPORT_TOGGLE({ key: "reportDetail", value: !this.getToggleReport.reportDetail });
    },
    togglePatientDetailView () {
      if (this.toggleTime + 250 > Date.now()) return;
      this.toggleTime = Date.now();
      this.SET_REPORT_TOGGLE({ key: "patientDetail", value: !this.getToggleReport.patientDetail });
    },
    toggleNavigation () {
      if (this.toggleTime + 250 > Date.now()) return;
      this.toggleTime = Date.now();
      this.SET_REPORT_TOGGLE({ key: "navigation", value: !this.getToggleReport.navigation });
    },
  }
}
</script>
