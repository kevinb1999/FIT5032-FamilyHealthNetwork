<script setup>
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
import { loadUsers } from './repository/UserRepository'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

loadUsers()

userStore.setUser(JSON.parse(localStorage.getItem('loggedInUser')))
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
