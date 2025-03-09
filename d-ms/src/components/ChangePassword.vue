<template>
  <div>
    <el-form ref="postform" label-width="110px" label-position="left" :model="form" :rules="rules">
      <InputLabel title="系統帳號" class="mb-1">
        <el-input :value="$store.state.userData.No" disabled></el-input>
      </InputLabel>
      <InputLabel title="姓名" class="mb-1">
        <el-input :value="$store.state.userData.Name" disabled></el-input>
      </InputLabel>
      <InputLabel title="原先密碼" class="mb-1" prop="Old">
        <el-input v-model="form.Old" show-password></el-input>
      </InputLabel>
      <InputLabel title="新設密碼" class="mb-1" prop="New">
        <el-input v-model="form.New" show-password></el-input>
      </InputLabel>
      <InputLabel title="確認密碼" class="mb-1" prop="reNew">
        <el-input v-model="form.reNew" show-password></el-input>
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
        Old: null,
        New: null,
        reNew: null
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
        ]
      }
    }
  },
  methods: {
    async sub() {
      this.$refs.postform.validate(async (valid) => {
        if(valid) {
          if(this.form.reNew!==this.form.New) {
            this.$message.error('密碼輸入不一致')
            return 0
          }
          this.$store.commit('loading',true)
          await this.$api.changePassword(this.form)
          alert('密碼修改成功，請重新登入')
          localStorage.token=''
          location.reload()
          this.$store.commit('loading',false)
        }
      })
    }
  }
}
</script>