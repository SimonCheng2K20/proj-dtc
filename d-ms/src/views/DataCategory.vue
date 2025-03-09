<template>
  <div class="dataMedicalRecord">
    <CardBox title="文件類別維護">
      <el-row :gutter="10">
        <el-col :md="6">
          <CardBox>
            <div class="dataMedicalRecordTree">
              <el-tree :expand-on-click-node="false" :data="listTree" :props="defaultProps" @node-click="($event)=>{control('edit',$event)}" default-expand-all :highlight-current="formEditCopy.Id ? true:false">
                <div class="dataMedicalRecordTreeItem" slot-scope="{ node, data }">
                  <div class="dataMedicalRecordTreeItemName">{{data.Name}}</div>
                  <div class="dataMedicalRecordTreeItemMenu">
                    <el-tooltip class="item" effect="dark" content="修改文件類別" placement="top" :open-delay="300">
                      <img class="dataMedicalRecordTreeItemMenuItem" src="../assets/img/edit.png" @click.stop="handleNodeClick(data);control('edit',data)" />
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="建立同層文件類別" placement="top" :open-delay="300">
                      <img class="dataMedicalRecordTreeItemMenuItem" src="../assets/img/新增病歷夾.png" @click.stop="handleNodeClick(data);control('add1',data)" />
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="建立子文件類別" placement="top" :open-delay="300">
                      <img class="dataMedicalRecordTreeItemMenuItem" src="../assets/img/建立子病歷夾.png" @click.stop="handleNodeClick(data);control('add2',data)" />
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="刪除文件類別" placement="top" :open-delay="300">
                      <img class="dataMedicalRecordTreeItemMenuItem" src="../assets/img/刪除病歷夾.png" @click.stop="handleNodeClick(data);del()" />
                    </el-tooltip>
                  </div>
                </div>
              </el-tree>
            </div>
          </CardBox>
        </el-col>
        <el-col :md="18">
          <CardBox v-if="formEditCopy.Id">
            <div class="dataMedicalRecordList">
              <div class="dataMedicalRecordLabel mr-1">文件類別：</div>
              <div class="dataMedicalRecordListItem" v-for="(item,index) in chooseDataPath" :key="index">
                {{item.Name}}
                <img class="dataMedicalRecordListItemRight" src="../assets/img/arrow_right.png" v-if="index!==chooseDataPath.length-1" />
              </div>
            </div>
            <div class="dataMedicalRecordTitle mb-1 d-flex align-items-center">
              <div class="d-flex align-items-center">
                <div class="d-flex align-items-center" style="color:#BE1992;">操作狀態：{{type==='edit' ? '編輯病歷夾' : type==='add1' ? '建立同層病歷夾' : type==='add2' ? '建立子病歷夾':''}}</div>
              </div>
              <div>
                <el-checkbox label="版次管理"></el-checkbox>
                <el-checkbox label="啟用"></el-checkbox>
              </div>
            </div>
            <el-form ref="postform" :model="formEditCopy" :rules="rules" class="mb-1" label-position="left">
              <InputLabel class="mb-1" title="文件類別名稱" prop="Name">
                <el-input v-model="formEditCopy.Name"></el-input>
              </InputLabel>
              <InputLabel title="說明" class="dataMedicalRecordDesc">
                <el-input type="textarea" :rows="9" resize="none" v-model="formEditCopy.Notes"></el-input>
              </InputLabel>
            </el-form>
            <!--<IndexBox ref="indexBox" :data="formEditCopy.DocIndices" class="mb-1" v-show="formEditCopy.DocIndices" />-->
            <div class="d-flex justify-content-end">
              <Button class="buttonColor-2 mr-1" @click="formEditCopy=JSON.parse(JSON.stringify(form))">取消選取</Button>
              <Button class="buttonColor-3 mr-1" @click="del" v-if="type==='edit'">刪除</Button>
              <Button class="buttonColor-2 mr-1" @click="reset" v-if="type==='edit'">重置</Button>
              <Button class="buttonColor-1" @click="sub" v-if="type==='edit'">存檔</Button>
              <Button class="buttonColor-1" @click="sub" v-else>建立</Button>
            </div>
          </CardBox>
          <div class="noneChoose" v-else>請選擇病歷夾</div>
        </el-col>
      </el-row>
    </CardBox>
  </div>
</template>

<script>
//import IndexBox from '@/components/IndexBox.vue'

export default {
  //components: {IndexBox},
  data() {
    return {
      showDialog:false,
      form: {
        Name: null,
        Notes: null,
        Pid: 0
      },
      type:null,
      formCopy: null,  //新增用
      formEditCopy: null,  //編輯用
      list:[],
      chooseData:{},
      defaultProps: {
        children: 'children',
        label: 'Name'
      },
      rules: {
        Name: [
          { required: true, message: '此為必填欄位', trigger: 'blur' },
          {min: 1, max: 20, message: '長度不能超過20字元', trigger: 'blur'}
        ]
      }
    }
  },
  computed: {
    listTree() {
      return this.$global.arrToTree(this.list)
    },
    chooseDataPath() {
      if(!this.chooseData) return []
      else return this.$global.getPathByPid(this.chooseData,this.list).reverse()
    }
  },
  async created() {
    this.$store.commit('loading',true)
    this.formCopy=JSON.parse(JSON.stringify(this.form))
    this.formEditCopy=JSON.parse(JSON.stringify(this.form))
    await this.getData()
    this.$store.commit('loading',false)
  },
  methods: {
    async getData() {
      this.$store.commit('loading',true)
      this.list=await this.$api.getDocCategory().then(res=>res.Items)
      this.$store.commit('categoryList',this.$global.treeToArr(this.$global.arrToTree(this.list)))
      this.$store.commit('loading',false)
    },
    handleNodeClick(e) {
      //console.log(e)
      this.chooseData=JSON.parse(JSON.stringify(e))
      this.formCopy=JSON.parse(JSON.stringify(e))
      this.formEditCopy=JSON.parse(JSON.stringify(e))
      //this.$refs.indexBox.clear()
    },
    async control(type,x) {
      this.chooseData=JSON.parse(JSON.stringify(x))
      this.type=type
      this.formEditCopy=JSON.parse(JSON.stringify(x))
      if(type==='add1') {
        this.formEditCopy.Name+=' - 同層文件類別'
        this.formEditCopy.Notes=null
      }
      else if(type==='add2') {
        this.formEditCopy.Name+=' - 子文件類別'
        this.formEditCopy.Notes=null
        this.formEditCopy.Pid=x.Id
      }
    },
    reset() {
      this.formEditCopy=JSON.parse(JSON.stringify(this.chooseData))
    },
    async del() {
      if(!confirm(`確定刪除${this.formCopy.Name}?`)) return null
      this.$store.commit('loading',true)
      await this.$api.delDocCategory(this.formEditCopy.Id)
      await this.getData()
      this.formCopy=JSON.parse(JSON.stringify(this.form))
      this.formEditCopy=JSON.parse(JSON.stringify(this.form))
      this.$message.success('刪除成功')
      this.$store.commit('loading',false)
    },
    async sub() {
      this.$refs.postform.validate(async (valid) => {
        if(valid) {
          this.$store.commit('loading',true)
          if(this.type==='edit') {
            await this.$api.putDocCategory(this.formEditCopy)
            this.$message.success('修改成功')
          }
          else {
            await this.$api.postDocCategory(this.formEditCopy)
            this.$message.success('新增成功')
          }
          await this.getData()
          this.$store.commit('loading',false)
        }
      })
    }
  }
}
</script>