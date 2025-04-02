<template>
  <header class="app-header">
    <div class="header-container">
      <router-link to="/" class="logo">小神龙字帖</router-link>
      
      <nav class="nav">
        <n-dropdown
          v-for="menu in menus"
          :key="menu.key"
          :options="menu.children"
          @select="handleMenuSelect"
          trigger="hover"
          :show-arrow="true"
        >
          <span 
            class="nav-item" 
            :class="{ active: isActive(menu.key) }"
          >
            {{ menu.label }}
            <n-icon size="tiny" class="dropdown-icon">
              <ChevronDownOutline />
            </n-icon>
          </span>
        </n-dropdown>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { NDropdown, NIcon } from 'naive-ui'
import { ChevronDownOutline } from '@vicons/ionicons5'

const router = useRouter()
const route = useRoute()

// 定义菜单项
const menus = [
  {
    key: 'chinese',
    label: '语文字帖',
    children: [
      {
        key: '/chinese/character',
        label: '汉字字帖'
      },
      {
        key: '/chinese/word',
        label: '词语字帖'
      },
      {
        key: '/chinese/poem',
        label: '诗词字帖'
      },
      {
        key: '/chinese/stroke',
        label: '笔画字帖'
      }
    ]
  },
  {
    key: 'practice',
    label: '控笔练习',
    children: [
      {
        key: '/practice',
        label: '控笔练习'
      }
    ]
  }
]

// 检查菜单项是否激活
function isActive(menuKey: string) {
  return route.path.startsWith(`/${menuKey}`)
}

// 处理菜单选择
function handleMenuSelect(key: string) {
  router.push(key)
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
}

.nav {
  display: flex;
  gap: 30px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 4px 0;
  color: #333;
  font-size: 16px;
}

.nav-item.active {
  color: #4361ee;
  font-weight: 500;
}

.dropdown-icon {
  margin-top: 2px;
}
</style>