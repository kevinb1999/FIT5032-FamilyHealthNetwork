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

const usersCollection = collection(db, 'users') // Collection for users

export const getUsers = async (
  page = 0,
  rows = 10,
  sortField = '',
  sortOrder = 1,
  filters = {}
) => {
  try {
    let q = query(usersCollection)

    // Apply sorting if sortField is provided
    if (sortField) {
      q = query(q, orderBy(sortField, sortOrder === 1 ? 'asc' : 'desc'))
    }

    // Apply filtering from PrimeVue filters
    for (const filterField in filters) {
      const filterValue = filters[filterField].value
      if (filterValue) {
        // For each filter, apply a Firestore `where` clause (example: filter for names or emails)
        q = query(q, where(filterField, '>=', filterValue), where(filterField, '<=', filterValue))
      }
    }

    // Pagination logic
    q = query(q, limit(rows))

    // Execute the query
    const snapshot = await getDocs(q)

    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))

    return {
      data: users,
      total: snapshot.size // Total number of records (adjust if needed)
    }
  } catch (error) {
    console.error('Error fetching users:', error)
    throw error
  }
}

// Add or update a user in Firestore
export const saveUser = async (user) => {
  try {
    const userRef = doc(usersCollection, user.userId) // Reference to user document
    await setDoc(userRef, {
      email: user.email,
      userType: user.userType,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      isSubscribed: user.isSubscribed,
      location: user.location,
      about: user.about
    })
    console.log('User saved successfully')
  } catch (error) {
    console.error('Error saving user:', error)
  }
}

// Get a user from Firestore by userId
export const getUser = async (userId) => {
  try {
    const userRef = doc(usersCollection, userId)
    const userSnap = await getDoc(userRef)
    if (userSnap.exists()) {
      return userSnap.data() // Return the user data
    } else {
      console.log('No such user!')
      return null
    }
  } catch (error) {
    console.error('Error getting user:', error)
  }
}

// Update an existing user in Firestore (using a User object)
export const updateUser = async (user) => {
  try {
    const userRef = doc(usersCollection, user.userId)
    await updateDoc(userRef, {
      email: user.email,
      userType: user.userType,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber,
      isSubscribed: user.isSubscribed,
      location: user.location,
      about: user.about
    })
    console.log('User updated successfully')
  } catch (error) {
    console.error('Error updating user:', error)
  }
}

// Delete a user from Firestore
export const deleteUser = async (userId) => {
  try {
    const userRef = doc(usersCollection, userId)
    await deleteDoc(userRef)
    console.log('User deleted successfully')
  } catch (error) {
    console.error('Error deleting user:', error)
  }
}

export const deleteUserFromAuth = async (authUid) => {
  try {
    const auth = getAuth()
    const user = auth.currentUser

    // Check if the admin or correct user is deleting
    if (user && user.uid === authUid) {
      await deleteAuthUser(user)
      console.log(`User with auth UID ${authUid} deleted from Firebase Auth`)
    }
  } catch (error) {
    console.error('Error deleting user from Firebase Auth:', error)
    throw error
  }
}

export const getSpecialists = async (
  page = 0,
  rows = 10,
  sortField = '',
  sortOrder = 1,
  filters = {}
) => {
  try {
    let q = query(usersCollection, where('userType', '==', 'specialist')) // Filter by userType 'specialist'

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

    const specialists = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))

    return {
      data: specialists,
      total: snapshot.size // Total number of records (adjust if needed)
    }
  } catch (error) {
    console.error('Error fetching specialists:', error)
    throw error
  }
}
