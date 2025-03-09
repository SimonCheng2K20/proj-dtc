<template>
  <div>
    <el-form ref="postform" label-position="left" :model="form" :rules="rules" label-width="110px" @keyup.enter.native="sub">
      <el-row :gutter="10">
        <el-col>
          <InputLabel class="mb-1" title="使用者帳號">
            <el-input v-model="$store.state.userData.No" disabled />
          </InputLabel>
        </el-col>
        <el-col>
          <InputLabel class="mb-1" title="原先密碼" prop="Old">
            <el-input v-model="form.Old" />
          </InputLabel>
        </el-col>
        <el-col>
          <InputLabel class="mb-1" title="新設密碼" prop="New">
            <el-input v-model="form.New" show-password />
          </InputLabel>
        </el-col>
        <el-col>
          <InputLabel class="mb-1" title="確認密碼" prop="reNew">
            <el-input v-model="form.reNew" show-password />
          </InputLabel>
        </el-col>
      </el-row>
    </el-form>
    <div class="d-flex justify-content-end">
      <Button class="buttonColor-11 mr-1" @click="$emit('close')">取消</Button>
      <Button class="buttonColor-1" @click="sub">確定</Button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        Old:'',
        New:'',
        reNew:''
      },
      rules: {
        Old: [
          { required: true, message: '此為必填欄位', trigger: 'blur' },
        ],
        New: [
          { required: true, message: '此為必填欄位', trigger: 'blur' },
        ],
        reNew: [
          { required: true, message: '此為必填欄位', trigger: 'blur' },
        ],
      }
    }
  },
  methods: {
    async sub() {
      if(this.form.reNew!==this.form.New) {
        alert('新密碼輸入不正確')
        return 0
      }
      this.$refs.postform.validate(async (valid) => {
        if(valid) {
          this.$store.commit('loading',true)
          await this.$api.changePassword(this.form).then(()=> {
            this.$message.success('密碼修改成功，請重新登入')
            this.$emit('closeMe')
            sessionStorage.token=''
            sessionStorage.cardCert=''
            location.href='./#/login'
          })
          .catch(()=> {})
          this.$store.commit('loading',false)
        }
      })
    }
  }
}
</script>