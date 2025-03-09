<template>
  <div class="date-text" v-html="getDateHeaderText(data.date)"></div>
</template>
<script>
import { Internationalization } from "@syncfusion/ej2-base";
var instance = new Internationalization();

export default {
  data() {
    return {
      data: {}
    };
  },
  methods: {
    getDateHeaderText: function(Date) {
      return instance.formatDate(Date, { skeleton: "E" });
    }
  }
};
</script>
