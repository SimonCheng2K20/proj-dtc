<template>
  <div class="cus-tree-content">
    <el-tree
      class="ct-item"
      ref="tree"
      default-expand-all
      :data="updateData"
      :props="defaultProps"
      show-checkbox
      node-key="No"
      check-strictly
      @check="check"
    >
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <i :class="data.Type === 1 ? 'el-icon-document-copy' : 'el-icon-key'" />
        {{ `${data.Name}` }}
      </span>
    </el-tree>
  </div>
</template>

<script>
export default {
  props: ["list", "role"],
  data() {
    return {
      tableList: [],
      functionNos: [],
      defaultProps: {
        label: 'Name',
      }
    };
  },
  computed: {
   updateData(){
    if(this.list && this.list.length){
      return this.list.filter((v)=>{return v.IsActivated === true})
    }else{
      return []
    }
   }
  },
  async created() {
    await this.getData();
  },
  methods: {
    async getData() {
      this.$store.commit("loading", true);
      this.functionNos = await this.$api.getRoleFunctionNos({
        roleNo: this.role,
      });
      this.$refs.tree.setCheckedKeys(this.functionNos);
      this.$store.commit("loading", false);
    },
    async check(e) {
      let list = this.$refs.tree.getCheckedKeys();
      this.$store.commit("loading", true);
      if (list.includes(e.No)) {
        await this.$api.addFunction({ RoleNo: this.role, FunctionNo: e.No });
      } else {
        await this.$api.removeFunction({ RoleNo: this.role, FunctionNo: e.No });
      }
      this.$emit("getData", list);
      this.$store.commit("loading", false);
    },
  },
};
</script>