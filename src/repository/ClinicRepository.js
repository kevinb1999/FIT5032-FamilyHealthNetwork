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

// Fetch clinics with pagination, sorting, and filtering
export const getClinics = async (
  page = 0,
  rows = 10,
  sortField = '',
  sortOrder = 1,
  filters = {}
) => {
  try {
    let q = query(clinicsCollection)

    // Apply sorting if sortField is provided
    if (sortField) {
      q = query(q, orderBy(sortField, sortOrder === 1 ? 'asc' : 'desc'))
    }

    // Apply filtering from PrimeVue filters
    for (const filterField in filters) {
      const filterValue = filters[filterField].value
      if (filterValue) {
        // Apply Firestore where clause for each filter field (assuming "contains" matchMode)
        q = query(q, where(filterField, '>=', filterValue), where(filterField, '<=', filterValue))
      }
    }

    // Pagination logic
    q = query(q, limit(rows))

    // Execute the query
    const snapshot = await getDocs(q)

    const clinics = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))

    return {
      data: clinics,
      total: snapshot.size
    }
  } catch (error) {
    console.error('Error fetching clinics:', error)
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

// Update an existing clinic in Firestore (using a Clinic object)
export const updateClinic = async (clinic) => {
  try {
    const clinicRef = doc(clinicsCollection, clinic.id)
    await updateDoc(clinicRef, {
      name: clinic.name,
      phoneNumber: clinic.phoneNumber,
      location: clinic.location,
      description: clinic.description
    })
    console.log('Clinic updated successfully')
  } catch (error) {
    console.error('Error updating clinic:', error)
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
