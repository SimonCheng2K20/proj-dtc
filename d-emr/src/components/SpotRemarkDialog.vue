<template>
  <el-dialog :visible.sync="showDialog" title="填寫備註" show-close @close="$emit('hide')">
    <el-form>
      <InputLabel class="mb-1" title="備註">
        <el-input v-model="remark" maxlength="100" show-word-limit></el-input>
      </InputLabel>
    </el-form>

    <div class="d-flex justify-content-end">
      <Button class="buttonColor-11 mr-1" @click="$emit('hide')">取消</Button>
      <Button class="buttonColor-1 mr-1" @click="onSaveClick">儲存</Button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: ['SpotDesc'],
  data() {
    return {
      showDialog: false,
      remark: this.SpotDesc,
    }
  },
  methods: {
    onSaveClick() {
      if (!this.remark) {
        this.$message.error('備註不得為空')
        return
      }

      this.$emit('ok', this.remark)
    },
  },
  created() {
    this.showDialog = true
  },
}
</script>
