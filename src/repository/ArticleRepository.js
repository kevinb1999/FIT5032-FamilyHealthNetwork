import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  limit,
  updateDoc,
  deleteDoc,
  collection
} from 'firebase/firestore'
import { auth } from '@/firebase/init' // Your firebase init file

// Initialize Firestore
const db = getFirestore()

const articlesCollection = collection(db, 'articles') // Collection for articles

export const getArticleCards = async (page = 0, rows = 10) => {
  try {
    let q = query(articlesCollection, limit(rows))

    // Execute the query
    const snapshot = await getDocs(q)

    const articles = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))

    return {
      data: articles,
      total: snapshot.size // Total number of records
    }
  } catch (error) {
    console.error('Error fetching articles:', error)
    throw error
  }
}

export const getArticles = async (
  page = 0,
  rows = 10,
  sortField = '',
  sortOrder = 1,
  filters = {}
) => {
  try {
    let q = query(articlesCollection)

    // Apply sorting if sortField is provided
    if (sortField) {
      q = query(q, orderBy(sortField, sortOrder === 1 ? 'asc' : 'desc'))
    }

    // Apply filtering from PrimeVue filters
    for (const filterField in filters) {
      const filterValue = filters[filterField].value
      if (filterValue) {
        // Apply Firestore where clause for each filter field
        q = query(q, where(filterField, '>=', filterValue), where(filterField, '<=', filterValue))
      }
    }

    // Pagination logic
    q = query(q, limit(rows))

    // Execute the query
    const snapshot = await getDocs(q)

    const articles = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))

    return {
      data: articles,
      total: snapshot.size // Total number of records (adjust if needed)
    }
  } catch (error) {
    console.error('Error fetching articles:', error)
    throw error
  }
}

// Add or update an article in Firestore
export const saveArticle = async (article) => {
  try {
    const articleRef = doc(db, 'articles', article.id) // Reference to article document
    await setDoc(articleRef, {
      title: article.title,
      image: article.image,
      content: article.content,
      totalReviewCount: article.totalReviewCount,
      userReviewArr: article.userReviewArr,
      redirectLink: article.redirectLink
    })
    console.log('Article saved successfully')
  } catch (error) {
    console.error('Error saving article:', error)
  }
}

// Get an article from Firestore by article ID
export const getArticle = async (articleId) => {
  try {
    const articleRef = doc(articlesCollection, articleId)
    const articleSnap = await getDoc(articleRef)
    if (articleSnap.exists()) {
      return articleSnap.data() // Return the article data
    } else {
      console.log('No such article!')
      return null
    }
  } catch (error) {
    console.error('Error getting article:', error)
  }
}

// Update an existing article in Firestore (using an Article object)
export const updateArticle = async (article) => {
  try {
    const articleRef = doc(articlesCollection, article.id)
    await updateDoc(articleRef, {
      title: article.title,
      image: article.image,
      content: article.content,
      totalReviewCount: article.totalReviewCount,
      userReviewArr: article.userReviewArr,
      redirectLink: article.redirectLink
    })
    console.log('Article updated successfully')
  } catch (error) {
    console.error('Error updating article:', error)
  }
}

// Delete an article from Firestore
export const deleteArticle = async (articleId) => {
  try {
    const articleRef = doc(articlesCollection, articleId)
    await deleteDoc(articleRef)
    console.log('Article deleted successfully')
  } catch (error) {
    console.error('Error deleting article:', error)
  }
}
