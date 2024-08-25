<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../firebaseConfig'
import { useUserStore } from '@/stores/userStore'
import { users } from '@/repository/UserRepository'

const userStore = useUserStore()

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref(null)

const login = async () => {
  try {
    error.value = null
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
    console.log('Logged in:', userCredential.user)
    const loggedInUser = users.value.find((user) => user.id === userCredential.user.uid)
    userStore.setUser(loggedInUser)
    localStorage.setItem('loggedInUser', JSON.stringify(userCredential.user))
    router.push('/') // Redirect to the home page after login
  } catch (err) {
    error.value = 'Login failed. Please check your credentials.'
    console.error(err)
  }
}

const loginWithGoogle = async () => {
  try {
    error.value = null
    const result = await signInWithPopup(auth, googleProvider)
    console.log('Logged in with Google:', result.user)
    loggedInUser = users.value.find((user) => user.id === result.user.uid)
    userStore.setUser(loggedInUser)
    localStorage.setItem('loggedInUser', result.user)

    router.push('/') // Redirect to the home page after login
  } catch (err) {
    error.value = 'Google sign-in failed. Please try again.'
    console.error(err)
  }
}
</script>

<template>
  <div class="d-flex justify-content-center align-items-center h-100 bg-light">
    <div class="card p-4 shadow-sm" style="width: 100%; max-width: 400px">
      <div class="card-body">
        <h2 class="card-title text-center mb-4">Login</h2>
        <form @submit.prevent="login">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              v-model="email"
              class="form-control"
              placeholder="Enter your email"
              required
            />
          </div>
          <div class="form-group mt-3">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              v-model="password"
              class="form-control"
              placeholder="Enter your password"
              required
            />
          </div>
          <div class="text-center">
            <button type="submit" class="btn btn-primary btn-block mt-4">Login</button>
            <p v-if="error" class="text-danger text-center mt-3">{{ error }}</p>
          </div>
        </form>
        <div class="text-center mt-5">
          <button @click="loginWithGoogle" class="btn btn-outline-primary">
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
