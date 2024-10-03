<script setup>
import { ref } from 'vue'

const props = defineProps({
  isSignUp: {
    type: Boolean,
    default: false
  },
  firstName: {
    type: String,
    default: ''
  },
  lastName: {
    type: String,
    default: ''
  },
  phoneNumber: {
    type: String,
    default: ''
  },
  subscribeToNewsletter: {
    type: Boolean,
    default: true
  },
  location: {
    type: String,
    default: ''
  },
  about: {
    type: String,
    default: ''
  }
})

const userType = ref('user')
const firstName = ref(props.firstName)
const lastName = ref(props.lastName)
const phoneNumber = ref(props.phoneNumber)
const subscribeToNewsletter = ref(props.subscribeToNewsletter)
const location = ref(props.location)
const about = ref(props.about)

const isPractitioner = ref(false)

const handleUserTypeChange = () => {
  isPractitioner.value = userType.value === 'specalist'
}

const validatePhoneNumber = (event) => {
  if (!phoneNumberRegex.test(event.target.value)) {
    event.target.value = phoneNumber.value // Prevent non-numeric input
  } else {
    phoneNumber.value = event.target.value // Update value if valid
  }
}
</script>

<template>
  <div class="container mt-5">
    <div v-if="props.isSignUp" class="form-group mb-3">
      <label for="userType">What would you like to sign up as?</label>
      <select id="userType" v-model="userType" class="form-control" @change="handleUserTypeChange">
        <option value="user">Individual</option>
        <option value="specalist">Health Professional</option>
      </select>
    </div>

    <div class="row">
      <div class="col-md-6 mb-3">
        <label for="firstName">First Name</label>
        <input
          type="text"
          id="firstName"
          v-model="firstName"
          class="form-control"
          placeholder="Enter your first name"
        />
      </div>
      <div class="col-md-6 mb-3">
        <label for="lastName">Last Name</label>
        <input
          type="text"
          id="lastName"
          v-model="lastName"
          class="form-control"
          placeholder="Enter your last name"
        />
      </div>
    </div>

    <div class="form-group mb-3">
      <label for="phoneNumber">Phone Number</label>
      <input
        type="number"
        maxlength="12"
        oninput="this.value = this.value.slice(0, 12);"
        id="phoneNumber"
        v-model="phoneNumber"
        class="form-control"
        placeholder="Enter your phone number"
        @input="validatePhoneNumber"
      />
    </div>

    <!-- Practitioner-specific inputs -->
    <div v-if="isPractitioner" class="mt-4">
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
    </div>

    <div class="form-check mb-3">
      <input
        class="form-check-input"
        type="checkbox"
        id="subscribeNewsletter"
        v-model="subscribeToNewsletter"
        checked
      />
      <label class="form-check-label" for="subscribeNewsletter"> Subscribe to newsletter </label>
    </div>
  </div>
</template>

<style scoped></style>
