<script setup>
import { ref } from 'vue'
import { articles, addArticle } from '@/repository/ArticleRepository'

const showModal = ref(false)
const article = ref({
  id: null,
  title: '',
  image: '',
  description: '',
  totalStarCount: 0,
  totalReviewCount: 0,
  redirectLink: '' // Add this property for the redirect link
})
const redirectToPage = ref(false) // Track the checkbox state

function submitForm() {
  article.value.id = articles.value.length
  addArticle(article.value)
  console.log('Article submitted:', article.value)

  // Close the modal after submission
  showModal.value = false

  // Clear the form fields
  article.value = {
    id: null,
    title: '',
    image: '',
    description: '',
    totalStarCount: 0,
    totalReviewCount: 0,
    redirectLink: ''
  }
  redirectToPage.value = false
}

const handleFileUpload = () => {
  // For now nothing
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
                <label for="image" class="form-label">Article Thumbnail</label>
                <input type="file" class="form-control" id="image" @change="handleFileUpload" />
              </div>
              <div class="mb-3">
                <label for="description" class="form-label">Description</label>
                <textarea
                  v-model="article.description"
                  class="form-control"
                  id="description"
                  rows="3"
                  required
                ></textarea>
              </div>
              <div class="mb-3 form-check">
                <input
                  v-model="redirectToPage"
                  class="form-check-input"
                  type="checkbox"
                  id="redirectToPage"
                />
                <label class="form-check-label" for="redirectToPage">
                  Redirect to article page
                </label>
              </div>
              <div v-if="redirectToPage" class="mb-3">
                <label for="redirectLink" class="form-label">Article Link</label>
                <input
                  v-model="article.redirectLink"
                  type="url"
                  class="form-control"
                  id="redirectLink"
                />
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
