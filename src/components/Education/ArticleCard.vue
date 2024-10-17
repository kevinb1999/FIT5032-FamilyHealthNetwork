<script setup>
import { saveArticle } from '@/repository/ArticleRepository'
import Rating from 'primevue/rating'
import { ref, computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  imageURL: {
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

const value = ref(0)

const averageRating = computed(() => {
  return props.totalReviewCount === 0
    ? 0
    : (props.totalStarCount / props.totalReviewCount).toFixed(1)
})

const handleRating = async (star) => {
  value.value = star
  const updatedArticle = {
    id: props.id,
    title: props.title,
    imageURL: props.imageURL,
    content: props.description,
    totalStarCount: props.totalStarCount + star,
    totalReviewCount: props.totalReviewCount + 1,
    userReviewArr: []
  }

  try {
    await saveArticle(updatedArticle)
    console.log('Article updated successfully.')
  } catch (error) {
    console.error('Error updating article:', error)
  }
}
</script>

<template>
  <div class="card w-100 border border-primary" role="article" aria-labelledby="article-title">
    <div class="card-header text-white bg-primary">
      <h5 id="article-title" class="card-title mb-0">{{ title }}</h5>
    </div>
    <div class="article-img" role="img" aria-label="Article Image">
      <img v-if="imageURL" :src="imageURL" alt="{{ title }}Image" class="img-fluid" />
      <div v-else class="no-image" aria-hidden="true">No Image Available</div>
    </div>
    <div class="card-body">
      <p class="card-text" aria-label="Article Description">
        {{ description }}
      </p>
    </div>
    <div class="card-footer bg-light d-flex justify-content-start align-items-center">
      <Rating
        v-model="value"
        :stars="5"
        @rate="handleRating(value)"
        aria-label="Rate this article"
      />
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
