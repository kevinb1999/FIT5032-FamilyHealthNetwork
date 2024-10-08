<script setup>
import { ref } from 'vue'
import { saveClinic } from '@/repository/ClinicRepository' // Save clinic method from repository
import { getFirestore, collection, doc } from 'firebase/firestore'

const db = getFirestore()
const showModal = ref(false)
const clinic = ref({
  id: null,
  name: '',
  phoneNumber: '',
  location: '',
  description: ''
})

async function submitForm() {
  try {
    // Generate a new document reference with a unique ID
    const clinicRef = doc(collection(db, 'clinics'))
    clinic.value.id = clinicRef.id // Assign the unique ID to the clinic

    // Save the clinic using the repository
    await saveClinic(clinic.value)

    console.log('Clinic submitted:', clinic.value)

    // Close the modal after submission
    showModal.value = false

    // Clear the form fields
    clinic.value = {
      id: null,
      name: '',
      phoneNumber: '',
      location: '',
      description: ''
    }
  } catch (error) {
    console.error('Error submitting clinic:', error)
  }
}
</script>

<template>
  <div>
    <!-- Button to trigger the modal -->
    <button type="button" class="btn btn-primary" @click="showModal = true">Add Clinic</button>

    <!-- Modal -->
    <div v-if="showModal" class="modal fade show d-block" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add New Clinic</h5>
            <button type="button" class="close" aria-label="Close" @click="showModal = false">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitForm">
              <div class="mb-3">
                <label for="name" class="form-label">Clinic Name</label>
                <input v-model="clinic.name" type="text" class="form-control" id="name" required />
              </div>
              <div class="mb-3">
                <label for="phoneNumber" class="form-label">Phone Number</label>
                <input
                  v-model="clinic.phoneNumber"
                  type="text"
                  class="form-control"
                  id="phoneNumber"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="location" class="form-label">Location</label>
                <input
                  v-model="clinic.location"
                  type="text"
                  class="form-control"
                  id="location"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="description" class="form-label">Description</label>
                <textarea
                  v-model="clinic.description"
                  class="form-control"
                  id="description"
                  rows="3"
                  required
                ></textarea>
              </div>
              <button type="submit" class="btn btn-primary">Save Clinic</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- Overlay for modal -->
    <div v-if="showModal" class="modal-backdrop fade show"></div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
