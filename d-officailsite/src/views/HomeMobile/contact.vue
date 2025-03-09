<template>
  <div class="contact pt-4 px-2">
    <div class="d-table mx-auto">
      <div class="contact-title pb-1 d-flex">
        <div class="main mr-1">INFORMATION</div>
        <div class="sub">聯絡資訊</div>
      </div>
    </div>
    <iframe class="w-100 google-map my-3" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3615.833041755224!2d121.482160115467!3d25.00578854557475!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442ae7e0700d659%3A0xf6166455d2a4b05d!2z5ZCI6I-v56eR5oqA6IKh5Lu95pyJ6ZmQ5YWs5Y-4!5e0!3m2!1szh-TW!2stw!4v1613719863233!5m2!1szh-TW!2stw" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0" />
    <dtc-info />
  </div>
</template>

<script>
import dtcInfo from "@/components/dtc-info.vue";
export default {
  components: {
    dtcInfo
  },
  data () {
    return {
      
    }
  },
  methods: {
    createSpan(str) {
      return str.split('').map(s => `<span>${s}</span>`).join('');
    }
  }
}




</script>

<style lang="scss" scoped>
.contact {
  .contact-title {
    border-bottom: 3px solid #3E63CB;
    font-weight: bold;
    font-size: 1.25rem;
    .main {
      color: #3E63CB;
    }
    .sub {
      color: #5D5D5D;
    }
  }
}

.d-grid {
  display: grid;
}

</style>
