<template>
  <div v-if="showModal" class="modal fade show d-block" tabindex="-1" role="dialog">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">{{ article.id ? 'Edit Article' : 'Add New Article' }}</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="$emit('close')">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="submitForm">
            <div class="mb-3">
              <label for="title" class="form-label">Article Title</label>
              <input
                v-model="article.title"
                type="text"
                class="form-control"
                id="title"
                required
                aria-label="Article title"
              />
            </div>
            <div class="mb-3">
              <label for="image" class="form-label">Article Image</label>
              <input
                type="file"
                class="form-control"
                id="image"
                aria-label="Article image"
                @change="handleFileUpload"
              />
            </div>
            <div class="mb-3">
              <label for="description" class="form-label">Description</label>
              <textarea
                v-model="article.description"
                class="form-control"
                id="description"
                rows="3"
                required
                aria-label="Article description"
              ></textarea>
            </div>
            <div class="mb-3 form-check">
              <input
                type="checkbox"
                class="form-check-input"
                id="redirectToArticle"
                v-model="article.redirectToArticle"
              />
              <label class="form-check-label" for="redirectToArticle">
                Redirect to External Article
              </label>
            </div>
            <div class="mb-3" v-if="article.redirectToArticle">
              <label for="externalArticleURL" class="form-label">External Article URL</label>
              <input
                v-model="article.externalArticleURL"
                type="url"
                class="form-control"
                id="externalArticleURL"
                aria-label="External Article URL"
              />
            </div>
            <button type="submit" class="btn btn-primary">
              {{ article.id ? 'Update' : 'Save' }} Article
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
import { saveArticle } from '@/repository/ArticleRepository'
import { getFirestore, collection, doc } from 'firebase/firestore'
import { uploadFile } from '@/repository/FileUploadRepository'

const db = getFirestore()

const props = defineProps({
  articleData: {
    type: Object,
    default: null
  },
  showModal: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits(['close', 'refreshTable'])

const article = ref({
  id: null,
  title: '',
  imageURL: '',
  description: '',
  redirectToArticle: false,
  externalArticleURL: ''
})

const imageFile = ref(null)

const resetForm = () => {
  article.value = {
    id: null,
    title: '',
    imageURL: '',
    description: '',
    redirectToArticle: false,
    externalArticleURL: ''
  }
  imageFile.value = null
}

watch(
  () => props.articleData,
  (newValue) => {
    if (newValue) {
      article.value = { ...newValue }
    } else {
      resetForm()
    }
  },
  { immediate: true }
)

const handleFileUpload = (event) => {
  imageFile.value = event.target.files[0]
}

const submitForm = async () => {
  try {
    if (!article.value.id) {
      const articleRef = doc(collection(db, 'articles'))
      article.value.id = articleRef.id
    }

    // Upload image if a file is selected
    if (imageFile.value) {
      article.value.imageURL = await uploadFile(imageFile.value, article.value.id)
    }

    await saveArticle(article.value)

    emits('refreshTable')
    resetForm()
    emits('close')
  } catch (error) {
    console.error('Error submitting article:', error)
  }
}
</script>

<style scoped>
.modal-backdrop {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
