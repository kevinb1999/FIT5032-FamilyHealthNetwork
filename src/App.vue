<script setup>
import { RouterView } from 'vue-router'
import NavBar from '@/components/NavBar/NavBar.vue'
import { useUserStore } from '@/stores/userStore'
import { onMounted } from 'vue';

const userStore = useUserStore()

onMounted(() => {
  const userData = localStorage.getItem('loggedInUser')
  if (userData) {
    const parsedUser = JSON.parse(userData)
    userStore.setUser(parsedUser) // Restore user in Pinia store
  }
})
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
