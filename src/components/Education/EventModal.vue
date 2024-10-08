<script setup>
import { ref } from 'vue'
import { saveEvent } from '@/repository/EventRepository' // Correct repository function
import { getFirestore, collection, doc } from 'firebase/firestore'

// Firestore database instance
const db = getFirestore()

const showModal = ref(false)
const event = ref({
  id: null,
  name: '',
  dateTime: '',
  duration: '',
  location: '',
  description: ''
})

// Function to submit the form
async function submitForm() {
  try {
    // Generate a unique document reference for the event
    const eventRef = doc(collection(db, 'events'))
    event.value.id = eventRef.id // Assign the Firestore-generated unique ID

    // Save the event using the repository method
    await saveEvent(event.value)
    console.log('Event submitted:', event.value)

    // Close the modal after submission
    showModal.value = false

    // Clear the form fields after successful submission
    resetForm()
  } catch (error) {
    console.error('Error submitting event:', error)
  }
}

// Function to reset the form fields
function resetForm() {
  event.value = {
    id: null,
    name: '',
    dateTime: '',
    duration: '',
    location: '',
    description: ''
  }
}
</script>

<template>
  <div>
    <!-- Button to trigger the modal -->
    <button type="button" class="btn btn-primary" @click="showModal = true">Add Event</button>

    <!-- Modal -->
    <div v-if="showModal" class="modal fade show d-block" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add New Event</h5>
            <button type="button" class="close" aria-label="Close" @click="showModal = false">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitForm">
              <div class="mb-3">
                <label for="name" class="form-label">Event Name</label>
                <input v-model="event.name" type="text" class="form-control" id="name" required />
              </div>
              <div class="mb-3">
                <label for="dateTime" class="form-label">Date and Time</label>
                <input
                  v-model="event.dateTime"
                  type="datetime-local"
                  class="form-control"
                  id="dateTime"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="duration" class="form-label">Duration</label>
                <input
                  v-model="event.duration"
                  type="text"
                  class="form-control"
                  id="duration"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="location" class="form-label">Location</label>
                <input
                  v-model="event.location"
                  type="text"
                  class="form-control"
                  id="location"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="description" class="form-label">Description</label>
                <textarea
                  v-model="event.description"
                  class="form-control"
                  id="description"
                  rows="3"
                  required
                ></textarea>
              </div>
              <button type="submit" class="btn btn-primary">Save Event</button>
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
