<script setup>
import { ref, onMounted } from 'vue'
import ArticleModal from './ArticleModal.vue'
import { articles } from '@/repository/ArticleRepository.js'

const showModal = ref(false)
</script>

<template>
  <div>
    <h3>Articles</h3>
    <!-- Article table or content goes here -->

    <!-- Modal -->
    <ArticleModal v-model:showModal="showModal" />
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Description</th>
          <th>Rating</th>
          <th>Review Count</th>
          <th>Redirect Link</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="article in articles" :key="article.id">
          <td>{{ article.id }}</td>
          <td>{{ article.title }}</td>
          <td>{{ article.description }}</td>
          <td>{{ Math.floor(article.totalStarCount / article.totalReviewCount) }}</td>
          <td>{{ article.totalReviewCount }}</td>
          <td>
            <a :href="article.redirectLink" target="_blank">
              {{ article.redirectLink }}
            </a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
