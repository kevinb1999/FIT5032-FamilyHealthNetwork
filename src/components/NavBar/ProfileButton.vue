<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'

const userStore = useUserStore()
const router = useRouter()

const isAdmin = ref(userStore.isAdmin) // Set to false if the user is not an admin

const handleLogOut = () => {
  userStore.clearUser()
  localStorage.removeItem('loggedInUser')
  router.push('/login')
}
</script>

<template>
  <div class="dropdown">
    <button
      class="btn btn-profile dropdown-toggle"
      type="button"
      id="profileMenuButton"
      data-toggle="dropdown"
      aria-haspopup="true"
      aria-expanded="false"
    >
      <i class="fas fa-user-circle profile-icon"></i>
    </button>
    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="profileMenuButton">
      <router-link v-if="isAdmin" class="dropdown-item" to="/admin-dash">Admin Dashboard</router-link>
      <router-link class="dropdown-item" to="/profile">View Profile</router-link>
      <button class="dropdown-item" @click="handleLogOut">Logout</button>
    </div>
  </div>
</template>

<style scoped>
.dropdown-toggle::after {
  display: none;
}

.dropdown-menu {
  min-width: 10rem;
  right: 0;
  left: auto;
}

.dropdown-item {
  color: #003d34;
}

.dropdown-item:hover {
  background-color: #e0f7f9;
}

.btn-profile {
  color: #fff;
}

.profile-icon {
  font-size: 1.5rem;
}
</style>
