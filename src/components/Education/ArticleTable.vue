<template>
  <div>
    <DataTable
      paginator
      :rows="5"
      :rowsPerPageOptions="[5, 10, 20, 50]"
      removableSort
      :value="articles"
      :loading="loading"
      :total-records="totalRecords"
      aria-label="List of articles"
    >
      <Column
        field="title"
        header="Title"
        sortable
        filter
        filterPlaceholder="Search by title"
        aria-label="Search by article title"
      />
      <Column header="Image" bodyClass="text-center">
        <template #body="slotProps">
          <img
            :src="slotProps.data.imageURL"
            alt="Article Image"
            class="img-thumbnail"
            style="max-width: 100px; height: auto"
            aria-label="Image of article {{ slotProps.data.title }}"
          />
        </template>
      </Column>
      <Column
        field="description"
        header="Description"
        sortable
        filter
        filterPlaceholder="Search by description"
        aria-label="Search by description"
      />
      <Column header="Actions" bodyClass="text-center">
        <template #body="slotProps">
          <div class="d-flex justify-content-center">
            <button
              type="button"
              class="btn btn-warning me-2"
              @click="$emit('edit', slotProps.data)"
              aria-label="Edit article {{ slotProps.data.title }}"
            >
              <i class="pi pi-pencil" aria-hidden="true"></i> Edit
            </button>
            <button
              type="button"
              class="btn btn-danger"
              @click="handleDeleteArticle(slotProps.data.id)"
              aria-label="Delete article {{ slotProps.data.title }}"
            >
              <i class="pi pi-trash" aria-hidden="true"></i> Delete
            </button>
          </div>
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getArticles, deleteArticle } from '@/repository/ArticleRepository'

const articles = ref([])
const loading = ref(false)
const totalRecords = ref(0)

// Function to fetch article data
function fetchData() {
  loading.value = true
  getArticles()
    .then((response) => {
      articles.value = response.data
      totalRecords.value = response.total
      loading.value = false
    })
    .catch(() => {
      loading.value = false
    })
}

// Lifecycle hook to fetch data on mount
onMounted(() => {
  fetchData()
})

// Delete article handler
const handleDeleteArticle = async (articleId) => {
  try {
    await deleteArticle(articleId)
    fetchData() // Refresh data after deletion
  } catch (error) {
    console.error('Error deleting article:', error)
  }
}

// Expose the fetchData function to the parent component
defineExpose({
  fetchData
})
</script>

<style scoped>
.text-center {
  text-align: center;
}
.me-2 {
  margin-right: 0.5rem; /* Small gap between buttons */
}
</style>
