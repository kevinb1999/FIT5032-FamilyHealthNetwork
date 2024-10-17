<template>
  <div v-if="showModal" class="modal fade show d-block" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ event.id ? 'Edit Event' : 'Add New Event' }}</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="$emit('close')">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="mb-3">
              <label for="name" class="form-label">Event Name</label>
              <input
                v-model="event.name"
                type="text"
                class="form-control"
                id="name"
                required
                aria-label="Event name"
              />
            </div>
            <div class="mb-3">
              <label for="dateTime" class="form-label">Date and Time</label>
              <input
                v-model="event.dateTime"
                type="datetime-local"
                class="form-control"
                id="dateTime"
                required
                aria-label="Event date and time"
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
                aria-label="Event duration"
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
                aria-label="Event location"
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
                aria-label="Event description"
              ></textarea>
            </div>
            <button type="submit" class="btn btn-primary">
              {{ event.id ? 'Update' : 'Save' }} Event
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showModal" class="modal-backdrop fade show"></div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { saveEvent } from '@/repository/EventRepository'
import { getFirestore, collection, doc } from 'firebase/firestore'

const db = getFirestore()

const props = defineProps({
  eventData: {
    type: Object,
    default: null
  },
  showModal: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['close', 'refreshTable'])

const event = ref({
  id: null,
  name: '',
  dateTime: '',
  duration: '',
  location: '',
  description: ''
})

const resetForm = () => {
  event.value = {
    id: null,
    name: '',
    dateTime: '',
    duration: '',
    location: '',
    description: ''
  }
}

watch(
  () => props.eventData,
  (newValue) => {
    if (newValue) {
      event.value = { ...newValue }
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

const submitForm = async () => {
  try {
    if (!event.value.id) {
      const eventRef = doc(collection(db, 'events'))
      event.value.id = eventRef.id
    }

    await saveEvent(event.value)

    emits('refreshTable')

    resetForm()
    emits('close')
  } catch (error) {
    console.error('Error submitting event:', error)
  }
}
</script>

<style scoped>
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
