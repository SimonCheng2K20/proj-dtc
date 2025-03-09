<template>
  <div class="BasicInfo">
    <Dialog
      v-model="showDialog"
      :title="isAdd ? '新增借閱' : '編輯借閱'"
      :width="'90vw'"
    >
      <AddBorrowMedicalRecords
        :lendingClassSelect="lendingClassSelect"
        @sub="sub"
        @edit="edit"
        :isAdd="isAdd"
        :editData="editData"
        @close="showDialog = !showDialog"
      />
    </Dialog>
    <CardBox class="mb-1" title="電子病歷借閱作業">
      <el-form label-position="left" label-width="170px">
        <el-row :gutter="10">
          <el-col :md="6">
            <InputLabel class="mb-1" title="借閱單號">
              <el-input v-model="tableDataFormCopy.LendingId" />
            </InputLabel>
          </el-col>
          <el-col :md="6">
            <InputLabel class="mb-1" title="借閱原因">
              <el-select
                v-model="tableDataFormCopy.LendingClassOid"
                style="width: 100%"
              >
                <el-option
                  v-for="item in lendingClassSelect"
                  :key="item.LendingClassOid"
                  :label="item.LendingClassId"
                  :value="item.LendingClassOid"
                >
                </el-option>
              </el-select>
            </InputLabel>
          </el-col>
          <el-col :md="6">
            <InputLabel class="mb-1" title="借閱者代號">
              <el-select
                v-model="tableDataFormCopy.LendingAccountNo"
                filterable
                remote
                reserve-keyword
                placeholder="請輸入"
                style="width: 100%"
              >
                <!-- <el-option v-for="item in accountList" :key="item.No" :label="`${item.No} - ${item.Name} (${item.EmpNo})`" :value="item.No"> </el-option> -->
                <el-option
                  v-for="item in accountList"
                  :key="item.No"
                  :label="`${item.No} - ${item.Name}`"
                  :value="item.No"
                >
                </el-option>
              </el-select>
            </InputLabel>
          </el-col>
          <el-col :md="8">
            <InputLabel class="mb-1" title="借閱期間">
              <el-date-picker
                v-model="tableDataFormCopy.LendingDate"
                type="daterange"
                range-separator="~"
                value-format="yyyyMMdd"
                style="width: 100%"
              />
            </InputLabel>
          </el-col>
          <!--<el-col :md="6">
            <InputLabel class="mb-1" title="借閱者院內員工代號" labelWidth="300px">
              <el-input />
            </InputLabel>
          </el-col>-->
        </el-row>
      </el-form>
      <div class="d-flex justify-content-end">
        <Button
          class="buttonColor-1 mr-1"
          @click="
            tableDataFormCopy.page = 1;
            getData();
          "
          >查詢</Button
        >
        <Button class="buttonColor-10 mr-1" @click="clean">清除</Button>
        <Button class="buttonColor-6" @click="showDialog = !showDialog; isAdd = true"
          >新增借閱</Button
        >
      </div>
    </CardBox>
    <CardBox class="mb-1" v-if="tableData">
      <el-table
        ref="table"
        class="mb-1"
        :default-sort="{
          prop: tableDataFormCopy.sortKey,
          order: tableDataFormCopy.sortOrder,
        }"
        :data="tableData.Items"
        border
        stripe
        style="width: 100%"
        @sort-change="sortChange"
      >
        <el-table-column label="操作" width="160px">
          <template slot-scope="scope">
            <Button class="buttonColor-1" style="margin: auto 4px;" @click="showDialog = !showDialog; isAdd = false; editData= scope.row">編輯</Button>
            <Button class="buttonColor-2" style="margin: auto 4px;" @click="del(scope.row)">註銷</Button>
          </template>
        </el-table-column>
        <el-table-column
          prop="LendingId"
          label="借閱單號"
          sortable
        ></el-table-column>
        <el-table-column
          prop="LendingAccountNo"
          label="借閱者代號"
          sortable
        ></el-table-column>
        <el-table-column
          prop="LendingAccountName"
          label="借閱者姓名"
          sortable
        ></el-table-column>
        <el-table-column prop="LendingFromDate" label="借閱期間起" sortable>
          <template slot-scope="scope">
            {{
              $global.stringToDate(scope.row.LendingFromDate, [
                [0, 4],
                [4, 2],
                [6, 2],
              ])
            }}
          </template>
        </el-table-column>
        <el-table-column prop="LendingToDate" label="借閱期間迄" sortable>
          <template slot-scope="scope">
            {{
              $global.stringToDate(scope.row.LendingToDate, [
                [0, 4],
                [4, 2],
                [6, 2],
              ])
            }}
          </template>
        </el-table-column>
        <el-table-column prop="LendingClassOid" label="借閱原因" sortable>
          <template slot-scope="scope">
            {{
              $store.getters.lendingClassObj[scope.row.LendingClassOid]
                .LendingClassId
            }}
          </template>
        </el-table-column>
        <el-table-column prop="Remark" label="備註" sortable></el-table-column>
      </el-table>
      <el-pagination
        class="d-flex justify-content-center"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="tableDataFormCopy.page"
        :page-sizes="[10, 20, 30, 50, 100]"
        :page-size="tableDataFormCopy.limit"
        layout="prev, pager, next, sizes, total"
        :total="tableData.Count"
      />
    </CardBox>
  </div>
</template>

<script>
import moment from "moment";
import AddBorrowMedicalRecords from "@/components/AddBorrowMedicalRecords.vue";

