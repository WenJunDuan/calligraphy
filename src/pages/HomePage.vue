<template>
  <div class="home-page">
    <AppHeader />
    
    <main>
      <div class="hero">
        <div class="logo-animation">
          <img src="@/assets/images/小神龙.png" alt="小神龙字帖" class="logo-image" />
        </div>
        
        <div class="slogan">
          <p class="slogan-text">与笔墨交友不累，与碑帖谈心蕞真。</p>
          <p class="sub-slogan">心中有沟壑，笔墨做山河，提笔及星辰日月落笔仍留有余晖。</p>
        </div>
        
        <div class="cta-button">
          <n-button type="primary" size="large" @click="navigateToSheet">
            开始生成
          </n-button>
        </div>
      </div>
      
      <div class="feature-grid">
        <!-- 语文·汉字字帖 -->
        <div class="feature-card" @click="navigateTo('/chinese/character')">
          <div class="card-content">
            <div class="card-title">语文 · 汉字字帖</div>
            <div class="card-description">对每个汉字笔顺标准，加强对汉字笔顺的记忆，加深串记忆</div>
          </div>
        </div>
        
        <!-- 诗词·字帖 -->
        <div class="feature-card" @click="navigateTo('/chinese/stroke')">
          <div class="card-content">
            <div class="card-title">诗词字帖</div>
            <div class="card-description">提供古诗词练习，方便古代诗词临摹</div>
          </div>
        </div>
        
        <!-- 控笔练习 -->
        <div class="feature-card" @click="navigateTo('/practice')">
          <div class="card-content">
            <div class="card-title">控笔练习</div>
            <div class="card-description">提供多种图形的控笔练习，训练用户的手部稳定性和控笔能力</div>
          </div>
        </div>
      </div>
    </main>
    
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui'
import { useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'  
import AppFooter from '@/components/AppFooter.vue'  


const router = useRouter()

// 导航方法
function navigateToSheet() {
  router.push('/chinese/character')
}

function navigateTo(path: string) {
  router.push(path)
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #fff;
}

/* 头部样式 */
.header {
  height: 60px;
  border-bottom: 1px solid #f0f0f0;
}

.header-container {
  max-width: 1144px;
  height: 100%;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-size: 20px;
  font-weight: 600;
  color: #333;
}

.nav {
  display: flex;
  gap: 30px;
}

.nav-item {
  color: #333;
  text-decoration: none;
  font-size: 16px;
}

.nav-item:hover {
  color: #4361ee;
}

/* 主区域样式 */
main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 英雄区样式 */
.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 60px 0;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.logo-animation {
  margin-bottom: 30px;
}

.logo-image {
  width: 240px;
  height: auto;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-20px); }
  100% { transform: translateY(0px); }
}

.slogan {
  text-align: center;
  margin-bottom: 30px;
}

.slogan-text {
  font-size: 28px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.sub-slogan {
  font-size: 18px;
  color: #666;
}

.cta-button {
  margin-bottom: 60px;
}

/* 特色卡片网格 */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 1200px;
  padding: 0 20px;
  margin-bottom: 60px;
}

.feature-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  height: 140px;
  display: flex;
  flex-direction: column;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.card-description {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
}
</style>