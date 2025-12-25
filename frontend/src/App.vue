<template>
  <div id="app" class="digital-atelier">
    <a-layout class="app-layout">
      <!-- Digital Atelier 侧边栏 -->
      <a-layout-sider
        :width="240"
        :style="{ background: colors.midnight }"
        class="atelier-sider"
      >
        <div class="brand-zone">
          <div class="brand-logo">DIGITAL ATELIER</div>
          <div class="brand-subtitle">服装设计管理系统</div>
        </div>

        <a-menu
          :selected-keys="[activeMenu]"
          mode="vertical"
          :style="{ background: 'transparent' }"
          class="atelier-menu"
        >
          <a-menu-item key="/dashboard" @click="$router.push('/dashboard')">
            <template #icon><icon-dashboard /></template>
            仪表盘
          </a-menu-item>
          <a-menu-item key="/designs" @click="$router.push('/designs')">
            <template #icon><icon-image /></template>
            设计作品
          </a-menu-item>
          <a-menu-item key="/patterns" @click="$router.push('/patterns')">
            <template #icon><icon-file /></template>
            素材库
          </a-menu-item>
          <a-menu-item key="/collaboration" @click="$router.push('/collaboration')">
            <template #icon><icon-user-group /></template>
            协作
          </a-menu-item>
        </a-menu>
      </a-layout-sider>

      <!-- 主内容区 -->
      <a-layout>
        <a-layout-header class="atelier-header">
          <div class="header-left">
            <h2 class="page-title">{{ pageTitle }}</h2>
          </div>
          <div class="header-right">
            <a-space :size="16">
              <a-button type="text" shape="circle" @click="toggleMusic">
                <template #icon>
                  <icon-mute v-if="!musicPlaying" />
                  <icon-sound v-else />
                </template>
              </a-button>
              <a-button type="text" shape="circle">
                <template #icon><icon-notification /></template>
              </a-button>
              <a-button type="text" shape="circle">
                <template #icon><icon-settings /></template>
              </a-button>
              <a-avatar :style="{ backgroundColor: colors.gold }">
                <icon-user />
              </a-avatar>
            </a-space>
          </div>
        </a-layout-header>

        <a-layout-content class="atelier-content">
          <router-view />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  IconDashboard,
  IconImage,
  IconFile,
  IconUserGroup,
  IconNotification,
  IconSettings,
  IconUser,
  IconSound,
  IconMute
} from '@arco-design/web-vue/es/icon'
import audioManager from '@/utils/audioManager'

const route = useRoute()

// Digital Atelier 配色方案
const colors = {
  midnight: '#0A0E27',
  electric: '#3B82F6',
  clay: '#C2410C',
  sage: '#84A59D',
  gold: '#D4AF37'
}

// 音乐控制状态
const musicPlaying = ref(false)

// 切换背景音乐
const toggleMusic = () => {
  musicPlaying.value = audioManager.toggleBackgroundMusic()
}

const activeMenu = computed(() => route.path)

const pageTitle = computed(() => {
  const titles = {
    '/dashboard': '仪表盘',
    '/designs': '设计作品',
    '/patterns': '素材库',
    '/collaboration': '协作中心'
  }
  return titles[route.path] || 'Digital Atelier'
})

// 组件挂载时的初始化
onMounted(() => {
  // 可选：自动播放背景音乐（默认注释）
  // audioManager.playBackgroundMusic()
  // musicPlaying.value = true
})
</script>

<style>
/* Digital Atelier 全局样式 - 暗色主题 */
:root {
  --color-midnight: #0A0E27;
  --color-electric: #3B82F6;
  --color-clay: #C2410C;
  --color-sage: #84A59D;
  --color-gold: #D4AF37;
  --color-surface: #1A1F3A;
  --color-surface-elevated: #252B47;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  height: 100vh;
  overflow: hidden;
}

.digital-atelier {
  background-color: var(--color-midnight);
}

.app-layout {
  height: 100%;
}

/* 侧边栏 */
.atelier-sider {
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
  z-index: 100;
}

.brand-zone {
  padding: 32px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.brand-logo {
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 1.5px;
  margin-bottom: 6px;
}

.brand-subtitle {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.45);
  font-weight: 400;
  letter-spacing: 0.5px;
}

.atelier-menu {
  margin-top: 8px;
  padding: 8px 12px;
}

.atelier-menu .arco-menu-item {
  color: rgba(255, 255, 255, 0.65);
  border-radius: 8px;
  margin-bottom: 4px;
  padding: 10px 16px;
  transition: all 0.2s ease;
}

.atelier-menu .arco-menu-item:hover {
  background-color: rgba(59, 130, 246, 0.1);
  color: var(--color-electric);
}

.atelier-menu .arco-menu-item-selected {
  background-color: var(--color-electric) !important;
  color: #ffffff !important;
}

.atelier-menu .arco-icon {
  font-size: 18px;
}

/* 顶部导航 */
.atelier-header {
  background-color: var(--color-midnight);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding: 0 32px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.page-title {
  font-size: 18px;
  font-weight: 500;
  color: #ffffff;
  margin: 0;
}

.header-right .arco-btn-text {
  color: rgba(255, 255, 255, 0.65);
}

.header-right .arco-btn-text:hover {
  color: var(--color-electric);
  background-color: rgba(59, 130, 246, 0.1);
}

/* 主内容区 */
.atelier-content {
  background: linear-gradient(180deg, var(--color-midnight) 0%, #0d122f 100%);
  padding: 32px;
  overflow-y: auto;
  min-height: calc(100vh - 64px);
}

/* Arco Design 暗色主题覆盖 */
.arco-menu-dark,
.arco-menu-dark .arco-menu-item,
.arco-menu-dark .arco-menu-inline-header {
  background-color: transparent;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.25);
}
</style>
