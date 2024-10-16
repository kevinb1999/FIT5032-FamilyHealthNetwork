import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  limit,
  orderBy,
  deleteDoc,
  collection,
  updateDoc // Import updateDoc for updating documents
} from 'firebase/firestore'
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage' // Import Firebase Storage

// Initialize Firestore and Storage
const db = getFirestore()
const storage = getStorage()

const newslettersCollection = collection(db, 'newsletters') // Collection for newsletters

// Fetch newsletters with pagination, sorting, and filtering
export const getNewsletters = async () => {
  try {
    // Fetch all documents from NewslettersCollection
    const snapshot = await getDocs(newslettersCollection)

    const Newsletters = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))

    return {
      data: Newsletters,
      total: snapshot.size // Total number of records
    }
  } catch (error) {
    console.error('Error fetching Newsletters:', error)
    throw error
  }
}

// Save a new newsletter in Firestore
export const saveNewsletter = async (newsletter, file) => {
  try {
    let attachmentUrl = null

    // If a file is provided, upload it to Firebase Storage
    if (file) {
      const fileRef = storageRef(storage, `newsletters/${newsletter.id}/${file.name}`)
      const snapshot = await uploadBytes(fileRef, file) // Upload file to Firebase Storage
      attachmentUrl = await getDownloadURL(snapshot.ref) // Get the file's download URL
    }

    const newsletterRef = doc(db, 'newsletters', newsletter.id) // Use the generated newsletter ID

    await setDoc(newsletterRef, {
      subject: newsletter.subject,
      body: newsletter.body,
      attachmentUrl: attachmentUrl, // Store the file URL in Firestore
      dateCreated: new Date() // Add current date
    })

    console.log('Newsletter saved successfully')
  } catch (error) {
    console.error('Error saving newsletter:', error)
  }
}

// Get a newsletter from Firestore by newsletter ID
export const getNewsletter = async (newsletterId) => {
  try {
    const newsletterRef = doc(newslettersCollection, newsletterId)
    const newsletterSnap = await getDoc(newsletterRef)
    if (newsletterSnap.exists()) {
      return newsletterSnap.data() // Return the newsletter data
    } else {
      console.log('No such newsletter!')
      return null
    }
  } catch (error) {
    console.error('Error getting newsletter:', error)
  }
}

// Delete a newsletter from Firestore
export const deleteNewsletter = async (newsletterId) => {
  try {
    const newsletterRef = doc(newslettersCollection, newsletterId)
    await deleteDoc(newsletterRef)
    console.log('Newsletter deleted successfully')
  } catch (error) {
    console.error('Error deleting newsletter:', error)
  }
}
