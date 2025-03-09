<template>
  <div class="BasicInfo">
    <CardBox class="mb-1" title="電子病歷交換">
      <el-form label-position="left" label-width="150px">
        <el-row :gutter="10">
          <el-col :md="8">
            <InputLabel class="mb-1" title="病歷號">
              <el-input v-model="tableDataFormCopy.ChartNo" />
            </InputLabel>
          </el-col>
          <el-col :md="8">
            <InputLabel class="mb-1" title="簽章日期">
              <el-date-picker v-model="tableDataFormCopy.SignatureDate" type="daterange" range-separator="~" value-format="yyyyMMdd" style="width:100%;" />
            </InputLabel>
          </el-col>
          <el-col :md="8">
            <InputLabel class="mb-1" title="單張種類">
              <el-input />
            </InputLabel>
          </el-col>
          <el-col :md="8">
            <InputLabel class="mb-1" title="姓名">
              <el-input v-model="tableDataFormCopy.PatientName" />
            </InputLabel>
          </el-col>
          <el-col :md="8">
            <InputLabel class="mb-1" title="上傳日期">
              <el-date-picker v-model="tableDataFormCopy.ProcDate" type="daterange" range-separator="~" value-format="yyyyMMdd" style="width:100%;" />
            </InputLabel>
          </el-col>
          <el-col :md="8">
            <InputLabel class="mb-1" title="上傳訊息">
              <el-input v-model="tableDataFormCopy.Message" />
            </InputLabel>
          </el-col>
        </el-row>
      </el-form>
      <div class="d-flex justify-content-end">
        <Button class="buttonColor-1 mr-1" @click="tableDataFormCopy.page=1;getData()">查詢</Button>
        <Button class="buttonColor-10" @click="clean">清除</Button>
      </div>
    </CardBox>
    <!--<MedicalRecordsExchange :data="tableData" @tabChange="tabChange" v-if="tableData" />-->
    <CardBox class="mb-1" v-if="tableData">
      <el-tabs v-model="tableDataFormCopy.ProcFlag" type="card" @tab-click="getData">
        <el-tab-pane label="待驗證" name="P"></el-tab-pane>
        <el-tab-pane label="上傳失敗" name="E"></el-tab-pane>
        <el-tab-pane label="已上傳" name="Y"></el-tab-pane>
      </el-tabs>
      <el-table ref="table" class="mb-1" :default-sort="{prop:tableDataFormCopy.sortKey,order:tableDataFormCopy.sortOrder}" :data="tableData.Items" border stripe style="width: 100%" @sort-change="sortChange" >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="date" label="閱覽" sortable v-if="tableDataFormCopy.ProcFlag==='P'"></el-table-column>
        <el-table-column prop="ChartNo" label="病歷號" sortable></el-table-column>
        <el-table-column prop="PatientName" label="姓名" sortable></el-table-column>
        <el-table-column prop="" label="單張種類" sortable></el-table-column>
        <el-table-column prop="SignerName" label="簽章者" sortable></el-table-column>
        <el-table-column prop="ProcFlag" label="上傳狀態" sortable v-if="tableDataFormCopy.ProcFlag==='E'">
          <template slot-scope="scope">
            {{scope.row.ProcFlag==='P' ? '待驗證' : scope.row.ProcFlag==='E' ? '上傳失敗' : scope.row.ProcFlag==='Y' ? '已上傳' : '其他'}}
          </template>
        </el-table-column>
        <el-table-column prop="ProcDate" label="上傳日期" sortable v-if="tableDataFormCopy.ProcFlag!=='P'">
          <template slot-scope="scope">
            <span v-if="tableDataFormCopy.ProcFlag!=='P'&&scope.row.ProcDate">{{$global.stringToDate(scope.row.ProcDate,[[0,4],[4,2],[6,2]])}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="Message" label="上傳訊息" sortable v-if="tableDataFormCopy.ProcFlag!=='P'"></el-table-column>
        <el-table-column prop="CreateOn" label="建立日期" sortable>
          <template slot-scope="scope">
            {{$global.YYYYMMDDHHmm(scope.row.CreateOn)}}
          </template>
        </el-table-column>
        <el-table-column prop="SignatureDate" label="簽章日期" sortable>
          <template slot-scope="scope">
            {{$global.stringToDate(scope.row.SignatureDate,[[0,4],[4,2],[6,2]])}}
          </template>
        </el-table-column>
        <el-table-column prop="ApprovedDateTime" label="病歷完成日期" sortable>
          <template slot-scope="scope">
            {{$global.stringToDate(scope.row.ApprovedDateTime,[[0,4],[4,2],[6,2]])}}
          </template>
        </el-table-column>
        <el-table-column prop="SheetId" label="單張編號" sortable></el-table-column>
      </el-table>
      <el-pagination
        class="d-flex justify-content-center" background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="[10, 20, 30, 50, 100]"
        :page-size="tableDataFormCopy.limit"
        layout="prev, pager, next, sizes, total"
        :total="tableData.Count" />
    </CardBox>
  </div>
</template>

<script>
import CardBox from '../components/CardBox.vue'
//import MedicalRecordsExchange from '@/components/MedicalRecordsExchange'

export default {
    //components: {MedicalRecordsExchange},
    data() {
        return {
            tableDataForm: {
                ProcFlag: "P",
                ChartNo: "",
                PatientName: "",
                SignatureDate: "",
                ProcDate: "",
                Message: "",
                sortKey: "ChartNo",
                sortOrder: null,
                page: 1,
                limit: 10,
            },
            tableDataFormCopy: null,
            tableData: null
        };
    },
    async created() {
        this.tableDataFormCopy = JSON.parse(JSON.stringify(this.tableDataForm));
        await this.getData();
    },
    methods: {
      async getData() {
          let filter = [];
          if (this.tableDataFormCopy.ProcFlag) filter.push(`ProcFlag eq '${this.tableDataFormCopy.ProcFlag}'`);
          if (this.tableDataFormCopy.ChartNo) filter.push(`contains(ChartNo,'${this.tableDataFormCopy.ChartNo}')`);
          if (this.tableDataFormCopy.PatientName) filter.push(`contains(PatientName,'${this.tableDataFormCopy.PatientName}')`);
          if (this.tableDataFormCopy.SignatureDate && this.tableDataFormCopy.SignatureDate[0]) {
            filter.push(`SignatureDate ge '${this.tableDataFormCopy.SignatureDate[0]}000000'`);
          }
          if (this.tableDataFormCopy.SignatureDate && this.tableDataFormCopy.SignatureDate[1]) {
            filter.push(`SignatureDate lt '${this.tableDataFormCopy.SignatureDate[1]}999999'`);
          }
          if (this.tableDataFormCopy.ProcDate && this.tableDataFormCopy.ProcDate[0]) {
            filter.push(`ProcDate ge '${this.tableDataFormCopy.ProcDate[0]}'`);
          }
          if (this.tableDataFormCopy.ProcDate && this.tableDataFormCopy.ProcDate[1]) {
            filter.push(`ProcDate lt '${this.tableDataFormCopy.ProcDate[1]}'`);
          }
          if (this.tableDataFormCopy.Message)
            filter.push(`contains(Message,'${this.tableDataFormCopy.Message}')`);
          filter = filter.length ? filter.join(" and ") : null;
          let data = {
            $filter: filter,
            $orderby: this.$global.toODataOrder(this.tableDataFormCopy.sortKey, this.tableDataFormCopy.sortOrder),
            $top: this.tableDataFormCopy.limit,
            $skip: this.tableDataFormCopy.limit * (this.tableDataFormCopy.page - 1),
          }
          this.$store.commit("loading", true);
          this.tableData = await this.$api.getExchangeMid(data);
          this.$store.commit("loading", false);
      },
      async clean() {
        this.tableDataFormCopy = JSON.parse(JSON.stringify(this.tableDataForm));
        this.$refs.table.sort(this.tableDataFormCopy.sortKey,this.tableDataFormCopy.sortOrder)
      },
      async handleSizeChange(x) {
        this.tableDataFormCopy.page=1
        this.tableDataFormCopy.limit=x
        await this.getData()
      },
      async handleCurrentChange(x) {
        this.tableDataFormCopy.page=x
        await this.getData()
      },
      async sortChange(x) {
        let {order,prop} = x
        this.tableDataFormCopy.sortKey=prop
        this.tableDataFormCopy.sortOrder=order
        await this.getData()
      },
    },
    components: { CardBox }
}
</script>