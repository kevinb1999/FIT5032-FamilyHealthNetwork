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
} from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'; // Import Firebase Storage

// Initialize Firestore and Storage
const db = getFirestore();
const storage = getStorage();

const newslettersCollection = collection(db, 'newsletters'); // Collection for newsletters

// Fetch newsletters with pagination, sorting, and filtering
export const getNewsletters = async (page = 0, rows = 10, sortField = 'dateCreated', sortOrder = 1) => {
  try {
    let q = query(newslettersCollection, orderBy(sortField, sortOrder === 1 ? 'asc' : 'desc'));

    // Pagination logic
    q = query(q, limit(rows));

    // Execute the query
    const snapshot = await getDocs(q);

    const newsletters = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      data: newsletters,
      total: snapshot.size, // Total number of records (adjust if needed)
    };
  } catch (error) {
    console.error('Error fetching newsletters:', error);
    throw error;
  }
};

// Save or update a newsletter in Firestore
export const saveNewsletter = async (newsletter, file) => {
  try {
    let attachmentUrl = null;

    // If a file is provided, upload it to Firebase Storage
    if (file) {
      const fileRef = storageRef(storage, `newsletters/${newsletter.id}/${file.name}`);
      const snapshot = await uploadBytes(fileRef, file); // Upload file to Firebase Storage
      attachmentUrl = await getDownloadURL(snapshot.ref); // Get the file's download URL
    }

    const newsletterRef = doc(db, 'newsletters', newsletter.id); // Use the generated newsletter ID

    await setDoc(newsletterRef, {
      subject: newsletter.subject,
      body: newsletter.body,
      attachmentUrl: attachmentUrl, // Store the file URL in Firestore
      dateCreated: new Date(), // Add current date
    });

    console.log('Newsletter saved successfully');
  } catch (error) {
    console.error('Error saving newsletter:', error);
  }
};

// Get a newsletter from Firestore by newsletter ID
export const getNewsletter = async (newsletterId) => {
  try {
    const newsletterRef = doc(newslettersCollection, newsletterId);
    const newsletterSnap = await getDoc(newsletterRef);
    if (newsletterSnap.exists()) {
      return newsletterSnap.data(); // Return the newsletter data
    } else {
      console.log('No such newsletter!');
      return null;
    }
  } catch (error) {
    console.error('Error getting newsletter:', error);
  }
};

// Delete a newsletter from Firestore
export const deleteNewsletter = async (newsletterId) => {
  try {
    const newsletterRef = doc(newslettersCollection, newsletterId);
    await deleteDoc(newsletterRef);
    console.log('Newsletter deleted successfully');
  } catch (error) {
    console.error('Error deleting newsletter:', error);
  }
};
