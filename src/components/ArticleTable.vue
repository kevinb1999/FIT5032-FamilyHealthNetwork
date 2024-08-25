<script setup>
import { ref, onMounted } from 'vue'
import ArticleModal from './ArticleModal.vue'
import { articles, loadArticles } from '@/repository/ArticleRepository.js'

const showModal = ref(false)

onMounted(() => loadArticles())
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
          <th>#</th>
          <th>Title</th>
          <th>Author</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="article in articles" :key="article.id">
          <td>{{ article.id }}</td>
          <td>{{ article.title }}</td>
          <td>{{ article.author }}</td>
          <td>{{ article.date }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
