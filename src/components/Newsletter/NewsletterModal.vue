<template>
  <div>
    <div
      v-if="showModal"
      id="newsletterModal"
      class="modal fade show d-block"
      tabindex="-1"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
      aria-describedby="modalDescription"
    >
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 id="modalTitle" class="modal-title">
              {{ isEditing ? 'Edit Newsletter' : 'Add New Newsletter' }}
            </h5>
            <button type="button" class="btn-close" aria-label="Close" @click="closeModal">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div id="modalDescription" class="modal-body">
            <form @submit.prevent="submitForm">
              <div class="mb-3">
                <label for="subject" class="form-label">Subject</label>
                <input
                  v-model="newsletter.subject"
                  type="text"
                  class="form-control"
                  id="subject"
                  required
                  aria-required="true"
                  aria-label="Enter newsletter subject"
                />
              </div>
              <div class="mb-3">
                <label for="body" class="form-label">Body</label>
                <textarea
                  v-model="newsletter.body"
                  class="form-control"
                  id="body"
                  rows="3"
                  required
                  aria-required="true"
                  aria-label="Enter newsletter body content"
                ></textarea>
              </div>
              <div class="mb-3">
                <label for="attachment" class="form-label">Attachment (optional)</label>
                <input
                  type="file"
                  class="form-control"
                  id="attachment"
                  @change="handleFileUpload"
                  aria-label="Upload an attachment for the newsletter"
                />
                <div v-if="isEditing && newsletter.attachmentUrl">
                  <a :href="newsletter.attachmentUrl" target="_blank">View current attachment</a>
                </div>
              </div>
              <button type="submit" class="btn btn-primary" aria-label="Save newsletter">
                {{ isEditing ? 'Update Newsletter' : 'Save Newsletter' }}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="modal-backdrop fade show" aria-hidden="true"></div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { saveNewsletter, updateNewsletter } from '@/repository/NewsletterRepository'
import { getFirestore, collection, doc } from 'firebase/firestore'

const db = getFirestore()

const props = defineProps({
  showModal: Boolean,
  newsletterData: Object
})

const emit = defineEmits(['close', 'refreshTable'])

const newsletter = ref({
  id: null,
  subject: '',
  body: '',
  attachmentUrl: null,
  dateCreated: new Date()
})
const file = ref(null)

const isEditing = ref(false)

watch(
  () => props.newsletterData,
  (newData) => {
    if (newData) {
      newsletter.value = { ...newData }
      isEditing.value = true
    } else {
      resetForm()
      isEditing.value = false
    }
  }
)

const handleFileUpload = (event) => {
  file.value = event.target.files[0]
}

const submitForm = async () => {
  try {
    if (isEditing.value) {
      await updateNewsletter(newsletter.value, file.value)
    } else {
      const newsletterRef = doc(collection(db, 'newsletters'))
      newsletter.value.id = newsletterRef.id
      await saveNewsletter(newsletter.value, file.value)
    }
    closeModal()
    emit('refreshTable')
  } catch (error) {
    console.error('Error submitting newsletter:', error)
  }
}

const resetForm = () => {
  newsletter.value = {
    id: null,
    subject: '',
    body: '',
    attachmentUrl: null,
    dateCreated: new Date()
  }
  file.value = null
}

const closeModal = () => {
  resetForm()
  isEditing.value = false
  emit('close')
}
</script>

<style scoped>
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}

.btn-close {
  background-color: transparent;
  border: none;
  font-size: 1.5rem;
}
</style>
