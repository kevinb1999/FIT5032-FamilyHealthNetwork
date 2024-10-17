import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  collection
} from 'firebase/firestore'
import { auth } from '@/firebase/init' // Your firebase init file

// Initialize Firestore
const db = getFirestore()

const articlesCollection = collection(db, 'articles') // Collection for articles

export const getArticles = async () => {
  try {
    // Fetch all documents from articlesCollection
    const snapshot = await getDocs(articlesCollection)

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

// Add or update an article in Firestore
export const saveArticle = async (article) => {
  try {
    const articleRef = doc(db, 'articles', article.id)
    await setDoc(articleRef, {
      title: article.title,
      imageURL: article.imageURL,
      description: article.description,
      redirectToArticle: article.redirectToArticle,
      externalArticleURL: article.redirectToArticle ? article.externalArticleURL : null
    })
    console.log('Article saved successfully')
  } catch (error) {
    console.error('Error saving article:', error)
    throw error
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
