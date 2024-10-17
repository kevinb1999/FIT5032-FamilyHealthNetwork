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

const eventsCollection = collection(db, 'events') // Collection for events

export const getEvents = async () => {
  try {
    // Fetch all documents from EventsCollection
    const snapshot = await getDocs(eventsCollection)

    const Events = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))

    return {
      data: Events,
      total: snapshot.size // Total number of records
    }
  } catch (error) {
    console.error('Error fetching Events:', error)
    throw error
  }
}

// Add or update an event in Firestore
export const saveEvent = async (event) => {
  try {
    const eventRef = doc(eventsCollection, event.id) // Reference to event document
    await setDoc(eventRef, {
      name: event.name,
      dateTime: event.dateTime,
      duration: event.duration,
      location: event.location,
      description: event.description
    })
    console.log('Event saved successfully')
  } catch (error) {
    console.error('Error saving event:', error)
  }
}

// Get an event from Firestore by event ID
export const getEvent = async (eventId) => {
  try {
    const eventRef = doc(eventsCollection, eventId)
    const eventSnap = await getDoc(eventRef)
    if (eventSnap.exists()) {
      return eventSnap.data() // Return the event data
    } else {
      console.log('No such event!')
      return null
    }
  } catch (error) {
    console.error('Error getting event:', error)
  }
}

// Delete an event from Firestore
export const deleteEvent = async (eventId) => {
  try {
    const eventRef = doc(eventsCollection, eventId)
    await deleteDoc(eventRef)
    console.log('Event deleted successfully')
  } catch (error) {
    console.error('Error deleting event:', error)
  }
}
