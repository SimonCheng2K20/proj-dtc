<template>
  <div v-if="tableData">
    <Dialog title="閱覽" v-model="showDialog" >
      <div class="d-flex justify-content-end mb-1">
        <Button class="buttonColor-14" @click="preview">原圖</Button>
      </div>
      <img class="fileBoxListItemImg" :src="$api.baseURL+chooseData.Attachment" v-if="chooseData" />
    </Dialog>
    <el-table class="mb-1" ref="table" :data="tableData" border style="width: 100%" @select="versionSelect">
      <el-table-column label="" width="55">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.checkFormal" @change="changeFormal($event,scope.$index)"> </el-checkbox>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="90">
        <template slot-scope="scope">
          <Button class="buttonColor-14" @click="preview(scope.row)">閱覽</Button>
        </template>
      </el-table-column>
      <el-table-column prop="Version" label="版次" width="80" />
      <el-table-column prop="CreateDate" label="建立日期">
        <template slot-scope="scope">
          {{$global.YYYYMMDD(scope.row.CreateDate)}}
        </template>
      </el-table-column>
      <el-table-column prop="CreateUser" label="歸檔人員" />
      <el-table-column prop="Formal" label="正式版次" >
        <template slot-scope="scope">
          <i class="el-icon-check" v-if="scope.row.Formal" />
        </template>
      </el-table-column>
    </el-table>
    <div class="d-flex justify-content-end">
      <Button class="buttonColor-2 mr-1" @click="$emit('close')">取消</Button>
      <Button class="buttonColor-6 mr-1" @click="del">刪除</Button>
      <Button class="buttonColor-1" @click="sub">正式版次</Button>
    </div>
  </div>
</template>

<script>
import Dialog from './Dialog.vue'
export default {
    props: ["info"],
    data() {
        return {
            showDialog:false,
            chooseData:null,
            checkData:null,
            tableData: null,
            index: null
        };
    },
    async created() {
        await this.getData();
    },
    methods: {
        async getData() {
            this.$store.commit("loading", true);
            const tempObj = {
              Id: this.info.Id,
              No: this.info.No,
              FolderId: this.info.FolderId,
              DocCategoryId: this.info.DocCategoryId,
            }
            let res = await this.$api.getDocVersion(tempObj)
            for(let item of res) {
              item.checkFormal=item.Formal
            }
            this.tableData=res
            this.$store.commit("loading", false);
        },
        preview(x) {
          window.open(`${this.$api.baseURL}${x.Attachment}`)
        },
        versionSelect() {
        },
        async showPreview(x) {
          this.chooseData=x
          this.showDialog=!this.showDialog
        },
        async del() {
            if(!confirm('確定刪除?')) return 0
            if(this.tableData.filter(res=>res.Formal&&res.checkFormal).length) {
              this.$message.error('正式版次不能刪除')
              return 0
            }
            this.$store.commit("loading", true)
            let id=this.tableData.filter(res=>res.checkFormal)[0].Id
            await this.$api.delDocRecordImg(id)
            await this.getData()
            this.$store.commit("loading", false)
        },
        changeFormal(e,index) {
          if(e) {
            for(let item of this.tableData) {
              item.checkFormal=false
            }
            this.tableData[index].checkFormal=true
          }
          else {
            this.tableData[index].checkFormal=true
          }
          console.log(11,e,index)
        },
        async sub() {
          this.$store.commit("loading", true)
          let id=this.tableData.filter(res=>res.checkFormal)[0].Id
          await this.$api.setLastVersion({Id:id})
          await this.getData()
          this.$message.success('版次更新成功')
          this.$store.commit("loading", false)
        },
    },
    components: { Dialog }
}
</script>