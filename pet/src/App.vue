<template>
  <Top v-if="!this.$route.path.includes('/admin')" />
  <Menu v-if="!this.$route.path.includes('/admin')" />
  <router-view></router-view>
</template>

<script>
import Top from './components/Top.vue'
import Menu from './components/Menu.vue'

export default {
  name: 'App',
  components: {
    Top,
    Menu
  }
}
</script>

<style>
  .w-e-menu {
    z-index: 2 !important;
  }
  .w-e-text-container {
    z-index: 1 !important;
  }
blockquote {
    display: block;
    border-left: 8px solid #d0e5f2;
    padding: 5px 10px;
    margin: 10px 0;
    line-height: 1.4;
    font-size: 100%;
    background-color: #f1f1f1;
}
</style>
