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
  collection,
  orderBy,
  where
} from 'firebase/firestore'

// Initialize Firestore
const db = getFirestore()
const clinicsCollection = collection(db, 'clinics') // Collection for clinics

// Fetch clinics
export const getClinics = async () => {
  try {
    // Fetch all documents from ClinicsCollection
    const snapshot = await getDocs(clinicsCollection)

    const Clinics = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))

    return {
      data: Clinics,
      total: snapshot.size // Total number of records
    }
  } catch (error) {
    console.error('Error fetching Clinics:', error)
    throw error
  }
}

// Save or update a clinic in Firestore
export const saveClinic = async (clinic) => {
  try {
    const clinicRef = doc(db, 'clinics', clinic.id) // Use the generated clinic ID
    await setDoc(clinicRef, {
      name: clinic.name,
      phoneNumber: clinic.phoneNumber,
      location: clinic.location,
      description: clinic.description
    })
    console.log('Clinic saved successfully')
  } catch (error) {
    console.error('Error saving clinic:', error)
  }
}

// Get a clinic from Firestore by clinic ID
export const getClinic = async (clinicId) => {
  try {
    const clinicRef = doc(clinicsCollection, clinicId)
    const clinicSnap = await getDoc(clinicRef)
    if (clinicSnap.exists()) {
      return clinicSnap.data() // Return the clinic data
    } else {
      console.log('No such clinic!')
      return null
    }
  } catch (error) {
    console.error('Error getting clinic:', error)
  }
}

// Delete a clinic from Firestore
export const deleteClinic = async (clinicId) => {
  try {
    const clinicRef = doc(clinicsCollection, clinicId)
    await deleteDoc(clinicRef)
    console.log('Clinic deleted successfully')
  } catch (error) {
    console.error('Error deleting clinic:', error)
  }
}
