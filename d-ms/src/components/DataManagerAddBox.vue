<template>
  <div>
    <input ref="uploadFile" type="file" @change="onUploadFile" v-show="false" />
    <CardBox title="上傳資料" class="cardBoxColor2">
      <el-form ref="postform" label-position="left" label-width="160px" :model="formCopy" :rules="rules">
        <a class="mb-1" :href="previewURL" target="_blank" v-if="previewURL" style="display: block;">
          <img :src="previewURL" style="display: block;max-width:500px;">
        </a>
        <div class="d-flex justify-content-end mb-1" v-if="!isArchive">
          <Button class="buttonColor-6 mr-1" @click="formCopy.File=null" v-if="previewURL">刪除圖片</Button>
          <Button class="buttonColor-14" @click="$refs.uploadFile.click()">上傳圖片</Button>
        </div>
        <InputLabel class="mb-1" title="病歷號" prop="PatientId">
          <el-select v-model="formCopy.PatientId" filterable>
            <el-option v-for="item in $store.state.patientList" :key="item.PatientId" :label="item.PatientId+' - '+item.Cname" :value="item.PatientId"></el-option>
          </el-select>
        </InputLabel>
        <!--<InputLabel class="mb-1" title="姓名">
          <el-input disabled/>
        </InputLabel>-->
        <InputLabel class="mb-1" title="病歷夾">
          <el-select v-model="formCopy.FolderId">
            <el-option v-for="(item,index) in $store.state.medicalRecordList" :key="index" :value="item.Id" :label="item.Name"></el-option>
          </el-select>
        </InputLabel>
        <InputLabel class="mb-1" title="文件類別">
          <el-select v-model="formCopy.DocCategoryId">
            <el-option v-for="(item,index) in $store.state.categoryList" :key="index" :value="item.Id" :label="item.Name"></el-option>
          </el-select>
        </InputLabel>
        <InputLabel class="mb-1" title="病歷開始日期" prop="RecordDate">
          <el-date-picker v-model="formCopy.RecordDate" type="date" value-format="yyyy-MM-dd"></el-date-picker>
        </InputLabel>
        <InputLabel class="mb-1" title="病歷結束日期" prop="RecordDate2">
          <el-date-picker v-model="formCopy.RecordDate2" type="date" value-format="yyyy-MM-dd"></el-date-picker>
        </InputLabel>
        <InputLabel class="mb-1" title="卷冊">
          <el-input v-model="formCopy.Volume" />
        </InputLabel>
        <InputLabel class="mb-1 elFormItemNote" title="備註">
          <el-input v-model="formCopy.Note" type="textarea" :rows="3" resize="none" />
        </InputLabel>
        <!--<CardBox title="索引列表">
          <InputLabel v-for="(item,index) in Object.keys(indexRules)" :key="index" class="mb-1" :title="item">
            <el-input :maxlength="indexRules[item][0].max" show-word-limit />
          </InputLabel>
        </CardBox>-->
      </el-form>
    </CardBox>
    <div class="d-flex justify-content-end">
      <Button class="buttonColor-2 mr-1" @click="$emit('close')">取消</Button>
      <Button class="buttonColor-1" @click="sub">{{isArchive ? '歸檔':'建立'}}</Button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['data','isArchive'],
  data() {
    return {
      form: {
        //Type: null,
        RecordDate: null,
        RecordDate2: null,
        FolderId: 1,
        DocCategoryId: 1,
        Volume: null,
        //No: null,
        Note: null,
        //Attachment: null,
        PatientId: null,
        File:null,
        //DocRecIdxes:[]
      },
      formCopy:null,
      rules: {
        PatientId: [
          { required: true, message: '此為必填欄位', trigger: 'blur' },
        ],
        RecordDate: [
          { required: true, message: '此為必填欄位', trigger: 'blur' },
        ],
        RecordDate2: [
          { required: true, message: '此為必填欄位', trigger: 'blur' },
        ],
      },
    }
  },
  computed: {
    /*indexRules() {
      let res={}
      if(!this.formCopy.DocCategoryId) return res
      for(let item of this.$store.getters.categoryListObj[this.formCopy.DocCategoryId].DocIndices) {
        res[item.IndexName]= []
        res[item.IndexName].push({
           max: item.Length, message: '超出長度', trigger: 'blur', data:item
        })
      }
      return res
    }*/
    previewURL() {
      if(this.formCopy.File) {
        return window.URL.createObjectURL(new Blob([this.formCopy.File], {type: this.formCopy.File.type}))
      }
      else {
        return null
      }
    }
  },
  async created() {
    this.formCopy=JSON.parse(JSON.stringify(this.data ? this.data:this.form))
  },
  methods: {
    onUploadFile(e) {
      let file=e.target.files[0]
      this.formCopy.File=file
      this.$refs.uploadFile.value=''
    },
    async sub() {
      //let data=this.$global.objToFormData(this.formCopy)
      this.$refs.postform.validate(async (valid) => {
        if(valid) {
          if(this.isArchive) {
            this.$store.commit('loading',true)
            await this.$api.putDocArchive(this.formCopy)
            await this.$api.putDocArchivePutRecord({Id:this.formCopy.Id})
            this.$emit('addComplete')
            this.$store.commit('loading',false)
          }
          else {
            this.$store.commit('loading',true)
            await this.$api.postDocRecord(this.$global.objToFormData(this.formCopy))
            this.$emit('addComplete')
            this.$store.commit('loading',false)
          }
        }
      })
    }
  }
}
</script>