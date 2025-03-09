<template>
  <div class="fileBox" v-if="data">
    <input ref="uploadFile" type="file" @change="onUploadFile" v-show="false" />
    <input ref="replaceFile" type="file" @change="replace" v-show="false" />
    <el-row :gutter="10" class="mb-1">
      <el-col :md="8">病歷號 : {{ data.PatientId }}</el-col>
      <el-col :md="8">姓名 : {{ data.Patient.Cname }}</el-col>
      <el-col :md="8">病歷日期 : {{ $global.YYYYMMDD(data.RecordDate) }}</el-col>
      <el-col :md="24">病歷夾 : {{ data.FolderName }}</el-col>
      <el-col :md="24">文件類別 : {{ data.DocCategoryName }}</el-col>
    </el-row>
    <div class="d-flex justify-content-end mb-1">
      <Button class="buttonColor-14 mr-1" @click="$refs.uploadFile.click()">新增圖片</Button>
      <Button class="buttonColor-14 mr-1" @click="preview" :disabled="!chooseImgNo">預覽</Button>
      <Button class="buttonColor-14 mr-1" :disabled="!chooseImgNo" @click="$refs.replaceFile.click()">替換</Button>
      <Button class="buttonColor-14 mr-1" :disabled="!chooseImgNo"
        @click="nowOrd = -1; $refs.uploadFile.click()">向前新增圖片</Button>
      <Button class="buttonColor-14" :disabled="!chooseImgNo" @click="nowOrd = 1; $refs.uploadFile.click()">向後新增圖片</Button>
    </div>
    <el-card shadow="never" @click.native="chooseImgNo = null">
      <draggable :list="data.DocImages" class="fileBoxList" @change="drop">
        <div class="fileBoxListItem" :class="{ 'chooseImgNo': chooseImgNo && item.No === chooseImgNo.No }"
          v-for="item in data.DocImages" :key="item.No" @click.stop="chooseImgNo = item">
          <i class="el-icon-error fileBoxListItemDelete" @click="del(item.Id)" />
          <img class="fileBoxListItemImg" :src="$api.baseURL + item.Attachment">
          <el-input v-model="item.Note" placeholder="圖片備註">
            <el-button slot="append" @click="save">儲存</el-button>
          </el-input>
        </div>
      </draggable>
    </el-card>
  </div>
</template>

<script>
import draggable from "vuedraggable";

export default {
  props: ['info'],
  components: { draggable },
  data() {
    return {
      list: [],
      data: null,
      chooseImgNo: null,
      nowOrd: null
    }
  },
  async created() {
    await this.getData()
  },
  methods: {
    async getData() {
      this.$store.commit('loading', true)
      this.data = this.info
      const tempObj = {
          PatientId: this.info.PatientId,
          FolderId: this.info.FolderId,
          DocCategoryId: this.info.DocCategoryId,
      }
      this.data.DocImages = await this.$api.getDocRecordImgGetAllImage(tempObj)

      for (let item of this.data.DocImages) {
        item.Attachment += '?time=' + new Date().getTime()
      }
      this.$nextTick(() => {
        this.reSort()
        this.$forceUpdate()
      })
      this.$store.commit('loading', false)
    },
    reSort() {
      this.data.DocImages = this.data.DocImages.sort((a, b) => a.Ord - b.Ord)
    },
    async onUploadFile(e) {
      this.$store.commit('loading', true)
      let file = e.target.files[0]
      let data = {
        PatientId: this.info.PatientId,
        RecordDate: this.info.RecordDate,
        FolderId: this.info.FolderId,
        DocCategoryId: this.info.DocCategoryId,
        Volume: this.info.Volume,
        Note: this.info.Note,
        No: null,
        File: file,
      }
      if (this.nowOrd && this.nowOrd > 0) data.No = this.chooseImgNo.No + 1
      if (this.nowOrd && this.nowOrd < 0) data.No = this.chooseImgNo.No
      //await this.$api.postNewImage(this.$global.objToFormData(data))
      await this.$api.postDocRecord(this.$global.objToFormData(data))
      await this.getData()
      this.$emit('getData')
      this.nowOrd = null
      this.$refs.uploadFile.value = ''
      this.$store.commit('loading', false)
    },
    chooseImg(x) {
      this.chooseImgNo = x
    },
    async drop() {
      this.$store.commit('loading', true)
      let data = JSON.parse(JSON.stringify(this.data.DocImages))
      /*for(let index in data) {
        data[index].Ord=Number(index)+1
      }*/
      await this.$api.putSortImage(data)
      await this.getData()
      this.$store.commit('loading', false)
    },
    preview() {
      window.open(`${this.$api.baseURL}${this.chooseImgNo.Attachment}`)
    },
    async replace(e) {
      this.$store.commit('loading', true)
      let file = e.target.files[0]
      let form = {
        Id: this.chooseImgNo.Id,
        //No:this.chooseImgNo.No,
        //Ord:this.chooseImgNo.Ord,
        Note: this.chooseImgNo.Note,
        File: file
      }
      await this.$api.putUploadImage(this.$global.objToFormData(form))
      await this.getData()
      this.$emit('getData')
      this.$refs.replaceFile.value = ''
      this.$store.commit('loading', false)
    },
    async del(x) {
      if (!confirm('確定刪除?')) return 0
      this.$store.commit('loading', true)
      await this.$api.delDocRecordImg(x)
      await this.getData()
      this.$emit('getData')
      this.$store.commit('loading', false)
    },
    async save() {
      this.$store.commit('loading', true)
      let form = {
        Id: this.chooseImgNo.Id,
        //No:this.chooseImgNo.No,
        Note: this.chooseImgNo.Note,
      }
      await this.$api.putUpdateNote(this.$global.objToFormData(form))
      await this.getData()
      this.$emit('getData')
      this.$message.success('儲存成功')
      this.$store.commit('loading', false)
    }
  }
}
</script>