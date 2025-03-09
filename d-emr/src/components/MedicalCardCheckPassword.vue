<template>
  <Dialog title="醫事人員卡驗證" v-model="medicalCardCheckPasswordShow" width="600px">
    <div>請輸入醫事人員卡密碼</div>
    <el-form>
      <InputLabel class="mt-1" title="醫事人員卡密碼">
        <el-input v-model="medicalCardPassword" type="password" />
      </InputLabel>
    </el-form>

    <div class="d-flex justify-content-end mt-2">
      <Button class="buttonColor-11 mr-1" @click="$emit('input', false)">取消</Button>
      <Button class="buttonColor-1" @click="medicalCardCheckPassword">確定</Button>
    </div>
  </Dialog>
</template>

<script>
export default {
  props: {
    value: Boolean,
  },
  watch: {
    value(val) {
      if (this.medicalCardCheckPasswordShow !== val) this.medicalCardCheckPasswordShow = val
    },
    medicalCardCheckPasswordShow(val) {
      if (this.value !== val) this.$emit('input', val)
    },
  },
  data() {
    return {
      medicalCardCheckPasswordShow: this.value,

      medicalCardPassword: null,
    }
  },
  methods: {
    async medicalCardCheckPassword() {
      this.$store.commit('loading', true)
      const { data, error } = await this.$global.medicalCardCheckPassword(this.medicalCardPassword)
      this.$store.commit('loading', false)

      if (error) {
        this.$message.error(error)
        this.$emit('error', error)
        return
      }
      
      if (data) {
        this.$message.success(data)
        this.medicalCardCheckPasswordShow = false
        this.$emit('ok', data)
      }
    },
  },
}
</script>
