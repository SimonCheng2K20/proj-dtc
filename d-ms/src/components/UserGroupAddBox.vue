<template>
  <div>
    <el-form ref="postform" label-position="left" label-width="120px" :model="data" :rules="rules">
      <InputLabel class="mb-1" title="群組代號" prop="No">
        <el-input v-model="data.No" :disabled="!isAdd"></el-input>
      </InputLabel>
      <InputLabel class="mb-1" title="群組名稱" prop="Name">
        <el-input v-model="data.Name"></el-input>
      </InputLabel>
      <InputLabel class="mb-1" title="狀態">
        <el-radio-group class="ml-1" v-model="data.IsActivated">
          <el-radio :label="true">啟用</el-radio>
          <el-radio :label="false">停用</el-radio>
        </el-radio-group>
      </InputLabel>
    </el-form>
    <div v-if="!isAdd">
      <el-tabs type="card" v-model="tabKey" class="mb-1">
        <el-tab-pane label="功能管理" name="1">
          <el-checkbox-group v-model="checkList" style="height:40vh;overflow-y: scroll;">
            <div class="mb-1" v-for="(item,index) in $store.state.functionList" :key="index">
              <el-checkbox :label="item.No" @change="functionChange($event,item.No)">{{item.No}} - {{item.Name}}</el-checkbox>
            </div>
          </el-checkbox-group>
        </el-tab-pane>
        <el-tab-pane label="文件類別權限" name="2">
          <div class="mb-1">
            <el-checkbox v-model="data.IsBrowse">可閱覽</el-checkbox>
          </div>
          <div class="mb-1">
            <el-checkbox v-model="data.IsModify">可修改</el-checkbox>
          </div>
          <div class="mb-1">
            <el-checkbox v-model="data.IsPrint">可列印</el-checkbox>
          </div>
          <div class="mb-1">
            <el-checkbox v-model="data.IsEmail">可Email</el-checkbox>
          </div>
          <div class="mb-1">
            <el-checkbox v-model="data.IsDocCategory">篩選文件類別</el-checkbox>
          </div>
        </el-tab-pane>
        <el-tab-pane label="病歷夾權限" name="3"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="d-flex justify-content-end">
      <Button class="buttonColor-2 mr-1" @click="$emit('close')">取消</Button>
      <Button class="buttonColor-1" @click="sub">建立</Button>
    </div>
  </div>
</template>

<script>
export default {
  props: ['data','isAdd'],
  data() {
    return {
      tabKey:'1',
      checkList:[],
      functionList:[],
      rules: {
        No: [
          { required: true, message: '此為必填欄位', trigger: 'blur' },
        ],
        Name: [
          { required: true, message: '此為必填欄位', trigger: 'blur' },
        ]
      }
    }
  },
  async created() {
    await this.getData()
  },
  methods: {
    async getData() {
      this.$store.commit('loading',true)
      if(!this.isAdd) this.checkList=await this.$api.getFunctionNosByRoleId({roleNo:this.data.No})
      this.$store.commit('loading',false)
    },
    async sub() {
      this.$refs.postform.validate(async (valid) => {
        if(valid) {
          this.$store.commit('loading',true)
          if(this.isAdd) await this.$api.postRole(this.data)
          else await this.$api.putRole(this.data)
          this.$emit('addComplete')
          this.$store.commit('loading',false)
        }
      })
    },
    async functionChange(e,x) {
      this.$store.commit('loading',true)
      let data= {
        RoleNo: this.data.No,
        FunctionNo: x
      }
      if(e) await this.$api.postAddFunction(data)
      else await this.$api.postRemoveFunction(data)
      this.$store.commit('loading',false)
    }
  }
}
</script>