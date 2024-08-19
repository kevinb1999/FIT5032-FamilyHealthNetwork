<script setup>
import { ref, computed } from 'vue'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebaseConfig'

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

const validateEmail = () => {
  errors.value.email =
    email.value && !email.value.includes('@') ? 'Please enter a valid email address.' : null
}

const validatePassword = (blur) => {
  const password = formData.value.password
  const minLength = 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (password.length < minLength) {
    if (blur) errors.value.password = `Password must be at least ${minLength} characters long.`
  } else if (!hasUppercase) {
    if (blur) errors.value.password = 'Password must contain at least one uppercase letter.'
  } else if (!hasLowercase) {
    if (blur) errors.value.password = 'Password must contain at least one lowercase letter.'
  } else if (!hasNumber) {
    if (blur) errors.value.password = 'Password must contain at least one number.'
  } else if (!hasSpecialChar) {
    if (blur) errors.value.password = 'Password must contain at least one special character.'
  } else {
    errors.value.password = null
  }
}

const validateConfirmPassword = (blur) => {
  if (formData.value.password !== formData.value.confirmPassword) {
    if (blur) errors.value.confirmPassword = 'Passwords do not match.'
  } else {
    errors.value.confirmPassword = null
  }
}

const isFormValid = computed(
  () =>
    errors.value.email === null &&
    errors.value.password === null &&
    errors.value.confirmPassword === null &&
    formData.value.email &&
    formData.value.password &&
    formData.value.confirmPassword
)

const signup = async () => {
  if (!isFormValid.value) {
    errors.value.overall = 'Please correct the errors in the form before submitting.'
    return
  }

  try {
    errors.value.overall = null
    const userCredential = await createUserWithEmailAndPassword(auth, email.value, password.value)
    console.log('Signed up:', userCredential.user)
    router.push('/') // Redirect to the home page after sign up
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
    <div class="card p-4 shadow-sm" style="width: 100%; max-width: 400px">
      <div class="card-body">
        <h2 class="card-title text-center mb-4">Sign Up</h2>
        <form @submit.prevent="signup">
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
            />
            <div v-if="errors.confirmPassword" class="text-danger">
              {{ errors.confirmPassword }}
            </div>
          </div>
          <button type="submit" class="btn btn-primary btn-block mt-4" :disabled="!isFormValid">
            Sign Up
          </button>
          <p v-if="errors.overall" class="text-danger text-center mt-3">{{ errors.overall }}</p>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
