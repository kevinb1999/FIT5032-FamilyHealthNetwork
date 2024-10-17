<template>
  <div>
    <DataTable
      :value="articles"
      :loading="loading"
      :rows="rowsPerPage"
      :paginator="true"
      :total-records="totalRecords"
      :lazy="true"
      @page="onPage"
      @sort="onSort"
      @filter="onFilter"
      :sortField="sortField"
      :sortOrder="sortOrder"
      :filters="filters"
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
      <Column
        field="image"
        header="Image URL"
        sortable
        filter
        filterPlaceholder="Search by image URL"
        aria-label="Search by image URL"
      />
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
const rowsPerPage = ref(10)
const currentPage = ref(0)
const sortField = ref('')
const sortOrder = ref(1)

// Function to fetch article data
function fetchData() {
  loading.value = true
  getArticles(currentPage.value, rowsPerPage.value, sortField.value, sortOrder.value)
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

// Pagination and sorting handlers
const onPage = (event) => {
  currentPage.value = event.page
  fetchData()
}

const onSort = (event) => {
  fetchData()
}

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
