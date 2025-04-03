<template>
    <n-config-provider :theme="theme">
      <n-loading-bar-provider>
        <n-dialog-provider>
          <n-notification-provider>
            <n-message-provider>
              <router-view />
            </n-message-provider>
          </n-notification-provider>
        </n-dialog-provider>
      </n-loading-bar-provider>
    </n-config-provider>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue'
  import { 
    NConfigProvider, 
    NLoadingBarProvider, 
    NDialogProvider, 
    NNotificationProvider, 
    NMessageProvider,
    darkTheme, 
    lightTheme 
  } from 'naive-ui'
  import { useSettingsStore } from '@/stores/settings'
  
  // 获取应用设置
  const settingsStore = useSettingsStore()
  
  // 计算当前主题
  const theme = computed(() => {
    return settingsStore.colorMode === 'dark' ? darkTheme : null
  })
  
  // 为全局对象添加类型
  declare global {
    interface Window {
      $message: any;
      $dialog: any;
      $notification: any;
      $loadingBar: any;
    }
  }
  </script>
  
  <style>
  html, body {
    margin: 0;
    padding: 0;
    height: 100%;
  }
  
  #app {
    height: 100%;
  }
  </style>