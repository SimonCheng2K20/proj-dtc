<template>
  <div class="SystemAccount">
    <div class="searchBar">
      <el-form label-position="left" label-width="100px" @keyup.enter.native="getData">
        <el-row :gutter="10">
          <el-col :md="8">
            <InputLabel class="mb-1" title="簽章狀態">
              <el-input></el-input>
            </InputLabel>
          </el-col>
          <el-col :md="8">
            <InputLabel class="mb-1" title="病歷夾">
              <el-input></el-input>
            </InputLabel>
          </el-col>
          <el-col :md="8">
            <InputLabel class="mb-1" title="文件類別">
              <el-input></el-input>
            </InputLabel>
          </el-col>
          <el-col :md="8">
            <InputLabel class="mb-1" title="病歷日期">
              <el-input></el-input>
            </InputLabel>
          </el-col>
          <el-col :md="8">
            <InputLabel class="mb-1" title="病歷號碼">
              <el-input></el-input>
            </InputLabel>
          </el-col>
          <el-col :md="8">
            <InputLabel class="mb-1" title="身分證號">
              <el-input></el-input>
            </InputLabel>
          </el-col>
        </el-row>
      </el-form>
      <div class="d-flex justify-content-end">
        <Button class="buttonColor-1 mr-1">查詢</Button>
        <Button class="buttonColor-2 mr-1">清除</Button>
        <Button class="buttonColor-3 mr-1">新增帳號</Button>
        <Button class="buttonColor-15 mr-1">醫事人員卡認證</Button>
        <Button class="buttonColor-16">簽章</Button>
      </div>
    </div>
    <div class="contentBox">
      <el-table :data="[{},{},{}]" border class="mb-1" style="width: 100%">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="date" label="病歷號碼"></el-table-column>
        <el-table-column prop="date" label="姓名"></el-table-column>
        <el-table-column prop="date" label="病歷日期"></el-table-column>
        <el-table-column prop="date" label="病歷夾"></el-table-column>
        <el-table-column prop="date" label="文件類別"></el-table-column>
        <el-table-column prop="date" label="卷冊"></el-table-column>
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
  </div>
</template>

<script>
export default {
  data() {
    return {

    }
  },
  methods: {
    async getData() {

    },
    async handleSizeChange() {

    },
    async handleCurrentChange() {

    }
  }
}
</script>