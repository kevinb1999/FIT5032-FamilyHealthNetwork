<script setup>
import { updateArticle } from '@/repository/ArticleRepository'
import Rating from 'primevue/rating'
import { ref, computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  id: {
    type: String,
    required: true
  },
  totalReviewCount: {
    type: Number,
    required: true
  },
  totalStarCount: {
    type: Number,
    required: true
  }
})

const value = ref(0) // Ref to hold the selected star value

// Compute the average rating based on total stars and reviews
const averageRating = computed(() => {
  return props.totalReviewCount === 0 ? 0 : (props.totalStarCount / props.totalReviewCount).toFixed(1)
})

// Function to handle rating selection
const handleRating = async (star) => {
  value.value = star
  const updatedArticle = {
    id: props.id,
    title: props.title,
    image: props.image,
    content: props.description,
    totalStarCount: props.totalStarCount + star,
    totalReviewCount: props.totalReviewCount + 1,
    userReviewArr: [] // Optional: Add user review array if necessary
  }

  try {
    await updateArticle(updatedArticle) // Use updateArticle from repository
    console.log('Article updated successfully.')
  } catch (error) {
    console.error('Error updating article:', error)
  }
}
</script>

<template>
  <div class="card w-100 border border-primary">
    <div class="card-header text-white bg-primary">
      <h5 class="card-title mb-0">{{ title }}</h5>
    </div>
    <div class="article-img">
      <img v-if="image" :src="image" alt="Article Image" class="img-fluid" />
      <div v-else class="no-image">No Image Available</div>
    </div>
    <div class="card-body">
      <p class="card-text">
        {{ description }}
      </p>
    </div>
    <div class="card-footer bg-light d-flex justify-content-start align-items-center">
      <Rating v-model="value" :stars="5" @rate="handleRating(value)" />
      <span class="ms-3">Average: {{ averageRating }}</span>
    </div>
  </div>
</template>

<style scoped>
.article-img {
  background-color: #f8f9fa;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6c757d;
}

.img-fluid {
  max-height: 100%;
  max-width: 100%;
}

.no-image {
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
}
</style>
