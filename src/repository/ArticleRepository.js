// This will be replaced by a firebase database in the near future
import { ref } from 'vue'

export const articles = ref([])

export const addArticle = (newArticle) => {
  articles.value.push(newArticle)
  localStorage.setItem('articles', JSON.stringify(articles.value))
}

export const editArticle = (updatedArticle) => {
  const index = articles.value.findIndex((article) => article.id === updatedArticle.id)
  articles.value[index] = updatedArticle
  localStorage.setItem('articles', JSON.stringify(articles.value))
}

export const deleteArticle = (id) => {
  articles.value = articles.value.filter((article) => article.id !== id)
  localStorage.setItem('articles', JSON.stringify(articles.value))
}

export const loadArticles = () => {
  const savedArticles = localStorage.getItem('articles')
  if (savedArticles) {
    articles.value = JSON.parse(savedArticles)
  } else {
    // Load default articles if nothing is in local storage
    articles.value = [
      {
        id: 0,
        title: 'Article 1',
        image: 'image1.jpg',
        description: 'Short description of article 1',
        totalStarCount: 5,
        totalReviewCount: 1
      },
      {
        id: 1,
        title: 'Article 2',
        image: 'image2.jpg',
        description: 'Short description of article 2',
        totalStarCount: 4,
        totalReviewCount: 1
      }
    ]
  }
}

export default {
  articles,
  loadArticles,
  addArticle,
  editArticle,
  deleteArticle
}
