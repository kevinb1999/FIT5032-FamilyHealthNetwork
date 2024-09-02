<script setup>
import ArticleCard from '../components/ArticleCard.vue'
import { articles } from '@/repository/ArticleRepository'
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
          :id="article.id"
          :title="article.title"
          :image="article.image"
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
  </div>
</template>

<style scoped></style>
