<template>
  <div class="auth-footer">
    <version class="version" :time="versionTime" />
    <div class="wording">
      <div class="word1">
        本網站為衛生福利部護理及健康照護司版權所有，未經允許不得以任何形式複製和採用。Copyright © 2022
        <span class="commonqa">
          <span class="word" style="display: flex" @click="showCommonQaModal">
            常見問題
            <i class="pi pi-question-circle mt-1 ml-1" style="font-size: 14px"></i>
          </span>
        </span>
      </div>
      <div class="word2">本網站建議使用Chrome瀏覽器瀏覽並搭配 1920 x 1080 (以上)之螢幕解析度，以獲得最佳瀏覽體驗。</div>
    </div>
    <div class="dtc-logo"><img src="/assets/dtc_logo.svg" /></div>

    <Dialog class="custom-modal2" v-model:visible="qaModalIsShow" style="width: 60vw" :modal="false" :draggable="false"
      @show="getData">
      <template #header>
        <h3>常見問題(FAQ)</h3>
      </template>
      <div class="px-10 main-qa">
        <div class="flex justify-between main-qa-title">
          <div class="big-title">常見問題分類</div>
          <Dropdown v-model="catagory" :options="catagoryOptions" placeholder="選擇分類"
            style="padding-top: 0px; height: 37px; min-width: 420px" optionLabel="text" optionValue="value" class="mr-8"
            position="top" @change="setData" />
        </div>

        <hr class="mt-2 mb-5 bighr" />
        <div class="main-qa-content" v-for="(item, index) in qaItems" :key="index">
          <hr class="conent" />
          <div class="mt-2 dtc-qa-grid">
            <div class="avator" style="background: #1b6ab0">Q</div>
            <div style="cursor: pointer; font-weight: 600" @click="item.isShowAnswer = !item.isShowAnswer">
              {{ item.Question || '' }}
            </div>
            <div style="cursor: pointer" @click="item.isShowAnswer = !item.isShowAnswer">
              <i class="pi pi-chevron-up" style="color: #ecd287" v-show="item.isShowAnswer"></i>
              <i class="pi pi-chevron-down" style="color: #ecd287" v-show="!item.isShowAnswer"></i>
            </div>
          </div>
          <div class="mt-1 dtc-qa-grid" v-show="item.isShowAnswer">
            <div class="avator" style="background: #01b386">A</div>
            <!-- <div style="color: rgb(124 124 124)">{{ item.Reply || "" }}</div> -->
            <div style="color: rgb(124 124 124)" v-html="item.replyed"></div>
          </div>
        </div>
      </div>
    </Dialog>
  </div>
</template>
<script>
import { useToast } from 'vue-toastification'
import { reactive, toRefs, computed, ref, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { getCaptcha, getQuestion } from 'Service/apis.js'
import version from '@/views/auth/version.vue'

import dayjs from 'dayjs'
export default {
  components: { version },
  setup() {
    const toast = useToast()
    const store = useStore()
    const router = useRouter()
    const qaModalIsShow = ref(false)

    const versionTime = dayjs(window.versionTime).format('YYYY-MM-DD HH:mm:ss')

    const showCommonQaModal = () => {
      qaModalIsShow.value = true
    }

    const catagory = ref(null)
    const catagoryOptions = ref([])
    const allQaItems = ref([])
    const qaItems = ref([])

    const getAllOptions = () => {
      const arr = allQaItems.value.map((s) => `${s.Category}`)
      const uniqueArr = [...new Set(arr)]
      catagoryOptions.value = uniqueArr.map((s) => ({
        text: s,
        value: s,
      }))
      if (uniqueArr.length) {
        catagory.value = uniqueArr[0]
      }
    }
    const setData = () => {
      let arr = []
      arr = allQaItems.value.filter((s) => s.Category == catagory.value)
      qaItems.value = arr
    }

    const getData = async () => {
      const { data } = await getQuestion('')
      allQaItems.value = data?.Items.map((s) => {
        s.isShowAnswer = false
        s.replyed = s.Reply ? s.Reply.replace(/\n/g, '<br>') : ''
        return s
      })
      // console.log("allQaItems.value", allQaItems.value);

      // isShowAnswer
      await getAllOptions()
      setData()
    }

    return {
      versionTime,
      showCommonQaModal,

      qaModalIsShow,
      catagory,
      catagoryOptions,

      qaItems,
      allQaItems,

      getAllOptions,
      setData,
      getData,
    }
  },
}
</script>

<style lang="scss" scoped>
.auth-footer {
  @apply text-black text-center -translate-x-1/2 w-full;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-content: flex-start;
  align-items: center;

  background: #021a7b;
  color: #ffffff;
  bottom: 0px;
  font-size: 12px;
  font-weight: 200;

  padding: 20px 0 30px 0;

  .version {
    margin-right: 30px;
  }

  .wording {
    text-align: left;
    position: relative;

    .word1 {
      .commonqa {
        background: #ffffff;
        border-radius: 5px;
        display: inline-block;
        background: #fff;
        box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
        padding: 2px 4px;
        color: #00187d;
        font-weight: 800;
        margin-left: 5px;
        cursor: pointer;
      }
    }
  }
  .dtc-logo {
      display: block;
      margin-left: 20px;
    }
}

@media screen and (max-width: 1400px) {
  .auth-footer {
    padding-bottom: 36px;
  }
}

.main-qa {
  .main-qa-title {
    padding-bottom: 1px;

    .big-title {
      font-weight: 600;
      font-size: 20px;
      color: #255689;
    }
  }

  .main-qa-content {
    width: 96%;
    margin: 0 auto;

    .dtc-qa-grid {
      display: grid;
      grid-template-columns: 50px 1fr 60px;
      padding-left: 36px;
    }
  }
}

hr.bighr {
  height: 5px;
  border-width: 1px;
  background-color: #255689;
}

hr.conent {
  height: 3px;
  border-width: 1px;
  background-color: #6b7280c9;
  margin-top: 12px;
}

.avator {
  width: 32px;
  height: 32px;
  border-radius: 100px;
  background-color: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: rgb(248, 247, 247);
}
</style>
