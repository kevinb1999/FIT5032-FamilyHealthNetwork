<template>
  <div v-if="showModal" class="modal fade show d-block" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ clinic.id ? 'Edit Clinic' : 'Add New Clinic' }}</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="$emit('close')">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="mb-3">
              <label for="name" class="form-label">Clinic Name</label>
              <input
                v-model="clinic.name"
                type="text"
                class="form-control"
                id="name"
                required
                aria-label="Clinic name"
              />
            </div>
            <div class="mb-3">
              <label for="phoneNumber" class="form-label">Phone Number</label>
              <input
                v-model="clinic.phoneNumber"
                type="text"
                class="form-control"
                id="phoneNumber"
                required
                aria-label="Clinic phone number"
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
                aria-label="Clinic location"
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
                aria-label="Clinic description"
              ></textarea>
            </div>
            <button type="submit" class="btn btn-primary">
              {{ clinic.id ? 'Update' : 'Save' }} Clinic
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
import { saveClinic } from '@/repository/ClinicRepository'
import { getFirestore, collection, doc } from 'firebase/firestore'

const db = getFirestore()

const props = defineProps({
  clinicData: {
    type: Object,
    default: null
  },
  showModal: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['close', 'refreshTable'])

const clinic = ref({
  id: null,
  name: '',
  phoneNumber: '',
  location: '',
  description: ''
})

const resetForm = () => {
  clinic.value = {
    id: null,
    name: '',
    phoneNumber: '',
    location: '',
    description: ''
  }
}

watch(
  () => props.clinicData,
  (newValue) => {
    if (newValue) {
      clinic.value = { ...newValue }
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

const submitForm = async () => {
  try {
    if (!clinic.value.id) {
      const clinicRef = doc(collection(db, 'clinics'))
      clinic.value.id = clinicRef.id
    }

    await saveClinic(clinic.value)

    // Emit 'refreshTable' event after saving
    emits('refreshTable')

    resetForm()
    emits('close')
  } catch (error) {
    console.error('Error submitting clinic:', error)
  }
}
</script>
