<template>
  <!-- 先定义一个大容器 -->
  <el-container>
    <!-- 头部 -->
    <el-header style="height:60px">
      <!-- 头部组件 -->
      <layout-header></layout-header>
    </el-header>
    <!-- 中部区域 -->
    <el-main style="padding:0;margin:0">
      <!-- 二级路由容器 -->
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
import layoutHeader from '../views/layoutHeader'
export default {
  components: {
    layoutHeader
  }
}
</script>

<style></style>
