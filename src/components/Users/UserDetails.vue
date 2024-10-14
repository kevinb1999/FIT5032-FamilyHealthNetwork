<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { getUser, updateUser } from '@/repository/UserRepository' // Import getUser and updateUser from the repository

// Local states for the form
const firstName = ref('')
const lastName = ref('')
const phoneNumber = ref('')
const subscribeToNewsletter = ref(false)
const location = ref('')
const about = ref('')
const userType = ref('user')

// Get the userId from the store
const userStore = useUserStore()
const userId = ref(userStore.user?.userId || null) // Get userId from the store

// Fetch user data when the component is mounted
onMounted(async () => {
  if (userId.value) {
    try {
      const userData = await getUser(userId.value) // Fetch user data from Firestore using userId
      if (userData) {
        // Populate form fields with the fetched data
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

// Handle form submission to update the user document in Firestore
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

    // Update the user document in Firestore
    await updateUser({ ...updatedUser, userId: userId.value })

    alert('User details updated successfully!')
  } catch (error) {
    console.error('Error updating user:', error)
    alert('Failed to update user details.')
  }
}

// Validate phone number input
const validatePhoneNumber = (event) => {
  const phoneNumberRegex = /^[0-9]+$/ // Numeric validation
  if (!phoneNumberRegex.test(event.target.value)) {
    event.target.value = phoneNumber.value // Revert invalid input
  } else {
    phoneNumber.value = event.target.value // Update valid input
  }
}
</script>

<template>
  <form @submit.prevent="submitForm" class="container mt-5">
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
        required
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
    <div class="form-group mb-3">
      <label for="userType">User Type</label>
      <select id="userType" v-model="userType" class="form-control">
        <option value="user">Individual</option>
        <option value="specialist">Health Professional</option>
      </select>
    </div>

    <button type="submit" class="btn btn-primary">Save Changes</button>
  </form>
</template>

<style scoped>
.container {
  max-width: 600px;
}
</style>
