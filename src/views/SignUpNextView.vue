<script setup>
import { ref, computed } from 'vue'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '@/firebase/init'
import { useUserStore } from '@/stores/userStore'
import { addUser } from '@/repository/UserRepository'
import { useRouter } from 'vue-router'
import UserDetails from '@/components/UserDetails.vue'

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

const fillInformation = async () => {
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
    const user = {
      id: userCredential.user.uid,
      email: userCredential.user.email,
      userType: 'staff'
    }
    addUser(user)
    userStore.setUser(userCredential.user)
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
    <div class="card p-4 shadow-sm">
      <div class="card-body">
        <h2 class="card-title text-center mb-4">Finish Your Profile</h2>
        <form @submit.prevent="fillInformation">
          <UserDetails is-sign-up />
        </form>
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
