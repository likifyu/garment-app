<template>
  <div id="app">
    <el-container class="app-container">
      <!-- 侧边栏 -->
      <el-aside width="200px" class="sidebar">
        <div class="logo">
          <h2>服装设计管理</h2>
        </div>
        <el-menu
          :default-active="activeMenu"
          class="sidebar-menu"
          router
        >
          <el-menu-item index="/dashboard">
            <el-icon><DataAnalysis /></el-icon>
            <span>仪表盘</span>
          </el-menu-item>
          <el-menu-item index="/designs">
            <el-icon><Picture /></el-icon>
            <span>设计稿管理</span>
          </el-menu-item>
          <el-menu-item index="/patterns">
            <el-icon><Document /></el-icon>
            <span>样板管理</span>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <!-- 主内容区 -->
      <el-container>
        <el-header class="header">
          <div class="header-title">
            <h3>{{ pageTitle }}</h3>
          </div>
          <div class="header-actions">
            <span class="user-info">
              <el-icon><User /></el-icon>
              设计师
            </span>
          </div>
        </el-header>

        <el-main class="main-content">
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const activeMenu = computed(() => route.path)

const pageTitle = computed(() => {
  const titles = {
    '/dashboard': '数据概览',
    '/designs': '设计稿管理',
    '/patterns': '样板管理'
  }
  return titles[route.path] || '服装设计管理系统'
})
</script>

<style scoped>
#app {
  height: 100vh;
}

.app-container {
  height: 100%;
}

.sidebar {
  background-color: #001529;
  color: white;
}

.logo {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo h2 {
  margin: 0;
  font-size: 18px;
  color: white;
}

.sidebar-menu {
  border: none;
  background-color: #001529;
}

.sidebar-menu .el-menu-item {
  color: rgba(255, 255, 255, 0.65);
}

.sidebar-menu .el-menu-item:hover,
.sidebar-menu .el-menu-item.is-active {
  background-color: #1890ff;
  color: white;
}

.header {
  background-color: white;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
}

.header-title h3 {
  margin: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #666;
}

.main-content {
  background-color: #f0f2f5;
  padding: 20px;
}
</style>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}
</style>
