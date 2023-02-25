<template>
  <div class="main">
    <div class="left">
      <el-row class="tac">
        <el-col :span="12">
          <div class="title"><img src="../assets/images/logo.jpeg" alt="">乐宠后台管理系统</div>
          <el-menu :router="true" :default-active="this.$route.path" class="el-menu-vertical-demo"
            background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
            <el-menu-item index="/admin/home">
              <i class="el-icon-s-home"></i>
              <span slot="title">首页</span>
            </el-menu-item>
            <el-menu-item index="/admin/user">
              <i class="el-icon-user-solid"></i>
              <span slot="title">用户管理</span>
            </el-menu-item>
            <el-submenu index="1">
              <template #title>
                <i class="el-icon-document-copy"></i>
                <span>文章管理</span>
              </template>
              <el-menu-item index="/admin/article"><i class="el-icon-document"></i>所有文章</el-menu-item>
              <el-menu-item index="/admin/addArticle"><i class="el-icon-edit-outline"></i>添加与编辑</el-menu-item>
            </el-submenu>
            <el-submenu index="2">
              <template #title>
                <i class="el-icon-s-help"></i>
                <span>救助与领养</span>
              </template>
              <el-menu-item index="/admin/help"><i class="el-icon-help"></i>救助管理</el-menu-item>
              <el-menu-item index="/admin/adopt"><i class="el-icon-edit-outline"></i>领养管理</el-menu-item>
            </el-submenu>
            <el-submenu index="3">
              <template #title>
                <i class="el-icon-s-shop"></i>
                <span>商城管理</span>
              </template>
              <el-menu-item index="/admin/order"><i class="el-icon-s-order"></i>订单管理</el-menu-item>
              <el-menu-item index="/admin/goods"><i class="el-icon-s-goods"></i>商品管理</el-menu-item>
            </el-submenu>
            <el-menu-item index="/admin/self">
              <i class="el-icon-s-tools"></i>
              <span slot="title">个人中心</span>
            </el-menu-item>
          </el-menu>
        </el-col>
      </el-row>
    </div>
    <div class="right">
      <div style="background:white">
        <div class="top">
          <div class="bread">
            <BreadCrumb></BreadCrumb>
          </div>
          <div class="user">admin</div>
        </div>
      </div>
      <div class="right-main">
        <div>
          <router-view></router-view>
        </div>
        
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import BreadCrumb from '../components/BreadCrumb.vue'
let log = function () {
}
</script>

<style lang="scss" scoped>
:deep(.el-menu-vertical-demo) {
  width: 250px;
  height: 93.3vh;
}

.main {
  width: 100%;
  height: 100vh;
  display: flex;
  overflow-x: hidden;
  flex-direction: row;

  .right {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: rgb(217, 217, 217);

    .right-main {
      background-color: #fff;
      flex: 1;
    }

    .top {
      display: flex;
    }

    .user {
      width: 100px;
      height: 50px;
      line-height: 50px;
      text-align: center;
      color: #4aa4fe
    }
  }
}

.title {
  width: 250px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  background-color: #545c64;
  font-size: 20px;
  color: white;

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
    vertical-align: middle;
  }
}

.bread {
  width: 100%;
  height: 50px;
  padding: 0 20px;
}
</style>

