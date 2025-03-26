import { defineStore } from 'pinia'

interface AppState {
  theme: 'light' | 'dark'
  loading: boolean
}

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    theme: 'light',
    loading: false
  }),
  
  actions: {
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light'
    },
    
    setLoading(status: boolean) {
      this.loading = status
    }
  }
}) 