export default {
  components: { AddBorrowMedicalRecords },
  data() {
    return {
      showDialog: false,
      isAdd: true,
      accountList: [],
      tableData: null,
      tableDataForm: {
        LendingId: "",
        LendingAccountNo: "",
        LendingClassOid: "",
        LendingClassDesc: "",
        LendingDate: [
          moment().format("YYYYMMDD"),
          moment().add(1, "days").format("YYYYMMDD"),
        ],
        sortKey: "LendingAccountNo",
        sortOrder: 'desc',
        page: 1,
        limit: 10,
      },
      tableDataFormCopy: null,
      lendingClassSelect: [],
      editData: null,
    };
  },
  async created() {
    this.tableDataFormCopy = JSON.parse(JSON.stringify(this.tableDataForm));
    this.accountList = await this.$api
      .getAccountAllList()
      .then((res) => res.Items);

    console.log(`this.accountList: `, this.accountList);
    console.log(
      `this.tableDataFormCopy.LendingDate: `,
      this.tableDataFormCopy.LendingDate
    );

    await this.getLendingClassSelect();
    await this.getData();
    // console.log(`$store.state.lendingClass: `, this.$store.state.lendingClass)
  },
  methods: {
    async getLendingClassSelect() {
      let filter = [];
      filter.push(`IsActive eq 'Y'`);
      filter = filter.length ? filter.join(" and ") : null;
      let data = {
        $filter: filter,
      };
      let res = await this.$api.getLendingClass(data);
      if (res) {
        this.lendingClassSelect = res.Items;
      }
      // console.log(`this.lendingClassSelect: `, this.lendingClassSelect)
    },
    async getData() {
      let filter = [];
      if (this.tableDataFormCopy.LendingClassOid)
        filter.push(
          `LendingClassOid eq '${this.tableDataFormCopy.LendingClassOid}'`
        );
      if (this.tableDataFormCopy.LendingAccountNo)
        filter.push(
          `DcsUser/Usrid eq '${this.tableDataFormCopy.LendingAccountNo}'`
        );
      if (
        this.tableDataFormCopy.LendingDate &&
        this.tableDataFormCopy.LendingDate[0]
      )
        filter.push(
          `LendingFromDate ge '${this.tableDataFormCopy.LendingDate[0]}'`
        );
      if (
        this.tableDataFormCopy.LendingDate &&
        this.tableDataFormCopy.LendingDate[1]
      )
        filter.push(
          `LendingFromDate le '${this.tableDataFormCopy.LendingDate[1]}'`
        );
      if (this.tableDataFormCopy.LendingId)
        filter.push(
          `contains(LendingId,'${this.tableDataFormCopy.LendingId}')`
        );
      /*if(this.tableDataFormCopy.LendingClassDesc) filter.push(`contains(LendingClassDesc,'${this.tableDataFormCopy.LendingClassDesc}')`)*/
      filter = filter.length ? filter.join(" and ") : null;

      let tempSortKey = this.tableDataFormCopy.sortKey
      let tempSortOrder = this.tableDataFormCopy.sortOrder
      
      if(this.tableDataFormCopy.sortKey === 'LendingAccountNo' ){
        tempSortKey = `DcsUser/Usrid`
      }else if(this.tableDataFormCopy.sortKey === 'LendingAccountName' ){
        tempSortKey = `DcsUser/Usrname`
      }

      let data = {
        $filter: filter,
        $orderby: this.$global.toODataOrder(
          tempSortKey ? tempSortKey : null,
          tempSortOrder ? tempSortOrder : 'desc'
        ),
        $top: this.tableDataFormCopy.limit,
        $skip: this.tableDataFormCopy.limit * (this.tableDataFormCopy.page - 1),
      };

      this.$store.commit("loading", true);
      this.tableData = await this.$api.getLending(data);
      this.$store.commit("loading", false);
    },
    async clean() {
      this.tableDataFormCopy = JSON.parse(JSON.stringify(this.tableDataForm));
      this.$refs.table.sort(
        this.tableDataFormCopy.sortKey,
        this.tableDataFormCopy.sortOrder
      );
    },
    async handleSizeChange(x) {
      this.tableDataFormCopy.page = 1;
      this.tableDataFormCopy.limit = x;
      await this.getData();
    },
    async handleCurrentChange(x) {
      this.tableDataFormCopy.page = x;
      await this.getData();
    },
    async sortChange(x) {
      let { order, prop } = x;
      this.tableDataFormCopy.sortKey = prop;
      this.tableDataFormCopy.sortOrder = order;
      await this.getData();
    },
    async edit(e) {
      try {
        this.$store.commit("loading", true);
        await this.$api.putLending(e);
        await this.getData();
        this.$message.success('編輯借閱成功')
      } catch (err) {
        console.log(`err: `, err);
      } finally {
        this.$store.commit("loading", false);
        this.showDialog = false
      }
    },
    async sub(e) {
      try {
        this.$store.commit("loading", true);
        await this.$api.postLending(e);
        await this.getData();
        this.$message.success('新增借閱成功')
      } catch (err) {
        console.log(`err: `, err);
      } finally {
        this.$store.commit("loading", false);
        this.showDialog = false
      }
    },
    async del(x) {
      console.log(`del > x: `, x);
      try {
        this.$store.commit("loading", true);
        await this.$api.deleteLending(x.LendingId);
        await this.getData();
      } catch (err) {
        console.log(`error: `, err);
      } finally {
        this.$emit("refresh");
        this.$store.commit("loading", false);
      }
    },
  },
};
</script>
