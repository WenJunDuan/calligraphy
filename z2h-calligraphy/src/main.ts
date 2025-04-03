import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import './assets/styles/main.css'

// 创建Pinia实例并添加持久化插件
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// 创建Vue应用实例
const app = createApp(App)

// 使用插件
app.use(pinia)
app.use(router)

// 确保字体资源已加载后再挂载应用
document.fonts.ready.then(() => {
  console.log('系统字体已加载完成')
  // 挂载应用
  app.mount('#app')
})
