<script setup>
import ArticleCard from '../components/ArticleCard.vue'
import { ref } from 'vue'
import articles from '../assets/JSON/articles.json'
</script>

<template>
  <div class="container my-4">
    <div class="row">
      <div
        v-for="article in articles"
        :key="article.id"
        class="col-12 col-sm-6 col-md-4 col-lg-3 mb-4"
      >
        <ArticleCard
          :title="article.title"
          :image="article.image"
          :description="article.description"
          :rating="Math.floor(article.totalStarCount / article.totalReviewCount)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
