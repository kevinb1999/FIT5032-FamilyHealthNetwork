<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { getUser, updateUser } from '@/repository/UserRepository'

const props = defineProps({
  isSignUp: {
    type: Boolean,
    default: false
  }
})

const firstName = ref('')
const lastName = ref('')
const phoneNumber = ref('')
const subscribeToNewsletter = ref(false)
const location = ref('')
const about = ref('')
const userType = ref('user')

const userStore = useUserStore()
const userId = ref(userStore.userId || null)

onMounted(async () => {
  if (userId.value) {
    try {
      const userData = await getUser(userId.value)
      if (userData) {
        firstName.value = userData.firstName
        lastName.value = userData.lastName
        phoneNumber.value = userData.phoneNumber
        subscribeToNewsletter.value = userData.isSubscribed
        location.value = userData.location
        about.value = userData.about
        userType.value = userData.userType
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }
})

const submitForm = async () => {
  try {
    const updatedUser = {
      firstName: firstName.value,
      lastName: lastName.value,
      phoneNumber: phoneNumber.value,
      subscribeToNewsletter: subscribeToNewsletter.value,
      location: location.value,
      about: about.value,
      userType: userType.value
    }

    await updateUser({ ...updatedUser, userId: userId.value })
    alert('User details updated successfully!')
  } catch (error) {
    console.error('Error updating user:', error)
    alert('Failed to update user details.')
  }
}

const validatePhoneNumber = (event) => {
  const phoneNumberRegex = /^[0-9]+$/
  if (!phoneNumberRegex.test(event.target.value)) {
    event.target.value = phoneNumber.value
  } else {
    phoneNumber.value = event.target.value
  }
}
</script>

<template>
  <form @submit.prevent="submitForm" class="container mt-5">
    <div v-if="isSignUp" class="form-group mb-3">
      <label for="userType">User Type</label>
      <select id="userType" v-model="userType" class="form-control">
        <option value="user">Individual</option>
        <option value="specialist">Health Professional</option>
      </select>
    </div>
    <div class="form-group mb-3">
      <label for="firstName">First Name</label>
      <input
        type="text"
        id="firstName"
        v-model="firstName"
        class="form-control"
        placeholder="Enter your first name"
        required
      />
    </div>
    <div class="form-group mb-3">
      <label for="lastName">Last Name</label>
      <input
        type="text"
        id="lastName"
        v-model="lastName"
        class="form-control"
        placeholder="Enter your last name"
        required
      />
    </div>
    <div class="form-group mb-3">
      <label for="phoneNumber">Phone Number</label>
      <input
        type="number"
        maxlength="12"
        @input="validatePhoneNumber"
        id="phoneNumber"
        v-model="phoneNumber"
        class="form-control"
        placeholder="Enter your phone number"
      />
    </div>
    <div class="form-group mb-3">
      <label for="location">Location</label>
      <input
        type="text"
        id="location"
        v-model="location"
        class="form-control"
        placeholder="Enter your location"
      />
    </div>
    <div class="form-group mb-3">
      <label for="about">About</label>
      <textarea
        id="about"
        v-model="about"
        class="form-control"
        placeholder="Tell us about yourself"
        rows="6"
      ></textarea>
    </div>
    <div class="form-check mb-3">
      <input
        class="form-check-input"
        type="checkbox"
        id="subscribeNewsletter"
        v-model="subscribeToNewsletter"
      />
      <label class="form-check-label" for="subscribeNewsletter"> Subscribe to newsletter </label>
    </div>
    <button type="submit" class="btn btn-primary">Save Changes</button>
  </form>
</template>

<style scoped>
.container {
  max-width: 600px;
}
</style>
