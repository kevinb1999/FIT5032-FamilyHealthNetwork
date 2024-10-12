<template>
    <div>
      <!-- Button to trigger the modal -->
      <button type="button" class="btn btn-primary" @click="showModal = true">Add Newsletter</button>
  
      <!-- Modal -->
      <div v-if="showModal" class="modal fade show d-block" tabindex="-1" role="dialog">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">Add New Newsletter</h5>
              <button type="button" class="close" aria-label="Close" @click="closeModal">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="submitForm">
                <div class="mb-3">
                  <label for="subject" class="form-label">Subject</label>
                  <input v-model="newsletter.subject" type="text" class="form-control" id="subject" required />
                </div>
                <div class="mb-3">
                  <label for="body" class="form-label">Body</label>
                  <textarea v-model="newsletter.body" class="form-control" id="body" rows="3" required></textarea>
                </div>
                <div class="mb-3">
                  <label for="attachment" class="form-label">Attachment (optional)</label>
                  <input type="file" class="form-control" id="attachment" @change="handleFileUpload" />
                </div>
                <button type="submit" class="btn btn-primary">Save Newsletter</button>
              </form>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Overlay for modal -->
      <div v-if="showModal" class="modal-backdrop fade show"></div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { saveNewsletter } from '@/repository/NewsletterRepository'
  import { getFirestore, collection, doc } from 'firebase/firestore'
  
  const db = getFirestore()
  
  const showModal = ref(false)
  const file = ref(null)
  const newsletter = ref({
    id: null,
    subject: '',
    body: '',
    attachmentUrl: null, // This will store the file's download URL
    dateCreated: new Date()
  })
  
  const closeModal = () => {
    showModal.value = false
  }
  
  const handleFileUpload = (event) => {
    file.value = event.target.files[0] // Get the selected file and store it
  }
  
  const submitForm = async () => {
    const newsletterRef = doc(collection(db, 'newsletter'))
    newsletter.value.id = newsletterRef.id
  
    // Call saveNewsletter and pass the newsletter object along with the file
    await saveNewsletter(newsletter.value, file.value)
    console.log('Newsletter submitted:', newsletter.value)
    closeModal()
    resetForm()
  }
  
  const resetForm = () => {
    newsletter.value = {
      id: null,
      subject: '',
      body: '',
      attachmentUrl: null,
      dateCreated: new Date()
    }
    file.value = null // Reset file input
  }
  </script>
  
  <style scoped>
  .modal-backdrop {
    background-color: rgba(0, 0, 0, 0.5);
  }
  </style>
  