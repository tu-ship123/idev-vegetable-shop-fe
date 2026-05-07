<script setup>
// Cấu trúc App.vue sạch sẽ để Router quyết định Layout
</script>

<template>
  <router-view />
</template>

<style>
/* Reset mặc định cho toàn bộ ứng dụng */
body {
  margin: 0;
  padding: 0;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #F4F7F5;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Outfit', 'Inter', system-ui, sans-serif;
}
</style>
