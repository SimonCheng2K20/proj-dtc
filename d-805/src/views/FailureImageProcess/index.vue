<template>
  <div class="failing-process d-flex">
    <div class="p-2 w-100 d-flex flex-column">
      <page-title
        title="廢片管理作業"
        img="file-image"
      />

      <condition @search="startSearch" />
      <result
        ref="resultData"
        :rowData="searchData"
        @readImage="registCurrentAccessionNo"
        @uploadImage="uploadFailimg"
        class="mt-2 flex-1"
      />
      <imageDisplay
        :show.sync="imgDisplay.show"
        :loading="imgDisplay.loading"
        :items="imgDisplay.imgs"
        @removeImag="removeImageById"
        @uploadImg="uploadBase64"
      />
    </div>
  </div>
</template>

<script>
import { getApiFailImage, getFailImageByAccessionNo, postFailImageByAccessionNo, removeFailImageById, uploadFailImageByAccessionNo } from "@/assets/service/dataManager.js";
import condition from "./condition.vue";
import result from "./result.vue";
import imageDisplay from "./imageDisplay.vue";
export default {
  data () {
    return {
      files: null,
      imgDisplay: { show: false, loading: false, imgs: [], no: '' },
      searchData: {
        Count: 0,
        Items: []
      },
      currentAccessionNo: null
    }
  },
  components: {
    condition, result, imageDisplay
  },
  methods: {
    uploadBase64 (base64) {
      uploadFailImageByAccessionNo(this.currentAccessionNo, base64).then(() => {
        if (this.imgDisplay.show) {
          this.fetchFailimg();
        }
      });
    },
    startSearch ({ dateTime = null, accessionNo = null, orderNo = null, patientName = null }) {
      // console.log(dateTime, accessionNo, orderNo, patientName);
      // console.log(dateTime.map(dt => this.$moment(dt).format('YYYY-MM-DD HH:mm:ss')));
      getApiFailImage().then(({ actual: { Count, Items } }) => {
        this.searchData.Count = Count;
        this.searchData.Items = Items;
        this.searchData.Items.forEach((item) => item['CreatedTime'] = this.$moment(item['CREATEDTTM']).format("YYYY-MM-DD HH:mm:ss"));
      })
    },

    registCurrentAccessionNo (no) {
      if (this.imgDisplay.no === no) {
        this.imgDisplay.show = false;
        this.imgDisplay.no = '';
        this.currentAccessionNo = '';
        return;
      }

      this.currentAccessionNo = no;
      this.fetchFailimg();
    },
    async fetchFailimg () {
      this.imgDisplay.show = true;
      this.imgDisplay.no = this.currentAccessionNo;
      this.imgDisplay.loading = true;
      this.imgDisplay.imgs = await getFailImageByAccessionNo(this.currentAccessionNo);
      this.imgDisplay.loading = false;

    },
    async uploadFailimg ({ data, accessionNo }) {
      let form = new FormData();
      for (let i = 0; i < data.length; i++) {
        form.append("[]", data[i]);
      }
      fetch(`../FailImage/UploadImageFile?accessionNo=${accessionNo}`, {
        method: 'POST',
        body: form,
      }).then((res) => {
        if (this.imgDisplay.show) {
          this.fetchFailimg();
        }
      })
      // http://172.16.16.18:8081/FailImage/UploadImageFile?accessionNo=319B26090000001
      // /FailImage/UploadImageFile?accessionNo=

      // let form = new FormData();
      // form.append("product[photos][]", e.target.files[i])

      // const res = await postFailImageByAccessionNo(accessionNo, data);
      // console.log(res);
    },
    removeImageById (id) {
      removeFailImageById(id).then((res) => {
        if (this.imgDisplay.show) {
          this.fetchFailimg();
        }
      })
    }
  },
  created () {
    this.startSearch({});
  },
  watch: {
    "imgDisplay.show" (val) {
      if (!val) this.imgDisplay.no = '';
    }
  }
}
</script>

<style lang="scss" scoped>
.failing-process {
  padding-top: 56px;
  min-height: 100vh;
  h1 {
    font-size: 80px;
  }
}
/deep/ .custom-file-label {
  color: #333 !important;
}
</style>
