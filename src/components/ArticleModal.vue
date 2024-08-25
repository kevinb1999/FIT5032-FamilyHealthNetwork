<script setup>
import { ref } from 'vue'

const showModal = ref(false)
const article = ref({
  title: '',
  author: '',
  date: '',
  content: ''
})

function submitForm() {
  // Handle form submission logic here
  console.log('Article submitted:', article.value)

  // Close the modal after submission
  showModal.value = false

  // Clear the form fields
  article.value = {
    title: '',
    author: '',
    date: '',
    content: ''
  }
}
</script>

<template>
  <div>
    <!-- Button to trigger the modal -->
    <button type="button" class="btn btn-primary" @click="showModal = true">Add Article</button>

    <!-- Modal -->
    <div v-if="showModal" class="modal fade show d-block" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add New Article</h5>
            <button type="button" class="close" aria-label="Close" @click="showModal = false">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="submitForm">
              <div class="mb-3">
                <label for="title" class="form-label">Title</label>
                <input
                  v-model="article.title"
                  type="text"
                  class="form-control"
                  id="title"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="author" class="form-label">Author</label>
                <input
                  v-model="article.author"
                  type="text"
                  class="form-control"
                  id="author"
                  required
                />
              </div>
              <div class="mb-3">
                <label for="date" class="form-label">Date</label>
                <input v-model="article.date" type="date" class="form-control" id="date" required />
              </div>
              <div class="mb-3">
                <label for="content" class="form-label">Content</label>
                <textarea
                  v-model="article.content"
                  class="form-control"
                  id="content"
                  rows="4"
                  required
                ></textarea>
              </div>
              <button type="submit" class="btn btn-primary">Save Article</button>
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
