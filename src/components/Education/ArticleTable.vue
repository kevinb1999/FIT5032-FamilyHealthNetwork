<script setup>
import { ref, onMounted } from 'vue'
import { getArticles, deleteArticle } from '@/repository/ArticleRepository' // Import the deleteArticle method
import ArticleModal from './ArticleModal.vue'

// Define props
const props = defineProps({
  publicView: {
    type: Boolean,
    default: false
  }
})

const articles = ref([])
const loading = ref(false)
const totalRecords = ref(0)
const rowsPerPage = ref(10) // Number of rows per page
const currentPage = ref(0) // Current page number
const sortField = ref('')
const sortOrder = ref(1)

const showModal = ref(false) // For controlling the article modal
const selectedArticle = ref(null) // Store the selected article for editing

// Fetch articles from the repository with pagination and sorting
const fetchArticles = async (page = 0, rows = 10, sortField = '', sortOrder = 1) => {
  try {
    loading.value = true
    const response = await getArticles(page, rows, sortField, sortOrder) // Call the repository method
    articles.value = response.data // Assign the fetched articles data
    totalRecords.value = response.total // Assign the total number of records
    loading.value = false
  } catch (err) {
    console.error('Error fetching articles:', err)
    loading.value = false
  }
}

onMounted(() => {
  fetchArticles() // Fetch articles on mount
})

// Handle pagination events
const onPage = (event) => {
  currentPage.value = event.page
  fetchArticles(event.page, event.rows, event.sortField, event.sortOrder)
}

// Handle sorting events
const onSort = (event) => {
  fetchArticles(currentPage.value, rowsPerPage.value, event.sortField, event.sortOrder)
}

// Handle deleting an article
const handleDeleteArticle = async (articleId) => {
  try {
    await deleteArticle(articleId) // Call the delete method from the repository
    fetchArticles(currentPage.value, rowsPerPage.value) // Refresh the articles after deletion
  } catch (error) {
    console.error('Error deleting article:', error)
  }
}
</script>



<template>
  <div>
    <!-- Article Data Table -->
    <DataTable
      :value="articles"
      :loading="loading"
      :rows="rowsPerPage"
      :paginator="true"
      :total-records="totalRecords"
      :lazy="true"
      @page="onPage"
      @sort="onSort"
      :sortField="sortField"
      :sortOrder="sortOrder"
    >
      <!-- Columns with built-in filters -->
      <Column field="title" header="Title" sortable filter filterPlaceholder="Search by title" />
      <Column
        field="content"
        header="Content"
        sortable
        filter
        filterPlaceholder="Search by content"
      />
      <Column
        field="totalReviewCount"
        header="Review Count"
        sortable
        filter
        filterPlaceholder="Search by review count"
      />
      <Column
        field="redirectLink"
        header="Redirect Link"
        sortable
        filter
        filterPlaceholder="Search by link"
      />

      <!-- Conditionally show the Actions column if not public view -->
      <Column v-if="!publicView" header="Actions" bodyClass="text-center">
        <template #body="slotProps">
          <Button
            label="Delete"
            icon="pi pi-trash"
            class="p-button-danger"
            @click="handleDeleteArticle(slotProps.data.id)"
          />
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<style scoped>
.text-center {
  text-align: center;
}
</style>


<style scoped>
.text-center {
  text-align: center;
}
</style>


<style scoped>
.text-center {
  text-align: center;
}
</style>
