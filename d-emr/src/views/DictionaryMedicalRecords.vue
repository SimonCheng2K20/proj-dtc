<template>
  <div class="BasicInfo">
    <Dialog
      v-model="showDialog"
      :title="isAdd ? '新增敏感病歷類別' : '編輯敏感病歷類別'"
      :width="'40vw'"
    >
      <el-form
        ref="postform"
        label-position="left"
        :model="formCopy"
        :rules="rules"
        label-width="140px"
        @keyup.enter.native="sub"
      >
        <InputLabel class="mb-1" title="敏感病歷代碼" prop="SheetEventClassId">
          <el-input v-model="formCopy.SheetEventClassId" />
        </InputLabel>
        <InputLabel
          class="mb-1"
          title="敏感病歷名稱"
          prop="SheetEventClassName"
        >
          <el-input v-model="formCopy.SheetEventClassName" />
        </InputLabel>
        <InputLabel class="mb-1" title="顯示用字" prop="WrapWording">
          <el-input v-model="formCopy.WrapWording" />
        </InputLabel>
        <InputLabel class="mb-1" title="永久保存">
          <el-radio-group class="ml-1" v-model="formCopy.IsPerm">
            <el-radio label="Y">啟用</el-radio>
            <el-radio label="N">停用</el-radio>
          </el-radio-group>
        </InputLabel>
        <InputLabel class="mb-1" title="允許交換">
          <el-radio-group class="ml-1" v-model="formCopy.Interchange">
            <el-radio label="Y">啟用</el-radio>
            <el-radio label="N">停用</el-radio>
          </el-radio-group>
        </InputLabel>
        <!-- <InputLabel class="mb-1" title="啟用狀態">
          <el-radio-group class="ml-1" v-model="formCopy.IsSystem">
            <el-radio label="Y">啟用</el-radio>
            <el-radio label="N">停用</el-radio>
          </el-radio-group>
        </InputLabel> -->
        <InputLabel class="mb-1" title="啟用狀態">
          <el-radio-group class="ml-1" v-model="formCopy.OnNotGrant">
            <el-radio label="0">啟用</el-radio>
            <el-radio label="1">停用</el-radio>
          </el-radio-group>
        </InputLabel>
      </el-form>
      <div class="d-flex justify-content-end">
        <Button class="buttonColor-10 mr-1" @click="showDialog = !showDialog"
          >取消</Button
        >
        <Button class="buttonColor-1" @click="sub">建立</Button>
      </div>
    </Dialog>
    <CardBox class="mb-1" title="敏感病歷類別維護">
      <el-form
        label-position="left"
        :model="tableDataFormCopy"
        label-width="130px"
        @keyup.enter.native="getData"
      >
        <el-row :gutter="10">
          <el-col :md="6">
            <!-- <InputLabel class="mb-1" title="啟用狀態">
              <el-radio-group class="ml-1" v-model="tableDataFormCopy.IsSystem">
                <el-radio label="Y">啟用</el-radio>
                <el-radio label="N">停用</el-radio>
              </el-radio-group>
            </InputLabel> -->
            <InputLabel class="mb-1" title="啟用狀態">
              <el-radio-group
                class="ml-1"
                v-model="tableDataFormCopy.OnNotGrant"
              >
                <el-radio label="0">啟用</el-radio>
                <el-radio label="1">停用</el-radio>
              </el-radio-group>
            </InputLabel>
          </el-col>
          <el-col :md="6">
            <InputLabel class="mb-1" title="敏感病歷代碼">
              <el-input v-model="tableDataFormCopy.SheetEventClassId" />
            </InputLabel>
          </el-col>
          <el-col :md="6">
            <InputLabel class="mb-1" title="敏感病歷名稱">
              <el-input v-model="tableDataFormCopy.SheetEventClassName" />
            </InputLabel>
          </el-col>
          <el-col :md="6">
            <InputLabel class="mb-1" title="顯示用字">
              <el-input v-model="tableDataFormCopy.WrapWording" />
            </InputLabel>
          </el-col>
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
        <Button class="buttonColor-6" @click="add">新增敏感病歷</Button>
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
            <Button class="buttonColor-3 mr-1" @click="edit(scope.row)"
              >編輯</Button
            >
            <Button class="buttonColor-2" @click="del(scope.row)">刪除</Button>
          </template>
        </el-table-column>
        <el-table-column
          prop="SheetEventClassId"
          label="敏感病歷代碼"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          prop="SheetEventClassName"
          label="敏感病歷名稱"
          sortable="custom"
        ></el-table-column>
        <el-table-column
          prop="WrapWording"
          label="顯示用字"
          sortable="custom"
        ></el-table-column>
        <el-table-column prop="IsPerm" label="永久保存" sortable="custom">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.IsPerm"
              true-label="Y"
              false-label="N"
              @change="changeActive(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column prop="Interchange" label="允許交換" sortable="custom">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.Interchange"
              true-label="Y"
              false-label="N"
              @change="changeActive(scope.row)"
            />
          </template>
        </el-table-column>
        <!-- <el-table-column prop="IsSystem" label="啟用狀態" sortable="custom">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.IsSystem" true-label="Y" false-label="N" @change="changeActive(scope.row)" />
          </template>
        </el-table-column> -->
        <!-- <el-table-column prop="IsActive" label="啟用狀態" sortable="custom">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.IsActive" true-label="Y" false-label="N" @change="changeActive(scope.row)" />
          </template>
        </el-table-column> -->
        <el-table-column prop="OnNotGrant" label="啟用狀態" sortable="custom">
          <template slot-scope="scope">
            <el-checkbox
              v-model="scope.row.OnNotGrant"
              true-label="0"
              false-label="1"
              @change="changeActive(scope.row)"
            />
          </template>
        </el-table-column>
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
export default {
  data() {
    return {
      showDialog: false,
      isAdd: true,
      tableData: null,
      tableDataForm: {
        SheetEventClassOid: "",
        SheetEventClassId: "",
        SheetEventClassName: "",
        OnNotGrant: "",
        // IsSystem:'',
        sortKey: "SheetEventClassId",
        sortOrder: null,
        page: 1,
        limit: 10,
      },
      tableDataFormCopy: null,
      form: {
        SheetEventClassOid: "",
        SheetEventClassId: "",
        SheetEventClassName: "",
        SheetEventClassDesc: "",
        OnNotGrant: "0",
        WrapWording: "",
        Interchange: "Y",
        IsPerm: "Y",
      },
      formCopy: null,
      rules: {
        SheetEventClassId: [
          { required: true, message: "此為必填欄位", trigger: "blur" },
        ],
        SheetEventClassName: [
          { required: true, message: "此為必填欄位", trigger: "blur" },
        ],
        WrapWording: [
          { required: true, message: "此為必填欄位", trigger: "blur" },
          { min: 1, max: 6, message: "字數不得超過6個字", trigger: "blur" },
        ],
      },
    };
  },
  async created() {
    this.formCopy = JSON.parse(JSON.stringify(this.form));
    this.tableDataFormCopy = JSON.parse(JSON.stringify(this.tableDataForm));
    await this.getData();
  },
  methods: {
    async getData() {
      let filter = [];
      if (this.tableDataFormCopy.OnNotGrant)
        filter.push(`OnNotGrant eq '${this.tableDataFormCopy.OnNotGrant}'`);
      if (this.tableDataFormCopy.SheetEventClassId)
        filter.push(
          `contains(SheetEventClassId,'${this.tableDataFormCopy.SheetEventClassId}')`
        );
      if (this.tableDataFormCopy.SheetEventClassName)
        filter.push(
          `contains(SheetEventClassName,'${this.tableDataFormCopy.SheetEventClassName}')`
        );
      if (this.tableDataFormCopy.WrapWording)
        filter.push(
          `contains(WrapWording,'${this.tableDataFormCopy.WrapWording}')`
        );
      filter = filter.length ? filter.join(" and ") : null;

      let data = {
        $filter: filter,
        $orderby: this.$global.toODataOrder(
          this.tableDataFormCopy.sortKey,
          this.tableDataFormCopy.sortOrder
        ),
        $top: this.tableDataFormCopy.limit,
        $skip: this.tableDataFormCopy.limit * (this.tableDataFormCopy.page - 1),
      };

      this.$store.commit("loading", true);
      this.tableData = await this.$api.getSheetEventClass(data);
      this.$store.commit(
        "sheetEventClass",
        await this.$api.getSheetEventClass().then((res) => res.Items)
      );
      this.$store.commit("loading", false);
    },
    async changeActive(x) {
      this.$store.commit("loading", true);

      // if(x && x.IsActive === 'Y'){
      //   x.OnNotGrant = '0'
      // }else if (x && x.IsActive === 'N'){
      //   x.OnNotGrant = '1'
      // }

      console.log(`changeActive (after): `, x);

      await this.$api.putSheetEventClass(x);
      await this.getData();
      this.$message.success("狀態更改成功");
      this.$store.commit("loading", false);
    },
    add() {
      this.formCopy = JSON.parse(JSON.stringify(this.form));
      this.isAdd = true;
      this.showDialog = true;
    },
    edit(x) {
      this.formCopy = JSON.parse(JSON.stringify(x));
      this.isAdd = false;
      this.showDialog = true;
    },
    async del(x) {
      if (!confirm("確定刪除?")) return false;
      this.$store.commit("loading", true);
      await this.$api.delSheetEventClass(x.SheetEventClassOid);
      await this.getData();
      this.$store.commit("loading", false);
      this.$message.success("刪除成功");
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
    async sub() {
      this.$refs.postform.validate(async (valid) => {
        if (valid) {
          this.$store.commit("loading", true);
          if (this.isAdd) {
            await this.$api.postSheetEventClass(this.formCopy);
          } else {
            await this.$api.putSheetEventClass(this.formCopy);
          }
          await this.getData();
          this.showDialog = false;
          this.$store.commit("loading", false);
          this.$message.success(this.isAdd ? "新增成功" : "編輯成功");
        }
      });
    },
  },
};
</script>
