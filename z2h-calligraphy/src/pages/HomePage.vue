<template>
    <div class="home-page">
      <header class="header">
        <div class="container mx-auto px-4 flex items-center justify-between h-16">
          <div class="logo">Z2H学帖</div>
          <nav class="flex items-center space-x-6">
            <a href="#" class="nav-link">语文字帖</a>
            <a href="#" class="nav-link">英文字帖</a>
            <a href="#" class="nav-link">控笔练习</a>
            <a href="#" class="favorites-link">
              <n-icon size="18" class="text-pink-500">
                <HeartOutline />
              </n-icon>
              <span>收藏</span>
            </a>
          </nav>
        </div>
      </header>
      
      <main>
        <div class="hero">
          <div class="container mx-auto px-4 py-16 text-center">
            <div class="logo-animation mb-8">
              <img src="@/assets/images/z2h-logo-large.svg" alt="Z2H学帖" class="inline-block animate-float" />
            </div>
            <h1 class="text-3xl font-bold mb-4">用正确的方法刻到最练习</h1>
            <p class="text-xl mb-8">每个人都能写出一手漂亮的字</p>
            <n-button type="primary" size="large" class="start-button" @click="navigateToSheet">
              开始生成
            </n-button>
          </div>
        </div>
        
        <div class="features bg-white py-16">
          <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <!-- 汉字字帖 -->
              <div class="feature-card" @click="navigateTo('/chinese/character')">
                <div class="card-header">
                  <h3>语文 · 汉字字帖</h3>
                  <p>对每个汉字笔顺标准，加强对汉字笔顺的记忆，加深串记忆</p>
                </div>
              </div>
              
              <!-- 词语字帖 -->
              <div class="feature-card" @click="navigateTo('/chinese/word')">
                <div class="card-header">
                  <h3>语文 · 词语字帖</h3>
                  <p>练习词语的书写能力，提高语言表达能力和词语运用</p>
                </div>
              </div>
              
              <!-- 诗词字帖 -->
              <div class="feature-card" @click="navigateTo('/chinese/poem')">
                <div class="card-header">
                  <h3>语文 · 诗词字帖</h3>
                  <p>练习时同时掌握诗词内容，提升书写能力的同时积累文学知识</p>
                </div>
              </div>
              
              <!-- 笔画字帖 -->
              <div class="feature-card" @click="navigateTo('/chinese/stroke')">
                <div class="card-header">
                  <h3>语文 · 笔画字帖</h3>
                  <p>练习书写时的笔画练习，掌握汉字的基本书写单元和规则</p>
                </div>
              </div>
              
              <!-- 拼音字帖 -->
              <div class="feature-card" @click="navigateTo('/chinese/pinyin')">
                <div class="card-header">
                  <h3>语文 · 拼音字帖</h3>
                  <p>练习拼音的书写，掌握汉字的读音和正确的拼写方法</p>
                </div>
              </div>
              
              <!-- 控笔练习 -->
              <div class="feature-card" @click="navigateTo('/practice')">
                <div class="card-header">
                  <h3>控笔练习</h3>
                  <p>提供多种图形的控笔练习，训练用户的手部稳定性和控笔能力</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer class="bg-gray-100 py-6">
        <div class="container mx-auto px-4 text-center text-gray-600 text-sm">
          <p>Z2H = Zero to Hero</p>
          <p>Copyright © 2024 Z2H.CN</p>
        </div>
      </footer>
    </div>
  </template>
  
  <script setup lang="ts">
  import { NButton, NIcon } from 'naive-ui'
  import { HeartOutline } from '@vicons/ionicons5'
  import { useRouter } from 'vue-router'
  
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
  }
  
  .header {
    border-bottom: 1px solid #f0f0f0;
    background-color: white;
  }
  
  .logo {
    font-size: 20px;
    font-weight: 600;
  }
  
  .nav-link {
    color: #333;
    padding: 0.5rem;
  }
  
  .favorites-link {
    display: flex;
    align-items: center;
    gap: 4px;
    color: #ff4d8f;
  }
  
  .hero {
    background-color: #f5f7fa;
    padding: 2rem 0;
    flex: 1;
  }
  
  .logo-animation img {
    width: 240px;
    height: auto;
  }
  
  .feature-card {
    background-color: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer;
  }
  
  .feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
  
  .card-header h3 {
    font-size: 18px;
    font-weight: 600;
    margin-bottom: 8px;
    color: #333;
  }
  
  .card-header p {
    color: #666;
    font-size: 14px;
    line-height: 1.5;
  }
  
  main {
    flex: 1;
  }
  
  footer {
    margin-top: auto;
  }
  </style>