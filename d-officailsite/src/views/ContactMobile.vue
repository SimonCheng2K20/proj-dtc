<template>
  <div class="contact">
    <dtc-banner title="聯絡我們" path="首頁/聯絡我們" image="ContactMobile_image/contact_banner.jpg" />
    <!-- <div class="p-4">
      <dtc-title main="CONTACT US" sub="聯絡我們" />

      <div class="input-label mt-3">姓名</div>
      <b-input type="text" class="rounded-lg px-2 py-1" v-model="name" placeholder="請輸入" />

      <div class="input-label mt-1">聯絡電話</div>
      <b-input type="text" class="rounded-lg px-2 py-1" v-model="phone" placeholder="請輸入" />

      <div class="input-label mt-1">E-MAIL</div>
      <b-input type="text" class="rounded-lg px-2 py-1" v-model="email" placeholder="請輸入" />

      <div class="input-label mt-1">內容資訊</div>
      <b-textarea v-model="content" class="rounded-lg px-2 py-1" placeholder="請輸入" />

      <div class="submit-frame mt-3">
        <div class="d-flex justify-content-center">
          <vue-recaptcha sitekey="6LfljHIaAAAAALisrQ7UOUlEY7eQj5zCy0wHGLLi" :loadRecaptchaScript="true" @verify="onVerify" @expired="onExpired" />
        </div>
        <b-button class="mt-2" variant="primary" @click.stop="submit" block>送出</b-button>
      </div> 
    </div> -->

    <div class="contact-area px-2 py-4">
      <dtc-title class="ml-3 mb-4" main="CONTACT US" sub="聯絡我們" />
      <dtc-info />
      <iframe class="w-100 google-map mb-3" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3615.833041755224!2d121.482160115467!3d25.00578854557475!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442ae7e0700d659%3A0xf6166455d2a4b05d!2z5ZCI6I-v56eR5oqA6IKh5Lu95pyJ6ZmQ5YWs5Y-4!5e0!3m2!1szh-TW!2stw!4v1613719863233!5m2!1szh-TW!2stw" frameborder="0" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0" />
    </div>
    <b-modal :centered="true" :title="modalData.title" :hide-footer="true" v-model="modalData.show">{{ modalData.message }}</b-modal>
  </div>
</template>

<script>
import dtcTitle from "@/components/dtc-title.vue";
import dtcBanner from "@/components/dtc-banner.vue";
import dtcInfo from "@/components/dtc-info.vue";
import { addContact } from "@/service/api.js";
import VueRecaptcha from 'vue-recaptcha';
export default {
  components: {
    dtcTitle, dtcBanner, dtcInfo, VueRecaptcha
  },
  data () {
    return {
      name: '',
      phone: '',
      email: '',
      content: '',
      isNotRobot: false,
      modalData: {
        show: false,
        title: '',
        message: ''
      }
    }
  },
  methods: {
    onVerify () {
      this.isNotRobot = true;
    },
    onExpired () {

    },
    submit () {
      if (!this.isNotRobot) {
        this.modalData.title = '錯誤';
        this.modalData.message = '請通過我不是機器人驗證';
        this.modalData.show = true;
        return;
      }

      addContact({
        name: this.name,
        phone: this.phone,
        email: this.email,
        content: this.content
      }).then(() => {
        this.modalData.title = '新增成功';
        this.modalData.message = '謝謝您的留言，我們會進快連絡您';
        this.modalData.show = true;
        ['name', 'phone', 'email', 'content'].forEach(k => this[k] = '');

      }).catch(err => {
        this.modalData.title = '新增失敗';
        this.modalData.message = '請稍候再試，或直接電話連絡我們 (02)2225-0891';
        this.modalData.show = true;
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.contact {
  color: #333;
  .input-label {
    font-size: .9rem;
    font-weight: bold;
  }
  .form-control-plaintext {
    background-color: #efefef;
  }
  .submit-frame {
    // display: grid;
    // grid-gap: 5px;
    // grid-template-columns: repeat(2, 1fr);
  }
  .contact-area {
    background-color: #eee;
  }
}

</style>
