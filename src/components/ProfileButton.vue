<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/userStore'

const userStore = useUserStore()

// Mock admin check. Replace this with your actual logic.
const isAdmin = ref(true) // Set to false if the user is not an admin

const handleLogOut = () => {
  userStore.clearUser()
  localStorage.removeItem('loggedInUser')
}
</script>

<template>
  <div class="dropdown">
    <button
      class="btn btn-profile dropdown-toggle"
      type="button"
      id="profileMenuButton"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      <i class="fas fa-user-circle profile-icon"></i>
    </button>
    <ul class="dropdown-menu" aria-labelledby="profileMenuButton">
      <li v-if="isAdmin">
        <router-link class="dropdown-item" to="/admin-dash" v-if="userStore.isAdmin"
          >Admin Dashboard</router-link
        >
      </li>
      <li>
        <router-link class="dropdown-item" to="/profile">View Profile</router-link>
      </li>
      <li>
        <button class="dropdown-item" @click="handleLogOut">Logout</button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.dropdown-toggle::after {
  display: none; /* Hide the default dropdown icon */
}

.dropdown-menu {
  min-width: 10rem; /* Adjust width as needed */
  right: 0;
  left: auto;
}

.dropdown-item {
  color: #003d34; /* Darker color for dropdown items */
}

.dropdown-item:hover {
  background-color: #e0f7f9; /* Light turquoise background on hover */
}
.btn-profile {
  color: #fff;
}
.profile-icon {
  font-size: 1.5rem; /* Adjust the size as needed */
}
</style>
