<template>
  <div class="indexBox">
    <Dialog title="新增索引" v-model="showDialog">
      <el-form ref="postform" label-position="left" label-width="120px" :model="formCopy" :rules="rules">
        <InputLabel class="mb-1" title="索引名稱" prop="IndexName">
          <el-input v-model="formCopy.IndexName" />
        </InputLabel>
        <InputLabel class="mb-1" title="資料型態" prop="Type">
          <el-select v-model="formCopy.Type" style="width:100%;">
            <el-option v-for="(item,index) in typeList" :key="index" :label="item" :value="item" />
          </el-select>
        </InputLabel>
        <InputLabel class="mb-1" title="資料長度">
          <el-input-number v-model="formCopy.Length" :min="1" :max="99999" style="width:100%;"></el-input-number>
        </InputLabel>
      </el-form>
      <div class="d-flex justify-content-end">
        <Button class="buttonColor-2 mr-1" @click="showDialog=!showDialog">取消</Button>
        <Button class="buttonColor-1" @click="sub">建立</Button>
      </div>
    </Dialog>
    <div class="indexBoxTitle">
      <div class="d-flex">
        <div>索引維護：</div>
        <Button class="buttonColor-2 mr-1" @click="clear">清空</Button>
        <Button class="buttonColor-3" @click="add">新增索引</Button>
      </div>
    </div>
    <div class="indexBoxContent">
      <el-form label-width="100px" label-position="left">
        <el-row :gutter="10">
          <el-col :md="8">
            <InputLabel class="mb-1" title="索引名稱">
              <el-input v-model="tableDataForm.IndexName"></el-input>
            </InputLabel>
          </el-col>
          <el-col :md="8">
            <InputLabel class="mb-1" title="資料型態">
              <el-select v-model="tableDataForm.Type" style="width:100%;">
                <el-option v-for="(item,index) in typeList" :key="index" :label="item" :value="item" />
              </el-select>
            </InputLabel>
          </el-col>
          <el-col :md="8">
            <InputLabel class="mb-1" title="資料長度">
              <el-input v-model="tableDataForm.Length"></el-input>
            </InputLabel>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="showList" border class="mb-1" style="width: 100%">
        <el-table-column prop="IndexName" label="索引名稱"></el-table-column>
        <el-table-column prop="Type" label="資料型態"></el-table-column>
        <el-table-column prop="Length" label="資料長度"></el-table-column>
        <el-table-column label="操作" width="100px">
          <template slot-scope="scope">
            <Button class="buttonColor-6" @click="data.splice(scope.$index,1)">刪除</Button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
    props: ["data"],
    data() {
        return {
            typeList:['文字','數字','日期'],
            showDialog:false,
            form: {
                No:null,
                IndexName: null,
                Type: null,
                Length: null
            },
            formCopy: null,
            tableDataForm:null,
            rules: {
              IndexName: [
                { required: true, message: '此為必填欄位', trigger: 'blur' },
              ],
              Type: [
                { required: true, message: '此為必填欄位', trigger: 'blur' },
              ]
            }
        };
    },
    computed: {
        showList() {
            if (!this.data)
                return [];
            let res = this.data.filter(r => (!this.tableDataForm.IndexName || r.IndexName.includes(this.tableDataForm.IndexName)) && (!this.tableDataForm.Type || r.Type.includes(this.tableDataForm.Type)) && (!this.tableDataForm.Length || String(r.Length).includes(this.tableDataForm.Length)));
            return res;
        }
    },
    created() {
        this.formCopy = JSON.parse(JSON.stringify(this.form))
        this.tableDataForm = JSON.parse(JSON.stringify(this.form))
    },
    methods: {
        clear() {
            this.tableDataForm = JSON.parse(JSON.stringify(this.form));
        },
        add() {
          this.formCopy=JSON.parse(JSON.stringify(this.form))
          this.showDialog=true
        },
        sub() {
          this.$refs.postform.validate(async (valid) => {
            if(valid) {
              this.data.push(this.formCopy)
              for(let index in this.data) {
                this.data[index].No=Number(index)+1
              }
              this.showDialog=false
            }
          })
        }
    },
}
</script>