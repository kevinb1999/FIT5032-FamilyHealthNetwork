import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'

// Initialize Firebase Storage
const storage = getStorage()

export const uploadFile = async (file, articleId) => {
  try {
    const fileRef = ref(storage, `article_images/${articleId}`)
    await uploadBytes(fileRef, file)
    const downloadURL = await getDownloadURL(fileRef)
    return downloadURL
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}

export const uploadAttachment = async (file, attachmentId) => {
  try {
    const fileRef = ref(storage, `newsletter_attachments/${attachmentId}`)
    await uploadBytes(fileRef, file)
    const downloadURL = await getDownloadURL(fileRef)
    return downloadURL
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}
