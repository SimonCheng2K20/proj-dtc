<template>
  <div class="featuresList">
    <el-tree ref="tree" default-expand-all :data="routeList" show-checkbox node-key="name" check-strictly @check="show">
      <span slot-scope="{ node,data }">
        <i :class="data.meta.isFeatures ? 'el-icon-s-tools':'el-icon-tickets'" />
        {{data.meta.title}}
      </span>
    </el-tree>
  </div>
</template>

<script>
export default {
  computed: {
    routeList() {
      let res=this.$router.options.routes.filter(res=>res.meta&&res.meta.show)
      let arr=this.featuresPush(JSON.parse(JSON.stringify(res)))
      return arr
    }
  },
  methods: {
    show() {
      console.log(this.$refs.tree.getCheckedKeys())
    },
    featuresPush(x,first=true) {
      if(first) {
        let res=[]
        for(let item of x) {
          res.push(...this.featuresPush(item,false))
        }
        return res
      }
      else {
        if(x.children) {
          let res=[]
          for(let item of x.children) {
            res.push(...this.featuresPush(item,false))
          }
          x.children=res
          if(x.meta.featuresList) {
            x.meta.featuresList.forEach(r => r.meta.isFeatures=true)
            x.children.push(...x.meta.featuresList)
          }
        }
        else {
          x.children=[]
          if(x.meta.featuresList) {
            x.meta.featuresList.forEach(r => r.meta.isFeatures=true)
            x.children=x.meta.featuresList
          }
        }
        return [x]
      }
    }
  }
}
</script>