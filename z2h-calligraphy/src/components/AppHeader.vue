<template>
  <header class="app-header">
    <div class="header-container">
      <router-link to="/" class="logo">
        <img src="@/assets/images/小神龙.png" alt="小神龙" class="logo-img">
        小神龙字帖
      </router-link>
      
      <nav class="nav">
        <router-link
          v-for="menu in menus"
          :key="menu.key"
          :to="menu.path"
          class="nav-item"
          :class="{ active: isActive(menu.key) }"
        >
          {{ menu.label }}
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 定义菜单项
const menus = [
  {
    key: 'chinese',
    label: '语文字帖',
    path: '/chinese/character'
  },
  {
    key: 'ChinesePoem',
    label: '诗词字帖',
    path: '/chinese/poem'
  },
  {
    key: 'practice',
    label: '控笔练习',
    path: '/practice'
  }
]

// 检查菜单项是否激活
function isActive(menuKey: string) {
  return route.path.startsWith(`/${menuKey}`)
}
</script>

<style scoped>
.app-header {
  height: 60px;
  border-bottom: 1px solid #f0f0f0;
  background-color: white;
  position: sticky;
  top: 0;
  z-index: 100;
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
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-img {
  height: 32px;
  width: auto;
}

.nav {
  display: flex;
  gap: 30px;
}

.nav-item {
  color: #333;
  font-size: 16px;
  text-decoration: none;
  padding: 4px 0;
  transition: color 0.3s;
}

.nav-item:hover {
  color: #4361ee;
}

.nav-item.active {
  color: #4361ee;
  font-weight: 500;
}
</style>