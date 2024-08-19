<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <header>
      <NavBar />
    </header>

    <RouterView class="flex-grow-1" />
  </div>
</template>

<style scoped></style>
