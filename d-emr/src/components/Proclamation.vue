<template>
  <div class="proclamation">
    <Dialog v-model="showDialog" :title="chooseData.BbTitle" :width="'80vw'">
      <el-tabs v-model="dialogBoxKey" type="card">
        <el-tab-pane label="主要內容" name="content">
          <div class="d-flex justify-content-end">
            <span class="proclamationListItemTime"
              >發表時間: {{ $global.YYYYMMDDHHmm(chooseData.CreateOn) }}</span
            >
          </div>
          <div class="proclamationHTML" v-html="chooseData.BbContent"></div>
        </el-tab-pane>
        <!-- <el-tab-pane label="附件" name="file"> </el-tab-pane> -->
      </el-tabs>
    </Dialog>
    <div class="proclamationTitle">
      <img class="mr-1" src="../assets/img/svg/bulletinboard.svg" />
      公告訊息
    </div>
    <div class="proclamationList mb-1">
      <div
        class="proclamationListItem"
        v-for="(item, index) in tableData.Items"
        :key="index"
        @click="
          chooseData = item;
          showDialog = true;
        "
      >
        <div class="proclamationListItemTime mr-1">
          {{ $global.YYYYMMDDHHmm(item.CreateOn) }}
        </div>
        <div class="proclamationListItemTitle">{{ item.BbTitle }}</div>
      </div>
    </div>
    <el-pagination
      class="d-flex justify-content-end"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="tableDataFormCopy.page"
      :page-size="tableDataFormCopy.limit"
      layout="prev, pager, next, total"
      :total="tableData.Count"
    />
  </div>
</template>

<script>
import moment from "moment";

export default {
  data() {
    return {
      tableDataFormCopy: {
        page: 1,
        limit: 5,
      },
      showDialog: false,
      dialogBoxKey: "content",
      chooseData: {},
      tableData: [],
    };
  },
  async created() {
    await this.getData();
  },
  methods: {
    async getData() {
      let data = {
        $filter: `ValidFrom le ${moment().format(
          "YYYY-MM-DD"
        )}T00:00:00Z and ValidTo ge ${moment().format("YYYY-MM-DD")}T00:00:00Z`,
        $orderby: "CreateOn desc",
        $top: this.tableDataFormCopy.limit,
        $skip: this.tableDataFormCopy.limit * (this.tableDataFormCopy.page - 1),
      };
      try {
        this.$store.commit("loading", true);
        this.tableData = await this.$api
        .getBulletinBoard(data)
        .then((res) => res);
      } catch (err) {
        console.log(`error: `, err);
      } finally {
        this.$store.commit("loading", false);
      }
    },
    async handleSizeChange(x) {
      this.tableDataFormCopy.limit = x;
      await this.getData();
    },
    async handleCurrentChange(x) {
      this.tableDataFormCopy.page = x;
      await this.getData();
    },
  },
};
</script>
