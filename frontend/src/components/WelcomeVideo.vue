<template>
  <div class="welcome-overlay" :class="{ 'fade-out': !show }">
    <div class="video-container">
      <video 
        ref="videoRef"
        class="brand-video"
        :src="videoUrl"
        autoplay
        muted
        playsinline
        @ended="onVideoEnd"
      ></video>
      <div class="brand-content" :class="{ 'show': showContent }">
        <h1 class="brand-title">DIGITAL ATELIER</h1>
        <p class="brand-subtitle">服装设计管理系统</p>
        <div class="loading-bar">
          <div class="loading-progress" :style="{ width: progress + '%' }"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const show = ref(true)
const showContent = ref(false)
const progress = ref(0)
const videoRef = ref(null)

// Minimax 生成的品牌视频
const videoUrl = 'https://public-cdn-video-data-algeng.oss-cn-wulanchabu.aliyuncs.com/inference_output%2Fvideo%2F2025-12-26%2F9d6c13b6-2df0-49db-9eed-4ccd6bf0647a%2Foutput_aigc.mp4'

let progressInterval = null

onMounted(() => {
  setTimeout(() => {
    showContent.value = true
    startProgress()
  }, 500)
})

const startProgress = () => {
  progressInterval = setInterval(() => {
    progress.value += 1.5
    if (progress.value >= 100) {
      clearInterval(progressInterval)
      setTimeout(() => {
        show.value = false
        setTimeout(() => {
          // 触发进入主页
        }, 500)
      }, 300)
    }
  }, 50)
}

const onVideoEnd = () => {
  progress.value = 100
  clearInterval(progressInterval)
  setTimeout(() => {
    show.value = false
  }, 500)
}
</script>

<style scoped>
.welcome-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: #0A0E27;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.8s ease, visibility 0.8s ease;
}

.welcome-overlay.fade-out {
  opacity: 0;
  visibility: hidden;
}

.video-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.brand-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.4;
}

.brand-content {
  position: relative;
  z-index: 1;
  text-align: center;
  opacity: 0;
  transform: translateY(30px);
  transition: all 1s ease;
}

.brand-content.show {
  opacity: 1;
  transform: translateY(0);
}

.brand-title {
  font-size: 48px;
  font-weight: 600;
  color: #ffffff;
  letter-spacing: 8px;
  margin-bottom: 16px;
  text-shadow: 0 4px 20px rgba(59, 130, 246, 0.5);
}

.brand-subtitle {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  letter-spacing: 4px;
  margin-bottom: 48px;
}

.loading-bar {
  width: 300px;
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin: 0 auto;
}

.loading-progress {
  height: 100%;
  background: linear-gradient(90deg, #3B82F6 0%, #D4AF37 100%);
  border-radius: 2px;
  transition: width 0.1s linear;
}
</style>
