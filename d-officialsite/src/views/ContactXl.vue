<template>
  <section class="about-us">
    <DtcXlNavWhiteBar></DtcXlNavWhiteBar>
    <div class="banner">
      <img src="contact_title.png" width="140" />
      <form>
        <!-- <div class="grid-2">
          <div class="line-1">姓名</div>
          <div class="line-1">聯絡電話</div>
          <input v-model="name" placeholder="請輸入" />
          <input v-model="phone" placeholder="請輸入" />
          <div style="grid-column:1/-1">Ｅ-MAIL</div>
          <input  v-model="email" type="email" placeholder="請輸入" style="grid-column:1/-1" class="line-2" />
          <div style="grid-column:1/-1">內容資訊</div>
          <textarea v-model="content" placeholder="請輸入" style="grid-column:1/-1" spellcheck="false" class="line-3"></textarea>
          <div>
            <vue-recaptcha sitekey="6LfljHIaAAAAALisrQ7UOUlEY7eQj5zCy0wHGLLi" :loadRecaptchaScript="true" @verify="onVerify" @expired="onExpired" />
           
          </div>
          <div @click.stop="submit">送 出</div>
        </div> -->
        <div>
          <img src="contact_text.png" />
        </div>
      </form>
      <footer>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d14463.332737550358!2d121.4843488!3d25.0057837!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0xf6166455d2a4b05d!2z5ZCI6I-v56eR5oqA6IKh5Lu95pyJ6ZmQ5YWs5Y-4!5e0!3m2!1szh-TW!2stw!4v1597717084437!5m2!1szh-TW!2stw"
          frameborder="0"
          style="border: 0;"
          allowfullscreen
          aria-hidden="false"
          tabindex="0"
        ></iframe>
      </footer>
    </div>
    <!-- <img src="mapc.png" class="dtc-body" /> -->
    <b-modal :centered="true" :title="modalData.title" :hide-footer="true" v-model="modalData.show">{{ modalData.message }}</b-modal>
  </section>
</template>

<script>
import DtcXlNavWhiteBar from '@/components/DtcXlNavWhiteBar.vue';
import VueRecaptcha from 'vue-recaptcha';
import { addContact } from "@/service/api.js";
export default {
  data() {
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
    };
  },
  components:{
    DtcXlNavWhiteBar, VueRecaptcha
  },
  methods: {
    onVerify () {
      this.isNotRobot = true;
    },
    onExpired () {

    },
    submit() {
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
  },
  watch: {
    "modalData.show" (value) {
      if (!value) {
        this.modalData.title = '';
        this.modalData.message = '';
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.about-us {
  width: 100vw;
  color: black;
  display: flex;
  flex-direction: column;
}
.dtc-body {
  display: block;
  width: 1200px;
  margin: 4rem auto;
}
.banner {
  width: 100vw;
  height: 380px;
  background: url("/contact_banner.png") no-repeat center center;
  background-size: cover;
  display: grid;
  place-items: center;
  position: relative;
  z-index: 2;
  margin-bottom: clamp(80vh, 870px, 870px);
  > img {
    transform: translateY(40px);
  }
  form {
    position: absolute;
    width: 338; // 908px
    height: 480px;
    left: 50%;
    transform: translateX(-50%);
    top: 300px;
    background: #ffffff;
    box-shadow: 0px 3px 6px #00000029;
    display: grid;
    padding: 1rem;
    grid-template-columns: 1fr 302px;
    gap: 2rem;
    z-index: 3;
    padding-left: 2rem;
    padding-right: 2rem;
  }
  footer {
    position: absolute;
    top: 840px;
    width: 100vw;
    display: grid;
    grid-template-columns: 1fr;
    background: transparent;
    iframe {
      display: inline-block;
      width: 100vw;
      height: 390px;
      z-index: 3;
    }
  }
}

footer {
  height: 90px;
  background: #242424;
  display: grid;
  place-items: center;

  main {
    width: 288px;
    display: grid;
    grid-template-columns: 1fr;
    gap: 5px;
    > div:last-child {
      font-size: 13px;
    }
    nav {
      display: grid;
      grid-template-columns: max-content 1px max-content 1px max-content;
      gap: 1rem;
      > div {
        background: white;
        height: 70%;
      }
    }
  }
  h5 {
    color: #cecece;
    font-size: 18px;
    text-align: center;
    transform: translateX(-10px);
  }
  h6 {
    color: #f2f2f2;
    cursor: pointer;
    font-size: 14px;
  }
}

.grid-2 {
  display: grid;
  color: #2b2b2b;
  font-size: 1rem;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  input {
    all: unset;
    background: #f7f7f7;
    border-radius: 2px;
    height: 38px;
    padding: 4px;
    padding-left: 10px;
  }
  textarea {
    all: unset;
    height: 130px;
    background: #f7f7f7;
    padding: 4px;
    padding-left: 10px;
  }
  > div:last-child {
    height: 50px;
    background: transparent linear-gradient(90deg, #037fe2 0%, #3e64cb 100%) 0%
      0% no-repeat padding-box;
    text-align: center;
    line-height: 50px;
    color: white;
    font-size: 17px;
    border-radius: 10px;
    cursor: pointer;
  }
}

.line-1 {
  transform: translateY(13px);
}

.line-2,
.line-3 {
  margin-top: -17px !important;
}
</style>
