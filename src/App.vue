<template>
  <div>
    <!--App.vue => 整个项目的根组件 => 一级路由容器 -->
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive" />
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive" />
  </div>
</template>

<script>
export default {
  created () {
    console.log(this.$route)
  }
}
</script>

<style></style>
