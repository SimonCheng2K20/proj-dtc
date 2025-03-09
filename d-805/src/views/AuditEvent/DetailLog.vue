<template>
  <div style="background-color: #fefbd8; max-height:100%; max-height:300px;overflow: scroll;">
    {{message}}
  </div>
</template>

<script>


export default {
  data() {
    return {
      data: {},
      message: ""
    };
  },
  methods: {
    actionComplete: function(args) {
    },
    actionFailure: function(args) {
    }
  },
  mounted: function() {
    let _this = this;
        window.axios.get("/AuditEvent/Data?id=" + this.data.Id).then(e => {
          if (e != null) {
            _this.message = e
          }
        });
  }
};
</script>
<style></style>
