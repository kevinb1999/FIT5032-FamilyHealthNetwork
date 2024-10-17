<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '@/firebase/init'
import { useUserStore } from '@/stores/userStore'
import { getUser } from '@/repository/UserRepository'

const userStore = useUserStore()
const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref(null)

const login = async () => {
  try {
    error.value = null
    const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
    const firebaseUser = userCredential.user

    const loggedInUser = await getUser(firebaseUser.uid)

    if (loggedInUser) {
      userStore.setUser(loggedInUser, firebaseUser.uid)
      localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser))
      router.push('/')
    } else {
      error.value = 'User not found in Firestore.'
    }
  } catch (err) {
    error.value = 'Login failed. Please check your credentials.'
    console.error(err)
  }
}

const loginWithGoogle = async () => {
  try {
    error.value = null
    const result = await signInWithPopup(auth, googleProvider)
    const firebaseUser = result.user

    const loggedInUser = await getUser(firebaseUser.uid)

    if (loggedInUser) {
      userStore.setUser(loggedInUser, firebaseUser.uid)
      localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser))
      router.push('/')
    } else {
      error.value = 'User not found in Firestore.'
    }
  } catch (err) {
    error.value = 'Google sign-in failed. Please try again.'
    console.error(err)
  }
}
</script>

<template>
  <div class="d-flex justify-content-center align-items-center h-100 bg-light">
    <div class="card p-4 shadow-sm" role="form" aria-labelledby="login-heading">
      <div class="card-body">
        <h2 id="login-heading" class="card-title text-center mb-4">Login</h2>
        <form @submit.prevent="login" aria-describedby="login-error">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              v-model="email"
              class="form-control"
              placeholder="Enter your email"
              required
              aria-required="true"
              aria-invalid="error !== null"
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
              aria-required="true"
              aria-invalid="error !== null"
            />
          </div>
          <div class="text-center">
            <button type="submit" class="btn btn-primary btn-block mt-4">Login</button>
            <p v-if="error" class="text-danger text-center mt-3" id="login-error">{{ error }}</p>
          </div>
        </form>
        <div class="text-center mt-5">
          <button
            @click="loginWithGoogle"
            class="btn btn-outline-primary"
            aria-label="Sign in with Google"
          >
            Sign in with Google
          </button>
        </div>
        <div class="text-center mt-5">
          <router-link to="/signup" class="btn btn-outline-primary" aria-label="Sign Up"
            >Sign Up</router-link
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  width: 100%;
  max-width: 400px;
}
</style>
