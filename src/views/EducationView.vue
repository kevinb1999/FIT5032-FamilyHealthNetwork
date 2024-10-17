<script setup>
import { ref, onMounted } from 'vue'
import ArticleCard from '@/components/Education/ArticleCard.vue'
import { getArticles } from '@/repository/ArticleRepository'
import { getEvents } from '@/repository/EventRepository'

const articles = ref([])
const totalArticles = ref(0)
const events = ref([])
const totalEvents = ref(0)
const loading = ref(true)

function fetchData() {
  loading.value = true
  getEvents()
    .then((response) => {
      events.value = response.data
      totalEvents.value = response.total
      loading.value = false
    })
    .catch(() => {
      loading.value = false
    })
  loading.value = true
  getArticles()
    .then((response) => {
      articles.value = response.data
      totalArticles.value = response.total
      loading.value = false
    })
    .catch(() => {
      loading.value = false
    })
}

// Call fetch functions on mount
onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="container my-4">
    <div v-if="loading" class="text-center" role="alert" aria-live="polite">Loading...</div>
    <div v-else>
      <!-- Articles Section -->
      <h2 id="articles-section" tabindex="0">Articles</h2>
      <div class="row" aria-labelledby="articles-section">
        <DataView :value="articles" paginator :rows="4" :layout="layout">
          <template #list="slotProps">
            <div class="row">
              <div
                v-for="article in slotProps.items"
                :key="article.id"
                class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
              >
                <ArticleCard
                  :id="article.id"
                  :title="article.title"
                  :imageURL="article.imageURL"
                  :description="article.description"
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
          </template>
        </DataView>
      </div>

      <!-- Events Section -->
      <h2 id="events-section" class="mt-5" tabindex="0">Events</h2>
      <div class="row" aria-labelledby="events-section">
        <DataView :value="events" paginator :rows="4" :layout="layout">
          <template #list="slotProps">
            <div class="row">
              <div
                v-for="event in slotProps.items"
                :key="event.id"
                class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
              >
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
          </template>
        </DataView>
      </div>
    </div>
  </div>
</template>

<style scoped>
.text-center {
  text-align: center;
}
</style>
