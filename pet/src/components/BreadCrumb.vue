<template>
  <div class="top">
    <div class="left">
      <i class="el-icon-s-unfold"></i>&nbsp;&nbsp;
    </div>
    <div class="right">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item v-for="(item, index) in breadList" :key="item.path">
          <router-link to="/admin" v-if="index == 0">{{
            item.meta.title
          }}</router-link>
          <span v-else>{{ item.meta.title }}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </div>
</template>
<script>
export default {
  name: "BreadCrumb",
  computed: {
    breadList() {
      return this.$route.matched; // 获取当前路由的所有嵌套路径
    },
  },
};
</script>

<style scoped>
.top {
  display: flex;
  align-items: center;
  height: 50px;
  background-color: #fff;
}
</style>
