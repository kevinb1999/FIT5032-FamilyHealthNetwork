<template>
  <div>
    <div
      v-if="showModal"
      class="modal fade show d-block"
      tabindex="-1"
      role="dialog"
      aria-modal="true"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">{{ userData ? 'Edit User' : 'Add User' }}</h5>
            <button type="button" class="close" aria-label="Close" @click="closeModal">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitForm">
              <div class="mb-3">
                <label for="userType" class="form-label mr-2">User Type</label>
                <select v-model="userData.userType" class="form-select" id="userType" required>
                  <option value="admin">Admin</option>
                  <option value="specialist">Specialist</option>
                  <option value="user">User</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
              <div class="mb-3">
                <label for="firstName" class="form-label">First Name</label>
                <input
                  v-model="userData.firstName"
                  type="text"
                  class="form-control"
                  id="firstName"
                  required
                  aria-required="true"
                />
              </div>
              <div class="mb-3">
                <label for="lastName" class="form-label">Last Name</label>
                <input
                  v-model="userData.lastName"
                  type="text"
                  class="form-control"
                  id="lastName"
                  required
                  aria-required="true"
                />
              </div>
              <div class="mb-3">
                <label for="email" class="form-label">Email</label>
                <input
                  v-model="userData.email"
                  type="email"
                  class="form-control"
                  id="email"
                  required
                  aria-required="true"
                />
              </div>
              <div class="mb-3">
                <label for="phoneNumber" class="form-label">Phone Number</label>
                <input
                  v-model="userData.phoneNumber"
                  type="text"
                  class="form-control"
                  id="phoneNumber"
                />
              </div>
              <div class="mb-3">
                <label for="location" class="form-label">Location</label>
                <input v-model="userData.location" type="text" class="form-control" id="location" />
              </div>
              <div class="mb-3">
                <label for="about" class="form-label">About</label>
                <textarea
                  v-model="userData.about"
                  class="form-control"
                  id="about"
                  rows="3"
                ></textarea>
              </div>
              <button type="submit" class="btn btn-primary">Save User</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { saveUser } from '@/repository/UserRepository'

const props = defineProps({
  userData: {
    type: Object,
    required: true
  },
  showModal: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'refreshTable'])

const submitForm = async () => {
  try {
    await saveUser(userData)
    emit('refreshTable')
    closeModal()
  } catch (error) {
    console.error('Error updating user:', error)
  }
}

const closeModal = () => {
  emit('close')
}

watch(
  () => props.showModal,
  (newVal) => {
    if (newVal) {
      // Reset or load data if needed when modal is opened
    }
  }
)
</script>

<style scoped>
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
