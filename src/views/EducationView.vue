<script setup>
import { ref, onMounted } from 'vue'
import ArticleCard from '@/components/Education/ArticleCard.vue'
import { getArticleCards } from '@/repository/ArticleRepository'
import { getEvents } from '@/repository/EventRepository' // Assuming similar structure for events
import Paginator from 'primevue/paginator'

const articles = ref([])
const events = ref([]) // If you want to handle events similarly
const loading = ref(true) // Loading state

// Pagination state
const totalRecordsArticles = ref(0)
const totalRecordsEvents = ref(0)
const rowsPerPage = ref(10) // Number of rows per page
const currentPageArticles = ref(0) // Current page number for articles
const currentPageEvents = ref(0) // Current page number for events

// Fetch articles with pagination
const fetchArticles = async (page = 0) => {
  try {
    loading.value = true
    const response = await getArticleCards(page, rowsPerPage.value) // Pass page and rowsPerPage to Firestore
    articles.value = response.data // Assign data from Firestore
    totalRecordsArticles.value = response.total // Total number of records
  } catch (error) {
    console.error('Error fetching articles:', error)
  } finally {
    loading.value = false
  }
}

// Fetch events with pagination (if needed)
const fetchEvents = async (page = 0) => {
  try {
    loading.value = true
    const response = await getEvents(page, rowsPerPage.value) // Pass page and rowsPerPage to Firestore
    events.value = response.data // Assign data from Firestore
    totalRecordsEvents.value = response.total // Total number of records
  } catch (error) {
    console.error('Error fetching events:', error)
  } finally {
    loading.value = false
  }
}

// Handle pagination change for articles
const onPageChangeArticles = (event) => {
  currentPageArticles.value = event.page
  fetchArticles(event.page)
}

// Handle pagination change for events
const onPageChangeEvents = (event) => {
  currentPageEvents.value = event.page
  fetchEvents(event.page)
}

// Call fetch functions on mount
onMounted(() => {
  fetchArticles() // Fetch first page of articles
  fetchEvents() // Fetch first page of events
})
</script>

<template>
  <div class="container my-4">
    <div v-if="loading" class="text-center">Loading...</div>
    <div v-else>
      <!-- Articles Section -->
      <h2>Articles</h2>
      <div class="row">
        <div
          v-for="article in articles"
          :key="article.id"
          class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
        >
          <ArticleCard
            :id="article.id"
            :title="article.title"
            :image="article.image"
            :description="article.content"
            :rating="
              article.totalReviewCount > 0
                ? Math.floor(article.totalStarCount / article.totalReviewCount)
                : 0
            "
            :totalReviewCount="article.totalReviewCount"
            :totalStarCount="article.totalStarCount"
          />
        </div>
      </div>

      <!-- Article Paginator -->
      <Paginator
        :rows="rowsPerPage"
        :totalRecords="totalRecordsArticles"
        :first="currentPageArticles * rowsPerPage"
        @page="onPageChangeArticles"
      />

      <!-- Events Section -->
      <h2 class="mt-5">Events</h2>
      <div class="row">
        <div
          v-for="event in events"
          :key="event.id"
          class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
        >
          <div class="card w-100 border border-primary">
            <div class="card-header text-white bg-primary">
              <h5 class="card-title mb-0">{{ event.name }}</h5>
            </div>
            <div class="card-body">
              <p>{{ event.description }}</p>
              <p><strong>Date:</strong> {{ event.dateTime }}</p>
              <p><strong>Location:</strong> {{ event.location }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Event Paginator -->
      <Paginator
        :rows="rowsPerPage"
        :totalRecords="totalRecordsEvents"
        :first="currentPageEvents * rowsPerPage"
        @page="onPageChangeEvents"
      />
    </div>
  </div>
</template>

<style scoped></style>
