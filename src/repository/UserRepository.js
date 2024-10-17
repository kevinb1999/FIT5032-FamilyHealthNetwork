import {
  getFirestore,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  deleteDoc,
  collection,
  query,
  limit,
  getDocs,
  where,
  orderBy
} from 'firebase/firestore'

const db = getFirestore()
const usersCollection = collection(db, 'users')

// Fetch users
export const getUsers = async () => {
  try {
    // Fetch all documents from UsersCollection
    const snapshot = await getDocs(usersCollection)

    const Users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))

    return {
      data: Users,
      total: snapshot.size // Total number of records
    }
  } catch (error) {
    console.error('Error fetching Users:', error)
    throw error
  }
}
// Fetch a user by ID
export const getUser = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)
    if (userSnap.exists()) {
      return userSnap.data()
    } else {
      console.log('No such user')
      return null
    }
  } catch (error) {
    console.error('Error getting user:', error)
    throw error
  }
}

// Function to get specialists
export const getSpecialists = async () => {
  try {
    const specialistsCollection = collection(db, 'users')

    const specialistsQuery = query(specialistsCollection, where('userType', '==', 'specialist'))

    const snapshot = await getDocs(specialistsQuery)

    const specialists = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))

    return {
      data: specialists,
      total: snapshot.size
    }
  } catch (error) {
    console.error('Error fetching specialists:', error)
    throw error
  }
}

// Save or update user
export const saveUser = async (user) => {
  try {
    const userRef = doc(usersCollection, user.id)
    await setDoc(userRef, user)
  } catch (error) {
    console.error('Error saving user:', error)
  }
}

// Update user
export const updateUser = async (user) => {
  try {
    const userRef = doc(usersCollection, user.id)
    await updateDoc(userRef, {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phoneNumber: user.phoneNumber
    })
    console.log('User updated successfully')
  } catch (error) {
    console.error('Error updating user:', error)
  }
}

// Delete user
export const deleteUser = async (userId) => {
  try {
    const userRef = doc(usersCollection, userId)
    await deleteDoc(userRef)
    console.log('User deleted successfully')
  } catch (error) {
    console.error('Error deleting user:', error)
  }
}
