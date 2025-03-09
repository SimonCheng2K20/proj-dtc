<template>
  <div class="download-sheet">
    <nav>
      <header>
        <span class="ml-1">會診單下載</span>
        <span class="btn-area relative" style="line-height: 35px">
          <button
            class="font-bold uppercase px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-11 mt-1 mb-1 text-base"
            type="button"
            style="background: #fec02c; height: 36px; color: rgb(50 54 57)"
            @click="downloadPdf"
          >
            <span class="flex">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              <span>確認下載</span>
            </span>
          </button>
          <span class="inline-block absolute" style="right: 13px; bottom: 6px"><i class="pi pi-times" @click="$emit('close')"></i></span>
        </span>
      </header>
      <div class="person-content">
        <img class="mr-2" style="width: 26px; display: inline-block; margin-bottom: 5px" src="/assets/members-icon.png" />
        <!-- <span class="mr-3 font-bold" style="font-size: 17px"><span class="mr-1">姓名:</span>{{ modalItemDownload.name || '' }}</span>
        <span class="font-bold" style="font-size: 17px"><span class="mr-1">身分證字號:</span>{{ modalItemDownload.identy || '' }}</span> -->
        <span class="mr-3 font-bold" style="font-size: 17px"><span class="mr-1">姓名:</span>{{ item.Patient.Name || '' }}</span>
        <span class="font-bold" style="font-size: 17px"><span class="mr-1">身分證字號:</span>{{ item.Patient.Identifier || '' }}</span>
      </div>
      <!-- <h2>{{ sourcePdf }}</h2> -->
      <iframe :src="sourcePdf" frameborder="0" style="height: 100%"></iframe>
    </nav>
  </div>
</template>

<script>
import { ref, reactive, onMounted, computed, watch, nextTick } from 'vue'
import { getSheetPdf } from 'Service/apis.js'
import { useToast } from 'vue-toastification'
import { cloneDeep } from 'lodash'
export default {
  props: {
    modalItemDownload: {
      type: Object,
    },
  },
  setup(props, { emit }) {
    // const item = ref({ ...props.modalItemDownload })
    
    const item = ref({
      Patient: {
        Name: '',
        Identifier: '',
      }
    })

    const toast = useToast()
    const sourcePdf = ref('')
    const getData = async (key, data = '') => {
      if (!Boolean(key)) return
      const url = `?id=${key}`
      try {
        item.value = cloneDeep(data)
        console.log(item.value)

        const res = await getSheetPdf(url)
        sourcePdf.value = res.data
      } catch (e) {
        toast.error(`${e.response ? e.response.data : e}`, {
          timeout: 5000,
          hideProgressBar: true,
        })
      }
    }

    const downloadPdf = () => {
      window.open(sourcePdf.value)
    }

    return {
      item,
      sourcePdf,
      getData,
      downloadPdf,
    }
  },
}
</script>

<style lang="scss" scoped>
.download-sheet {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  // background: rgba(#000, 0.8);
  background: rgb(0 0 0 / 49%);
  display: grid;
  place-items: center;
  z-index: 889;

  > nav {
    width: 90vw;
    height: 96vh;
    // overflow: auto;
    border-radius: 6px;
    color: black;
    background: #f5f5f5;
    display: flex;
    flex-direction: column;
    text-align: left;
    border-radius: 20px 20px 8px 8px;
    header {
      height: 45px;
      color: white;
      background: #3f60d8;
      font-size: 20px;
      padding-left: 7px;

      line-height: 45px;
      display: flex;
      border-radius: 16px 16px 0 0;
      justify-content: space-between;
      .pi.pi-times {
        cursor: pointer;
      }
    }
    .person-content {
      margin-left: 5px;
      margin-top: 5px;
      display: flex;
    }
  }
}
.btn-area {
  margin-right: 19px;
}
</style>
