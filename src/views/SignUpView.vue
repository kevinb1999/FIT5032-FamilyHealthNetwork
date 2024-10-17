<script setup>
import { ref, computed } from 'vue'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/firebase/init'
import { useUserStore } from '@/stores/userStore'
import { saveUser } from '@/repository/UserRepository'
import { useRouter } from 'vue-router'
import { User } from '@/models/User'

const userStore = useUserStore()
const router = useRouter()

const formData = ref({
  email: '',
  password: '',
  confirmPassword: ''
})

const errors = ref({
  email: null,
  password: null,
  confirmPassword: null,
  overall: null
})

// Email validation
const validateEmail = () => {
  if (!formData.value.email) {
    errors.value.email = 'Email is required.'
  } else if (!formData.value.email.includes('@')) {
    errors.value.email = 'Please enter a valid email address.'
  } else {
    errors.value.email = null
  }
}

// Password validation
const validatePassword = () => {
  const password = formData.value.password
  const minLength = 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (!password) {
    errors.value.password = 'Password is required.'
  } else if (password.length < minLength) {
    errors.value.password = `Password must be at least ${minLength} characters long.`
  } else if (!hasUppercase) {
    errors.value.password = 'Password must contain at least one uppercase letter.'
  } else if (!hasLowercase) {
    errors.value.password = 'Password must contain at least one lowercase letter.'
  } else if (!hasNumber) {
    errors.value.password = 'Password must contain at least one number.'
  } else if (!hasSpecialChar) {
    errors.value.password = 'Password must contain at least one special character.'
  } else {
    errors.value.password = null
  }
}

// Confirm Password validation
const validateConfirmPassword = () => {
  if (formData.value.confirmPassword !== formData.value.password) {
    errors.value.confirmPassword = 'Passwords do not match.'
  } else {
    errors.value.confirmPassword = null
  }
}

// Check if the form is valid
const isFormValid = computed(
  () =>
    !errors.value.email &&
    !errors.value.password &&
    !errors.value.confirmPassword &&
    formData.value.email &&
    formData.value.password &&
    formData.value.confirmPassword
)

// Signup function
const signup = async () => {
  if (!isFormValid.value) {
    errors.value.overall = 'Please correct the errors in the form before submitting.'
    return
  }

  try {
    errors.value.overall = null
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      formData.value.email,
      formData.value.password
    )
    console.log('Signed up:', userCredential.user)

    const newUser = new User(
      userCredential.user.uid,
      userCredential.user.email,
      'user',
      '',
      '',
      '',
      false,
      '',
      ''
    )

    await saveUser(newUser)

    userStore.setUser(newUser)

    router.push('/signup/moreinfo')
  } catch (err) {
    if (err.code === 'auth/email-already-in-use') {
      errors.value.overall =
        'An account with this email already exists. Please use a different email.'
    } else if (err.code === 'auth/weak-password') {
      errors.value.overall = 'Password is too weak. Please use a stronger password.'
    } else {
      errors.value.overall = 'Sign up failed. Please try again.'
    }
    console.error(err)
  }
}
</script>

<template>
  <div class="d-flex justify-content-center align-items-center h-100 bg-light">
    <div class="card p-4 shadow-sm" role="form" aria-labelledby="signup-heading">
      <div class="card-body">
        <h2 id="signup-heading" class="card-title text-center mb-4">Sign Up</h2>
        <form @submit.prevent="signup" aria-describedby="signup-error">
          <div class="form-group">
            <label for="email">Email</label>
            <input
              type="email"
              id="email"
              v-model="formData.email"
              @input="validateEmail"
              class="form-control"
              placeholder="Enter your email"
              required
              aria-required="true"
              aria-invalid="errors.email !== null"
            />
            <div v-if="errors.email" class="text-danger">{{ errors.email }}</div>
          </div>
          <div class="form-group mt-3">
            <label for="password">Password</label>
            <input
              type="password"
              id="password"
              v-model="formData.password"
              @input="validatePassword"
              class="form-control"
              placeholder="Enter your password"
              required
              aria-required="true"
              aria-invalid="errors.password !== null"
            />
            <div v-if="errors.password" class="text-danger">{{ errors.password }}</div>
          </div>
          <div class="form-group mt-3">
            <label for="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              v-model="formData.confirmPassword"
              @input="validateConfirmPassword"
              class="form-control"
              placeholder="Confirm your password"
              required
              aria-required="true"
              aria-invalid="errors.confirmPassword !== null"
            />
            <div v-if="errors.confirmPassword" class="text-danger">
              {{ errors.confirmPassword }}
            </div>
          </div>
          <div class="text-center">
            <button type="submit" class="btn btn-primary btn-block mt-4" :disabled="!isFormValid">
              Sign Up
            </button>
            <p v-if="errors.overall" class="text-danger text-center mt-3" id="signup-error">
              {{ errors.overall }}
            </p>
          </div>
        </form>
        <div class="text-center mt-5">
          <router-link to="/login" class="btn btn-outline-primary"> Login </router-link>
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
