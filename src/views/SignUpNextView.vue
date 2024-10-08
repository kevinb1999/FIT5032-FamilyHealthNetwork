<script setup>
import { ref, computed } from 'vue'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/firebase/init'
import { useUserStore } from '@/stores/userStore'
import { useRouter } from 'vue-router'
import UserDetails from '@/components/Users/UserDetails.vue'

const userStore = useUserStore()
const router = useRouter()
</script>

<template>
  <div class="d-flex justify-content-center align-items-center h-100 bg-light">
    <div class="card p-4 shadow-sm">
      <div class="card-body">
        <h2 class="card-title text-center mb-4">Finish Your Profile</h2>
        <UserDetails is-sign-up />
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  width: 100%;
  max-width: 600px;
}
</style>
