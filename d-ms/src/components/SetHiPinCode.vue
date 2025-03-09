<template>
  <div>
    <el-form ref="postform" label-width="140px" label-position="left" :model="form" :rules="rules">
      <InputLabel title="系統帳號" class="mb-1">
        <el-input :value="$store.state.userData.No" disabled></el-input>
      </InputLabel>
      <InputLabel title="姓名" class="mb-1">
        <el-input :value="$store.state.userData.Name" disabled></el-input>
      </InputLabel>
      <InputLabel title="新設Pincode" class="mb-1" prop="newPermit">
        <el-input v-model="form.newPermit" maxlength="6" show-password></el-input>
      </InputLabel>
      <InputLabel title="確認Pincode" class="mb-1" prop="reNewPermit">
        <el-input v-model="form.reNewPermit" maxlength="6" show-password></el-input>
      </InputLabel>
    </el-form>
    <div class="d-flex justify-content-end">
      <Button class="buttonColor-2 mr-1" @click="$emit('close')">取消</Button>
      <Button class="buttonColor-1" @click="sub">確認</Button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        userName: null,
        newPermit: null,
        reNewPermit: null,
      },
      rules: {
        newPermit: [
          { required: true, message: '此為必填欄位', trigger: 'blur' },
        ],
        reNewPermit: [
          { required: true, message: '此為必填欄位', trigger: 'blur' },
        ]
      }
    }
  },
  methods: {
    async sub() {
      this.$refs.postform.validate(async (valid) => {
        if(valid) {
          if(this.form.newPermit!==this.form.reNewPermit) {
            this.$message.error('Pincode輸入不一致')
            return 0
          }
          this.$store.commit('loading',true)
          this.form.userName=this.$store.state.userData.No
          delete this.form.reNewPermit
          await this.$api.setPinCode(this.form)
          alert('Pincode修改成功，請重新登入')
          localStorage.token=''
          location.reload()
          this.$store.commit('loading',false)
        }
      })
    }
  }
}
</script>