<script setup>
import { ref, onMounted } from 'vue'
import ArticleCard from '@/components/Education/ArticleCard.vue'
import { getArticleCards } from '@/repository/ArticleRepository'
import { getEvents } from '@/repository/EventRepository'
import Paginator from 'primevue/paginator'

const articles = ref([])
const events = ref([])
const loading = ref(true)

// Pagination state
const totalRecordsArticles = ref(0)
const totalRecordsEvents = ref(0)
const rowsPerPage = ref(10)
const currentPageArticles = ref(0)
const currentPageEvents = ref(0)

// Fetch articles with pagination
const fetchArticles = async (page = 0) => {
  try {
    loading.value = true
    const response = await getArticleCards(page, rowsPerPage.value)
    articles.value = response.data
    totalRecordsArticles.value = response.total
  } catch (error) {
    console.error('Error fetching articles:', error)
  } finally {
    loading.value = false
  }
}

// Fetch events with pagination
const fetchEvents = async (page = 0) => {
  try {
    loading.value = true
    const response = await getEvents(page, rowsPerPage.value)
    events.value = response.data
    totalRecordsEvents.value = response.total
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
  fetchArticles()
  fetchEvents()
})
</script>

<template>
  <div class="container my-4">
    <div v-if="loading" class="text-center" role="alert" aria-live="polite">Loading...</div>
    <div v-else>
      <!-- Articles Section -->
      <h2 id="articles-section" tabindex="0">Articles</h2>
      <div class="row" aria-labelledby="articles-section">
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
        aria-label="Pagination for articles"
      />

      <!-- Events Section -->
      <h2 id="events-section" class="mt-5" tabindex="0">Events</h2>
      <div class="row" aria-labelledby="events-section">
        <div v-for="event in events" :key="event.id" class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4">
          <div class="card w-100 border border-primary">
            <div class="card-header text-white bg-primary">
              <h5 class="card-title mb-0">{{ event.name }}</h5>
            </div>
            <div class="card-body">
              <p class="card-text">{{ event.description }}</p>
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
        aria-label="Pagination for events"
      />
    </div>
  </div>
</template>

<style scoped>
.text-center {
  text-align: center;
}
</style>
