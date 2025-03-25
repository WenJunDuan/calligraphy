<script setup lang="ts">
import Home from './views/Home.vue'
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <Home />
  </div>
</template>

<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  @apply antialiased;
}
</style>
