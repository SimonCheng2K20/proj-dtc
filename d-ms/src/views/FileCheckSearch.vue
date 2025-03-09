<template>
  <div class="FileCheckSearch">
    <el-row :gutter="10">
      <el-col :lg="6">
        <CardBox title="文件調閱查詢" contentClass="docSearchBox">
          <DataSearchBox />
        </CardBox>
      </el-col>
      <el-col :lg="18">
        <CardBox title="文件借閱查詢輸出">
          <div class="FileCheckSearchTitle mb-1">
            <div class="FileCheckSearchInfo d-flex d-flex align-items-center">
              <img class="FileCheckSearchInfoItem mr-1" src="../assets/img/user_info.png" />
              <div class="FileCheckSearchInfoItem mr-1">XXXXXXXXXX</div>
              <div class="FileCheckSearchInfoItem mr-1">病患A</div>
              <div class="FileCheckSearchInfoItem">F123456789</div>
            </div>
            <div class="FileCheckSearchMenu">
              <Button class="buttonColor-9 ml-1">閱覽</Button>
              <Button class="buttonColor-10 ml-1">上傳</Button>
              <Button class="buttonColor-11 ml-1">列印</Button>
              <Button class="buttonColor-2 ml-1">Email</Button>
              <Button class="buttonColor-12 ml-1">Excel</Button>
              <Button class="buttonColor-13 ml-1">PDF</Button>
              <Button class="buttonColor-6 ml-1">刪除</Button>
            </div>
          </div>
          <div class="contentBox">
            <el-table :data="[{},{},{}]" border class="mb-1" style="width: 100%">
              <el-table-column type="selection" width="55"></el-table-column>
              <el-table-column prop="date" label="功能" width="320px">
                <template>
                  <Button class="buttonColor-14 ml-1">閱覽</Button>
                  <Button class="buttonColor-14 ml-1">列印</Button>
                  <Button class="buttonColor-14 ml-1">Email</Button>
                  <Button class="buttonColor-14 ml-1">PDF</Button>
                </template>
              </el-table-column>
              <el-table-column prop="date" label="類型"></el-table-column>
              <el-table-column prop="date" label="病歷日期"></el-table-column>
              <el-table-column prop="date" label="病歷夾"></el-table-column>
              <el-table-column prop="date" label="文件類別"></el-table-column>
              <el-table-column prop="date" label="卷冊"></el-table-column>
              <el-table-column prop="date" label="編號"></el-table-column>
              <el-table-column prop="date" label="版次"></el-table-column>
              <el-table-column prop="date" label="備註"></el-table-column>
            </el-table>
            <el-pagination
              class="d-flex justify-content-center" background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="1"
              :page-sizes="[10, 20, 30, 50, 100]"
              :page-size="10"
              layout="prev, pager, next, sizes, total"
              :total="1000" />
          </div>
        </CardBox>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import DataSearchBox from '@/components/DataSearchBox.vue'
export default {
  components: {DataSearchBox},
  data() {
    return {
      
    }
  }
}
</script>