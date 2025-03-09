<template>
  <div class="contact-content mb-4 mx-auto">
    
    <div><b-img src="contactMobile_image/phone.png" class="w-100" /></div>
    <div class="cc-title d-flex justify-content-between pl-1" v-html="createSpan('聯絡電話')" />
    <div>:</div>
    <div>(02)2225-0891</div>
    
    <div><b-img src="contactMobile_image/sending.png" class="w-100" /></div>
    <div class="cc-title d-flex justify-content-between pl-1" v-html="createSpan('傳真')" />
    <div>:</div>
    <div>(02)2225-0896</div>
    
    <div><b-img src="contactMobile_image/fix.png" class="w-100" /></div>
    <div class="cc-title d-flex justify-content-between pl-1" v-html="createSpan('維修電話')" />
    <div>:</div>
    <div>0800-500-019(24hr客服專線)</div>
    
    <div><b-img src="contactMobile_image/location.png" class="w-100" /></div>
    <div class="cc-title d-flex justify-content-between pl-1" v-html="createSpan('地址')" />
    <div>:</div>
    <div>新北市中和區中正路866號15樓</div>

  </div>
</template>

<script>
export default {
  methods: {
    createSpan(str) {
      return str.split('').map(s => `<span>${s}</span>`).join('');
    }
  }
}
</script>

<style lang="scss" scoped>

.contact-content {
  display: grid;
  grid-template-columns: 12px 75px 10px 1fr;
  color: #5d5d5d;
  font-size: .8rem;
  font-weight: bold;
  width: fit-content;
}

</style>
