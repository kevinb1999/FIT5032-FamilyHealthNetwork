<script setup>
import { editArticle } from '@/repository/ArticleRepository'
import Rating from 'primevue/rating'
import { ref } from 'vue'

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
    type: Number,
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

const value = ref(props.rating)

const handleRating = (star) => {
  const updatedArticle = {
    id: props.id,
    title: props.title,
    image: props.image,
    description: props.description,
    totalStarCount: props.totalStarCount + star,
    totalReviewCount: props.totalReviewCount + 1
  }
  editArticle(updatedArticle)
}
</script>

<template>
  <div class="card w-100 border border-primary" role="article" aria-labelledby="article-title">
    <div class="card-header text-white bg-primary">
      <h5 id="article-title" class="card-title mb-0">{{ title }}</h5>
    </div>
    <div class="article-img" role="img" aria-label="Article Image">
      <img v-if="image" :src="image" alt="Image related to the article" class="img-fluid" />
      <div v-else class="no-image" aria-hidden="true">No Image Available</div>
    </div>
    <div class="card-body">
      <p class="card-text" aria-label="Article Description">
        {{ description }}
      </p>
    </div>
    <div class="card-footer bg-light d-flex justify-content-start align-items-center">
      <Rating v-model="value" aria-label="Rate this article" />
      <span class="text-warning">
        <button
          v-for="n in 5"
          :key="n"
          @click="handleRating(n)"
          class="btn btn-link p-0"
          aria-label="Rate this article with {{ n }} star"
        >
          <i :class="n <= value ? 'fas fa-star' : 'far fa-star'"></i>
        </button>
      </span>
    </div>
  </div>
</template>

<style scoped>
.article-img {
  background-color: #000;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.fa-star {
  color: gold;
}

.fa-star:hover {
  background-color: darkgoldenrod;
}
</style>
