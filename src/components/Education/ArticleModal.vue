<script setup>
import { ref } from 'vue'
import { saveArticle } from '@/repository/ArticleRepository'
import { getFirestore, collection, doc } from 'firebase/firestore'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'

const db = getFirestore()
const storage = getStorage()

const showModal = ref(false)
const article = ref({
  id: null,
  title: '',
  image: '',
  imageUrl: '', // Store image URL after upload
  content: '',
  totalStarCount: 0,
  totalReviewCount: 0,
  redirectLink: ''
})
const redirectToPage = ref(false) // Track the checkbox state
const imageFile = ref(null) // Track the file input

// Handle file uploads
const handleFileUpload = (event) => {
  imageFile.value = event.target.files[0] // Get the uploaded file
}

const uploadImageAndGetUrl = async () => {
  if (imageFile.value) {
    const storageReference = storageRef(
      storage,
      `articles/${article.value.id}/${imageFile.value.name}`
    )
    await uploadBytes(storageReference, imageFile.value)
    const imageUrl = await getDownloadURL(storageReference)
    return imageUrl
  }
  return null
}

const submitForm = async () => {
  try {
    // Generate a unique ID for the article
    const articleRef = doc(collection(db, 'articles'))
    article.value.id = articleRef.id

    // Upload the image and get the URL
    const imageUrl = await uploadImageAndGetUrl()
    article.value.imageUrl = imageUrl

    // Save the article in Firestore
    await saveArticle(article.value)

    console.log('Article submitted:', article.value)

    // Close the modal after submission
    showModal.value = false

    // Clear the form fields
    article.value = {
      id: null,
      title: '',
      image: '',
      imageUrl: '',
      content: '',
      totalStarCount: 0,
      totalReviewCount: 0,
      redirectLink: ''
    }
    imageFile.value = null
    redirectToPage.value = false
  } catch (error) {
    console.error('Error submitting article:', error)
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
                <label for="image" class="form-label">Article Thumbnail</label>
                <input type="file" class="form-control" id="image" @change="handleFileUpload" />
              </div>
              <div class="mb-3">
                <label for="content" class="form-label">Content</label>
                <textarea
                  v-model="article.content"
                  class="form-control"
                  id="content"
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
