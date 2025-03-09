<template>
  <div class="BasicInfo">
    <CardBox title="醫院基本資料管理">
      <el-form ref="postform" label-position="left" label-width="210px" :model="tableData" :rules="rules" v-if="tableData">
        <el-row :gutter="10">
          <el-col :md="12">
            <InputLabel class="mb-1" title="醫療機構健保代碼" labelWidth="300px" prop="HospitalCode">
              <el-input v-model="tableData.HospitalCode" />
            </InputLabel>
            <InputLabel class="mb-1" title="醫療機構英文全銜名稱" labelWidth="300px">
              <el-input v-model="tableData.HospitalEngName" />
            </InputLabel>
            <InputLabel class="mb-1" title="醫療機構地址" labelWidth="300px">
              <el-input v-model="tableData.HospitalAddr" />
            </InputLabel>
            <InputLabel class="mb-1" title="醫療機構網址" labelWidth="300px">
              <el-input v-model="tableData.HospitalUrl" />
            </InputLabel>
            <InputLabel class="mb-1" title="院長" labelWidth="300px">
              <el-input v-model="tableData.HospitalSuperintendent" />
            </InputLabel>
            <InputLabel class="mb-1" title="機構團體組織物件辨識碼" labelWidth="300px">
              <el-input v-model="tableData.HealthCareFacilityOid" />
            </InputLabel>
          </el-col>
          <el-col :md="12">
            <InputLabel class="mb-1" title="醫療機構全銜名稱" labelWidth="300px" prop="HospitalName">
              <el-input v-model="tableData.HospitalName" />
            </InputLabel>
            <InputLabel class="mb-1" title="醫療機構英文簡稱" labelWidth="300px">
              <el-input v-model="tableData.HospitalEngNickname" />
            </InputLabel>
            <InputLabel class="mb-1" title="醫療機構電話" labelWidth="300px">
              <el-input  v-model="tableData.HospitalTel" />
            </InputLabel>
            <InputLabel class="mb-1" title="醫療機構簡稱" labelWidth="300px" prop="HospitalNickname">
              <el-input v-model="tableData.HospitalNickname" />
            </InputLabel>
            <InputLabel class="mb-1" title="層級區分" labelWidth="300px">
              <el-input v-model="tableData.HospitalLevel" />
            </InputLabel>
          </el-col>
        </el-row>
      </el-form>
      <div class="d-flex justify-content-end">
        <Button class="buttonColor-11 mr-1" @click="clear">清除</Button>
        <Button class="buttonColor-1" @click="sub">儲存</Button>
      </div>
    </CardBox>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData:null,
      rules: {
        HospitalCode: [
          { required: true, message: '此為必填欄位', trigger: 'blur' },
        ],
        HospitalName: [
          { required: true, message: '此為必填欄位', trigger: 'blur' },
        ],
        HospitalNickname: [
          { required: true, message: '此為必填欄位', trigger: 'blur' },
        ]
      }
    }
  },
  async created() {
    this.$store.commit('loading',true)
    await this.getData()
    this.$store.commit('loading',false)
  },
  methods: {
    async getData() {
      this.tableData=await this.$api.getHospitalInfo()
    },
    clear() {
      for(let item of Object.keys(this.tableData)) {
        this.tableData[item]=''
      }
    },
    async sub() {
      this.$refs.postform.validate(async (valid) => {
        if(valid) {
          this.$store.commit('loading',true)
          await this.$api.putHospitalInfo(this.tableData).then(async ()=> {
            await this.getData()
            this.$message.success('儲存成功')
          })
          .catch(()=> {
            this.$message.error('儲存失敗')
          })
          this.$store.commit('loading',false)
        }
      })
    },
  }
}
</script>